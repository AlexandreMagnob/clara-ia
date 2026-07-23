# Kommo API — Eventos (Events) API

## Visão geral

A **lista de eventos** (`events`) é um conjunto de dados que registra o que aconteceu
dentro da conta Kommo: mudança de etapa de lead, criação/edição/exclusão de entidades,
troca de responsável, chamadas, mensagens, alterações de campos, notas, etc. Cada evento é
um registro de auditoria/timeline armazenado pela Kommo.

A doc oficial descreve o recurso de forma curta: *"Events list is a data set of events of the
account. Using the events API you can get the information on different events of the account."*

Pontos-chave para entender o recurso:

- É um recurso de **leitura** via API pública (`GET`). A doc documenta apenas endpoints `GET`
  para eventos — você consulta eventos, que são gerados pelas ações dentro do CRM. (A doc não
  usa o termo "read-only" explicitamente, mas não expõe endpoint de criação/edição de eventos.)
- A resposta usa o padrão **HAL+JSON** (`Content-Type: application/hal+json`), com `_links` e
  `_embedded`.
- Cada evento traz `value_before` e `value_after` — o estado **antes** e **depois** da ação. A
  estrutura desses campos **muda conforme o `type` do evento**.

> **Relação com webhooks (nota editorial — não literal na doc):** os mesmos acontecimentos que
> disparam webhooks costumam ficar registrados na lista de eventos, mas o **payload é diferente**.
> Modelo de consumo: **webhook = push** (a Kommo avisa em tempo real) vs. **Events API = pull**
> (você consulta o histórico já gravado, com paginação e filtros). Use a Events API para
> reconstruir histórico, auditar ou recuperar eventos perdidos via webhook. **Não assuma campos
> idênticos** entre o evento da API e o webhook de mesmo nome. *(Comparação não documentada
> explicitamente na página de Events; tratar como orientação prática.)*

---

## Endpoints

| Ação | Método | Caminho |
|------|--------|---------|
| Listar eventos | `GET` | `https://{subdominio}.kommo.com/api/v4/events` |
| Obter um evento por ID | `GET` | `https://{subdominio}.kommo.com/api/v4/events/{id}` |
| Listar tipos de evento disponíveis | `GET` | `https://{subdominio}.kommo.com/api/v4/events/types` |

Autenticação: header `Authorization: Bearer {access_token}` (OAuth 2.0 / token de integração de
longa duração), como em todo o `/api/v4`.

Códigos de status (conforme a tabela oficial de HTTP codes da Kommo):
- `200` — sucesso (`application/hal+json`)
- `204` — sem conteúdo: a requisição teve sucesso mas não há conteúdo no recurso (nenhum evento
  corresponde ao filtro)
- `401` — não autorizado (token inválido/expirado/ausente)
- `402` — período pago/trial da conta encerrado (renovar assinatura)
- `429` — requisições demais em um intervalo (rate limit)
- `403` — proibido / IP bloqueado por violar o limite repetidamente
- Erros costumam retornar `application/problem+json`

---

## `GET /api/v4/events` — Listar eventos

### Parâmetros de query

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `with` | string | Valores separados por vírgula para anexar dados relacionados. Valores aceitos: `contact_name`, `lead_name`, `company_name`, `catalog_name`, `catalog_element_name`. |
| `page` | int | Número da página (paginação). |
| `limit` | int | Quantidade de eventos por página. **Máximo 250**. |
| `filter[id]` | string | Filtra por ID(s) de evento. Aceita um valor único ou vários separados por vírgula. |
| `filter[created_at][from]` | int (Unix ts) | Eventos criados a partir desse timestamp (segundos). |
| `filter[created_at][to]` | int (Unix ts) | Eventos criados até esse timestamp (segundos). |
| `filter[created_by]` | string | Filtra por ID(s) de usuário que gerou o evento. Até **10** valores separados por vírgula. |
| `filter[entity]` | string | Tipo de entidade: `lead`, `contact`, `company`, `task`, `catalog_{LIST_ID}`. Aceita múltiplos separados por vírgula. |
| `filter[entity_id]` | string | Até **10** IDs de entidade, separados por vírgula. **Exige que `filter[entity]` contenha um único tipo de entidade.** |
| `filter[type]` | string | Filtra por tipo(s) de evento (ex.: `lead_status_changed`). Múltiplos tipos separados por vírgula. |
| `filter[value_before]` / `filter[value_after]` | array | Filtro avançado por estado antes/depois — documentado na página de *Events filtration*, não na lista básica de parâmetros. Ver seção **Filtros por value_before/value_after**. |

