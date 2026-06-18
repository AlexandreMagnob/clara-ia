# Guia de Migração — `leads` (Supabase) → CDP novo (Postgres)

> Referência completa de como converter os nodes Supabase (banco antigo `leads`)
> para o novo banco normalizado do CDP, escrevendo **em paralelo** (sem apagar nada).
> Use este documento sempre que for migrar um node novo.

---

## 1. Contexto e estratégia

- **Banco antigo:** uma tabela única e denormalizada `leads` no Supabase (cada lead = 1 linha com ~70 colunas).
- **Banco novo (CDP):** estrutura normalizada em Postgres — `persons` + `commercial_deals` + `commercial_conversations` + `commercial_conversation_messages` + `commercial_activities` (+ referência `users`, `companies`).
- **Estratégia: migração gradual em paralelo.** NÃO se apaga o node Supabase. Para cada node Supabase, adiciona-se um node **Postgres logo depois**, fazendo o equivalente no banco novo. O Supabase continua alimentando a produção; o Postgres popula o CDP até a virada de chave.

### Credencial (MUITO IMPORTANTE)
- Os nodes Postgres novos têm que usar a credencial **`CDP - Postgres`** (id `dPKD2OwfrvkkDT2q`).
- ❌ NÃO usar `Postgres - RevOps` (id `XOYeTIMfsvkaFsZd`) — é outro banco, sem as tabelas. Erro típico: `relation "commercial_deals" does not exist` / `relation "persons" does not exist`. O n8n às vezes nasce o node com `Postgres - RevOps` por padrão — **sempre conferir**.

---

## 2. Estrutura do banco novo (resumo)

```
persons (id, name, telephone, email, company_id, tags, notes, created_at, updated_at, discarded_at)
commercial_deals (id uuid, person_id, company_id, status, stage, sdr_user_id, closer_user_id,
  segment, revenue_range, tier, where_met_us, service_format, uses_competitor,
  budget, authority, need, timing, temperature, loss_reason, deal_value,
  suggested_plan, interested_modules[], fidelity_preference, won_at, lost_at,
  scheduled_meeting_at, last_check_crm, ai_enabled, conversation_summary,
  kommo_lead_id, meetime_lead_id, pipedrive_lead_id, pipedrive_deal_id,
  raw_payload jsonb, custom_properties jsonb, created_at, updated_at, discarded_at)
commercial_conversations (id uuid, commercial_deal_id, person_id, kommo_external_conversation_id,
  channel, origin, conversation_type, status, summary, started_at, ended_at,
  last_message_at, message_count, created_at, updated_at, discarded_at)
commercial_conversation_messages (id uuid, commercial_conversation_id, person_id, user_id,
  external_message_id, content, url, message_type, message_from, metadata jsonb,
  created_at, updated_at, discarded_at)
commercial_activities (id uuid, commercial_deal_id, commercial_conversation_id, person_id, user_id,
  activity_type, origin, status, subject, description, scheduled_at, start_at, end_at,
  completed_at, custom_properties jsonb, created_at, updated_at, discarded_at)
```

### Constraints únicas conhecidas (geram erro de duplicado)
- `persons.telephone` — **NÃO é único** (a tabela é do CDP inteiro: leads E clientes; o mesmo telefone pode ter mais de uma pessoa). Por isso NUNCA usar `ON CONFLICT (telephone)` (erro: `there is no unique or exclusion constraint matching the ON CONFLICT specification`).
- `commercial_deals.kommo_lead_id` — **único** (`idx_commercial_deals_kommo_lead_id_unique`).
- `commercial_conversations.kommo_external_conversation_id` — **único** (`idx_commercial_conversations_kommo_ext_id_unique`).

---

## 3. Mapa de tradução de campos (`leads` → CDP)

### → `persons`
| leads | persons |
|---|---|
| `name` | `name` |
| `whatsapp` | `telephone` |
| `email` | `email` |

