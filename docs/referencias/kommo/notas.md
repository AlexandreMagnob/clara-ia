# Kommo API — Notas (Notes) API

## Visão geral

As **notas (notes)** permitem armazenar informações adicionais — estruturadas ou não estruturadas — vinculadas a uma entidade. Elas aparecem como **eventos no histórico/feed do card** da entidade.

Notas podem ser anexadas a **leads, contatos (contacts) e empresas (companies)**.

Existem dois grupos de notas:
- **Notas de sistema** (geradas por integrações/sistema): SMS de entrada/saída, chamadas de entrada/saída, contato criado, etc.
- **Notas criadas pelo usuário**: nota de texto (`common`) e nota com anexo (`attachment`).

A página de visão geral da doc afirma que **existem 10 tipos de nota que podem ser editados** ("There are 10 note types in Kommo that can be edited"). **Atenção:** a página de referência de tipos (`notes-types`) lista explicitamente apenas **9 tipos** com estrutura de `params` documentada (ver tabela abaixo). O 10º tipo não está enumerado/documentado na referência consultada.

> Observação importante de nomenclatura: nos caminhos, `{entity_type}` aceita `leads`, `contacts` ou `companies` (em inglês, mesmo na conta em PT). O domínio é o subdomínio da sua conta: `https://{subdominio}.kommo.com`.

---

## Endpoints

| Operação | Método | Caminho |
|---|---|---|
| Listar notas por tipo de entidade | `GET` | `https://{subdominio}.kommo.com/api/v4/{entity_type}/notes` |
| Listar notas de uma entidade específica | `GET` | `https://{subdominio}.kommo.com/api/v4/{entity_type}/{entity_id}/notes` |
| Obter uma nota por ID | `GET` | `https://{subdominio}.kommo.com/api/v4/{entity_type}/notes/{id}` |
| Adicionar notas (lote) | `POST` | `https://{subdominio}.kommo.com/api/v4/{entity_type}/notes` |
| Editar uma nota | `PATCH` | `https://{subdominio}.kommo.com/api/v4/{entity_type}/notes/{id}` |
| Editar notas (lote) | `PATCH` | `https://{subdominio}.kommo.com/api/v4/{entity_type}/notes` |
| Fixar (pin) uma nota | `POST` | `https://{subdominio}.kommo.com/api/v4/{entity_type}/notes/{id}/pin` |
| Desafixar (unpin) uma nota | `POST` | `https://{subdominio}.kommo.com/api/v4/{entity_type}/notes/{id}/unpin` |

Autenticação: **OAuth 2.0** (Bearer token) em todos os endpoints. Disponibilidade depende das permissões do usuário sobre a entidade.

Parâmetros de caminho comuns:

| Parâmetro | Tipo | Obrigatório | Valores |
|---|---|---|---|
| `entity_type` | string | Sim | `leads` / `contacts` / `companies` |
| `entity_id` | integer | Sim (quando no caminho) | ID da entidade pai |
| `id` | integer | Sim (quando no caminho) | ID da nota |

---

## Parâmetros de query (GET)

Válidos tanto para `GET /{entity_type}/notes` quanto para `GET /{entity_type}/{entity_id}/notes`:

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `page` | integer | Número da página da resposta |
| `limit` | integer | Quantidade de entidades por requisição (máximo **250**) |
| `filter[id][]` | array | Filtra por ID da nota (um ou vários) |
| `filter[note_type][]` | array | Filtra por tipo de nota (vários permitidos) |
| `filter[updated_at][from]` | integer | Timestamp Unix — notas editadas **depois** do valor |
| `filter[updated_at][to]` | integer | Timestamp Unix — notas editadas **antes** do valor |
| `order[updated_at]` | string enum | Ordenação da lista: `asc` / `desc` |
| `order[id]` | string enum | Ordenação da lista: `asc` / `desc` |
| `with` | string | Suporta apenas o valor `is_pinned` (retorna o campo `is_pinned` em cada nota) |

