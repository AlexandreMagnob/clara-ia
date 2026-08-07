# Como criar um teste A/B de landing page

> Item 5 do D.O.D da GWT-3256. Do zero até o vencedor, na ordem.

Reserve ~40 minutos pro primeiro. Depois do segundo, dá 15.

---

## Passo 0 — antes de qualquer coisa: cabe no seu tráfego?

**A pergunta que mata mais teste é essa, e ela vem antes de escrever uma linha de copy.**

Abra o painel → **Novo teste**, preencha só **Baseline** e **MDE**. Ele te devolve na hora
a amostra alvo por braço.

- **Baseline** = a taxa de conversão de hoje da página, em proporção (12,37% → `0.1237`).
  Pega no relatório da LP, não no chute.
- **MDE** = a melhora **relativa** que você quer conseguir detectar (`0.3` = 30% a mais).

Exemplos reais:

| Baseline | MDE | Amostra por braço | Total |
|---|---|---|---|
| 12,37% | 20% | 3.081 | 6.162 |
| 12,37% | 30% | 1.387 | 2.774 |
| 12,37% | 50% | 519 | 1.038 |
| 5% | 20% | 8.155 | 16.310 |

Agora divida pelo tráfego que a campanha manda por dia. **Se der mais de 30 dias, não rode
esse teste.** Não é pessimismo, é aritmética: você vai gastar um mês pra terminar
"inconclusivo". Suas saídas são:

1. **Aumentar o MDE** — testar uma mudança mais radical. Trocar o hero inteiro detecta
   mais fácil que trocar a cor do botão.
2. **Juntar tráfego** — apontar mais campanhas pra mesma URL de teste.
3. **Escolher outra hipótese.** É uma resposta legítima e barata.

> Detalhe estatístico que costuma pegar: com efeito **grande**, o mSPRT cruza bem antes da
> amostra planejada e o teste pode parar cedo. A amostra alvo é o pior caso, não o
> obrigatório.

---

## Passo 1 — criar a página da variante no WordPress

A variante é uma **página de verdade**, feita no Elementor, com URL própria. Sem editor
visual, sem mutação de DOM, sem flicker.

Convenção de slug: `<slug-do-controle>-<o-que-mudou>`
(ex.: `/sql` → `/sql-hero-cardapio`).

**Duplique a página de controle** e mude **uma coisa só**. Duas mudanças ao mesmo tempo e
você não sabe qual delas ganhou.

### Três coisas obrigatórias na variante

**1. `rel=canonical` apontando pro controle.**

```html
<link rel="canonical" href="https://lp.cardapioweb.com/sql">
```

Sem isso o Google indexa a variante como página separada e pode **trocar a original por
ela** nos resultados. O Search Central é explícito: em teste A/B, canonical pro original.
No Elementor: *Configurações da página → Avançado → Canonical URL*, ou pelo Rank Math/Yoast.

**2. O formulário tem que ser igual ao do controle** — mesmos campos, mesmos rótulos. O
coletor `cw-site-tracking.php` captura **por rótulo do campo**; mudou o rótulo, o dado cai
em outro lugar e você vai comparar coisa diferente.

**3. Invalide o cache do WP Rocket** depois de publicar. Página de variante servida do
cache velho é o jeito mais comum de o teste sair torto — e o SRM vai acusar, mas só depois
de dias de tráfego perdido. Procedimento na skill `cw-wordpress-elementor`.

---

## Passo 2 — instalar o snippet nas duas páginas

No `<head>` do controle **e** da variante:

```html
<script defer src="https://<plataforma>/ab.js" data-ab="https://<plataforma>"></script>
```

⚠️ **Não cole isso pelo widget de HTML do Elementor.** O `cardapioweb-tracking.php` tem uma
regra no output buffer que **apaga snippet de terceiro** — foi o que sumiu com o snippet
oficial do Clarity em 31/07/2026. Use o mesmo caminho do loader `cw-clarity`, no mu-plugin.

O snippet:
- manda `view`;
- injeta `form_fields[cw_ab]` escondido em todo formulário da página;
- no `submit_success` do Elementor, manda `conversion`.

O campo escondido é a rede de segurança: mesmo que a plataforma saia do ar, a variante fica
gravada no lead e o experimento continua analisável pelo banco.

Precisa marcar conversão que não é formulário (clique no WhatsApp, por exemplo)?

```js
window.cwAB && window.cwAB.converter();
```

---

## Passo 3 — criar o teste no painel

**Novo teste**, e preencha:

