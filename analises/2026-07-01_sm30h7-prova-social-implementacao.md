# SM30H7 — Prova social localizada por segmento na Clara

**Sprint SM-30 · Comercial · HIP · Prioridade Média**
Data do plano: 2026-07-01

## Hipótese
Citar um **caso real do nicho do lead** (e da região, quando verdadeiro) na
Apresentação supera o argumento genérico → **mais agendamento**.
Métrica primária: **taxa de agendamento**. Guarda: conversão das reuniões não cair.

## Onde encaixa (complementar às outras 2 tarefas de segmento)
| Tarefa | Etapa do fluxo | Injeta |
|---|---|---|
| GWT-2729 (abertura por dor) | 1 — Abertura | gancho dor→funcionalidade |
| **SM30H7 (prova social)** | **3 — Apresentação** | caso real do nicho + região |
| GWT-2731 (ROI por segmento) | 4 — Objeção de preço | ROI na moeda do nicho |

Nichos (alinhado com a abertura 2729): **Pizzaria, Hamburgueria, Restaurante**.
Genérico (qualquer outro segmento) = comportamento de hoje, byte a byte.

## Arquitetura (reaproveita o padrão do EXP-16 / 2731)
1. **Code node** `Define blocos Etapa 3 (prova social)` — junto do `Define blocos
   Etapa 4`, após `Get a row`, antes do AI Agent. Modo "Run Once for All Items".
   Arquivo: `prompts/Clara IA/sm30h7_code-node_prova-social.js` (sintaxe validada +
   simulado com 4 cenários). Lê `segmento` + `whatsapp`, devolve `bloco_prova_social`.
2. **Região por DDD:** não há cidade/estado na `leads`. O node extrai o DDD do
   `whatsapp` (formato padrão: 13 díg = 55+DDD+nº) → UF. **Honestidade:** só diz
   "aí em <estado/cidade>" quando existe um caso REAL naquela UF; sem match, cita o
   caso do nicho sem geo. Nunca inventa localidade.
3. **Injeção no prompt (Etapa 3):** adicionar a linha
   `{{ $('Define blocos Etapa 3 (prova social)').item.json.bloco_prova_social }}`
   na seção "Etapa 3 — Apresentação" do system message (v2.12).
4. **Flag de disparo `prova_social_aplicada` (bool)** setado pelo prompt SÓ quando a
   Clara entrega o caso — lição do 2731 (gatilho por `ILIKE` deu falso-positivo).
   Requer coluna nova em `leads` + o prompt gravando (igual `abertura_variante`).
   Opcional p/ o A/B de nível (elegibilidade já vem de `segmento`), mas necessário
   pra medir o subconjunto "quem realmente recebeu".

## Rollout
Caminho A (regra fixa, mesma escolha do líder na 2729): os 3 nichos recebem a prova
social; controle = demais nichos; medição por DiD. (Alternativa: 50/50 dentro dos
nichos — decidir com o líder.)

## ⚠️ Tabela de casos reais — PREENCHER (D.O.D item 2)
A Clara **não pode inventar números**. Levantar com CS/Marketing 1–2 casos reais por
nicho e colar no objeto `CASOS` do Code node. Deixe `uf`/`cidade` só quando o caso for
de fato daquela região (habilita o "aí em X"); `uf: null` = caso nacional, sem geo.

| Nicho | Cliente (ref. interna) | UF/Cidade | Número real / resultado | Funcionalidade | Frase da Clara |
|---|---|---|---|---|---|
| Pizzaria | _(pendente)_ | _(pendente)_ | _(pendente)_ | Robô de IA / Meio a Meio | "uma pizzaria que …" |
| Hamburgueria | _(pendente)_ | _(pendente)_ | _(pendente)_ | Robô de IA / Complementos | "uma hamburgueria que …" |
| Restaurante | _(pendente)_ | _(pendente)_ | _(pendente)_ | Mesas/Comandas + QR | "um restaurante que …" |

Enquanto os casos estiverem como `PENDENTE_...`, o node devolve bloco vazio → a Clara
segue com o comportamento atual (seguro; não fala prova social).

## Medição — DiD (baseline congelado maio/2026)
Universo "leads da Clara": `tier IN ('4','5') OR (tier IN ('3','3.1','3.2') AND usuario='clara')`.
Resposta = `count_messages > 1`. Agendamento = `data_agendamento IS NOT NULL`.
**DiD é obrigatório:** os 3 nichos já partem de um nível maior de agendamento.

**Baseline maio/2026 (congelado):**
| Grupo | Leads | Resposta | Agendamento |
|---|---|---|---|
| TESTE (3 nichos) | 738 | 76,2% | **6,2%** |
| CONTROLE (outros) | 1.993 | 76,8% | **2,7%** |

Por nicho (agendamento): Hamburgueria 6,8% (n=381) · Pizzaria 5,9% (n=187) · Restaurante 5,3% (n=170).

**Leitura pós-launch:** `efeito = (agend_teste_pós − 6,2) − (agend_controle_pós − 2,7)`,
rodando a mesma query com `date_created >= data_que_ligou`. Guarda: resposta não cair.
Reporte sempre **total + por nicho** (preferência já registrada).

## D.O.D — mapa de evidências
1. **Print do fluxo no n8n** — você (após colar o Code node + injeção). ✍️
2. **Tabela de casos reais por segmento/região** — a tabela acima, preenchida. ✍️ (bloqueio: casos)
3. **3 conversas reais com o gatilho acionado** — puxo do `conversa` após ligar
   (buscar a frase-âncora do caso, 1 por nicho), como fiz na 2731. 🔎
4. **Vídeo curto explicando a atividade** — você. ✍️

## Pendências
- [ ] Levantar os casos reais (você) → preencher `CASOS` no Code node
- [ ] Confirmar rollout (regra fixa vs 50/50) com o líder
- [ ] (opcional) Criar coluna `prova_social_aplicada` + instruir o prompt a gravar
- [ ] Colar Code node + adicionar a linha na Etapa 3 do prompt e testar na Clara de teste
- [ ] Congelar baseline (feito acima) → ligar → medir DiD
- [ ] Coletar evidências D.O.D (print, tabela, 3 conversas, vídeo)
