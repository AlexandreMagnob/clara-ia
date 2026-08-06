# -*- coding: utf-8 -*-
"""Dispara a automação n8n de quebra de atividades, uma atividade por chamada.

O gatilho da automação é um webhook aberto — não precisa do conector do Slack.
Ele responde 200 ANTES de processar, então o código de retorno não prova nada:
a prova é conferir no Jira depois (use conferir_sprint.py).

Vai com `silencioso: true` no corpo. Quem chama pelo Slack recebe o "Sua atividade
foi quebrada com sucesso!" no canal; a skill não — ninguém pediu aviso de um
trabalho que a pessoa está acompanhando aqui na conversa. Quem lê o flag é o nó
"Avisar no Slack?" de cada branch do workflow.

Entrada: um arquivo .txt por atividade, no formato que a IA da automação lê.
Vários arquivos = várias atividades, disparadas com intervalo (as execuções
rodam concorrentes no n8n e intercalam a numeração das issues; isso é normal
e não embaralha os vínculos, mas o intervalo reduz a chance de rate limit).

Uso:
    python criar_no_jira.py msg_01.txt msg_02.txt
    python criar_no_jira.py --intervalo 8 msgs/*.txt
    python criar_no_jira.py --simular msg_01.txt      # só valida, não envia
    python criar_no_jira.py --avisar msg_01.txt       # deixa avisar no Slack
"""
import argparse
import io
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request

WEBHOOK = os.environ.get(
    "QUEBRA_WEBHOOK", "https://n8n.cardapioweb.com/webhook/quebra_de_atividades"
)
TIMES = ("growth", "content", "studios", "cw studios", "branding", "brand")


def valida(texto, arquivo):
    """As validações que a IA da automação faz. Pegar aqui é mais barato do que
    descobrir pelo erro no Slack depois de já ter criado meia sprint torta."""
    linhas = [l for l in texto.strip().splitlines() if l.strip()]
    erros = []
    if not linhas:
        return ["arquivo vazio"]
    if linhas[0].strip().lower() not in TIMES:
        erros.append("linha 1 tem que ser o time (%s), veio %r" % ("/".join(TIMES), linhas[0][:40]))
    if len(linhas) < 2:
        erros.append("nenhuma atividade depois do time")
    for i, l in enumerate(linhas[1:], start=2):
        if not re.search(r"\[[A-Za-z]+\d+\]", l):
            erros.append("linha %d sem codigo de sprint tipo [SM33]: %r" % (i, l[:50]))
        if not re.search(r"\([^)0-9][^)]*\)", l):
            erros.append("linha %d sem responsavel entre parenteses: %r" % (i, l[:50]))
    # Quem leva horas depende do formato. Com uma atividade só (Formato 1) a
    # própria linha leva; com quebra, a linha 2 é a História mãe (sem horas) e
    # da 3 em diante são filhas (com horas).
    HORAS = r"\(\s*\d+(?:[.,]\d+)?\s*\)\s*$"
    formato1 = len(linhas) == 2
    for i, l in enumerate(linhas[1:], start=2):
        tem_horas = bool(re.search(HORAS, l))
        deve_ter = formato1 or i >= 3
        if deve_ter and not tem_horas:
            erros.append("linha %d e filha e precisa terminar com (horas): %r" % (i, l[:50]))
        if not deve_ter and tem_horas:
            erros.append("linha 2 e a Historia mae e nao pode levar story points")

        # Descasca só o que aquela linha realmente tem no fim — descascar dois
        # grupos sempre faria o parêntese do NOME sumir na linha da mãe, que é
        # justamente o erro que esta checagem existe pra pegar.
        resto = re.sub(HORAS, "", l) if tem_horas else l
        resto = re.sub(r"\([^)]*\)\s*$", "", resto)
        if "(" in resto or ")" in resto:
            erros.append(
                "linha %d tem parenteses no meio do nome — o parser confunde com "
                "responsavel/horas, troque por travessao: %r" % (i, l[:60])
            )
    return erros


def envia(texto, silencioso=True):
    mensagem = {"text": texto}
    if silencioso:
        mensagem["silencioso"] = True
    corpo = json.dumps({"json da mensagem do slack": mensagem}).encode("utf-8")
    req = urllib.request.Request(WEBHOOK, data=corpo, method="POST")
    req.add_header("Content-Type", "application/json; charset=utf-8")
    try:
        r = urllib.request.urlopen(req, timeout=60)
        return r.status, r.read().decode("utf-8", "replace")[:120]
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "replace")[:200]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("arquivos", nargs="+")
    ap.add_argument("--intervalo", type=float, default=6.0)
    ap.add_argument("--simular", action="store_true", help="valida e mostra, sem enviar")
    ap.add_argument(
        "--avisar",
        action="store_true",
        help="deixa a automacao avisar no canal ia-quebra-de-atividades (padrao: silencioso)",
    )
    args = ap.parse_args()

    blocos = []
    problemas = 0
    for caminho in args.arquivos:
        texto = io.open(caminho, encoding="utf-8").read()
        erros = valida(texto, caminho)
        if erros:
            problemas += 1
            print("[X] %s" % caminho)
            for e in erros:
                print("      -", e)
        else:
            print("[ok] %s (%d linhas)" % (caminho, len(texto.strip().splitlines())))
        blocos.append((caminho, texto))

    if problemas:
        raise SystemExit("\n%d arquivo(s) com problema. Nada foi enviado." % problemas)
    if args.simular:
        print("\n--simular: validou tudo, nada enviado.")
        return

    print()
    if args.avisar:
        print("--avisar: a automacao vai postar no canal ia-quebra-de-atividades.\n")
    falhas = 0
    for i, (caminho, texto) in enumerate(blocos):
        status, corpo = envia(texto, silencioso=not args.avisar)
        ok = status == 200
        falhas += 0 if ok else 1
        print("%s %s -> HTTP %s %s" % ("[ok]" if ok else "[X]", caminho, status, "" if ok else corpo))
        if i < len(blocos) - 1:
            time.sleep(args.intervalo)

    print(
        "\nEnviados: %d | falhas: %d\n"
        "O 200 so diz que a automacao COMECOU. Rode conferir_sprint.py antes de "
        "dizer que deu certo." % (len(blocos) - falhas, falhas)
    )


if __name__ == "__main__":
    main()
