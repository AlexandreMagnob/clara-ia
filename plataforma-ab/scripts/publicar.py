# -*- coding: utf-8 -*-
"""Publica a plataforma A/B: schema no Supabase (Management API) + deploy na Vercel.

Idempotente: rodar de novo re-aplica o schema (CREATE IF NOT EXISTS) e cria um
deployment novo. Nunca imprime segredo — os gerados ficam no .env da raiz.

    python scripts/publicar.py
"""
import os, sys, json, hashlib, secrets, time, urllib.request, urllib.error

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(AQUI)                    # plataforma-ab/
REPO = os.path.dirname(RAIZ)                    # raiz do repo (onde mora o .env)
ENV_PATH = os.path.join(REPO, '.env')
PROJETO = 'plataforma-ab'
DOMINIOS = 'cardapioweb.com,lp.cardapioweb.com,blog.cardapioweb.com'
FALLBACK = 'https://cardapioweb.com'


def load_env():
    env = {}
    with open(ENV_PATH, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                k, v = line.split('=', 1)
                env[k.strip()] = v.strip().strip('"').strip("'")
    return env


def salvar_env(chave, valor):
    """Acrescenta a chave no .env se ainda não existir. Nunca sobrescreve."""
    env = load_env()
    if env.get(chave):
        return env[chave]
    with open(ENV_PATH, 'a', encoding='utf-8') as f:
        f.write('%s=%s\n' % (chave, valor))
    return valor


ENV = load_env()
SB_PAT = ENV.get('SUPABASE_ACCESS_TOKEN', '')
SB_REF = ENV.get('EXPERIMENTOS_PROJECT_REF', '')
SB_URL = ENV.get('EXPERIMENTOS_SUPABASE_URL', '') or ('https://%s.supabase.co' % SB_REF)
VC_TOKEN = ENV.get('VERCEL_TOKEN', '')
if not (SB_PAT and SB_REF and VC_TOKEN):
    raise SystemExit('faltam SUPABASE_ACCESS_TOKEN / EXPERIMENTOS_PROJECT_REF / VERCEL_TOKEN no .env')


def call(base, path, method='GET', body=None, raw=None, token='', extra=None, redirect=True):
    h = {'Authorization': 'Bearer ' + token, 'User-Agent': 'Mozilla/5.0',
         'Accept': 'application/json'}
    if raw is not None:
        data, h['Content-Type'] = raw, 'application/octet-stream'
    elif body is not None:
        data, h['Content-Type'] = json.dumps(body).encode(), 'application/json'
    else:
        data = None
    if extra:
        h.update(extra)
    req = urllib.request.Request(base + path, data=data, headers=h, method=method)
    opener = urllib.request.build_opener() if redirect else urllib.request.build_opener(NoRedirect)
    try:
        with opener.open(req, timeout=180) as r:
            txt = r.read().decode('utf-8', 'replace')
            try:
                return r.status, json.loads(txt) if txt.strip() else None, dict(r.headers)
            except Exception:
                return r.status, txt, dict(r.headers)
    except urllib.error.HTTPError as e:
        txt = e.read().decode('utf-8', 'replace')
        try:
            return e.code, json.loads(txt), dict(e.headers)
        except Exception:
            return e.code, txt, dict(e.headers)
    except Exception as e:
        return None, '%s: %s' % (type(e).__name__, e), {}


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k):
        return None


# --sem-banco: publica só a Vercel (painel + snippet). A API devolve 503 até o
# banco existir; útil quando a decisão do Supabase ainda está aberta.
SEM_BANCO = '--sem-banco' in sys.argv

# ══════════════════════════════════════════════════════════════════════════
# 1. Supabase — schema + service_role
# ══════════════════════════════════════════════════════════════════════════
service_role = None
if SEM_BANCO:
    print('=== 1. Supabase: PULADO (--sem-banco) ===')
