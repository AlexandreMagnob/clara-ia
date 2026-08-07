# Estado da entrega — GWT-3256

> 07/08/2026 · Alexandre · [Card no Jira](https://cardapio-web.atlassian.net/browse/GWT-3256)

**Onde está: 100% NO AR desde 07/08/2026 — https://plataforma-ab.vercel.app**
(`scripts/publicar.py` republica tudo; token do painel = `AB_ADMIN_TOKEN` no `.env` da
raiz). Peças, todas verificadas em produção:

- **Banco:** Supabase da Máquina de Experimentos (org CW Growth, do Alexandre), tabelas
  `ab_*` criadas pelo schema. A hibernação que travava foi resolvida rebaixando o admin
  no teto de projetos free (regra da Supabase: restore exige vaga de TODO owner/admin da
  org). O cron diário da plataforma mantém o projeto acordado daqui em diante.
- **E2E de produção passou:** criar teste → rotear visitante → atribuição gravada no
  Supabase → encerrar → apagar (cascade). De quebra pegou e corrigiu um vazamento: o
  rewrite da Vercel injeta `slug=` na query e ele ia parar na URL da LP — `slug` agora
  está em `PARAMS_INTERNOS`.
- **Slack:** workflow n8n `[AB] Aviso de vencedor no Slack` (webhook
  `/webhook/ab_aviso_vencedor` → canal growth → responde "ok" só depois de postar).
- **Snippet:** mu-plugin `cw-ab.php` no lp.cardapioweb.com; contexto e campos
  `cw_ab`/`cw_ab_vid` injetados, verificado no navegador contra LP real.

**Falta pro D.O.D:** rodar o 1º teste real (item 4/5 do guia), print do aviso de
vencedor REAL no growth, e confirmar o campo `cw_ab` no REGISTRO do lead após uma
submissão de verdade.

**Redesign 07/08 (à noite):** painel reskinnado na direção **"Fusão"** escolhida pelo
Alexandre na exploração de design (artifact com 4 direções + modo mesclar): carimbo de
bancada no topo, contadores de instrumento com régua, travas como checklist de inspeção,
mono só em dado/micro-rótulo, acento único roxo-vivo com glow, série de gráfico
roxo/laranja/ciano/âmbar/verde validada pra daltonismo. Tipografia: Museo Sans Rounded.
Deploy feito no mesmo dia.

---

## D.O.D da atividade

| # | O que o card pede | Status | Onde |
|---|---|---|---|
| 1 | Documento com as ferramentas pesquisadas e a decisão | ✅ | [`docs/pesquisa-ferramentas.md`](docs/pesquisa-ferramentas.md) |
| 2 | Link do script/repositório ou da ferramenta configurada | ✅ | esta pasta · [`README.md`](README.md) |
| 3 | Print do roteamento por variante funcionando | ✅ | [`docs/evidencias/`](docs/evidencias/) — `roteamento-variante-a.png` / `-b.png` |
| 4 | Print do aviso de vencedor chegando no Slack | ⚠️ **bloqueado** | ver abaixo |
| 5 | Documentação de como criar um novo teste | ✅ | [`docs/como-criar-um-teste.md`](docs/como-criar-um-teste.md) |
| — | Ferramenta rodando um primeiro teste real | ⬜ **pendente** | depende de publicar |

### Por que o item 4 está bloqueado

O caminho do Slack está construído e verificado ponta a ponta: `node testes/slack-local.js`
sobe um receptor que se comporta como Incoming Webhook, recebe o POST e devolve `ok`; o
teste confere o JSON exato e os dois modos de falha que importam (HTTP 200 com
`invalid_payload`, e webhook fora do ar). 6/6 passando, e o payload exato está em
[`docs/evidencias/slack-mensagem.txt`](docs/evidencias/slack-mensagem.txt).

Falta só o print do **canal de verdade**, que depende de duas coisas que não são minhas pra
decidir: a URL do Incoming Webhook (`AB_SLACK_WEBHOOK`) e o aval pra postar numa conversa
do time. Com o webhook no ambiente, `node scripts/analisar.js` posta e o print sai na hora.

---

## O que foi construído

Split URL test (teste de redirect), no modelo do VWO/Convert, adaptado porque as LPs são
WordPress/Elementor e o tráfego vem de anúncio. Arquitetura e decisões no
[`README.md`](README.md); a matemática em [`docs/estatistica.md`](docs/estatistica.md).

- **Roteador** (`api/t.js`) — a URL do anúncio. Hash determinístico FNV-1a (spec do
  GrowthBook), 302 nunca 301, cookie sticky, bot e prefetch fora, UTMs preservados.
- **Snippet** (`app/ab.js`) — `view`, `conversion` no `submit_success` do Elementor, campo
  escondido com a variante no formulário. 3 KB, sem dependência, sem flicker.
- **Ingestão** (`api/ev.js`) — recusa `assignment` vindo do navegador, por princípio.
- **Motor estatístico** (`lib/estatistica.js`) — z-test, mSPRT, SRM, amostra por poder,
  Šidák. Sem biblioteca externa.
- **Job diário** (`api/analisar.js`) — Vercel Cron; avisa no Slack só quando o veredito muda.
- **Painel** (`app/index.html`) — HTML/CSS/JS puro, identidade visual da CW.
- **Banco** (`schema.sql`) — Postgres/Supabase, com a agregação refeita em SQL pra auditar.

### As decisões que sustentam os números

1. **Denominador = atribuição gravada no servidor, nunca pageview.** Pageview depende de JS
   carregar; variante mais lenta gera viés silencioso.
2. **Conversão vai pra variante ATRIBUÍDA, não pra declarada pelo navegador.**
3. **O plano de análise congela quando o teste começa.** Baseline, MDE, alfa, poder, dias,
   pesos, seed, URLs e ordem das variantes não mudam com o teste no ar.

### A trava (o valor real da atividade)

Vencedor só sai com as quatro fechadas: ciclo mínimo de 7 dias · SRM (χ², p ≥ 0,001) ·
origem do tráfego (nenhum IP com ≥ 25%) · evidência (amostra planejada + z-test **ou**
mSPRT cruzou).

---

## Testes: 216 checagens, todas passando

```bash
node testes/ataques.js                 # 60 · entrada hostil no nível HTTP
node --test testes/unidade.js          # 54 · unidade
python testes/validar_estatistica.py   # 48 · estatística vs stdlib do Python (~1e-15)
node testes/store-supabase.js          # 20 · driver do Supabase vs PostgREST de mentira
node testes/simulacao.js               # 13 · ponta a ponta com tráfego simulado
node testes/snippet-dom.js             # 11 · o ab.js real num DOM de mentira
node testes/slack-local.js             #  6 · caminho do Slack
node testes/aa-falso-positivo.js       #  4 · teste A/A: mede o falso positivo de verdade
```

Saída completa em [`docs/evidencias/saida-testes.txt`](docs/evidencias/saida-testes.txt).

### QA adversarial

Veredito inicial **NÃO SUBIR**. Sete furos, todos corrigidos e com teste de regressão —
registro completo em [`docs/qa-achados.md`](docs/qa-achados.md). Os dois piores:

- **Reordenar variantes** passava pela validação e reatribuía 100% dos visitantes: todo
  mundo passava a **ver** a outra página e seguia **contado** no braço antigo, sem acender
  SRM. Chegava lá sozinho, remexendo uma linha no painel.
- **Dava pra fabricar o vencedor editando o campo MDE**: com o mesmo dado, `mde=0.2` dava
  "rodando" e `mde=0.4` dava "vencedor B". O peeking que a ferramenta existe pra impedir,
  virado num campo de formulário.

E a correção de comparações múltiplas: 6 braços davam **20,1%** de falso positivo em teste
A/A contra os 5% prometidos; com Šidák, 3,5%.

---

## Onde eu parei

Última coisa feita: correções do QA aplicadas, kit inteiro reexecutado verde, evidências
regeradas, documentação atualizada. **Não há trabalho pela metade no código.**

Duas coisas ficaram propositalmente de fora, por dependerem de acesso ou aval:

1. **Publicar** (Vercel + Supabase) — o card diz "ainda não subir".
2. **Postar no Slack real** — precisa do webhook e do seu ok.

---

## Próximos passos, na ordem

### 1. Publicar a infraestrutura
- [ ] Criar projeto na Vercel apontando pra `plataforma-ab/`.
- [ ] Criar projeto Supabase **isolado** do da Clara IA (aquele tem tabelas sem RLS
      legíveis pela `anon key`, e esta plataforma serve site público). Usar a org
      **CW Growth**, como a Máquina de Experimentos.
- [ ] Rodar [`schema.sql`](schema.sql) no SQL Editor. Lembrete: chave `anon`/`service_role`
      **não** cria tabela.
- [ ] Variáveis de ambiente (lista completa no [`README.md`](README.md)):
      `AB_STORE=supabase`, `AB_SUPABASE_URL`, `AB_SUPABASE_KEY` (service_role),
      `AB_ADMIN_TOKEN`, `CRON_SECRET`, `AB_SLACK_WEBHOOK`, `AB_URL_PAINEL`,
      `AB_DOMINIOS_PERMITIDOS`, `AB_URL_FALLBACK`, `AB_SAL_IP`.
      ⚠️ **Não** definir `AB_PERMITIR_HTTP` — é válvula de desenvolvimento.
- [ ] Conferir que o cron do Vercel autentica (ele manda `Authorization: Bearer $CRON_SECRET`).

### 2. Fechar o item 4 do D.O.D
- [ ] Pôr o `AB_SLACK_WEBHOOK` no ambiente, rodar `node scripts/analisar.js`, printar o
      canal. Me diga qual canal e eu rodo.

### 3. Confirmar o que não deu pra testar sem WordPress
- [ ] **O campo escondido chega ao lead?** O guia trata `form_fields[cw_ab]` como rede de
      segurança, mas o Elementor Pro monta o registro a partir dos campos configurados no
      formulário, e o `cw-site-tracking.php` captura **por rótulo**. Um input injetado por
      JS pode ser descartado nos dois. **Submeta um formulário de teste e olhe a submissão
      no Elementor antes de contar com esse plano B.**
- [ ] Instalar o snippet pelo mu-plugin, **não** pelo widget de HTML do Elementor — o
      `cardapioweb-tracking.php` apaga snippet de terceiro (foi o que sumiu com o Clarity
      em 31/07). Usar o mesmo caminho do loader `cw-clarity`.

### 4. Primeiro teste real (fecha o D.O.D)
- [ ] Escolher a hipótese. A GWT-2738 (*teste A/B de 3 headlines na LP de SQL*) já está no
      backlog e serve — mas ela tem 3 braços, e 3 braços custam bem mais amostra (α = 0,025
      por comparação, tráfego dividido em 3). Com o volume da LP de SQL, **2 braços é a
      aposta certa pro primeiro**.
- [ ] Rodar o passo 0 do [guia](docs/como-criar-um-teste.md): a amostra alvo cabe no
      tráfego da campanha em até 30 dias? Se não couber, aumentar o MDE antes de começar.
- [ ] Seguir o guia. A conferência do passo 4 é o que separa teste bom de teste perdido.

### 5. Depois do primeiro teste
- [ ] Anexar as 5 evidências no card e mover pra Concluído.
- [ ] Pós-mortem pela skill `/pos-mortem-experimento`.

### Tarefas da quebra no Jira (13h: 2+5+4+2)

Existem como split do card: GWT-3257 (pesquisa + arquitetura, ✅ reporte + docs anexados
07/08), GWT-3258 (roteador + registro por variante, ✅ reporte + prints/QA/testes anexados
07/08), GWT-3259 (vencedor + trava + Slack — aberta até o aviso sair no canal real),
GWT-3260 (primeiro teste real + documentação — aberta, depende de publicar).

---

## Em aberto, sabido e documentado

- **Uma conversão por visitante, binária.** Não mede receita nem conversão repetida.
- **Sem tokens de URL** (`$1`/`$2` do VWO). URLs de variante fixas; parâmetros de entrada
  são preservados. Onde cresce: `montarDestino()` em `lib/config.js`.
- **Sem bandit.** Peso fixo, de propósito.
- **O freio por IP em `/api/ev` é por instância**, não global — serverless não compartilha
  estado. A defesa real contra amostra fabricada é a trava de origem do tráfego, na análise.
- **Šidák é conservador.** Dunnett daria um pouco mais de poder; só vale se testes de 3+
  braços virarem rotina.
- **O job roda 1x/dia.** Vencedor aparece no Slack no máximo 24h depois de existir.
- **Depois da amostra planejada, o z-test é recalculado a cada execução**, o que infla o α
  um pouco acima de 5%. Efeito pequeno, mas é o motivo de decidir quando o veredito
  aparece, e não três semanas depois.
