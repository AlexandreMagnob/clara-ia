#!/usr/bin/env python3
"""Cria os 4 templates descontraidos do FUP cadencia 3 (GWT-2861) na conta Clara SDR."""
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

VARS = [
    ("followup_1b_desc_a",
     "Oi {{nome}}! \U0001F604 Sou eu de novo, a Clara da Cardápio Web. Prometo que não tô te perseguindo, hein — é que ainda acho que dá pra fazer um bom negócio juntos! \U0001F609 Bora trocar uma ideia rapidinho? Se não for o momento, é só me dar um toque."),
    ("followup_1b_desc_b",
     "E aí {{nome}}, sumiu! \U0001F440 Aqui é a Clara, da Cardápio Web. Fiquei na dúvida: você só não teve tempo de responder ou a ideia não te animou? Me conta qual dos dois \U0001F605"),
    ("followup_1b_desc_c",
     "Ei {{nome}}, cadê você? \U0001F979 Brincadeira! Aqui é a Clara da Cardápio Web. Passando só pra saber se ainda rola a gente bater um papo rapidinho sobre seu delivery \U0001F604"),
    ("followup_1b_desc_d",
     "Oi {{nome}}! \U0001F605 Acho que minha última mensagem aqui deu uma bugada e talvez não tenha chegado completa pra você… chegou certinho ou ficou pela metade aí?"),
]


def create(name, body):
    payload = {
        "name": name, "language": "pt_BR", "category": "MARKETING",
        "parameter_format": "NAMED",
        "components": [
            {"type": "BODY", "text": body,
             "example": {"body_text_named_params": [{"param_name": "nome", "example": "Maria"}]}},
            {"type": "BUTTONS", "buttons": [{"type": "QUICK_REPLY", "text": "Não quero mensagens"}]},
        ],
    }
    data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    req = urllib.request.Request(f"{GRAPH}/{WABA}/message_templates", data=data, method="POST")
    req.add_header("Content-Type", "application/json; charset=utf-8")
    req.add_header("Authorization", f"Bearer {TOKEN}")
    try:
        with urllib.request.urlopen(req) as r:
            return r.status, json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode("utf-8"))


for name, body in VARS:
    st, d = create(name, body)
    print(f"{name}: HTTP {st} -> {json.dumps(d, ensure_ascii=False)}")
