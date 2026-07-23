# Kommo API — Valores de Campos Personalizados nas entidades

> Referência verificada contra a documentação oficial (developers.kommo.com), API v4.
> Última revisão: 2026-06-29.

## Visão geral

Na API v4 da Kommo, **todos** os valores de campos personalizados de uma entidade (lead, contato, empresa e elementos de lista/catálogo) são transportados em um único array chamado **`custom_fields_values`**, que faz parte do corpo da própria entidade. Não existe endpoint separado "para setar valor de campo": você seta/atualiza/limpa os valores **junto com a entidade** (criação ou atualização do lead/contato/empresa). Os endpoints `.../custom_fields` servem apenas para gerenciar a *definição* dos campos (criar/listar/editar/excluir o campo e seus `enums`), não os valores neles.

Cada item de `custom_fields_values` identifica **um** campo (por `field_id` ou por `field_code`) e carrega um array `values` com um ou mais objetos `{value, enum_id, enum_code}`. O formato exato de cada objeto depende do **tipo** do campo (texto, select, data, telefone/multitext, monetário, etc.).

Conceitos-chave:

| Conceito | Descrição |
|---|---|
| `custom_fields_values` | Array com todos os campos personalizados da entidade que você quer setar/atualizar. |
| `field_id` | ID numérico do campo personalizado (obtido em `GET .../{entity_type}/custom_fields`). |
| `field_code` | Código alfanumérico do campo. Pode ser usado **no lugar de** `field_id` para setar o valor sem precisar saber o ID (ex.: `PHONE`, `EMAIL`). Nem todo campo tem `code` (vem `null`). |
| `values` | Array de valores do campo. Campos de valor único têm 1 item; multitext/multiselect/smart_address têm vários. |
| `value` | O valor em si. O tipo (string, número, boolean, timestamp, objeto) varia conforme o tipo do campo. |
| `enum_id` | ID numérico de uma opção (`enum`) — usado em select/multiselect/multitext/smart_address/category/radiobutton. |
| `enum_code` | Código textual da opção (ex.: `WORK`, `MOB`, `HOME`). Alternativa ao `enum_id` quando o tipo expõe códigos fixos. Select/multiselect também aceitam `enum_code` quando a opção tem código. |

---

## Endpoints

Você manipula `custom_fields_values` por meio dos endpoints das **entidades** (não há endpoint dedicado a "valores"):

| Ação | Método + caminho |
|---|---|
| Criar leads | `POST https://{subdominio}.kommo.com/api/v4/leads` |
| Atualizar 1 lead | `PATCH https://{subdominio}.kommo.com/api/v4/leads/{id}` |
| Atualizar vários leads | `PATCH https://{subdominio}.kommo.com/api/v4/leads` |
| Obter 1 lead (com valores) | `GET https://{subdominio}.kommo.com/api/v4/leads/{id}` |
| Listar leads | `GET https://{subdominio}.kommo.com/api/v4/leads` |
| Criar contatos | `POST https://{subdominio}.kommo.com/api/v4/contacts` |
| Atualizar 1 contato | `PATCH https://{subdominio}.kommo.com/api/v4/contacts/{id}` |
| Atualizar vários contatos | `PATCH https://{subdominio}.kommo.com/api/v4/contacts` |
| Criar empresas | `POST https://{subdominio}.kommo.com/api/v4/companies` |
| Atualizar empresa | `PATCH https://{subdominio}.kommo.com/api/v4/companies/{id}` |
| Criar lead + contato + empresa de uma vez | `POST https://{subdominio}.kommo.com/api/v4/leads/complex` |
| Listar definições de campos (para descobrir `field_id`/`enum_id`) | `GET https://{subdominio}.kommo.com/api/v4/{entity_type}/custom_fields` |

`{entity_type}` ∈ `leads`, `contacts`, `companies`.

**Padrão de payload:** `POST`/`PATCH` em massa (rota sem `/{id}`) recebem **um array** de entidades; `PATCH` de entidade única (rota com `/{id}`) recebe **um único objeto**.

