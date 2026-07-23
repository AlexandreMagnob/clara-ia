# Kommo API — Campos Personalizados (Custom Fields) — definição

> Referência da API Kommo v4 — recurso de **definição** (metadados) de campos personalizados.
> Revisada e conferida contra a documentação oficial (`developers.kommo.com`, versões `.md`) em 2026-06-29.

## Visão geral do recurso

Campos personalizados (custom fields) são definições de campos extras que podem ser adicionados a **leads**, **contatos** (contacts), **empresas** (companies) e **listas/catálogos** (catalogs). Esta seção cobre a *definição* (metadados) dos campos — ou seja, criar, listar, atualizar e remover as **definições** dos campos e seus **grupos** —, não os valores preenchidos nas entidades (esses vão no array `custom_fields_values` de cada lead/contato/empresa).

Pontos-chave:
- A URL do endpoint muda conforme a entidade (`leads`, `contacts`, `companies`) ou catálogo (`catalogs/{list_id}`).
- Cada campo tem um `id`, um `type` (tipo) e, opcionalmente, um `code` (código simbólico) que permite referenciar o campo sem usar o `id`.
- Campos de tipo lista (`select`, `multiselect`, `radiobutton`, `category`) usam **enums** (opções) com `id`, `value`, `sort` e `code`.
- Métodos de criação/edição de definições e grupos são **restritos a usuários administradores**.
- Respostas usam o padrão HAL (`application/hal+json`) com `_embedded`, `_links`, `_total_items` e `_page`.

---

## Endpoints

Use sempre o padrão `https://{subdominio}.kommo.com/...`. Onde aparece `{entity_type}`, substitua por `leads`, `contacts` ou `companies`. Em catálogos, `{list_id}` é o ID da lista/catálogo.

### Definições de campos (custom fields) — entidades

| Operação | Método | Caminho | Sucesso |
|---|---|---|---|
| Listar campos da entidade | GET | `/api/v4/{entity_type}/custom_fields` | 200 |
| Obter um campo por ID | GET | `/api/v4/{entity_type}/custom_fields/{id}` | 200 |
| Criar campo(s) | POST | `/api/v4/{entity_type}/custom_fields` | 201 |
| Atualizar campos (múltiplos) | PATCH | `/api/v4/{entity_type}/custom_fields` | 200 |
| Atualizar um campo por ID | PATCH | `/api/v4/{entity_type}/custom_fields/{id}` | 200 |

> **Exclusão de campo:** a doc oficial v4 expõe métodos de delete para **grupos** de campos, mas não há um endpoint `DELETE /custom_fields/{id}` documentado na referência v4. Para remover um campo, normalmente faz-se via interface, ou marca-se `is_deletable`. (A linha "Excluir um campo / DELETE /custom_fields/{id}" do rascunho **não foi confirmada na doc** e foi removida.)

### Definições de campos — catálogos/listas

| Operação | Método | Caminho | Sucesso |
|---|---|---|---|
| Listar campos do catálogo | GET | `/api/v4/catalogs/{list_id}/custom_fields` | 200 |
| Obter um campo do catálogo por ID | GET | `/api/v4/catalogs/{list_id}/custom_fields/{id}` | 200 |
| Criar campo(s) no catálogo | POST | `/api/v4/catalogs/{list_id}/custom_fields` | 201 |
| Atualizar campos do catálogo (múltiplos) | PATCH | `/api/v4/catalogs/{list_id}/custom_fields` | 200 |
| Atualizar um campo do catálogo por ID | PATCH | `/api/v4/catalogs/{list_id}/custom_fields/{id}` | 200 |

### Grupos de campos (field groups)

| Operação | Método | Caminho | Sucesso |
|---|---|---|---|
| Listar grupos | GET | `/api/v4/{entity_type}/custom_fields/groups` | 200 |
| Obter grupo por ID | GET | `/api/v4/{entity_type}/custom_fields/groups/{id}` | 200 |
| Criar grupo(s) | POST | `/api/v4/{entity_type}/custom_fields/groups` | 201 |
| Editar grupo | PATCH | `/api/v4/{entity_type}/custom_fields/groups/{id}` | 200 |
| Excluir grupo | DELETE | `/api/v4/{entity_type}/custom_fields/groups/{id}` | 204 |

> Observação: grupos **predefinidos** (`is_predefined: true`, ex.: o grupo `default` / "Main") **não podem ser excluídos**.

