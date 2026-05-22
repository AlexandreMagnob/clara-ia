# Análise Profunda — Preço, Timing Longo, "Vou Verificar" e Concorrente

**Data:** 2026-05-15  
**Base analisada:** 85 leads com falhas detectadas nessas 4 categorias (tier 4+5, não agendados)  
**Metodologia:** Leitura case a case dos exchanges reais — mínimo 12 leads únicos por categoria  

---

## Sumário Executivo

| Categoria | Cases analisados | Problema central | Prioridade |
|---|---|---|---|
| Preço | 12 leads | Clara re-explica com a mesma notação que causou confusão | CRÍTICA |
| Timing longo | 12 leads | Clara trata timing como obstáculo e encerra; não há nurturing | ALTA |
| "Vou verificar" | 12 leads | Clara desconhece infos básicas do produto e nunca retorna | ALTA |
| Concorrente | 12 leads | 4 falsos positivos; Anota.ai é o alvo real; abandona objec. de preço | MÉDIA |

---

## 1. Preço — "R$179,99/mês (anual)" Quebra a Conversa

### Padrões encontrados nos 12 cases

**Padrão A — Lead pergunta se o valor é mensal ou anual, Clara responde com a mesma notação que gerou a dúvida**

O lead lê "R$179,99/mês (anual)" e não entende se paga R$179,99 todo mês ou se R$179,99 é a conta do ano dividida. A resposta de Clara é repetir a mesma string:

> **Lead** (`denicetata@icloud.com`): *"Isso eu entendi, o que eu não entendi é 179,90, barra mês, no anual com módulos extra, 505,24, é isso que eu não entendi."*
>
> **Clara:** *"R$179,99 por mês é o valor do Plano Delivery no contrato anual. Ou seja, você paga esse valor mensalmente e mantém esse plano por 12 meses."*

A Clara chegou perto, mas não explicou o que acontece se o lead quiser sair antes dos 12 meses, nem qual é o valor total do contrato anual (R$2.159,88). O lead saiu sem agendar.

---

**Padrão B — Lead pergunta o que está incluído no plano de R$179,99; Clara não sabe e adia**

Em 5 dos 12 cases, quando o lead perguntou especificamente o que entra no plano básico, Clara respondeu com "vou confirmar certinho". Isso é produto básico — Clara deveria saber de cor.

> **Lead** (`christianirocha44@gmail.com`): *"esse plano 179,99 o que ele tem e me diz a diferença dele para os outros"*
>
> **Clara:** *"O plano a partir de R$179,99 é o mais básico. Ele inclui as funções principais de cardápio digital e automação no WhatsApp, mas sem todos os módulos avançados. Vou confirmar certinho quais funções exatamente entram no de R$179,99 e o que os outros têm a mais, pra te explicar de forma bem clara, tudo bem?"*

Na próxima mensagem, Clara já estava falando de outra coisa. Nunca confirmou.

---

**Padrão C — Lead pergunta a diferença entre R$179,99 e R$524,94; Clara lista itens sem âncora de valor**

A distância entre R$179,99 e R$524,94 é de R$345/mês. Quando o lead pede a diferença, Clara lista os módulos extras (Financeiro R$69,99, Fiscal R$69,99, etc.) mas não mostra o lead como essa soma chega ao valor total, nem qual módulo faz mais sentido para aquele negócio específico.

> **Lead** (`irisdepontesandradeiris@gmail.com`): *"179.99 por mês? E 524.94, o que são esses módulos extras?"*
>
> **Clara:** *"O Plano Delivery começa em R$179,99/mês (plano anual) e pode chegar a R$524,94 com todos os módulos extras incluídos. Esse valor cabe no seu orçamento?"*

A Clara não respondeu o que são os módulos. Repetiu a mesma frase de apresentação. O lead perguntou de novo: *"Os 179.99 sim, isso inclui tudo o que você me falou?"* — outra conversa dentro da dúvida.

---

**Padrão D — Quando lead diz que o valor está pesado, Clara encerra**

Em vez de explorar o porquê do valor parecer pesado (custo fixo atual, volume de pedidos, sazonalidade) ou mostrar como o sistema paga o próprio investimento, Clara graciosamente se despede.

