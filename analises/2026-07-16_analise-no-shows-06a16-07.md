# Análise minuciosa dos no-shows — 06/07 a 16/07/2026

> Fontes: Pipedrive (filtro 81289 "[REVOPS] No-show IA" + deals individuais), Supabase `public.leads`
> (campos + conversa completa de cada lead). Deduplicação por telefone/person. Gerado em 16/07/2026.

---

## 1. Reconciliação: "os 15 no-shows"

| Fonte | Critério | Resultado |
|---|---|---|
| Pipedrive | deal `lost` + lost_reason `[IS] No-show` + Passou por IA=Sim, `lost_time` 06–16/07 | **14 deals = 13 leads únicos** (Thaís Vilela tem 2 deals) |
| Supabase | `motivo_perda='No-show'` + reunião (`data_agendamento`) 06–16/07 | **14 leads** (os 13 + Katherine, que depois virou **won**) |
| **Eventos de no-show** | contando cada reunião perdida | **15 eventos / 14 leads únicos** (Thaís no-show 2× no mesmo dia) |

Casos-limite **fora** da contagem oficial, mas que provavelmente são no-show:

- **Samuel Heber (Sushi, tier 5)** — reunião 08/07 14:00, fluxo completo de lembretes, silêncio total após o
  lembrete de 10min, **deal aberto há 8 dias sem desfecho** e sem fluxo de recuperação. No-show "fantasma":
  o closer (Rebeca) nunca marcou nada.
- **daniele terra (Delicia da dani, tier 5)** — reunião 06/07 09:15; respondeu "Bom dia ☕️" ao lembrete das 07:16
  (estava engajada), recebeu todos os lembretes e sumiu. Deal fechado 3h depois como **"[IS] Lead desqualificado"**
  — sem nenhuma conversa depois da reunião. Provável no-show codificado errado; ela nunca recebeu recuperação.

Ou seja: os "15" fecham como **15 eventos marcados** (14 leads, Thaís 2×), e há **+2 prováveis no-shows
não contados** (Samuel e daniele). Se contados, o período teria 17 eventos.

### Contexto do período (26 leads com reunião marcada em 06–16/07)

- **14 leads no-show** · **8 realizadas** (todas viraram won: Joao Lucas, Rodrigo Seo, Tiago, Hudson, Helen, Eric, Jaqueline, Katherine) · 1 "desqualificada" (daniele) · 4 pendentes (Samuel, Edson, Osvaldo e Ana Julia — 2 são de hoje).
- **Taxa de no-show do período: ~64% por lead com desfecho (14/22)** vs baseline abr–jun de **39%**.
  Mesmo descontando os cancelamentos avisados (ver §4), fica ~50% — o período foi anormalmente ruim,
  e uma parte relevante da piora é **operacional interna**, não comportamento do lead.

---

## 2. Ficha por lead (15 eventos, em ordem cronológica)

Legenda de causa: 🔴 falha interna · 🟡 cancelamento avisado (no-show "falso") · ⚫ sumiu sem avisar

### 1. ⚫ Caique dos Santos — Toca do Bruxo (Pizzaria, **tier 5**) — seg 06/07 09:30 · Rebeca
- Qualificado na **sexta 03/07** em ~50min, fluido. Reunião na segunda = **~68h de antecedência com fim de semana no meio**.
- Dor fraca: **já tem cardápio digital próprio** ("feita pra mim"); motivação vaga ("melhorias"). Preferiu mensal.
- Lembretes: 2h ✓ · manual ✓ · 30min ✗ · 10min ✓ (com link). Silêncio absoluto no dia; não respondeu à recuperação.
- **Hipótese:** esfriou no fim de semana + baixa dor (já tem solução funcionando) + segunda 09:30 é cedo para dono de pizzaria que vira a madrugada no fds.

### 2. 🟡 Maria Cecília — bloom (Confeitaria, **tier 4**) — seg 06/07 13:30 · Rebeca
- Qualificada às **02h da madrugada de sábado**; está **começando do zero** (cookies, negócio ainda não existe); objeção de orçamento registrada ("tenho que avaliar um pouco mais").
- **Avisou às 12:19 (1h11 antes)** que não iria. A Clara acolheu e perguntou o horário para remarcar — **mas a esteira de lembretes continuou** (30min às 13:00 e 10min às 13:15). Lead reclamou ("Eu comentei q n será possível"); Clara pediu desculpas "pela confusão com os lembretes".
- **Hipótese:** negócio inexistente + orçamento apertado = compromisso frágil; o cancelamento virou no-show na métrica; lembretes pós-aviso queimaram o relacionamento (não respondeu mais).

