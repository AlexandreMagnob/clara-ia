# Clara IA — Agente SDR da CardápioWeb

Clara é a agente de IA responsável pela prospecção dos leads de **tier 4 e 5** da CardápioWeb:
prospecta, engaja, contorna objeção e agenda reunião para o closer fechar.

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

| Componente | Tecnologia |
|---|---|
| Orquestração / Workflows | N8N |
| Banco de leads (atual) | Supabase |
| Banco de leads (migração) | CDP / Postgres |
| CRM | Kommo · Pipedrive · Meetime · RD Station |
| Inteligência | Agente AI (via N8N) |

---

## Mapa do repositório

| Pasta | O que vive aqui |
|---|---|
| [contexto-cardapioweb/](contexto-cardapioweb/) | **Leia primeiro.** Contexto da empresa e do meu papel. |
| [automacoes/](automacoes/) | Todos os workflows exportados do N8N + salesbots do Kommo. |
| [prompts/](prompts/) | System prompts da Clara e dos subagentes, versionados. |
| [experimentos/](experimentos/) | Specs e planos de experimento (GWT-xxxx, EXP-xx, SM30Hx). |
| [analises/](analises/) | Investigações e relatórios de métricas — o **resultado**. |
| [dashboards/](dashboards/) | Painéis HTML standalone. |
| [design-system/](design-system/) | Tokens, componentes e style guide da marca CW — base visual de páginas, dashboards e plataformas. |
| [plataforma-experimentos/](plataforma-experimentos/) | Máquina de Experimentos — app de hipóteses e pós-mortem (GWT-3144). |
| [plataforma-ab/](plataforma-ab/) | Teste A/B de landing page — roteador, tracking e trava estatística (GWT-3256). |
| [docs/](docs/) | Arquitetura, integrações, processos, guias e referências. |
| [planejamento/](planejamento/) | Roadmap e backlog de ideias. |
| [estudos/](estudos/) | Notas de podcasts, cursos e material de estudo. |
| [scripts/](scripts/) | Scripts utilitários avulsos (Python / PowerShell). |
| [assets/](assets/) | Mídia: imagens, áudios e vídeos de lembrete. |

---

## Onde eu coloco uma coisa nova?

Regra de bolso — **se a resposta for "sei lá", é `docs/`**.

| Se é… | Vai em… | Nome |
|---|---|---|
| um workflow exportado do N8N | `automacoes/<área>/` | `<área>_<slug>.json` |
| um salesbot do Kommo | `automacoes/salesbots/<sdr>/` | nome do estágio (`followup-1.json`) |
| um system prompt novo | `prompts/<agente>/` | `AAAA-MM-DD_system-prompt-<agente>-vX.Y.md` |
| o **plano** de um experimento | `experimentos/` | `<codigo>_<slug>.md` |
| o **resultado** de uma investigação | `analises/` | `AAAA-MM-DD_<slug>.md` |
| CSV / XLSX / SQL que embasa uma análise | `analises/dados/` | `AAAA-MM-DD_<slug>.csv` |
| um passo a passo repetível | `docs/guias/` | `<slug>.md` |
| doc de API de terceiro | `docs/referencias/<produto>/` | `<slug>.md` |
| uma ideia solta, ainda não validada | `planejamento/backlog-de-ideias.md` | — |
| uma aplicação com front + API própria | `plataforma-<slug>/` | pasta com `README.md` próprio |
| CSS/token/asset visual da marca | `design-system/` | ver o `README.md` da pasta |
| **qualquer coisa com senha/token** | **fora do repo** | veja abaixo |

### Convenções de nome

- **Sem acento, sem espaço, sem colchete.** `kebab-case`, minúsculo.
- **Data primeiro** (`AAAA-MM-DD_`) em tudo que é retrato de um momento — análise,
  relatório, versão de prompt. Faz o `ls` ordenar cronologicamente sozinho.
- **Sem data** no que é vivo e vai sendo editado — guia, referência, workflow, roadmap.
- Nos JSON do N8N, o prefixo antes do `_` é a área (`sdr_`, `jira_`, `sql_`), espelhando
  o `[SDR]` / `[JIRA]` do nome do workflow no N8N.
- Pasta ou arquivo começando com `_` é material interno/bruto que não precisa ser lido
  (ex: `analises/_pipeline/`, `automacoes/_versoes-antigas/`).

---

## Segurança

Credenciais **nunca** entram no repositório. O `.gitignore` já bloqueia `.env`,
`CONEXAO.md` e arquivos `*-credenciais.md`, mas o filtro é burro — confira antes de commitar:

```bash
git status --short          # olhe se entrou algo que não devia
git diff --cached           # antes de todo commit
```

Se um segredo já foi commitado, rotacione a senha — remover do histórico não basta,
ela já esteve exposta.
