# Convenções: estrutura, nomes e READMEs

Índice:
- [Princípios de estrutura](#princípios-de-estrutura)
- [Nomenclatura](#nomenclatura)
- [Estruturas por tipo de projeto](#estruturas-por-tipo-de-projeto)
- [Padrões que resolvem problemas específicos](#padrões-que-resolvem-problemas-específicos)
- [Modelos de README](#modelos-de-readme)

---

## Princípios de estrutura

**Agrupe por assunto, não por formato.** `analises/` com os `.md`, `.pdf` e `.csv` da mesma
investigação é melhor que `markdown/`, `pdfs/` e `planilhas/`. Ninguém procura "aquele PDF";
procura "aquela análise de no-show".

A exceção é dado bruto: CSV e SQL que embasam uma análise ficam num `dados/` ao lado, porque
são muitos, ninguém lê direto e eles poluem a listagem do que interessa.

**Uma pasta na raiz por área de trabalho.** Se a raiz tem mais de umas doze pastas, alguma
coisa foi fatiada fino demais. Se tem três e uma delas tem duzentos arquivos, faltou fatiar.

**Profundidade dois, no máximo três.** `automacoes/salesbots/caique/` é o limite saudável.
Cada nível a mais é um lugar a mais onde a pessoa vai errar ao salvar.

**Não crie pasta pra um arquivo só.** Espere ter três ou quatro do mesmo tipo. Pasta com um
arquivo dentro é mais um clique sem retorno.

**Prefixo `_` para material interno.** `_pipeline/`, `_versoes-antigas/`, `_rascunhos/`.
Ordena junto no topo e sinaliza "não precisa ler isso" sem precisar explicar.

**Nunca crie pasta `atual/` ou `mais-recente/`.** Ela desatualiza no dia em que alguém
esquecer de mover o arquivo, e aí passa a mentir — pior que não existir. Use número de
versão ou data no nome, e uma tabela no README dizendo qual está em produção.

---

## Nomenclatura

**Minúsculas, sem acento, sem espaço, `kebab-case`.** Espaço obriga aspas em todo comando,
acento quebra em sistema com outra codificação, colchete é caractere especial em shell.
`[SDR] Integração inicial.json` → `sdr_integracao-inicial.json`.

**Data primeiro (`AAAA-MM-DD_`) no que é retrato de um momento.** Análise, relatório, export,
versão de prompt. Ordena cronologicamente sozinho no `ls`, e o formato ISO evita a ambiguidade
de 03/04 (que é 3 de abril pra uns e 4 de março pra outros).

**Sem data no que é vivo.** Guia, referência, roadmap, workflow em produção — esses são
editados, não substituídos. Data em documento vivo faz parecer desatualizado quando não está.

**O nome descreve o conteúdo, não o estado.** `final`, `v2`, `novo`, `atualizado`, `ok` não
sobrevivem a duas semanas — sempre aparece um `final-final`. O estado é do git ou do número
de versão.

**Prefixo comum para quem anda junto.** Todos os arquivos do experimento EXP-16 começam com
`exp-16_`, então `ls exp-16*` junta o conjunto sem precisar de subpasta.

**Nomes espelhados entre variantes paralelas.** Se existem duas versões da mesma coisa
(bancos diferentes, pessoas diferentes, ambientes diferentes), use **o mesmo nome de arquivo
em pastas diferentes**, não nomes diferentes na mesma pasta:

```
clara-sdr/sdr_follow-up.json      ← bom: diff direto entre os dois
cdp/sdr_follow-up.json

sdr_follow-up.json                ← ruim: comparar exige tradução mental
sdr_follow-up-cdp-novo.json
```

Assim `diff a/x.json b/x.json` funciona, e quando uma variante morrer você apaga a pasta
inteira sem caçar arquivo.

---

## Estruturas por tipo de projeto

Ponto de partida, não fôrma. Adapte ao que o repositório realmente tem.

### Operações / automação / growth

```
contexto/       contexto de negócio: quem somos, como o funil funciona
automacoes/     workflows exportados (n8n, Make, Zapier), por área
prompts/        prompts de agentes, versionados
experimentos/   o plano: hipótese, desenho, como medir
analises/       o resultado: investigações fechadas (+ dados/ brutos)
dashboards/     painéis
docs/           guias, referências de API, processos
planejamento/   roadmap e backlog
scripts/        utilitários avulsos
assets/         imagem, áudio, vídeo
```

A separação que mais rende aqui é **experimentos (plano) × análises (resultado)**. São
coisas diferentes com ciclos de vida diferentes: o plano é editado até rodar, o resultado é
congelado quando fecha. Misturar os dois é o que faz ninguém achar nada depois.

### Pesquisa / documentação / base de conhecimento

```
fontes/         material original (PDF, transcrição, export)
notas/          suas anotações sobre as fontes
sinteses/       o produto: o que dá pra concluir
referencias/    documentação de terceiros
```

### Projeto de código

A linguagem manda na estrutura (`src/`, `tests/`, `pkg/`, o que for). Reorganize **só o que
está fora dela**: `docs/`, `scripts/`, `examples/`, e o lixo acumulado na raiz. Mover módulo
quebra import — isso é refatoração, com teste rodando, e não é o escopo desta skill.

---

## Padrões que resolvem problemas específicos

**Duas versões da mesma coisa rodando em paralelo** (migração, A/B, homolog × produção):
pastas espelhadas com nomes de arquivo idênticos. Documente no README qual é qual e quando a
antiga morre. Quando a migração acabar, deletar é uma linha.

**O mesmo artefato para várias pessoas/clientes** (um bot por SDR, um config por cliente):
uma pasta por pessoa, **mesmos nomes de arquivo dentro**. Fica óbvio quando falta um — foi
assim que apareceu que uma pasta de SDR não tinha o arquivo de abertura que as outras quatro
tinham.

**Versões de um documento vivo** (prompt, contrato, política): um arquivo por versão com
`vX.Y` no nome, a anterior nunca sobrescrita, e uma tabela no README apontando a que está em
produção. O diff entre versões é metade do valor de versionar.

**Export de ferramenta externa** (workflow, dashboard, board): mantenha no nome do arquivo
alguma pista do nome lá na ferramenta, senão ninguém liga um ao outro. Se o nome original é
`[SDR] Tool consulta_agenda`, `sdr_tool-consulta-agenda.json` preserva a pista e ainda é
utilizável no terminal.

**Arquivo que já cumpriu função mas dá medo apagar**: `_versoes-antigas/` com data no nome.
Melhor que deixar no meio dos ativos, e melhor que apagar sem perguntar.

---

## Modelos de README

### README da raiz

Quatro seções. A segunda é a que a pessoa realmente vai usar.

````markdown
# <Projeto>

<Duas ou três linhas: o que é, pra quem serve, em que estado está.>

## Mapa do repositório

| Pasta | O que vive aqui |
|---|---|
| [contexto/](contexto/) | **Leia primeiro.** Contexto de negócio. |
| [automacoes/](automacoes/) | Workflows exportados do n8n. |
| ... | ... |

## Onde eu coloco uma coisa nova?

Regra de bolso — **se a resposta for "sei lá", é `docs/`**.

| Se é… | Vai em… | Nome |
|---|---|---|
| um workflow exportado | `automacoes/<área>/` | `<área>_<slug>.json` |
| o resultado de uma investigação | `analises/` | `AAAA-MM-DD_<slug>.md` |
| CSV que embasa uma análise | `analises/dados/` | `AAAA-MM-DD_<slug>.csv` |
| **qualquer coisa com senha** | **fora do repo** | veja abaixo |

### Convenções de nome

- Sem acento, sem espaço, sem colchete. `kebab-case`, minúsculo.
- Data primeiro (`AAAA-MM-DD_`) no que é retrato de um momento — faz o `ls` ordenar sozinho.
- Sem data no que é vivo e vai sendo editado.
- Prefixo `_` = material interno, não precisa ler.

## Segurança

Credencial nunca entra no repositório. O `.gitignore` bloqueia `.env` e afins, mas o filtro
é burro — confira antes de commitar:

```bash
git status --short
```

Se um segredo já foi commitado, **rotacione a senha**: tirar do histórico não basta.
````

### README de pasta que cresce

Curto. Responde três perguntas: o que vive aqui, como se chama, e o que é bom saber antes de
mexer.

````markdown
# <Pasta>

<Uma linha: o que vive aqui e — se houver confusão possível — o que **não** vive.>

## Estrutura

| Subpasta | Conteúdo |
|---|---|
| `x/` | ... |

## Convenção

```
AAAA-MM-DD_<slug>.md
```

<Por que é assim. A regra sem o motivo não sobrevive à primeira pressa.>

## Como adicionar um item novo

1. ...
2. ...

> Armadilhas: <o que quem chega novo não tem como saber e vai errar. Ex: "este export é
> mais novo que o da outra pasta, apesar do nome".>
````

### Índice, quando a pasta passa de ~15 arquivos

Tabela de data/código → link → estado. Vale a manutenção só onde alguém procura coisa com
frequência; em pasta parada, índice desatualizado atrapalha mais que ajuda.

---

## O que acrescentar no CLAUDE.md

Se o repositório tem `CLAUDE.md`, um resumo curto faz as próximas sessões seguirem o padrão
em vez de inventar outro:

```markdown
## Organização do repositório
O `README.md` da raiz tem o mapa e a tabela "onde eu coloco uma coisa nova".
Siga a convenção existente — não invente pasta nova sem necessidade.

- `analises/AAAA-MM-DD_<slug>.md` — resultado; dados brutos em `analises/dados/`
- <as duas ou três regras que mais pegam neste repo>

Nomes sem acento, espaço ou colchete; `kebab-case`. Prefixo `_` = interno.

## Segredos
Nunca versione credencial. `.env` e `<arquivo>` estão no `.gitignore` — não os mova
para fora do bloqueio nem exiba o conteúdo.
```
