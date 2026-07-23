# Kommo API — Usuários e Funções (Users & Roles) API

## Visão geral

A seção **Users and roles** da API v4 reúne os métodos para gerenciar **usuários** da conta, suas **permissões/direitos** (rights), as **funções** (roles) e os **grupos** (groups). Pontos-chave:

- **Todos** os métodos desta seção são disponíveis **apenas para usuários administradores** (`is_admin: true`). Sem isso, a API retorna `403`.
- **Base URL:** `https://{subdomain}.kommo.com` (use o subdomínio da conta).
- **Autenticação:** OAuth 2.0 — header `Authorization: Bearer {access_token}`.
- **Content-Type da requisição:** `application/json`.
- **Content-Type da resposta:** `application/hal+json` em sucesso e `application/problem+json` em erro (padrão HAL com `_links`, `_embedded`, `_total_items`).
- Conceitos centrais:
  - **rights** — objeto que define o nível de acesso por entidade (leads/contacts/companies/tasks) e flags como `mail_access`, `catalog_access`, além de `status_rights` (direitos por etapa do funil). **Atenção:** no objeto `rights` de um **usuário** aparecem também `is_admin`, `is_free`, `is_active`, `group_id`, `role_id`; no objeto `rights` de uma **role**, esses campos **não** aparecem (a role só carrega leads/contacts/companies/tasks, `mail_access`, `catalog_access` e `status_rights`).
  - **role (função)** — conjunto reutilizável de `rights`. Ao atribuir `role_id` a um usuário, os direitos individuais de leads/contacts/companies/tasks são ignorados em favor da role.
  - **group (grupo)** — agrupamento de usuários (ex.: "Sales Office"), usado por direitos de nível "G" (grupo) e para organização. Grupos são criados/gerenciados via configurações da conta; aqui aparecem como leitura via `with=group` e atribuição via `group_id`. **Não há endpoint de CRUD de grupos nesta seção da API.**

### Níveis de direito (valores dos campos `view/edit/add/delete/export`)

| Valor | Significado |
|-------|-------------|
| `A` | Acesso total (todos os registros) |
| `G` | Acesso ao grupo (registros do grupo do usuário) |
| `M` | Acesso pessoal (apenas registros próprios) |
| `D` | Sem acesso / negado |

Por padrão, todo acesso é restrito (`D`) quando não especificado.

---

## Endpoints (resumo)

| Método | Caminho | Descrição |
|--------|---------|-----------|
| GET | `/api/v4/users` | Lista usuários da conta |
| GET | `/api/v4/users/{id}` | Dados de um usuário por ID |
| POST | `/api/v4/users` | Adiciona usuários (até 10 por requisição) |
| POST | `/api/v4/users/activate` | Ativa usuários em massa (até 10) |
| POST | `/api/v4/users/deactivate` | Desativa usuários em massa (até 10) |
| GET | `/api/v4/roles` | Lista funções (roles) da conta |
| GET | `/api/v4/roles/{id}` | Dados de uma função por ID |
| POST | `/api/v4/roles` | Adiciona funções |
| PATCH | `/api/v4/roles/{id}` | Edita uma função |
| DELETE | `/api/v4/roles/{id}` | Exclui uma função |

> **Não há endpoint de `PATCH /api/v4/users/{id}`** nesta seção da documentação oficial. A edição de um usuário existente não é feita por um método dedicado de update de usuário: ajusta-se o acesso via **roles/rights** (criando/editando a role atribuída) e usam-se os métodos de **ativação/desativação** para mudar o status. (Edição direta de `rights` de um usuário já criado não está documentada nesta seção.)

---

## 1) GET `/api/v4/users` — Lista de usuários

`GET https://{subdomain}.kommo.com/api/v4/users`

> Método disponível **apenas para administradores**.

### Parâmetros de query

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `with` | string | Valores separados por vírgula. Aceita: `role`, `group`, `uuid`, `amojo_id`, `user_rank`, `phone_number` |
| `page` | integer | Número da página |
| `limit` | integer | Quantidade de registros por página (máx. **250**) |

- `with=role` adiciona `_embedded.roles` ao usuário (array de **objetos** de função).
- `with=group` adiciona `_embedded.groups` ao usuário.

### Exemplo de requisição

