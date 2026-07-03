# Kommo API — Salesbot — estrutura e ações

> **Nota de fidelidade à documentação.** A documentação oficial da Kommo **não** usa os nomes
> `send_message`, `send_hook`, `edit_lead`, `execution_condition` nem `model.text` para o Salesbot.
> Os nomes reais são:
> - `show` e `send_external_message` → envio de mensagem (não existe `send_message`).
> - `widget_request` → webhook/hook externo (não existe `send_hook`).
> - `action` com `change_status` / `change_responsible_user` / `set_custom_fields` / `set_budget` etc.
>   → edição do lead (não existe `edit_lead`).
> - `condition` (singular) → condição lógica do bot. `conditions` (plural) **só** aparece no SDK de widget.
>
> `execution_condition` e `model.text` **não existem** na estrutura do Salesbot da Kommo (são conceitos
> de outra plataforma). Onde o termo solicitado não existe, ele está mapeado para o termo oficial.

## Visão geral

O **Salesbot** é o bot de automação de chats da Kommo, configurado dentro do **Pipeline Digital**
(Digital Pipeline). Ele executa ações sobre leads/contatos, responde em chats automaticamente e
integra com serviços externos via webhook.

Há duas formas de criar/editar um bot na interface:
1. **Leads ➡️ Automatizar ➡️ selecionar etapa ➡️ Adicionar Gatilho ➡️ Salesbot.**
2. **Configurações ➡️ Ferramentas de comunicação ➡️ Salesbots ➡️ Criar novo bot ou importar.**

No editor, **View Source** mostra/edita o JSON do bot. Leads que já estavam na etapa antes do gatilho
são ignorados, exceto se marcar **"Aplicar o gatilho a todos os leads já nesta etapa"**.

A "linguagem" do Salesbot é um **array/objeto JSON de passos (steps)**. Cada passo é um objeto que pode
conter as chaves `question`, `answer` e `finish`. A contagem de passos começa em **0** (relevante para
`goto` e `wait_answer`).

```json
[
  {
    "question": [
      { "handler": "show", "params": { "type": "text", "value": "Please provide your phone number and email" } },
      { "handler": "action", "params": { "name": "set_tag", "params": { "type": 2, "value": "salesbot" } } }
    ],
    "answer": [
      { "handler": "preset", "params": {
          "name": "contacts.validate_base_info",
          "params": {
            "empty_email": "Please provide your e-mail",
            "empty_phone": "Please provide your phone number",
            "invalid_phone": "It appears that the phone number may be incorrect",
            "success": "Thank you",
            "empty_all": "Please provide your phone number and email"
          }
      } }
    ]
  }
]
```

- **`question`** — ações executadas quando o bot envia uma mensagem ao usuário.
- **`answer`** — ações executadas quando o usuário responde.
- **`finish`** — ações executadas quando o bot termina.
- Pode haver vários passos. **Limite: o JSON do bot não pode exceder 64KB.** Valide o JSON antes de salvar.

### Bloco de tratamento de erro (`error`)
Se uma mensagem do bot não puder ser entregue (ex.: cliente bloqueou o chat), um bloco `error` no nível
do objeto raiz executa handlers de fallback:

```json
{
  "0": { "question": [ ], "answer": [ ] },
  "error": [
    { "handler": "action", "params": { "name": "change_status", "params": { "value": 142 } } }
  ]
}
```

---

## Variáveis / placeholders (handler `show` e demais blocos de texto)

