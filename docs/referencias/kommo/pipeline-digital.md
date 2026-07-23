# Kommo API — Pipeline Digital (Digital Pipeline / Automações)

## Visão geral

O **Pipeline Digital** (em inglês *Digital Pipeline*, recurso herdado do amoCRM) é o motor de automação da Kommo. Ele permite configurar **reações automáticas do sistema a eventos** que acontecem nos leads — entrada do lead em uma etapa, recebimento de mensagem/e-mail/chamada, visita ao site etc. — e executar **ações** em resposta (criar tarefa, mudar etapa, enviar e-mail, disparar Salesbot, enviar webhook, executar widget e outras).

A configuração visual fica em **Leads → Automatizar (Automate)**: o administrador seleciona uma **etapa**, adiciona um **gatilho (trigger)**, escolhe o evento e a ação, e opcionalmente adiciona **condições** que devem ser satisfeitas para o gatilho disparar.

Para integrações via API, o Pipeline Digital se conecta a três recursos principais que se ancoram em etapas:

- **Salesbot** — bot conversacional disparado por etapa/evento.
- **Webhooks do Pipeline Digital** — notificações POST para sistemas externos, com **lista de eventos própria (reduzida)** e regras de retry próprias.
- **Widgets no Pipeline Digital** — código de integração executado como ação de etapa, capaz de reagir a eventos do pipeline.

> **Distinção importante:** os **webhooks do Pipeline Digital** (configurados dentro de uma etapa, com lista reduzida de eventos: `call_in`, `chat`, `site_visit`, `mail_in`, `status`) são diferentes dos **webhooks gerais da conta** (configurados em **Configurações → Integrações**, com ~30+ eventos, payload `x-www-form-urlencoded` e sub-chaves como `add`/`update`/`delete`/`restore`/`status`/`responsible`). Veja `webhooks.md` para os webhooks gerais.

A base de qualquer automação são as **pipelines (funis)** e suas **etapas (statuses)**. O CRUD completo desses recursos está documentado em `pipelines-status.md`; abaixo há apenas o resumo necessário para ancorar as automações.

---

## 1) Pipelines e Etapas (base da automação)

Toda automação se ancora em uma etapa (`status_id`) de uma pipeline (`pipeline_id`). O detalhamento completo (corpos de criação/edição, paginação, regras de admin) está em `pipelines-status.md`. Resumo:

### Endpoints

Base: `https://{subdominio}.kommo.com`

| Operação | Método | Caminho |
|---|---|---|
| Listar pipelines | GET | `/api/v4/leads/pipelines` |
| Obter pipeline por ID | GET | `/api/v4/leads/pipelines/{id}` |
| Criar pipeline(s) | POST | `/api/v4/leads/pipelines` |
| Editar pipeline | PATCH | `/api/v4/leads/pipelines/{id}` |
| Excluir pipeline | DELETE | `/api/v4/leads/pipelines/{id}` |
| Listar etapas de uma pipeline | GET | `/api/v4/leads/pipelines/{pipeline_id}/statuses` |
| Obter etapa por ID | GET | `/api/v4/leads/pipelines/{pipeline_id}/statuses/{id}` |
| Adicionar etapas | POST | `/api/v4/leads/pipelines/{pipeline_id}/statuses` |
| Editar etapa | PATCH | `/api/v4/leads/pipelines/{pipeline_id}/statuses/{id}` |
| Excluir etapa | DELETE | `/api/v4/leads/pipelines/{pipeline_id}/statuses/{id}` |

Autenticação: **OAuth 2.0 Bearer Token** em todas as chamadas. Criação/edição/exclusão de pipelines e status exigem **usuário administrador**. Respostas em HAL (`application/hal+json`); erros em `application/problem+json`.

### Parâmetros de query