Exemplo de query:

```
GET /api/v4/leads/notes?filter[note_type][]=common&filter[updated_at][from]=1540407000&order[id]=desc&page=1&limit=250&with=is_pinned
```

---

## Tipos de nota (`note_type`) e estrutura de `params`

Os **9 tipos** documentados na referência de tipos (todos podem ser criados/editados via API):

| `note_type` | Descrição | Editável |
|---|---|---|
| `common` | Nota de texto | Sim |
| `call_in` | Chamada recebida | Sim |
| `call_out` | Chamada efetuada | Sim |
| `service_message` | Mensagem de serviço (criada por integração) | Sim |
| `extended_service_message` | Mensagem de serviço estendida (texto longo, pode ser minimizada na interface) | Sim |
| `geolocation` | Nota de texto com geotag (adicionada via app mobile da Kommo) | Sim |
| `sms_in` | SMS recebido | Sim |
| `sms_out` | SMS enviado | Sim |
| `attachment` | Nota com arquivo | Sim |

> A página de visão geral fala em "10 tipos editáveis", mas a referência de tipos lista apenas estes 9 com `params` detalhado. Não há tipo `message_cashier` documentado na referência de notas — existe apenas o evento `message_to_cashier_note_added` no recurso de eventos, que **não** é um `note_type` criável via esta API. (não confirmado na doc de notas)

Estruturas de `params` por tipo (exemplos da doc):

**`common`**
```json
"params": {
   "text": "Common note"
}
```

**`call_in` / `call_out`**
```json
"params": {
   "uniq": "XXXXX-5fb3-406d-93a3-a4832dc28f8b",
   "duration": 60,
   "source": "Twilio",
   "link": "https://example.com",
   "phone": "+14155551234"
}
```

**`service_message` / `extended_service_message`**
```json
"params": {
   "service": "Example service",
   "text": "Note text"
}
```

**`geolocation`**
```json
"params": {
   "text": "Geolocation",
   "address": "222 Columbus Ave Ste 407",
   "longitude": "-13",
   "latitude": "32"
}
```

**`sms_in` / `sms_out`**
```json
"params": {
  "text": "New incoming SMS",
  "phone": "+14155551234"
}
```

**`attachment`** (formato de **escrita** / criação)
```json
"params": {
  "version_uuid": "XXXXXX-4122-4cad-b121-9709882b4cc1",
  "file_uuid": "XXXXXX-3a29-4d30-8953-bac68c05e8e8",
  "file_name": "image.png"
}
```

> Nota: na **leitura** (GET), as notas do tipo `attachment` aparecem com `params` em formato legado: `original_name` e `attachment` (ver exemplo de resposta abaixo). Para **criar** anexos via API, usa-se o fluxo de arquivos (Files API), referenciando `file_uuid` / `version_uuid`.

---

## Corpo da requisição — Adicionar notas (`POST`)

O corpo é um **array** de objetos. Campos aceitos por item:

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `entity_id` | integer | Sim | ID da entidade à qual a nota será adicionada |
| `note_type` | string | Não | Tipo da nota (`common`, `call_in`, `call_out`, `service_message`, `geolocation`, `sms_in`, `sms_out`, `extended_service_message`, `attachment`) |
| `params` | object/JSON | Não | Propriedades da nota, dependentes do `note_type` |
| `request_id` | string | Não | Valor retornado inalterado na resposta; **não é salvo** (útil para correlacionar itens do lote) |
| `is_need_to_trigger_digital_pipeline` | boolean | Não | Se não for passado ou for passado como `true`, os gatilhos do Digital Pipeline são processados; se `false`, não são |

Exemplo de requisição (nota de chamada recebida):

