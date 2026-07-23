# Kommo API — Autorização e Tokens

> Referência em pt-BR para a API v4 da Kommo (antiga amoCRM). Verificada contra a
> documentação oficial (developers.kommo.com e pt-developers.kommo.com). Os pontos
> marcados "(não confirmado na doc)" não puderam ser confirmados nas páginas oficiais
> consultadas — trate-os com cautela.

## Visão geral do recurso

A Kommo (antiga amoCRM) usa **OAuth 2.0** como mecanismo padrão de autorização. No fluxo OAuth os papéis são: a **conta do usuário** = proprietário do recurso (resource owner), a **sua integração** = cliente (client), e os **servidores da Kommo** = servidor de autorização e servidor de recurso.

Toda requisição autenticada à API v4 é feita contra a base URL da conta:

```
https://{subdominio}.kommo.com
```

e leva o token no header `Authorization: Bearer {token}`. Existem **três formas** de obter o token, conforme o tipo de integração:

| Forma | Tipo de integração | Tem refresh_token? | Validade |
|---|---|---|---|
| OAuth 2.0 (authorization_code → access/refresh) | Pública e privada | Sim | access_token: 24h / refresh_token: 3 meses |
| Token de longa duração (long-lived token) | **Somente privada** | Não | 1 dia a 5 anos (escolhido na geração) |
| Botão no site (Button on Site) | Pública | Sim (gera code → OAuth) | igual ao OAuth |

> Observação: a documentação **não usa o termo "token de uso único" (disposable token)** para autorização de API. O elemento de vida curta e uso único do fluxo é o **`authorization_code`** (código de autorização), que expira em **20 minutos** e é trocado uma vez por um par de tokens. Onde a doc fala em "uso único", refere-se a esse código.

---

## 1) OAuth 2.0 — fluxo de autorização

### Passo 1 — Obter o `authorization_code` (código de autorização)

O código de autorização pode ser obtido de algumas maneiras:
1. Copiando-o na janela modal da integração instalada (interface da conta);
2. Recebendo-o via redirecionamento ao **Redirect URI** após a instalação do widget (parâmetro `from_widget` presente);
3. Via redirecionamento após o usuário autorizar (fluxo de botão/modal).

A URL de pedido de autorização (quando iniciada por você) segue o padrão:

```
https://www.kommo.com/oauth?client_id={Integration_ID}&state={state}&mode={popup|post_message}
```

Parâmetros recebidos no **Redirect URI** quando o acesso é concedido (GET):

| Parâmetro | Descrição |
|---|---|
| `code` | O código de autorização (expira em 20 min) |
| `referer` | Endereço da conta do usuário, no formato `https://{subdominio}.kommo.com` — use-o para montar a base URL das chamadas seguintes. (A doc usa a grafia `referer`; a versão pt cita também `referrer` em uma passagem.) |
| `state` | A mesma string `state` que você enviou ao abrir a janela de autorização (proteção CSRF) |
| `from_widget` | Presente quando a requisição veio da instalação de um widget |
| `client_id` | ID da integração |

Em caso de recusa, o usuário é redirecionado para:

```
{Redirect_URI}?error=access_denied&client_id={Integration_Id}&state={state}
```

> **Importante:** o `code` expira em **20 minutos**. Troque-o por tokens imediatamente.

### Passo 2 — Trocar o código por tokens

**Endpoint**

```
POST https://{subdominio}.kommo.com/oauth2/access_token
```

**Headers**

```
Content-Type: application/json
```

(este endpoint **não** leva `Authorization`, pois ainda não há token.)

**Parâmetros do corpo (body)**

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `client_id` | string | ID da integração (Integration ID) |
| `client_secret` | string | Chave secreta (Secret key) |
| `grant_type` | string (enum) | `authorization_code` (primeira obtenção) ou `refresh_token` (renovação) |
| `code` | string | Código de autorização (usado com `grant_type=authorization_code`) |
| `refresh_token` | string | Token de atualização (usado com `grant_type=refresh_token`) |
| `redirect_uri` | string | Redirect URI exatamente como configurado na integração |

