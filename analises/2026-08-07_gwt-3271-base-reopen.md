# GWT-3271 — Base reopen segmentada (Pipedrive + Kommo)

**Data:** 07/08/2026 · **Responsável:** Alexandre Magno · **Destino:** Gerardo (oferta e disparo)
**Status:** verificado pelo cético-de-número em 2 rodadas, ambas CONFIRMADAS — os 5 achados
dele (cliente DDD-55 vazada, quarentena furada pela porta Kommo, empresa vazia, fone em formato
de operadora, parado com deal vivo no mesmo fone) estão corrigidos nesta versão, que bate exata
com a reconstrução independente dele.

## Resultado

**11.700 leads únicos prontos pra disparo**, todos com 30+ dias sem movimento:

| Origem | Motivo | Leads |
|---|---|---|
| Pipedrive (Funil de Vendas) | No-show | 1.059 |
| Pipedrive (Funil de Vendas) | Perdido pelo closer | 1.263 |
| Pipedrive (Funil de Vendas) | Deal aberto parado | 10 |
| Kommo (SDR/Clara) | Sumiu na conversa | 9.368 |
| **Total** | | **11.700** |

Recência (dias desde o último contato): 30–60d = 3.889 · 60–90d = 3.313 · 90–120d = 2.877 · 120d+ = 1.621.

Volume por tier na planilha `dados/2026-08-07_gwt-3271-base-reopen-volumes.csv`.
Base completa pra disparo em `dados/2026-08-07_gwt-3271-base-reopen-disparo.csv`.

## Critérios de corte (D.O.D item 1)

Decididos com o Alexandre em 07/08/2026:

1. **Janela:** entrada no funil de 01/01/2026 em diante. Na prática a base Kommo cobre
   abril→hoje (a tabela `leads` do Supabase nasce em abril/2026); a base Pipedrive cobre
   o ano todo. A coluna `recencia_dias` permite ao Gerardo cortar por recência no disparo.
2. **"Travado" = 30+ dias sem movimento** (corte em 08/07/2026). Vale para os três baldes:
   deal parado, lead sumido e também como **quarentena dos perdidos** — no-show/perdido com
   menos de 30 dias ainda está na régua de recuperação do closer e não entra (693 deals ficaram
   de fora). A quarentena vale **por telefone e por qualquer porta**: lead cujo fone tem perda
   fresca no Funil de Vendas também não entra pela base Kommo (mais 88 fora por aí).
3. **Pipedrive — só o Funil de Vendas (pipeline 2)**, que é o funil dos closers:
   - **No-show:** deal `lost` com motivo contendo "No-show" (ex.: `[IS] No-show`).
   - **Perdido:** demais motivos de perda, exceto lixo (duplicado, teste, remarcação, motivo
     vazio) e exceto perdas de outras operações que vazam pro funil (prefixos `[REP]`
     representantes, `[PAR]` parcerias, `[RH]`, `[CLO]` upsell).
   - **Parado:** deal `open` com contato, sem atividade futura marcada e sem atividade real
     há 30+ dias. Deu só 10 leads — closer fecha ou perde rápido, quase não deixa deal apodrecer.
4. **Kommo (via Supabase, tabela `leads`)** — quem conversou e sumiu:
   - Respondeu de fato: `count_messages >= 2`.
   - Nunca chegou ao closer: sem deal no pipeline 2 (deal de intake em outros funis, como o
     `[IA] Chatbot de SDR`, não desclassifica — sem essa correção os tiers 4/5 sumiam da base).
   - Sumiu: última mensagem antes de 08/07/2026 (`date_updated`, validado contra o timestamp
     da última linha da conversa).
5. **Exclusões globais:**
   - **Já é cliente:** telefone ou person com qualquer deal ganho no histórico todo, em
     qualquer funil (47.371 deals won conferidos) → 1.869 leads removidos. Telefones são
     comparados normalizados (DDD + últimos 8 dígitos, imune ao nono dígito e ao +55; DDD 55
     tratado sem confundir com código do país).
   - **Closer trabalhando:** telefone com deal aberto vivo no Funil de Vendas → 315 removidos.
   - **Deals-fantasma do Glauton:** 2.371 deals abertos sem contato (artefato conhecido,
     estancado em 23/07) → fora.
   - Leads de teste, telefone da Clara (31971055646), telefones inválidos → fora.
   - **Dedupe por telefone** (mesma normalização), dentro e entre origens. Prioridade quando o
     lead aparece 2x: no-show > perdido > parado > Kommo (469 estavam nas duas origens;
     prevalece o Pipedrive, que tem mais contexto).

## Formato do disparo (D.O.D item 3)

CSV UTF-8 (abre direto no Excel/Sheets), uma linha por lead, colunas:
`nome, whatsapp, email, empresa, segmento, tier, origem, motivo, submotivo, ultimo_contato,
recencia_dias, passou_ia, link` — o `submotivo` carrega o motivo de perda original (ex.:
"[IS][N] Lead quer fechar no futuro"), que serve pra segmentar a oferta; o `link` abre o
deal no Pipedrive ou o lead no Kommo.

## Funil de descarte (auditoria)

Dos candidatos brutos ao corte final: 2.371 fantasmas · 1.869 já clientes · 781 em quarentena
(693 deals com perda <30d + 88 pela quarentena por telefone) · 469 dedupe entre origens ·
316 com closer trabalhando · 514 lixo/outras operações/teste/sem telefone/motivo vazio. Contagem completa no script e nos dados brutos (scratchpad da
sessão, `gwt3271/`).

## Ressalvas

- Exclusão de cliente é pelo Pipedrive (deal won). Cliente que nunca passou pelo Pipedrive
  não é detectado — o método completo PD+RD+Meetime não rodou nesta base (11,7k leads);
  se o Gerardo quiser blindar, roda-se a checagem na fatia que ele escolher pro disparo.
- **`empresa` vem vazia em 2.893 linhas (25%)** — o lead real existe, mas nem o Supabase nem
  a organização do Pipedrive têm o nome do negócio. Template de disparo não pode assumir a
  coluna preenchida.
- `tier` do lado Pipedrive tem 125 "(sem tier)" — deals antigos sem o campo preenchido.
- A base Kommo pré-06/06 não distingue Clara × SDR humano (campo `usuario` só existe desde
  então); o `submotivo` marca "pre-06/06" nesses casos.
- Cortes de data comparam timestamps em UTC; a fronteira dos 30 dias desloca ±3h vs Brasília
  (efeito só na borda, na direção conservadora).
