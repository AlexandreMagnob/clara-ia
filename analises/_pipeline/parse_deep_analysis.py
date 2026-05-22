"""
Lê os 4 arquivos de resultado do Supabase e extrai trechos relevantes
para análise profunda de: preco, timing_longo, vou_verificar, concorrente.
"""
import sys, json, re, os

sys.stdout.reconfigure(encoding='utf-8')

BASE = r"C:\Users\alexa\.claude\projects\c--Users-alexa-Desktop-Clara-IA\9988ad3e-1ed8-4d81-ac45-c75aa583bbed\tool-results"

FILES = {
    "preco":         "mcp-claude_ai_Supabase-execute_sql-1778853649828.txt",
    "timing_longo":  "mcp-claude_ai_Supabase-execute_sql-1778853656520.txt",
    "vou_verificar": "mcp-claude_ai_Supabase-execute_sql-1778853663195.txt",
    "concorrente":   "mcp-claude_ai_Supabase-execute_sql-1778853669657.txt",
}

OUT_FILE = r"c:\Users\alexa\Desktop\Clara IA\analises\_pipeline\deep_analysis_raw.txt"

LINE_RE = re.compile(
    r'^\[(\d{2}/\d{2}/\d{4}\s\d{2}:\d{2}:\d{2})(?:\s-\s\w+)?\]\s'
    r'(Comercial(?:\s\(Fup\))?|Lead)\s?:(.*)$'
)

CONFUSION = ['não entendi','nao entendi','como assim','me explica','não ficou claro',
             'nao ficou claro','pode repetir','confuso','confusa','não entendo',
             'nao entendo','não compreendi','nao compreendi','explica melhor']

PRECO_KW  = ['179','209','239','269','mensal','mensalidade','plano anual','parcel',
             'valor','quanto custa','anual','boleto','à vista','a vista']

TIMING_KW = ['ainda não abri','ainda nao abri','vou abrir','ainda vou','previsão',
             'previsao','em breve','mês que vem','mes que vem','próximos meses',
             'proximos meses','fim do ano','final do ano','montando','planejando',
             'fase de','ainda não estou','ainda nao estou']

VERIFICAR_KW = ['vou verificar','vou consultar','vou checar','posso confirmar',
                'deixa eu verificar','vou confirmar','não tenho essa informação',
                'não sei ao certo','não consigo confirmar']

CONCORRENTE_KW = ['anota.ai','anotai','diggy','goomer','abrahão','abraha',
                  'mais barato','outro sistema','já uso','já tenho','usando outro',
                  'concorrente']

def parse_turns(conversa):
    turns = []
    for line in conversa.split('\n'):
        line = line.strip()
        if not line:
            continue
        m = LINE_RE.match(line)
        if m:
            ts, ator_raw, msg = m.group(1), m.group(2), m.group(3).strip()
            ator = 'Clara' if ator_raw.startswith('Comercial') else 'Lead'
            turns.append({'ator': ator, 'ts': ts, 'msg': msg})
    return turns

def has_any(text, keywords):
    t = text.lower()
    return any(kw.lower() in t for kw in keywords)

def extract_window(turns, idx, before=3, after=3):
    start = max(0, idx - before)
    end   = min(len(turns), idx + after + 1)
    lines = []
    for t in turns[start:end]:
        prefix = '  Clara:' if t['ator'] == 'Clara' else '  Lead: '
        msg = t['msg']
        if len(msg) > 500:
            msg = msg[:497] + '...'
        lines.append(f"{prefix} {msg}")
    return '\n'.join(lines)

def analyze_preco(turns, email, segmento, etapa):
    """Find windows where lead expresses confusion specifically about price."""
    snippets = []
    for i, t in enumerate(turns):
        if t['ator'] != 'Lead':
            continue
        if has_any(t['msg'], CONFUSION) and has_any(t['msg'], PRECO_KW):
            snippets.append(('confusao_explicita', i, extract_window(turns, i)))
        elif has_any(t['msg'], PRECO_KW):
            # Check if this same topic appeared before (repetition)
            for j in range(0, i):
                if turns[j]['ator'] == 'Lead' and has_any(turns[j]['msg'], PRECO_KW):
                    # And there was a Clara response between j and i
                    clara_between = any(turns[k]['ator'] == 'Clara' for k in range(j+1, i))
                    if clara_between:
                        snippets.append(('pergunta_repetida', i, extract_window(turns, i)))
                        break
    return snippets

