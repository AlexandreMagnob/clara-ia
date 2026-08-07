# Ferramentas de teste A/B de landing page — pesquisa e decisão

> GWT-3256 · Alexandre · 06/08/2026
> Item 1 do D.O.D: "documento com as ferramentas pesquisadas e a decisão (usar pronta ou construir)".

## O que a gente precisa resolver

A atividade pede uma ferramenta que faça quatro coisas:

1. **Roteamento na URL do anúncio** servindo variantes diferentes da página.
2. **Tracking por variante** (quem viu o quê, quem converteu).
3. **Trava de amostra mínima e significância** antes de declarar vencedor.
4. **Aviso no Slack** quando houver vencedor.

O contexto restringe muito a escolha, e é ele que decide:

- As nossas LPs são **WordPress + Elementor** em `lp.cardapioweb.com` e `cardapioweb.com`.
  Não é um app Next.js nosso — não dá pra fazer rewrite de rota no servidor da página.
- O tráfego entra por **anúncio** (Meta Ads e Google Ads), então **a gente controla a URL
  do anúncio**. Esse é o ponto de injeção natural.
- A conversão é **envio de formulário Elementor**, que já é interceptado pelo mu-plugin
  `cw-site-tracking.php` e mandado pro `wp-json/cw/v1/ingest`.
- Volume: LP de Meta Ads roda na casa de centenas a poucos milhares de sessões por
  experimento (o EXP-44 fechou "Inconclusiva" justamente por amostra).

## As duas famílias de ferramenta

### Família 1 — client-side (editor visual + JS na página)

VWO, AB Tasty, Kameleoon, Convert, Optimizely Web. O script roda no navegador, esconde a
página, troca os elementos e mostra de novo.

**Como funcionam por dentro:** snippet síncrono no `<head>` → decide a variante → aplica
mutações no DOM → cookie guarda a variante pra visita seguinte ficar consistente.

**Por que não serve pra gente:**

- **Flicker.** O anti-flicker esconde a página até o script decidir. Em LP de anúncio,
  onde metade do tráfego é mobile 4G, isso é conversão jogada fora.
- **Conflito conhecido com o nosso WordPress.** O `cardapioweb-tracking.php` tem uma regra
  no output buffer que **apaga snippet de terceiro** — foi o que sumiu com o snippet
  oficial do Clarity em 31/07 e obrigou a criar o loader `cw-clarity` no mu-plugin. Botar
  mais um snippet de terceiro ali é comprar o mesmo problema.
- **WP Rocket.** A página é servida de cache estático; qualquer coisa que dependa de ordem
  de execução de script no `<head>` vira loteria.
- **Preço.** Ver tabela abaixo.

### Família 2 — split URL / redirect test

VWO Split URL, Convert, Zoho PageSense. O visitante cai numa URL, a ferramenta sorteia e
**redireciona** pra URL da variante.

**Como funcionam por dentro** (foi daqui que a gente copiou o método):

- O visitante **sempre chega na URL de controle**, nunca direto na variante.
- Cookie de campanha (`_vis_opt_exp_<ID>_combi`, no VWO) guarda a variante — visita
  seguinte cai na mesma. É o *sticky assignment*.
- O VWO cria um `_vwo_referrer` porque **o redirect perde o referrer original** — se você
  não guardar, o relatório de origem do tráfego quebra.
- A URL de variante é um **template com token** (`$1`, `$2`) preenchido com o que foi
  capturado da URL de controle, pra preservar contexto (região, categoria) e os UTMs.
- Redirect é **302, nunca 301**, e a variante leva `rel=canonical` apontando pro controle —
  senão o Google tira a página original do índice e põe a variante no lugar.

**Serve pra gente.** É exatamente o formato "URL do anúncio" que a atividade descreve.

### Família 3 — open source / feature flag

GrowthBook, PostHog, Unleash, Flagsmith.

**Como funcionam por dentro:** SDK no app faz *hash determinístico* do id do visitante
junto com a chave do experimento e converte num número de 0 a 1; esse número cai numa
faixa de bucket que define a variante. Sem sorteio aleatório e sem ida ao servidor — o
mesmo visitante sempre cai na mesma variante.

