# Contexto CardápioWeb — Empresa & Operação Comercial

> Raio-X do negócio e da máquina de receita da CardápioWeb, para responder com precisão.
> Fonte da verdade: os 6 PDFs em `fontes/` (diagnóstico RevOps por time).
> Complementa o `PERFIL-OPERACIONAL.md` (papel do usuário, equipe GWT, Clara IA, aprendizados).
> Última atualização: 2026-06-12.
>
> ⚠️ **Atenção a homônimos:** "Clara" (pessoa) = gestora/líder comercial citada no PDF de gestão.
> "Clara IA" = o agente SDR de WhatsApp (projeto do usuário). NÃO são a mesma coisa.
>
> ⚠️ **Dados temporais:** os PDFs são um diagnóstico de um momento (início de 2026, na criação
> do RevOps). Números e processos podem ter mudado — confirmar antes de afirmar como atual.

---

## 1. O que é a CardápioWeb
- Empresa de **software (SaaS)** para o segmento de **restaurantes**: solução de **cardápio
  digital** com foco em eficiência operacional, experiência do cliente e conversão no PDV.
- **Modelo recorrente.** Aquisição **majoritariamente inbound**, com **mídia paga** como
  principal canal de geração de demanda.
- **CEO diretamente envolvido** nas decisões de Marketing e Vendas.
- **RevOps** foi criado como função **transversal, respondendo ao CEO**, com mandato de ir
  além do operacional: diagnóstico de gargalos, métricas, processos, integração de dados,
  previsibilidade de receita e suporte à decisão estratégica.
- Contexto do diagnóstico: empresa **definindo OKRs** (foco em Marketing e Vendas).

## 2. Arquitetura de receita (funil e ferramentas)
Etapas operadas em **sistemas distintos**, com dados **não centralizados** e **sem dashboards
consolidados** de Marketing/Vendas/Receita:

| Etapa | Quem | Ferramenta principal |
|---|---|---|
| Marketing / jornada até conversão | Marketing | **RD Station** |
| Pré-venda (1º contato, qualificação, agendamento) | SDR / BDR | **Meetime** (Sales Engagement) |
| Fechamento | Closer | **Pipedrive** (CRM) |
| Conversa / WhatsApp oficial | todos | **Kommo** |
| Dados financeiros (NMR, reembolso, upsell) | — | **Portal interno** |
| Automação / integrações | RevOps/Growth | **n8n** |
| Indicações, leads orgânicos, alertas | — | **Slack** |

**Dor estrutural recorrente em todos os times:** dados espalhados (Portal x Pipedrive x
planilhas), dependência de leitura manual e de "conhecimento tribal", planilha usada como
painel. Baixa resiliência quando há variação de capacidade humana (já fez perder meta).

## 3. Tipos de lead
- **SQL** — leads de restaurante (cliente final).
- **CQL** — parceiros / gestores de tráfego (programa de Parcerias / CW Club).
- **TQL** — recrutamento para vagas comerciais.
- Origem para o Closer: **SDR** (principal), **BDR** (frios), **Parcerias/CQL**, **Closer
  Direto** (lead que já chega pedindo pagamento, sem reunião).

## 4. Times comerciais

### 4.1 SDR (pré-venda — entrada)
- **Canais de entrada:** Growth (anúncios), Orgânico (redes, via Slack manual), Parcerias.
- **Cadência de 8 dias** alternando ligação / e-mail / WhatsApp. SDR gerencia **150–400 leads**
  simultâneos; **200–300 mensagens/dia**.
- **Qualificação BANT / SPIN.** Passagem de bastão: consulta agenda do Closer → marca reunião
  na Meetime → notas → "ganho" → replica no Pipedrive. SDR envia lembretes (anti no-show).
- **Métrica-chave: LTR (Lead Time Response)** — 1º contato em até 5 min, meta **40%**.
- **Gargalos:** trabalho manual (copiar nº Meetime→Kommo); distribuição desigual de leads do
  Slack (quem responde primeiro pega); volume mata qualidade (respostas no automático, objeção
  mal contornada); pulam etapas de qualificação (ex.: esquecem o *timing*).
- **Soluções em curso:** automação **Meetime↔Kommo via n8n** (feita pelo Pedro, já rodando e
  ajudando SDR+BDR); **agente de IA** para atendimento/follow-up/agendamento (→ a Clara IA);
  IA de contorno de objeção; dashboard unificado; feedback automatizado por transcrição.

