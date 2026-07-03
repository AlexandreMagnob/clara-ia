# Kommo API — Catálogos e Produtos (Catalogs/Lists) API

## Visão geral do recurso

No Kommo (antiga amoCRM), **Listas** (em inglês *Lists*, e na API chamadas de **`catalogs`**) são coleções de dados estruturados da conta — por exemplo, um catálogo de produtos/serviços, fornecedores, contratos etc. Cada item de uma lista é um **elemento de catálogo** (`catalog_element`), e cada elemento pode ter **campos personalizados** (`custom_fields`).

Pontos-chave da documentação oficial:

- Existem **2 tipos de lista**: `regular` (regular) e `products` (produtos). *(A doc oficial em `reference/lists.md` cita apenas "regular" e "products". Um tipo de faturas/invoices pode existir em contas com o widget correspondente, mas **não há página dedicada na doc** — não confirmado.)*
- **Só pode existir 1 lista do tipo `products`** na conta, e ela precisa ser habilitada em **Configurações** (Settings) antes de ser usada via API.
- **Máximo de 10 listas por conta.**
- **Elementos de lista podem ser vinculados a leads** (e a contatos/empresas), com metadados como **`quantity`** (quantidade) — é assim que se "adiciona um produto a um lead".

Todas as URLs seguem o padrão: `https://{subdominio}.kommo.com/api/v4/...`
Autenticação: **OAuth 2.0** (header `Authorization: Bearer {access_token}`).
Respostas de sucesso usam `Content-Type: application/hal+json` (formato HAL com `_links` e `_embedded`); erros usam `application/problem+json`.

> Nota sobre exclusão: a doc **não documenta endpoints de DELETE** para listas nem para elementos de lista. A exclusão é feita pela interface; `can_be_deleted` apenas indica se a lista pode ser apagada pela UI.

---

## Endpoints

### Catálogos (listas)

| Método | Caminho | Descrição |
|--------|---------|-----------|
| `GET`  | `https://{subdominio}.kommo.com/api/v4/catalogs` | Lista todos os catálogos |
| `GET`  | `https://{subdominio}.kommo.com/api/v4/catalogs/{id}` | Obtém um catálogo por ID |
| `POST` | `https://{subdominio}.kommo.com/api/v4/catalogs` | Cria um ou mais catálogos (array) |
| `PATCH`| `https://{subdominio}.kommo.com/api/v4/catalogs/{id}` | Edita um catálogo (objeto único) |
| `PATCH`| `https://{subdominio}.kommo.com/api/v4/catalogs` | Edita vários catálogos em lote (array) |

### Elementos do catálogo

| Método | Caminho | Descrição |
|--------|---------|-----------|
| `GET`  | `https://{subdominio}.kommo.com/api/v4/catalogs/{list_id}/elements` | Lista elementos do catálogo |
| `GET`  | `https://{subdominio}.kommo.com/api/v4/catalogs/{list_id}/elements/{element_id}` | Obtém um elemento por ID |
| `POST` | `https://{subdominio}.kommo.com/api/v4/catalogs/{list_id}/elements` | Adiciona elementos (array) |
| `PATCH`| `https://{subdominio}.kommo.com/api/v4/catalogs/{list_id}/elements` | Edita vários elementos em lote (array) |
| `PATCH`| `https://{subdominio}.kommo.com/api/v4/catalogs/{list_id}/elements/{element_id}` | Edita um elemento por ID |

### Campos personalizados do catálogo

| Método | Caminho | Descrição |
|--------|---------|-----------|
| `GET`  | `https://{subdominio}.kommo.com/api/v4/catalogs/{list_id}/custom_fields` | Lista campos personalizados |
| `GET`  | `https://{subdominio}.kommo.com/api/v4/catalogs/{list_id}/custom_fields/{custom_field_id}` | Obtém um campo por ID |
| `POST` | `https://{subdominio}.kommo.com/api/v4/catalogs/{list_id}/custom_fields` | Adiciona campos (array) |
| `PATCH`| `https://{subdominio}.kommo.com/api/v4/catalogs/{list_id}/custom_fields` | Atualiza campos |

