# Kommo API — Arquivos (Files) API

## Visão geral do recurso

A **Files API** da Kommo (ex-amoCRM) permite **enviar (upload), gerenciar e anexar arquivos**
que aparecem na seção **Mídia (Media)** da conta. Esses arquivos podem vir de mensageiros,
formulários, bots ou notas, e servem para diversos propósitos. Segundo a doc, arquivos podem ser:

- **Anexados a entidades** (leads/contatos/empresas) — aparecem na aba **Mídia** do card;
- usados em **notas com arquivo** (Notes with files);
- usados como **valor de campo personalizado do tipo `file`** (File type field values — com suporte a versionamento);
- usados em **templates de mensagens de mensageiros** (Messenger message templates);
- usados pelo **Salesbot** ao enviar mensagens e ao definir o valor de um campo adicional do tipo file.

Pontos-chave da arquitetura:

- A maioria dos métodos de arquivo **NÃO usa o subdomínio normal da conta**. Eles usam um
  **host dedicado de serviço de arquivos (drive)**, ex.: `https://drive-c.kommo.com`. Você
  precisa descobrir esse host antes de tudo (ver Passo 0).
- Métodos de **anexar/desanexar/listar por entidade** e **buscar entidades de um arquivo**
  usam o subdomínio normal: `https://{subdominio}.kommo.com/api/v4/...`.
- O upload é **em partes (chunks)**: você abre uma **sessão de upload**, recebe um `upload_url`
  com um `session_token`, e envia o arquivo em pedaços de até `max_part_size` bytes. Cada parte
  intermediária retorna a URL da próxima (`next_url`); a **última parte** retorna o objeto do
  arquivo (com `uuid`/`version_uuid`).
- A sessão fica ativa **até o arquivo terminar de subir, mas no máximo 24 horas** após a criação.
- Identificadores: cada arquivo tem `uuid` (o arquivo) e `version_uuid` (a versão ativa). Você
  pode subir novas versões do mesmo arquivo reutilizando o `file_uuid` na criação da sessão.

### Escopos OAuth obrigatórios

- **"Access to files"** (Acesso a arquivos) — necessário para praticamente todos os métodos.
- **"Deleting files"** (Excluir arquivos) — necessário **adicionalmente** para excluir arquivos.

Autenticação: passe o **Access Token** no header `Authorization: Bearer {token}`.

### Limites importantes (da doc)

| Limite | Valor |
|---|---|
| Tamanho máximo de arquivo (`max_file_size`) | `314572800` bytes = **300 MB** (retornado na criação da sessão) |
| Tamanho máximo de cada parte (`max_part_size`) | Definido pela sessão (a doc mostra `524288` = 512 KB no exemplo de resposta e `131072` = 128 KB nas constraints). **Use sempre o valor que a sessão devolve** — não fixe no código |
| Duração da sessão | Ativa até concluir o upload, **no máximo 24 h** após a criação |
| Recuperação de excluídos | Arquivo excluído vai para a lixeira e é removido permanentemente após **30 dias** (pode ser restaurado nesse período) |
| Armazenamento (conta trial) | Limitado a **10 GB** em conta de teste |

---

## Passo 0 — Descobrir o host do drive

Antes de usar a Files API você precisa do `drive_url`. Obtenha-o no método de conta com o
parâmetro `with=drive_url`.

**`GET https://{subdominio}.kommo.com/api/v4/account?with=drive_url`**

A resposta inclui o campo `drive_url`, por exemplo `"drive_url": "https://drive-c.kommo.com"`.
A partir dele, a base dos métodos de drive fica, ex.: `https://drive-c.kommo.com/v1.0/files`.

> Nesta seção, `{your-drive}` representa o host retornado em `drive_url` (ex.: `drive-c`).

---

## Endpoints

Resumo (host varia entre **drive** e **subdomínio normal**):