def analyze_timing(turns, email, segmento, etapa):
    """Find where lead says they haven't opened yet and how Clara responds."""
    snippets = []
    for i, t in enumerate(turns):
        if t['ator'] != 'Lead':
            continue
        if has_any(t['msg'], TIMING_KW):
            snippets.append(('timing_longo', i, extract_window(turns, i, before=2, after=4)))
    return snippets

def analyze_verificar(turns, email, segmento, etapa):
    """Find Clara messages with evasive phrases and what lead said after."""
    snippets = []
    for i, t in enumerate(turns):
        if t['ator'] != 'Clara':
            continue
        if has_any(t['msg'], VERIFICAR_KW):
            snippets.append(('vou_verificar', i, extract_window(turns, i, before=2, after=3)))
    return snippets

def analyze_concorrente(turns, email, segmento, etapa):
    """Find competitor mentions and how Clara responded."""
    snippets = []
    for i, t in enumerate(turns):
        if t['ator'] != 'Lead':
            continue
        if has_any(t['msg'], CONCORRENTE_KW):
            snippets.append(('concorrente', i, extract_window(turns, i, before=1, after=4)))
    return snippets

ANALYZERS = {
    'preco':         analyze_preco,
    'timing_longo':  analyze_timing,
    'vou_verificar': analyze_verificar,
    'concorrente':   analyze_concorrente,
}

output_lines = []

for category, filename in FILES.items():
    filepath = os.path.join(BASE, filename)
    print(f"Lendo {category}...", flush=True)

    with open(filepath, 'r', encoding='utf-8') as f:
        raw = f.read()

    # The file is wrapped: {"result": "...preamble...[{actual json}]"}
    try:
        wrapper = json.loads(raw)
        result_str = wrapper['result'] if isinstance(wrapper, dict) else raw
        arr_start = result_str.find('[{')
        if arr_start == -1:
            arr_start = result_str.find('[')
        arr_end = result_str.rfind(']')
        leads = json.loads(result_str[arr_start:arr_end+1])
    except (json.JSONDecodeError, KeyError) as e:
        print(f"  ERRO JSON em {category}: {e}")
        continue

    print(f"  {len(leads)} leads carregados")

    analyzer = ANALYZERS[category]

    output_lines.append(f"\n{'='*70}")
    output_lines.append(f"CATEGORIA: {category.upper()}  |  {len(leads)} leads")
    output_lines.append('='*70)

    case_count = 0
    seen_emails = set()

    for lead in leads:
        email    = lead.get('email', '') or ''
        segmento = lead.get('segmento', '') or ''
        etapa    = lead.get('etapa_conversa', '') or ''
        conversa = lead.get('conversa', '') or ''

        if email in seen_emails:
            continue

        if not conversa:
            continue

        turns = parse_turns(conversa)
        if len(turns) < 4:
            continue

        snippets = analyzer(turns, email, segmento, etapa)

        if not snippets:
            continue

        seen_emails.add(email)
        case_count += 1

        output_lines.append(f"\n  [{case_count}] {email} | {segmento} | {etapa} | msgs={lead.get('count_messages','?')}")

        for sig_type, idx, window in snippets[:2]:  # max 2 snippets per lead
            output_lines.append(f"  >> tipo={sig_type} | turno={idx}")
            output_lines.append(window)
            output_lines.append("")

        if case_count >= 12:
            output_lines.append(f"\n  ... (limitado a 12 cases por categoria)")
            break

    output_lines.append(f"\n  Total de cases únicos encontrados: {case_count}")

result = '\n'.join(output_lines)

with open(OUT_FILE, 'w', encoding='utf-8') as f:
    f.write(result)

print(f"\nSalvo em: {OUT_FILE}")
print(f"\n{'='*70}")
print(result[:12000])
if len(result) > 12000:
    print(f"\n... ({len(result)-12000} chars adicionais no arquivo)")