| Placeholder | Descrição |
| :--- | :--- |
| `{{contact.name}}`, `{{name}}` | Nome do contato |
| `{{lead.id}}` | ID do lead |
| `{{contact.id}}` | ID do contato |
| `{{origin}}` | Origem do lead (Telegram, Viber, Facebook) |
| `{{lead.source_id}}` | ID da fonte do lead |
| `{{message_text}}` | Mensagem recebida do cliente (no bloco `answer`) |
| `{{lead.cf.#custom_field_id#}}`, `{{contact.cf.#custom_field_id#}}`, `{{company.cf.#custom_field_id#}}` | Valor de campo personalizado de lead/contato/empresa. Substitua `#custom_field_id#` pelo ID do campo |
| `{{rand}}` | String aleatória |
| `{{short_rand}}` | String aleatória curta |
| `{{short_rand_num}}` | Número aleatório de 1111 a 9999 |
| `{{message_text.email}}` | Email (se presente na mensagem do cliente) |
| `{{message_text.phone}}` | Telefone (se presente na mensagem do cliente) |
| `{{regexp./([1-9]+) things /}}` | Valor por expressão regular extraído da resposta do usuário (usa o grupo entre parênteses); usável no bloco `answer` |
| `{{lead.price}}` | Valor de venda do lead |
| `{{current_date}}` | Data atual |
| `{{lead.status_id}}` | ID da etapa do lead |
| `{{cf.talk.nps}}` | Avaliação da conversa (NPS) |
| `{{lead.responsible.id}}`, `{{contact.responsible.id}}`, `{{company.responsible.id}}` | ID do usuário responsável |
| `{{lead.responsible.name}}`, `{{contact.responsible.name}}`, `{{company.responsible.name}}` | Nome do responsável |
| `{{lead.responsible.email}}`, `{{contact.responsible.email}}`, `{{company.responsible.email}}` | Email do responsável |
| `{{last_validation_result}}` | Dado da última condição de `validations` que retornou verdadeiro |
| `{{founded_id}}` | ID do primeiro item de lista encontrado (após `find`) |
| `{{contact_double.*}}` | Campos da duplicata de contato encontrada (após `find` — ex.: `{{contact_double.cf.3574}}`) |
| `{{external_lead.*}}`, `{{external_contact.*}}` | Campos do lead/contato encontrado pelo `filter` (ex.: `{{external_contact.cf.333}}`) |
| `{{json.CHAVE}}` | Dado retornado pelo `widget_request` / pela confirmação de bloco de widget |
| `{{visitor_uid}}` | UID do visitante (links sociais) |
| `{{session_id}}` | ID da sessão (WhatsApp/Telegram) |

> A enumeração de campo no formato `{{lead.cf.FIELD.ENUM}}` **não existe** como placeholder na doc.
> Para campos com enum (telefone/email), o `enum` é passado como **parâmetro** dentro da ação
> (ex.: `"enum": "WORK"`) — não dentro do placeholder. Confirmado: aparece como parâmetro em
> `set_custom_fields`, `add_lead_contact` (dentro de `values`) e `filter`.

---

## Handlers (steps/ações dentro de `question`/`answer`/`finish`)

| Código | Descrição |
| :--- | :--- |
| `show` | Envia mensagem com texto/botões |
| `buttons` | Processa resposta vinda de botões |
| `action` | Executa uma ação (mudar etapa, tag, campos, etc.) |
| `meta` | Processa metadados (deep-link) |
| `condition` | Condição lógica |
| `validations` | Validação de entrada |
| `preset` | Processa dados por algoritmo pré-definido |
| `goto` | Salta para um passo específico |
| `wait_answer` | Aguarda a resposta |
| `find` | Busca entidade (duplicata de contato ou item de lista) |
| `filter` | Filtra entidade por valor de campo |
| `send_internal` | Envia mensagem interna no chat do lead |
| `send_external_message` | Envia mensagem externa com escolha de destinatário/canal |
| `widget_request` | Envia webhook para URL externa (somente em step de Widget) |
| `stop` | Encerra o bot |

### `show` — enviar mensagem (o que o pedido chamou de "send_message")
Tipos: `text`, `buttons`, `buttons_url`. Aceita os placeholders acima.

