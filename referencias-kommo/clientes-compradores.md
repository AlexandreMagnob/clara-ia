# Kommo API — Clientes (Customers) e Compradores / Recorrência

> Referência de API v4 (Kommo, ex-amoCRM). Verificada contra a documentação oficial
> em pt-BR/en (`kommo.com/developers/content/api_v4/...`) e contra a documentação
> equivalente da amoCRM (`amocrm.ru/developers/content/crm_platform/...`), que descreve
> exatamente os mesmos endpoints. Itens não confirmados estão marcados "(não confirmado na doc)".

## Visão geral do recurso

A funcionalidade **Customers (Clientes / "Compradores")** da Kommo serve para gerenciar a base de clientes recorrentes e o relacionamento pós-venda. É um recurso pago (pode exigir plano/tarifa específico) e precisa ser **habilitado** antes de uso via API.

Existem **2 modos de Customers** (mutuamente exclusivos), definidos pelo campo `mode`:

| `mode` | Nome na doc | Significado |
|---|---|---|
| `periodicity` | Recurring purchases (Compradores periódicos / recorrência) | O cliente fica em **1 único status** por vez e se move entre status conforme condições (data/valor da próxima compra). Usa **statuses** (estágios). |
| `segments` | Dynamic segmentation (Segmentação dinâmica) | O cliente pode estar em **vários segmentos** ao mesmo tempo. Cada segmento tem condições de entrada/saída e campos personalizados próprios. Usa **segments**. |

Conceitos relacionados:
- **Customer (cliente):** a entidade central, com métricas como `ltv`, `purchases_count`, `average_check`, `next_date`, `next_price`.
- **Transaction (transação):** uma compra registrada para um customer (`price`, `comment`, `completed_at`, itens de catálogo vinculados).
- **Status / Stage (estágio):** usado no modo `periodicity`.
- **Segment (segmento):** usado no modo `segments`.
- **Bonus points (pontos de bônus):** saldo de fidelidade do customer, manipulável via endpoint próprio.

Base de URL de todas as chamadas: `https://{subdominio}.kommo.com/api/v4/...`
Autenticação: `Authorization: Bearer {access_token}` (OAuth 2.0 / token de longa duração).
Respostas seguem **HAL** (`Content-Type: application/hal+json`) com `_links` e `_embedded`; erros vêm como `application/problem+json`.

> Observação de fonte: a documentação de Customers vive no portal clássico
> (`kommo.com/developers/content/api_v4/customers-api/` e
> `.../customers-stages-and-segments/`). Esses links hoje **redirecionam (301)** para o novo
> portal `developers.kommo.com/reference`, que **ainda não migrou** o recurso (cai
> genericamente em "Leads"). O índice oficial do novo portal (`developers.kommo.com/llms.txt`)
> **não lista** customers/transactions/segments/bonus — confirmando que o recurso só está
> documentado no portal clássico. O conteúdo abaixo foi conferido contra a doc equivalente
> da amoCRM (`amocrm.ru/developers/content/crm_platform/customers-api`), que é idêntica.

---

## Habilitar Customers e trocar o modo

### `PATCH /api/v4/customers/mode`

Habilita/desabilita a funcionalidade Customers e define o modo.

- **Limitação:** disponível **apenas para administradores**.
- **Campos obrigatórios:** `mode` e `is_enabled` (ambos exigidos, inclusive ao desabilitar).

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `mode` | string | Modo: `segments` (segmentação dinâmica) ou `periodicity` (compras recorrentes) |
| `is_enabled` | bool | Define se a funcionalidade Customers está ativada |

**Request:**
```json
{
    "mode": "segments",
    "is_enabled": true
}
```

**Response (200):** retorna as propriedades enviadas.
```json
{
    "mode": "segments",
    "is_enabled": true
}
```

**Códigos HTTP:** `200` alterado com sucesso · `402` tarifa atual não inclui Customers · `401` não autorizado · `400` dados inválidos.

---

## Customers (Clientes)

### `GET /api/v4/customers` — Lista de customers

Retorna a lista de customers da conta (disponível conforme direitos do usuário).