**Exemplo de corpo — `authorization_code`**

```json
{
  "client_id": "31885693-c5a8-4c1f-9d2e-0123456789ab",
  "client_secret": "aBcD3FgH...chave_secreta_da_integracao...",
  "grant_type": "authorization_code",
  "code": "def50200a1b2c3...codigo_de_autorizacao...",
  "redirect_uri": "https://minhaapp.com/oauth/callback"
}
```

**Exemplo de resposta (200)** — formato OAuth 2.0 padrão retornado pela Kommo (par de tokens + segundos até expirar):

```json
{
  "token_type": "Bearer",
  "expires_in": 86400,
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...access_token_jwt...",
  "refresh_token": "def502003d8f...refresh_token..."
}
```

> Os nomes dos campos (`token_type`, `expires_in`, `access_token`, `refresh_token`) são confirmados na doc de OAuth. Os valores de `access_token`/`refresh_token` são ilustrativos; `expires_in` reflete a validade de **24 horas (86400 s)** do access token. (O portal de referência renderiza os exemplos de valores via "Try It!" em JS, então só os nomes de campo foram confirmados textualmente.)

**Códigos de resposta**

| Código | Significado |
|---|---|
| 200 | Requisição processada com sucesso |
| 400 | Dados incorretos foram transmitidos — detalhes no corpo da resposta |

### Passo 3 — Usar o access token nas chamadas da API

```
GET https://{subdominio}.kommo.com/api/v4/leads
Authorization: Bearer {access_token}
```

---

## 2) Renovação do token (refresh)

Quando o `access_token` expira (24h), use o `refresh_token` (validade 3 meses) para obter um **novo par** de tokens, no **mesmo endpoint** `POST /oauth2/access_token`:

**Exemplo de corpo — `refresh_token`**

```json
{
  "client_id": "31885693-c5a8-4c1f-9d2e-0123456789ab",
  "client_secret": "aBcD3FgH...chave_secreta_da_integracao...",
  "grant_type": "refresh_token",
  "refresh_token": "def502003d8f...refresh_token...",
  "redirect_uri": "https://minhaapp.com/oauth/callback"
}
```

A resposta tem o mesmo formato do Passo 2 (novo `access_token` + novo `refresh_token`).

> **Pontos críticos:**
> - A cada renovação você recebe um **novo refresh_token**. Citação oficial: *"Once a refresh token is used to get a new pair of access & refresh tokens, the old refresh token becomes outdated."* Salve sempre o novo, senão precisará pedir autorização ao usuário de novo.
> - Se a integração **ficar 3 meses sem nenhuma chamada** que atualize o token, ela perde o acesso (auto-revogação) e é preciso re-autorizar.

---

## 3) Token de longa duração (long-lived token)

Mecanismo para **integrações privadas** (apenas a própria conta), que dispensa todo o fluxo de redirecionamento/`authorization_code`. A integração opera com **direitos de administrador** da conta.

**Características**
- **Não possui `refresh_token`** — *"Long-lived tokens do not have a `refresh_token`"* — não há lógica de renovação/monitoramento de validade.
- **Validade configurável de 1 dia a 5 anos** (escolhida no momento da geração).
- **Somente para integrações privadas.**
- Só um usuário com **direitos de administrador** pode criar.
- **Menos seguro:** se o token vazar, a conta inteira fica exposta.

**Como gerar**
1. Crie uma **integração privada**.
2. Abra a aba **Chaves e escopos** (*Keys and scopes*).
3. Clique em **Gerar token de longa duração** (*Generate long-lived token*).
4. Selecione a data de expiração e **copie o token na hora** — *"Once a token has been generated, make sure to save it. You won't be able to access it again."*

**Como revogar**
- Aba **Autorização** (*Authorization*) → botão **Revogar acesso** (*Revoke access*). A aba mostra a data de emissão e de expiração do token.

