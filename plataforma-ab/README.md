# Plataforma de teste A/B de landing page — GWT-3256

Ferramenta do Growth pra rodar teste A/B de LP: a URL do anúncio aponta pra cá, cada
visitante é sorteado numa variante, a conversão é rastreada por variante, e o vencedor só
é declarado quando as travas estatísticas fecham. Aviso no Slack quando há decisão a tomar.

**Ainda não publicada.** Roda local hoje; o alvo é a Vercel. Ver [Publicar](#publicar).

## Por que existe (e por que não é uma ferramenta pronta)

A pesquisa completa e a decisão estão em
[`docs/pesquisa-ferramentas.md`](docs/pesquisa-ferramentas.md). Resumo em três linhas:

- A única família de ferramenta que serve pro nosso caso (LP em WordPress + tráfego de
  anúncio) é **split URL test**, e nela a ferramenta paga não faz nada além de um 302 com
  cookie — a parte que a atividade pede pra construir.
- O script client-side do VWO/AB Tasty colide com o `cardapioweb-tracking.php` (que já
  apagou o snippet do Clarity em 31/07) e com o WP Rocket.
- **A trava estatística é o valor real**, e ferramenta de tier grátis entrega o oposto:
  "95% de chance de ganhar" atualizado em tempo real, que é o falso positivo que a
  atividade manda evitar.

O método veio das prontas: hash determinístico do **GrowthBook**, redirect 302 + cookie do
**VWO**, p-valor sempre-válido (mSPRT) da **Optimizely**, checagem de SRM do
**Trustworthy Online Controlled Experiments**.

## Como funciona

```
  anúncio (Meta/Google)
        │  https://<plataforma>/t/hero-lp-sql?utm_source=meta&utm_campaign=sm33
        ▼
  ┌─────────────────────────────────────────────────────────┐
  │ api/t.js — ROTEADOR                                     │
  │  1. bot/prefetch?  → controle, não conta                │
  │  2. cookie cwab_vid (cria se não tem)                   │
  │  3. hash(seed, vid) → variante  (mesmo vid = mesma var.)│
  │  4. confere domínio permitido                           │
  │  5. GRAVA a atribuição  ← este é o denominador          │
  │  6. 302 (nunca 301), cache desligado                    │
  └─────────────────────────────────────────────────────────┘
        │  https://lp.cardapioweb.com/sql-b?utm_source=meta&cwab=hero-lp-sql:B&cwvid=…
        ▼
  ┌─────────────────────────────────────────────────────────┐
  │ LP no WordPress + app/ab.js                             │
  │  · manda `view`                                         │
  │  · injeta form_fields[cw_ab] escondido no formulário    │
  │  · no submit_success do Elementor → manda `conversion`  │
  └─────────────────────────────────────────────────────────┘
        │
        ▼  api/ev.js  (recusa `assignment` — só o servidor cria atribuição)
  ┌─────────────────────────────────────────────────────────┐
  │ api/analisar.js — JOB DIÁRIO (Vercel Cron 09h BRT)      │
  │  agrega → aplica as travas → avisa no Slack SE MUDOU    │
  └─────────────────────────────────────────────────────────┘
```

### As duas regras de integridade que sustentam tudo

1. **O denominador é a atribuição gravada no servidor, nunca o pageview.** O pageview
   depende de JS carregar; se uma variante é mais lenta ou tem mais bloqueador, o
   denominador vem enviesado a favor dela. A conta fecha e o número está errado.
2. **Conversão é contada contra a variante ATRIBUÍDA, não contra a que o navegador
   declara.** O evento vem do cliente e é editável. A agregação ignora o que ele diz e usa
   a atribuição do servidor; conversão de visitante nunca atribuído é descartada.

Estão implementadas em [`lib/store.js`](lib/store.js) (`agregar`) e refeitas em SQL na
visão `ab_resumo` do [`schema.sql`](schema.sql), pra dar pra auditar por fora.

## A trava

Vencedor só sai com **as três** fechadas — detalhe e fórmulas em
[`docs/estatistica.md`](docs/estatistica.md):

| Trava | O que exige | Por quê |
|---|---|---|
| **Ciclo mínimo** | 7 dias corridos (configurável) | menos de uma semana mede dia da semana, não a variante |
| **SRM** | qui-quadrado da divisão do tráfego, p ≥ 0,001 | divisão torta = teste quebrado; o resultado não vale, e nenhuma conta conserta |
| **Origem do tráfego** | nenhum IP com ≥ 25% das atribuições | laço, teste de carga ou monitor entrando na amostra |
| **Evidência** | amostra planejada + z-test **OU** mSPRT cruzou | duas rotas legítimas: análise pré-registrada, ou parada antecipada válida |

Com mais de um desafiante, o corte de cada comparação encolhe por **Šidák** — sem isso, 6
braços davam 20,1% de falso positivo em teste A/A, contra os 5% prometidos.

A trava de SRM é a que mais salva: ela pega redirect falhando, bot num braço só, cache
servindo errado — coisas que a taxa de conversão sozinha nunca denuncia.

**O plano de análise é congelado quando o teste começa.** Baseline, MDE, alfa, poder, dias
mínimos/máximos, pesos, seed, URLs e a **ordem** das variantes não mudam com o teste no ar —
a plataforma recusa a gravação. Mexer neles remexe a amostra alvo ou reatribui quem já
entrou, e nos dois casos o veredito sai fabricado sem nada denunciar.

## Arquivos

| Onde | O quê |
|---|---|
| `api/` | funções da Vercel: `t.js` (roteador), `ev.js` (ingestão), `testes.js` (CRUD), `resultados.js`, `analisar.js` (job + Slack) |
| `lib/` | `hash.js`, `estatistica.js`, `store.js`, `config.js`, `bots.js`, `http.js`, `tempo.js`, `slack.js`, `analise.js` |
| `app/` | `index.html` (painel) e `ab.js` (snippet da LP) |
| `scripts/` | `analisar.js` (rodar o job à mão), `semear-demo.js` |
| `testes/` | kit de teste — ver abaixo |
| `docs/` | pesquisa, estatística, como criar um teste, evidências |
| `schema.sql` | Postgres/Supabase |

Sem dependência de npm. Node 20+, tudo com biblioteca padrão.

## Rodar local

```bash
node scripts/semear-demo.js                 # dados de demonstração
node testes/dev-server.js --porta 3100      # painel + API + LPs de mentira
# painel: http://localhost:3100/   ·   token: dev-token
```

## Kit de teste

```bash
node testes/ataques.js                 # 60 · entrada hostil no nível HTTP
node --test testes/unidade.js          # 54 · unidade
python testes/validar_estatistica.py   # 48 · estatística contra rota independente em Python
node testes/store-supabase.js          # 20 · driver do Supabase contra PostgREST de mentira
node testes/simulacao.js               # 13 · ponta a ponta, com tráfego simulado
node testes/snippet-dom.js             # 11 · o ab.js real num DOM de mentira
node testes/slack-local.js             #  6 · caminho do Slack contra receptor local
node testes/aa-falso-positivo.js       #  4 · teste A/A: mede o falso positivo de verdade
node testes/capturar.js                #      prints de evidência (precisa do dev-server)
```

**216 checagens no total.** Quatro merecem explicação:

- **`validar_estatistica.py`** é o que dá confiança no resto: refaz cada conta (`erfc`,
  quantil da normal, qui-quadrado, z-test, amostra por poder, mSPRT) por rota independente
  usando só a stdlib do Python, e compara. Bate em ~1e-15.
- **`aa-falso-positivo.js`** roda testes A/A (variantes idênticas) e conta quantos
  "vencedores" aparecem. É a única prova honesta de que a trava faz o que promete — foi
  ele que mostrou os 20,1% de falso positivo com 6 braços antes da correção de Šidák.
- **`ataques.js`** cobre o meio que os outros não pegam: a fiação dos endpoints. Regra de
  ouro dele — nenhuma entrada pode produzir 500. 400 é resposta, 500 é bug.
- **`store-supabase.js`** existe porque em desenvolvimento só o driver de **arquivo** roda —
  o do Supabase estrearia em produção. Ele confere o protocolo (`on_conflict`, headers
  `Prefer`, paginação além de 1000 linhas), não o Postgres.

### QA adversarial

A plataforma passou por uma rodada de QA adversarial antes de subir, com veredito inicial
**NÃO SUBIR**. Sete furos foram corrigidos; os testes acima incluem a regressão de cada um.
O registro completo está em [`docs/qa-achados.md`](docs/qa-achados.md).

## Publicar

Ainda **não** foi publicado. Quando for:

1. Criar projeto na Vercel apontando pra `plataforma-ab/`.
2. Criar o banco (Supabase) e rodar o [`schema.sql`](schema.sql).
   ⚠️ Projeto **isolado** do Supabase da Clara IA — aquele tem tabelas sem RLS legíveis
   pela `anon key`, e esta plataforma serve um site público.
3. Variáveis de ambiente:

| Variável | Pra quê |
|---|---|
| `AB_STORE` | `supabase` em produção |
| `AB_SUPABASE_URL` / `AB_SUPABASE_KEY` | banco (usar a `service_role`, só no servidor) |
| `AB_ADMIN_TOKEN` | protege o painel e o CRUD |
| `AB_CRON_SECRET` | protege o job de análise |
| `AB_SLACK_WEBHOOK` | Incoming Webhook do canal |
| `AB_URL_PAINEL` | link que vai na mensagem do Slack |
| `AB_DOMINIOS_PERMITIDOS` | destinos válidos do redirect (padrão: domínios da CW) |
| `AB_URL_FALLBACK` | pra onde mandar se o teste não existir |
| `AB_SAL_IP` | sal do hash de IP |

4. Apontar o anúncio pra `https://<plataforma>/t/<slug>`.
5. Instalar o snippet nas LPs — ver [`docs/como-criar-um-teste.md`](docs/como-criar-um-teste.md).

`AB_PERMITIR_HTTP` é só de desenvolvimento. **Não definir em produção** — ela é o que
permite destino em `http://`.

## Limites conhecidos

- **Uma conversão por visitante, binária.** Não mede receita nem conversão repetida.
- **Sem tokens de URL** (o `$1`/`$2` do VWO). As URLs de variante são fixas; os parâmetros
  de entrada são preservados, mas não há captura por regex.
- **Sem alocação dinâmica (bandit).** Peso fixo, de propósito: bandit complica a leitura e
  não resolve problema que a gente tem.
- **A comparação é sempre contra o controle**, com correção de Šidák para o número de
  desafiantes. Funciona, mas **mais braços custa muito mais amostra** — 4 braços exigem
  α = 0,017 por comparação *e* dividem o tráfego em 4. Dois braços continua sendo o padrão.
- **O job roda 1x/dia.** Vencedor aparece no Slack no máximo 24h depois de existir.
- **O campo escondido pode não chegar ao lead.** Ainda não confirmado contra o WordPress —
  ver [`docs/qa-achados.md`](docs/qa-achados.md).