**Parâmetros de query:**

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `with` | string | Valores separados por vírgula (ver tabela abaixo) |
| `page` | int | Página |
| `limit` | int | Quantidade de entidades por requisição (**limite 250**) |
| `query` | string\|int | Busca (pesquisa por valores de campos personalizados e dados do customer) |
| `filter` | object | Filtro (detalhado em artigo separado de filtros) |

**Valores de `with`:** `catalog_elements` (elementos de listas/catálogos vinculados), `contacts` (contatos vinculados), `companies` (empresa vinculada).

**Response (200) — exemplo real:**
```json
{
    "_page": 1,
    "_links": {
        "self": {
            "href": "https://example.kommo.com/api/v4/customers?limit=2&with=contacts&page=1"
        },
        "next": {
            "href": "https://example.kommo.com/api/v4/customers?limit=2&with=contacts&page=2"
        }
    },
    "_embedded": {
        "customers": [
            {
                "id": 1,
                "name": "Customer 1",
                "next_price": 214,
                "next_date": 1589058000,
                "responsible_user_id": 504141,
                "status_id": 4740028,
                "periodicity": 0,
                "created_by": 504141,
                "updated_by": 504141,
                "created_at": 1582117365,
                "updated_at": 1589651187,
                "closest_task_at": null,
                "is_deleted": false,
                "custom_fields_values": null,
                "ltv": 1231454,
                "purchases_count": 11,
                "average_check": 111950,
                "account_id": 28805383,
                "_links": {
                    "self": { "href": "https://example.kommo.com/api/v4/customers/1" }
                },
                "_embedded": {
                    "segments": [
                        { "id": 43, "_links": { "self": { "href": "https://example.kommo.com/api/v4/customers/segments/43" } } },
                        { "id": 45, "_links": { "self": { "href": "https://example.kommo.com/api/v4/customers/segments/45" } } },
                        { "id": 47, "_links": { "self": { "href": "https://example.kommo.com/api/v4/customers/segments/47" } } },
                        { "id": 51, "_links": { "self": { "href": "https://example.kommo.com/api/v4/customers/segments/51" } } }
                    ],
                    "tags": [],
                    "contacts": [
                        { "id": 7143559, "is_main": false, "_links": { "self": { "href": "https://example.kommo.com/api/v4/contacts/7143559" } } },
                        { "id": 9820781, "is_main": true,  "_links": { "self": { "href": "https://example.kommo.com/api/v4/contacts/9820781" } } }
                    ]
                }
            }
        ]
    }
}
```

### `GET /api/v4/customers/{id}` — Customer por ID

Retorna um customer específico. Aceita o mesmo parâmetro `with` (catalog_elements, contacts, companies).

**Códigos HTTP:** `200` ok · `204` customer com esse ID não existe · `401` não autorizado.
(Estrutura de resposta idêntica à de um item da lista — inclui `_embedded.segments`, `_embedded.tags` etc.)

### `POST /api/v4/customers` — Adicionar customers

Adiciona um ou vários customers. Aceita **array** de objetos (ou um único objeto). No modo de compras recorrentes (`periodicity`), `name` e `next_date` são **obrigatórios**.

**Request (cria 2 customers — um com campo de texto/criador robô, outro com tag e segmento):**
```json
[
    {
        "name": "Example customer 1",
        "created_by": 0,
        "custom_fields_values": [
            {
                "field_id": 294479,
                "values": [ { "value": "Text field value" } ]
            }
        ]
    },
    {
        "name": "Example customer 2",
        "_embedded": {
            "tags": [ { "name": "VIP customer" } ],
            "segments": [ { "id": 81 } ]
        }
    }
]
```

**Response (200):**
```json
{
    "_links": { "self": { "href": "https://example.kommo.com/api/v4/customers" } },
    "_embedded": {
        "customers": [
            { "id": 134957, "request_id": "0", "_links": { "self": { "href": "https://example.kommo.com/api/v4/customers/134957" } } },
            { "id": 134959, "request_id": "1", "_links": { "self": { "href": "https://example.kommo.com/api/v4/customers/134959" } } }
        ]
    }
}
```
> `created_by: 0` = criado pelo robô/sistema. `request_id` é devolvido sem alteração e **não é salvo** (útil para casar entradas do array com as respostas).