**Uso (idêntico ao access token do OAuth — header Bearer):**

```bash
curl --request GET \
     --url https://{subdominio}.kommo.com/api/v4/leads \
     --header 'Authorization: Bearer {TOKEN}'
```

```javascript
headers: {
  authorization: 'Bearer {TOKEN}'
}
```

---

## 4) Botão no site (Button on Site)

Para manter a consistência do OAuth 2.0, é possível instalar um botão no seu site. Ao clicar, o usuário vê uma página com os detalhes da integração (ícone, nome e escopo de permissões), escolhe entre as contas das quais é membro e autoriza. Concedido o acesso, é redirecionado ao **Redirect URL** com os parâmetros GET: `code`, `referer` e `state` (e `from_widget` quando aplicável).

**Snippet JS (por `client_id`)**

```html
<script
  class="kommo_oauth"
  charset="utf-8"
  data-client-id="xxxx"
  data-title="Button"
  data-compact="false"
  data-class-name="className"
  data-theme="light"
  data-locale="en"
  data-state="state"
  data-error-callback="functionName"
  data-mode="popup"
  src="https://www.kommo.com/auth/button.js"
></script>
```

**Atributos**

| Atributo | Função |
|---|---|
| `data-client-id` | ID da integração |
| `data-title` | Texto do botão (padrão: "Continue with Kommo") |
| `data-compact` | Booleano; `true` mostra só o logo da Kommo (oculta o texto) |
| `data-class-name` | Classe CSS aplicada ao elemento botão |
| `data-theme` | `light` ou `dark` |
| `data-locale` | `en`, `es`, `pt` ou `id` |
| `data-state` | Parâmetro `state` passado para a janela modal |
| `data-error-callback` | Nome de função global chamada quando o acesso é negado |
| `data-mode` | `popup` ou `post_message` |

**Modos**
- **popup:** o modal fecha e o redirecionamento ocorre na janela principal.
- **post_message:** o redirecionamento ocorre na janela aberta (fechada manualmente pelo usuário); suporta `Window.postMessage()` para reportar o status.

**Variante alternativa (metadados em vez de `client_id`)** — para criação dinâmica da integração (sem pré-registro):

```html
data-name="Integration name"
data-description="Integration description"
data-redirect_uri="https://example.com"
data-secrets_uri="https://example.com/secrets"
data-logo="https://example.com/kommo_logo.png"
data-scopes="crm,notifications"
```

---

## 5) Permissões / escopos

Os escopos são definidos na criação da integração (aba **Chaves e escopos**) e exibidos ao usuário na tela de autorização. Escopos explicitamente citados na doc do botão (atributo `data-scopes`): **`crm`** e **`notifications`**. (A lista completa de escopos/checkboxes não é totalmente enumerada na documentação pública consultada — verificar a aba "Keys and scopes" na sua integração.)

---

## 6) Conteúdo do access token, `account_id` e domínio da conta

- O **access token é um JWT** (JSON Web Token). Conforme a doc, ele é *"uma string no padrão JSON Web Token"* e contém: **ID do usuário**, **ID da integração**, **conjunto de ações** disponíveis e **ID da conta** (`account_id`).
- **`account_id`**: o ID numérico da conta é obtido via `GET /api/v4/account` (campo `id`) e/ou decodificando o JWT do access token. A base URL da conta é sempre `https://{subdominio}.kommo.com`.
- **Domínio / base da conta**: identifique o subdomínio da conta pelo parâmetro **`referer`** recebido no Redirect (`https://{subdominio}.kommo.com`). Use exatamente esse host em todas as chamadas. (A doc consultada trata o domínio como `kommo.com`; não foi confirmado o uso de `amocrm.com` como domínio alternativo para contas legadas amoCRM — verificar caso a caso.)

**Endpoint de identificação da conta**

```
GET https://{subdominio}.kommo.com/api/v4/account
Authorization: Bearer {access_token}
```

