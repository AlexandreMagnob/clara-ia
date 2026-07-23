# Prompts

System prompts dos agentes, versionados. Um arquivo por versão — a anterior **nunca** é
sobrescrita, serve de backup e de diff.

| Pasta | Agente |
|---|---|
| `clara-sdr/` | Clara, a agente SDR principal (WhatsApp). |
| `agendamento/` | Subagente de agendamento, chamado pela Clara. |
| `eventos/` | Variantes para eventos presenciais (ex: Fispal). |

## Qual é a versão em produção?

**A de maior número de versão.** Hoje:

| Agente | Em produção |
|---|---|
| Clara SDR | [`clara-sdr/2026-06-19_system-prompt-clara-v2.12.md`](clara-sdr/2026-06-19_system-prompt-clara-v2.12.md) |
| Agendamento | [`agendamento/system-prompt-agendamento-v2.8.md`](agendamento/system-prompt-agendamento-v2.8.md) |
| Eventos (Fispal) | [`eventos/2026-06-04_system-prompt-clara-eventos-fispal-v1.0.md`](eventos/2026-06-04_system-prompt-clara-eventos-fispal-v1.0.md) |

Não existe pasta `atual/`: ela sempre desatualiza quando alguém esquece de mover o arquivo.
O número da versão é a fonte da verdade.

## Convenção

```
AAAA-MM-DD_system-prompt-<agente>-vX.Y.md
```

A data é a da extração do N8N. O cabeçalho de cada arquivo registra o changelog da versão.

## Ao atualizar um prompt no N8N

1. Salve a nova versão aqui com o número incrementado — **não edite a versão anterior**.
2. Escreva no cabeçalho o que mudou e por quê (qual GWT/EXP motivou).
3. Atualize a tabela "Em produção" acima.

## Injeção dinâmica

Partes do prompt da Clara não estão nestes arquivos: são montadas em tempo de execução por
Code nodes do N8N, que ficam junto do experimento que os criou, em
[../experimentos/](../experimentos/) —

- `exp-16_code-node-blocos-etapa4.js` injeta os blocos de preço (mensal/anual) na Etapa 4.
- `sm30h7_code-node-prova-social.js` injeta o caso real do nicho/região na Etapa 3.

Ou seja: lendo só o `.md` você não vê o prompt final. Confira os Code nodes ativos antes de
concluir que um comportamento "não está no prompt".
