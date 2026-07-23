# -*- coding: utf-8 -*-
"""Levanta o estado de um repositorio antes de reorganiza-lo.

Nao move, nao apaga, nao altera nada. So olha e reporta.

Uso:
    python inventario.py [caminho-do-repo] [-o relatorio.md]

Gera um relatorio em Markdown com: bagunca na raiz, mapa de pastas, arquivos
versionados vs soltos, possiveis segredos, duplicatas, nomes problematicos e
arquivos pesados.
"""
import argparse
import hashlib
import io
import os
import re
import subprocess
import sys
import unicodedata
from collections import defaultdict

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

IGNORAR_DIRS = {".git", "node_modules", "__pycache__", ".venv", "venv",
                ".next", "dist", "build", ".pytest_cache", ".mypy_cache"}

EXT_TEXTO = {".md", ".txt", ".json", ".yml", ".yaml", ".py", ".js", ".ts",
             ".sql", ".html", ".css", ".sh", ".ps1", ".ini", ".cfg", ".toml", ".env"}

# Nome que por si so ja denuncia um cofre de credencial. Curto de proposito:
# nome e indicio fraco, e alerta demais faz a pessoa ignorar todos.
NOME_FORTE = re.compile(
    r"(credenciais|credentials|\.env$|\.env\.|\.pem$|\.key$|\.pfx$|\.p12$|"
    r"id_rsa|\.htpasswd|secrets?\.|senhas\.)", re.I)

# Nome que so vira alerta se o conteudo confirmar. "como resetar senha.md" e um
# artigo de ajuda, nao um cofre; "conexao.js" e codigo de banco.
NOME_FRACO = re.compile(r"(senha|password|token|secret|acesso|conexao|conexão|"
                        r"credencial|apikey|api[-_]key)", re.I)

# Abaixo disso, arquivos identicos sao boilerplate (stub vazio, __init__.py,
# .gitkeep) e reportar como duplicata so atrapalha.
MIN_DUPLICATA = 200

# Valor que e referencia de codigo, nao o segredo em si:
# process.env.X, os.environ["X"], getenv(...), config.token, $VAR, {{ var }}
REFERENCIA_CODIGO = re.compile(
    r"(process\.env|os\.environ|getenv|ENV\[|import\.meta\.env|"
    r"^(config|settings|conf|opts|options|props|this|self)\.|"
    r"\(\s*\)|\(.*\)|"                       # chamada de funcao: getToken()
    r"^[A-Z][A-Z0-9_]{4,}$|\{\{|\}\}|<%|%>)", re.I)

PALAVRA_CHAVE = re.compile(
    r"(senha|password|passwd|secret|token|api[-_ ]?key|authorization|"
    r"client[-_ ]?secret|private[-_ ]?key|credencial|acesso)", re.I)

# Forma direta: chave seguida do valor na mesma linha (senha: xyz / senha | xyz)
PAR_CHAVE_VALOR = re.compile(
    r"(senha|password|passwd|secret|token|api[-_ ]?key|authorization|"
    r"client[-_ ]?secret|private[-_ ]?key)"
    r"\s*[:=|]\s*[\"']?([^\s\"'|<>{}\[\],]{8,})", re.I)

# Valores obviamente falsos que nao devem virar alerta
PLACEHOLDER = re.compile(
    r"^(x{3,}|\*{3,}|\.{3,}|<.*>|\{\{.*\}\}|\$\{.*\}|seu[-_].*|your[-_].*|"
    r"exemplo|example|changeme|placeholder|todo|null|none|true|false)$", re.I)

# Arquivo-modelo existe justamente pra ser versionado — nao e vazamento
MODELO = re.compile(r"(\.example$|\.sample$|\.template$|\.dist$|"
                    r"[-_.](example|sample|template|modelo)\.[a-z0-9]+$)", re.I)

