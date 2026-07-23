# Reconciliação do baseline — GWT-2729 / EXP-19 (abertura segmentada por nicho)

**Data da investigação:** 2026-07-20
**Banco:** Supabase CW - Comercial (`rydlkqomjokkhxghgqde`), tabela `leads`
**Dados brutos:** [`dados/2026-07-20_reconciliacao-baseline-gwt-2729.csv`](dados/2026-07-20_reconciliacao-baseline-gwt-2729.csv)

---

## 1. A pergunta

O EXP-19 foi declarado **VALIDADA** em 19/06/2026 comparando o resultado pós-teste
(~47% de resposta) contra um baseline de **32,6%** — ganho aparente de **+14pp**.

Mas existe um segundo baseline congelado para o mesmo experimento, em
`project_gwt-2729-abertura-segmentada.md`: **76,0%**. Contra esse, os mesmos 47%
viram **−29pp**.

Os dois não podem estar certos. Qual é o baseline correto, e o veredito se sustenta?

---

## 2. Método — as duas definições de "respondeu"

As duas medidas existentes usam **definições diferentes de resposta** *e* **universos
diferentes**. Reconstruí ambas em SQL e rodei as duas sobre o mesmo recorte.

### Definição B — `count_messages > 1`

A definição registrada na memória do projeto. Simples, conta qualquer troca de mensagem.

```sql
(count_messages > 1) AS respondeu_defB
```

### Definição A — parse da `conversa`

Lê a `conversa` e verifica se o lead respondeu **à mensagem de abertura**, antes de
qualquer follow-up. Reconstruída até bater com o número registrado.

```sql
WITH base AS (
  SELECT conversa,
    position('] Comercial:'   IN coalesce(conversa,'')) AS pos_ab,
    position('Comercial (Fup)' IN coalesce(conversa,'')) AS pos_fup
  FROM leads
)
SELECT
  pos_ab > 0                                        -- recebeu abertura
  AND pos_ab <= 25                                  -- a abertura é a 1a linha
  AND substring(conversa FROM pos_ab) ~ '\] Lead ?:' -- houve linha do Lead depois
  AND (pos_fup = 0                                  -- e ela veio ANTES do 1o follow-up
       OR position('] Lead' IN substring(conversa FROM pos_ab)) + pos_ab - 1 < pos_fup)
  AS respondeu_defA
FROM base;
```

Formato da `conversa` (duas variantes convivem, ambas cobertas pelo regex ASCII-safe
`\] Lead ?:`):

```
[05/05/2026 17:18:16] Comercial: Oi, Maria! Aqui e a Clara da Cardapio Web...
[05/05/2026 17:19:00 - text] Lead :estou estruturando
[11/05/2026 22:04:06] Lead: Sim
```

### Validação da reconstrução

Ambos os lados foram reproduzidos a partir do banco antes de qualquer conclusão.

| Lado | Filtro reconstruído | Reproduzido | Registrado | Bate? |
|---|---|---|---|---|
| **A** | `tier > '3'`, maio, def. A — pizzaria | 27,9% (118/423) | 27,9% | sim |
| **A** | `tier > '3'`, maio, def. A — hamburgueria | 39,1% (301/769) | 38,6% | sim |
| **A** | `tier > '3'`, maio, def. A — restaurante | 26,5% (118/445) | 26,6% | sim |
| **A** | `tier > '3'`, maio, def. A — **total 3 nichos** | **32,8% (537/1.637)** | **32,6%** | sim |
| **B** | `tier IN ('4','5')`, maio, def. B — TESTE | 76,7% (563/734) | 76,0% (737) | sim |
| **B** | `tier IN ('4','5')`, maio, def. B — CONTROLE | 76,6% (1.524/1.989) | 76,7% (1.988) | sim |

Reconstrução fiel dos dois lados. A partir daqui os números são comparáveis.

---

## 3. A tabela 2×2

Universo fixo = **`tier IN ('4','5')`, 3 nichos do teste** (pizzaria + hamburgueria +
restaurante). Janela pós-teste = **16–22/06** (o dia 23/06 foi excluído, ver §4c).

| | **Baseline (maio/2026)** | **Pós-teste (16–22/06)** | **Δ** |
|---|---|---|---|
| **Definição A** (parse da `conversa`) | **70,8%** (520/734) | **48,4%** (89/184) | **−22,4pp** |
| **Definição B** (`count_messages > 1`) | **76,7%** (563/734) | **56,0%** (103/184) | **−20,7pp** |

**As duas definições concordam: queda.** A definição A é sistematicamente ~6pp mais
baixa que a B (ela exige abertura recebida + resposta antes do follow-up), mas o
**sinal e a magnitude do movimento são os mesmos**. A definição, sozinha, não explica
a divergência.

### O que acontece quando se troca o universo

Mesma janela e mesmas definições, mas com o recorte `tier > '3'` do Lado A:

| | Baseline (maio) | Pós-teste (16–22/06) | Δ |
|---|---|---|---|
| Definição A, `tier > '3'` | 32,8% (537/1.637) | **20,9% (111/530)** | −11,9pp |
| Definição B, `tier > '3'` | 44,7% (732/1.637) | 43,0% (228/530) | −1,7pp |

