# Kommo API — Contatos (Contacts) API

## Visão geral do recurso

O recurso **Contatos** representa as pessoas físicas vinculadas a leads, empresas (companies) e clientes (customers) na conta. Um contato pode estar associado a vários leads e a uma ou mais empresas. Telefone e e-mail são armazenados como **campos personalizados** do tipo `multitext` (não são colunas próprias do contato).

Todos os endpoints usam:
- Base: `https://{subdominio}.kommo.com/api/v4/...`
- Autenticação: OAuth 2.0 — header `Authorization: Bearer {access_token}`
- Corpo: `Content-Type: application/json`
- Respostas seguem o padrão HAL (campos `_links`, `_embedded`, `_page`).

---

## Endpoints

| Ação | Método | Caminho |
|------|--------|---------|
| Listar contatos | `GET` | `https://{subdominio}.kommo.com/api/v4/contacts` |
| Obter contato por ID | `GET` | `https://{subdominio}.kommo.com/api/v4/contacts/{id}` |
| Adicionar contatos (lote) | `POST` | `https://{subdominio}.kommo.com/api/v4/contacts` |
| Atualizar vários contatos (lote) | `PATCH` | `https://{subdominio}.kommo.com/api/v4/contacts` |
| Atualizar um contato | `PATCH` | `https://{subdominio}.kommo.com/api/v4/contacts/{id}` |

Observação: tanto em POST quanto em PATCH no caminho `/contacts` (sem ID), o **corpo é um array** de objetos. No PATCH em `/contacts/{id}`, o corpo é **um único objeto**.

---

## Parâmetros de query (GET)

Válidos para `GET /api/v4/contacts` (a listagem). `GET /api/v4/contacts/{id}` aceita apenas `with`.

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `with` | string | Vários valores separados por vírgula. Adiciona entidades vinculadas ao `_embedded`. |
| `page` | int32 | Número da página. |
| `limit` | int32 | Quantidade de entidades por requisição. **Máx. 250.** |
| `query` | string/int | Busca por valores de campos personalizados (full-text nos campos do contato). |
| `order[updated_at]` | enum `asc`/`desc` | Ordena a lista pela data de atualização. |
| `order[id]` | enum `asc`/`desc` | Ordena a lista por ID. |
| `filter[id][]` | array int32 | Filtra por ID(s) de contato. |
| `filter[name][]` | array string | Filtra por nome do contato. |
| `filter[created_by][]` | array int32 | Filtra por ID do usuário que criou o contato. |
| `filter[updated_by][]` | array int32 | Filtra por ID do último usuário que atualizou o contato. |
| `filter[responsible_user_id][]` | array int32 | Filtra por ID do usuário responsável. |
| `filter[updated_at][from]` | int32 (Unix Timestamp) | Atualizados depois da data. |
| `filter[updated_at][to]` | int32 (Unix Timestamp) | Atualizados antes da data. |
| `filter[closest_task_at][from]` | int32 (Unix Timestamp) | Tarefa mais próxima de concluir, a partir da data. |
| `filter[closest_task_at][to]` | int32 (Unix Timestamp) | Tarefa mais próxima de concluir, até a data. |

> **Sobre `filter[created_at]`:** a lista oficial em inglês (`reference/contacts-list`) **NÃO** inclui filtro por `created_at` — só `updated_at` e `closest_task_at`. A versão PT (`pt-developers.kommo.com/reference/lista-de-contatos`) lista `filter[created_at][from]` (sem o `[to]` correspondente). Como há divergência entre as versões da doc, **não confie em `created_at` para contatos**; para janelas de criação, considere `updated_at` ou valide no seu ambiente antes de usar.

### Valores do parâmetro `with`

Documentados oficialmente para o recurso de contatos (`contacts-list` e `get-contact`):
- **`leads`** — adiciona os leads vinculados ao contato em `_embedded.leads`.
- **`catalog_elements`** — adiciona elementos de catálogo vinculados em `_embedded.catalog_elements`.

Sempre presentes no `_embedded` independentemente do `with`:
- **`tags`** e **`companies`** vêm por padrão na resposta.
- **`customers`** aparece na chave `_embedded.customers` da resposta de `GET /contacts/{id}` (no exemplo oficial vem como array, vazio por padrão), mas **`customers` não está documentado como valor aceito do parâmetro `with`** — apenas `leads` e `catalog_elements` constam na lista oficial. *(Não confirmado como valor de `with`; tratar como entidade que aparece no `_embedded`.)*