| Campo | O que pôr |
|---|---|
| **Slug** | vira a URL do anúncio. Minúsculo, com hífen: `hero-lp-sql` |
| **Nome** | como o time chama |
| **Hipótese** | "Se ___, então ___, porque ___." O *porque* é o que vira aprendizado |
| **Card do Jira** | `GWT-xxxx` |
| **Variantes** | a **primeira é sempre o controle**. Peso 0.5 / 0.5 |
| **Baseline / MDE** | os do passo 0 |
| **Dias mínimos** | 7. Só mude se souber por quê |
| **Dias máximos** | 30. Quando estoura, o teste é encerrado como inconclusivo |
| **Status** | deixe em `rascunho` até terminar a conferência do passo 4 |

### O que fica travado depois que o status vira `rodando`

**A plataforma recusa a gravação**, não é só aviso:

| Travado | Por quê |
|---|---|
| peso, cobertura, seed | reatribui quem já entrou; contamina os dois braços |
| URL de variante | o visitante passa a ver outra página, contado no braço antigo |
| adicionar/remover variante | muda as faixas de sorteio de todo mundo |
| **ordem das variantes** | inverte quem é o controle **e** manda todo mundo pra outra página — sem acender SRM, porque a divisão continua 50/50 |
| **baseline, MDE, alfa, poder, dias mín./máx.** | são o plano de análise. Aumentar o MDE derruba a amostra alvo e o veredito sai na hora: vencedor fabricado num campo de formulário |

Os dois últimos foram achados por QA adversarial antes de a ferramenta subir. O de ordem
chega sozinho — basta remover e re-adicionar uma linha de variante no painel.

Nome, hipótese, card do Jira e observação você muda quando quiser.

Precisa mesmo mudar um peso? Encerre este teste e crie outro. É mais barato que descobrir
depois que o número não valia.

---

## Passo 4 — conferir ANTES de gastar verba

Ponha o status em `rodando` e rode os quatro:

**1. As duas variantes respondem**

```bash
curl -si -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0.0.0" \
  "https://<plataforma>/t/hero-lp-sql?cwforce=A" | grep -i "^location"
curl -si -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0.0.0" \
  "https://<plataforma>/t/hero-lp-sql?cwforce=B" | grep -i "^location"
```

Tem que dar `302` pras duas URLs diferentes. O `cwforce` **não é contabilizado** — pode
usar à vontade.

> Passe o `-A` com User-Agent de navegador. O UA padrão do `curl` é detectado como bot e
> desviado pro controle — o que está certo, mas vai te confundir. (Chrome headless também:
> ele manda `HeadlessChrome` no UA.)

**2. Os UTMs sobrevivem**

```bash
curl -si -A "Mozilla/5.0 ... Chrome/131.0.0.0" \
  "https://<plataforma>/t/hero-lp-sql?utm_source=meta&utm_campaign=sm33" | grep -i "^location"
```

`utm_source` e `utm_campaign` têm que aparecer no destino. Se sumirem, o relatório de
origem do lead quebra.

**3. O snippet está vivo nas duas páginas**

Abra cada URL de variante no navegador e, no console:

```js
window.cwAB.contexto()   // { teste: "hero-lp-sql", variante: "B" }
```

`undefined` = o snippet não carregou (ou você chegou direto, sem passar pelo roteador —
teste sempre clicando no link do roteador).

**4. Uma conversão de mentira chega**

⚠️ **Não use `cwforce` nesta conferência.** Visita com `cwforce` não é contabilizada — de
propósito, pra quem confere à mão não envenenar a amostra —, e por isso ela **não** manda o
identificador do visitante pra LP. Nenhuma conversão vai aparecer, e você vai concluir que
o `submit_success` está quebrado quando não está.

Faça assim: abra `https://<plataforma>/t/<slug>` **numa janela anônima**, sem `cwforce`.
Você cai numa das variantes por sorteio. Preencha o formulário com e-mail de teste. Em
~1 min o painel tem que somar 1 conversão naquela variante. Quer conferir a outra? Feche a
janela anônima e abra outra — cookie novo, sorteio novo.

Se a atribuição subiu mas a conversão não, aí sim o `submit_success` não está disparando —
é o problema mais comum em campo, e é melhor descobrir agora. Confira no console da LP:

```js
window.cwAB.contexto()   // { teste, variante, pagina }
```

A `pagina` tem que ser o caminho da LP em que você está. A conversão só vale nela — o
snippet ignora envio de formulário em qualquer outra página do site.