```json
[
  {
    "entity_id": 1234567,
    "note_type": "call_in",
    "params": {
      "uniq": "8f52d38a-5fb3-406d-93a3-a4832dc28f8b",
      "duration": 60,
      "source": "onlinePBX",
      "link": "https://example.com",
      "phone": "+14155551234"
    }
  }
]
```

Exemplo de requisição (nota `common` com texto):

```json
[
  {
    "entity_id": 1234567,
    "note_type": "common",
    "params": {
      "text": "Lead retornou o contato e pediu proposta por e-mail."
    },
    "request_id": "nota-fup-01"
  }
]
```

Resposta de sucesso (200):

```json
{
  "_links": {
    "self": {
      "href": "http://example.kommo.com/api/v4/leads/notes"
    }
  },
  "_embedded": {
    "notes": [
      {
        "id": 1234567,
        "entity_id": "XXXXXX",
        "request_id": "1",
        "_links": {
          "self": {
            "href": "https://example.kommo.com/api/v4/leads/1234567/notes/XXXXXX"
          }
        }
      }
    ]
  }
}
```

---

## Editar notas (`PATCH`)

**Uma nota** — `PATCH /api/v4/{entity_type}/notes/{id}` (corpo é um **objeto único**). Segundo a doc, os campos obrigatórios são `id`, `note_type` e `params`:

```json
{
  "id": 43214321,
  "note_type": "sms_out",
  "params": {
    "text": "New outbound SMS",
    "phone": "+14155551234"
  }
}
```

**Várias notas (lote)** — `PATCH /api/v4/{entity_type}/notes` (corpo é um **array**; campos obrigatórios por item: `id` **e** `entity_id`; `note_type` e `params` são opcionais):

```json
[
  {
    "id": 12341234,
    "entity_id": 167353,
    "note_type": "sms_in",
    "params": { "text": "New incoming SMS", "phone": "+14155551234" }
  },
  {
    "id": 43214321,
    "entity_id": 167353,
    "note_type": "sms_out",
    "params": { "text": "New outbound SMS", "phone": "+14155551234" }
  }
]
```

Resposta de sucesso (200):

```json
{
  "_links": { "self": { "href": "https://example.kommo.com/api/v4/leads/notes" } },
  "_embedded": {
    "notes": [
      {
        "id": 76610423,
        "entity_id": 167353,
        "updated_at": 1588841241,
        "_links": { "self": { "href": "https://example.kommo.com/api/v4/leads/167353/notes/76610423" } }
      }
    ]
  }
}
```

---

## Resposta — Listar / obter notas (GET)

`GET /api/v4/{entity_type}/{entity_id}/notes` (200):

```json
{
    "_page": 1,
    "_links": {
        "self": {
            "href": "https://example.kommo.com/api/v4/leads/notes?filter%5Bid%5D%5B0%5D=42709325&filter%5Bid%5D%5B1%5D=42709842&page=1&limit=250"
        },
        "next": {
            "href": "https://example.kommo.com/api/v4/leads/notes?filter%5Bid%5D%5B0%5D=42709325&filter%5Bid%5D%5B1%5D=42709842&page=2&limit=250"
        }
    },
    "_embedded": {
        "notes": [
            {
                "id": 0,
                "entity_id": 0,
                "created_by": 0,
                "updated_by": 0,
                "created_at": 1540407495,
                "updated_at": 1540408317,
                "responsible_user_id": 123123,
                "group_id": 0,
                "note_type": "common",
                "params": {
                    "text": "Note text"
                },
                "account_id": 321321,
                "_links": {
                    "self": {
                        "href": "https://example.kommo.com/api/v4/leads/YYYYYY/notes/41234567"
                    }
                }
            },
            {
                "id": 0,
                "entity_id": 0,
                "created_by": 0,
                "updated_by": 0,
                "created_at": 1548280113,
                "updated_at": 1548280115,
                "responsible_user_id": 0,
                "group_id": 0,
                "note_type": "attachment",
                "params": {
                    "original_name": "Screenshot 2020-05-16 at 13.12.20.png",
                    "attachment": "gijy_Screenshot_2020-05-16_v_13.12.20.png"
                },
                "account_id": 1234567,
                "_links": {
                    "self": {
                        "href": "https://example.kommo.com/api/v4/leads/23456789/notes/34567890"
                    }
                }
            }
        ]
    }
}
```

