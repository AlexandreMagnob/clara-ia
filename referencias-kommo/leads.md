# Kommo API — Leads (Negócios) API

## Visão geral do recurso

O recurso **Leads** (em PT na interface da Kommo: "Negócios") representa cada oportunidade/negócio dentro de um funil (*pipeline*). É a entidade central do CRM: tem valor (`price`), está em um estágio (`status_id`) de um funil (`pipeline_id`), tem um responsável (`responsible_user_id`) e pode estar vinculado a contatos, empresas, tags, itens de lista (*catalog elements*) e motivo de perda.

Todos os endpoints ficam sob `https://{subdominio}.kommo.com/api/v4/...` e exigem autenticação **OAuth 2.0** (header `Authorization: Bearer {access_token}`; também aceita *long-lived token*).

- Respostas de sucesso: `Content-Type: application/hal+json` (formato HAL com `_links` e `_embedded`).
- Respostas de erro: `Content-Type: application/problem+json`.
- `Content-Type` das requisições com corpo: `application/json`.

---

## Endpoints

| Operação | Método | Caminho |
|---|---|---|
| Listar leads | GET | `https://{subdominio}.kommo.com/api/v4/leads` |
| Obter lead por ID | GET | `https://{subdominio}.kommo.com/api/v4/leads/{id}` |
| Adicionar leads (lote/único) | POST | `https://{subdominio}.kommo.com/api/v4/leads` |
| Adição complexa (com contato/empresa) | POST | `https://{subdominio}.kommo.com/api/v4/leads/complex` |
| Atualizar leads (lote) | PATCH | `https://{subdominio}.kommo.com/api/v4/leads` |
| Atualizar lead único | PATCH | `https://{subdominio}.kommo.com/api/v4/leads/{id}` |
| Listar leads de entrada (não classificados) | GET | `https://{subdominio}.kommo.com/api/v4/leads/unsorted` |
| Obter lead de entrada por UID | GET | `https://{subdominio}.kommo.com/api/v4/leads/unsorted/{uid}` |
| Adicionar lead de entrada (formulário) | POST | `https://{subdominio}.kommo.com/api/v4/leads/unsorted/forms` |
| Adicionar lead de entrada (chamada/SIP) | POST | `https://{subdominio}.kommo.com/api/v4/leads/unsorted/sip` |
| Aceitar lead de entrada | POST | `https://{subdominio}.kommo.com/api/v4/leads/unsorted/{uid}/accept` |
| Rejeitar lead de entrada | **DELETE** | `https://{subdominio}.kommo.com/api/v4/leads/unsorted/{uid}/decline` |
| Vincular lead de entrada a lead existente | POST | `https://{subdominio}.kommo.com/api/v4/leads/unsorted/{uid}/link` |

> **Atenção ao método de "rejeitar":** o endpoint de decline usa **DELETE** (não POST), e exige `user_id` no corpo. Já o accept e o link usam **POST**.

---

## GET /api/v4/leads — Listar leads

### Parâmetros de query

**Paginação e ordenação**
| Parâmetro | Tipo | Descrição |
|---|---|---|
| `page` | int | Número da página |
| `limit` | int | Entidades por requisição (**máx. 250**) |
| `order[created_at]` | string | `asc` ou `desc` |
| `order[updated_at]` | string | `asc` ou `desc` |
| `order[id]` | string | `asc` ou `desc` |

**Busca**
| Parâmetro | Tipo | Descrição |
|---|---|---|
| `query` | string | Busca em todos os campos preenchidos do lead (texto, telefone etc.) |

**`with`** (valores separados por vírgula) — incluem dados adicionais que NÃO vêm por padrão. Valores oficiais confirmados na doc:
- `contacts` — contatos vinculados (em `_embedded.contacts`)
- `catalog_elements` — itens de lista vinculados
- `loss_reason` — detalhes do motivo de perda (objeto)
- `is_price_modified_by_robot` — se o Robô alterou o valor por último
- `source_id` — ID da fonte do lead
- `only_deleted` — retorna **apenas** leads excluídos restauráveis (com `id`, data de modificação e `is_deleted=true`)

> Nota: a versão anterior deste rascunho citava também `with=source` (ID + nome da fonte). Esse valor **não consta na lista oficial do endpoint de leads** (a lista oficial é `catalog_elements`, `is_price_modified_by_robot`, `loss_reason`, `contacts`, `only_deleted`, `source_id`). Use `source_id`.

