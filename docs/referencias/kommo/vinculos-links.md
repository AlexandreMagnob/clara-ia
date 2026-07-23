# Kommo API — Vínculos entre Entidades (Links) API

## Visão geral

A API de **Links** (Vínculos entre entidades) permite consultar, criar e remover vínculos
entre as entidades principais do CRM. Segundo a doc, esta seção descreve "todos os métodos
disponíveis para trabalhar com vínculos entre entidades (leads, contatos e empresas)".

Matriz de quais entidades podem ser vinculadas a quais (conforme a doc oficial):

| Entidade de origem | Pode vincular a |
|---|---|
| **Lead** (`leads`) | contatos, empresas, elementos de lista/catálogo |
| **Contato** (`contacts`) | empresas, elementos de lista/catálogo |
| **Empresa** (`companies`) | contatos, leads, elementos de lista/catálogo |

Observações importantes:
- A entidade de **origem** (`{entity}` na URL) só pode ser `leads`, `contacts` ou
  `companies`. Não há endpoint de links sob `customers` nesta seção da doc — clientes
  (`customers`) têm API própria.
- A entidade de **destino** (`to_entity_type`) pode ser `leads`, `contacts`, `companies` ou
  `catalog_elements` (elementos de lista/catálogo).
- Todos os corpos de requisição (link/unlink) são **arrays de objetos** — permitem
  vincular/desvincular vários itens numa só chamada.

---

## Endpoints

Padrão de URL: `https://{subdominio}.kommo.com/api/v4/...`

| Ação | Método | Caminho |
|---|---|---|
| Listar vínculos de uma entidade | `GET` | `/api/v4/{entity}/{entity_id}/links` |
| Vincular entidades | `POST` | `/api/v4/{entity}/{entity_id}/link` |
| Desvincular entidades | `POST` | `/api/v4/{entity}/{entity_id}/unlink` |

Parâmetros de caminho (comuns aos três):

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `entity` | string (enum) | Sim | Tipo da entidade de origem: `leads`, `contacts` ou `companies` |
| `entity_id` | integer (int32) | Sim | ID numérico da entidade de origem |

> Nota: A documentação **não** descreve uma variante em massa do tipo
> `POST /api/v4/leads/link` (sem `entity_id` na URL) para esta API de links. O escopo da
> entidade de origem é sempre definido pela URL (`{entity}/{entity_id}`).

---

## 1) GET — Listar vínculos

`GET https://{subdominio}.kommo.com/api/v4/{entity}/{entity_id}/links`

Este método permite obter uma lista de entidades vinculadas a um lead, contato ou empresa
pelo ID da entidade de origem.

### Cabeçalhos

| Cabeçalho | Valor | Descrição |
|---|---|---|
| `accept` | `application/json` (padrão) ou `text/plain` | Tipo de conteúdo preferido na resposta |

### Parâmetros de query

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `filter[to_entity_id]` | integer (int32) | Filtra pelo ID da entidade vinculada. **Deve** ser usado em conjunto com `filter[to_entity_type]`. |
| `filter[to_entity_type]` | string | Filtra pelo tipo da entidade vinculada. **Deve** ser usado em conjunto com `filter[to_entity_id]`. |
| `filter[to_catalog_id]` | integer (int32) | Filtra pelo ID da lista/catálogo da entidade vinculada. |
| `page` | integer | Número da página (paginação). |
| `limit` | integer | Quantidade de itens por página (paginação). |

> Paginação via `page`/`limit` é suportada — confirmada pela própria doc, cujo exemplo de
> resposta traz `...links?page=1&limit=50` no campo `_links.self.href`.

### Exemplo de resposta (200)

