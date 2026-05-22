import sys
import json
import urllib.request
import urllib.parse

sys.stdout.reconfigure(encoding='utf-8')

SUPABASE_URL = "https://rydlkqomjokkhxghgqde.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5ZGxrcW9tam9ra2h4Z2hncWRlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTM0OTcyOSwiZXhwIjoyMDg0OTI1NzI5fQ.-b8K3hhdzMvYSUIo6ttXOqDzpWK7WfZfrRWMydCNKK0"
OUT_DIR = r"c:\Users\alexa\Desktop\Clara IA\analises"

BATCH_SIZE = 200

def fetch_batch(offset):
    params = urllib.parse.urlencode({
        "select": "lead_id,email,segmento,etapa_conversa,count_messages,conversa",
        "tier": "in.(4,5)",
        "date_created": "gt.2026-04-14",
        "count_messages": "gt.14",
        "etapa_conversa": "not.in.(agendado,atendido,agendamento)",
        "order": "lead_id",
        "limit": str(BATCH_SIZE),
        "offset": str(offset),
    })
    url = f"{SUPABASE_URL}/rest/v1/leads?{params}"
    req = urllib.request.Request(url, headers={
        "apikey": SERVICE_KEY,
        "Authorization": f"Bearer {SERVICE_KEY}",
        "Content-Type": "application/json",
    })
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode("utf-8"))

total = 0
batch_num = 0
all_done = False

while not all_done:
    print(f"Batch {batch_num} (offset {batch_num * BATCH_SIZE})...", flush=True)
    rows = fetch_batch(batch_num * BATCH_SIZE)
    if not rows:
        print("  -> vazio, fim.")
        break

    out_file = f"{OUT_DIR}\\raw_full_{batch_num}.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False)

    total += len(rows)
    print(f"  -> {len(rows)} leads salvos. Total acumulado: {total}")

    if len(rows) < BATCH_SIZE:
        all_done = True
    else:
        batch_num += 1

print(f"\nExtração concluída. Total: {total} leads em {batch_num + 1} batches.")