Aceita o parâmetro de query `with` (valores separados por vírgula). Valores confirmados na doc: `amojo_id`, `amojo_rights`, `users_groups`, `task_types`, `version`, `entity_names`, `datetime_settings`, `drive_url`.

**Campos da resposta** (raiz, confirmados na doc):

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | int | **ID da conta** (account_id) |
| `name` | string | Nome da conta |
| `subdomain` | string | Subdomínio (compõe a base URL) |
| `language` | string | Idioma da conta |
| `current_user_id` | int | ID do usuário do token atual |
| `country` | string | País |
| `currency` | string | Moeda |
| `currency_symbol` | string | Símbolo da moeda |
| `is_unsorted_on` | bool | Entrada não classificada (unsorted) habilitada |
| `is_loss_reason_enabled` | bool | Motivos de perda habilitados |
| `is_helpbot_enabled` | bool | Helpbot habilitado |
| `is_technical_account` | bool | Conta técnica |
| `contact_name_display_order` | int | Ordem de exibição do nome do contato |
| `amojo_id` | string | ID da conta no serviço amoJo (chats) — retornado com `with=amojo_id` |
| `version` | int | Versão da conta — retornado com `with=version` |
| `entity_names` | object | Nomes das entidades — retornado com `with=entity_names` |
| `_links` | object | Links HAL |
| `_embedded` | object | Objetos relacionados (ver abaixo) |

**Campos sob `_embedded`** (retornados conforme o `with`):

| Campo | Tipo | `with` |
|---|---|---|
| `amojo_rights` | object | `amojo_rights` |
| `users_groups` | array | `users_groups` |
| `task_types` | array | `task_types` |
| `datetime_settings` | object | `datetime_settings` |

> Campos como `created_at`, `updated_at`, `created_by`, `updated_by`, `mobile_feature_version`, `customers_mode`, `uuid` e `is_api_filter_enabled` **não foram confirmados** no schema da resposta de `/api/v4/account` na doc consultada (a versão oficial em Markdown lista os campos acima). (não confirmado na doc)

---

## Tabela de campos importantes (resumo de tokens)

| Campo | Tipo | Onde aparece | Observação |
|---|---|---|---|
| `client_id` | string | request | Integration ID |
| `client_secret` | string | request | Secret key |
| `grant_type` | string enum | request | `authorization_code` \| `refresh_token` |
| `code` | string | request | Código de autorização (validade 20 min) |
| `refresh_token` | string | request/response | Validade 3 meses; muda a cada refresh |
| `redirect_uri` | string | request | Igual ao configurado na integração |
| `token_type` | string | response | Sempre `Bearer` |
| `expires_in` | int | response | Segundos até expirar (24h = 86400 para access token) |
| `access_token` | string (JWT) | response | Contém user_id, integration_id, ações, account_id; validade 24h |

---

## Limites / rate limits

- **Máximo de 7 requisições por segundo** (*"not more than 7 requests per second"*). Excedendo, a API responde **HTTP 429**. Após atividade suspeita, o IP é restringido; violações continuadas resultam em **HTTP 403** em **todas as chamadas subsequentes** daquele IP.
- **Limites por requisição (entidades):**
  - Recuperação (GET): até **250** entidades (leads, contatos, empresas) por requisição.
  - Adição/atualização: no máximo **250** por requisição (recomendado **50** para melhor performance).
  - Adição complexa de leads: no máximo **40** valores de campos personalizados por entidade.
  - Em caso de **HTTP 504**, reduza o tamanho do lote e tente de novo.
- **Limites por conta (referência):** Sources 100 por integração; Pipelines 50 por conta; Estágios de pipeline 100 por pipeline; Webhooks 100 por conta; Listas 10 por conta; Armazenamento de arquivos 10 GB em contas trial.
- **Validades de token:** `authorization_code` 20 min (uso único na troca); `access_token` 24h; `refresh_token` 3 meses (a integração perde acesso se ficar 3 meses sem renovar). Token de longa duração: 1 dia a 5 anos, sem refresh.

