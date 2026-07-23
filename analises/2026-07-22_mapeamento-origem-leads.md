# Mapeamento de origem dos leads — de onde vêm os deals "sem origem"

**Data:** 22/07/2026
**Pergunta:** temos deals que ninguém sabe se vieram de marketing, parcerias ou adição manual — de onde vêm, e como mapear 100%?
**Universo:** deals do Funil de Vendas (pipeline 2) criados de 01/07 a 22/07/2026 (~21h, parcial) — 1.524 deals. Amostra de referência do comercial: 36 ganhos de junho (`analises/dados/`).
**Fontes cruzadas:** Pipedrive (censo completo), RD Station (contato por email), Meetime (lead por email), n8n (varredura dos 766 workflows + execuções reais).
**Horários em Brasília.**

---

## Resumo executivo

1. **20% do funil de julho (305 de 1.524 deals) nasce sem nenhum rastreio de origem** — e vira "Site / Contratação" por um **carimbo automático do Pipedrive**, não porque veio do site. **27% das vendas do mês (167 de 618 ganhos) estão nesse grupo cego.**
2. A causa principal tem data e local: **regressão de abril/2026 no n8n** — o subworkflow que cria o deal quando a Clara agenda reunião deixou de copiar as UTMs que **já estão no Supabase, na mesma query que o fluxo executa**. Lead de Google Ads comprovadamente virou "Contratação".
3. Cruzando por email, **72,5% do grupo cego é mapeável hoje** (68,5% tem fonte na RD, 4% na Meetime). A origem real: 30% tráfego direto, 28% Google, 11% site próprio, 8% Meta, 6% Bing/Brave, **5% ChatGPT/Claude**.
4. O que sobra escuro de verdade (58 deals, 19%) tem padrão: **88% são vendas ganhas** e a criação manual por closer é 4x sobre-representada — é lead de WhatsApp/balcão que entra sem registro, não dado perdido.
5. Com as correções abaixo, a atribuição das vendas sai de ~45% para **~90% imediato**, e os últimos ~10% dependem de processo na criação manual, não de tecnologia.

---

## 1. O censo de julho

| Categoria | Deals | % | Ganhos |
|---|---|---|---|
| Ads rastreado (UTM/gclid/fbclid no deal) | 612 | 40,2% | 276 |
| **Contratação sem rastreio — o grupo cego** | **305** | **20,0%** | **167** |
| Parceria (agente/parceiro identificado) | 236 | 15,5% | 168 |
| "Esqueletos" de integração* | 371 | 24,3% | 7 |
| **Total** | **1.524** | | **618** |

\* *Achado paralelo: 371 deals criados via API sem pessoa vinculada (347/371), sem nenhum campo preenchido, 97% parados em "Reunião Marcada" — lixo de integração poluindo o funil. Não fazem parte do problema de origem (não são leads reais trabalhados), mas merecem investigação e limpeza própria.*

Win rate por categoria: parceria 71,2%, grupo cego 54,8%, ads 45,1%. **O grupo cego converte melhor que o tráfego pago rastreado** — é justamente a fatia mais valiosa que está sem crédito de mídia.

## 2. "Contratação" não é origem — é carimbo default

Dois fatos, provados em execução real:

- **Nenhum workflow do n8n escreve "Razão do Tráfego".** É uma automação nativa **dentro do Pipedrive** que carimba `Site / Contratação / Inbound` em deals criados via API com os campos de origem vazios. Deal 461569: nasceu 21/07 13:04:42 com tudo null; 13:04:56 já estava "Contratação".
- **A regressão de abril/2026:** quando a Clara agenda reunião, o subworkflow `[SDR] Verificação e criação de lead no Pipedrive` (`L1IPQzEV6rk9IovV`, criado 21/04) cria o deal só com título, pessoa, etapa, dono e "Passou por IA". O nó antigo da `[SDR] Tool Agendar Reuniao`, que mapeava utm_source/medium/campaign, gclid e fbclid, está **desabilitado** desde a refatoração. O irônico: o subworkflow **já consulta a linha do lead no Supabase que contém todas as UTMs** — os dados estão a uma expressão de distância. A duplicata enviada ao pipe do closer herda o vazio.
- Prova: execução 105946720 (21/07) — lead com `utm_source=google, utm_medium=paidsearch, utm_campaign=SEARCH_CONCORRENTES_BRASIL_2` no Supabase → deal criado com tudo null → carimbado "Contratação". **Mídia paga sendo contabilizada como contratação espontânea.**

O caminho feliz existe e funciona: lead novo que entra pelo webhook do site e é roteado à Clara ganha deal **com UTM completa** na entrada; no agendamento, a duplicação preserva. O buraco é para lead que chega ao agendamento **sem deal prévio** (voltou depois de dias, entrou por Kommo/bots, importações, tier baixo) — aí o deal nasce pelado.