- A documentação oficial **não lista parâmetros de query** para listar/obter pipelines (sem `with`, filtros ou paginação documentados para `/leads/pipelines`).
- `GET .../statuses` aceita **`with=descriptions`** para incluir as descrições das etapas. Fora isso, não há paginação documentada — a listagem é total e os status vêm embutidos.

> **Correção em relação ao rascunho:** o `with=descriptions` é documentado para o endpoint de **statuses**; para `/leads/pipelines` a doc não documenta parâmetros de query.

### Resposta — listar pipelines (estrutura real)

```json
{
  "_total_items": 1,
  "_links": {
    "self": { "href": "https://{subdominio}.kommo.com/api/v4/leads/pipelines" }
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
          "self": { "href": "https://{subdominio}.kommo.com/api/v4/leads/pipelines/6950551" }
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
                "self": { "href": "https://{subdominio}.kommo.com/api/v4/leads/pipelines/6950551/statuses/58141803" }
              }
            }
          ]
        }
      }
    ]
  }
}
```

### Corpo de criação de etapas — `POST .../statuses`

O corpo é um **array de objetos** (uma ou mais etapas):

```json
[
  {
    "name": "Negociação",
    "sort": 100,
    "color": "#fffeb2"
  }
]
```

Resposta de sucesso: **200** ("Stages have been added successfully"); erros possíveis: 400, 401, 403, 422, 500.

### Tabela de campos — Pipeline

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | int | ID da pipeline |
| `name` | string | Nome da pipeline |
| `sort` | int | Ordem de exibição |
| `is_main` | bool | Se é a pipeline principal |
| `is_unsorted_on` | bool | Se a "Entrada não organizada" (Incoming leads / unsorted) está ativa |
| `is_archive` | bool | Se a pipeline está arquivada |
| `account_id` | int | ID da conta |
| `_embedded.statuses` | array | Etapas da pipeline |

### Tabela de campos — Etapa (status)

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | int | ID da etapa (usado como `status_id` nas automações) |
| `name` | string | Nome da etapa |
| `sort` | int | Ordem da etapa |
| `is_editable` | bool | Se a etapa pode ser editada/excluída (`false` nos status de sistema) |
| `pipeline_id` | int | ID da pipeline pai |
| `color` | string | Cor em hex |
| `type` | int | `0` = etapa regular; `1` = "Incoming leads" / "Entrada não organizada" (unsorted) |
| `account_id` | int | ID da conta |

> **Etapas de sistema fixas:** `142` = **Fechado – Ganho** (Won/Successful) e `143` = **Fechado – Perdido** (Lost/Unsuccessful). Esses IDs são **fixos e idênticos em todos os pipelines** da conta e têm `type: 0` e `is_editable: false`. São os valores tipicamente usados em ações de mudança de etapa (ex.: `change_status` do Salesbot). O status "Incoming leads" (unsorted, `type: 1`) recebe um ID **único por pipeline** (não é fixo). *(IDs 142/143 confirmados nos exemplos de criação de pipeline e na ação `change_status` do Salesbot; veja `pipelines-status.md`.)*

---

## 2) Salesbot no Pipeline Digital

### Visão geral

O **Salesbot** é o bot de automação conversacional da Kommo, executado a partir do Pipeline Digital. É montado como um script JSON com **handlers** organizados em três blocos por passo:

- `"question"` — ações ao enviar mensagem ao usuário.
- `"answer"` — ações ao receber resposta do usuário.
- `"finish"` — ações ao concluir o bot.

**Limite de tamanho do JSON do bot: 64 KB.** A numeração de passos começa em **0**.

### Como é disparado (gatilho de etapa)

Configuração no painel: **Leads → Automatizar → selecionar etapa → Adicionar gatilho → Salesbot → Criar novo bot** (ou **Configurações → Ferramentas de comunicação → Salesbots**).

> **Gotcha:** *"Leads que entraram na etapa antes de a ação aparecer no Pipeline Digital serão ignorados, a menos que você marque **Aplicar o gatilho a todos os leads já nesta etapa** (Apply the trigger to all leads already in this stage)."*

