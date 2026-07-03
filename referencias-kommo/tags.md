# Kommo API — Tags API

> Referência verificada contra a documentação oficial da Kommo (developers.kommo.com).
> Última verificação: 2026-06-29.

## Visão geral do recurso

As **tags** (marcadores) são rótulos reutilizáveis usados para classificar entidades na Kommo. O dicionário de tags é **dividido por tipo de entidade** — a mesma palavra como tag de lead e como tag de contato são objetos distintos, com `id` diferentes. (Doc oficial: *"The tags directory is divided by the entity type. A tag will have a different ID for different entities."*)

Os tipos de entidade que suportam tags via API v4 são (doc: *"Tags functionality is available for the following entities: leads, contacts, and companies"*):

- `leads` (negócios)
- `contacts` (contatos)
- `companies` (empresas)

A API de Tags cobre dois grupos de operações:

1. **Gestão do dicionário de tags** da conta — listar (`GET`) e criar (`POST`) tags por tipo de entidade, no endpoint `/api/v4/{entity_type}/tags`.
2. **Vínculo de tags a entidades** — anexar/remover tags de uma ou várias entidades via o bloco `_embedded.tags`, usando os endpoints de edição da própria entidade (`PATCH /api/v4/{entity_type}` ou `PATCH /api/v4/{entity_type}/{id}`).

Ao vincular tags a entidades você pode referenciar a tag por `id` (já existente) **ou** por `name` (se o nome não existir, a tag é criada automaticamente). Tags podem ter **cor** (`color`) — a paleta fixa documentada é para **leads** (ver seção de cores).

> A documentação só lista `leads`, `contacts` e `companies` como `entity_type` válidos para os endpoints de tags. Suporte a `customers`/listas/catálogos **não é confirmado** na referência de Tags.

---

## Endpoints

| Operação | Método | Caminho |
|---|---|---|
| Listar tags de um tipo de entidade | `GET` | `https://{subdominio}.kommo.com/api/v4/{entity_type}/tags` |
| Criar tags para um tipo de entidade | `POST` | `https://{subdominio}.kommo.com/api/v4/{entity_type}/tags` |
| Vincular tags a **várias** entidades | `PATCH` | `https://{subdominio}.kommo.com/api/v4/{entity_type}` |
| Vincular tags a **uma** entidade | `PATCH` | `https://{subdominio}.kommo.com/api/v4/{entity_type}/{id}` |

Onde `{entity_type}` ∈ `leads | contacts | companies` e `{subdominio}` é o subdomínio da conta.
Autenticação: OAuth 2.0 — header `Authorization: Bearer {access_token}`.

---

## 1) Listar tags — `GET /api/v4/{entity_type}/tags`

Retorna a lista de tags daquele tipo de entidade na conta. Sujeito aos direitos de acesso do usuário.

**Parâmetros de query**

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `page` | integer | Número da página (paginação) |
| `limit` | integer | Itens retornados por requisição. **Máximo 250** |
| `query` | string | Busca full-text pelo nome da tag |
| `filter[id][]` | array<int> | Filtra por ID(s) de tag — aceita múltiplos |
| `filter[name]` | string | Filtra pelo nome **exato** da tag — apenas um nome |

**Exemplo de requisição**

```
GET https://example.kommo.com/api/v4/leads/tags?filter[id][]=2707&filter[id][]=2709&page=1&limit=50
```

**Resposta 200 (exemplo)** — `Content-Type: application/hal+json`

```json
{
    "_page": 1,
    "_links": {
        "self": {
            "href": "https://example.kommo.com/api/v4/leads/tags?filter[id][]=2707&filter[id][]=2709&page=1&limit=50"
        },
        "next": {
            "href": "https://example.kommo.com/api/v4/leads/tags?filter[id][]=2707&filter[id][]=2709&page=2&limit=50"
        }
    },
    "_embedded": {
        "tags": [
            { "id": 2707, "name": "Site request" },
            { "id": 2709, "name": "Tech support" }
        ]
    }
}
```