### 3. 🟡/🔴 Pizzaria Dom Gandino (Pizzaria, **tier 5**, MS = BRT−1) — seg 06/07 15:45 · Ranier
- Precisou de 2 FUPs para concluir qualificação. Houve **confusão de fuso** na marcação (ele pediu "13:30 de SP" e fechou 15:45 BRT).
- Às 15:31 (pós-lembrete 10min): "**Já havia avisado** que não iria conseguir, tive um imprevisto" (não há aviso no log — outro canal ou desculpa). Reagendou para **qua 08/07 15:45**.
- **08/07: o lead COMPARECEU** ("Estou aguardando", 15:47) e o **closer atrasou 20+ min** → desistiu às 16:07 ("tenho que fazer compra para a pizzaria. Vamos ter que remarcar"). Reagendou para qui 09/07 15:45 e a conversa morre sem resposta final dele.
- Bônus de dado: o `data_agendamento` no Supabase **ficou travado em 06/07 15:45** apesar de 2 reagendamentos.
- **Hipótese:** 1º no-show = imprevisto/possível confusão de fuso; a **perda definitiva foi o atraso do closer** quando ele compareceu (caso exatamente do GWT-2733).

### 4. ⚫ Cristina Martins — Geladinhos eventos Gourmet ("Outro", **tier 5**) — ter 07/07 09:15 · Rebeca
- Qualificação relâmpago (30min) na noite anterior; reunião **14h depois**. Respostas monossilábicas ("Sim" ×6) = concordância social. Perguntou se a plataforma **faz postagem no Instagram** (desalinhamento de expectativa — queria marketing).
- Vende geladinho gourmet para eventos = **fora do ICP** de restaurante (segmento "Outro").
- Único caso com **fluxo de lembretes 100% completo** (2h + manual + 30min c/ link + 10min) — e sumiu mesmo assim.
- **Hipótese:** qualificação inflada por "sins" fáceis; produto/porte não aderente; lembrete não resolve falta de intenção.

### 5. 🟡 Jefferson Balbino — Jeff's Açaí (Açaiteria, **tier 5**) — ter 07/07 16:15 · Leticia — **no-show FALSO**
- Negócio **ainda não existe** (começa a vender 01/08, de casa, entrega de bike). Só queria o esquema de **entregadores do iFood**; objeção de timing explícita, contornada pela Clara.
- **Cancelou às 09:53** ("arranjei um motoboy com meu irmão... já consegui o que eu queria"). A Clara encerrou educadamente às 11:38.
- O sistema **não processou o cancelamento**: lembrete 2h (14:16), lembrete 30min (15:46) com "**Link: já já te envio 😉**" (link_reuniao NULL — placeholder vazou; `etapa_repasse='erro_agendamento'`), lead reclamou "**achava que tinha cancelado**", Clara "já sinalizei internamente"… e ainda vieram o lembrete 10min (16:01) **e** a mensagem de reagendamento pós-no-show (16:50).
- **Hipótese:** (a) lead não deveria ter sido agendado (produto desalinhado + negócio inexistente); (b) contou como no-show sendo **cancelamento com 6h de antecedência**; (c) 2 bugs expostos: cancelamento-não-para-esteira e link nulo.

### 6. ⚫ Dayane Araújo — Açaí ponto 6 (Açaiteria, **tier 5**) — qui 09/07 10:00 · Leticia
- Cadastro 23:29, sumiu na 1ª pergunta, 2 FUPs para retomar (followup_count=3).
- **Objeção de preço explícita**: "**Não por enquanto**" para o Premium R$239,99; a Clara reenquadrou como investimento e a lead cedeu ("Sim faz") — um "sim" social, não convicção.
- Lembretes: 2h ✓ · manual ✓ · 30min ✗ · 10min ✓ (com link). Silêncio no dia; não respondeu à recuperação.
- **Hipótese:** o preço realmente não cabia; o no-show foi a fuga da pressão de compra. Caso-tipo do gargalo de preço já mapeado no funil.