```json
{ "handler": "show", "params": {
    "type": "text",
    "value": "Please provide your phone number and e-mail",
    "quick_replies": ["user_phone_number", "user_email"]
} }
```
| Parâmetro | Tipo | Descrição |
| :--- | :--- | :--- |
| `type` | string | `"text"`, `"buttons"` ou `"buttons_url"` |
| `value` | string | Texto enviado (no Messenger, texto > 80 caracteres é truncado em botões) |
| `quick_replies` | array | Apenas Facebook: `"user_phone_number"`, `"user_email"` |
| `buttons` | array | Para `buttons`: array de strings. Para `buttons_url`: array de `{ "text", "url" }` |
| `accept_unsorted` | bool | Processar (ou não) leads recebidos/não-organizados na primeira resposta |

```json
{ "handler": "show", "params": {
    "type": "buttons_url",
    "value": "Links to external resources",
    "buttons": [
      { "text": "Bing", "url": "https://www.bing.com" },
      { "text": "Google", "url": "https://google.com" }
    ]
} }
```

### `buttons` — processar resposta de botões
Vai dentro do bloco `answer`. Cada item usa `value` (correspondência exata) **ou** `regex`. Exemplo
oficial com `regex`:

```json
{ "handler": "buttons", "params": [
    { "regex": "/offline/iu", "params": [
        { "handler": "action", "params": {
            "name": "set_custom_fields",
            "params": { "type": 2, "value": "Offline", "custom_fields_id": 4242 }
        } }
    ] },
    { "regex": "/online/iu", "params": [
        { "handler": "action", "params": {
            "name": "set_custom_fields",
            "params": { "type": 2, "value": "Online", "custom_fields_id": 4242 }
        } }
    ] }
] }
```
Forma com `value` (correspondência exata): `{ "value": "Online", "params": [ ] }`.

### `action` — ações sobre a entidade (o que o pedido chamou de "edit_lead")
Estrutura: `{ "handler": "action", "params": { "name": "<AÇÃO>", "params": { ... } } }`.

| Ação (`name`) | Descrição |
| :--- | :--- |
| `unsorted` | Aceitar/recusar lead recebido: `{ "value": "accept" \| "decline" }` |
| `change_status` | Mudar etapa: `{ "value": 142 }` (opcional `"entity": "double"` p/ atuar no lead do contato encontrado) |
| `set_tag` | Adicionar tag: `{ "type": 2, "value": "Salesbot" }` (1-contato, 2-lead; aceita `{{origin}}`) |
| `unset_tag` | Remover tag: `{ "type": 2, "value": "Salesbot" }` |
| `set_custom_fields` | Setar campo personalizado (ver abaixo) |
| `subscribe` | Inscrever usuário/grupo no chat: `{ "type": "group"\|"user", "value": 111 }` |
| `unsubscribe` | Desinscrever: `{ "type": "group"\|"user"\|"all", "value": 111 }` |
| `add_lead_contact` | Criar lead + contato vinculados (ver abaixo; suporta `preset: "contacts.require_email_or_phone"`) |
| `set_budget` | Setar venda do lead (aceita fórmula com `+ - * /` e parênteses): `{ "value": "{{lead.cf.555123}}*{{lead.cf.555321}}" }` |
| `add_linked_company` | Adicionar empresa: `{ "name": "{{message_text}}" }` |
| `add_note` | Adicionar nota: `{ "element_type": 1\|2, "note_type": 4, "text": "..." }` |
| `link` | Vincular elementos (`from`, `from_id`, `to`, `to_id`, `to_catalog_id`, `quantity`) |
| `change_responsible_user` | Mudar responsável (ver abaixo) |
| `link_to_unsorted` | Vincular chat de lead recebido a um contato (`entity_type`, `entity_id`, `contact_id`) |

**`set_custom_fields`** — exemplo oficial:
```json
{ "handler": "action", "params": {
    "name": "set_custom_fields",
    "params": { "type": 2, "value": "{{message_text.email}}", "custom_fields_id": 987 }
} }
```
| Parâmetro | Tipo | Descrição |
| :--- | :--- | :--- |
| `type` | int | 1-contato, 2-lead |
| `value` | string | Valor (aceita placeholders e `{{last_validation_result}}`) |
| `custom_fields_id` | int | ID do campo |
| `custom_field` | string | Identificador alternativo: `{{lead.price}}`, `{{lead.name}}`, `{{contact.name}}`, `{{cf.talk.nps}}` |
| `enum` | string | Categoria do valor para campos multi-enum (ex.: `"WORK"` em telefone/email) |
| `calculated` | bool | Calcular por fórmula (ex.: `{{lead.cf.123}} * {{lead.cf.456}}`) |
| `option` | string | `"add"` para adicionar valor (telefone, email, lista multiseleção) |

