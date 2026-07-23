# Kommo — QUICKSTART de Automação (CardápioWeb)

> Guia prático em pt-BR para construir automações na conta **Kommo da CardápioWeb**, conectando
> os conceitos da API às receitas que já usamos em produção (n8n + Salesbots).
> Índice geral das referências: [`00-INDEX.md`](./00-INDEX.md).
>
> **Regra de segurança:** este documento **nunca** contém o valor do token. O token de longa
> duração fica no `.env` como `KOMMO_LONG_DURATION_KEY`. Nos exemplos, referencie sempre a
> variável (`${KOMMO_LONG_DURATION_KEY}`) — nunca cole o valor literal em código, JSON de
> Salesbot ou nó do n8n. No n8n, guarde o token como **credencial** (Header Auth) e referencie
> pela credencial, não em texto plano no nó.

---

## 0. Dados da conta (constantes do projeto)

| Item | Valor | Onde usar |
|---|---|---|
| Base URL | `https://marketingcardapiowebcom.kommo.com/api/v4` | toda chamada REST |
| Domínio (sem `/api/v4`) | `https://marketingcardapiowebcom.kommo.com` | endpoints fora do `/api/v4` (ex.: `/oauth2/...`, `/bots/{id}/run`) |
| `account_id` | `34164247` | validar payload de webhook (multi-conta / anti-spoofing) |
| Auth header | `Authorization: Bearer ${KOMMO_LONG_DURATION_KEY}` | toda chamada REST |
| Token (no `.env`) | `KOMMO_LONG_DURATION_KEY` (longa duração, sem refresh) | nunca expor o valor |
| Campo de lead "Templates para enviar" | `field_id = 868708` (tipo `select`/enum) | setar template a disparar; cada opção tem seu `enum_id` |

> O token de longa duração opera com **direitos de admin** da conta e **não tem `refresh_token`**.
> Detalhes de autorização, validade e como revogar: [`autorizacao-tokens.md`](./autorizacao-tokens.md).

---

## 1. Autenticar e testar (`GET /account`)

Toda requisição autenticada leva o header `Authorization: Bearer ...` e (em POST/PATCH com corpo)
`Content-Type: application/json`. O teste de fumaça é o `GET /account`: se vier `200` com o `id`
da conta, o token e a base URL estão certos.

```bash
# carregue o .env antes (ex.: export $(grep -v '^#' .env | xargs)) — NÃO cole o token aqui
curl --request GET \
  --url 'https://marketingcardapiowebcom.kommo.com/api/v4/account' \
  --header "Authorization: Bearer ${KOMMO_LONG_DURATION_KEY}"
```

Resposta esperada (`200`), confirme que `id` bate com `34164247`:

```json
{ "id": 34164247, "name": "...", "subdomain": "marketingcardapiowebcom", "currency": "BRL", "_links": { } }
```

Erros úteis de reconhecer:
- **401** — token inválido/expirado/revogado (re-gerar o long-lived token).
- **403** — sem permissão **ou** IP bloqueado por abuso de rate limit (ver §8).
- **402** — conta com período pago encerrado.

Campos extras do `/account` (ex.: `amojo_id`, `users_groups`, `task_types`) só vêm com o parâmetro
`with` (ex.: `?with=users_groups,task_types`). Tabela completa em
[`autorizacao-tokens.md` → §6](./autorizacao-tokens.md). Conceitos gerais de resposta (HAL,
`_embedded`, `_links`, paginação) em [`conceitos-gerais-api.md`](./conceitos-gerais-api.md).

---

## 2. Receita: encontrar um lead pelo telefone e ler campos

Este é o fluxo recorrente que a automação faz a cada mensagem: **buscar o lead pelo telefone,
filtrar pelo funil de SDR e ler o responsável / campos**.

### 2.1 Buscar por telefone

O parâmetro `query` busca em todos os campos preenchidos da entidade (incluindo telefone do
contato). Use `with=contacts` para já trazer os contatos vinculados em `_embedded`.

```bash
curl --request GET \
  --url 'https://marketingcardapiowebcom.kommo.com/api/v4/leads?query=5511999998888&with=contacts&limit=50' \
  --header "Authorization: Bearer ${KOMMO_LONG_DURATION_KEY}"
```