---

## Parâmetros de query (leitura)

Os valores dos campos vêm embutidos no objeto da entidade ao buscá-la — não há `with` específico para "custom fields" (eles já vêm sempre). Os parâmetros de query úteis aparecem na **leitura/listagem**:

`GET /api/v4/{entity_type}` e `GET /api/v4/{entity_type}/{id}` aceitam, entre outros:

| Parâmetro | Descrição | Exemplo |
|---|---|---|
| `page` | Página (paginação). | `?page=2` |
| `limit` | Itens por página (máx. 250). | `?limit=250` |
| `with` | Dados extras embutidos em `_embedded` (varia por entidade: `contacts`, `companies`, `catalog_elements`, `source`, `loss_reason`, etc.). | `?with=contacts,catalog_elements` |
| `filter[...]` | Filtros por campos da entidade. | `?filter[id][]=152462` |

Para **descobrir** os campos e seus enums, use `GET /api/v4/{entity_type}/custom_fields`, que aceita:

| Parâmetro | Tipo | Observação |
|---|---|---|
| `page` | int | Paginação |
| `limit` | int | Máx. **250** |
| `order[sort]` / `order[id]` | asc/desc | Ordenação |
| `filter[type][0]` | string | Filtra por tipo de campo |

Exemplo:
```
GET https://meusub.kommo.com/api/v4/leads/custom_fields?limit=250&filter[type][0]=multiselect
```

### Estrutura da *definição* de um campo (resposta de `GET .../custom_fields`)

Cada objeto de definição traz (entre outros): `id`, `name`, `code`, `sort`, `type`, `entity_type`,
`currency` (só para `monetary`), `enums` (opções, só para tipos com enum), `is_api_only`
(campo editável **somente via API**), `is_predefined`, `is_deletable`, `required_statuses`,
`group_id`, `remind` (lembrete de aniversário), `tracking_callback` (para `tracking_data`) e
`search_in` (catálogo/entidade para `linked_entity`). Use essa resposta para mapear `field_id`
e `enum_id` antes de escrever valores.

---

## Corpo da requisição (exemplos por tipo de campo)

O array `values` muda de formato conforme o **tipo** do campo. Abaixo os formatos oficiais.

**Texto, numérico, textarea, price, streetaddress, tracking_data, monetary** (valor simples):
```json
{
  "field_id": 3,
  "values": [{ "value": "Valor do campo" }]
}
```

**Checkbox (booleano):**
```json
{
  "field_id": 5,
  "values": [{ "value": true }]
}
```

**URL:**
```json
{
  "field_id": 7,
  "values": [{ "value": "https://www.kommo.com/" }]
}
```

**Data / Data e hora / Aniversário** (`date`, `date_time`, `birthday`) — **timestamp Unix** (segundos) ou string RFC-3339:
```json
{
  "field_id": 9,
  "values": [{ "value": 1577836800 }]
}
```

**Select / Radiobutton / Category** (uma opção) — por texto, por `enum_id` **ou** por `enum_code`:
```json
{ "field_id": 11, "values": [{ "value": "value 1" }] }
```
```json
{ "field_id": 11, "values": [{ "enum_id": 17 }] }
```
```json
{ "field_id": 11, "values": [{ "enum_code": "CODE_1" }] }
```

**Multiselect** (várias opções) — um objeto por opção (`enum_id` ou `enum_code`):
```json
{
  "field_id": 111,
  "values": [
    { "enum_id": 17 },
    { "enum_id": 19 }
  ]
}
```

**Multitext (telefone / e-mail)** — vários valores, cada um com seu tipo via `enum_code` (ou `enum_id`):
```json
{
  "field_id": 31,
  "values": [
    { "value": "+18001111111", "enum_code": "WORK" },
    { "value": "+18002222222", "enum_code": "HOME" }
  ]
}
```
- Códigos de **telefone** (`PHONE`): `WORK`, `WORKDD`, `MOB`, `FAX`, `HOME`, `OTHER`.
- Códigos de **e-mail** (`EMAIL`): `WORK`, `PRIV`, `OTHER`.

