# -*- coding: utf-8 -*-
"""Teste adversarial de segurança: cria um usuário real, pega o JWT dele e
tenta furar as travas atacando a API direto (fora do código do app).
Ao final apaga o usuário de teste. NUNCA toca no perfil do Alexandre."""
import sb, json, sys, urllib.request, urllib.error

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

REF = 'xmturuedgldjxoidyfnl'
URL = sb.ENV['EXPERIMENTOS_SUPABASE_URL'].rstrip('/')
ANON = sb.ENV['EXPERIMENTOS_ANON_KEY']
DONO = 'alexandre.magno@cardapioweb.com'   # nunca apagar

TESTE_EMAIL = 'qa.seguranca@cardapioweb.com'
TESTE_SENHA = 'qaseguranca123'

passou, falhou = [], []


def http(path, metodo='GET', corpo=None, token=None, prefer=None):
    h = {'apikey': ANON, 'Authorization': 'Bearer ' + (token or ANON),
         'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'}
    if prefer:
        h['Prefer'] = prefer
    data = json.dumps(corpo).encode() if corpo is not None else None
    req = urllib.request.Request(URL + path, data=data, headers=h, method=metodo)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            txt = r.read().decode('utf-8', 'replace')
            return r.status, (json.loads(txt) if txt.strip() else None)
    except urllib.error.HTTPError as e:
        txt = e.read().decode('utf-8', 'replace')
        try:
            return e.code, json.loads(txt)
        except Exception:
            return e.code, txt


def checa(nome, condicao, detalhe=''):
    (passou if condicao else falhou).append(nome)
    print('   %s %s%s' % ('PASSOU  ' if condicao else 'FUROU >>', nome,
                          ('  [' + str(detalhe)[:110] + ']') if detalhe else ''))


print('=' * 70)
print('TESTE ADVERSARIAL DE SEGURANCA')
print('=' * 70)

# limpeza preventiva de execucao anterior
sb.run_sql(REF, "delete from auth.users where email = '%s';" % TESTE_EMAIL)

print()
print('--- 1. cadastro: dominio de fora tem que ser barrado PELO BANCO ---')
st, d = http('/auth/v1/signup', 'POST',
             {'email': 'invasor@gmail.com', 'password': 'senha123456',
              'data': {'nome': 'Invasor', 'setor': 'Growth'}})
checa('e-mail @gmail.com barrado no cadastro', st >= 400, 'HTTP %s' % st)
stx, dx = sb.run_sql(REF, "select count(*)::int n from auth.users where email='invasor@gmail.com';")
checa('nao ficou usuario orfao em auth.users', (dx or [{}])[0].get('n') == 0)

print()
print('--- 2. cadastro valido -> tem que entrar como MEMBRO (nao lider) ---')
st, d = http('/auth/v1/signup', 'POST',
             {'email': TESTE_EMAIL, 'password': TESTE_SENHA,
              'data': {'nome': 'QA Seguranca', 'setor': 'Comercial'}})
if st >= 400:
    print('   nao consegui cadastrar:', st, str(d)[:200]); sys.exit(1)
TOKEN = d.get('access_token')
UID = (d.get('user') or {}).get('id')
if not TOKEN:
    st, d = http('/auth/v1/token?grant_type=password', 'POST',
                 {'email': TESTE_EMAIL, 'password': TESTE_SENHA})
    TOKEN = d.get('access_token'); UID = (d.get('user') or {}).get('id')
st, d = sb.run_sql(REF, "select papel, setor from public.profiles where email='%s';" % TESTE_EMAIL)
checa('entrou como membro (nao roubou lideranca)', (d or [{}])[0].get('papel') == 'membro',
      (d or [{}])[0].get('papel'))

print()
print('--- 3. isolamento por setor (usuario e do Comercial) ---')
st, d = http('/rest/v1/experimentos?select=codigo,setor', token=TOKEN)
setores = set(r['setor'] for r in (d or [])) if isinstance(d, list) else {'?'}
checa('so enxerga experimento do proprio setor', setores <= {'Comercial'},
      'viu setores: %s' % (setores or 'nenhum'))

st, d = sb.run_sql(REF, "select id, codigo from public.experimentos where setor='Growth' limit 1;")
alvo = (d or [{}])[0]
if alvo.get('id'):
    st, d = http('/rest/v1/experimentos?id=eq.%s' % alvo['id'], 'PATCH',
                 {'titulo': 'INVADIDO'}, token=TOKEN, prefer='return=representation')
    checa('nao edita experimento de outro setor', not d, 'linhas afetadas: %s' % len(d or []))

    st, d = http('/rest/v1/experimentos?id=eq.%s' % alvo['id'], 'DELETE',
                 token=TOKEN, prefer='return=representation')
    checa('nao exclui experimento de outro setor', not d, 'linhas: %s' % len(d or []))

    st, d = http('/rest/v1/bracos?select=nome&experimento_id=eq.%s' % alvo['id'], token=TOKEN)
    checa('nao le bracos de outro setor', not d, 'linhas: %s' % len(d or []))
