# Kommo API — Fontes (Sources) API

> Referência verificada contra a documentação oficial em `developers.kommo.com`
> (variantes `.md` das páginas de referência) em 2026-06-29.

## Visão geral

No Kommo, a **Sources API** permite que uma integração gerencie suas próprias **fontes
(sources)**. Uma fonte representa a origem de um lead de entrada (*incoming lead*) dentro de
uma conta — o "de onde veio" o lead — e aparece em vários pontos do CRM:

- No campo **Fonte** dos *leads de entrada* (incoming leads) criados via API de chat;
- No campo de **canais** (channels) das configurações da etapa **Message** dos bots (Salesbot);
- Nas opções de contato quando a função **Write First** ("escrever primeiro") está ativa;
- Na aba de **Estatísticas** do cartão do lead (para leads criados a partir de fontes) e no
  widget de dashboard / configurações do Digital Pipeline.

Cada fonte tem um código próprio e único do lado da integração: o `external_id`. É por esse
`external_id` que a fonte é referenciada e filtrada na própria Sources API. **Uma integração
pode adicionar até 100 fontes.**

Requisitos para gerenciar fontes via API:

- A integração precisa ter um **widget** cujo `manifest.json` declare a localização que exibe
  o widget na interface de fontes: `"locations": ["lead_sources"]`.
- Se a integração for gerenciar as fontes inteiramente pelo backend (API), ative a função
  **"Multiple sources" / "Várias fontes"** ao criar a integração. Texto oficial: *"This flag
  should be enabled when the integration fully manages the sources through the API from its
  backend, and creating the source from the Kommo side is no longer required."* Com ela ligada,
  o Kommo **não** cria fontes automaticamente na instalação — você precisa criar todas as
  fontes que a integração necessita via Sources API.
- Para WhatsApp oficial (WABA), a fonte pode ser especificada com a propriedade `waba`, o que
  habilita a gestão de templates de WhatsApp e seu uso na etapa **Send Message** do Salesbot.

> Autorização: todos os métodos exigem OAuth 2.0 (Access Token / token de longa duração). Os
> métodos de escrita (POST/PATCH/DELETE) exigem **direitos de administrador**.

---

## Endpoints

| Método | Caminho | Descrição |
|--------|---------|-----------|
| `GET`    | `https://{subdominio}.kommo.com/api/v4/sources` | Lista as fontes da integração |
| `GET`    | `https://{subdominio}.kommo.com/api/v4/sources/{id}` | Retorna uma fonte pelo ID |
| `POST`   | `https://{subdominio}.kommo.com/api/v4/sources` | Cria fontes (em lote) |
| `PATCH`  | `https://{subdominio}.kommo.com/api/v4/sources` | Edita fontes em lote |
| `PATCH`  | `https://{subdominio}.kommo.com/api/v4/sources/{id}` | Edita uma fonte específica |
| `DELETE` | `https://{subdominio}.kommo.com/api/v4/sources` | Remove fontes em lote |
| `DELETE` | `https://{subdominio}.kommo.com/api/v4/sources/{id}` | Remove uma fonte específica |

---

## GET — Listar fontes

`GET https://{subdominio}.kommo.com/api/v4/sources`

### Parâmetros de query

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `filter[external_id]` | array de strings | Filtra por um ou mais `external_id` de fontes |

> Observação: a doc oficial da Sources API documenta explicitamente apenas o filtro por
> `external_id`. Parâmetros genéricos de paginação (`page`, `limit`) **não estão documentados**
> para este recurso (o limite de 100 fontes por integração costuma dispensar paginação).

Exemplo de filtro:
```
GET /api/v4/sources?filter[external_id][]=kchat01&filter[external_id][]=kchat02
```

### Resposta 200 (exemplo oficial)

`Content-Type: application/hal+json`

```json
{
  "_total_items": 2,
  "_links": {
    "self": {
      "href": "https://subdomain.kommo.com/api/v4/sources"
    }
  },
  "_embedded": {
    "sources": [
      {
        "id": 17619939,
        "name": "chat",
        "pipeline_id": 5867030,
        "external_id": "kchat01",
        "services": [],
        "default": false,
        "origin_code": "kommo.ext.30470678",
        "_links": {
          "self": {
            "href": "https://subdomain.kommo.com/api/v4/sources/17619939"
          }
        }
      }
    ]
  }
}
```