### Principais handlers

| Handler | Função |
|---|---|
| `show` | Enviar texto ou botões |
| `buttons` | Processar resposta de botão (correspondência exata) |
| `action` | Executar operação (`change_status`, `set_tag`, `set_custom_fields`, `add_lead_contact`, subscribe…) |
| `condition` | Lógica condicional |
| `validations` | Validar entrada do usuário (regex, email, phone, ranges) |
| `preset` | Algoritmos predefinidos (ex.: `contacts.validate_base_info`) |
| `goto` | Saltar para passo específico |
| `find` | Localizar entidades (contatos / itens de catálogo) |
| `filter` | Buscar entidades por valores de campos personalizados |
| `meta` | Tratar metadados do chat/messenger |
| `widget_request` | Chamar endpoint externo e pausar o bot |
| `send_external_message` | Enviar mensagem por canal externo a contatos específicos |
| `stop` | Encerrar conversa ou iniciar outro bot |

### Exemplos JSON reais

**Enviar texto:**
```json
{
  "handler": "show",
  "params": {
    "type": "text",
    "value": "Por favor, informe seu telefone e e-mail",
    "quick_replies": ["user_phone_number", "user_email"]
  }
}
```

**Enviar botões:**
```json
{
  "handler": "show",
  "params": {
    "type": "buttons",
    "value": "Escolha o tipo de participação:",
    "buttons": ["Presencial", "Online"]
  }
}
```

**Mudar etapa (ação):**
```json
{
  "handler": "action",
  "params": {
    "name": "change_status",
    "params": { "value": 142 }
  }
}
```

**Adicionar tag:**
```json
{
  "handler": "action",
  "params": {
    "name": "set_tag",
    "params": { "type": 2, "value": "salesbot" }
  }
}
```

**Definir campo personalizado:**
```json
{
  "handler": "action",
  "params": {
    "name": "set_custom_fields",
    "params": { "type": 2, "value": "Valor do campo", "custom_fields_id": 123 }
  }
}
```

**Condição:**
```json
{
  "handler": "condition",
  "params": {
    "term1": "chat.origin",
    "term2": "telegram",
    "operation": "=",
    "result": [
      {
        "handler": "action",
        "params": { "name": "change_status", "params": { "value": 123 } }
      }
    ]
  }
}
```
Operadores suportados: `"="`, `"!="`, `"in"`, `"not_in"`, `"in_range"`.

**Validação:**
```json
{
  "handler": "validations",
  "params": {
    "logic": "and",
    "conditions": [
      { "client_value": "{{message_text}}", "type": "email", "condition_value": "", "operation": "contains" }
    ],
    "result": [
      { "handler": "goto", "params": { "type": "question", "step": 3 } }
    ]
  }
}
```
A validação suporta lógica `and`/`or` e tipos como `email`, `phone`, regex e ranges.

**Encerrar / encadear bot:**
```json
{
  "finish": [
    { "handler": "stop", "params": { "action": "talk-close" } }
  ]
}
```
Ações do `stop`: `"talk-close"` (encerra) ou `"salesbot-start"` (inicia outro bot).

### Placeholders comuns

`{{contact.name}}` / `{{name}}`, `{{lead.id}}`, `{{lead.price}}`, `{{lead.responsible.name}}`, `{{lead.responsible_user_id}}`, `{{origin}}`, `{{message_text}}`, `{{current_date}}`, `{{contact.cf.#custom_field_id#}}` / `{{lead.cf.#id#}}`. Suporta regex via `{{regexp./pattern/}}`.

### Lançar Salesbot via API

**Método:** POST
**Caminho:** `https://{subdominio}.kommo.com/api/v2/salesbot/run`

