# Kommo API — Empresas (Companies) API

## Visão geral do recurso

O recurso **Empresas (Companies)** representa as organizações no CRM da Kommo (ex-amoCRM). Uma empresa é uma entidade independente que pode ser vinculada a **contatos** e **leads**. É uma das três entidades centrais do CRM (leads, contatos, empresas) e compartilha a mesma estrutura de campos personalizados (`custom_fields_values`), tags, usuário responsável e vínculos.

- **Base URL:** `https://{subdominio}.kommo.com/api/v4/companies`
- **Autenticação:** OAuth 2.0 (header `Authorization: Bearer {access_token}`).
- **Content-Type da resposta:** `application/hal+json` (formato HAL — usa `_links` e `_embedded`).
- Em respostas de listagem/criação/atualização, os objetos retornam dentro de `_embedded.companies`.
- Relação com leads: uma empresa pode ter **vários** leads, mas **um lead só pode ter uma empresa** vinculada (relação 1:N do lado da empresa).

---

## Endpoints

| Operação | Método | Caminho |
|---|---|---|
| Listar empresas | `GET` | `https://{subdominio}.kommo.com/api/v4/companies` |
| Obter empresa por ID | `GET` | `https://{subdominio}.kommo.com/api/v4/companies/{id}` |
| Adicionar empresas (1+) | `POST` | `https://{subdominio}.kommo.com/api/v4/companies` |
| Atualizar várias empresas (lote) | `PATCH` | `https://{subdominio}.kommo.com/api/v4/companies` |
| Atualizar uma empresa | `PATCH` | `https://{subdominio}.kommo.com/api/v4/companies/{id}` |
| Listar campos personalizados | `GET` | `https://{subdominio}.kommo.com/api/v4/companies/custom_fields` |
| Vincular empresa a outra entidade | `POST` | `https://{subdominio}.kommo.com/api/v4/companies/{id}/link` |
| Listar vínculos da empresa | `GET` | `https://{subdominio}.kommo.com/api/v4/companies/{id}/links` |

> A referência de Companies consultada não documenta um endpoint dedicado de exclusão (`DELETE`) de empresa. A exclusão é feita pelo endpoint genérico de exclusão de entidades da plataforma (não confirmado na doc de Companies). O campo `is_deleted` aparece nas respostas.

---

## Parâmetros de query (listagem)

`GET /api/v4/companies`

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `with` | string | Dados adicionais a embutir, separados por vírgula. Valores aceitos: `leads`, `contacts`, `catalog_elements`. |
| `page` | int | Número da página (paginação). |
| `limit` | int | Quantidade de entidades por requisição. **Máximo 250**. |
| `query` | string | Busca pelo conteúdo de campos (inclui valores de campos personalizados). |
| `order[updated_at]` | enum | Ordena por data de atualização: `asc` ou `desc`. |
| `order[id]` | enum | Ordena por ID: `asc` ou `desc`. |
| `filter[id][]` | array<int> | Filtra por IDs de empresa. |
| `filter[name][]` | array<string> | Filtra por nome da empresa. |
| `filter[created_by][]` | array<int> | Filtra pelo ID do usuário criador. |
| `filter[updated_by][]` | array<int> | Filtra pelo ID do último usuário que editou. |
| `filter[responsible_user_id][]` | array<int> | Filtra pelo usuário responsável. |
| `filter[created_at][from]` / `[to]` | int (Unix) | Intervalo de data de criação. |
| `filter[updated_at][from]` / `[to]` | int (Unix) | Intervalo de data de atualização. |
| `filter[closest_task_at][from]` / `[to]` | int (Unix) | Intervalo da data da tarefa mais próxima. |

**Exemplo:**
```
GET /api/v4/companies?with=contacts,leads&page=1&limit=100&order[updated_at]=desc&filter[responsible_user_id][]=837123
```

**Códigos HTTP (listagem):** **200** (sucesso), **401** (não autorizado).

---

## Listar empresas — exemplo de resposta (200)

