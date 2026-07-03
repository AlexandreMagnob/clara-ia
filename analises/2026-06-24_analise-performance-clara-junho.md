# Análise de Performance — Clara IA (junho/2026)

**Data:** 2026-06-24

O Gerardo levantou que a Clara IA caiu bastante em junho — algo como "24 clientes e 49 agendamentos" contra "31 clientes e 104 agendamentos" no período anterior. A gente foi atrás de entender o porquê, puxando os dados no Supabase, no Pipedrive e no dashboard de engajamento. Este documento resume o que encontramos.

A conclusão curta é: **a Clara não está fechando pior. O problema está no topo do funil** — está entrando menos lead bom e esse lead está respondendo muito menos à primeira mensagem. Quando o lead responde, a Clara converte praticamente igual a maio.

---

## O resumo

- **Entrou menos lead bom.** Os leads tier 4/5 (que são o público da Clara) caíram **18%** de maio para junho (2.046 → 1.668, no recorte de 01 a 22).
- **A resposta à primeira mensagem despencou.** Nesse mesmo público, a taxa de resposta caiu de **~78% para ~56%**. O lead está recebendo a mensagem e **ignorando**.
- **A Clara em si não piorou.** Entre os que respondem, o agendamento por respondente foi de **4,9% para 4,1%** — praticamente o mesmo.

Em uma frase: *a Clara recebeu 18% menos leads tier 4/5, e a resposta à primeira mensagem caiu de ~78% para ~56%. Com quem responde, ela converte igual. O furo é o topo do funil — volume e intenção do lead que entra —, não a Clara.*

---

## 1. A comparação justa: a Clara no terreno dela (tier 4/5)

A Clara recebe tier 4/5. Na janela que analisamos (01 a 22), esse público ia praticamente 100% pra ela, então dá pra comparar maio com junho de forma limpa.

*(Fonte: Supabase `leads`, `tier in (4,5)`, agendamento por `data_agendamento`, dias 01–22.)*

| Métrica | Maio (t4/5) | Junho (t4/5) | |
|---|---|---|---|
| Leads tier 4/5 | 2.046 | 1.668 | 🔻 −18% |
| Taxa de resposta (1ª msg) | **77,6%** | **55,7%** | 🔻 −22 pontos |
| Agendaram | 78 | 38 | 🔻 −51% |
| Agendamento / leads | 3,81% | 2,28% | 🔻 |
| **Agendamento / respondente** | **4,91%** | **4,09%** | ➖ quase igual |

O agendamento caiu pela metade (78 → 38), mas isso veio de **(a)** 18% menos lead e **(b)** o tombo na resposta — e **não** de a Clara converter pior. A última linha é a chave: quem responde, ela agenda na mesma proporção de maio.

---

## 2. O furo real: o lead está ignorando a abertura

Esse é o dado mais importante. O dashboard de engajamento mostra que o problema não é técnico — é o lead não respondendo mesmo.

*(Fonte: dashboard "Engajamento dos Leads", maio vs junho.)*

| | Maio | Junho |
|---|---|---|
| Com resposta | 550 (47%) | 246 (28%) |
| **Ignorado pelo lead** | 201 (17%) | **450 (51%)** 🔺 |
| Possível falha (técnica) | 417 (36%) | 190 (21%) 🔻 |

Repara em duas coisas:

- **Não é falha técnica.** A fatia de "possível falha" (mensagem que não entrega / erro de envio) **caiu** de 36% para 21%. A mensagem está chegando até melhor do que em maio.
- **É o lead ignorando.** A fatia de "ignorado pelo lead" **triplicou**, de 17% para 51%.

Ou seja: a mensagem chega, o lead vê e não responde. Isso é cara de **lead mais frio / com menos intenção** chegando, não de bug ou de problema de entrega.

---

## 3. A pista mais forte: a fonte do lead mudou

Quando a gente olha de onde vêm os leads da Clara em junho, aparece uma campanha de mídia que cresceu muito e provavelmente está puxando a qualidade pra baixo.

*(Fonte: Supabase `leads`, `usuario='clara'`, UTMs, 17–23/06.)*

