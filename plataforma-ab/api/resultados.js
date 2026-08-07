/**
 * Leitura pro painel.
 *
 * GET /api/resultados            → todos os testes analisados
 * GET /api/resultados?s=<slug>   → um teste
 *
 * Exige token, igual ao CRUD: o resultado de um teste é informação comercial,
 * e o painel é hospedado num endereço público.
 */

import { criarStore } from '../lib/store.js';
import { analisarTeste, analisarTodos } from '../lib/analise.js';
import { urlDe, json, exigirAdmin } from '../lib/http.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  if (req.method !== 'GET') return json(res, 405, { erro: 'só GET' });
  if (!exigirAdmin(req, res)) return;

  const store = criarStore();
  const q = urlDe(req).searchParams;
  const slug = (q.get('s') || '').trim().toLowerCase();

  try {
    if (slug) {
      const t = await store.obterTeste(slug);
      if (!t) return json(res, 404, { erro: 'teste não existe' });
      return json(res, 200, await analisarTeste(store, t));
    }
    // Sem `?todos=1`, só testes vivos — ver o porquê em lib/analise.js.
    return json(res, 200, await analisarTodos(store, { todos: q.get('todos') === '1' }));
  } catch (e) {
    console.error('[ab] /api/resultados:', e);
    return json(res, 500, { erro: e.message });
  }
}
