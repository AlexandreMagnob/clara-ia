# Armadilhas

Erros que já aconteceram de verdade numa reorganização. Todos são silenciosos: nada dá
errado na hora, o problema aparece dias depois.

---

## `.gitignore` não aceita comentário no fim da linha

```
CONEXAO.md   # senhas em texto puro    ← NÃO bloqueia nada
```

O git trata a linha inteira como o padrão, incluindo o `#` e os espaços. Ele procura um
arquivo literalmente chamado `CONEXAO.md   # senhas em texto puro`, não encontra, e o
arquivo com as senhas segue livre pra ser commitado.

O jeito certo:

```
# CONEXAO.md tem senhas em texto puro — nunca versionar
CONEXAO.md
```

**Sempre confirme depois de editar o `.gitignore`:**

```bash
git check-ignore -v CONEXAO.md
```

Se responder com a linha que bloqueou, funcionou. Se não responder nada, não bloqueou.
Silêncio aqui é falha, não sucesso — e essa inversão engana.

Outros detalhes do `.gitignore` que confundem:

- **Arquivo já versionado ignora o `.gitignore`.** Ele continua sendo rastreado. Precisa de
  `git rm --cached <arquivo>` pra parar. Antes disso, lembre que ele já está no histórico.
- **`*.env` não pega `.env`.** O `*` não casa com nome que começa com ponto em alguns casos;
  liste as duas formas.
- **`pasta/` com barra** só bloqueia pasta; sem barra bloqueia arquivo e pasta com o nome.

---

## Deleção que não é renomeação

O git não guarda "renomeou" — ele guarda que um arquivo sumiu e outro apareceu, e infere a
renomeação comparando conteúdo. A inferência falha quando o arquivo foi movido **e** editado
na mesma leva, e aí o histórico daquele arquivo se perde: `git log --follow` para de achar
as versões anteriores.

Por isso: **mova primeiro, edite depois, em commits separados.**

Confira sempre depois de executar o plano:

```bash
git status --short | awk '{print $1}' | sort | uniq -c
```

Quase tudo tem que ser `R`. Cada `D` sem `A` correspondente é arquivo perdido de verdade.

---

## Windows: `Arquivo.md` e `arquivo.md` são o mesmo arquivo

O sistema de arquivos do Windows e do macOS não diferencia maiúscula de minúscula, mas o
git diferencia. Consequências:

- Renomear `README.MD` → `readme.md` pode não ser detectado como mudança.
- Se o plano manda dois arquivos que só diferem em maiúscula pro mesmo destino, um
  **sobrescreve** o outro sem aviso. (O `mover.py` detecta destino duplicado, mas compara
  as strings — `A.md` e `a.md` passam como destinos diferentes e depois colidem no disco.)

Quando for normalizar caixa, faça em duas etapas: `arquivo.MD` → `arquivo-tmp.md` →
`arquivo.md`. E evite gerar destinos que só diferem em maiúscula.

---

## Caminho absoluto dentro de script

Script tende a ter caminho cravado:

```python
FAQ = r"C:\Users\fulano\Desktop\Projeto\faq-vendas.md"
```

Mover o `faq-vendas.md` quebra o script, e ninguém descobre até rodar. `grep` não pega
sozinho porque o caminho pode estar quebrado em várias linhas ou montado por concatenação.

Depois de mover, procure pelo **nome do arquivo** e pelo **nome da pasta antiga**, separados:

```bash
grep -rn "faq-vendas\|pasta-antiga" --include="*.py" --include="*.js" \
     --include="*.md" --include="*.json" . | grep -v "^./.git"
```

E confira arquivo de configuração, workflow de CI e atalho — não é só `.py`.

---

## O arquivo "antigo" pode ser o novo

Duas pastas, `sistema/` e `sistema-novo/`. A intuição diz que `sistema-novo/` tem a versão
atual. Nem sempre: quem trabalhou por último pode ter exportado por cima da pasta antiga,
ou a pasta "nova" pode ser um experimento abandonado.

Foi exatamente o que apareceu num caso real: o export que estava numa pasta chamada
`automacoes-CDP/` era de junho, e o arquivo com o mesmo nome na pasta "antiga" era de julho
e **já continha** as mudanças do CDP. Organizar pelo nome da pasta teria arquivado o mais
recente.

Antes de decidir qual é qual: `ls -la` pra ver data, e olhe o conteúdo. Se continuar
ambíguo, **pergunte** — e registre a resposta no README, porque a próxima pessoa vai cair na
mesma pegadinha.

---

## Renomear em massa apaga o que colide

Regra de renomeação que remove sufixo (`AUTBOT_ABERTURA_CAIQUE.json` → `abertura.json`)
funciona lindamente até dois arquivos diferentes virarem o mesmo nome. Sem validação, o
segundo sobrescreve o primeiro e ninguém percebe — a contagem final até bate, porque um
arquivo a menos parece "duplicata removida".

Por isso o `mover.py` valida destino duplicado antes de mover qualquer coisa. Se você gerar
movimentos por script sem usar ele, replique essa checagem.

---

## Contar arquivo antes e depois

A verificação mais barata que existe:

```bash
find . -path ./.git -prune -o -type f -print | wc -l
```

Antes e depois. A diferença tem que ser exatamente o que você adicionou (READMEs) menos o
que deletou de propósito. Qualquer outro número significa que alguma coisa sumiu.

---

## Pasta vazia que o git não mostra

O git não versiona pasta vazia, então depois de mover tudo pra fora a pasta continua no
disco mas não aparece em `git status`. Fica lixo visual pra sempre. O `mover.py` limpa
sozinho; se você mover na mão, lembre do `rmdir`.

---

## Mover com trabalho pendente embola tudo

Se havia mudança não commitada antes da reorganização, o diff final vira uma sopa: não dá
pra distinguir "movi arquivo" de "alterei conteúdo", e revisar fica impossível.

Rode `git status` **antes** de montar o plano. Se tiver coisa pendente, peça pra commitar
ou guardar (`git stash`) primeiro.

---

## Segredo no histórico não sai com `.gitignore`

Adicionar ao `.gitignore` impede commits futuros. Não remove o que já foi commitado — a
senha continua acessível em qualquer clone antigo, em fork, em cache do GitHub.

Limpar o histórico (`git filter-repo`, BFG) reescreve todos os commits, quebra os clones de
todo mundo, e **ainda assim** não garante que ninguém copiou. A resposta certa é sempre
**rotacionar a credencial**. Diga isso com clareza e deixe a decisão com a pessoa.