### Vincular produtos/elementos a leads (links)

| Método | Caminho | Descrição |
|--------|---------|-----------|
| `GET`  | `https://{subdominio}.kommo.com/api/v4/{entity}/{entity_id}/links` | Lista entidades vinculadas |
| `POST` | `https://{subdominio}.kommo.com/api/v4/{entity}/{entity_id}/link` | Vincula entidade (ex.: produto a lead) |
| `POST` | `https://{subdominio}.kommo.com/api/v4/{entity}/{entity_id}/unlink` | Desvincula entidade |

Onde `{entity}` = `leads`, `contacts` ou `companies`. Note que vincular usa `/link` (singular) e listar usa `/links` (plural).

---

## Parâmetros de query

### `GET /api/v4/catalogs` e `GET /api/v4/catalogs/{list_id}/elements`

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `page` | int | Página da resposta |
| `limit` | int | Nº de entidades por requisição. **Máximo 250** |
| `query` | string | (somente elementos) Busca textual, incluindo valores de campos personalizados |
| `filter[id][]` | array<int> | (somente elementos) Filtra por IDs de elementos (vários IDs podem ser passados) |

Exemplo:
```
GET https://meusub.kommo.com/api/v4/catalogs/12345/elements?page=1&limit=50&query=pizza
```

### `GET /api/v4/catalogs/{list_id}/custom_fields`

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `page` | int | Página da resposta |
| `limit` | int | Nº de entidades por requisição. **Máximo 250** |
| `order[sort]` | string | Ordenação por `sort` (`asc`/`desc`) |
| `order[id]` | string | Ordenação por `id` (`asc`/`desc`) |
| `filter[type][0]` | string | Filtra por tipo de campo |

### `GET /api/v4/leads/{id}/links` (entidades vinculadas)

| Parâmetro | Descrição |
|-----------|-----------|
| `filter[to_entity_id]` | Filtra por ID da entidade vinculada |
| `filter[to_entity_type]` | Filtra por tipo da entidade vinculada (`catalog_elements`, `contacts`, ...) |
| `filter[to_catalog_id]` | Filtra por ID do catálogo (lista) da entidade vinculada |
| `page` / `limit` | Paginação |

Exemplo:
```
GET https://meusub.kommo.com/api/v4/leads/7593303/links?filter[to_catalog_id]=4521
```

> Observação: a paginação no Kommo v4 usa `_links.next` para navegar. Quando não há próxima página, `_links.next` não é retornado.

---

## Corpo da requisição (exemplos JSON reais)

### Criar catálogo — `POST /api/v4/catalogs`
```json
[
  {
    "name": "Test list",
    "can_link_multiple": false,
    "request_id": "123"
  }
]
```
Parâmetros do corpo: `name` (obrigatório), `can_link_multiple` (se um elemento pode ser vinculado a vários leads), `request_id` (retornado sem alteração na resposta e **não salvo**).

### Editar catálogo (único) — `PATCH /api/v4/catalogs/{id}`
```json
{
  "name": "New list name",
  "can_link_multiple": false
}
```

### Editar catálogos (lote) — `PATCH /api/v4/catalogs`
```json
[
  {
    "id": 1234567,
    "name": "New list name",
    "can_link_multiple": false
  }
]
```
Cada objeto do array deve incluir o `id` da lista a editar.

### Adicionar elemento — `POST /api/v4/catalogs/{list_id}/elements`
```json
[
  {
    "name": "New list element",
    "custom_fields_values": [
      {
        "field_id": 14263,
        "values": [
          { "value": 1000 }
        ]
      }
    ]
  }
]
```
Parâmetros: `name` (obrigatório), `custom_fields_values` (array de valores), `request_id` (não salvo).

### Editar elementos (lote) — `PATCH /api/v4/catalogs/{list_id}/elements`
```json
[
  { "id": 1234567, "name": "New element name" },
  { "id": 7654321, "name": "New element name 2" }
]
```