```bash
curl -X GET "https://example.kommo.com/api/v4/users?with=role,group&page=1&limit=50" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Exemplo de resposta (200)

```json
{
  "_total_items": 2,
  "_page": 1,
  "_page_count": 1,
  "_links": {
    "self": {
      "href": "https://example.kommo.com/api/v4/users/?with=role%2Cgroup"
    }
  },
  "_embedded": {
    "users": [
      {
        "id": 123123,
        "name": "Example user",
        "email": "user@example.com",
        "lang": "en",
        "rights": {
          "leads":     { "view": "A", "edit": "A", "add": "A", "delete": "A", "export": "A" },
          "contacts":  { "view": "A", "edit": "A", "add": "A", "delete": "A", "export": "A" },
          "companies": { "view": "A", "edit": "A", "add": "A", "delete": "A", "export": "A" },
          "tasks":     { "edit": "A", "delete": "A" },
          "mail_access": false,
          "catalog_access": false,
          "status_rights": [
            {
              "entity_type": "leads",
              "pipeline_id": 2194576,
              "status_id": 30846277,
              "rights": { "view": "A", "edit": "A", "delete": "A" }
            },
            {
              "entity_type": "leads",
              "pipeline_id": 2212201,
              "status_id": 30965377,
              "rights": { "view": "A", "edit": "A", "delete": "A" }
            }
          ],
          "is_admin": false,
          "is_free": false,
          "is_active": true,
          "group_id": null,
          "role_id": null
        },
        "_links": {
          "self": { "href": "https://example.kommo.com/api/v4/users/123123/" }
        },
        "_embedded": {
          "roles": [
            {
              "id": 3141,
              "name": "Manager",
              "_links": { "self": { "href": "https://example.kommo.com/api/v4/roles/3141" } }
            }
          ],
          "groups": [
            { "id": 267688, "name": "Managers" }
          ]
        }
      },
      {
        "id": 321321,
        "name": "Example user 2",
        "email": "user@example.com",
        "lang": "en",
        "rights": {
          "leads":     { "view": "A", "edit": "A", "add": "G", "delete": "D", "export": "M" },
          "contacts":  { "view": "A", "edit": "A", "add": "G", "delete": "M", "export": "D" },
          "companies": { "view": "A", "edit": "G", "add": "G", "delete": "D", "export": "D" },
          "tasks":     { "edit": "A", "delete": "A" },
          "mail_access": true,
          "catalog_access": true,
          "status_rights": null,
          "is_admin": true,
          "is_free": false,
          "is_active": true,
          "group_id": null,
          "role_id": null
        },
        "_links": {
          "self": { "href": "https://example.kommo.com/api/v4/users/321321" }
        },
        "_embedded": {
          "roles": [],
          "groups": []
        }
      }
    ]
  }
}
```

### Respostas

- **200** — sucesso (`application/hal+json`).
- **401** — usuário não autorizado.
- **403** — direitos insuficientes (não-administrador).

---

## 2) GET `/api/v4/users/{id}` — Usuário por ID

`GET https://{subdomain}.kommo.com/api/v4/users/{id}`

> Método disponível **apenas para administradores**.

### Parâmetros

| Local | Nome | Tipo | Descrição |
|-------|------|------|-----------|
| path | `id` | integer | ID do usuário (obrigatório) |
| query | `with` | string | Valores separados por vírgula: `role`, `group`, `uuid`, `amojo_id`, `user_rank`, `phone_number` |

- `role` → adiciona a função do usuário; `group` → adiciona o grupo.
- `uuid` → UUID do usuário (pode ser `null`); `amojo_id` → ID no serviço de chat (pode ser `null`).
- `user_rank` → rank do usuário; `phone_number` → telefone.

### Exemplo de requisição

