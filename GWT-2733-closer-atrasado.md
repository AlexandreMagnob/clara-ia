# GWT-2733 — Mensagem automática quando lead entra na reunião e o especialista demora

**Task:** [SM29][CLARA IA][HIP] Mensagem automática quando lead entra na reunião e especialista demora a responder
**Status:** desenho fechado + ajustes de prompt prontos. Falta: editar nós no n8n (Switch + tipo + aviso Slack), exportar `[SDR] atend humano`, rodar execuções, gravar vídeo.

---

## 1. Cenário (o que a task resolve)

1. Lead já está na sala da reunião (Meet), mas o **closer demora a aparecer**.
2. Lead reclama com a Clara no WhatsApp ("o especialista tá demorando").
3. A Clara deve:
   - **(a)** responder o lead tranquilizando ("já avisei o especialista, ele entra em ~2 min");
   - **(b)** acionar a tool `atend_humano` com um **tipo novo** (`reuniao_atrasada`);
   - **(c)** cair numa **vertente nova do Switch** dentro do `[SDR] atend humano`;
   - **(d)** **avisar o closer responsável** (via **Slack** — Alexandre faz essa parte) com o link da reunião;
   - **(e)** no fim, **religar a Clara** (`em_atendimento` volta pra `false`) — porque ninguém assume o chat, a Clara segue como primeiro contato.

> Diferença pros outros casos de transbordo: aqui **não é handoff definitivo**. A Clara só dispara um aviso interno e continua sendo o primeiro contato.

---

## 2. Arquitetura confirmada (homolog, jun/2026)

Caminho vivo:

```
AI Agent - MaraCakes  (prompt v2.8, único agente ativo)
      └─ tool: atend_humano1  (toolWorkflow, id b2fe3220...)
              └─ sub-workflow: [SDR] atend humano  (wKZtbQ1rW9CpQqA5)
                      └─ Switch por tópico  ──► (criar) case reuniao_atrasada
```

- Os agentes "AI Agent v1 / v2 - gm / v2.8 (AI Agent2)" estão **`disabled: true`**. O vivo é **AI Agent - MaraCakes** (id `3ed43f21...`).
- O nó **`atend_humano`** (sem o "1") é só **teste** (whatsapp/email hardcoded `558598527861` / `teste1498@teste.com`) e está **desconectado** (`ai_tool: [[]]`). O real é **`atend_humano1`**.

### Campos que a tool `atend_humano1` envia
| Campo | Origem |
|---|---|
| `whatsapp` | contexto: `$('Variáveis').item.json.telefone` |
| `email` | contexto: `$('Get a row').item.json.email` |
| `nome` | gerado pelo LLM via `$fromAI` |
| `resumo` | gerado pelo LLM via `$fromAI` |

### Como o "tipo" é preenchido HOJE
**Não existe campo `tipo` dedicado.** O tópico é a **1ª linha do `resumo`**, escolhida pelo modelo de um enum embutido na instrução do `$fromAI`:

```
Crie um resumo no seguinte formato:
- Tópico do transbordo: {'Pediu humano', 'dúvidas', 'parcerias', 'erro em agendamento', 'suporte', 'outros'}
- Dor principal:
- Solução atual:
- Plano indicado:
- BANT:
```

O Switch no sub-workflow precisa **parsear esse texto livre** → frágil (variações de acento/plural).

### Flags relevantes (Supabase, tabela `leads`)
- `em_atendimento` (boolean) — **trava a Clara** quando `true`.
- `etapa_conversa` — vira `agendado` após o agendamento.
- `link_reuniao` — link do Meet (o agente já lê na seção "Pós-Agendamento").

---

## 3. Implementação — parte do "tipo" (nó `atend_humano1`)

**Recomendado:** criar um input `tipo` dedicado (enum estrito) e rotear o Switch por ele, em vez de parsear o `resumo`.

**a)** Novo input na tool `atend_humano1`:
```
={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('tipo', `Classifique o motivo do transbordo em UMA destas opções EXATAS (minúsculas, sem acento): pediu_humano | duvida | parcerias | erro_agendamento | suporte | reuniao_atrasada | outros`, 'string') }}
```

