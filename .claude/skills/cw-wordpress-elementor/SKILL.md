---
name: cw-wordpress-elementor
description: Editar páginas e formulários do WordPress/Elementor da CardápioWeb (cardapioweb.com, lp.cardapioweb.com, blog) direto no banco, via cPanel + phpMyAdmin. Use sempre que pedirem para adicionar/remover/alterar campo de formulário, mexer em conteúdo de LP, inspecionar como um formulário está configurado, descobrir para onde um formulário envia os dados, ou auditar quais páginas têm/não têm determinado campo. Use também quando disserem apenas "adiciona o campo X na página Y", "muda o formulário da LP Z", "quais páginas têm formulário", ou quando uma investigação de lead/RD/Meetime terminar em "o formulário não coleta esse dado". Cobre o acesso (o MySQL direto é bloqueado por firewall — só dá pelo phpMyAdmin), a edição do `_elementor_data`, a invalidação obrigatória dos caches e a verificação no HTML publicado.
---

# Editar páginas WordPress/Elementor da CardápioWeb

## Por que este processo existe

Formulário do Elementor **não fica em arquivo**. Ele é um blob JSON (`_elementor_data`) dentro
de `wp_postmeta`. Isso elimina FTP e edição de tema — a única via programática é o banco.

E o banco só é alcançável por um caminho: **cPanel → phpMyAdmin**. Já foi testado e descartado:

- **MySQL direto (3306): não funciona.** O `MySQL remoto` do cPanel cria a permissão do usuário
  mas **não abre a porta no firewall** da hospedagem. Conexão dá timeout. Não perca tempo aqui —
  se quiser resolver de verdade, é chamado na hospedagem.
- **FTP: credenciais historicamente desatualizadas** (erro 530). E não resolveria: o dado é DB.
- **REST API do WP: não expõe `_elementor_data`** de forma editável.

## Antes de começar

Credenciais no `.env` da raiz do projeto (`CPANEL_HOST`, `CPANEL_USER`, `CPANEL_PASS`).
Nunca escreva credencial em arquivo versionado nem no chat.

Use o helper `scripts/pma.py` — ele faz login no cPanel, abre sessão no phpMyAdmin e executa SQL:

```python
import sys; sys.path.insert(0, '<caminho>/scripts')
import pma
pma.login()
cols, rows, body = pma.q("SELECT ...")
```

Dois detalhes do helper que custaram tempo para descobrir e você não deve remover:

- **`pftext=F` no POST** — sem isso o phpMyAdmin trunca qualquer valor em ~50 caracteres, e você
  lê um `_elementor_data` de 400 KB cortado sem perceber.
- **O parser lê `<th data-column="...">` e `<td class="data ...">`** — o HTML de resultado do
  phpMyAdmin 5.2 não usa a classe `table_results` que a intuição sugere.

Bancos: `carda1803_wp277` (site principal, prefixo `wpfo_`) e outros três. Confirme o alvo com
`SELECT ID, post_name FROM wpfo_posts WHERE post_name='<slug>' AND post_type='page'`.

## O procedimento — três passos, nenhum opcional

Editar o `_elementor_data` **não basta**. Editando direto no banco nenhum hook do WordPress
dispara, então nada se invalida sozinho e o visitante continua vendo a página velha. São sempre
três camadas:

### Passo 1 — verificações antes de escrever

Nunca faça um `REPLACE` sem checar a âncora. Rode isto e **aborte se algo não bater**:

```sql
SELECT LENGTH(meta_value) tam,
  (LENGTH(meta_value)-LENGTH(REPLACE(meta_value,'<ANCORA>','')))/<LEN_ANCORA> ancoras,
  (LENGTH(meta_value)-LENGTH(REPLACE(meta_value,'<TERMO_NOVO>','')))/<LEN> ja_existe
FROM wpfo_postmeta WHERE post_id=<ID> AND meta_key='_elementor_data';
```

- `ancoras` **tem que ser 1**. Se for 0, a âncora está errada; se for >1, o `REPLACE` do MySQL
  substitui **todas** e você corrompe o resto da página.
- `ja_existe` tem que ser 0, senão você duplica o campo.
- Se for inserir um campo novo, gere um `_id` de 7 hex e confirme que **não colide** no blob.

Âncoras boas são curtas e estruturais, tipo `{"custom_id":"email"`. Os `custom_id` variam entre
páginas (`nome`, `seunome`, `name`) — **verifique por página, nunca reuse às cegas**.

### Passo 2 — backup e escrita

Backup aditivo, na própria tabela (instantâneo, não exige baixar 400 KB):

```sql
INSERT INTO wpfo_postmeta (post_id, meta_key, meta_value)
SELECT post_id, '_elementor_data_bkp_<contexto>_<AAAAMMDD>', meta_value
FROM wpfo_postmeta WHERE post_id=<ID> AND meta_key='_elementor_data';
```

A escrita, inserindo **antes** da âncora:

```sql
UPDATE wpfo_postmeta
SET meta_value = REPLACE(meta_value, '<ANCORA>', '<JSON_NOVO>,<ANCORA>')
WHERE post_id=<ID> AND meta_key='_elementor_data';
```

Confira imediatamente — `JSON_VALID` valida o blob inteiro e é a rede de segurança principal:

```sql
SELECT LENGTH(meta_value) tam, JSON_VALID(meta_value) json_ok,
  (LENGTH(meta_value)-LENGTH(REPLACE(meta_value,'<TERMO>','')))/<LEN> ocorrencias
FROM wpfo_postmeta WHERE post_id=<ID> AND meta_key='_elementor_data';
```

