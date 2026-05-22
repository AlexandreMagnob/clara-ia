# Análise de Falhas Conversacionais da Clara IA

**Data:** 2026-05-15
**Base:** 1.407 leads não agendados (tier 4+5, date_created > 14/04/2026, count_messages > 14)
**Metodologia:** Parsing de todas as linhas `Comercial:` / `Lead :` do campo `conversa` + detecção de 4 sinais de falha por lead

## Sinais de Falha Detectados

| Sinal | Critério | Ocorrências |
|---|---|---|
| **A** — Confusão explícita | Lead disse "não entendi", "como assim", "me explica", etc. | 84 |
| **B** — Pergunta repetida | Mesmo tópico aparece em 2+ mensagens do lead, separadas por resposta da Clara | 616 |
| **C** — Abandono após a Clara | Última mensagem é da Clara, lead em triagem/abertura e não respondeu | 464 |

**Total de leads com pelo menos 1 sinal:** 699 (49,7% dos 1.407)

---

## Tabela Resumo de Falhas

| # | Categoria | Leads afetados | % dos não agendados | Gravidade |
|---|---|---|---|---|
| 1 | Preço: notação "R$X/mês (anual)" causa confusão sistemática | 265 | 18,8% | CRÍTICA |
| 2 | Clara adia resposta com "vou verificar" em vez de responder | ~75 | 5,3% | ALTA |
| 3 | Bug: Clara conversa com bot do WhatsApp do lead | ~20+ | ~1,5% | CRÍTICA |
| 4 | Funcionalidades: lista preços dos módulos sem explicar o que fazem | 22 | 1,6% | ALTA |
| 5 | Follow-ups desconexos: lead sente que a Clara não leu a conversa | ~340 | 24,2% | ALTA |
| 6 | Clara encerra cedo demais leads de timing longo | ~100 | ~7% | MÉDIA |
| 7 | Concorrente: Clara valida preço menor sem apresentar o diferencial | ~14 | 1% | MÉDIA |
| 8 | Hardware: balança PDV sem resposta na base de conhecimento | 5 | 0,4% | MÉDIA |

---

## Falha 1 — Preço: "R$179,99/mês (anual)" Causa Confusão Sistemática

**Leads afetados:** 265 (18,8%)
**Sinal predominante:** A (confusão explícita) + B (pergunta repetida)

### O que aconteceu — exchange real

**Clara disse:**
> *"O Plano Delivery começa em R$179,99/mês (anual) e pode chegar até R$524,94 com módulos extras. Esse valor cabe no seu orçamento?"*

**Lead respondeu:**
> *"não entendi, esse valor é mensal para uma contratação anual?"*

**Clara "resolveu" dizendo:**
> *"Exatamente! É R$179,99/mês no plano anual — você pode pagar à vista ou parcelar em até 12x no cartão sem juros. Esse valor cabe no seu orçamento?"*

**E-mail para validação:** `fcorteleti02@gmail.com` (Confeitaria, qualificacao)

---

**Outro exchange — confusão de planos:**

**Lead:**
> *"Isso eu entendi, o que eu não entendi é 179,90, 180 no caso, barra mês, no anual com módulos extra, 505,24, é isso que eu não entendi."*

**E-mail:** `denicetata@icloud.com` (Lanchonete, qualificacao)

---

**Outro exchange — confusão com modelo de cobrança do concorrente:**

**Lead:**
> *"Por causa desse valor de R$ 239,00 eu teria que pagar já as 12 parcelas de uma vez só, é? Eu achei que todo mês eu teria que pagar R$ 239,99, não é assim não?"*
> *(e depois)* *"Esse plano de R$ 179,99 não serviria não para mim?"*

**E-mail:** `mariasilvalucia95@gmail.com` (Açaiteria, triagem)

### Por que a Clara falhou

A expressão `R$179,99/mês (anual)` é estruturalmente ambígua. O lead lê como "pago R$179,99 todo mês, em um contrato anual" — o que seria R$2.159,88/ano. Clara confirma dizendo "Exatamente!" e depois explica que dá pra parcelar em 12x, o que só aprofunda a confusão: agora o lead não sabe se as "12x" são o parcelamento do ano ou uma mensalidade renovável.

Além disso, Clara segue imediatamente com "esse valor cabe no seu orçamento?" — o que força o lead a tomar uma decisão sobre um número que ainda não entendeu. Isso gera resistência em vez de avanço.