### 7. 🔴 Fabiano Mayworm — Teddy Burguer (Hamburgueria, **tier 4**) — qui 09/07 17:15 · Leticia — **atendimento duplicado**
- Lead **quentíssimo**: 3 trailers rodando, ex-dono de 6 lojas, 2.100 clientes no WhatsApp, indicado pelo Júlio (case da CW), planeja 4 lojas.
- Na tarde de 08/07 um **humano assumiu o mesmo lead em paralelo** ("Oi Eduardo… **já falei com a outra moça**", "Letícia 3 minutos"): ele **refez toda a qualificação por áudio**, mandou CNPJ e e-mail e **pediu o link de pagamento para segunda 13/07** ("por mim já está fechado nosso contrato").
- No dia da reunião: respondeu ao lembrete com "**Já conversei com a moça**"; a Clara insistiu que a reunião seguia de pé; o lembrete 10min veio **sem link** (placeholder "te envio agorinha 😉"). Ele não entrou — na visão dele, **já tinha resolvido tudo e ia pagar segunda**.
- 13/07: "Estou ocupado… aguarda até eu dar o ok". Deal marcado lost no-show 14/07.
- **Hipótese:** no-show de **processo interno** — Clara e humano atropelando um ao outro; a reunião era redundante para o lead. ⚠️ **Checar se a venda foi concluída — havia pedido de link de pagamento em aberto.**

### 8. 🟡 Caroline — Restaurante Gostinho Caseiro (Restaurante, **tier 4**) — sex 10/07 15:00 · Luiz — **no-show FALSO (cancelou 2 dias antes)**
- Veio do **chatgpt.com** (utm_source). Motivação: Anota Aí ficou caro → **sensível a preço**. Authority fraco: **a decisão é da mãe** ("o restaurante é dela").
- Pediu reunião "**semana que vem, dia 17**"; a Clara marcou **sexta 10/07** (interpretação errada de data); quando corrigida, respondeu "**só consigo remarcar dentro dos próximos 2 dias úteis**" (trava da regra). Lead: "**Pode cancelar essa**" (08/07 13:14). Clara confirmou: "Vou considerar esse horário cancelado" (14:11).
- **No dia 10/07 os lembretes vieram assim mesmo** (manual 08:30, 2h 13:01 — "Eu falei que hoje não posso" / Clara: "**foi um erro nosso**" — e 10min 14:46 com placeholder sem link). A lead desistiu de remarcar ("Nenhum. Pode deixar. Obrigada").
- `reagendamento=false` — ela **nem recebeu o fluxo de recuperação**; deal lost no-show 18:41.
- **Hipótese:** a regra dos 2 dias úteis impediu marcar quando ela podia; o cancelamento virou no-show; os lembretes pós-cancelamento mataram a relação.

### 9. ⚫/🔴 Priscila Salviano — Sampa Burguer (Hamburgueria, **tier 5**) — seg 13/07 10:45 · Leticia
- **Pré-inauguração** ("não tenho nada pronto"), monossilábica, 1 FUP de áudio no meio. Marcou **sábado** para segunda (~44h + fds).
- **Fluxo de lembretes falhou quase inteiro: só o lembrete manual das 08:31** (sem 2h, sem 30min, sem 10min — e ela tinha link).
- Anomalia: a mensagem de recuperação pós-no-show chegou às **10:10, ANTES do horário confirmado (10:45)** — indício de que o evento na agenda estava em horário diferente do combinado na conversa (ela escolheu "10:44"→10:45).
- **Hipótese:** sem urgência (não inaugurou) + fds no meio + lembretes ausentes + possível divergência de horário evento×conversa.

### 10. 🟡→🔴 Katherine Solorzano — Lanchonete Mister Pepito (Lanchonete, **tier 4**, RR) — 13/07 17:15 · Leticia — **virou WON em 15/07**
- História em 3 atos: **(02/07)** cancelou às 16:33 avisando → recebeu lembrete 30min, 10min **e** cobrança de no-show mesmo assim; irritada: "**avisei desde cedo, pedi para cancelar**". **(10/07 17:15)** **COMPARECEU** ("na espera de nossa reunião… no aguardo do link"), entrou na sala 17:23 e **esperou 35 minutos sem o closer aparecer** → "podemos reagendar???". **(13/07 17:15)** entrou de novo, closer atrasou de novo ("já avisei o especialista…"), a reunião aconteceu → **won 15/07**.
- **Hipótese/lição:** o "no-show" dela é **no-show do closer**. Lead com decisão de diretoria e concorrente (Saipos) que só fechou porque foi persistente. Quase perdemos uma venda 3 vezes por falha interna.

