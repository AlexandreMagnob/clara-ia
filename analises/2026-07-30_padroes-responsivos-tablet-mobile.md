# Padrões responsivos do site (tablet e mobile) e auditoria da /totem

**Data:** 2026-07-30 · **Autor:** Alexandre (via Claude)
**Páginas analisadas:** `cardapioweb.com/` (52502), `/cw-app-store/` (57955), `/cashback/` (57849),
`lp.cardapioweb.com/cw-connect/` (React/Next, fora do Elementor) · **Alvo:** `/totem/` (58103)

**Como os números foram obtidos:** Chrome headless com emulação de dispositivo real via CDP
(`Emulation.setDeviceMetricsOverride`, `mobile: true`), medindo `getComputedStyle` no DOM
renderizado — tablet 834×1112 (iPad Air retrato) e mobile 390×844 (Pixel 7). Não é estimativa
visual. Cruzado com os `@media` do CSS que o Elementor publica por página.

> Breakpoints do Elementor neste site: **tablet = `max-width: 1024px`**, **mobile = `max-width: 767px`**.
> Um valor definido no tablet **herda para o mobile** se o mobile não tiver valor próprio.

---

## 1. O que o site faz hoje — padrões medidos

### 1.1 Tipografia

| Papel | Desktop | Tablet (834) | Mobile (390) | Observação |
|---|---|---|---|---|
| **H1 hero** | 50–60px | **31px** | **36px** | Tablet é *menor* que mobile — inconsistência do site |
| **H2 de seção** | 33–53px | 34–46px (maioria herda o desktop) | **32px** (valor dominante, 6 ocorrências) | 32px é o padrão de fato no mobile |
| **H3 / card** | 33–39px | 23px | 28px | |
| **Corpo `<p>`** | 19px | **14px** (dominante em todas) | **14px** (dominante em todas) | 14px é o corpo padrão da casa |
| **Subheadline** | 19px | 17px | 13–17px | |

**Peso:** H1 sempre `900`; H2 varia 600–900; corpo 400–500.
**Entrelinha:** o padrão bom é **1.1 no H1** (cashback e mobile usam ~1.10). Páginas antigas
carregam `line-height: 50px` absoluto do desktop para o tablet, o que produz razão 1.6 e
"descola" as linhas — é feio e é exatamente o defeito da /totem (ver §2.1).

### 1.2 Espaçamento vertical de seção

| Breakpoint | Padding topo/base dominante |
|---|---|
| Desktop | 40px / 40px (variando 30–90) |
| Tablet | 20–30px (poucos overrides; a maioria herda) |
| **Mobile** | **30px / 30px** — padrão fortíssimo (53 e 66 ocorrências no conjunto) |

**Gutter lateral:** desktop 0–30px · tablet 10–20px · **mobile 10–20px** (nunca 0 em seção com texto).

### 1.3 Estrutura e inversão de colunas

- **Tablet mantém 2 colunas.** `--width: 50%` é o valor dominante no tablet (15 ocorrências).
  O site **não** empilha tudo no tablet — hero fica texto-esquerda / formulário-direita.
- **Mobile empilha tudo** (`--width: 100%`), uma coluna.
- **Hero:** em todas as páginas com formulário (home, cashback, totem), a ordem no mobile é
  **headline → subheadline → imagem → formulário**. O formulário nunca vem antes da imagem.
  No tablet, texto+imagem à esquerda e formulário à direita, lado a lado.
- **Imagem em seção de conteúdo:** no mobile a imagem vai **abaixo** do bloco de texto
  (ordem natural do DOM), ocupando **90–95% da largura**. No tablet fica ao lado, 45–60%.

### 1.4 Ícones

| Breakpoint | Tamanhos usados |
|---|---|
| Tablet | 25px, 27–30px (home/cashback) · 50px (app store, ícones de destaque) |
| Mobile | **25px e 30px** dominantes; ícone de destaque 50px |

Os ícones **não mudam de tamanho** entre tablet e mobile nas páginas de referência — o mesmo
valor atende os dois. Em icon-box, o ícone fica **à esquerda do texto** nos dois breakpoints.

### 1.5 Imagens

| Breakpoint | Largura relativa ao viewport |
|---|---|
| Tablet | 23–26% (grade de logos/selos) · 45–60% (imagem de seção) |
| Mobile | **90–95%** (imagem de seção) · 28–63% (selos) |

### 1.6 Alinhamento

Predominantemente **`start`/left** (60–70%) nos dois breakpoints; centralizado só em título de
seção e CTA (9–24%). Ou seja: **corpo de texto alinhado à esquerda**, título de seção centralizado.

### 1.7 Sanidade

Nenhuma das páginas — inclusive a /totem — tem **overflow horizontal** em 390px ou 834px.
O problema da /totem não é estouro de largura; é proporção e ritmo (abaixo).

---

## 2. Auditoria da /totem — os defeitos, com número

### 2.1 H1 do hero no tablet — o defeito mais visível
- **Hoje:** `font-size: 31px`, `line-height: 50px` → **razão 1.61**. As 4 linhas ficam soltas,
  com buraco entre elas, e o bloco ocupa 200px de altura.
- **Referência:** cashback no tablet usa 31px com `line-height: 27.9px` (razão 0.90); no mobile
  a própria /totem usa 36/39.6 (razão 1.10) e fica correta.
