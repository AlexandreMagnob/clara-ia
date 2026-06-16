#!/usr/bin/env python3
"""
Cria template de WhatsApp COM HEADER DE VIDEO (Clara SDR / CW) via Meta API.
Fluxo: debug_token -> app_id ; resumable upload do video -> header_handle ; cria template.
Uso: python create_video_template.py
"""
import os, json, urllib.request, urllib.error
from pathlib import Path

# .env do mesmo diretorio
env_path = Path(__file__).parent / ".env"
for line in env_path.read_text(encoding="utf-8").splitlines():
    line = line.strip()
    if line and not line.startswith("#") and "=" in line:
        k, v = line.split("=", 1)
        os.environ[k] = v

TOKEN = os.environ["CW_SDR_TOKEN"]
WABA  = os.environ["CW_SDR_WABA_ID"]
GRAPH = "https://graph.facebook.com/v21.0"

# vídeo de exemplo p/ aprovação (qualquer um dos closers serve; o real entra por envio)
VIDEO = Path(r"C:\Users\alexa\Desktop\Clara IA\videos-lembrete\converted\ranier.mp4")

NAME = "lembrete_video_30min"
BODY = ("Opa {{nome}}, tudo bem? Passando para te enviar o link da sua reunião "
        "que começa daqui a *30 minutos.*\n\n_Link: {{link}}_\n\n"
        "Lembrando também que o tempo de tolerância para entrar é de *05 minutos.*")


def req_json(url, data=None, method="GET", headers=None):
    r = urllib.request.Request(url, data=data, method=method)
    for h, val in (headers or {}).items():
        r.add_header(h, val)
    try:
        with urllib.request.urlopen(r) as resp:
            return resp.status, json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode("utf-8"))


def main():
    # 1) app_id
    st, d = req_json(f"{GRAPH}/debug_token?input_token={TOKEN}&access_token={TOKEN}")
    app_id = d.get("data", {}).get("app_id")
    print(f"[1] debug_token {st} app_id={app_id} scopes={d.get('data',{}).get('scopes')}")
    if not app_id:
        print("    ERRO:", json.dumps(d)[:400]); return

    # 2) resumable upload — sessão
    flen = VIDEO.stat().st_size
    st, d = req_json(
        f"{GRAPH}/{app_id}/uploads?file_name={VIDEO.name}&file_length={flen}&file_type=video/mp4&access_token={TOKEN}",
        method="POST")
    print(f"[2] upload session {st} {json.dumps(d)[:200]}")
    upload_id = d.get("id")
    if not upload_id:
        return

    # 3) enviar bytes
    st, d = req_json(f"{GRAPH}/{upload_id}", data=VIDEO.read_bytes(), method="POST",
                     headers={"Authorization": f"OAuth {TOKEN}", "file_offset": "0"})
    print(f"[3] upload bytes {st} {json.dumps(d)[:200]}")
    handle = d.get("h")
    if not handle:
        return

    # 4) criar template
    payload = {
        "name": NAME,
        "language": "pt_BR",
        "category": "UTILITY",
        "parameter_format": "NAMED",
        "components": [
            {"type": "HEADER", "format": "VIDEO", "example": {"header_handle": [handle]}},
            {"type": "BODY", "text": BODY, "example": {"body_text_named_params": [
                {"param_name": "nome", "example": "Fábio"},
                {"param_name": "link", "example": "https://meet.google.com/nvt-axdb-vou"},
            ]}},
        ],
    }
    st, d = req_json(f"{GRAPH}/{WABA}/message_templates",
                     data=json.dumps(payload).encode("utf-8"), method="POST",
                     headers={"Content-Type": "application/json; charset=utf-8",
                              "Authorization": f"Bearer {TOKEN}"})
    print(f"[4] create template {st} {json.dumps(d, ensure_ascii=False)}")


if __name__ == "__main__":
    main()
