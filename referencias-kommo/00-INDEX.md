# Kommo API — Referência Completa (pt-BR)

Índice mestre da documentação da API da Kommo (CRM, ex-amoCRM), organizada por recurso.
Cada seção é um arquivo `.md` neste diretório, revisado e conferido contra a documentação
oficial (`developers.kommo.com`), com visão geral do recurso, endpoints, exemplos de
requisição/resposta e — principalmente — as pegadinhas práticas que a doc oficial não
destaca bem.

## Padrão geral da API

A maior parte da API é REST sob a versão **v4**, com poucas exceções (token OAuth, Salesbot
legado v2, e a Chats/amojo e Files que rodam em hosts próprios).

- **Base URL:** `https://{subdominio}.kommo.com/api/v4/` — `{subdominio}` é o nome da conta
  (ex.: `minhaempresa.kommo.com`).
- **Autenticação:** header `Authorization: Bearer {access_token}` (OAuth 2.0 ou token de
  integração de longa duração). O endpoint que **gera** o token é a exceção: fica em
  `/oauth2/access_token` na raiz do domínio, **não** sob `/api/v4/`.
- **Formato HAL (JSON HAL):** respostas de sucesso vêm como `application/hal+json`. Dados
  ficam em `_embedded` (coleção e também dentro de cada entidade), e a navegação fica em
  `_links` (use `_links.next.href` para paginar — não incremente `page` na mão).
- **Erros:** vêm como `application/problem+json` — sempre leia o corpo, ele traz os detalhes.
- **Datas:** Unix Timestamp em **segundos** (não milissegundos, não ISO-8601), salvo campos
  específicos (alguns campos de data aceitam RFC-3339; tasks em webhook usam `Y-m-d H:i:s`).
- **Escrita em lote:** POST/PATCH em coleção recebem **array** (mesmo para 1 item); PATCH por
  ID (`/recurso/{id}`) recebe **objeto único**. Trocar o formato gera 400.
- **Rate limit:** 7 requisições/segundo por **IP** (não por token). Estouro → HTTP 429;
  reincidência → HTTP 403 com bloqueio do IP. Lote máx. 250, recomendado ≤ 50 (acima pode dar 504).
- **204 No Content:** em GET significa "vazio / fim da paginação", não erro.

---

## Seções

