# Origem e tier dos leads — registro de execução das correções

**Período de execução:** 22 e 23/07/2026
**Problema atacado:** deals nascendo sem origem de mídia e sem tier no Pipedrive — 20% do funil de julho cego, 27% das vendas sem atribuição, e lista de 36 ganhos de junho sem origem levantada pela liderança de closers.
**Diagnóstico completo:** `analises/2026-07-22_mapeamento-origem-leads.md`
**Horários em Brasília.**

---

## Resumo executivo

O problema tinha três causas — regressão de abril/2026 no n8n que parou de copiar UTMs pro deal, carimbo automático "Site/Contratação" do Pipedrive mascarando deals vazios, e portas de entrada sem classificação de tier. Em dois dias foram aplicadas **três correções estruturais** (deal nasce preenchido) **+ um vigia diário** (pega o que escapar) **+ quatro retroativos** (junho e julho, UTM e tier). Placar: **921 deals enriquecidos retroativamente com zero erros**, atribuição das vendas de julho de ~45% para ~90%, tier da lista da liderança fechado em 36/36.

---

## 1. Correções estruturais (deal novo nasce preenchido)

| # | O quê | Onde | Quando |
|---|---|---|---|
| 1 | **Reativação do mapeamento de UTM+tier no agendamento da Clara** — o subworkflow que cria o deal voltou a copiar utm_source/medium/campaign/content, gclid, fbclid, tier, faturamento e segmento da linha do Supabase que ele já consultava (regressão de abr/2026; o nó antigo com o bloco estava desabilitado). A duplicata enviada ao closer herda os campos | n8n · `[SDR] Verificação e criação de lead no Pipedrive` (`L1IPQzEV6rk9IovV`) | 22/07 16h10 |
| 2 | **Tier na adição manual de parcerias** — os 2 nós de criação passaram a gravar tier condicional: Agente de Parcerias preenchido → `Agentes`, senão → `Adição manual` | n8n · `[PAR][MAIN][ADICAO]` (`9XuS5237ROvgJBc5`) | 23/07 |
| 3 | **12 opções novas de campo** — `utm_source` ganhou direto, outros, meta, cardapioweb_com, bing, chatgpt, seo, portal_cardapioweb, brave, yahoo, claude (fontes reais que a RD conhece e o campo não tinha); Identificador de origem ganhou **"RD retroativo"**, a marca de auditoria de todo dado enriquecido | Pipedrive · campos 12582 e 12729 | 22/07 |

## 2. Vigia diário (pega o que escapar)

Workflow novo **`[SDR][WORKER] Vigia de origem`** (`aNYzpmBpSylpWeuN`), todo dia às 07h:

- Varre os deals do funil de vendas criados nos últimos 3 dias com rastreio 100% vazio **ou** tier vazio (cada deal tem 3 chances antes de ficar pra trás)
- **UTM**: busca o contato na RD por email e grava fonte/medium/campanha/gclid/fbclid + marca "RD retroativo"
- **Tier em 3 camadas**: regra de negócio (parceria → `Agentes`, criação manual → `Adição manual`) → `cf_tier_atual` da RD → tabela `leads` do Supabase (match por whatsapp)
- Escrita separada em dois nós — deal que só falta tier nunca tem a UTM tocada, e vice-versa
- Construído com os nodes oficiais (Pipedrive e Supabase) e as credenciais centrais da casa; tratador de erros padrão plugado
- Export versionado em `automacoes/tier-e-roteamento/tier-e-roteamento_vigia-origem-rd.json`
- **Estreia validada 23/07**: 88 deals sem origem → 39 enriquecidos (meta 15, google 12, direto 6…), auditoria 39/39 corretos

## 3. Retroativos (consertam o estoque)

| Rodada | Universo | Gravados | Erros |
|---|---|---|---|
| UTM julho (22/07) | 305 deals cegos de 01–22/07 | **209** (68,5% — fonte real: direto 30%, google 28%, meta, bing, chatgpt…) | 0 |
| Tier julho (23/07) | 129 sem tier com pessoa | **129 (100%)** — Agentes 62, RD 45, Adição manual 22 | 0 |
| Junho completo (23/07) | 1.003 deals com lacuna de 2.447 do mês | **579** (378 UTM + 238 tier) | 0 |
| Avulsos da lista da liderança (set/25–mai/26) | 4 fora das janelas | **4 tiers** | 0 |

Regras seguidas em todas: dry run antes, releitura de cada deal na hora de gravar, **só preenche campo vazio** (nada sobrescrito), throttle, log deal a deal. Todo enriquecimento de dado carrega a marca "RD retroativo".

**Lista dos 36 da liderança de closers** (ganhos de junho sem origem): **tier 36/36 · origem 24/36**. Os 12 sem origem não existem em RD, Meetime nem Supabase — entraram por WhatsApp/contato direto sem registro; não há dado a recuperar, é processo.

## 4. Resultado consolidado

- **Julho**: atribuição das vendas de ~45% para **~90%**; grupo cego caiu de 305 para menos de 100 deals, e o vigia segue comendo o resto diariamente
- **Junho**: +378 origens e +242 tiers que não existiam; recuperação de UTM menor que julho (40% vs 68,5%) porque lead antigo some da RD — quanto mais cedo o vigia pega, mais salva
- **Descoberta de brinde**: a "porta de API sem classificação" que gerava cliente sem tier era o próprio fluxo de adição manual de parcerias — corrigido (item 1.2)

## 5. O que ainda depende de decisão

- **Criação manual por closer** — única fonte de "escuro" restante (12 dos 36 da lista são isso). Proposta: canal e tier obrigatórios na criação. Muda processo do time comercial.
- **Deals-esqueleto** — ~400/mês criados via API sem pessoa e abandonados em "Reunião Marcada", poluindo o funil (investigação da causa em andamento em frente separada).
- **Template de UTM do Meta Ads** — macro `{campaignname}` não resolvida e `utm_source` ausente em parte das campanhas; corrigir no gerenciador de anúncios elimina a dependência do enriquecimento pra mídia Meta.

## 6. Reversibilidade e artefatos

- Backups pré-mudança dos 3 workflows alterados (scratchpad da sessão)
- Logs completos dos 4 retroativos (`retro_aplicacao_log.csv`, `retro_tier_log.csv`, `junho_apply_log.csv`)
- Tudo que foi enriquecido é filtrável no Pipedrive por **Identificador de origem = "RD retroativo"**
- Censo e cruzamentos em `analises/dados/2026-07-22_*.csv`