O GrowthBook publica a spec da função ([Build Your Own SDK](https://docs.growthbook.io/lib/build-your-own)):

```
hashVersion 2:  n = fnv32a( fnv32a(seed + value) + "" )
                return (n % 10000) / 10000
```

E o `getBucketRanges(numVariacoes, cobertura, pesos)` transforma peso + cobertura em faixas
cumulativas — `getBucketRanges(2, 1, [0.5,0.5])` → `[[0,0.5],[0.5,1]]`.

Eles também fazem duas coisas que a gente **tem** que copiar:

- **Sticky bucketing** — trava a variante no primeiro contato, pra mudança de configuração
  no meio do teste não reatribuir ninguém.
- **Sample Ratio Mismatch (SRM)** — checagem automática de saúde: se a divisão real do
  tráfego desviar do esperado, o resultado inteiro é suspeito e não vale.

**Por que não adotamos direto:** são SDKs pra dentro de aplicação (React, Node, Python).
Nenhum deles resolve "o anúncio aponta pra cá e o visitante tem que sair redirecionado pra
uma de duas páginas de WordPress". A gente usaria 5% da ferramenta e ainda precisaria
construir o roteador — que é justamente a parte que a atividade pede. Self-host do
GrowthBook ainda traria Docker + Mongo + um serviço a mais pra manter.

## Preço das prontas (consulta em 06/08/2026)

| Ferramenta | Entrada | Observação |
|---|---|---|
| VWO | Free até 10k MTU · Growth ~US$ 314/mês (anual) | Pro ~US$ 722/mês |
| Convert | US$ 299/mês (100k testados) | Pro US$ 499/mês |
| Kameleoon | US$ 495/mês (50k MTU) | Enterprise ~US$ 35k/ano |
| AB Tasty | sob consulta, ~US$ 1–3k/mês | contrato médio ~US$ 45k/ano |
| Optimizely | sob consulta, ~US$ 63k/ano | |
| GrowthBook / PostHog | grátis (OSS / free tier) | não fazem redirect de LP |

## Decisão: **construir**, copiando o método das prontas

Três razões, em ordem de peso:

1. **Nenhuma pronta resolve o nosso caso sem a peça que a gente teria que construir
   assim mesmo.** A única família que serve é split URL, e nela a ferramenta não faz nada
   além de um 302 com cookie — 60 linhas de código no edge.
2. **Custo.** O tier grátis do VWO cobre o nosso volume hoje, mas o script client-side
   colide com o `cardapioweb-tracking.php` e com o WP Rocket, que são problemas que a gente
   já pagou pra descobrir. E a partir do momento que passar de 10k MTU, é US$ 314/mês pra
   uma coisa que roda de graça na Vercel.
3. **A trava estatística é o real valor da atividade, e nenhuma pronta barata entrega.**
   O pedido é explícito: *"trava de amostra mínima / significância estatística antes de
   declarar vencedor, pra não decidir com falso positivo"*. Ferramenta de tier grátis mostra
   "95% de chance de ganhar" atualizado em tempo real, que é **exatamente o falso positivo
   que a gente quer evitar** (o problema do *peeking*: parar no primeiro p < 0,05 leva o
   erro tipo I a ~100%). A gente precisa da trava, não do medidor.

### O que a gente copiou de cada uma

| De onde | O que | Onde está no código |
|---|---|---|
| VWO / Convert (split URL) | 302 + cookie sticky + preservar UTMs + guardar o referrer perdido no redirect | `api/t.js` |
| Google Search Central | 302 (nunca 301) + `rel=canonical` da variante apontando pro controle | `docs/como-criar-um-teste.md` |
| GrowthBook | hash determinístico FNV-1a 32 (hashVersion 2) + faixas de bucket + sticky bucketing | `lib/hash.js` |
| GrowthBook / Microsoft (*Trustworthy Online Controlled Experiments*) | checagem de SRM por qui-quadrado, corte p < 0,001 | `lib/estatistica.js` |
| Optimizely (mSPRT, no produto desde 2015) | p-valor sempre-válido, que permite olhar o resultado a qualquer momento sem inflar falso positivo | `lib/estatistica.js` |
| Prática padrão de CRO | amostra mínima por poder estatístico (α=5%, poder=80%) + ciclo mínimo de 7 dias | `lib/estatistica.js` |

## O que a gente deliberadamente NÃO copiou

- **Editor visual.** A variante é uma página de verdade no WordPress, feita no Elementor.
  Sem mutação de DOM, sem flicker, sem snippet de terceiro pra ser apagado pelo output buffer.
- **"Probabilidade de ser o melhor" em tempo real.** É o que induz a parar cedo. O painel
  mostra o resultado, mas o veredito só sai com as travas atendidas.
- **Bandit / alocação dinâmica.** Complica a leitura e não resolve problema que a gente tem.
- **Tokens de URL (`$1`, `$2` do VWO).** Servem pra casar controle e variante por regex em
  site com muita página dinâmica (categoria, produto, região). As nossas LPs de anúncio são
  meia dúzia de URLs fixas — o roteador preserva os parâmetros de entrada, e isso basta.
  Se um dia precisar, é onde `montarDestino()` em `lib/config.js` cresce.

## Fontes

- [VWO — How to Create a Split URL Test](https://help.vwo.com/hc/en-us/articles/360021172854-How-to-Create-a-Split-URL-Test-in-VWO)
- [VWO — Things to Consider While Working with Split URL Testing](https://help.vwo.com/hc/en-us/articles/900001124423-Things-to-Consider-While-Working-with-Split-URL-Testing-in-VWO)
- [GrowthBook — Build Your Own SDK (spec do hash)](https://docs.growthbook.io/lib/build-your-own)
- [GrowthBook — Sticky Bucketing](https://docs.growthbook.io/app/sticky-bucketing)
- [Google Search Central — A/B Testing Best Practices for Search](https://developers.google.com/search/docs/crawling-indexing/website-testing)
- [Johari, Pekelis, Walsh — Always Valid Inference (mSPRT)](https://arxiv.org/pdf/1512.04922)
- [Johari et al. — Peeking at A/B Tests (KDD 2017)](http://library.usc.edu.ph/ACM/KKD%202017/pdfs/p1517.pdf)
- [Microsoft Research — Diagnosing Sample Ratio Mismatch in A/B Testing](https://www.microsoft.com/en-us/research/articles/diagnosing-sample-ratio-mismatch-in-a-b-testing/)
- [Convert — How Much Do A/B Testing Tools Cost](https://www.convert.com/blog/a-b-testing/ab-testing-tools-pricing-breakdown/)
- [Vercel — A/B testing with Edge Middleware](https://vercel.com/docs/edge-middleware)
