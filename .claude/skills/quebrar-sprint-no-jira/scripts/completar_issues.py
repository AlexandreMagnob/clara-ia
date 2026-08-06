# -*- coding: utf-8 -*-
"""Preenche descrição e prioridade das issues criadas pela automação.

A automação de quebra NÃO tem campo de descrição — o prompt dela só devolve
summary, tipo, responsável e story points. Rodar a automação e parar por aí
sempre deixa as issues vazias, e o D.O.D (que é o checklist real de entrega)
fica só na planilha, onde ninguém abre.

Usa a API v2 de propósito: ela aceita `description` como texto e converte pra
ADF sozinha. Na v3 seria preciso montar o ADF na mão.

Credencial: JIRA_EMAIL e JIRA_API_TOKEN do .env do projeto. Essa é a conta da
PESSOA — ao contrário do MCP do Jira, que costuma estar logado em outra conta
e faria as issues nascerem com o dono errado.

Entrada: JSON {"GWT-123": {"descricao": "...", "prioridade": "ALTA"}, ...}
`prioridade` é opcional.

Uso:
    python completar_issues.py descricoes.json
    python completar_issues.py descricoes.json --so-vazias
"""
import argparse
import base64
import io
import json
import os
import sys
import urllib.error
import urllib.request

BASE = os.environ.get("JIRA_BASE_URL", "https://cardapio-web.atlassian.net").rstrip("/")
PRIORIDADES = {
    "altissima": "Highest", "urgente": "Highest", "critica": "Highest",
    "alta": "High", "high": "High",
    "media": "Medium", "média": "Medium", "medium": "Medium", "normal": "Medium",
    "baixa": "Low", "low": "Low",
    "baixissima": "Lowest", "lowest": "Lowest",
}


def auth():
    email, token = os.environ.get("JIRA_EMAIL"), os.environ.get("JIRA_API_TOKEN")
    if not (email and token):
        raise SystemExit(
            "Faltam JIRA_EMAIL / JIRA_API_TOKEN no ambiente.\n"
            "No bash:  set -a && . ./.env && set +a"
        )
    return "Basic " + base64.b64encode(("%s:%s" % (email, token)).encode("utf-8")).decode("ascii")


def chama(metodo, caminho, corpo=None):
    dados = json.dumps(corpo).encode("utf-8") if corpo is not None else None
    req = urllib.request.Request(BASE + caminho, data=dados, method=metodo)
    req.add_header("Authorization", auth())
    req.add_header("Content-Type", "application/json")
    try:
        r = urllib.request.urlopen(req, timeout=45)
        bruto = r.read().decode("utf-8", "replace")
        return r.status, (json.loads(bruto) if bruto.strip() else None)
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "replace")[:300]


def normaliza_prio(v):
    if not v:
        return None
    return PRIORIDADES.get(str(v).strip().lower())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("arquivo", help="JSON {chave: {descricao, prioridade}}")
    ap.add_argument("--so-vazias", action="store_true",
                    help="pula issues que ja tem descricao (util pra reprocessar)")
    args = ap.parse_args()

    itens = json.load(io.open(args.arquivo, encoding="utf-8"))
    ok = falha = pulou = 0
    sem_prio = []

    for chave in sorted(itens, key=lambda k: (k.split("-")[0], int(k.split("-")[1]))):
        item = itens[chave]
        if isinstance(item, str):
            item = {"descricao": item}

        if args.so_vazias:
            st, atual = chama("GET", "/rest/api/2/issue/%s?fields=description" % chave)
            if st == 200 and (atual or {}).get("fields", {}).get("description"):
                print("[--] %s ja tem descricao, pulando" % chave)
                pulou += 1
                continue

        campos = {}
        if item.get("descricao"):
            campos["description"] = item["descricao"]
        prio = normaliza_prio(item.get("prioridade"))
        if prio:
            campos["priority"] = {"name": prio}
        elif item.get("prioridade"):
            sem_prio.append((chave, item["prioridade"]))
        if not campos:
            continue

        st, corpo = chama("PUT", "/rest/api/2/issue/%s" % chave, {"fields": campos})
        if st in (200, 204):
            print("[ok] %s%s" % (chave, " (prioridade %s)" % prio if prio else ""))
            ok += 1
        elif prio and "priority" in str(corpo):
            # alguns projetos não expõem o campo Priority na tela de edição
            campos.pop("priority", None)
            st2, corpo2 = chama("PUT", "/rest/api/2/issue/%s" % chave, {"fields": campos})
            if st2 in (200, 204):
                print("[ok] %s (sem prioridade — o projeto nao aceita esse campo)" % chave)
                ok += 1
            else:
                print("[X] %s -> %s %s" % (chave, st2, corpo2))
                falha += 1
        else:
            print("[X] %s -> %s %s" % (chave, st, corpo))
            falha += 1

    if sem_prio:
        print("\nPrioridade nao reconhecida (issue foi salva sem ela):")
        for chave, v in sem_prio:
            print("   %s -> %r" % (chave, v))

    print("\nOK: %d | falha: %d | pulou: %d | total: %d" % (ok, falha, pulou, len(itens)))
    if falha:
        sys.exit(1)


if __name__ == "__main__":
    main()
