import sys
import json
import re
import glob
from collections import defaultdict

sys.stdout.reconfigure(encoding='utf-8')

IN_DIR  = r"c:\Users\alexa\Desktop\Clara IA\analises"
OUT_FILE = r"c:\Users\alexa\Desktop\Clara IA\analises\failures_raw.json"

# ── Parsear uma conversa em turnos ─────────────────────────────────────
LINE_RE = re.compile(
    r'^\[(\d{2}/\d{2}/\d{4}\s\d{2}:\d{2}:\d{2})(?:\s-\s\w+)?\]\s'
    r'(Comercial(?:\s\(Fup\))?|Lead)\s?:(.*)$'
)

def parse_conversa(text):
    turns = []
    for line in text.split('\n'):
        line = line.strip()
        if not line:
            continue
        m = LINE_RE.match(line)
        if m:
            ts, ator_raw, msg = m.group(1), m.group(2), m.group(3).strip()
            ator = 'Clara' if ator_raw.startswith('Comercial') else 'Lead'
            turns.append({'ator': ator, 'ts': ts, 'msg': msg})
    return turns

# ── Sinais de falha ────────────────────────────────────────────────────

CONFUSION_PHRASES = [
    'não entendi', 'nao entendi', 'nao entendo', 'não entendo',
    'como assim', 'me explica', 'pode explicar', 'pode repetir',
    'não ficou claro', 'nao ficou claro', 'não compreendi', 'nao compreendi',
    'confuso', 'confusa', 'não tô entendendo', 'nao to entendendo',
    'não estou entendendo', 'nao estou entendendo',
    'explica melhor', 'explica de novo',
]

TOPIC_KEYWORDS = {
    'preco':          ['mensal', 'mensalidade', '179', '209', '239', '269', 'anual', 'parcel', 'valor', 'quanto custa', 'quanto é', 'qual o valor', 'boleto'],
    'ifood':          ['ifood', 'i-food', 'entrega fácil', 'entrega facil'],
    'pagamento':      ['como recebo', 'repasse', 'maquininha', 'gateway', 'mercado pago', 'forma de pagamento', 'pagamento do cliente', 'link de pagamento', 'taxa do pix', 'pix.*taxa'],
    'funcionalidade': ['módulo', 'modulo', ' pdv', 'fidelidade', 'marketplace', 'market place', 'o que.*inclui', 'o que.*oferece', 'o que.*tem', 'quais funcionalidades'],
    'hardware':       ['impressora', 'balança', 'balanca', 'sem notebook', 'só celular', 'so celular', 'imprimir pedido', 'funciona.*celular'],
    'humano_ia':      ['humano', 'máquina', 'maquina', 'inteligência artificial', 'inteligencia artificial', 'assistente virtual', 'você.*ia', 'robo'],
    'agendamento':    ['remarcar', 'reagendar', 'cancelar reunião', 'não vou poder', 'nao vou poder', 'imprevisto', 'link da reunião', 'link da reuniao'],
    'trial':          ['período de teste', 'periodo de teste', 'dias de teste', 'testar antes', 'existe.*teste', 'dias grátis', 'dias gratis'],
    'nfce':           ['nfce', 'nfc-e', 'nota fiscal', 'cupom fiscal'],
    'concorrente':    ['anota.ai', 'anotai', 'diggy', 'goomer', 'abrahão', 'abraha'],
    'onboarding':     ['montar cardápio', 'montar cardapio', 'quem monta', 'vocês montam', 'voces montam', 'prazo.*implantar', 'quando.*disponível', 'quanto tempo.*pronto'],
}

def detect_topic(text):
    t = text.lower()
    for topic, kws in TOPIC_KEYWORDS.items():
        for kw in kws:
            if re.search(kw, t):
                return topic
    return None

def is_confusion(msg):
    t = msg.lower()
    return any(phrase in t for phrase in CONFUSION_PHRASES)

def extract_context(turns, idx, before=2, after=2):
    start = max(0, idx - before)
    end = min(len(turns), idx + after + 1)
    return turns[start:end]

# ── Processar todos os batches ─────────────────────────────────────────

all_failures = []
total_leads = 0
leads_with_failure = 0

batch_files = sorted(glob.glob(f"{IN_DIR}\\raw_full_*.json"))
print(f"Batches encontrados: {len(batch_files)}")