### Adicionar campo personalizado — `POST /api/v4/catalogs/{list_id}/custom_fields`
```json
[
  {
    "name": "multi select",
    "type": "multiselect",
    "sort": 510,
    "enums": [
      { "value": "Value 1", "sort": 1 },
      { "value": "Value 2", "sort": 2 }
    ]
  }
]
```
Opcionalmente, o corpo aceita `required_statuses` (array de `{ "pipeline_id": ..., "status_id": ... }`) para tornar o campo obrigatório em determinados estágios.

### Vincular produto a lead com quantidade — `POST /api/v4/leads/{leadId}/link`
```json
[
  {
    "to_entity_id": 10,
    "to_entity_type": "catalog_elements",
    "metadata": {
      "quantity": 1,
      "catalog_id": 1234
    }
  }
]
```

### Desvincular produto do lead — `POST /api/v4/leads/{leadId}/unlink`
```json
[
  {
    "to_entity_type": "catalog_elements",
    "to_entity_id": 456,
    "metadata": {
      "catalog_id": 789,
      "updated_by": 1
    }
  }
]
```

---

## Resposta (exemplos JSON reais)

### `GET /api/v4/catalogs`
```json
{
  "_page": 1,
  "_links": {
    "self": { "href": "https://example.kommo.com/api/v4/catalogs?page=1&limit=50" },
    "next": { "href": "https://example.kommo.com/api/v4/catalogs?page=2&limit=50" }
  },
  "_embedded": {
    "catalogs": [
      {
        "id": 11110000,
        "name": "Regular list",
        "created_by": 1234567,
        "updated_by": 1234567,
        "created_at": 1590742040,
        "updated_at": 1590742040,
        "sort": 10,
        "type": "regular",
        "can_add_elements": true,
        "can_show_in_cards": false,
        "can_link_multiple": true,
        "can_be_deleted": true,
        "sdk_widget_code": null,
        "account_id": 7654321,
        "_links": {
          "self": { "href": "https://example.kommo.com/api/v4/catalogs/11110000" }
        }
      }
    ]
  }
}
```

### `PATCH /api/v4/catalogs/{id}` (objeto completo do catálogo)
```json
{
  "id": 1234567,
  "name": "New list name",
  "created_by": 1234567,
  "updated_by": 1234567,
  "created_at": 1590742040,
  "updated_at": 1590742040,
  "sort": 10,
  "type": "regular",
  "can_add_elements": true,
  "can_show_in_cards": false,
  "can_link_multiple": false,
  "can_be_deleted": true,
  "sdk_widget_code": null,
  "account_id": 7654321,
  "_links": {
    "self": { "href": "https://example.kommo.com/api/v4/catalogs/1234567" }
  }
}
```

### `GET /api/v4/catalogs/{list_id}/elements`
```json
{
  "_page": 1,
  "_links": {
    "self": { "href": "https://example.kommo.com/api/v4/catalogs/12345/elements?page=1&limit=50" },
    "next": { "href": "https://example.kommo.com/api/v4/catalogs/12345/elements?page=2&limit=50" }
  },
  "_embedded": {
    "elements": [
      {
        "id": 123000,
        "name": "Element",
        "created_by": 222000,
        "updated_by": 222000,
        "created_at": 1589390333,
        "updated_at": 1590683336,
        "is_deleted": null,
        "custom_fields_values": [
          {
            "field_id": 123456,
            "field_name": "SKU",
            "field_code": "SKU",
            "field_type": "text",
            "values": [{ "value": "Passed value" }]
          },
          {
            "field_id": 2345678,
            "field_name": "Price",
            "field_code": "PRICE",
            "field_type": "numeric",
            "values": [{ "value": "12" }]
          },
          {
            "field_id": 3456789,
            "field_name": "Group",
            "field_code": "GROUP",
            "field_type": "category",
            "values": [{ "value": "Devices", "enum_id": 5555 }]
          }
        ],
        "catalog_id": 12345,
        "account_id": 999999,
        "_links": {
          "self": { "href": "https://example.kommo.com/api/v4/catalogs/12345/elements/987654" }
        }
      }
    ]
  }
}
```