**Filtros**
| Filtro | Tipo | Descrição |
|---|---|---|
| `filter[id][]` | array int | Por ID(s) de lead |
| `filter[name][]` | array string | Por nome(s) |
| `filter[price]` | int | Por valor |
| `filter[created_by][]` | array int | Por usuário criador |
| `filter[updated_by][]` | array int | Por último usuário que modificou |
| `filter[responsible_user_id][]` | array int | Por responsável |
| `filter[created_at][from]` / `[to]` | int (Unix ts) | Faixa de data de criação |
| `filter[updated_at][from]` / `[to]` | int (Unix ts) | Faixa de data de atualização |
| `filter[closed_at][from]` / `[to]` | int (Unix ts) | Faixa de data de fechamento |
| `filter[closest_task_at][from]` / `[to]` | int (Unix ts) | Faixa da próxima tarefa |
| `filter[pipeline_id][]` | array int | Por funil |
| `filter[statuses][0][pipeline_id]` | int | Funil (usar junto com status_id) |
| `filter[statuses][0][status_id]` | int | Estágio. **Só é possível filtrar um estágio por funil por requisição.** |

### Exemplo de resposta (200)

```json
{
  "_page": 1,
  "_links": {
    "self": { "href": "https://subdomain.kommo.com/api/v4/leads?page=1&limit=250" }
  },
  "_embedded": {
    "leads": [
      {
        "id": 20024930,
        "name": "Lead 1",
        "price": 0,
        "responsible_user_id": 11087123,
        "group_id": 0,
        "status_id": 94386187,
        "pipeline_id": 12215168,
        "loss_reason_id": null,
        "created_by": 11087123,
        "updated_by": 11087123,
        "created_at": 1760976072,
        "updated_at": 1760976072,
        "closed_at": null,
        "closest_task_at": null,
        "is_deleted": false,
        "custom_fields_values": [
          {
            "field_id": 1928052,
            "field_name": "Specialty",
            "field_code": null,
            "field_type": "select",
            "values": [
              { "value": "Diagnostic", "enum_id": 1669868, "enum_code": null }
            ],
            "is_computed": false
          }
        ],
        "score": null,
        "account_id": 35379952,
        "labor_cost": null,
        "is_price_computed": false,
        "_links": {
          "self": { "href": "https://subdomain.kommo.com/api/v4/leads/20024930" }
        },
        "_embedded": {
          "tags": [],
          "companies": [
            {
              "id": 29610174,
              "_links": { "self": { "href": "https://subdomain.kommo.com/api/v4/companies/29610174" } }
            }
          ]
        }
      }
    ]
  }
}
```

> Quando não há leads que atendam ao filtro, a API retorna **HTTP 204 (No Content)** com corpo vazio — não um `_embedded.leads` vazio. Trate o 204 explicitamente.

Códigos possíveis: **200** OK · **204** No Content · **400** Bad Request · **401** Unauthorized · **403** Forbidden · **429** Too Many Requests · **500** Server Error.

---

## GET /api/v4/leads/{id} — Obter lead por ID

**Path:** `id` (int, obrigatório).
**Query:** mesmo parâmetro `with` da listagem (`contacts`, `catalog_elements`, `loss_reason`, `is_price_modified_by_robot`, `source_id`, `only_deleted`).

### Exemplo de resposta (200)

```json
{
  "id": 152464,
  "name": "Example lead 2",
  "price": 20000,
  "responsible_user_id": 8375357,
  "group_id": 0,
  "status_id": 58141807,
  "pipeline_id": 6950551,
  "loss_reason_id": null,
  "created_by": 0,
  "updated_by": 8375357,
  "created_at": 1686673337,
  "updated_at": 1686748504,
  "closed_at": null,
  "closest_task_at": null,
  "is_deleted": false,
  "custom_fields_values": [
    {
      "field_id": 184994,
      "field_name": "Sale",
      "field_code": null,
      "field_type": "checkbox",
      "values": [ { "value": true } ],
      "is_computed": false
    }
  ],
  "score": null,
  "account_id": 31361463,
  "labor_cost": null,
  "is_price_computed": false,
  "_links": {
    "self": { "href": "https://devteam.kommo.com/api/v4/leads/152464?page=1&limit=50" }
  },
  "_embedded": {
    "tags": [ { "id": 2164, "name": "Ex", "color": null } ],
    "companies": []
  }
}
```

