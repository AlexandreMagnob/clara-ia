# Prompts — Clara (Agente SDR)

Esta pasta contém os system prompts e instruções da **Clara** (agente SDR principal, WhatsApp).

> O prompt do **subagente de agendamento** fica em `../Agente de agendamento/`.

## Conteúdo

- `2026-05-26_system-prompt-clara-v2.9.md` — **versão atual.** System Message + User Prompt prontos para colar no nó `AI Agent`. A Etapa 4 e o Exemplo de Atendimento são injetados pelo Code node do experimento EXP-16.
- `2026-05-14_system-prompt-clara-v2.8.md` — versão anterior (resumida).
- `exp-16_code-node_blocos-etapa4.js` — Code node "Define blocos Etapa 4 (A/B preço)" que injeta os blocos de preço (mensal/anual) no prompt v2.9.

## Como usar

- Cada arquivo `.md` representa um prompt ou bloco de instrução da Clara.
- Ao atualizar um prompt no N8N, salvar a nova versão aqui com o número incrementado (vX.Y), mantendo a anterior como backup.
- O cabeçalho de cada arquivo registra a data de extração e o changelog da versão.

## Convenção de nomenclatura

```
YYYY-MM-DD_system-prompt-clara-vX.Y.md
```

Exemplo: `2026-05-26_system-prompt-clara-v2.9.md`
