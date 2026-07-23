# Kommo API — Conceitos Gerais da API (paginação, filtros, embedded, status)

> Referência revisada e conferida contra a documentação oficial da Kommo (developers.kommo.com).
> O caso canônico detalhado é **Leads** (recurso mais bem documentado). Onde algo varia por
> recurso ou não foi confirmado na doc, está marcado como **(verificar)**.

## Visão geral do recurso

A API da Kommo (v4) é uma API REST que retorna respostas no formato **JSON HAL** (Hypermedia Application Language). Toda coleção paginada traz metadados de paginação no nível raiz (`_page`, `_links`, e — em vários recursos — `_total_items` e `_page_count`), os dados em `_embedded`, e links de navegação em `_links`. As entidades aninhadas (tags, contatos, empresas etc.) também vêm dentro de `_embedded`, e cada entidade traz seu próprio `_links.self`.

- **Base URL:** `https://{subdominio}.kommo.com/api/v4/`
  - `{subdominio}` é o nome da sua conta (ex.: `minhaempresa.kommo.com`).
- **Autenticação:** header `Authorization: Bearer {access_token}` (OAuth 2.0 / token de integração de longa duração).
- **Content-Type:** `application/json` (para corpo de requisição em POST/PATCH).

---

## Endpoints (padrão de coleção)

Os conceitos gerais valem para os endpoints de coleção das entidades principais. Exemplo canônico — **Leads list**:

```
GET https://{subdominio}.kommo.com/api/v4/leads
```

O mesmo padrão de paginação/filtro/`with`/HAL se aplica a outros recursos de coleção, por exemplo:

- `GET https://{subdominio}.kommo.com/api/v4/contacts`
- `GET https://{subdominio}.kommo.com/api/v4/companies`
- `GET https://{subdominio}.kommo.com/api/v4/leads/{id}` (entidade única; sem paginação de coleção)

> Os parâmetros e o conjunto de valores de `with`/`filter` variam por recurso. Confirmado: o
> `with` de **Contacts**, por exemplo, aceita apenas `leads` e `catalog_elements` — conjunto
> diferente do de **Leads**. Esta referência detalha o caso de **Leads** e marca como
> **(verificar)** o que não está confirmado para outros recursos.

---

## Parâmetros de query

### Paginação

| Parâmetro | Tipo | Descrição | Limite |
|---|---|---|---|
| `page` | integer | Página da lista (inicia em 1) | — |
| `limit` | string/integer | Número de entidades retornadas por requisição | **máximo 250** |

- A doc do endpoint de Leads declara textualmente "`limit – 250`" (máximo). O valor **padrão** quando `limit` é omitido **não é declarado explicitamente** na doc — sempre passe `limit` para previsibilidade.
- A iteração recomendada é **seguir o link `_links.next.href`** da resposta até ele deixar de existir (ou até receber **204 No Content**), em vez de incrementar `page` manualmente.

Exemplo:
```
GET /api/v4/leads?page=2&limit=50
```

### Busca textual

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `query` | string | Busca nos campos preenchidos da entidade (em Contacts, busca também por valores de campos personalizados) |

```
GET /api/v4/leads?query=pizzaria
```

### Filtros (`filter[...]`)

Os filtros usam a sintaxe `filter[campo]`. Filtros que aceitam múltiplos valores usam notação de array `filter[campo][]`; filtros de intervalo de data usam `[from]`/`[to]` em **Unix Timestamp** (segundos).

Filtros documentados para **Leads**:

| Filtro | Tipo | Observação |
|---|---|---|
| `filter[id][]` | array de integers | Filtra por IDs de leads |
| `filter[name][]` | array de strings | Filtra por nome |
| `filter[price]` | integer | Valor do lead |
| `filter[created_by][]` | array de integers | Criado por (usuário) |
| `filter[updated_by][]` | array de integers | Atualizado por (usuário) |
| `filter[responsible_user_id][]` | array de integers | Responsável |
| `filter[created_at][from]` / `filter[created_at][to]` | Unix Timestamp | Intervalo de criação |
| `filter[updated_at][from]` / `filter[updated_at][to]` | Unix Timestamp | Intervalo de atualização |
| `filter[closed_at][from]` / `filter[closed_at][to]` | Unix Timestamp | Intervalo de fechamento |
| `filter[closest_task_at][from]` / `filter[closest_task_at][to]` | Unix Timestamp | Próxima tarefa |
| `filter[pipeline_id][]` | array de integers | Filtra por funil(is) |
| `filter[statuses][0][pipeline_id]` + `filter[statuses][0][status_id]` | integers | Filtra por estágio; **os dois devem ser usados juntos**, indexados (`[0]`, `[1]`, …). A doc observa: "you can filter only one stage in one pipeline". |

