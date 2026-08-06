---
name: quebrar-sprint-no-jira
description: Lê a planilha de planejamento de sprint do Marketing, mapeia as atividades da pessoa, quebra as que passam de 5 SP em tarefas menores e cria tudo no Jira — História mãe, Tarefas filhas, horas, sprint, responsável, descrição e D.O.D — pela automação n8n de quebra de atividades. Use sempre que alguém falar em subir, criar ou cadastrar as atividades da sprint no Jira, quebrar atividade grande, transformar a planilha de sprint em card, ou disser coisas como "joga a sprint no Jira", "cria as tarefas da SM33", "quebra minhas atividades". Use também quando a pessoa quiser saber quais são as atividades dela na sprint, quantas horas ela tem planejadas contra o capacity, ou conferir se o que está no Jira bate com a planilha.
---

# Quebrar a sprint e subir no Jira

Pega o planejamento da sprint na planilha do Marketing e devolve o board do Jira
montado: uma História de Usuário por atividade, as Tarefas filhas vinculadas, horas,
responsável, sprint, descrição e Definition of Done preenchidos.

Quem usa: qualquer pessoa do Mega Brain, no começo da sprint. O trabalho braçal
(ler a planilha, montar mensagem, disparar, conferir, preencher descrição) é todo
automatizado. **O julgamento de como quebrar uma atividade grande é humano** — a
skill propõe e espera aprovação antes de tocar no Jira.

## Por que existe

Transcrever a sprint pro Jira na mão custa uma manhã e sai torta: card sem descrição,
D.O.D que fica só na planilha, atividade de 13h virando um card único que ninguém
sabe por onde começar, soma de horas que não fecha com o planejado.

O gargalo real não é digitar — é **quebrar bem**. Uma atividade de 13h precisa virar
3 ou 4 pedaços que façam sentido de entrega, e isso exige ler a descrição e o D.O.D
e entender o trabalho. A skill tira todo o resto do caminho pra sobrar tempo pra isso.

## Antes de começar

Carregue a credencial do Jira uma vez na sessão (é o `.env` do projeto Clara IA):

```bash
cd "<repo Clara IA>" && set -a && . ./.env && set +a
```

Trabalhe num diretório temporário — os arquivos de mensagem e os JSONs
intermediários não pertencem ao repositório.

Os scripts ficam em `scripts/` nesta skill. Todos aceitam `--help` e usam só a
biblioteca padrão do Python — não há nada pra instalar.

No Windows, rode com `PYTHONIOENCODING=utf-8` na frente. Sem isso o console troca os
acentos por `?` na saída e dá a impressão de dado corrompido quando o dado está certo.

## Fluxo

### 1. Descubra quem é a pessoa, sem perguntar o que já dá pra saber

Nome e time só se perguntam **uma vez na vida**. Só a sprint muda a cada uso.

Procure nesta ordem e pare no primeiro que responder:

