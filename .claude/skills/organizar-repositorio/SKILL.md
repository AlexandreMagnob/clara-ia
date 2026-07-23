---
name: organizar-repositorio
description: Reorganiza um repositório ou pasta de projeto bagunçada — arquivos soltos na raiz, nomes inconsistentes, pastas duplicadas — em uma estrutura clara, e deixa documentadas as convenções para que ela não bagunce de novo. Use sempre que alguém disser que o repositório está bagunçado, desorganizado, uma zona, "não acho nada", que quer arrumar/limpar/estruturar a pasta do projeto, padronizar nomes de arquivo, criar uma estrutura de pastas, ou definir onde cada coisa deve ficar. Use também quando pedirem para organizar um tipo específico de conteúdo (workflows, análises, prompts, documentos) que esteja espalhado, ou quando pedirem um README que explique a estrutura do projeto.
---

# Organizar repositório

Arrumar pasta é fácil. O difícil é que continue arrumado depois que outras cinco
pessoas começarem a jogar arquivo lá dentro.

Por isso esta skill entrega duas coisas, e a segunda é a que importa mais:

1. Os arquivos no lugar certo.
2. **As regras escritas de onde colocar coisa nova** — sem isso, em dois meses a raiz
   volta a ter trinta arquivos soltos.

Escreva tudo que for pra pessoa ler **em português**: README, tabela do plano, relatório
final. Os nomes de pasta e arquivo também, salvo quando o repositório já usa inglês de
forma consistente — aí siga o que já está lá.

## Duas regras que não se quebram

**Nenhum arquivo pode sumir.** Mover trezentos arquivos é fácil de fazer errado e difícil
de auditar depois. Por isso todo movimento passa por validação antes de acontecer, e no
fim você confere que o git registrou renomeação (`R`) e não deleção (`D`).

**Nenhum segredo pode vazar.** Repositório bagunçado quase sempre tem uma senha em texto
puro em algum lugar — o dono esqueceu que estava ali. Se você reorganizar sem olhar, pode
mover esse arquivo pra dentro de uma pasta versionada e publicar a senha. Procure antes.

## O passo a passo

### 1. Levante o terreno antes de tocar em qualquer coisa

```bash
python <skill>/scripts/inventario.py <repo> -o inventario.md
```

Não altera nada. Gera um relatório com: arquivos soltos na raiz, mapa de pastas, o que é
versionado, possíveis credenciais, duplicatas de conteúdo, arquivos com o mesmo nome em
lugares diferentes, nomes com espaço/acento e arquivos pesados.

Leia o relatório inteiro antes de pensar em estrutura.

### 2. Entenda o que as coisas são

O inventário diz o que existe; ele não diz o que significa. Essa parte é sua, e é onde
mora o valor — classificar errado é pior do que não organizar.

Abra o que estiver ambíguo. Especialmente:

- **Arquivo sem extensão** — pode ser um JSON, um script, qualquer coisa. Abra e veja.
- **Mesmo nome em pastas diferentes** — pode ser cópia, versão antiga ou variante legítima
  que deve continuar existindo. Compare conteúdo e data. **Cuidado com a intuição**: o
  arquivo que *parece* antigo pelo nome ou pela pasta pode ser o mais novo. Confira
  `ls -la` e o conteúdo, não o nome.
- **Suspeita de credencial** — abra e confirme. Se for senha de verdade, ela nunca entra
  no repositório: veja "Segredos" adiante.
- **Pastas com nome parecido** (`Automações/` e `automacoes-CDP/`) — descubra se é a mesma
  coisa em duas fases ou duas coisas diferentes. Isso decide se viram uma pasta ou duas.

Se o repositório tem README, CLAUDE.md ou docs, leia: eles dizem qual estrutura *deveria*
existir. Frequentemente a estrutura documentada e a real já divergiram — vale apontar.

### 3. Pergunte só o que muda o resultado