**Códigos de resposta comuns:** `200` (sucesso), `201` (criado), `204` (sem conteúdo — delete de grupo), `400` (dados inválidos), `401` (não autorizado), `422` (não processável). Em lote acima do limite pode retornar `504`.

> **Nota sobre POST/PATCH:** ambos POST e PATCH de campos retornam o conjunto de campos em `_embedded.custom_fields`. A doc da referência de criação documenta **201**; a de atualização (múltipla e por ID) documenta **200** como retorno principal (algumas páginas exibem 201 no exemplo bruto — na prática a operação bem-sucedida retorna 2xx com o corpo do campo). Trate qualquer 2xx como sucesso e leia o corpo retornado.

---

## Parâmetros de query (listagem)

Aplicáveis ao `GET .../custom_fields` (entidades e catálogos):

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `page` | int | Página dos resultados |
| `limit` | int | Itens por página (**máx. 250**) |
| `order[sort]` | enum | Ordena por `sort` (`asc`/`desc`) |
| `order[id]` | enum | Ordena por `id` (`asc`/`desc`) |
| `filter[type][0]` | enum | Filtra por tipo de campo (ex.: `text`, `numeric`, `checkbox`, `select`, `multiselect`, `date`, `url`, `textarea`, `radiobutton`, `streetaddress`, `smart_address`, `birthday`, `date_time`, `legal_entity`, `price`, `category`, `items`) |

Exemplo de URL:
```
GET https://example.kommo.com/api/v4/leads/custom_fields?limit=2&page=1&order[sort]=asc
```

---

## Tipos de campo

A coluna "Entidades" indica onde o tipo é suportado. **C** = Contato, **L** = Lead, **E** = Empresa, **Lista** = Catálogo/lista.

| `type` | Nome | Estrutura do valor (em `custom_fields_values`) | Entidades |
|---|---|---|---|
| `text` | Texto | `{"value": "texto"}` | C, L, E, Lista |
| `numeric` | Número | `{"value": "1.5"}` (string) | C, L, E, Lista |
| `checkbox` | Caixa de seleção | `{"value": true}` | C, L, E, Lista |
| `select` | Lista (uma opção) | `{"value": "..."}` ou `{"enum_id": 17}` ou `{"enum_code": "..."}` — usa `enums` | C, L, E, Lista |
| `multiselect` | Lista multisseleção | vários itens, cada um `{"enum_id": ...}` / `{"enum_code": ...}` / `{"value": ...}` — usa `enums` | C, L, E, Lista |
| `radiobutton` | Comutador (switch) | igual a select — usa `enums` | C, L, E, Lista |
| `date` | Data | timestamp Unix **ou** string RFC-3339, ex.: `{"value": 1577836800}` | C, L, E, Lista |
| `date_time` | Data e hora | timestamp Unix **ou** string RFC-3339 | C, L, E, Lista |
| `birthday` | Aniversário | timestamp Unix **ou** string RFC-3339; aceita `remind` | C, L, E |
| `url` | URL | `{"value": "https://..."}` | C, L, E, Lista |
| `textarea` | Área de texto | `{"value": "linha1\nlinha2"}` | C, L, E, Lista |
| `streetaddress` | Endereço curto | `{"value": "..."}` | C, L, E, Lista |
| `smart_address` | Endereço completo | múltiplos sub-valores com `enum_id`/`enum_code` (ver tabela abaixo) | C, L, E |
| `legal_entity` | ID fiscal / pessoa jurídica | `value` como objeto (ver atributos abaixo) | C, L, E |
| `multitext` | Telefone/Email (múltiplos) | só em **Contato**; cada item `{"value": "...", "enum_code": ...}` (ver códigos) | C |
| `monetary` | Monetário | `{"value": "..."}` (string); campo `currency` na definição | C, L, E, Lista |
| `price` | Preço | `{"value": "..."}` | **Lista** |
| `category` | Categoria | `{"value": "..."}` / `enum_id` / `enum_code` — usa `enums` | **Lista** |
| `items` | Itens | referência a itens do catálogo | **Lista** (consta no filtro de tipos; estrutura interna não detalhada na doc) |
| `chained_list` | Catálogos/listas encadeadas | `{"catalog_id": ..., "catalog_element_id": ...}`; **máx. 5 elementos** | **Lead** |
| `linked_entity` | Link para outro elemento | `value` como objeto: `name`, `entity_id`, `entity_type`, `catalog_id` | **Lista** |
| `file` | Arquivo | `value` como objeto: `file_uuid`, `version_uuid`, `file_name`, `file_size` | C, L, E, Lista |
| `tracking_data` | Dados de rastreamento | `{"value": "..."}` | C, L, E, Lista |

