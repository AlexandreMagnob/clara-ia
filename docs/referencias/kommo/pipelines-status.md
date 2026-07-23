# Kommo API — Pipelines e Status (Etapas) API

## Visão geral do recurso

Pipelines (funis) representam os fluxos de vendas da conta Kommo. Cada pipeline contém um conjunto ordenado de **status** (também chamados de etapas/estágios), que indicam em que ponto do funil um lead se encontra. Os leads sempre pertencem a um pipeline (`pipeline_id`) e a um status dentro dele (`status_id`).

Pontos centrais do recurso:

- A conta tem **no máximo 50 pipelines**.
- Cada pipeline tem **no máximo 100 status (stages)**, já contando os status de sistema (Closed e Won).
- Todo pipeline possui status de sistema que **não podem ser excluídos** (apenas renomeados / ter a cor alterada):
  - **Leads de entrada / Incoming leads** — `type: 1` (status de triagem/"unsorted"; o ID é gerado por pipeline, ex.: `58141803`). Aparece quando `is_unsorted_on = true`.
  - **Fechado – Ganho / Closed – won** — `id: 142`, `type: 0`.
  - **Fechado – Perdido / Closed – lost** — `id: 143`, `type: 0`.
- Os IDs **142** e **143** são **fixos e idênticos em todos os pipelines** da conta (a resposta de criação de pipeline mostra `142`/`143` sendo adicionados automaticamente a um pipeline recém-criado). Já os status comuns e o status de entrada recebem IDs únicos gerados pela conta.
- Os status de sistema têm `is_editable: false`; os status comuns têm `is_editable: true`.
- Endpoints de criação/edição/exclusão de pipelines e status exigem **usuário administrador**.

Todas as respostas usam o formato HAL (`application/hal+json`); erros usam `application/problem+json`.

---

## Endpoints

Base: `https://{subdominio}.kommo.com`

| Operação | Método | Caminho |
|---|---|---|
| Listar pipelines | `GET` | `/api/v4/leads/pipelines` |
| Obter um pipeline por ID | `GET` | `/api/v4/leads/pipelines/{id}` |
| Criar pipeline(s) | `POST` | `/api/v4/leads/pipelines` |
| Editar um pipeline | `PATCH` | `/api/v4/leads/pipelines/{id}` |
| Excluir um pipeline | `DELETE` | `/api/v4/leads/pipelines/{id}` |
| Listar status de um pipeline | `GET` | `/api/v4/leads/pipelines/{pipeline_id}/statuses` |
| Obter um status por ID | `GET` | `/api/v4/leads/pipelines/{pipeline_id}/statuses/{id}` |
| Criar status em um pipeline | `POST` | `/api/v4/leads/pipelines/{pipeline_id}/statuses` |
| Editar um status | `PATCH` | `/api/v4/leads/pipelines/{pipeline_id}/statuses/{id}` |
| Excluir um status | `DELETE` | `/api/v4/leads/pipelines/{pipeline_id}/statuses/{id}` |

Autenticação em todos: OAuth 2.0 (Bearer com Access Token ou token de longa duração).

---

## Parâmetros de query

A documentação oficial **não lista parâmetros de query** para os endpoints de pipelines/status (não há `with`, filtros ou paginação documentados — diferente de Leads/Contatos). O retorno traz todos os pipelines e, embutidos, todos os seus status.

Os corpos de resposta incluem `_total_items`, mas a doc **não documenta** `_page`, `_page_count` nem links `next/prev` para este recurso — diferentemente de endpoints paginados como `/leads`.

---

## GET — Listar pipelines

`GET /api/v4/leads/pipelines`

Resposta (200):

