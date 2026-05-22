# Supabase — Schema e Integração

**Projeto:** CW - Comercial
**ID:** rydlkqomjokkhxghgqde
**Região:** sa-east-1 (São Paulo)
**Status:** ACTIVE_HEALTHY

---

## Tabelas

### `leads` — Tabela Principal (22.359 linhas)

Tabela central de toda a operação. A Clara lê e escreve nela o tempo todo.

| Coluna | Tipo | Descrição |
|---|---|---|
| `lead_id` | uuid PK | Identificador único |
| `date_created` | timestamptz | Criação do lead |
| `date_updated` | timestamptz | Última atualização |
| `name` | text | Nome |
| `whatsapp` | text UNIQUE | WhatsApp (usado como chave de busca) |
| `email` | text UNIQUE | Email |
| `empresa` | text | Nome da empresa |
| `segmento` | text | Açaiteria, Hamburgueria, Pizzaria, etc. |
| `faturamento` | text | Faixa de faturamento informada |
| `etapa_conversa` | text | Estado atual: triagem, abertura, qualificacao, agendado, atendido |
| `conversa` | text | Histórico completo da conversa |
| `tier` | text | Classificação: 1, 2, 3, 3.1, 3.2, 4, 5 |
| `status` | text | `on` = virou cliente (ganho) / `lost` = perdido. Pode ser marcado tanto na prospecção da Clara quanto após a ligação do closer. |
| `motivo_perda` | text | Motivo de perda ⚠️ não preenchido |
| `temperatura` | text | Hot / Warm / Cold (raramente preenchido) |
| `need` | text | Necessidade identificada (BANT - N) |
| `budget` | text | Orçamento disponível (BANT - B) |
| `authority` | text | É decisor? (BANT - A) |
| `timing` | text | Prazo para implementação (BANT - T) |
| `plano_sugerido` | text | Plano recomendado pela Clara |
| `objecoes` | text | Objeções apresentadas |
| `modulos` | text | Módulos de interesse |
| `fidelidade` | text | Mensal / Trimestral / Semestral / Anual |
| `em_atendimento` | boolean | Clara pode responder (default: true) |
| `break` | boolean | Pausar temporariamente (default: false) |
| `closer` | text | Nome do closer designado |
| `closer_email` | text | Email do closer |
| `slot_closer` | numeric | Duração da reunião do closer (minutos) |
| `data_agendamento` | timestamptz | Data/hora da reunião agendada |
| `id_agendamento` | text | ID do evento no Google Agenda |
| `pipedrive_id` | text | ID no funil IA-SDR do Pipedrive |
| `pipedrive_id2` | text UNIQUE | ID do deal após reunião agendada |
| `kommo_id` | text | ID no Kommo CRM |
| `meetime_id` | text | ID no Meetime |
| `conversation_id` | text | ID da conversa no Kommo |
| `repassa_sdr` | boolean | Já foi repassado para SDR humano |
| `count_messages` | integer | Total de mensagens trocadas |
| `followup_count` | integer | Número do follow-up atual |
| `date_next_fup` | timestamptz | Data do próximo follow-up |
| `last_assistant_updated` | timestamp | Última mensagem enviada pela Clara |
| `last_check_crm` | timestamptz | Última análise do agente CRM |
| `observation` | text | Resumo da conversa gerado pela IA |
| `id_start_message` | text | ID da mensagem inicial (verificação de entrega) |
| `tentativas_contato1` | numeric | Tentativas de primeiro contato |
| `created_by` | text | Canal: 'API oficial' ou 'Uazapi' |
| `modelo_llm` | text | Modelo usado no A/B test: 'claude' ou 'gpt' |
| `etapa_repasse` | text | Etapa no momento do repasse |
| `reagendamento` | boolean | Informou que não vai participar |
| `onde_nos_conheceu` | text | Canal de origem |
| `formato_atendimento` | text | Delivery / Presencial / Ambos |
| `ja_usa_concorrente` | text | Usa concorrente? |
| `turno_preferencia` | text | Turno preferido para reunião |
| `utm_source` | text | UTM Source |
| `utm_medium` | text | UTM Medium |
| `utm_campaign` | text | UTM Campaign |
| `utm_content` | text | UTM Content |
| `utm_adset` | text | UTM Adset |
| `utm_ad` | text | UTM Ad |
| `utm_platform` | text | Plataforma (Facebook, Google) |
| `fbclid` | text | Facebook click ID |
| `gclid` | text | Google click ID |
| `ctwaclid` | text | WhatsApp click ID |
| `value` | numeric | Valor da negociação |

