# Kommo API — VoIP / Chamadas (Calls) API

## Visão geral do recurso

A integração de VoIP/telefonia da Kommo (ex-amoCRM) permite registrar chamadas no CRM, identificar quem está ligando, iniciar chamadas a partir dos cartões (click-to-call), notificar o usuário de chamadas recebidas e armazenar gravações. O recurso central de API é o **registro de chamadas em massa** via o endpoint `POST /api/v4/calls`, que recebe um array de chamadas, **busca automaticamente a entidade (contato/empresa/lead) pelo número de telefone** e anexa o registro da chamada à entidade correta segundo um algoritmo definido.

As chamadas aparecem no feed da entidade como **notas** dos tipos `call_in` (chamada recebida) e `call_out` (chamada efetuada).

Conforme a doc oficial de VoIP, a API de telefonia da Kommo cobre os seguintes recursos:

- **Click-to-call** — efetuar uma chamada a partir do cartão do lead (Web SDK).
- **Call notification** — exibir uma janela de notificação na interface da Kommo (Web SDK).
- **Caller ID** — recuperar a identidade de quem está ligando.
- **Call logging** — adicionar em massa logs de chamadas vindos do serviço VoIP (API REST `/api/v4/calls`).
- **Call result** — permitir ao gestor adicionar nota/resultado ou anexar a chamada recebida a um lead existente (Web SDK + REST).
- **Adding calls to incoming leads** — criar um novo lead se o autor da ligação for desconhecido.
- **Creating contact cards for unknown callers** — criar cartão de contato para autores desconhecidos.
- **Smart forwarding** — roteamento para o gestor responsável pelo cartão do contato.
- **Error notifications** — notificações de erro.
- **Call list creation for automatic dialing** — criação de lista de chamadas para discagem automática.
- **Built-in call feature (webRTC)** — fazer e receber chamadas direto no navegador.

> Observação: o registro de chamadas é feito via **API REST** (`/api/v4/calls`). Já caller ID, notificação de chamada recebida, click-to-call e a modal de resultado são implementados via **Web SDK** (JavaScript do widget), não por REST. A própria doc de VoIP menciona o uso do Web SDK para customizar a interface (exibir painel de chamada, registrar resultados etc.).

---

## Endpoint principal — Adicionar chamadas

```
POST https://{subdominio}.kommo.com/api/v4/calls
```

- **Autenticação:** `Authorization: Bearer {access_token}` (OAuth 2.0).
- **Request Content-Type:** `application/json`
- **Corpo:** **array de objetos** (permite adicionar várias chamadas de uma vez / bulk).
- **Resposta de sucesso:** `Content-Type: application/hal+json`
- **Resposta de erro:** `Content-Type: application/problem+json`
- **Permissões:** o método respeita os direitos de acesso do usuário do token.

> Não há endpoint REST dedicado para **listar** chamadas. As chamadas são lidas como **notas** das entidades (filtrando `note_type` = `call_in` / `call_out`) via `GET /api/v4/{entity_type}/notes` ou `GET /api/v4/{entity_type}/{id}/notes`. (a sintaxe exata do filtro por `note_type` não consta na página de chamadas)

---

## Parâmetros do corpo da requisição (campos da chamada)

| Campo | Tipo | Obrigatório | Descrição |
|---|---|:---:|---|
| `direction` | string | ✓ | Direção da chamada: `inbound` (recebida) ou `outbound` (efetuada). |
| `phone` | string | ✓ | Número de telefone que será buscado para anexar a chamada à entidade. |
| `duration` | integer | ✓ | Duração da chamada em **segundos**. |
| `source` | string | ✓ | Origem da chamada (nome da integração, ex.: `Twilio`). |
| `uniq` | string | | Identificador único da chamada (recomendado para deduplicação). |
| `link` | string | | URL da **gravação** da chamada. |
| `call_result` | string | | Resultado/anotação textual da chamada. |
| `call_status` | integer | | Status da chamada (valores `1`–`7`, ver abaixo). |
| `call_responsible` | string | | Para chamada recebida: para quem foi a ligação; para efetuada: quem ligou. Aceita ID de usuário Kommo, telefone ou nome. |
| `responsible_user_id` | integer | | ID do usuário responsável pela chamada. |
| `created_by` | integer | | ID do usuário que criou a chamada. **Se não enviar valor, a chamada aparecerá nas estatísticas como feita por um "robô".** |
| `updated_by` | integer | | ID do último usuário que editou a chamada. |
| `created_at` | integer | | Data de criação da chamada (Unix Timestamp). |
| `updated_at` | integer | | Data de edição da chamada (Unix Timestamp). |
| `request_id` | string | | String devolvida **inalterada** na resposta; **não é salva**. Útil para correlacionar requisição/resposta. Se não enviada, retorna o índice do item no array. |

