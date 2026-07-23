# Kommo API — Tarefas (Tasks) API

## Visão geral

O recurso **Tasks** (Tarefas) representa atividades agendadas (ligações, reuniões, follow-ups etc.) que normalmente ficam vinculadas a uma entidade do CRM (lead, contato ou empresa) e a um usuário responsável. Cada tarefa tem um **tipo** (`task_type_id`), um **prazo** (`complete_till`, em Unix timestamp), um texto descritivo e um estado de conclusão (`is_completed`). Ao concluir uma tarefa, pode-se registrar um **resultado** (`result.text`).

Todos os endpoints usam a base `https://{subdominio}.kommo.com/api/v4/tasks`, autenticação **OAuth 2.0** (header `Authorization: Bearer <access_token>`) e respondem em **`application/hal+json`** (HAL: estrutura com `_links` e `_embedded`).

Operações disponíveis (são apenas estas quatro — a API v4 de tarefas **não tem** GET de tarefa única nem DELETE):

| Operação | Método | Caminho |
|---|---|---|
| Listar tarefas | `GET` | `/api/v4/tasks` |
| Adicionar tarefas (lote) | `POST` | `/api/v4/tasks` |
| Editar tarefas (lote) | `PATCH` | `/api/v4/tasks` |
| Editar uma única tarefa | `PATCH` | `/api/v4/tasks/{id}` |

> Observação: **não há** um endpoint documentado de "obter uma única tarefa" (`GET /api/v4/tasks/{id}`). Para buscar uma tarefa específica, use a listagem com `filter[id][]`.

---

## 1) Listar tarefas — `GET /api/v4/tasks`

Retorna um array de objetos de tarefa com metadados de paginação. Autenticação: OAuth2.

### Parâmetros de query

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `page` | int32 | Número da página (paginação) |
| `limit` | int32 | Quantidade de entidades por página. **Máx. 250** |
| `filter[id][]` | array int32 | Filtra por ID(s) de tarefa |
| `filter[responsible_user_id][]` | array int32 | Filtra por usuário(s) responsável(eis) |
| `filter[is_completed]` | int32 | Estado da tarefa: `1` = concluída, `0` = em aberto |
| `filter[task_type][]` | array int32 | Filtra por tipo(s) de tarefa (`task_type_id`) |
| `filter[entity_type]` | string | Tipo da entidade vinculada: `leads`, `contacts` ou `companies` |
| `filter[entity_id][]` | array int32 | Filtra por ID(s) da entidade vinculada (exige `filter[entity_type]`) |
| `filter[updated_at]` | int32 | Data da última edição (Unix timestamp) |
| `filter[updated_at][from]` / `filter[updated_at][to]` | int32 | Intervalo de datas de edição (Unix timestamp) |
| `order[complete_till]` | string | Ordena por prazo: `asc` ou `desc` |
| `order[created_at]` | string | Ordena por criação: `asc` ou `desc` |
| `order[id]` | string | Ordena por ID: `asc` ou `desc` |

Exemplo de URL (da doc oficial):
`GET https://example.kommo.com/api/v4/tasks?filter[task_type]=2&filter[is_completed]=1&limit=2`

### Exemplo de resposta (200)

```json
{
  "_page": 1,
  "_links": {
    "self": {
      "href": "https://example.kommo.com/api/v4/tasks?filter[task_type]=2&filter[is_completed]=1&limit=2&page=1"
    },
    "next": {
      "href": "https://example.kommo.com/api/v4/tasks?filter[task_type]=2&filter[is_completed]=1&limit=2&page=2"
    }
  },
  "_embedded": {
    "tasks": [
      {
        "id": 7087,
        "created_by": 3987910,
        "updated_by": 3987910,
        "created_at": 1575364000,
        "updated_at": 1575364851,
        "responsible_user_id": 123123,
        "group_id": 0,
        "entity_id": 167353,
        "entity_type": "leads",
        "duration": 0,
        "is_completed": true,
        "task_type_id": 2,
        "text": "Send an invitation",
        "result": [],
        "complete_till": 1575665940,
        "account_id": 321321,
        "_links": {
          "self": { "href": "https://example.kommo.com/api/v4/tasks/7087" }
        }
      }
    ]
  }
}
```