**`add_lead_contact`** — exemplo oficial completo:
```json
{ "handler": "action", "params": {
    "name": "add_lead_contact",
    "params": {
      "preset": "contacts.require_email_or_phone",
      "lead": {
        "name": "Lead name", "status_id": 142, "responsible_user_id": 123, "price": 2000, "tags": "",
        "custom_fields": [ { "id": 77744111, "values": [ { "value": "{{contact.name}}" } ] } ]
      },
      "contact": {
        "name": "Contact name", "responsible_user_id": 123, "tags": "",
        "custom_fields": [ { "id": 77744444, "values": [ { "value": "{{message_text.email}}", "enum": "WORK" } ] } ]
      }
    }
} }
```

**`change_responsible_user`**
```json
{ "handler": "action", "params": {
    "name": "change_responsible_user",
    "params": { "value": 123, "type": 2 }
} }
```
| Parâmetro | Tipo | Descrição |
| :--- | :--- | :--- |
| `value` | int | ID do usuário a tornar responsável |
| `type` | int | Opcional: 1-contato, 2-lead (padrão 2) |

### `goto` / `wait_answer`
```json
{ "handler": "goto", "params": { "type": "question", "step": 3 } }
```
`type`: `"question"`, `"answer"` ou `"finish"` (em `goto`); `"question"`/`"answer"` em `wait_answer`.
`step`: int (começa em 0).

### `condition` — condição lógica (singular)
```json
{ "handler": "condition", "params": {
    "term1": "chat.origin",
    "term2": "telegram",
    "operation": "=",
    "result": [
      { "handler": "action", "params": { "name": "change_status", "params": { "value": 123 } } }
    ]
} }
```
| Parâmetro | Tipo | Descrição |
| :--- | :--- | :--- |
| `term1` | string | `lead.tags`, `chat.origin`, ou qualquer placeholder (ex.: `{{contact.name}}`) |
| `term2` | string/obj | Valor a comparar; para `in_range` é objeto `{ "from", "to" }` |
| `operation` | string | `"="`, `"!="`, `"in"`, `"not_in"`, `"in_range"` |
| `result` | array | Handlers executados se verdadeiro |

Operadores: `=`/`!=` (igualdade); `in`/`not_in` (divide por vírgula e busca ocorrências);
`in_range` (números de `term1` dentro do range de `term2`).

> O handler no plural **`conditions`** (com `logic` + `conditions[]` + `result[]`) **não aparece** na doc
> do Pipeline Digital — só surge no **SDK de widget** (no JSON retornado por `onSalesbotDesignerSave`,
> junto de `widget_request` e `exits`). Na lógica padrão de bot, use `condition` (singular).

### `validations` — validação de entrada
```json
{ "handler": "validations", "params": {
    "logic": "and",
    "conditions": [
      { "client_value": "{{message_text}}", "type": "regex", "condition_value": "/[0-9]+/", "operation": "contains" },
      { "client_value": "{{message_text}}", "type": "simple", "condition_value": "654", "operation": "equal" },
      { "client_value": "{{message_text}}", "type": "range_numbers", "condition_value": { "from": 123, "to": 321 }, "operation": "contains" },
      { "client_value": "{{message_text}}", "type": "email", "condition_value": "", "operation": "contains" }
    ],
    "result": [ { "handler": "goto", "params": { "type": "question", "step": 3 } } ]
} }
```
- `logic`: `"and"` (todas) / `"or"` (qualquer uma).
- Tipos de condição: `simple` (`equal`/`not_equal`/`length`), `email`/`phone` (`contains`/`not_contains`,
  `condition_value: ""`), `regex` (`contains`/`not_contains`), `range_numbers` (`condition_value` é
  objeto `{from,to}`, `contains`/`not_contains`).

