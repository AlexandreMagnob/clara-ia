# EXP-16 — Plano de Implementação (N8N)

**Plano mensal R$209 boleto vs. plano anual parcelado no cartão**

- **Setor:** Comercial · **Sprint:** SM-28 · **ID na planilha:** EXP-16
- **Data do plano:** 2026-06-02
- **Workflow alvo:** `[SDR] Fluxo Agente SDR` (ID: pTmvz1Qc8wQ6v9aD)
- **Status:** 🔵 Planejado — **NÃO implementado no N8N** (este documento é só o passo a passo)

> ⚠️ Este documento descreve **o que mexer** no fluxo. Nenhuma alteração foi feita no N8N. Quem operar o workflow executa manualmente seguindo o checklist no final.

---

## 0. Boleto — RESOLVIDO

✅ **Confirmado pelo Comercial (2026-06-02):** o plano mensal aceita **boleto, Pix e cartão**. A variante pode comunicar "R$209,99/mês no boleto, sem fidelidade" sem risco na call.

> Nota: a [faq-vendas.md:76](../faq-vendas.md#L76) ainda lista só Pix/cartão para a assinatura. Vale atualizar a base de conhecimento para incluir boleto no mensal, senão a Clara pode se contradizer se o lead perguntar a forma de pagamento depois.

**Métricas:** acompanhadas pelo time via **Supabase + Pipedrive** (cobrem agendamento e conversão das reuniões).

---

## 1. Desenho do experimento (preenchendo os gaps)

| Item | Definição |
|---|---|
| **Variante A** | Clara apresenta o **plano mensal R$209,99/mês** (boleto/sem fidelidade) na Etapa 4 (Budget) |
| **Controle** | Comportamento atual: **R$179,99/mês no anual parcelado** (Etapa 4 do prompt v2.9) |
| **Métrica primária** | Taxa de agendamento = `nº leads que agendaram reunião / nº leads que chegaram à Qualificação (Etapa 4)` |
| **Métrica de guarda** | Taxa de conversão das reuniões **acontecidas** (reunião → venda). Não pode cair > 5 pp |
| **Split** | **50/50 aleatório por lead**, fixado na criação do lead e persistido no Supabase |
| **Meta** | +20% relativo na taxa de agendamento, sem queda > 5pp na guarda |

### Baseline (a calibrar)
Antes de ligar, rodar a query da seção 5 sobre os **últimos 30 dias** (todos os leads tier 4–5 que passaram pela Etapa 4) para fixar:
- `p_agendamento_baseline` = taxa de agendamento atual
- `p_conversao_baseline` = taxa de conversão das reuniões acontecidas

Esses dois números entram na planilha do experimento como linha de base. A meta vira `p_agendamento_baseline × 1,20`.

### Tamanho de amostra / duração
- Regra prática: rodar até ter **no mínimo ~200 leads qualificados por braço** (≈400 no total) **ou 3 semanas completas**, o que vier primeiro — para não cortar em meio de semana (viés de dia).
- Recalibrar o N exato depois de fixar `p_agendamento_baseline` (quanto menor a base, maior o N necessário). Fórmula aproximada para detectar lift de 20% relativo com 80% de poder e α=5%: usar uma calculadora de proporções com `p1 = baseline`, `p2 = baseline × 1,20`.

---

## 2. Qual lógica usar: NÃO é o Model Selector do `modelo_llm`

O A/B test atual (`modelo_llm`, Claude vs GPT) usa um nó **`Model Selector`** ([workflow_sdr.json:1845](_pipeline/workflow_sdr.json#L1845)) que alimenta o **mesmo** AI Agent e troca apenas o **modelo de linguagem** conforme o campo `modelo_llm`. Ou seja: **um agente só, um prompt só, troca só o motor.**

Para a EXP-16 o que muda é o **texto** que a Clara fala (preço mensal vs. anual), **não o modelo**. Logo o Model Selector não se aplica. Mas seguimos a **mesma filosofia** (um agente, uma variável decide o comportamento): em vez de trocar o modelo, a variável troca **um trecho do prompt** via injeção no User Prompt.

```
[Get a row]  → traz plano_apresentado (igual já traz modelo_llm)
     ↓
[AI Agent — Clara]   ← MESMO nó de hoje, NÃO duplica
     ├─ Model Selector  → continua decidindo Claude/GPT (modelo_llm) — não mexe
     └─ User Prompt     → injeta a diretriz de preço conforme plano_apresentado  ← ÚNICA mudança
```

Os dois experimentos rodam **em paralelo, no mesmo agente, sem conflito**: `modelo_llm` decide o motor; `plano_apresentado` decide o trecho de preço.

| Opção | Como | Prós | Contras |
|---|---|---|---|
| **B — Prompt único + injeção de variável** ✅ recomendado | Um só AI Agent. O **User Prompt** injeta a diretriz de preço conforme `plano_apresentado` | Mantém **um prompt só**; muda só o trecho de preço; alinhado à filosofia atual | Exige uma linha condicional no User Prompt |
| **A — Switch + nó duplicado** | Switch lê `plano_apresentado` e roteia para 2 nós AI Agent (prompt controle vs. variante) | Isolamento total | Mantém **dois prompts** → risco de drift; mais pesado de manter |

---

## 3. Implementação — passo a passo (manual, no N8N)

### Passo 3.1 — Supabase: nova coluna na tabela `leads`

Adicionar coluna de atribuição do experimento (espelha `modelo_llm`):

```sql
ALTER TABLE leads
  ADD COLUMN plano_apresentado text;  -- valores: 'mensal' | 'anual' | NULL (fora do experimento)
```

> Mantém o experimento auditável e permite a query de medição (seção 5). Não sobrescreve nada existente.

### Passo 3.2 — Atribuição 50/50 (uma vez, na criação do lead)

A atribuição deve acontecer **no mesmo ponto onde o lead é criado/semeado** (mesma etapa onde hoje se define `modelo_llm`), para que o valor seja fixado **uma vez** e nunca mude entre mensagens.

**Onde:** nó `Set`/`Edit Fields` na criação do lead (antes do primeiro insert no Supabase).

**Expressão recomendada (aleatória, fixada na persistência):**
```js
={{ Math.random() < 0.5 ? 'mensal' : 'anual' }}
```
Como o valor é gravado no Supabase e lido depois via `Get a row`, ele permanece estável em todas as mensagens seguintes do mesmo lead. ✅

**Alternativa determinística (se não puder mexer na criação):** derivar do WhatsApp (estável, reproduzível):
```js
={{ Number($json.whatsapp.slice(-1)) % 2 === 0 ? 'mensal' : 'anual' }}
```
Atenção: paridade do último dígito pode ter leve viés; prefira a aleatória se possível.

> **Importante:** só atribuir a leads **tier 4–5** (que vão para a Clara). Tiers 1–3 vão para humano e ficam fora do experimento (`plano_apresentado = NULL`).

### Passo 3.3 — Injetar a diretriz de preço no User Prompt (Opção B)

No nó **AI Agent**, no campo **Text (User Prompt)**, adicionar uma linha nas "Informações do lead" e uma diretriz condicional. Acrescentar ao bloco que hoje termina em `link_reuniao` ([2026-05-26_system-prompt-clara-v2.9.md:251](../prompts/Clara%20IA/2026-05-26_system-prompt-clara-v2.9.md#L251)):

```
plano_apresentado: {{ $('Get a row').item.json.plano_apresentado }}

## Diretriz de apresentação de preço (EXP-16)
- Se plano_apresentado = "mensal": na Etapa 4 (Budget), apresente o PLANO MENSAL: "R$209,99 por mês no boleto, sem fidelidade e sem parcelamento no cartão". NÃO mencione o valor anual cheio.
- Se plano_apresentado = "anual" ou vazio: mantenha o comportamento padrão (R$179,99/mês no plano anual).
```

E ajustar a regra da `base_conhecimento` ([linha 55](../prompts/Clara%20IA/2026-05-26_system-prompt-clara-v2.9.md#L55)) para respeitar a diretriz:
- Trocar "Priorize os valores dos planos anuais" por: "Priorize o plano conforme a diretriz EXP-16 do User Prompt; na ausência dela, priorize o anual."

> Isso muda **só o trecho de preço** da Etapa 4. Toda a mecânica de BANT, escassez, agendamento e guard-rails permanece intacta. **Não alterar** os scripts fixos das Etapas 5 e 6.

### Passo 3.4 — (Se optar pela Opção A) Switch + nó duplicado
Se preferir isolar igual ao `modelo_llm`: clonar o nó AI Agent, criar um Switch após `Get a row` lendo `plano_apresentado`, e apontar cada saída para o nó com o prompt correspondente. Mais trabalhoso de manter — só vale se o Comercial quiser variações maiores que só o preço.

---

## 4. Garantir registro dos eventos para medição

A métrica primária depende de saber **quem foi qualificado** e **quem agendou** por braço. Hoje o fluxo já grava:
- `etapa_conversa` (inclui `agendado`) e `data_agendamento` no Supabase ✅ → cobre **agendamento**.
- "Chegou à Etapa 4 (Qualificação)" **não tem flag explícita**. 

**Recomendação:** gravar um marcador quando o lead atinge o Budget. Opções:
- (leve) usar `count_messages` + presença de menção de preço como proxy — impreciso, evitar.
- (recomendado) adicionar um campo `chegou_qualificacao boolean` setado quando a Clara dispara a fala de Budget. Sem isso, o denominador da métrica primária fica estimado, não medido.

**Métrica de guarda (reunião aconteceu → venda):** esse dado **não está no Supabase da Clara** — vive no CRM do closer (Meetime/Pipedrive/Kommo). Para medir a guarda é preciso **cruzar `plano_apresentado` (Supabase) com o resultado da reunião (CRM)** via WhatsApp/e-mail como chave. Alinhar com quem administra o CRM antes de ligar o experimento.

---

## 5. Medição — queries

**Baseline e leitura do experimento (taxa de agendamento por braço):**
```sql
SELECT
  plano_apresentado,
  COUNT(*) FILTER (WHERE chegou_qualificacao)                        AS qualificados,
  COUNT(*) FILTER (WHERE etapa_conversa = 'agendado')                AS agendados,
  ROUND(
    COUNT(*) FILTER (WHERE etapa_conversa = 'agendado')::numeric
    / NULLIF(COUNT(*) FILTER (WHERE chegou_qualificacao), 0), 4)     AS taxa_agendamento
FROM leads
WHERE plano_apresentado IS NOT NULL
  AND created_at >= '2026-06-XX'   -- data de início do experimento
GROUP BY plano_apresentado;
```

**Métrica de guarda** (após cruzar com o CRM): `reuniões convertidas / reuniões acontecidas`, por braço. Comparar a diferença em pontos percentuais (não pode cair > 5pp na variante).

### Critério de decisão
- **Ganha a variante** se: taxa de agendamento de `mensal` ≥ `controle × 1,20` **E** guarda de `mensal` não cai > 5pp vs. controle, com significância (teste de proporções, p < 0,05).
- **Inconclusivo / mantém controle** se o lift não atingir 20% ou a guarda cair > 5pp.

---

## 6. Rollback
- Setar `plano_apresentado = 'anual'` para todos (ou parar de atribuir na criação) → Clara volta 100% ao comportamento atual.
- Remover a diretriz EXP-16 do User Prompt.
- A coluna `plano_apresentado` pode ficar (histórico) ou ser dropada depois da análise.

---

## 7. Checklist de execução

- [ ] Comercial confirmou se boleto mensal existe (seção 0)
- [ ] `ALTER TABLE leads ADD COLUMN plano_apresentado` aplicado
- [ ] (se faltar) campo `chegou_qualificacao` criado e setado na fala de Budget
- [ ] Atribuição 50/50 adicionada na criação do lead (só tier 4–5)
- [ ] Diretriz EXP-16 injetada no User Prompt + regra da `base_conhecimento` ajustada
- [ ] Baseline rodado (últimos 30 dias) e registrado na planilha EXP-16
- [ ] Cruzamento `plano_apresentado` × CRM definido com o time do closer
- [ ] Data de início registrada; rodar até ~200 qualificados/braço ou 3 semanas
- [ ] Leitura final + decisão (seção 5)
