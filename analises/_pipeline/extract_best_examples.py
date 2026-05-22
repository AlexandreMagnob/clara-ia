import sys
import json
from collections import defaultdict

sys.stdout.reconfigure(encoding='utf-8')

IN_FILE  = r"c:\Users\alexa\Desktop\Clara IA\analises\failures_raw.json"
OUT_FILE = r"c:\Users\alexa\Desktop\Clara IA\analises\best_examples.txt"

with open(IN_FILE, 'r', encoding='utf-8') as f:
    all_failures = json.load(f)

# Group by topic, sub-grouped by signal type
# For each topic, collect up to 5 good exchanges

def fmt_context(ctx_list):
    lines = []
    for t in ctx_list:
        prefix = '    Clara:' if t['ator'] == 'Clara' else '    Lead: '
        msg = t['msg'].strip()
        if len(msg) > 400:
            msg = msg[:397] + '...'
        lines.append(f"{prefix} {msg}")
    return '\n'.join(lines)

# Collect examples per topic
examples = defaultdict(list)

for lead_data in all_failures:
    email    = lead_data['email']
    segmento = lead_data['segmento']
    etapa    = lead_data['etapa']

    for fl in lead_data['failures']:
        topic = fl['topico']
        tipo  = fl['tipo']
        ctx   = fl['context']
        lead_msg = fl['lead_msg']

        # Prefer Sinal A (explicit confusion) and Sinal B (repetition) over C (abandonment)
        priority = 0 if tipo.startswith('A') else (1 if tipo.startswith('B') else 2)

        # Skip very short lead messages
        if len(lead_msg.strip()) < 5:
            continue

        examples[topic].append({
            'email': email,
            'segmento': segmento,
            'etapa': etapa,
            'tipo': tipo,
            'priority': priority,
            'lead_msg': lead_msg,
            'context': ctx,
        })

# Sort each topic's examples: A first, then B, then C; max 5 per topic
output_lines = []

topic_order = ['preco', 'ifood', 'geral', 'funcionalidade', 'humano_ia', 'hardware', 'pagamento', 'concorrente', 'onboarding', 'trial', 'nfce', 'agendamento']

for topic in topic_order:
    exs = examples.get(topic, [])
    if not exs:
        continue
    exs_sorted = sorted(exs, key=lambda x: (x['priority'], -len(x['lead_msg'])))

    unique_emails = set()
    selected = []
    for ex in exs_sorted:
        if ex['email'] not in unique_emails and len(selected) < 5:
            unique_emails.add(ex['email'])
            selected.append(ex)

    output_lines.append(f"\n{'='*60}")
    output_lines.append(f"TÓPICO: {topic.upper()}  |  {len(set(e['email'] for e in exs))} leads únicos")
    output_lines.append('='*60)

    for i, ex in enumerate(selected, 1):
        output_lines.append(f"\n  [{i}] email={ex['email']} | segmento={ex['segmento']} | etapa={ex['etapa']} | tipo={ex['tipo']}")
        output_lines.append(f"  Mensagem do lead: {ex['lead_msg'][:200]}")
        output_lines.append(f"  CONTEXTO:")
        output_lines.append(fmt_context(ex['context']))

result = '\n'.join(output_lines)

with open(OUT_FILE, 'w', encoding='utf-8') as f:
    f.write(result)

print(result[:8000])  # print first 8000 chars
print(f"\n\n... output completo salvo em {OUT_FILE}")