for bf in batch_files:
    with open(bf, 'r', encoding='utf-8') as f:
        leads = json.load(f)
    print(f"  Processando {bf}: {len(leads)} leads")

    for lead in leads:
        total_leads += 1
        email    = lead.get('email', '') or ''
        segmento = lead.get('segmento', '') or ''
        etapa    = lead.get('etapa_conversa', '') or ''
        conversa = lead.get('conversa', '') or ''

        if not conversa:
            continue

        turns = parse_conversa(conversa)
        if len(turns) < 4:
            continue

        lead_failures = []
        last_clara_idx = None

        for i, turn in enumerate(turns):
            if turn['ator'] == 'Clara':
                last_clara_idx = i
                continue

            # Turn is Lead
            msg = turn['msg']
            topic = detect_topic(msg)

            # Sinal A: confusão explícita
            if is_confusion(msg):
                ctx = extract_context(turns, i)
                lead_failures.append({
                    'tipo': 'A_confusao_explicita',
                    'topico': topic or 'geral',
                    'lead_msg': msg,
                    'context': [{'ator': t['ator'], 'msg': t['msg'][:300]} for t in ctx],
                })

            # Sinal B: repetição de tópico após resposta da Clara
            if topic and last_clara_idx is not None and last_clara_idx < i:
                # Check if same topic appeared in an earlier lead message before last_clara_idx
                for j in range(0, last_clara_idx):
                    if turns[j]['ator'] == 'Lead':
                        earlier_topic = detect_topic(turns[j]['msg'])
                        if earlier_topic == topic:
                            ctx = extract_context(turns, i, before=3, after=1)
                            lead_failures.append({
                                'tipo': 'B_pergunta_repetida',
                                'topico': topic,
                                'lead_msg': msg,
                                'context': [{'ator': t['ator'], 'msg': t['msg'][:300]} for t in ctx],
                            })
                            break

            # Sinal D: resposta longa da Clara antes desta mensagem
            if last_clara_idx is not None:
                clara_msg = turns[last_clara_idx]['msg']
                if len(clara_msg) > 500 and (is_confusion(msg) or topic):
                    ctx = extract_context(turns, i)
                    lead_failures.append({
                        'tipo': 'D_resposta_longa_confusao',
                        'topico': topic or 'geral',
                        'lead_msg': msg,
                        'context': [{'ator': t['ator'], 'msg': t['msg'][:300]} for t in ctx],
                        'clara_msg_len': len(clara_msg),
                    })

        # Sinal C: abandono — última mensagem é da Clara
        if turns and turns[-1]['ator'] == 'Clara' and etapa in ('triagem', 'abertura'):
            # Find last lead message
            last_lead_idx = None
            for i in range(len(turns) - 1, -1, -1):
                if turns[i]['ator'] == 'Lead':
                    last_lead_idx = i
                    break
            if last_lead_idx is not None:
                ctx = extract_context(turns, last_lead_idx, before=2, after=2)
                last_lead_topic = detect_topic(turns[last_lead_idx]['msg'])
                lead_failures.append({
                    'tipo': 'C_abandono_apos_clara',
                    'topico': last_lead_topic or 'geral',
                    'lead_msg': turns[last_lead_idx]['msg'],
                    'context': [{'ator': t['ator'], 'msg': t['msg'][:300]} for t in ctx],
                })

        if lead_failures:
            leads_with_failure += 1
            all_failures.append({
                'email': email,
                'segmento': segmento,
                'etapa': etapa,
                'failures': lead_failures,
            })

# ── Salvar resultado ───────────────────────────────────────────────────

with open(OUT_FILE, 'w', encoding='utf-8') as f:
    json.dump(all_failures, f, ensure_ascii=False, indent=2)

# ── Estatísticas ───────────────────────────────────────────────────────

tipo_counts = defaultdict(int)
topic_counts = defaultdict(int)
leads_per_topic = defaultdict(set)

for lead_data in all_failures:
    for fl in lead_data['failures']:
        tipo_counts[fl['tipo']] += 1
        topic_counts[fl['topico']] += 1
        leads_per_topic[fl['topico']].add(lead_data['email'])

print(f"\n=== RESULTADO ===")
print(f"Total leads processados: {total_leads}")
print(f"Leads com pelo menos 1 sinal de falha: {leads_with_failure} ({100*leads_with_failure/total_leads:.1f}%)")
print(f"Total de sinais detectados: {sum(tipo_counts.values())}")

print(f"\n--- Por tipo de sinal ---")
for t, c in sorted(tipo_counts.items(), key=lambda x: -x[1]):
    print(f"  {t}: {c}")

print(f"\n--- Por tópico (leads únicos) ---")
for t, leads_set in sorted(leads_per_topic.items(), key=lambda x: -len(x[1])):
    print(f"  {t}: {len(leads_set)} leads únicos ({100*len(leads_set)/total_leads:.1f}%)")

print(f"\nSalvo em: {OUT_FILE}")