else:
    print('=== 1. Supabase (projeto ref %s...) ===' % SB_REF[:6])

    with open(os.path.join(RAIZ, 'schema.sql'), 'r', encoding='utf-8') as f:
        schema = f.read()

    st, r, _ = call('https://api.supabase.com', '/v1/projects/%s/database/query' % SB_REF,
                    'POST', body={'query': schema}, token=SB_PAT)
    print('   schema.sql aplicado: HTTP', st, ('' if st in (200, 201) else json.dumps(r)[:300]))
    if st not in (200, 201):
        raise SystemExit(1)

    st, r, _ = call('https://api.supabase.com', '/v1/projects/%s/database/query' % SB_REF, 'POST',
                    body={'query': "select table_name from information_schema.tables where table_name like 'ab_%' order by 1"},
                    token=SB_PAT)
    tabelas = [x['table_name'] for x in (r or [])]
    print('   tabelas ab_*:', ', '.join(tabelas) or 'NENHUMA (?)')
    if 'ab_eventos' not in tabelas:
        raise SystemExit('schema não criou as tabelas')

    st, chaves, _ = call('https://api.supabase.com', '/v1/projects/%s/api-keys' % SB_REF,
                         token=SB_PAT)
    service_role = next((c.get('api_key') for c in (chaves or []) if c.get('name') == 'service_role'), None)
    print('   service_role obtida:', 'sim' if service_role else 'NÃO — HTTP %s' % st)
    if not service_role:
        raise SystemExit(1)

# ══════════════════════════════════════════════════════════════════════════
# 2. Vercel — projeto + variáveis de ambiente
# ══════════════════════════════════════════════════════════════════════════
print()
print('=== 2. Vercel ===')
API = 'https://api.vercel.com'

st, eu, _ = call(API, '/v2/user', token=VC_TOKEN)
print('   conta:', (eu or {}).get('user', {}).get('username') or '?', '| HTTP', st)
if st != 200:
    raise SystemExit(1)

st, r, _ = call(API, '/v9/projects', 'POST', body={'name': PROJETO}, token=VC_TOKEN)
print('   projeto %s: %s' % (PROJETO, 'criado' if st in (200, 201) else ('já existia' if st == 409 else 'HTTP %s %s' % (st, json.dumps(r)[:200]))))
if st not in (200, 201, 409):
    raise SystemExit(1)

admin_token = salvar_env('AB_ADMIN_TOKEN', secrets.token_hex(16))
cron_secret = salvar_env('AB_CRON_SECRET', secrets.token_hex(16))
sal_ip = salvar_env('AB_SAL_IP', secrets.token_hex(16))

VARS = ([
    ('AB_STORE', 'supabase', 'plain'),
    ('AB_SUPABASE_URL', SB_URL, 'plain'),
    ('AB_SUPABASE_KEY', service_role, 'encrypted'),
] if service_role else []) + [
    ('AB_ADMIN_TOKEN', admin_token, 'encrypted'),
    ('CRON_SECRET', cron_secret, 'encrypted'),
    ('AB_SAL_IP', sal_ip, 'encrypted'),
    ('AB_DOMINIOS_PERMITIDOS', DOMINIOS, 'plain'),
    ('AB_URL_FALLBACK', FALLBACK, 'plain'),
    ('AB_URL_PAINEL', 'https://%s.vercel.app/' % PROJETO, 'plain'),
    # AB_PERMITIR_HTTP NUNCA entra aqui — é válvula de desenvolvimento.
]
# Rota do Slack (webhook n8n → canal growth), se já existir no .env.
if load_env().get('AB_SLACK_WEBHOOK'):
    VARS.append(('AB_SLACK_WEBHOOK', load_env()['AB_SLACK_WEBHOOK'], 'plain'))
corpo = [{'key': k, 'value': v, 'type': t, 'target': ['production', 'preview']} for k, v, t in VARS]
st, r, _ = call(API, '/v10/projects/%s/env?upsert=true' % PROJETO, 'POST', body=corpo, token=VC_TOKEN)
print('   variáveis de ambiente (%d): HTTP %s' % (len(VARS), st))
if st not in (200, 201):
    print('  ', json.dumps(r)[:400])
    raise SystemExit(1)