Exemplo:
```
GET /api/v4/contacts?with=leads,catalog_elements&page=1&limit=50&order[updated_at]=desc
GET /api/v4/contacts?query=John&filter[responsible_user_id][]=504141
GET /api/v4/contacts/3?with=leads
```

---

## Corpo da requisição — exemplos JSON reais

### POST `/api/v4/contacts` (adicionar contatos — array)

Exemplo oficial: o segundo contato usa só `name` + `created_by`; o primeiro envia o telefone como campo personalizado sem subtipo (`enum`/`enum_code`):

```json
[
    {
        "first_name": "Peter",
        "last_name": "Parker",
        "custom_fields_values": [
            {
                "field_id": 178382,
                "values": [
                    { "value": "+19651796214" }
                ]
            }
        ]
    },
    {
        "name": "Jane Doe",
        "created_by": 8375357
    }
]
```

### PATCH `/api/v4/contacts` (atualizar vários — array, exige `id` em cada item)

```json
[
    {
        "id": 963410,
        "first_name": "John",
        "last_name": "Doe",
        "custom_fields_values": [
            {
                "field_id": 178382,
                "field_name": "Work phone",
                "values": [
                    { "value": "+14155551234", "enum_code": "WORK" }
                ]
            }
        ]
    }
]
```

### PATCH `/api/v4/contacts/{id}` (atualizar um — objeto único)

```json
{
    "id": 963410,
    "first_name": "John",
    "last_name": "Doe",
    "custom_fields_values": [
        {
            "field_id": 178382,
            "field_name": "Work phone",
            "values": [
                { "value": "+14155551234", "enum_code": "WORK" }
            ]
        }
    ]
}
```

> Para **adicionar/editar tags** no corpo, use `_embedded.tags` (objetos com `id` ou `name`). Para **vincular a leads/empresas/clientes**, prefira o endpoint de links da entidade (`/api/v4/contacts/{id}/link`) — *(parâmetros do endpoint de links não detalhados aqui; verificar a página "Link entities".)*

---

## Respostas — exemplos JSON reais

### POST `/api/v4/contacts` → 200 (criados)
O `request_id` é o eco do que você enviou; se você não enviar um, vem o índice do item no array ("0", "1", ...). Ele **não é salvo** no contato.

```json
{
    "_links": {
        "self": { "href": "https://devteam.kommo.com/api/v4/contacts" }
    },
    "_embedded": {
        "contacts": [
            {
                "id": 963408,
                "is_deleted": false,
                "is_unsorted": false,
                "request_id": "0",
                "_links": { "self": { "href": "https://devteam.kommo.com/api/v4/contacts/963408" } }
            },
            {
                "id": 963410,
                "is_deleted": false,
                "is_unsorted": false,
                "request_id": "1",
                "_links": { "self": { "href": "https://devteam.kommo.com/api/v4/contacts/963410" } }
            }
        ]
    }
}
```

### PATCH `/api/v4/contacts` e PATCH `/api/v4/contacts/{id}` → 200 (atualizados)
Mesmo atualizando um único contato, a resposta envolve o resultado em `_embedded.contacts` (array):

```json
{
    "_links": {
        "self": { "href": "https://devteam.kommo.com/api/v4/contacts" }
    },
    "_embedded": {
        "contacts": [
            {
                "id": 963410,
                "name": "John Doe",
                "updated_at": 1687192924,
                "is_deleted": false,
                "is_unsorted": false,
                "_links": { "self": { "href": "https://devteam.kommo.com/api/v4/contacts/963410" } }
            }
        ]
    }
}
```

### GET `/api/v4/contacts` → 200 (lista)
Note `custom_fields_values: null` quando o contato não tem campos preenchidos, e `companies` sempre presente no `_embedded`:

```json
{
    "_page": 1,
    "_links": {
        "self": { "href": "https://devteam.kommo.com/api/v4/contacts" }
    },
    "_embedded": {
        "contacts": [
            {
                "id": 406322,
                "name": "Sam",
                "first_name": "Sam",
                "last_name": "",
                "responsible_user_id": 8375357,
                "group_id": 0,
                "created_by": 8375357,
                "updated_by": 8375357,
                "created_at": 1686670710,
                "updated_at": 1686670710,
                "closest_task_at": null,
                "is_deleted": false,
                "is_unsorted": false,
                "custom_fields_values": [
                    {
                        "field_id": 178382,
                        "field_name": "Phone",
                        "field_code": "PHONE",
                        "field_type": "multitext",
                        "values": [
                            { "value": "19651796212", "enum_id": 126290, "enum_code": "WORK" }
                        ]
                    }
                ],
                "account_id": 31361463,
                "_links": { "self": { "href": "https://devteam.kommo.com/api/v4/contacts/406322" } },
                "_embedded": {
                    "tags": [],
                    "companies": [
                        {
                            "id": 406320,
                            "_links": { "self": { "href": "https://devteam.kommo.com/api/v4/companies/406320" } }
                        }
                    ]
                }
            }
        ]
    }
}
```

### GET `/api/v4/contacts/{id}?with=leads,catalog_elements` → 200
Exemplo oficial (`reference/get-contact`). O `_embedded` traz **todas** as chaves de entidade (`tags`, `leads`, `customers`, `catalog_elements`, `companies`); no exemplo elas vêm vazias, exceto `companies`:

```json
{
    "id": 3,
    "name": "John Doe",
    "first_name": "John",
    "last_name": "Doe",
    "responsible_user_id": 504141,
    "group_id": 0,
    "created_by": 504141,
    "updated_by": 504141,
    "created_at": 1582117331,
    "updated_at": 1590943929,
    "closest_task_at": null,
    "custom_fields_values": [
        {
            "field_id": 3,
            "field_name": "Work phone",
            "field_code": "PHONE",
            "field_type": "multitext",
            "values": [
                { "value": "+14155551234", "enum_id": 1, "enum": "WORK" }
            ]
        }
    ],
    "account_id": 28805383,
    "_embedded": {
        "tags": [],
        "leads": [],
        "customers": [],
        "catalog_elements": [],
        "companies": [
            { "id": 1, "_links": { "self": { "href": "https://example.amocrm.com/api/v4/companies/1" } } }
        ]
    }
}
```

> Atenção: neste exemplo oficial (mais antigo) o subtipo na leitura aparece como **`"enum": "WORK"`**, enquanto o exemplo da lista (`contacts-list`) usa **`"enum_code": "WORK"`** (com `enum_id` numérico). Ao **escrever** (POST/PATCH), use **`enum_code`** ou **`enum_id`** — `enum` (sozinho) é formato legado de resposta, não use ao gravar.

---

## Tabela de campos importantes do contato

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | int | ID do contato. |
| `name` | string | Nome completo do contato. |
| `first_name` | string | Primeiro nome. Se enviado junto com `last_name`, o `name` é montado automaticamente. |
| `last_name` | string | Sobrenome. |
| `responsible_user_id` | int32 | ID do usuário responsável. |
| `group_id` | int | ID do grupo/equipe do responsável. |
| `created_by` | int32 | ID do usuário que criou. Pode ser `0` (criado por sistema/integração). |
| `updated_by` | int32 | ID do último usuário que atualizou. |
| `created_at` | int32 | Data de criação (Unix Timestamp). |
| `updated_at` | int32 | Data de atualização (Unix Timestamp). |
| `closest_task_at` | int32/null | Data da tarefa mais próxima de concluir (Unix Timestamp). |
| `is_deleted` | bool | Se o contato está na lixeira. |
| `is_unsorted` | bool | Se veio de entrada não organizada (Incoming Leads/Unsorted). |
| `custom_fields_values` | array/null | Campos personalizados (inclui telefone e e-mail). `null` se vazio. |
| `account_id` | int | ID da conta. |
| `request_id` | string | Apenas em criação/atualização: ecoado na resposta, **não é salvo**. |
| `_embedded.tags` | array | Tags (id/name/color). Sempre presente. |
| `_embedded.companies` | array | Empresas vinculadas. Sempre presente. |
| `_embedded.leads` | array | Leads vinculados (com `with=leads`). |
| `_embedded.customers` | array | Clientes vinculados (presente no `_embedded` de `GET /contacts/{id}`). |
| `_embedded.catalog_elements` | array | Elementos de catálogo (com `with=catalog_elements`). |