# Nomes em maiuscula que sao convencao universal, nao inconsistencia
NOME_CONVENCIONAL = {"README", "LICENSE", "LICENCE", "CHANGELOG", "CONTRIBUTING",
                     "NOTICE", "AUTHORS", "CODEOWNERS", "SECURITY", "MAKEFILE",
                     "DOCKERFILE", "CLAUDE", "AGENTS", "MEMORY", "TODO"}


def humano(n):
    for unidade in ["B", "KB", "MB", "GB"]:
        if n < 1024:
            return "%.0f%s" % (n, unidade) if unidade == "B" else "%.1f%s" % (n, unidade)
        n /= 1024.0
    return "%.1fTB" % n


def problemas_no_nome(nome):
    """Coisas que atrapalham no terminal, em URL e em script."""
    raiz_nome = os.path.splitext(nome)[0]
    if raiz_nome.upper() in NOME_CONVENCIONAL:
        return []          # README.md, LICENSE, CLAUDE.md: convencao, nao bagunca
    p = []
    if " " in nome:
        p.append("espaco")
    if any(unicodedata.category(c) == "Mn" or ord(c) > 127 for c in unicodedata.normalize("NFD", nome)):
        p.append("acento")
    if re.search(r"[\[\]()#%&{}$!'\"@+`|=]", nome):
        p.append("caractere especial")
    if nome != nome.lower():
        p.append("maiuscula")
    return p


def data_de(caminho):
    try:
        import datetime
        return datetime.date.fromtimestamp(os.path.getmtime(caminho)).isoformat()
    except Exception:
        return "?"


def listar_arquivos(raiz):
    for dirpath, dirnames, filenames in os.walk(raiz):
        dirnames[:] = [d for d in dirnames if d not in IGNORAR_DIRS]
        for f in filenames:
            caminho = os.path.join(dirpath, f)
            rel = os.path.relpath(caminho, raiz).replace("\\", "/")
            yield rel, caminho


def versionados(raiz):
    try:
        r = subprocess.run(["git", "ls-files", "-z"], cwd=raiz,
                           capture_output=True, timeout=60)
        if r.returncode != 0:
            return None
        return {p.replace("\\", "/") for p in r.stdout.decode("utf-8", "replace").split("\0") if p}
    except Exception:
        return None


def bloqueado_pelo_gitignore(raiz, caminhos):
    """Quais desses caminhos o .gitignore ja protege."""
    if not caminhos:
        return set()
    try:
        entrada = "\n".join(caminhos)
        r = subprocess.run(["git", "check-ignore", "--stdin"], cwd=raiz,
                           input=entrada.encode("utf-8"), capture_output=True, timeout=60)
        return {l.strip().replace("\\", "/")
                for l in r.stdout.decode("utf-8", "replace").splitlines() if l.strip()}
    except Exception:
        return set()


def parece_segredo(valor):
    """Cadeia curta e bagunçada o bastante pra ser senha ou token gerado.

    Senha de verdade mistura tipos de caractere. Palavra comum, caminho, URL e
    frase nao misturam — e sao o grosso do que aparece perto da palavra 'senha'.
    """
    if not (8 <= len(valor) <= 100) or PLACEHOLDER.match(valor):
        return False
    if valor.startswith(("http", "/", "./", "~", "$")) or valor.endswith((".md", ".js", ".py")):
        return False
    # Ler credencial de variavel de ambiente ou de config e o padrao CORRETO —
    # acusar isso ensina a pessoa a ignorar o alerta justo em quem fez certo.
    if REFERENCIA_CODIGO.search(valor):
        return False
    tipos = sum([
        bool(re.search(r"[a-z]", valor)),
        bool(re.search(r"[A-Z]", valor)),
        bool(re.search(r"\d", valor)),
        bool(re.search(r"[^A-Za-z0-9]", valor)),
    ])
    if tipos >= 3:
        return True
    # so letras+numeros: exige ser comprido e nao parecer palavra (poucas vogais)
    if tipos == 2 and len(valor) >= 16:
        vogais = len(re.findall(r"[aeiouAEIOU]", valor))
        return vogais / float(len(valor)) < 0.30
    return False


