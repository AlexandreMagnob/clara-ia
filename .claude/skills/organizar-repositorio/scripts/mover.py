# -*- coding: utf-8 -*-
"""Executa um plano de reorganizacao com rede de seguranca.

O plano e um arquivo de texto, um movimento por linha:

    origem/antiga.md	destino/nova.md

Separador: TAB (ou " -> " se preferir escrever a mao). Linha que comeca com #
e comentario, linha vazia e ignorada.

Uso:
    python mover.py plano.tsv --repo .  --conferir   # valida, nao move nada
    python mover.py plano.tsv --repo .               # executa
    python mover.py desfazer.tsv --repo .            # desfaz (o reverso e gerado sozinho)

Garantias:
- Nunca sobrescreve arquivo existente. Se o destino ja existe, aborta tudo antes
  de mover o primeiro arquivo.
- Usa `git mv` no que e versionado, para o git registrar como renomeacao e o
  historico do arquivo nao se perder.
- Grava um plano reverso (`desfazer.tsv`) para voltar atras sem depender do git.
"""
import argparse
import io
import os
import shutil
import subprocess
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")


def ler_texto(caminho):
    """Le o plano tolerando o encoding errado.

    No Windows, script e editor gravam em cp1252 por descuido, e ai todo caminho
    com acento vira byte invalido. Falhar aqui por causa disso seria bobo.
    """
    bruto = open(caminho, "rb").read()
    for enc in ("utf-8-sig", "utf-8", "cp1252", "latin-1"):
        try:
            texto = bruto.decode(enc)
            if enc not in ("utf-8-sig", "utf-8"):
                print("Aviso: o plano nao esta em UTF-8 (li como %s). Se algum caminho com" % enc)
                print("       acento falhar, regrave o arquivo em UTF-8.")
            return texto
        except UnicodeDecodeError:
            continue
    raise ValueError("nao consegui ler o plano em nenhum encoding conhecido")


def ler_plano(caminho):
    movimentos = []
    for n, linha in enumerate(ler_texto(caminho).splitlines(), 1):
        linha = linha.rstrip("\r")
        if not linha.strip() or linha.lstrip().startswith("#"):
            continue
        if "\t" in linha:
            partes = linha.split("\t")
        elif " -> " in linha:
            partes = linha.split(" -> ")
        else:
            raise ValueError(
                "Linha %d nao tem separador (use TAB ou ' -> '):\n  %s" % (n, linha))
        partes = [p.strip().strip('"') for p in partes if p.strip()]
        if len(partes) != 2:
            raise ValueError("Linha %d nao tem exatamente origem e destino:\n  %s" % (n, linha))
        movimentos.append((partes[0].replace("\\", "/"), partes[1].replace("\\", "/")))
    return movimentos


def versionados(repo):
    try:
        r = subprocess.run(["git", "ls-files", "-z"], cwd=repo,
                           capture_output=True, timeout=60)
        if r.returncode != 0:
            return None
        return {p.replace("\\", "/") for p in r.stdout.decode("utf-8", "replace").split("\0") if p}
    except Exception:
        return None


def validar(repo, movimentos):
    """Junta TODOS os problemas antes de mover qualquer coisa."""
    erros, avisos = [], []
    destinos = {}

    for origem, destino in movimentos:
        abs_o = os.path.join(repo, origem)
        abs_d = os.path.join(repo, destino)

        if not os.path.exists(abs_o):
            erros.append("origem nao existe: %s" % origem)
            continue
        if os.path.isdir(abs_o):
            erros.append("origem e uma pasta, nao um arquivo: %s "
                         "(liste os arquivos dela um a um)" % origem)
            continue
        if origem == destino:
            avisos.append("origem igual ao destino, sera pulado: %s" % origem)
            continue

        # dois arquivos indo pro mesmo lugar = perda silenciosa de um deles
        if destino in destinos:
            erros.append("dois arquivos disputam o mesmo destino %s:\n"
                         "      %s\n      %s" % (destino, destinos[destino], origem))
        destinos[destino] = origem

        if os.path.exists(abs_d):
            erros.append("destino ja existe, seria sobrescrito: %s" % destino)

        if os.path.abspath(abs_d).startswith(os.path.abspath(os.path.join(repo, ".git")) + os.sep):
            erros.append("destino dentro de .git: %s" % destino)

    return erros, avisos