Exemplos:
```
GET /api/v4/leads?filter[id][]=20024930&filter[id][]=20024931
GET /api/v4/leads?filter[created_at][from]=1760000000&filter[created_at][to]=1760999999
GET /api/v4/leads?filter[statuses][0][pipeline_id]=12215168&filter[statuses][0][status_id]=94386187
```

> Filtro por valores de campos personalizados (`filter[custom_fields_values]...`) **não está
> documentado** nos endpoints de listagem de Leads nem de Contacts conferidos. Em Contacts, a
> busca por valores de campos personalizados é feita via o parâmetro `query` — **(verificar)** se
> há suporte a `filter[custom_fields_values]` para algum recurso específico.

### Ordenação (`order[...]`)

Para Leads, os campos ordenáveis são `created_at`, `updated_at` e `id`, cada um aceitando `asc` ou `desc`:

| Parâmetro | Valores |
|---|---|
| `order[created_at]` | `asc` \| `desc` |
| `order[updated_at]` | `asc` \| `desc` |
| `order[id]` | `asc` \| `desc` |

```
GET /api/v4/leads?order[updated_at]=desc
```

### `with` (dados embutidos / embedded)

O parâmetro `with` aceita uma **string com vários valores separados por vírgula** e adiciona dados relacionados em `_embedded`. Valores documentados para **Leads**:

- `contacts`
- `only_deleted` (retorna apenas leads deletados restauráveis)
- `loss_reason`
- `is_price_modified_by_robot`
- `catalog_elements`
- `source_id`
- `source`

```
GET /api/v4/leads?with=contacts,loss_reason,catalog_elements
```

> O conjunto de valores de `with` é específico de cada recurso. Confirmado: **Contacts** aceita
> apenas `leads` e `catalog_elements`. Verifique os valores válidos por endpoint.

---

## Corpo da requisição (exemplo)

Endpoints de listagem (`GET`) **não usam corpo** — tudo vai na query string. O corpo JSON aparece em criação/atualização. Exemplo de criação em lote (`POST /api/v4/leads`), ilustrando que escrita também é em **array** (lote):

```json
[
  {
    "name": "Lead via API",
    "price": 5000,
    "pipeline_id": 12215168,
    "status_id": 94386187,
    "responsible_user_id": 11087123,
    "custom_fields_values": [
      {
        "field_id": 1928052,
        "values": [
          { "enum_id": 1669868 }
        ]
      }
    ]
  }
]
```

---

## Resposta (exemplo JSON real — HAL)

Resposta de `GET /api/v4/leads` (estrutura de coleção HAL com `_page`, `_links`, `_embedded`), fiel ao exemplo da doc oficial:

```json
{
  "_page": 1,
  "_links": {
    "self": {
      "href": "https://subdomain.kommo.com/api/v4/leads?page=1&limit=250"
    }
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
        "custom_fields_values": [],
        "score": null,
        "account_id": 35379952,
        "labor_cost": null,
        "is_price_computed": false,
        "_links": {
          "self": {
            "href": "https://subdomain.kommo.com/api/v4/leads/20024930"
          }
        },
        "_embedded": {
          "tags": [],
          "companies": []
        }
      }
    ]
  }
}
```

> No exemplo oficial, `custom_fields_values` vem como `[]` (lead sem campos preenchidos) e o
> `_links.self.href` da entidade individual **não** carrega `?page=...&limit=...` (é
> `.../api/v4/leads/20024930`). Quando há campos preenchidos, cada item de
> `custom_fields_values` tem a forma:
>
> ```json
> {
>   "field_id": 1928052,
>   "field_name": "Specialty",
>   "field_code": null,
>   "field_type": "select",
>   "values": [
>     { "value": "Diagnostic", "enum_id": 1669868, "enum_code": null }
>   ]
> }
> ```