### Estrutura de `custom_fields_values` (telefone/e-mail)

```json
{
    "field_id": 178382,
    "field_code": "PHONE",
    "field_type": "multitext",
    "values": [
        { "value": "...", "enum_id": 126290, "enum_code": "WORK" }
    ]
}
```

| Subcampo de `values` | Tipo | Descrição |
|---------------------|------|-----------|
| `value` | string | O valor (número de telefone ou e-mail). |
| `enum_id` | int | ID do subtipo do valor. |
| `enum_code` | string | Código do subtipo do valor (alternativa ao `enum_id`). |

**Telefone (`field_code: "PHONE"`)** — `enum_code` aceitos:
`WORK` (trabalho), `WORKDD` (trabalho direto), `MOB` (celular), `FAX` (fax), `HOME` (casa), `OTHER` (outro).

**E-mail (`field_code: "EMAIL"`)** — `enum_code` aceitos:
`WORK` (trabalho), `PRIV` (pessoal), `OTHER` (outro).

Identificação do campo: você pode usar **`field_id`** OU **`field_code`** (ex.: `"PHONE"`, `"EMAIL"`) — a doc diz "you must pass either `field_id` or `field_code` to fill it". Em campos `multitext` é possível enviar vários valores, cada um com `enum_id` **ou** `enum_code`. Exemplo enviando dois telefones com identificadores diferentes:

```json
"custom_fields_values": [
    {
        "field_id": 31,
        "values": [
            { "value": "+18001111111", "enum_id": 48224 },
            { "value": "+18002222222", "enum_code": "HOME" }
        ]
    }
]
```

Tipos de campo (`field_type`) documentados na plataforma: `text`, `numeric`, `checkbox`, `select`, `multiselect`, `date`, `url`, `textarea`, `radiobutton`, `streetaddress`, `smart_address`, `birthday`, `legal_entity`, `date_time`, `price`, `category`, `multitext`, `tracking_data`, `linked_entity`, `chained_list`, `monetary`, `file`. Telefone e e-mail são sempre `multitext`.

---

## Limites / rate limits

- **Máx. 7 requisições por segundo.** Excedendo, retorna **429 Too Many Requests**. Violações repetidas podem bloquear o IP com **403 Forbidden**.
- **Máx. 250 entidades por resposta** (`limit` ≤ 250) ao listar.
- **Máx. 250 entidades adicionadas/atualizadas** por requisição em lote. Recomendado pela Kommo: **não mais que 50** por lote para melhor desempenho; lotes grandes demais podem gerar **504** (reduza o lote e tente de novo).
- Limites relacionados úteis: **máx. 40 valores de campo personalizado** por entidade em adições complexas.

---

## Pegadinhas e erros comuns (gotchas)

- **`enum_code`/`enum_id` ao gravar; `enum` é legado**: ao escrever (POST/PATCH) use `enum_code` (texto) ou `enum_id` (número). O exemplo legado de leitura com `"enum": "WORK"` (em `get-contact`) está desatualizado — não copie esse formato ao gravar.
- **`customers` não é valor de `with`**: só `leads` e `catalog_elements` estão documentados como `with` para contatos. `customers` aparece na chave `_embedded` da resposta de `GET /contacts/{id}`, mas não como parâmetro `with`.
- **`filter[created_at]` divergente**: ausente na doc EN, presente só com `[from]` na doc PT. Não confie em filtrar contatos por data de criação; use `updated_at`.
- **Telefone/e-mail não são campos próprios**: vão em `custom_fields_values` como `multitext`. Procurar `phone`/`email` no nível raiz do contato não funciona.
- **`name` vs `first_name`/`last_name`**: enviar `first_name`+`last_name` monta o `name`. Enviar `name` direto também funciona, mas misturar pode gerar resultado inesperado.
- **POST/PATCH em `/contacts` precisam de array**; PATCH em `/contacts/{id}` precisa de objeto. Trocar isso gera 400.
- **`custom_fields_values: null`**: na resposta, contatos sem campos vêm com `null` (não array vazio) — trate isso no código.
- **`request_id` não é salvo**: serve só para correlacionar itens do lote na resposta; não é atributo persistente do contato.
- **`limit` máximo 250**: pedir mais é limitado a 250; pagine com `page`.
- **Filtros são arrays**: use `filter[id][]=...` (com colchetes), não `filter[id]=...`.
- **Resposta de PATCH único também vem em array**: mesmo ao atualizar um contato, a resposta vem em `_embedded.contacts` (array de 1).
- **429/403**: implemente *retry* com backoff e respeite o teto de 7 req/s; concentre operações em lotes (≤50).
- **OAuth obrigatório**: sem `Authorization: Bearer` válido → 401 `{"title":"Unauthorized", ...}`.