> **Atenção (gotcha):** este endpoint usa o prefixo **`/api/v2/`** (não `v4`), embora autentique via OAuth2 Bearer. O corpo é um **array de objetos**. Resposta de sucesso: **202** (Salesbots lançados); erro: **400**. *(O schema literal de cada objeto — bot_id/entity — não é exposto na página de referência; verificar no "Try It" da doc interativa.)*

### Fluxo `widget_request` e retomada do bot (`continue`)

Quando um passo do bot dispara um `widget_request`, a Kommo envia um POST para sua URL:

```json
{
  "token": "JWT_TOKEN",
  "data": { "message": "Hello! How are you?", "from": "widget" },
  "return_url": "https://subdomain.kommo.com/api/v4/salesbot/321/continue/123"
}
```

- O JWT é assinado com a **secret key do cliente (integração)** — valide a integridade dos dados com ela.
- **Responda em até 2 segundos com HTTP 200** apenas para confirmar o recebimento.

Para **retomar** o bot, faça POST ao `return_url` (confirmação de execução do bloco de widget):

**Método:** POST
**Caminho:** `https://{subdominio}.kommo.com/api/v4/{bot}/{bot_id}/continue/{continue_id}`
*(parâmetros de caminho: `{bot}` = `salesbot` ou `marketingbot`; `{bot_id}`; `{continue_id}` recebido no webhook)*

```json
{
  "data": { "message": "Hello! How are you doing?" },
  "execute_handlers": [
    { "handler": "show", "params": { "type": "text", "value": "Seu texto" } }
  ]
}
```

| Campo | Tipo | Descrição |
|---|---|---|
| `data` | json | Dados para o widget; acessíveis no código do bot via `{{json.NOME_DA_CHAVE}}` |
| `execute_handlers` | json | Handlers a executar na retomada. Suportados (conforme página de referência): **`show` e `goto`** |

Respostas: **202** (aceito) · 400 (dados incorretos) · 401 (não autorizado) · **404** ("Registro do widget aguardando o resultado de execução não foi encontrado").

> **Gotcha:** o bot **não prossegue** até receber a requisição de retomada; e você **não consegue continuar/iniciar** a execução se já houver outro bot rodando para a mesma entidade.

---

## 3) Webhooks no Pipeline Digital

### Visão geral

Webhooks são notificações enviadas por POST a aplicações externas para informá-las de eventos ocorridos na Kommo. Os webhooks **do Pipeline Digital** são configurados como ação de etapa (**API: + Enviar webhook**) e diferem dos webhooks gerais por terem uma **lista de eventos reduzida** e **regras de retry próprias**.

### Eventos disponíveis (lista reduzida)

| Evento | Descrição |
|---|---|
| `call_in` | Chamada recebida |
| `chat` | Mensagem recebida em chat |
| `site_visit` | Visita ao site |
| `mail_in` | E-mail recebido |
| `status` | Mudança de etapa |

### Configuração

Pipeline Digital (**Leads → Automatizar**) → selecionar etapa → **API: + Enviar webhook** → escolher o evento → informar a URL receptora.

### Formato do POST

A estrutura geral é `{"leads": {"<evento>": [ { ...campos da entidade... } ]}}` (chave de topo **`leads`** no plural; valor do evento é um **array**).

**E-mail recebido (`mail_in`):**
```json
{
  "leads": {
    "mail_in": [{
      "id": XXXXXXX,
      "pipeline_id": 1111XXX,
      "status_id": 2222XXX
    }]
  }
}
```

**Mudança de etapa (`status`):**
```json
{
  "leads": {
    "status": [{
      "id": XXXXXXX,
      "old_pipeline_id": 123XXX,
      "pipeline_id": 321XXXX,
      "old_status_id": 567XXXX,
      "status_id": 765XXXX
    }]
  }
}
```