1. O contexto da conversa ou o `CLAUDE.md` pessoal já dizem quem é (ex.: "meu arquivo
   no Mega Brain é `objetivos/alexandre.md`").
2. O arquivo `objetivos/<nome>.md` do Mega Brain tem as linhas `**Time:**` e
   `**Nome no Jira:**`.

Se achou, siga em frente calado. Perguntar o nome de quem você acabou de identificar
é o tipo de atrito que faz a pessoa largar a ferramenta.

Se faltar alguma coisa, pergunte **só o que falta** e **grave no `objetivos/<nome>.md`**
pra nunca mais perguntar:

```markdown
**Time:** Growth
**Nome no Jira:** Alexandre Magno
```

O nome no Jira importa porque a automação resolve responsável por apelido, mas a
coluna da planilha às vezes usa outro (a planilha diz "Alexandre", o Jira diz
"Alexandre Magno", o time chama de "Alex").

### 2. Pergunte a sprint

Essa sempre. Aceite `33`, `SM33`, `sm 33` — normalize para o número.

Guarde a distinção: a **aba** da planilha é `SM 33 GROWTH` (com espaço), o **código**
no Jira é `[SM33]` (sem espaço).

### 3. Leia a planilha

```bash
python scripts/ler_sprint.py --sprint 33 --time GROWTH --pessoa Alexandre --saida sprint.json
```

Se a aba não existir, o script lista todas as disponíveis — mostre a lista e confirme
com a pessoa em vez de adivinhar.

Detalhes de layout, o que o JSON traz e a armadilha do `gviz`:
**`references/planilha-e-layouts.md`**.

### 4. Mostre o mapa e confira o total

Uma tabela: horas, categoria, atividade. Feche com **total da pessoa contra o
capacity** — é o número que ela usa pra saber se a sprint cabe.

Se `tem_dod` vier `false` (é o caso do Content hoje), **diga isso agora**: aquela
sprint não tem Definition of Done na planilha, então as descrições vão sair com o
que existe (Tema, Prazo, Prioridade). É melhor a pessoa saber antes de ver o card.

### 5. Ofereça a quebra

Liste quais atividades passam de 5h e pergunte se ela quer quebrar. Se nenhuma
passar, diga isso e pule direto pro passo 7.

Quem decide é ela. Se disser que não, tudo vira Formato 1 (mãe + uma filha).

### 6. Proponha a quebra e **espere aprovação**

Este é o passo que exige julgamento. Leia a descrição e o D.O.D de cada atividade
antes de fatiar — a quebra sai da natureza do trabalho, não de um molde.

**As regras que fazem a quebra ser boa:**

- **SP é HORA.** 13 SP são 13 horas de trabalho da pessoa. Não é complexidade
  relativa. Isso muda tudo: você está dividindo um dia e meio de trabalho, não
  pontuando dificuldade.
- **3 a 4 filhas, no máximo.** Mais que isso vira picadinho e ninguém atualiza.
- **Cara crachá.** O nome da tarefa diz exatamente o que a pessoa vai fazer naquelas
  horas. "Servir variante diferente da LP pela URL e registrar qual variante cada
  visitante viu" — não "Implementar roteamento (fase 1)".
- **Fatia vertical, não fase.** Nada de "análise / desenvolvimento / teste". Cada
  filha é um pedaço que funciona sozinho e gera evidência.
- **Decisão já tomada não vira tarefa.** Se o enunciado diz "avaliar se usa pronto ou
  constrói" mas a pessoa já decidiu, isso não é um gate — é levantamento de
  referência que alimenta o desenho. Pergunte antes de transformar um "decidir X"
  em filha.
- **A soma bate exata** com as horas da mãe. Sempre confira.
- **Cada filha fecha um item do D.O.D.** Se uma filha não gera nenhuma evidência que
  o D.O.D pede, ou ela está mal desenhada ou falta item no D.O.D.
- **Dependência de terceiro vai na menor tarefa possível, e o que destrava vem
  primeiro.** Se o design do João depende de um briefing seu de 1h, essa 1h é a
  filha número 1 — senão as horas dele ficam paradas esperando. Diga isso em voz
  alta na proposta, é a informação mais útil da quebra.

**Não crie nada no Jira antes de ela aprovar.** Mostre a tabela com filhas, horas e
soma, e pergunte. Se ela pedir ajuste, ajuste e mostre de novo.

### 7. Monte as mensagens

Um arquivo `.txt` por atividade, em UTF-8. Formato completo, tags e regras do parser:
**`references/automacao-e-jira.md`**.

Ao nomear as filhas, três coisas quebram na prática:

- **Parênteses no meio do nome** confundem o parser (ele lê como responsável).
  Troque por travessão.
- **Palavra que dispara tipo errado** — "copy", "design", "vídeo" no nome de uma
  tarefa de implementação. Carimbe a tag do tipo certo (`[LP]`, `[AUT]`) e ela vence.
- **Nome que já vem com tag** (é o caso do Content) — use como está, não prefixe de novo.

Valide antes de enviar. É de graça e evita meia sprint torta:

```bash
python scripts/criar_no_jira.py --simular msgs/*.txt
```

### 8. Dispare e confira

```bash
python scripts/criar_no_jira.py msgs/*.txt
python scripts/conferir_sprint.py --projeto GWT --desde 20m
```

O webhook responde 200 antes de processar — **o HTTP não prova nada**. Quem prova é
o `conferir_sprint.py`: ele mostra as filhas vinculadas por mãe, a soma de horas, a
sprint, e aponta filha órfã ou descrição vazia.

**A skill não avisa no Slack.** Quem chama a automação pelo canal
`ia-quebra-de-atividades` recebe "Sua atividade foi quebrada com sucesso!"; a skill
manda `silencioso: true` e não posta nada — quem pediu está aqui na conversa e recebe
o relatório do conferidor, que diz mais. Não anuncie no fechamento que "o Slack foi
avisado". Detalhe em `references/automacao-e-jira.md`.

As execuções rodam concorrentes e a numeração das issues sai intercalada (a mãe de
uma atividade pode ficar no meio das filhas de outra). Isso é normal e não embaralha
os vínculos — o conferidor confirma.

### 9. Preencha descrição e prioridade

A automação **não tem campo de descrição**. Sem este passo as issues nascem vazias e
o D.O.D fica só na planilha.

Monte um JSON `{chave: {descricao, prioridade}}` e rode:

```bash
python scripts/completar_issues.py descricoes.json
python scripts/conferir_sprint.py --projeto GWT --desde 30m
```

**O que vai em cada descrição:**

- **Na História mãe:** a descrição integral da planilha, depois o Definition of Done
  com os anexos numerados, e a linha da quebra (`Quebra: 13h em 4 tarefas: 2+5+4+2`).
  Carregue também as regras que estavam soltas na planilha e sumiriam — "nunca citar
  marketplace específico", "não fazer no n8n", "o disparo é do fulano".
- **Em cada filha:** o que é aquela fatia e **qual item do D.O.D ela fecha**. Se a
  filha depende de outra pessoa, ou destrava outra pessoa, escreva isso aqui — dentro
  da issue, não só no chat. É o que faz alguém entender a ordem daqui a duas semanas.
- **Em atividade não quebrada:** a filha repete a descrição da mãe. É a mesma atividade.
- **Quando não há D.O.D na planilha:** monte com o que existe e diga na entrega que
  aquele campo não veio da planilha.

Prioridade sai da coluna `Prioridade` quando ela existir.

### 10. Feche

Tabela final com link de cada História, quantidade de filhas e horas. Diga a soma
total e confirme que ela bate com o planejado da planilha. Aponte as tarefas que
destravam outras pessoas — é o que a pessoa precisa fazer primeiro.

## Testar sem sujar o board

Board do Jira é compartilhado: card de teste atrapalha a sprint de todo mundo.

Toda issue de teste nasce com **`[TESTE]`** no summary e some assim que a validação
termina. Ponha a marca **depois** do código de sprint — `[SM33][TESTE][DES] Nome` —
porque o parser lê o primeiro colchete como o código da sprint e `[TESTE]` na frente
o faz recusar a mensagem.

Prefira atribuir o teste **a você mesmo**, não a um colega: card atribuído dispara
notificação, e a pessoa recebe um card que vai sumir em cinco minutos.

```bash
python scripts/apagar_teste.py --projeto GWT --desde 2h            # lista
python scripts/apagar_teste.py --projeto GWT --desde 2h --apagar   # remove
```

O script se recusa a apagar qualquer issue sem `[TESTE]` no summary, mesmo se você
passar a chave na mão. Apagar issue é irreversível e a chave nunca volta.

Em `BRAND` não há permissão de DELETE — lá, renomeie pra `[LIXO-APAGAR]`, conclua a
issue e peça pra alguém com permissão.

## Se algo der errado

| Sintoma | Causa provável |
|---|---|
| Aba lida não é a que você pediu | Usou `gviz` em vez do xlsx — ver `references/planilha-e-layouts.md` |
| Automação recusou a mensagem | Falta código de sprint, falta responsável, ou parêntese no meio do nome |
| Filha nasceu com tipo Design/Texto errado | Palavra-chave no nome sem tag de tipo — carimbe `[LP]` ou `[AUT]` |
| Issue com o criador errado | Foi criada pelo MCP do Jira em vez da automação |
| ❌ apareceu no canal do Slack depois da sua rodada | O parser recusou uma mensagem — o aviso de erro não é silenciado. Leia o motivo lá |
| Consulta do Jira estourou o contexto | Use os scripts (REST), não o MCP |
| Issue sem descrição | Faltou o passo 9 |