### → `commercial_deals`
| leads (antigo) | commercial_deals (novo) | obs |
|---|---|---|
| `status` | `status` | |
| `etapa_conversa` | `stage` | |
| `segmento` | `segment` | |
| `faturamento` | `revenue_range` | |
| `tier` | `tier` | |
| `onde_nos_conheceu` | `where_met_us` | |
| `formato_atendimento` | `service_format` | |
| `ja_usa_concorrente` | `uses_competitor` | text → boolean |
| `budget` / `authority` / `need` / `timing` | idem | |
| `temperatura` | `temperature` | |
| `motivo_perda` | `loss_reason` | |
| `value` | `deal_value` | |
| `plano_sugerido` | `suggested_plan` | |
| `modulos` | `interested_modules` | text → text[] |
| `fidelidade` | `fidelity_preference` | |
| `observation` | `conversation_summary` | |
| `last_check_crm` | `last_check_crm` | |
| `em_atendimento` | `ai_enabled` | bool |
| `kommo_id` | `kommo_lead_id` | ÚNICO |
| `meetime_id` | `meetime_lead_id` | |
| `pipedrive_id` | `pipedrive_lead_id` | |
| `pipedrive_id2` | `pipedrive_deal_id` | |
| `data_agendamento` | `scheduled_meeting_at` | (e também vira activity) |
| `usuario` | `sdr_user_id` | lookup em `users` por nome |
| `closer` / `closer_email` | `closer_user_id` | lookup em `users` |
| `date_created` / `date_updated` | `created_at` / `updated_at` | |

### → `commercial_conversations`
| leads | conversations |
|---|---|
| `conversation_id` | `kommo_external_conversation_id` (ÚNICO) |
| `last_assistant_updated` | `last_message_at` |
| `count_messages` | `message_count` |

### → `commercial_conversation_messages`
- O campo `conversa` (texto corrido `[data] Comercial: ...` / `[data] Lead: ...`) vira **1 linha por mensagem**.
- `message_from = 'user'` → lado **Comercial** (Clara/SDR). `message_from = 'person'` → lado **Lead**.
- `id_start_message` → `external_message_id`.
- A data da mensagem fica no `created_at` (não precisa concatenar o `[dd/MM...]` no texto).

### → `commercial_activities`
- `data_agendamento`, `link_reuniao`, `id_agendamento`, `reagendamento`, `slot_closer` → atividade de reunião (`activity_type = 'meeting'`).

### Campos SEM coluna no banco novo → vão para jsonb
- **`raw_payload`** (tracking): `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_ad` (vem de `utm_term`), `utm_adset`, `utm_platform` (vem de `utm_placement`), `fbclid`, `gclid`, `ctwaclid`, `utm_id`.
- **`custom_properties`** (negócio/operação): `empresa`, `plano_apresentado`, `abertura_variante`, `followup_count`, `data_next_fup`, `tentativas_contato1`, `objecoes`, `repassa_sdr`/`repasse_sdr`, `etapa_repasse`, `data_repasse`, `break`, `modelo_llm`, `created_by`, `turno_preferencia`, `reagendamento`, `slot_closer`, `lead_id_legado`.

---

## 4. Regras de ouro (erros que SEMPRE aparecem)

### 4.1. Credencial = `CDP - Postgres` (ver seção 1).

### 4.2. `NULLIF` em todo campo com constraint única
Valores que chegam vazios ou como a string literal `'undefined'` (quando a expressão n8n resolve pra nada) quebram a constraint única. Sempre blindar `kommo_lead_id`, `kommo_external_conversation_id`, etc:
```sql
NULLIF(NULLIF('{{ $('...').item.json.campo }}', ''), 'undefined')
```
`NULL` não conflita em índice único (pode ter vários).
- Erro típico: `duplicate key value violates unique constraint "..."  Key (campo)=(undefined) already exists.`

### 4.3. `replaceAll("'", "''")` em todo campo de TEXTO LIVRE
Texto digitado por humano/lead pode ter apóstrofo (ex: empresa "Gunde's", "Giaco's", ou a mensagem da Clara). Um `'` no meio fecha a string SQL e quebra. Dobrar a aspa:
```
{{ $('...').item.json.nome.replaceAll("'", "''") }}
{{ $('...').item.json.empresa.replaceAll("'", "''") }}
{{ $('...').item.json.mensagem_final.replaceAll("'", "''") }}
```
- Campos que precisam: `nome`/`name`, `empresa`, conteúdo de mensagem. NÃO precisam (controlados): `tier`, `segmento`, `faturamento`, IDs, UTMs, `etapa_repasse`.
- Erro típico: `syntax error at line X near "s"` (o `s` de "Gunde's").
- **Solução definitiva (quando der tempo):** usar **Query Parameters** do node Postgres (`$1, $2...` + Options → Query Parameters). O n8n escapa tudo sozinho, elimina `NULLIF`/`replaceAll` na mão e o risco de SQL injection.