### 11. 🔴 Roberta Barcelos — Barsan Doces e Salgados ("Outro", **tier 5**, RJ) — ter 14/07 09:15 — **no-show técnico (link nunca chegou)**
- **Ex-cliente** que saiu por instabilidade e voltou. Objeção de preço ("é um pouco puxado"). Queria mandar o ADM (Luiz Phillipe); a Clara exigiu a presença dela; a qualificação termina **sem resposta final dela** — e a reunião foi marcada assim mesmo.
- `etapa_repasse='erro_agendamento'`, sem link: o lembrete 10min veio com **placeholder "te envio agorinha 😉"**.
- Às 09:58: "**estava esperando o email desde 8:50, mas não chegou nada no email**" — ela (ou o ADM) **estava pronta para a reunião**. Ainda perguntou "a implementação vai ser hoje ou amanhã?" = intenção altíssima. A Clara "deixou em verificação"… e o deal virou lost no-show às 12:23. **Ninguém resolveu.**
- **Hipótese:** no-show 100% interno — evento com erro de agendamento, convite/link nunca enviado, e nenhum humano assumiu o caso ao vivo.

### 12. 🟡 Wesley Tavares — Vulcão Pizzaria (Pizzaria, **tier 3.1**, CE) — 1º no-show sex 10/07 18:00 · Leticia
- Único tier 3 da lista. Pediu desconto (sensível a preço). **Queria segunda 13h30 desde o início** — a regra "só nos próximos 2 dias úteis" empurrou para **sexta 18:00**, horário que ele já sinalizou ser arriscado ("talvez eu atrase uns 10 minutos"; tentou 18h30, não tinha).
- Sexta 17:46 (14min antes): "**não vou conseguir, estou em uma reunião no meu trabalho**" (tem emprego; a pizzaria é paralela).
- A recuperação (2 horários concretos) em 13/07 **funcionou**: escolheu **terça 14/07 13:30 — exatamente o horário que sempre quis**. Recebeu fluxo completo de lembretes em 14/07; sem registro pós-reunião; deal novo segue **open/pendente**.
- **Hipótese:** no-show fabricado pela janela de agendamento; quando deram o horário certo, reengajou.

### 13–14. 🟡+⚫ Thaís Vilela — Panda Sabores (Marmitaria, **tier 5**) — ter 14/07 10:00 **e** 14/07 15:45 · (Luiz na conversa) — **2 no-shows no mesmo dia**
- Qualificada na manhã de 13/07 (interrompeu para ir ao cartório e voltou — vida corrida). Engajada ("exatamente o que eu preciso"), quis "conhecer melhor antes de fechar".
- **Reunião 1 (10:00):** lembrete 10min veio **sem link** (placeholder). Às 09:46: "**Não poderei participar**" → reagendou NA HORA para 15:45. Detalhe: a mensagem automática de recuperação ainda chegou às 10:08 oferecendo horários de quarta (race condition — ela já tinha remarcado).
- **Reunião 2 (15:45):** **zero lembretes, zero link** — reagendamento same-day não reentra na esteira. Silêncio; deal lost 18:56.
- **Hipótese:** 1º = imprevisto avisado em cima da hora; 2º = quase inevitável — remarcou de manhã, **nunca recebeu o link** e nenhum lembrete a puxou de volta às 15:45.