```json
{
    "_page": 1,
    "_links": {
        "self": {
            "href": "https://subdomain.kommo.com/api/v4/companies"
        }
    },
    "_embedded": {
        "companies": [
            {
                "id": 406320,
                "name": "United",
                "responsible_user_id": 837123,
                "group_id": 0,
                "created_by": 12345,
                "updated_by": 67890,
                "created_at": 1686670709,
                "updated_at": 1686670709,
                "closest_task_at": null,
                "is_deleted": false,
                "custom_fields_values": null,
                "account_id": 1234123,
                "_links": {
                    "self": {
                        "href": "https://subdomain.kommo.com/api/v4/companies/406320"
                    }
                },
                "_embedded": {
                    "tags": []
                }
            },
            {
                "id": 510864,
                "name": "Kommo",
                "responsible_user_id": 837456,
                "group_id": 0,
                "created_by": 0,
                "updated_by": 0,
                "created_at": 1686754687,
                "updated_at": 1686754687,
                "closest_task_at": null,
                "is_deleted": false,
                "custom_fields_values": null,
                "account_id": 2311263,
                "_links": {
                    "self": {
                        "href": "https://subdomain.kommo.com/api/v4/companies/510864"
                    }
                },
                "_embedded": {
                    "tags": []
                }
            }
        ]
    }
}
```

> A doc de listagem de empresas documenta apenas **200** e **401**. (A doc não documenta explicitamente um corpo vazio / 204 para a listagem — em outras entidades da Kommo, listagens sem resultado costumam retornar **204 No Content**, mas isso não está confirmado na página de Companies.)

---

## Obter empresa por ID

`GET /api/v4/companies/{id}`

- Path: `id` (int, obrigatório).
- Query: `with` (string, opcional — `leads`, `contacts`, `catalog_elements`).
- Header: `accept` (default `application/json`).

**Resposta (200):**
```json
{
    "id": 406320,
    "name": "United",
    "responsible_user_id": 837123,
    "group_id": 0,
    "created_by": 837123,
    "updated_by": 837123,
    "created_at": 1686670709,
    "updated_at": 1686670709,
    "closest_task_at": null,
    "is_deleted": false,
    "custom_fields_values": null,
    "account_id": 3123123,
    "_links": {
        "self": {
            "href": "https://subdomain.kommo.com/api/v4/companies/406320"
        }
    },
    "_embedded": {
        "tags": []
    }
}
```

**Códigos HTTP:** **200** (sucesso), **204** (No Content — empresa não existe), **401** (não autorizado).

---

## Adicionar empresas

`POST /api/v4/companies` — corpo é um **array** de objetos (permite criar uma ou várias empresas na mesma requisição).

**Parâmetros do corpo:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `name` | string | Não | Nome da empresa. |
| `responsible_user_id` | int | Não | ID do usuário responsável. |
| `created_by` | int | Não | ID do usuário criador. |
| `updated_by` | int | Não | ID do último usuário que atualizou. |
| `created_at` | int (Unix) | Não | Data de criação. |
| `updated_at` | int (Unix) | Não | Data de atualização. |
| `custom_fields_values` | array | Não | Valores dos campos personalizados (com `field_id`/`field_code` e `values`). |
| `tags_to_add` | array | Não | Tags a adicionar (objetos com `id` ou `name`). |
| `request_id` | string | Não | Retornado inalterado na resposta (não é salvo); útil para casar entrada/saída em lotes. |

**Corpo (request) — exemplo:**
```json
[
  {
    "name": "Acme Co.",
    "custom_fields_values": [
      {
        "field_code": "PHONE",
        "values": [
          {
            "value": "+18305803077",
            "enum_code": "WORK"
          }
        ]
      }
    ]
  }
]
```

**Resposta (200):**
```json
{
  "_links": {
    "self": {
      "href": "https://devteam.kommo.com/api/v4/companies"
    }
  },
  "_embedded": {
    "companies": [
      {
        "id": 1247556,
        "is_deleted": false,
        "request_id": "0",
        "_links": {
          "self": {
            "href": "https://devteam.kommo.com/api/v4/companies/1247556"
          }
        }
      }
    ]
  }
}
```
> Quando `request_id` não é enviado, a Kommo preenche com o índice do objeto no array (`"0"`, `"1"`, ...).

---

## Atualizar empresas

### Em lote — `PATCH /api/v4/companies`
Corpo é um **array**; cada objeto **exige `id`**.

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | int | ✓ | ID da empresa. |
| `name` | string | | Nome da empresa. |
| `responsible_user_id` | int | | ID do usuário responsável. |
| `created_by` | int | | ID do usuário criador. |
| `updated_by` | int | | ID do último usuário que atualizou. |
| `created_at` | int (Unix) | | Data de criação. |
| `updated_at` | int (Unix) | | Data de atualização. |
| `custom_fields_values` | array (JSON) | | Valores dos campos. |
| `tags_to_add` | array | | Tags a adicionar (`id` ou `name`). |
| `tags_to_delete` | array | | Tags a remover (`id` ou `name`). |
| `request_id` | string | | Retornado inalterado; não é salvo. |