- **Correção:** `line-height: 1.1` no tablet e **subir o H1 para 38–40px** (o tablet tem 834px de
  largura; 31px é menor que o mobile, o que é o inverso do esperado).

### 2.2 Carrossel de cards — quebra nos dois breakpoints
- **Tablet:** grade `376px + 5×75px`. Os 5 cards fechados ficam com **75px de largura** e o
  título comprimido a **27px** — na prática, cinco tiras de foto sem nome. Ilegível.
- **Mobile:** cards fechados com **59px de altura** — sliver de foto; o título aparece, mas o
  card não comunica nada.
- **Correção:** abaixo de 1024px o componente não deve ser um acordeão horizontal. Vira
  **lista/grade de cards normais** (2 colunas no tablet, 1 no mobile) com imagem + título +
  descrição sempre visíveis. É o mesmo conteúdo, sem o gesto de expandir que não cabe.

### 2.3 Barra de progresso no tablet
- **Hoje:** 5 colunas de 160px; os labels dos passos 3, 4 e 5 **quebram em 2 linhas** (44px de
  altura contra 22px dos outros), desalinhando a régua.
- **Correção:** no tablet reduzir o label para 15px e a bolinha para 44px, ou usar o layout
  vertical (que já existe no mobile) a partir de 900px. O vertical é mais seguro.

### 2.4 H2 "Funciona muito bem em:" e "Onde ele mais dá resultado:"
- 25px no desktop **sem nenhum valor de mobile** → herdam 25px onde o padrão do site é 28px
  para H3/card. Ficam pequenos demais em relação aos vizinhos.

### 2.5 H2 "+17 mil clientes já usam nossa solução"
- **53px no mobile** dentro de uma caixa de **259px** de largura. É o maior texto da página no
  mobile — maior que o próprio H1 (36px). Inverte a hierarquia.
- **Correção:** 32px (padrão de H2 mobile do site).

### 2.6 Cobertura de breakpoint
A /totem tem override de tablet em apenas **16%** dos elementos (contra 50% da cashback).
É a causa raiz: quase tudo no tablet está herdando valor de desktop.

---

## 3. O que aplicar na /totem

| # | Onde | Tablet | Mobile |
|---|---|---|---|
| 1 | H1 hero | 38px, lh 1.1 | 36px, lh 1.1 (já ok) |
| 2 | H2 de seção | 30px, lh 1.2 | 32px → onde faltar |
| 3 | H2 "+17 mil clientes" | 30px | **32px** (hoje 53px) |
| 4 | H2 "Funciona muito bem em" / "Onde ele mais dá resultado" | 24px | **28px** |
| 5 | Corpo `<p>` | 14px | 14px |
| 6 | Padding de seção | 30px topo / 30px base | 30px / 30px |
| 7 | Gutter lateral | 20px | 20px |
| 8 | Carrossel | grade 2 colunas, card completo | 1 coluna, card completo |
| 9 | Barra de progresso | layout vertical (como no mobile) | vertical (já ok) |
| 10 | Imagens de seção | 45–60% | 90–95% |
| 11 | Ícones | 25–30px (manter) | 25–30px (manter) |

---

## 4. O que foi aplicado (31/07/2026) — medido depois na página publicada

| Elemento | Antes | Depois |
|---|---|---|
| H1 hero, tablet | 31px / lh 50px (**razão 1.61**) | **40px / lh 1.10** |
| H2 "+17 mil clientes", mobile | 53px (maior que o H1) | **32px** (tablet 34px) |
| Carrossel, tablet | 5 cards de **75px**, título cortado a 27px | **2 colunas de 394px**, card completo |
| Carrossel, mobile | cards fechados de **59px** de altura | **1 coluna, 240px**, título + descrição |
| Barra de progresso, tablet | 5 colunas, labels quebrando em 2 linhas | **vertical**, 1 linha por label |
| Imagem do hero, mobile | 500px = **128% da tela** (sangrava) | **351px = 90%** |
| Imagem do hero, tablet | 502px colidindo com o formulário | **417px = 50%** |

Hierarquia final medida — mobile: H1 36 > H2 32 > 27. Tablet: H1 40 > H2 34. Desktop intacto
(60 / 53 / 44). **Overflow horizontal = 0** nos três. Acordeão do carrossel preservado no desktop.

**Detalhe que custou um ciclo:** o controle de largura de imagem do Elementor em `%` é relativo
ao **container**, não à tela — 92% resultou em 460px numa tela de 390px. A unidade que resolve é
`vw`. Vale para qualquer ajuste de largura de imagem nas outras páginas.

**Avaliado e mantido:** os H2 "Funciona muito bem em:" e "Onde ele mais dá resultado:" seguem em
25px sem valor de tablet/mobile. São rótulos de apoio, não títulos de seção; subir para os 28px
do padrão os deixaria *maiores* no mobile que no desktop, o que inverte a escala. Ficam como estão.

**Backups no postmeta do 58103** (limpar em alguns dias): `_bkp_resp_20260731`,
`_bkp_tipo_20260731`, `_bkp_img_20260731`, mais os de 30/07. Pastas `__stale_totem_20260731{a..d}`
no cache do WP Rocket.
