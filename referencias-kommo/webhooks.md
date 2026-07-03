# Kommo API — Webhooks

## Visão geral do recurso

**Webhooks** são notificações HTTP que a Kommo envia a aplicações de terceiros sempre que ocorre um evento na conta (ex.: lead criado, status alterado, tarefa concluída, nota adicionada). Servem para disparar fluxos automáticos — gerar uma fatura após o ganho de um lead, sincronizar contatos com uma lista de e-mail, acionar um bot externo, etc.

- **Planos:** trabalhar com webhooks exige plano **Advanced, Pro ou Enterprise**.
- **Permissão:** as operações de API (criar/listar/excluir) exigem que o usuário do token seja **administrador da conta** (a doc afirma explicitamente: "Method is available for administrator of the account only").
- **Base URL:** `https://{subdominio}.kommo.com`
- **Autenticação:** OAuth2 (Bearer token) — `Authorization: Bearer {access_token}`.
- **Configuração:** pode ser feita manualmente (Configurações → Integrações → Webhooks) ou via API (endpoints abaixo).
- **Formato do recebimento:** quando o evento ocorre, a Kommo faz **POST** para a sua `destination` com o payload em `x-www-form-urlencoded` (a doc oficial: "WebHook is sent in `x-www-form-urlencoded` format to a third-party application"). O conteúdo, decodificado, é um objeto JSON aninhado — ver "Estrutura do payload recebido".

Existe também uma variante no **Digital Pipeline / Salesbot** (configurada em Leads → Automatizar), com lista de eventos mais limitada e regras de retry próprias — ver seção específica ao final.

---

## Endpoints

Todos sob a coleção `/api/v4/webhooks`. Respostas de sucesso da listagem usam Content-Type `application/hal+json`.

### 1) Listar webhooks — `GET /api/v4/webhooks`

```
GET https://{subdominio}.kommo.com/api/v4/webhooks
```

**Parâmetros de query**

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `filter[destination]` | string | Filtra pela URL (`destination`) do webhook |

> A doc oficial só documenta o filtro `filter[destination]`. Não há paginação documentada para este recurso (a resposta retorna a coleção completa em `_embedded.webhooks`). Parâmetro `with` não é aplicável aqui.

**Exemplo de resposta (200)**

```json
{
  "_total_items": 2,
  "_embedded": {
    "webhooks": [
      {
        "id": 839656,
        "destination": "https://webhook-uri.com",
        "created_at": 1575539157,
        "updated_at": 1575539157,
        "account_id": 321321,
        "created_by": 123123,
        "sort": 1,
        "disabled": false,
        "settings": ["add_task"]
      },
      {
        "id": 849193,
        "destination": "https://api.test.com/KommoWebHook",
        "created_at": 1576157524,
        "updated_at": 1585816857,
        "account_id": 321321,
        "created_by": 123123,
        "sort": 2,
        "disabled": true,
        "settings": ["update_lead"]
      }
    ]
  }
}
```

**Status:** `200` OK · `401` Não autorizado (usuário não é administrador da conta).

---

### 2) Criar / inscrever webhook — `POST /api/v4/webhooks`

```
POST https://{subdominio}.kommo.com/api/v4/webhooks
Content-Type: application/json
```

**Corpo da requisição**

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `destination` | string | sim | URL válida onde você quer receber a notificação |
| `settings` | array de strings | sim | Eventos de gatilho do webhook, passados como array de eventos — ver tabela de eventos |
| `sort` | integer | não | Ordenação do webhook |

**Exemplo de corpo (request)**

```json
{
  "destination": "https://example.test",
  "settings": ["add_lead"],
  "sort": 10
}
```

**Exemplo de resposta (200)**

```json
{
  "id": 11110000,
  "destination": "https://example.test",
  "created_at": 1589012268,
  "updated_at": 1589012268,
  "account_id": 321321,
  "created_by": 1231234,
  "sort": 1,
  "disabled": false,
  "settings": ["add_lead"]
}
```

> Observação: criar um webhook com um `destination` já existente parece atualizar/mesclar os `settings` daquele destino (o `destination` é a chave usada também no DELETE). *(comportamento exato de merge vs. substituição não está documentado oficialmente — verificar empiricamente)*

**Status:** `200` Webhook criado · `400` Dados inválidos · `401` Não autorizado · `422` Não processável.

> Método disponível apenas para administrador da conta.

---

### 3) Excluir / cancelar inscrição — `DELETE /api/v4/webhooks`

```
DELETE https://{subdominio}.kommo.com/api/v4/webhooks
Content-Type: application/json
```