### `find` / `filter`
`find` localiza `contact_double` (duplicata do contato) ou `catalog_elements` (item de lista).
Exemplos oficiais:
```json
{ "handler": "find", "params": {
    "type": "contact_double",
    "params": {
      "type": "name",
      "actions": [
        { "handler": "show", "params": {
            "type": "buttons", "value": "Is it your number {{contact_double.cf.3574}}?", "buttons": ["Yes", "No"]
        } }
      ]
    }
} }
```
```json
{ "handler": "find", "params": {
    "type": "catalog_elements",
    "params": {
      "value": "Salesbot", "catalog_id": "15123",
      "actions": [
        { "handler": "show", "params": { "type": "buttons", "value": "Element found: {{founded_id}}", "buttons": ["Yes", "No"] } }
      ]
    }
} }
```
`filter` localiza entidade por valor de campo (`type`: 1-contato, 2-lead; `value`; `custom_fields_id`;
`actions[]`):
```json
{ "handler": "filter", "params": {
    "type": 2, "value": "{{lead.cf.111}}", "custom_fields_id": 222,
    "actions": [ { "handler": "action", "params": {
        "name": "set_custom_fields",
        "params": { "type": 1, "value": "{{external_contact.cf.333}}", "custom_fields_id": 444, "enum": "WORK" }
    } } ]
} }
```

### `meta`
Processa dados de deep-link recebidos ao iniciar o chat. `delimiter` separa o conteúdo; `values[]`
define onde gravar (tags ou `lead.custom_fields.<id>`).

### `preset`
- `contacts.validate_base_info` — coleta/valida email e telefone, pedindo o que faltar. Parâmetros:
  `empty_email`, `empty_phone`, `invalid_phone`, `success`, `empty_all`, e (opcionais)
  `check_doubles`, `phone_doubles`, `email_doubles`, `all_doubles`, `use_quick_replies`.
- `contacts.get_base_info` — obtém info sem perguntas adicionais (sem parâmetros).

### `send_internal` — mensagem interna no chat do lead
```json
{ "handler": "send_internal", "params": {
    "entity_id": "{{lead.id}}", "entity_type": 2, "message": "Hi there!"
} }
```
Opcionais `group_id` / `user_id`. Se ambos forem passados, a mensagem vai para o **grupo**.
`entity_type` só aceita `2` (lead).

### `send_external_message` — mensagem externa (destinatário/canal específicos)
Diferença em relação ao `show`: permite escolher destinatários e canais. Exemplo oficial (botões com URL):
```json
{ "handler": "send_external_message", "params": {
    "message": {
      "type": "external",
      "text": "Buttons with links",
      "buttons": [
        { "type": "url", "text": "Google", "url": "https://google.com" },
        { "type": "url", "text": "YouTube", "url": "https://youtube.com" }
      ]
    },
    "recipient": { "type": "main_contact", "way_of_communication": "over_all" },
    "channels": [],
    "metadata": { "facebook_tag": "CONFIRMED_EVENT_UPDATE" },
    "on_error": null
} }
```
| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `message.type` / `message.text` | string | Tipo (`external`) e texto |
| `message.buttons[]` | array | `type` (`inline`/`url`), `text`, `url` |
| `recipient.type` | string | `all_contacts`, `main_contact`, `filtered_contacts` |
| `recipient.way_of_communication` | string | `over_all`, `any_first`, `last_active` |
| `recipient.filter` | obj | Para `filtered_contacts`: configurado como o handler `condition` (logic/conditions) |
| `channels[]` | array | IDs das fontes/canais (pode ser vazio) |
| `metadata.facebook_tag` | string | Tag p/ envio fora da janela de 24h |
| `on_error` | obj/null | Handler executado em erro de envio |