### `PATCH /api/v4/customers` (lote) ou `PATCH /api/v4/customers/{id}` (único) — Atualizar customers

Atualiza vários (array de objetos) ou um único (objeto). **Nenhum campo é obrigatório** além do `id` (no lote, cada objeto precisa do `id`).

Para tags, a doc oficial documenta **duas formas**:
- `_embedded.tags` — substitui o conjunto de tags pelo enviado (forma usada nos exemplos).
- `tags_to_add` / `tags_to_delete` — arrays para adicionar/remover tags pontualmente sem reescrever o conjunto.

**Request:**
```json
[
    {
        "id": 1299433,
        "name": "New customer title",
        "_embedded": { "tags": [ { "name": "Tag 125" } ] }
    }
]
```

**Response (200):**
```json
{
    "_links": { "self": { "href": "https://example.kommo.com/api/v4/customers" } },
    "_embedded": {
        "customers": [
            { "id": 1299433, "updated_at": 1589556420, "request_id": "0", "_links": { "self": { "href": "https://example.kommo.com/api/v4/customers/1299433" } } }
        ]
    }
}
```

### Campos do modelo Customer

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | int | ID do customer |
| `name` | string | Nome do customer |
| `next_price` | int | Valor esperado da próxima compra |
| `next_date` | int | Data esperada da próxima compra (Unix timestamp) |
| `responsible_user_id` | int | ID do usuário responsável |
| `status_id` | int | ID do status atual (modo recorrência) — presente nas respostas |
| `periodicity` | int | Periodicidade — **obrigatório no modo de compras recorrentes** |
| `created_by` / `updated_by` | int | IDs de quem criou / atualizou por último |
| `created_at` / `updated_at` | int | Datas de criação / atualização (Unix timestamp) |
| `closest_task_at` | int\|null | Data da tarefa aberta mais próxima (Unix timestamp) |
| `is_deleted` | bool | Se o customer foi excluído |
| `custom_fields_values` | array\|null | Valores dos campos personalizados |
| `ltv` | int | Valor total comprado (lifetime value) |
| `purchases_count` | int | Número de compras |
| `average_check` | int | Ticket médio |
| `account_id` | int | ID da conta |
| `request_id` | string | Eco no POST/PATCH; não é salvo |
| `_embedded.segments[]` | array | Segmentos do customer (`[].id`) |
| `_embedded.tags[]` | array | Tags (`[].id`, `[].name`) |
| `_embedded.contacts[]` | array | Contatos vinculados (`[].id`, `[].is_main`) — exige `with=contacts` |
| `_embedded.companies[]` | array | Empresa vinculada (sempre 1 elemento) — exige `with=companies` |
| `_embedded.catalog_elements[]` | array | Elementos de listas vinculados (`id`, `metadata` com `catalog_id`/`quantity`/`price_id`) — exige `with=catalog_elements` |

---

## Bonus points (pontos de fidelidade)

### `POST /api/v4/customers/{id}/bonus_points` — Creditar/debitar pontos de bônus

Adiciona (`earn`) ou resgata (`redeem`) pontos de bônus de um customer. Os dois campos são
**mutuamente exclusivos** — envie apenas um por requisição.

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `earn` | int | Pontos a creditar (não usar junto com `redeem`) |
| `redeem` | int | Pontos a debitar (não usar junto com `earn`) |

**Request (creditar 100 pontos):**
```json
{ "earn": 100 }
```

**Response (200):** retorna o saldo atualizado.
```json
{ "bonus_points": 534 }
```

> Endpoint documentado na doc oficial de Customers (estava ausente do rascunho original).

---

## Transações (Transactions)

As transações representam as compras de um customer.

### `GET /api/v4/customers/transactions` — Lista de transações da conta

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `page` | int | Página |
| `limit` | int | Entidades por requisição (**limite 250**) |
| `filter` | object | Filtro |
| `filter[id]` | int\|array | Filtra por ID(s) de transação |

> Também é possível obter as transações de **um customer específico** via `GET /api/v4/customers/{customer_id}/transactions`.

