/**
 * CRUD dos testes. Tudo aqui exige `X-AB-Token` (env `AB_ADMIN_TOKEN`).
 *
 * GET     /api/testes           lista
 * GET     /api/testes?s=<slug>  um
 * POST    /api/testes           cria ou atualiza (valida antes)
 * DELETE  /api/testes?s=<slug>  remove
 *
 * A validação de `lib/config.js` roda AQUI, na entrada — inclusive as travas de
 * "não mexer com o teste rodando". Deixar isso só no painel não adianta: o
 * endpoint é público e qualquer cliente com o token gravaria direto.
 */

import { criarStore } from '../lib/store.js';
import { validarTeste, normalizarTeste } from '../lib/config.js';
import { urlDe, lerCorpo, json, exigirAdmin } from '../lib/http.js';
import { agora } from '../lib/tempo.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  if (!exigirAdmin(req, res)) return;

  const url = urlDe(req);
  const slug = (url.searchParams.get('s') || '').trim().toLowerCase();
  const store = criarStore();

  try {
    if (req.method === 'GET') {
      if (slug) {
        const t = await store.obterTeste(slug);
        return t ? json(res, 200, t) : json(res, 404, { erro: 'não existe' });
      }
      return json(res, 200, await store.listarTestes());
    }

    if (req.method === 'POST') {
      const corpo = await lerCorpo(req);
      if (corpo === null || typeof corpo !== 'object' || Array.isArray(corpo)) {
        return json(res, 400, { erro: 'corpo tem que ser um objeto JSON' });
      }
      const anterior = corpo.slug ? await store.obterTeste(String(corpo.slug).toLowerCase()) : null;

      const v = validarTeste(corpo, { anterior });
      if (!v.ok) return json(res, 422, { erro: 'configuração inválida', detalhes: v.erros });

      const t = normalizarTeste(corpo, { anterior });

      // Carimba as transições de status. `iniciado_em` só é gravado uma vez —
      // pausar e voltar não reinicia a contagem de dias do teste.
      if (t.status === 'rodando' && !t.iniciado_em) t.iniciado_em = agora();
      if (t.status === 'encerrado' && !t.encerrado_em) t.encerrado_em = agora();
      if (t.status !== 'encerrado') t.encerrado_em = null;

      await store.salvarTeste(t);
      return json(res, anterior ? 200 : 201, t);
    }

    if (req.method === 'DELETE') {
      if (!slug) return json(res, 400, { erro: 'falta ?s=<slug>' });
      const t = await store.obterTeste(slug);
      if (!t) return json(res, 404, { erro: 'não existe' });
      if (t.status === 'rodando') {
        return json(res, 409, { erro: 'pause ou encerre o teste antes de apagar' });
      }
      // `ab_eventos` tem `on delete cascade`: apagar o teste leva junto TODO o
      // dado bruto do experimento, que é a única cópia. Por isso a confirmação
      // é explícita e repete o slug — clique errado não pode apagar histórico.
      const eventos = (await store.eventosDoTeste(slug)).length;
      if (eventos > 0 && url.searchParams.get('confirmar') !== slug) {
        return json(res, 409, {
          erro: `este teste tem ${eventos} eventos, e apagá-lo apaga todos junto (cascade)`,
          como: `repita o slug para confirmar: DELETE /api/testes?s=${slug}&confirmar=${slug}`,
          eventos,
        });
      }
      await store.removerTeste(slug);
      return json(res, 200, { ok: true, eventos_apagados: eventos });
    }

    return json(res, 405, { erro: 'método não suportado' });
  } catch (e) {
    console.error('[ab] /api/testes:', e);
    return json(res, 500, { erro: e.message });
  }
}