Quando há mais páginas, o objeto `_links` no nível raiz inclui também `next` (e, em vários recursos, `_total_items`, `_page_count` e `last`). Exemplo do bloco de paginação completo (confirmado em recursos como `custom_fields`):

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
    "custom_fields": [ /* ... */ ]
  }
}
```

> Nem todo recurso retorna `_total_items`/`_page_count`/`last`. **O exemplo oficial do endpoint
> de Leads list não os exibe**; eles aparecem confirmados, por exemplo, no endpoint de
> `custom_fields`. A presença de `_links.next` é o sinal confiável de "há próxima página".
> Quando não há mais resultados, a API responde **204 No Content** (corpo vazio).

---

## Tabela de campos importantes da resposta (HAL)

| Campo (raiz) | Tipo | Descrição |
|---|---|---|
| `_page` | integer | Número da página atual |
| `_page_count` | integer | Total de páginas (quando presente) |
| `_total_items` | integer | Total de itens da coleção (quando presente) |
| `_links` | object | Links HAL de navegação |
| `_links.self.href` | string (URL) | URL da requisição atual |
| `_links.next.href` | string (URL) | URL da próxima página (só existe se houver) |
| `_links.last.href` | string (URL) | URL da última página (quando presente) |
| `_embedded` | object | Contêiner dos dados; ex.: `_embedded.leads` (array) |

Campos relevantes por entidade (ex.: lead): `id`, `name`, `price`, `status_id`, `pipeline_id`, `responsible_user_id`, `created_at`/`updated_at`/`closed_at` (Unix Timestamp), `is_deleted` (bool), `custom_fields_values` (array), e o `_embedded` interno (ex.: `tags`, `companies`, `contacts` quando solicitados via `with`).

---

## Limites / Rate limits

| Limite | Valor |
|---|---|
| Requisições por segundo (por **IP**) | **não mais que 7 req/s** |
| Excedeu o limite | retorna **HTTP 429 Too Many Requests** |
| Violações repetidas | IP **bloqueado** → requisições passam a retornar **HTTP 403** |
| Máx. entidades retornadas por requisição (leads/contacts/companies) | **250** |
| Máx. entidades adicionadas/atualizadas por requisição | **250** |
| Lote recomendado (add/update) | **≤ 50** |
| Recebeu **HTTP 504** | reduzir o número de entidades adicionadas/atualizadas (lote grande demais) |
| Máx. de `custom_fields_values` em adição complexa de lead | **40** |
| Funis por conta | 50 |
| Estágios por funil | ≤ 100 |
| Webhooks por conta | 100 |
| Listas por conta | 10 |
| Fontes (sources) por integração | 100 |
| Fontes do Kommo AI | 100 (contas pagas) / 10 (trial) |
| Armazenamento de arquivos | 10 GB em conta trial |

> O valor de `retry_after` no 429 (ex.: 300 s) apareceu em material de terceiros, mas **não foi
> confirmado** na doc oficial de Limitations — **(verificar)**.

---

## Códigos de status HTTP

| Código | Significado |
|---|---|
| **200 OK** | Requisição bem-sucedida |
| **201 Created** | A requisição resultou na criação de uma entidade |
| **204 No Content** | Sucesso, sem conteúdo no recurso (ex.: fim da paginação / nenhum resultado) |
| **400 Bad Request** | Servidor não processou a requisição por erro considerado do cliente |
| **401 Unauthorized** | Faltam credenciais de autenticação válidas |
| **402 Payment Required** | Período pago/trial da conta Kommo encerrado; é preciso renovar |
| **403 Forbidden** | Requisição entendida, mas recusada (inclui IP bloqueado por abuso) |
| **404 Not Found** | Recurso não encontrado |
| **405 Method Not Allowed** | O recurso-alvo não suporta esse método HTTP |
| **422 Unprocessable Entity** | Content-type e sintaxe corretos, mas não foi possível processar as instruções |
| **429 Too Many Requests** | Excesso de requisições em um intervalo de tempo |
| **500 Internal Server Error** | Condição inesperada no servidor |

> **504** não consta na página oficial de "HTTP status codes", mas é citado na página de
> **Limitations** como possível resposta a lotes grandes demais (reduzir o nº de entidades).
> HTTP **202** e **502** **não constam** na documentação oficial da Kommo.

---

## Pegadinhas e erros comuns (gotchas)

1. **Pagine por `_links.next`, não por `page++`.** Itere seguindo `_links.next.href`; pare quando ele sumir ou ao receber **204**.
2. **204 não é erro.** Ao final da paginação (ou sem resultados de filtro), a API retorna **204 No Content** com corpo vazio — trate como "acabou", não como falha.
3. **`limit` máximo é 250.** Pedir mais não retorna mais; padronize seu loop em ≤ 250.
4. **7 req/s por IP, não por token.** Estourar gera **429**; reincidência gera **bloqueio do IP** com **403** em tudo. Implemente backoff.
5. **Datas em Unix Timestamp (segundos).** Filtros `[from]`/`[to]` e campos `created_at`/`updated_at` usam epoch em segundos (não milissegundos, não ISO-8601).
6. **`filter[statuses]` exige par.** Filtro por estágio só funciona informando `pipeline_id` **e** `status_id` juntos, com índice (`[0]`, `[1]`...). A doc avisa: só dá pra filtrar um estágio por funil.
7. **`with` é específico do recurso.** Um valor válido em Leads pode não existir em Contacts/Companies (Contacts só aceita `leads` e `catalog_elements`). Use só os valores documentados do recurso.
8. **`_embedded` aparece em dois níveis.** Há o `_embedded` da coleção (ex.: `_embedded.leads`) e um `_embedded` dentro de cada entidade (ex.: `tags`, `companies`, `contacts`). Não confunda ao parsear.
9. **Escrita também é em lote (array).** POST/PATCH de leads recebem um **array** de objetos; recomenda-se ≤ 50 por requisição (lotes grandes podem gerar **504**).
10. **`_total_items`/`_page_count` nem sempre vêm.** O exemplo de Leads list não os exibe; não dependa deles para todos os recursos. O sinal universal de continuação é `_links.next`.
11. **`_links.self` da entidade não carrega query de paginação.** No exemplo oficial, o `self.href` do lead individual é `.../api/v4/leads/{id}` (sem `?page=&limit=`).

---

## Exemplo de uso (curl)

Listar leads do funil 12215168, com contatos embutidos, 50 por página, ordenados por atualização:

```bash
curl --request GET \
  --url 'https://minhaempresa.kommo.com/api/v4/leads?with=contacts&filter[pipeline_id][]=12215168&order[updated_at]=desc&page=1&limit=50' \
  --header 'Authorization: Bearer SEU_ACCESS_TOKEN' \
  --header 'Content-Type: application/json'