Códigos: **200** OK · **204** lead não encontrado · **401** não autorizado.

---

## POST /api/v4/leads — Adicionar leads

Corpo é **sempre um array** de objetos lead (mesmo para um único lead). Todos os campos são opcionais.

### Exemplo de requisição

```json
[
  {
    "name": "Example Lead 1",
    "created_by": 8375357,
    "price": 20000,
    "status_id": 58141807,
    "pipeline_id": 6950551,
    "custom_fields_values": [
      { "field_id": 184994, "values": [ { "value": true } ] }
    ]
  },
  { "name": "Example Lead 2", "price": 10000 }
]
```

Para vincular tags na criação, use `_embedded.tags` (por `id` ou por `name`). Use `request_id` (string) em cada objeto para correlacionar a entrada com o item correspondente na resposta.

### Exemplo de resposta (200)

```json
{
  "_links": { "self": { "href": "https://devteam.kommo.com/api/v4/leads" } },
  "_embedded": {
    "leads": [
      {
        "id": 152462,
        "request_id": "0",
        "_links": { "self": { "href": "https://devteam.kommo.com/api/v4/leads/152462" } }
      },
      {
        "id": 152464,
        "request_id": "1",
        "_links": { "self": { "href": "https://devteam.kommo.com/api/v4/leads/152464" } }
      }
    ]
  }
}
```

> Se você não enviar `request_id`, a Kommo devolve o **índice do array como `request_id`** (`"0"`, `"1"`, ...). Códigos: **200** criado · **400** dados inválidos · **401** não autorizado.

---

## PATCH /api/v4/leads — Atualizar leads

- **Lote:** PATCH em `/api/v4/leads` com array de objetos; cada objeto **deve conter `id`**.
- **Único:** PATCH em `/api/v4/leads/{id}` com **um único objeto** (sem array).

### Exemplo de requisição (lote)

```json
[
  {
    "id": 152464,
    "name": "Lead with Sam",
    "price": 12000,
    "status_id": 58141811,
    "custom_fields_values": [
      { "field_id": 184994, "values": [ { "value": true } ] }
    ]
  },
  { "id": 152462, "price": 15000, "pipeline_id": 6954751 }
]
```

### Exemplo de resposta (200)

```json
{
  "_links": { "self": { "href": "https://devteam.kommo.com/api/v4/leads" } },
  "_embedded": {
    "leads": [
      {
        "id": 152464,
        "updated_at": 1686732474,
        "_links": { "self": { "href": "https://devteam.kommo.com/api/v4/leads/152464" } }
      },
      {
        "id": 152462,
        "updated_at": 1686732474,
        "_links": { "self": { "href": "https://devteam.kommo.com/api/v4/leads/152462" } }
      }
    ]
  }
}
```

---

## POST /api/v4/leads/complex — Adição complexa (lead + contato + empresa)

Cria, em um só passo, o lead **com** contato e empresa, aplicando **controle de duplicatas** conforme as regras da conta.

**Restrições:**
- Máx. **1 contato** e **1 empresa** por lead.
- Máx. **40 campos personalizados** por entidade.
- Máx. **50 leads** por requisição.
- O controle de duplicatas vale **entre** requisições, **não** dentro do mesmo lote.
- Contatos/empresas novos são vinculados ao lead automaticamente.

Campos especiais (dentro de `_embedded`):
- `_embedded.metadata.category` — marca como lead de entrada; valores `"sip"` ou `"forms"`.
- `_embedded.source.external_id` (define o funil se `pipeline_id` for omitido) e `_embedded.source.type` (`"widget"` para integrações).
- `tags_to_add` — tags a anexar (por `id` ou `name`).
- `request_id` — devolvido inalterado na resposta, não é salvo.

### Exemplo de requisição

```json
[
  {
    "name": "New lead 1",
    "price": 2222,
    "_embedded": {
      "contacts": [
        {
          "first_name": "Adam",
          "created_at": 1668784888,
          "responsible_user_id": 8375357,
          "custom_fields_values": [
            {
              "field_id": 562166,
              "field_name": "Phone",
              "values": [ { "value": "0965423364", "enum_code": "WORK" } ]
            }
          ],
          "updated_by": 0
        }
      ],
      "companies": [ { "name": "Kommo" } ]
    },
    "created_at": 1668784001,
    "responsible_user_id": 8375357,
    "status_id": 49366079,
    "pipeline_id": 5597036,
    "request_id": "1"
  }
]
```

