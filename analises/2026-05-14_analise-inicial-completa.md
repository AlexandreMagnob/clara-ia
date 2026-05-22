# Análise Inicial Completa — Clara IA

**Data:** 2026-05-14
**Fonte:** Supabase CW Comercial + N8N Workflow

---

## Resumo Executivo

A Clara está ativa e crescendo. Em 3 meses de operação acumulou **8.724 leads** (tier 4–5), com **265 reuniões marcadas** (taxa de agendamento: **3,04%**). O volume semanal subiu de ~100 leads/semana em fevereiro para ~600–700/semana em maio. O pico de reuniões foi de 43/semana (semana de 06/abril), recuando para ~28/semana nas últimas semanas. O campo `status` (ganho/perdido) não está sendo preenchido — isso impede medir a taxa de fechamento real.

---

## 1. Visão Geral dos Leads (Tier 4 e 5)

| Métrica | Valor |
|---|---|
| Total de leads | 8.724 |
| Em atendimento | 7.901 (90,6%) |
| Reuniões marcadas | 265 (3,04%) |
| Leads últimos 30 dias | 2.733 |
| Leads últimos 7 dias | 630 |
| Média de mensagens por lead | 25,4 |
| Média de follow-ups | 1,8 |
| Em break | 0 |
| Ganhos registrados | 0 ⚠️ |
| Perdidos registrados | 0 ⚠️ |

> **Confirmado:** Campo `status` = `on` (virou cliente) ou `lost` (perdido). Pode ser marcado tanto durante a prospecção da Clara quanto após a ligação do closer. Está vazio na base atual — significa que nenhum lead teve status final registrado ainda, ou que o preenchimento não está acontecendo de forma consistente.

---

## 2. Distribuição por Tier (Base Completa — 22.359 leads)

| Tier | Total | Responsável |
|---|---|---|
| 1 | 3.410 | Vendedores humanos |
| 2 | 1.629 | Vendedores humanos |
| 3 | 22 | Vendedores humanos |
| 3.1 | 4.234 | ⚠️ Não definido no briefing |
| 3.2 | 1.883 | ⚠️ Não definido no briefing |
| **4** | **2.972** | **Clara IA** |
| **5** | **5.752** | **Clara IA** |
| null | 2.458 | Sem tier |

> **Confirmado:** Tiers 3.1 e 3.2 são atendidos por vendedores humanos (SDR). A Clara atende **exclusivamente tier 4 e 5**.

---

## 3. Funil de Etapas da Conversa (Tier 4+5)

| Etapa | Total | % | Observação |
|---|---|---|---|
| triagem | 4.427 | 50,7% | ⚠️ Metade dos leads parada aqui |
| abertura | 2.128 | 24,4% | Conversa iniciada mas não avançou |
| qualificacao | 1.697 | 19,5% | Em processo de BANT |
| agendado | 294 | 3,4% | Reunião marcada |
| atendido | 115 | 1,3% | Conversa atendida |
| agendamento | 30 | 0,3% | No processo de agendar |
| direcionado | 21 | 0,2% | Redirecionado (humano?) |
| apresentacao | 12 | 0,1% | Fase de apresentação do produto |

> **Maior gargalo:** 50,7% dos leads estão em `triagem`. Isso pode indicar que o lead chegou mas a Clara não conseguiu iniciar a conversa (mensagem inicial não entregue, lead sem WhatsApp válido, ou lead que não respondeu a abertura).

---

## 4. Tendência Semanal (Últimos 90 dias)

| Semana | Leads Novos | Reuniões |
|---|---|---|
| 09/02 | 104 | 0 |
| 16/02 | 581 | 2 |
| 23/02 | 793 | 2 |
| 02/03 | 637 | 11 |
| 09/03 | 565 | 6 |
| 16/03 | 620 | 20 |
| 23/03 | 633 | 21 |
| 30/03 | 688 | 40 |
| **06/04** | **771** | **43 ← pico** |
| 13/04 | 714 | 20 |
| 20/04 | 633 | 30 |
| 27/04 | 604 | 28 |
| 04/05 | 609 | 28 |
| 11/05 | 410 | 14 |

> **Crescimento:** Volume de leads ~7x maior que no início. Taxa de reuniões cresceu de 0 para ~28–43/semana. A queda na semana de 11/05 é parcial (semana em curso).