**Correções de disponibilidade vs. rascunho original:**
- `chained_list` é exclusivo de **Lead** (não "catálogos genéricos").
- `linked_entity`, `price`, `category`, `items` são exclusivos de **Lista/Catálogo**.
- `birthday`, `smart_address`, `legal_entity` existem em Contato/Lead/Empresa (**não** em Lista).
- `date`/`date_time` valem para Contato/Lead/Empresa/Lista.

### Códigos de enum — `smart_address`

| enum_id | enum_code | Significado |
|---|---|---|
| 1 | `address_line_1` | Primeira linha do endereço |
| 2 | `address_line_2` | Segunda linha do endereço |
| 3 | `city` | Cidade |
| 4 | `state` | Região / estado |
| 5 | `zip` | CEP / código postal |
| 6 | `country` | País |

> Correção: o rascunho listava `address`/`city`/`state`/`zip`/`country`. O correto são as **duas linhas** `address_line_1` e `address_line_2` (não há `address`).

### Códigos de enum — `multitext` (Telefone/Email, só em Contato)

- **Telefone:** `WORK`, `WORKDD`, `MOB`, `FAX`, `HOME`, `OTHER`
- **Email:** `WORK`, `PRIV`, `OTHER`

> Correção: o rascunho listava `WORK`, `MOB`, `HOME`, `FAX`, `OTHER`. A doc inclui também `WORKDD` (telefone) e `PRIV` (email).

### Atributos de `legal_entity` (objeto em `value`)

Obrigatório: `name` (string). Opcionais: `entity_type` (1 = pessoa física/privada, 2 = pessoa jurídica/legal), `address`, `real_address`, `bank_account_number`, `director` (nome do CEO), `vat_id` (CNPJ/TIN), `tax_registration_reason_code`, `bank_code`, `external_uid`.

---

## Estrutura da definição de um campo

| Atributo | Tipo | Descrição |
|---|---|---|
| `id` | int | ID do campo (gerado pela API) |
| `name` | string | Nome do campo (**obrigatório** ao criar) |
| `type` | string | Tipo do campo (**obrigatório** ao criar) |
| `code` | string | Código simbólico — permite referenciar sem o `id` |
| `account_id` | int | ID da conta |
| `sort` | int | Ordem de exibição |
| `is_api_only` | bool | Editável apenas via API |
| `is_predefined` | bool | Campo de sistema |
| `is_deletable` | bool | Se pode ser excluído |
| `entity_type` | string | `leads`/`contacts`/`companies`/`catalogs` |
| `group_id` | string | ID do grupo a que pertence (string, não int) |
| `enums` | array/obj | Opções (para `select`/`multiselect`/`radiobutton`/`category`) |
| `required_statuses` | array | Obrigatoriedade por estágio: `{status_id, pipeline_id}` |
| `hidden_statuses` | array | Visibilidade por estágio: `{status_id, pipeline_id}` |
| `chained_lists` | array | Config. de listas encadeadas: `{title, catalog_id, parent_catalog_id}` |
| `currency` | string | Código de moeda (campos `monetary`) |
| `remind` | string | Lembrete de aniversário: `never`, `day`, `week`, `month` |
| `triggers` | array | Gatilhos associados |
| `settings` | array/null | Configurações adicionais |
| `tracking_callback` | string | Função JS de callback (tracking) |
| `search_in` | string | ID/código do catálogo vinculado |

**Estrutura de `enums`** (opções): cada item tem `id` (gerado), `value` (texto exibido), `sort` (ordem) e, opcionalmente, `code` (código simbólico). Ao **criar**, envia-se `value`/`sort`/`code`; ao **atualizar opções existentes**, é preciso enviar também o `id` de cada enum (senão a API pode recriar/duplicar as opções).

---

## Corpo da requisição (criar — POST)

O corpo é sempre um **array**, mesmo para um único campo. Apenas `name` e `type` são obrigatórios — o exemplo abaixo é "completo" para fins de referência:

```json
[
  {
    "name": "multi select",
    "type": "multiselect",
    "code": "multi_select_code",
    "sort": 510,
    "group_id": "group_123",
    "is_api_only": false,
    "currency": null,
    "required_statuses": [
      { "pipeline_id": 16056, "status_id": 20540473 }
    ],
    "enums": [
      { "value": "Value 1", "sort": 1, "code": "value_1" },
      { "value": "Value 2", "sort": 2, "code": "value_2" }
    ],
    "hidden_statuses": [
      { "status_id": 20540473, "pipeline_id": 16056 }
    ],
    "chained_lists": [
      { "title": "Linked List Name", "catalog_id": 12345, "parent_catalog_id": 11111 }
    ],
    "tracking_callback": "callbackFunction()",
    "search_in": "contacts",
    "remind": "never"
  }
]
```

> Exemplo mínimo oficial (apenas obrigatórios + enums):
> ```json
> [
>   {
>     "name": "multi select",
>     "type": "multiselect",
>     "sort": 510,
>     "enums": [
>       { "value": "Value 1", "sort": 1 },
>       { "value": "Value 2", "sort": 2 }
>     ]
>   }
> ]
> ```

**Atributos obrigatórios:** `name`, `type`. Os demais são opcionais. Para `select`/`multiselect`/`radiobutton`/`category`, `enums` é necessário para o campo ser útil.

---

## Resposta (criar — 201)

```json
{
  "_total_items": 1,
  "_embedded": {
    "custom_fields": [
      {
        "name": "multi select",
        "type": "multiselect",
        "sort": 510,
        "settings": null,
        "is_predefined": false,
        "id": 4457223,
        "code": "multi_select_code",
        "remind": null,
        "is_api_only": false,
        "currency": null,
        "entity_type": "leads",
        "is_deletable": true,
        "group_id": null,
        "enums": [
          { "value": "Value 1", "sort": 1, "id": 3778801 },
          { "value": "Value 2", "sort": 2, "id": 3778803 }
        ],
        "required_statuses": [
          { "status_id": 20540473, "pipeline_id": 16056 }
        ],
        "hidden_statuses": [
          { "status_id": 20540473, "pipeline_id": 16056 }
        ],
        "chained_lists": [
          { "title": "Linked List Name", "catalog_id": 12345, "parent_catalog_id": 11111 }
        ],
        "tracking_callback": "callbackFunction()",
        "search_in": "contacts",
        "_links": {
          "self": { "href": "https://example.kommo.com/api/v4/leads/custom_fields/4457223" }
        }
      }
    ]
  }
}
```

---

## Resposta (listar — GET)

```json
{
  "_total_items": 2,
  "_page": 1,
  "_page_count": 10,
  "_links": {
    "self": { "href": "https://example.kommo.com/api/v4/leads/custom_fields?limit=2&page=1" },
    "next": { "href": "https://example.kommo.com/api/v4/leads/custom_fields?limit=2&page=2" },
    "last": { "href": "https://example.kommo.com/api/v4/leads/custom_fields?limit=2&page=10" }
  },
  "_embedded": {
    "custom_fields": [
      {
        "id": 4439091,
        "name": "Text field example",
        "sort": 504,
        "type": "text",
        "is_predefined": false,
        "settings": null,
        "remind": null,
        "is_api_only": false,
        "group_id": null,
        "enums": null,
        "required_statuses": [
          { "status_id": 41221, "pipeline_id": 3142 }
        ],
        "_links": {
          "self": { "href": "https://example.kommo.com/api/v4/leads/custom_fields/4439091" }
        }
      },
      {
        "id": 4440043,
        "name": "Example 'date' type field",
        "sort": 505,
        "type": "date",
        "is_predefined": false,
        "settings": null,
        "remind": null,
        "is_api_only": false,
        "group_id": null,
        "enums": null,
        "required_statuses": null,
        "_links": {
          "self": { "href": "https://example.kommo.com/api/v4/leads/custom_fields/4440043" }
        }
      }
    ]
  }
}
```

---

## Obter um campo por ID (GET)

`GET /api/v4/{entity_type}/custom_fields/{id}` → **200**. Retorna um **único objeto** de campo (não envelopado em `_embedded`), com: `id`, `name`, `code`, `sort`, `type`, `entity_type`, `is_predefined`, `is_deletable`, `is_api_only`, `currency` (nullable), `remind` (nullable), `enums` (nullable), `group_id`, `required_statuses`, `hidden_statuses`, `chained_lists`, `tracking_callback`, `search_in` e `_links.self`.

