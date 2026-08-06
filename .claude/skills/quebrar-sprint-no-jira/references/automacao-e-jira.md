# A automação de quebra e o Jira

Leia antes de montar a mensagem da automação, quando o parser recusar algo, ou
quando precisar mexer em prioridade / permissão / verificação.

## A automação

Workflow n8n `[JIRA] IA de quebra de atividades`, id `wHQ3vm36Yt3UQX47`, ativo.
Uma IA lê a mensagem, monta `{time, projeto, sprintCode, mae, filhas}`, um Switch
por time ramifica, e cada branch busca o board, busca a sprint ativa, cria a
História, cria as Tarefas em loop, vincula com "Work item split" e avisa no Slack.

**O gatilho é um webhook aberto** — não precisa do conector do Slack:

```
POST https://n8n.cardapioweb.com/webhook/quebra_de_atividades
Content-Type: application/json; charset=utf-8
{"json da mensagem do slack": {"text": "growth\n[SM33] ...", "silencioso": true}}
```

⚠️ **O 200 não prova nada.** Ele responde `{"message":"Workflow was started"}` antes
de processar. A prova é `conferir_sprint.py`.

## O aviso no Slack e o `silencioso`

O workflow nasceu pra ser chamado **do Slack**: a pessoa escreve a atividade no canal
`ia-quebra-de-atividades` e recebe "Sua atividade foi quebrada com sucesso!" de volta.
A skill não passa por lá — quem a chamou está acompanhando a conversa e já recebe o
relatório do `conferir_sprint.py`, que diz muito mais. Postar no canal a cada
atividade só encheria de ruído um lugar que o time usa pra outra coisa.

Por isso cada branch tem um nó **`Avisar no Slack?`** entre o `Limit` e o `Send a
message`, com a condição:

```
{{ ((($('Webhook').first().json.body || {})['json da mensagem do slack']) || {})
   .silencioso === true ? 'silencioso' : 'avisar' }}   ==   'avisar'
```

Mensagem vinda do Slack não tem esse campo → cai em `avisar` → o time continua
recebendo o aviso de sempre. `criar_no_jira.py` manda `silencioso: true` e não avisa
ninguém. Para testar o caminho do time, `criar_no_jira.py --avisar` (aí sai mensagem
no canal de verdade).

⚠️ **O aviso de ERRO não passa pelo gate.** Se o parser recusar a mensagem, o
`Send a message2` posta o motivo no canal mesmo em chamada silenciosa. É de
propósito: mensagem torta é bug seu, e o motivo do erro só existe ali. Se aparecer um
❌ no canal depois de uma rodada da skill, é sua — vá ler.

Esses nós ficam no **fim** do fluxo: se o Slack falhar, o Jira já foi criado.

Acentos passam limpos desde que o corpo vá em UTF-8. `criar_no_jira.py` cuida disso.

## O formato da mensagem

**Formato 2** — atividade quebrada:

```
growth
[SM33][AUT] Ferramenta de teste A/B para landing page(Alexandre)
[SM33][AUT] Levantar referência nas ferramentas prontas(Alexandre)(2)
[SM33][AUT] Servir variante diferente da LP pela URL(Alexandre)(5)
```

**Formato 1** — atividade que não foi quebrada (5h ou menos). Só a linha da
atividade; a automação cria a História mãe e uma Tarefa filha com as horas:

```
growth
[SM33][CRM] Segmentar a base reopen do Pipedrive e do Kommo(Alexandre)(5)
```

Regras que o parser exige:

- linha 1 = o time: `growth`, `content`, `cw studios` ou `branding`
- **toda** linha de atividade precisa do código de sprint em colchetes: `[SM33]`
- **toda** linha precisa do responsável entre parênteses
- a **História mãe não leva horas** — se levar, a automação ignora, mas fica confuso
- as horas são sempre o **último** parêntese, e só número