### Valores de `call_status`

| Valor | Significado |
|:---:|---|
| `1` | Deixou recado (left a message) |
| `2` | Ligar depois (call back later) |
| `3` | Indisponível (not available) |
| `4` | Houve conversa (had a conversation) |
| `5` | Número inválido (invalid phone number) |
| `6` | Sem conexão (no connection) |
| `7` | Linha ocupada (the line is busy) |

---

## Algoritmo de anexação por telefone

Ao registrar a chamada, a Kommo busca contato/empresa pelo número e aplica esta lógica:

1. A busca é feita pelos **últimos 10 dígitos** do número.
2. Se o contato/empresa tiver **um único lead ativo**, a chamada é anexada ao **cartão do lead**.
3. Se tiver **mais de um lead ativo** ou **nenhuma entidade vinculada**, a chamada é anexada ao **cartão do contato/empresa**.
4. Se **nenhuma entidade** for encontrada pelo telefone, a chamada **não é adicionada** ("the call will not be added"). Dependendo da configuração da integração de call logging, pode-se criar um **incoming lead** para chamadas recebidas de números desconhecidos (isso é feito pela integração no fluxo de call logging, não pelo endpoint `/api/v4/calls` automaticamente).

---

## Exemplo de requisição (JSON real da doc)

```json
[
  {
    "duration": 10,
    "source": "example_integration",
    "phone": "+1223334444",
    "link": "https://example.com/audio.mp3",
    "direction": "inbound",
    "call_result": "Discussed the project",
    "call_status": 4
  }
]
```

Exemplo via `curl` (campos válidos, demonstrando `outbound` + `uniq` + `created_by`):

```bash
curl --request POST \
  --url 'https://example.kommo.com/api/v4/calls' \
  --header 'Authorization: Bearer XXXX' \
  --header 'Content-Type: application/json' \
  --data '[
    {
      "direction": "outbound",
      "phone": "+1223334444",
      "duration": 47,
      "source": "example_integration",
      "uniq": "f4b2c1a0-5fb3-406d-93a3-a4832dc28f8b",
      "link": "https://example.com/audio.mp3",
      "call_result": "Agendou reuniao",
      "call_status": 4,
      "created_by": 9876543,
      "responsible_user_id": 9876543
    }
  ]'
```

---

## Exemplo de resposta (200 — JSON real da doc)

```json
{
  "_total_items": 1,
  "errors": [],
  "_embedded": {
    "calls": [
      {
        "id": 111XXXX,
        "entity_id": 123123112,
        "entity_type": "contact",
        "account_id": 123XYZ,
        "request_id": "0",
        "_embedded": {
          "entity": {
            "id": 321ZYX,
            "_links": {
              "self": {
                "href": "https://example.kommo.com/api/v4/contacts/123123112"
              }
            }
          }
        }
      }
    ]
  }
}
```

### Campos da resposta

| Campo | Tipo | Descrição |
|---|---|---|
| `_total_items` | int | Total de chamadas processadas. |
| `errors` | array | Lista de erros (vazia em caso de sucesso). |
| `_embedded.calls[]` | array | Chamadas criadas. |
| `_embedded.calls[].id` | int | ID da nota/chamada criada. |
| `_embedded.calls[].entity_id` | int | ID da entidade em que a chamada foi inserida. |
| `_embedded.calls[].entity_type` | string | Tipo da entidade (`contact`, `company`, `lead`). |
| `_embedded.calls[].account_id` | int | ID da conta. |
| `_embedded.calls[].request_id` | string | `request_id` enviado, ou o índice do item se não enviado. |
| `_embedded.calls[]._embedded.entity` | obj | Modelo da entidade à qual a chamada foi anexada (com `id` e `_links.self`). |