---

## 5. Segmentos dos Leads (Tier 4+5)

| Segmento | Total |
|---|---|
| Outro | 1.645 |
| Açaiteria | 1.526 |
| Confeitaria | 1.438 |
| Hamburgueria | 1.074 |
| Lanchonete | 935 |
| Pizzaria | 597 |
| Marmitaria | 593 |
| Restaurante | 550 |
| Pastelaria | 203 |
| Sushi | 119 |

> **Oportunidade:** Açaiteria (1.526) e Confeitaria (1.438) são os maiores segmentos no tier da Clara — vale ter argumentos e casos de uso específicos para esses nichos no prompt.

---

## 6. A/B Test — Modelo LLM

| Modelo | Leads | Reuniões | Taxa Reunião |
|---|---|---|---|
| **Claude** | 412 | 15 | **3,64%** |
| GPT | 712 | 23 | 3,23% |
| (sem modelo) | 7.600 | 227 | 2,99% |

> **Resultado preliminar:** Claude está ganhando (3,64% vs 3,23%), mas a amostra é pequena. A maioria dos leads (7.600) ainda não tem modelo atribuído — considerar aumentar a amostra do A/B test para ter significância estatística.

---

## 7. Temperatura dos Leads

| Temperatura | Leads | Reuniões | Taxa Reunião |
|---|---|---|---|
| Hot | 74 | 48 | **64,9%** |
| Warm | 54 | 30 | **55,6%** |
| Cold | 194 | 14 | 7,2% |

> **Insight crítico:** Hot e Warm têm taxas de reunião altíssimas (65% e 56%), mas apenas **322 leads** têm temperatura classificada — de 8.724. Isso indica que a Clara raramente classifica a temperatura. Se mais leads fossem classificados, daria para priorizar melhor o trabalho de follow-up.

---

## 8. Fontes de Tráfego (UTM — Tier 4+5)

| Fonte | Meio | Leads |
|---|---|---|
| (sem UTM) | — | 2.588 |
| Instagram | paid_social | 1.543 |
| Instagram | paid | 1.060 |
| Google | paidsearch | 984 |
| Instagram | Instagram_Feed | 422 |
| Direto | — | 295 |
| Facebook | paid_social | 283 |
| cardapioweb.com | — | 273 |
| `{{?utm_source=facebook` | paid | 237 ⚠️ |
| Facebook | paid | 194 |
| Instagram | ig | 186 |
| Google | cpc | 150 |
| Instagram | Instagram_Stories | 135 |

> **Bug UTM:** 237 leads têm `utm_source = {{?utm_source=facebook` — variável de template não resolvida na landing page. Esses leads estão com UTM corrompida.

> **Oportunidade:** 2.588 leads sem UTM (29,7%). Melhorar rastreamento para entender de onde vêm.

---

## 9. Motivos de Perda

Nenhum registro encontrado (`status = 'perdido'` não existe na base).

> **Problema:** Sem dados de perda, é impossível saber por que leads não convertem. Recomenda-se implementar preenchimento do campo `motivo_perda` quando a conversa encerra sem agendamento.

---

## Pontos de Atenção Críticos

1. **50,7% dos leads parados em `triagem`** — gargalo na abertura da conversa
2. **`temperatura` preenchida em apenas 322/8.724 leads** — campo subutilizado
3. **Bug de UTM** — 237 leads com `{{?utm_source=facebook` (template não resolvido na landing page)
4. **A/B test LLM com amostra pequena** — 412 (Claude) vs 712 (GPT) vs 7.600 (sem modelo atribuído)
5. **Nó "Analista de CRM"** no canvas do N8N — nó órfão de outro projeto, não está ativo no fluxo da Clara

---

## Oportunidades de Melhoria

1. **Automatizar preenchimento de `temperatura`** — a Clara tem os dados do BANT, poderia classificar em toda conversa
2. **Investigar leads em `triagem`** — entender quantos nunca responderam vs quantos tiveram falha de entrega
3. **Conectar `status` ganho/perdido ao Pipedrive** — trazer o dado de fechamento para o Supabase
4. **Normalizar UTMs** — padronizar naming convention (ig/Instagram/facebook/fb são a mesma fonte)
5. **Aumentar amostra do A/B test** — para ter confiança estatística no resultado Claude vs GPT