> **Cuidado com o formato do telefone.** O `query` é casamento textual: se o número estiver salvo
> com máscara (`+55 (11) 99999-8888`) e você buscar só os dígitos, pode não casar. Normalize dos
> dois lados (tire `+`, espaços, parênteses, hífens) e, se necessário, tente algumas variações
> (com/sem DDI 55, com/sem o 9). Esse é o mesmo cuidado de "match por telefone" que usamos na
> migração CDP.

### 2.2 Filtrar pelo funil de SDR e ler campos

O `query` pode trazer leads de vários funis. Filtre o resultado pelo `pipeline_id` do funil de SDR
(no app: **Leads → Configurações do funil**; ou liste via API — ver
[`pipelines-status.md`](./pipelines-status.md)). Você pode filtrar direto na chamada:

```bash
curl --request GET \
  --url 'https://marketingcardapiowebcom.kommo.com/api/v4/leads?query=5511999998888&with=contacts&filter[pipeline_id][]=<PIPELINE_SDR_ID>&limit=50' \
  --header "Authorization: Bearer ${KOMMO_LONG_DURATION_KEY}"
```

> **Importante:** `query` e `filter[...]` se combinam, mas na prática é mais robusto buscar por
> `query` e filtrar o `pipeline_id` **no código** (n8n), porque um mesmo telefone pode ter leads
> em funis diferentes e você quer escolher o lead certo (ex.: o mais recente ativo). Itere sobre
> `_embedded.leads` e selecione por `pipeline_id == <PIPELINE_SDR_ID>`.

Campos que normalmente lemos de cada lead:

| Campo | Significado |
|---|---|
| `id` | ID do lead (use nas próximas chamadas) |
| `responsible_user_id` | responsável atual (decisão de transbordo / dono do atendimento) |
| `status_id` / `pipeline_id` | etapa e funil |
| `custom_fields_values[]` | campos personalizados (ex.: "Templates para enviar" `868708`) |
| `_embedded.contacts[]` | contatos vinculados (`id`, `is_main`) — só com `with=contacts` |

> **204 não é erro.** Se nenhum lead casar com o filtro, a API responde **204 No Content** (corpo
> vazio) — trate como "não achei", não como falha. Detalhes de paginação/filtros/HAL em
> [`leads.md`](./leads.md) e [`conceitos-gerais-api.md`](./conceitos-gerais-api.md).

---

## 3. Receita: atualizar um campo personalizado (com `enum_id`) num lead

Para campos do tipo **select/enum** (como "Templates para enviar", `868708`), o valor é
identificado por **`enum_id`** — não pelo texto da opção. Cada opção do select tem seu próprio
`enum_id`; descubra-os listando a definição do campo:

```bash
# Lista a definição do campo 868708 e mostra os enums (id + value) de cada opção
curl --request GET \
  --url 'https://marketingcardapiowebcom.kommo.com/api/v4/leads/custom_fields/868708' \
  --header "Authorization: Bearer ${KOMMO_LONG_DURATION_KEY}"
```

A resposta traz `enums: [ { "id": <enum_id>, "value": "nome_do_template", ... }, ... ]`. Anote o
`enum_id` da opção que você quer setar (ver [`campos-personalizados.md`](./campos-personalizados.md)
e [`valores-campos.md`](./valores-campos.md)).

Atualize o lead com **PATCH único** (`/leads/{id}` recebe **um objeto**, sem array):

```bash
curl --request PATCH \
  --url 'https://marketingcardapiowebcom.kommo.com/api/v4/leads/<LEAD_ID>' \
  --header "Authorization: Bearer ${KOMMO_LONG_DURATION_KEY}" \
  --header 'Content-Type: application/json' \
  --data '{
    "custom_fields_values": [
      {
        "field_id": 868708,
        "values": [ { "enum_id": <ENUM_ID_DO_TEMPLATE> } ]
      }
    ]
  }'
```

Pontos de atenção:
- **Select usa `enum_id`** dentro de `values` (não `{ "value": "texto" }`). Para campos de texto
  simples seria `{ "value": "..." }`; para `checkbox`, `{ "value": true }`.
- **Limpar o campo:** envie `"values": []` (array vazio).
- **PATCH em lote** (vários leads) usa `/leads` (sem `{id}`) com um **array**, e cada item precisa
  do `id`. PATCH único usa `/leads/{id}` com **objeto**. Formato errado → `400`.
- O corpo de erro vem em `application/problem+json` — leia o corpo, não só o status.

Estruturas de `custom_fields_values` por tipo de campo: [`leads.md`](./leads.md) e
[`valores-campos.md`](./valores-campos.md).

