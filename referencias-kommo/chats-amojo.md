# Kommo API — Chats API (amojo) — mensageria

> Esta seção cobre a **Chats API** da Kommo (antiga amoCRM), também chamada de **amojo** (o serviço
> de mensageria que roda em `amojo.kommo.com`). Ela é usada para integrar **canais de chat
> customizados** (mensageiros próprios) ao CRM: conectar canal, enviar/importar/editar mensagens,
> receber webhooks de mensagens de saída, status de entrega, reações, "digitando", histórico, etc.
>
> Atenção a um detalhe que confunde: a Chats API **não usa o mesmo host nem a mesma autenticação**
> da API v4 padrão da Kommo. Quase tudo aqui vai para `https://amojo.kommo.com/v2/origin/custom/...`
> e é autenticado por **assinatura HMAC-SHA1** (não por OAuth/Access Token). Apenas algumas operações
> usam o host normal `https://{subdominio}.kommo.com/api/v4/...` com OAuth: obter o `amojo_id` da
> conta/usuário e vincular um chat a um contato.

---

## 1. Visão geral do recurso

Fluxo conceitual para integrar um mensageiro próprio (a doc chama de "Five steps to send a message"):

1. **Registrar um canal de chat** — feito por solicitação à equipe Kommo (não há endpoint público).
   Retorna `channel_id`, `channel_secret` e o `channel code`.
2. **Conectar o canal à conta** — `POST .../{channel_id}/connect`. Retorna o `scope_id`.
3. **(Opcional) Criar um chat** — `POST .../{scope_id}/chats` antes da primeira mensagem.
4. **(Opcional) Vincular o chat a um contato** — `POST /api/v4/contacts/chats` (API v4, OAuth).
5. **Enviar / importar / editar mensagens** — `POST .../{scope_id}`.

Identificadores-chave:

| ID | O que é | Onde se obtém |
|---|---|---|
| `amojo_id` (account) | ID da conta no serviço de chats (UUID). É o `account_id` usado no `connect`/`disconnect`. | `GET /api/v4/account?with=amojo_id` ou, no front, `APP.constant('account').amojo_id` |
| `amojo_id` (user) | ID do usuário/gestor no serviço de chats. Vai em `sender.ref_id` em mensagens de saída do gestor. | `GET /api/v4/users?with=amojo_id` ou, no front, `APP.constant('user').amojo_id` |
| `channel_id` | ID do seu canal registrado (UUID, ex.: `a4490ccc-5d7f-11e7-907b-a6006ad3dba0`). | Resposta do registro de canal (suporte Kommo) |
| `channel_secret` | Chave secreta do canal — usada como chave do HMAC-SHA1. **Nunca usar no frontend.** | Resposta do registro de canal (suporte Kommo) |
| `scope_id` | `"{channel_id}_{account_id}"` — combina canal + conta. Usado em quase todos os endpoints de mensagem. | Resposta do `connect` |

Exemplo de `scope_id`:
`a4490ccc-5d7f-11e7-907b-a6006ad3dba0_13fa84f7-6b61-4086-98ed-0a9de19ee15c`

Host base de mensageria: **`https://amojo.kommo.com`** (raiz dos recursos: `/v2/origin/custom/`).

---

## 2. Autenticação — headers e assinatura (HMAC-SHA1)

Em vez de `Access Token`, **toda** requisição a `amojo.kommo.com` exige 4 headers:

| Header | Conteúdo | Observações |
|---|---|---|
| `Date` | Data/hora da requisição em **RFC2822** (ex.: `Thu, 01 Jan 2023 12:00:00 +0000`) | A assinatura é válida por **15 minutos** |
| `Content-Type` | `application/json` (único valor suportado) | |
| `Content-MD5` | Hash **MD5** do corpo da requisição, em **hexadecimal minúsculo** | Calculado sobre o corpo como **byte stream** (espaços/`\n` finais contam). Em requisições **GET** (sem corpo), calcular o MD5 de **string vazia** — o header continua obrigatório |
| `X-Signature` | Assinatura **HMAC-SHA1** da string canônica, em hex minúsculo | Chave do HMAC = `channel_secret` |

### Algoritmo do `X-Signature` (requisições para amojo)

A doc oficial (*Chats API authorization*) descreve assim:

> *"A string is formed from the method name (GET/POST) in uppercase and the values (as specified in
> the request without changes) of the headers by combining them via `\n`."* … *"the requested path
> from the URL without the protocol and domain (without GET parameters)"* … e então
> *"calculate the resulting string using HMAC-SHA1, and for secret use the channel secret obtained
> during chat channel registration"*.