Erros: `400` (dados inválidos), `401` (não autenticado), `422` (não processável).

---

## Atualizar campos (PATCH)

Dois endpoints:
- **Múltiplos:** `PATCH /api/v4/{entity_type}/custom_fields` — corpo é um **array**; cada item deve incluir `id`.
- **Por ID:** `PATCH /api/v4/{entity_type}/custom_fields/{id}` — corpo é um **objeto único** (sem `id` no corpo, pois vai na URL).

Para mexer em `enums` existentes, inclua o `id` de cada enum.

**Requisição (múltiplos):**
```json
[
  {
    "id": 624542,
    "name": "Number of requests",
    "sort": 501,
    "group_id": null,
    "is_api_only": false
  },
  {
    "id": 1240452,
    "name": "Number",
    "sort": 507,
    "enums": [
      { "id": 900900, "value": "44", "sort": 2 },
      { "id": 900902, "value": "88", "sort": 3 },
      { "id": 900904, "value": "22", "sort": 1 }
    ]
  }
]
```

**Requisição (por ID — objeto único):**
```json
{
  "name": "New custom field name",
  "sort": 560,
  "is_api_only": false,
  "group_id": "leads_63431752236083",
  "required_statuses": [
    { "status_id": 0, "pipeline_id": 0 }
  ],
  "enums": [
    { "id": 0, "value": "string", "sort": 0, "code": "string" }
  ],
  "remind": "day",
  "tracking_callback": "string",
  "hidden_statuses": [
    { "status_id": 0, "pipeline_id": 0 }
  ],
  "currency": "string",
  "search_in": "string",
  "chained_lists": [
    { "title": "string", "catalog_id": 0, "parent_catalog_id": 0 }
  ]
}
```

**Resposta (PATCH múltiplos):** os campos voltam em `_embedded.custom_fields`. Em campos de lista, `enums` pode vir como **objeto indexado** (não array) e cada item carrega `request_id` ecoado:
```json
{
  "id": 1240452,
  "name": "Number",
  "type": "multiselect",
  "account_id": 32694255,
  "code": null,
  "sort": 507,
  "is_api_only": false,
  "enums": {
    "3": { "id": 900900, "value": "44", "sort": 2 },
    "4": { "id": 900902, "value": "88", "sort": 3 },
    "5": { "id": 900904, "value": "22", "sort": 1 }
  },
  "request_id": "1",
  "group_id": null,
  "required_statuses": [],
  "is_deletable": true,
  "is_predefined": false,
  "entity_type": "leads",
  "tracking_callback": null,
  "remind": null,
  "triggers": [],
  "currency": null,
  "hidden_statuses": [],
  "chained_lists": null,
  "_links": { "self": { "href": "https://subdomain.kommo.com/api/v4/leads/custom_fields/1240452" } }
}
```

---

## Grupos de campos (field groups)

**Listar (GET `/api/v4/{entity_type}/custom_fields/groups`):**
```json
{
  "_total_items": 2,
  "_embedded": {
    "custom_field_groups": [
      {
        "id": "default",
        "name": "Main",
        "is_predefined": true,
        "type": "custom_field_group",
        "fields": [],
        "entity_type": "leads",
        "sort": 0,
        "_links": { "self": { "href": "https://subdomain.kommo.com/api/v4/leads/custom_fields/groups/default" } }
      },
      {
        "id": "leads_29741591099841",
        "name": "Field group",
        "is_predefined": false,
        "type": "custom_field_group",
        "fields": [],
        "entity_type": "leads",
        "sort": 1,
        "_links": { "self": { "href": "https://subdomain.kommo.com/api/v4/leads/custom_fields/groups/leads_29741591099841" } }
      }
    ]
  }
}
```

Estrutura de um grupo: `id` (string), `name`, `is_predefined`, `type` (`custom_field_group` para grupos de campos ou `linked_group` para grupos de produtos), `fields` (array de **IDs** dos campos do grupo), `entity_type`, `sort`. Exemplo de grupo por ID com campos: `"fields": [782240]`.