### Exemplo de resposta (200)

```json
[
  {
    "id": 9774766,
    "contact_id": 12117258,
    "company_id": 12117260,
    "request_id": [ "1" ],
    "merged": false
  }
]
```

Quando bate uma regra de duplicata, a entidade existente é reaproveitada e `merged` vem `true`; o `request_id` (array) acumula os identificadores das requisições que casaram:

```json
[
  {
    "id": 9774766,
    "contact_id": 12117258,
    "company_id": 12117260,
    "request_id": [ "2" ],
    "merged": true
  }
]
```

> A resposta é um **array** (diferente do POST normal, que devolve `_embedded.leads`). `request_id` aqui é **array**, não string.

---

## Leads não classificados / de entrada (Unsorted / Incoming)

Leads "de entrada" chegam de integrações (telefonia, formulários de site, chats, e-mail) e ficam na etapa **Não classificados** até serem aceitos (viram lead/contato/empresa) ou rejeitados.

### GET /api/v4/leads/unsorted — Listar

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `page` | int | Página |
| `limit` | int | Por página (máx. 250) |
| `filter[uid]` | array string | Por UID(s) |
| `filter[category]` | array string | `sip`, `mail`, `forms`, `chats` |
| `filter[pipeline_id]` | int | Por funil |
| `order[created_at]` | string | `asc` / `desc` |

Estrutura de cada item em `_embedded.unsorted` (o `metadata` varia por categoria):

```json
{
  "uid": "string",
  "source_uid": "string ou null",
  "source_name": "string ou null",
  "category": "string",
  "pipeline_id": 0,
  "created_at": 0,
  "metadata": { },
  "account_id": 0,
  "_embedded": {
    "contacts": [ { "id": 0 } ],
    "leads":    [ { "id": 0 } ],
    "companies": []
  }
}
```

### GET /api/v4/leads/unsorted/{uid} — Obter lead de entrada por UID

Retorna um único lead de entrada pelo seu `uid` (mesma estrutura de item acima).

### POST /api/v4/leads/unsorted/forms — Lead de entrada (formulário)

Campos do objeto (array de objetos):
- `source_uid` (string, obrigatório) — UID da fonte, gerado pela integração.
- `source_name` (string, obrigatório) — nome da fonte.
- `pipeline_id` (int, opcional) — funil destino.
- `created_at` (int, opcional).
- `request_id` (string) — retornado inalterado, não persistido.
- `metadata` (object): `form_id`, `form_name`, `form_page`, `ip`, `form_sent_at`, `referer`.
- `_embedded`: `leads[]` (1), `contacts[]` (1), `companies[]` (1), além de `tags`/`tags_to_add`.

**Exemplo de requisição:**

```json
[
  {
    "request_id": "456",
    "source_name": "Asme Co.",
    "source_uid": "a1fee7c0fc436088e64ba2e8822ba2b3",
    "pipeline_id": 6950551,
    "created_at": 1510261200,
    "_embedded": {
      "leads": [
        {
          "name": "Tech maintenance",
          "price": 5500,
          "custom_fields_values": [
            { "field_id": 184994, "values": [ { "value": true } ] }
          ],
          "_embedded": { "tags": [ { "id": 2164 } ] }
        }
      ],
      "contacts": [ { "name": "Example 2 contact" } ],
      "companies": [ { "name": "Atme Co." } ]
    },
    "metadata": {
      "ip": "123.222.2.22",
      "form_id": "a1fee7c0fc436088e64ba2e8822ba2b3ewrw",
      "form_sent_at": 1590830520,
      "form_name": "Application form",
      "form_page": "https://example.com",
      "referer": "https://www.google.com"
    }
  }
]
```

**Exemplo de resposta (200):**

```json
{
  "_total_items": 1,
  "_embedded": {
    "unsorted": [
      {
        "uid": "400c5eb65b9fa7bbfa813cf593b49d4942f325c7c3fbbcf3acf3bee79b63",
        "account_id": 31361463,
        "request_id": "123",
        "_links": { "self": { "href": "LINK" } },
        "_embedded": {
          "contacts": [ { "id": 583294, "_links": { "self": { "href": "https://devteam.kommo.com/api/v4/contacts/583294" } } } ],
          "leads":    [ { "id": 236724, "_links": { "self": { "href": "https://devteam.kommo.com/api/v4/leads/236724" } } } ],
          "companies": []
        }
      }
    ]
  }
}
```