### 4.4. Chave de match = TELEFONE
No banco novo NÃO existe `lead_id`. Mesmo nodes antigos que casavam por `lead_id`, no novo casam por **telefone**. Como telefone não é único em `persons`, pega-se o deal mais recente:
```sql
WHERE pe.telephone = '{{ ...numero }}' AND cd.discarded_at IS NULL
ORDER BY cd.created_at DESC LIMIT 1
```
- Cuidado de normalização: `5575984340000` ≠ `+55 75 98434-0000`. Padronizar (só dígitos) antes de gravar.

### 4.5. `$json` muda de significado quando o Postgres está DEPOIS do Supabase
Se o node Postgres roda depois de um Supabase, `$json` passa a ser a **linha retornada pelo Supabase** (que não tem campos como `mensagem_final`). Isso causa `content = 'undefined'`. Solução: referenciar o node que realmente tem o campo, ex: `$('Call [CLARA IA] Envio da Mensagem inicial').item.json.mensagem_final`.

### 4.6. `em_atendimento` (bool) → `ai_enabled`; `meetime_id` → `meetime_lead_id`.

---

## 5. Padrões de SQL (templates prontos)

> Trocar as referências `$('...')` conforme o node. Aplicar `NULLIF`/`replaceAll` conforme seções 4.2 e 4.3.

### 5.1. CREATE (lead novo) — person → deal → conversation → 1ª mensagem
```sql
WITH p AS (
  INSERT INTO persons (name, telephone, email, created_at, updated_at)
  VALUES (
    '{{ $('variáveis webhook').item.json.nome.replaceAll("'", "''") }}',
    '{{ $('variáveis webhook').item.json.numero }}',
    '{{ $('variáveis webhook').item.json.email }}',
    now(), now()
  )
  RETURNING id
),
d AS (
  INSERT INTO commercial_deals (
    person_id, status, tier, segment, revenue_range, kommo_lead_id,
    sdr_user_id, ai_enabled, raw_payload, custom_properties,
    created_at, updated_at
  )
  SELECT
    p.id, 'open',
    '{{ $('variáveis webhook').item.json.tier }}',
    '{{ $('variáveis webhook').item.json.segmento }}',
    '{{ $('variáveis webhook').item.json.faturamento }}',
    NULLIF(NULLIF('{{ $('Call Tratamento de dados na Kommo').item.json.id_kommo }}', ''), 'undefined'),
    (SELECT id FROM users WHERE lower(name) = lower('{{ $('Webhook1').item.json.body.usuario }}')),
    true,
    jsonb_build_object(
      'utm_source',   '{{ $('Webhook1').item.json.body.utm_source }}',
      'utm_medium',   '{{ $('Webhook1').item.json.body.utm_medium }}',
      'utm_campaign', '{{ $('Webhook1').item.json.body.utm_campaign }}',
      'utm_content',  '{{ $('Webhook1').item.json.body.utm_content }}',
      'utm_ad',       '{{ $('Webhook1').item.json.body.utm_term }}',
      'utm_adset',    '{{ $('Webhook1').item.json.body.utm_adset }}',
      'utm_platform', '{{ $('Webhook1').item.json.body.utm_placement }}'
    ),
    jsonb_build_object('empresa', '{{ $('variáveis webhook').item.json.empresa.replaceAll("'", "''") }}'),
    now(), now()
  FROM p
  RETURNING id, person_id
),
c AS (
  INSERT INTO commercial_conversations (
    commercial_deal_id, person_id, kommo_external_conversation_id,
    channel, origin, conversation_type, status,
    message_count, last_message_at, started_at, created_at, updated_at
  )
  SELECT d.id, d.person_id,
         NULLIF(NULLIF('{{ $('Call Tratamento de dados na Kommo').item.json.chat_id }}', ''), 'undefined'),
         'whatsapp', 'ia', 'ia', 'open',
         1, now(), now(), now(), now()
  FROM d
  RETURNING id
)
INSERT INTO commercial_conversation_messages (
  commercial_conversation_id, user_id, external_message_id,
  content, message_type, message_from, created_at, updated_at
)
SELECT c.id,
       (SELECT id FROM users WHERE lower(name) = 'clara'),
       '{{ $json.id_start_message }}',
       '{{ $json.mensagem_final.replaceAll("'", "''") }}',
       'text', 'user', now(), now()
FROM c;
```
> Se o node não tiver `conversa`/mensagem, remova a CTE `c`/INSERT de mensagem e use `message_count = 0`.