| Método | Endpoint | Host | Descrição |
|---|---|---|---|
| `POST` | `/v1.0/sessions` | drive | Criar sessão de upload |
| `POST` | `/upload/{session_token}` | drive | Enviar uma parte do arquivo |
| `GET` | `/v1.0/files` | drive | Listar arquivos |
| `GET` | `/v1.0/files/{file_uuid}` | drive | Obter arquivo por UUID |
| `GET` | `/v1.0/files/{file_uuid}/versions` | drive | Obter versões de um arquivo |
| `PATCH` | `/v1.0/files/{file_uuid}` | drive | Editar arquivo (renomear / trocar versão ativa) |
| `DELETE` | `/v1.0/files` | drive | Excluir arquivos (escopo "Deleting files") |
| `POST` | `/v1.0/files/restore` | drive | Restaurar arquivos da lixeira |
| `PUT` | `/api/v4/{entity}/{entity_id}/files` | subdomínio | Anexar arquivos a uma entidade |
| `GET` | `/api/v4/{entity}/{entity_id}/files` | subdomínio | Listar arquivos anexados a uma entidade |
| `DELETE` | `/api/v4/{entity}/{entity_id}/files` | subdomínio | Desanexar arquivos de uma entidade |
| `GET` | `/api/v4/files/{file_uuid}/links` | subdomínio | Listar entidades associadas a um arquivo |

> `{entity}` aceita `leads`, `contacts` ou `companies`. `{entity_id}` é int.

> Observação sobre o path de upload: o endpoint definido no OpenAPI é `/upload/{session_token}`.
> Os exemplos de `upload_url`/`next_url` na doc, porém, aparecem com o prefixo
> `/v1.0/sessions/upload/...`. **Na prática, sempre poste na URL que a sessão/parte anterior
> devolveu** (`upload_url` e depois `next_url`), em vez de remontar o path manualmente.

---

## 1. Criar sessão de upload

**`POST https://{your-drive}.kommo.com/v1.0/sessions`**

Headers: `Authorization: Bearer {token}`, `Content-Type: application/json`.

### Corpo da requisição

| Campo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| `file_name` | string | Sim | Nome do arquivo enviado |
| `file_size` | int | Sim | Tamanho do arquivo **em bytes** |
| `content_type` | string | Não | MIME type do arquivo (ex.: `image/jpeg`) |
| `file_uuid` | string | Não | UUID do arquivo para o qual se sobe uma **nova versão**. Omita para criar arquivo novo |
| `with_preview` | boolean | Não | Se setado, gera um preview para o arquivo |

**Exemplo de requisição:**
```json
{
  "file_name": "aaa",
  "file_size": 3435,
  "content_type": "image/jpeg",
  "file_uuid": "367b9f38-5f01-4cea-947e-dfab47aea522"
}
```

**Exemplo de resposta (200):**
```json
{
  "max_file_size": 314572800,
  "max_part_size": 524288,
  "session_id": 26136001,
  "upload_url": "https://drive-c.kommo.com/v1.0/sessions/upload/eyJhbGc..."
}
```

| Campo da resposta | Tipo | Descrição |
|---|---|---|
| `session_id` | int | ID da sessão |
| `upload_url` | string | URL para enviar a primeira parte do arquivo |
| `max_file_size` | int | Tamanho máximo de arquivo permitido (bytes) |
| `max_part_size` | int | Tamanho máximo de cada parte (bytes) |

Erros: `400` dados incorretos, `401` não autenticado, `403` sem permissão.

---

## 2. Enviar uma parte do arquivo

**`POST https://{your-drive}.kommo.com/upload/{session_token}`**

O `session_token` é a parte da `upload_url` que vem **depois** de `/upload/`. Na prática você
não precisa extraí-lo: poste diretamente na `upload_url` devolvida pela criação da sessão e,
nas partes seguintes, na `next_url` devolvida pela parte anterior.