**Corpo da requisição**

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `destination` | string | sim | URL do webhook que se deseja excluir |

A exclusão é feita pela **URL de destino**, não pelo `id`.

**Status:**
- `204` No Content — excluído com sucesso
- `400` Dados inválidos / malformados
- `401` Não autorizado
- `403` Usuário sem privilégios de administrador (necessários para esta operação)
- `404` Webhook (URL) não encontrado na conta

> Método disponível apenas para administrador da conta.

---

## Tabela de eventos disponíveis (valores de `settings`)

Códigos aceitos no array `settings` ao criar o webhook (confirmados na referência oficial `webhook-events`):

| Código do evento | Descrição |
|---|---|
| `add_lead` | Lead adicionado |
| `update_lead` | Lead atualizado |
| `delete_lead` | Lead excluído |
| `restore_lead` | Lead excluído restaurado |
| `status_lead` | Status do lead alterado |
| `responsible_lead` | Responsável do lead alterado |
| `note_lead` | Nota adicionada ao lead |
| `add_contact` | Contato adicionado |
| `update_contact` | Contato atualizado |
| `delete_contact` | Contato excluído |
| `restore_contact` | Contato excluído restaurado |
| `responsible_contact` | Responsável do contato alterado |
| `note_contact` | Nota adicionada ao contato |
| `add_company` | Empresa adicionada |
| `update_company` | Empresa atualizada |
| `delete_company` | Empresa excluída |
| `restore_company` | Empresa excluída restaurada |
| `responsible_company` | Responsável da empresa alterado |
| `note_company` | Nota adicionada à empresa |
| `add_task` | Tarefa adicionada |
| `delete_task` | Tarefa excluída |
| `responsible_task` | Responsável da tarefa alterado |
| `add_talk` | Conversa (talk) adicionada |
| `add_message` | Mensagem recebida (incoming) |
| `add_chat_template_review` | Template de WhatsApp enviado para aprovação |

**Pegadinhas desta lista (importante):**
- **Não existe** `update_task` na lista de gatilhos. Os gatilhos de tarefa assináveis são apenas `add_task`, `delete_task` e `responsible_task`. Apesar disso, edição de texto e conclusão de tarefa chegam ao seu endpoint como payload `task.update` (ver exemplos) — ou seja, o payload `task.update` existe, mas não há um código `update_task` para inscrever.
- **Customers (clientes/compradores):** a lista oficial de gatilhos de `settings` **não inclui** eventos `*_customer`. A doc geral cita "Customers" entre as entidades suportadas, mas nenhum código `*_customer` aparece na referência de eventos.
- **Leads recebidos (unsorted):** não há código próprio na tabela — o payload de "incoming lead" chega como `unsorted.delete` (com `action: accept|decline`). A doc não documenta um gatilho `settings` separado para unsorted; a entidade "Incoming leads" é listada entre as suportadas. *(qual gatilho específico ativa o unsorted não está documentado — verificar)*
- **Elementos de catálogo / listas:** a entidade "List elements (Catalogs)" é citada entre as suportadas, mas a referência de eventos **não lista** um código `*_catalog` no array `settings`. *(verificar)*

---

## Estrutura do payload recebido (no seu endpoint)

Quando o evento ocorre, a Kommo faz **POST** para sua `destination` com Content-Type `application/x-www-form-urlencoded`. O conteúdo, decodificado, é um JSON aninhado no formato:

**Adição / atualização:**
```json
{
  "entity": {
    "add/update": [
      { "campos da entidade": "valores" }
    ]
  }
}
```

**Exclusão:**
```json
{
  "entity": {
    "delete": [
      { "id": "id" }
    ]
  }
}
```

A chave de topo é o **grupo da entidade** (`leads`, `contacts`, `task`, `unsorted`, `catalogs`, `message`, `talk`) e dentro dela a **ação** (`add`, `update`, `delete`, `restore`, `status`, `responsible`, `note`).

> Atenção: contatos **e empresas** chegam ambos sob a chave `contacts`. A doc oficial: "When creating and deleting contact or company entities, to avoid problems with backward compatibility, there is a `type` key that gives an understanding of which entity the webhook came from." Use o campo **`type`** (`"contact"` ou `"company"`) para distinguir.

### Exemplos reais de payload recebido

**Lead adicionado**
```json
{
  "leads": {
    "add": [
      {
        "id": "1111111",
        "name": "New Lead",
        "status_id": "2222222",
        "price": "500",
        "responsible_user_id": "3333333",
        "last_modified": "1726566390",
        "modified_user_id": "44444444",
        "created_user_id": "44444444",
        "date_create": "1726566390",
        "pipeline_id": "5555555",
        "account_id": "66666666",
        "custom_fields": [
          { "id": "77777777", "name": "Benefit", "values": [ { "value": "0" } ] }
        ],
        "created_at": "1726566390",
        "updated_at": "1726566390"
      }
    ]
  }
}
```

