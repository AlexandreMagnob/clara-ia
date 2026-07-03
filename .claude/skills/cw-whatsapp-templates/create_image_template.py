#!/usr/bin/env python3
"""Cria template com HEADER DE IMAGEM (Clara SDR) — FUP descontraido meme (GWT-2861)."""
import os, json, urllib.request, urllib.error
from pathlib import Path

env_path = Path(__file__).parent / ".env"
for line in env_path.read_text(encoding="utf-8").splitlines():
    line = line.strip()
    if line and not line.startswith("#") and "=" in line:
        k, v = line.split("=", 1); os.environ[k] = v

TOKEN = os.environ["CW_SDR_TOKEN"]
WABA  = os.environ["CW_SDR_WABA_ID"]
GRAPH = "https://graph.facebook.com/v21.0"

IMG  = Path(r"C:\Users\alexa\Desktop\Clara IA\ChatGPT Image 26 de jun. de 2026, 14_31_39.png")
NAME = "followup3_desc_moral"
BODY = "Oi, {{nome}}. Me dá uma moral \U0001F605"


def req_json(url, data=None, method="GET", headers=None):
    r = urllib.request.Request(url, data=data, method=method)
    for h, val in (headers or {}).items():
        r.add_header(h, val)
    try:
        with urllib.request.urlopen(r) as resp:
            return resp.status, json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode("utf-8"))


# 1) app_id
st, d = req_json(f"{GRAPH}/debug_token?input_token={TOKEN}&access_token={TOKEN}")
app_id = d.get("data", {}).get("app_id")
print(f"[1] app_id={app_id}")

# 2) sessao de upload (imagem)
flen = IMG.stat().st_size
st, d = req_json(f"{GRAPH}/{app_id}/uploads?file_name=fup_moral.png&file_length={flen}&file_type=image/png&access_token={TOKEN}", method="POST")
print(f"[2] upload session {st}")
upload_id = d.get("id")

# 3) bytes
st, d = req_json(f"{GRAPH}/{upload_id}", data=IMG.read_bytes(), method="POST",
                 headers={"Authorization": f"OAuth {TOKEN}", "file_offset": "0"})
print(f"[3] upload bytes {st} {json.dumps(d)[:120]}")
handle = d.get("h")

# 4) cria template (header IMAGE, sem botao)
payload = {
    "name": NAME, "language": "pt_BR", "category": "MARKETING", "parameter_format": "NAMED",
    "components": [
        {"type": "HEADER", "format": "IMAGE", "example": {"header_handle": [handle]}},
        {"type": "BODY", "text": BODY, "example": {"body_text_named_params": [{"param_name": "nome", "example": "Maria"}]}},
    ],
}
st, d = req_json(f"{GRAPH}/{WABA}/message_templates", data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
                 method="POST", headers={"Content-Type": "application/json; charset=utf-8", "Authorization": f"Bearer {TOKEN}"})
print(f"[4] create {st} {json.dumps(d, ensure_ascii=False)}")
