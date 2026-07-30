# -*- coding: utf-8 -*-
"""Publica a Maquina de Experimentos na Vercel via API. Nunca imprime o token."""
import sb, os, io, json, hashlib, urllib.request, urllib.error, time, sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

TOKEN = sb.ENV.get('VERCEL_TOKEN', '')
APP = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'app')
PROJETO = 'maquina-experimentos'
API = 'https://api.vercel.com'

if not TOKEN:
    raise SystemExit('sem VERCEL_TOKEN no .env')


def call(path, method='GET', body=None, raw=None, extra_headers=None):
    h = {'Authorization': 'Bearer ' + TOKEN,
         'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json'}
    if raw is not None:
        data = raw
        h['Content-Type'] = 'application/octet-stream'
    elif body is not None:
        data = json.dumps(body).encode()
        h['Content-Type'] = 'application/json'
    else:
        data = None
    if extra_headers:
        h.update(extra_headers)
    req = urllib.request.Request(API + path, data=data, headers=h, method=method)
    try:
        with urllib.request.urlopen(req, timeout=180) as r:
            txt = r.read().decode('utf-8', 'replace')
            return r.status, (json.loads(txt) if txt.strip() else None)
    except urllib.error.HTTPError as e:
        txt = e.read().decode('utf-8', 'replace')
        try:
            return e.code, json.loads(txt)
        except Exception:
            return e.code, txt
    except Exception as e:
        return None, '%s: %s' % (type(e).__name__, e)


# quem sou eu / qual time
st, eu = call('/v2/user')
print('conta Vercel:', (eu or {}).get('user', {}).get('username') or (eu or {}).get('username'), '| HTTP', st)
if st != 200:
    print(eu)
    raise SystemExit(1)

# 1) sobe cada arquivo e coleta os sha
arquivos = ['index.html', 'logo-h.png', 'logo-stack.png', 'favicon.png', 'vercel.json']
inline = []
print()
print('--- subindo arquivos ---')
for nome in arquivos:
    caminho = os.path.join(APP, nome)
    with open(caminho, 'rb') as f:
        conteudo = f.read()
    sha = hashlib.sha1(conteudo).hexdigest()
    st, d = call('/v2/files', 'POST', raw=conteudo, extra_headers={
        'x-vercel-digest': sha,
        'Content-Length': str(len(conteudo)),
    })
    print('   %-16s %6d bytes  sha=%s...  HTTP %s' % (nome, len(conteudo), sha[:8], st))
    if st not in (200, 201):
        print('      ', json.dumps(d, ensure_ascii=False)[:400])
        raise SystemExit(1)
    inline.append({'file': nome, 'sha': sha, 'size': len(conteudo)})

# 2) cria o deployment de producao
print()
print('--- criando deployment de producao ---')
st, dep = call('/v13/deployments', 'POST', {
    'name': PROJETO,
    'files': inline,
    'target': 'production',
    'projectSettings': {
        'framework': None,
        'buildCommand': None,
        'installCommand': None,
        'outputDirectory': None,
    },
})
print('   HTTP', st)
if st not in (200, 201):
    print(json.dumps(dep, ensure_ascii=False, indent=2)[:1500])
    raise SystemExit(1)

dep_id = dep.get('id')
url = dep.get('url')
print('   deployment:', dep_id)
print('   url tempor\u00e1ria:', 'https://' + url if url else '?')

# 3) espera ficar pronto
print()
print('--- aguardando build ---')
for i in range(60):
    st, d = call('/v13/deployments/%s' % dep_id)
    estado = (d or {}).get('readyState') or (d or {}).get('status')
    if estado in ('READY', 'ERROR', 'CANCELED'):
        print('   estado final:', estado, 'em ~%ds' % (i * 5))
        break
    time.sleep(5)
else:
    estado = '?'
    print('   ainda buildando')

# 4) descobre a URL fixa de producao
st, projs = call('/v9/projects?search=' + PROJETO)
alias = None
for p in (projs or {}).get('projects', []):
    if p.get('name') == PROJETO:
        for a in (p.get('alias') or []):
            dom = a.get('domain') if isinstance(a, dict) else a
            if dom and 'vercel.app' in dom:
                if alias is None or len(dom) < len(alias):
                    alias = dom
        if not alias:
            for t in (p.get('targets') or {}).values():
                if t and t.get('url'):
                    alias = t['url']

print()
print('=' * 60)
print('ESTADO   :', estado)
print('URL FIXA :', 'https://' + alias if alias else ('https://' + url if url else '?'))
print('=' * 60)