**Lead com status alterado** (note `old_status_id`)
```json
{
  "leads": {
    "status": [
      {
        "id": "15318175",
        "status_id": "67548619",
        "old_status_id": "67548607",
        "price": "1000",
        "responsible_user_id": "12345678",
        "pipeline_id": "8572511",
        "account_id": "12345678",
        "created_at": "1726572752",
        "updated_at": "1726572758"
      }
    ]
  }
}
```

**Lead com responsável alterado** (note `old_responsible_user_id`)
```json
{
  "leads": {
    "responsible": [
      {
        "id": "15318175",
        "status_id": "67548619",
        "responsible_user_id": "1234567",
        "old_responsible_user_id": "12345673",
        "pipeline_id": "8572511",
        "account_id": "12345678",
        "updated_at": "1726572882"
      }
    ]
  }
}
```

**Lead excluído**
```json
{ "leads": { "delete": [ { "id": "12345678", "status_id": "67548607", "pipeline_id": "8572511" } ] } }
```

**Contato adicionado** (campo `type: "contact"`)
```json
{
  "contacts": {
    "add": [
      {
        "id": "17611273",
        "name": "Contact Name",
        "responsible_user_id": "11087123",
        "account_id": "32720107",
        "custom_fields": [
          { "id": "771906", "name": "Phone", "code": "PHONE", "values": [ { "value": "1234567890", "enum": "552476" } ] },
          { "id": "771908", "name": "Email", "code": "EMAIL", "values": [ { "value": "user@example.com", "enum": "552488" } ] }
        ],
        "created_at": "1726573127",
        "updated_at": "1726573127",
        "type": "contact"
      }
    ]
  }
}
```

**Empresa adicionada** (mesma chave `contacts`, `type: "company"`, com `linked_leads_id`)
```json
{
  "contacts": {
    "add": [
      {
        "id": "17612521",
        "name": "Company name",
        "responsible_user_id": "11087123",
        "account_id": "32720107",
        "linked_leads_id": { "15319601": { "ID": "15319601" } },
        "created_at": "1726576533",
        "updated_at": "1726576534",
        "type": "company"
      }
    ]
  }
}
```

**Tarefa adicionada** (datas em string `Y-m-d H:i:s` + timestamps)
```json
{
  "task": {
    "add": [
      {
        "id": "1564671",
        "element_id": "15320411",
        "element_type": "2",
        "task_type": "1",
        "date_create": "2024-09-17 13:07:29",
        "text": "Task text",
        "status": "0",
        "account_id": "32720107",
        "responsible_user_id": "11087123",
        "complete_till": "2025-10-02 20:59:00",
        "created_at": "1726578449",
        "updated_at": "1726578449",
        "complete_before": "1759438740"
      }
    ]
  }
}
```

**Tarefa concluída / atualizada** (`status: "1"`, `action_close: "1"`)
```json
{
  "task": {
    "update": [
      {
        "id": "1564845",
        "element_id": "15320411",
        "task_type": "1",
        "text": "text",
        "status": "1",
        "action_close": "1",
        "old_text": "text",
        "responsible_user_id": "11087123",
        "updated_at": "1726579269"
      }
    ]
  }
}
```

**Nota de texto em lead** (`note_type: "4"`)
```json
{
  "leads": {
    "note": [
      {
        "note": {
          "text": "note text",
          "attachement": "",
          "note_type": "4",
          "element_type": "2",
          "element_id": "15320411",
          "account_id": "32720107",
          "metadata": "{\"event_source\":{\"id\":11087123,\"author_name\":\"Jean Pierre\",\"type\":1}}",
          "id": "4600471",
          "created_at": "1726580291",
          "updated_at": "1726580329"
        }
      }
    ]
  }
}
```

**Lead recebido — aceito** (chega como `unsorted.delete` com `action: "accept"`)
```json
{
  "unsorted": {
    "delete": [
      {
        "action": "accept",
        "uid": "f575b754b0d1eb1c380e53d6821ffd2820a6dfbe3822de0cfddaf266980f",
        "accept_result": { "leads": [ "15258873" ] },
        "category": "mail",
        "created_at": "1726392264",
        "modified_user_id": "11087123"
      }
    ]
  }
}
```