Headers: `Authorization: Bearer {token}`. `Content-Type` pode ser `application/json` ou
`multipart/form-data` — na prática envia-se o **binário bruto da parte** (`RAW_BODY = <dados
binários>`). Cada parte deve ter no máximo `max_part_size` bytes; leia o arquivo em segmentos
desse tamanho e poste sequencialmente, usando em cada passo a URL devolvida pela parte anterior.
Requer escopo "Access to files".

**Resposta de parte intermediária (200)** — ainda faltam partes:
```json
{
  "next_url": "https://drive-c.kommo.com/v1.0/sessions/upload/...",
  "session_id": 26434413
}
```

**Resposta da ÚLTIMA parte (200)** — upload concluído, retorna o objeto do arquivo (com `_links`):
```json
{
  "_links": {
    "download": {
      "href": "https://drive-c.kommo.com/download/aff5603a-28b1-4c17-8e98-16e473b323b3/367b9f38-5f01-4cea-947e-dfab47aea522/picture.png"
    },
    "download_version": {
      "href": "https://drive-c.kommo.com/download/aff5603a-28b1-4c17-8e98-16e473b323b3/367b9f38-5f01-4cea-947e-dfab47aea522/43de3be7-307b-4766-a23e-5e88211b9a8d/picture.png"
    },
    "self": {
      "href": "https://drive-c.kommo.com/v1.0/files/367b9f38-5f01-4cea-947e-dfab47aea522"
    }
  },
  "uuid": "367b9f38-5f01-4cea-947e-dfab47aea522",
  "version_uuid": "43de3be7-307b-4766-a23e-5e88211b9a8d",
  "name": "product",
  "sanitized_name": "product",
  "size": 7526,
  "type": "file",
  "metadata": { "extension": "png", "mime_type": "image/png" },
  "session_id": 26136001,
  "source_id": null,
  "is_trashed": false,
  "has_multiple_versions": false,
  "previews": null,
  "created_at": 1671687247,
  "created_by": { "type": "internal", "id": 7758337 },
  "updated_at": 1671687247,
  "updated_by": { "type": "internal", "id": 7758337 },
  "deleted_at": null,
  "deleted_by": null
}
```

Erros: `400`, `401`, `403`. Requer escopo "Access to files".

> Fluxo prático (recipe oficial "Upload a file by chunks"): (1) buscar `drive_url` no método
> de conta; (2) `POST {driveUri}/v1.0/sessions` com `file_name`/`file_size`/`content_type`;
> (3) ler o arquivo em blocos de `max_part_size` bytes
> (`Buffer.alloc(Math.min(maxPartSize, fileSize - bytesRead))`) e postar cada bloco na
> `uploadUri` corrente com `Authorization: Bearer {token}`; (4) cada resposta traz `next_url`,
> que vira a `uploadUri` da próxima iteração; (5) ao final recebe o objeto do arquivo com
> `uuid`, `version_uuid`, `metadata` e `_links` de download.

---

## 3. Obter arquivo por UUID

**`GET https://{your-drive}.kommo.com/v1.0/files/{file_uuid}`**

**Exemplo de resposta (200):**
```json
{
  "_links": {
    "download": {
      "href": "https://drive-c.kommo.com/download/aff5603a-28b1-4c17-8e98-16e473b323b3/367b9f38-5f01-4cea-947e-dfab47aea522/picture.png"
    },
    "download_version": {
      "href": "https://drive-c.kommo.com/download/aff5603a-28b1-4c17-8e98-16e473b323b3/367b9f38-5f01-4cea-947e-dfab47aea522/43de3be7-307b-4766-a23e-5e88211b9a8d/picture.png"
    },
    "self": {
      "href": "https://drive-c.kommo.com/v1.0/files/367b9f38-5f01-4cea-947e-dfab47aea522"
    }
  },
  "created_at": 1671687247,
  "created_by": { "type": "internal", "id": 7758337 },
  "deleted_at": null,
  "deleted_by": null,
  "has_multiple_versions": false,
  "is_trashed": false,
  "metadata": { "extension": "png", "mime_type": "image/png" },
  "name": "product",
  "previews": null,
  "sanitized_name": "product",
  "session_id": 26136001,
  "size": 7526,
  "source_id": null,
  "type": "file",
  "updated_at": 1671687247,
  "updated_by": { "type": "internal", "id": 7758337 },
  "uuid": "367b9f38-5f01-4cea-947e-dfab47aea522",
  "version_uuid": "43de3be7-307b-4766-a23e-5e88211b9a8d"
}
```