```json
{
    "_total_items": 4,
    "_links": {
        "self": {
            "href": "https://example.kommo.com/api/v4/leads/7593303/links?page=1&limit=50"
        }
    },
    "_embedded": {
        "links": [
            {
                "to_entity_id": 597393,
                "to_entity_type": "catalog_elements",
                "metadata": {
                    "quantity": 1,
                    "catalog_id": 4521
                }
            },
            {
                "to_entity_id": 11069775,
                "to_entity_type": "contacts",
                "metadata": {
                    "main_contact": true
                }
            },
            {
                "to_entity_id": 11271233,
                "to_entity_type": "contacts",
                "metadata": {
                    "main_contact": false
                }
            },
            {
                "to_entity_id": 11271229,
                "to_entity_type": "companies",
                "metadata": null
            }
        ]
    }
}
```

### Campos da resposta

| Campo | Tipo | Descrição |
|---|---|---|
| `_total_items` | integer | Total de entidades vinculadas |
| `_links.self.href` | string | URL da requisição atual (inclui `page`/`limit`) |
| `_embedded.links` | array | Coleção de vínculos |
| `_embedded.links[].to_entity_id` | integer | ID da entidade vinculada |
| `_embedded.links[].to_entity_type` | string | Tipo: `leads`, `contacts`, `companies`, `catalog_elements` |
| `_embedded.links[].metadata` | object \| null | Dados adicionais do vínculo (varia por tipo; pode ser `null`) |
| `metadata.quantity` | integer | Quantidade (para `catalog_elements`) |
| `metadata.catalog_id` | integer | ID da lista/catálogo (para `catalog_elements`) |
| `metadata.main_contact` | boolean | Indica se o contato é o **principal** da entidade (presente em vínculos com `contacts`) |

### Códigos HTTP

| Código | Significado |
|---|---|
| `200` | Sucesso |
| `400` | Dados inválidos enviados — detalhes no corpo da resposta |
| `401` | Usuário não autorizado |

---

## 2) POST — Vincular entidades

`POST https://{subdominio}.kommo.com/api/v4/{entity}/{entity_id}/link`

Este método permite vincular entidades a um lead, contato ou empresa. O corpo é um
**array de objetos**. Header: `Content-Type: application/json`.

### Exemplo de corpo da requisição

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

### Campos do corpo

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `to_entity_id` | integer | Sim | ID da entidade a ser vinculada |
| `to_entity_type` | string (enum) | Sim | Tipo da entidade: `leads`, `contacts`, `companies`, `catalog_elements` |
| `metadata` | object | Não | Metadados opcionais do vínculo |
| `metadata.catalog_id` | integer | Não | ID da lista/catálogo (relevante/necessário ao vincular `catalog_elements`) |
| `metadata.quantity` | integer | Não | Quantidade de elementos da lista vinculados |
| `metadata.is_main` | boolean | Não | Define se o contato é o **principal** da entidade |
| `metadata.updated_by` | integer | Não | ID do usuário que está realizando o vínculo |

> **Atenção à assimetria de nomes:** no **request** o campo é `metadata.is_main`; na
> **resposta do GET** o mesmo conceito aparece como `metadata.main_contact`. Confirmado pela
> doc: a tabela de request usa `is_main`; a tabela/resposta de leitura usa `main_contact`.
> `metadata.main_contact` aparece na tabela de parâmetros de resposta, mas **não** no schema
> do request.

### Exemplo de resposta (200)

```json
{
    "_total_items": 2,
    "_links": {
        "self": {
            "href": "https://example.kommo.com/api/v4/leads/XXXXXXX/links"
        }
    },
    "_embedded": {
        "links": [
            {
                "entity_id": "XXXXXXX",
                "entity_type": "leads",
                "to_entity_id": 10,
                "to_entity_type": "catalog_elements",
                "metadata": {
                    "quantity": 1,
                    "catalog_id": "XXXX"
                }
            },
            {
                "entity_id": "XXXXXXX",
                "entity_type": "leads",
                "to_entity_id": "XXXXX",
                "to_entity_type": "contacts",
                "metadata": {
                    "main_contact": true
                }
            }
        ]
    }
}
```