**Request:**
```json
[
  {
    "id": 123456,
    "name": "Updated Company Name",
    "responsible_user_id": 789,
    "tags_to_add": [
      { "id": 1 },
      { "name": "Partnership" }
    ],
    "tags_to_delete": [
      { "name": "Inactive" }
    ],
    "request_id": "req-001"
  }
]
```

**Códigos HTTP:** **200** (sucesso), **400** (dados inválidos), **401** (não autorizado).

### Uma empresa — `PATCH /api/v4/companies/{id}`
Path `id` (int, obrigatório). Corpo é um **objeto** (não array). Campos opcionais iguais aos do lote (sem `id` no corpo). Aceita também `_embedded.tags` (objetos com `id` e `name`), além de `tags_to_add`/`tags_to_delete`.

**Request:**
```json
{
  "name": "Atlas Co.",
  "custom_fields_values": [
    {
      "field_code": "EMAIL",
      "values": [
        {
          "value": "support@atlas.com",
          "enum_code": "WORK"
        }
      ]
    }
  ]
}
```

**Resposta (200) — vale para lote e individual:**
```json
{
  "_links": {
    "self": {
      "href": "https://subdomain.kommo.com/api/v4/companies"
    }
  },
  "_embedded": {
    "companies": [
      {
        "id": 123456,
        "name": "Atlas Co.",
        "updated_at": 1687335927,
        "is_deleted": false,
        "_links": {
          "self": {
            "href": "https://subdomain.kommo.com/api/v4/companies/123456"
          }
        }
      }
    ]
  }
}
```

---

## Tabela de campos da empresa

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | int | Identificador único da empresa. |
| `name` | string | Nome da empresa. |
| `responsible_user_id` | int | ID do usuário responsável. |
| `group_id` | int | ID do grupo/departamento do responsável (`0` quando não há). |
| `created_by` | int | ID do usuário criador (`0` se via integração/sem usuário). |
| `updated_by` | int | ID do último usuário a editar. |
| `created_at` | int (Unix) | Timestamp de criação. |
| `updated_at` | int (Unix) | Timestamp da última atualização. |
| `closest_task_at` | int (Unix)\|null | Data da tarefa em aberto mais próxima. |
| `is_deleted` | bool | Indica se a empresa foi excluída. |
| `custom_fields_values` | array\|null | Valores dos campos personalizados (`null` quando vazio). |
| `account_id` | int | ID da conta Kommo dona da empresa. |
| `_links` | object | Links HAL (ex.: `self`). |
| `_embedded` | object | Dados embutidos: `tags`, e (com `with`) `contacts`, `leads`, `catalog_elements`. |

---

## `custom_fields_values` — estrutura por tipo de campo

Identifique o campo por `field_id` **ou** `field_code` (o code só existe em campos com código definido, como `PHONE`/`EMAIL`). O conteúdo de `values` varia por tipo:

| Tipo de campo | Como passar o valor |
|---|---|
| `text`, `numeric`, `textarea`, `price`, `streetaddress`, `monetary`, `tracking_data` | `{"value": "texto"}` |
| `checkbox` | `{"value": true}` (boolean) |
| `url` | `{"value": "https://..."}` |
| `date`, `date_time`, `birthday` | `{"value": 1577836800}` (Unix timestamp) ou string RFC-3339 |
| `select`, `radiobutton`, `category` | `{"value": "rótulo"}` **ou** `{"enum_id": 17}` |
| `multiselect` | vários objetos: `[{"enum_id": 17}, {"enum_id": 19}]` (aceita `value` ou `enum_id`) |
| `multitext` (PHONE/EMAIL) | `{"value": "+18001111111", "enum_code": "WORK"}` ou `enum_id`. Códigos de telefone: `WORK, WORKDD, MOB, FAX, HOME, OTHER`; de e-mail: `WORK, PRIV, OTHER`. |
| `smart_address` | vários objetos `{"value": "...", "enum_id": 1}` / `enum_code` por componente. Enum codes: `address_line_1, address_line_2, city, state, zip, country`. |
| `legal_entity` | `{"value": {"name": "...", "entity_type": 1, "vat_id": "..."}}` — `name` é obrigatório |
| `linked_entity` | `{"value": {"name": "...", "entity_id": 24833339, "entity_type": "contacts"}}` |
| `chained_list` | `{"catalog_id": 1001, "catalog_element_id": 12235}` (até 5 elementos) |
| `file` | `{"value": {"file_uuid": "...", "file_name": "...", "file_size": 20763}}` |