**Smart address (endereço inteligente)** — um objeto por subcampo, identificado por `enum_id` ou `enum_code`:
```json
{
  "field_id": 13,
  "values": [
    { "value": "940 Mission Rd", "enum_id": 1 },
    { "value": "San Francisco",  "enum_code": "city" },
    { "value": "94080",          "enum_id": 5 },
    { "value": "US",             "enum_code": "country" }
  ]
}
```
Subcampos (`enum_code`): `address_line_1`, `address_line_2`, `city`, `state`, `zip`, `country`.

**Legal entity (pessoa jurídica / CNPJ-equivalente)** — `value` é um **objeto**:
```json
{
  "field_id": 25,
  "values": [
    {
      "value": {
        "name": "The Origin Lab",
        "entity_type": 1,
        "vat_id": "123123123",
        "tax_registration_reason_code": "213",
        "address": "San Francisco",
        "external_uid": "uuid"
      }
    }
  ]
}
```
`name` é obrigatório.

**Linked entity (entidade vinculada):**
```json
{
  "field_id": 1150977,
  "values": [
    {
      "value": {
        "name": "John Hancock",
        "entity_id": 24833339,
        "entity_type": "contacts",
        "catalog_id": null
      }
    }
  ]
}
```

**Chained list (lista encadeada — só leads)** — até 5 elementos por valor:
```json
{
  "field_id": 1150985,
  "values": [
    { "catalog_id": 1001, "catalog_element_id": 12235 },
    { "catalog_id": 1007, "catalog_element_id": 12243 }
  ]
}
```

**File (arquivo)** — `value` é um objeto com UUIDs:
```json
{
  "field_id": 1150985,
  "values": [
    {
      "value": {
        "file_uuid": "3b454645-5c7f-4539-9ef9-0dd1b3638dad",
        "version_uuid": "13db6652-b3ed-4fff-aed8-0c6f3c43b887",
        "file_name": "wiki.odt",
        "file_size": 20763
      }
    }
  ]
}
```

### Exemplo completo de corpo (criar contato com telefone) — `POST /api/v4/contacts`
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

### Exemplo usando `field_code` em vez de `field_id` — `PATCH /api/v4/contacts/{id}`
```json
{
  "id": 963410,
  "first_name": "John",
  "last_name": "Doe",
  "custom_fields_values": [
    {
      "field_code": "PHONE",
      "values": [
        { "value": "+14155551234", "enum_code": "WORK" }
      ]
    }
  ]
}
```

---

## Como limpar um campo

Para **remover/esvaziar** o valor de um campo personalizado, o padrão usado na prática é enviar o item do campo com `values` **nulo** (a entidade continua existindo; só o valor é apagado):

```json
{
  "custom_fields_values": [
    {
      "field_id": 178382,
      "values": null
    }
  ]
}
```

Observações:
- Campos **omitidos** de `custom_fields_values` **não** são alterados — eles só mudam se você os incluir no payload.
- **(não confirmado na doc)** — As páginas oficiais de referência consultadas (custom-fields, update lead/contact, lead-capture) **não documentam textualmente** como limpar um valor. Tanto `"values": null` quanto `"values": []` (array vazio) são padrões usados pela comunidade; **teste na sua conta** qual surte efeito antes de confiar em produção.

---

## Resposta (exemplos reais)

**Ao criar/atualizar**, a resposta é HAL+JSON e **não** ecoa os `custom_fields_values` — retorna apenas IDs/links da(s) entidade(s):

```json
{
  "_links": {
    "self": { "href": "https://devteam.kommo.com/api/v4/leads" }
  },
  "_embedded": {
    "leads": [
      {
        "id": 152464,
        "updated_at": 1686732474,
        "_links": {
          "self": { "href": "https://devteam.kommo.com/api/v4/leads/152464" }
        }
      }
    ]
  }
}
```

**Ao ler** a entidade (`GET .../{id}`), os valores vêm em `custom_fields_values`, agora **com metadados** do campo (`field_name`, `field_code`, `field_type`, `is_computed`) que você não precisa enviar na escrita:

```json
"custom_fields_values": [
  {
    "field_id": 1698052,
    "field_name": "Phone",
    "field_code": "PHONE",
    "field_type": "multitext",
    "values": [
      {
        "value": "+18305803077",
        "enum_id": 1037745,
        "enum_code": "MOB"
      }
    ]
  },
  {
    "field_id": 184994,
    "field_name": "Sale",
    "field_code": null,
    "field_type": "checkbox",
    "values": [
      { "value": true }
    ],
    "is_computed": false
  }
]
```

---

## Tabela de tipos de campo × formato do `values`

Tipos oficiais (`field_type`): `text`, `numeric`, `checkbox`, `select`, `multiselect`, `date`,
`url`, `textarea`, `radiobutton`, `streetaddress`, `smart_address`, `birthday`, `legal_entity`,
`price`, `category`, `items`/`tracking_data`, `monetary`, `date_time`, `multitext`,
`linked_entity`, `chained_list`, `file`.

| Tipo (`field_type`) | Formato de `value` | Usa `enum_id`/`enum_code`? |
|---|---|---|
| `text`, `textarea`, `numeric`, `url`, `tracking_data`, `streetaddress`, `price` | string/número | Não |
| `checkbox` | `true` / `false` | Não |
| `date`, `date_time`, `birthday` | timestamp Unix (seg) ou RFC-3339 | Não |
| `select`, `radiobutton`, `category` | string OU `enum_id`/`enum_code` (1 item) | `enum_id` (recomendado) ou `enum_code` |
| `multiselect` | vários `enum_id`/`enum_code` (1 por opção) | `enum_id`/`enum_code` |
| `multitext` (telefone/e-mail) | string + `enum_code`/`enum_id` por valor | Sim (`WORK`,`MOB`,`HOME`,`FAX`,`WORKDD`,`OTHER`,`PRIV`) |
| `smart_address` | string por subcampo + `enum_code`/`enum_id` | Sim (`city`,`state`,`zip`,`country`,`address_line_1/2`) |
| `monetary` | número/string | Não (currency é definido na *definição* do campo) |
| `legal_entity` | objeto (`name`, `entity_type`, `vat_id`...) | Não |
| `linked_entity` | objeto (`entity_id`, `entity_type`...) | Não |
| `chained_list` (só leads) | `catalog_id` + `catalog_element_id` (até 5) | Não |
| `file` | objeto com `file_uuid`/`version_uuid` | Não |

---

## Limites / rate limits

- **40** valores de campos personalizados por entidade ao usar `POST /api/v4/leads/complex` (lead, contato ou empresa).
- **50** leads por requisição em `/api/v4/leads/complex`; **apenas 1** contato e **1** empresa por lead nessa rota.
- Lote geral de escrita (`POST`/`PATCH` em massa de leads/contacts/companies): máximo **250** entidades por requisição, mas a Kommo **recomenda no máximo 50** por requisição.
- `GET .../custom_fields` e listagens: `limit` máximo **250** por página.
- Rate limit geral da API: **no máximo 7 requisições/segundo** por conta. Não há limite específico documentado para escrita de valores — aplica-se o limite global.
- Estourar o limite retorna **HTTP 429**; violações repetidas podem resultar em bloqueio de IP com **HTTP 403** nas requisições seguintes.
- `chained_list`: até **5** elementos por valor.

---

## Pegadinhas e erros comuns ("gotchas")