```json
{
  "_total_items": 2,
  "_links": {
    "self": {
      "href": "https://devteam.kommo.com/api/v4/leads/pipelines"
    }
  },
  "_embedded": {
    "pipelines": [
      {
        "id": 6950551,
        "name": "Pipeline",
        "sort": 1,
        "is_main": true,
        "is_unsorted_on": true,
        "is_archive": false,
        "account_id": 31361463,
        "_links": {
          "self": {
            "href": "https://devteam.kommo.com/api/v4/leads/pipelines/6950551"
          }
        },
        "_embedded": {
          "statuses": [
            {
              "id": 58141803,
              "name": "Incoming leads",
              "sort": 10,
              "is_editable": false,
              "pipeline_id": 6950551,
              "color": "#c1c1c1",
              "type": 1,
              "account_id": 31361463,
              "_links": {
                "self": {
                  "href": "https://devteam.kommo.com/api/v4/leads/pipelines/6950551/statuses/58141803"
                }
              }
            },
            {
              "id": 58141807,
              "name": "Initial contact",
              "sort": 20,
              "is_editable": true,
              "pipeline_id": 6950551,
              "color": "#99ccff",
              "type": 0,
              "account_id": 31361463,
              "_links": {
                "self": {
                  "href": "https://devteam.kommo.com/api/v4/leads/pipelines/6950551/statuses/58141807"
                }
              }
            }
          ]
        }
      }
    ]
  }
}
```

---

## GET — Obter pipeline por ID

`GET /api/v4/leads/pipelines/{id}`

Path: `id` (integer, obrigatório).

**Importante (corrigido):** ao contrário do que se poderia esperar de um endpoint "por ID", o exemplo oficial deste endpoint **reaproveita o mesmo corpo da listagem**: a resposta vem **embrulhada** com `_total_items` e `_embedded.pipelines[]` (o exemplo da doc mostra `_total_items: 2` com dois pipelines, `6950551` e `6954751`), e **não** um único objeto de pipeline na raiz. Ou seja, o formato documentado é idêntico ao de `GET /api/v4/leads/pipelines`, com os status de cada pipeline em `_embedded.statuses`.

> (verificar) O exemplo da doc parece ser o mesmo da listagem (dois pipelines), o que torna ambíguo o comportamento real ao filtrar por um único ID. Trate o resultado lendo `_embedded.pipelines[]` em vez de assumir o objeto na raiz.

Estrutura (igual à listagem):

```json
{
  "_total_items": 2,
  "_links": {
    "self": { "href": "https://devteam.kommo.com/api/v4/leads/pipelines" }
  },
  "_embedded": {
    "pipelines": [
      {
        "id": 6950551,
        "name": "Pipeline",
        "sort": 1,
        "is_main": true,
        "is_unsorted_on": true,
        "is_archive": false,
        "account_id": 31361463,
        "_links": {
          "self": { "href": "https://devteam.kommo.com/api/v4/leads/pipelines/6950551" }
        },
        "_embedded": {
          "statuses": [
            {
              "id": 58141803,
              "name": "Incoming leads",
              "sort": 10,
              "is_editable": false,
              "pipeline_id": 6950551,
              "color": "#c1c1c1",
              "type": 1,
              "account_id": 31361463,
              "_links": {
                "self": { "href": "https://devteam.kommo.com/api/v4/leads/pipelines/6950551/statuses/58141803" }
              }
            }
          ]
        }
      }
    ]
  }
}
```

---

## POST — Criar pipeline(s)

`POST /api/v4/leads/pipelines`

O corpo é um **array** de objetos de pipeline (permite criar mais de um por requisição). Você pode embutir os status iniciais em `_embedded.statuses`. Apenas administradores.

Parâmetros do corpo (por pipeline):

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `name` | string | Sim | Nome do pipeline |
| `sort` | integer | Sim | Posição do pipeline na lista |
| `is_main` | boolean | Sim | Define se o pipeline é o principal da conta |
| `is_unsorted_on` | boolean | Sim | Habilita a etapa "Leads de entrada" (Incoming Leads) |
| `_embedded` | object | Não | Contém os status iniciais (`_embedded.statuses`) |
| `request_id` | string | Não | Eco: volta inalterado na resposta e **não é salvo** |

Corpo da requisição (exemplo oficial):