### Códigos de resposta

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso — fontes retornadas |
| 204 | Nenhuma fonte encontrada / filtro sem resultados (corpo vazio) |
| 401 | Integração não autorizada |

---

## GET — Obter fonte por ID

`GET https://{subdominio}.kommo.com/api/v4/sources/{id}`

| Parâmetro (path) | Tipo | Descrição |
|------------------|------|-----------|
| `id` | integer | ID da fonte |

### Resposta 200 (exemplo oficial)

`Content-Type: application/hal+json`

```json
{
  "id": 17619939,
  "name": "chat",
  "pipeline_id": 5867030,
  "external_id": "kchat01",
  "services": [],
  "default": false,
  "origin_code": "kommo.ext.30470678",
  "_links": {
    "self": {
      "href": "https://subdomain.kommo.com/api/v4/sources/17619939"
    }
  }
}
```

### Códigos de resposta

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso — retorna o objeto da fonte |
| 204 | "The integration does not have any sources or the source was deleted" |
| 401 | Não autorizado |

> Sucesso retorna `application/hal+json`; erro retorna `application/problem+json`.

---

## POST — Adicionar fontes (lote)

`POST https://{subdominio}.kommo.com/api/v4/sources`

Requer **direitos de administrador**. Corpo é um **array de objetos**, no máximo **100** por
requisição.

### Parâmetros do corpo

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `name` | string | Sim | Nome da fonte |
| `external_id` | string | Sim | ID externo do lado da integração (único) |
| `pipeline_id` | integer | Não | ID do funil (funil arquivado é permitido); se omitido, a fonte é adicionada ao funil principal |
| `default` | boolean | Não | Se esta é a fonte padrão |
| `origin_code` | string | Não | Código do canal de chat principal. Campo opcional, mas quando informado **não pode ser nulo, conter apenas números, conter apenas aspas duplas, nem ultrapassar 20 caracteres** |
| `services` | array | Não | Serviços associados à fonte (WhatsApp suportado) — ver tabela de `services` abaixo |

> Sobre `request_id`: a doc oficial **não lista `request_id` como parâmetro de entrada** do
> corpo. Ele aparece apenas na **resposta** do POST, ecoando o índice do item no array (`"0"`,
> `"1"`, …), para você casar cada fonte criada com o item enviado. *(O envio de um `request_id`
> próprio no corpo não está documentado nesta página — não confirmado na doc.)*

### Estrutura de `services` (WhatsApp)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `services[].type` | string | Tipo do serviço (atualmente `"whatsapp"`) |
| `services[].pages` | array | Elementos para configuração do botão de chat no site / dropdown de seleção |
| `services[].pages[].name` | string | Nome exibido no dropdown |
| `services[].pages[].id` | string | Identificador interno do item |
| `services[].pages[].link` | string | Identificador do usuário / link do messenger usado para enviar mensagem |
| `services[].params` | object | Configurações do serviço |
| `services[].params.waba` | boolean | (opcional) Indica WhatsApp oficial (WABA) — habilita gestão de templates |
| `services[].params.is_supports_list_message` | boolean | (opcional) Suporte à etapa List Message |

### Corpo da requisição (exemplo oficial)

```json
[
  {
    "name": "chat",
    "external_id": "Kchat01",
    "origin_code": "kommo.ext.30470678",
    "pipeline_id": 5867030
  },
  {
    "name": "test_chat",
    "external_id": "Kchat02",
    "origin_code": "kommo.ext.30470678",
    "pipeline_id": 5884544
  }
]
```

### Resposta 200 (exemplo oficial)

`Content-Type: application/hal+json`

```json
{
  "_total_items": 2,
  "_embedded": {
    "sources": [
      {
        "id": 17619939,
        "name": "chat",
        "pipeline_id": 5867030,
        "external_id": "kchat01",
        "services": [],
        "default": false,
        "origin_code": "kommo.ext.30470678",
        "request_id": "0",
        "_links": {
          "self": { "href": "https://subdomain.kommo.com/api/v4/sources/17619939" }
        }
      }
    ]
  }
}
```