- Uma campanha de **teste de criativos** otimizada por **clique** (`[C4] - [Q2/26] - [SQL/CBO] - TESTE DE CRIATIVOS [CLIQUE 7D]`) vem crescendo dia a dia: de 7 para 21 leads/dia, já representando **~23% dos leads da Clara**.
- Campanha otimizada por **clique** (e não por conversão) costuma trazer gente mais fria, que clica mas não tem intenção real. Isso bate certinho com o salto do "ignorado pelo lead".

Essa é a primeira coisa que eu investigaria do lado de mídia.

---

## 4. Onde a Clara ainda vaza (secundário, mas dá pra melhorar)

Lendo as conversas da Clara em junho (leads que conversaram bastante mas não agendaram), aparecem alguns padrões que valem ajuste:

*(Fonte: leitura de conversas `usuario='clara'`, junho, conversas com 12+ mensagens sem agendamento.)*

- **Trava na hora de escolher o horário.** O lead já tinha horário definido, e a Clara fica em follow-up repetindo a pergunta sem fechar (ex.: Luana, Poliana). É perda evitável.
- **Buraco na base de conhecimento.** Quando aparece uma dúvida que não está na base, a Clara estanca esperando humano ("não apareceu na minha base, já pedi confirmação") — ex.: Mayco, Araras.
- **Lead com timing futuro.** Quem tem previsão acima de 30 dias (ex.: Jessica, "setembro") — aí ela corretamente não qualifica.
- **Conversas longas demais.** Alguns casos com verbosidade exagerada (ex.: Nivaldo, 191 mensagens) sem chegar a lugar nenhum.

---

## 5. Como o roteamento está funcionando hoje

Vale alinhar isso porque muda o que cada um recebe — e impacta direto o número da Clara daqui pra frente.

*(Fonte: Supabase `leads`, tier × usuario.)*

- **Tier 1 e 2 → 100% SDR.**
- **Tier 3 → maioria SDR.** A Clara recebe só uma fatia pequena (~8%).
- **Tier 4 e 5 → agora dividido entre Clara e SDR.** Até 22/06 ia praticamente tudo pra Clara; **a partir de 23/06 passou a seguir um rateio de ~3 para a Clara e 2 para o SDR** (a cada 5 leads). Dá pra ver na virada:

| Dia | Tier 4/5 → Clara | Tier 4/5 → SDR |
|---|---|---|
| 16–22/06 | 55–88/dia | 0–1 |
| 23/06 | 82 | 23 |
| 24/06 | 56 | 25 |

Importante: como o tier 4/5 agora também vai pro SDR, a **contagem de leads da Clara tende a cair ainda mais** nos próximos dias — não porque a Clara piorou, mas porque está recebendo menos lead por desenho. Isso precisa ser levado em conta na hora de comparar os números.

---

## 6. Conclusões

1. **A Clara não está fechando pior.** Entre os que respondem, a conversão é praticamente a mesma (4,9% → 4,1%).
2. **A queda é de topo de funil:** 18% menos lead tier 4/5, e a resposta à primeira mensagem caindo de ~78% para ~56%.
3. **O lead está ignorando a abertura**, e não é problema técnico — é lead mais frio, provavelmente vindo da campanha de clique.
4. **Os testes (DeepSeek e abertura nichada) não explicam a queda** — ela já vinha de antes deles entrarem.

---

## 7. Próximos passos

- **Mídia:** comparar a taxa de resposta da campanha `CLIQUE 7D` com as campanhas de conversão. Se confirmar que ela traz lead frio, ajustar a otimização (de clique para conversão) ou o público.
- **Volume:** investigar por que entrou 18% menos lead tier 4/5 — é menos verba/alcance ou mudança na forma de classificar o tier?
- **Clara (quick wins):** fechar o loop de escolha de horário (não deixar lead que já escolheu o horário sem agendar) e tapar os buracos de base de conhecimento mais comuns.
- **Acompanhamento:** com o tier 4/5 passando a ir pro SDR (23/06), monitorar o impacto disso no volume da Clara pra não confundir com queda de performance.

---

*Fontes: Supabase (projeto CW - Comercial, tabela `leads`), Pipedrive (pipeline 2) e dashboard "Engajamento dos Leads". Todos os recortes de data em horário de Brasília. Junho é mês parcial (até dia 22–24) — leads recentes ainda podem responder/agendar, então o número de junho tende a melhorar um pouco conforme amadurece.*
