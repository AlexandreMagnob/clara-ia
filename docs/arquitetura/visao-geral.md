# Arquitetura — Visão Geral

**Última atualização:** 2026-05-14
**Workflow principal:** `[SDR] Fluxo Agente SDR` (ID: pTmvz1Qc8wQ6v9aD)

---

## Componentes Principais

| Componente | Tecnologia | Função |
|---|---|---|
| Orquestração | N8N | Todos os workflows e lógica da agente |
| Banco de dados | Supabase (PostgreSQL) | Leads, histórico de conversa, base de conhecimento vetorial |
| WhatsApp | Facebook Graph API v24.0 + EVO API | Entrada e saída de mensagens |
| LLM Principal | Claude (Sonnet) / GPT (A/B test ativo) | Agente principal (Clara) |
| LLM Auxiliar | GPT-4.1-mini / gpt-5.4-nano | Divisão de mensagens + Analista CRM |
| Agendamento | Google Calendar API | Consulta e criação de eventos |
| CRM externo | Kommo, Meetime, Pipedrive | Integrações de funil |

---

## Fluxo Macro

```
Lead preenche formulário
        ↓
Automação N8N mapeia tier (1–5)
        ↓
Tier 1–3 → Vendedores humanos (Meetime)
Tier 4–5 → Clara IA
        ↓
Clara qualifica (BANT) e agenda reunião
        ↓
Closer fecha a venda
```

---

## Arquitetura Interna do Workflow Principal

```
[Webhook EVO]
      ↓
[Variáveis] → extrai: telefone, mensagem, token, em_atendimento, etapa, break
      ↓
[Apaga histórico?] — comando #apagar → deleta lead do Supabase
      ↓
[Filtro] — não é grupo, não está em descanso, etapa != agendado, break = false
      ↓
[mensagens_buffer] — INSERT mensagem
      ↓
[Aguarda 30s] — coleta mensagens simultâneas do lead
      ↓
[Puxa buffer] — SELECT ARRAY_AGG(mensagem) FROM mensagens_buffer
      ↓
[Última mensagem é a atual?] — se não, descarta (evita resposta duplicada)
      ↓
[Zera buffer] — DELETE mensagens_buffer
      ↓
[Get a row] — busca lead no Supabase
      ↓
[Filtro: em_atendimento != false]
      ↓
[AI Agent — Clara] ← (ferramentas: Think, base_conhecimento, atend_humano, agent_agendamento)
      ↓
[Quebra em mensagens curtas] — LLM divide o output em blocos humanizados
      ↓
[Loop por mensagem]
      ↓
[Code: calcula tempo de digitação] — 500ms base + 35ms/caractere
      ↓
[Wait] — simula digitação humana
      ↓
[Get a row1] — busca dados atualizados do lead
      ↓
[Envio via Graph API] — POST WhatsApp Business
      ↓
[Atualiza histórico] — Supabase: conversa, count_messages, last_assistant_updated
```

---

## Subagentes e Ferramentas

### Ferramentas do Agente Principal (Clara)

| Ferramenta | Tipo | Quando acionar |
|---|---|---|
| `Think` | LangChain Think Tool | Sempre antes de responder — obrigatório |
| `base_conhecimento` | RAG (Supabase Vector) | Benefícios, funcionalidades, planos, preços |
| `atend_humano` | Sub-workflow | Lead pede humano, pergunta sem resposta no RAG, agência/gestor, suporte cliente |
| `agent_agendamento` | Sub-agente embedded | Após BANT completo e lead informar turno |

### Sub-workflows referenciados

| Nome | ID N8N | Função |
|---|---|---|
| `[SDR] atend humano` | wKZtbQ1rW9CpQqA5 | Transbordo para humano com resumo do lead |
| `[SDR] Tool consulta_agenda` | HvI38Wr29BZMxQ2e | Consulta slots disponíveis dos closers |
| `[SDR] Tool Agendar Reuniao` | amiFfkwYKu86Wo0C | Cria evento no Google Calendar |

### Ferramentas do Subagente de Agendamento

| Ferramenta | Tipo | Função |
|---|---|---|
| `propor_horarios` | Sub-workflow | Busca horários disponíveis |
| `consulta_disponibilidade` | Google Calendar Tool | Verifica disponibilidade do closer |
| `Agendar reunião` | Sub-workflow | Cria o evento e atualiza Supabase |

---

## Modo de Intervenção Humana

Quando um humano envia mensagem pelo mesmo número:
1. Filtro `Foi enviada pela IA?` detecta `created_by != 'Agent'`
2. `Liga modo de inatividade da IA` → `em_atendimento = false` no Supabase
3. Clara para de responder para aquele lead

Para reativar: mudar `em_atendimento = true` manualmente.

---

## Decisões Técnicas

| Decisão | Escolha | Motivo |
|---|---|---|
| Buffer de mensagens | 30s + PostgreSQL | Aguarda mensagens em sequência do lead antes de responder |
| Simulação de digitação | 35ms/caractere + 500ms base | UX humanizada no WhatsApp |
| Divisão de mensagens | LLM separado (GPT-4.1-mini) | Quebra o output em blocos naturais de WhatsApp |
| A/B test LLM | Claude vs GPT (campo `modelo_llm`) | Mede qual modelo tem melhor taxa de agendamento |
| Guardrail | Filtro de "Vazamento de Thinking" | Evita que o raciocínio interno do LLM apareça na mensagem |