### Códigos de resposta

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso — retorna as fontes com IDs atribuídos e `request_id` |
| 204 | Nenhuma fonte / endereço inválido |
| 400 | Requisição inválida — `external_id` já existente, ou `pipeline_id` inexistente |
| 401 | Não autorizado |

---

## PATCH — Atualizar fontes (lote)

`PATCH https://{subdominio}.kommo.com/api/v4/sources`

Requer **direitos de administrador**. Máximo **100** por requisição.

### Parâmetros do corpo (array de objetos)

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `id` | integer | Sim | ID da fonte a modificar |
| `name` | string | Não | Nome de exibição |
| `pipeline_id` | integer | Não | ID do funil (pode estar arquivado); se omitido, usa o funil principal |
| `default` | boolean | Não | Se é a fonte padrão |
| `origin_code` | string | Não | Código do canal de chat principal (mesmas regras do POST) |
| `services` | array/object | Não | Serviços associados (`type`, `pages`, `params`) — mesma estrutura do POST |

> Nota: `external_id` **não** consta como parâmetro editável no PATCH **em lote** (aparece na
> resposta, mas não na lista de parâmetros de entrada). No PATCH **de uma fonte específica**
> (`/sources/{id}`), `external_id` aparece como campo editável do corpo. Na dúvida, trate
> `external_id` como imutável após a criação.

### Corpo da requisição (exemplo oficial)

```json
[
  {
    "id": 17619939,
    "default": true
  },
  {
    "id": 19352935,
    "name": "call"
  }
]
```

### Resposta 200 (exemplo oficial)

```json
{
  "_total_items": 2,
  "_embedded": {
    "sources": [
      {
        "id": 17619939,
        "name": "chat",
        "pipeline_id": 5867030,
        "external_id": "kchat01",
        "services": [],
        "default": true,
        "origin_code": "kommo.ext.30470678"
      }
    ]
  }
}
```

### Códigos de resposta

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 400 | Dados incorretos |
| 401 | Não autorizado |
| 404 | ID da fonte não encontrado |

---

## PATCH — Atualizar uma fonte específica

`PATCH https://{subdominio}.kommo.com/api/v4/sources/{id}`

Requer **direitos de administrador**.

| Parâmetro (path) | Tipo | Descrição |
|------------------|------|-----------|
| `id` | integer | ID da fonte a editar |

Corpo (objeto único). Campos do corpo (todos opcionais), conforme a doc oficial:

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `name` | string | Nome da fonte |
| `pipeline_id` | integer | ID do funil (pode estar arquivado) |
| `external_id` | string | ID externo do lado da integração |
| `default` | boolean | Se é a fonte padrão |
| `origin_code` | string | Código do canal de chat (mesmas regras do POST: não nulo, não só números/aspas, máx. 20 chars) |
| `services` | array | Serviços associados — mesma estrutura do POST |

```json
{
  "name": "string (nome da fonte)",
  "pipeline_id": 5867030,
  "external_id": "string (ID externo do lado da integração)",
  "default": true,
  "origin_code": "string (código do canal de chat, máx. 20 chars)",
  "services": [
    {
      "type": "whatsapp",
      "pages": [
        { "name": "string", "id": "string", "link": "string (telefone/usuário)" }
      ],
      "params": {
        "waba": true,
        "is_supports_list_message": true
      }
    }
  ]
}
```

Resposta 200 retorna o objeto da fonte atualizado em `application/hal+json` (mesmo formato do
GET por ID).

### Códigos de resposta

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 400 | "Incorrect data transmitted" |
| 401 | "The integration is not authorized" |
| 404 | "The source id isn't found" |

---

## DELETE — Remover fontes (lote)

`DELETE https://{subdominio}.kommo.com/api/v4/sources`

Requer **direitos de administrador**. Corpo é um **array de objetos** com o `id`.

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `id` | integer | ID da fonte a deletar (a doc oficial descreve este campo como "the external id of the source you want to delete") |

### Corpo da requisição (exemplo oficial)

```json
[
  { "id": 17489247 },
  { "id": 17489251 }
]
```

### Códigos de resposta