Nenhuma das quatro células consistentes produz um ganho. **Em nenhuma combinação de
definição × universo o EXP-19 sobe.**

---

## 4. A causa exata da divergência

### (a) A causa principal — o universo, não a definição

`tier > '3'` é comparação de **string**, então inclui `'3.1'` e `'3.2'`. E esses leads
**quase nunca recebem mensagem da Clara**:

| Faixa (maio/2026) | Leads | Receberam abertura | % |
|---|---|---|---|
| tier 3.1 / 3.2 | 3.187 | 168 | **5,3%** |
| tier 4 / 5 | 2.723 | 2.713 | **99,6%** |

Dos 3.187 leads tier 3.1/3.2 de maio, **2.381 não têm `conversa` nenhuma**.

O baseline de 32,6% usou `tier > '3'` como denominador — **54% dele são leads que nunca
receberam a mensagem de abertura** e que, por construção, jamais poderiam responder a
ela. Isso divide a taxa por ~2. O baseline de 76,0% usou `tier IN ('4','5')`, o universo
realmente contactado.

> **A divergência é de universo, não de definição.** 32,6% e 76,0% medem a mesma coisa
> em populações diferentes: uma inclui ~3.200 leads que nunca foram abordados, a outra não.

### (b) O erro que inverteu o veredito

O pós-mortem comparou **baseline no universo diluído** (32,6%, `tier > '3'`) contra
**resultado no universo contactado** (~47%, tier 4-5). Numerador e denominador de
populações distintas. O "+14pp" é inteiramente artefato dessa troca.

Medido de forma consistente, no mesmo `tier > '3'` do baseline, o pós-teste dá
**20,9%** — ou seja, **−11,9pp**, não +14pp.

### (c) Contaminações verificadas

- **Virada de roteamento (23/06):** confirmada no banco. Leads tier 4/5 com
  `usuario <> 'clara'` saltam de 5/85 (22/06) para 13/97 (23/06) e 40/123 (24/06).
  A janela original 16–23/06 **cruza a virada**. Excluí o dia 23/06 de toda a análise;
  os números acima usam 16–22/06.
- **`usuario` em maio:** ~99% NULL (só 60 leads `tier > '3'` com `usuario='clara'` no
  mês). Confirmado — o baseline de maio **não pode** ser filtrado por `usuario`.
  Usei `tier IN ('4','5')`, que em maio é ~100% Clara.
- **`abertura_variante`:** NULL para todos, como registrado. Braço identificado pelo
  **texto da abertura** na `conversa`.
- **Qualidade da base:** 0 duplicados por telefone, 0 `name` nulo nas duas janelas;
  25/2.723 (maio) e 5/530 (junho) com telefone suspeito — volume irrelevante.

### (d) Duas falhas de execução que o pós-mortem não registrou

Identificando o braço pelo texto entregue (`tier 4-5`, `usuario='clara'`, 16–22/06):

| Nicho | Abertura efetivamente entregue | Leads |
|---|---|---|
| hamburgueria | SEGMENTADA | 77 |
| restaurante | SEGMENTADA | 51 |
| **pizzaria** | **GENÉRICA — nunca tratada** | **52** |

1. **Pizzaria nunca recebeu a abertura segmentada.** Os 52 leads de pizzaria da janela
   receberam a abertura genérica. O "resultado de pizzaria" citado no pós-mortem (46%)
   é o desempenho da **abertura genérica**, rotulado como segmentada.
2. **O grupo de controle também mudou no meio do teste.** Os "outros nichos" receberam
   a **nova** abertura genérica ("Sou a Clara 😁…", que entrou ~15/06), não a de maio.
   O contrafactual não é estável.

---

## 5. Diferença-em-Diferenças (o método pré-registrado)

O plano do experimento previa **DiD**, não pré/pós cru — justamente por causa da queda
geral de resposta desde 01/06. Rodando o DiD como planejado, com o grupo tratado
corrigido para **só os nichos realmente tratados** (hamburgueria + restaurante):

| Grupo | Def. | Baseline maio | Pós 16–22/06 | Δ |
|---|---|---|---|---|
| **TRATADO** (hamb+rest) | A | 74,1% (407/549) | 50,0% (65/130) | −24,1pp |
| **CONTROLE** (outros nichos) | A | 71,7% (1.427/1.989) | 57,2% (206/360) | −14,5pp |
| **TRATADO** (hamb+rest) | B | 80,0% (439/549) | 57,7% (75/130) | −22,3pp |
| **CONTROLE** (outros nichos) | B | 76,6% (1.524/1.989) | 63,9% (230/360) | −12,7pp |

| Definição | DiD | Erro-padrão | z | p (bicaudal) |
|---|---|---|---|---|
| **A** (parse da `conversa`) | **−9,6pp** | 5,5pp | −1,74 | ≈ 0,08 |
| **B** (`count_messages > 1`) | **−9,6pp** | 5,4pp | −1,78 | ≈ 0,08 |

**As duas definições convergem no mesmo −9,6pp.**