**Lead recebido — recusado** (`action: "decline"` + `decline_result`)
```json
{
  "unsorted": {
    "delete": [
      {
        "action": "decline",
        "decline_result": { "leads": [ "15270337" ] },
        "uid": "f575b754b0d1eb1c380e457edeba88954891f3dce5d2fe1324fd3e2af58d",
        "category": "mail",
        "created_at": "1726426986",
        "modified_user_id": "11087123"
      }
    ]
  }
}
```

**Mensagem recebida** (`add_message`)
```json
{
  "message": {
    "add": [
      {
        "id": "660b5b93-4ead-ac38-3797c062146c",
        "chat_id": "33b41601-443b-9108-6938ae6b7935",
        "talk_id": "191",
        "contact_id": "11018118",
        "text": "Hello!",
        "created_at": "1726581295",
        "entity_type": "lead",
        "entity_id": "9276114",
        "type": "incoming",
        "author": { "id": "e1ec058c-7efb-4b59-24b1bcesdf3168f6", "type": "external", "name": "user name" },
        "origin": "telegram"
      }
    ]
  }
}
```

### Tabela de campos importantes (payload recebido)

| Campo | Tipo | Observação |
|---|---|---|
| `id` | string | ID da entidade (vem como string no payload, mesmo sendo numérico) |
| `account_id` | string | ID da conta — útil para multi-conta |
| `created_at` / `updated_at` | string (Unix ts) | Timestamps em segundos |
| `date_create` / `last_modified` | string | Em leads/contatos vêm como Unix ts; em **tasks** vêm como `Y-m-d H:i:s` |
| `responsible_user_id` | string | Responsável atual |
| `old_responsible_user_id` | string | Presente em `responsible` (responsável anterior) |
| `status_id` / `old_status_id` | string | `old_status_id` presente em `status` de lead |
| `pipeline_id` | string | Funil do lead |
| `custom_fields[]` | array | `{ id, name, code, values: [{ value, enum }] }` |
| `type` | string | `"contact"` ou `"company"` (chave `contacts`) |
| `element_type` | string | Tipo da entidade vinculada: `1`=contato, `2`=lead, `3`=empresa |
| `task_type` / `status` / `action_close` | string | Tarefa: tipo, status (`0` aberta / `1` concluída), flag de fechamento |
| `note_type` | string | Tipo da nota: `4`=texto, `5`=arquivo |
| `action` | string | Em `unsorted.delete`: `accept` ou `decline` |

---

## Limites de entrega e política de reenvio

- **Timeout de resposta:** seu endpoint deve responder em **até 2 segundos**. Apenas códigos HTTP na faixa **100–299** são considerados entrega válida; códigos `0–99`, `300+`, `499` e `500–599` disparam reenvio.
- **Política de reenvio (webhooks de conta):** até 5 tentativas no total:

  | Tentativa | Espera | Condição de gatilho |
  |---|---|---|
  | 2 | 5 min | códigos 0–99 ou ≥300 |
  | 3 | 15 min | códigos 0–99 ou ≥300 |
  | 4 | 15 min | código 499 ou 500–599 |
  | 5 | 1 hora | código 499 ou 500–599 |

- **Desativação automática:** se forem recebidas **mais de 100 respostas inválidas nas últimas 2 horas** e o último webhook no momento da checagem também estiver inválido, o webhook é **desativado** (`disabled: true`) e precisa ser **reativado manualmente** nas configurações (botão Save) ou pela central de notificações do admin. Bloqueios baseados em IP também desativam por segurança e exigem reativação manual.
- **Digital Pipeline (variante):** até 4 reenvios em 1 hora; se houver mais de 100 respostas inválidas nos últimos 5 minutos, os reenvios são suspensos por 5 minutos e retomam automaticamente.

### Rate limit geral da API

O recurso de webhooks segue o limite global da API v4 da Kommo: **no máximo 7 requisições por segundo**, aplicado **por endereço IP** (não por conta). Exceder retorna `429 Too Many Requests`; violações repetidas bloqueiam o IP e retornam `403 Forbidden` para qualquer requisição daquele IP. (Fonte: página de limitações da API — não documentado especificamente na página de webhooks.)

---

## Pegadinhas e erros comuns (gotchas)