### `GET /api/v4/catalogs/{list_id}/custom_fields`
```json
{
  "_total_items": 2,
  "_page": 1,
  "_page_count": 10,
  "_links": {
    "self": { "href": "https://example.kommo.com/api/v4/catalogs/12345/custom_fields?page=1&limit=50" },
    "next": { "href": "https://example.kommo.com/api/v4/catalogs/12345/custom_fields?page=2&limit=50" },
    "last": { "href": "https://example.kommo.com/api/v4/catalogs/12345/custom_fields?page=10&limit=50" }
  },
  "_embedded": {
    "custom_fields": [
      {
        "id": 4439091,
        "name": "Text field example",
        "type": "text",
        "code": null,
        "sort": 504,
        "is_api_only": false,
        "enums": null,
        "is_predefined": false,
        "settings": [],
        "_links": {
          "self": { "href": "https://example.kommo.com/api/v4/catalogs/12345/custom_fields/4439091" }
        }
      }
    ]
  }
}
```

### `POST /api/v4/leads/{id}/link` (resposta — note o `metadata.quantity`)
```json
{
  "_total_items": 2,
  "_links": {
    "self": { "href": "https://example.kommo.com/api/v4/leads/7593303/links" }
  },
  "_embedded": {
    "links": [
      {
        "entity_id": 7593303,
        "entity_type": "leads",
        "to_entity_id": 10,
        "to_entity_type": "catalog_elements",
        "metadata": {
          "quantity": 1,
          "catalog_id": 1234
        }
      },
      {
        "entity_id": 7593303,
        "entity_type": "leads",
        "to_entity_id": 50,
        "to_entity_type": "contacts",
        "metadata": {
          "main_contact": true
        }
      }
    ]
  }
}
```

### `POST /api/v4/leads/{id}/unlink`
Retorna **HTTP 204** com corpo `{}`.

---

## Tabela de campos importantes e tipos

### Objeto catálogo (`catalog`)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | int | ID da lista |
| `name` | string | Nome da lista |
| `created_by` | int | ID do usuário que criou |
| `updated_by` | int | ID do usuário que editou por último |
| `created_at` | int | Data de criação (Unix timestamp) |
| `updated_at` | int | Data da última edição (Unix timestamp) |
| `sort` | int | Ordenação da lista |
| `type` | string | Tipo da lista: `regular` ou `products` |
| `can_add_elements` | bool | Se é possível adicionar elementos |
| `can_show_in_cards` | bool | Se a lista aparece nos cards de lead |
| `can_link_multiple` | bool | Se 1 elemento pode ser vinculado a vários leads |
| `can_be_deleted` | bool | Se a lista pode ser excluída (pela interface) |
| `sdk_widget_code` | string\|null | Código do widget SDK que controla a lista |
| `account_id` | int | ID da conta |
| `request_id` | string | (apenas em POST/PATCH) Eco do valor enviado; não é salvo |

### Objeto elemento (`catalog_element`)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | int | ID do elemento |
| `name` | string | Nome do elemento |
| `catalog_id` | int | ID do catálogo a que pertence |
| `created_by` / `updated_by` | int | IDs de usuários |
| `created_at` / `updated_at` | int | Timestamps (Unix) |
| `is_deleted` | bool\|null | Se foi excluído (pode vir `null`) |
| `custom_fields_values` | array\|null | Valores dos campos personalizados |
| `account_id` | int | ID da conta |
| `request_id` | string | (apenas em POST/PATCH) Eco do valor enviado; não é salvo |

### Objeto campo personalizado (`custom_field`)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | int | ID do campo |
| `name` | string | Nome do campo |
| `type` | string | Tipo do campo (ver lista abaixo) |
| `code` | string\|null | Código para atualizar valores sem passar o `field_id` (ex.: `PRICE`, `SKU`) |
| `sort` | int | Ordenação |
| `is_api_only` | bool | Se o campo é acessível apenas via API |
| `is_predefined` | bool | Se o campo é predefinido |
| `enums` | array\|null | Opções (para `select`/`multiselect`/`radiobutton`/`category`); cada item tem `id`, `value`, `sort` |
| `remind` | string\|null | Configuração de lembrete (campos de aniversário) |
| `settings` | array/object | Configuração do campo |
| `group_id` | string\|null | ID do grupo de campos |
| `required_statuses` | array | Estágios em que o campo é obrigatório (`pipeline_id` / `status_id`) |