### Exemplo de resposta de erro de validação (400)
```json
{
    "validation-errors": [
        {
            "request_id": "0",
            "errors": [
                {
                    "code": "NotSupportedChoice",
                    "path": "custom_fields_values.0.field_id",
                    "detail": "The value you selected is not a valid choice."
                }
            ]
        }
    ],
    "title": "Bad Request",
    "status": 400
}
```

### Exemplo de resposta 401 (não autorizado)
```json
{
    "title": "Unauthorized",
    "type": "https://httpstatus.es/401",
    "status": 401,
    "detail": "Invalid user name or password"
}
```

---

## Exemplo de uso (curl)

Criar um contato com nome, responsável, telefone (MOB) e e-mail (WORK):

```bash
curl -X POST 'https://meusubdominio.kommo.com/api/v4/contacts' \
  -H 'Authorization: Bearer eyJ0eXAiOiJKV1Qi...' \
  -H 'Content-Type: application/json' \
  -d '[
    {
      "first_name": "Maria",
      "last_name": "Silva",
      "responsible_user_id": 504141,
      "custom_fields_values": [
        {
          "field_code": "PHONE",
          "values": [ { "value": "+5511999998888", "enum_code": "MOB" } ]
        },
        {
          "field_code": "EMAIL",
          "values": [ { "value": "maria@empresa.com", "enum_code": "WORK" } ]
        }
      ]
    }
  ]'
```

Atualizar o responsável de um contato existente:

```bash
curl -X PATCH 'https://meusubdominio.kommo.com/api/v4/contacts/963410' \
  -H 'Authorization: Bearer eyJ0eXAiOiJKV1Qi...' \
  -H 'Content-Type: application/json' \
  -d '{ "responsible_user_id": 504141 }'
```

Listar contatos atualizados recentemente, com leads vinculados:

```bash
curl -X GET 'https://meusubdominio.kommo.com/api/v4/contacts?with=leads&order[updated_at]=desc&limit=50' \
  -H 'Authorization: Bearer eyJ0eXAiOiJKV1Qi...'
```

---

## Fontes

- https://developers.kommo.com/reference/contacts-list — Contacts List (GET): parâmetros, filtros, valores `with` (`leads`, `catalog_elements`), limite 250, exemplo de resposta da lista.
- https://developers.kommo.com/reference/add-contacts — Add contacts (POST): corpo em array, exemplos request/response, comportamento de `request_id` (índice "0","1",...).
- https://developers.kommo.com/reference/get-contact — Get a contact by ID (GET): exemplo de resposta com `_embedded` completo (`leads`/`customers`/`catalog_elements`/`companies`/`tags`) e subtipo legado `"enum"`.
- https://developers.kommo.com/reference/update-contacts — Update contacts (PATCH lote): corpo em array, `id` obrigatório por item, exemplo request/response.
- https://developers.kommo.com/reference/update-contact — Update a contact (PATCH único): corpo objeto único, resposta envolvida em `_embedded.contacts`.
- https://pt-developers.kommo.com/reference/lista-de-contatos — Lista de Contatos (PT): parâmetros/filtros; única fonte que cita `filter[created_at][from]`.
- https://developers.kommo.com/reference/custom-fields — Custom fields: tipos de campo, estrutura `multitext` (`value`/`enum_id`/`enum_code`), códigos PHONE (`WORK`/`WORKDD`/`MOB`/`FAX`/`HOME`/`OTHER`) e EMAIL (`WORK`/`PRIV`/`OTHER`), "pass either field_id or field_code".
- https://developers.kommo.com/docs/limitations — Limites: 7 req/s, 429/403, máx. 250 entidades, recomendação ≤50 por lote, 504 em lote grande, 40 valores de campo por entidade.
- https://developers.kommo.com/docs/http-codes — Códigos HTTP: exemplos reais de 400 (`validation-errors`) e 401 (`Unauthorized`).