### `widget_request` — webhook externo (o que o pedido chamou de "send_hook")
> ⚠️ Só pode ser usado a partir de um **step de Widget** do Salesbot.
```json
{ "handler": "widget_request", "params": {
    "url": "https://example.com/endpoint",
    "data": { "contact": "{{contact.name}}", "from": "widget" }
} }
```
O endpoint recebe um **POST** e deve responder **HTTP 200 em até 2 segundos**. Corpo recebido pelo
endpoint:
```json
{
  "token": "JWT_TOKEN",
  "data": { "contact": "Contact name", "from": "widget" },
  "return_url": "https://subdomain.kommo.com/api/v4/salesbot/321/continue/123"
}
```
**JWT** (assinado com a chave secreta da integração) contém: `account_id`, `subdomain`, `entity_type`,
`entity_id`, `client_uid`. Para retomar o bot é preciso chamar a `return_url` (endpoint de confirmação
de bloco de widget — ver abaixo). O bot não continua até receber essa chamada, e não continua se outro
bot já estiver rodando para a mesma entidade. A resposta pode trazer `{{json.CHAVE}}` para uso nos
blocos seguintes.

### `stop` — encerrar
```json
{ "finish": [
    { "handler": "stop", "params": { "action": "talk-close" } },
    { "handler": "stop", "params": { "action": "salesbot-start", "bot": 1234 } }
] }
```
`action`: `"talk-close"` (fecha conversa / dispara NPS se for bot de NPS) ou `"salesbot-start"`
(lança outro bot; `bot` obrigatório).

---

## Endpoints da API (gerência de bots)

Base: `https://{subdominio}.kommo.com`. Autenticação OAuth2 (Bearer token). `Content-Type: application/json`.

> **Importante (confirmado no índice oficial `llms.txt`):** a API só expõe operações de **listar, obter,
> lançar (individual e em lote), parar e continuar (bloco de widget)**. **Não existe** endpoint público
> para **criar, editar/atualizar ou excluir** um Salesbot, nem para editar o JSON do bot via API — a
> criação/importação é feita pela interface (View Source).

### 1. Listar Salesbots
**GET** `https://{subdominio}.kommo.com/api/v4/bots`

Query params: `page` (int), `limit` (int, máx 250), `filter[type_functionality][]`
(`regular`|`greeting`|`marketing`|`nps`), `filter[id][]` (array de int), `with` (string separada por
vírgulas; valor suportado: `favorite`).

```bash
curl -X GET 'https://meusubdominio.kommo.com/api/v4/bots?page=1&limit=250' \
  -H 'Authorization: Bearer ACCESS_TOKEN'
```
Resposta `200` (`application/hal+json`):
```json
{
  "_total_items": 1,
  "_page": 1,
  "_page_count": 1,
  "_links": { "self": { "href": "https://subdomain.kommo.com/api/v4/bots/?page=1&limit=250" } },
  "_embedded": { "items": [
    {
      "id": 250704,
      "name": "Salesbot #1",
      "type_functionality": "regular",
      "is_visual_editor": true,
      "settings": { "active": true }
    }
  ] }
}
```
`204` quando não há bots.

### 2. Obter Salesbot por ID
**GET** `https://{subdominio}.kommo.com/api/v4/bots/{id}`

Path: `id` (int). Query: `with` (`favorite`). Resposta `200`:
```json
{
  "id": 12345,
  "name": "Salesbot",
  "type_functionality": "regular",
  "is_visual_editor": true,
  "settings": { "active": false },
  "_links": { "self": { "href": "https://subdomain.kommo.com/api/v4/bots/12345/" } }
}
```
`204` se o bot não existir. Erros: `400` (dados inválidos), `401` (não autenticado).

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | int | ID do Salesbot |
| `name` | string | Nome |
| `is_visual_editor` | bool | `true` = editor visual; `false` = modo texto (código) |
| `type_functionality` | string | `regular`, `greeting`, `marketing`, `nps` |
| `settings.active` | bool | Se está ativo |
| `is_favorite` | bool | Só com `with=favorite` |

### 3. Lançar um Salesbot
**POST** `https://{subdominio}.kommo.com/api/v4/bots/{id}/run`