### 5.2. UPDATE (lead existente) — atualiza person + deal + adiciona mensagem
```sql
WITH d AS (
  SELECT cd.id, cd.person_id
  FROM commercial_deals cd
  JOIN persons pe ON pe.id = cd.person_id
  WHERE pe.telephone = '{{ $('variáveis webhook').item.json.numero }}'
    AND cd.discarded_at IS NULL
  ORDER BY cd.created_at DESC
  LIMIT 1
),
upd_person AS (
  UPDATE persons pe
  SET name = '{{ $('variáveis webhook').item.json.nome.replaceAll("'", "''") }}',
      telephone = '{{ $('variáveis webhook').item.json.numero }}',
      email = '{{ $('variáveis webhook').item.json.email }}',
      updated_at = now()
  FROM d WHERE pe.id = d.person_id
  RETURNING pe.id
),
upd_deal AS (
  UPDATE commercial_deals cd
  SET tier = '{{ $('variáveis webhook').item.json.tier }}',
      segment = '{{ $('variáveis webhook').item.json.segmento }}',
      kommo_lead_id = NULLIF(NULLIF('{{ $('Call Tratamento de dados na Kommo').item.json.id_kommo }}', ''), 'undefined'),
      sdr_user_id = COALESCE((SELECT id FROM users WHERE lower(name) = 'clara'), cd.sdr_user_id),
      raw_payload = COALESCE(cd.raw_payload, '{}'::jsonb) || jsonb_build_object(
        'utm_source','{{ $('Webhook1').item.json.body.utm_source }}',
        'utm_medium','{{ $('Webhook1').item.json.body.utm_medium }}',
        'utm_campaign','{{ $('Webhook1').item.json.body.utm_campaign }}',
        'utm_content','{{ $('Webhook1').item.json.body.utm_content }}',
        'utm_ad','{{ $('Webhook1').item.json.body.utm_term }}',
        'utm_adset','{{ $('Webhook1').item.json.body.utm_adset }}'
      ),
      custom_properties = COALESCE(cd.custom_properties, '{}'::jsonb) || jsonb_build_object(
        'empresa', '{{ $('variáveis webhook').item.json.empresa.replaceAll("'", "''") }}'
      ),
      updated_at = now()
  FROM d WHERE cd.id = d.id
  RETURNING cd.id
),
conv AS (
  SELECT c.id FROM commercial_conversations c, d
  WHERE c.commercial_deal_id = d.id AND c.channel = 'whatsapp'
  ORDER BY c.created_at DESC LIMIT 1
),
bump AS (
  UPDATE commercial_conversations c
  SET last_message_at = now(), message_count = COALESCE(c.message_count, 0) + 1, updated_at = now()
  FROM conv WHERE c.id = conv.id
  RETURNING c.id
)
INSERT INTO commercial_conversation_messages (
  commercial_conversation_id, user_id, external_message_id,
  content, message_type, message_from, created_at, updated_at
)
SELECT conv.id,
       (SELECT id FROM users WHERE lower(name) = 'clara'),
       '{{ $json.id_start_message }}',
       '{{ $json.mensagem_final.replaceAll("'", "''") }}',
       'text', 'user', now(), now()
FROM conv;
```
> Se o node tiver `conversation_id` (chat_id da Kommo) em vez de mensagem, troque as CTEs `conv`/`bump`/INSERT por:
> ```sql
> UPDATE commercial_conversations c
> SET kommo_external_conversation_id = NULLIF(NULLIF('{{ ...chat_id }}', ''), 'undefined'), updated_at = now()
> FROM d WHERE c.commercial_deal_id = d.id AND c.channel = 'whatsapp';
> ```