> **Correção em relação ao rascunho:** os exemplos literais da doc do Pipeline Digital mostram os IDs como **valores numéricos sem aspas** (placeholders `XXXXXXX`), e não como strings entre aspas. O rascunho afirmava que "os valores chegam como strings" — isso **não é sustentado** pela doc do Pipeline Digital. (Observação prática: os **webhooks gerais da conta** chegam como `x-www-form-urlencoded`, onde tudo trafega como texto — não confundir com o payload JSON do Pipeline Digital.)

### Tabela de campos

| Campo | Descrição |
|---|---|
| `id` | ID do lead |
| `pipeline_id` | ID da pipeline atual/nova |
| `old_pipeline_id` | ID da pipeline anterior (apenas no evento `status`) |
| `status_id` | ID da nova etapa |
| `old_status_id` | ID da etapa anterior (apenas no evento `status`) |

### Limites e regras

- **Retry:** até **4 tentativas em 1 hora** caso a aplicação não responda corretamente.
- **Suspensão automática:** após **mais de 100 respostas inválidas em 5 minutos**, o webhook é suspenso, com **cooldown de 5 minutos** antes de retomar.

---

## 4) Widgets no Pipeline Digital

### Visão geral

Widgets podem agir como ação dentro de uma etapa do Pipeline Digital e reagir a eventos (e-mail recebido, chamada, mensagem de chat, mudança de etapa, visita ao site). Para isso, o **`manifest.json`** deve declarar a **location `digital_pipeline`** e um bloco **`dp/settings`**.

### Eventos do Pipeline Digital (códigos)

| Código (`type`) | `type_code` | Descrição |
|---|---|---|
| 1 | `lead_added` | Lead adicionado |
| 14 | `lead_status_changed` | Mudança de etapa que ativa o widget |
| 15 | `lead_appeared_in_status` | Mudança de etapa dentro de ação estendida (multi-etapas) |
| 16 | `mail_in` | E-mail recebido |
| 17 | `call_in` | Chamada recebida |
| 18 | `site_visit` | Visita ao site |
| 19 | `chat` | Mensagem de chat recebida |

### `action_multiple` e `direction_of_movement`

- **`action_multiple: true`** faz a ação do widget se estender por **múltiplas etapas**, disparando eventos do tipo **15 (`lead_appeared_in_status`)** quando o lead se move entre essas etapas.
- **`direction_of_movement`** indica o sentido do movimento:
  - `went_to_trigger` — lead entrou na etapa do gatilho (de fora para dentro);
  - `went_in_trigger` — movimento dentro da zona estendida do gatilho (requer `action_multiple: true`);
  - `went_from_trigger` — lead saiu da etapa do gatilho.

### `manifest.json` — declaração

```json
"locations": [
  "settings",
  "digital_pipeline"
],
"dp": {
  "settings": {
    "message": {
      "name": "settings.message",
      "type": "text",
      "required": true
    }
  }
}
```

### Payload enviado ao widget quando o evento dispara (exemplo real)

```json
{
  "event": {
    "type": 15,
    "type_code": "lead_appeared_in_status",
    "data": {
      "id": 123123,
      "element_type": 2,
      "status_id": 654321,
      "pipeline_id": 123456,
      "direction_of_movement": "went_to_trigger"
    },
    "time": 1491300016
  },
  "action": {
    "settings": {
      "widget": {
        "settings": {}
      }
    }
  },
  "subdomain": "my_company",
  "account_id": "XXXXXXX"
}
```

### Tabela de campos (payload do evento)

| Campo | Tipo | Descrição |
|---|---|---|
| `event.type` | int | Código do evento (tabela acima) |
| `event.type_code` | string | Nome do evento |
| `event.data.id` | int | ID da entidade (lead) |
| `event.data.element_type` | int | Tipo da entidade (`2` = lead) |
| `event.data.status_id` | int | Etapa atual |
| `event.data.pipeline_id` | int | Pipeline atual |
| `event.data.direction_of_movement` | string | `went_to_trigger` / `went_in_trigger` / `went_from_trigger` |
| `event.time` | int | Timestamp Unix do evento |
| `action.settings` | obj | Configurações do widget definidas em `dp/settings` |
| `subdomain` | string | Subdomínio da conta |
| `account_id` | string | ID da conta |