```bash
curl -X GET "https://example.kommo.com/api/v4/users/185848?with=role,group" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Exemplo de resposta (200)

```json
{
  "id": 185848,
  "name": "John Doe",
  "email": "test@example.com",
  "lang": "en",
  "rights": {
    "leads":     { "view": "M", "edit": "M", "add": "D", "delete": "M", "export": "M" },
    "contacts":  { "view": "M", "edit": "M", "add": "D", "delete": "M", "export": "M" },
    "companies": { "view": "M", "edit": "M", "add": "D", "delete": "M", "export": "M" },
    "tasks":     { "edit": "A", "delete": "A" },
    "mail_access": false,
    "catalog_access": true,
    "status_rights": [
      {
        "entity_type": "leads",
        "pipeline_id": 3166396,
        "status_id": 142,
        "rights": { "view": "D", "edit": "D", "delete": "D", "export": "D" }
      },
      {
        "entity_type": "leads",
        "pipeline_id": 3166396,
        "status_id": 32311027,
        "rights": { "view": "D", "edit": "D", "delete": "D" }
      },
      {
        "entity_type": "leads",
        "pipeline_id": 3104455,
        "status_id": 31881115,
        "rights": { "view": "D", "edit": "D", "delete": "D" }
      }
    ],
    "is_admin": false,
    "is_free": false,
    "is_active": true,
    "group_id": null,
    "role_id": null
  },
  "_links": {
    "self": { "href": "https://example.kommo.com/api/v4/users/185848" }
  }
}
```

> Note que o primeiro `status_rights` (etapa "Incoming leads", `status_id: 142`) inclui o campo `export` no sub-objeto `rights`, enquanto as demais etapas trazem apenas `view/edit/delete`.

### Respostas

- **200** — sucesso. **401** — não autorizado. **403** — direitos de administrador insuficientes.

---

## 3) POST `/api/v4/users` — Adicionar usuários

`POST https://{subdomain}.kommo.com/api/v4/users`

> Método disponível **apenas para administradores**.

- Permite adicionar **múltiplos usuários** (o corpo é um **array**).
- Limite: **até 10 usuários por requisição**.
- Indisponível quando a conta já excede **100 usuários**, exceto nos planos **Pro/Enterprise**.

### Corpo da requisição (campos)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `name` | string | Sim | Nome completo. Não pode conter símbolos especiais (exceto `. @ - _`), nem ser só espaços, nem conter links. **Máx. 50 caracteres.** |
| `email` | string | Sim | E-mail do usuário |
| `password` | string | Sim | Mín. 6 caracteres, com ao menos 1 dígito, 1 maiúscula e 1 minúscula |
| `lang` | string | Não | Idioma: `ru`, `en`, `es`, `pt` (padrão: idioma da conta) |
| `rights` | object | Não | Objeto de permissões (padrão: sem acesso) |
| `rights.leads / contacts / companies` | object | Condicional* | `view`, `edit`, `add`, `delete`, `export` com valores `A/G/M/D` |
| `rights.tasks` | object | Condicional* | `edit` e `delete` com valores `A/G/M/D` |
| `rights.mail_access` | boolean | Não | Acesso a Mail (padrão `false`) |
| `rights.catalog_access` | boolean | Não | Acesso a Lists/Catálogo (padrão `false`) |
| `rights.status_rights` | array/null | Não | Direitos por etapa do funil |
| `rights.is_free` | boolean | Não | Usuário gratuito; se `true`, demais campos de `rights` são ignorados |
| `rights.role_id` | integer | Não | ID de função; se informado, ignora leads/contacts/companies/tasks individuais |
| `rights.group_id` | integer | Não | ID do grupo (`null` → padrão "Sales Office") |
| `request_id` | string | Não | Identificador devolvido inalterado na resposta; **não é salvo** |

\* Obrigatório se `role_id` não for informado e `is_free` não estiver ativo.

> Observação sobre a posição de `request_id`: na documentação oficial ele é um campo do objeto de usuário (no mesmo nível de `name`/`email`/`rights`) e é ecoado na resposta. No exemplo abaixo ele é mantido onde costuma aparecer; o importante é que retorna inalterado e não é persistido.

### Exemplo de requisição

```json
[
  {
    "name": "testUser",
    "email": "user_add-test@example.com",
    "password": "Password123",
    "lang": "en",
    "rights": {
      "leads":     { "view": "A", "edit": "A", "add": "A", "delete": "A", "export": "D" },
      "contacts":  { "view": "A", "edit": "A", "add": "A", "delete": "A", "export": "D" },
      "companies": { "view": "A", "edit": "A", "add": "A", "delete": "A", "export": "D" },
      "tasks":     { "edit": "A", "delete": "A" },
      "mail_access": false,
      "catalog_access": false,
      "is_free": false,
      "role_id": null,
      "group_id": null
    },
    "request_id": "1"
  }
]
```