### 5.3. UPDATE simples de campos (ex: "pausar atendimento")
```sql
WITH d AS (
  SELECT cd.id FROM commercial_deals cd
  JOIN persons pe ON pe.id = cd.person_id
  WHERE pe.telephone = '{{ $('When Executed by Another Workflow').item.json.whatsapp }}'
    AND cd.discarded_at IS NULL
  ORDER BY cd.created_at DESC LIMIT 1
)
UPDATE commercial_deals cd
SET ai_enabled = false,
    meetime_lead_id = NULLIF(NULLIF('{{ $('Cria na Meetime - cadencia T5').item.json.id }}', ''), 'undefined'),
    custom_properties = COALESCE(cd.custom_properties, '{}'::jsonb) || jsonb_build_object(
      'repassa_sdr', true,
      'etapa_repasse', '{{ $('Switch').item.json.topico_normalizado }}',
      'data_repasse', now()::text
    ),
    updated_at = now()
FROM d WHERE cd.id = d.id;
```

### 5.4. READ (substituir o `Get a row`) — remonta o lead achatado
> Manter o node chamado `Get a row` (o prompt da Clara usa `$('Get a row')...`) e ligar **Always Output Data**. Os `AS` têm que bater com os nomes antigos das colunas.
```sql
SELECT
  pe.name                          AS name,
  cd.custom_properties->>'empresa' AS empresa,
  cd.segment                       AS segmento,
  cd.stage                         AS etapa_conversa,
  cd.status                        AS status,
  cd.scheduled_meeting_at          AS data_agendamento,
  COALESCE(cd.custom_properties->>'link_reuniao', act.link_reuniao) AS link_reuniao,
  conv.conversa                    AS conversa,
  cd.id                            AS deal_id,
  pe.id                            AS person_id,
  cd.kommo_lead_id                 AS kommo_id
FROM commercial_deals cd
JOIN persons pe ON pe.id = cd.person_id
LEFT JOIN users u ON u.id = cd.sdr_user_id
LEFT JOIN LATERAL (
  SELECT string_agg(
    '[' || to_char(m.created_at, 'DD/MM/YYYY HH24:MI:SS') || '] ' ||
    CASE m.message_from WHEN 'user' THEN 'Comercial' ELSE 'Lead' END || ': ' || m.content,
    E'\n' ORDER BY m.created_at
  ) AS conversa
  FROM commercial_conversations c
  JOIN commercial_conversation_messages m ON m.commercial_conversation_id = c.id
  WHERE c.commercial_deal_id = cd.id
) conv ON true
LEFT JOIN LATERAL (
  SELECT a.custom_properties->>'link_reuniao' AS link_reuniao
  FROM commercial_activities a
  WHERE a.commercial_deal_id = cd.id AND a.activity_type = 'meeting'
  ORDER BY a.created_at DESC LIMIT 1
) act ON true
WHERE pe.telephone = '{{ $('Variáveis').item.json.telefone }}'
  AND cd.discarded_at IS NULL
ORDER BY cd.created_at DESC
LIMIT 1;
```

---

## 6. Padrão de tolerância a erro no node (branch de erro → Slack → segue)

Cada node Postgres novo deve ter `onError: "continueErrorOutput"`. As duas saídas:
- **Saída 0 (sucesso)** → segue para o mesmo destino que o Supabase ia.
- **Saída 1 (erro)** → node Slack avisando a pessoa responsável → **e depois segue para o mesmo destino** (a automação NÃO para por causa do banco novo).

Esquema da fiação (substituindo `Supabase X → Y`):
```
Supabase X → Postgres P
Postgres P (sucesso, índice 0) → Y
Postgres P (erro, índice 1)    → Slack Erro → Y
```

Exemplo de node Postgres (parâmetros n8n):
```json
{
  "type": "n8n-nodes-base.postgres",
  "typeVersion": 2.6,
  "parameters": { "operation": "executeQuery", "query": "<SQL>", "options": {} },
  "credentials": { "postgres": { "id": "dPKD2OwfrvkkDT2q", "name": "CDP - Postgres" } },
  "onError": "continueErrorOutput"
}
```
Slack de erro (DM): `select: user`, user `U05NBR6D2MV` (alexandre.magno), credencial `Slack Doguinho Bot` (id `SsQksTzv99K5SqDV`).

---

## 7. Limpeza de lixo de teste (rodar quando necessário)

