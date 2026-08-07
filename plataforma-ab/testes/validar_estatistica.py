"""
Confere a estatistica do JS (lib/estatistica.js) contra rota independente em Python.

Nao usa scipy de proposito: a maquina nao tem, e a stdlib ja da rota exata --
`math.erfc` e `statistics.NormalDist` sao implementacoes independentes da nossa,
e a qui-quadrado tem forma fechada para gl 1..4 (que cobre 2..5 variantes).

Rodar:  python testes/validar_estatistica.py
"""
import json
import math
import os
import subprocess
import sys
from statistics import NormalDist

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ND = NormalDist()

falhas = []
checagens = 0


def cmp(nome, obtido, esperado, tol=1e-9, rel=True):
    global checagens
    checagens += 1
    if esperado == 0:
        erro = abs(obtido - esperado)
    elif rel:
        erro = abs(obtido - esperado) / abs(esperado)
    else:
        erro = abs(obtido - esperado)
    ok = erro <= tol
    if not ok:
        falhas.append((nome, obtido, esperado, erro))
    print('%-4s %-46s js=%-24r py=%-24r erro=%.2e' % (
        'OK' if ok else 'FALHA', nome, obtido, esperado, erro))


def chi2_sf(x, gl):
    """Cauda superior da qui-quadrado, forma fechada para gl 1..4."""
    if gl == 1:
        return math.erfc(math.sqrt(x / 2))
    if gl == 2:
        return math.exp(-x / 2)
    if gl == 3:
        return math.erfc(math.sqrt(x / 2)) + math.sqrt(2 * x / math.pi) * math.exp(-x / 2)
    if gl == 4:
        return math.exp(-x / 2) * (1 + x / 2)
    raise ValueError(gl)


# ── pega os valores do JS ────────────────────────────────────────────────────
casos_erfc = [-4.0, -1.5, -0.3, 0.0, 0.3, 1.5, 2.5, 3.5, 4.5, 6.0]
casos_quantil = [0.001, 0.025, 0.05, 0.5, 0.8, 0.9, 0.975, 0.999]
casos_chi2 = [(0.5, 1), (3.841, 1), (10.83, 1), (2.0, 2), (13.82, 2),
              (7.815, 3), (16.27, 3), (9.488, 4), (18.47, 4)]
casos_z = [(100, 1000, 130, 1000), (12, 300, 25, 305), (5, 50, 5, 50),
           (250, 5000, 300, 5100), (1, 100, 9, 100)]
casos_amostra = [(0.05, 0.20), (0.1237, 0.15), (0.02, 0.5), (0.3, 0.1)]

script = r'''
import { erfc, normalQuantil, chi2P, zTestProporcoes, amostraMinima, msprt, checarSRM }
  from '../lib/estatistica.js';
const saida = {
  erfc: %s.map(x => erfc(x)),
  quantil: %s.map(p => normalQuantil(p)),
  chi2: %s.map(([x, gl]) => chi2P(x, gl)),
  z: %s.map(([ca, na, cb, nb]) => { const r = zTestProporcoes(ca, na, cb, nb); return [r.z, r.p]; }),
  amostra: %s.map(([b, m]) => amostraMinima(b, m)),
  msprt: [[100,1000,130,1000,0.02],[12,300,25,305,0.01],[250,5000,300,5100,0.01]]
          .map(([ca,na,cb,nb,t]) => msprt(ca,na,cb,nb,t).p),
  srm: [[[500,500],[1,1]],[[520,480],[1,1]],[[600,400],[1,1]],[[300,300,300],[1,1,1]]]
          .map(([obs,w]) => checarSRM(obs,w).p),
};
process.stdout.write(JSON.stringify(saida));
''' % (json.dumps(casos_erfc), json.dumps(casos_quantil),
       json.dumps(casos_chi2), json.dumps(casos_z), json.dumps(casos_amostra))

caminho = os.path.join(RAIZ, 'testes', '_tmp_stats.mjs')
with open(caminho, 'w', encoding='utf-8') as f:
    f.write(script)
try:
    proc = subprocess.run([('node.exe' if os.name == 'nt' else 'node'), caminho],
                          capture_output=True, text=True, cwd=os.path.join(RAIZ, 'testes'))
    if proc.returncode != 0:
        print('node falhou:\n', proc.stderr)
        sys.exit(1)
    js = json.loads(proc.stdout)