### Exemplo de resposta (201)

```json
{
  "_total_items": 1,
  "_embedded": {
    "users": [
      {
        "id": 6029791,
        "name": "testUser",
        "email": "user_add-test@example.com",
        "lang": "en",
        "rights": {
          "leads":     { "view": "A", "edit": "A", "add": "A", "delete": "A", "export": "D" },
          "contacts":  { "view": "A", "edit": "A", "add": "A", "delete": "A", "export": "D" },
          "companies": { "view": "A", "edit": "A", "add": "A", "delete": "A", "export": "D" },
          "tasks":     { "edit": "A", "delete": "A" },
          "mail_access": false,
          "catalog_access": false,
          "status_rights": [
            {
              "entity_type": "leads",
              "pipeline_id": 2020444,
              "status_id": 29652544,
              "rights": { "view": "D", "edit": "D", "delete": "D" }
            },
            {
              "entity_type": "leads",
              "pipeline_id": 2275606,
              "status_id": 31411840,
              "rights": { "view": "D", "edit": "D", "delete": "D" }
            }
          ],
          "is_admin": false,
          "role_id": null,
          "is_free": false,
          "group_id": null,
          "is_active": true
        },
        "request_id": "1",
        "_links": {
          "self": { "href": "https://test.kommo.com/api/v4/users/6029791" }
        }
      }
    ]
  }
}
```

### Respostas

- **201** — usuários criados. **400** — dados inválidos. **401** — não autorizado. **403** — direitos insuficientes.

---

## 4) POST `/api/v4/users/activate` — Ativar usuários (em massa)

`POST https://{subdomain}.kommo.com/api/v4/users/activate`

- Apenas administrador; **até 10 usuários** por requisição.
- **Não** ativa usuários com direitos de admin.
- Disponível apenas nos planos **Pro e Enterprise**.

### Corpo da requisição

```json
[
  { "id": 1481368 }
]
```

### Respostas

- **202** — sucesso (corpo vazio; `Content-Type: text/html`).
- **400** — dados inválidos. Ex.:

```json
{
  "title": "Bad Request",
  "type": "https://httpstatus.es/400",
  "status": 400,
  "detail": "User(s) 1481368 are not associated with provided account."
}
```

- **401** — não autorizado. Ex.:

```json
{
  "title": "Unauthorized",
  "type": "https://httpstatus.es/401",
  "status": 401,
  "detail": "Invalid user name or password"
}
```

- **403** — escopo/direitos insuficientes. Ex.:

```json
{
  "title": "Forbidden",
  "type": "https://httpstatus.es/403",
  "status": 403,
  "detail": "Client doesn't have the required scope"
}
```

---

## 5) POST `/api/v4/users/deactivate` — Desativar usuários (em massa)

`POST https://{subdomain}.kommo.com/api/v4/users/deactivate`

- Apenas administrador; **até 10 usuários** por requisição.
- **Não** desativa administradores. Apenas planos **Pro e Enterprise**.

### Corpo da requisição

```json
[
  { "id": 1481368 },
  { "id": 1481369 }
]
```

### Respostas

- **204** — sucesso (sem conteúdo; `Content-Type: text/html`).
- **400 / 401 / 403** — mesmos formatos de erro (`application/problem+json`) do endpoint de ativação (`Bad Request` / `Invalid user name or password` / `Client doesn't have the required scope`).

> Atenção: a documentação indica **202** para *activate* (com `Content-Type: text/html`) e **204** para *deactivate* — códigos de sucesso **diferentes** entre os dois métodos.

---

## 6) GET `/api/v4/roles` — Lista de funções (roles)

`GET https://{subdomain}.kommo.com/api/v4/roles`

> Método disponível **apenas para administradores**.

### Parâmetros de query

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `with` | string | `users` — adiciona os IDs dos usuários que possuem a função |
| `page` | integer | Número da página |
| `limit` | integer | Registros por página (máx. **250**) |

### Exemplo de requisição