`GET /api/v4/{entity_type}/notes/{id}` (obter uma única nota, 200):

```json
{
    "id": 1234567,
    "entity_id": "XXXXXX",
    "created_by": "ZZZZZZ",
    "updated_by": "ZZZZZZ",
    "created_at": 1540407495,
    "updated_at": 1540408317,
    "responsible_user_id": "YYYYYY",
    "group_id": 0,
    "note_type": "common",
    "params": {
        "text": "Note text"
    },
    "account_id": 123123,
    "_links": {
        "self": {
            "href": "https://example.kommo.com/api/v4/leads/12312312/notes/5555555"
        }
    }
}
```

`Content-Type` de resposta: `application/hal+json` (sucesso) ou `application/problem+json` (erro).

---

## Fixar / Desafixar nota (pin / unpin)

`POST /api/v4/{entity_type}/notes/{id}/pin` — **sem corpo**. Resposta de sucesso: **204 No Content** ("The note has been successfully pinned").

`POST /api/v4/{entity_type}/notes/{id}/unpin` — **sem corpo**. Resposta de sucesso: **204 No Content** ("The note has been successfully unpinned").

Disponível aos usuários da conta, dependendo das permissões sobre a entidade. O estado fixado é exposto na leitura via `?with=is_pinned` (campo `is_pinned: true/false`).

---

## Tabela de campos importantes (objeto note)

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | int | ID da nota |
| `entity_id` | int | ID da entidade pai da nota |
| `created_by` | int | ID do usuário que criou a nota |
| `updated_by` | int | ID do último usuário que editou |
| `created_at` | int | Data de criação (Unix Timestamp) |
| `updated_at` | int | Data da última edição (Unix Timestamp) |
| `responsible_user_id` | int | ID do usuário responsável pela nota |
| `group_id` | int | ID do grupo do usuário responsável |
| `note_type` | string | Tipo da nota |
| `params` | object | Propriedades da nota, dependentes do `note_type` |
| `account_id` | int | ID da conta onde a nota está |
| `is_pinned` | bool | Se a nota está fixada no card (exige `with=is_pinned` no GET) |
| `request_id` | string | (somente no POST) eco do valor enviado; não persiste |

---

## Limites / Rate limits

- **Máx. de requisições:** não exceder **7 requisições por segundo**. Excesso retorna **429 Too Many Requests**. Violações repetidas bloqueiam o IP e passam a retornar **403 Forbidden** em qualquer requisição.
- **Máx. de entidades por requisição (lote, add/update):** **250**. A Kommo **recomenda no máximo 50** por requisição para performance ótima e para evitar erros.
- **Máx. de entidades retornadas (GET):** **250** por requisição/página.
- **504 Gateway Timeout:** se receber, reduza a quantidade de entidades na requisição e tente novamente.
- **Paginação:** `limit` máximo **250** por página; use `page` + o link `_links.next` para percorrer.

Códigos de status comuns:

| Código | Significado |
|---|---|
| 200 | Sucesso |
| 204 | Sucesso sem conteúdo (pin/unpin) |
| 400 | Dados inválidos |
| 401 | Não autorizado (token inválido) |
| 402 | Conta não paga |
| 403 | Permissões insuficientes / IP bloqueado |
| 404 | Entidade não encontrada |
| 429 | Excesso de requisições |
| 504 | Timeout — reduza o lote e tente novamente |

---

## Pegadinhas e erros comuns (gotchas)

