# -*- coding: utf-8 -*-
"""Apaga as issues de teste — e SÓ as de teste.

Teste em Jira de produção suja o board de todo mundo, então a regra da casa é:
toda issue de teste nasce com [TESTE] no summary e some assim que a validação
termina. Este script existe pra essa limpeza não depender de ninguém lembrar
de conferir chave por chave.

A trava: ele se recusa a apagar qualquer issue cujo summary não contenha
[TESTE]. Se você passar uma chave real por engano, ele pula e avisa. Isso é
proposital — apagar issue é irreversível e a chave nunca é reaproveitada.

Apaga a mãe por último, porque deletar a História primeiro pode arrastar
vinculo e deixar filha pendurada.

Uso:
    python apagar_teste.py --projeto GWT --desde 2h          # lista, não apaga
    python apagar_teste.py --projeto GWT --desde 2h --apagar
    python apagar_teste.py --chaves GWT-3300,GWT-3301 --apagar

Nota: no projeto BRAND a conta não tem permissão de DELETE (403). GWT, CONT e
SCC têm. Em BRAND, marque as issues de teste como concluídas e avise a pessoa.
"""
import argparse
import base64
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request

BASE = os.environ.get("JIRA_BASE_URL", "https://cardapio-web.atlassian.net").rstrip("/")
MARCA = "[TESTE]"


def auth():
    email, token = os.environ.get("JIRA_EMAIL"), os.environ.get("JIRA_API_TOKEN")
    if not (email and token):
        raise SystemExit(
            "Faltam JIRA_EMAIL / JIRA_API_TOKEN no ambiente.\n"
            "No bash:  set -a && . ./.env && set +a"
        )
    return "Basic " + base64.b64encode(("%s:%s" % (email, token)).encode("utf-8")).decode("ascii")


def busca(jql):
    q = urllib.parse.urlencode({"jql": jql, "fields": "summary,issuetype", "maxResults": 100})
    req = urllib.request.Request(BASE + "/rest/api/3/search/jql?" + q)
    req.add_header("Authorization", auth())
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read().decode("utf-8")).get("issues", [])


def apaga(chave):
    req = urllib.request.Request(BASE + "/rest/api/3/issue/" + chave, method="DELETE")
    req.add_header("Authorization", auth())
    try:
        return urllib.request.urlopen(req, timeout=45).status, ""
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "replace")[:200]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--projeto", default="GWT")
    ap.add_argument("--desde", help="janela relativa, ex.: 2h")
    ap.add_argument("--chaves", help="lista separada por virgula")
    ap.add_argument("--apagar", action="store_true", help="sem isso, so lista")
    args = ap.parse_args()

    if args.chaves:
        jql = "key in (%s)" % args.chaves
    elif args.desde:
        jql = "project = %s AND created >= -%s ORDER BY key ASC" % (args.projeto, args.desde)
    else:
        raise SystemExit("informe --desde ou --chaves")

    issues = busca(jql)
    alvos, protegidas = [], []
    for i in issues:
        (alvos if MARCA in i["fields"]["summary"] else protegidas).append(i)

    if protegidas:
        print("PROTEGIDAS (sem %s no summary, nao serao tocadas): %d" % (MARCA, len(protegidas)))
        for i in protegidas:
            print("   -- %s | %s" % (i["key"], i["fields"]["summary"][:66]))
        print()

    if not alvos:
        print("Nenhuma issue de teste encontrada.")
        return

    print("ALVOS (%d):" % len(alvos))
    for i in alvos:
        print("   %s | %s | %s" % (i["key"], i["fields"]["issuetype"]["name"][:12], i["fields"]["summary"][:60]))

    if not args.apagar:
        print("\nModo lista. Rode de novo com --apagar pra remover de verdade.")
        return

    # filhas primeiro, mãe por último
    def peso(i):
        return (1 if i["fields"]["issuetype"]["name"].lower().startswith("hist") else 0,
                int(i["key"].split("-")[1]))

    print()
    ok = falha = 0
    for i in sorted(alvos, key=peso):
        st, corpo = apaga(i["key"])
        if st in (200, 204):
            print("[apagada] %s" % i["key"])
            ok += 1
        else:
            print("[X] %s -> %s %s" % (i["key"], st, corpo))
            falha += 1

    print("\nApagadas: %d | falhas: %d" % (ok, falha))
    if falha:
        sys.exit(1)


if __name__ == "__main__":
    main()