Erros: `204` arquivo não encontrado (sem conteúdo), `401`, `403`.

### Tabela de campos do objeto arquivo

| Campo | Tipo | Descrição |
|---|---|---|
| `uuid` | string | Identificador do arquivo |
| `version_uuid` | string | Identificador da versão ativa |
| `name` | string | Nome do arquivo |
| `sanitized_name` | string | Nome higienizado |
| `size` | int | Tamanho em bytes |
| `type` | string | Tipo do objeto (ex.: `file`) |
| `metadata.extension` | string | Extensão (ex.: `png`) |
| `metadata.mime_type` | string | MIME type |
| `previews` | object/null | Previews (se gerados) |
| `is_trashed` | bool | Está na lixeira |
| `has_multiple_versions` | bool | Possui múltiplas versões |
| `source_id` | int/null | Identificador da fonte de onde o arquivo veio |
| `session_id` | int | Sessão que originou o arquivo |
| `created_at` / `updated_at` / `deleted_at` | int (unix) / null | Timestamps |
| `created_by` / `updated_by` / `deleted_by` | object / null | `{type, id}` de quem agiu |
| `_links.download` | object | Link de download da versão ativa |
| `_links.download_version` | object | Link de download de versão específica |
| `_links.self` | object | Link para o próprio recurso |

---

## 4. Listar arquivos

**`GET https://{your-drive}.kommo.com/v1.0/files`**

### Parâmetros de query (filtros / paginação)

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `filter[uuid]` | array(string) | Array de UUIDs separados por vírgula |
| `filter[name]` | string | Nome do arquivo |
| `filter[extensions][]` | string | Filtra por extensão |
| `filter[term]` | string | Substring no nome do arquivo ou no nome de uma entidade relacionada |
| `filter[source_id]` | int | ID da fonte de onde o arquivo foi obtido |
| `filter[deleted]` | string(JSON) | Se passado, exibe também arquivos excluídos |
| `filter[size][unit]` | int | Bytes por unidade (padrão: 1) |
| `filter[size][from]` | int | Tamanho mínimo |
| `filter[size][to]` | int | Tamanho máximo |
| `filter[date][type]` | string | `created_at` ou `updated_at` |
| `filter[date][date_preset]` | string | Presets: day, week, month, quarter, year, etc. |
| `filter[date][from]` | int | Timestamp unix após o qual o evento ocorreu |
| `filter[date][to]` | int | Timestamp unix antes do qual o evento ocorreu |
| `filter[created_by][]` | int | Criador: `-1` (cliente), `0` (robô), `{id}` (usuário) |
| `filter[updated_by][]` | int | Último a atualizar: `-1` (cliente), `0` (robô), `{id}` (usuário) |

**Estrutura da resposta (200):** inclui `_count` (total), `_embedded.files[]` (array de objetos
arquivo, mesmos campos da seção 3, cada um com `_links` de download/download_version/self) e
`_links.self` (paginação/self).

Erros: `204` "Files weren't found" (sem arquivos), `400`, `401`, `403`.

---

## 5. Obter versões de um arquivo

**`GET https://{your-drive}.kommo.com/v1.0/files/{file_uuid}/versions`**

Retorna o histórico de versões do arquivo.

**Estrutura da resposta (200):** `_count` (int), `_embedded.versions[]` e `_links`. Cada versão
contém: `uuid`, `file_uuid`, `type`, `name`, `sanitized_name`, `size`, `is_main` (bool indicando
se é a versão ativa), `source_id`, `created_at`/`created_by`, `updated_at`/`updated_by`,
`metadata` (`extension`, `mime_type`) e `previews` (array com links de download e dimensões).