**Códigos de resposta**
- `200` — sucesso com dados
- `204` — nenhum dado encontrado (conta sem tags daquele tipo / filtro sem retorno)
- `401` — usuário não autorizado

---

## 2) Criar tags — `POST /api/v4/{entity_type}/tags`

Adiciona uma ou mais tags ao dicionário do tipo de entidade. O corpo é um **array de objetos**.

**Corpo da requisição (campos)**

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `name` | string | Sim | Nome da tag |
| `color` | string | Não | Cor da tag (hex da paleta — ver seção de cores). Padrão: `null` |
| `request_id` | string | Não | *"Field that will be returned unchanged in the response and will not be saved."* Eco para correlacionar cada item criado |

**Exemplo de requisição**

```json
[
  { "name": "Tag 1" },
  { "name": "Tag 2", "request_id": "my_request_id" },
  { "name": "Tag 3" }
]
```

**Resposta 200 (exemplo)** — `Content-Type: application/hal+json`

```json
{
  "_total_items": 3,
  "_embedded": {
    "tags": [
      { "id": 263807, "name": "Tag 1", "request_id": "0" },
      { "id": 263809, "name": "Tag 2", "request_id": "my_request_id" },
      { "id": 263811, "name": "Tag 3", "request_id": "2" }
    ]
  }
}
```

> Quando nenhum `request_id` é informado, a API devolve o **índice do item** (`"0"`, `"1"`, `"2"`, …) nesse campo.

**Comportamento importante (confirmado na doc)**: se o `name` enviado **já existir**, a API **não cria duplicata** — *"If the passed tag name already exists, this tag's ID will be returned in the response."* Ou seja, `POST` aqui é idempotente por nome (funciona como "garantir que a tag existe").

**Códigos de resposta**
- `200` — tags criadas/retornadas com sucesso
- `400` — dados inválidos (*"Invalid data given. Details are available in the request response"*)
- `401` — usuário não autorizado

---

## 3) Vincular tags a entidades

O vínculo é feito pelos endpoints de **edição da entidade** (não pelo endpoint `/tags`), dentro do bloco `_embedded.tags`. Cada item do array aceita **`id`** (tag existente) **ou** **`name`** (cria a tag se não existir). A doc nota: *"Either 'id' or 'name' parameter is required."*

| Campo | Tipo | Descrição |
|---|---|---|
| `_embedded.tags` | array \| null | Lista de tags a vincular. `null` remove **todas** as tags |
| `_embedded.tags[].id` | integer | ID da tag existente |
| `_embedded.tags[].name` | string | Nome da tag (cria se não existir) |

### 3a) Várias entidades — `PATCH /api/v4/{entity_type}`

Corpo = array de entidades. Cada entidade traz seu `id` e o `_embedded.tags`.

**Requisição**

```json
[
    {
        "id": 167353,
        "_embedded": {
            "tags": [ { "id": 263807 } ]
        }
    },
    {
        "id": 167355,
        "_embedded": {
            "tags": null
        }
    }
]
```

**Resposta 200** (a doc retorna todas as entidades atualizadas no `_embedded`)

```json
{
    "_links": {
        "self": { "href": "https://example.kommo.com/api/v4/leads" }
    },
    "_embedded": {
        "leads": [
            {
                "id": 167353,
                "updated_at": 1588928155,
                "_links": { "self": { "href": "https://example.kommo.com/api/v4/leads/167353" } }
            },
            {
                "id": 167355,
                "updated_at": 1588928155,
                "_links": { "self": { "href": "https://example.kommo.com/api/v4/leads/167355" } }
            }
        ]
    }
}
```

### 3b) Uma entidade — `PATCH /api/v4/{entity_type}/{id}`

Corpo = objeto único da entidade.

**Requisição** (o exemplo oficial mostra `id` e `name` juntos no mesmo objeto de tag; basta um dos dois)

```json
{
    "_embedded": {
        "tags": [
            { "id": 263807, "name": "Tag 2" }
        ]
    }
}
```

A resposta tem a mesma forma do caso 3a (`_embedded.{entity}` com `id`, `updated_at`, `_links`).

