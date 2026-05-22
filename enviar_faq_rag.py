import json
import time
import urllib.request
import re

WEBHOOK_URL = "https://n8n.cardapioweb.com/webhook/a76e858c-b440-4625-8637-f6f865fd945f"
FAQ_PATH = r"c:\Users\alexa\Desktop\Clara IA\faq-vendas.md"
DELAY_SECONDS = 5

with open(FAQ_PATH, encoding="utf-8") as f:
    content = f.read()

# Divide pelo separador --- e filtra blocos com conteúdo real
raw_blocks = re.split(r"\n---\n", content)

current_section = "FAQ de Vendas"
chunks = []

for block in raw_blocks:
    block = block.strip()
    if not block:
        continue

    # Atualiza seção atual se o bloco for um header ##
    section_match = re.match(r"^##\s+(.+)$", block, re.MULTILINE)
    if section_match:
        current_section = section_match.group(1).strip()

    # Só envia blocos que contêm uma pergunta
    if "**Pergunta:" in block:
        chunk_text = f"## {current_section}\n\n{block}"
        chunks.append(chunk_text)

print(f"Total de chunks a enviar: {len(chunks)}\n")

for i, chunk in enumerate(chunks, 1):
    # Extrai a pergunta para logar
    pergunta_match = re.search(r"\*\*Pergunta: (.+?)\*\*", chunk)
    pergunta = pergunta_match.group(1) if pergunta_match else f"chunk {i}"

    payload = json.dumps({"resultado": chunk}, ensure_ascii=False).encode("utf-8")
    req = urllib.request.Request(
        WEBHOOK_URL,
        data=payload,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            status = resp.status
        print(f"[{i}/{len(chunks)}] OK ({status}) — {pergunta}")
    except Exception as e:
        print(f"[{i}/{len(chunks)}] ERRO — {pergunta}: {e}")

    if i < len(chunks):
        time.sleep(DELAY_SECONDS)

print("\nConcluido!")