---

## Chamadas como notas: tipos `call_in` / `call_out`

No feed da entidade, as chamadas são notas com `note_type` `call_in` (Incoming call / recebida) ou `call_out` (Outgoing call / efetuada). Os parâmetros ficam no objeto `params`:

```json
"params": {
  "uniq": "XXXXX-5fb3-406d-93a3-a4832dc28f8b",
  "duration": 60,
  "source": "Twilio",
  "link": "https://example.com",
  "phone": "+14155551234"
}
```

| Campo (`params`) | Tipo | Descrição |
|---|---|---|
| `uniq` | string | Identificador único da chamada. |
| `duration` | integer | Duração em segundos. |
| `source` | string | Nome da integração/serviço. |
| `link` | string | URL da gravação. |
| `phone` | string | Número envolvido. |

> Campos como `call_responsible`, `call_status` e `call_result` aparecem na API de `/api/v4/calls`, mas **não** constam no objeto `params` da nota `call_in`/`call_out` na doc de tipos de notas — lá só estão documentados os 5 campos acima.

---

## Web SDK — Click-to-call

Registra ação de clique no telefone do cartão usando `self.add_action(type, action)` dentro do `init` (em `script.js`):

```javascript
init: function(self){
 self.add_action('phone', function(data){
  self.crm_post(
   'http://yourservice.com/dealmethod.php',
   { call_to: data.value },
   function(msg){ alert('Call is performed'); },
   'text',
   function(){ alert('Error'); }
  );
 });
}
```

| Parâmetro | Tipo | Finalidade |
|---|---|---|
| `type` | string | Tipo do campo: `phone` ou `email`. |
| `action` | function | Callback executado ao clicar; recebe `data` com `data.value` (o número/e-mail). |

Declare as localizações no `manifest.json` onde os telefones aparecem:

```json
{
  "locations": ["ccard-1","clist-1","lcard-1","llist-1","comcard-1","everywhere"]
}
```

Personalize o rótulo do botão em `i18n` via a chave `call_action` (se omitida, usa o nome do widget do manifest):

```json
{ "widget": { "call_action": "Call" } }
```

(EN: `Call` · ES: `Llamar` · PT: `Chamar`)

---

## Web SDK — Caller ID (identificação do autor)

Duas abordagens, com **algoritmos diferentes** (variam no número de dígitos e na ordem de prioridade das entidades):

1. **Via Call Event** — busca o caller ID e cria a notificação ligada ao cartão do telefone. Busca pelos **últimos 8 dígitos**; prioridade **contato → empresa → lead**.
2. **Via lista de contatos** — busca por `query` (filtro por telefone). Busca pelos **últimos 7 dígitos**; prioridade **empresa → contato → lead**.

```bash
curl --request GET \
  --url 'https://subdomain.kommo.com/api/v4/contacts?query=$phone_number' \
  --header 'accept: application/json' \
  --header 'authorization: Bearer XXXX'
```

---

## Web SDK — Notificação de chamada recebida (Call Event)

Método: `APP.notifications.add_call(call_params)`. A notificação aparece como janela na interface da Kommo. Requer `"locations": ["everywhere"]` no `manifest.json`.

```javascript
const addCallNotification = async (notificationOptions) => {
  const {
    text, from, to, duration, link,
    date = Math.ceil(Date.now() / 1000),
    element: entity,
    clickLink,
  } = notificationOptions;

  const possibleCallers = await searchContactByPhone(from);
  const notificationText = possibleCallers.reduce((acc, contact, index) => {
    const { name } = contact;
    return `${index ? acc : `${acc}, `}${name}`;
  }, "Phone number is linked to: ");

  const notification = {
    text: notificationText,
    from, to, duration, link, date,
    element: entity,
    click_link: clickLink,
  };

  APP.notifications.add_call(notification);
};
```