**Códigos de resposta (3a/3b)**
- `200` — entidade(s) atualizada(s)
- `400` — dados inválidos
- `401` — usuário não autorizado

---

## Cores das tags

Cor é informada no campo `color` como **código hexadecimal sem `#`** (string), restrita à paleta fixa documentada. A doc publica a paleta sob o título *"Available tag colors for leads"* — ou seja, é documentada explicitamente para **leads**; não há paleta listada para `contacts`/`companies`.

```
EBEBEB  D0D0D0  F2DDF7  D1A4DC  FF8F92  FFC8C8
C7DB8C  DDEBB5  8699DA  AABDFF  FFCE5A  FFE193
90CDB0  C6F4DE  A9A5D7  D8D5FF  86C0FC  832161
6A0F49  0C7C59  10599D  9D2B32  247BA0
```

A cor da tag passou a ser **retornada nos dados de leads** (campo `color` no objeto da tag na resposta de listagem de leads) — conforme o changelog da API.

---

## Recurso prático: criar lead já com tag

Ao criar (`POST /api/v4/leads`) ou editar lead, você pode embutir a tag direto. O corpo do `POST /api/v4/leads` é um **array** (mesmo para um único lead):

```json
[
  {
    "name": "Example lead 1",
    "_embedded": {
      "tags": [ { "name": "NewTag" } ]
    }
  }
]
```

A tag `NewTag` é criada (se não existir) e vinculada ao lead na mesma chamada. **Resposta** (forma típica):

```json
{
  "_links": { "self": { "href": "https://subdomain.kommo.com/api/v4/leads" } },
  "_embedded": {
    "leads": [
      {
        "id": 20681816,
        "updated_at": 1710511525,
        "_links": { "self": { "href": "https://subdomain.kommo.com/api/v4/leads/20681816" } }
      }
    ]
  }
}
```

> Lembrete do recipe oficial: ao **editar** um lead via `_embedded.tags`, *"if you don't include all the tags of the lead, they will be deleted"* — preserve as tags existentes ao adicionar novas (ou use `tags_to_add`/`tags_to_delete`).

---

## `tags_to_add` / `tags_to_delete` (criação/edição de leads, contatos e empresas)

A Kommo adicionou, na criação e edição de **lead/contato/empresa** via API, as chaves **`tags_to_add`** e **`tags_to_delete`** (alternativa ao `_embedded.tags`). Texto do changelog: *"Added `tags_to_add` and `tags_to_delete` keys to lead/contact/company creation and editing via API."*

- `tags_to_add` — tags a **adicionar** (preservando as já existentes), por `id` ou `name`.
- `tags_to_delete` — tags a **remover**, sem precisar reenviar todas as demais.

Servem justamente para **evitar colisões quando várias integrações editam a mesma entidade simultaneamente** (changelog: *"These keys can be useful for avoiding collisions when multiple integrations can simultaneously change an entity."*) — você só descreve o delta, não substitui a lista inteira.

> O formato exato do payload dessas chaves consta nas páginas de criação/edição de cada entidade ("add/edit leads, contacts, companies"). Não está detalhado na referência específica de Tags.

---

## Tabela de campos importantes

| Campo | Tipo | Onde aparece | Observação |
|---|---|---|---|
| `id` | integer | objeto tag | Único **por tipo de entidade** |
| `name` | string | objeto tag | Nome; pode ser usado para criar tag no vínculo |
| `color` | string \| null | objeto tag | Hex sem `#`, da paleta fixa (leads); retornado em leads |
| `request_id` | string | resposta do `POST /tags` | Eco do enviado; se ausente, vem o índice do item. Não é salvo |
| `_embedded.tags` | array \| null | corpo do `PATCH` da entidade | `null` apaga todas as tags da entidade |
| `_total_items` | integer | resposta do `POST /tags` | Total de itens retornados |
| `_page` | integer | resposta do `GET` | Página atual |
| `_links` | object | resposta | Links HAL (`self`, `next`, …) |

---

## Limites e rate limits (confirmados na página de Limitations)