Duas ou três perguntas, não dez. Pergunte o que você não consegue decidir sozinho porque
depende de preferência ou de informação que só a pessoa tem:

- **Mídia pesada e dumps** (vídeo, imagem grande, dados brutos) — continuam versionados ou
  saem do git? Muda o peso do repositório pra sempre.
- **Nomes com espaço, acento e colchete** — normalizar ou preservar? Preservar faz sentido
  quando o nome do arquivo espelha o nome de algo externo (um workflow no n8n, um card no
  Jira) e serve pra achar. Normalizar é melhor pra terminal e script.
- **Arquivo cuja função você não descobriu** — pergunte em vez de chutar.

Não pergunte o que tem resposta óbvia (onde vai um `.py` utilitário, se README fica na
raiz). Decida e siga.

### 4. Monte o plano e espere aprovação

Nunca mova antes de aprovarem. Quem pede pra organizar quase sempre tem contexto que você
não tem, e é mais barato descobrir isso lendo uma tabela do que revertendo trezentos
movimentos.

Apresente três coisas:

**A estrutura proposta**, com uma linha por pasta dizendo o que vive nela:

```
automacoes/    workflows exportados do n8n, por área
analises/      investigações fechadas; dados brutos em analises/dados/
docs/          guias, referências de API, arquitetura
```

**O de-para**, agrupado por área e não como lista corrida de 300 linhas. Mostre o padrão
e o volume: "os 70 salesbots viram `automacoes/salesbots/<sdr>/<estágio>.json` — exemplo:
`AUTBOT_FOLLOWUP_1_CAIQUE.json` → `caique/followup-1.json`". Detalhe item por item só o
que foge do padrão.

**O que você decidiu não mexer, e por quê** — isso costuma ser o que gera correção. Se
uma pasta já está boa, diga que está boa.

Salve o de-para completo como plano, um movimento por linha, origem e destino separados
por TAB:

```
[SDR] Fluxo Agente SDR.json	automacoes/clara-sdr/sdr_fluxo-agente-sdr.json
bots_caique/AUTBOT_ABERTURA_CAIQUE.json	automacoes/salesbots/caique/abertura.json
```

Gerar essas linhas com um script Python é mais confiável do que digitar, principalmente
para conjuntos repetitivos como os salesbots — e o script vira a documentação da regra
que você aplicou.

Regras de estrutura e nomenclatura: leia `references/convencoes.md`.

### 5. Execute

```bash
python <skill>/scripts/mover.py plano.tsv --repo <repo> --conferir   # valida
python <skill>/scripts/mover.py plano.tsv --repo <repo>              # executa
```

O `--conferir` valida sem mover: origem que não existe, destino que já existe, dois
arquivos disputando o mesmo destino. Ele junta **todos** os problemas e aborta antes do
primeiro movimento — assim você nunca fica com metade do plano aplicado.

Na execução ele usa `git mv` no que é versionado (pro histórico do arquivo sobreviver),
move no disco o que não é, limpa as pastas que ficaram vazias e grava um `desfazer.tsv`
que reverte tudo se precisar.

### 6. Costure as referências que quebraram

Mover arquivo quebra link. Procure os caminhos antigos no conteúdo:

```bash
grep -rn "pasta-antiga/\|arquivo-antigo.md" --include="*.md" --include="*.py" \
     --include="*.json" --include="*.html" . | grep -v "^./.git"
```

Rode com os nomes das pastas e arquivos que você moveu. Corrija o que achar: link em
Markdown, caminho absoluto dentro de script, referência em README. Um caminho quebrado
num script é pior que a bagunça original, porque só aparece quando alguém roda e falha.

### 7. Escreva as convenções

**Esta é a entrega principal.** Sem ela você arrumou uma vez; com ela, o repositório se
mantém.

No README da raiz:

- **Mapa** — tabela de pasta → o que vive nela, com link.
- **"Onde eu coloco uma coisa nova?"** — tabela de tipo de arquivo → pasta → padrão de
  nome. É o que a pessoa consulta na hora de salvar um arquivo, então tem que responder em
  cinco segundos.
- **Convenções de nome** — e o motivo de cada uma. Regra sem motivo não sobrevive: quem
  não entende por que a data vem primeiro vai salvar `analise-final-v2.md`.
- **Segredos** — o que nunca entra e como conferir antes de commitar.

Em cada pasta que cresce (as que recebem arquivo novo toda semana), um README curto com a
regra local e, quando ajudar, um índice do que tem lá.

Registre também as armadilhas que você descobriu no caminho — "este export é mais novo que
aquele apesar do nome", "falta um arquivo nesta pasta em relação às outras". Quem chegar
depois não tem como saber, e é exatamente esse tipo de coisa que faz alguém sobrescrever
o arquivo errado.

Se o repositório tem `CLAUDE.md`, acrescente lá um resumo das convenções, pra que as
próximas sessões de Claude sigam o padrão em vez de reinventar.

Modelos prontos de README: `references/convencoes.md`.

### 8. Confira

```bash
git status --short | awk '{print $1}' | sort | uniq -c
```

O esperado é quase tudo `R` (renomeado). Cada `D` sem `A` correspondente é arquivo
perdido — investigue antes de commitar.

Confirme também:

- Contagem de arquivos bate com o inventário (menos o que foi deletado de propósito).
- Segredos bloqueados de verdade: `git check-ignore -v <arquivo>` tem que responder. Se
  não responder, o `.gitignore` não está pegando — veja `references/armadilhas.md`.
- Os scripts que você mexeu ainda rodam.

Deixe as mudanças preparadas mas **não commite sem pedirem**. Ofereça, e sugira separar em
commits — a reorganização em um, correções de segurança em outro — porque revisar
"moveu 300 arquivos + mudou o .gitignore" num commit só é impossível.

## Segredos

Se o inventário achar credencial, trate antes de continuar:

1. **Não cole o conteúdo** na conversa nem em arquivo nenhum.
2. Se **não** estiver versionado: bloqueie no `.gitignore` e siga.
3. Se **já** estiver versionado, avise com clareza: tirar do histórico não resolve
   sozinho, a senha já esteve exposta e precisa ser trocada. Quem decide é a pessoa.
4. Nunca mova um arquivo com segredo para dentro de área versionada.

Comentário no `.gitignore` só funciona em linha própria — `senha.md # não versionar` vira
um padrão literal que não bloqueia nada. Detalhes em `references/armadilhas.md`.

## Casos que fogem do comum

**Não é um repositório git.** Sem histórico não há rede de segurança. Avise, sugira
`git init` antes de mexer, e conte com o `desfazer.tsv` que o `mover.py` gera.

**Já tem trabalho não commitado.** Mover arquivo por cima de mudança pendente embola tudo.
Rode `git status` antes; se houver coisa não commitada, peça pra commitar ou guardar
(`git stash`) primeiro.

**O repositório é código de verdade** (aplicação, biblioteca, com imports e build). Aí a
estrutura é ditada pela linguagem e pelo framework, não por você, e mover arquivo quebra
import. Reorganize só o que não é código — docs, scripts avulsos, dados — e diga que o
código-fonte precisa de refatoração com teste rodando, que é outro trabalho.

**Pouca coisa pra arrumar.** Se a bagunça é de dez arquivos, faça e pronto: plano de uma
tabelinha, sem inventário formal. Aplique o bom senso na dose.

## Referências

- `references/convencoes.md` — estruturas por tipo de projeto, regras de nomenclatura e
  modelos de README.
- `references/armadilhas.md` — erros que já custaram caro: `.gitignore` que não bloqueia,
  renomeação que o git não detecta, sensibilidade a maiúscula no Windows, e outros.