Path: `id` (int). Corpo:
```json
{ "entity_id": 76687686, "entity_type": "leads" }
```
| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `entity_id` | int | ID da entidade vinculada ao contato do chat, ou ID do próprio contato do chat |
| `entity_type` | string | `leads` ou `contacts` |

```bash
curl -X POST 'https://meusubdominio.kommo.com/api/v4/bots/12345/run' \
  -H 'Authorization: Bearer ACCESS_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"entity_id":76687686,"entity_type":"leads"}'
```
Sucesso `202` — corpo `Accepted` (`Content-Type: text/html`). Erros possíveis: `400`, `401`, `403`, `404`
(`application/problem+json`).

### 4. Lançar vários Salesbots (lote)
**POST** `https://{subdominio}.kommo.com/api/v4/bots/run`

Corpo (array, **máx 100 por chamada**):
```json
[
  { "bot_id": 565, "entity_id": 76687686, "entity_type": "leads" }
]
```
Campos obrigatórios por item: `bot_id` (int), `entity_id` (int), `entity_type` (`leads`|`contacts`).
Sucesso `202` (sem corpo).

### 5. Parar um Salesbot
**POST** `https://{subdominio}.kommo.com/api/v4/bots/{id}/stop`

Path: `id` (int). Corpo:
```json
{ "entity_id": 76687686, "entity_type": "leads" }
```
`entity_type` aceita apenas `leads`. Sucesso `202` (sem corpo).

### 6. Confirmação de execução de bloco de Widget (continuar o bot)
**POST** `https://{subdominio}.kommo.com/api/v4/{bot}/{bot_id}/continue/{continue_id}`

Path: `bot` (`salesbot` ou `marketingbot`), `bot_id` (int), `continue_id` (int — fornecido pelo sistema
na `return_url` do webhook). Corpo:
```json
{
  "data": { "status": "success" },
  "execute_handlers": [
    { "handler": "show", "params": { "type": "text", "value": "Your text" } },
    { "handler": "goto", "params": { "type": "question", "step": 5 } }
  ]
}
```
- `data` (json) — fica acessível no bot via `{{json.CHAVE}}`.
- `execute_handlers` (json) — ações antes de continuar; **suporta apenas `show` e `goto`**.
- **Limitações:** só administradores; máx **10** handlers em `execute_handlers`; em `show`, o `value`
  não pode exceder **80 caracteres**; máx **25** botões. Sucesso `202 Accepted` (sem corpo).

---

## SDK de Widget (extensão de handlers no designer)
Para adicionar um widget ao construtor: no `manifest.json`, incluir a location `"salesbot_designer"` e o
objeto `salesbot_designer` (com `logo` e handlers; tipos de campo: `text`, `numeric`, `url`; cada campo
pode ter `default_value` e a flag `manual` true/false). No `script.js`:
- **`onSalesbotDesignerSave(handler_code, params)`** — retorna uma **string JSON** com o código do bot.
  É aqui que se monta `widget_request` + `conditions` + `exits`.
- **`salesbotDesignerSettings($body, renderRow, params)`** — customiza o bloco e retorna um objeto com
  o array `exits`, em que cada item tem `code` e `title` (ex.: `success`/`fail`). O handler `exits` no
  JSON direciona o fluxo conforme o `code`.
```javascript
exits: [
  { code: 'success', title: 'Upon successful execution' },
  { code: 'fail', title: 'In case of an error' }
]
```

---

## Limites e rate limits
- **Tamanho do JSON do bot: máx 64KB.**
- **Lançar bots em lote (`/bots/run`): máx 100 por requisição.**
- **`widget_request`: o endpoint deve responder HTTP 200 em até 2 segundos.**
- **Confirmação de bloco de widget (`/continue/`): máx 10 handlers; `show.value` ≤ 80 caracteres;
  ≤ 25 botões; apenas `show`/`goto`; somente administradores.**
- **Listagem (`/bots`): `limit` máx 250.**
- **Texto em botões/valor no Messenger: truncado em 80 caracteres.**
- Não há rate limit numérico específico do Salesbot na doc; aplicam-se os limites gerais da API v4 da
  Kommo. (Não confirmado na doc do Salesbot.)