> A doc da lista de eventos **não** documenta um parâmetro `order`. O comportamento de
> ordenação padrão não é descrito explicitamente; se precisar de ordenação determinística, valide
> empiricamente. **(não confirmado na doc)**

### Exemplo de requisição (curl)

```bash
curl 'https://meudominio.kommo.com/api/v4/events?filter[type]=lead_status_changed&filter[entity]=lead&filter[created_at][from]=1664582400&with=lead_name&limit=100&page=1' \
  -H 'Authorization: Bearer eyJ0eXAiOiJKV1Qi...'
```

### Exemplo de resposta (JSON)

Baseado no exemplo oficial da página *events list*:

```json
{
  "_page": 1,
  "_links": {
    "self": {
      "href": "https://example.kommo.com/api/v4/events?page=1&limit=250"
    },
    "next": {
      "href": "https://example.kommo.com/api/v4/events?page=2&limit=250"
    }
  },
  "_embedded": {
    "events": [
      {
        "id": "aaabbbbcccc1234567",
        "type": "lead_status_changed",
        "entity_id": 1234567,
        "entity_type": "lead",
        "created_by": 7654321,
        "created_at": 1665064411,
        "value_after": [
          {
            "lead_status": {
              "id": 111,
              "pipeline_id": 123
            }
          }
        ],
        "value_before": [
          {
            "lead_status": {
              "id": 222,
              "pipeline_id": 456
            }
          }
        ],
        "account_id": 111222333,
        "_links": {
          "self": {
            "href": "https://example.kommo.com/api/v4/events/aaabbbbcccc1234567"
          }
        },
        "_embedded": {
          "entity": {
            "id": 1234567
          }
        }
      }
    ]
  }
}
```

> Notas sobre o exemplo: o `id` do evento é uma **string** (não inteiro). `created_at` é Unix
> timestamp (segundos). `value_after`/`value_before` são **arrays de objetos**. No exemplo
> oficial, `_embedded.entity` traz apenas `{ "id": ... }` — não assuma que sempre virá com
> `_links` ou `name` (o `name` aparece quando você pede via `with`).

---

## Tabela de campos do objeto evento

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | string | Identificador único do evento. |
| `type` | string | Tipo (key) do evento (ver lista de tipos abaixo). |
| `entity_id` | int | ID da entidade relacionada (lead, contato, etc.). |
| `entity_type` | string | Tipo da entidade: `lead`, `contact`, `company`, `task`, `catalog_{LIST_ID}`. |
| `created_by` | int | ID do usuário que gerou o evento (`0` quando gerado pelo sistema/robô). |
| `created_at` | int | Timestamp Unix de criação (segundos). |
| `value_after` | array&lt;object&gt; | Estado **depois** da ação. Estrutura depende do `type`. |
| `value_before` | array&lt;object&gt; | Estado **antes** da ação. Estrutura depende do `type`. |
| `account_id` | int | ID da conta. |
| `_links.self.href` | string | Link para o próprio evento. |
| `_embedded.entity` | object | Entidade relacionada embutida (pelo menos `id`). Quando se usa `with`, pode aparecer `_embedded.entity.name` etc. |

---

## `GET /api/v4/events/{id}` — Obter um evento

- **Path param:** `id` (string, obrigatório) — ID do evento.
- **Query param:** `with` (mesmos valores do endpoint de lista).
- Retorna um único objeto evento com a **mesma estrutura** de um item de `_embedded.events[]`
  (campos `id`, `type`, `entity_id`, `entity_type`, `created_by`, `created_at`, `value_after`,
  `value_before`, `account_id`, `_links`, e — quando aplicável — `_embedded.entity`).

### Exemplo de requisição