### Como Clara deveria ter respondido

> *"Deixa eu te explicar direto: o plano é pago uma vez por ano — o valor total é R$2.159,88. Mas você não precisa pagar tudo de uma vez: você parcela em até 12x de R$179,99 no seu cartão, sem juros. É como comprar um produto parcelado — não chega boleto todo mês, você paga no cartão como qualquer outra compra parcelada. Fez sentido?"*

**Regra:** Ancorar sempre o **valor anual total primeiro** (R$2.159,88), depois apresentar o parcelamento como facilidade. Nunca dizer "R$X/mês" sem antes estabelecer que é anual.

---

## Falha 2 — Clara Adia com "Vou Verificar" em Vez de Responder

**Leads afetados:** ~75 (5,3%) — concentrado em perguntas sobre iFood/CNPJ/gateway
**Sinal predominante:** B (lead repete a pergunta ou abandona após o "vou verificar")

### O que aconteceu — exchange real

**Lead perguntou:**
> *"o cardápio de vocês precisa ter CNPJ ou não precisa? É só pelo CPF? Como é que é? Me explica aí."*

**Clara respondeu:**
> *"Rubem, pelo que confirmei aqui, eu não tenho uma informação segura sobre exigência de CPF/CNPJ para te responder com precisão agora. Pra não te passar nada errado, vou verificar isso certinho e te retorno em seguida, tudo bem?"*

**Lead respondeu (continuando a tentar):**
> *"Então, mas é o que eu tô te falando, teria como a gente ver como é que funciona? Você teria como deixar um pouquinho mais claro? Porque eu entendendo, eu creio que meu cliente vai entender."*

**E-mail:** `rubangourmet@gmail.com` (Restaurante, triagem)

### Por que a Clara falhou

"Vou verificar e te retorno" raramente acontece — ou quando acontece, o lead já não responde. Clara admite ignorância sem oferecer uma saída útil imediata. O lead fica em espera e eventualmente abandona.

Este padrão aparece principalmente para perguntas sobre:
- CNPJ obrigatório para ativar iFood
- Qual gateway/banco aceita para recebimento
- Como funciona a Entrega Fácil exatamente

Todas essas informações deveriam estar na base RAG.

### Como Clara deveria ter respondido

**Opção A (se a informação for adicionada ao RAG):** Responder diretamente com a informação correta.

**Opção B (enquanto a RAG não é atualizada):**
> *"Boa pergunta, Rubem — essa parte de CNPJ e iFood tem uns detalhes que variam por tipo de conta. É exatamente esse tipo de pergunta que nosso especialista responde na demo em 5 minutos, mostrando na prática. Vale a pena uma reunião de 30 min só pra isso não ficar em aberto. Tenho horário hoje às 15h ou amanhã às 10h — qual fica melhor?"*

**Regra:** Nunca deixar uma pergunta em aberto com "vou verificar". Se não sabe a resposta, redirecionar para a reunião com um argumento de valor direto, não genérico.

---

## Falha 3 — Bug Crítico: Clara Conversa com Bot do WhatsApp do Lead

**Leads afetados:** ~20+ (identificados visualmente)
**Sinal:** A (confusão explícita de role) — mas o "lead" que responde é o bot, não a pessoa

### O que aconteceu — exchange real

**Clara enviou uma mensagem de follow-up ao lead**

**"Lead" respondeu (mas era o bot do WhatsApp Business do restaurante):**
> *"Olá! Ainda não entendi bem o que você precisa. Você gostaria de saber sobre nosso cardápio, horário de funcionamento ou alguma promoção especial do Hrouze Burguer?"*

**Clara interpretou como resposta do lead e continuou:**
*(estruturou a conversa como se o lead tivesse respondido)*

**E-mail:** `hrauzeburguer@gmail.com` (Hamburgueria, apresentacao)

---

**Outro caso:**

**"Lead" respondeu:**
> *"Não entendi sua solicitação. Posso ajudar com informações sobre Delícias da Ju?"*

**E-mail:** `maxfunilaria82@gmail.com` (Outro, apresentacao)

### Por que é crítico

Alguns leads têm seu próprio bot do WhatsApp Business ativo (chatbot ou resposta automática). Quando Clara envia mensagem, o bot do lead responde automaticamente. Clara processa essa resposta como se fosse o humano e continua a conversa — mas está falando com outro bot, não com a pessoa. O lead real nunca vê a conversa e nunca é abordado de verdade.