> Quando não há próxima página, o link `next` não é retornado. Se a busca não retornar resultados, a API responde **204 No Content** (sem corpo) — comportamento documentado da v4 para listagens vazias.

---

## 2) Adicionar tarefas — `POST /api/v4/tasks`

Permite adicionar **múltiplas tarefas** de uma vez. O corpo é **sempre um array de objetos**, mesmo para uma única tarefa. Sujeito a restrições de direitos do usuário. Sucesso retorna `application/hal+json`; erro retorna `application/problem+json`.

### Corpo da requisição (exemplo oficial)

```json
[
  {
    "task_type_id": 1,
    "text": "Meeting with the client",
    "complete_till": 1588885140,
    "entity_id": 9785993,
    "entity_type": "leads",
    "request_id": "example"
  }
]
```

### Campos do corpo

Apenas **dois campos são obrigatórios** segundo a doc oficial: `text` e `complete_till`. Todo o resto é opcional.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `text` | string | **Sim** | Descrição da tarefa |
| `complete_till` | int | **Sim** | Prazo da tarefa em **Unix timestamp** |
| `task_type_id` | int | Não | Tipo da tarefa |
| `entity_id` | int | Não | ID da entidade vinculada |
| `entity_type` | string | Não | Tipo da entidade: `leads`, `contacts`, `companies` |
| `responsible_user_id` | int | Não | Usuário responsável; por padrão, o usuário atual |
| `is_completed` | bool | Não | Define se a tarefa está concluída |
| `duration` | int | Não | Duração da tarefa em segundos |
| `result` | object | Não | Resultado da tarefa (objeto com propriedade `text`) |
| `created_by` | int | Não | ID do usuário que criou a tarefa |
| `updated_by` | int | Não | ID do usuário que editou a tarefa por último |
| `created_at` | int | Não | Data de criação (Unix timestamp) |
| `updated_at` | int | Não | Data de edição (Unix timestamp) |
| `request_id` | string | Não | Retornado inalterado na resposta; **não é salvo** (útil para correlacionar itens em lote) |

### Exemplo de resposta (200)

```json
{
  "_links": {
    "self": { "href": "https://example.kommo.com/api/v4/tasks" }
  },
  "_embedded": {
    "tasks": [
      {
        "id": 4745251,
        "request_id": "example",
        "_links": {
          "self": { "href": "https://example.kommo.com/api/v4/tasks/4745251" }
        }
      }
    ]
  }
}
```

A resposta de criação devolve apenas `id`, `request_id` e `_links` por item. Se `request_id` não for enviado, a Kommo preenche com o índice do item no array (`"0"`, `"1"`, ...).

---

## 3) Editar tarefas em lote — `PATCH /api/v4/tasks`

Permite editar **múltiplas tarefas**. Corpo é um array de objetos, cada um com o `id` obrigatório.

### Corpo da requisição (exemplo oficial)

```json
[
  {
    "id": 4745251,
    "task_type_id": 2,
    "text": "New task description",
    "complete_till": 1588885140
  },
  {
    "id": 4747929,
    "task_type_id": 1,
    "text": "New task description 2",
    "complete_till": 1588885140
  }
]
```

### Exemplo de resposta (200)

```json
{
  "_links": {
    "self": { "href": "https://example.kommo.com/api/v4/tasks" }
  },
  "_embedded": {
    "tasks": [
      {
        "id": 4745251,
        "updated_at": 1588760725,
        "request_id": "0",
        "_links": {
          "self": { "href": "https://example.kommo.com/api/v4/tasks/4745251" }
        }
      },
      {
        "id": 4747929,
        "updated_at": 1588760725,
        "request_id": "1",
        "_links": {
          "self": { "href": "https://example.kommo.com/api/v4/tasks/4747929" }
        }
      }
    ]
  }
}
```

Na edição, a resposta devolve apenas `id`, `updated_at`, `request_id` e `_links`. Para **concluir** tarefas neste lote, inclua `is_completed` e `result` em cada item.

---

## 4) Editar uma única tarefa — `PATCH /api/v4/tasks/{id}`