Erros: `400`, `401`, `403`, `404` "File wasn't found". Requer escopo "Access to files".

---

## 6. Editar arquivo (renomear / definir versão ativa)

**`PATCH https://{your-drive}.kommo.com/v1.0/files/{file_uuid}`**

Aceita **um dos dois** parâmetros (mutuamente exclusivos):

| Campo | Tipo | Descrição |
|---|---|---|
| `name` | string | Novo nome do arquivo. **NÃO** passe `version_uuid` junto |
| `version_uuid` | string | UUID da versão a tornar ativa. **NÃO** passe `name` junto |

**Exemplo (renomear):**
```json
{ "name": "New name" }
```
**Exemplo (trocar versão ativa):**
```json
{ "version_uuid": "367b9f38-5f01-4cea-947e-dfab47aea522" }
```
**Resposta (200):** objeto completo do arquivo (mesma estrutura da seção 3, com `_links`).
```json
{
  "_links": {
    "download": { "href": "https://drive-c.kommo.com/download/aff5603a-28b1-4c17-8e98-16e473b323b3/367b9f38-5f01-4cea-947e-dfab47aea522/picture.png" },
    "download_version": { "href": "https://drive-c.kommo.com/download/aff5603a-28b1-4c17-8e98-16e473b323b3/367b9f38-5f01-4cea-947e-dfab47aea522/43de3be7-307b-4766-a23e-5e88211b9a8d/picture.png" },
    "self": { "href": "https://drive-c.kommo.com/v1.0/files/367b9f38-5f01-4cea-947e-dfab47aea522" }
  },
  "uuid": "367b9f38-5f01-4cea-947e-dfab47aea522",
  "name": "product",
  "version_uuid": "43de3be7-307b-4766-a23e-5e88211b9a8d"
}
```
Erros: `400`, `401`, `403`.

---

## 7. Excluir arquivos

**`DELETE https://{your-drive}.kommo.com/v1.0/files`** — requer escopo **"Deleting files"**.

Content-Type: `application/json` ou `multipart/form-data`.

**Corpo (array de objetos com `uuid`):**
```json
[
  { "uuid": "367b9f38-5f01-4cea-947e-dfab47aea522" },
  { "uuid": "bf1097fb-58fe-42c1-b385-ac443228ddd0" }
]
```
**Resposta (200):** objeto vazio `{}` (a doc indica que o método não retorna corpo de resposta).
Erros: `400`, `401`, `403`.

> Arquivos excluídos vão para a lixeira e são removidos permanentemente após 30 dias. Dentro
> desse prazo podem ser restaurados (ver seção 8).

---

## 8. Restaurar arquivos

**`POST https://{your-drive}.kommo.com/v1.0/files/restore`**

**Corpo (array de objetos com `uuid`):**
```json
[
  { "uuid": "367b9f38-5f01-4cea-947e-dfab47aea522" }
]
```
**Resposta (200):** `_count` (int) e `_embedded.files[]` com os objetos de arquivo restaurados
(uuid, name, size, created_at, created_by, metadata, links de download e info de versão).

Erros: `400`, `401`, `403`. Requer escopo "Access to files".

---

## 9. Anexar arquivos a uma entidade

**`PUT https://{subdominio}.kommo.com/api/v4/{entity}/{entity_id}/files`**

`{entity}` = `leads` | `contacts` | `companies`; `{entity_id}` = int.

**Corpo (array de objetos):**
```json
[
  { "file_uuid": "367b9f38-5f01-4cea-947e-dfab47aea522" }
]
```
**Resposta (200):** `application/hal+json`, corpo `{}` (vazio — o método não retorna corpo).
Erros: `400`, `401`, `403`, `404` (entidade não encontrada).

---

## 10. Listar arquivos anexados a uma entidade

**`GET https://{subdominio}.kommo.com/api/v4/{entity}/{entity_id}/files`**