```json
[
  {
    "name": "Additional pipeline",
    "is_main": false,
    "is_unsorted_on": true,
    "sort": 20,
    "request_id": "123",
    "_embedded": {
      "statuses": [
        {
          "id": 142,
          "name": "Won leads status custom name"
        },
        {
          "name": "Initial contact",
          "sort": 10,
          "color": "#fffeb2"
        }
      ]
    }
  }
]
```

Notas do corpo:
- Para renomear o status de Ganho do novo pipeline, passe o status com `"id": 142` e o `name` desejado (mesma lógica vale para `143`).
- Os status comuns são criados com `name`, `sort` e `color` (sem `id`).
- `request_id` é eco: volta inalterado na resposta e **não é salvo**.

Resposta (200) — note que os status de sistema (entrada, 142, 143) são adicionados automaticamente:

```json
{
  "_total_items": 1,
  "_links": {
    "self": { "href": "https://devteam.kommo.com/api/v4/leads/pipelines" }
  },
  "_embedded": {
    "pipelines": [
      {
        "id": 6964299,
        "name": "Additional pipeline",
        "sort": 20,
        "is_main": false,
        "is_unsorted_on": true,
        "is_archive": false,
        "account_id": 31361463,
        "request_id": "123",
        "_links": {
          "self": { "href": "https://devteam.kommo.com/api/v4/leads/pipelines/6964299" }
        },
        "_embedded": {
          "statuses": [
            {
              "id": 58220123,
              "name": "Incoming leads",
              "sort": 10,
              "is_editable": false,
              "pipeline_id": 6964299,
              "color": "#c1c1c1",
              "type": 1,
              "account_id": 31361463,
              "_links": { "self": { "href": "https://devteam.kommo.com/api/v4/leads/pipelines/6964299/statuses/58220123" } }
            },
            {
              "id": 58220127,
              "name": "Initial contact",
              "sort": 20,
              "is_editable": true,
              "pipeline_id": 6964299,
              "color": "#fffeb2",
              "type": 0,
              "account_id": 31361463,
              "_links": { "self": { "href": "https://devteam.kommo.com/api/v4/leads/pipelines/6964299/statuses/58220127" } }
            },
            {
              "id": 142,
              "name": "Won leads status custom name",
              "sort": 10000,
              "is_editable": false,
              "pipeline_id": 6964299,
              "color": "#CCFF66",
              "type": 0,
              "account_id": 31361463,
              "_links": { "self": { "href": "https://devteam.kommo.com/api/v4/leads/pipelines/6964299/statuses/142" } }
            },
            {
              "id": 143,
              "name": "Closed - lost",
              "sort": 11000,
              "is_editable": false,
              "pipeline_id": 6964299,
              "color": "#D5D8DB",
              "type": 0,
              "account_id": 31361463,
              "_links": { "self": { "href": "https://devteam.kommo.com/api/v4/leads/pipelines/6964299/statuses/143" } }
            }
          ]
        }
      }
    ]
  }
}
```

---

## PATCH — Editar um pipeline

`PATCH /api/v4/leads/pipelines/{id}`

Corpo é um **objeto único** (não array). Apenas administradores.

| Campo | Tipo | Descrição |
|---|---|---|
| `name` | string | Nome do pipeline |
| `sort` | integer | Posição do pipeline na lista |
| `is_main` | boolean | Define se o pipeline é o principal da conta |
| `is_unsorted_on` | boolean | Define se a etapa "Leads de entrada" (Incoming Leads) está habilitada |

Requisição:

```json
{
  "name": "New pipeline name",
  "is_main": false,
  "is_unsorted_on": false,
  "sort": 100
}
```

Resposta (200) — objeto do pipeline na raiz, com `request_id` e status embutidos. O exemplo oficial mostra apenas o status comum em `_embedded.statuses` (sem listar 142/143):