**Response (200):**
```json
{
    "_page": 1,
    "_links": {
        "self": { "href": "https://example.kommo.com/api/v4/customers/transactions?filter%5Bid%5D%5B0%5D=134643&page=1&limit=50" },
        "next": { "href": "https://example.kommo.com/api/v4/customers/transactions?filter%5Bid%5D%5B0%5D=134643&page=2&limit=50" }
    },
    "_embedded": {
        "transactions": [
            {
                "id": 134643,
                "price": 123,
                "comment": null,
                "completed_at": 1591005900,
                "customer_id": 1000000158,
                "created_by": 939801,
                "updated_by": 939801,
                "created_at": 1591005900,
                "updated_at": 1591005900,
                "is_deleted": false,
                "account_id": 17079858,
                "_links": { "self": { "href": "https://example.kommo.com/api/v4/customers/1000000158/transactions/134643" } },
                "_embedded": {
                    "customer": { "id": 1000000158, "_links": { "self": { "href": "https://example.kommo.com/api/v4/customers/1000000158" } } },
                    "catalog_elements": [
                        { "id": 1677, "metadata": { "catalog_id": 1079, "quantity": 10 } }
                    ]
                }
            }
        ]
    }
}
```

### `GET /api/v4/customers/transactions/{id}` — Transação por ID

Retorna uma transação. Também acessível por `GET /api/v4/customers/{customer_id}/transactions/{id}`.

**Response (200):**
```json
{
    "id": 14755,
    "price": 123124,
    "comment": "Transaction",
    "completed_at": 1589025179,
    "customer_id": 1,
    "created_by": 504141,
    "updated_by": 504141,
    "created_at": 1589025179,
    "updated_at": 1589025179,
    "is_deleted": false,
    "account_id": 28805383,
    "_links": { "self": { "href": "https://example.kommo.com/api/v4/customers/1/transactions/14755" } },
    "_embedded": {
        "customer": { "id": 1, "_links": { "self": { "href": "https://example.kommo.com/api/v4/customers/1" } } }
    }
}
```

### `POST /api/v4/customers/{customer_id}/transactions` — Adicionar transações a um customer

Adiciona uma ou várias transações a um customer. **`price` é obrigatório.** Note que a criação é **por customer** (o `customer_id` vai na URL); não há POST genérico em `/customers/transactions`.

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `comment` | string | Comentário da compra |
| `price` | int | Valor da compra (**obrigatório**) |
| `completed_at` | int | Data de processamento (Unix timestamp) |
| `next_price` | int | Valor esperado da próxima compra |
| `next_date` | int | Data esperada da próxima compra (Unix timestamp) |
| `created_by` | int | ID de quem criou (0 = robô) |
| `_embedded.catalog_elements[]` | array | Itens de catálogo vinculados: `id`, `metadata.catalog_id`, `metadata.quantity` |
| `request_id` | string | Eco; não é salvo |

**Request:**
```json
[
   {
      "price": 123,
      "created_by": 0,
      "comment": "Commentary",
      "_embedded": {
         "catalog_elements": [
            { "id": 1677, "metadata": { "catalog_id": 1079, "quantity": 10 } }
         ]
      }
   }
]
```

**Response (200):** a doc oficial mostra a coleção retornada sob `_embedded.customers` (e **não** `transactions`). Isso é o comportamento documentado — o exemplo oficial devolve `id`/`request_id` exatamente nesse formato:
```json
{
    "_links": { "self": { "href": "https://example.kommo.com/api/v4/customers" } },
    "_embedded": {
        "customers": [
            { "id": 134957, "request_id": "0", "_links": { "self": { "href": "https://example.kommo.com/api/v4/customers/134957" } } },
            { "id": 134959, "request_id": "1", "_links": { "self": { "href": "https://example.kommo.com/api/v4/customers/134959" } } }
        ]
    }
}
```
> A chave `customers` (em vez de `transactions`) é literalmente o que a doc oficial publica para este endpoint. Trate-a como o contrato real, mas, por segurança, no seu código aceite também `transactions` caso a Kommo corrija isso. O `id` retornado é o **id da transação** criada.

### `DELETE /api/v4/customers/transactions/{id}` — Excluir transação