| Parâmetro | Descrição |
|---|---|
| `text` | Texto da notificação. |
| `from` | Telefone de quem ligou. |
| `to` | Telefone/ramal de destino. |
| `duration` | Duração da chamada. |
| `link` | Link associado (ex.: gravação). |
| `date` | Timestamp (default: agora). |
| `element` | Referência da entidade (contato/empresa/lead). |
| `click_link` | Link do handler de clique. |

---

## Web SDK — Janela de resultado da chamada (Call Result)

Modal "Call summary" onde o gestor confirma a entidade vinculada (lead/contato/empresa), ouve a gravação (painel com duração + play), agenda tarefa (hora + nota) e salva o resultado (botões Save/Cancel). Ao salvar, o backend monta uma `UpdateFromModalTask` (account ID, call ID, entity ID, entity type) e um worker (`UpdateFromModalWorker`) executa o `UpdateFromModalUseCase`, que trata o vínculo conforme o tipo de entidade:

- **LEADS** — anexa o contato do incoming lead, se o gestor selecionou esse tipo de entidade.
- **CONTACTS / COMPANIES** — atualiza a informação de telefone a partir do contato não classificado (unsorted).

```javascript
import Modal from "lib/components/base/modal";
import markup from "./markup.js";

const appendCallResultModal = () => {
  const modal = new Modal({
    class_name: "modal-window",
    init: function ($modal_body) {
      $modal_body
        .trigger("modal:loaded")
        .html(markup)
        .trigger("modal:centrify");
    },
    destroy: () => {},
  });
};
```

O registro final continua sendo feito via `POST /api/v4/calls` (que busca a entidade pelo telefone e anexa o registro).

---

## Gravação de chamada

- A gravação é referenciada pelo campo `link` (URL do áudio, ex.: `.mp3`).
- **Pegadinha crítica:** para o player de áudio da Kommo funcionar (com seek/avançar/retroceder), o servidor que hospeda a gravação **deve** retornar o cabeçalho HTTP **`Accept-Ranges: bytes`**. A ausência desse cabeçalho prejudica a funcionalidade de seek.

---

## Fluxo recomendado de integração (call logging)

1. O serviço de VoIP dispara um **webhook** quando a chamada termina.
2. O backend da integração identifica a entidade (contato/empresa/lead) pelo telefone — ou cria um **incoming lead** se não houver entidade vinculada ao número.
3. Registra a chamada via `POST /api/v4/calls` (com `link` da gravação quando houver).
4. Opcionalmente, o gestor complementa pelo modal de resultado.
5. Use **fila assíncrona** (a doc recomenda Beanstalkd, Apache Kafka ou RabbitMQ pela performance, confiabilidade e simplicidade) e **grave em banco** as informações da nota adicionada para regular a **deduplicação** — nem chamadas duplicadas nem incoming leads ignorados devem ser enviados à Kommo.

---

## Limites / rate limits

- **Limite de taxa da API Kommo:** **no máximo 7 requisições por segundo**, aplicado **por endereço de IP** (não por conta). Ao exceder, a API retorna **HTTP 429**; em caso de violações repetidas, o IP é bloqueado e qualquer requisição passa a retornar **HTTP 403**. (Limite global da plataforma; a página de chamadas não documenta um limite específico só para `/api/v4/calls`.)
- **Tamanho do lote (entidades em geral):** a doc de limitações fala em **no máximo 250** entidades adicionadas/atualizadas por requisição, com **recomendação de no máximo 50**. Esses números são da regra geral de entidades (leads/contatos/empresas); a página de chamadas **não** especifica um limite explícito de itens por array para `/api/v4/calls`.
- Prefira enviar um **array** com múltiplas chamadas em uma requisição a fazer uma requisição por chamada.

---

## Códigos HTTP