`json_ok` **tem que ser 1**. E confira o delta de tamanho: ele deve bater exatamente com o
tamanho do que você inseriu. Delta diferente = o `REPLACE` pegou mais de um lugar.

### Passo 3 — invalidar os dois caches

**Cache do Elementor** (a página é renderizada a partir dele, não do `_elementor_data`):

```sql
UPDATE wpfo_postmeta SET meta_value=''
WHERE post_id=<ID>
  AND meta_key IN ('_elementor_element_cache','_elementor_css','_elementor_page_assets');
```

Esvaziar em vez de deletar é intencional: o Elementor trata vazio como cache miss, regenera na
primeira visita e regrava sozinho. Além disso `DELETE` costuma ser barrado pelo classificador de
permissões do ambiente, e `UPDATE` passa.

**Cache do WP Rocket** (arquivos em disco — se ficar, o visitante segue vendo a página velha).
Não delete: **mova**. Move não é destrutivo, é reversível e não é bloqueado:

```
POST {base}{token}/json-api/cpanel
  cpanel_jsonapi_module=Fileman
  cpanel_jsonapi_func=fileop
  cpanel_jsonapi_apiversion=2
  op=move
  sourcefiles=/public_html/wp-content/cache/wp-rocket/<dominio>/<slug>
  destfiles=/public_html/wp-content/cache/wp-rocket/<dominio>/__stale_<AAAAMMDD>
```

Atenção: as funções UAPI `Fileman/rename_file` e `Fileman/move_files` **não existem** nesta
instalação. É a API2 `fileop` acima.

### Passo 4 — verificar no HTML publicado

A única prova que vale. Busque a **URL limpa**, sem cache-buster — é o que o visitante vê:

```bash
curl -sSL "https://cardapioweb.com/<slug>/" -H "User-Agent: Mozilla/5.0 Chrome/147" \
  | grep -o 'name="form_fields\[[^]]*\]"'
```

Se o campo aparecer com cache-buster mas não na URL limpa, o WP Rocket não foi invalidado.

## Rollback

```sql
UPDATE wpfo_postmeta d
JOIN wpfo_postmeta b ON b.post_id=d.post_id AND b.meta_key='<META_DE_BACKUP>'
SET d.meta_value = b.meta_value
WHERE d.post_id=<ID> AND d.meta_key='_elementor_data';
```

Depois refaça o Passo 3 — senão o cache continua servindo a versão editada.

## Como os leads saem dos formulários

Entender isto evita "consertar" a coisa errada. Existem **dois caminhos em paralelo**:

1. **Integração nativa da RD Station** — cria conversão com identificador `LP - <nome do form>`.
   **Nunca carrega `company_name`.** O `traffic_source` vem como blob `encoded_...`.
2. **Coletor próprio** (`cw-site-tracking.php`, mu-plugin do site principal) — engancha em
   `elementor_pro/forms/new_record`, **intercepta todos os formulários**, e posta em
   `lp.cardapioweb.com/wp-json/cw/v1/ingest`, que enriquece (tier, porte) e manda pro n8n →
   RD/Meetime/Supabase. Cria conversão `SITE - <NOME>`, essa **com** `company_name`.

Consequências práticas:

- **Não existe registro por formulário.** Adicionar um campo já basta — o coletor captura por
  **label**: `pick(['empresa','company'])` casa com qualquer campo cujo rótulo contenha "empresa".
  Não há configuração extra.
- O coletor só processa forms com **email + telefone**. Sem os dois, ele ignora.
- Há uma **blocklist por rota** (parceiros/RH/operacional) no `cw-site-tracking.php`. Ela usa
  `strpos($path, '/termo')` com barra inicial — então slugs como `/cardapio-web-representantes/`
  **escapam**, porque contêm `-representantes` e não `/representantes`. Se um formulário de
  parceiro estiver vazando para o funil de SQL, é quase certo que seja esse bug, e a correção é
  na blocklist, não na página.

Antes de propor "adicionar campo", verifique se o problema não é a página estar bloqueada,
não ter email/telefone, ou já ter o campo e o dado se perder depois.

## Auditar muitas páginas de uma vez

Para inventariar formulários, **use o endpoint que já existe** em vez de varrer o site: o
mu-plugin `cw-form-discovery.php` expõe `GET /wp-json/cw/v1/forms?s=<CW_RELAY_SECRET>` nos três
WordPress e devolve URL + título + tipo + IDs. O segredo está no próprio arquivo.

Se ainda assim precisar varrer o HTML, **throttle** (~0,3–0,5 s entre requisições). O Wordfence
derruba rajadas e o site já foi a 508 por excesso de carga. Se começar a dar
`connection reset`, pare e espere — não insista.

## Cuidados que valem a pena repetir

- **Uma página primeiro.** Aplique, verifique no HTML, só então replique. O procedimento é o
  mesmo, mas as âncoras não são.
- **Não confie no export do workflow/repo** para saber o estado atual — ele fica defasado.
  Leia sempre a fonte viva (banco, API).
- **`post_modified` não muda** ao editar direto no banco. Se precisar que o WordPress "perceba"
  a edição para outros fins, isso não acontece.
- **Salve o backup por alguns dias** antes de limpar. E lembre de limpar os resíduos depois:
  metas `_elementor_data_bkp_*` e pastas `__stale_*`.
- **Ordem dos campos**: inserir antes do campo de email costuma deixar o novo campo na 2ª
  posição, que é onde as LPs que já funcionam colocam "Empresa". Cosmético, mas mantém a
  consistência entre páginas.