- **`entity_type` em inglês:** sempre `leads`/`contacts`/`companies` no caminho, mesmo em conta PT. Usar `contatos`/`empresas` resulta em 404.
- **POST e PATCH em lote esperam um ARRAY** no corpo (`[ { ... } ]`), não um objeto único. O PATCH em rota com `{id}` (uma nota) aceita objeto único.
- **No PATCH em lote** os campos `id` **e** `entity_id` são obrigatórios em cada item (`note_type` e `params` são opcionais).
- **No PATCH de uma nota** (`/notes/{id}`) a doc lista `id`, `note_type` e `params` como obrigatórios (não pede `entity_id`).
- **`request_id` não é salvo** — serve apenas para correlacionar a resposta com o item enviado; não tente lê-lo depois via GET.
- **`is_pinned` só aparece com `?with=is_pinned`** — sem o parâmetro, o campo não vem na resposta (não assuma `false`).
- **`attachment`:** o formato de `params` na **leitura** (`original_name`, `attachment`) difere do formato de **escrita** (`version_uuid`, `file_uuid`, `file_name`). Para anexar arquivos, o fluxo correto é o de upload de arquivos (Files API) e referenciar o `file_uuid`.
- **"10 tipos editáveis" vs. 9 documentados:** a visão geral fala em 10 tipos editáveis, mas a referência de tipos só detalha 9 (com `params`). Não há `note_type` `message_cashier` documentado nesta API; existe apenas o evento `message_to_cashier_note_added` (recurso de eventos), que não é criável como nota aqui.
- **`note_type` de sistema vs. editável:** nem todo evento do feed é uma nota editável via API; tipos como criação de contato são de sistema.
- **`params` como string JSON:** a referência descreve `params` ora como `object`, ora como "string (JSON)"; envie como objeto JSON nativo dentro do array (como nos exemplos oficiais).
- **Timestamps são Unix (segundos)**, não milissegundos — atenção em filtros `updated_at[from]/[to]`.
- **Rate limit estrito (7 req/s):** ao adicionar muitas notas, prefira lotes de até 50 por POST em vez de muitas chamadas unitárias, para não tomar 429/403.

---

## Exemplo de uso (curl)

Adicionar uma nota `common` a um lead:

```bash
curl -X POST "https://{subdominio}.kommo.com/api/v4/leads/notes" \
  -H "Authorization: Bearer {ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "entity_id": 1234567,
      "note_type": "common",
      "params": { "text": "Lead pediu retorno na sexta às 14h." },
      "request_id": "nota-001"
    }
  ]'
```

Listar as notas de um lead específico (com estado de fixado):

```bash
curl -X GET "https://{subdominio}.kommo.com/api/v4/leads/1234567/notes?with=is_pinned&limit=250" \
  -H "Authorization: Bearer {ACCESS_TOKEN}"
```

Fixar uma nota:

```bash
curl -X POST "https://{subdominio}.kommo.com/api/v4/leads/notes/76610423/pin" \
  -H "Authorization: Bearer {ACCESS_TOKEN}"
```

Desafixar uma nota:

```bash
curl -X POST "https://{subdominio}.kommo.com/api/v4/leads/notes/76610423/unpin" \
  -H "Authorization: Bearer {ACCESS_TOKEN}"
```

---

## Fontes

- https://developers.kommo.com/reference/notes
- https://developers.kommo.com/reference/notes-types.md
- https://developers.kommo.com/reference/add-notes.md
- https://developers.kommo.com/reference/notes-by-entity-id.md
- https://developers.kommo.com/reference/notes-list-entity.md
- https://developers.kommo.com/reference/note-by-id.md
- https://developers.kommo.com/reference/edit-note.md
- https://developers.kommo.com/reference/edit-notes.md
- https://developers.kommo.com/reference/pin-note.md
- https://developers.kommo.com/reference/unpin-note.md
- https://developers.kommo.com/llms.txt
- https://developers.kommo.com/docs/limitations (limites/rate limits; redireciona de www.kommo.com/developers/content/api/recommendations/)