| Código | Significado |
|---|---|
| `200 OK` | Requisição bem-sucedida; chamadas adicionadas. |
| `400 Bad Request` | Dados inválidos; detalhes no corpo da resposta. |
| `401 Unauthorized` | Usuário/token não autorizado para o endpoint. |
| `429 Too Many Requests` | Excedeu o limite de 7 req/s (limite global da plataforma). |
| `403 Forbidden` | IP bloqueado por violações repetidas do rate limit (limite global da plataforma). |

> Obs.: a página de referência de `/api/v4/calls` lista explicitamente apenas `200`, `400` e `401`. `429` e `403` são comportamentos do rate limit global da API Kommo (página de limitações).

---

## Pegadinhas e erros comuns (gotchas)

- **Corpo é array.** Mesmo para uma única chamada, envie `[{ ... }]`, não `{ ... }`.
- **Sem `created_by` → "robô".** Omitir `created_by` faz a chamada aparecer nas estatísticas como feita por um robô; informe o ID do usuário real.
- **Busca por últimos 10 dígitos (anexação).** A anexação por telefone usa os **últimos 10 dígitos** — formatos/DDI inconsistentes podem anexar ao registro errado ou não encontrar a entidade.
- **Atenção às diferenças de dígitos entre recursos:** anexação de chamada = últimos **10**; caller ID via call event = últimos **8**; caller ID via lista de contatos = últimos **7** (e prioridades de entidade diferentes entre as duas abordagens de caller ID).
- **Lead ativo vs. contato.** Com 1 lead ativo a chamada vai pro lead; com 0 ou >1, vai pro contato/empresa — não assuma sempre o lead.
- **Sem entidade = não adicionada.** Telefone sem match faz a chamada **não ser adicionada** (a menos que sua integração crie incoming lead no fluxo de call logging).
- **Gravação sem `Accept-Ranges: bytes`** quebra o seek do player de áudio.
- **`request_id` não é salvo** — serve só para correlação na resposta; não use como identificador persistente (use `uniq`).
- **Deduplicação é sua responsabilidade.** Webhook + modal podem registrar a mesma chamada; persista o `uniq`/call ID em banco e cheque antes de gravar.
- **Listar chamadas:** não há GET dedicado; recupere como notas filtrando `note_type` `call_in`/`call_out` nas notas da entidade.
- **Rate limit é por IP, não por conta.** 7 req/s por IP; estouro → 429; reincidência → 403 (IP bloqueado).

---

## Fontes

- https://developers.kommo.com/reference/add-calls.md (Add Calls — referência de `/api/v4/calls`: campos, valores de `call_status`, exemplos de request/response, content-types, códigos 200/400/401)
- https://developers.kommo.com/reference/calls.md (Calls — algoritmo de anexação por telefone: últimos 10 dígitos, regra de lead ativo, "call will not be added")
- https://developers.kommo.com/docs/voip.md (Visão geral da integração VoIP e lista de recursos, incluindo webRTC e auto-dialing)
- https://developers.kommo.com/docs/call-logging.md (Fluxo de registro de chamadas, webhook, deduplicação, fila Beanstalkd/Kafka/RabbitMQ, `Accept-Ranges: bytes`)
- https://developers.kommo.com/reference/notes-types.md (Tipos de nota `call_in` / `call_out` e objeto `params`)
- https://developers.kommo.com/docs/click-to-call.md (Click-to-call via `add_action`, manifest `locations`, i18n `call_action`)
- https://developers.kommo.com/docs/caller-id.md (Caller ID: últimos 8/7 dígitos, prioridades de entidade, busca por `query`)
- https://developers.kommo.com/docs/call-event.md (Notificação de chamada via `APP.notifications.add_call`, `locations: ["everywhere"]`)
- https://developers.kommo.com/docs/call-result.md (Janela modal de resultado: `UpdateFromModalTask`/`UpdateFromModalUseCase`/`UpdateFromModalWorker`, LEADS/CONTACTS/COMPANIES)
- https://developers.kommo.com/docs/limitations.md (Rate limit: 7 req/s por IP, HTTP 429, bloqueio 403; limites de lote 250/50)
- https://developers.kommo.com/llms.txt (índice de páginas da documentação)
- Versão PT equivalente: https://pt-developers.kommo.com/docs/voip
