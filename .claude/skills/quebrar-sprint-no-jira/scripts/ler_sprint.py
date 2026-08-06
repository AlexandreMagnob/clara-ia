# -*- coding: utf-8 -*-
"""Lê a planilha de planejamento de sprint e devolve as atividades em JSON.

A planilha é pública: dá pra ler sem o MCP do Google Drive. Baixamos o
workbook inteiro em xlsx porque é a única via que acerta a aba pelo NOME —
o endpoint `gviz/tq?sheet=` aceita qualquer nome e devolve a aba errada
calado, o que já produziu leitura de aba trocada.

Uso:
    python ler_sprint.py --listar-abas
    python ler_sprint.py --sprint 33 --time GROWTH
    python ler_sprint.py --sprint 33 --time GROWTH --pessoa Alexandre
"""
import argparse
import io
import json
import os
import re
import sys
import unicodedata
import urllib.request
import xml.etree.ElementTree as ET
import zipfile

PLANILHA_ID = os.environ.get(
    "SPRINT_PLANILHA_ID", "1HKfCNlFrLVhELTAPys8VQf3B-kr4yuLYl6X4IwIBj2o"
)
URL = "https://docs.google.com/spreadsheets/d/%s/export?format=xlsx" % PLANILHA_ID

NS = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
RNS = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"

# rótulos aceitos por campo — a planilha muda de layout entre times
COLUNAS = {
    "categoria": ["categoria", "tema da atividade", "tema"],
    "atividade": ["atividade"],
    "responsavel": ["responsavel"],
    "descricao": ["descricao"],
    "dod": ["d.o.d", "dod", "definition of done"],
    "prioridade": ["prioridade"],
    "prazo": ["prazo"],
}


def normaliza(s):
    s = unicodedata.normalize("NFKD", str(s or ""))
    s = "".join(c for c in s if not unicodedata.combining(c))
    return s.strip().lower()


def baixa(destino):
    req = urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=90) as r, open(destino, "wb") as f:
        f.write(r.read())


class Workbook(object):
    def __init__(self, caminho):
        self.z = zipfile.ZipFile(caminho)
        self.shared = []
        if "xl/sharedStrings.xml" in self.z.namelist():
            for si in ET.fromstring(self.z.read("xl/sharedStrings.xml")).findall(NS + "si"):
                self.shared.append("".join(t.text or "" for t in si.iter(NS + "t")))
        rels = {
            r.get("Id"): r.get("Target")
            for r in ET.fromstring(self.z.read("xl/_rels/workbook.xml.rels"))
        }
        self.abas = {}
        for s in ET.fromstring(self.z.read("xl/workbook.xml")).iter(NS + "sheet"):
            alvo = rels[s.get(RNS + "id")].lstrip("/")
            if not alvo.startswith("xl/"):
                alvo = "xl/" + alvo
            self.abas[s.get("name")] = alvo

    @staticmethod
    def _col(ref):
        n = 0
        for c in re.match(r"([A-Z]+)", ref).group(1):
            n = n * 26 + (ord(c) - 64)
        return n - 1

    def linhas(self, nome):
        root = ET.fromstring(self.z.read(self.abas[nome]))
        saida = []
        for row in root.iter(NS + "row"):
            cel = {}
            for c in row.findall(NS + "c"):
                v = c.find(NS + "v")
                inline = c.find(NS + "is")
                if inline is not None:
                    val = "".join(t.text or "" for t in inline.iter(NS + "t"))
                elif v is None:
                    continue
                elif c.get("t") == "s":
                    val = self.shared[int(v.text)]
                else:
                    val = v.text
                cel[self._col(c.get("r"))] = val
            saida.append([cel.get(i, "") for i in range(max(cel) + 1)] if cel else [])
        return saida


def acha_aba(wb, sprint, time):
    """A aba canônica é 'SM <n> <TIME>'. Existem cópias com outro nome e o
    mesmo conteúdo (ex.: 'Separação de SPs MKT - SM 33 GR') — a busca solta
    serve de rede pra elas, mas a preferência é sempre o nome canônico."""
    alvo = normaliza("SM %s %s" % (sprint, time))
    for nome in wb.abas:
        if normaliza(nome) == alvo:
            return nome
    padrao = re.compile(r"\bsm\s*%s\b" % re.escape(str(sprint)))
    t = normaliza(time)[:3]
    cand = [n for n in wb.abas if padrao.search(normaliza(n)) and t in normaliza(n)]
    return cand[0] if cand else None


def numero(v):
    try:
        f = float(str(v).replace(",", "."))
        return f if f else None
    except (TypeError, ValueError):
        return None


