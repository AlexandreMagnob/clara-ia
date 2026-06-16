---
name: pos-mortem-experimento
description: Use sempre que um experimento da Máquina de Hipóteses do Growth atingiu o status "Em análise" — rodou o tempo mínimo e a amostra mínima e está pronto pra ser documentado. Conduz uma entrevista estruturada (aceita áudio) com o responsável e devolve a página completa de pós-mortem em markdown, pronta pra colar no Confluence. Use também quando o responsável só disser "terminei o experimento X", "quero documentar o resultado de Y" ou "preciso fechar o EXP-XX".
---

# Pós-mortem de Experimento — Máquina de Hipóteses (Growth CW)

Esta skill conduz o responsável por um experimento concluído através de uma entrevista estruturada e devolve o **pós-mortem rico** em markdown, pronto pra colar como página no Confluence.

Quem usa: o responsável pelo experimento, no momento em que o status na planilha vira "Em análise". Geralmente perfil Júnior — escreva o output e as perguntas pensando nisso.

Contexto completo do processo: [processo.md](../../../projetos/maquina-de-hipoteses/processo.md).

## Por que existe

Documentar bem cada experimento é o que separa um time que aprende de um que só testa. Sem registro, learnings somem e o trimestre seguinte refaz os mesmos testes. Mas escrever doc rico do zero é gargalo num time Júnior — fácil virar 1-3h por experimento, sufocando o capacity.

Esta skill resolve a equação: o responsável só responde perguntas (por áudio, se quiser), e ela faz a redação. O humano revisa, ajusta o que estiver torto, e cola no Confluence.

## Conceitos rápidos

- **Hipótese** — a crença sobre o lead/funil: *"Acreditamos que X — sinal: Y."*
- **Experimento** — o teste concreto da consequência da crença.
- **Predição** — o que se esperava ver se a hipótese fosse verdadeira.
- **Métrica primária** — o número que diz se funcionou.
- **Métrica de guarda** — o número que NÃO PODIA piorar.
- **Setor** — Comercial (ex-SQL) / Parceria (ex-CQL) / G&G (ex-TQL).

## Fluxo

### 1. Pegue o experimento

Pergunte qual experimento está sendo documentado (ID tipo "EXP-01" ou nome curto). Peça que o responsável traga:
- A **descrição da história do usuário no Jira** (que tem hipótese, predição, desenho do experimento) — copia e cola serve.
- A **linha da planilha** com os números do experimento (ID, Sprint, Setor, Nome, Métrica, Baseline, valores diários, datas).

Se ele não souber onde puxar, pergunte os campos diretamente — não trave. Aceite o que tiver.

### 2. Conduza a entrevista

Faça as 9 perguntas abaixo. Pode ser em bloco (mandar todas e deixar ele responder de uma vez por áudio) ou uma por vez — escolha o que parecer menos cansativo pro responsável. Espere áudio bagunçado e respostas misturadas — é normal. Identifique o que já foi respondido em cada turno e pergunte só o que faltou.

**As 9 perguntas:**

1. Qual era a hipótese e o sinal que a sustentava? *(pode já vir da história do Jira — confirme)*
2. O que motivou rodar esse experimento? Era um gap de OKR, um dado observado, um benchmark, um insight de brainstorm?
3. Qual era a predição? O que você esperava ver se a hipótese fosse verdadeira?
4. Como o experimento foi desenhado? Variante testada, métrica primária, métrica de guarda, período.
5. Quanto tempo rodou e qual foi a amostra final (volume de leads, impressões, sessões)?
6. O resultado foi **Validada**, **Refutada** ou **Inconclusiva**? Como ficaram a métrica primária e a de guarda contra o baseline?
7. O que esse resultado te ensina sobre o cliente, sobre o funil, ou sobre o processo da CW?
8. Tem alguma hipótese alternativa que poderia explicar o resultado? (ex.: sazonalidade, mudança paralela em outra campanha, mudança no mix de canais...)
9. Próximo passo: virar mudança permanente, gerar um novo experimento pra refinar, ou engavetar?

**Quando insistir um pouco:** se a pergunta 7 (aprendizado) ou 8 (hipóteses alternativas) vier rasa, faça uma pergunta de follow-up. Os números da planilha são fáceis de copiar — a análise é o que escapa se não for puxada agora.

**Quando não insistir:** se o responsável claramente não souber alguma coisa (ex.: amostra exata não foi medida), aceita e marca como `(a confirmar)` no doc. Lacuna marcada é melhor que invenção.

### 3. Monte o pós-mortem

Use o template abaixo. Mantenha exatamente esta estrutura — o time vai ler vários desses, padrão ajuda.

## Formato da saída

````markdown
# Pós-mortem — [Nome curto do experimento]

**ID:** EXP-XX · **Sprint:** SM-XX · **Setor:** [Comercial / Parceria / G&G] · **Status:** Concluída · **Resultado:** [Validada / Refutada / Inconclusiva]