```bash
curl -X GET "https://example.kommo.com/api/v4/roles?with=users&page=1&limit=50" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Exemplo de resposta (200)

> O objeto `rights` de uma **role** contém apenas leads/contacts/companies/tasks, `mail_access`, `catalog_access` e `status_rights`. **Não** carrega `is_admin`, `is_free`, `is_active`, `group_id` nem `role_id` (estes pertencem ao `rights` de um usuário).

```json
{
  "_total_items": 1,
  "_page": 1,
  "_page_count": 1,
  "_links": {
    "self": { "href": "https://example.kommo.com/api/v4/roles?with=users&page=1&limit=50" }
  },
  "_embedded": {
    "roles": [
      {
        "id": 107995,
        "name": "Supervisor",
        "rights": {
          "leads":     { "view": "A", "edit": "A", "add": "A", "delete": "A", "export": "A" },
          "contacts":  { "view": "A", "edit": "A", "add": "A", "delete": "A", "export": "A" },
          "companies": { "view": "A", "edit": "A", "add": "A", "delete": "A", "export": "A" },
          "tasks":     { "edit": "A", "delete": "A" },
          "mail_access": false,
          "catalog_access": false,
          "status_rights": [
            {
              "entity_type": "leads",
              "pipeline_id": 1234567,
              "status_id": 7654321,
              "rights": { "edit": "A", "view": "A", "delete": "A" }
            }
          ]
        },
        "_links": {
          "self": { "href": "https://example.kommo.com/api/v4/roles/107995" }
        },
        "_embedded": {
          "users": []
        }
      }
    ]
  }
}
```

### Respostas

- **200** — sucesso (`application/hal+json`). **401** — não autorizado. **403** — direitos de administrador insuficientes.

---

## 7) GET `/api/v4/roles/{id}` — Função por ID

`GET https://{subdomain}.kommo.com/api/v4/roles/{id}`

> Método disponível **apenas para administradores**.

### Parâmetros

| Local | Nome | Tipo | Descrição |
|-------|------|------|-----------|
| path | `id` | integer | ID da função (obrigatório) |
| query | `with` | string | `users` — adiciona os IDs dos usuários com a função |

### Exemplo de resposta (200)

> Como na listagem de roles, o `rights` da função **não** inclui `is_admin/is_free/is_active/group_id/role_id`. No exemplo oficial, o bloco `_embedded.users` **não aparece no corpo** mesmo sendo descrito na documentação como "array de IDs de usuários com a função" — ele só é incluído quando `with=users` é solicitado (verificar comportamento real; o exemplo abaixo mostra `_embedded.users` apenas para ilustrar o formato esperado quando presente).

```json
{
  "id": 123456,
  "name": "Example Role",
  "rights": {
    "leads":     { "view": "A", "edit": "A", "add": "A", "delete": "A", "export": "A" },
    "contacts":  { "view": "A", "edit": "A", "add": "A", "delete": "A", "export": "A" },
    "companies": { "view": "A", "edit": "A", "add": "A", "delete": "A", "export": "A" },
    "tasks":     { "edit": "A", "delete": "A" },
    "mail_access": false,
    "catalog_access": false,
    "status_rights": [
      {
        "entity_type": "leads",
        "pipeline_id": 111111,
        "status_id": 2222222,
        "rights": { "edit": "A", "view": "A", "delete": "A" }
      }
    ]
  },
  "_embedded": {
    "users": [123, 456, 789]
  },
  "_links": {
    "self": { "href": "https://example.kommo.com/api/v4/roles/123456" }
  }
}
```

> **Diferença importante de estrutura:** em `GET /roles/{id}?with=users` (e `GET /roles?with=users`), `_embedded.users` é um array de **IDs** (inteiros). Já em `GET /users?with=role`, `_embedded.roles` traz **objetos** de função com `id`, `name` e `_links`.

### Respostas

- **200** — sucesso. **401** — não autorizado. **403** — direitos de administrador insuficientes.

---

## 8) POST `/api/v4/roles` — Adicionar funções

`POST https://{subdomain}.kommo.com/api/v4/roles`

> Método disponível **apenas para administradores**.

- Permite adicionar **múltiplas funções** (corpo é um **array**). Por padrão, todo acesso é restrito.
- Campos por função: `name` (string), `rights` (object) e `request_id` (string, ecoado e não persistido).

### Exemplo de requisição

