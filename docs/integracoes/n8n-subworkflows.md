# N8N — Sub-workflows e Integrações

---

## Workflow Principal

| Campo | Valor |
|---|---|
| Nome | [SDR] Fluxo Agente SDR |
| ID | pTmvz1Qc8wQ6v9aD |
| Criado | 2026-01-28 |
| Atualizado | 2026-05-11 |
| Status | Ativo |
| Webhook | POST `/agente-sdr` |

---

## Sub-workflows

### [SDR] atend humano — `wKZtbQ1rW9CpQqA5`
**Quando aciona:** Transbordo para atendimento humano

Inputs recebidos:
- `whatsapp` — número do lead
- `resumo` — resumo estruturado (tópico, dor, solução atual, plano, BANT)
- `nome`
- `email`

Tópicos de transbordo: Pediu humano | dúvidas | parcerias | erro em agendamento | suporte | outros

---

### [SDR] Tool consulta_agenda — `HvI38Wr29BZMxQ2e`
**Quando aciona:** Lead qualificado, precisa de horários disponíveis

Inputs:
- `data e hora` — data atual
- `whatsapp` — número do lead

---

### [SDR] Tool Agendar Reuniao — `amiFfkwYKu86Wo0C`
**Quando aciona:** Lead confirma horário de reunião

Inputs:
- `data_e_hora` — formato ISO 8601, fuso -03:00
- `email_closer`
- `nome_closer`
- `nome_lead`
- `resumo` — (origem, dor, solução atual, plano, budget, authority, timing, temperatura, observações)
- `duracao_reuniao` — em minutos (campo `slot_closer` do lead)
- `empresa`
- `whatsapp`

---

## Integrações Externas

### Facebook Graph API (WhatsApp Business)
- **Versão:** v24.0
- **Phone ID:** 963455253516904
- **Endpoint:** `POST https://graph.facebook.com/v24.0/{phone_id}/messages`
- **Auth:** Bearer token (campo `apikey` vindo do webhook EVO)

### Google Calendar
- **Credential:** Google Calendar - Operações (`6bA2n40mFWUPqQA7`)
- **Uso:** Verificar disponibilidade do closer + criar evento de reunião
- **Fuso:** America/Sao_Paulo (-03:00)

### EVO API (entrada de mensagens)
- **Webhook path:** `/agente-sdr`
- **Campos recebidos:** whatsapp, mensagem, apikey, em_atendimento, etapa_conversa, break

### PostgreSQL (mensagens_buffer)
- **Credential:** Postgres - RevOps (`XOYeTIMfsvkaFsZd`)
- **Uso:** Buffer temporário de mensagens (INSERT/SELECT/DELETE)

---

## Modelos LLM em Uso

| Modelo | Uso | Credential |
|---|---|---|
| Claude (Sonnet) | Agente principal Clara (A/B test) | — |
| GPT (A/B test) | Agente principal Clara (A/B test) | OpenAI - ClarIA (`dHuX6sDGGxT4BmcJ`) |
| gpt-4.1-mini-2025-04-14 | Analista de CRM | OpenAI - Token de uso geral (`z5sdMKuz4ev8Qulo`) |
| gpt-5.4-nano | Divisão de mensagens curtas | OpenAI - ClarIA (`dHuX6sDGGxT4BmcJ`) |

---

## Observação: Nó "Analista de CRM"

O workflow contém um nó `Analista de CRM` com system prompt referenciando "Dra. Georgia Machado — cirurgiã plástica" e agente "Laysa". Esse nó parece ser de **outro projeto** (clínica de cirurgia plástica) que foi incluído no canvas da Clara, possivelmente durante desenvolvimento.

**Confirmado:** Nó órfão — não faz parte do fluxo ativo da Clara. Provavelmente deixado no canvas durante desenvolvimento de outro projeto.