---

## 4. Receita: criar uma nota num lead

Notas (`note_type=common`) viram eventos no feed do card — é como registramos no Kommo o que a
automação fez (ex.: "Clara disparou FUP1", "lead pediu retorno sexta 14h"). O endpoint de criação
recebe **sempre um array**, mesmo para uma nota só.

```bash
curl --request POST \
  --url 'https://marketingcardapiowebcom.kommo.com/api/v4/leads/notes' \
  --header "Authorization: Bearer ${KOMMO_LONG_DURATION_KEY}" \
  --header 'Content-Type: application/json' \
  --data '[
    {
      "entity_id": <LEAD_ID>,
      "note_type": "common",
      "params": { "text": "Automacao: template <X> enviado via n8n." },
      "request_id": "nota-fup-001"
    }
  ]'
```

Pontos de atenção:
- `entity_type` no caminho é sempre **`leads`/`contacts`/`companies` em inglês**, mesmo na conta PT
  (usar `negocios`/`contatos` dá 404).
- POST de notas é **array**; PATCH de uma nota (`/notes/{id}`) é objeto único.
- `request_id` só ecoa na resposta para você correlacionar o lote — **não é salvo**.
- `is_need_to_trigger_digital_pipeline: false` evita que a nota dispare gatilhos do Digital
  Pipeline (útil para não criar loop com Salesbots que escutam `note_lead`).
- Tipos de nota, `params` por tipo e pin/unpin: [`notas.md`](./notas.md).

---

## 5. Receita: assinar webhooks e a estrutura do payload

Webhooks deixam a Kommo te avisar (POST no seu endpoint n8n) quando algo acontece — em vez de você
ficar fazendo polling. Exige plano Advanced/Pro/Enterprise e **token de admin** (o long-lived
serve).

### 5.1 Assinar (criar) um webhook

`settings` é o array de eventos. Para o fluxo da Clara, os mais úteis são `add_message`
(mensagem recebida), `status_lead` (mudou de etapa), `responsible_lead` (trocou responsável) e
`note_lead`.

```bash
curl --request POST \
  --url 'https://marketingcardapiowebcom.kommo.com/api/v4/webhooks' \
  --header "Authorization: Bearer ${KOMMO_LONG_DURATION_KEY}" \
  --header 'Content-Type: application/json' \
  --data '{
    "destination": "https://<SEU_N8N>/webhook/kommo-sdr",
    "settings": ["add_message", "status_lead", "responsible_lead"],
    "sort": 10
  }'
```

Listar / excluir (a exclusão é **por `destination`**, não por `id`):

```bash
# listar (filtra pela URL)
curl -G 'https://marketingcardapiowebcom.kommo.com/api/v4/webhooks' \
  --header "Authorization: Bearer ${KOMMO_LONG_DURATION_KEY}" \
  --data-urlencode 'filter[destination]=https://<SEU_N8N>/webhook/kommo-sdr'

# excluir
curl --request DELETE \
  --url 'https://marketingcardapiowebcom.kommo.com/api/v4/webhooks' \
  --header "Authorization: Bearer ${KOMMO_LONG_DURATION_KEY}" \
  --header 'Content-Type: application/json' \
  --data '{ "destination": "https://<SEU_N8N>/webhook/kommo-sdr" }'
```

### 5.2 Estrutura do payload recebido

> **Pegadinha nº 1:** o corpo **não é JSON puro** — chega como `x-www-form-urlencoded`. No n8n,
> o nó Webhook já decodifica para um objeto aninhado; em código próprio, parseie o form, não
> `JSON.parse(body)` direto.

O payload é um JSON aninhado: **grupo da entidade → ação → array de itens**. Exemplo de mensagem
recebida (`add_message`):

```json
{
  "message": {
    "add": [
      {
        "id": "660b5b93-...",
        "talk_id": "191",
        "contact_id": "11018118",
        "text": "Olá!",
        "entity_type": "lead",
        "entity_id": "9276114",
        "type": "incoming",
        "origin": "telegram",
        "created_at": "1726581295"
      }
    ]
  }
}
```

Exemplo de mudança de etapa (`status_lead`) — note `old_status_id`:

```json
{ "leads": { "status": [ { "id": "15318175", "status_id": "67548619", "old_status_id": "67548607", "pipeline_id": "8572511", "account_id": "34164247" } ] } }
```