Passo a passo:

1. Monta-se uma string canônica concatenando, separados por `\n`:
   - o nome do **método** em MAIÚSCULAS (`GET`/`POST`/`DELETE`),
   - os **valores dos headers** `Content-MD5`, `Content-Type`, `Date` (headers ausentes viram string
     vazia),
   - o **caminho da URL** (path) **sem protocolo, sem domínio e sem query string**.
2. Aplica-se **HMAC-SHA1** sobre essa string usando o `channel_secret` como chave.
3. O resultado vai em **hexadecimal minúsculo** no header `X-Signature`.

> **Sobre a ordem dos headers (verificar):** o texto em prosa da doc afirma apenas que "os valores
> dos headers devem seguir uma certa ordem", mas **não enumera a ordem na prosa**. A ordem
> `Content-MD5 → Content-Type → Date` é a usada na **receita de código oficial** (tutorial "Calculate
> headers for Chats API requests" em PHP/Python) e replicada na maioria das integrações. Use o código
> oficial como fonte da verdade para a ordem exata.

Exemplo (PHP, conforme a receita oficial):

```php
$method      = 'POST';
$path        = "/v2/origin/custom/{$channelId}/connect";
$body        = json_encode($payload, JSON_UNESCAPED_UNICODE);

$contentMd5  = strtolower(md5($body));
$contentType = 'application/json';
$date        = gmdate('D, d M Y H:i:s O'); // RFC2822, ex.: "Thu, 01 Jan 2023 12:00:00 +0000"

$checkSum = implode("\n", [
    strtoupper($method),
    $contentMd5,
    $contentType,
    $date,
    $path,
]);

$signature = strtolower(hash_hmac('sha1', $checkSum, $channelSecret));

$headers = [
    "Date: {$date}",
    "Content-Type: {$contentType}",
    "Content-MD5: {$contentMd5}",
    "X-Signature: {$signature}",
];
```

### Validação de assinatura nos **webhooks recebidos**

Importante: a assinatura dos **webhooks que a Kommo envia** para a sua URL é calculada de forma
**diferente** das requisições de saída. O header `X-Signature` do webhook é o **HMAC-SHA1 do corpo
bruto** (apenas o body, *não* a string canônica), usando o `channel_secret`:

```php
$secret = '5a44c5dff55f3c15a4cce8d7c4cc27e207c7e189';
$str = file_get_contents('php://input');
$signature = hash_hmac('sha1', $str, $secret);

if (isset($_SERVER['HTTP_X_SIGNATURE']) && $signature === $_SERVER['HTTP_X_SIGNATURE']) {
    // hook válido
}
```

> **Importante:** o `channel_secret` só pode ser usado no **backend**. Nunca no frontend/JS do widget.
> *"Do not use a secret key in the frontend. Any requests using the secret key should only be made
> from the backend part of your application."*

---

## 3. Obter o `amojo_id` (pré-requisito)

Único uso da API v4 padrão no fluxo de conexão.

- **Conta — Método/Path:** `GET https://{subdominio}.kommo.com/api/v4/account?with=amojo_id`
- **Usuário — Método/Path:** `GET https://{subdominio}.kommo.com/api/v4/users?with=amojo_id`
- **Auth:** OAuth 2.0 (Access Token), host normal da conta.

Resposta da conta (exemplo):
```json
{
  "id": 1111111,
  "name": "Test account",
  "amojo_id": "XXXXXXX-d2eb-4bd8-b862-b57934927b38"
}
```

Resposta de usuário (exemplo):
```json
{
  "id": 1234567,
  "name": "Danny",
  "amojo_id": "1234567-ec21-4463-965f-1fe1d4cd5b89"
}
```

O `amojo_id` da conta é o `account_id` usado nos endpoints de `connect`/`disconnect`. O `amojo_id`
do usuário vai em `sender.ref_id` em mensagens de saída do gestor. No frontend (UI/UX), use
`APP.constant('account').amojo_id` e `APP.constant('user').amojo_id`.

---

## 4. Registrar um canal

Não há endpoint público — o canal é registrado **por solicitação ao suporte Kommo**
(https://www.kommo.com/contact-us/). **Prazo típico: 1–3 dias úteis.**

O pedido inclui, entre outros campos obrigatórios:
- **Nome do serviço** (apenas caracteres latinos, **sem iniciar com número**),
- **URL de webhook** no formato `https://domain.com/location/:scope_id` — o marcador `:scope_id` é
  preenchido dinamicamente pelo sistema,
- **ID da conta** Kommo,
- **E-mail de contato** (em caso de problemas),
- **Ícone SVG** (redondo ou inscrito em círculo, **14×14px**),
- **ID da integração** (aba *Keys*),
- **Código do widget** (propriedades da integração / aba "My submissions"),
- se será **público ou privado**.

Campos opcionais: **Write First** (exige templates), **Time Window** (duração em segundos + exibição
de template), armazenamento de arquivos, reações (formato dos emojis), citação/quoting, mensagens de
voz e tamanho máximo de arquivo.

A resposta (após aprovação) entrega:
- **Channel code** (ex.: `amo.ext.12345678`)
- **Channel ID**
- **Channel secret**
- **Webhook URL**
- **Parâmetros de bot**: id, nome e `client_id`

> Recomendação da doc: **NÃO conecte mais de um canal de chat por integração** — pode causar
> "implicações inesperadas".

---

## 5. Conectar canal (connect)

- **Método/Path:** `POST https://amojo.kommo.com/v2/origin/custom/{channel_id}/connect`
- **Headers:** os 4 de assinatura (seção 2).

Corpo da requisição:

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `account_id` | string | Sim | `amojo_id` da conta (ver seção 3) |
| `title` | string | Sim | Nome do canal exibido |
| `hook_api_version` | string (enum) | Sim | Único valor aceito: `v2` |
| `is_time_window_disabled` | boolean | Não | `false` por padrão. Se a janela de tempo (time window) do canal estiver ativada, use este parâmetro para desativá-la na sua conta |

Requisição:
```json
{
  "account_id": "52fd2a28-d2eb-4bd8-b862-a67934927b38",
  "title": "MyKommo",
  "hook_api_version": "v2"
}
```

Resposta `200`:
```json
{
  "account_id": "52fd2a28-d2eb-4bd8-b862-b57934927b38",
  "scope_id": "f62a0162-46a7-430e-b06c-0ef798d56b21_52fd2a28-d2eb-4bd8-b862-b57934927b38",
  "title": "MyKommo",
  "hook_api_version": "v2",
  "is_time_window_disabled": false
}
```

> A conexão deve ser refeita **a cada (re)instalação** da integração — o canal é auto-desabilitado
> quando a integração é desativada. Guarde o `scope_id`: ele é usado em praticamente todos os
> endpoints seguintes. Erros: `400` (Bad Request).

---

## 6. Desconectar canal (disconnect)

- **Método/Path:** `DELETE https://amojo.kommo.com/v2/origin/custom/{channel_id}/disconnect`

Requisição:
```json
{
  "account_id": "XXXXXX-d2eb-4bd8-b862-a67934927b38"
}
```
(`account_id` = `amojo_id` da conta.)

Resposta `200`: `{}`. Erros: `400` (dados inválidos), `403` (assinatura incorreta),
`404` (canal inexistente).

> Após desconectar, você **para de receber webhooks** de mensagens de saída e a iniciação de conversa
> fica desabilitada na UI.

---

## 7. Criar chat (antes da 1ª mensagem)

- **Método/Path:** `POST https://amojo.kommo.com/v2/origin/custom/{scope_id}/chats`

Corpo:

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `conversation_id` | string | Sim | ID do chat no seu lado (integração) — pode ser telefone, username, etc. |
| `source.external_id` | string | Não | ID da origem do chat no lado da integração |
| `user.id` | string | Sim | ID do participante (gerado por você); **deve ser único** |
| `user.name` | string | Sim | Nome do participante |
| `user.avatar` | string | Não | URL do avatar (precisa ser baixável) |
| `user.profile.phone` | string | Não | Telefone (vai para o contato ao criar lead de entrada) |
| `user.profile.email` | string | Não | E-mail (vai para o contato ao criar lead de entrada) |
| `user.profile_link` | string | Não | URL do perfil |

Requisição:
```json
{
  "conversation_id": "XXXXXXXX-49af-4448-a2c6-d5a421f7f301",
  "user": {
    "id": "XXXXX-1376265f-86df-4c49-a0c3-a4816df41af0",
    "name": "Client",
    "avatar": "https://www.example.com/users/avatar.png",
    "profile": {
      "phone": "+1234567890",
      "email": "client409@example.com"
    }
  }
}
```

Resposta `200`:
```json
{
  "id": "XXXXXXX-10e9-4f88-af0b-6581795e15e2",
  "user": {
    "id": "XXXXXXX-7bd3-4934-b05f-23f1db1a6514",
    "client_id": "XXXXXXX-86df-4c49-a0c3-a4816df41af0",
    "name": "Client",
    "avatar": "https://www.example.com/users/avatar.png",
    "phone": "+1234567890",
    "email": "client409@example.com"
  }
}
```

> `user.id` precisa ser único; reenviar um `id` existente **retorna o usuário existente** (idempotente).
> Se um chat com o `conversation_id` informado já existe, o ID dele é retornado. O corpo deve ser
> idêntico ao usado no cálculo de `Content-MD5` e `X-Signature`. Chats **sem mensagens não aparecem**
> na conta.

---

## 8. Vincular chat a um contato (API v4, OAuth)

- **Método/Path:** `POST https://{subdominio}.kommo.com/api/v4/contacts/chats`
- **Auth:** OAuth 2.0 (host normal da conta — **não** amojo).

Requisição (array):
```json
[
  {
    "contact_id": 111111111,
    "chat_id": "XXXXXXXX-369e-48f6-87d2-562e77bc59e6"
  }
]
```

Resposta `200`:
```json
{
  "_total_items": 1,
  "_embedded": {
    "chats": [
      {
        "chat_id": "XXXXXXX-369e-48f6-87d2-562e77bc59e6",
        "contact_id": 1111111,
        "id": 2222222,
        "request_id": "0"
      }
    ]
  }
}
```

| Campo | Tipo | Descrição |
|---|---|---|
| `chat_id` | string | ID do chat na Chats API |
| `contact_id` | integer | ID do contato na Kommo |
| `id` | integer | ID do vínculo chat↔contato |
| `request_id` | string | Índice/número do item no array enviado |

Erros: `400` (dados inválidos), `401` (não autorizado), `403` (sem permissão).

---

## 9. Enviar / importar / editar mensagens

- **Método/Path:** `POST https://amojo.kommo.com/v2/origin/custom/{scope_id}`

Estrutura geral do payload:

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `event_type` | string | Sim | `new_message` (nova msg) ou `edit_message` (edição) |
| `payload.timestamp` | int | Sim | Unix em segundos |
| `payload.msec_timestamp` | int | Sim | Unix em milissegundos |
| `payload.msgid` | string | Sim | ID da mensagem **no seu lado** (integração) |
| `payload.conversation_id` | string | Sim | ID do chat **no seu lado** |
| `payload.conversation_ref_id` | string | Não | ID do chat **no lado Kommo** (usado em respostas a "Write first") |
| `payload.sender` | object | Sim | Remetente (ver abaixo) |
| `payload.receiver` | object | Condicional | Destinatário — **obrigatório em mensagens de saída** |
| `payload.message` | object | Sim | Conteúdo e tipo da mensagem (ver abaixo) |
| `payload.source` | object | Não | Identificador de origem da mensagem |
| `payload.reply_to` | object | Não | Mensagem citada/respondida (quoting) |
| `payload.forwards` | object | Não | Mensagem encaminhada |
| `payload.silent` | boolean | Não | `true` = não notifica/não cria lead de entrada; `false` = processa normalmente |

**Objetos `sender` / `receiver`:** obrigatórios `id` e `name`; opcionais `ref_id` (ID do participante
no lado Kommo — em saída do gestor é o `amojo_id` do gestor, em saída de bot é o ID do bot da
integração), `avatar` (URL baixável), `profile_link` e `profile` (`phone`, `email`).

**Objeto `message`:** obrigatório `type`. Campos por tipo:
- **text:** `text` (obrigatório)
- **file / video / picture / voice / audio / sticker:** `media` (URL), `file_name`, `file_size`,
  `media_duration` (opcional)
- **contact:** `contact.name`, `contact.phone`
- **location:** `location.lon`, `location.lat`
- **comentário em post:** objeto `post` (ver 9.4)

**Tipos de mensagem suportados:** `text`, `picture`, `video`, `voice`, `audio`, `file`, `sticker`,
`location`, `contact`.

### 9.1. Mensagem de **entrada** (cliente → empresa) — só `sender`
```json
{
  "event_type": "new_message",
  "payload": {
    "timestamp": 1639604761,
    "msec_timestamp": 1639604761694,
    "msgid": "my_int-5f2836a8ca475",
    "conversation_id": "my_int-d5a421f7f217",
    "sender": {
      "id": "my_int-1376265f-86df-4c49-a0c3-a4816df41af8",
      "avatar": "https://example.com/users/avatar.png",
      "profile": {
        "phone": "+1400000000",
        "email": "example.client@example.com"
      },
      "profile_link": "https://example.com/profile/example.client",
      "name": "Client name"
    },
    "message": {
      "type": "text",
      "text": "Message from a client"
    },
    "silent": false
  }
}
```

### 9.2. Mensagem de **saída do gestor** (manager → cliente) — `sender` + `receiver`
O `amojo_id` do gestor vai em `payload.sender.ref_id`.
```json
{
  "event_type": "new_message",
  "payload": {
    "timestamp": 1639604903,
    "msec_timestamp": 1639604903161,
    "msgid": "my_int-5f2836a8ca476",
    "conversation_id": "my_int-d5a421f7f217",
    "sender": {
      "id": "my_int-manager1_user_id",
      "name": "Manager name",
      "ref_id": "76fc2bea-902f-425c-9a3d-dcdac4766090"
    },
    "receiver": {
      "id": "my_int-1376265f-86df-4c49-a0c3-a4816df41af8",
      "avatar": "https://example.com/users/avatar.png",
      "name": "Client name",
      "profile": { "phone": "+1400000000", "email": "example.client@example.com" },
      "profile_link": "https://example.com/profile/example.client"
    },
    "message": {
      "type": "text",
      "text": "Message from a manager 76fc2bea-902f-425c-9a3d-dcdac4766090"
    },
    "silent": true
  }
}
```

### 9.3. Mensagem de **saída do bot** (bot → cliente)
O ID do bot da integração vai em `payload.sender.ref_id`.
```json
{
  "event_type": "new_message",
  "payload": {
    "timestamp": 1639605194,
    "msec_timestamp": 1639605194102,
    "msgid": "my_int-5f2836a8ca477",
    "conversation_id": "my_int-d5a421f7f217",
    "sender": {
      "id": "my_int-bot_user_id",
      "name": "Bot",
      "ref_id": "f1910c7f-b1e0-4184-bd09-c7def2a9109a"
    },
    "receiver": {
      "id": "my_int-1376265f-86df-4c49-a0c3-a4816df41af8",
      "avatar": "https://example.com/users/avatar.png",
      "name": "Client name",
      "profile": { "phone": "+1400000000", "email": "example.client@example.com" },
      "profile_link": "https://example.com/profile/example.client"
    },
    "message": {
      "type": "text",
      "text": "Message from the channel bot f1910c7f-b1e0-4184-bd09-c7def2a9109a"
    },
    "silent": true
  }
}
```

### 9.4. Comentário em post (redes sociais) — campo `message.post`
```json
{
  "event_type": "new_message",
  "payload": {
    "timestamp": 1639604761,
    "msec_timestamp": 1639604761694,
    "msgid": "my_int-5f2836a8ca475",
    "conversation_id": "my_int-d5a421f7f217",
    "sender": {
      "id": "my_int-1376265f-86df-4c49-a0c3-a4816df41af8",
      "avatar": "https://example.com/users/avatar.png",
      "profile": { "phone": "+1234567890", "email": "example.client@example.com" },
      "profile_link": "https://example.com/profile/example.client",
      "name": "Client name"
    },
    "message": {
      "type": "text",
      "text": "Message from the client",
      "post": {
        "id": "my-int-376265",
        "url": "https://www.example.com/@example/video/7490",
        "preview_url": "https://example/1/preview.png",
        "preview_permalink": "https://example/2/preview.png",
        "username": "post creator",
        "caption": "Post description"
      }
    },
    "silent": false
  }
}
```

### 9.5. Editar mensagem — `event_type: "edit_message"`
```json
{
  "event_type": "edit_message",
  "payload": {
    "timestamp": 1639605194,
    "msec_timestamp": 1639605194102,
    "msgid": "my_int-5f2836a8ca477",
    "conversation_id": "my_int-d5a421f7f217",
    "message": {
      "type": "text",
      "text": "Edited message"
    }
  }
}
```

### 9.6. Importar histórico
Use o **mesmo endpoint** (`POST .../{scope_id}`), enviando mensagens com `silent: true` **para todas,
exceto a última**. *"We recommend performing the import without notifications to managers or creating
an incoming lead for all messages except the last one."* Isso evita disparar notificações em massa; a
**última** mensagem (com `silent: false`) é que **cria o lead de entrada**.

### Resposta de mensagem
```json
{
  "new_message": {
    "msgid": "...",
    "ref_id": "...",
    "conversation_id": "...",
    "sender_id": "...",
    "receiver_id": "..."
  }
}
```

| Campo | Tipo | Descrição |
|---|---|---|
| `new_message.msgid` | string | ID da mensagem **na Chats API** |
| `new_message.ref_id` | string | ID da mensagem **no seu lado** |
| `new_message.conversation_id` | string | ID do chat na Chats API |
| `new_message.sender_id` | string | ID do remetente na Chats API |
| `new_message.receiver_id` | string | ID do destinatário na Chats API |

---

## 10. Histórico do chat

- **Método/Path:** `GET https://amojo.kommo.com/v2/origin/custom/{scope_id}/chats/{conversation_id}/history`

Query params:

| Param | Tipo | Descrição |
|---|---|---|
| `offset` | int | Deslocamento (registros pulados a partir do início) |
| `limit` | int | Quantidade por página — **máximo 50** |

> Mesmo sendo GET sem corpo, é obrigatório enviar `Content-MD5` (MD5 de string vazia) e a assinatura.
> *"For GET requests, MD5 must also be calculated. Even if nothing is passed in the request body, MD5
> will be obtained from an empty string."*

Resposta `200`:
```json
{
  "messages": [
    {
      "timestamp": 1670930693,
      "msec_timestamp": 1670930693280,
      "sender": {
        "id": "string", "name": "string", "client_id": "string",
        "avatar": "string", "phone": "string", "email": "string"
      },
      "receiver": {
        "id": "string", "name": "string", "client_id": "string",
        "avatar": "string", "phone": "string", "email": "string"
      },
      "message": {
        "id": "string", "client_id": "string", "type": "string",
        "text": "string", "media": "string", "thumbnail": "string",
        "file_name": "string", "file_size": 0, "media_group_id": "string",
        "location": { "lon": 0.0, "lat": 0.0 },
        "contact": { "name": "string", "phone": "string" }
      }
    }
  ]
}
```

Códigos: `200` (ok), `204` (chat inexistente ou sem mensagens), `400` (dados inválidos),
`403` (assinatura incorreta).

---

## 11. Status de entrega

- **Método/Path:** `POST https://amojo.kommo.com/v2/origin/custom/{scope_id}/{msgid}/delivery_status`

| `status_code` | Significado |
|---|---|
| (sem valor) | Enviada (padrão) |
| `1` | Entregue ao destino |
| `2` | Lida pelo destinatário |
| `-1` | Erro / não entregue |

`error_code` (obrigatório quando `status_code = -1`):

| Código | Significado |
|---|---|
| `901` | Usuário apagou a mensagem |
| `902` | Integração desabilitada no lado do canal |
| `903` | Erro interno de servidor |
| `904` | Não foi possível criar a conversa (ex.: usuário não registrado) |
| `905` | Outro erro (exige texto em `error`) |

Lida:
```json
{ "status_code": 2 }
```
Erro:
```json
{
  "status_code": -1,
  "error_code": 905,
  "error": "An unknown error occurred"
}
```
Resposta de sucesso: `200` `{}`. Erros: `400` (dados incorretos), `403` (assinatura),
`404` (mensagem inexistente).

---

## 12. Reações

- **Método/Path:** `POST https://amojo.kommo.com/v2/origin/custom/{scope_id}/react`

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `conversation_id` | string | Condicional | ID do chat no seu lado |
| `conversation_ref_id` | string | Não | ID do chat na Chats API (opcional se `conversation_id` informado) |
| `id` | string | Condicional | ID da mensagem no lado Kommo (exigido se `msgid` ausente) |
| `msgid` | string | Condicional | ID da mensagem no seu lado (exigido se `id` ausente) |
| `user.id` | string | Não | ID do usuário no seu lado |
| `user.ref_id` | string | Condicional | ID do usuário no lado Kommo (exigido para reações de usuários Kommo) |
| `type` | string | Sim | `react` ou `unreact` |
| `emoji` | string | Condicional | Obrigatório quando `type = react` |

```json
{
  "conversation_id": "my_integration-8e3e7640-49af-4448-a2c6-d5a421f7f217",
  "msgid": "XXXXXXX-0c4b-11ea-8d71-362b9e155667",
  "user": { "id": "XXXXXX-1376265f-86df-4c49-a0c3-a4816df41af8" },
  "type": "react",
  "emoji": "😍"
}
```
Códigos: `200` (`{}`), `400`, `403`, `404`.

---

## 13. "Digitando" (typing)

- **Método/Path:** `POST https://amojo.kommo.com/v2/origin/custom/{scope_id}/typing`

```json
{
  "conversation_id": "XXXXXX-80c5-403d-93d9-bada6302810f",
  "sender": { "id": "XXXXXXXX-4f66-46ff-b06f-d245fca1af0a" }
}
```

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `conversation_id` | string | Sim | ID do chat no seu lado |
| `sender.id` | string | Sim | ID do usuário no seu lado |
| `duration_ms` | int | Não | Duração do indicador; padrão **5000 ms** |

Resposta: `204` (vazio). Erros: `403` (assinatura), `404` (dados incorretos).

---

## 14. Webhooks (mensagens de saída da Kommo → seu canal)

A Kommo envia webhooks para a **URL registrada** (formato `https://domain.com/location/:scope_id`,
com `:scope_id` preenchido dinamicamente) quando uma mensagem é enviada **a partir da interface** do
CRM para o canal.

Comportamento de entrega:
- **Entrega única**: *"Each webhook is sent only once; if the integration fails to process or receive
  it, it will not be retried."* — **não há retry**.
- **Prazo**: responder **HTTP 200 em até 5 segundos**.
- **Throttling**: respondedores lentos/falhos são movidos para filas mais lentas dinamicamente,
  podendo atrasar webhooks futuros.

Segurança: todo webhook traz `X-Signature` = HMAC-SHA1 do **corpo bruto** com o `channel_secret`
(ver código na seção 2).

Estrutura básica do webhook de mensagem:

| Campo | Tipo | Descrição |
|---|---|---|
| `account_id` | string | ID da conta Kommo |
| `time` | int | Unix timestamp da geração do webhook |
| `message` | object | Detalhes completos da mensagem (`receiver`, `sender`, `conversation`, `source`, timestamp, conteúdo) |

Outros eventos de webhook chegam dentro de um objeto **`action`**:
- **Typing** (gestor digitando) — `action.typing` (com usuário, conversa e expiração); limitado a
  ~5s.
- **Reações** — `action.reaction` (mensagem, usuário, conversa, `type` `react`/`unreact` e emoji).

---

## 15. Limites e rate limits

- **Assinatura/`Date`**: válida por **15 minutos** (clock skew além disso → `403`).
- **Histórico**: `limit` máximo **50** por página.
- **Webhooks de entrada (no seu servidor)**: responder **200 em até 5s**; sem retentativa em caso de
  falha.
- **Typing**: indicador padrão de **5000 ms**; eventos de digitação por webhook são "throttled" a ~5s.
- Limite numérico global de requisições por segundo para o host `amojo.kommo.com` **não é especificado
  explicitamente** na doc desta seção *(verificar)*. A API v4 geral usa ~7 req/s, mas isso **não está
  confirmado** para amojo.

---

## 16. Pegadinhas e erros comuns (gotchas)

- **Host errado**: mensageria vai para `amojo.kommo.com`, **não** para `{subdominio}.kommo.com/api/v4`.
  Apenas `amojo_id` (conta/usuário) e "vincular chat a contato" usam a API v4 com OAuth.
- **Sem OAuth no amojo**: nada de `Authorization: Bearer`. A autenticação é só pelos 4 headers de
  assinatura.
- **Duas assinaturas diferentes**: requisições de saída assinam a **string canônica** (método + headers
  + path); webhooks de entrada assinam o **corpo bruto**. Não confunda os dois.
- **Corpo idêntico**: o JSON usado para `Content-MD5`/`X-Signature` precisa ser **exatamente o mesmo**
  byte-a-byte que vai no corpo. Reserializar/reordenar chaves depois de assinar quebra a assinatura
  (→ `403`).
- **`Content-MD5` em GET**: mesmo sem corpo, calcule o MD5 de **string vazia** e inclua o header —
  senão a assinatura falha.
- **MD5 e assinatura em minúsculas/hex**: `Content-MD5` e `X-Signature` devem ser hex **minúsculo**.
- **`Date` em RFC2822 e em GMT/UTC**: use o offset correto (ex.: `+0000`); fora da janela de 15 min →
  `403`.
- **`secret` no frontend**: nunca. Só backend.
- **`scope_id` ≠ `channel_id`**: o `scope_id` (`channel_id_account_id`) só existe **após o connect**;
  usar `channel_id` puro nos endpoints de mensagem falha.
- **Reconexão obrigatória**: reconecte o canal a cada (re)instalação; canais auto-desabilitam quando a
  integração é desativada.
- **Import de histórico**: marque `silent: true` em todas menos a última — caso contrário, dispara
  várias notificações e a criação de lead pode ficar errada.
- **`user.id` único na criação de chat**: reenviar um `id` existente devolve o usuário existente em vez
  de criar outro (idempotente).
- **Chats sem mensagem somem**: um chat criado sem nenhuma mensagem não aparece na conta.
- **Webhook sem retry**: trate idempotência e responda 200 rápido; perdeu, perdeu.
- **Um canal por integração**: a doc desaconselha conectar mais de um canal de chat à mesma
  integração ("unexpected implications").
- **Ordem dos headers na string canônica**: o texto da doc não fixa explicitamente a ordem na prosa —
  siga o **tutorial de código oficial** (ordem usada: `Content-MD5`, `Content-Type`, `Date`);
  **(verificar)**.

---

## 17. Exemplo de uso (cenário concreto — enviar mensagem de entrada)

```bash
# 1) Pré-cálculo dos headers (pseudo-shell; faça no backend)
SCOPE_ID="f62a0162-46a7-430e-b06c-0ef798d56b21_52fd2a28-d2eb-4bd8-b862-b57934927b38"
SECRET="5a44c5dff55f3c15a4cce8d7c4cc27e207c7e189"
PATH_ONLY="/v2/origin/custom/${SCOPE_ID}"

BODY='{"event_type":"new_message","payload":{"timestamp":1639604761,"msec_timestamp":1639604761694,"msgid":"my_int-5f2836a8ca475","conversation_id":"my_int-d5a421f7f217","sender":{"id":"my_int-1376265f","name":"Client name","profile":{"phone":"+1400000000","email":"client@example.com"}},"message":{"type":"text","text":"Olá!"},"silent":false}}'

CONTENT_MD5=$(printf '%s' "$BODY" | md5sum | awk '{print tolower($1)}')
CONTENT_TYPE="application/json"
DATE=$(LC_ALL=C date -u +"%a, %d %b %Y %H:%M:%S +0000")

# String canônica: METHOD \n Content-MD5 \n Content-Type \n Date \n path  (verificar ordem)
SIG_STR=$(printf 'POST\n%s\n%s\n%s\n%s' "$CONTENT_MD5" "$CONTENT_TYPE" "$DATE" "$PATH_ONLY")
X_SIGNATURE=$(printf '%s' "$SIG_STR" | openssl dgst -sha1 -hmac "$SECRET" | awk '{print tolower($2)}')

# 2) Requisição
curl -X POST "https://amojo.kommo.com${PATH_ONLY}" \
  -H "Date: ${DATE}" \
  -H "Content-Type: ${CONTENT_TYPE}" \
  -H "Content-MD5: ${CONTENT_MD5}" \
  -H "X-Signature: ${X_SIGNATURE}" \
  -d "$BODY"
```

Resposta esperada (`200`): objeto `new_message` com `msgid`, `ref_id`, `conversation_id`, `sender_id`,
`receiver_id` (ver seção 9).

---

## Fontes

- https://developers.kommo.com/reference/send-message-guide.md — Five steps to send a message
- https://developers.kommo.com/reference/chats-api-authorization-and-headers.md — Chats API authorization (headers, MD5, X-Signature)
- https://developers.kommo.com/reference/chat-api-accountid.md — Chats API account ID (amojo_id de conta e usuário)
- https://developers.kommo.com/reference/register-channel.md — Register a chat channel
- https://developers.kommo.com/reference/connect-channel.md — Connect chat channel
- https://developers.kommo.com/reference/disconnect-channel.md — Disconnect chat channel
- https://developers.kommo.com/reference/create-chat.md — Create new chat
- https://developers.kommo.com/reference/link-chat-contact.md — Link chat to contact
- https://developers.kommo.com/reference/send-import-messages.md — Import, send and edit messages
- https://developers.kommo.com/reference/chat-history.md — Get chat history
- https://developers.kommo.com/reference/update-delivery-status.md — Update message delivery status
- https://developers.kommo.com/reference/send-reactions.md — Send or withdraw reactions
- https://developers.kommo.com/reference/typing-info.md — Transfer typing information
- https://developers.kommo.com/reference/receiving-chat-webhooks.md — Chats API webhooks
- https://www.kommo.com/developers/content/chats/development/ — Chats development (visão geral / IDs / amojo host)
- https://www.kommo.com/developers/content/chats/connecting-a-chat-channel/ — Connecting a chat channel
- https://developers.kommo.com/llms.txt — Índice de páginas (Markdown/OpenAPI)