Códigos: **200** adicionado · **400** dados inválidos · **401** não autorizado.

### POST /api/v4/leads/unsorted/sip — Lead de entrada (chamada)

Estrutura análoga à de formulário. Campos top-level obrigatórios: `source_uid` e `source_name`. Opcionais: `pipeline_id`, `created_at`, `request_id`, `_embedded`. O objeto `metadata` (obrigatório) tem campos específicos de chamada:

| Campo | Tipo | Descrição |
|---|---|---|
| `uniq` | string | Identificador único da chamada |
| `from` | string | Quem iniciou a chamada (origem) |
| `phone` | string | Número do interlocutor |
| `called_at` | int | Timestamp da chamada (Unix) |
| `duration` | int | Duração da chamada em segundos |
| `link` | string | URL da gravação da chamada |
| `service_code` | string | Código do provedor/serviço |
| `is_call_event_needed` | bool | Adiciona o evento de chamada ao card da entidade |
| `call_responsible` | string | ID Kommo, telefone ou nome do responsável pela chamada |

**Exemplo de requisição:**

```json
[
  {
    "request_id": "123",
    "source_name": "Acme Co.",
    "source_uid": "a1fee7c0fc436088e64ba2e8822ba2b3",
    "pipeline_id": 6950551,
    "created_at": 1510261200,
    "metadata": {
      "is_call_event_needed": true,
      "uniq": "a1fe231cc88e64ba2e8822ba2b3ewrw",
      "duration": 54,
      "service_code": "CkAvbEwPam6sad",
      "link": "https://example.com",
      "phone": "14155551234",
      "called_at": 1510261200,
      "from": "onlinePBX"
    },
    "_embedded": {
      "leads": [ { "name": "Tech maintenance", "price": 5000 } ],
      "contacts": [ { "name": "Example contact" } ],
      "companies": [ { "name": "Acme Co." } ]
    }
  }
]
```

**Exemplo de resposta (200):** mesma estrutura `_total_items` + `_embedded.unsorted[]` do endpoint de formulário.

### POST /api/v4/leads/unsorted/{uid}/accept — Aceitar lead de entrada

Aceita o lead de entrada, criando/efetivando lead, contato e empresa associados.

| Parâmetro (corpo) | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `user_id` | int | Não | Usuário que será definido como criador do lead |
| `status_id` | int | Não | Estágio em que o lead ficará após aceito |

**Exemplo de resposta (200):**

```json
{
  "uid": "5af9dedb6f2c6a29eaac6ee37fc75ffbb66e139e4603bdd0e14e39d4b319",
  "pipeline_id": 6950551,
  "category": "forms",
  "created_at": 1686819152,
  "_embedded": {
    "leads": [ { "id": 236768 } ],
    "contacts": [ { "id": 583338, "is_deleted": false, "is_unsorted": false } ],
    "companies": []
  }
}
```

Códigos: **200** aceito · **400** Bad Request · **401** não autorizado · **404** UID não encontrado.

### DELETE /api/v4/leads/unsorted/{uid}/decline — Rejeitar lead de entrada

> **Importante:** este endpoint usa o método **DELETE**, não POST.

| Parâmetro (corpo) | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `user_id` | int | **Sim** | ID do usuário que está executando a rejeição |

**Exemplo de requisição:**

```json
{ "user_id": 8375357 }
```

Códigos: **200** rejeitado · **400** dados inválidos · **401** não autorizado · **403** proibido · **404** UID não encontrado.

### POST /api/v4/leads/unsorted/{uid}/link — Vincular lead de entrada

Vincula um lead de entrada a um lead já existente (em vez de criar um novo).

### Categorias criáveis via API

Apenas as categorias **`forms`** e **`sip`** podem ser **criadas** via API (mail/chats não são criados por estes endpoints). Todas as categorias (`sip`, `mail`, `forms`, `chats`) podem ser **listadas** e aceitas/rejeitadas.

---

## Tabela de campos importantes (lead)

