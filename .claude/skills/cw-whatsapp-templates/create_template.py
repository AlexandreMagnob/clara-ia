#!/usr/bin/env python3
"""
Cria template de WhatsApp na conta CW via Meta API.
Uso: python create_template.py
"""
import os, urllib.request, json, re
from pathlib import Path

# Carrega .env do mesmo diretório
env_path = Path(__file__).parent / ".env"
for line in env_path.read_text().splitlines():
    line = line.strip()
    if line and not line.startswith("#") and "=" in line:
        k, v = line.split("=", 1)
        os.environ[k] = v

ACCOUNTS = {
    "sdr": {
        "label": "Clara SDR (CW)",
        "waba_id": os.environ["CW_SDR_WABA_ID"],
        "token":   os.environ["CW_SDR_TOKEN"],
    },
    "comercial": {
        "label": "CW Comercial (Marcos/Taty)",
        "waba_id": os.environ["CW_COMERCIAL_WABA_ID"],
        "token":   os.environ["CW_COMERCIAL_TOKEN"],
    },
}

def sanitize_name(name: str) -> str:
    name = name.lower().strip()
    name = re.sub(r"[áàãâä]", "a", name)
    name = re.sub(r"[éèêë]", "e", name)
    name = re.sub(r"[íìîï]", "i", name)
    name = re.sub(r"[óòõôö]", "o", name)
    name = re.sub(r"[úùûü]", "u", name)
    name = re.sub(r"[ç]", "c", name)
    name = re.sub(r"[^a-z0-9_]", "_", name)
    name = re.sub(r"_+", "_", name).strip("_")
    return name

def extract_params(text: str) -> list[dict]:
    params = []
    seen = set()
    for match in re.finditer(r"\{\{(\w+)\}\}", text):
        param = match.group(1)
        if param not in seen:
            seen.add(param)
            example = "Maria" if param == "nome" else "Marcos Silva" if param == "user" else "exemplo"
            params.append({"param_name": param, "example": example})
    return params

def check_start_end(text: str) -> bool:
    return bool(re.match(r"^\{\{", text)) or bool(re.search(r"\}\}$", text))

def create_template(waba_id: str, token: str, name: str, body: str, category: str, quick_reply: bool) -> dict:
    components = []

    params = extract_params(body)
    body_comp = {"type": "BODY", "text": body}
    if params:
        body_comp["example"] = {"body_text_named_params": params}
    components.append(body_comp)

    if quick_reply:
        components.append({
            "type": "BUTTONS",
            "buttons": [{"type": "QUICK_REPLY", "text": "Não quero mensagens"}]
        })

    payload = {
        "name": name,
        "language": "pt_BR",
        "category": category,
        "parameter_format": "NAMED" if params else "POSITIONAL",
        "components": components,
    }

    url = f"https://graph.facebook.com/v21.0/{waba_id}/message_templates"
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, method="POST")
    req.add_header("Content-Type", "application/json")
    req.add_header("Authorization", f"Bearer {token}")
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        return json.loads(e.read().decode("utf-8"))

def main():
    print("=== Criar Template WhatsApp — Cardápio Web ===\n")

    # Conta
    print("Conta:")
    for k, v in ACCOUNTS.items():
        print(f"  [{k}] {v['label']}")
    account_key = input("\nEscolha (sdr/comercial): ").strip().lower()
    if account_key not in ACCOUNTS:
        print("Conta inválida."); return
    account = ACCOUNTS[account_key]

    # Nome
    raw_name = input("Nome do template: ").strip()
    name = sanitize_name(raw_name)
    if name != raw_name:
        print(f"  Nome ajustado para: {name}")

    # Corpo
    print("Corpo da mensagem (use {{nome}}, {{user}} para variáveis).")
    print("Quando terminar, digite uma linha com apenas 'FIM':")
    lines = []
    while True:
        line = input()
        if line.strip() == "FIM":
            break
        lines.append(line)
    body = "\n".join(lines)

    # Validações
    if check_start_end(body):
        print("\nAVISO: mensagem começa ou termina com variável — Meta rejeita isso.")
        print("Adicione texto antes/depois da variável e tente novamente.")
        return

    # Categoria
    cat = input("\nCategoria (marketing/utility) [marketing]: ").strip().lower() or "marketing"
    category = "UTILITY" if cat == "utility" else "MARKETING"

    # Botão opt-out
    btn = input("Adicionar botão 'Não quero mensagens'? (s/n) [n]: ").strip().lower()
    quick_reply = btn == "s"

    # Confirmação
    print(f"\n--- Resumo ---")
    print(f"Conta:     {account['label']}")
    print(f"Nome:      {name}")
    print(f"Categoria: {category}")
    print(f"Botão:     {'Sim' if quick_reply else 'Não'}")
    print(f"Corpo:\n{body}\n")
    confirm = input("Criar? (s/n): ").strip().lower()
    if confirm != "s":
        print("Cancelado."); return

    result = create_template(account["waba_id"], account["token"], name, body, category, quick_reply)

    if "id" in result:
        print(f"\nCriado com sucesso!")
        print(f"  ID:     {result['id']}")
        print(f"  Status: {result.get('status', '-')}")
    else:
        err = result.get("error", {})
        print(f"\nErro: {err.get('error_user_title', '')} — {err.get('error_user_msg', str(result))}")

if __name__ == "__main__":
    main()