> **Lead** (`wesleytecbh@hotmail.com`): *"Como já lhe disse esse valor tá muito pra mim que tô começando né você não acha me ajuda aí com um valor bom"*
>
> **Clara:** *"Compreendo, Wesley. Como hoje o valor ainda fica pesado pra você, o mais correto é não te pressionar agora. Vou encerrar por aqui, mas fico à disposição."*

Wesley era Hamburgueria, 127 mensagens trocadas. A Clara capitulou sem tentar um argumento de ROI ou redução de escopo.

---

**Padrão E — Lead está migrando de concorrente, menciona preço menor, Clara não compara**

> **Lead** (`contato.carlospinto@gmail.com`, Restaurante, 468 msgs): *"Atualmente tenho o Anota Aí. Quero pagar menos mensalidade."*
>
> **Clara:** *"Compreendo, Carlos. Então hoje você usa o Anota Aí e está buscando reduzir a mensalidade. Seu atendimento é focado em delivery, salão ou os dois?"*

Clara confirmou o contexto mas não perguntou quanto Carlos paga hoje no Anota Aí para poder comparar diretamente. Perdeu a chance de mostrar que R$179,99 pode ser inferior ao que ele já paga.

---

### Diagnóstico

A raiz do problema é **estrutural na forma como o preço é apresentado**, não apenas no texto da Clara:

1. A notação `R$179,99/mês (anual)` é ambígua por design — diz "por mês" mas sinaliza "anual". Qualquer lead com pouca familiaridade com SaaS vai se confundir.
2. Clara não tem na sua base de conhecimento o **quadro completo de planos com o que cada um inclui**. Ela sabe os valores mas não sabe o conteúdo de cor.
3. Clara não tem script para quando o lead diz que o valor é pesado. Ela não faz perguntas de diagnóstico ("quanto você gasta hoje?", "quantos pedidos por mês?") antes de encerrar.

---

### Reescritas sugeridas

**Ao apresentar preço pela primeira vez:**
> *"O plano Delivery custa R$179,99 por mês — você paga todo mês esse valor durante 12 meses (contrato anual). Quem prefere sem comprometimento anual paga R$209,99 por mês, sem fidelidade. Os módulos extras como Financeiro e Fiscal são opcionais e somam R$69,99 cada. Esse valor mensal de R$179,99 cabe no seu orçamento?"*

**Quando lead pergunta o que está no plano básico:**
> *"O Delivery de R$179,99/mês já inclui: cardápio digital, chatbot WhatsApp, pedidos com Pix/cartão, controle de caixa e balcão, programa de fidelidade e integração com iFood. Não inclui: emissão de notas fiscais e gestão financeira avançada — esses são os módulos extras. Faz sentido para o seu negócio?"*

**Quando lead diz que o valor está pesado:**
> *"Entendo. Me ajuda com uma coisa: hoje você controla os pedidos de que forma? [espera resposta]. E por mês, tem ideia de quantos pedidos recebe? [espera]. Pergunto porque muitos clientes recuperam o investimento do plano no primeiro mês só pela redução de erro de pedido e retrabalho. Se quiser, a gente faz essa conta juntos rapidinho."*

---

## 2. Timing Longo — Clara Não Sabe o Que Fazer com Quem Não Está Pronto

### Padrões encontrados nos 12 cases

**Padrão A — Clara converte qualquer timing em "30 dias?" e força binário**

Quando o lead diz "em breve" ou "mês que vem", Clara faz a pergunta:
> *"Essa previsão de 'mês que vem' pode entrar dentro dos próximos 30 dias. Para confirmar: sua ideia é implementar ainda nos próximos 30 dias?"*

Se o lead diz sim → tenta agendar.  
Se o lead diz não → encerra.

Não existe fluxo intermediário para quem está com timing de 2-6 meses.

> **Lead** (`duartes.cacau@gmail.com`): *"Mês que vem."*
> **Clara:** *"Essa previsão pode entrar dentro dos próximos 30 dias. Para confirmar: sua ideia é implementar nos próximos 30 dias?"*
> **Lead:** *"Sim."*
> **Clara:** *"Antes de te passar os horários disponíveis, preciso ser honesta: nossa agenda é muito concorrida e os horários são disputados."*

