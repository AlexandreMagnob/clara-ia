#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sobe a base de contatos da FIPAN para o Kommo.

Funil de vendas (10516651) -> etapa "Novo parceiro adicionado" (80643271),
sem responsavel atribuido, com a tag FIPAN.
Cada linha vira: lead + contato (nome/telefone) + empresa (estabelecimento),
em uma unica chamada a POST /api/v4/leads/complex.

Uso:
    python scripts/kommo_subir_fipan.py --dry-run          # so mostra o payload
    python scripts/kommo_subir_fipan.py --limit 5          # sobe os 5 primeiros
    python scripts/kommo_subir_fipan.py                    # sobe o restante

O estado fica em scripts/_fipan_state.json: linha ja subida nao sobe de novo.
"""
import argparse
import csv
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(RAIZ, "assets", "planilhas", "Envio de Contatos - Página6.csv")
STATE_PATH = os.path.join(RAIZ, "scripts", "_fipan_state.json")
BASE = "https://marketingcardapiowebcom.kommo.com/api/v4"

PIPELINE_ID = 10516651          # Funil de vendas
STATUS_ID = 80643271            # Novo parceiro adicionado
CF_TELEFONE = 651580            # campo multitext "Telefone" do contato
ENUM_MOB = 540264               # opcao MOB
ENUM_WORK = 540260              # opcao WORK
# A etapa "Novo parceiro adicionado" tem uma automacao que carimba a tag
# `teste_webhook` em todo lead que entra, e `_embedded.tags_to_add` na criacao
# e ignorado em silencio. Por isso as tags certas sao gravadas num PATCH em
# lote DEPOIS que todos os leads existem (a gravacao substitui o conjunto todo).
TAG_PRINCIPAL_ID = 132393       # FIPAN
TAG_ALERTA_ID = 132395          # telefone-conferir

LOTE = 50                       # maximo aceito por /leads/complex
PAUSA = 1.0                     # segundos entre requisicoes (limite: 7 req/s)

# Kommo nao tem lead sem responsavel: omitindo o campo (ou mandando 0) o lead
# cai no dono do token. Definido por --responsavel.
RESPONSAVEL_ID = None

# Valores de "Estabelecimento" que nao sao nome de empresa.
PLACEHOLDERS = {
    "", "-", "--", "—", "–", "n/a", "na",
    "sem nome", "ainda sem nome", "sem nome informado", "sem nome definido",
    "sem nome definido (deseja iniciar o negócio)", "não tem nome ainda",
    "nao tem nome ainda", "não informado", "nao informado",
    "confeitaria (sem nome)", "padaria (sem nome)", "pessoa física (sem nome)",
    "pessoa fisica (sem nome)", "loja de conveniência (sem nome)",
    "loja de conveniencia (sem nome)", "deseja ter o estabelecimento",
    "deseja iniciar o negócio", "deseja iniciar o negocio",
}

# "Estabelecimento" que e so o segmento, nao o nome do negocio. Se virassem
# empresa, dezenas de leads ficariam pendurados numa unica "Confeitaria".
GENERICOS = {
    "confeitaria", "padaria", "pizzaria", "cafeteria", "hamburgueria", "doceria",
    "panificadora", "salgaderia", "mercado", "restaurante", "sorveteria",
    "pastelaria", "buffet", "marmitaria", "lanchonete", "chocolateria",
    "foodtruck", "tapiocaria", "churrascaria", "hotelaria", "doceira",
    "salgados", "confeitaria/padaria", "pizzaria/padaria", "restaurante japonês",
    "confeitaria/panificadora", "padaria (uruguai)",
}


def token():
    for linha in open(os.path.join(RAIZ, ".env"), encoding="utf-8"):
        if linha.startswith("KOMMO_LONG_DURATION_KEY="):
            return linha.split("=", 1)[1].strip().strip('"').strip("'")
    sys.exit("KOMMO_LONG_DURATION_KEY nao encontrado no .env")


def normalizar_telefones(bruto):
    """Devolve (lista de telefones, ok). ok=False quando algum numero e impossivel."""
    saida, ok = [], True
    for pedaco in re.split(r"[/;]", bruto or ""):
        d = re.sub(r"\D", "", pedaco)
        if not d:
            continue
        if d.startswith("55") and len(d) in (12, 13):
            saida.append(("+" + d, ENUM_MOB if len(d) == 13 else ENUM_WORK))
        elif len(d) == 11:
            saida.append(("+55" + d, ENUM_MOB))
        elif len(d) == 10:
            saida.append(("+55" + d, ENUM_WORK))
        else:
            saida.append((d, ENUM_MOB))   # sem DDD ou digitos demais: sobe cru
            ok = False
    if not saida:
        ok = False
    return saida, ok


def nome_empresa(bruto, generico_vira_empresa):
    v = (bruto or "").strip()
    chave = v.lower()
    if chave in PLACEHOLDERS:
        return None
    if chave in GENERICOS and not generico_vira_empresa:
        return None
    return v


def carregar_linhas(generico_vira_empresa):
    """Le o CSV, deduplica e devolve as linhas ja prontas para virar payload."""
    with open(CSV_PATH, encoding="utf-8") as f:
        cru = list(csv.DictReader(f))

    # Deduplica: mesmo telefone + mesmo nome = a mesma pessoa lancada duas vezes.
    # Mesmo telefone com nomes diferentes sao pessoas diferentes -> ambas sobem.
    vistos, linhas = {}, []
    for i, r in enumerate(cru, start=2):
        tel = re.sub(r"\D", "", r["Telefone"] or "")
        nome = (r["Nome da pessoa"] or "").strip()
        chave = (tel, nome.lower()) if tel else ("linha%d" % i, nome.lower())
        if chave in vistos:
            # fica a linha mais completa das duas
            anterior = vistos[chave]
            if len((r["Estabelecimento"] or "").strip()) > len(
                (linhas[anterior]["raw"]["Estabelecimento"] or "").strip()
            ):
                linhas[anterior]["raw"] = r
            continue
        vistos[chave] = len(linhas)
        linhas.append({"linha": i, "raw": r})

    prontas = []
    for item in linhas:
        r = item["raw"]
        nome = (r["Nome da pessoa"] or "").strip()
        empresa = nome_empresa(r["Estabelecimento"], generico_vira_empresa)
        telefones, tel_ok = normalizar_telefones(r["Telefone"])
        if not nome:
            nome = empresa or "Contato FIPAN (sem nome)"
        prontas.append({
            "linha": item["linha"],
            "nome": nome,
            "empresa": empresa,
            "telefones": telefones,
            "tel_ok": tel_ok,
        })
    return prontas


def montar_payload(item, indice):
    contato = {"name": item["nome"]}
    if item["telefones"]:
        contato["custom_fields_values"] = [{
            "field_id": CF_TELEFONE,
            "values": [{"value": t, "enum_id": e} for t, e in item["telefones"]],
        }]

    embedded = {"contacts": [contato]}
    if item["empresa"]:
        embedded["companies"] = [{"name": item["empresa"]}]

    lead = {
        "name": item["nome"],
        "pipeline_id": PIPELINE_ID,
        "status_id": STATUS_ID,
        "_embedded": embedded,
        "request_id": "fipan-l%d-%d" % (item["linha"], indice),
    }
    if RESPONSAVEL_ID is not None:
        lead["responsible_user_id"] = RESPONSAVEL_ID
    return lead


def gravar_tags(tok, estado):
    """Grava FIPAN (+ telefone-conferir) em tudo que ja subiu, apagando a tag
    `teste_webhook` que a automacao da etapa poe sozinha."""
    itens = list(estado.items())
    print("gravando tags em %d leads..." % len(itens))
    for inicio in range(0, len(itens), LOTE):
        bloco = itens[inicio: inicio + LOTE]
        payload = []
        for _, v in bloco:
            tags = [{"id": TAG_PRINCIPAL_ID}]
            if not v.get("tel_ok", True):
                tags.append({"id": TAG_ALERTA_ID})
            payload.append({"id": v["lead_id"], "_embedded": {"tags": tags}})
        chamar(tok, "/leads", "PATCH", payload)
        print("  tags ok: %d/%d" % (min(inicio + LOTE, len(itens)), len(itens)))
        if inicio + LOTE < len(itens):
            time.sleep(PAUSA)


def chamar(tok, rota, metodo, payload):
    corpo = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    for tentativa in range(5):
        req = urllib.request.Request(
            BASE + rota, data=corpo, method=metodo,
            headers={"Authorization": "Bearer " + tok,
                     "Content-Type": "application/json"},
        )
        try:
            with urllib.request.urlopen(req) as resp:
                if resp.status == 204:
                    return None
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            detalhe = e.read().decode("utf-8", "replace")
            if e.code in (429, 504) and tentativa < 4:
                espera = 5 * (tentativa + 1)
                print("   HTTP %d - aguardando %ds e tentando de novo" % (e.code, espera))
                time.sleep(espera)
                continue
            raise SystemExit("HTTP %d em %s %s:\n%s" % (e.code, metodo, rota, detalhe))
    raise SystemExit("falhou apos 5 tentativas")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=0, help="quantos leads subir (0 = todos os que faltam)")
    ap.add_argument("--dry-run", action="store_true", help="mostra o payload e nao envia nada")
    ap.add_argument("--generico-vira-empresa", action="store_true",
                    help='cria empresa tambem quando o estabelecimento e so o segmento ("Padaria")')
    ap.add_argument("--responsavel", type=int, default=None,
                    help="ID do usuario responsavel (omitido = cai no dono do token)")
    ap.add_argument("--so-tags", action="store_true",
                    help="nao cria nada; so regrava as tags no que ja subiu")
    args = ap.parse_args()

    global RESPONSAVEL_ID
    RESPONSAVEL_ID = args.responsavel

    estado = {}
    if os.path.exists(STATE_PATH):
        estado = json.load(open(STATE_PATH, encoding="utf-8"))

    if args.so_tags:
        gravar_tags(token(), estado)
        return

    linhas = carregar_linhas(args.generico_vira_empresa)
    pendentes = [x for x in linhas if str(x["linha"]) not in estado]

    print("CSV: %d linhas unicas | ja subidas: %d | pendentes: %d"
          % (len(linhas), len(estado), len(pendentes)))
    if args.limit:
        pendentes = pendentes[: args.limit]
        print("subindo apenas %d nesta rodada" % len(pendentes))
    if not pendentes:
        print("nada a fazer.")
        return

    if args.dry_run:
        for x in pendentes[:10]:
            print(json.dumps(montar_payload(x, 0), ensure_ascii=False, indent=2))
        print("\n(dry-run: nada foi enviado)")
        return

    tok = token()
    total = 0
    for inicio in range(0, len(pendentes), LOTE):
        bloco = pendentes[inicio: inicio + LOTE]
        payload = [montar_payload(x, i) for i, x in enumerate(bloco)]
        resp = chamar(tok, "/leads/complex", "POST", payload)
        for x, res in zip(bloco, resp):
            estado[str(x["linha"])] = {
                "lead_id": res["id"],
                "contact_id": res.get("contact_id"),
                "company_id": res.get("company_id"),
                "merged": res.get("merged"),
                "nome": x["nome"],
                "tel_ok": x["tel_ok"],
            }
            total += 1
        json.dump(estado, open(STATE_PATH, "w", encoding="utf-8"),
                  ensure_ascii=False, indent=1)
        print("  lote ok: +%d (acumulado %d)" % (len(bloco), total))
        if inicio + LOTE < len(pendentes):
            time.sleep(PAUSA)

    # As tags so entram agora: a automacao da etapa ja terminou de rodar.
    gravar_tags(tok, estado)
    print("\npronto: %d leads criados. Estado em %s" % (total, STATE_PATH))


if __name__ == "__main__":
    main()