### 15. 🔴 Vinicius Ferreira — Zen sushi (Sushi, **tier 5**) — qua 15/07 09:15 · Leticia — **COMPARECEU; no-show do closer**
- Qualificação arrastada (followup_count=5, incluindo o FUP "penúltima tentativa"). **Pediu 2× um vídeo da plataforma** (preferia assíncrono) e queria reunião **à noite** (delivery de comida japonesa opera à noite!) — não há atendimento noturno; aceitou 09:15.
- 15/07: 09:19 "**já vou entrar**" → 09:28 manda **print**: "*Ninguém respondeu à sua solicitação para participar da chamada*" — **ele estava na porta da sala e ninguém o admitiu**. Clara: "o especialista entra em 2 minutinhos". Às 09:33 chegou… **a mensagem automática de no-show** com 2 horários (com o lead na sala!). Deal lost 12:33.
- 16/07: "**ontem entrei e não entrou ninguém… me manda um vídeo explicando**". E: "**Tem um número me mandando diversas mensagens, mas só respondi apenas você**" — outro canal (SDR humano/cadência) bombardeando em paralelo.
- **Hipótese:** chegou ~4–13min atrasado (borderline da tolerância de 5min), mas **estava presente e foi rejeitado**; classificado como no-show do lead sendo, no mínimo, um no-show compartilhado — na prática, do closer.

---

## 3. O fluxo de mensagens foi igual para todos? **NÃO.**

Esteira esperada: lembrete "manual" (~08:30) + lembrete 2h antes + lembrete 30min (com link) + lembrete 10min (com link) + recuperação pós-no-show (2 horários concretos — SM30H10, já em produção no período).

| Lead (reunião) | ~08:30 | 2h | 30min | 10min | Link no 10min | Recuperação |
|---|---|---|---|---|---|---|
| Caique (06/07 09:30) | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ 09:41 |
| Maria (06/07 13:30) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ (após cancelar!) |
| Dom Gandino (06/07 15:45) | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ 15:57 |
| daniele (06/07 09:15)* | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ (lost "desqualificado") |
| Cristina (07/07 09:15) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ 09:22 |
| Jefferson (07/07 16:15) | ✓ | ✓ | ✓ | ✓ | **✗ placeholder** | ✓ (após cancelar!) |
| Samuel (08/07 14:00)* | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ (sem desfecho até hoje) |
| Dayane (09/07 10:00) | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ 10:06 |
| Fabiano (09/07 17:15) | ✓ | ✓ | ✗ | ✓ | **✗ placeholder** | ✓ só em 14/07 |
| Caroline (10/07 15:00) | ✓ | ✓ | ✗ | ✓ | **✗ placeholder** | ✗ (cancelada; lembretes vieram) |
| Wesley 1º (10/07 18:00) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ 13/07 10:26 |
| Priscila (13/07 10:45) | ✓ | **✗** | **✗** | **✗** | — | ✓ **às 10:10 (antes da reunião!)** |
| Katherine (13/07 17:15) | ✓ | ✓ | ✗ | ✓ | ✓ | — (reunião ocorreu → won) |
| Roberta (14/07 09:15) | ✓ | ✓ | ✗ | ✓ | **✗ placeholder** | ✓ 09:24 |
| Wesley 2º (14/07 13:30) | ✓ | ✓ | ✗ | ✓ | ✓ | — (pendente) |
| Thaís 1º (14/07 10:00) | ✓ | ✓ | ✗ | ✓ | **✗ placeholder** | ✓ 10:08 (já reagendada) |
| Thaís 2º (14/07 15:45) | **✗** | **✗** | **✗** | **✗** | — | ✗ |
| Vinicius (15/07 09:15) | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ **09:33 (lead na sala)** |

\* casos-limite fora da métrica oficial.

**Desvios encontrados:**
1. **Lembrete 30min sumiu a partir de 10/07** (última vez: Wesley em 10/07). Antes disso já era intermitente (6 de 17 reuniões).
2. **5 lembretes de 10min saíram sem link** — placeholder literal "*te envio agorinha aqui no WhatsApp 😉*" (Jefferson, Fabiano, Caroline, Roberta, Thaís). É o bug conhecido do `link_reuniao` NULL (GWT-2727) **ainda vivo** — e no caso da Roberta foi a causa direta do no-show.
3. **Priscila recebeu só 1 dos 4 lembretes**; **Thaís (2ª reunião) recebeu zero** — reagendamento no mesmo dia não reentra na esteira de lembretes nem envia link.
4. **Cancelamento não para a esteira**: Maria, Jefferson, Caroline e Katherine avisaram/cancelaram e continuaram recebendo lembretes e até cobrança de no-show — os 4 reclamaram; a Clara chegou a admitir "foi um erro nosso".
5. **Recuperação pós-no-show dispara em momento errado**: antes da reunião (Priscila 10:10 < 10:45), com o lead dentro da sala (Vinicius 09:33) e depois de já reagendado (Thaís 10:08).