| Seção | Descrição | Principais endpoints |
|---|---|---|
| [Autorização e Tokens](autorizacao-tokens.md) | Fluxo OAuth 2.0, geração e renovação de tokens, token de longa duração, descoberta de `account_id`. | `POST /oauth2/access_token`, `GET /api/v4/account`, `GET https://www.kommo.com/oauth` (authorization request) |
| [Conceitos Gerais da API](conceitos-gerais-api.md) | Paginação por `_links.next`, filtros, `with`, estrutura `_embedded`, status codes, datas e rate limit. | `GET /api/v4/leads`, `GET /api/v4/contacts`, `GET /api/v4/companies`, `GET /api/v4/leads/custom_fields` |
| [Leads (Negócios)](leads.md) | Entidade central do CRM: oportunidades em funis. CRUD, criação complexa e leads não classificados (unsorted). | `GET/POST/PATCH /api/v4/leads`, `POST /api/v4/leads/complex`, `GET /api/v4/leads/unsorted`, `POST /api/v4/leads/unsorted/{uid}/accept` |
| [Contatos (Contacts)](contatos.md) | Pessoas vinculadas a leads/empresas; telefone e e-mail como campos multitext. | `GET/POST/PATCH /api/v4/contacts`, `GET /api/v4/contacts/{id}`, `PATCH /api/v4/contacts/{id}` |
| [Empresas (Companies)](empresas.md) | Organizações vinculadas a leads/contatos; campos personalizados e vínculos. | `GET/POST/PATCH /api/v4/companies`, `GET /api/v4/companies/custom_fields`, `POST /api/v4/companies/{id}/link` |
| [Clientes (Customers) e Recorrência](clientes-compradores.md) | Compradores recorrentes, transações, pontos de bônus, status e segmentos. Exige habilitar o modo. | `PATCH /api/v4/customers/mode`, `GET/POST/PATCH /api/v4/customers`, `POST /api/v4/customers/{customer_id}/transactions`, `.../customers/statuses`, `.../customers/segments` |
| [Campos Personalizados (definição)](campos-personalizados.md) | Definição (não valor) de custom fields e grupos, por entidade e em catálogos. | `GET/POST/PATCH /api/v4/{entity_type}/custom_fields`, `.../custom_fields/groups`, `GET /api/v4/catalogs/{list_id}/custom_fields` |
| [Valores de Campos Personalizados](valores-campos.md) | Como gravar/ler valores em `custom_fields_values` nas entidades (`value` vs `values`, enums, datas). | `POST/PATCH /api/v4/leads`, `PATCH /api/v4/contacts/{id}`, `POST /api/v4/leads/complex`, `GET /api/v4/{entity_type}/custom_fields` |
| [Pipelines e Status (Etapas)](pipelines-status.md) | Funis e suas etapas; IDs fixos 142 (Ganho) e 143 (Perdido); regras de exclusão. | `GET/POST/PATCH/DELETE /api/v4/leads/pipelines`, `.../pipelines/{pipeline_id}/statuses` |
| [Usuários e Funções (Users & Roles)](usuarios-funcoes.md) | Gestão de usuários, ativação/desativação, funções (roles) e direitos. Exige admin. | `GET/POST /api/v4/users`, `POST /api/v4/users/activate`, `GET/POST/PATCH/DELETE /api/v4/roles` |
| [Tarefas (Tasks)](tarefas.md) | Criação e conclusão de tarefas; `complete_till` obrigatório; sem GET/DELETE individual. | `GET/POST/PATCH /api/v4/tasks`, `PATCH /api/v4/tasks/{id}` |
| [Notas (Notes)](notas.md) | Notas por entidade (texto, anexo, chamada etc.); pin/unpin; `entity_type` sempre em inglês. | `GET/POST /api/v4/{entity_type}/notes`, `PATCH /api/v4/{entity_type}/notes/{id}`, `POST .../notes/{id}/pin` |
| [Tags](tags.md) | Tags por entidade; gravação substitui todo o conjunto; idempotência por nome no POST. | `GET/POST /api/v4/{entity_type}/tags`, `PATCH /api/v4/{entity_type}`, `POST /api/v4/leads` |
| [Eventos (Events)](eventos.md) | Histórico de eventos da conta (read-only); filtros por entidade/tipo; payload difere do webhook. | `GET /api/v4/events`, `GET /api/v4/events/{id}`, `GET /api/v4/events/types` |
| [Vínculos entre Entidades (Links)](vinculos-links.md) | Vincular/desvincular e listar relações entre entidades; `catalog_id` em catalog_elements. | `GET /api/v4/{entity}/{entity_id}/links`, `POST .../link`, `POST .../unlink` |
| [Catálogos e Produtos (Lists)](catalogos-produtos.md) | Listas/catálogos, elementos (produtos), campos do catálogo e vínculos com `quantity`. | `GET/POST/PATCH /api/v4/catalogs`, `.../catalogs/{list_id}/elements`, `.../catalogs/{list_id}/custom_fields` |
| [Webhooks](webhooks.md) | Cadastro/remoção de webhooks da conta; corpo x-www-form-urlencoded; responda 2xx em até 2s. | `GET/POST/DELETE /api/v4/webhooks` |
| [Salesbot — estrutura e ações](salesbot.md) | Estrutura de passos e ações do Salesbot; rodar/parar/continuar bots (sem criar via API). | `GET /api/v4/bots`, `POST /api/v4/bots/{id}/run`, `POST /api/v4/bots/{id}/stop`, `POST /api/v4/{bot}/{bot_id}/continue/{continue_id}` |
| [Chats API (amojo) — mensageria](chats-amojo.md) | Canal de chat custom em `amojo.kommo.com`; assinatura HMAC própria; histórico, entrega, reações. | `GET /api/v4/account?with=amojo_id`, `POST https://amojo.kommo.com/v2/origin/custom/{channel_id}/connect`, `POST .../{scope_id}/chats`, `.../{scope_id}/{msgid}/delivery_status` |
| [Pipeline Digital (Automações)](pipeline-digital.md) | Automações por etapa, gatilhos, eventos do Pipeline Digital e launch do Salesbot via v2. | `POST /api/v2/salesbot/run`, `GET/POST/PATCH/DELETE /api/v4/leads/pipelines`, `.../statuses`, `POST /api/v4/{bot}/{bot_id}/continue/{continue_id}` |
| [Arquivos (Files)](arquivos-files.md) | Upload em partes no drive, anexar/desanexar por entidade; hosts diferentes (drive vs subdomínio). | `POST /v1.0/sessions` (drive), `POST /upload/{session_token}` (drive), `PUT/GET/DELETE /api/v4/{entity}/{entity_id}/files`, `GET /api/v4/files/{file_uuid}/links` |
| [Fontes (Sources)](fontes-sources.md) | Cadastro de fontes de leads; `external_id` único; vínculo a pipeline; widget `lead_sources`. | `GET/POST/PATCH/DELETE /api/v4/sources`, `GET /api/v4/sources/{id}` |
| [VoIP / Chamadas (Calls)](voip-chamadas.md) | Registro de chamadas como notas; match por telefone; gravação via Accept-Ranges. | `POST /api/v4/calls`, `GET /api/v4/contacts?query={phone}`, `GET /api/v4/{entity_type}/{id}/notes` (note_type call_in/call_out) |