### Recursos adicionais

- **Placeholders** para auto-preencher dados de lead/contato/empresa nas mensagens.
- Opção de enviar informação **apenas ao contato principal** (main contact).
- **Logging:** registrar eventos de sistema no perfil da entidade via nota com `"note_type": "extended_service_message"`.
- Integração com **Salesbot** e disparo de **webhooks** para servidores externos (recursos sujeitos ao plano da conta).

---

## 5) Gatilhos por etapa e condições de disparo (configuração do recurso)

O Pipeline Digital oferece um conjunto de **gatilhos (triggers)** anexáveis a uma etapa:

1. **Salesbot** — responde clientes, qualifica leads, automatiza.
2. **Adicionar tarefa** (Add Task).
3. **Criar lead** (Create Lead) — a partir de dados de um lead existente.
4. **Enviar e-mail** (Send Email) — com templates.
5. **Enviar webhook** (Send Webhook).
6. **Mudar etapa do lead** (Change Lead Stage) — inclusive entre pipelines.
7. **Adicionar/remover tags** (Add Tags).
8. **Completar tarefas** (Complete Tasks).
9. **Gerar formulário** (Generate Form).
10. **Mudar responsável** (Change Lead's User).
11. **Mudar campo** (Change Field) — em massa.
12. **Excluir arquivos** (Delete Files).

**Eventos que iniciam um gatilho:** criação de novo lead na etapa; entrada/movimento do lead na etapa; recebimento de e-mail/chat/chamada; ações comportamentais do lead; e gatilhos **agendados**. As categorias documentadas são: *pipeline triggers*, *scheduled triggers*, *behavior-based triggers* e *conversational triggers*.

**Condições de disparo (filtros):** é possível adicionar **uma ou várias condições** que precisam ser satisfeitas para o gatilho rodar:

- **Tags específicas** (ex.: só leads com tag `VIP`);
- **Campos personalizados** com valores específicos;
- **Usuário responsável**;
- **Fonte/origem do lead**.

Exemplo: definir a tag `VIP` como condição faz a ação (ex.: criar tarefa) ser executada apenas para os leads na etapa que tenham essa tag.

---

## Limites / Rate limits

- **JSON do Salesbot:** máximo **64 KB**.
- **Webhook do Pipeline Digital:** **retry** de até **4 tentativas em 1 hora**; **suspensão** após **mais de 100 respostas inválidas em 5 min**, com **cooldown de 5 min**.
- **`widget_request` (Salesbot):** confirmar recebimento em **≤ 2 s** com HTTP **200**.
- **API geral v4:** rate limit retorna HTTP **429** quando excedido. *(O limite numérico exato de requisições/segundo não é declarado nestas páginas — verificar em `conceitos-gerais-api.md`.)*
- Apenas **uma execução de bot por entidade** ao mesmo tempo (não é possível continuar/iniciar um bot se outro já roda para a mesma entidade).

## Pegadinhas e erros comuns (gotchas)

- **Leads pré-existentes na etapa são ignorados** ao criar um gatilho de Salesbot, salvo se marcar "Aplicar a todos os leads já nesta etapa".
- O endpoint **Launch Salesbot usa `/api/v2/`**, não `v4` — caminho fácil de errar.
- Em webhooks do Pipeline Digital, a **lista de eventos é reduzida** (5 eventos) — não confundir com os ~30+ eventos dos **webhooks gerais da conta**. Os exemplos do Pipeline Digital mostram IDs **numéricos** no JSON; os webhooks gerais chegam como `x-www-form-urlencoded`.
- `old_pipeline_id` e `old_status_id` **só aparecem no evento `status`** (mudança de etapa).
- Evento **15 (`lead_appeared_in_status`)** só ocorre quando o widget usa **`action_multiple: true`** (ação estendida por várias etapas); sem isso, use 14 (`lead_status_changed`).
- Na retomada do Salesbot (`continue`), **apenas `show` e `goto`** são aceitos em `execute_handlers` (conforme a página de referência). HTTP **404** significa que não há registro de widget aguardando resultado (o bot pode já ter avançado/encerrado).
- O **JWT** enviado no `widget_request` é assinado com a **secret key da integração** — valide-o; não confie no payload sem verificação.
- IDs de etapa **142 (Ganho)** e **143 (Perdido)** são reservados/de sistema e **fixos em todos os pipelines**; o status "Incoming leads" (`type: 1`) tem ID **único por pipeline** (não é fixo).

## Exemplo de uso (cenário concreto)

Disparar um webhook do Pipeline Digital quando um lead muda de etapa e processar no seu servidor:

1. No painel: **Leads → Automatizar → etapa "Negociação" → API: + Enviar webhook → evento `status` (mudança de etapa) → URL `https://meu-servidor.com/kommo`**.
2. Quando um lead entra/muda nessa etapa, a Kommo envia (IDs numéricos):
```json
{
  "leads": {
    "status": [{
      "id": 2048102,
      "old_pipeline_id": 3177727,
      "pipeline_id": 3177727,
      "old_status_id": 32392159,
      "status_id": 32392162
    }]
  }
}
```
3. Seu servidor responde **HTTP 200** e, se quiser enriquecer o lead, busca os detalhes via API v4:
```bash
curl -s 'https://meusub.kommo.com/api/v4/leads/2048102' \
  -H 'Authorization: Bearer SEU_ACCESS_TOKEN' \
  -H 'accept: application/json'
```

---

## Fontes

- https://developers.kommo.com/docs/salesbot-dp — Salesbot no Pipeline Digital (handlers, exemplos JSON, limite 64 KB, gatilho)
- https://developers.kommo.com/docs/webhooks-dp — Webhooks no Pipeline Digital (eventos, payloads `{"leads":{...:[...]}}`, retry/suspensão)
- https://pt-developers.kommo.com/docs/webhooks-no-pipeline-digital — Versão pt-BR dos webhooks do Pipeline Digital (confirma chave `leads` e IDs numéricos)
- https://developers.kommo.com/docs/widgets-dp — Widgets no Pipeline Digital (eventos, manifest `dp/settings`, payload de evento, `action_multiple`, `direction_of_movement`)
- https://developers.kommo.com/docs/private-chatbot-integration — Integração de chatbot privado (`widget_request`, `return_url`, retomada do bot, regra de 2 s)
- https://developers.kommo.com/reference/launch-salesbot — Launch Salesbot (`POST /api/v2/salesbot/run`, 202/400)
- https://developers.kommo.com/reference/salesbot-widget-block-execution-confirmation — Confirmação de execução de bloco de widget (`POST .../{bot}/{bot_id}/continue/{continue_id}`, `data`/`execute_handlers` com `show`/`goto`, 202/400/401/404)
- https://developers.kommo.com/reference/pipelines-list — Listar pipelines (GET `/api/v4/leads/pipelines`)
- https://developers.kommo.com/reference/get-pipeline-by-id — Obter pipeline por ID
- https://developers.kommo.com/reference/stages-list — Listar etapas (GET `.../pipelines/{pipeline_id}/statuses`, query `with=descriptions`)
- https://developers.kommo.com/reference/add-stages — Adicionar etapas (POST `.../statuses`, corpo array de objetos)
- https://developers.kommo.com/reference/leads-pipelines-and-stages — Índice de Pipelines e Stages da API v4
- https://developers.kommo.com/docs/webhooks-general — Webhooks gerais da conta (distinção vs. Pipeline Digital)
- https://support.kommo.com/docs/set-up-digital-pipeline-triggers — Tipos de gatilhos, eventos e condições de disparo do Pipeline Digital