```bash
curl 'https://meudominio.kommo.com/api/v4/events/01pz58t6p04ymgsgfbmfyfy1mf?with=lead_name' \
  -H 'Authorization: Bearer eyJ0eXAiOiJKV1Qi...'
```

### Exemplo de resposta (do exemplo oficial)

```json
{
  "id": "01pz58t6p04ymgsgfbmfyfy1mf",
  "type": "lead_added",
  "entity_id": 1234567,
  "entity_type": "lead",
  "created_by": 7654321,
  "created_at": 1665064411,
  "value_after": [
    { "note": { "id": 123 } }
  ],
  "value_before": [],
  "account_id": 321,
  "_links": {
    "self": {
      "href": "https://example.kommo.com/api/v4/events/01pz58t6p04ymgsgfbmfyfy1mf"
    }
  }
}
```

> Observação importante: o exemplo oficial de `lead_added` mostra `value_before` **vazio** mas
> `value_after` **preenchido** (`[{ "note": { "id": 123 } }]`). Ou seja, **não** vale a regra
> simplista de que eventos de criação/exclusão sempre retornam ambos os arrays vazios — a
> presença/forma de `value_before`/`value_after` depende do `type`. Sempre cheque o `type`.

---

## `GET /api/v4/events/types` — Tipos de evento disponíveis

Retorna todos os tipos de evento existentes na conta, com nome localizado e **ID numérico** do tipo.

### Parâmetros de query

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `language_code` | string | Idioma dos nomes retornados. Aceita `en`, `es`, `pt`. Padrão: idioma do usuário solicitante. |

### Exemplo de resposta (do exemplo oficial)