else:
    print('   (sem experimento do Growth pra atacar - pulado)')

st, d = http('/rest/v1/experimentos', 'POST',
             {'codigo': 'QA-INVASAO', 'titulo': 'x', 'setor': 'Growth'},
             token=TOKEN, prefer='return=representation')
checa('nao cria experimento em setor alheio', st >= 400, 'HTTP %s' % st)

print()
print('--- 4. escalada de privilegio ---')
st, d = http('/rest/v1/profiles?id=eq.%s' % UID, 'PATCH', {'papel': 'lider'},
             token=TOKEN, prefer='return=representation')
st2, d2 = sb.run_sql(REF, "select papel from public.profiles where email='%s';" % TESTE_EMAIL)
checa('nao consegue se autopromover a lider', (d2 or [{}])[0].get('papel') == 'membro',
      'virou %s' % (d2 or [{}])[0].get('papel'))

st, d = http('/rest/v1/profiles?email=eq.%s' % DONO, 'PATCH', {'papel': 'membro'},
             token=TOKEN, prefer='return=representation')
st2, d2 = sb.run_sql(REF, "select papel from public.profiles where email='%s';" % DONO)
checa('nao consegue rebaixar o lider', (d2 or [{}])[0].get('papel') == 'lider')

# ressurreicao: apaga o proprio perfil e tenta voltar como lider
sb.run_sql(REF, "delete from public.profiles where email='%s';" % TESTE_EMAIL)
st, d = http('/rest/v1/profiles', 'POST',
             {'id': UID, 'nome': 'QA', 'setor': 'Growth',
              'email': TESTE_EMAIL, 'papel': 'lider'},
             token=TOKEN, prefer='return=representation')
checa('excluido nao volta como LIDER', st >= 400, 'HTTP %s' % st)
st, d = http('/rest/v1/profiles', 'POST',
             {'id': UID, 'nome': 'QA Seguranca', 'setor': 'Comercial',
              'email': TESTE_EMAIL, 'papel': 'membro'},
             token=TOKEN, prefer='return=representation')
checa('mas volta como membro (app se recupera)', st < 400, 'HTTP %s' % st)

print()
print('--- 5. integridade dos dados ---')
st, d = sb.run_sql(REF, """
select b.id::text braco, e.id::text exp
from public.bracos b join public.experimentos e on e.id <> b.experimento_id
limit 1;
""")
if d:
    st2, d2 = sb.run_sql(REF, """
    insert into public.resultados (experimento_id, braco_id, data, taxa, valido)
    values ('%s','%s','2026-07-30', 50, true) returning id;
    """ % (d[0]['exp'], d[0]['braco']))
    checa('resultado nao aceita braco de outro experimento', st2 >= 400, 'HTTP %s' % st2)
else:
    print('   (precisa de 2 experimentos pra testar - pulado)')

st, d = sb.run_sql(REF, "update public.profiles set papel='membro' where email='%s';" % DONO)
checa('banco impede tirar o ultimo lider', st >= 400, 'HTTP %s' % st)

print()
print('--- 6. anon key (a que vai no navegador) nao vaza nada ---')
for t in ['profiles', 'experimentos', 'bracos', 'resultados']:
    st, d = http('/rest/v1/%s?select=*' % t)
    checa('anon nao le %s' % t, d == [], '%s linhas' % len(d or []))

print()
print('--- limpeza ---')
sb.run_sql(REF, "delete from public.experimentos where codigo like 'QA-%';")
sb.run_sql(REF, "delete from auth.users where email = '%s';" % TESTE_EMAIL)
st, d = sb.run_sql(REF, """
select (select count(*)::int from public.profiles) perfis,
       (select count(*)::int from auth.users) logins,
       (select string_agg(email||':'||papel, ', ') from public.profiles) quem;
""")
print('   estado final:', d)
ok_dono = DONO in ((d or [{}])[0].get('quem') or '')
checa('o dono continua la e continua lider', ok_dono and 'lider' in (d[0]['quem'] or ''))

print()
print('=' * 70)
print('PASSOU: %d   |   FUROU: %d' % (len(passou), len(falhou)))
if falhou:
    print()
    print('FUROS ABERTOS:')
    for f in falhou:
        print('   -', f)
print('=' * 70)
sys.exit(1 if falhou else 0)