## 3. De onde os 305 vieram de verdade (join RD + Meetime por email)

| Classe | 305 (todos) | Ganhos (167) |
|---|---|---|
| Fonte recuperada na RD | 209 (68,5%) | 102 (61,1%) |
| Escuro (nem RD, nem Meetime) | 58 (19,0%) | 51 (30,5%) |
| Sem email utilizável | 25 (8,2%) | 6 (3,6%) |
| Só na Meetime (outbound/base) | 12 (3,9%) | 7 (4,2%) |
| Na RD sem sinal de origem | 1 (0,3%) | 1 (0,6%) |

**Fonte real dos 209 recuperados:** direto 62 (30%) · Google 59 (28%, e converte acima da média: 35 won) · site próprio/link-na-bio 22 (11%) · "outros" 19 (9%) · **Meta 16 (8%)** · Bing/Brave/Yahoo 12 (6%) · **ChatGPT/Claude 10 (5%)** · SEO 6 · WhatsApp 2 · YouTube 1.

**Declarado ("como conheceu") × real (RD):**
- Quem declara **"Google" (85)**: só 26% a RD confirma como Google; 14 eram direto, 4 eram Meta.
- Quem declara **"Instagram" (68)**: só **3 viram Meta Ads** na RD — Instagram chega como tráfego direto (link da bio), invisível pra atribuição de campanha.
- **"Outro" (45)** é o maior esconderijo de Meta (8 casos).
- Indicações (74): 16 aparecem como Google e 12 como direto — o indicado pesquisa antes de entrar.
- Conclusão: **o campo autodeclarado não serve como fonte de atribuição** — serve como pista qualitativa, no máximo.

**O padrão dos 58 escuros:** 88% são ganhos; criação manual por closer 4x sobre-representada (dos 21 deals manuais do grupo, 71% são escuros); 6 usam email `@cardapioweb.com` de placeholder no cadastro. É o balcão: lead chega por WhatsApp/telefone, closer cria na mão e a origem morre ali. Os 25 sem email: 100% via API, 56% perdidos, 7 com email-lixo (",,", "-", ".").

## 4. Meta Ads: meio-rastreado até quando rastreia

Dentro dos 612 "rastreados": 167 sem `utm_source`, mas 143 têm `utm_medium=paid` e 92 têm fbclid — **Meta chega com clique pago identificável e sem nomear a fonte**. Além disso: 29 deals com `utm_campaign={campaignname}` literal (macro não resolvida no template de URL do anúncio) e 62 com ID numérico de campanha no lugar do nome. O template de UTM das campanhas Meta precisa de revisão.

## 5. O caminho para mapear 100%

Do universo atribuível de julho (1.524 − 371 esqueletos − 236 parcerias já conhecidas = **917 deals**): rastreados hoje 612 (67%) → com o join RD/Meetime **833 (91%)** → o resto é processo. Nas **vendas**: atribuição sobe de 72% (444/618, contando parceria) para **~90% (553/618)**; os ~10% finais são os escuros de criação manual.

Frentes de correção (sem ordem de prioridade — a decisão é de vocês):

- **[A] Reativar o mapeamento de UTM no n8n** — 1 nó: copiar o bloco de campos do nó desabilitado da Tool para o `Create a deal` do `L1IPQzEV6rk9IovV`, lendo da query ao Supabase que o fluxo já faz. Estanca o vazamento na fonte para todos os agendamentos da Clara daqui pra frente.
- **[B] Enriquecimento retroativo e contínuo via RD** — job que, para deal sem UTM, consulta a RD por email e preenche os campos [TRACK] (o join desta análise provou 68,5% de acerto). Pode rodar retroativo em julho e ficar de vigia diário.
- **[C] Processo na criação manual** — closer que cria deal na mão registra o canal (campo obrigatório ou atalho no formulário). Ataca os 19% escuros, que são 30% dos ganhos cegos.
- **[D] Corrigir template de UTM do Meta** — resolver a macro `{campaignname}` e padronizar utm_source (16 recuperados + 92 fbclid sem source somem na origem).
- **[E] Limpar e estancar os esqueletos** — investigar qual integração cria os 371 deals vazios e tratar (é 1/4 do funil poluído; distorce qualquer taxa por etapa).

## Arquivos da análise

- `analises/dados/2026-07-22_censo-origem-deals-julho.csv` — 1.524 deals classificados (categoria, campos de origem, criador)
- `analises/dados/2026-07-22_grupo-cego-join-rd-meetime.csv` — os 305 com classe e fonte real (email só por domínio)

---

*Método: censo via API v2 do Pipedrive (15 campos de origem decodificados por enum); RD Station via `GET /platform/contacts/email:` (196/265 emails encontrados); Meetime via `GET /v2/leads?email=` (200/265; busca por telefone não suportada pela API); n8n via API REST (766 workflows varridos, execuções reais inspecionadas). Nenhuma escrita em nenhum sistema.*