---

## Pegadinhas transversais

Regras que se repetem (e mordem) em quase todas as seções. Vale lê-las uma vez antes de
começar qualquer integração.

### Formato de corpo: array vs objeto
- **POST e PATCH em coleção exigem array**, mesmo para 1 item (`POST /leads`, `POST /tasks`,
  `POST /tags`, `POST /calls`, `POST /link`/`unlink`, etc.). Objeto solto → **400**.
- **PATCH por ID** (`/recurso/{id}`) exige **objeto único**. Mandar array aí → **400**.
- Em PATCH em lote, cada item precisa carregar o seu `id` (e em notas, também o `entity_id`).
- Tipos podem ser **inconsistentes entre leitura e escrita**: `result` de tarefa vem `[]` na
  leitura mas é objeto `{text}` na escrita; `enums` de campo vêm como array ao criar/listar
  mas como objeto indexado na resposta de PATCH múltiplo.

### Autenticação, tokens e permissões
- O endpoint de token é `/oauth2/access_token` na **raiz** do domínio, não em `/api/v4/`.
- `redirect_uri` deve ser **idêntico** ao configurado, inclusive no grant `refresh_token`
  (divergência → 400). Salve sempre o **novo** `refresh_token` a cada renovação.
- `code` do OAuth expira em **20 min** e é de uso único; troque imediatamente. 3 meses de
  inatividade no fluxo OAuth = perda de acesso.
- **Token de longa duração**: só para integração privada, sem refresh, não recuperável após
  gerado, e dá direitos de admin.
- Operações administrativas (usuários, funções, pipelines, campos/grupos, webhooks, fontes)
  exigem **token de admin** — senão **403** ("Insufficient rights" / scope ausente).
- `account_id` não vem na resposta do token: está no JWT do `access_token` ou via
  `GET /api/v4/account` (campo `id`).

### Paginação, leitura e status codes
- Pagine por **`_links.next.href`**, não por `page++`. Pare quando `next` sumir ou ao receber 204.
- **204 No Content** em GET = vazio / fim da paginação (corpo vazio), **não** é erro nem lista
  vazia. Vale também para "entidade inexistente" em `GET /recurso/{id}` em vários recursos.