```json
[
  {
    "name": "role 3",
    "rights": {
      "leads":     { "view": "G", "edit": "G", "add": "A", "delete": "G", "export": "G" },
      "contacts":  { "view": "A", "edit": "A", "add": "A", "delete": "A", "export": "A" },
      "companies": { "view": "A", "edit": "A", "add": "A", "delete": "A", "export": "A" },
      "tasks":     { "edit": "A", "delete": "A" },
      "status_rights": [
        {
          "entity_type": "leads",
          "pipeline_id": 123456,
          "status_id": 1234567,
          "rights": { "edit": "A", "view": "A", "delete": "A", "export": "A" }
        }
      ],
      "mail_access": true,
      "catalog_access": true
    },
    "request_id": "identificador_opcional"
  }
]
```

### Exemplo de resposta (201)

> Os valores numéricos (`id`, `pipeline_id`, `status_id`) aparecem como placeholders (`XXXX`) no exemplo oficial; aqui foram mantidos como placeholders para fidelidade. Note que `tasks` na resposta vem **apenas** com `edit`/`delete`, e o `rights` da role **não** inclui `is_admin`/`is_active`.

```json
{
  "_total_items": 1,
  "_embedded": {
    "roles": [
      {
        "id": "XXXXX",
        "name": "role 3",
        "rights": {
          "leads":     { "add": "A", "edit": "G", "view": "G", "delete": "G", "export": "G" },
          "tasks":     { "edit": "A", "delete": "A" },
          "contacts":  { "add": "A", "edit": "A", "view": "A", "delete": "A", "export": "A" },
          "companies": { "add": "A", "edit": "A", "view": "A", "delete": "A", "export": "A" },
          "mail_access": true,
          "status_rights": [
            {
              "entity_type": "leads",
              "pipeline_id": "XXXXX",
              "status_id": "XXXXXXX",
              "rights": { "edit": "A", "view": "A", "delete": "A", "export": "A" }
            }
          ],
          "catalog_access": true
        },
        "_links": {
          "self": { "href": "https://example.kommo.com/api/v4/roles/XXX/" }
        }
      }
    ]
  }
}
```

### Respostas

- **201** — funções criadas. **400** — dados inválidos. **401** — não autorizado. **403** — direitos insuficientes.

---

## 9) PATCH `/api/v4/roles/{id}` — Editar função

`PATCH https://{subdomain}.kommo.com/api/v4/roles/{id}`

> Método disponível **apenas para administradores**.

- `id` (path, obrigatório) — ID da função.
- Corpo é um **objeto único** (não array) com `name` e/ou `rights`.

### Exemplo de requisição

```json
{
  "name": "role 3 modified",
  "rights": {
    "leads":     { "view": "G", "edit": "G", "add": "A", "delete": "G", "export": "G" },
    "contacts":  { "view": "D", "edit": "D", "add": "A", "delete": "D", "export": "D" },
    "companies": { "view": "A", "edit": "A", "add": "A", "delete": "A", "export": "A" },
    "tasks":     { "edit": "A", "delete": "A" },
    "status_rights": [
      {
        "entity_type": "leads",
        "pipeline_id": 123456,
        "status_id": 1234567,
        "rights": { "edit": "D", "view": "D", "delete": "D" }
      }
    ],
    "mail_access": true,
    "catalog_access": true
  }
}
```

### Exemplo de resposta (202)

> No exemplo oficial, todos os valores numéricos (`id`, `pipeline_id`, `status_id`) são placeholders (`XXXX`).

```json
{
  "id": "XXX",
  "name": "role 3 modified",
  "rights": {
    "leads":     { "add": "A", "edit": "G", "view": "G", "delete": "G", "export": "G" },
    "tasks":     { "edit": "A", "delete": "A" },
    "contacts":  { "add": "A", "edit": "D", "view": "D", "delete": "D", "export": "D" },
    "companies": { "add": "A", "edit": "A", "view": "A", "delete": "A", "export": "A" },
    "mail_access": true,
    "status_rights": [
      {
        "entity_type": "leads",
        "pipeline_id": "XXXXX",
        "status_id": "XXXXXXX",
        "rights": { "edit": "D", "view": "D", "delete": "D" }
      }
    ],
    "catalog_access": true
  },
  "_links": {
    "self": { "href": "https://example.kommo.com/api/v4/roles/XXXX/" }
  }
}
```