Mesmo comportamento do lote, porém o ID vai na URL e o corpo é **um único objeto** (não um array).

### Concluir uma tarefa (registrar resultado) — exemplo oficial

Para marcar como concluída, envie `is_completed: true` junto com `result.text`:

```json
{
  "is_completed": true,
  "result": {
    "text": "Reached the client"
  }
}
```

### Outro exemplo de corpo (editar campos)

```json
{
  "task_type_id": 2,
  "text": "New task description",
  "complete_till": 1588885140
}
```

### Exemplo de resposta (200)

```json
{
  "_links": {
    "self": { "href": "https://example.kommo.com/api/v4/tasks" }
  },
  "_embedded": {
    "tasks": [
      {
        "id": 4745251,
        "updated_at": 1588760725,
        "request_id": "0",
        "_links": {
          "self": { "href": "https://example.kommo.com/api/v4/tasks/4745251" }
        }
      }
    ]
  }
}
```

`Content-Type`: `application/hal+json` em sucesso; `application/problem+json` em erro.

---

## Tabela de campos da entidade Task (resposta de listagem)

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | int | ID da tarefa |
| `created_by` | int | Usuário que criou a tarefa |
| `updated_by` | int | Usuário que editou por último |
| `created_at` | int | Criação (Unix timestamp) |
| `updated_at` | int | Última edição (Unix timestamp) |
| `responsible_user_id` | int | Usuário responsável |
| `group_id` | int | Grupo do usuário responsável (`0` se nenhum) |
| `entity_id` | int | ID da entidade vinculada |
| `entity_type` | string | `leads`, `contacts` ou `companies` |
| `duration` | int | Duração em segundos (`0` por padrão) |
| `is_completed` | bool | Se está concluída |
| `task_type_id` | int | Tipo da tarefa |
| `text` | string | Descrição |
| `result` | array/object | Resultado da conclusão; vem `[]` (array vazio) quando não há resultado, e objeto `{ "text": "..." }` quando concluída com resultado |
| `complete_till` | int | Prazo (Unix timestamp) |
| `account_id` | int | ID da conta |
| `_links.self.href` | string | URL canônica da tarefa |

---

## Tipos de tarefa (`task_type_id`)

- `task_type_id` referencia um **tipo de tarefa configurado na conta**. Existem tipos padrão e tipos personalizados.
- Por padrão, contas Kommo têm dois tipos: **`1` = Follow-up** (code `FOLLOW_UP`) e **`2` = Meeting / Reunião** (code `MEETING`). Confirmado na doc oficial de tarefas e na resposta de `GET /api/v4/account?with=task_types`.
- Tipos personalizados podem ser criados na interface (Calendário → menu de três pontos → "Gerenciar tipos de tarefa").
- A lista de tipos da conta é obtida via `GET /api/v4/account?with=task_types`, retornada em `_embedded.task_types`. Cada objeto de tipo tem os campos: `id` (int), `name` (string), `color` (string ou null), `icon_id` (int ou null) e `code` (string, ex.: `FOLLOW_UP`, `MEETING`).

Exemplo de objeto de tipo de tarefa:

```json
{
  "id": 1,
  "name": "Follow-up",
  "color": null,
  "icon_id": null,
  "code": "FOLLOW_UP"
}
```

---

## Limites e rate limits

- **Taxa de requisições:** no máximo **7 requisições por segundo por IP**. Acima disso → **429 Too Many Requests**. Violações repetidas → bloqueio do IP com **403 Forbidden** em qualquer requisição.
- **Paginação:** `limit` máximo de **250** por página na listagem.
- **Lote (add/update):** máximo de **250** entidades por requisição; recomenda-se **não mais que 50** para performance e evitar erros.
- **504 Gateway Timeout:** pode ocorrer com lotes grandes; a recomendação oficial (página de limitações) é reduzir o número de entidades e repetir. (Obs.: o 504 é citado na página de *limitations*, não na de *http-codes*.)

---

## Códigos HTTP relevantes