- **`values` vs `value`:** o array é `values` (plural); cada item tem a chave `value` (singular). Confundir os dois é a causa nº 1 de erro `400`/`422`.
- **Select/multiselect:** prefira `enum_id` (ou `enum_code`). Passar `value` por texto exige que a string bata **exatamente** com a opção cadastrada; se não bater, o valor é ignorado/rejeitado.
- **Enviar `value` em select esperando criar opção:** não cria a opção automaticamente — opções (`enums`) são gerenciadas na *definição* do campo (`POST/PATCH .../custom_fields`).
- **Data como string:** datas devem ser **timestamp Unix em segundos** (não milissegundos) ou RFC-3339. Milissegundos viram datas absurdas.
- **Multitext sem `enum`:** telefone/e-mail aceitam um valor sem `enum_code`, mas o sistema atribui um tipo padrão; para WhatsApp/discagem é recomendável especificar `WORK`/`MOB`.
- **Resposta de escrita não retorna os valores:** para confirmar o que ficou gravado, faça um `GET` da entidade.
- **`field_code` nem sempre existe:** muitos campos custom não têm `code` (vem `null`). Nesses, use `field_id`.
- **Campos omitidos não são apagados:** só são alterados os campos presentes no payload; para apagar, é preciso enviar explicitamente o campo (ver "Como limpar um campo").
- **`is_api_only`:** campo marcado assim é **editável somente via API** (não pela interface). `is_computed`/campos calculados podem ser read-only e rejeitar escrita.
- **`429`:** estourou o rate limit (7 req/s) — reenvie com backoff; violações repetidas geram `403`/bloqueio de IP.

---

## Exemplo de uso (curl)

Atualizar um lead setando um campo select (por `enum_id`), um campo data (timestamp) e limpando um terceiro campo:

```bash
curl -X PATCH "https://meusub.kommo.com/api/v4/leads/152464" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "custom_fields_values": [
      { "field_id": 1551478, "values": [ { "enum_id": 17 } ] },
      { "field_id": 184994,  "values": [ { "value": 1577836800 } ] },
      { "field_id": 178382,  "values": null }
    ]
  }'
```

Criar um contato com telefone de trabalho e celular (multitext), usando `field_code`:

```bash
curl -X POST "https://meusub.kommo.com/api/v4/contacts" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "first_name": "Maria",
      "custom_fields_values": [
        {
          "field_code": "PHONE",
          "values": [
            { "value": "+5511999990000", "enum_code": "WORK" },
            { "value": "+5511988887777", "enum_code": "MOB" }
          ]
        }
      ]
    }
  ]'
```

---

## Fontes

- https://developers.kommo.com/reference/custom-fields.md — Custom fields and field groups (formatos de `values` por tipo, enum codes de telefone/e-mail/smart_address, legal_entity, linked_entity, chained_list, file)
- https://developers.kommo.com/reference/custom-field-by-entity.md — Custom fields list (estrutura da definição: id, code, type, enums, currency, is_api_only, is_predefined, is_deletable, group_id, remind, search_in; parâmetros page/limit/order/filter; limit máx 250)
- https://developers.kommo.com/reference/add-custom-fields.md — Add custom fields (criação de campos e enums com `code`)
- https://developers.kommo.com/reference/complex-leads.md — Complex lead creation (`custom_fields_values` em `/leads/complex`, limites 50 leads / 40 campos / 1 contato / 1 empresa por lead)
- https://developers.kommo.com/reference/add-contacts.md — Add contacts (exemplo de `custom_fields_values` e resposta HAL+JSON)
- https://developers.kommo.com/reference/adding-leads.md — Add leads (exemplo de payload com `custom_fields_values`)
- https://developers.kommo.com/reference/updating-single-lead.md — Update lead (PATCH `/api/v4/leads/{id}`, exemplo de atualização de valor)
- https://developers.kommo.com/reference/update-contact.md — Update contact (multitext com `enum_code` WORK)
- https://developers.kommo.com/reference/getting-a-lead-by-its-id.md — Get lead by ID (resposta com `custom_fields_values` + `field_type`/`is_computed`; parâmetro `with`)
- https://developers.kommo.com/docs/lead-capture.md — Lead Capture (exemplo de phone multitext com `enum_id`+`enum_code`, descoberta de `field_id`/`enum_id`)
- https://developers.kommo.com/docs/limitations — Limitations (rate limit 7 req/s, HTTP 429/403, lote máx 250 / recomendado 50)
- https://developers.kommo.com/llms.txt — Índice de URLs da documentação oficial