**Tipos de campo suportados em catálogos (conforme a doc):** `text`, `numeric`, `checkbox`, `select`, `multiselect`, `date`, `url`, `textarea`, `radiobutton`, `streetaddress`, `smart_address`, `birthday`, `date_time`, `legal_entity`, `price`, `category`, `items`. *(Em catálogos de produtos, os campos típicos têm códigos como `PRICE`, `SKU`, `DESCRIPTION`, `GROUP`/category, `UNIT`.)*

### Objeto link / metadata (vínculo produto↔lead)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `entity_id` | int | ID da entidade principal (ex.: o lead) |
| `entity_type` | string | Tipo da entidade principal (`leads`, `contacts`, `companies`) |
| `to_entity_id` | int | ID da entidade vinculada (o elemento de catálogo) |
| `to_entity_type` | string | Tipo: `catalog_elements` (para produtos) |
| `metadata.quantity` | int/number | **Quantidade do produto** vinculada ao lead |
| `metadata.catalog_id` | int | ID do catálogo do elemento (necessário ao vincular/desvincular `catalog_elements`) |
| `metadata.main_contact` | bool | (contatos) marca contato principal |
| `metadata.updated_by` | int | ID do usuário que executa a ação |

---

## Limites / rate limits específicos

- **Máximo de 10 listas (catálogos) por conta.**
- **Apenas 1 lista do tipo `products`** por conta (e precisa ser ativada nas Configurações).
- **Rate limit global:** no máximo **7 requisições por segundo**; ao exceder, retorna **HTTP 429**. Em violações repetidas, o IP é **bloqueado** e passa a retornar **HTTP 403** para qualquer requisição (a doc não especifica duração do bloqueio).
- **Lote (POST/PATCH):** no máximo **250 entidades** por requisição; recomendação oficial é **não mais que 50** para melhor performance e evitar erros.
- **Paginação (`limit`):** máximo **250** registros por resposta.
- **`HTTP 504` (timeout):** a doc recomenda reduzir o número de entidades por requisição e repetir.

---

## Pegadinhas e erros comuns (gotchas)

- **`catalog_id` no `metadata` ao vincular/desvincular `catalog_elements`.** A doc do `link` lista `metadata` (incluindo `quantity` e `catalog_id`) como opcional no schema, mas o `catalog_id` identifica o catálogo do elemento e é usado tanto no `link` quanto no `unlink` — passe-o sempre ao trabalhar com produtos. (A receita oficial sempre inclui `catalog_id`.)
- **A quantidade NÃO fica no elemento** — `quantity` é um metadado do **vínculo** (`/link`), não um campo do `catalog_element`. Para mudar a quantidade de um produto já no lead, você atua no vínculo/`metadata`, não no elemento.
- **Os endpoints de catálogo são `/catalogs`, não `/lists`.** Apesar de a UI/doc chamar de "Lists/Listas", a rota da API é `api/v4/catalogs`. URLs antigas em `kommo.com/developers/content/...` redirecionam para `developers.kommo.com/reference/...`.
- **POST de catálogos/elementos/custom_fields espera um ARRAY** (`[ { ... } ]`), mesmo para um único item. O PATCH tem duas variantes: de um item único (`/catalogs/{id}`, objeto único) e em lote (`/catalogs`, array).
- **`/link` (singular) para vincular, `/links` (plural) para listar.** Confundir os dois é erro comum.
- **Catálogo de produtos precisa existir antes.** Você não cria um catálogo `type: products` livremente — ele é único e habilitado nas Configurações. Descubra o ID dele via `GET /api/v4/catalogs` filtrando por `type == "products"` no resultado.
- **`is_deleted` pode vir `null`** (e não `false`) em elementos — trate ambos.
- **`request_id` não é salvo** — serve só para correlacionar a resposta em operações em lote.
- **`field_id` vs `field_code`:** ao escrever valores, você pode usar `field_id` (numérico) ou `field_code` (ex.: `PRICE`) — use o code para não depender de IDs específicos da conta.
- **Limite de 250 mas use 50:** lotes grandes podem dar `504`; quebre em pedaços menores.
- **`can_link_multiple`** controla se o mesmo elemento pode ser vinculado a vários leads — relevante para produtos compartilhados.
- **Sem DELETE na API:** a doc não expõe endpoints para excluir listas ou elementos — exclusão é pela interface.