**b)** Adicionar `tipo` ao `schema` da tool (igual aos outros campos: `display: true`, `type: "string"`).

**c)** No Switch do `[SDR] atend humano`, criar o case `reuniao_atrasada` chaveando por `{{ $json.tipo }}`.

> **Alternativa mínima** (sem campo novo): adicionar `'reunião atrasada'` ao enum do `resumo` e manter o Switch parseando texto. Funciona, mas mais sujeito a erro.

---

## 4. Implementação — parte do prompt (system message do **AI Agent - MaraCakes**, v2.8)

São **3 inserções**:

**(i)** No final da seção `### atend_humano`, novo gatilho:
```
- O lead JÁ está com etapa_conversa = agendado e reclama que o especialista/closer não entrou na reunião, está atrasado, ou que está esperando sozinho na sala. Neste caso, use o tipo `reuniao_atrasada`.
```

**(ii)** Nova seção, logo após `### Pós-Agendamento — Link da Reunião`:
```
### Reunião — Especialista atrasado
Gatilho: lead com `etapa_conversa = agendado` reclamando que o especialista não entrou na sala / está atrasado / está esperando.

Faça as DUAS coisas na mesma resposta:
1. Acione `atend_humano` com tipo `reuniao_atrasada` e um resumo curto (nome do lead + "aguardando o especialista na sala da reunião").
2. Responda ao lead tranquilizando, SEM dizer que alguém vai chamá-lo no WhatsApp (o especialista entra na SALA da reunião), por exemplo:
   > "Opa, [NOME]! Já avisei o especialista aqui e ele entra na sua sala em pouquinho, uns 2 minutinhos 🙏 Fica na sala que ele já te chama!"

Importante: este caso NÃO encerra a conversa nem transfere o atendimento — você continua sendo o primeiro contato do lead.
```

**(iii)** Em `## Guard-Rails`:
```
- No caso de especialista atrasado, nunca diga que o atendimento foi transferido nem que alguém vai chamar o lead no WhatsApp — o especialista entra na SALA da reunião. Sempre acione `atend_humano` com tipo `reuniao_atrasada`.
```

---

## 5. Aviso ao closer (Slack — Alexandre faz)

Dentro do case `reuniao_atrasada` do `[SDR] atend humano`:
1. `GET` no lead → pega o e-mail do closer responsável.
2. Lookup na **data table de closers** do n8n → retorna a linha do closer (pega o nome).
3. Envia mensagem no **Slack** pro closer, com o **link da reunião** (`link_reuniao`).

Rascunho da mensagem (ajustar tom):
> ⚠️ *Lead esperando na sala!*
> O lead *{nome_lead}* está na sala da reunião e disse que você ainda não entrou.
> 📅 Link: {link_reuniao}
> Consegue entrar agora? Já avisei ele que você chega em ~2 min.

---

## 6. Liga/religa do flag `em_atendimento`

Como a Clara **continua respondendo** nesse caso, o branch `reuniao_atrasada` só pode setar `em_atendimento = true` **momentaneamente** e voltar pra `false` no fim — senão a próxima mensagem do lead bate na trava e a Clara fica muda.
A mensagem de tranquilização sai como `output` do próprio agente na execução atual (não depende da trava), então vai normalmente.

---

## 7. D.O.D da task (anexar no Jira)

1. Print do fluxo n8n com a regra configurada (Switch + case `reuniao_atrasada`).
2. Prints de **3 execuções reais**.
3. Vídeo curto explicando a atividade e o que foi feito.

---

## 8. Pendências

- [ ] Exportar `[SDR] atend humano` (n8n → `⋯` → Download) — não está exportado e o MCP não lê (`availableInMCP: false`).
- [ ] Criar input `tipo` na tool `atend_humano1` + entrada no schema.
- [ ] Criar case `reuniao_atrasada` no Switch.
- [ ] Montar GET lead → lookup closer → aviso Slack (Alexandre).
- [ ] Liga/religa do `em_atendimento` no fim do branch.
- [ ] Aplicar as 3 inserções no prompt v2.8 (AI Agent - MaraCakes).
- [ ] Rodar 3 execuções + prints + vídeo.
