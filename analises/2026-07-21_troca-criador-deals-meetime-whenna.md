# Troca de criador dos deals da Meetime (Glauton → Whenna) — diagnóstico e correção

**Data:** 21/07/2026
**Responsável pela investigação:** Alexandre Magno (Growth)
**Sistemas envolvidos:** Meetime (agendamento SDR) → Pipedrive (CRM comercial)
**Status:** ✅ Corrigido em 21/07/2026 ~16h30 — validação final em 22/07

---

## Resumo executivo

Entre **10/07 (14h25) e 21/07 (16h06)**, os negócios criados automaticamente pela Meetime na
etapa "Reunião Marcada" do funil de vendas passaram a nascer no Pipedrive com o criador
**Whenna Oliveira** em vez de **Glauton Santos**, o padrão histórico. A causa foi a
integração Meetime→Pipedrive do **login da Whenna**, que estava configurada com o token
pessoal dela em vez do token padrão. A correção foi colar o token do Glauton de volta no
login dela. **Nenhum deal foi perdido** — apenas o autor da criação mudou. Ficam **~163
deals** permanentemente registrados em nome dela nessa janela (o Pipedrive não permite
alterar criador retroativamente).

---

## O sintoma

Alguns negócios do funil de vendas começaram a aparecer como "Negócio criado · Whenna
Oliveira (API)" no histórico do Pipedrive, quando o esperado era "Glauton Santos (API)".
Não eram todos — a maioria continuava nascendo como Glauton — e a Whenna não mexe com
automações, o que tornava o comportamento inexplicável à primeira vista.

## O diagnóstico

### 1. Censo de criadores (maio → 21/07, deals com origem API)

| Período | Glauton (11726977) | Whenna (21801658) |
|---|---|---|
| 01/05 → 09/07 | 100% | 0 |
| 10/07 → 12/07 | maioria | 10 (começa às 14h30 de 10/07) |
| 13/07 → 19/07 | 892 | 117 |
| 20/07 → 21/07 | 230 | 36 |

O corte é cirúrgico: último deal Meetime do Glauton às **14h25 de 10/07** (id 459733),
primeiro da Whenna às **14h30** (id 459734) — IDs consecutivos. Depois disso os dois
criadores passam a se intercalar. Nenhum outro usuário cria deals via API no período.

### 2. Assinatura dos deals afetados

Todos os deals da Whenna tinham a assinatura de criação da **Meetime**: nota automática
"Url pública do lead no Flow: meetime.com.br/…" + atividade de reunião criadas no mesmo
segundo do deal, etapa "Reunião Marcada" (pipeline de vendas), donos = SDRs (João Paulo,
Luan Nicolas, Leandro, Rebeca, Guilherme, Taty). Amostra de verificação:

- Deals do Glauton **antes** de 10/07: 5/6 com nota Meetime (eram os agendamentos)
- Deals do Glauton **depois** de 13/07: 1/6 (sobraram as outras automações — n8n, importações)
- Deals da Whenna: com nota Meetime (inclusive o caso que disparou a investigação, id 461582)

Conclusão: **só o fluxo "reunião marcada" da Meetime trocou de autor.** As demais automações
(n8n, importação de leads, fluxos da Clara IA) seguiram criando como Glauton — por isso a
troca era parcial.

### 3. Causa raiz

A integração Meetime→Pipedrive é configurada **por usuário**: cada login da Meetime tem seu
próprio campo de token de API em *Integrações → Pipedrive*, e o deal nasce em nome do dono
do token de **quem marca a reunião**. O padrão da operação sempre foi todos os logins com o
token do Glauton. Em 10/07 ~14h30, o login da Whenna passou a usar o token pessoal dela —
confirmado visualmente na tela de integrações: o token no login dela estava diferente do
padrão. A partir daí, toda reunião marcada por ela gerava deal com criador "Whenna Oliveira".

Hipóteses descartadas durante a investigação: workflows do n8n (nenhum dos fluxos que criam
deals no funil de vendas usa credencial da Whenna), RD Station e criação manual (o outro caso
do print inicial, id 459700, era uma cópia manual feita pelo João Paulo — fenômeno distinto).

## A correção

1. Confirmado que o login da Whenna na Meetime tinha token divergente (21/07, ~16h20)
2. Substituído pelo token padrão do Glauton em *Integrações → Pipedrive → Editar* (~16h30)
3. Verificação pós-troca: todos os deals de Reunião Marcada criados entre 16h11 e 16h41
   nasceram como Glauton; **nenhum deal da Whenna após 16h06**

**Validação final pendente:** confirmar em 22/07 que nenhum deal novo nasceu em nome da
Whenna — em especial um agendamento feito por ela própria após a troca. Se voltar a
acontecer, o token dela está colado em mais de um login da Meetime.

## Impacto e ressalvas

- **Nenhuma perda de dados.** Os agendamentos continuaram criando deals normalmente durante
  toda a janela; apenas o campo "criador" mudou.
- **Janela suja permanente:** 10/07 14h30 → 21/07 16h06, **~163 deals** com criador Whenna
  que na prática são deals da Meetime. O Pipedrive não permite corrigir criador
  retroativamente. Qualquer relatório ou filtro que use "criado por Glauton Santos" como
  proxy de "deal automático/Meetime" **subconta nesse intervalo** — nessa janela, tratar
  "criado por Whenna Oliveira via API + pipeline de vendas" como deal da Meetime.
- **Recomendação estrutural (a discutir):** a criação de deals depende hoje do token pessoal
  de um usuário colado manualmente em cada login da Meetime. Um usuário técnico dedicado
  (ex.: "Integrações") eliminaria esse risco — se o token do Glauton for regenerado ou a
  conta dele desativada, a criação de deals da Meetime e vários workflows do n8n quebram
  juntos. Decisão passa pela gestão.

---

*Investigação conduzida via API do Pipedrive (censo de 2.800 deals de 08–21/07, changelog
dos deals afetados) e API do n8n (varredura dos 766 workflows em busca de credenciais
Pipedrive), com confirmação visual nas telas de integração da Meetime.*