Exclui uma transação. Também acessível por `DELETE /api/v4/customers/{customer_id}/transactions/{id}`.
**Resposta `204`**, sem corpo.

### Campos do modelo Transaction

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | int | ID da transação |
| `comment` | string\|null | Comentário da compra |
| `price` | int | Valor da compra |
| `completed_at` | int | Data em que a transação foi processada (Unix timestamp) |
| `customer_id` | int | ID do customer dono da transação |
| `created_by` / `updated_by` | int | Quem criou / atualizou |
| `created_at` / `updated_at` | int | Datas (Unix timestamp) |
| `is_deleted` | bool | Se foi excluída |
| `account_id` | int | ID da conta |
| `_embedded.customer` | object | Customer dono (`id`) |
| `_embedded.catalog_elements[]` | array | Itens de catálogo: `id`, `metadata.catalog_id`, `metadata.quantity` |

---

## Statuses / Stages (Estágios — modo recorrência/periodicity)

> **Pré-requisito:** estes endpoints exigem o modo **compras recorrentes (`periodicity`) habilitado**. Caso contrário retornam `422`.
> Limites: no modo recorrência, máximo de **30 statuses** (incluindo os de sistema). **Não há** método de API para criar/editar as *condições* de status (apenas nome/sort/cor).

### `GET /api/v4/customers/statuses` — Lista de estágios
Disponível para todos os usuários. `422` se o modo recorrência não estiver ativo.

**Response (200) — trecho:**
```json
{
    "_total_items": 6,
    "_links": { "self": { "href": "https://example.kommo.com/api/v4/customers/statuses" } },
    "_embedded": {
        "statuses": [
            {
                "id": 4740010,
                "name": "Recently purchased",
                "sort": 0,
                "is_default": true,
                "conditions": [],
                "color": "#ccff66",
                "type": 4,
                "account_id": 28805383,
                "_links": { "self": { "href": "https://example.kommo.com/api/v4/customers/statuses/4740010" } }
            },
            {
                "id": 4740025,
                "name": "Expected purchase",
                "sort": 2,
                "is_default": true,
                "conditions": [
                    [ { "type": "before_purchase", "match": { "value": 0 }, "conditions": [ { "value": 0 } ] } ]
                ],
                "color": "#99ccff",
                "type": 3,
                "account_id": 28805383,
                "_links": { "self": { "href": "https://example.kommo.com/api/v4/customers/statuses/4740025" } }
            }
        ]
    }
}
```

### `GET /api/v4/customers/statuses/{id}` — Estágio por ID
Disponível para todos os usuários (`422` se modo recorrência off).

### `POST /api/v4/customers/statuses` — Adicionar estágios
**Somente administrador.** Aceita array. Campos `name` e `sort` obrigatórios; `color` opcional.

**Request:**
```json
[
    { "name": "New stage", "sort": 100, "color": "#fffeb2" },
    { "name": "New stage 2", "sort": 200, "color": "#fffeb2" }
]
```
**Response (200):**
```json
{
    "_total_items": 2,
    "_links": { "self": { "href": "https://example.kommo.com/api/v4/customers/statuses" } },
    "_embedded": {
        "statuses": [
            { "id": 5649280, "request_id": "0", "_links": { "self": { "href": "https://example.kommo.com/api/v4/customers/statuses/5649280" } } },
            { "id": 5649283, "request_id": "1", "_links": { "self": { "href": "https://example.kommo.com/api/v4/customers/statuses/5649283" } } }
        ]
    }
}
```
**Códigos:** `200` ok · `422` dados não processáveis · `403` sem permissão · `401` não autorizado · `400` dados inválidos.

### `PATCH /api/v4/customers/statuses/{id}` — Atualizar estágio
**Somente administrador.** Pelo menos um parâmetro (`name`, `sort`, `color`).
**Request:** `{ "name": "New stage name", "color": "#c1e0ff" }`

### `DELETE /api/v4/customers/statuses/{id}` — Excluir estágio
**Somente administrador.** Estágios de sistema **não** podem ser excluídos. Customers no estágio excluído são movidos para outros estágios conforme as condições. Resposta `204`, sem corpo.