def cheirou_segredo(caminho):
    """Procura credencial no conteudo, de duas formas.

    A forma direta (`senha: xyz`) e facil. A dificil e a tabela markdown, onde
    'Senha' e cabecalho de coluna e o valor esta linhas abaixo, longe da
    palavra-chave — foi assim que um arquivo com senha de producao passou batido
    numa versao anterior deste script.
    """
    try:
        with io.open(caminho, encoding="utf-8", errors="ignore") as fh:
            trecho = fh.read(20000)
    except Exception:
        return None

    for m in PAR_CHAVE_VALOR.finditer(trecho):
        if parece_segredo(m.group(2)):
            return "linha %d, apos '%s'" % (trecho[:m.start()].count("\n") + 1,
                                            m.group(1).lower())

    # Tabela markdown com coluna "Senha"/"Token": o valor fica linhas abaixo, longe
    # da palavra-chave, entao a busca por adjacencia nao alcanca.
    # Deliberadamente restrito a tabela: procurar palavra-chave "por perto" em texto
    # corrido acusa toda documentacao de API que cita 'authorization' ao lado de um
    # hash de exemplo — ruido que faz a pessoa parar de ler os alertas.
    linhas = trecho.splitlines()
    for i, linha in enumerate(linhas):
        if linha.count("|") < 2:
            continue
        celulas = [c.strip().lower() for c in linha.strip().strip("|").split("|")]
        col = [n for n, c in enumerate(celulas)
               if PALAVRA_CHAVE.match(c) and len(c) <= 20]
        if not col:
            continue
        for j in range(i + 1, min(i + 30, len(linhas))):
            if linhas[j].count("|") < 2:
                break
            vals = [c.strip() for c in linhas[j].strip().strip("|").split("|")]
            for n in col:
                if n < len(vals) and parece_segredo(vals[n]):
                    return "linha %d, coluna '%s' de tabela" % (j + 1, celulas[n])
    return None