**Criar grupo (POST `/api/v4/{entity_type}/custom_fields/groups`) — 201:**
```json
[
  { "name": "Field group", "sort": 10, "request_id": "0" }
]
```
Obrigatório: `name`. Opcionais: `sort`, `request_id` (ecoado na resposta, não persistido).

**Resposta (201):**
```json
{
  "_total_items": 1,
  "_embedded": {
    "custom_field_groups": [
      {
        "id": "leads_63431752236083",
        "name": "Field group",
        "is_predefined": false,
        "type": "custom_field_group",
        "fields": [],
        "entity_type": "leads",
        "sort": 10,
        "request_id": "0",
        "_links": { "self": { "href": "https://subdomain.kommo.com/api/v4/leads/custom_fields/groups/leads_63431752236083" } }
      }
    ]
  }
}
```

**Editar grupo (PATCH `/api/v4/{entity_type}/custom_fields/groups/{id}`) — 200:** corpo é um **objeto único**; todos os campos são opcionais. É possível atribuir campos ao grupo via array `fields` (lista de IDs). Restrito a administradores.
```json
{
  "name": "Field group",
  "sort": 7,
  "fields": [1246483, 1246485]
}
```
Resposta (200):
```json
{
  "id": "leads_5271726566243",
  "name": "Field group",
  "is_predefined": false,
  "type": "custom_field_group",
  "fields": [1246483, 1246485],
  "entity_type": "leads",
  "sort": 7
}
```

**Excluir grupo (DELETE `/api/v4/{entity_type}/custom_fields/groups/{id}`) — 204 (No Content):** restrito a administradores; grupos predefinidos (`is_predefined: true`) não podem ser excluídos.

---

## Campos de catálogos/listas

Endpoints (ver tabela acima): `GET/POST /api/v4/catalogs/{list_id}/custom_fields`, `GET/PATCH /api/v4/catalogs/{list_id}/custom_fields/{id}`, `PATCH /api/v4/catalogs/{list_id}/custom_fields`.

A estrutura de resposta segue o mesmo padrão `_embedded.custom_fields[]`. Além dos tipos comuns, catálogos expõem `price`, `category` e `items` (exclusivos de listas). Campos de catálogo aceitam, na definição, atributos específicos de lista como `is_visible` e `is_required`, e o tipo `category` usa estrutura `nested` para suas opções aninhadas (a estrutura interna detalhada de `nested`/`category` não é totalmente especificada na doc — **não confirmado em detalhe**).

Exemplo de criação (POST) — mesmo formato em array dos campos de entidade:
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

---

## Limites e rate limits

- **Taxa:** no máximo **7 requisições por segundo** por IP. Ao exceder, retorna **429**; violações repetidas bloqueiam o IP com **403**.
- **Paginação:** até **250** itens por página (`limit`).
- **Criação/atualização em lote:** até **250** entidades por requisição (recomendado **50** para melhor performance). Exceder pode retornar **504** — reduza o lote e tente de novo.
- **Valores de campos personalizados por entidade:** **máximo 40** (ao adicionar lead complexo).
- **`chained_list`:** máximo **5** elementos por valor (consta no guia conceitual de tipos; **não consta** na página de Limitations).
- **Listas/catálogos por conta:** máximo **10**.
- **Outros limites de conta (contexto):** pipelines 50/conta; estágios até 100/pipeline; webhooks 100/conta; fontes 100/integração.
- O cabeçalho/campo `retry_after` **não é documentado** na página de Limitations (alguns retornos de 429 trazem `retry_after` no corpo) — **não confirmado na doc**.

---

## Pegadinhas e erros comuns (gotchas)