### Campos do modelo Status/Stage

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | int | ID do estágio |
| `name` | string | Nome |
| `sort` | int | Ordenação |
| `is_default` | bool | Se é estágio de sistema |
| `color` | string | Cor (ver lista de cores de estágio) |
| `type` | int | Tipo: `0` regular · `1` compra esperada · `2` não comprou · `3` fechado · `4` comprou recentemente |
| `conditions` | array | Condições de mudança de estágio (somente leitura via API) |
| `account_id` | int | ID da conta |

---

## Segments (Segmentos — modo segmentação dinâmica/segments)

> **Pré-requisito:** exigem o modo **segmentação dinâmica (`segments`) habilitado**, senão retornam `422`.
> Limites: máximo de **100 segmentos**; cada segmento com no máximo **30 campos personalizados**. As *condições* de entrada/saída do segmento **não** são editáveis via API.

### `GET /api/v4/customers/segments` — Lista de segmentos
Disponível para todos os usuários (`422` se modo segmentação off).

**Response (200) — trecho:**
```json
{
    "_total_items": 2,
    "_page": 1,
    "_page_count": 1,
    "_links": { "self": { "href": "https://example.kommo.com/api/v4/customers/segments?page=1&limit=50" } },
    "_embedded": {
        "segments": [
            {
                "id": 51,
                "created_at": 1589615328,
                "updated_at": 1591089010,
                "account_id": 28805383,
                "name": "Segment 1",
                "color": "6610f2",
                "available_products_price_types": [ 288891 ],
                "customers_count": 0,
                "custom_fields_values": [
                    {
                        "values": [ { "value": true } ],
                        "field_id": 269471,
                        "field_name": "Checkbox type field",
                        "field_code": "MYSUPERCHECKBOX",
                        "field_type": "checkbox"
                    },
                    {
                        "values": [ { "value": "Value 1", "enum_id": 381857 } ],
                        "field_id": 269473,
                        "field_name": "Select type field",
                        "field_code": null,
                        "field_type": "select"
                    }
                ],
                "_links": { "self": { "href": "https://example.kommo.com/api/v4/customers/segments/51" } }
            }
        ]
    }
}
```

### `GET /api/v4/customers/segments/{id}` — Segmento por ID
Disponível para todos os usuários.

### `POST /api/v4/customers/segments` — Adicionar segmento
**Somente administrador.** `name` obrigatório.

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `name` | string | Nome do segmento (obrigatório) |
| `available_products_price_types` | array | Preços disponíveis: array de IDs de campos de preço de catálogos |
| `color` | string | Cor (ver lista de cores de segmento) |
| `custom_fields_values` | array\|null | Valores dos campos personalizados do segmento |

**Request:**
```json
{
    "name": "Example segment",
    "color": "ae003f",
    "custom_fields_values": [
        {
            "field_id": 245035,
            "field_name": "Segment description",
            "values": [ { "value": "This is an example segment" } ]
        },
        {
            "field_id": 245351,
            "values": [ { "enum_id": 387477 } ]
        }
    ]
}
```
**Response (200):** retorna o segmento criado (mesma estrutura do GET, com `id`, `created_at`, `custom_fields_values` resolvidos com `field_type` etc.).

### `PATCH /api/v4/customers/segments/{id}` — Atualizar segmento
**Somente administrador.** Pelo menos um parâmetro.
**Request:**
```json
{
    "name": "New segment name",
    "color": "ae003f",
    "custom_fields_values": [
        {
            "field_id": 245035,
            "field_name": "Segment description",
            "values": [ { "value": "New segment description" } ]
        }
    ]
}
```

### `DELETE /api/v4/customers/segments/{id}` — Excluir segmento
**Somente administrador.** Resposta `204`, sem corpo.

### Campos do modelo Segment

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | int | ID do segmento |
| `created_at` / `updated_at` | int | Datas (Unix timestamp) |
| `name` | string | Nome |
| `customers_count` | int | Nº de customers no segmento |
| `color` | string | Cor (código **sem** `#`, ex.: `6610f2`) |
| `custom_fields_values` | array\|null | Valores dos campos personalizados do segmento |
| `available_products_price_types` | array\|null | IDs de campos de preço de catálogos disponíveis para o segmento |
| `account_id` | int | ID da conta |