## Pegadinhas e erros comuns (gotchas)
- **`send_message`, `edit_lead`, `send_hook`, `execution_condition`, `model.text` não existem** nessa
  nomenclatura no Salesbot da Kommo. Use `show`/`send_external_message`, `action`, `widget_request`,
  `condition` e o JSON de steps (`question`/`answer`/`finish`).
- **Não há endpoint de criar/editar/excluir bot na API** — só list/get/run/run-lote/stop/continue.
- **Passos começam em 0** — erro clássico em `goto`/`wait_answer`.
- **`condition` (singular)** é o handler padrão de lógica; **`conditions` (plural)** só aparece no
  contexto do SDK de widget (mesma estrutura do `validations`).
- **`type` 1 = contato, 2 = lead** em quase todas as ações (`set_tag`, `set_custom_fields`,
  `change_responsible_user`, `filter`). Em `send_internal`, `entity_type` só aceita 2 (lead).
- **`enum` é parâmetro da ação (`"enum": "WORK"`)**, não placeholder — não existe `{{lead.cf.ID.ENUM}}`.
- **`widget_request` só funciona em step de Widget** e exige resposta em 2s + posterior chamada à
  `return_url`; o bot fica travado até a confirmação, e **não há continuidade se outro bot já roda para a
  mesma entidade**.
- **Truncamento de texto em botões no Messenger: 80 caracteres**; na confirmação de widget o limite de 80
  é obrigatório.
- **Truncamento do JSON em 64KB** — bots grandes precisam ser quebrados/encadeados via `stop`/`salesbot-start`.
- **Caracteres especiais:** o JSON precisa ser válido antes de salvar (o editor não corrige).
- **`/bots/{id}/run` retorna `202` com corpo de texto `Accepted`** (não JSON) — não tente parsear JSON
  da resposta de sucesso.
- **`stop` só aceita `entity_type: leads`**; `run` (individual e lote) aceita `leads` e `contacts`.
- **Erros padronizados** seguem `application/problem+json` (`title`, `type`, `status`, `detail`,
  `validation-errors[]` com `code`/`path`/`detail`). `400` (dados inválidos), `401` (não autenticado),
  `403` (sem permissão na entidade), `404` (bot não encontrado), `204` (nenhum bot / não existe).
- **`set_budget` aceita fórmula** com `+ - * /` e parênteses; em `set_custom_fields` a fórmula só é
  calculada com `"calculated": true`.

## Fontes
- https://developers.kommo.com/docs/salesbot-dp — guia completo (estrutura, handlers, ações, placeholders, exemplos); lido via `https://developers.kommo.com/docs/salesbot-dp.md`
- https://developers.kommo.com/reference/launch-a-salesbot — POST /api/v4/bots/{id}/run; lido via `.md` (sucesso `202`, corpo `Accepted`)
- https://developers.kommo.com/reference/launch-salesbots — POST /api/v4/bots/run (array, máx 100); lido via `.md`
- https://developers.kommo.com/reference/stop-salesbot — POST /api/v4/bots/{id}/stop (`entity_type: leads`); lido via `.md`
- https://developers.kommo.com/reference/get-salesbot-by-id — GET /api/v4/bots/{id}; lido via `.md`
- https://developers.kommo.com/reference/salesbots-list — GET /api/v4/bots (`limit` máx 250); lido via `.md`
- https://developers.kommo.com/reference/salesbot-widget-block-execution-confirmation — POST /api/v4/{bot}/{bot_id}/continue/{continue_id}; lido via `.md`
- https://developers.kommo.com/docs/salesbot-sdk — SDK de widget (manifest.json, onSalesbotDesignerSave, salesbotDesignerSettings, exits); lido via `.md`
- https://developers.kommo.com/llms.txt — índice oficial de páginas/endpoints (confirma que não há create/edit/delete bot)
- https://developers.kommo.com/reference/salesbot — índice da seção Salesbot na referência
