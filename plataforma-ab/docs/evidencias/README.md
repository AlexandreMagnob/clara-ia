# Evidências — GWT-3256

Prints e saídas de teste que fecham o D.O.D da atividade. Gerados por
`node testes/capturar.js` (Chrome headless + CDP) com o dev-server na 3100 e os dados de
`node scripts/semear-demo.js`.

## D.O.D — o que cada item exige e onde está

| # | O D.O.D pede | Onde está | Status |
|---|---|---|---|
| 1 | Documento com as ferramentas pesquisadas e a decisão | [`../pesquisa-ferramentas.md`](../pesquisa-ferramentas.md) | ✅ |
| 2 | Link do script/repositório ou da ferramenta configurada | `plataforma-ab/` neste repo — ver [`../../README.md`](../../README.md) | ✅ |
| 3 | Print do roteamento por variante funcionando | `roteamento-variante-a.png`, `roteamento-variante-b.png` | ✅ |
| 4 | Print do aviso de vencedor chegando no Slack | `slack-mensagem.txt` (payload real, entregue e confirmado contra receptor local) | ⚠️ ver nota |
| 5 | Documentação de como criar um novo teste | [`../como-criar-um-teste.md`](../como-criar-um-teste.md) | ✅ |

### Nota sobre o item 4

O caminho do Slack está **construído e verificado ponta a ponta** por
`node testes/slack-local.js`: um receptor local se comporta como Incoming Webhook, recebe
o POST e devolve `ok`; o teste confere o JSON exato que chega, e também os dois modos de
falha que importam (HTTP 200 com `invalid_payload`, e webhook fora do ar). 6/6 passando.

O que falta é só o print do **canal de verdade**, que depende de duas coisas que não são
minhas pra decidir: a URL do Incoming Webhook (`AB_SLACK_WEBHOOK`) e o aval pra postar
numa conversa do time. Com o webhook no ambiente, `node scripts/analisar.js` posta e o
print sai na hora.

## Arquivos

| Arquivo | O que mostra |
|---|---|
| `painel-lista.png` | Painel com os 4 estados: **vencedor** (travas fechadas), **rodando** (barrado pelo ciclo mínimo), **SRM** (tranca vermelha) e **sem dado** |
| `painel-mobile.png` | O mesmo em 390px |
| `painel-formulario.png` | Criação de teste, com a amostra alvo calculada ao vivo a partir de baseline e MDE |
| `roteamento-variante-a.png` | `/t/demo-roteamento?cwforce=A` → LP de controle, snippet lendo o contexto |
| `roteamento-variante-b.png` | `/t/demo-roteamento?cwforce=B` → LP da variante B, com `cw_ab = demo-roteamento:B` no campo escondido |
| `slack-mensagem.txt` | O payload exato que vai pro webhook, e como renderiza no canal |
| `saida-testes.txt` | Saída das quatro baterias de teste |

## Reproduzir

```bash
cd plataforma-ab
node scripts/semear-demo.js
node testes/dev-server.js --porta 3100 &
node testes/capturar.js
```

> Dois detalhes que confundem na primeira vez, e que são a plataforma agindo certo:
> o `curl` (UA `curl/8.x`) e o Chrome headless (UA `HeadlessChrome`) são **detectados como
> bot** e desviados pro controle sem serem contabilizados. Pra conferir roteamento na mão,
> passe um User-Agent de navegador — é o que `testes/capturar.js` faz via
> `Network.setUserAgentOverride`.