> **Importante:** se `rights.status_rights` receber `null` ou um array vazio (`[]`), os direitos de etapa atuais da role são **removidos**, e a etapa "Incoming Leads" (entrada de leads) passa a status "restrito".

### Respostas

- **202** — função editada. **400** — dados inválidos. **401** — não autorizado. **403** — direitos insuficientes.

---

## 10) DELETE `/api/v4/roles/{id}` — Excluir função

`DELETE https://{subdomain}.kommo.com/api/v4/roles/{id}`

> Método disponível **apenas para administradores**. Não há corpo de requisição.

- `id` (path, obrigatório, int32) — ID da função.
- **204** — exclusão confirmada (corpo `{}`; "The role has been successfully deleted").
- **400** — dados inválidos. **401** — não autorizado. **403** — direitos insuficientes (corpo `{}`).

```bash
curl -X DELETE "https://example.kommo.com/api/v4/roles/12345" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

---

## Tabela de campos importantes

| Campo | Tipo | Onde aparece | Descrição |
|-------|------|--------------|-----------|
| `id` | integer | user, role | ID da entidade |
| `name` | string | user, role | Nome do usuário/função (usuário: máx. 50 caracteres) |
| `email` | string | user | E-mail |
| `lang` | string | user | Idioma (`ru`, `en`, `es`, `pt`) |
| `rights` | object | user, role | Conjunto de direitos |
| `rights.leads / contacts / companies` | object | user, role | `view`, `edit`, `add`, `delete`, `export` ∈ `A/G/M/D` |
| `rights.tasks` | object | user, role | Na resposta normalmente só `edit` e `delete` |
| `rights.mail_access` | boolean | user, role | Acesso a Mail |
| `rights.catalog_access` | boolean | user, role | Acesso a Lists/Catálogo |
| `rights.is_admin` | boolean | **só user** | Admin da conta |
| `rights.is_free` | boolean | **só user** | Usuário gratuito (ignora demais rights) |
| `rights.is_active` | boolean | **só user** | Usuário ativo |
| `rights.group_id` | integer/null | **só user** | ID do grupo do usuário |
| `rights.role_id` | integer/null | **só user** | ID da função aplicada |
| `rights.status_rights` | array/null | user, role | Direitos por etapa: `entity_type`, `pipeline_id`, `status_id`, `rights{view/edit/delete[/export]}` |
| `request_id` | string | POST users/roles | Eco do identificador enviado (não persistido) |
| `_embedded.roles` | array | user (`with=role`) | Objetos de função (`id`, `name`, `_links`) |
| `_embedded.groups` | array | user (`with=group`) | Grupos (`id`, `name`) |
| `_embedded.users` | array | role (`with=users`) | IDs de usuários da função |
| `amojo_id` | string/null | user (`with=amojo_id`) | ID no serviço de chat |
| `uuid` | string/null | user (`with=uuid`) | UUID do usuário |
| `_total_items`, `_page`, `_page_count`, `_links` | — | listagens | Metadados HAL de paginação |

---

## Limites / rate limits

- **Paginação:** `limit` máximo de **250** por página (GET users e GET roles).
- **Criação:** `POST /users` aceita **até 10 usuários** por requisição; `activate`/`deactivate` aceitam **até 10** por requisição.
- **Limite de usuários da conta:** `POST /users` indisponível quando a conta excede **100 usuários**, salvo planos **Pro/Enterprise**.
- **activate/deactivate** restritos a planos **Pro/Enterprise** e não atuam sobre usuários administradores.
- **Rate limit geral da API Kommo:** **no máximo 7 requisições por segundo** por conta. Ao exceder, a API retorna **HTTP 429**; em violações repetidas, a conta pode ser bloqueada e qualquer chamada passa a retornar **HTTP 403**. (Limite global da plataforma, não específico desta seção.)

---

## Pegadinhas e erros comuns (gotchas)

1. **Tudo exige admin.** Qualquer método aqui retorna `403` ("Insufficient rights to call this method") se o token não for de um administrador. Sem o escopo OAuth correto: `"Client doesn't have the required scope"`.
2. **`role_id` sobrepõe rights individuais.** Ao criar usuário com `role_id`, os blocos `leads/contacts/companies/tasks` são ignorados; a função define o acesso.
3. **`is_free: true` ignora os demais rights.** Útil para usuários gratuitos, mas atenção ao montar o payload.
4. **`status_rights` nulo/vazio em PATCH role apaga direitos de etapa** e força "Incoming Leads" a restrito — não envie vazio achando que mantém o atual.
5. **Corpos são arrays em POST (users e roles), mas PATCH role é objeto único.** Misturar os formatos gera `400`.
6. **Códigos de sucesso variam:** `POST /users` → `201`; `POST /roles` → `201`; `PATCH /roles` → `202`; `DELETE /roles` → `204`; `activate` → `202`; `deactivate` → `204`. Não trate todos como `200`.
7. **`_embedded.users` em role = lista de IDs**, enquanto `_embedded.roles` em user = lista de objetos. Estruturas diferentes para "o mesmo relacionamento".
8. **`with` precisa ser explícito.** Sem `with=role,group`, a listagem de usuários não traz `_embedded.roles`/`groups`; sem `with=users`, roles não trazem os usuários.
9. **`amojo_id` e `uuid` podem ser `null`** mesmo quando solicitados via `with`.
10. **`request_id` não é salvo** — serve apenas para correlacionar o item enviado com o retornado em chamadas em lote.
11. **`tasks` na resposta** vem só com `edit`/`delete`, mesmo na criação/edição de roles — não conte com `view/add/export` persistidos para tarefas.
12. **`rights` de role ≠ `rights` de user.** O `rights` de uma role **não** traz `is_admin/is_free/is_active/group_id/role_id`; esses campos só existem no `rights` de um usuário.
13. **Senha forte obrigatória** em `POST /users` (mín. 6, com maiúscula, minúscula e dígito) — senhas fracas resultam em `400`. O `name` não pode passar de 50 caracteres nem conter símbolos fora de `. @ - _`.
14. **Não existe `PATCH /api/v4/users/{id}`** nesta seção. Para mudar o acesso de um usuário existente, edita-se a role atribuída (`PATCH /roles/{id}`) ou usa-se activate/deactivate; não há método dedicado de update de usuário documentado aqui.

---

## Exemplo de cenário concreto

Provisionar um novo SDR com a função "Manager" e listar para confirmar:

```bash
# 1) Descobrir o role_id de "Manager"
curl -s "https://example.kommo.com/api/v4/roles?with=users" \
  -H "Authorization: Bearer $TOKEN"