### 4.2 BDR / BDL (recuperação e reativação)
- Criado para tirar do SDR o "rebater" lead que já passou e não fechou. **100% discagem.**
  Liderado por **Hyorranes**, **5 pessoas**, trabalham ~6h/dia.
- **Trabalha:** *Reopen* (leads que foram a apresentação e não fecharam — perda, no-show, má
  qualificação) e *leads frios* (eventos, indicações de pós-venda).
- **Gatilho de Reopen:** no-show → SDR remarca 1–2x; 3 no-shows encerram o SDR; após **~30–45
  dias** entra no fluxo de Reopen do BDR.
- **Etapas:** Reopen 1 (~30d) → Reopen 2 (~40–50d depois) → Reopen 3 (~+50d). Reopen 4 e 5
  desativados (baixíssima conversão).
- **Gargalos:** leads frios difíceis; **reajuste de preço atrapalhou forte o Reopen** (lead já
  sabia o preço antigo); "cemitério" de cadências na Meetime (~152+ no sistema, ~39 úteis);
  owner não muda quando lead "relevanta a mão"; indicações subaproveitadas; falta 1 full-time.
- **Ambição:** o BDR chegar a **~10% dos clientes novos/mês**.

### 4.3 Closer (fechamento)
- Responsável **exclusivo pelo fechamento**. **8–12 reuniões/dia** por Closer.
- Reunião → follow-up → proposta → atualizar Pipedrive → feedback à pré-venda (no-show/perda).
- **Ferramentas:** Pipedrive, Portal interno, Kommo, Google Meet + extensão de gravação
  (manual), planilhas (remendo). **Playbook existe:** SPIN, matriz de objeções, curva de
  engajamento — mas execução inconsistente, **piorou após reunião cair de 45→30 min**.