---

## 4. Classificação das causas (15 eventos oficiais)

| Causa | Eventos | % |
|---|---|---|
| 🔴 **Falha interna** (closer ausente/atrasado, link não entregue, atendimento duplicado, horário divergente) | Vinicius, Roberta, Katherine(10/07), Fabiano, ~Priscila | **~5 (33%)** |
| 🟡 **Cancelamento/aviso prévio contado como no-show** | Maria (1h11), Jefferson (6h), Caroline (2 dias!), Wesley (14min), Thaís-1 (14min), Katherine(02/07) | **~5–6 (37%)** |
| ⚫ **Sumiu sem avisar** (no-show "clássico") | Caique, Cristina, Dayane, Thaís-2 (+ Samuel e daniele não contados) | **~4 (27%)** |

> Leitura executiva: **só ~1/3 dos "no-shows" do período é o lead simplesmente não aparecendo.**
> Outro terço é **cancelamento avisado** que o processo transforma em no-show (métrica inflada e lead
> queimado por lembretes indevidos), e o último terço é **falha nossa** (closer não entra na sala,
> link que nunca chega, dois atendentes no mesmo lead).

**No-show do closer é o padrão mais grave do período:** 3 casos comprovados em 10 dias (Dom Gandino
08/07 — 20min de atraso com lead na espera; Katherine 10/07 — 35min, lead desistiu; Vinicius 15/07 —
lead na porta da sala sem ser admitido) + atraso na própria reunião won da Katherine (13/07). Em 2 desses
o lead tinha **comparecido** e virou "no-show do lead" no Pipedrive.

---

## 5. Tier influencia?

| Tier | Leads no-show | Realizadas no período | Observação |
|---|---|---|---|
| 5 | 9 (Caique, Dom Gandino, Cristina, Jefferson, Dayane, Priscila, Roberta, Thaís, Vinicius) | 4 (Rodrigo, Tiago, Helen, Jaqueline) | ~69% no-show |
| 4 | 4 (Maria, Fabiano, Caroline, Katherine*) | 3 (Hudson, Eric, Katherine no 3º ato) | ~57% |
| 3.1 | 1 (Wesley) | 1 (Joao Lucas) | 50% |

- **Tier NÃO é um discriminador claro** neste período (n pequeno; tier 5 domina o volume de agendamentos da Clara por construção). Tier 5 aparece um pouco pior, mas a diferença não explica o surto.
- O que discrimina de verdade é a **maturidade do negócio**: 4–5 dos 14 leads estavam em **pré-operação**
  (Maria "começando do zero", Jefferson começa em agosto, Priscila "não inaugurei", Fabiano inaugurando,
  Cristina informal). Lead tier 4–5 no formulário ≠ operação rodando: quem ainda não tem loja aberta
  não tem custo em faltar. **Sugestão: campo/flag "já está operando?" na qualificação e tratar
  pré-inauguração como cadência separada** (nutrição, não agenda de closer).
- Segundo fator do lead: **objeção de preço mal resolvida** antes de agendar (Dayane "não por enquanto",
  Roberta "puxado", Wesley pediu desconto, Caroline fugindo de preço do Anota Aí, Maria "avaliar") — o
  script atual força um "sim" social ("esse valor cabe?" → "sim") e agenda; o no-show é a saída silenciosa.

## 6. Horário, dia e antecedência

- **Manhã concentrou os no-shows silenciosos**: 8 dos 15 eventos entre 09:15 e 10:45 (Caique, Cristina, Dayane, Priscila, Roberta, Thaís-1, Vinicius + daniele). O baseline abr–jun apontava 16–17h como pior; neste período a manhã (setor que trabalha até tarde) foi o buraco.
- **Fim de semana no meio mata**: 6 marcações feitas sex/sáb para seg/ter (Caique, Maria, Dom Gandino, daniele, Priscila, Roberta) — 100% viraram no-show. Consistente com o baseline (antecedência >2 dias = 47% no-show). **Sugestão: reunião marcada antes do fds exige reconfirmação ativa no domingo à noite/segunda cedo.**
- Antecedência mediana dos no-shows ~24h; os curtos (<18h: Cristina, Jefferson, Dayane, Vinicius, Wesley) também falharam, mas nesses os motivos foram próprios (cancelamento, closer, horário forçado) — reforça que antecedência curta não protege quando a causa é outra.