O lead disse "sim" para 30 dias mas a Clara não agendou — usou urgência artificial e depois não mostrou horários. Pedro (`duartes.cacau@gmail.com`) não agendou.

---

**Padrão B — Urgência artificial para quem claramente não está pronto**

Usar "nossa agenda é muito concorrida" para alguém que acabou de dizer "ainda não sei", "em breve retorno" ou "ainda não tenho volume de pedidos" é contraindicado. Cria desconfiança.

> **Lead** (`osmanielfernando@gmail.com`, Marmitaria): *"ainda não tenho a quantidade de pedidos"*
> **Clara:** *"Tudo bem, Osmaniel! Sem pressão. Fico à disposição para quando você estiver pronto. É só me chamar aqui que a gente retoma."*

Aqui Clara encerrou corretamente — mas sem nenhum follow-up agendado, sem pergunta de curiosidade, sem próximo passo. Osmaniel vai simplesmente esquecer.

---

**Padrão C — Clara encerra sem deixar âncora para retorno**

O encerramento padrão quando o timing é longo é: *"Sem pressão, me chama quando estiver pronto."*

Isso coloca 100% da responsabilidade no lead de retomar o contato. Considerando que o lead já não está convicto, a probabilidade de ele voltar por iniciativa própria é baixa.

> **Lead** (`carolinasantos2761@gmail.com`): *"Vou deixar para mês que vem. Vou fazer esse dinheiro."*
> **Clara:** *"Perfeito. Faz sentido se organizar primeiro e retomar no mês que vem, sem pressão. Quando fizer sentido pra você, me chama por aqui que eu continuo de onde paramos."*

Não há data, não há lembrete, não há próximo passo concreto.

---

**Padrão D — Lead que vai abrir em breve tem interesse alto, mas Clara não explora**

Leads como `mariana.colamonico@gmail.com` (ainda não abriu, estruturando) e `lucicleidelima85@gmail.com` (vindo de outra cidade, pesquisando preços) têm interesse genuíno e timing real de 1-2 meses. Clara identifica o timing mas não aprofunda: não pergunta qual é a data prevista de abertura, não propõe deixar agendado desde já, não oferece conteúdo de suporte enquanto o lead não está pronto.

> **Lead** (`mariana.colamonico@gmail.com`): *"Ainda não abri o negócio, estou estruturando. Tudo feito em Excel, bloco de notas e ChatGPT."*
> **Clara:** *"Como você vai operar sozinha e no delivery, o Plano Delivery é o mais indicado. Ele ajuda a centralizar pedidos, automatizar o WhatsApp, organizar entregas e receber pagamento online."*

Correto tecnicamente, mas não capturou a data de abertura nem sugeriu que poderiam deixar a demonstração agendada para quando a operação estiver pronta.

---

### Diagnóstico

Clara opera num modelo **binário de conversão**: ou o lead agenda agora, ou a conversa encerra. Não existe estado intermediário de nurturing. Para leads com timing de 30-180 dias, esse modelo desperdiça contatos que têm intenção real de compra — eles só não estão prontos hoje.

Além disso, a urgência artificial ("agenda disputada") é percebida como manipulation por leads que sabem que não vão comprar agora. Isso danifica a percepção da marca.

---

### Reescritas sugeridas

**Quando lead diz "em breve" ou "mês que vem":**
> *"Faz sentido. Me diz uma coisa: tem uma data mais ou menos em mente? Tipo, estamos falando de 30 dias, 60 dias ou mais? Pergunto porque posso deixar a demonstração já na agenda para a semana certa — você não precisa fazer nada antes disso."*

**Quando lead diz que não está pronto mas tem interesse:**
> *"Sem problema nenhum, [nome]. Para não te perder de vista, me conta: em qual mês você acha que vai estar pronto? Assim eu faço uma anotação aqui e retomo com você nessa época — sem precisar você me chamar."*

**Quando lead diz "me chama quando estiver pronto" (ou similar):**
> *"Combinado. Você me autoriza a te mandar um oi em [data específica baseada no que lead disse]? Assim você não precisa se lembrar, eu cuido disso."*

---

## 3. "Vou Verificar" — Clara Não Conhece o Produto e Não Retorna

### Padrões encontrados nos 12 cases