> **Atenção às cores:** statuses usam cor **com `#`** (ex.: `#fffeb2`); segmentos usam código **sem `#`** (ex.: `6610f2`).

---

## Cores disponíveis

**Estágios (statuses)** — paleta fixa (com `#`):
`#fffeb2 #fffd7f #fff000 #ffeab2 #ffdc7f #ffce5a #ffdbdb #ffc8c8 #ff8f92 #d6eaff #c1e0ff #98cbff #ebffb1 #deff81 #87f2c0 #f9deff #f3beff #ccc8f9 #eb93ff #f2f3f4 #e6e8ea`

**Segmentos** — paleta fixa (sem `#`):
`10599d 2176ff 006acc 07a0c3 247ba0 177e89 046e8f 598381 0c7c59 495f41 00a44b 08605f bf2600 06d6a0 e14945 79b473 ae003f a2ad59 cd0f53 8e936d 832161 2e5339 bf126f 6f7c12 ff5376 dd1c1a bb304e 631d76 9d2b32 4a001f b118c8 6a0f49 6610f2 b38a58 8963ba 4b3666 932f6d 6b2d5c 6461a0 4f517d`

> A lista de cores de segmento da doc oficial é mais longa que a de statuses; os códigos
> acima refletem a paleta publicada. Em caso de dúvida sobre um código específico, valide
> em conta real antes de gravar.

---

## Limites e rate limits

- **Rate limit geral da API:** não mais que **7 requisições por segundo** (vale para Customers também). Exceder retorna **`429`**; violações repetidas levam a **`403`** para todas as requisições do IP.
- **Lote em POST/PATCH:** máximo de **250** entidades por requisição; **recomendado ≤ 50** (acima disso pode dar `504`, exigindo reduzir o lote e repetir).
- **`limit` de paginação:** máximo **250** em listas (customers, transações etc.).
- **Statuses:** máximo **30** por conta (incluindo os de sistema), no modo recorrência.
- **Segments:** máximo **100** por conta; até **30 campos personalizados** por segmento.

---

## Pegadinhas e erros comuns (gotchas)

- **Habilitar antes de usar:** quase tudo depende de `PATCH /customers/mode`. Sem o modo correto ligado, statuses/segments retornam **`422`** ("modo X não habilitado"). Se o plano não cobre Customers, `PATCH /mode` retorna **`402`**.
- **`segments` ↔ `statuses` são exclusivos por modo:** no modo `segments` um customer pode estar em vários segmentos; no modo `periodicity` ele fica em **um** status. Não tente usar segments em conta de recorrência (e vice-versa).
- **POST de transações é por customer:** a criação só existe em `POST /api/v4/customers/{customer_id}/transactions`. Não há POST em `/customers/transactions`. Já o **GET** e o **DELETE** de transação existem tanto no caminho global (`/customers/transactions[/{id}]`) quanto no aninhado (`/customers/{customer_id}/transactions[/{id}]`).
- **Resposta do POST de transações usa `customers`:** na doc oficial, o exemplo de resposta de "Adding transactions to a customer" retorna a coleção sob `_embedded.customers` (com IDs como `134957/134959`) — é o contrato publicado, não erro de cópia. O `id` ali é o da **transação** criada. Por robustez, no integrador trate também a chave `transactions`.
- **`status_id` muda via PATCH do customer:** para mover um customer de status (modo recorrência), envie `status_id` em `PATCH /customers/{id}`. O `status_id` aparece nas respostas de GET, mas a tabela oficial de parâmetros do PATCH não o descreve explicitamente — funciona na prática, **valide em conta real**. *(não 100% confirmado na doc)*
- **`204` significa "vazio":** em `GET /customers/{id}`, `204` quer dizer que o customer não existe (não é sucesso com corpo). Em DELETE, `204` é o sucesso normal (sem corpo).
- **`with` é obrigatório para alguns `_embedded`:** `contacts`, `companies` e `catalog_elements` só vêm se você pedir explicitamente em `with`. `segments` e `tags` vêm por padrão.
- **Empresa é sempre 1:** `_embedded.companies` é sempre um array de no máximo 1 elemento (customer só tem 1 empresa vinculada).
- **Cor com/sem `#`:** statuses com `#`, segments sem. Misturar gera dado inconsistente/erro.
- **Condições são read-only:** não há API para criar/editar `conditions` de status nem condições de entrada/saída de segmentos — só pela interface.
- **`created_by: 0` = robô:** envie `0` para registrar criação pelo sistema/bot.
- **`request_id` não é persistido:** use-o apenas para correlacionar itens do array de envio com os da resposta.
- **Tags: dois jeitos no PATCH:** `_embedded.tags` substitui o conjunto; `tags_to_add`/`tags_to_delete` ajustam pontualmente.
- **`bonus_points`: `earn` e `redeem` são exclusivos:** envie só um por requisição em `POST /customers/{id}/bonus_points`.
- **Valores monetários são inteiros:** `price`, `next_price`, `ltv`, `average_check` são `int` (a doc não documenta casas decimais — confirme a unidade/centavos no seu ambiente). *(não confirmado na doc)*
- **Datas em Unix timestamp:** `next_date`, `completed_at`, `created_at`, etc. são segundos Unix.

