# Clara IA — Agente SDR da CardápioWeb

Clara é a agente de inteligência artificial responsável pela prospecção de leads de **tier 4 e 5** da CardápioWeb. Seu objetivo é prospectar, engajar e converter esses leads, marcando reuniões para os closers fecharem.

## Como funciona o fluxo

```
Lead preenche formulário
       ↓
Automação mapeia o tier (1–5)
       ↓
Tier 1–3 → Vendedores humanos (Meetime)
Tier 4–5 → Clara IA (prospecção automática)
       ↓
Clara prospecta e converte
       ↓
Reunião agendada → Closer fecha
```

## Stack

| Componente | Tecnologia |
|---|---|
| Orquestração / Workflows | N8N |
| Banco de dados / Leads | Supabase |
| Inteligência | Agente AI (via N8N) |

## Estrutura deste repositório

```
├── docs/
│   ├── arquitetura/     # Visão geral do sistema, diagramas, decisões técnicas
│   ├── processos/       # Processos de vendas, tiers, SLAs
│   └── integracoes/     # Documentação de Supabase, N8N, APIs externas
├── prompts/
│   ├── atual/           # System prompts em produção
│   └── historico/       # Versões anteriores dos prompts
├── ideias/              # Brainstorms e sugestões de melhoria
├── roadmap/             # Planejamento de features
└── analises/            # Análises de métricas e relatórios do Supabase
```