Pegadinhas do payload (lista completa em [`webhooks.md`](./webhooks.md)):
- **Tudo vem como string**, inclusive IDs e timestamps — converta antes de comparar.
- **Contato e empresa compartilham a chave `contacts`** — diferencie pelo campo `type`
  (`"contact"` / `"company"`).
- **Leads de entrada (unsorted)** chegam como `unsorted.delete` (com `action: accept|decline`),
  não como `add_lead`.
- **Responda 2xx em < 2 segundos**, senão a Kommo reenvia e pode **desativar** o webhook (após
  >100 falhas em 2h). Faça o trabalho pesado de forma assíncrona.
- **Sem assinatura HMAC** nos webhooks de conta: valide o `account_id` do payload contra
  `34164247` e use uma URL de `destination` "secreta" (token no path) como mitigação.

---

## 6. Receita: estrutura mínima de um Salesbot (trocar responsável, setar campo, disparar webhook)

> A nomenclatura real do Salesbot **não** é `send_message`/`edit_lead`/`send_hook`. Os nomes
> oficiais são `show` (mensagem), `action` (editar lead), `widget_request` (webhook). Referência
> completa de handlers, ações, placeholders e endpoints em [`salesbot.md`](./salesbot.md).

O bot é um **array de passos (steps)**, contagem começando em **0**. Cada passo tem `question`
(ações ao enviar) e/ou `answer` (ações ao receber resposta). Edição via UI: **Leads → Automatizar →
Salesbot → View Source** (não há endpoint de API para criar/editar o JSON do bot — só
list/get/run/stop/continue).

Esqueleto que cobre o nosso fluxo (trocar responsável → setar "Templates para enviar" → disparar
webhook n8n):

```json
[
  {
    "question": [
      {
        "handler": "action",
        "params": {
          "name": "change_responsible_user",
          "params": { "value": <RESPONSAVEL_USER_ID>, "type": 2 }
        }
      },
      {
        "handler": "action",
        "params": {
          "name": "set_custom_fields",
          "params": { "type": 2, "custom_fields_id": 868708, "value": "<NOME_DA_OPCAO_TEMPLATE>" }
        }
      },
      {
        "handler": "widget_request",
        "params": {
          "url": "https://<SEU_N8N>/webhook/kommo-salesbot",
          "data": { "lead_id": "{{lead.id}}", "template": "<X>", "from": "salesbot" }
        }
      }
    ]
  }
]
```

Pontos críticos (todos detalhados em [`salesbot.md`](./salesbot.md)):
- **`change_responsible_user`** — `value` = ID do usuário, `type: 2` (lead). É o "troca de
  responsável" do transbordo.
- **`set_custom_fields`** — `type: 2` (lead), `custom_fields_id: 868708`. Em select, o `value` é o
  **texto da opção**; para usar `enum_id` diretamente prefira o PATCH da §3. Há os parâmetros
  `enum` (categoria, ex.: telefone/email) e `option: "add"` para listas multivalor.
- **`widget_request`** (o "send_hook") — **só funciona em step de Widget** do Salesbot; seu
  endpoint deve responder **HTTP 200 em até 2 s**, e o bot **só continua** depois que você chamar a
  `return_url` que vem no corpo (endpoint `/continue/`). Se for só "avisar o n8n" sem pausar o bot,
  pode ser mais simples disparar o n8n por **webhook de conta** (§5) reagindo a `responsible_lead`
  ou `note_lead`.
- **JSON do bot ≤ 64KB** e precisa ser válido antes de salvar (o editor não corrige).
- **Lançar/parar via API** (úteis a partir do n8n) usam o **domínio sem `/api/v4`**:
  - lançar: `POST https://marketingcardapiowebcom.kommo.com/api/v4/bots/{id}/run` com
    `{ "entity_id": <LEAD_ID>, "entity_type": "leads" }` → `202 Accepted` (corpo de **texto**, não
    JSON).
  - parar: `POST .../api/v4/bots/{id}/stop` (só `entity_type: leads`).

---

## 7. Padrão recomendado do fluxo no n8n (juntando tudo)

Fluxo recorrente em produção, na ordem:

1. **Gatilho:** webhook de conta (`add_message`/`status_lead`/`responsible_lead`) **ou**
   `widget_request` de um Salesbot chega no nó Webhook do n8n.