Na resposta de vínculo, cada item ecoa também `entity_id` e `entity_type` (a entidade de
origem), além do `to_entity_id`/`to_entity_type` e `metadata`.

### Códigos HTTP

| Código | Significado |
|---|---|
| `200` | Vinculado com sucesso |
| `400` | Dados inválidos enviados |
| `401` | Usuário não autorizado |
| `403` | Direitos insuficientes para chamar o método |

---

## 3) POST — Desvincular entidades

`POST https://{subdominio}.kommo.com/api/v4/{entity}/{entity_id}/unlink`

Este método permite desvincular entidades de um lead, contato ou empresa. O corpo é um
**array de objetos**. Header: `Content-Type: application/json`.

### Exemplo de corpo da requisição

```json
[
  {
    "to_entity_id": 10,
    "to_entity_type": "catalog_elements",
    "metadata": {
      "catalog_id": 1234,
      "updated_by": 9302235
    }
  }
]
```

### Campos do corpo

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `to_entity_id` | integer | Sim | ID da entidade a ser desvinculada |
| `to_entity_type` | string (enum) | Sim | `leads`, `contacts`, `companies`, `catalog_elements` |
| `metadata` | object | Não | Metadados opcionais |
| `metadata.catalog_id` | integer | Não | ID da lista/catálogo (necessário ao desvincular `catalog_elements`) |
| `metadata.updated_by` | integer | Não | ID do usuário que está realizando a operação |

### Resposta

- **204 No Content** em caso de sucesso ("Entities unlinked successfully"). Corpo vazio
  (`{}`).

### Códigos HTTP

| Código | Significado |
|---|---|
| `204` | Desvinculado com sucesso (sem conteúdo) |
| `400` | Dados inválidos enviados |
| `401` | Usuário não autorizado |
| `403` | Direitos insuficientes para chamar o método |

---

## Tabela consolidada de campos importantes

| Campo | Tipo | Onde aparece | Significado |
|---|---|---|---|
| `entity` / `entity_id` | enum / int | URL | Entidade de origem (`leads`/`contacts`/`companies`) |
| `to_entity_id` | int | request + response | ID da entidade de destino |
| `to_entity_type` | enum | request + response | `leads`/`contacts`/`companies`/`catalog_elements` |
| `metadata.quantity` | int | catalog_elements | Quantidade do item de catálogo no vínculo |
| `metadata.catalog_id` | int | catalog_elements | Lista/catálogo do elemento vinculado |
| `metadata.is_main` | bool | **request** (link) | Marca contato como principal |
| `metadata.main_contact` | bool | **response** (GET / link) | Indica que o contato é principal |
| `metadata.updated_by` | int | request | Usuário que executa a ação |
| `entity_id` / `entity_type` | string/enum | response (link) | Eco da entidade de origem |

> `metadata.price_id` **não** consta na documentação desta seção (não documentado para links).

---

## Limites e rate limits

(Conforme a página oficial de *Limitations*, aplicáveis a toda a API v4, incluindo links.)

- **Máximo de 7 requisições por segundo.** Ao exceder, retorna **HTTP 429**.
- Em caso de violações repetidas, o **IP é bloqueado** e a API passa a retornar **HTTP 403**
  para todas as chamadas subsequentes.
- **Máximo de 250 entidades** retornadas por consulta de listagem (leads/contatos/empresas).
- **Máximo de 250 entidades** adicionadas/atualizadas por requisição — a doc **recomenda
  limitar a no máximo 50 por requisição** para melhor desempenho e para evitar erros 504.
  (Aplica-se por analogia ao array de link/unlink: prefira lotes pequenos.)

### Códigos HTTP (consolidado)

| Código | Significado |
|---|---|
| `200` | Sucesso (link / list) |
| `204` | Sucesso sem conteúdo (unlink) |
| `400` | Dados inválidos enviados — detalhes no corpo da resposta |
| `401` | Usuário não autorizado |
| `403` | Direitos insuficientes para chamar o método (ou IP bloqueado por abuso de rate limit) |
| `429` | Limite de requisições por segundo excedido |

