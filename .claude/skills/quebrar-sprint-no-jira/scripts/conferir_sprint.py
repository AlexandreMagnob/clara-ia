# -*- coding: utf-8 -*-
"""Relatório do que a automação realmente criou no Jira.

Existe porque o webhook responde 200 antes de processar — o HTTP não prova
nada. E porque o MCP do Jira estoura o contexto em consulta de lote: ele
ignora o recorte de `fields` e devolve ~4 mil caracteres por issue. A REST
respeita `fields` e cabe folgado.

Confere, por História mãe: filhas vinculadas por "Work item split", soma de
horas, sprint, responsável e se a descrição ficou vazia. Também aponta filha
órfã (criada mas não vinculada), que é o sintoma de execução concorrente que
deu errado no meio.

Uso:
    python conferir_sprint.py --projeto GWT --desde 30m
    python conferir_sprint.py --chaves GWT-3256,GWT-3257
    python conferir_sprint.py --projeto GWT --sprint SM33
"""
import argparse
import base64
import json
import os
import sys
import urllib.parse
import urllib.request

BASE = os.environ.get("JIRA_BASE_URL", "https://cardapio-web.atlassian.net").rstrip("/")
LINK_SPLIT = "10006"  # tipo de vinculo "Work item split"
CAMPOS = "summary,issuetype,assignee,description,issuelinks,customfield_10016,customfield_10020"


def auth():
    email, token = os.environ.get("JIRA_EMAIL"), os.environ.get("JIRA_API_TOKEN")
    if not (email and token):
        raise SystemExit(
            "Faltam JIRA_EMAIL / JIRA_API_TOKEN no ambiente.\n"
            "No bash:  set -a && . ./.env && set +a"
        )
    return "Basic " + base64.b64encode(("%s:%s" % (email, token)).encode("utf-8")).decode("ascii")


def busca(jql):
    q = urllib.parse.urlencode({"jql": jql, "fields": CAMPOS, "maxResults": 100})
    req = urllib.request.Request(BASE + "/rest/api/3/search/jql?" + q)
    req.add_header("Authorization", auth())
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read().decode("utf-8")).get("issues", [])


def texto_adf(no):
    """A v3 devolve descrição em ADF; achatamos só pra saber se tem conteudo."""
    if not isinstance(no, dict):
        return ""
    s = no.get("text", "")
    for filho in no.get("content", []) or []:
        s += texto_adf(filho)
    return s


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--projeto", default="GWT")
    ap.add_argument("--desde", help="janela relativa, ex.: 30m, 2h")
    ap.add_argument("--sprint", help="codigo no summary, ex.: SM33")
    ap.add_argument("--chaves", help="lista separada por virgula")
    args = ap.parse_args()

    if args.chaves:
        jql = "key in (%s)" % args.chaves
    elif args.sprint:
        jql = 'project = %s AND summary ~ "%s" ORDER BY key ASC' % (args.projeto, args.sprint)
    elif args.desde:
        jql = "project = %s AND created >= -%s ORDER BY key ASC" % (args.projeto, args.desde)
    else:
        raise SystemExit("informe --desde, --sprint ou --chaves")

    issues = {i["key"]: i for i in busca(jql)}
    if not issues:
        print("Nenhuma issue encontrada para: %s" % jql)
        return

    def num(k):
        return int(k.split("-")[1])

    maes = [k for k, v in issues.items() if v["fields"]["issuetype"]["name"].lower().startswith("hist")]
    vinculadas = set()
    alertas = []
    total_geral = 0.0

    for m in sorted(maes, key=num):
        f = issues[m]["fields"]
        filhas = [
            l["outwardIssue"]["key"]
            for l in (f.get("issuelinks") or [])
            if l.get("type", {}).get("id") == LINK_SPLIT and "outwardIssue" in l
        ]
        vinculadas.update(filhas)
        soma = sum((issues[k]["fields"].get("customfield_10016") or 0) for k in filhas if k in issues)
        total_geral += soma
        spr = f.get("customfield_10020") or []
        print("%s | %s" % (m, f["summary"]))
        print("   sprint: %s | resp: %s" % (
            spr[0]["name"] if spr else "*** SEM SPRINT ***",
            (f.get("assignee") or {}).get("displayName", "*** SEM RESPONSAVEL ***"),
        ))
        if not texto_adf(f.get("description")).strip():
            print("   *** DESCRICAO VAZIA ***")
            alertas.append("%s sem descricao" % m)
        for k in sorted(filhas, key=num):
            ff = issues.get(k, {}).get("fields")
            if not ff:
                print("   -> %s (fora da consulta)" % k)
                continue
            vazia = "" if texto_adf(ff.get("description")).strip() else "  *** SEM DESCRICAO ***"
            print("   -> %s | %sh | %s%s" % (
                k, ff.get("customfield_10016"), ff["summary"][:64], vazia))
            if vazia:
                alertas.append("%s sem descricao" % k)
            if not (ff.get("customfield_10020") or []):
                alertas.append("%s sem sprint" % k)
        print("   TOTAL: %gh em %d filha(s)\n" % (soma, len(filhas)))

    orfas = [k for k in issues if k not in maes and k not in vinculadas]
    if orfas:
        print("*** FILHAS SEM MAE (%d): %s" % (len(orfas), ", ".join(sorted(orfas, key=num))))
        alertas.extend("%s orfa" % k for k in orfas)

    print("Historias: %d | issues: %d | soma de horas: %gh" % (len(maes), len(issues), total_geral))
    if alertas:
        print("\nPENDENCIAS (%d):" % len(alertas))
        for a in alertas:
            print("   -", a)
        sys.exit(1)
    print("\nSem pendencias.")


if __name__ == "__main__":
    main()