### Apagar um lead de teste pelo kommo_id (ordem de FK: mensagens → conversa → deal → pessoa)
```sql
WITH alvo_deal AS (
  SELECT id, person_id FROM commercial_deals WHERE kommo_lead_id = '22932422'
),
alvo_conv AS (
  SELECT id FROM commercial_conversations WHERE commercial_deal_id IN (SELECT id FROM alvo_deal)
),
del_msg AS (
  DELETE FROM commercial_conversation_messages
  WHERE commercial_conversation_id IN (SELECT id FROM alvo_conv) RETURNING 1
),
del_conv AS (
  DELETE FROM commercial_conversations WHERE id IN (SELECT id FROM alvo_conv) RETURNING 1
),
del_deal AS (
  DELETE FROM commercial_deals WHERE id IN (SELECT id FROM alvo_deal) RETURNING person_id
)
DELETE FROM persons WHERE id IN (SELECT person_id FROM del_deal);
```

### Zerar `kommo_external_conversation_id`/`kommo_lead_id` fantasma = 'undefined'
```sql
UPDATE commercial_conversations SET kommo_external_conversation_id = NULL WHERE kommo_external_conversation_id = 'undefined';
UPDATE commercial_deals SET kommo_lead_id = NULL WHERE kommo_lead_id = 'undefined';
```

---

## 8. Queries de inspeção (ver como ficou a conversa)

### Leads com mais mensagens
```sql
SELECT pe.name, pe.telephone, d.kommo_lead_id,
       count(m.id) AS qtd_mensagens, min(m.created_at) AS primeira, max(m.created_at) AS ultima
FROM commercial_deals d
JOIN persons pe ON pe.id = d.person_id
JOIN commercial_conversations c ON c.commercial_deal_id = d.id
JOIN commercial_conversation_messages m ON m.commercial_conversation_id = c.id
GROUP BY pe.name, pe.telephone, d.kommo_lead_id
ORDER BY qtd_mensagens DESC LIMIT 20;
```

### Mensagens cruas de um lead
```sql
SELECT m.created_at, m.message_from, m.message_type, m.content, m.external_message_id
FROM commercial_conversation_messages m
JOIN commercial_conversations c ON c.id = m.commercial_conversation_id
JOIN commercial_deals d ON d.id = c.commercial_deal_id
JOIN persons pe ON pe.id = d.person_id
WHERE pe.telephone = '5547996589309'
ORDER BY m.created_at;
```
> Observação atual: os inserts gravam só mensagens da Clara (`message_from='user'`). As respostas do **lead** (`message_from='person'`) ainda NÃO entram — falta migrar o node que grava o que o lead responde.

---

## 9. Conversões automáticas em massa (script Node)

Para inserir os espelhos Postgres em todos os nodes Supabase de um workflow de uma vez (em vez de editar à mão), lê-se o JSON exportado, cria-se os nodes e religa-se as conexões por script. Padrão usado em `[SDR] atend humano - CDP.json`:
1. Para cada Supabase de escrita: cria 1 node Postgres (`CDP - <nome>`) + 1 Slack (`Erro CDP - <nome>`).
2. Religa: `original → PG`; `PG[0] → alvo original`; `PG[1] → Slack`; `Slack → alvo original`.
3. Salva novo arquivo `<workflow> - CDP.json`.
O node de **leitura** (`get`/`Consulta tabela de leads`) NÃO precisa de espelho de escrita — só a leitura nova (seção 5.4).

---

## 10. Decisões registradas

- **FKs de usuário** (`sdr_user_id`/`closer_user_id`): subquery por nome/email em `users` (`(SELECT id FROM users WHERE lower(name)=...)`); vira NULL se não achar.
- **`conversa`**: parseada em mensagens individuais (não guardar o blob).
- **Órfãos**: `utm_*`/`fbclid`/`gclid`/`ctwaclid` em `raw_payload`; o resto (plano_apresentado, abertura_variante, followup, repasse, empresa, etc.) em `custom_properties`.
- **`persons.telephone` fica SEM unique** (CDP permite telefone repetido); dedup é por "deal aberto" no nível de aplicação, não por constraint.
- **Match sempre por telefone** (não há `lead_id` no banco novo).
- **Slack de erro** vai por DM pro `alexandre.magno` (`U05NBR6D2MV`).