finally:
    if os.path.exists(caminho):
        os.remove(caminho)

print('=' * 100)
print('1. erfc  (contra math.erfc)')
print('=' * 100)
for x, obtido in zip(casos_erfc, js['erfc']):
    cmp('erfc(%s)' % x, obtido, math.erfc(x), tol=1e-12)

print()
print('=' * 100)
print('2. normalQuantil  (contra NormalDist.inv_cdf)')
print('=' * 100)
for p, obtido in zip(casos_quantil, js['quantil']):
    cmp('quantil(%s)' % p, obtido, ND.inv_cdf(p), tol=1e-9, rel=False)

print()
print('=' * 100)
print('3. chi2P  (contra forma fechada gl 1..4)')
print('=' * 100)
for (x, gl), obtido in zip(casos_chi2, js['chi2']):
    cmp('chi2P(%s, gl=%d)' % (x, gl), obtido, chi2_sf(x, gl), tol=1e-10)

print()
print('=' * 100)
print('4. z-test de duas proporcoes  (formula refeita do zero)')
print('=' * 100)
for (ca, na, cb, nb), (zjs, pjs) in zip(casos_z, js['z']):
    p1, p2 = ca / na, cb / nb
    pool = (ca + cb) / (na + nb)
    se = math.sqrt(pool * (1 - pool) * (1 / na + 1 / nb))
    z = (p2 - p1) / se
    p = 2 * (1 - ND.cdf(abs(z)))
    cmp('z(%d/%d vs %d/%d)' % (ca, na, cb, nb), zjs, z, tol=1e-12)
    cmp('  p bicaudal', pjs, p, tol=1e-9, rel=(p > 1e-12))

print()
print('=' * 100)
print('5. amostra minima  (formula de poder refeita do zero)')
print('=' * 100)
for (b, m), obtido in zip(casos_amostra, js['amostra']):
    p1 = b
    p2 = p1 * (1 + m)
    za = ND.inv_cdf(1 - 0.05 / 2)
    zb = ND.inv_cdf(0.8)
    n = math.ceil(((za + zb) ** 2 * (p1 * (1 - p1) + p2 * (1 - p2))) / (p2 - p1) ** 2)
    cmp('amostra(base=%s, mde=%s)' % (b, m), obtido, n, tol=0, rel=False)

print()
print('=' * 100)
print('6. mSPRT  (formula de Johari/Pekelis/Walsh refeita do zero)')
print('=' * 100)
for (ca, na, cb, nb, tau), obtido in zip(
        [(100, 1000, 130, 1000, 0.02), (12, 300, 25, 305, 0.01), (250, 5000, 300, 5100, 0.01)],
        js['msprt']):
    p1, p2 = ca / na, cb / nb
    pool = (ca + cb) / (na + nb)
    s2 = pool * (1 - pool)
    var = p1 * (1 - p1) / na + p2 * (1 - p2) / nb
    n_ef = 2 * s2 / var
    d = p2 - p1
    den = 2 * s2 + n_ef * tau ** 2
    ln_lam = 0.5 * math.log(2 * s2 / den) + (n_ef ** 2 * tau ** 2 * d * d) / (4 * s2 * den)
    cmp('msprt(%d/%d vs %d/%d, tau=%s)' % (ca, na, cb, nb, tau),
        obtido, min(1, math.exp(-ln_lam)), tol=1e-12)

print()
print('=' * 100)
print('7. SRM  (qui-quadrado refeito do zero)')
print('=' * 100)
for (obs, w), obtido in zip(
        [([500, 500], [1, 1]), ([520, 480], [1, 1]), ([600, 400], [1, 1]),
         ([300, 300, 300], [1, 1, 1])], js['srm']):
    total = sum(obs)
    esp = [total * x / sum(w) for x in w]
    chi2 = sum((o - e) ** 2 / e for o, e in zip(obs, esp))
    cmp('srm(%s)' % obs, obtido, chi2_sf(chi2, len(obs) - 1), tol=1e-10)

print()
print('=' * 100)
if falhas:
    print('%d FALHA(S) de %d checagens:' % (len(falhas), checagens))
    for nome, o, e, err in falhas:
        print('   %-40s js=%r  py=%r  erro=%.3e' % (nome, o, e, err))
    sys.exit(1)
print('TODAS AS %d CHECAGENS PASSARAM -- a estatistica do JS bate com a rota independente.' % checagens)