def analisar(raiz):
    dados = {"raiz": raiz}
    arquivos = list(listar_arquivos(raiz))
    dados["total"] = len(arquivos)

    trackeados = versionados(raiz)
    dados["eh_git"] = trackeados is not None
    dados["trackeados"] = trackeados or set()

    # ---- mapa de pastas
    por_pasta = defaultdict(lambda: {"n": 0, "bytes": 0})
    soltos_raiz = []
    tamanhos = []
    nomes_ruins = []
    sem_extensao = []
    suspeitos = []
    por_hash = defaultdict(list)

    for rel, caminho in arquivos:
        try:
            tam = os.path.getsize(caminho)
        except OSError:
            tam = 0
        pasta = rel.rsplit("/", 1)[0] if "/" in rel else "(raiz)"
        por_pasta[pasta]["n"] += 1
        por_pasta[pasta]["bytes"] += tam
        tamanhos.append((tam, rel))

        nome = rel.rsplit("/", 1)[-1]
        if "/" not in rel:
            soltos_raiz.append(rel)
        probs = problemas_no_nome(nome)
        if probs:
            nomes_ruins.append((rel, probs))
        if "." not in nome and not nome.startswith("."):
            sem_extensao.append(rel)

        # segredos — arquivo-modelo (.example, .sample) nao conta
        motivo = None
        if not MODELO.search(nome):
            ext = os.path.splitext(nome)[1].lower()
            achado = None
            if (ext in EXT_TEXTO or not ext) and tam < 2_000_000:
                achado = cheirou_segredo(caminho)
            if achado:
                motivo = "**conteudo** — %s" % achado
            elif NOME_FORTE.search(nome):
                motivo = "nome de cofre de credencial (conteudo nao confirmou)"
            # NOME_FRACO ("senha", "acesso" no nome) deliberadamente NAO gera
            # alerta: "como-resetar-senha.md" e artigo de ajuda, nao credencial.
        if motivo:
            suspeitos.append((rel, motivo))

        # duplicatas: so hasheia o que tem tamanho repetido, por performance
        if MIN_DUPLICATA <= tam < 50_000_000:
            por_hash[tam].append((rel, caminho))

    # ---- duplicatas de conteudo
    duplicatas = []
    for tam, lista in por_hash.items():
        if len(lista) < 2:
            continue
        h = defaultdict(list)
        for rel, caminho in lista:
            try:
                with open(caminho, "rb") as fh:
                    h[hashlib.md5(fh.read()).hexdigest()].append(rel)
            except Exception:
                pass
        for digest, rels in h.items():
            if len(rels) > 1:
                duplicatas.append((tam, sorted(rels)))

    # ---- nomes iguais em pastas diferentes (pode ser variante, nao duplicata)
    por_nome = defaultdict(list)
    for rel, _ in arquivos:
        por_nome[rel.rsplit("/", 1)[-1].lower()].append(rel)
    homonimos = {n: v for n, v in por_nome.items() if len(v) > 1}
    ja_dup = {r for _, rels in duplicatas for r in rels}
    homonimos = {n: v for n, v in homonimos.items() if not set(v) <= ja_dup}

    # ---- segredos: quais ja estao protegidos
    caminhos_suspeitos = [s[0] for s in suspeitos]
    protegidos = bloqueado_pelo_gitignore(raiz, caminhos_suspeitos) if dados["eh_git"] else set()

    dados.update({
        "datas": {rel: data_de(caminho) for rel, caminho in arquivos},
        "nao_versionados": sorted({rel for rel, _ in arquivos} - (trackeados or set()))
                           if trackeados is not None else [],
        "por_pasta": dict(por_pasta),
        "soltos_raiz": sorted(soltos_raiz),
        "pesados": [(t, r) for t, r in sorted(tamanhos, reverse=True)[:15] if t > 500_000],
        "nomes_ruins": nomes_ruins,
        "sem_extensao": sem_extensao,
        "suspeitos": suspeitos,
        "protegidos": protegidos,
        "duplicatas": sorted(duplicatas, reverse=True),
        "homonimos": homonimos,
        "peso_total": sum(t for t, _ in tamanhos),
    })
    return dados


