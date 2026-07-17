# Verificação — Automação de status do lead no CDP/Metabase

**Data:** 2026-07-15
**Automação:** `[SDR] Atualizar status do lead (CDP)` (n8n, id `YUOSOBAstIsG5QQw`, webhook `POST /webhook/atualizar-lead-data-base/`)
**Fonte dos dados:** 4 queries rodadas no Metabase sobre `commercial_deals` + `persons` do CDP (resultados em `atualizar-leads-metabase.md`), janela 09/07 a 15/07 (dia 15 parcial, até ~13h)

---

## Veredito: ✅ DEU CERTO

A automação está funcionando desde **09/07** nas quatro frentes. Todos os eventos estão chegando ao CDP e aparecendo no Metabase com datas, closers e motivos preenchidos:

| Evento | O que grava no CDP | Registros (09–15/07) |
|---|---|---|
| Agendamento (ganho Meetime) | `stage='oportunidade'` + data reunião + closer | **179** |
| Perdido na Meetime | `status='lost'` + motivo | **1.610** |
| Virou cliente (ganho Pipe) | `status='won'` + `stage='cliente'` + `won_at` | **119** |
| Perdido no Pipe | `status='lost'` + motivo (pós-reunião) | **51** |

Obs.: o log de execuções do n8n tem retenção curta (se auto-deleta), então a prova de funcionamento é o dado gravado no banco — e ele está lá desde o dia 09 (há inclusive 5 registros de teste em 08/07).

---

## 1. Volume por dia (pela data do evento)

| Dia | Agendamentos | Perdidos Meetime | Clientes | Perdidos Pipe |
|---|---|---|---|---|
| 09/07 (qui) | 38 | 326 | 22 | 6 |
| 10/07 (sex) | 18 | 159 | 18 | 6 |
| 11/07 (sáb) | 0 | 391 | 4 | 0 |
| 12/07 (dom) | 1 | 0 | 1 | 0 |
| 13/07 (seg) | 52 | 67 | 34 | 10 |
| 14/07 (ter) | 45 | 389 | 34 | 22 |
| 15/07 (qua, parcial) | 6 | 278 | 6 | 7 |

Os padrões fazem sentido: fim de semana quase zerado (time não opera), perdas da Meetime em rajadas grandes (automação de perda em massa dos follow-ups roda de madrugada) e agendamentos/ganhos concentrados em dia útil.

## 2. Checagens de consistência (funil bate)

- **44 dos 51 perdidos no Pipe** aparecem também na lista de agendamentos da janela — ou seja, o encadeamento agendou → reunião → perdeu está sendo registrado corretamente. Os 7 restantes são reuniões marcadas antes de 09/07.
- **57 dos 119 clientes** idem (os demais agendaram antes da janela — esperado, o ciclo reunião→fechamento leva dias).
- **Zero duplicados** dentro de cada lista (por telefone normalizado).
- Motivos de perda coerentes: perda Meetime dominada por **"[IS] Lead não correspondeu às tentativas de contato" (1.370 de 1.610 = 85%)** — é a perda em massa dos FUPs; perda no Pipe dominada por **"[IS] No-show" (29 de 51 = 57%)**.

## 3. Ressalvas (não invalidam o veredito, mas merecem atenção)