- **Gargalos:** follow-up (o maior); uso de WhatsApp pessoal em vez do Kommo (exceção virou
  regra → perde histórico); gravação manual com baixa adesão; não devolvem no-show / não dão
  feedback (prejudica métrica do SDR); **dados Portal x Pipedrive divergem** (dois "números
  oficiais", ticket médio impreciso); esquecem de enviar proposta.
- **Soluções propostas:** travas no CRM (sem proposta → sem ganho; sem feedback → sem perda;
  link de gravação obrigatório); follow-up padronizado em escala; fonte primária de dados única.

### 4.4 Gestão / Lideranças (a líder "Clara", NÃO o bot)
- Times operam em **sprints** (execução + treino/roleplay/seletivo). Ciclo **semanal** com
  lideranças (mini-WBR): métricas, comparação com mês anterior, média diária para bater meta,
  correções ao longo do mês.
- **Meta do Closer = SCORE** (incentiva planos longos). Receita/clientes/ticket são **base de
  cálculo**. Projeção depende de: mix de **tiers (Tier 1/2/3)**, conversão por tier, capacidade
  do time, efeito portfólio. Há **dependência do Rodrigo** para exportar taxas (trava).
- **Travas diagnosticadas:** lideranças juniores sem "musculatura" de dados (acompanham macro,
  não dirigem micro); treino inconsistente (falta repetição, não falta playbook); parte é
  **seleção e ramp**, não só coaching; **gargalo real = pré-vendas** (agenda do Closer não
  enche no início do mês, mesmo com reunião de 30 min); falta automação/observabilidade.
- **Ideia forte (RevOps):** auditoria automatizada de conversas → nota por critério (SPIN) →
  média e padrões de erro; agente no Slack sugerindo resposta com base no playbook.

### 4.5 Parcerias (canal CQL)
- Reorganizado em 3 frentes: **Aquisição** (SDR/Closer de parceiros), **Performance/
  Relacionamento** (visão de Local Channel Manager, mas hoje vira "bombeiro"/reativo) e
  **Atendimento** (em implantação, para liberar o time de performance).
- **ICP do parceiro (E3P):** agências/gestores ligados a food (food marketing, tráfego,
  consultorias).
- **Proposta de valor ao parceiro:** comissão progressiva (começa ~R$80, cresce com volume);
  desconto ao indicado de até **15%**; comunidade/eventos/materiais; **atendimento
  prioritário**; integração **Pixel incluída** nos planos (← diferencial: concorrente cobra).
- **Números citados:** ativação **~20–30%** das contas no mesmo mês; **60+** parceiros entrando/
  mês; participação no resultado **~25%** (dado confuso); exemplo de **161 indicações/mês**,
  **27 direto pro Closer** (conversão **>90%**). Segmentação: 1–5 indicações (precisa
  onboarding pra destravar a 2ª) vs 6+ (alta performance, passivo).
- **Gargalos:** pós-ativação caótico; dados pouco confiáveis (ativação conta pela data de
  criação da conta, não de fechamento); inativos difíceis (regra de 90 dias); comissões
  dependem de associação manual de cupom (300+/mês); time curto + eventos drenam capacidade.

## 5. Métricas e números de referência
> Sempre citar a data/origem; vieram do diagnóstico RevOps (~início 2026).

- **SDR:** 150–400 leads/SDR simultâneos; 200–300 msg/dia; LTR <5min meta 40%.
- **Closer:** 8–12 reuniões/dia; reunião padrão 30 min (era 45).
- **BDR:** ambição ~10% dos novos clientes/mês; Reopen em 3 níveis.
- **Parcerias:** ativação 20–30%/mês; 60+ parceiros/mês; ~25% do resultado; conversão de
  indicação direta ao Closer >90%.
- **Clara IA (bot):** ver `PERFIL-OPERACIONAL.md` e as memórias do projeto (no-show, A/B, etc.).

## 6. Produto, planos, preços e concorrência
> ⚠️ Seção pouco coberta pelos PDFs — **a completar** com material de produto/comercial.
- **Produto:** cardápio digital para restaurantes (eficiência, experiência, conversão no PDV).
- **Planos/preços:** não há tabela nos PDFs. Sinais: houve **reajuste de preço** (impactou
  Reopen); existem **tiers (Tier 1/2/3)**; **planos longos** são incentivados (via SCORE do
  Closer e EXP-16 mensal vs anual da Clara IA).
- **Concorrência:** única menção direta — concorrente **cobra pela integração Pixel**, que a
  CardápioWeb **inclui** nos planos.
- _(ICP de restaurante por segmento — confeitaria/hamburgueria/açaiteria — está no trabalho de
  abertura segmentada da Clara IA; ver memórias do projeto.)_

## 7. Direção estratégica / temas recorrentes
Padrões que aparecem em quase todos os times (úteis para priorizar e responder):
1. **Centralizar a fonte da verdade** (matar planilha-operadora; Portal x Pipedrive x Meetime).
2. **Travas de processo no CRM** (não deixar avançar etapa sem o dado obrigatório).
3. **Automação + IA** (follow-up, auditoria de conversa, contorno de objeção, agente no Slack).
4. **Observabilidade / dashboards executivos** (micro-drivers, não só macro).
5. **Disciplina e ramp** (parte das dores é comportamento e seleção, não ferramenta).

## 8. Glossário
- **SQL / CQL / TQL** — lead de restaurante / parceiro-agência / recrutamento.
- **Reopen** — fluxo de recuperação de leads que não fecharam (BDR), em níveis 1–3.
- **LTR** — Lead Time Response: tempo até o 1º contato (meta <5 min).
- **NMR** — receita líquida (Net MRR/receita) acompanhada no Portal.
- **SCORE** — meta real do Closer, que premia planos longos.
- **Tier 1/2/3** — faixas de cliente/plano usadas no cálculo de meta.
- **E3P** — ICP do parceiro (agências/gestores de food).
- **BANT / SPIN** — frameworks de qualificação / condução de venda.
- **Closer Direto** — lead que chega pedindo pagamento, sem reunião.
- **Portal** — sistema interno (contas, cupons, comissões, dados financeiros).

---

### Fontes (`fontes/`)
- `document_pdf.pdf` — visão geral da empresa e do mandato de RevOps.
- `document_pdf (1).pdf` — time de **BDR/BDL** (Hyorranes): Reopen, cadências, desafios.
- `document_pdf (2).pdf` — time de **Closer**: processo, ferramentas, gargalos, melhorias.
- `document_pdf (3).pdf` — **Gestão/lideranças** (líder "Clara"): metas, SCORE, travas.
- `document_pdf (4).pdf` — time de **SDR** (com Pedro): ferramentas, processo, oportunidades.
- `document_pdf (5).pdf` — canal de **Parcerias** (CQL): frentes, ICP, números, gargalos.