def montar_relatorio(d):
    L = []
    add = L.append
    add("# Inventario do repositorio\n")
    add("`%s`\n" % d["raiz"])
    add("- **%d arquivos**, %s no total" % (d["total"], humano(d["peso_total"])))
    if d["eh_git"]:
        add("- Repositorio git: **%d versionados**, **%d fora do controle de versao**"
            % (len(d["trackeados"]), len(d["nao_versionados"])))
    else:
        add("- **Nao e um repositorio git** (sem rede de seguranca: faca backup antes de mover)")
    add("- **%d arquivos soltos na raiz**" % len(d["soltos_raiz"]))
    add("")

    # --- ALERTAS PRIMEIRO
    if d["suspeitos"]:
        add("## Possiveis credenciais\n")
        add("Confira um por um. Se for segredo de verdade: **nao versione** e nao cole o")
        add("conteudo em lugar nenhum.\n")
        add("| Arquivo | Por que suspeitou | Ja protegido? |")
        add("|---|---|---|")
        for rel, motivo in sorted(d["suspeitos"]):
            prot = "sim" if rel in d["protegidos"] else "**NAO**"
            add("| `%s` | %s | %s |" % (rel, motivo, prot))
        add("")

    if d["duplicatas"]:
        add("## Arquivos identicos (mesmo conteudo)\n")
        add("Pode apagar um dos lados — mas confirme antes qual caminho os outros arquivos")
        add("referenciam.\n")
        for tam, rels in d["duplicatas"][:20]:
            add("- %s: %s" % (humano(tam),
                              " · ".join("`%s` (%s)" % (r, d["datas"].get(r, "?")) for r in rels)))
        add("")

    if d["homonimos"]:
        add("## Mesmo nome, conteudo diferente\n")
        add("Sao versoes ou variantes — **nao** duplicatas. A data ajuda, mas nao decide")
        add("sozinha: o arquivo na pasta de nome mais 'antigo' pode ser o mais novo. Abra e")
        add("compare antes de arquivar qualquer um.\n")
        for nome, rels in sorted(d["homonimos"].items())[:20]:
            add("- `%s`: %s" % (nome,
                                " · ".join("`%s` (%s)" % (r, d["datas"].get(r, "?")) for r in rels)))
        add("")

    if d["eh_git"] and d["nao_versionados"]:
        add("## Fora do controle de versao\n")
        add("Nao estao no git: se sumirem, nao ha como recuperar. Decida se entram ou se")
        add("vao pro `.gitignore` de proposito.\n")
        for r in d["nao_versionados"][:40]:
            add("- `%s`" % r)
        if len(d["nao_versionados"]) > 40:
            add("- ... e mais %d" % (len(d["nao_versionados"]) - 40))
        add("")

    # --- MAPA
    add("## Mapa de pastas\n")
    add("| Pasta | Arquivos | Peso |")
    add("|---|---:|---:|")
    for pasta, info in sorted(d["por_pasta"].items(), key=lambda x: -x[1]["n"]):
        add("| `%s` | %d | %s |" % (pasta, info["n"], humano(info["bytes"])))
    add("")

    if d["soltos_raiz"]:
        add("## Soltos na raiz\n")
        for r in d["soltos_raiz"]:
            add("- `%s`" % r)
        add("")

    if d["pesados"]:
        add("## Arquivos mais pesados\n")
        add("Vale perguntar se continuam versionados: midia e dump inflam o repositorio")
        add("pra sempre, porque o git guarda toda versao de cada um.\n")
        for tam, rel in d["pesados"]:
            add("- %s — `%s`" % (humano(tam), rel))
        add("")

    if d["nomes_ruins"]:
        add("## Nomes que atrapalham\n")
        add("Espaco, acento e caractere especial quebram comando de terminal, link e script.\n")
        for rel, probs in sorted(d["nomes_ruins"])[:60]:
            add("- `%s` — %s" % (rel, ", ".join(probs)))
        if len(d["nomes_ruins"]) > 60:
            add("- ... e mais %d" % (len(d["nomes_ruins"]) - 60))
        add("")

    if d["sem_extensao"]:
        add("## Sem extensao\n")
        add("Abra e descubra o que sao antes de mover.\n")
        for rel in d["sem_extensao"][:30]:
            add("- `%s`" % rel)
        add("")

    return "\n".join(L)


def main():
    ap = argparse.ArgumentParser(description="Inventario de um repositorio, sem alterar nada.")
    ap.add_argument("repo", nargs="?", default=".", help="caminho do repositorio")
    ap.add_argument("-o", "--saida", help="arquivo .md de saida")
    args = ap.parse_args()

    raiz = os.path.abspath(args.repo)
    if not os.path.isdir(raiz):
        print("Nao encontrei a pasta: %s" % raiz)
        return 1

    d = analisar(raiz)
    rel = montar_relatorio(d)

    if args.saida:
        io.open(args.saida, "w", encoding="utf-8", newline="\n").write(rel)
        print("Relatorio salvo em: %s" % args.saida)
        print("\n--- resumo ---")
        print("%d arquivos | %d soltos na raiz | %d suspeitos de credencial | %d duplicatas"
              % (d["total"], len(d["soltos_raiz"]), len(d["suspeitos"]), len(d["duplicatas"])))
    else:
        print(rel)
    return 0


if __name__ == "__main__":
    sys.exit(main())