| Campo | Tipo | Observação |
|---|---|---|
| `id` | int | Identificador do lead |
| `name` | string | Nome/título do negócio |
| `price` | int | Valor da venda (inteiro, sem casas decimais) |
| `responsible_user_id` | int | Usuário responsável |
| `group_id` | int | Grupo do usuário responsável |
| `status_id` | int | Estágio do funil |
| `pipeline_id` | int | Funil |
| `loss_reason_id` | int / null | Motivo de perda |
| `created_by` | int | Criador (**0 = Robô/sistema**) |
| `updated_by` | int | Último a modificar (**0 = Robô/sistema**) |
| `created_at` | int | Unix timestamp |
| `updated_at` | int | Unix timestamp |
| `closed_at` | int / null | Fechamento (Unix ts) |
| `closest_task_at` | int / null | Próxima tarefa (Unix ts) |
| `is_deleted` | bool | Excluído |
| `custom_fields_values` | array / null | Campos personalizados (ver abaixo) |
| `score` | int / null | Pontuação |
| `account_id` | int | Conta |
| `labor_cost` | int / null | Tempo gasto (segundos) |
| `is_price_computed` | bool | Valor calculado por fórmula |
| `is_price_modified_by_robot` | bool | Só vem com `with=is_price_modified_by_robot` |
| `source_id` | int | Só vem com `with=source_id` |
| `_embedded.tags[]` | array | `{id, name, color}` |
| `_embedded.contacts[]` | array | `{id, is_main}` — só com `with=contacts` |
| `_embedded.companies[]` | array | `{id}` — **máx. 1 empresa por lead** |
| `_embedded.catalog_elements[]` | array | `{id, quantity, catalog_id}` — só com `with=catalog_elements` |
| `_embedded.loss_reason` | object | `{id, name}` — só com `with=loss_reason` |

**Estrutura de `custom_fields_values`** (na leitura vêm `field_name`, `field_code`, `field_type`, `is_computed`; na escrita basta `field_id` + `values`):

```json
{
  "field_id": 184994,
  "field_type": "select",
  "values": [ { "value": "Texto", "enum_id": 1669868, "enum_code": "CODE" } ]
}
```

Para campos `multitext` (telefone/e-mail) usa-se `enum_code` (ex.: `WORK`, `MOB`). Para `checkbox`, `value` é booleano.

---

## Limites / rate limits

- **Rate limit:** no máximo **7 requisições por segundo**. Acima disso → **HTTP 429**; violações repetidas podem levar a **HTTP 403** (bloqueio de IP).
- **Máx. de entidades retornadas por requisição:** **250** (leads/contatos/empresas).
- **Máx. de entidades por requisição de adição/atualização:** 250 no total, mas a Kommo **recomenda no máximo 50** por requisição (performance e para evitar erros). Se receber **HTTP 504**, reduza a quantidade de entidades e repita.
- **Máx. 40 campos personalizados** por entidade (na adição complexa).
- **Complex add:** máx. **50 leads** por requisição.
- Limites de conta correlatos: **50 funis** por conta, **100 estágios** por funil (incluindo estágios de sistema, como Venda Realizada/Venda Perdida), **100 fontes** por integração, **100 webhooks** por conta, **10 listas** por conta.

---

## Pegadinhas e erros comuns (gotchas)

1. **POST sempre recebe array**, mesmo para um único lead. PATCH único (`/leads/{id}`) recebe **um objeto**, não array. Enviar o formato errado gera **400**.
2. **`price` é inteiro.** Não envie decimais/strings com vírgula.
3. **`created_by`/`updated_by` = 0** significa "Robô/sistema" — não é um usuário inexistente.
4. **204 ≠ lista vazia.** GET sem resultados retorna **204 No Content** (corpo vazio). Não tente parsear `_embedded.leads`.
5. **`with` é obrigatório** para trazer `contacts`, `loss_reason`, `catalog_elements`, `source_id`, etc. Sem ele, esses campos não aparecem (e `_embedded.contacts` virá ausente). Não existe `with=source` no endpoint de leads — use `with=source_id`.
6. **Filtro de estágio:** só **um `status_id` por funil** por requisição em `filter[statuses]`.
7. **Atualização de `custom_fields_values`:** para limpar um campo, envie `values: []` (array vazio). Campos do tipo errado (ex.: mandar string num `numeric`) retornam 400 com detalhes no corpo.
8. **`complex` x duplicatas:** a deduplicação **não** ocorre dentro do mesmo lote — dois itens iguais no mesmo POST criam dois leads. O `request_id` na resposta do complex é **array**.
9. **`_embedded.companies` aceita no máximo 1 empresa** por lead (limitação do modelo de dados da Kommo).
10. **`request_id`** é o jeito de correlacionar entrada↔saída em lote; se omitido, a Kommo usa o índice do array.
11. **`source_id`/fonte** só pode ser definido via fontes registradas pela integração; não é um campo livre.
12. **Erros 400** sempre trazem detalhes em `application/problem+json` no corpo — leia o corpo, não apenas o status.
13. **Rejeitar lead de entrada usa DELETE**, não POST — e exige `user_id` no corpo. Aceitar usa POST com `user_id`/`status_id` (ambos opcionais).