Query: `limit` (qtde de arquivos por requisição), `before_id` (lista arquivos com id menor que o valor).

**Resposta (200):**
```json
{
  "_links": {
    "self": {
      "href": "https://subdomain.kommo.com/api/v4/leads/1852926/files?limit=50"
    }
  },
  "_embedded": {
    "files": [
      {
        "file_uuid": "e2f4f971-ddjwdjee4f-45c9-9b2b-5c3f3854002e",
        "id": 7590970
      }
    ]
  }
}
```
`204` sem arquivos associados (corpo `{}`). Erros: `400`, `401`, `403`, `404` (corpo `{}`).

---

## 11. Desanexar arquivos de uma entidade

**`DELETE https://{subdominio}.kommo.com/api/v4/{entity}/{entity_id}/files`**

**Corpo:**
```json
[
  { "file_uuid": "367b9f38-5f01-4cea-947e-dfab47aea522" }
]
```
**Resposta: `202`**, `application/hal+json`, corpo `{}`. Erros: `400`, `401`, `403`, `404`.

> Atenção: anexar retorna `200`, mas **desanexar retorna `202`**.

---

## 12. Obter entidades associadas a um arquivo

**`GET https://{subdominio}.kommo.com/api/v4/files/{file_uuid}/links`**

**Resposta (200):** `application/hal+json`.
```json
{
  "file_uuid": "5ef222cd-bce4-4df8-8466-3dee7d16e70d",
  "entities": [
    {
      "id": 22859207,
      "name": "Lead #22859207",
      "created_by": 0,
      "main_user_id": 7758337,
      "date_create": 1669372247,
      "price": 20,
      "pipeline_id": 3858604,
      "date_update": 1672060100,
      "updated_by": 7758337,
      "entity_type": "leads",
      "status_id": 37066879,
      "closest_task_at": null
    }
  ]
}
```
Erros: `400`, `401`, `403`.

---

## Usar arquivo em uma NOTA (pegadinha)

Para que um arquivo apareça como **anexo em uma nota**, a doc indica que você **deve adicionar
DUAS notas com a mesma data de criação** (`created_at`). Arquivos em **campos personalizados**
usam campos com `"type": "file"` (com suporte a versionamento). Arquivos anexados a entidades
aparecem na aba **Mídia** do card. A doc também alerta que pode haver atraso ao adicionar
arquivos a locais compartilhados.

---

## Pegadinhas e erros comuns (gotchas)

1. **Host errado.** Upload/listar/obter/versões/editar/excluir/restaurar arquivo usam o **host
   do drive** (`drive-c.kommo.com`), não o subdomínio da conta. Já anexar/desanexar/listar-por-entidade
   e `files/{uuid}/links` usam `https://{subdominio}.kommo.com/api/v4/...`. Misturar os hosts gera erro.
2. **Não fixe o tamanho da parte.** Use o `max_part_size` devolvido pela sessão (a doc mostra
   512 KB no exemplo e 128 KB nas constraints). Partes maiores que o limite falham.
3. **Sessão expira em 24 h** e fica válida só até o upload terminar — não reuse `upload_url` antigo.
4. **Poste sempre na URL devolvida.** Use a `upload_url` da sessão e depois a `next_url` de cada
   parte; não remonte o path à mão (o OpenAPI define `/upload/{session_token}`, mas os exemplos
   trazem `/v1.0/sessions/upload/...`).
5. **A última parte muda o retorno.** Partes intermediárias devolvem `next_url`; só a última
   devolve o objeto do arquivo com `uuid`/`version_uuid`. Sempre poste até consumir todo o arquivo.
6. **Nova versão.** Para subir nova versão, passe `file_uuid` na criação da sessão; a versão
   enviada vira automaticamente a ativa.
