# Docs

Conhecimento que **não** é análise nem experimento: como as coisas funcionam e como fazê-las.

| Pasta | Conteúdo |
|---|---|
| `arquitetura/` | Visão geral do sistema, diagramas, decisões técnicas. |
| `integracoes/` | Schema do Supabase, subworkflows do N8N, APIs internas. |
| `processos/` | Tiers, delegação, SLAs — o processo comercial. |
| `guias/` | Passo a passo repetível: "como fazer X". |
| `referencias/` | Documentação de terceiros e base de conhecimento. |

## Guias

- [GUIA-migracao-leads-para-CDP.md](guias/GUIA-migracao-leads-para-CDP.md) — migração
  Supabase → CDP, ponta a ponta.
- [correlacao-leads-para-cdp.md](guias/correlacao-leads-para-cdp.md) — match de leads por
  telefone entre as duas bases.
- [atualizar-leads-metabase.md](guias/atualizar-leads-metabase.md) — atualização da base
  via Metabase.
- [2026-07-15_mudancas-automacao-set-tier.pdf](guias/2026-07-15_mudancas-automacao-set-tier.pdf)
  — handoff dos 8 campos novos do webhook de tier.

## Referências

- [`referencias/kommo/`](referencias/kommo/) — API do Kommo, ~24 páginas.
  Comece pelo [00-INDEX.md](referencias/kommo/00-INDEX.md) ou pelo
  [QUICKSTART-automacao.md](referencias/kommo/QUICKSTART-automacao.md).
- [`referencias/central-de-ajuda/`](referencias/central-de-ajuda/) — a Central de Ajuda da
  CardápioWeb (ajuda.cardapioweb.com) extraída em Markdown, ~130 páginas numeradas por
  módulo do produto. É a base de conhecimento **do sistema**.
- [`referencias/faq-vendas.md`](referencias/faq-vendas.md) — FAQ **pré-venda**: as perguntas
  que o lead faz durante a negociação. Diferente da Central de Ajuda, que ensina a usar o
  produto depois de vendido.

> O contexto de negócio (empresa, funil, times, métricas) **não** fica aqui — fica em
> [../contexto-cardapioweb/](../contexto-cardapioweb/), que o `CLAUDE.md` manda ler primeiro.
