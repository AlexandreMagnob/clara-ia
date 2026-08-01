"""Helper da Management API da Supabase. Nunca imprime segredo."""
import os, sys, json, urllib.request, urllib.error

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ENV_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), '.env')


def load_env():
    env = {}
    with open(ENV_PATH, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                k, v = line.split('=', 1)
                env[k.strip()] = v.strip().strip('"').strip("'")
    return env


ENV = load_env()
TOKEN = ENV.get('SUPABASE_ACCESS_TOKEN', '')
API = 'https://api.supabase.com'


def call(path, method='GET', body=None, base=API, token=None):
    key = token or TOKEN
    h = {'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json',
         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
                       '(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
         'Accept': 'application/json'}
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(base + path, data=data, headers=h, method=method)
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
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


def run_sql(ref, sql):
    return call('/v1/projects/%s/database/query' % ref, 'POST', {'query': sql})


if __name__ == '__main__':
    if not TOKEN:
        print('SEM TOKEN no .env')
        sys.exit(1)
    print('token lido do .env: sim (prefixo %s...)' % TOKEN[:4])
    print()

    st, orgs = call('/v1/organizations')
    print('--- organizacoes --- HTTP', st)
    if st == 200:
        for o in orgs:
            print('   %s   (id: %s)' % (o.get('name'), o.get('id')))
    else:
        print('   ', orgs)
        sys.exit(1)

    st, projs = call('/v1/projects')
    print()
    print('--- projetos existentes --- HTTP', st)
    if st == 200:
        for p in projs:
            print('   %-28s ref=%-22s status=%-16s regiao=%s' % (
                p.get('name'), p.get('id'), p.get('status'), p.get('region')))
    else:
        print('   ', projs)