Padrão identificável no bot do lead:
- Inicia com saudação formal ("Olá!", "Bem-vindo(a) a X")
- Oferece menu de opções ("Você gostaria de saber sobre... horários / cardápio / promoções")
- Inclui o nome do restaurante ou "Como podemos ajudar?"

### Ação necessária no N8N

Adicionar um nó de **detecção de bot** antes de processar a resposta do lead:
- Se a mensagem do lead contém padrão `(Olá|Bem-vindo|agradece seu contato).*(horário|cardápio|Como posso ajudar)` → marcar como `bot_response = true` → parar o fluxo e sinalizar para revisão humana
- Ou: verificar se o lead já tem `etapa_conversa = 'apresentacao'` com muitas mensagens — isso pode ser sinal de loop bot×bot

---

## Falha 4 — Funcionalidades: Lista Preços Sem Explicar o que os Módulos Fazem

**Leads afetados:** 22 (1,6%)
**Sinal predominante:** A (confusão explícita após a explicação de módulos)

### O que aconteceu — exchange real

**Lead perguntou:**
> *"Pode me explicar esses módulos extras?"*

**Clara respondeu:**
> *"Claro! São módulos opcionais que você adiciona conforme a necessidade:"*
> *"• 💰 Financeiro: R$69,99"*
> *(+ lista de outros módulos com preço)*

**Lead continuou confuso** (ver conversa de `juliaceli.melo@gmail.com`)

**E-mail:** `juliaceli.melo@gmail.com` (Outro, qualificacao)

---

**Outro exchange:**

**Lead:**
> *"Essa gestão de pedidos aí seria o que? A interação do cliente com o delivery? [...] Eu consigo ter nessa plataforma de vocês fechamento de caixa, abertura de caixa, esse tipo de auxílio? Ou não?"*

**E-mail:** `juliana.silvadpm@gmail.com` (Hamburgueria, triagem)

### Por que a Clara falhou

A resposta "• 💰 Financeiro: R$69,99" é inútil para quem perguntou o que o módulo FAZ. Clara listou o nome e o preço, mas não explicou o valor: o que o módulo faz, qual problema resolve, para quem é indicado. O lead fica com uma lista de preços mas sem entender o que está comprando.

### Como Clara deveria ter respondido

> *"Os módulos extras são funcionalidades que você adiciona conforme sua operação crescer. Os mais comuns:*
> *• Financeiro (R$69,99): fluxo de caixa, relatório de vendas, controle de entradas e saídas — pra saber quanto entrou, saiu e qual item mais vendeu.*
> *• Entregadores (já incluso no Delivery): gerencia quem faz suas entregas.*
> *• Fidelidade: programa de pontos pra fidelizar clientes.*
> *Qual desses faria mais diferença pra você agora?"*

**Regra:** Para cada módulo mencionado: nome + o que faz em 1 frase + para quem é indicado. Nunca apenas nome + preço.

---

## Falha 5 — Follow-ups Desconexos: Lead Sente que a Clara "Não Leu" a Conversa

**Leads afetados:** ~340 (24,2%) — maior categoria, mas inclui muitos casos de Sinal C (abandono)
**Sinal predominante:** A (confusão explícita sobre o comportamento da Clara) + C (abandono)

### O que aconteceu — exchange real

**Clara enviou mensagens de follow-up:**
> *"Kaku, passando só para dar continuidade: conseguiu comparar com calma e ver se o plano Delivery faz sentido para a nova operação?"*
> *"Kaku, fiquei curiosa: depois de comparar, o que mais pesou pra você decidir se o Delivery faz sentido nessa nova operação?"*

**Lead respondeu:**
> *"Eu não sei se você é bot ou se você é uma pessoa mandando a mensagem mesmo, mas você leu a conversa ali, ficou claro tudo que eu tô fazendo ou não? Não tô entendendo, você mandou umas perguntas meio desconexas, eu quero entender a diferença disso pra anotar aí. Enquanto eu não entender, não faz diferença."*

**E-mail:** `caveonthegrill@gmail.com` (Açaiteria, qualificacao)

---

**Outro case — lead irritado com múltiplas pessoas da mesma empresa:**