# 2) Criar o usuário já vinculado à role (role_id sobrepõe rights individuais)
curl -s -X POST "https://example.kommo.com/api/v4/users" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '[{
        "name": "SDR Novo",
        "email": "sdr.novo@example.com",
        "password": "Senha123",
        "lang": "pt",
        "rights": { "role_id": 3141, "group_id": 267688 },
        "request_id": "sdr-1"
      }]'

# 3) Confirmar o usuário criado com sua role e grupo
curl -s "https://example.kommo.com/api/v4/users?with=role,group&limit=250" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Fontes

- https://developers.kommo.com/reference/users-and-roles (índice da seção)
- https://developers.kommo.com/reference/users-list.md (GET /api/v4/users)
- https://developers.kommo.com/reference/get-user-by-id.md (GET /api/v4/users/{id})
- https://developers.kommo.com/reference/add-users.md (POST /api/v4/users)
- https://developers.kommo.com/reference/activate-users.md (POST /api/v4/users/activate)
- https://developers.kommo.com/reference/deactivate-users.md (POST /api/v4/users/deactivate)
- https://developers.kommo.com/reference/user-roles-list.md (GET /api/v4/roles)
- https://developers.kommo.com/reference/get-role-data-by-id.md (GET /api/v4/roles/{id})
- https://developers.kommo.com/reference/adding-roles.md (POST /api/v4/roles)
- https://developers.kommo.com/reference/edit-roles.md (PATCH /api/v4/roles/{id})
- https://developers.kommo.com/reference/deleting-role.md (DELETE /api/v4/roles/{id})
- https://developers.kommo.com/docs/limitations (limites gerais da API: 250/página, 7 req/s, 429/403)
- https://developers.kommo.com/docs/permissions (guia geral de permissões/escopos OAuth)