```json
{
  "id": 6964299,
  "name": "New pipeline name",
  "sort": 100,
  "is_main": false,
  "is_unsorted_on": false,
  "is_archive": false,
  "account_id": 31361463,
  "request_id": "0",
  "_links": {
    "self": { "href": "https://devteam.kommo.com/api/v4/leads/pipelines/6964299" }
  },
  "_embedded": {
    "statuses": [
      {
        "id": 58220127,
        "name": "Initial contact",
        "sort": 20,
        "is_editable": true,
        "pipeline_id": 6964299,
        "color": "#fffeb2",
        "type": 0,
        "account_id": 31361463
      }
    ]
  }
}
```

---

## DELETE — Excluir um pipeline

`DELETE /api/v4/leads/pipelines/{id}`

- Apenas administradores.
- Resposta de sucesso: **HTTP 200 com corpo `{}`** (objeto JSON vazio).
- **Não é possível** excluir o último pipeline da conta.
- **Não é possível** excluir um pipeline que ainda tenha leads.

---

## GET — Listar status de um pipeline

`GET /api/v4/leads/pipelines/{pipeline_id}/statuses`

A resposta inclui `_total_items` e os status em `_embedded.statuses[]` (cada status com seu `_links.self`).

Resposta (200):

```json
{
  "_total_items": 7,
  "_embedded": {
    "statuses": [
      { "id": 58141803, "name": "Incoming leads",      "sort": 10,    "is_editable": false, "pipeline_id": 6950551, "color": "#c1c1c1", "type": 1, "account_id": 31361463, "_links": { "self": { "href": "https://devteam.kommo.com/api/v4/leads/pipelines/6950551/statuses/58141803" } } },
      { "id": 58141807, "name": "Initial contact",     "sort": 20,    "is_editable": true,  "pipeline_id": 6950551, "color": "#99ccff", "type": 0, "account_id": 31361463, "_links": { "self": { "href": "https://devteam.kommo.com/api/v4/leads/pipelines/6950551/statuses/58141807" } } },
      { "id": 58141811, "name": "Discussions",         "sort": 30,    "is_editable": true,  "pipeline_id": 6950551, "color": "#ffff99", "type": 0, "account_id": 31361463, "_links": { "self": { "href": "https://devteam.kommo.com/api/v4/leads/pipelines/6950551/statuses/58141811" } } },
      { "id": 58141815, "name": "Decision making",     "sort": 40,    "is_editable": true,  "pipeline_id": 6950551, "color": "#ffcc66", "type": 0, "account_id": 31361463, "_links": { "self": { "href": "https://devteam.kommo.com/api/v4/leads/pipelines/6950551/statuses/58141815" } } },
      { "id": 58141819, "name": "Contract discussion", "sort": 50,    "is_editable": true,  "pipeline_id": 6950551, "color": "#ffcccc", "type": 0, "account_id": 31361463, "_links": { "self": { "href": "https://devteam.kommo.com/api/v4/leads/pipelines/6950551/statuses/58141819" } } },
      { "id": 142,      "name": "Closed - won",        "sort": 10000, "is_editable": false, "pipeline_id": 6950551, "color": "#CCFF66", "type": 0, "account_id": 31361463, "_links": { "self": { "href": "https://devteam.kommo.com/api/v4/leads/pipelines/6950551/statuses/142" } } },
      { "id": 143,      "name": "Closed - lost",       "sort": 11000, "is_editable": false, "pipeline_id": 6950551, "color": "#D5D8DB", "type": 0, "account_id": 31361463, "_links": { "self": { "href": "https://devteam.kommo.com/api/v4/leads/pipelines/6950551/statuses/143" } } }
    ]
  }
}
```

---

## GET — Obter status por ID

`GET /api/v4/leads/pipelines/{pipeline_id}/statuses/{id}`

Path: `pipeline_id` e `id` (integers, obrigatórios). Resposta (200) — **objeto do status na raiz** (diferentemente do "obter pipeline por ID", aqui o retorno é o objeto direto):