⛔ **Nada de parênteses no meio do nome.** "LP que conversa com o anúncio (message
match)" tem três grupos de parênteses e o parser confunde qual é o responsável.
Troque por travessão ou corte. `criar_no_jira.py` barra isso antes de enviar.

## Tags e tipo de issue

A tag define o tipo e vence qualquer palavra-chave:

| Tag | Tipo |
|---|---|
| `[DES]` | Design |
| `[COPY]` | Texto |
| `[VID]` | Vídeo |
| `[LP]` ou `[AUT]` | Tarefa |

Qualquer outra tag (`[CRM]`, `[CW]`, `[GEO]`, `[SLIDE]`…) é livre, fica no summary e
não mexe no tipo.

**Sem tag de tipo, o parser chuta pelo nome** e erra fácil. As palavras que ele
procura: design/layout/banner/criativo → Design; copy/texto/e-mail → Texto;
vídeo → Vídeo; lp/landing/automação/wordpress/implementar/fluxo/disparo/campanha →
Tarefa; nada disso → Tarefa.

O caso real que quebrou: a tarefa "Subir o quiz com a **copy** do Tonhão e testar
ponta a ponta" é trabalho de implementação, mas a palavra "copy" a transformaria em
tipo Texto. Carimbar `[LP]` resolveu. **Sempre que o nome tiver por acaso uma dessas
palavras, ponha a tag do tipo certo.**

Studios e Branding são team-managed e não têm Design/Texto/Vídeo — lá toda filha
é Tarefa e a mãe é História.

## Jira: acesso, prioridade e permissão

Site: `https://cardapio-web.atlassian.net` (**com hífen** — sem hífen o MCP responde
"isn't explicitly granted"). Projetos: Growth→`GWT`, Content→`CONT`, Studios→`SCC`,
Branding→`BRAND`.

Campos: story points `customfield_10016`, sprint `customfield_10020`, vínculo
"Work item split" tipo `10006`.

⚠️ **Busca é só na v3:** `GET /rest/api/2/search` foi removido pela Atlassian
(HTTP 410, CHANGE-2046) — use `/rest/api/3/search/jql`, como os scripts já fazem.
O resto da v2 continua valendo (`PUT /rest/api/2/issue/` aceita descrição em
texto puro; na v3 seria ADF na mão).

**Credencial:** `JIRA_EMAIL` + `JIRA_API_TOKEN` do `.env` do projeto Clara IA.
Carregue com `set -a && . ./.env && set +a`. Usar a credencial é ok; **exibir o
conteúdo do `.env` nunca**.

⛔ **Não crie issue pelo MCP do Jira.** Ele costuma estar autenticado em outra conta
(hoje, a do Gerardo) e a issue nasce com o criador errado. Use a automação, que tem
credencial própria, ou a REST com o `.env`, que é a conta da pessoa.

⛔ **O MCP do Jira também estoura o contexto em consulta de lote** — ele ignora o
recorte de `fields` e devolve ~4 mil caracteres por issue, então 15 issues já
passam do limite. A REST respeita `fields`. É por isso que os scripts usam REST.

**Descrição:** a automação **não tem esse campo**. Rodar a automação e parar aí
sempre deixa as issues vazias. `completar_issues.py` preenche depois, pela API v2 —
a v2 aceita texto puro e converte pra ADF sozinha; na v3 seria preciso montar ADF
na mão.

**Prioridade:** o mapa é `ALTA→High`, `MÉDIA→Medium`, `BAIXA→Low` (e Highest/Lowest
pros extremos). Só o Content tem essa coluna hoje. Se o projeto não aceitar o campo,
`completar_issues.py` salva a descrição assim mesmo e avisa — descrição não se perde
por causa de prioridade.

**DELETE:** funciona em `GWT`, `CONT` e `SCC`. **Não funciona em `BRAND`** (403). Em
BRAND, marque a issue de teste como concluída, renomeie pra `[LIXO-APAGAR]` e peça
pra alguém com permissão apagar.