**Padrão A — Clara não sabe o que está incluído no plano mais básico**

Este é o mais crítico. "O que entra no plano de R$179,99?" é a pergunta mais comum da base. Mas em 5 cases Clara respondeu "vou confirmar certinho quais funções exatamente entram".

O plano básico é produto próprio. Essa informação não pode ser "verificada depois".

> **Lead** (`christianirocha44@gmail.com`): *"Esse valor é mensal? Tem taxa de instalação?"*
> **Clara:** *"Sim, esse valor de R$179,99 é por mês. Sobre taxa de instalação/ativação, vou só confirmar certinho nas condições atuais pra te responder direitinho, tudo bem pra você?"*

Não confirmou. O lead perguntou mais 3 coisas e a taxa nunca foi respondida.

---

**Padrão B — Tópicos que a Clara consistentemente não sabe responder**

Mapeando os 12 cases, os gaps de conhecimento recorrentes são:

| Dúvida | Frequência nos cases | Status ideal |
|---|---|---|
| O que inclui o plano de R$179,99 | 5/12 | Deve estar na base de conhecimento |
| Taxa de instalação/ativação | 3/12 | Deve estar na base de conhecimento |
| CNPJ obrigatório para iFood | 3/12 | Deve estar na base de conhecimento |
| Integração com 99 Delivery | 2/12 | Resposta definitiva (sim ou não) |
| Compatibilidade com iPad | 1/12 | Deve estar na base de conhecimento |
| Ficha técnica / API aberta | 1/12 | Produto técnico — encaminhar para especialista |
| Aviso de estoque baixo | 1/12 | Deve estar na base de conhecimento |

Os primeiros 5 itens são perguntas básicas de produto que devem ter resposta definitiva na base da Clara.

---

**Padrão C — Clara diz "vou verificar" e nunca verifica na mesma conversa**

Em 8 dos 12 cases, após o "vou verificar", a próxima mensagem de Clara é sobre outro assunto. O lead ou não percebe (e a dúvida fica sem resposta) ou percebe e perde confiança.

> **Lead** (`wesleytecbh@hotmail.com`): *"Como seria isso, você pode me explicar melhor?"*  
> **Clara:** *"Sobre 99 Delivery, não achei essa informação confirmada aqui. Vou verificar certinho pra não te passar algo errado."*  
> *(próxima mensagem de Clara)* *"Faz sentido. Funciona assim: você recebe pedidos pelo seu cardápio digital, com pagamento online por Pix ou cartão."*

O 99 Delivery nunca foi respondido.

---

**Padrão D — Loop de verificação: Clara promete verificar duas vezes a mesma coisa**

> **Lead** (`tchellobom@gmail.com`, Sushi): Pergunta sobre CNPJ para iFood no turno 54.
> **Clara:** *"Sobre o CNPJ/MEI, vou confirmar esse ponto específico pra te orientar com precisão."*
> *(12 turnos depois)* **Clara:** *"Sobre essa exigência de MEI/CNPJ pro iFood, eu não tenho essa informação confirmada na nossa base agora e prefiro não te passar algo impreciso. Vou verificar esse ponto certinho pra te orientar da forma correta."*

Clara prometeu verificar duas vezes a mesma pergunta. Nunca verificou.

---

**Padrão E — "Vou verificar" é usado corretamente em 2-3 cases (para não enganar o lead)**

Justo registrar: em `carlosleonam@yahoo.com.br` (Pastelaria, perguntando sobre ficha técnica e API aberta), e em `alcioneleandrofilho@hotmail.com` (iPad), o "vou verificar" é legítimo — são perguntas técnicas avançadas que genuinamente precisam de confirmação do time. O problema não é o "vou verificar" em si, é usá-lo para perguntas que deveriam ter resposta imediata.

---

### Diagnóstico

Dois problemas distintos:

1. **Gap de conhecimento:** A base de conhecimento da Clara não tem os detalhes do plano básico, taxas, CNPJ para iFood, compatibilidade com dispositivos. Isso precisa ser alimentado.

2. **Ausência de follow-through:** Quando Clara diz "vou verificar", nada na arquitetura do N8N garante que ela vai de fato buscar a resposta e voltar para o lead. A promessa é feita na conversa, mas não vira uma tarefa com retorno garantido.