1. **O corpo NÃO é JSON puro** — é `x-www-form-urlencoded`. Frameworks que só fazem `json_decode($body)` direto vão falhar; é preciso ler o form-encoded (ex.: `$_POST` em PHP) ou desserializar o array aninhado.
2. **Tudo vem como string**, inclusive IDs e timestamps. Converta antes de comparar/numerar.
3. **Contato e empresa compartilham a chave `contacts`** — sempre cheque `type` para não tratar empresa como contato.
4. **Responda rápido (≤2s) com 2xx.** Faça o processamento pesado de forma assíncrona (enfileire) e devolva 200 imediatamente, senão a Kommo reenvia e pode desativar o webhook.
5. **DELETE é por `destination`, não por `id`.** Guarde a URL exata cadastrada.
6. **`update_task` não é um gatilho** — assine `add_task`/`delete_task`/`responsible_task`; edições/conclusões chegam como payload `task.update`.
7. **Leads recebidos** chegam como `unsorted.delete` (não como `add_lead`); aceitação/recusa são tratadas como `delete` com campo `action`.
8. **Datas de tarefa** vêm em `Y-m-d H:i:s` (string), diferente de leads/contatos que usam Unix timestamp — não assuma um formato único.
9. **Notas:** dedup por `id` da nota é recomendável, já que mídia e texto geram payloads `note` distintos.
10. **Exige administrador** — token de usuário sem perfil de admin recebe `403` ao excluir / `401` ao listar.
11. **`name` pode vir vazio** em `status`/`responsible`/`delete` de lead; não confie nele para identificar o lead, use o `id`.

---

## Assinatura / validação de autenticidade

A documentação oficial de webhooks **de conta** (guia geral + referência da API) **não descreve** mecanismo de assinatura HMAC, header `X-Signature` ou segredo compartilhado para validar que a requisição veio da Kommo. Estratégias práticas de mitigação, na ausência de assinatura documentada:
- Use uma URL de `destination` secreta/com token no path ou query.
- Valide o `account_id` do payload contra a sua conta esperada.
- Restrinja por IP de origem da Kommo, se disponível. *(faixa de IPs não documentada na página de webhooks — verificar)*

> Observação: a **Chats API** (mensageria/canais) tem seu próprio fluxo de webhooks **com verificação de assinatura** — cada webhook traz um header `X-Signature` gerado a partir do corpo da requisição via **HMAC-SHA1**, usando o *channel secret* como chave. Isso é um recurso distinto dos webhooks de conta tratados aqui (documentado em "Chats API webhooks").

---

## Webhooks em integração privada

- Para **integrações privadas**, os webhooks são criados/gerenciados via os mesmos endpoints `GET`/`POST`/`DELETE /api/v4/webhooks`, usando o `access_token` OAuth2 da integração privada (perfil admin).
- Diferente da configuração manual (na UI), os webhooks criados via API ficam atrelados ao `destination` informado e aparecem em `GET /api/v4/webhooks` com `created_by` apontando para o usuário/integração que os criou.
- A doc não detalha um comportamento distinto de payload para integrações privadas vs. públicas — o formato de recebimento é o mesmo descrito acima. *(nuances específicas de integração privada não documentadas — verificar)*

---

## Exemplo de uso (curl)

**Criar webhook que escuta criação e mudança de status de leads:**
```bash
curl -X POST "https://meusubdominio.kommo.com/api/v4/webhooks" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
        "destination": "https://meuapp.com/kommo/webhook",
        "settings": ["add_lead", "status_lead"],
        "sort": 10
      }'
```

**Listar webhooks filtrando por destino:**
```bash
curl -G "https://meusubdominio.kommo.com/api/v4/webhooks" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  --data-urlencode "filter[destination]=https://meuapp.com/kommo/webhook"
```

**Excluir webhook pelo destino:**
```bash
curl -X DELETE "https://meusubdominio.kommo.com/api/v4/webhooks" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "destination": "https://meuapp.com/kommo/webhook" }'
```

**Receptor mínimo (PHP) — responde 200 rápido e lê form-urlencoded:**
```php
<?php
// Kommo envia x-www-form-urlencoded; o array aninhado chega em $_POST
http_response_code(200); // responda 2xx em <2s
$payload = $_POST; // ex.: $_POST['leads']['add'][0]['id']
// ... enfileirar para processamento assíncrono ...
```

---

## Fontes

- https://developers.kommo.com/docs/webhooks-general (e versão .md)
- https://pt-developers.kommo.com/docs/webhooks
- https://developers.kommo.com/reference/add-webhooks (e versão .md)
- https://developers.kommo.com/reference/list-webhooks (e versão .md)
- https://developers.kommo.com/reference/delete-webhook.md
- https://developers.kommo.com/reference/webhook-events.md
- https://developers.kommo.com/docs/webhooks-dp
- https://developers.kommo.com/docs/limitations (rate limit 7 req/s por IP)
- https://developers.kommo.com/reference/receiving-chat-webhooks.md (Chats API: X-Signature HMAC-SHA1)