---

## Exemplos de uso (curl)

Habilitar o modo de compradores periódicos (recorrência):
```bash
curl -X PATCH "https://meusub.kommo.com/api/v4/customers/mode" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"mode":"periodicity","is_enabled":true}'
```

Listar customers com contatos vinculados, 50 por página:
```bash
curl -X GET "https://meusub.kommo.com/api/v4/customers?with=contacts&limit=50&page=1" \
  -H "Authorization: Bearer $TOKEN"
```

Criar um customer (modo recorrência exige `name` + `next_date`):
```bash
curl -X POST "https://meusub.kommo.com/api/v4/customers" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '[{"name":"Casa Gourmet","next_date":1593561600,"next_price":2990,"periodicity":30}]'
```

Registrar uma compra (transação) para o customer 1000000158:
```bash
curl -X POST "https://meusub.kommo.com/api/v4/customers/1000000158/transactions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '[{"price":2990,"comment":"Renovação plano mensal","completed_at":1593561600,"created_by":0}]'
```

Creditar pontos de bônus a um customer:
```bash
curl -X POST "https://meusub.kommo.com/api/v4/customers/1000000158/bonus_points" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"earn":100}'
```

Listar segmentos (modo segmentação dinâmica):
```bash
curl -X GET "https://meusub.kommo.com/api/v4/customers/segments?page=1&limit=50" \
  -H "Authorization: Bearer $TOKEN"
```

Excluir uma transação:
```bash
curl -X DELETE "https://meusub.kommo.com/api/v4/customers/transactions/14755" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Fontes

- Customers API (lista/get/add/update, mode, transações, bonus_points): https://www.kommo.com/developers/content/api_v4/customers-api/ — hoje redireciona (301) para o novo portal; conteúdo confirmado na doc equivalente da amoCRM: https://www.amocrm.ru/developers/content/crm_platform/customers-api
- Customers stages & segments (statuses, segments, cores, limites, tipos de status): https://www.kommo.com/developers/content/api_v4/customers-stages-and-segments/ — também redireciona; confirmado na doc da amoCRM (mesmo endpoint set).
- Limitations (rate limit 7 req/s, erro 429, IP-block 403, lote 250/recomendado 50, paginação 250): https://developers.kommo.com/docs/limitations
- HTTP status codes: https://developers.kommo.com/docs/http-codes
- Índice da API do novo portal (confirma que Customers/transactions/segments/bonus NÃO estão migrados): https://developers.kommo.com/llms.txt
- About Kommo API / referência geral: https://developers.kommo.com/reference/kommo-api-reference

> Nota: o portal PT (`pt-developers.kommo.com`) e o novo portal EN (`developers.kommo.com/reference`)
> não têm página dedicada de Customers no momento da pesquisa (os links clássicos redirecionam para
> "Leads"). A referência fiel está na doc clássica (arquivada) e na doc idêntica da amoCRM, citadas acima.
> Itens marcados "(não confirmado na doc)" devem ser validados em conta real.