def le_aba(wb, aba):
    linhas = wb.linhas(aba)

    # cabeçalho = primeira linha que tem uma célula "Atividade"
    i_hdr = next(
        (i for i, l in enumerate(linhas) if any(normaliza(c) == "atividade" for c in l)),
        None,
    )
    if i_hdr is None:
        raise SystemExit("Nao achei a linha de cabecalho (celula 'Atividade') na aba %r" % aba)
    hdr = linhas[i_hdr]

    campos = {}
    for chave, rotulos in COLUNAS.items():
        for idx, cel in enumerate(hdr):
            if normaliza(cel) in rotulos:
                campos[chave] = idx
                break

    # pessoas: a linha do 'Capacity' marca onde começam as colunas por pessoa,
    # e os nomes ficam na linha imediatamente acima.
    i_cap = next(
        (i for i, l in enumerate(linhas[:i_hdr]) if any(normaliza(c) == "capacity" for c in l)),
        None,
    )
    if i_cap is None:
        raise SystemExit("Nao achei a linha de 'Capacity' na aba %r" % aba)
    c_cap = next(i for i, c in enumerate(linhas[i_cap]) if normaliza(c) == "capacity")
    nomes_row = linhas[i_cap - 1] if i_cap > 0 else []

    pessoas = {}
    for idx in range(c_cap + 1, len(nomes_row)):
        nome = str(nomes_row[idx]).strip()
        if nome and normaliza(nome) != "total":
            pessoas[nome] = idx

    capacity = {n: numero(linhas[i_cap][i]) for n, i in pessoas.items() if i < len(linhas[i_cap])}

    atividades = []
    for l in linhas[i_hdr + 1:]:
        def val(chave):
            i = campos.get(chave)
            return str(l[i]).strip() if i is not None and i < len(l) else ""

        nome_ativ = val("atividade")
        if not nome_ativ:
            continue
        horas = {}
        for pessoa, idx in pessoas.items():
            h = numero(l[idx]) if idx < len(l) else None
            if h:
                horas[pessoa] = h
        if not horas:
            continue
        atividades.append(
            {
                "categoria": val("categoria"),
                "atividade": nome_ativ,
                "responsavel": val("responsavel"),
                "descricao": val("descricao"),
                "dod": val("dod"),
                "prioridade": val("prioridade"),
                "prazo": val("prazo"),
                "horas": horas,
                "total": round(sum(horas.values()), 2),
            }
        )

    return {
        "aba": aba,
        "pessoas": sorted(pessoas),
        "capacity": capacity,
        "tem_descricao": "descricao" in campos,
        "tem_dod": "dod" in campos,
        "tem_prioridade": "prioridade" in campos,
        "atividades": atividades,
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--sprint")
    ap.add_argument("--time")
    ap.add_argument("--pessoa", help="filtra as atividades em que a pessoa tem horas")
    ap.add_argument("--listar-abas", action="store_true")
    ap.add_argument("--saida", help="grava o JSON num arquivo alem de imprimir")
    ap.add_argument("--xlsx", default="_sprint.xlsx")
    args = ap.parse_args()

    if not os.path.exists(args.xlsx) or os.path.getsize(args.xlsx) < 1000:
        baixa(args.xlsx)
    wb = Workbook(args.xlsx)

    if args.listar_abas:
        for n in wb.abas:
            print(n)
        return

    if not (args.sprint and args.time):
        raise SystemExit("informe --sprint e --time (ou use --listar-abas)")

    aba = acha_aba(wb, args.sprint, args.time)
    if not aba:
        print("Nao achei aba para sprint %s / time %s. Abas disponiveis:" % (args.sprint, args.time))
        for n in wb.abas:
            print("  -", n)
        raise SystemExit(2)

    dados = le_aba(wb, aba)

    if args.pessoa:
        alvo = normaliza(args.pessoa)
        casadas = [p for p in dados["pessoas"] if alvo in normaliza(p) or normaliza(p) in alvo]
        if not casadas:
            raise SystemExit(
                "Pessoa %r nao existe nessa aba. Colunas: %s" % (args.pessoa, dados["pessoas"])
            )
        col = casadas[0]
        dados["pessoa"] = col
        dados["atividades"] = [a for a in dados["atividades"] if col in a["horas"]]
        dados["total_pessoa"] = round(sum(a["horas"][col] for a in dados["atividades"]), 2)

    txt = json.dumps(dados, ensure_ascii=False, indent=2)
    if args.saida:
        io.open(args.saida, "w", encoding="utf-8").write(txt)
    if sys.stdout.encoding and sys.stdout.encoding.lower().startswith("utf"):
        print(txt)
    else:  # console do Windows em cp1252 mataria os acentos
        sys.stdout.buffer.write(txt.encode("utf-8"))


if __name__ == "__main__":
    main()