```json
{
  "_total_items": 35,
  "_links": {
    "self": {
      "href": "https://example.kommo.com/api/v4/events/types?limit=6"
    }
  },
  "_embedded": {
    "events_types": [
      {
        "key": "lead_added",
        "type": 1,
        "lang": "New lead"
      },
      {
        "key": "lead_deleted",
        "type": 7,
        "lang": "Lead deleted"
      }
    ]
  }
}
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `_total_items` | int | Total de tipos de evento disponíveis. |
| `key` | string | Identificador textual do tipo (usado em `filter[type]`). |
| `type` | int | ID numérico do tipo. |
| `lang` | string | Nome localizado do tipo. |

> Os **IDs numéricos** (`type`) só aparecem aqui — a lista de tipos abaixo usa apenas as `key`s,
> pois a doc de referência de tipos **não** publica os IDs numéricos. Para o `type` numérico
> exato na **sua** conta, consulte este endpoint.

---

## Lista de tipos de evento (`type` / `key`)

A doc oficial lista 65 tipos, agrupados assim (formato `key` — nome):

**Leads:** `lead_added` (New lead), `lead_deleted`, `lead_restored`, `lead_status_changed`
(Lead stage changed), `lead_linked`, `lead_unlinked`

**Contatos:** `contact_added`, `contact_deleted`, `contact_restored`, `contact_linked`,
`contact_unlinked`

**Empresas:** `company_added`, `company_deleted`, `company_restored`, `company_linked`,
`company_unlinked`

**Tarefas:** `task_added`, `task_deleted`, `task_completed`, `task_type_changed`,
`task_text_changed`, `task_deadline_changed`, `task_result_added`

**Comunicação:** `incoming_call`, `outgoing_call`, `incoming_mail`, `outgoing_mail`,
`incoming_chat_message`, `outgoing_chat_message`, `entity_direct_message` (mensagem interna),
`incoming_sms`, `outgoing_sms`

**Tags / vínculos:** `entity_tag_added`, `entity_tag_deleted`, `entity_linked`, `entity_unlinked`

**Mudança de campos:** `sale_field_changed` (campo "Sale"), `name_field_changed` (campo "Name"),
`ltv_field_changed` (valor total de compra), `custom_field_value_changed` (campo personalizado
genérico), `custom_field_{FIELD_ID}_value_changed` (campo personalizado específico, com o ID do
campo embutido na própria chave — na doc aparece como o placeholder `custom_field_field.ID_value_changed`),
`entity_responsible_changed` (troca de responsável)

**IA:** `robot_replied` ("AI: bot launched"), `intent_identified` ("AI: bot not launched"),
`ai_result` (Kommo AI)

**Engajamento / NPS:** `nps_rate_added`, `link_followed`, `key_action_completed`

**Notas:** `common_note_added`, `common_note_deleted`, `attachment_note_added`,
`targeting_in_note_added`, `targeting_out_note_added`, `geo_note_added`, `service_note_added`,
`site_visit_note_added`

**Conversas / chats:** `talk_created`, `talk_closed`, `conversation_answered`,
`talk_missed_event` (tempo de resposta excedido), `meta_chat_subscription_added`,
`meta_chat_subscription_removed`, `page_mention` (menção em rede social)

**Mídia / outros:** `entity_merged` (mesclagem), `video_opened`, `video_closed`,
`picture_opened`, `picture_closed`, `zoom_conference`, `dropbox_attachment`

> Para o conjunto exato e os IDs numéricos (`type`) válidos na **sua** conta, consulte
> `GET /api/v4/events/types` — a disponibilidade pode variar conforme plano e integrações ativas.

---

## Filtros por `value_before` / `value_after`

Além dos filtros básicos, é possível filtrar pelo **valor de estado** antes/depois do evento.
Esses filtros só funcionam para tipos de evento específicos. Há quatro categorias (página oficial
*Events filtration*):

### 1. `leads_statuses` — filtrar por etapa do lead
- **Evento:** `lead_status_changed`
- **Sintaxe:**
  ```
  filter[value_after][leads_statuses][0][pipeline_id]=12345&filter[value_after][leads_statuses][0][status_id]=99999999
  ```
- Retorna eventos em que o lead transicionou **para** (ou, usando `value_before`, **a partir de**)
  determinada combinação funil/etapa. O índice `[0]` permite passar múltiplas combinações.

### 2. `responsible_user_id` — filtrar por responsável
- **Evento:** `entity_responsible_changed`
- Aceita um ou mais IDs (separados por vírgula).
- **Sintaxe:**
  ```
  filter[value_after][responsible_user_id]=5555555
  ```

### 3. `custom_field_values` — filtrar por valor de campo enum
- **Evento:** `custom_field_{FIELD_ID}_value_changed`
- **Sintaxe:**
  ```
  filter[value_after][custom_field_values]=145&filter[type]=custom_field_777777_value_changed
  ```
- **Restrição (literal na doc):** "no more than 1 event type should be passed" — não passe mais
  de **1** tipo de evento junto com esse filtro.

### 4. `value` — filtrar por valor exato
- **Eventos:** `nps_rate_added`, `sale_field_changed`, `name_field_changed`, `ltv_field_changed`,
  `custom_field_value_changed`
- **Sintaxe:**
  ```
  filter[value_after][value]=155&filter[type]=sale_field_changed&filter[entity]=lead
  ```

### Estruturas de `value_after`/`value_before` por tipo de evento

A doc nota que cada `type` aninha dados em `value_after`/`value_before` com schema próprio
(ex.: `lead_status`, `nps`, `custom_field_value`, `responsible_user`, `task_deadline`,
`task_type`, `tag`, `link`/`unlink`, `note`). Exemplos confirmados:

`lead_status_changed`:
```json
{
  "value_after":  [{ "lead_status": { "id": 111, "pipeline_id": 123 } }],
  "value_before": [{ "lead_status": { "id": 222, "pipeline_id": 456 } }]
}
```

`entity_responsible_changed`:
```json
{
  "value_after":  [{ "responsible_user": { "id": 504329 } }],
  "value_before": [{ "responsible_user": { "id": 37268 } }]
}
```

`custom_field_value_changed` (e `custom_field_{ID}_value_changed`) — exemplo de estrutura:
```json
{
  "value_after":  [{ "custom_field_value": { "field_id": 53728, "field_type": 8, "enum_id": 2352876, "text": "example@test.com" } }],
  "value_before": [{ "custom_field_value": { "field_id": 53728, "field_type": 8, "enum_id": 193200, "text": "example@test.com" } }]
}
```
> *(A forma exata dos campos internos do `custom_field_value` varia por tipo de campo — confirme
> contra a sua conta; a doc enumera apenas o schema raiz `custom_field_value`.)*

`nps_rate_added`:
```json
{
  "value_after": [{ "nps": { "rate": 7 } }]
}
```

`lead_added` (exemplo oficial): `value_before` vazio, `value_after` com `note`:
```json
{
  "value_after":  [{ "note": { "id": 123 } }],
  "value_before": []
}
```

> Eventos de exclusão/restauração/mesclagem podem retornar `value_before`/`value_after` como
> arrays vazios, mas isso **não é garantido** para todo evento de criação/edição (ver `lead_added`
> acima). Sempre inspecione por `type`.

---

## Limites e rate limits

- **Paginação:** `limit` máximo de **250** por requisição; use `page` + o `_links.next` da
  resposta para iterar.
- **Filtros com limite de cardinalidade:** `filter[created_by]` e `filter[entity_id]` aceitam no
  máximo **10** valores; `filter[entity_id]` exige um **único** tipo em `filter[entity]`.
- **`custom_field_values`:** no máximo **1** `filter[type]` por requisição.
- **Rate limit geral da API Kommo:** **não mais que 7 requisições por segundo**, aplicado **por
  endereço IP** (limite global do `/api/v4`, não específico de eventos). Exceder retorna `429`;
  violações repetidas bloqueiam o IP e passam a retornar `403`.

---

## Pegadinhas e erros comuns (gotchas)

1. **`id` é string, não inteiro.** Diferente de leads/contatos. Não faça `parseInt`.
2. **`value_after`/`value_before` são arrays** (geralmente com 1 elemento) e a **estrutura interna
   muda por `type`**. Sempre cheque o `type` antes de acessar `value_after[0].lead_status` vs
   `value_after[0].responsible_user` vs `value_after[0].note` etc.
3. **Não assuma que criação/exclusão retorna ambos os arrays vazios.** O exemplo oficial de
   `lead_added` traz `value_before: []` mas `value_after: [{note...}]`.
4. **`filter[entity_id]` sem `filter[entity]` único falha** — precisa de exatamente um tipo de
   entidade.
5. **`custom_field_values` exige um único `filter[type]`** (`custom_field_{ID}_value_changed`);
   combinar vários tipos quebra o filtro.
6. **Não confunda com webhooks:** o payload do evento via API **difere** do payload do webhook de
   mesmo nome. Não copie o mapeamento de campos de um para o outro.
7. **`created_at` em segundos (Unix).** Para `filter[created_at][from]/[to]` use timestamps em
   segundos, não milissegundos.
8. **`with` só anexa nomes** de entidades relacionadas (`lead_name`, `contact_name`, etc.); para
   detalhes completos da entidade, faça uma chamada separada ao recurso correspondente.
9. **`402` em conta com período pago/trial encerrado** — não é erro de permissão de token; é
   cobrança/plano.
10. **`custom_field_{FIELD_ID}_value_changed`:** o tipo embute o ID do campo na própria string do
    tipo. Para descobrir os tipos e seus IDs numéricos, use `GET /api/v4/events/types`.
11. **IDs numéricos dos tipos** não aparecem na lista de tipos da referência — só no
    `GET /api/v4/events/types`. Prefira a `key` (string) em `filter[type]`.
12. **Retenção de histórico:** a doc não declara prazo de retenção dos eventos **(não confirmado
    na doc)** — para auditoria de longo prazo, exporte/persista periodicamente.

---

## Fontes

- https://developers.kommo.com/reference/events.md (visão geral / Events)
- https://developers.kommo.com/reference/events-list.md (GET /api/v4/events — parâmetros, resposta, campos)
- https://developers.kommo.com/reference/events-types.md (lista de tipos de evento)
- https://developers.kommo.com/reference/get-events-types.md (GET /api/v4/events/types)
- https://developers.kommo.com/reference/get-event.md (GET /api/v4/events/{id})
- https://developers.kommo.com/reference/events-filtration.md (filtros value_before/value_after)
- https://developers.kommo.com/docs/limitations (rate limit 7 req/s por IP, 250 por requisição)
- https://developers.kommo.com/reference/http-codes (códigos 200/204/401/402/403/429)
- https://developers.kommo.com/llms.txt (índice de URLs da documentação)