**Lead:**
> *"Na verdade, é o único WhatsApp, é a quantidade de pessoas que falam que teve uma hora que eu disse, não, não, não tem mais condição não estou repetindo a mesma coisa para duas, três, dez pessoas"*

**E-mail:** `wqdesignerjp@gmail.com` (Confeitaria, triagem)

### Por que a Clara falhou

Os follow-ups da Clara são scripts genéricos que **não referenciam o contexto da conversa anterior**. O lead recebe mensagens como "o que mais pesou na sua decisão?" sem que Clara mencione o que foi discutido — parece que ela "esqueceu" tudo. Isso é um sinal forte de IA para o lead.

O segundo caso mostra o problema do atendimento duplicado: múltiplos contatos do Cardápio Web chegando ao mesmo lead por canais diferentes.

### Como Clara deveria agir nos follow-ups

**Regra:** Cada follow-up deve começar com uma referência específica ao que foi dito na última conversa:

> *"Kaku, você mencionou que queria entender a diferença entre usar o Cardápio Web e continuar no iFood para as entregas. Conseguiu pensar nisso?"*

Em vez de:
> *"Kaku, fiquei curiosa: depois de comparar, o que mais pesou pra você?"*

A referência ao contexto é o que diferencia uma IA bem-ajustada de um bot genérico.

---

## Falha 6 — Clara Encerra Cedo Demais Leads de Timing Longo

**Leads afetados:** ~100 (7%)
**Sinal predominante:** C (abandono após mensagem de encerramento da Clara)

### O que aconteceu — exchange real

**Lead disse:**
> *"Deixa eu te fazer outra pergunta, eu tenho celular, quem tem computador é meu filho... eu quero começar logo, sabe, eu não quero ficar esperando muito tempo, eu só tenho, eu já fiz o meu CNPJ, eu só falta pagar ele para ele ficar ativo."*

**Clara respondeu:**
> *"Boa notícia, Arlete! Não precisa comprar impressora não 😊"*

*(Conversa encerrou aqui — Clara não fez nenhuma proposta de próximo passo)*

**E-mail:** `arleteaparecidatupi@gmail.com` (Outro, triagem)

### Por que a Clara falhou

O lead sinalizou **intenção de compra iminente** ("quero começar logo") mas ainda tinha uma dúvida técnica sobre impressora. Clara respondeu a dúvida técnica mas não aproveitou o sinal de intenção para propor o próximo passo (reunião). A conversa esfriou por falta de uma proposta clara.

Este padrão se repete com leads que dizem "vou pensar", "preciso organizar antes", "quando estiver pronto entro em contato" — Clara responde "claro, qualquer coisa me chame!" e não agenda nenhum follow-up específico.

### Como Clara deveria ter respondido

> *"Ótimo, Arlete — sem impressora, fica ainda mais simples pra começar. Agora que você já tem o CNPJ sendo ativado, o timing é perfeito. Que tal a gente fazer uma reunião de 30 min com o especialista para você ver o sistema funcionando e já sair com o cardápio configurado? Tenho horário amanhã às 10h ou às 15h — qual fica melhor?"*

**Regra:** Qualquer menção de "quero começar" ou "vou organizar primeiro" deve acionar uma proposta de próximo passo com data concreta, não um "me chame quando estiver pronto".

---

## Falha 7 — Concorrente: Clara Valida o Preço Menor Sem Apresentar o Diferencial

**Leads afetados:** ~14 (1%)
**Sinal predominante:** B (lead menciona o concorrente mas Clara não diferencia)

### O que aconteceu — exchange real

**Clara perguntou:**
> *"O Plano Delivery é R$179,99/mês no plano anual. Esse valor cabe no seu orçamento?"*

**Lead respondeu:**
> *"Bah hoje no diggy eu pago 49,90"*

**Clara respondeu:**
> *"Faz sentido, Patrick!"*

*(Conversa encluiu aqui sem diferenciação)*

**E-mail:** `petriiick1@gmail.com` (Lanchonete, qualificacao)

---

**Outro case:**

**Lead:** *"Até cabe, porém se o anota.ai cumprir o que prometeu ficaria bem mais em conta"*
**Clara:** *"Entendo, Carlos."*

**E-mail:** `carlosilva0320@gmail.com` (Açaiteria, qualificacao)

### Por que a Clara falhou

Clara responde "Faz sentido!" quando o lead cita um preço 3,6x menor. Isso sinaliza ao lead que Clara concorda que ele está pagando mais — sem dar nenhuma razão para pagar mais. O lead sai da conversa com a sensação de que o Cardápio Web é caro e sem diferencial.