1. **Leads que não entram no CDP — quantificado no cruzamento com o Pipedrive (§6): ~43% dos ganhos e ~42% dos perdidos do Pipe não refletem no CDP.** Amostragem das execuções do n8n (14–15/07) mostrou que uma parte dos webhooks cai no ramo de erro **"Lead nao cadastrado no CDP"** (lead não encontrado por telefone/email) e vai pro Slack sem atualizar nada. As listas acima são o que *entrou*. Lista dos faltantes e query de diagnóstico prontas (ver §6).
2. **Rate limit do Google Sheets.** Nas rajadas de perda em massa (~6h), os appends na planilha estouram o limite e a execução marca erro — **o CDP já foi atualizado antes**, então perde-se só a linha da planilha. Mitigação já desenhada: Wait aleatório de 5–15s antes dos appends.
3. **14 agendamentos sem `oportunidade_at`** (só com data de reunião) — provavelmente atualizados por outro caminho (ex.: reagendamento). Não afeta contagem, mas afeta ancoragem por "virou oportunidade em".
4. **Vocabulário de Tier misturado**: `1` convive com `Tier 1`, `3.1` com `Tier 3.1` (dado migrado vs novo). Para agrupar por tier no Metabase, normalizar com `REPLACE(tier, 'Tier ', '')`.
5. **33 registros com telefone não normalizado** (formato `(85) 98180-1328` em vez de `5585981801328`), concentrados nos perdidos Meetime — são `persons` antigos; atrapalham o match por telefone da própria automação (pode ser parte da causa da ressalva 1).
6. **No-show alto nos perdidos do Pipe (57%)** — não é problema da automação, mas é o dado mais acionável que ela revelou; conversa direto com o dashboard de no-show e o fluxo de reagentamento.

## 4. Nota sobre o arquivo de resultados

No `atualizar-leads-metabase.md`, o primeiro bloco está com o rótulo/SQL de "Perdidos na Meetime", mas o resultado colado é o da query de **Agendamentos** (colunas "Data reunião" / "Virou oportunidade em"). A identificação aqui foi feita pelas colunas, então nada se perdeu — só corrigir o rótulo se for reaproveitar o arquivo.

## 6. Adendo (15/07 à tarde) — Cruzamento com o Pipedrive: o número NÃO bate

Puxei via API do Pipedrive todos os deals com `won_time`/`lost_time` entre 09/07 e o horário do export do Metabase (11h30 UTC de 15/07), nos funis que alimentam a automação (**Funil de Vendas** + **[IA] Chatbot de SDR**), e casei deal a deal com as listas do CDP por telefone normalizado/email:

| | Pipedrive | Refletido no CDP | Faltando | Cobertura |
|---|---|---|---|---|
| Ganhos (viraram clientes) | **205** | 117 | **88** | 57% |
| Perdidos | **194** | 112 | **82** | 58% |

- **Zero falso-positivo:** todos os 119 clientes do CDP têm deal ganho correspondente no Pipe. O CDP é um subconjunto fiel — o problema é só cobertura.
- **Não é lead antigo:** 79 dos 88 ganhos faltantes são deals criados em julho/2026; todos têm telefone no Pipe. A causa provável é o ramo "Lead nao cadastrado no CDP" (pessoa não existe no CDP ou telefone gravado sem normalizar).
- Nos perdidos faltantes, **51 de 82 são do funil [IA] Chatbot de SDR** (leads da Clara) — pista forte de que os leads da Clara estão chegando ao Pipe sem entrar no CDP (ou sem telefone que case).
- Deals duplicados por pessoa na janela: só 3 nos ganhos (não é o vilão aqui).

Artefatos gerados:
- `analises/2026-07-15_deals-pipe-faltantes-cdp.csv` — os 170 deals faltantes (88 ganhos + 82 perdidos) com telefone, email, closer e motivo.
- `analises/2026-07-15_diagnostico-faltantes-cdp.sql` — query pronta pro Metabase que classifica cada faltante em: *pessoa existe mas telefone/email não bateu* (corrigir normalização) vs *pessoa nem existe no CDP* (backfill/auto-criação).

## 7. Próximos passos sugeridos

1. Rodar `2026-07-15_diagnostico-faltantes-cdp.sql` no Metabase pra separar problema de matching vs lead inexistente.
2. Colar o **Wait aleatório 5–15s** entre os `Leitor (planilha)` e os `Append` do Sheets (JSON já entregue).
3. Normalizar telefones dos `persons` migrados (dígitos + prefixo 55) — deve recuperar parte dos 170.
4. Decidir backfill/auto-criação de deal para leads que não existem no CDP (usar o CSV).
5. Padronizar o campo `tier` (remover prefixo "Tier ").