---

## Pegadinhas e erros comuns (gotchas)

- **O endpoint de token é `/oauth2/access_token`, NÃO `/api/v4/...`.** Ele fica na raiz do domínio da conta (`https://{subdominio}.kommo.com/oauth2/access_token`).
- **`redirect_uri` deve ser idêntico** ao configurado na integração, inclusive no grant `refresh_token` — divergência gera 400.
- **Use o `referer` do Redirect para montar a base URL.** Não assuma um subdomínio fixo: cada conta tem o seu (`https://{subdominio}.kommo.com`).
- **Salve sempre o novo `refresh_token`** retornado a cada renovação; o anterior fica desatualizado assim que o novo é gerado, e perder o refresh força nova autorização do usuário.
- **`code` de uso único e curto (20 min):** troque imediatamente; um code reaproveitado ou expirado retorna 400.
- **3 meses de inatividade = perda de acesso** no fluxo OAuth (não no long-lived).
- **Token de longa duração só existe para integração privada** e **não pode ser recuperado depois de gerado** — copie na hora. É menos seguro (direitos de admin), proteja-o.
- **429** = rate limit (mais de 7 req/s); **403** pode indicar bloqueio do IP por abuso; **401** indica token inválido/revogado/expirado (re-autorizar ou dar refresh). *(O significado de 401 como "token inválido" é a convenção HTTP/OAuth, não citado literalmente nesta página da doc.)*
- **`account_id` não vem "pronto" na resposta do token:** ele está dentro do JWT do access_token e/ou via `GET /api/v4/account` (campo `id`).
- **No `GET /api/v4/account`, vários campos só aparecem com o `with` certo** (`amojo_id`, `version`, `entity_names`) e alguns ficam sob `_embedded` (`amojo_rights`, `users_groups`, `task_types`, `datetime_settings`), não na raiz.

---

## Exemplo de uso (cenário concreto, curl)

**1. Trocar o `code` por tokens:**

```bash
curl --request POST \
  --url https://meurestaurante.kommo.com/oauth2/access_token \
  --header 'Content-Type: application/json' \
  --data '{
    "client_id": "31885693-c5a8-4c1f-9d2e-0123456789ab",
    "client_secret": "aBcD3FgH...chave...",
    "grant_type": "authorization_code",
    "code": "def50200a1b2c3...",
    "redirect_uri": "https://minhaapp.com/oauth/callback"
  }'
```

**2. Renovar com o refresh_token:**

```bash
curl --request POST \
  --url https://meurestaurante.kommo.com/oauth2/access_token \
  --header 'Content-Type: application/json' \
  --data '{
    "client_id": "31885693-c5a8-4c1f-9d2e-0123456789ab",
    "client_secret": "aBcD3FgH...chave...",
    "grant_type": "refresh_token",
    "refresh_token": "def502003d8f...",
    "redirect_uri": "https://minhaapp.com/oauth/callback"
  }'
```

**3. Chamar a API com o access token:**

```bash
curl --request GET \
  --url https://meurestaurante.kommo.com/api/v4/account \
  --header 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGci...'
```

---

## Fontes

- https://pt-developers.kommo.com/docs/oauth-20
- https://developers.kommo.com/docs/oauth-20
- https://pt-developers.kommo.com/reference/obterrenovar-token-de-acesso
- https://developers.kommo.com/reference/get-token
- https://pt-developers.kommo.com/docs/token-de-longa-dura%C3%A7%C3%A3o
- https://developers.kommo.com/docs/long-lived-token
- https://developers.kommo.com/docs/authorization-public
- https://pt-developers.kommo.com/docs/authorization-for-public-integrations
- https://developers.kommo.com/docs/button-on-site
- https://developers.kommo.com/docs/kommo-for-developers
- https://developers.kommo.com/reference/account-parameters
- https://developers.kommo.com/reference/account-parameters.md
- https://developers.kommo.com/docs/limitations