O segundo caso é ainda mais grave: o lead diz que o Anota.ai "vai cumprir o que prometeu" — e Clara responde apenas "Entendo". Não há nenhuma tentativa de explicar por que o Cardápio Web vale o preço.

### Como Clara deveria ter respondido

> *"Entendo, Patrick — R$49,90 vs R$179,99 é uma diferença grande à primeira vista. Mas vale você comparar o que vem em cada um: o Diggy no básico entrega só o cardápio digital. No Cardápio Web você já tem robô no WhatsApp respondendo pedidos sozinho, integração com iFood, e relatório de vendas. Muitos clientes percebem que o robô sozinho já compensa a diferença — porque sem ele é você ou alguém da sua equipe respondendo WhatsApp o dia inteiro. Como você faz hoje para atender os pedidos que chegam no WhatsApp?"*

**Regra:** Quando lead mencionar concorrente mais barato: (1) reconhecer a diferença de preço, (2) especificar 2-3 diferenciais concretos, (3) perguntar sobre o custo operacional atual (geralmente manual/humano) para recontextualizar o valor.

---

## Falha 8 — Hardware: Balança PDV Sem Resposta

**Leads afetados:** 5 (0,4% — mas cada um é uma açaiteria que saiu sem resposta)
**Sinal predominante:** B (repetiu a pergunta) → C (abandonou)

### O que aconteceu — exchange real

**Lead perguntou:**
> *"O PDV já tem integração com balança para selfservice?"*

*(Sem resposta satisfatória)*

**Lead disse:**
> *"Integração com balança é um ponto importante para o meu negócio"*
> *"Nao iremos avançar por enquanto"*
> *"Mas obrigado pelo atendimento"*

**E-mail:** `agenciadamlkt@gmail.com` (Açaiteria, triagem)

### Por que a Clara falhou

A base RAG não tem informação sobre integração do PDV com balança. Clara provavelmente respondeu de forma genérica ou remeteu ao especialista, e o lead — que tinha esse como critério decisório — desistiu por falta de resposta direta.

### Ação necessária

Adicionar à base RAG um documento específico sobre o PDV para açaiterias, cobrindo:
- Integração com balança (selfservice por peso)
- Tipos de impressora compatíveis
- Fluxo do pedido em balcão selfservice

Enquanto não estiver na base, a Clara precisa ser instruída a dizer explicitamente: *"Essa integração com balança para selfservice é uma funcionalidade específica do nosso PDV — é exatamente esse detalhe que o especialista vai confirmar na demo, pois depende do modelo da sua balança. Vale 20 minutos de reunião para não tomar a decisão errada por falta de informação."*

---

## Observações Transversais

### Problema estrutural: "R$X/mês (anual)" é a raiz de 18,8% das falhas
A notação é tecnicamente correta mas cognitivamente confusa. Todos os 265 leads que travaram no preço chegaram ao mesmo ponto de confusão pela mesma razão. É o problema mais simples de corrigir e com maior impacto potencial na taxa de conversão.

### Bug crítico: bot-vs-bot
~20+ leads têm chatbots próprios no WhatsApp Business. Clara está conversando com esses bots e nunca alcança o humano. Esse é um problema de arquitetura do N8N, não de script. Precisa de tratamento antes de qualquer otimização de prompt.

### Follow-ups sem contexto afetam 24% dos leads
Os scripts de follow-up genéricos são percebidos como sinal de IA desatenta. O impacto é tanto na confiança (lead desconfia que é bot) quanto na eficácia (lead não responde a perguntas que já respondeu).

### Clara encerra conversas cedo demais
Leads com timing "próximo mas não imediato" (CNPJ sendo ativado, abrindo em 15 dias, esperando equipamento chegar) são descartados pelo BANT quando deveriam receber uma proposta de próximo passo com data. A diferença entre "me chame quando estiver pronto" e "posso te ligar em 10 dias quando o CNPJ ativar?" é enorme em termos de taxa de retorno.

---

*Análise gerada em 2026-05-15 com base em 1.407 leads não agendados (tier 4+5, last 30 days, count_messages > 14)*
*Pipeline: extração via Supabase REST API → parsing Python de turns → detecção de sinais A/B/C → agrupamento por tópico → seleção de exchanges representativos*