---

### Reescritas sugeridas

**Substituir "vou verificar o que inclui o plano" por resposta direta:**
> *"O plano Delivery de R$179,99/mês inclui: cardápio digital, chatbot WhatsApp, pedido com Pix/cartão, controle de caixa e balcão, fidelidade e integração iFood. Não inclui: notas fiscais e gestão financeira — esses são módulos à parte. Taxa de instalação: zero, a montagem do cardápio é feita pela nossa equipe sem custo. Faz sentido?"*

**Quando for uma dúvida que genuinamente precisa ser verificada:**
> *"Essa pergunta sobre [tópico] é mais técnica e o nosso especialista vai confirmar com precisão na demonstração. Posso anotar aqui pra ele já ter a resposta pronta quando vocês se falarem?"*

**Nunca usar "vou verificar" sem dar prazo e retornar:**
Se for usado, deve vir acompanhado de: *"Vou verificar isso e te mando a resposta aqui ainda hoje."* — e de fato fazer isso.

---

## 4. Concorrente — Análise Real dos 12 Cases

### Limpeza dos dados: 4 falsos positivos

Dos 12 cases capturados pelo filtro "já tenho/já uso/outro sistema", 4 são falsos positivos — o lead disse "já tenho restaurante" (querendo dizer que já tem um negócio aberto, não que usa um sistema concorrente):

- `celestinofabiana500@gmail.com` — "Já tenho restaurante" (falso positivo)
- `enilsonalmeida124@gmail.com` — "Já tenho restaurante" (falso positivo)
- `aureagastronomica@gmail.com` — "Já tenho um restaurante delivery rodando bem pouco" (falso positivo)
- `acaidaora.capimmacio@gmail.com` — "Já uso a Cardápio Web em uma operação" (cliente existente, não concorrente)

**Cases reais de concorrente:** 8 dos 12.

---

### Padrões encontrados nos 8 cases reais

**Padrão A — Anota.ai é o principal concorrente; Clara não diferencia diretamente**

> **Lead** (`vieiradaniela971@gmail.com`, Restaurante): *"Uso Anota Aí, tá muito caro. Pago R$399,00."*
> **Clara:** *"Compreendo. Então hoje vocês usam o Anota Aí, ele atende bem em funcionalidades, mas o valor está alto pra operação de vocês."*

Clara confirmou o contexto mas **não calculou a economia**: R$399 no Anota Aí vs R$179,99 na Cardápio Web = economia de R$219/mês, R$2.628/ano. Esse número deveria ter sido dito imediatamente.

---

**Padrão B — Lead abandona por preço, Clara deixa ir sem tentar**

> **Lead** (`almirxavierdeoliveira2@gmail.com`, Hamburgueria): *"Desculpa, achei que era mais barato, deixa para próxima."*
> **Clara:** *"Sem problemas, Almir! Quando o momento for certo, é só chamar."*

A objeção era de preço — "achei que era mais barato". Clara não perguntou quanto o lead achava que seria, nem explicou o que R$179,99 inclui versus o que ele provavelmente pagaria no iFood ou em um sistema mais barato sem as funcionalidades de automação.

---

**Padrão C — Lead que usa Anota.ai bot (bot×bot confirmado)**

> `dkacai0308@gmail.com` (Açaiteria): O lead enviou o link do seu cardápio no Anota.ai e uma mensagem automatizada do bot do Anota.ai:
> *"Temos opções incríveis esperando por você! Dá uma olhadinha no cardápio aqui embaixo..."*
>
> **Clara:** *"Perfeito. Vi que esse número está com atendimento automático ativo. Estou falando com o responsável pelo KD Açaí?"*
>
> (resposta automática do bot) *"Agradecemos seu feedback! É importante para que possamos melhorar!"*

Clara identificou o atendimento automático mas continuou tentando a conversa. O lead humano nunca respondeu.

---

**Padrão D — Lead busca reduzir custos vindo de concorrente, Clara não pergunta o valor atual**

Em todos os cases onde o lead migra de concorrente por custo, Clara confirma a situação mas não pergunta **quanto o lead paga hoje**. Sem esse dado, é impossível quantificar a economia e o argumento de preço fica no abstrato.