7. **Editar é exclusivo.** No `PATCH`, mande `name` **OU** `version_uuid`, nunca os dois.
8. **Excluir exige escopo extra** ("Deleting files"), além de "Access to files".
9. **Códigos de status divergem.** `200` (anexar) vs `202` (desanexar); `204` quando não há
   arquivos/entidade vazia (não é erro, é "sem conteúdo").
10. **`file_size` em bytes** e correto — a sessão valida contra `max_file_size` (300 MB).
11. **Restaurar usa `uuid`** no corpo (não `file_uuid`); já anexar/desanexar usam `file_uuid`.
12. **Documentação client-side.** As páginas `/reference/...` são renderizadas em JS; a versão
    limpa e completa de cada uma está em `/reference/{slug}.md` (texto/markdown). Útil ao automatizar/extrair.

---

## Exemplo de uso (cenário concreto — upload por chunks + anexar a lead)

```bash
# 0) descobrir o drive_url
curl -s "https://meusub.kommo.com/api/v4/account?with=drive_url" \
  -H "Authorization: Bearer $TOKEN"
# -> { ..., "drive_url": "https://drive-c.kommo.com", ... }

# 1) criar sessao de upload (host do drive)
curl -s -X POST "https://drive-c.kommo.com/v1.0/sessions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"file_name":"product.png","file_size":7526,"content_type":"image/png"}'
# -> { "session_id":..., "upload_url":"https://drive-c.kommo.com/v1.0/sessions/upload/eyJ...","max_part_size":524288, "max_file_size":314572800 }

# 2) enviar as partes (cada bloco <= max_part_size; poste na upload_url e depois nas next_url)
curl -s -X POST "https://drive-c.kommo.com/v1.0/sessions/upload/eyJ..." \
  -H "Authorization: Bearer $TOKEN" \
  --data-binary @parte_0.bin
# parte intermediaria -> { "next_url":"...","session_id":... }   (poste a proxima parte nesse next_url)
# ultima parte        -> { "uuid":"367b9f38-...","version_uuid":"43de3be7-...","name":"product", ... }

# 3) anexar o arquivo a um lead (host = subdominio normal)
curl -s -X PUT "https://meusub.kommo.com/api/v4/leads/1852926/files" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '[{"file_uuid":"367b9f38-5f01-4cea-947e-dfab47aea522"}]'
# -> 200 {}
```

---

## Fontes

- https://developers.kommo.com/reference/files-api e https://developers.kommo.com/reference/files-api.md (Files API — overview, escopos, usos, limite 10 GB trial)
- https://developers.kommo.com/reference/files-api-key-features.md (Files API Key Features — sessão 24h, lixeira 30 dias, notas com 2 notes, campos type file)
- https://developers.kommo.com/reference/files-methods.md (Files API methods — autenticação Bearer, escopos)
- https://developers.kommo.com/reference/your-drive.md (Getting started / Your drive — descobrir drive_url)
- https://developers.kommo.com/reference/create-session.md (Create a file upload session)
- https://developers.kommo.com/reference/upload-file.md (Upload a part of the file)
- https://developers.kommo.com/recipes/upload-a-part-of-the-file.md (Upload a file by chunks)
- https://developers.kommo.com/reference/get-files.md (Get a list of files)
- https://developers.kommo.com/reference/file-uuid.md (Get a file by UUID)
- https://developers.kommo.com/reference/get-version.md (Get file versions — GET /v1.0/files/{file_uuid}/versions)
- https://developers.kommo.com/reference/edit-file.md (Edit a file)
- https://developers.kommo.com/reference/delete-files.md (Delete files)
- https://developers.kommo.com/reference/restore-files.md (Restore files — POST /v1.0/files/restore)
- https://developers.kommo.com/reference/attached-to-entity.md (Attach files to an entity)
- https://developers.kommo.com/reference/get-files-entity.md (Get files attached to an entity)
- https://developers.kommo.com/reference/detach-files.md (Detach files from an entity)
- https://developers.kommo.com/reference/get-entities-with-file.md (Get entities associated with a file)
- Índice oficial: https://developers.kommo.com/llms.txt