2. **Buscar lead por telefone:** `GET /leads?query={telefone}&with=contacts` (§2).
3. **Filtrar pelo funil de SDR** (`pipeline_id`) e selecionar o lead certo no código.
4. **Ler `responsible_user_id`** e os campos necessários.
5. **Agir:** criar nota (`POST /leads/{id}/notes`, §4) e/ou atualizar
   "Templates para enviar" (`PATCH /leads/{id}`, §3) e/ou lançar/parar um Salesbot.
6. **Responder o webhook** rápido (2xx em < 2 s) e fazer o restante de forma assíncrona.

No n8n use **HTTP Request nodes** com a credencial Header Auth (token do `.env`/credencial),
nunca o token em texto plano. Salesbots são importados pela UI (View Source).

---

## 8. Boas práticas

### Rate limits
- **Máximo 7 req/s por IP** (não por token). Estourar → **429**; reincidência → **IP bloqueado**
  com **403** em tudo. Como o n8n pode rodar várias execuções em paralelo do mesmo IP, **serialize
  ou aplique backoff** (retry com espera crescente em 429/504). Ref.:
  [`conceitos-gerais-api.md` → Limites](./conceitos-gerais-api.md).

### Paginação
- `limit` **máx. 250**; sempre passe `limit` explícito.
- **Itere por `_links.next.href`**, não incrementando `page` na mão; pare quando `next` sumir **ou**
  receber **204 No Content**.
- Nem todo recurso devolve `_total_items`/`_page_count`; o sinal confiável de "há próxima página" é
  `_links.next`.

### Filtrar por pipeline
- Filtre por funil com `filter[pipeline_id][]=<id>`. Para etapa específica, **par obrigatório**
  `filter[statuses][0][pipeline_id]` + `filter[statuses][0][status_id]` (só um estágio por funil
  por requisição). Na dúvida, filtre `pipeline_id` no código depois de buscar por `query` (§2.2).
- Liste pipelines/estágios para descobrir os IDs: [`pipelines-status.md`](./pipelines-status.md).

### Idempotência
- **Webhooks podem chegar duplicados / fora de ordem** (política de reenvio até 5 tentativas).
  Deduplique pelo `id` da entidade/nota/mensagem e ignore reprocessamentos (ex.: tabela/Sheets de
  controle, como já fazemos nos lembretes).
- Antes de criar nota/atualizar campo, **cheque o estado atual** para não repetir ação (ex.: não
  re-setar o mesmo `enum_id`, não re-disparar o mesmo template).
- Use `request_id` em POST de leads/notas para **correlacionar** entrada↔saída no lote (não
  persiste, mas ajuda no log).
- **Não dispare gatilhos em cascata sem necessidade:** `is_need_to_trigger_digital_pipeline: false`
  na nota evita loop com Salesbots que escutam `note_lead`.

### Datas e tipos
- Timestamps e filtros `[from]`/`[to]` são **Unix em segundos** (não ms, não ISO).
- No payload de webhook **tudo vem como string** — converta IDs/timestamps antes de comparar.

### Segurança
- **Nunca** escreva o valor do token em JSON de bot, nó do n8n ou neste repositório — só
  `${KOMMO_LONG_DURATION_KEY}` / credencial. O long-lived tem direitos de admin: se vazar, a conta
  inteira fica exposta. Como revogar: [`autorizacao-tokens.md`](./autorizacao-tokens.md).

---

## Referências relacionadas

- Índice geral: [`00-INDEX.md`](./00-INDEX.md)
- Autenticação/tokens, `/account`: [`autorizacao-tokens.md`](./autorizacao-tokens.md)
- Conceitos de API (HAL, paginação, filtros, rate limits, status): [`conceitos-gerais-api.md`](./conceitos-gerais-api.md)
- Leads (buscar/ler/criar/atualizar, `custom_fields_values`): [`leads.md`](./leads.md)
- Campos personalizados (definições, tipos, enums): [`campos-personalizados.md`](./campos-personalizados.md)
- Valores de campos / enums: [`valores-campos.md`](./valores-campos.md)
- Notas: [`notas.md`](./notas.md)
- Webhooks (eventos, payload, reenvio): [`webhooks.md`](./webhooks.md)
- Salesbot (handlers, ações, endpoints run/stop): [`salesbot.md`](./salesbot.md)
- Pipelines e estágios (IDs de funil/etapa): [`pipelines-status.md`](./pipelines-status.md)
- Usuários e funções (IDs de `responsible_user_id`): [`usuarios-funcoes.md`](./usuarios-funcoes.md)
</content>
</invoke>
