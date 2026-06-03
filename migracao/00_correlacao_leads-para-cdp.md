# Correlação: `leads` (Supabase) → Schema CDP (Postgres)

> Documento-base da migração Supabase → Postgres do projeto Clara IA.
> Gerado a partir da estrutura real da tabela `public.leads` (projeto `CW - Comercial`, 28.368 linhas) e do schema CDP de destino.
> Data: 2026-06-03

---

## 1. Mudança estrutural (o ponto mais importante)

Hoje **tudo vive em 1 tabela `leads`** (66 colunas, 1 linha = 1 lead). `whatsapp` é `UNIQUE`, então **1 linha ≈ 1 pessoa ≈ 1 negócio**.

No CDP, cada linha de `leads` se decompõe em vários registros:

```
1 linha de leads
   ├── 1  persons                         (identidade do contato — chave: whatsapp/telephone)
   ├── 1  commercial_deals                (o negócio/oportunidade — herda o lead_id)
   ├── 1  commercial_conversations        (a thread da conversa)
   │      └── N commercial_conversation_messages  (parse do campo `conversa`)
   └── N  commercial_activities           (reunião de data_agendamento, follow-ups, repasse)
   + FKs para users (SDR/closer) e companies (resolvidas, não copiadas)
```

**Decisões de chave:**
- `leads.lead_id` (uuid) → vira `commercial_deals.id`. Mantém rastreabilidade.
- `leads.whatsapp` (UNIQUE) → chave natural de `persons.telephone` (dedupe na migração).
- `closer` / `closer_email` / `usuario` → **resolver** para `users.id` (não copiar texto).
- `empresa` (texto livre) **≠** `companies` (por `company_id` do sistema). Ver §4.

---

## 2. Mapa campo-a-campo

### → `persons` (contato)
| leads | persons | obs |
|---|---|---|
| `name` | `name` | direto |
| `whatsapp` (UNIQUE) | `telephone` | **chave natural** de dedupe |
| `email` | `email` | direto |
| `date_created` | `created_at` | direto |
| `date_updated` | `updated_at` | direto |
| `empresa` (texto) | — | sem campo de nome de empresa em persons; ver §4 (→ `notes` ou `custom_properties` do deal) |

### → `commercial_deals` (o negócio) — destino da maioria
| leads | commercial_deals | conversão |
|---|---|---|
| `lead_id` | `id` | direto (uuid) |
| `etapa_conversa` | `stage` | valores: abertura/triagem/qualificacao/apresentacao/agendamento/agendado/atendido/direcionado/encerrado |
| `status` | `status` | **normalizar** → ver §3.1 |
| `tier` | `tier` | direto (texto: 1,2,3,3.1,3.2,4,5) |
| `segmento` | `segment` | direto |
| `faturamento` | `revenue_range` | direto |
| `need` | `need` | direto |
| `budget` | `budget` | direto |
| `authority` | `authority` | direto |
| `timing` | `timing` | direto |
| `onde_nos_conheceu` | `where_met_us` | direto |
| `formato_atendimento` | `service_format` | direto (Delivery/Salão/Ambos + texto livre) |
| `ja_usa_concorrente` | `uses_competitor` | ⚠️ **mismatch** — ver §3.2 |
| `value` | `deal_value` | direto (numeric) |
| `motivo_perda` | `loss_reason` | direto |
| `temperatura` | `temperature` | direto (hot/warm/cold) |
| `plano_sugerido` | `suggested_plan` | direto |
| `modulos` | `interested_modules` | **text → text[]** (split por vírgula) |
| `fidelidade` | `fidelity_preference` | direto (mensal/trimestral/semestral/anual) |
| `observation` | `conversation_summary` | mesmo comentário ("Resumo da conversa gerado pela IA de CRM") |
| `last_check_crm` | `last_check_crm` | direto |
| `em_atendimento` | `ai_enabled` | direto (bool) — mesmo significado |
| `data_agendamento` | `scheduled_meeting_at` | direto (+ gera activity, ver §activities) |
| `kommo_id` | `kommo_lead_id` | direto |
| `meetime_id` | `meetime_lead_id` | direto |
| `pipedrive_id` | `pipedrive_lead_id` | direto |
| `pipedrive_id2` | `pipedrive_deal_id` | direto (deal do funil de vendas) |
| `closer` + `closer_email` | `closer_user_id` | **resolver FK** via email → users; nome como fallback (ver §3.3) |
| `usuario` | `sdr_user_id` | **resolver FK** (ver §3.3) |
| `date_created` | `created_at` | direto |
| `date_updated` | `updated_at` | direto |

### → `commercial_conversations` (thread)
| leads | commercial_conversations | obs |
|---|---|---|
| `lead_id` | `commercial_deal_id` | FK para o deal criado |
| `conversation_id` | `kommo_external_conversation_id` | "Identificador da conversa na Kommo" |
| `count_messages` | `message_count` | direto |
| `date_updated` / `last_assistant_updated` | `last_message_at` | escolher a mais recente |
| `created_by` (Agent/uazapi/api_oficial) | `origin` | mapear origem |
| `observation` | `summary` | resumo consolidado (duplica conversation_summary do deal) |