**Exemplos verbatim:**
```json
{ "field_id": 11, "values": [{ "value": "value 1" }] }
```
```json
{ "field_id": 111, "values": [{ "enum_id": 17 }, { "enum_id": 19 }] }
```
```json
{
  "field_id": 31,
  "values": [
    { "value": "+18001111111", "enum_id": 48224 },
    { "value": "+18002222222", "enum_code": "HOME" }
  ]
}
```
```json
{
  "field_id": 25,
  "values": [
    { "value": { "name": "The Origin Lab", "entity_type": 1, "vat_id": "123123123" } }
  ]
}
```

### Campos personalizados — listar definições
`GET /api/v4/companies/custom_fields` retorna, por campo: `id`, `name`, `code`, `type`, `sort`, `entity_type` (`"companies"`), `enums`, `currency`, `is_predefined`, `is_deletable`, `is_api_only`, `group_id`.

Parâmetros de query suportados: `page`, `limit` (máx 250), `order[sort]`, `order[id]`, `filter[type][0]`.

Tipos disponíveis para empresas: `text`, `numeric`, `checkbox`, `select`, `multiselect`, `date`, `url`, `textarea`, `radiobutton`, `streetaddress`, `smart_address`, `birthday`, `date_time`, `legal_entity`, `price`, `category`, `items`.

---

## Vínculos (contatos e leads)

### Vincular — `POST /api/v4/companies/{id}/link`
Corpo é um **array**. Parâmetros por objeto:

- `to_entity_id` (int, obrigatório) — ID da entidade a vincular.
- `to_entity_type` (string, obrigatório) — `leads`, `contacts`, `companies`, `catalog_elements`.
- `metadata` (objeto, opcional) — `catalog_id` (int, ID da lista), `quantity` (int), `is_main` (bool, marca contato principal), `updated_by` (int, usuário que fez o vínculo).

```json
[
  {
    "to_entity_id": 12345,
    "to_entity_type": "contacts",
    "metadata": {
      "is_main": true,
      "updated_by": 456
    }
  }
]
```

**Resposta (200):**
```json
{
  "_total_items": 1,
  "_links": { "self": { "href": "https://example.kommo.com/api/v4/companies/123456/links" } },
  "_embedded": {
    "links": [
      {
        "to_entity_id": 12345,
        "to_entity_type": "contacts",
        "metadata": { "main_contact": true }
      }
    ]
  }
}
```
> Atenção à diferença de nome: no **request** o campo é `is_main`; na **resposta** ele aparece como `main_contact`.

### Listar vínculos — `GET /api/v4/companies/{id}/links`
Filtros: `filter[to_entity_type]`, `filter[to_entity_id]` (exige `to_entity_type` em par), `filter[to_catalog_id]`.
```json
{
  "_total_items": 2,
  "_links": { "self": { "href": "https://example.kommo.com/api/v4/companies/7593303/links?page=1&limit=50" } },
  "_embedded": {
    "links": [
      { "to_entity_id": 11069775, "to_entity_type": "contacts", "metadata": { "main_contact": true } },
      { "to_entity_id": 11271229, "to_entity_type": "leads", "metadata": null }
    ]
  }
}
```

### Vínculo automático na criação de lead
Ao criar um lead com contato e empresa via `_embedded`, a empresa é criada e já vinculada ao lead/contato ("When you create a new contact and company, they will be linked together"). Estrutura mínima embutida:
```json
{
  "name": "New lead 1",
  "price": 2222,
  "_embedded": {
    "companies": [
      { "name": "HelloKommo" }
    ],
    "contacts": [
      { "first_name": "Adamant" }
    ]
  }
}
```
> A doc é explícita: "For one lead, you can specify no more than one related contact and one related company" e "This array always consists of 1 element, as a lead can have only one company linked to it". Ou seja, **uma empresa por lead**.

---

## Limites e rate limits