**Links:** [História no Jira](URL) · [Linha na planilha](URL)

## Hipótese
Acreditamos que [crença sobre o cliente/funil] — sinal: [evidência que sustentava].

## O que motivou
[Contexto: gap de OKR, dado observado, benchmark, insight de brainstorm. 1-3 frases.]

## Predição
Se a hipótese fosse verdadeira, então [resultado esperado].

## Desenho do experimento
- **Variante testada:** [o que foi mudado em relação ao estado atual]
- **Métrica primária:** [nome] · Baseline: [valor]
- **Métrica de guarda:** [nome] · Baseline: [valor]
- **Período:** [data início] → [data fim] ([N] dias corridos)
- **Amostra:** [volume final]

## Resultados

### Métrica primária — [nome]
- Baseline: [valor]
- Resultado observado: [valor]
- Variação: [+X% / -Y% / ±]

### Métrica de guarda — [nome]
- Baseline: [valor]
- Resultado observado: [valor]
- Movimento: [estável / piorou / melhorou]

## Análise — por que deu nisso
[Narrativa conectando a hipótese ao resultado. O que explica o que vimos? Que hipóteses alternativas poderiam estar em jogo (sazonalidade, mudança paralela, etc.)? Quão robusto é o resultado? 2-4 parágrafos.]

## Aprendizado
[Síntese direta — o que esse experimento ensina sobre o lead/funil/processo da CW. Pense em quem vai ler isso 3 meses depois procurando "o que já tentamos sobre X". 1-2 parágrafos.]

## Próximos passos
- [ ] [Ação concreta — mudança permanente, novo experimento, ou engavetar. Uma linha por ação.]

---
*Pós-mortem gerado em [data] · responsável: [nome].*
````

## Regras de bom senso

- **Não invente.** Lacuna marcada como `(a confirmar)` é melhor que dado inventado.
- **Validada com ressalvas continua Validada.** O resultado é categórico (Validada / Refutada / Inconclusiva); nuance vai pra "Análise".
- **Áudio bagunçado é o caso normal.** Espere 2 minutos de áudio cobrindo 3 perguntas misturadas, com repetições. Identifique o que foi respondido, registre, pergunte só o que falta.
- **Análise > Números.** Os números da planilha são fáceis de copiar. A análise (porquê e hipóteses alternativas) é o que escapa se não for puxada agora. Insista um pouco aqui se vier raso.
- **Aprendizado pensa no leitor futuro.** Quem vai ler isso é alguém daqui a 3 meses procurando "o que já tentamos sobre X". Escreva nessa direção — não pro responsável atual.
- **Não vai ser perfeito na 1ª passada.** É um rascunho rico. O responsável revisa e ajusta antes de colar no Confluence. Tudo bem.

## Exemplo curto

**Entrada (responsável, dita por áudio):**

> *"Cara, EXP-02 do CQL, criativo sóbrio. Rodou de 14 a 21 de maio, 7 dias. CPL caiu de R$ 50 (baseline) pra R$ 43. Taxa de qualificação ficou estável em 65%. Validada. O motivo é o que a gente imaginou — gestor mais qualificado clicou mais. Próximo passo é deixar o criativo sóbrio como padrão e testar variação dele pra B2B local."*

**Saída resumida (após a skill fazer as perguntas que faltaram):**

```markdown
# Pós-mortem — Criativo sóbrio CQL

**ID:** EXP-02 · **Sprint:** SM-26 · **Setor:** Parceria · **Status:** Concluída · **Resultado:** Validada

## Hipótese
Acreditamos que o gestor de tráfego qualificado ignora nosso anúncio de CQL porque o criativo tem aparência amadora — sinal: parceiros vindos das campanhas têm perfil iniciante e CPL acima do alvo.

## Desenho do experimento
- **Variante testada:** novo criativo com visual sóbrio/corporativo contra o criativo atual.
- **Métrica primária:** CPL Meta Ads · Baseline: R$ 50
- **Métrica de guarda:** Taxa de qualificação · Baseline: 65%
- **Período:** 14/05/2026 → 21/05/2026 (7 dias)

## Resultados
- **CPL Meta Ads:** R$ 50 → R$ 43 (−14%)
- **Taxa de qualificação:** 65% → 65% (estável)

## Aprendizado
Aparência do criativo é, sim, um filtro de qualificação antes do clique no CQL. Visual amador atraía gestor iniciante; visual sóbrio atrai perfil mais qualificado sem perder volume. Replicar essa lógica em outros pontos de contato com gestor (LP, e-mail) provavelmente paga.

## Próximos passos
- [ ] Promover o criativo sóbrio a padrão da campanha de CQL
- [ ] Desenhar variação do sóbrio mirando B2B local (próxima sprint)
```

(O exemplo está abreviado — o output real cobre todas as seções do template.)