---

## Exemplo de uso (curl)

Buscar leads de um funil/estágio, já trazendo contatos e fonte, ordenados por atualização:

```bash
curl -X GET \
  'https://meusub.kommo.com/api/v4/leads?with=contacts,source_id&filter[statuses][0][pipeline_id]=6950551&filter[statuses][0][status_id]=58141807&order[updated_at]=desc&limit=50&page=1' \
  -H 'Authorization: Bearer SEU_ACCESS_TOKEN' \
  -H 'Accept: application/json'
```

Criar um lead com campo personalizado e tag, e depois movê-lo de estágio:

```bash
# Criar
curl -X POST 'https://meusub.kommo.com/api/v4/leads' \
  -H 'Authorization: Bearer SEU_ACCESS_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '[{
        "name": "Casa Gourmet",
        "price": 2990,
        "pipeline_id": 6950551,
        "status_id": 58141807,
        "responsible_user_id": 8375357,
        "request_id": "lead-casa-gourmet",
        "custom_fields_values": [
          { "field_id": 184994, "values": [ { "value": true } ] }
        ],
        "_embedded": { "tags": [ { "name": "via-api" } ] }
      }]'

# Atualizar (mover de estágio) — PATCH único
curl -X PATCH 'https://meusub.kommo.com/api/v4/leads/152464' \
  -H 'Authorization: Bearer SEU_ACCESS_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{ "status_id": 58141811, "price": 3490 }'
```

---

## Fontes

- https://www.kommo.com/developers/content/crm_platform/leads-api/ (guia completo da Leads API — JSON de list, get, add, update e complex)
- https://developers.kommo.com/reference/leads-list e https://developers.kommo.com/reference/leads-list.md (parâmetros, valores de `with`, exemplo de resposta, códigos 200/204/400/401/403/429/500)
- https://pt-developers.kommo.com/reference/lista-de-leads (versão PT da listagem)
- https://developers.kommo.com/reference/getting-a-lead-by-its-id (GET por ID)
- https://developers.kommo.com/reference/adding-leads (POST add)
- https://developers.kommo.com/reference/updating-leads (PATCH update)
- https://developers.kommo.com/reference/complex-leads e https://developers.kommo.com/reference/complex-leads.md (adição complexa)
- https://developers.kommo.com/reference/incoming-leads (índice de leads de entrada — forms/sip criáveis via API)
- https://developers.kommo.com/reference/incoming-leads-list (GET unsorted, categorias, metadata)
- https://developers.kommo.com/reference/incoming-lead-uid (GET lead de entrada por UID)
- https://developers.kommo.com/reference/incoming-leads-form e .md (POST unsorted/forms — metadata, JSON)
- https://developers.kommo.com/reference/incoming-leads-call.md (POST unsorted/sip — metadata de chamada)
- https://developers.kommo.com/reference/accepting-incoming-leads.md (POST .../{uid}/accept — user_id/status_id)
- https://developers.kommo.com/reference/declining-incoming-leads.md (DELETE .../{uid}/decline — user_id)
- https://developers.kommo.com/reference/linking-incoming-leads (POST .../{uid}/link)
- https://developers.kommo.com/docs/lead-capture e https://pt-developers.kommo.com/docs/capta%C3%A7%C3%A3o-de-leads (guia de captação de leads)
- https://pt-developers.kommo.com/docs/limita%C3%A7%C3%B5es (limitações: 7 req/s, 250 entidades, 50 recomendado, 40 campos, 50 funis, 100 estágios/fontes/webhooks, 10 listas)