- **`limit` por página:** máximo **250**.
- **Lote de criação/atualização:** até **250** entidades por requisição (POST/PATCH), mas a doc **recomenda lotes de ≤50** para melhor desempenho.
- **Campos personalizados por entidade:** até **40** valores de campo na adição de lead complexo.
- **Rate limit:** até **7 requisições por segundo por IP**. Exceder retorna **429 Too Many Requests** (com `retry_after` ~300s). Violações repetidas levam a bloqueio do IP e **403 Forbidden** em qualquer requisição.
- Se receber **504**, reduza o tamanho do lote e tente novamente.
- Operações respeitam as permissões do usuário do token.

---

## Pegadinhas e erros comuns (gotchas)

- **Criação/lote usam ARRAY; PATCH por ID usa OBJETO.** `POST /companies` e `PATCH /companies` (lote) recebem `[ {...} ]`; `PATCH /companies/{id}` recebe `{ ... }`. Trocar isso causa **400**.
- **`GET /companies/{id}` de empresa inexistente retorna 204 No Content** (sem corpo). Trate antes de fazer `JSON.parse`. (Para a listagem, a doc de Companies documenta só 200/401.)
- **`with` é específico:** só `leads`, `contacts`, `catalog_elements`. Valores inválidos são ignorados; sem `with`, `_embedded` traz só `tags`.
- **`custom_fields_values: null`** vem por padrão quando a empresa não tem valores — não é erro.
- **PHONE/EMAIL são `multitext`:** passe `value` + `enum_code` (ou `enum_id`). Enviar só `value` pode cair no enum default.
- **Atualização de campo substitui o conjunto:** ao enviar `custom_fields_values` para um campo multivalorado, envie todos os valores que quer manter. Para apagar um campo, envie `"values": []`.
- **Tags:** prefira `tags_to_add`/`tags_to_delete`. Enviar `_embedded.tags` substitui o conjunto completo de tags da empresa.
- **`created_by: 0`** indica criação por integração/sistema, não um usuário real.
- **`request_id`** é eco para correlação em lotes; não é persistido. Se omitido, vira o índice do array (`"0"`, `"1"`...).
- **`is_main` (request) ≠ `main_contact` (response)** ao vincular contatos.
- **HAL/JSON:** sempre navegue por `_embedded.companies` e `_links` — não assuma um objeto raiz "plano" nas respostas de coleção.
- **`query` busca ampla:** retorna empresas cujo qualquer campo (inclui personalizados) bata; para precisão use `filter[...]`.

---

## Exemplo de uso (curl)

```bash
# 1) Criar empresa com telefone e responsável
curl -X POST "https://meusubdominio.kommo.com/api/v4/companies" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "name": "Restaurante Sabor & Cia",
      "responsible_user_id": 837123,
      "custom_fields_values": [
        { "field_code": "PHONE", "values": [ { "value": "+5511999990000", "enum_code": "WORK" } ] }
      ]
    }
  ]'

# 2) Vincular contato 12345 como principal à empresa 1247556
curl -X POST "https://meusubdominio.kommo.com/api/v4/companies/1247556/link" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '[ { "to_entity_id": 12345, "to_entity_type": "contacts", "metadata": { "is_main": true } } ]'

# 3) Listar empresas do responsável, embutindo contatos e leads
curl -X GET "https://meusubdominio.kommo.com/api/v4/companies?with=contacts,leads&filter[responsible_user_id][]=837123&limit=100" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

---

## Fontes

- https://developers.kommo.com/reference/companies-list (Listar empresas)
- https://developers.kommo.com/reference/get-company (Obter empresa por ID)
- https://developers.kommo.com/reference/add-companies (Adicionar empresas)
- https://developers.kommo.com/reference/update-companies (Atualizar empresas em lote)
- https://developers.kommo.com/reference/updating-company (Atualizar uma empresa)
- https://developers.kommo.com/reference/custom-field-by-entity (Lista de campos personalizados por entidade)
- https://developers.kommo.com/reference/custom-fields (Estrutura de valores por tipo de campo)
- https://developers.kommo.com/reference/linking-entities (Vincular entidades)
- https://developers.kommo.com/reference/linked-entities (Listar vínculos)
- https://developers.kommo.com/reference/complex-leads (Empresa embutida na criação de lead)
- https://developers.kommo.com/docs/limitations (Limites e rate limits)
- https://developers.kommo.com/docs/http-codes (Códigos HTTP)
