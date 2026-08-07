# Design System — CardápioWeb

Sistema de design da CW para **páginas, dashboards e plataformas**, construído a partir do
uso **real** da marca em produção (2026-08): cardapioweb.com, lp.cardapioweb.com e
@cardapio.web no Instagram — com o Manual de Identidade Visual 2023 como base, não como teto.

**Guia vivo:** abra `styleguide.html` no navegador. Tudo que existe está demonstrado lá.

## Arquivos

| Arquivo | O que é |
|---|---|
| `cw-tokens.css` | Só as variáveis (`--cw-*`). Para projeto que já tem CSS próprio. |
| `cw.css` | Tokens + componentes completos (importa o cw-tokens.css). |
| `fontes/fontes.css` | @font-face da Museo Sans Rounded por caminho relativo. |
| `fontes-embutidas.css` | Mesmas fontes em base64 (~414 KB) — para artifact/HTML avulso. |
| `logos/` | Logos oficiais PNG (stack, horizontal, claro/escuro). |
| `styleguide.html` | O style guide navegável — referência visual de tudo. |

**Como plugar:**

```html
<!-- projeto servido (plataforma, dashboard em pasta) -->
<link rel="stylesheet" href="design-system/fontes/fontes.css">
<link rel="stylesheet" href="design-system/cw.css">

<!-- HTML autossuficiente (artifact, e-mail, arquivo solto): inline o conteúdo de
     fontes-embutidas.css + cw-tokens.css + cw.css num <style> -->
```

Aplique a classe `cw` no `<body>` (ou no container raiz) — os componentes usam o
prefixo `cw-` e não vazam para fora dele.

## A paleta real (o que o manual não conta)

As 5 cores oficiais valem, mas a marca em produção é maior que o manual:

| Token | Hex | Papel real (apurado em produção) |
|---|---|---|
| `--cw-roxo` | `#59327A` | Institucional: título sobre claro, botão do header, início do gradiente. |
| `--cw-roxo-vivo` | `#A543FA` | O roxo "vivo": CTA em superfície clara, link, glow, série 1 de gráfico. |
| `--cw-roxo-escuro` | `#421A64` | Rótulo de formulário (widget oficial da CW) e camada de dark. **Fora do manual, real em produção.** |
| `--cw-roxo-noite` | `#2A1640` | Fundo dark: LP, posts do Instagram. **Fora do manual, real em produção.** |
| `--cw-coral` | `#FF5959` | **CTA de conversão** em LP e campanha; ícone, badge, sublinhado de título. Hover: `--cw-coral-forte` `#EF4848`. |
| `--cw-amarelo` | `#FFB600` | **Raro e pontual**: badge "NOVA", palavra destacada sobre roxo escuro (padrão do Instagram), mascote. Nunca CTA grande, nunca fundo, texto por cima sempre roxo. |
| `--cw-magnolia` | `#F4EDF7` | A única clara da marca: superfície, faixa, zebra de tabela. |

**Gradiente assinatura** — idêntico na home e na LP, é a cara atual da marca:
`linear-gradient(266deg, #A543FA → #59327A)` (`--cw-gradiente`). Em peça dark/social,
`--cw-gradiente-noite` (glow de roxo-vivo sobre roxo-noite + grade `.cw-noite--grade`).
O manual de 2023 diz "cor chapada"; a marca de 2026 usa gradiente e glow — siga a produção.

**Neutros** (colhidos da LP no ar, nunca cinza frio): corpo `#4B5563`, secundário
`#6B6478`, borda `#E4D9EF`, superfície rebaixada `#F4F1F7`.

**Funcionais** (dashboard/produto, não são marca): sucesso `#16A34A`, atenção = amarelo,
erro = coral-forte, info = roxo-vivo. Verde no Instagram é contextual de WhatsApp — não usar
como cor de marca.

**Regra que continua valendo:** não inventar hex. Tom intermediário = opacidade de cor
oficial. Sombra sempre roxa (`--cw-sombra`), nunca cinza.

## Tipografia

**Museo Sans Rounded** (pesos 500 / 700 / 900 / 1000). Corpo 500 · botão e H3 700 ·
H2 900 · H1 e display 1000. Fallback: Nunito → Quicksand → system-ui.
Display grande sobre gradiente/dark é **branco**; a palavra de destaque sobre dark é
**amarela** (`.cw-destaque` dentro de `.cw-escuro`) — padrão dos posts.

## Papéis de botão (decoreba de 10 segundos)

| Contexto | Classe |
|---|---|
| CTA de conversão (LP, campanha) | `.cw-botao--conversao` (coral) |
| Ação principal em card/tela clara | `.cw-botao--primario` (roxo-vivo) |
| Institucional / header | `.cw-botao--marca` (roxo) |
| Secundária ("Login") | `.cw-botao--suave` (magnolia) |
| Pontual festivo | `.cw-botao--amarelo` (texto roxo, sempre) |

## Contextos

- **Claro (padrão):** fundo branco ou Magnolia, cards brancos com sombra roxa.
- **Escuro:** aplique `.cw-escuro` na seção — todos os componentes se adaptam.
  Combine com `.cw-noite` / `.cw-noite--grade` para o visual dos posts do Instagram.

## Contraste (herdado do manual, continua obrigatório)

- Branco sobre roxo-vivo: só ≥18px ou bold. Branco sobre coral: só título grande.
- Branco sobre amarelo: **nunca** — texto sobre amarelo é sempre `#59327A`.
- Logo/mascote sobre fundo roxo ou pattern: **sempre com box sólido branco/Magnolia** atrás.

## Séries de gráfico

Nesta ordem: `#A543FA`, `#FF5959`, `#FFB600`, `#59327A`, `#16A34A` (`--cw-serie-1..5`).

## Fontes dos dados

- Manual de Identidade Visual 2023 (skill `mega-brain:identidade-visual-cw`).
- Computado do DOM em 2026-08-07: hero da home e da LP `lp-google-ads-3` (gradiente 266deg),
  CTA coral com hover `#EF4848`, botões do header, rótulo `#421A64` do widget `--cwwa-*`.
- Grid do @cardapio.web (2026-08-07): fundo roxo-noite + glow, display branco, destaque amarelo.