---

## Pegadinhas e erros comuns (gotchas)

- **`is_main` (escrita) ≠ `main_contact` (leitura).** Ao vincular um contato como principal,
  envie `metadata.is_main: true`; ao ler de volta via GET, o campo virá como
  `metadata.main_contact: true`. Não assuma simetria de nomes.
- **Corpo é sempre array.** Mesmo para um único vínculo, envie `[ { ... } ]`, não um objeto
  solto.
- **`catalog_id` é necessário com `catalog_elements`.** Vincular/desvincular elementos de
  lista sem `metadata.catalog_id` tende a falhar com 400.
- **Filtros de query são acoplados.** `filter[to_entity_id]` e `filter[to_entity_type]`
  devem ser passados **juntos**; um sem o outro não filtra corretamente.
- **`metadata` pode vir `null`.** No GET, vínculos sem metadados (ex.: `companies`) retornam
  `metadata: null` — trate esse caso na leitura.
- **Escopo da origem vem da URL.** Não há endpoint em massa que aceite múltiplas origens
  diferentes numa só chamada; a origem é fixada por `{entity}/{entity_id}`.
- **`customers` não está nesta seção.** A entidade de origem só pode ser
  `leads`/`contacts`/`companies`. Para clientes (`customers`), confira a API específica.
- **Respeite o rate limit.** Ao processar muitos vínculos em loop, mantenha-se abaixo de
  7 req/s e lote os arrays (≤50) para evitar 429, 504 e bloqueio por 403.

---

## Exemplo de uso (curl)

Vincular um contato (como principal) e um produto de catálogo a um lead `7593303`:

```bash
curl -X POST 'https://{subdominio}.kommo.com/api/v4/leads/7593303/link' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '[
    {
      "to_entity_id": 11069775,
      "to_entity_type": "contacts",
      "metadata": { "is_main": true }
    },
    {
      "to_entity_id": 597393,
      "to_entity_type": "catalog_elements",
      "metadata": { "quantity": 2, "catalog_id": 4521 }
    }
  ]'
```

Listar os vínculos do mesmo lead, filtrando só pelos elementos de um catálogo:

```bash
curl -X GET 'https://{subdominio}.kommo.com/api/v4/leads/7593303/links?filter[to_catalog_id]=4521' \
  -H 'Authorization: Bearer {access_token}'
```

Desvincular o produto:

```bash
curl -X POST 'https://{subdominio}.kommo.com/api/v4/leads/7593303/unlink' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '[
    {
      "to_entity_id": 597393,
      "to_entity_type": "catalog_elements",
      "metadata": { "catalog_id": 4521 }
    }
  ]'
```

---

## Fontes

- https://developers.kommo.com/reference/link-entities.md — Visão geral da seção "Links between entities" (matriz de entidades vinculáveis: Lead→contatos/empresas/listas; Contato→empresas/listas; Empresa→contatos/leads/listas)
- https://developers.kommo.com/reference/linked-entities.md — GET listar vínculos (filtros, paginação `page`/`limit`, resposta JSON completa, campos, códigos 200/400/401)
- https://developers.kommo.com/reference/linking-entities.md — POST link (corpo em array, campos `is_main`/`updated_by`, resposta com eco de `entity_id`/`entity_type`, códigos 200/400/401/403)
- https://developers.kommo.com/reference/unlinking-entities.md — POST unlink (corpo em array, campos `catalog_id`/`updated_by`, resposta 204, códigos 204/400/401/403)
- https://developers.kommo.com/docs/limitations.md — Rate limits (7 req/s, 429; 403 por bloqueio de IP) e limites de lote (250 máx., recomendado 50; 504 em lotes grandes)
- https://developers.kommo.com/reference/linked-entities — página interativa de referência (Linked entities list)
- https://developers.kommo.com/reference/linking-entities — página interativa de referência (Link entities)