```json
{
    "id": 32392156,
    "name": "Incoming Leads",
    "sort": 10,
    "is_editable": false,
    "pipeline_id": 3177727,
    "color": "#c1c1c1",
    "type": 1,
    "account_id": 12345678,
    "_links": {
        "self": { "href": "https://example.kommo.com/api/v4/leads/pipelines/3177727/statuses/32392156" }
    }
}
```

---

## POST — Criar status em um pipeline

`POST /api/v4/leads/pipelines/{pipeline_id}/statuses`

O corpo é um **array** de status. Apenas administradores. Aceita `descriptions` (descrições por nível de usuário).

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `name` | string | Sim | Nome do status |
| `sort` | integer | Sim | Posição do status no pipeline |
| `color` | string | Não | Cor (hex) — ver tabela de cores |
| `descriptions` | array | Não | Objetos `{ "level": "...", "description": "..." }` |
| `descriptions[].level` | string | Não | Valores: `newbie`, `candidate`, `master` |
| `descriptions[].description` | string | Não | Texto da descrição (máx. 1000 caracteres) |
| `request_id` | string | Não | Eco, não salvo |

Requisição:

```json
[
  {
    "name": "New status",
    "sort": 100,
    "color": "#fffeb2",
    "descriptions": [
      { "level": "newbie",    "description": "Status for new" },
      { "level": "candidate", "description": "Status for candidate" },
      { "level": "master",    "description": "Status for master" }
    ]
  },
  {
    "name": "New status 2",
    "sort": 200,
    "color": "#fffeb2"
  }
]
```

Resposta (200):

```json
{
  "_total_items": 2,
  "_embedded": {
    "statuses": [
      {
        "id": 58223475,
        "name": "New status",
        "sort": 60,
        "is_editable": true,
        "pipeline_id": 6950551,
        "color": "#fffeb2",
        "type": 0,
        "account_id": 31361463,
        "request_id": "0",
        "_links": { "self": { "href": "https://devteam.kommo.com/api/v4/leads/pipelines/6950551/statuses/58223475" } }
      },
      {
        "id": 58223479,
        "name": "New status 2",
        "sort": 70,
        "is_editable": true,
        "pipeline_id": 6950551,
        "color": "#fffeb2",
        "type": 0,
        "account_id": 31361463,
        "request_id": "1",
        "_links": { "self": { "href": "https://devteam.kommo.com/api/v4/leads/pipelines/6950551/statuses/58223479" } }
      }
    ]
  }
}
```

> Observação: o `sort` enviado na requisição (100/200) é normalizado pela conta para a sequência efetiva (60/70 na resposta). O valor de `sort` é relativo à ordem dos status, não um índice exato garantido.

---

## PATCH — Editar um status

`PATCH /api/v4/leads/pipelines/{pipeline_id}/statuses/{id}`

Corpo é um **objeto único**. Apenas administradores.

| Campo | Tipo | Descrição |
|---|---|---|
| `name` | string | Nome do status |
| `sort` | integer | Posição no pipeline |
| `color` | string | Cor (hex) |
| `descriptions` | array | Objetos `{ "id", "level", "description" }` |
| `descriptions[].id` | integer | ID da descrição do status |
| `descriptions[].level` | string | Nível do usuário: `newbie`, `candidate`, `master` |
| `descriptions[].description` | string | Texto da descrição |

Requisição:

```json
{
  "name": "New status name",
  "color": "#c1e0ff"
}
```

Resposta (200):

```json
{
  "id": 58221923,
  "name": "New status name",
  "sort": 20,
  "is_editable": true,
  "pipeline_id": 6950551,
  "color": "#c1e0ff",
  "type": 0,
  "account_id": 31361463,
  "request_id": "0",
  "_links": {
    "self": { "href": "https://devteam.kommo.com/api/v4/leads/pipelines/6950551/statuses/58221923" }
  }
}
```

Sobre status de sistema: os status com `is_editable: false` (entrada, 142, 143) só permitem **renomear** (e, conforme os exemplos, alterar a cor); não é possível movê-los/excluí-los. (verificar) A doc não detalha explicitamente quais campos são aceitos ao editar 142/143/entrada além de `name`/`color`.