---

## Exemplo de uso (cenário concreto: criar produto e adicionar a um lead com quantidade)

Receita oficial (`recipes/creating-a-product-and-adding-it-to-a-lead`), 6 passos no fluxo, mas 2 chamadas de API principais. Suponha catálogo de produtos `list_id = 1209` e lead `lead_id = 7593303`.

**Passo 1 — Criar o produto (elemento) com preço (`POST /elements`):**
```bash
curl -X POST "https://meusub.kommo.com/api/v4/catalogs/1209/elements" \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '[
        {
          "name": "Plano Anual CardapioWeb",
          "custom_fields_values": [
            { "field_code": "PRICE", "values": [ { "value": "1188" } ] }
          ]
        }
      ]'
```
Pegue o ID do produto na resposta: `_embedded.elements[0].id` (ex.: `986757`).

**Passo 2 — Vincular o produto ao lead com `quantity` (`POST /link`):**
```bash
curl -X POST "https://meusub.kommo.com/api/v4/leads/7593303/link" \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '[
        {
          "to_entity_id": 986757,
          "to_entity_type": "catalog_elements",
          "metadata": { "catalog_id": 1209, "quantity": 8 }
        }
      ]'
```

**Conferir os produtos vinculados ao lead (`GET /links`):**
```bash
curl "https://meusub.kommo.com/api/v4/leads/7593303/links?filter[to_catalog_id]=1209" \
  -H "Authorization: Bearer {access_token}"
```
A resposta traz cada `to_entity_id` com `metadata.quantity` — assim você lê os produtos e quantidades atrelados ao lead.

---

## Fontes

- https://developers.kommo.com/reference/lists.md (Visão geral de Listas/Catálogos)
- https://developers.kommo.com/reference/get-lists.md (GET catalogs)
- https://developers.kommo.com/reference/get-list.md (GET catalog por ID)
- https://developers.kommo.com/reference/add-lists.md (POST catalogs)
- https://developers.kommo.com/reference/editing-list.md (PATCH catalog único)
- https://developers.kommo.com/reference/editing-lists.md (PATCH catalogs em lote)
- https://developers.kommo.com/reference/get-list-elements.md (GET elements)
- https://developers.kommo.com/reference/get-list-element.md (GET element por ID)
- https://developers.kommo.com/reference/add-list-elements.md (POST elements)
- https://developers.kommo.com/reference/edit-list-elements.md (PATCH elements em lote)
- https://developers.kommo.com/reference/edit-list-element.md (PATCH element por ID)
- https://developers.kommo.com/reference/custom-fields-list-of-list.md (GET custom_fields do catálogo)
- https://developers.kommo.com/reference/adding-custom-field.md (POST custom_fields)
- https://developers.kommo.com/reference/get-list-custom-field.md (GET custom_field por ID)
- https://developers.kommo.com/reference/linking-entities.md (POST link)
- https://developers.kommo.com/reference/linked-entities.md (GET links)
- https://developers.kommo.com/reference/unlinking-entities.md (POST unlink)
- https://developers.kommo.com/recipes/creating-a-product-and-adding-it-to-a-lead.md (Receita: criar produto e adicionar ao lead)
- https://developers.kommo.com/docs/limitations.md (Limites e rate limits)
- https://developers.kommo.com/llms.txt (Indice de documentacao para agentes)