---

### `documents` — Base de Conhecimento RAG (26 linhas)

Usada pela tool `consultar_base_info` da Clara.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | bigint PK | |
| `content` | text | Conteúdo do documento |
| `metadata` | jsonb | Metadados |
| `embedding` | vector | Embedding para busca semântica |

---

### `mensagens_buffer` — Buffer de Mensagens (105 linhas)

Armazena mensagens temporariamente enquanto aguarda o buffer de 30s.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | integer PK | |
| `telefone` | text | Número do lead |
| `mensagem` | text | Conteúdo da mensagem |
| `recebido_em` | timestamp | Timestamp de recebimento |

---

### `follow` — Cadência de Follow-ups (10 linhas, RLS ativo)

Define as mensagens e intervalos de cada follow-up.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | bigint PK | |
| `etapa_conversa` | text | Etapa a que se aplica |
| `cadencia` | bigint | Número do follow-up |
| `Intervalo (dia)` | float | Intervalo em dias desde o último follow |
| `mensagem` | text | Mensagem fixa ou template |
| `Prompt` | text | Prompt para gerar mensagem personalizada (dentro de 24h) |
| `link_media` | text | Mídia anexada |
| `template_meta` | text | Nome do template Meta |
| `n_var_templates` | text | Número de variáveis do template |
| `var_template_1/2` | text | Variáveis do template |
| `respondeu` | boolean | Lead respondeu? |

---

### `retry_leads` — Tentativas de Recontato (5 linhas, RLS ativo)

Define intervalos para retentar envio quando o primeiro contato falha.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | bigint PK | |
| `tentativa` | numeric | Número da tentativa |
| `intervalo` | numeric | Intervalo em minutos/horas |

---

### `n8n_chat_histories` — Histórico de Chat N8N (1.118 linhas)

Memória de sessão dos agentes N8N.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | integer PK | |
| `session_id` | varchar | ID da sessão |
| `message` | jsonb | Mensagem (role + content) |

---

### `reunioes_closers` — Avaliação de Reuniões dos Closers (5 linhas)

Transcrição e scoring automático das reuniões de fechamento.

Scores por etapa: abertura, passagem de bastão, PI, necessidade/demonstração, negociação.

---

### `template_kommo` — Templates Kommo (13 linhas, RLS ativo)

Duplicata da tabela `follow` com campo adicional `nome_template`.

---

### `forms / questions / submissions / answers`

Sistema de formulários próprio. `forms` tem 2 formulários, 109 submissions, 282 respostas.

---

### Tabelas de Backup / Descontinuadas

| Tabela | Linhas | Status |
|---|---|---|
| `leads_duplicate` | 2.874 | Backup antigo de leads |
| `colaboradores_duplicate_duplicate` | 279 | Dados de RH (duplicata) |
| `[BACKUP] colaboradores 28_02` | 265 | Backup de fev/2026 |
| `colaboradores_duplicate_duplicate_duplicate` | 265 | Terceira cópia |

> Essas tabelas de backup/RH não têm relação com a Clara. Podem ser limpas em algum momento.

---

## Credenciais N8N → Supabase

| Credential N8N | Nome | Uso |
|---|---|---|
| `kRKH2lDi70K6YQIf` | Supabase - Revenue | Leitura/escrita principal (leads) |
| `r9RGwGeL3HkIev5Y` | Supabase Revosp Geral | Analista de CRM (outro projeto) |