```

Cenário de iteração (pseudo-fluxo de paginação correto):
1. `GET /api/v4/leads?limit=250&page=1`
2. Processe `_embedded.leads`.
3. Se existir `_links.next.href`, faça `GET` nessa URL; repita.
4. Pare quando `_links.next` não existir **ou** a resposta for **204 No Content**.
5. Respeite ≤ 7 req/s (adicione backoff em caso de **429**).

---

## Fontes

- https://developers.kommo.com/reference/leads-list.md — Leads list (método, parâmetros, `with`, filtros, ordenação, exemplo de resposta JSON HAL; `limit – 250`; `self.href` da entidade sem query de paginação)
- https://developers.kommo.com/reference/contacts-list.md — Contacts list (confirma que `with` varia por recurso: só `leads` e `catalog_elements`; `query` busca em campos personalizados; `filter[custom_fields_values]` não documentado)
- https://developers.kommo.com/docs/limitations.md — Limitations (7 req/s por IP, 429/403, máx. 250, lote ≤ 50, 504 em lotes grandes, 40 custom fields, funis/estágios/webhooks/listas/fontes/Kommo AI/storage)
- https://developers.kommo.com/docs/http-codes.md — HTTP status codes (200/201/204/400/401/402/403/404/405/422/429/500; 202/502/504 ausentes)
- https://www.kommo.com/developers/content/api_v4/custom-fields/ — bloco de paginação `_total_items` / `_page_count` / `_links.next` / `_links.last` (recurso `custom_fields`)
- https://www.kommo.com/developers/content/api_v4/lists/ — confirmação do padrão de coleção
- https://developers.kommo.com/llms.txt — Índice de documentação (URLs canônicas .md)