## 7. A recuperação (SM30H10 — 2 horários concretos) está funcionando?

- A mensagem nova (2 slots concretos) **já estava em produção** durante todo o período — bom.
- Resultado nos 12 leads que a receberam de fato: **1 rebooking direto pela mensagem (Wesley)** + Dom Gandino renegociou horários na sequência + 4 responderam para **reclamar/contextualizar** (Jefferson "achava que tinha cancelado", Katherine "avisei desde cedo", Roberta "esperando o e-mail", Vinicius "entrei e não entrou ninguém") + 6 silêncio.
- Ou seja: a resposta existe (~50%, na linha do baseline de 46%), mas **metade das respostas é reclamação
  de erro nosso** — a mensagem de recuperação está chegando em gente que cancelou, que já reagendou ou que estava na sala. Filtrar esses casos vai melhorar o número real do experimento.

## 8. Recomendações priorizadas

1. **SLA/alerta de closer na sala (URGENTE)** — lead que manda mensagem no horário da reunião ("estou aguardando", print de sala) deve disparar alerta imediato no Slack do closer + gestão (o GWT-2733 cobre exatamente isso; acelerar). 3 no-shows do período eram closer ausente; 2 leads tinham comparecido.
2. **Cancelamento tem que cancelar de verdade** — quando o lead avisa que não vai: desmarcar evento, parar esteira de lembretes, NÃO marcar "[IS] No-show" (criar motivo próprio, ex. "[IS] Cancelado antecipado") e entrar direto no fluxo de reagendamento. Hoje ele leva lembrete + cobrança + vira no-show na métrica e contamina também o gatilho de Reopen do BDR.
3. **Matar o bug do link NULL (GWT-2727)** — 5 lembretes de 10min saíram com "te envio agorinha 😉" e nunca enviaram; no caso Roberta foi a causa direta. Bloquear envio sem link + fallback buscando o link do evento.
4. **Reagendamento same-day reentra na esteira** — Thaís remarcou para 6h depois e não recebeu nem link nem lembrete. Reenviar link na confirmação do novo horário + reinscrever lembretes.
5. **Flexibilizar a janela de 2 dias úteis** — quando o lead declara indisponibilidade (Caroline queria dia 17, Wesley queria segunda), melhor D+5 confirmado que no-show em D+1. Alternativa: agendar dentro da janela + oferecer reconfirmação/troca fácil.
6. **Reconfirmação ativa pós-fim de semana** — para reuniões de segunda marcadas na sexta/sábado (6 no-shows do período), mandar no domingo à noite mensagem com botões "Confirmar / Remarcar".
7. **Triagem de pré-inauguração** — negócio que ainda não opera não vai para a agenda do closer; entra em cadência de nutrição com gatilho na data de inauguração (teria evitado Maria, Jefferson, Priscila e possivelmente a fricção do Fabiano).
8. **Trava de canal único** — se humano assume o lead (Kommo/Meetime), pausar a esteira da Clara (caso Fabiano; e o "outro número" bombardeando o Vinicius). Verificar também se a venda do Fabiano foi concluída — havia pedido de link de pagamento.
9. **Higiene de desfecho no Pipedrive** — Samuel está sem desfecho há 8 dias (sem recuperação por causa disso) e daniele foi codificada "desqualificado" 3h após reunião sem nenhum contato registrado. Closer marcar desfecho no dia; auditoria diária dos deals de "Reunião Marcada" vencidos.
10. **Auditar o lembrete de 30min** — parou de disparar depois de 10/07 e já era intermitente antes.

---

### Anexo — chaves para rastreio
Deals no-show (lost 06–16/07): 457745 Caique · 457930 Maria · 457786 Dom Gandino · 458437 Cristina ·
458503 Jefferson · 459200 Dayane · 459056 Fabiano · 459045 Caroline · 459888 Priscila · 459909 Roberta ·
459602 Wesley(1º) · 460075+460351 Thaís · 460442 Vinicius. Katherine: 459805 (won 15/07).
Casos-limite: Samuel 458684 (open) · daniele 457580 (lost "[IS] Lead desqualificado") · Edson 460162 (open).
