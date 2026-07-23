# Análises

Investigações fechadas: uma pergunta, os dados que responderam, a conclusão.
É o **resultado**. O plano de um experimento vive em [../experimentos/](../experimentos/).

## Estrutura

| Pasta | Conteúdo |
|---|---|
| *(raiz)* | Os documentos de análise, um por investigação. |
| `dados/` | CSV, XLSX, SQL e JSON brutos que embasam as análises. |
| `templates/` | Modelos para começar uma análise nova. |
| `_pipeline/` | Scripts e dumps brutos de uma extração antiga. Material interno. |

## Convenção

```
AAAA-MM-DD_<slug>.md          ← a análise
dados/AAAA-MM-DD_<slug>.csv   ← os dados que a sustentam
```

A data é a da **investigação**, não a do período analisado. Tudo flat na raiz: com o prefixo
de data o `ls` já ordena cronologicamente, e `grep -r` acha o assunto sem você lembrar o mês.

Quando uma análise vira PDF/HTML para compartilhar, o export fica ao lado com o mesmo nome
base (`2026-07-16_analise-no-shows-06a16-07.md` + `.pdf`).

## Antes de puxar número

Sempre acertar **como ancorar a busca** antes de rodar a query — a âncora errada muda o
resultado. Casos já resolvidos:

- **Agendamento** ancora em `data_agendamento`, não em `date_created` — o pull roda 1× por
  dia e não revisita registros antigos.
- **Lead da Clara** é `usuario = 'clara'`. Sem esse filtro entra lead de SDR humano.
- **Métrica de LLM** reporta GPT + V4 + total; **ROI** reporta total + por nicho. "Total"
  aqui significa a taxa agrupada, não a soma.
- **Pipedrive**: o validador é o campo "Passou por IA = Sim". Cuidado com deals duplicados,
  que inflam KPI.

## Índice das principais

| Data | Análise |
|---|---|
| 2026-07-20 | [Reconciliação do baseline GWT-2729 / EXP-19](2026-07-20_reconciliacao-baseline-gwt-2729.md) · [Leads sem empresa](2026-07-20_leads-sem-empresa.md) |
| 2026-07-16 | [No-shows 06–16/07](2026-07-16_analise-no-shows-06a16-07.md) |
| 2026-07-15 | [Verificação da automação de status do lead no CDP](2026-07-15_verificacao-automacao-status-lead-cdp.md) |
| 2026-06-24 | [Performance da Clara em junho](2026-06-24_analise-performance-clara-junho.md) |
| 2026-05-29 | [Atribuição da Clara](2026-05-29_analise-atribuicao-clara.md) |
| 2026-05-15 | [Falhas da Clara](2026-05-15_analise-falhas-clara.md) · [Análise profunda](2026-05-15_analise-profunda.md) |
| 2026-05-14 | [Análise inicial completa](2026-05-14_analise-inicial-completa.md) · [Mapa de dúvidas dos leads](2026-05-14_mapa-duvidas-leads.md) |