| Código | Descrição |
|--------|-----------|
| 204 | "Source has been successfully deleted, but there is nothing to return." — retorna objeto vazio `{}` |
| 401 | "The integration is not authorized" — retorna `{}` |
| 404 | "Bad request: a source with the external id doesn't exist" — retorna texto puro |

---

## DELETE — Remover uma fonte específica

`DELETE https://{subdominio}.kommo.com/api/v4/sources/{id}`

Requer **direitos de administrador**. Não precisa de corpo.

| Parâmetro (path) | Tipo | Descrição |
|------------------|------|-----------|
| `id` | integer | ID da fonte a deletar ("the external ID of the source you want to delete") |

### Códigos de resposta

| Código | Descrição |
|--------|-----------|
| 204 | "Source has been successfully deleted, but there is nothing to return." — retorna `{}` |
| 401 | "The integration is not authorized" |
| 404 | "Bad request: a source with the external id doesn't exist" |

---

## Tabela de campos do objeto Source

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | integer | ID interno da fonte no Kommo (gerado pelo Kommo) |
| `name` | string | Nome da fonte |
| `external_id` | string | Código único do lado da integração; usado para referenciar/filtrar a fonte |
| `pipeline_id` | integer | Funil ao qual a fonte está vinculada (pode estar arquivado); se ausente na criação, usa o funil principal |
| `default` | boolean | Se é a fonte padrão da integração |
| `origin_code` | string \| null | Código do canal de chat principal (máx. 20 chars; não nulo/só números/só aspas quando informado) — pode vir `null` na resposta de fontes que não são de chat |
| `services` | array | Serviços associados (ex.: WhatsApp), com `type`, `pages[]`, `params` |
| `request_id` | string | (Somente nas respostas de POST) eco do índice do item no array, para casar a fonte criada |
| `_links.self.href` | string | Link HAL para a própria fonte |
| `_embedded.sources` | array | Coleção de fontes nas respostas de lista/lote |
| `_total_items` | integer | Total de itens retornados |

---

## Relação com leads de entrada / unsorted (incoming leads)

A fonte é o elo entre a integração e os **leads de entrada (incoming/unsorted leads)**: a fonte
aparece no campo **Fonte** desses leads e a Sources API é o que **define** quais fontes ficam
selecionáveis. A criação dos leads de entrada em si é feita por endpoints de *incoming leads*
(ex.: `POST /api/v4/leads/unsorted/forms` e `.../sip`).