def executar(repo, movimentos, trackeados, seco=False):
    feitos, falhas = [], []
    for origem, destino in movimentos:
        if origem == destino:
            continue
        abs_o = os.path.join(repo, origem)
        abs_d = os.path.join(repo, destino)
        if not os.path.exists(abs_o):
            continue
        if seco:
            feitos.append((origem, destino))
            continue

        pasta = os.path.dirname(abs_d)
        if pasta:
            os.makedirs(pasta, exist_ok=True)

        ok = False
        if trackeados and origem in trackeados:
            r = subprocess.run(["git", "mv", origem, destino], cwd=repo, capture_output=True)
            ok = r.returncode == 0
            if not ok:
                # git recusou (ex: indice sujo) — move no disco, o git detecta depois
                try:
                    shutil.move(abs_o, abs_d)
                    ok = True
                except Exception as e:
                    falhas.append((origem, destino, str(e)))
        else:
            try:
                shutil.move(abs_o, abs_d)
                ok = True
            except Exception as e:
                falhas.append((origem, destino, str(e)))
        if ok:
            feitos.append((origem, destino))
    return feitos, falhas


def limpar_pastas_vazias(repo):
    """Remove pastas que ficaram vazias. De baixo pra cima, sem tocar em .git."""
    removidas = []
    for dirpath, dirnames, filenames in os.walk(repo, topdown=False):
        partes = os.path.relpath(dirpath, repo).split(os.sep)
        if partes[0] in (".git", "node_modules", ".") or dirpath == repo:
            continue
        try:
            if not os.listdir(dirpath):
                os.rmdir(dirpath)
                removidas.append(os.path.relpath(dirpath, repo).replace("\\", "/"))
        except OSError:
            pass
    return removidas


def main():
    ap = argparse.ArgumentParser(description="Executa um plano de reorganizacao.")
    ap.add_argument("plano", help="arquivo do plano (origem<TAB>destino por linha)")
    ap.add_argument("--repo", default=".", help="raiz do repositorio")
    ap.add_argument("--conferir", action="store_true",
                    help="so valida e mostra o que faria, sem mover nada")
    ap.add_argument("--manter-vazias", action="store_true",
                    help="nao remover as pastas que ficarem vazias")
    args = ap.parse_args()

    repo = os.path.abspath(args.repo)
    try:
        movimentos = ler_plano(args.plano)
    except ValueError as e:
        print("Plano invalido.\n%s" % e)
        return 1

    if not movimentos:
        print("O plano esta vazio.")
        return 1

    print("Plano: %d movimentos" % len(movimentos))
    erros, avisos = validar(repo, movimentos)

    for a in avisos:
        print("  aviso: %s" % a)
    if erros:
        print("\n%d problema(s) — nada foi movido:\n" % len(erros))
        for e in erros:
            print("  - %s" % e)
        print("\nCorrija o plano e rode de novo.")
        return 1
    print("Validacao ok: nenhuma origem faltando, nenhum destino sobrescrito.")

    if args.conferir:
        print("\n--- modo conferencia, nada foi movido ---")
        for o, d in movimentos[:40]:
            print("  %s  ->  %s" % (o, d))
        if len(movimentos) > 40:
            print("  ... e mais %d" % (len(movimentos) - 40))
        return 0

    trackeados = versionados(repo)
    if trackeados is None:
        print("Aviso: nao e um repositorio git. Sem historico pra voltar atras —")
        print("       o arquivo desfazer.tsv sera sua unica forma de reverter.")

    feitos, falhas = executar(repo, movimentos, trackeados)

    # plano reverso, pra desfazer sem depender do git
    if feitos:
        reverso = os.path.join(repo, "desfazer.tsv")
        with io.open(reverso, "w", encoding="utf-8", newline="\n") as fh:
            fh.write("# Desfaz a reorganizacao. Use: python mover.py desfazer.tsv --repo .\n")
            for o, d in reversed(feitos):
                fh.write("%s\t%s\n" % (d, o))

    removidas = []
    if not args.manter_vazias:
        removidas = limpar_pastas_vazias(repo)

    print("\nMovidos: %d" % len(feitos))
    if removidas:
        print("Pastas vazias removidas: %d" % len(removidas))
    if falhas:
        print("\nFALHAS: %d" % len(falhas))
        for o, d, e in falhas:
            print("  - %s -> %s : %s" % (o, d, e))
    if feitos:
        print("\nPara desfazer:  python mover.py desfazer.tsv --repo .")
        if trackeados is not None:
            print("Confira agora:  git status --short   (o esperado e ver R de renomeado,")
            print("                                     nao D de deletado)")
    return 1 if falhas else 0


if __name__ == "__main__":
    sys.exit(main())