- **Definição ≠ valor:** este recurso define a *estrutura* do campo. Para gravar dados nas entidades, use `custom_fields_values` no lead/contato/empresa — não estes endpoints.
- **Corpo em array no POST e no PATCH múltiplo:** POST e o PATCH de múltiplos campos esperam um **array** de objetos. Já o PATCH por ID (`.../custom_fields/{id}`) usa **objeto único**.
- **`id` obrigatório no PATCH múltiplo:** cada item do array precisa do `id` do campo. No PATCH por ID, o `id` vai na URL.
- **Atualizar enums exige enviar o `id` de cada enum:** se você reenviar `enums` sem os IDs existentes, corre o risco de duplicar/recriar opções. Para editar opções, preserve o `id`.
- **`enums` muda de formato:** vem como **array** ao criar/listar, mas pode vir como **objeto indexado por chave** na resposta do PATCH múltiplo.
- **`select`/`multiselect`/`radiobutton`/`category` só funcionam com `enums`** definidos; sem opções o campo é inútil.
- **`group_id` é string**, não inteiro (ex.: `"default"`, `"leads_63431752236083"`).
- **Restrição de admin:** criar/editar definições e grupos requer usuário administrador; tokens sem esse perfil retornam erro de autorização.
- **`is_api_only: true`** torna o campo editável apenas via API (não pela interface).
- **Datas:** `date`/`date_time`/`birthday` aceitam **timestamp Unix (segundos)** ou string **RFC-3339**.
- **`multitext` só em contatos:** telefone/email são `multitext` e existem apenas na entidade `contacts` (códigos de telefone `WORK/WORKDD/MOB/FAX/HOME/OTHER`; de email `WORK/PRIV/OTHER`).
- **`chained_list` é Lead-only;** `linked_entity`/`price`/`category`/`items` são Lista-only.
- **`smart_address` usa `address_line_1`/`address_line_2`** (não `address`) além de `city`/`state`/`zip`/`country`.
- **Grupo predefinido não é excluível:** o grupo `default`/`Main` (`is_predefined: true`) não pode ser removido (DELETE retorna erro).
- **Não há DELETE de campo documentado na v4:** a referência v4 expõe delete só para **grupos**, não para campos individuais (`is_deletable` indica se o campo pode ser apagado pela interface).

---

## Exemplo de uso (curl)

Criar um campo `select` em leads:
```bash
curl -X POST "https://example.kommo.com/api/v4/leads/custom_fields" \
  -H "Authorization: Bearer {ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "name": "Origem do lead",
      "type": "select",
      "code": "LEAD_SOURCE",
      "sort": 520,
      "enums": [
        { "value": "Indicacao", "sort": 1, "code": "REFERRAL" },
        { "value": "Anuncio", "sort": 2, "code": "ADS" },
        { "value": "Organico", "sort": 3, "code": "ORGANIC" }
      ]
    }
  ]'
```

Listar campos de contatos, página 1, ordenando por `sort`:
```bash
curl -X GET "https://example.kommo.com/api/v4/contacts/custom_fields?limit=250&page=1&order[sort]=asc" \
  -H "Authorization: Bearer {ACCESS_TOKEN}"
```

Atualizar um campo por ID (objeto único):
```bash
curl -X PATCH "https://example.kommo.com/api/v4/leads/custom_fields/1240452" \
  -H "Authorization: Bearer {ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{ "name": "Origem (rev)", "sort": 530 }'
```

---

## Fontes

- https://developers.kommo.com/reference/custom-fields (Custom fields and field groups — visão geral, tipos e estrutura de valores)
- https://developers.kommo.com/reference/custom-field-by-entity (Custom fields list — GET listagem por entidade)
- https://developers.kommo.com/reference/custom-fields-by-id (Get entity field by ID — GET)
- https://developers.kommo.com/reference/add-custom-fields (Add custom fields — POST)
- https://developers.kommo.com/reference/update-custom-fields (Update custom fields — PATCH múltiplos)
- https://developers.kommo.com/reference/update-custom-field (Update custom field — PATCH por ID)
- https://developers.kommo.com/reference/list-of-entity-field-groups (Field groups — GET listagem)
- https://developers.kommo.com/reference/get-a-fields-group-by-id (Get a field group by ID — GET)
- https://developers.kommo.com/reference/add-field-groups (Add field groups — POST)
- https://developers.kommo.com/reference/edit-field-groups (Edit a field group — PATCH)
- https://developers.kommo.com/reference/delete-a-field-group (Delete a field group — DELETE)
- https://developers.kommo.com/reference/custom-fields-list-of-list (Custom fields list of a catalog/list — GET)
- https://developers.kommo.com/reference/adding-custom-field (Add a custom field to a catalog — POST)
- https://developers.kommo.com/reference/update-custom-fields-list (Update custom fields of a catalog — PATCH múltiplos)
- https://developers.kommo.com/reference/updating-custom-field-list (Update a custom field of a catalog — PATCH por ID)
- https://developers.kommo.com/reference/get-list-custom-field (Get a catalog field by its ID — GET)
- https://developers.kommo.com/docs/limitations (Limitations — rate limits e quotas)
- https://developers.kommo.com/llms.txt (índice oficial de páginas em markdown)
