# Experiência na página de destino — LP Google Ads (`lp-google-ads-3`)

**Data:** 28/07/2026
**URL analisada:** https://lp.cardapioweb.com/lp-google-ads-3/
**Objetivo:** levar o critério "Experiência na página de destino" do Índice de qualidade
para **Acima da média** nas keywords "cardápio web" e "cardápio digital".
**Método:** documentação oficial do Google + trace real do Chrome (mobile, Slow 4G, CPU 4x)
+ medição de TTFB por `curl` + benchmark contra o site principal e 3 concorrentes.

---

## 0. Aviso sobre "100% de certeza"

**Não existe garantia de 100%, e a razão está na própria documentação do Google.**

O status "Acima da média" **não é uma nota absoluta** — é uma comparação com
*"outros anunciantes que tiveram publicidade veiculada para a mesma palavra-chave nos
últimos 90 dias"*
([fonte oficial](https://support.google.com/google-ads/answer/6167118?hl=pt-BR)).
É um ranking relativo. Dá para fazer tudo certo e continuar "Na média" se os
concorrentes daquele leilão também estiverem bem.

Além disso, o Google **não publica** o peso de cada fator nem uma checklist fechada de
"experiência na página de destino". O que a documentação oficial dá é a definição, os
fatores citados e as recomendações — não uma fórmula.

O que dá para afirmar com segurança é outra coisa, e é o que este documento entrega:
**os pontos em que esta página falha objetivamente em critério que o Google confirma
oficialmente que avalia.** Corrigir esses pontos remove as causas conhecidas. É a maior
probabilidade disponível — não é um contrato.

Classificação de confiança usada aqui:

| Nível | Significado |
|---|---|
| 🟢 **Confirmado** | O Google diz oficialmente que avalia isso, e a página falha de forma mensurável |
| 🟡 **Consenso** | Prática recomendada amplamente, sem confirmação oficial explícita do peso |
| 🔵 **Higiene** | Não move o Índice sozinho, mas remove ruído e ajuda conversão |

---

## 1. O que o Google oficialmente avalia

### Definição oficial

> "Experiência na página de destino: qual é a relevância e utilidade da página de destino
> para as pessoas que clicam no anúncio."
> — [Sobre o Índice de qualidade](https://support.google.com/google-ads/answer/6167118?hl=pt-BR)

O Índice de qualidade tem 3 componentes (CTR esperada, Relevância do anúncio,
Experiência na página de destino), cada um avaliado como **Abaixo da média / Na média /
Acima da média**, na escala de 1 a 10.

### Fatores que o Google cita nominalmente

Da documentação do Search Ads 360
([fonte](https://support.google.com/sa360/answer/9351020?hl=en)):

1. **Utilidade e relevância da informação** apresentada na página
2. **Facilidade de navegação** para o usuário
3. **Quantidade de links** na página
4. **Alinhamento com a expectativa criada pelo criativo do anúncio clicado**

Das 5 formas de melhorar o Índice de qualidade
([fonte](https://support.google.com/google-ads/answer/6167130?hl=pt-BR)), na seção
"Experiência na página de destino":

- Oferecer **exatamente** o que o visitante procura
- Manter **consistência entre a mensagem do anúncio e a página de destino**
- Usar a **taxa de conversão** como indicador de boa experiência
- **Otimizar o site para dispositivos móveis**
- **Melhorar a velocidade de carregamento da página**

### Política de destino (camada separada, mas relacionada)

A política de **Destination Experience**
([fonte](https://support.google.com/adspolicy/answer/16427615?hl=en)) reprova destinos com:

- Pop-ups ou intersticiais que **atrapalham a visualização do conteúdo**
- Sites que **quebram o botão voltar** do navegador
- Páginas que **não carregam rápido** nos navegadores e dispositivos mais comuns
- Links que **iniciam download direto ou levam a um arquivo** (imagem, vídeo, áudio, documento)

E a política de **Destination Requirements**
([fonte](https://support.google.com/adspolicy/answer/6368661?hl=pt-BR)) exige que o destino
seja **rastreável pelo AdsBot** e não retorne erro 4xx/5xx ao crawler.

### O que o Google diz que NÃO entra no Índice de qualidade

Dispositivo usado na busca, localização do usuário, horário do dia e recursos/assets do
anúncio ([fonte](https://support.google.com/google-ads/answer/2404197?hl=pt-BR)).
Não adianta mexer nisso esperando efeito no Índice.

### Quando o Índice aparece como "—"

> "não há pesquisas suficientes que sejam idênticas às suas palavras-chave para determinar
> o Índice de qualidade delas"

Ou seja: **se a keyword tiver pouco volume, não haverá nota**. Vale conferir isso antes de
qualquer coisa — se hoje está "—", nenhuma mudança na página vai fazer aparecer nota.

---

## 2. Benchmark de performance — o achado principal

### Trace real (Chrome, mobile 412×915, Slow 4G, CPU 4× — perfil padrão de auditoria)

| Métrica | Valor | Leitura |
|---|---|---|
| **LCP** | **1.448 ms** | Elemento LCP = o `<h1>` (texto, não imagem) |
| ├─ TTFB | **1.158 ms** | **80% do LCP é só esperar o servidor** |
| └─ Render delay | 290 ms | Ok |
| **CLS** | **0,00** | Excelente, nada a fazer |
| Dados de campo (CrUX) | **inexistentes** | O Google não tem dado de usuário real desta URL |

O próprio Chrome estima que corrigir a latência do documento economiza
**1.054 ms de LCP e de FCP**. Isso levaria o LCP de ~1,45s para ~0,4s.

### TTFB medido por `curl` (5 execuções, sem emulação)

```
1,09s · 1,27s · 1,39s · 1,42s · 1,89s · (pior caso observado: 4,61s)
```

Alta variabilidade — sinal clássico de renderização PHP a cada request, sem cache.

### Comparativo — este é o número que importa

| Site | TTFB (melhor de 3) | vs. nossa LP |
|---|---|---|
| **lp.cardapioweb.com/lp-google-ads-3/** | **1,273 s** | — |
| cardapioweb.com (nosso site principal) | 0,200 s | **6,4× mais rápido** |
| saipos.com | 0,153 s | 8,3× mais rápido |
| goomer.com.br | 0,165 s | 7,7× mais rápido |
| anota.ai | 0,167 s | 7,6× mais rápido |

**A nossa LP de Ads é 6× mais lenta para responder que o nosso próprio site principal.**
Como o status é relativo aos concorrentes do mesmo leilão, e os concorrentes diretos estão
todos na faixa de 0,15–0,17s, este é o item com maior probabilidade de estar puxando a nota
para baixo.

### Causa raiz confirmada

```
Cache-Control: public, max-age=0
Expires: <o mesmo instante da requisição>
Set-Cookie: cw_ext_id=...; domain=.cardapioweb.com
x-powered-by: PHP/8.2.28
```

Dois problemas somados:

1. **`max-age=0`** — não há cache de página. Toda visita renderiza o WordPress do zero.
2. **`Set-Cookie` na resposta do HTML** — o cookie `cw_ext_id` é gravado server-side na
   própria resposta da página. **Qualquer CDN ou plugin de cache desliga o cache de uma
   resposta que traz `Set-Cookie`.** Mesmo que o cache seja ligado, ele não vai funcionar
   enquanto esse cookie for setado no PHP.

Confirmação: a segunda chamada consecutiva também levou 1,89s — não há cache de página
nenhum. Um asset estático do mesmo host responde em 0,58s com conexão de 0,07s, o que
mostra que a lentidão é **processamento no servidor**, não rede.

### O que está bem (não mexer)

- ✅ CLS 0,00 — sem deslocamento de layout
- ✅ 41 das 42 imagens em **WebP**, com lazy loading
- ✅ **Zero scripts bloqueando renderização** no `<head>`; único CSS externo está com `media=`
- ✅ HTTP/2 + HTTP/3 disponível, compressão Brotli ativa
- ✅ Sem redirecionamento na URL final
- ✅ `robots.txt` não bloqueia o AdsBot (só `/wp-admin/`)
- ✅ Viewport mobile correto, `lang="pt-BR"`
- ✅ Apenas 20 links, quase todos âncoras internas — **o Google cita "quantidade de links"
  como fator, e aqui está enxuto, o que é bom**

---

## 3. Achados de conteúdo e relevância

### Densidade de keyword

| Termo | Ocorrências | Onde aparece |
|---|---|---|
| "cardápio digital" | 9 | **No `<h1>` exato** + corpo |
| "cardápio web" | 9 | **Só como nome da marca** — nunca como termo genérico |
| "cardápio" (geral) | 18 | — |
| "restaurante" | 3 | — |
| "delivery" | 1 | — |

`<h1>` atual: **"O Cardápio Digital mais completo do Brasil"**

Para **"cardápio digital"** a correspondência é forte: o termo exato está no H1.
Para **"cardápio web"** a página só responde pela marca — o que funciona se a keyword for
branded, mas é fraco se estiver capturando intenção genérica.

Total: **742 palavras**. Enxuto para uma LP que precisa demonstrar "conteúdo relevante e
original" ao crawler.

### Problemas encontrados

| # | Achado | Evidência | Critério do Google que toca |
|---|---|---|---|
| 1 | **Title tag interno vazado** | `<title>LP – Google Ads – Cardápio Web – Cardápio Web</title>` | Relevância / utilidade. O título literalmente anuncia "isto é uma LP de anúncio", duplica a marca e desperdiça o campo textual mais forte da página |
| 2 | **Sem `<meta name="description">`** | Ausente no HTML | Relevância |
| 3 | **Sem Open Graph** | Nenhuma tag `og:` | Higiene |
| 4 | **`noindex, nofollow`** | `<meta name='robots' content='noindex, nofollow' />` | Ver análise dedicada abaixo |
| 5 | **Sem telefone, e-mail ou WhatsApp visível** | Varredura no HTML não achou nenhum | Transparência / facilidade de contato |
| 6 | **Política e Termos são PDFs** | 97 KB e 250 KB, em outro domínio | A política de Destination Experience desaconselha links que levam a arquivos/documentos |
| 7 | **GTM + Pixel Facebook = ~700 ms de main thread** | GTM 370 ms, Facebook 331 ms (CPU 4×) | Não afeta o LCP (que é texto), mas afeta responsividade |
| 8 | **Só 5 de 42 imagens com `width`+`height`** | — | CLS já está 0,00, então é higiene |

### Sobre o `noindex, nofollow` — análise honesta

A documentação oficial do Google Search Central é explícita:

> "The `<meta name="robots" content="noindex">` rule applies to search engine crawlers.
> To block non-search crawlers, such as `AdsBot-Google`, you might need to add rules
> targeted to the specific crawler."
> — [Robots Meta Tags Specifications](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)

**Portanto: o `noindex` genérico NÃO bloqueia o AdsBot.** Para bloquear seria preciso
`<meta name="AdsBot-Google" content="noindex">`, que não existe na página.

Conclusão: **isto provavelmente não é a causa da nota baixa.** Não vou vender como se fosse.

O que ainda pesa a favor de mexer:
- O `nofollow` não traz benefício nenhum e sinaliza página isolada
- Sem indexação, a URL nunca acumula dados de campo no CrUX — e de fato **confirmei que
  o Google não tem dado de usuário real desta página**, o que o deixa dependente só do
  próprio crawl

Recomendação: **remover o `nofollow`, manter o `noindex` se a intenção for não competir
organicamente com o site principal.** Mudança barata, risco zero, benefício incerto.
Não é prioridade.

---

## 4. Plano de ação priorizado

### 🔴 P0 — Cache de página (🟢 Confirmado)

**Problema:** TTFB de 1,1–1,9s, 6× o do site principal. 80% do LCP é espera de servidor.
**Ganho medido:** ~1.054 ms de LCP e FCP (estimativa do próprio Chrome). LCP de 1,45s → ~0,4s.
**Por que é o item nº 1:** velocidade de carregamento é fator que o Google **confirma
oficialmente**, é onde a página está **objetivamente pior que os concorrentes do mesmo
leilão**, e é o único item com ganho quantificado.

**Como fazer — na ordem:**

1. **Resolver o `Set-Cookie` primeiro.** Enquanto o PHP gravar `cw_ext_id` na resposta da
   página, nenhum cache vai pegar. Opções:
   - **(a) Recomendada** — mover a geração do `cw_ext_id` para JavaScript no client
     (gerar UUID no browser, gravar via `document.cookie`, ler no submit do formulário).
     O formulário já envia `cw_ext_id` como campo, então a mudança é só na origem do valor.
   - **(b)** Manter server-side, mas configurar o cache para ignorar/excluir esse cookie da
     chave de cache. Depende do que o cPanel/host oferece.

2. **Ligar cache de página** no subdomínio `lp.cardapioweb.com` — o mesmo mecanismo que já
   faz `cardapioweb.com` responder em 0,20s. Vale descobrir o que o site principal usa e
   replicar; é a rota de menor risco.

3. **Trocar o header** de `Cache-Control: public, max-age=0` para algo como
   `public, max-age=300, s-maxage=3600, stale-while-revalidate=86400`.

**Como validar:** `curl -s -o /dev/null -w "%{time_starttransfer}\n" <url>` em 3 execuções.
**Meta: abaixo de 0,3s.** Depois rodar PageSpeed Insights mobile e conferir o LCP.

> ⚠️ Isto exige alguém com acesso ao host/cPanel. Não é mudança de conteúdo.

---

### 🔴 P0 — Title e meta description (🟢 Confirmado)

**Problema:** o título é um rascunho interno. É o sinal textual mais forte que o AdsBot lê,
e hoje está gasto com "LP – Google Ads" e a marca repetida duas vezes.

**Aplicar:**

```html
<title>Cardápio Digital para Restaurantes e Delivery | Cardápio Web</title>
<meta name="description" content="Cardápio digital, chatbot de WhatsApp e sistema de gestão em uma só plataforma. Mais de 17 mil restaurantes já vendem pelo canal próprio com a Cardápio Web. Fale com um consultor.">
```

Esse título cobre as **duas** keywords: contém "Cardápio Digital" e "Cardápio Web".

**Como fazer:** é uma página WordPress com tema próprio (não Elementor — o HTML tem CSS
inline e o form posta em `/wp-json/cw/v1/submit`). O título vem do título do post no
WP Admin ou do plugin de SEO. Se houver plugin de SEO ativo, dá para setar sem tocar em
código.

---

### 🟠 P1 — Bloco de transparência e contato (🟢 Confirmado)

**Problema:** "facilidade de navegação" e transparência são fatores citados. A página tem
CNPJ e endereço (bom), mas **zero canal de contato**. E política/termos são PDFs.

**Aplicar no rodapé, ao lado do CNPJ:**

```
Fale com a gente
WhatsApp: (85) XXXXX-XXXX  ·  contato@cardapioweb.com
Atendimento de domingo a domingo, manhã, tarde e noite.
```

E **publicar Política de Privacidade e Termos de Uso como páginas HTML** em vez de PDF —
a política de Destination Experience desaconselha links que levam a arquivos, e um PDF de
250 KB é uma barreira real no mobile.

> ⚠️ Preciso que você confirme qual telefone/e-mail público pode entrar. Não inventei número.

---

### 🟠 P1 — Reforçar "cardápio web" como termo (🟡 Consenso)

**Problema:** a página responde a "cardápio digital" no H1, mas "cardápio web" só aparece
como marca. Se essa keyword captura intenção genérica, a correspondência é fraca.

**Aplicar:** um bloco curto de conteúdo (150–250 palavras) que responda literalmente a
pergunta que a busca faz. Isso ataca ao mesmo tempo o "conteúdo relevante e original" e a
contagem de 742 palavras, que é enxuta.

Sugestão de posição: entre a seção "Sistema de gestão" e "Aumente vendas com estratégia".

```
O que é um cardápio web?

Um cardápio web é o cardápio do seu restaurante publicado em um link próprio,
que o cliente abre no navegador do celular sem instalar nada. Ele monta o
pedido, escolhe entrega ou retirada e paga online — e o pedido cai direto no
seu sistema de gestão, sem ninguém digitar nada.

A diferença para um cardápio digital em PDF ou imagem é que o cardápio web
recebe pedido. O cliente não precisa mandar mensagem descrevendo o que quer:
ele fecha a compra sozinho. Você para de perder pedido por erro de anotação
e para de pagar comissão de marketplace no pedido que já era seu.

Na Cardápio Web, o cardápio web vem junto com o chatbot de WhatsApp, o
programa de fidelidade e o sistema de gestão. São mais de 17 mil restaurantes
usando hoje, com R$ 12 bilhões em pedidos processados.
```

Escrevi seguindo a linha da página (afirmativo, sem travessão, número sempre com contexto).
Ajuste o que quiser antes de aplicar.

---

### 🟡 P2 — Adiar GTM e Pixel do Facebook (🔵 Higiene)

~700 ms de main thread em CPU 4×. Não muda o LCP (que é texto), mas melhora responsividade.
Carregar após a primeira interação do usuário ou com `setTimeout` de 2–3s.

> ⚠️ Isto **quebra atribuição** se feito errado. O Pixel precisa disparar o PageView. Só
> mexer com quem cuida do rastreamento — o ganho no Índice de qualidade é pequeno perto do
> risco de furar a atribuição de campanha. **Recomendo deixar por último ou não fazer.**

---

### 🟡 P2 — Limpar `nofollow` (🟡 Consenso, benefício incerto)

Trocar `<meta name='robots' content='noindex, nofollow' />` por
`<meta name='robots' content='noindex, follow' />`.
Barato, risco zero. Não espere efeito mensurável — a documentação do Google indica que isso
não bloqueia o AdsBot.

---

## 5. O que eu NÃO consegui verificar — e você precisa checar

Estes três pontos podem valer mais que tudo acima, e nenhum deles é visível de fora da
conta do Google Ads:

1. **Qual é o Índice de qualidade atual e o status de cada componente?**
   Se "Experiência na página de destino" já estiver em "Na média" e os outros dois
   componentes estiverem "Abaixo da média", o gargalo é outro. E se o Índice estiver como
   **"—"**, é falta de volume de busca — nenhuma mudança na página resolve.
   *Onde:* Google Ads → Palavras-chave → colunas → adicionar "Índice de qualidade",
   "Exp. da página de destino", "Relevância do anúncio", "CTR esperada".

2. **Qual o texto dos anúncios que apontam para esta URL?**
   O Google diz literalmente para "manter consistência entre a mensagem do anúncio e a
   página de destino". Se o anúncio promete "teste grátis" ou "a partir de R$ X" e a página
   só oferece "Fale com um consultor", isso é uma quebra de expectativa direta — e seria a
   correção de maior impacto do documento. **Me manda os títulos e descrições dos anúncios
   que eu cruzo com a página.**

3. **Essas duas keywords estão no mesmo grupo de anúncios?**
   "cardápio web" e "cardápio digital" têm intenções diferentes (uma é semi-branded, a
   outra é genérica). O Google recomenda separar grupos com keywords muito diferentes.
   Se estão juntas com o mesmo anúncio, nenhuma das duas tem correspondência ideal.

---

## 6. Sequência recomendada e expectativa de prazo

| Ordem | Ação | Quem faz | Esforço |
|---|---|---|---|
| 1 | Conferir o Índice atual e o texto dos anúncios (seção 5) | Você | 15 min |
| 2 | Title + meta description | Você / WP Admin | 10 min |
| 3 | Cache de página + resolver o `Set-Cookie` | Dev / host | 2–4 h |
| 4 | Bloco de contato no rodapé + política em HTML | Dev / WP | 1–2 h |
| 5 | Bloco "O que é um cardápio web?" | Você / WP | 30 min |
| 6 | `nofollow` → `follow` | Dev | 2 min |

**Sobre o prazo até a nota mudar:** o Índice de qualidade é recalculado com o acúmulo de
impressões, comparando com os últimos 90 dias de concorrentes. Não é imediato. Conte com
**2 a 4 semanas de veiculação** depois das mudanças antes de julgar o resultado — e use a
coluna "Índice de qualidade (hist.)" para comparar antes/depois com data.

---

## Fontes

- [Sobre o Índice de qualidade para campanhas de Pesquisa (pt-BR)](https://support.google.com/google-ads/answer/6167118?hl=pt-BR)
- [About Quality Score for Search campaigns (en)](https://support.google.com/google-ads/answer/2404197?hl=en)
- [5 formas de usar o Índice de qualidade para melhorar o desempenho (pt-BR)](https://support.google.com/google-ads/answer/6167130?hl=pt-BR)
- [Landing page experience — Search Ads 360 Help](https://support.google.com/sa360/answer/9351020?hl=en)
- [Destination experience — Advertising Policies Help](https://support.google.com/adspolicy/answer/16427615?hl=en)
- [Destination requirements — Advertising Policies Help](https://support.google.com/adspolicy/answer/6368661?hl=pt-BR)
- [Robots Meta Tags Specifications — Google Search Central](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)
- [Document request latency — Chrome DevTools](https://developer.chrome.com/docs/performance/insights/document-latency)
- [Optimize TTFB — web.dev](https://web.dev/articles/optimize-ttfb)