- **Paginação**: `limit` máximo de **250** por requisição no `GET .../tags`.
- **Lotes de criação/edição**: até **250 entidades por requisição** nos endpoints de `PATCH`/`POST` em massa (a Kommo **recomenda 50**). Se receber `504`, reduza o tamanho do lote e tente de novo.
- **Rate limit geral da API v4**: **não mais que 7 requisições por segundo** (por IP). Exceder retorna **HTTP 429 Too Many Requests** (com `retry_after`, ex.: `300`). **Violações repetidas** bloqueiam o IP e retornam **HTTP 403 Forbidden** em qualquer requisição.
- **Outros limites de conta** (contexto): máx. 40 valores de campo personalizado por entidade; máx. 100 sources/webhooks/pipelines por conta; máx. 100 estágios por pipeline; máx. 10 listas por conta.

---

## Pegadinhas e erros comuns (gotchas)

1. **`_embedded.tags` substitui TODAS as tags** da entidade. Toda tag já vinculada que **não** for reenviada será **desvinculada** (doc: *"If already attached tags are not passed, they will be detached from the entity."*). Para apenas adicionar sem perder as demais: leia as tags atuais e reenvie-as por `id`, **ou** use `tags_to_add`/`tags_to_delete`.
2. **`null` em `_embedded.tags` apaga todas as tags** da entidade (não é "ignorar").
3. **ID de tag é por tipo de entidade.** Um `id` de tag de `leads` não vale para `contacts`/`companies`.
4. **`POST /tags` é idempotente por nome**: enviar um `name` já existente devolve o ID da tag existente, não cria duplicata — bom para "garantir tag existe", mas não conte com erro de duplicidade.
5. **`request_id` não é salvo** — é só eco para correlacionar itens de um lote; não confunda com o `id` da tag.
6. **Corpo do `POST /tags` é um array**, mesmo para uma única tag. (O mesmo vale para `POST /api/v4/leads`.)
7. **`204` no `GET`** significa "sem tags / filtro sem retorno" — trate como vazio, não como erro.
8. **Cor documentada para leads**: a paleta oficial é listada apenas para leads; envie hex **sem `#`** e dentro da paleta.
9. **Colisão entre integrações**: dois sistemas usando `_embedded.tags` simultaneamente sobrescrevem um ao outro. Prefira `tags_to_add`/`tags_to_delete` em ambientes com múltiplas integrações.
10. **Rate limit por IP**: estoure 7 req/s e leva `429`; insista e o IP é **bloqueado com 403**. Respeite `retry_after`.

---

## Exemplos de uso (curl)

**Listar tags de leads (busca full-text):**

```bash
curl -X GET "https://example.kommo.com/api/v4/leads/tags?query=urgente&limit=50" \
  -H "Authorization: Bearer {access_token}" \
  -H "Accept: application/json"
```

**Criar duas tags de contatos:**

```bash
curl -X POST "https://example.kommo.com/api/v4/contacts/tags" \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '[{"name":"VIP","color":"FFCE5A"},{"name":"Inadimplente","request_id":"r1"}]'
```

**Vincular tag a um lead específico (substitui as tags atuais):**

```bash
curl -X PATCH "https://example.kommo.com/api/v4/leads/167353" \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '{"_embedded":{"tags":[{"id":263807},{"name":"Reagendado"}]}}'
```

**Remover todas as tags de um lead:**

```bash
curl -X PATCH "https://example.kommo.com/api/v4/leads/167353" \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '{"_embedded":{"tags":null}}'
```

---

## Fontes

- https://developers.kommo.com/reference/tags
- https://developers.kommo.com/reference/tags.md
- https://developers.kommo.com/reference/list-of-entity-tags.md
- https://developers.kommo.com/reference/add-tags.md
- https://developers.kommo.com/reference/tag-colors.md
- https://developers.kommo.com/reference/update-tags.md
- https://developers.kommo.com/reference/update-tags-single-entity.md
- https://developers.kommo.com/recipes/lead-with-tag.md
- https://developers.kommo.com/changelog/updates-in-api-documentation
- https://developers.kommo.com/docs/limitations
- https://developers.kommo.com/llms.txt