---

## DELETE — Excluir um status

`DELETE /api/v4/leads/pipelines/{pipeline_id}/statuses/{id}`

- Apenas administradores.
- Resposta de sucesso: **HTTP 204 (No Content)**.
- Ao excluir um status, os leads que estavam nele são **movidos para o primeiro status do pipeline** ("Leads located in the deleted stage will be moved to the first pipeline stage").
- Os status de sistema (entrada/`type: 1`, `142` Ganho e `143` Perdido) têm `is_editable: false` e **não podem ser excluídos**. (verificar) A página de exclusão de status não enumera explicitamente os IDs de sistema, mas eles são marcados como não editáveis em todas as respostas.

---

## Tabela de campos importantes

### Pipeline

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | integer | ID do pipeline |
| `name` | string | Nome do pipeline |
| `sort` | integer | Ordem do pipeline na lista |
| `is_main` | boolean | Indica se é o pipeline principal da conta (só um pode ser principal) |
| `is_unsorted_on` | boolean | Indica se a etapa "Leads de entrada" (Incoming Leads) está habilitada |
| `is_archive` | boolean | Indica se o pipeline está arquivado |
| `account_id` | integer | ID da conta |
| `request_id` | string | Eco da requisição (apenas em POST/PATCH); não persistido |
| `_embedded.statuses` | array | Lista de status do pipeline |
| `_links.self` | object | Link HAL para o próprio recurso |

### Status (etapa)

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | integer | ID do status. **142 = Ganho (Closed - won)**, **143 = Perdido (Closed - lost)** (fixos em todos os pipelines); demais são únicos por conta |
| `name` | string | Nome do status |
| `sort` | integer | Ordem do status no pipeline |
| `is_editable` | boolean | `false` para status de sistema (entrada/142/143); `true` para status comuns |
| `pipeline_id` | integer | Pipeline ao qual o status pertence |
| `color` | string | Cor do status (hex) |
| `type` | integer | `0` = status normal; `1` = status de "Leads de entrada" (triagem/unsorted) |
| `account_id` | integer | ID da conta |
| `descriptions` | array | (opcional) descrições por nível de usuário (`newbie`/`candidate`/`master`) |
| `_links.self` | object | Link HAL para o próprio recurso |

---

## Cores disponíveis para status

Valores hex aceitos no campo `color` (21 valores documentados na página de cores de etapa):

```
#fffeb2  #fffd7f  #fff000
#ffeab2  #ffdc7f  #ffce5a
#ffdbdb  #ffc8c8  #ff8f92
#d6eaff  #c1e0ff  #98cbff
#ebffb1  #deff81  #87f2c0
#f9deff  #f3beff  #ccc8f9
#eb93ff  #f2f3f4  #e6e8ea
```

> Atenção: os exemplos de resposta da própria doc trazem cores que **não estão** nessa paleta documentada (ex.: `#c1c1c1` na etapa de entrada, `#99ccff`, `#ffff99`, `#ffcc66`, `#ffcccc`, `#CCFF66` no 142, `#D5D8DB` no 143). Em criação/edição, prefira usar uma cor da lista oficial para evitar erro de validação. As cores de sistema retornadas podem fugir dessa lista.

---

## Limites e rate limits

- **Pipelines:** máximo **50** por conta.
- **Status por pipeline:** máximo **100**, incluindo os status de sistema (Closed e Won).
- **Rate limit:** não mais que **7 requisições por segundo** por IP. Excesso retorna **429 Too Many Requests**; violações repetidas levam a bloqueio do IP com **403 Forbidden**.
- **Lote em POST/PATCH:** o array segue o limite geral da API — máximo **250** entidades adicionadas/atualizadas por requisição; recomendado **até 50** para estabilidade (lotes grandes podem retornar **504**, indicando reduzir o tamanho).
- Endpoints de criação/edição/exclusão (pipelines e status) exigem **conta administradora**.

---

## Pegadinhas e erros comuns (gotchas)