### Teste placebo — pizzaria

Pizzaria não foi tratada, então serve de placebo: se a queda fosse só "os 3 nichos
derraparam", pizzaria cairia igual.

| Grupo | Def. A: maio → pós | Δ | DiD vs controle |
|---|---|---|---|
| PIZZARIA (**não tratada**) | 61,1% (113/185) → 44,4% (24/54) | −16,7pp | **−2,2pp** |
| TRATADO (hamb+rest) | 74,1% → 50,0% | −24,1pp | **−9,6pp** |

O placebo cai apenas −2,2pp contra o controle; o grupo tratado cai −9,6pp. **A queda
extra está concentrada exatamente onde a abertura segmentada foi entregue.** Isso
reforça que o efeito é do tratamento, não deriva de nicho.

### Guarda (agendamento)

| Grupo | maio | pós 16–22/06 |
|---|---|---|
| TRATADO (hamb+rest) | 6,4% (35/549) | 3,1% (4/130) |
| CONTROLE (outros) | 2,7% (53/1.989) | 1,4% (5/360) |

DiD ≈ −2,0pp, mas com **n=4 agendamentos** no grupo tratado pós. **Não conclusivo** —
não uso esse número para nada.

---

## 6. Veredito do EXP-19

> ## O EXP-19 NÃO se sustenta. O veredito "VALIDADA" está invertido.

- O ganho de **+14pp foi artefato de comparar universos diferentes**: baseline calculado
  sobre `tier > '3'` (54% do denominador = leads que nunca receberam a abertura) contra
  resultado calculado sobre tier 4-5 (99,6% contactados).
- Medido de forma consistente, **as duas definições de "respondeu" concordam entre si**
  e apontam para o mesmo lado: **DiD de −9,6pp** para a abertura segmentada.
- O **teste placebo com pizzaria** (não tratada, DiD −2,2pp) mostra que a queda extra
  está onde o tratamento foi entregue.
- **Ressalva honesta de força estatística:** com n=130 no grupo tratado, o DiD de −9,6pp
  tem p ≈ 0,08. Isso **não** é evidência conclusiva de que a abertura segmentada piora
  a resposta. Mas é o oposto de evidência de melhora — e o experimento foi declarado
  validado com base num número que não existia.
- Além disso, o teste **nunca testou o que dizia testar**: pizzaria (1 dos 3 nichos)
  recebeu a abertura genérica o tempo todo, e o grupo de controle trocou de abertura
  no meio do experimento.

**Situação correta do EXP-19: INCONCLUSIVO, com estimativa pontual negativa.** Não é
"validada", e também não é "refutada com confiança" — a execução não permite nenhuma
das duas.

---

## 7. O que fazer antes de expandir para mais nichos

O próximo passo registrado é **expandir para mais nichos**. Isso amplificaria um erro.

1. **Congelar a expansão.** Não há resultado positivo para escalar.
2. **Corrigir o baseline registrado.** O baseline válido para "resposta à 1ª mensagem"
   é o do universo contactado (`tier IN ('4','5')`): **70,8% (def. A) / 76,7% (def. B)**
   para os 3 nichos em maio. Aposentar o 32,6% — ele mede outra população.
3. **Padronizar UMA definição de "respondeu" e escrevê-la no plano do experimento.**
   Recomendo a **definição A**, que é a única que garante que o lead recebeu a abertura
   antes de contar como resposta. A definição B infla a taxa com leads inbound que
   escreveram primeiro.
4. **Proibir `tier > '3'` como universo de métrica de resposta.** Usar
   `tier IN ('4','5')` ou, a partir de 06/06, `usuario = 'clara'`. Onde `tier > '3'`
   for necessário, o denominador tem que ser "recebeu abertura", não "existe".
5. **Corrigir a instrumentação antes de rodar de novo** — sem isso nenhum re-teste é
   legível:
   - gravar `leads.abertura_variante` (hoje NULL para todos);
   - confirmar que o template de **pizzaria** está ativo e sendo entregue;
   - congelar a abertura do **grupo de controle** durante o teste.
6. **Re-rodar como A/B concorrente, não pré/pós.** Sortear a variante dentro do mesmo
   nicho e no mesmo período elimina de uma vez a queda sazonal, a virada de roteamento
   e a troca de abertura do controle — nenhum desses precisaria de DiD.
7. **Dimensionar a amostra.** Para detectar ±5pp sobre uma base de ~57% com 80% de
   poder são necessários ~1.500 leads por braço. A janela atual teve 130.

---

## Notas de acesso

- Todos os números vieram de query executada no Supabase via MCP (`execute_sql`).
  Nenhum valor deste documento é estimado.
- Regex ASCII-safe em todas as consultas; normalização de acento do `segmento` via
  `translate()` (o campo vem Capitalizado e com acento: `Pizzaria`, `Hamburgueria`).
- Não verifiquei: dados de agendamento por data de confirmação na `conversa` (usei
  `data_agendamento`, suficiente para mostrar que a guarda é não-conclusiva com n=4);
  e o desempenho dos nichos após 23/06, contaminado pela virada de roteamento.
