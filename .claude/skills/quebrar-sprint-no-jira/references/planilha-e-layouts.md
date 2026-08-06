# A planilha de sprint — abas, layouts e armadilhas

Leia quando precisar entender o que `ler_sprint.py` devolve, quando ele reclamar
de layout, ou quando um time novo entrar na planilha.

## Onde fica

Planilha de planejamento de sprint do Marketing:
`https://docs.google.com/spreadsheets/d/1HKfCNlFrLVhELTAPys8VQf3B-kr4yuLYl6X4IwIBj2o`

Ela é **pública**. Dá pra ler sem o conector do Google Drive — que costuma estar
sem autorização e não é obstáculo aqui.

Para apontar pra outra planilha, exporte `SPRINT_PLANILHA_ID`.

## Como as abas se chamam

Padrão: `SM <numero> <TIME>` — `SM 33 GROWTH`, `SM 33 CONTENT`. Repare no **espaço**
entre "SM" e o número na aba, que **não existe** no código de sprint do Jira (`[SM33]`).
Confundir os dois faz a automação recusar a mensagem.

Abas legadas (`SM19`, `SM20`) não têm time no nome. Existem também cópias com o
mesmo conteúdo e outro nome — por exemplo `Separação de SPs MKT - SM 33 GR` é
byte a byte igual a `SM 33 GROWTH`. `ler_sprint.py` prefere sempre o nome canônico
e só cai na busca solta se ele não existir.

Studios e Branding **não estão nesta planilha** (usam os códigos `SCC` e `SB` e
outra fonte). Se alguém desses times pedir, diga que a skill ainda não cobre e
pergunte onde está o planejamento deles.

## ⛔ A armadilha do gviz

O endpoint `gviz/tq?tqx=out:csv&sheet=<NOME>` parece a via óbvia e **é uma cilada**:
ele aceita qualquer nome de aba, inclusive nome inexistente, e devolve **outra aba**
sem nenhum erro. Isso já produziu leitura de aba errada com aparência de sucesso —
os números batiam entre si, só não eram os da aba pedida.

O `export?format=csv&gid=<GID>` funciona, mas exige descobrir o gid de cada aba, e
o gid **não** é derivável do nome.

Por isso `ler_sprint.py` baixa o **workbook inteiro em `.xlsx`**
(`export?format=xlsx`) e acha a aba pelo nome dentro do arquivo. É a única via que
acerta a aba pelo nome de forma verificável.

## Os dois layouts

`ler_sprint.py` **detecta** o layout em vez de assumir. A detecção é:

- **linha de cabeçalho** = a primeira linha que tem uma célula exatamente `Atividade`
- **colunas de pessoa** = a célula `Capacity` marca onde elas começam; os nomes ficam
  na linha imediatamente acima, até a coluna `Total`
- **campos** = casados por rótulo, sem acento e sem caixa (`Categoria`, `Tema da
  Atividade`, `Responsável`, `Descrição`, `D.O.D`, `Prioridade`, `Prazo`)

### GROWTH

```
Categoria | Atividade | Responsável | Descrição | D.O.D |  | Carlos | Alexandre | João | Total
```

Tem `Descrição` e `D.O.D`, não tem `Prioridade`. O nome da atividade vem **cru**,
sem tag: "Ferramenta de teste A/B para landing page".

### CONTENT

```
Tema da Atividade | Atividade | Prazo | Responsável |  | Prioridade | ... | Breno | Filipe | Laysla | ...
```

Duas diferenças que mudam o comportamento da skill:

1. **Não tem `Descrição` nem `D.O.D`.** O JSON volta com `tem_descricao: false` e
   `tem_dod: false`. A descrição da issue é montada com o que existe (Tema, Prazo,
   Prioridade) e a skill **avisa a pessoa** que aquela sprint não tem D.O.D na
   planilha — sem travar a criação.
2. **O nome já vem com as tags**: `[SM33][COPY][REELS] Criar roteiro e legenda`.
   Nesse caso **não prefixe de novo** — use o nome como está. Prefixar duas vezes
   gera `[SM33][SM33][COPY]...` e polui o board.

Tem `Prioridade` (`ALTA` / `BAIXA`, muitas vezes vazia) — é o que alimenta o campo
Priority do Jira.

## O que sai do `ler_sprint.py`

```json
{
  "aba": "SM 33 GROWTH",
  "pessoas": ["Alexandre", "Carlos", "João"],
  "capacity": {"Alexandre": 65.0},
  "tem_descricao": true, "tem_dod": true, "tem_prioridade": false,
  "pessoa": "Alexandre", "total_pessoa": 47.0,
  "atividades": [
    {"categoria": "SQL", "atividade": "...", "responsavel": "Alexandre Magno",
     "descricao": "...", "dod": "...", "prioridade": "", "prazo": "",
     "horas": {"Alexandre": 6.0, "João": 6.0}, "total": 12.0}
  ]
}
```

**`horas` é por pessoa e `responsavel` pode ser outra.** Uma atividade compartilhada
tem horas em duas colunas — na SM33, "LP que conversa com o anúncio" tem 6h do
Alexandre e 6h do João na mesma linha. O filtro `--pessoa` traz a linha inteira e
você lê `horas[pessoa]` pra saber quanto é dela. Não confunda "atividades da pessoa"
com "atividades em que ela é Responsável": são conjuntos diferentes.