1. **142/143 são globais.** Não assuma que cada pipeline tem IDs de ganho/perda diferentes — `142` (ganho) e `143` (perda) são iguais em todos os pipelines. Já a etapa "Leads de entrada" tem ID próprio por pipeline.
2. **`GET /pipelines/{id}` retorna o MESMO formato da listagem** (`_total_items` + `_embedded.pipelines[]`), e não um objeto na raiz — o exemplo oficial inclusive reaproveita o corpo da listagem (dois pipelines). Leia sempre por `_embedded.pipelines[]`. Já o "obter status por ID" retorna o objeto do status diretamente na raiz.
3. **POST de pipeline e de status usa array; PATCH usa objeto único.** Trocar a estrutura gera erro 400.
4. **`is_unsorted_on = false` desabilita a etapa de entrada** (type 1). Se sua lógica depende do status de entrada, garanta que ele esteja ligado.
5. **Excluir status move leads para o primeiro status** do pipeline — pode bagunçar relatórios/automações se não for previsto.
6. **Não dá para excluir o último pipeline** nem um pipeline **com leads**; planeje migração de leads antes de `DELETE`.
7. **`sort` é relativo:** o valor enviado é normalizado pela conta (ex.: 100 → 60). Não confie no número exato; confie na ordem relativa.
8. **`request_id` não é salvo** — serve só para correlacionar itens do lote na resposta.
9. **`color` fora da paleta oficial** pode ser rejeitado em criação/edição, mesmo a API retornando cores fora da lista em status de sistema.
10. **DELETE de pipeline retorna 200 com `{}`; DELETE de status retorna 204** (sem corpo). Não trate os dois da mesma forma.
11. **Tudo de escrita exige admin:** POST/PATCH/DELETE com token de usuário comum retornam erro de permissão.

---

## Exemplo de uso (curl)

Listar pipelines:

```bash
curl -X GET "https://meu-subdominio.kommo.com/api/v4/leads/pipelines" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

Criar um pipeline novo com um status comum, renomeando o status de Ganho:

```bash
curl -X POST "https://meu-subdominio.kommo.com/api/v4/leads/pipelines" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '[
        {
          "name": "Funil SDR",
          "is_main": false,
          "is_unsorted_on": true,
          "sort": 20,
          "request_id": "sdr-1",
          "_embedded": {
            "statuses": [
              { "id": 142, "name": "Reunião agendada (ganho)" },
              { "name": "Primeiro contato", "sort": 10, "color": "#fffeb2" }
            ]
          }
        }
      ]'
```

Adicionar um status a um pipeline existente e depois renomeá-lo:

```bash
# criar (POST usa array)
curl -X POST "https://meu-subdominio.kommo.com/api/v4/leads/pipelines/6950551/statuses" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '[{ "name": "Em qualificação", "sort": 30, "color": "#c1e0ff" }]'

# editar (PATCH usa objeto único)
curl -X PATCH "https://meu-subdominio.kommo.com/api/v4/leads/pipelines/6950551/statuses/58223475" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "name": "Qualificado", "color": "#87f2c0" }'
```

---

## Fontes

- https://developers.kommo.com/reference/leads-pipelines-and-stages
- https://developers.kommo.com/reference/pipelines-list.md
- https://developers.kommo.com/reference/get-pipeline-by-id.md
- https://developers.kommo.com/reference/add-pipelines.md
- https://developers.kommo.com/reference/edit-pipeline.md
- https://developers.kommo.com/reference/delete-pipeline.md
- https://developers.kommo.com/reference/stages-list.md
- https://developers.kommo.com/reference/get-stage.md
- https://developers.kommo.com/reference/add-stages.md
- https://developers.kommo.com/reference/edit-stage.md
- https://developers.kommo.com/reference/deleting-stage.md
- https://developers.kommo.com/reference/stage-colors.md
- https://developers.kommo.com/docs/limitations.md
- https://pt-developers.kommo.com/reference/pipelines-e-estágios-de-leads
- https://developers.kommo.com/llms.txt