### → `commercial_conversation_messages` (parse de `conversa`)
| leads | messages | obs |
|---|---|---|
| `conversa` (blob completo) | `content` (N linhas) | **decompor** o transcript em N mensagens |
| `id_start_message` | `external_message_id` | "Id da mensagem inicial p/ verificar entrega" |
| — | `message_from` | derivar (person/user) ao fazer o parse |

### → `commercial_activities` (eventos)
| leads | activity | activity_type |
|---|---|---|
| `data_agendamento` + `id_agendamento` + `link_reuniao` | scheduled_at / custom_properties.calendar_event_id / custom_properties.meeting_link | `meeting` |
| `reagendamento` (bool) | custom_properties.rescheduled | `meeting` |
| `slot_closer` | custom_properties.slot_minutes | `meeting` |
| `date_next_fup` | scheduled_at | `followup` |
| `followup_count` | (contagem de activities followup) | `followup` |
| `tentativas_contato1` | custom_properties.attempts | `followup` (1º contato) |
| `etapa_repasse` + `data_repasse` + `repassa_sdr` | subject/completed_at | `handoff` (transbordo p/ SDR humano) |

---

## 3. Conversões / regras especiais

### 3.1 `status` — normalizar
Valores reais hoje (sujos): `open` (5353), `lost` (1300), `won` (101), `em aberto` (46), `desqualificado` (29), `qualificado` (7), `Won` (1), NULL (21531).
Normalizar para o vocabulário do deal:
- `open` / `em aberto` / `qualificado` → **negociação** (`open`)
- `won` / `Won` → **ganho** (`won`) → preencher `won_at`
- `lost` / `desqualificado` → **perdido** (`lost`) → preencher `lost_at` (+ `loss_reason`)
- NULL → manter NULL (lead ainda em abertura/triagem)

### 3.2 ⚠️ `ja_usa_concorrente` → `uses_competitor` (mismatch semântico)
O campo antigo **não é booleano** — é texto livre sobre *como o lead opera hoje*: `WhatsApp`, `Manual`, `iFood`, `Anota Aí`, `Começar do zero`, `Não usa`, etc.
- **Guardar o texto cru** em `custom_properties.current_stack` (ou `where_met_us` não — esse é outro).
- **Derivar o boolean** `uses_competitor`: `true` se menciona plataforma concorrente (iFood, Anota Aí, Instadelivery, etc.); `false`/NULL se "manual", "WhatsApp", "papel", "do zero", "não usa".

### 3.3 FKs de `users` (SDR/closer) — resolver, não copiar
- `closer` é **texto livre com variações** ("Reno Jesse"/"Reno Jessé", "Leanardo Santos"/"Leandro dos Santos", "Leticia"/"Leticia Silva").
- Estratégia: casar por `closer_email` → `users.email` (confiável); se vazio, fuzzy match do nome → `users.name`.
- `usuario` (texto) → `sdr_user_id` pela mesma lógica.
- **Pré-requisito:** popular `users` com os closers/SDRs (lista de nomes já levantada) antes de migrar os deals.

---

## 4. Gaps — campos do `leads` sem destino nativo no CDP
Vão para `custom_properties` (jsonb) do deal ou `raw_payload`:

| leads | destino sugerido | motivo |
|---|---|---|
| `utm_source/medium/campaign/content/adset/ad/platform` | `custom_properties.utm` (objeto) ou `raw_payload` | CDP não tem campos UTM |
| `fbclid`, `gclid`, `ctwaclid` | `custom_properties.click_ids` | tracking de clique |
| `objecoes` | `custom_properties.objections` | sem campo de objeções no deal |
| `turno_preferencia` | `custom_properties.shift_preference` | — |
| `break` (bool, pausa) | `custom_properties.paused` | flag operacional de pausa da IA |
| `modelo_llm` | `custom_properties.llm_model` | A/B Claude vs GPT |
| `plano_apresentado` (mensal/anual) | `custom_properties.plan_ab` | EXP-16 (A/B de preço) |
| `empresa` (texto) | `custom_properties.company_name` ou `persons.notes` | nome livre, não é company_id |
| `id_start_message` | já mapeado em messages.external_message_id | — |

> Decisão a confirmar com você: padronizar **uma** chave (`custom_properties`) vs separar `raw_payload`.

---

## 5. Colunas dropadas no `leads`
Posições 29, 30 e 34 não existem mais (colunas antigas removidas) — sem ação.

---

## 6. Pendências antes de converter os nodes
1. Confirmar vocabulário final de `stage` e `status` no CDP.
2. Popular `users` (closers + SDRs) e ter a tabela de-para nome→id.
3. Definir se `conversa` será decomposto em messages na migração ou mantido como blob inicial.
4. Confirmar política de `custom_properties` vs `raw_payload` para os gaps (§4).