- `limit` máximo é **250**; passe sempre explicitamente (default não é declarado na doc).
- `_total_items`/`_page_count` nem sempre vêm (ausentes, p.ex., na lista de Leads); o sinal
  universal de "há mais páginas" é `_links.next`.
- A resposta de **escrita não ecoa** `custom_fields_values` — faça GET para confirmar o que
  gravou.

### `with`, `_embedded` e nomes assimétricos
- `with` é **específico de cada recurso** (ex.: Contacts só aceita `leads` e
  `catalog_elements`; `customers`/`source` não são valores de `with`). Sem o `with` certo,
  vários blocos não vêm.
- `_embedded` aparece em **dois níveis** (na coleção e dentro de cada entidade). Respostas de
  PATCH por ID frequentemente vêm **envolvidas** em `_embedded.<recurso>` (array de 1).
- **Nomes divergem entre escrita e leitura:** `is_main` (request) vira `main_contact` (GET) em
  vínculos; em campos, `enum_code`/`enum_id` (escrita) vs `enum` legado (leitura).

### Campos personalizados e valores
- **Definição ≠ valor:** campos são gravados em `custom_fields_values` nas entidades, não
  pelos endpoints de `/custom_fields`.
- `values` (plural) é o array; `value` (singular) é a chave de cada item — confundir → 400/422.
- Select/multiselect: prefira `enum_id`/`enum_code`; passar `value` por texto exige **match
  exato** com a opção cadastrada. `field_code` costuma ser `null` em campos custom — use `field_id`.
- Telefone/e-mail são **multitext** (`value` + `enum_code`/`enum_id`), não colunas raiz.
- Enviar `custom_fields_values` de um campo **substitui** todo o conjunto daquele campo
  (`values:[]` apaga). Campos omitidos do payload não são alterados.
- `custom_fields_values` pode vir **`null`** (não `[]`) quando não há valores.

### Datas e números
- **Unix Timestamp em segundos** em quase tudo (filtros `updated_at`/`created_at`,
  `complete_till`, eventos, chamadas). Milissegundos geram datas absurdas.
- Exceções de formato: alguns campos de data aceitam **RFC-3339**; tasks em **webhook** vêm
  como `Y-m-d H:i:s`.
- `price` de lead é **inteiro** (sem decimais). IDs de evento e tudo que chega por **webhook**
  vêm como **string** (não use `parseInt`).
- `created_by`/`updated_by` = **0** significa Robô/sistema; omitir `created_by` em chamada faz
  ela aparecer como feita por "robô".

### Rate limit e lotes
- **7 req/s por IP** → 429; reincidência → **403 com bloqueio de IP**.
- Lote máx. **250**, mas recomendado **≤ 50** para evitar **504**.
- `request_id` é só eco/correlação na resposta, **não é salvo**; para deduplicação persistente
  use um campo próprio (ex.: `uniq` em chamadas).

### IDs e convenções da plataforma
- Etapas **142 (Ganho)** e **143 (Perdido)** têm IDs fixos e iguais em **todos** os pipelines;
  a etapa *Incoming leads* (type 1) tem ID próprio por pipeline. Status de sistema não são
  editáveis nem excluíveis.
- `entity_type` em URLs (notas, vínculos, etc.) é sempre em **inglês** (`leads`/`contacts`/
  `companies`), mesmo em conta PT — senão 404.
- **HTTP 402** = plano/trial encerrado (ou recurso fora do plano), não erro de token.
- Hosts variam: **mensageria** vai para `amojo.kommo.com` (assinatura HMAC própria, sem OAuth);
  **arquivos** usam o host do drive para upload/gestão e o subdomínio para anexar por entidade;
  **Salesbot launch** no Pipeline Digital usa `/api/v2/` (não v4).

### Webhooks (entrada)
- Corpo é **x-www-form-urlencoded** (não JSON puro) e tudo chega como **string**.
- Responda **2xx em até 2s** (Chats/amojo: 200 em até 5s, entrega única sem retry) ou a Kommo
  reenvia e pode desativar o webhook.
- O payload do **webhook difere** do payload da Events API de mesmo nome.