> **Correção importante de referência:** no payload/objeto de **incoming leads (unsorted)**, a
> fonte é representada pelos campos **`source_uid`** ("Incoming lead source UID. Generated by the
> integration") e **`source_name`** ("Incoming lead source name") — **não** por um objeto
> `source` com `external_id`/`type`. Exemplo oficial do objeto unsorted:
>
> ```json
> {
>   "source_uid": "amojo:onlinechat:b4b939f3-5a25-4cab-a4e8-57140f7c72fa",
>   "source_name": "onlinechat:1494984c-db73-4ceb-b980-a20a5de569f2",
>   "category": "chats"
> }
> ```
>
> O objeto `source` com `{ "external_id": "...", "type": "..." }` pertence à criação de **leads
> regulares** via `POST /api/v4/leads` (add complex), dentro de `_embedded.source` — e **não** à
> Sources API nem ao endpoint de unsorted. A modelagem detalhada de incoming leads pertence ao
> recurso *Incoming leads*, não à Sources API.

---

## Limites e rate limits

- **Máximo de 100 fontes por integração** (e no máximo 100 itens por requisição de POST/PATCH/
  DELETE em lote).
- **Rate limit geral da API: no máximo 7 requisições por segundo** ("não mais do que 7
  solicitações por segundo") por conta/integração.
- Métodos de escrita (POST/PATCH/DELETE) exigem **direitos de administrador**.

---

## Pegadinhas e erros comuns (gotchas)

- **`external_id` duplicado → HTTP 400.** Cada fonte precisa de `external_id` único; recriar
  com o mesmo código falha.
- **`pipeline_id` inválido → HTTP 400.** Se o funil não existir, a criação falha. Omitir
  `pipeline_id` joga a fonte no **funil principal** (não é erro, mas pode não ser o desejado).
  Funil arquivado é aceito.
- **`origin_code` tem regras estritas:** quando informado, máx. 20 caracteres e não pode ser
  nulo, conter apenas números, nem conter apenas aspas duplas. Em fontes que não são de chat,
  ele pode legitimamente vir `null` na resposta.
- **Sucesso retorna `application/hal+json`; erros, `application/problem+json`.** Trate os dois
  content-types ao parsear.
- **204 ≠ erro no GET:** lista vazia/filtro sem resultado e GET por ID sem fonte retornam **204
  No Content** (corpo vazio), não 200 com array vazio — não tente ler `_embedded.sources` de um
  corpo vazio.
- **DELETE com id inexistente → 404** ("a source with the external id doesn't exist"); o 404 do
  DELETE em lote retorna **texto puro** (não JSON). O 204 e o 401 retornam `{}`.
- **`source_uid`/`source_name` (não `source.external_id`) nos incoming leads (unsorted).** Não
  confunda com o objeto `source` da criação de leads regulares.
- **Esqueceu de ligar "Multiple sources":** se a integração for gerenciar fontes só por API mas
  a flag não estiver marcada, o Kommo pode criar fontes na instalação. Com a flag ligada,
  **nenhuma** fonte é criada automaticamente — você precisa criar todas via API.
- **Precisa de widget com `"locations": ["lead_sources"]`** no `manifest.json` para a fonte
  aparecer na interface de fontes.
- **`request_id`** só aparece na resposta do POST (ecoando o índice do array); use-o para casar
  cada item criado ao enviar lotes.
- **Operações de escrita sem direitos de administrador falham**, mesmo com OAuth válido de
  usuário comum.

---

## Exemplo de uso (curl)

Criar duas fontes em lote (uma simples e uma WhatsApp oficial):

```bash
curl -X POST "https://meusubdominio.kommo.com/api/v4/sources" \
  -H "Authorization: Bearer ACCESS_TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '[
        {
          "name": "chat",
          "external_id": "Kchat01",
          "origin_code": "kommo.ext.30470678",
          "pipeline_id": 5867030
        },
        {
          "name": "WhatsApp Oficial",
          "external_id": "wa_oficial_01",
          "pipeline_id": 5884544,
          "services": [
            {
              "type": "whatsapp",
              "pages": [
                { "name": "Vendas", "id": "551199999999", "link": "551199999999" }
              ],
              "params": { "waba": true, "is_supports_list_message": true }
            }
          ]
        }
      ]'
```

Listar filtrando por `external_id`:

```bash
curl -X GET "https://meusubdominio.kommo.com/api/v4/sources?filter[external_id][]=Kchat01" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Accept: application/json"
```

Definir uma fonte como padrão (PATCH em lote):

```bash
curl -X PATCH "https://meusubdominio.kommo.com/api/v4/sources" \
  -H "Authorization: Bearer ACCESS_TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '[ { "id": 17619939, "default": true } ]'
```

Deletar uma fonte específica:

```bash
curl -X DELETE "https://meusubdominio.kommo.com/api/v4/sources/17619939" \
  -H "Authorization: Bearer ACCESS_TOKEN_ADMIN"
```

---

## Fontes

- https://developers.kommo.com/reference/sources (e `sources.md`)
- https://developers.kommo.com/reference/get-sources (e `get-sources.md`)
- https://developers.kommo.com/reference/get-source (e `get-source.md`)
- https://developers.kommo.com/reference/add-sources (e `add-sources.md`)
- https://developers.kommo.com/reference/update-sources (e `update-sources.md`)
- https://developers.kommo.com/reference/update-source (e `update-source.md`)
- https://developers.kommo.com/reference/delete-sources (e `delete-sources.md`)
- https://developers.kommo.com/reference/delete-source (e `delete-source.md`)
- https://developers.kommo.com/reference/incoming-leads-list (e `incoming-leads-list.md`) — campos `source_uid`/`source_name` dos unsorted
- https://developers.kommo.com/docs/manifest-json e https://developers.kommo.com/docs/widget-locations — localização `lead_sources`
- https://pt-developers.kommo.com/docs/limita%C3%A7%C3%B5es — rate limit (7 req/s) e limite de 100 fontes
- https://developers.kommo.com/llms.txt — índice dos endpoints de Sources