| Código | Significado |
|---|---|
| `200 OK` | Requisição bem-sucedida; retorna o recurso |
| `204 No Content` | Sucesso, mas sem conteúdo (ex.: listagem que não retornou resultados) |
| `400 Bad Request` | Erro do cliente (sintaxe malformada / dados inválidos) |
| `401 Unauthorized` | Faltam credenciais válidas (token inválido/expirado) |
| `403 Forbidden` | Servidor entendeu mas recusou (bloqueio de API / assinatura inválida) |
| `429 Too Many Requests` | Excedeu o limite de requisições |
| `504 Gateway Timeout` | Timeout (citado na página de limitações; reduzir lote e repetir) |

---

## Pegadinhas e erros comuns (gotchas)

1. **`complete_till` é Unix timestamp (segundos), não milissegundos** — e é **obrigatório** no POST. Enviar ms gera prazos absurdos (datas em ~50.000 d.C.).
2. **POST sempre exige um array**, mesmo para uma única tarefa. Enviar um objeto solto causa **400 Invalid data**.
3. **PATCH em lote exige `id` em cada item**; sem `id` a tarefa não é localizada/atualizada.
4. **Concluir tarefa = `is_completed: true` + `result.text`** (objeto `result` com a chave `text`). É o exemplo canônico da doc para fechar uma tarefa.
5. **`result` na resposta de listagem volta como `[]` (array vazio)** quando não há resultado, mas no envio (POST/PATCH) o `result` é um **objeto** `{ "text": "..." }`. Cuidado ao desserializar (tipo inconsistente entre leitura e escrita).
6. **`responsible_user_id` cai para o usuário atual** se omitido — não assuma um responsável específico sem enviá-lo.
7. **`entity_type` só aceita `leads`, `contacts`, `companies`.** Tarefas podem existir sem entidade vinculada (omitindo `entity_id`/`entity_type`). O filtro `filter[entity_id][]` exige `filter[entity_type]`.
8. **As respostas de POST/PATCH são "magras"** (só `id`, `updated_at`/`request_id`, `_links`) — não devolvem o objeto completo. Para confirmar o estado, faça uma listagem com `filter[id][]`.
9. **Não confunda o filtro de listagem `filter[task_type][]`** (query) com o campo do corpo `task_type_id` (payload) — o nome difere entre query e payload.
10. **Não existe DELETE de tarefa nem GET de tarefa única na API v4** — só listar, adicionar (lote), editar (lote) e editar única. Tarefas são editadas/concluídas, não removidas via API.
11. **Respostas vêm em HAL+JSON** (`_links`/`_embedded`); listagens vazias retornam **204** sem corpo.

---

## Exemplo de uso (curl)

Criar uma tarefa de reunião (`task_type_id: 2`) para um lead, com prazo:

```bash
curl -X POST "https://exemplo.kommo.com/api/v4/tasks" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "task_type_id": 2,
      "text": "Ligar para confirmar a reunião",
      "complete_till": 1588885140,
      "entity_id": 9785993,
      "entity_type": "leads",
      "responsible_user_id": 123123,
      "request_id": "tarefa-confirma-reuniao"
    }
  ]'
```

Concluir essa tarefa registrando o resultado:

```bash
curl -X PATCH "https://exemplo.kommo.com/api/v4/tasks/4745251" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "is_completed": true,
    "result": { "text": "Cliente confirmou presença" }
  }'
```

Listar tarefas em aberto de reunião de um responsável:

```bash
curl -X GET "https://exemplo.kommo.com/api/v4/tasks?filter[task_type][]=2&filter[is_completed]=0&filter[responsible_user_id][]=123123&limit=50" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

---

## Fontes

- https://developers.kommo.com/reference/tasks
- https://developers.kommo.com/reference/tasks-list (e versão `.md`)
- https://developers.kommo.com/reference/add-tasks (e versão `.md`)
- https://developers.kommo.com/reference/edit-tasks (e versão `.md`)
- https://developers.kommo.com/reference/edit-task (e versão `.md`)
- https://developers.kommo.com/reference/account / https://developers.kommo.com/reference/account-parameters (e versão `.md`)
- https://developers.kommo.com/docs/limitations
- https://developers.kommo.com/docs/http-codes
- https://developers.kommo.com/reference/kommo-api-reference