# ══════════════════════════════════════════════════════════════════════════
# 3. Deploy — sobe api/, lib/, app/, vercel.json, package.json
# ══════════════════════════════════════════════════════════════════════════
print()
print('=== 3. Deploy ===')
arquivos = ['vercel.json', 'package.json']
for pasta in ('api', 'lib', 'app'):
    for base, _dirs, nomes in os.walk(os.path.join(RAIZ, pasta)):
        for n in nomes:
            arquivos.append(os.path.relpath(os.path.join(base, n), RAIZ).replace('\\', '/'))

inline = []
for rel in arquivos:
    with open(os.path.join(RAIZ, rel), 'rb') as f:
        conteudo = f.read()
    sha = hashlib.sha1(conteudo).hexdigest()
    st, d, _ = call(API, '/v2/files', 'POST', raw=conteudo, token=VC_TOKEN,
                    extra={'x-vercel-digest': sha, 'Content-Length': str(len(conteudo))})
    if st not in (200, 201):
        print('   FALHOU %s: HTTP %s %s' % (rel, st, json.dumps(d)[:200]))
        raise SystemExit(1)
    inline.append({'file': rel, 'sha': sha, 'size': len(conteudo)})
print('   %d arquivos subidos (%.1f KB)' % (len(inline), sum(i['size'] for i in inline) / 1024))

st, dep, _ = call(API, '/v13/deployments', 'POST', token=VC_TOKEN, body={
    'name': PROJETO, 'files': inline, 'target': 'production',
    'projectSettings': {'framework': None, 'buildCommand': None,
                        'installCommand': None, 'outputDirectory': None},
})
print('   deployment: HTTP', st)
if st not in (200, 201):
    print(json.dumps(dep, ensure_ascii=False)[:1200])
    raise SystemExit(1)
dep_id = dep.get('id')

for i in range(60):
    st, d, _ = call(API, '/v13/deployments/%s' % dep_id, token=VC_TOKEN)
    estado = (d or {}).get('readyState') or (d or {}).get('status')
    if estado in ('READY', 'ERROR', 'CANCELED'):
        break
    time.sleep(5)
print('   estado: %s (~%ds)' % (estado, i * 5))
if estado != 'READY':
    raise SystemExit(1)

st, projs, _ = call(API, '/v9/projects?search=' + PROJETO, token=VC_TOKEN)
alias = None
for p in (projs or {}).get('projects', []):
    if p.get('name') == PROJETO:
        for a in (p.get('alias') or []):
            dom = a.get('domain') if isinstance(a, dict) else a
            if dom and dom.endswith('.vercel.app') and (alias is None or len(dom) < len(alias)):
                alias = dom
URL = 'https://' + (alias or dep.get('url'))
print('   URL:', URL)

# ══════════════════════════════════════════════════════════════════════════
# 4. Smoke test
# ══════════════════════════════════════════════════════════════════════════
print()
print('=== 4. Smoke test ===')
st, corpo_painel, _ = call(URL, '/', token='')
ok_painel = st == 200 and 'Teste A/B' in str(corpo_painel)
print('   GET /            → HTTP %s, painel %s' % (st, 'ok' if ok_painel else 'ESTRANHO'))

st, _c, hh = call(URL, '/t/nao-existe', token='', redirect=False)
loc = hh.get('Location') or hh.get('location') or ''
print('   GET /t/nao-existe → HTTP %s → %s %s' % (st, loc[:60], '(fallback ok)' if str(st).startswith('30') and 'cardapioweb.com' in loc else 'ESPERAVA 302 pro fallback'))

st, r, _ = call(URL, '/api/resultados', token='', extra={'X-AB-Token': admin_token})
print('   GET /api/resultados (com token) → HTTP %s, %s teste(s)' % (st, len(r) if isinstance(r, list) else '?'))

st, r, _ = call(URL, '/api/resultados', token='')
print('   GET /api/resultados (sem token) → HTTP %s %s' % (st, '(barrado, certo)' if st in (401, 403) else 'DEVIA BARRAR'))

print()
print('=' * 62)
print('PRONTO. Painel: %s  (token AB_ADMIN_TOKEN do .env)' % URL)
print('=' * 62)