---

**Padrão E — Lead tem sistema mas não está satisfeito, Clara trata como lead novo**

> **Lead** (`analuizanunes1314@gmail.com`): *"Amiga eu já tenho um sistema mais não me atende muito. Estou em busca de outro."*
> **Clara:** *"Às vezes a gente fica presa num sistema que prometia mas não entregava né. Me conta: você opera com delivery, salão ou os dois?"*

Clara pulou direto para qualificação sem perguntar o que o sistema atual não estava entregando. Essa informação é ouro — ela define exatamente o que a CW precisa demonstrar ser melhor.

---

### Diagnóstico

Os cases de concorrente têm dois problemas diferentes:

1. **Anota.ai migration:** Leads saindo do Anota.ai por custo são leads quentes. Clara não usa o número atual que o lead paga para quantificar a economia, e não pergunta o que o sistema atual não entrega.

2. **Objeção de preço:** Quando lead diz "achei que era mais barato", Clara encerra. Deveria ser o oposto — é o momento de mostrar o valor, não de capitular.

---

### Reescritas sugeridas

**Quando lead migra de concorrente por custo:**
> *"[Nome], você paga quanto hoje no [concorrente]? Pergunto porque muitos clientes que migraram do Anota Aí, por exemplo, vieram pagando R$350-400/mês e foram para R$179,99 aqui — uma economia de mais de R$2.000 por ano. Quer que eu te mostre a comparação?"*

**Quando lead diz "achei que era mais barato":**
> *"Entendo. Quanto você estava esperando pagar, mais ou menos? Pergunto porque às vezes a conta muda quando você compara o que está incluso — por exemplo, o iFood cobra por pedido e isso some direto do seu faturamento, enquanto aqui é mensalidade fixa sem comissão. Faz sentido compararmos?"*

**Quando lead tem sistema mas não está satisfeito:**
> *"Que sistema é esse que você usa hoje? E me conta: o que especificamente ele não entrega que você precisaria? Assim já consigo te dizer se conseguimos resolver ou não antes de você gastar seu tempo."*

---

## Conclusão — O Que Mudar Primeiro

### Prioridade 1 — Enriquecer a base de conhecimento da Clara (bloqueia os padrões A e B do "Vou Verificar" e o Padrão B do Preço)

**O que fazer:** Adicionar na base da Clara uma tabela de planos completa, com o que está incluso em cada um, valores exatos, taxa de instalação (zero), e perguntas frequentes técnicas (CNPJ iFood, dispositivos suportados, gateways de pagamento).

Isso elimina pelo menos 5 dos 12 cases de "vou verificar" e boa parte dos casos de preço onde Clara não sabia o que estava incluso.

---

### Prioridade 2 — Reescrever a apresentação de preço (bloqueia Padrão A e C do Preço)

**O que fazer:** Substituir "R$179,99/mês (anual)" por uma apresentação em duas frases:
> *"R$179,99 por mês — você paga esse valor todo mês durante 12 meses. Se preferir sem compromisso anual: R$209,99 por mês."*

E quando lead pede diferença entre planos, Clara deve ter o quadro comparativo de cor — não precisar "verificar".

---

### Prioridade 3 — Criar fluxo de nurturing para timing longo (bloqueia Padrão A, B e C do Timing)

**O que fazer:** Em vez do binário "agenda agora ou tchau", criar um estado intermediário: Clara pergunta a data prevista de abertura/implementação, registra no CRM, e agenda um follow-up automático para 1 semana antes dessa data. O lead não precisa se lembrar de voltar.

---

### Prioridade 4 — Treinar a Clara para objeção de preço competitivo (bloqueia Padrão B e D do Concorrente)

**O que fazer:** Quando lead menciona concorrente ou diz "achei que era mais barato", Clara deve:
1. Perguntar quanto o lead paga hoje no concorrente
2. Calcular a economia anual
3. Mostrar o que está incluso que o concorrente cobra à parte (ex: comissão iFood)
4. Nunca encerrar por objeção de preço sem ao menos uma tentativa de comparação

---

*Arquivo gerado em 2026-05-15. Emails listados são para validação via Supabase — cada case pode ser verificado buscando o email na tabela `leads`.*