---

## Passo 5 — apontar o anúncio

Troque a URL de destino do anúncio (Meta Ads / Google Ads) por:

```
https://<plataforma>/t/hero-lp-sql
```

Os UTMs continuam sendo montados normalmente pela plataforma de anúncio.

**No Google Ads:** ponha a URL do roteador como **URL final**. A URL de exibição é
cosmética e pode ficar a do controle — lembrando que exibição ≠ destino, e que dá pra ela
apontar pra uma página 404 sem o anúncio estar quebrado.

---

## Passo 6 — esperar. Sem espiar.

Sim, o painel mostra as taxas o tempo todo. E sim, **olhar e decidir cedo é o erro que
esta ferramenta existe pra impedir**: parar no primeiro p < 0,05 leva o erro tipo I de 5%
pra perto de 100%.

Por isso o Slack **só** avisa quando o veredito muda pra algo acionável — vencedor, SRM ou
inconclusivo. Se não chegou mensagem, não há o que decidir.

**A única coisa que vale olhar antes da hora é a saúde:**

- **SRM** — se acender, pare tudo e investigue. Ver abaixo.
- **Origem do tráfego** — um IP sozinho puxando ≥ 25% do braço é laço, teste de carga ou
  monitor de uptime entrando na amostra. Tranca o veredito igual ao SRM.
- **Conversões órfãs** em volume → o snippet está numa página fora do teste.
- **Poucos views por atribuição** → o snippet não está numa das variantes.

### Acendeu SRM. E agora?

SRM quer dizer que a divisão real do tráfego não bate com a configurada. **Não olhe a
conversão** — o número está errado e nenhuma conta conserta. Procure, nesta ordem:

1. Uma das variantes está caindo (500, timeout) ou lenta a ponto de o visitante desistir.
2. WP Rocket servindo cache velho numa delas.
3. Bot novo batendo só numa URL (olhe os `bots_ignorados`).
4. Alguém mexeu na configuração com o teste rodando (a plataforma barra, mas edição direta
   no banco passa).

Corrigiu? **Encerre o teste e crie um novo.** Os dados de antes estão contaminados.

---

## Passo 7 — ler o veredito

| Veredito | O que fazer |
|---|---|
| **vencedor** | Publique a variante vencedora como página oficial, tire o anúncio do roteador e aponte direto. Depois **apague a perdedora** — página órfã vira dívida de SEO |
| **inconclusivo — encerrar** | Não há efeito do tamanho que você queria pegar. Encerre e vá pra próxima hipótese. Isso **não** é fracasso: é uma hipótese eliminada por um custo conhecido |
| **SRM** | Passo 6 |

O Slack diz por qual rota o vencedor saiu:

- **amostra planejada (z-test)** — chegou na amostra combinada e o teste deu significativo.
- **parada antecipada (mSPRT)** — o efeito foi grande o bastante pra decidir antes.

As duas valem igual. A segunda só economizou tráfego.

### Depois de decidir

1. Status do teste → `encerrado`.
2. Documente o pós-mortem (skill `/pos-mortem-experimento`) e cole o link no card do Jira.
3. Se virou aprendizado que outra pessoa reusaria, mande pro Mega Brain.

---

## Perguntas que já apareceram

**Dá pra rodar dois testes na mesma LP ao mesmo tempo?**
Tecnicamente sim — a seed de cada teste é diferente, então as atribuições são
independentes e não se correlacionam (a `hashVersion 2` do GrowthBook existe justamente
por isso). Mas você não vai saber qual mudança causou o quê, e cada teste come da mesma
amostra. Na prática: um por vez, por LP.

**E quem já viu a página antes do teste começar?**
Entra normalmente na primeira vez que passa pelo roteador. Como a variante é sorteada por
hash do id do visitante, gente que voltou continua vendo a mesma coisa.

**Posso mudar o texto da variante no meio do teste?**
Não. É outra variante. Encerre e crie outro.

**O visitante troca de variante se limpar o cookie?**
Sim — vira um visitante novo e é sorteado de novo. Acontece pouco e afeta os dois braços
igual, então não enviesa. O que enviesaria é mudar a seed ou o peso, e isso é bloqueado.

**Por que a taxa do painel não bate com a do RD Station?**
Denominadores diferentes. Aqui é **atribuição no roteador**; lá é sessão, ou pageview, ou
lead criado. Pra comparar variante com variante o nosso serve; pra número absoluto de lead,
use o RD. Ver as duas regras de integridade no [README](../README.md).
