// ─────────────────────────────────────────────────────────────────────────
// SM30H7 · Code node "Define blocos Etapa 3 (prova social)"
// Posição no fluxo: junto do "Define blocos Etapa 4 (A/B preço)", após "Get a
// row" e antes do AI Agent (Clara). Modo: "Run Once for All Items".
//
// HIPÓTESE: prova social concreta do nicho (+ região quando verdadeira) na
// Apresentação (Etapa 3) supera o argumento genérico → mais agendamento.
//
// Lê `segmento` e `whatsapp` do lead e devolve:
//   - bloco_prova_social      → trecho pronto pra injetar na Etapa 3 do prompt
//   - prova_social_disponivel → true/false (houve caso pro nicho?)
//   - prova_social_segmento   → nicho normalizado usado (ou 'generico')
//   - prova_social_uf         → UF inferida pelo DDD (ou null)
//   - prova_social_localizada → true se o caso citado é da MESMA UF do lead
//
// Regra de honestidade: só usamos "aí em <estado>" quando existe um caso REAL
// naquela UF. Sem match de UF → cita o caso mais forte do nicho, sem geo.
// Nichos fora dos 3 escolhidos → bloco_prova_social = '' (comportamento atual).
// ─────────────────────────────────────────────────────────────────────────

// ── 1) Entradas ───────────────────────────────────────────────────────────
const row = $('Get a row').item.json;
const segRaw = (row.segmento || '').toString();
const seg = segRaw
  .toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '') // tira acento
  .trim();

// ── 2) DDD → UF (só pra localizar a prova social quando o caso for da UF) ──
const digits = (row.whatsapp || '').toString().replace(/\D/g, '');
// Formato padrão da base: 13 dígitos = 55 + DDD(2) + número(9)
const ddd = digits.length >= 4 ? digits.slice(2, 4) : null;

const DDD_UF = {
  '11':'SP','12':'SP','13':'SP','14':'SP','15':'SP','16':'SP','17':'SP','18':'SP','19':'SP',
  '21':'RJ','22':'RJ','24':'RJ',
  '27':'ES','28':'ES',
  '31':'MG','32':'MG','33':'MG','34':'MG','35':'MG','37':'MG','38':'MG',
  '41':'PR','42':'PR','43':'PR','44':'PR','45':'PR','46':'PR',
  '47':'SC','48':'SC','49':'SC',
  '51':'RS','53':'RS','54':'RS','55':'RS',
  '61':'DF','62':'GO','64':'GO','63':'TO','65':'MT','66':'MT','67':'MS',
  '68':'AC','69':'RO',
  '71':'BA','73':'BA','74':'BA','75':'BA','77':'BA','79':'SE',
  '81':'PE','87':'PE','82':'AL','83':'PB','84':'RN','85':'CE','88':'CE','86':'PI','89':'PI',
  '91':'PA','93':'PA','94':'PA','92':'AM','97':'AM','95':'RR','96':'AP','98':'MA','99':'MA',
};
const uf = ddd ? (DDD_UF[ddd] || null) : null;

// Locução pronta com a preposição certa por estado (evita "aí em Bahia").
// Uso: `aí ${UF_LOC[uf]}` → "aí em São Paulo", "aí na Bahia", "aí no Paraná".
const UF_LOC = {
  SP:'em São Paulo', RJ:'no Rio de Janeiro', ES:'no Espírito Santo', MG:'em Minas Gerais',
  PR:'no Paraná', SC:'em Santa Catarina', RS:'no Rio Grande do Sul', DF:'no Distrito Federal',
  GO:'em Goiás', TO:'no Tocantins', MT:'no Mato Grosso', MS:'no Mato Grosso do Sul',
  AC:'no Acre', RO:'em Rondônia', BA:'na Bahia', SE:'em Sergipe', PE:'em Pernambuco', AL:'em Alagoas',
  PB:'na Paraíba', RN:'no Rio Grande do Norte', CE:'no Ceará', PI:'no Piauí', PA:'no Pará',
  AM:'no Amazonas', RR:'em Roraima', AP:'no Amapá', MA:'no Maranhão',
};

// ── 3) Casos reais por nicho ───────────────────────────────────────────────
// ⚠️ PENDENTE: substituir os placeholders por casos REAIS (CS/Marketing).
//    Cada caso: { uf, texto }. `texto` = o que a Clara fala (1 frase, número
//    concreto e VERDADEIRO, SEM geo — a região é montada pela UF_LOC). Preencha
//    `uf` com o estado real do cliente (habilita o "aí <estado>"); `uf: null` =
//    caso nacional, citado sem geo. Ordem = prioridade: o 1º é o fallback quando
//    não há caso da mesma UF do lead.
const CASOS = {
  pizzaria: [
    // { uf: 'SP', texto: 'uma pizzaria que [PENDENTE: nº real] com o Robô de IA no pico de sexta e sábado' },
    { uf: null, texto: 'PENDENTE_CASO_REAL_PIZZARIA' },
  ],
  hamburgueria: [
    { uf: null, texto: 'PENDENTE_CASO_REAL_HAMBURGUERIA' },
  ],
  restaurante: [
    { uf: null, texto: 'PENDENTE_CASO_REAL_RESTAURANTE' },
  ],
};

const NICHOS = { pizzaria: 'pizzaria', hamburgueria: 'hamburgueria', restaurante: 'restaurante' };
const nicho = NICHOS[seg] || 'generico';

// ── 4) Seleciona o caso: prioriza mesma UF (localiza), senão o mais forte ──
let bloco_prova_social = '';
let prova_social_disponivel = false;
let prova_social_localizada = false;

if (nicho !== 'generico') {
  const lista = (CASOS[nicho] || []).filter(c => c && c.texto && !c.texto.startsWith('PENDENTE_'));
  if (lista.length) {
    prova_social_disponivel = true;
    const doEstado = uf ? lista.find(c => c.uf === uf) : null;
    const caso = doEstado || lista[0];
    prova_social_localizada = !!doEstado;

    // Geo por ESTADO (decisão: não usar cidade). Só quando o caso é da UF do lead.
    const geo = prova_social_localizada && UF_LOC[uf] ? ` aí ${UF_LOC[uf]}` : '';

    // Instrução p/ a Clara (não é fala literal — ela adapta ao tom da conversa)
    bloco_prova_social = `### Prova social do segmento (Etapa 3 — Apresentação)
Ao apresentar a solução e conectar a dor à funcionalidade, ancore com UM caso
concreto e verdadeiro do mesmo segmento do lead (${nicho}). Use naturalmente,
1 frase, sem exagerar e sem prometer resultado garantido:
- Caso a citar: "${caso.texto}"${geo ? `\n- Localização (verdadeira, use só assim): "${geo.trim()}"` : ''}
- Fale a prova social UMA vez, logo após conectar a dor à funcionalidade.
- Depois de entregar o caso, marque no lead: prova_social_aplicada = true.
- Nunca invente número, cidade ou cliente. Se soar forçado, siga sem a prova social.`;
  }
}

// ── 5) Saída (eco pra auditoria/medição) ───────────────────────────────────
return [{
  json: {
    prova_social_segmento: nicho,
    prova_social_uf: uf,
    prova_social_disponivel,
    prova_social_localizada,
    bloco_prova_social,
  },
}];
