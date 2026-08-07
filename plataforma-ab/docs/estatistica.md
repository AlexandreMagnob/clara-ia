# A estatística da plataforma

> O que cada trava faz, a fórmula, e por que ela está aí.
> Implementação em [`lib/estatistica.js`](../lib/estatistica.js).
> Toda conta deste documento é conferida contra uma rota independente em Python por
> [`testes/validar_estatistica.py`](../testes/validar_estatistica.py) — 48 checagens, erro ~1e-15.

## O problema que a plataforma resolve

Uma ferramenta de A/B que mostra "95% de confiança" atualizado em tempo real está te
convidando pro **peeking**: olhar todo dia e parar quando o número fica bonito.

O custo disso é maior do que parece. Parar na primeira vez que `p < 0,05` leva o erro tipo
I real de 5% para **perto de 100%** com monitoramento contínuo (Johari et al., *Peeking at
A/B Tests*, KDD 2017). Ou seja: se você olha todo dia e para quando dá significativo, você
vai declarar vencedor **quase sempre** — inclusive quando as duas variantes são idênticas.

Foi por isso que a atividade pediu "trava de amostra mínima / significância estatística
antes de declarar vencedor, pra não decidir com falso positivo". A trava é o produto.

---

## Trava 1 — ciclo mínimo (7 dias)

Puro bom senso operacional, sem fórmula: restaurante compra em ritmo semanal. Terça não se
parece com sábado. Um teste de 3 dias mede "quarta, quinta e sexta", não a variante.

Conta **dias corridos** entre o primeiro e o último dia com tráfego, não o número de dias
com dado. Um teste que rodou segunda, terça e voltou no domingo seguinte **atravessou** a
semana; um que teve 7 dias úteis seguidos nunca viu um fim de semana.
(`diasRodados` vs `diasComDado` em [`lib/store.js`](../lib/store.js).)

---

## Trava 2 — SRM (Sample Ratio Mismatch)

**A que mais salva, e a que quase ninguém implementa.**

Compara a divisão observada do tráfego com a configurada, por qui-quadrado:

```
χ² = Σ (observado − esperado)² / esperado          gl = nº de variantes − 1
```

Corte: **p < 0,001** dispara. O corte é apertado porque a checagem roda em **todo** teste —
com α = 0,05 ela gritaria à toa em 1 de cada 20. É o valor recomendado no
*Trustworthy Online Controlled Experiments* e usado por GrowthBook e Eppo; a Microsoft usa
0,0005.

Não opina quando algum valor esperado é menor que 5 — abaixo disso a aproximação
qui-quadrado não vale, e um falso alarme aqui faria o time desconfiar de teste sadio.

### Por que ela TRANCA em vez de avisar

SRM não é um problema de precisão que dá pra corrigir com mais dados ou com uma conta
melhor. É sintoma de que **alguém está sendo perdido antes de ser contado** — redirect
falhando, cache servindo errado, bot num braço só, página caindo. Quando isso acontece, os
que sumiram não são aleatórios, e a taxa de conversão do braço que restou não representa
nada.

Um exemplo do próprio kit de teste (`testes/simulacao.js`, passo 10): tirando 25% das
atribuições de B — e **nenhuma** conversão — a taxa de B sobe artificialmente e a
plataforma declararia B vencedora. Com a trava, ela devolve `SRM — resultado suspeito` e
`pode_decidir: false`.

---

## Trava 3 — evidência: duas rotas

Aqui mora a decisão de desenho menos óbvia da plataforma.

### Rota A — amostra planejada (z-test de horizonte fixo)

Tamanho de amostra por braço, calculado **antes** do teste começar:

```
n = (z_{1−α/2} + z_poder)² · (p₁(1−p₁) + p₂(1−p₂)) / (p₂ − p₁)²
```

com `p₂ = p₁ · (1 + MDE)`, α = 5%, poder = 80%.

Atingida a amostra, vale o z-test de duas proporções agrupado:

```
p̂ = (x₁+x₂)/(n₁+n₂)
z  = (p̂₂ − p̂₁) / √(p̂(1−p̂)(1/n₁ + 1/n₂))
```

Esse teste é válido porque é **uma olhada, no ponto que foi combinado antes**. É a análise
pré-registrada.

### Rota B — parada antecipada (mSPRT, p sempre-válido)

O *mixture Sequential Probability Ratio Test* (Robbins 1970; Johari, Pekelis e Walsh 2019)
dá um p-valor que pode ser olhado **a qualquer instante** sem inflar o falso positivo. É o
que a Optimizely usa desde 2015.

Misturando a hipótese alternativa com uma normal de variância τ²:

```
Λₙ = √( 2σ² / (2σ² + n·τ²) ) · exp( n²·τ²·Δ̂² / (4σ²·(2σ² + n·τ²)) )

pₙ = min(1, 1/Λₙ)        e o p sempre-válido é o MÍNIMO CORRENTE da série
```

- `σ²` = variância agrupada `p̄(1−p̄)`;
- `Δ̂` = diferença observada das proporções;
- `n` = n efetivo, definido por `n_ef = 2σ²/Var(Δ̂)`, o que faz a fórmula valer também com
  braços de tamanhos diferentes;
- `τ` = MDE em valor absoluto (`baseline × MDE`) — τ concentra o poder do teste em torno
  do efeito que a gente se importa em detectar.

"Mínimo corrente" quer dizer: uma vez que cruzou, cruzou. Não desfaz porque o dado de
amanhã foi pior.

### Por que OU, e não E

Porque exigir as duas seria conservador demais, a ponto de quebrar a ferramenta.

O mSPRT precisa de **~1,5 a 2× a amostra do horizonte fixo** pra cruzar no mesmo efeito —
é o preço de poder olhar todo dia. Um número concreto, do próprio kit de validação:

| Caso | p horizonte fixo | p sempre-válido |
|---|---|---|
| 100/1000 vs 130/1000, τ=0,02 | 0,0355 | 0,3964 |

Se a trava fosse "mSPRT E amostra planejada", esse teste — corretamente dimensionado, com
efeito real de +30% — seria declarado **inconclusivo**. O time perderia a confiança na
ferramenta em duas semanas, e com razão.

As duas rotas são legítimas e independentes:

- **Rota A** é a análise pré-registrada: uma olhada, no ponto combinado.
- **Rota B** é uma parada sequencial válida: serve pro efeito grande, que não precisa da
  amostra cheia.

O veredito diz por qual rota saiu, e o painel mostra os dois p-valores sempre.

---

## Comparações múltiplas: por que 6 braços quase quebrou a ferramenta

Cada desafiante é comparado contra o mesmo controle. Testar cada comparação a 5%
**não** mantém o erro global em 5% — a chance de pelo menos uma dar significativa por acaso
cresce com o número de braços.

Medido no motor desta plataforma, com teste **A/A puro** (variantes idênticas, nenhuma
diferença real), 14 dias × 400/dia por braço, 1500 repetições por cenário:

| Braços | Falso positivo, antes | α por comparação (Šidák) | Falso positivo, depois |
|---|---|---|---|
| 2 | 5,5% | 0,0500 | 5,1% |
| 3 | 10,7% | 0,0253 | 5,3% |
| 4 | 13,6% | 0,0170 | 4,5% |
| 6 | **20,1%** | 0,0102 | 3,3% |

Com 6 braços e nenhuma diferença real, a ferramenta inventava um vencedor **em 1 de cada
5 testes**. E o painel tem botão "adicionar variante", sem nenhum aviso.

A correção é Šidák:

```
α_por_comparação = 1 − (1 − α)^(1/k)
```

Aplicada às duas rotas de evidência. É levemente conservadora — Dunnett aproveitaria a
correlação entre comparações que dividem o mesmo controle —, e conservador aqui é o lado
certo de errar. Por isso 6 braços fica em 3,3% e não em 5%.

O α ajustado aparece no resultado (`alfa_por_comparacao`) e no texto da trava.

`testes/aa-falso-positivo.js` roda essa medição. Ele existe pra denunciar quem mexer nisso
depois.

> Consequência prática: **mais braços custa muito mais amostra**. Com 4 braços você precisa
> de α = 0,017 por comparação, o que exige bem mais gente que os 5% de um teste de 2 braços
> — além de dividir o tráfego em 4. Dois braços continua sendo o certo por padrão.

---

## Trava 4 — origem do tráfego

Um único `ip_hash` respondendo por **≥ 25%** das atribuições tranca o veredito.

Vem de um ataque que o QA reproduziu: 600 requisições a `/t/<slug>` com cookie escolhido a
dedo (os vids que caem em cada braço são calculáveis, porque `lib/hash.js` é público),
mais 300 conversões forjadas. Resultado: `A: 30/300, B: 300/300`, **SRM p = 1,0**, trava de
evidência verde. Só o ciclo mínimo segurava, e ele cai sozinho em 7 dias.

O corte é 25%, não 2%, porque NAT existe: operadora de celular e rede corporativa colocam
gente de verdade atrás de um IP só, e no tráfego mobile brasileiro alguns por cento de um
IP são normais. Um quarto do braço num IP só não é NAT — é script.

Na prática o que isso pega quase sempre não é ataque: é teste de carga, monitor de uptime
com User-Agent de navegador, e retry em laço.

O `ip_hash` já era gravado em toda linha desde o começo e não era lido por ninguém.

---

### O que fica em aberto

Depois de atingir a amostra planejada, o painel continua recalculando o z-test a cada
execução. Formalmente, isso é olhar mais de uma vez com o teste de horizonte fixo e infla
o α um pouco acima de 5%. Na prática o efeito é pequeno (a trava de ciclo e a amostra já
passaram, e o job roda 1x/dia), mas é honesto registrar: **a hora de decidir é quando o
veredito aparece, não três semanas depois.**

---

## Precisão numérica

Nada de biblioteca externa — tudo roda no edge da Vercel.

| Função | Método | Por quê |
|---|---|---|
| `erfc` | Chebyshev, Numerical Recipes 3ª ed. §6.2 | erro **relativo** < 1e-15. Aproximação de erro *absoluto* (como a Abramowitz-Stegun 7.1.26) mentiria na cauda — e é lá que mora o corte de 0,001 do SRM |
| `normalCdf` | `0.5·erfc(−z/√2)` | |
| p bicaudal | `erfc(|z|/√2)` direto | evita o cancelamento catastrófico de `2·(1−Φ(z))` |
| `normalQuantil` | Acklam + refino de Halley | ~1e-15 |
| `chi2P` | gl=1 fechado; gl>1 por gama incompleta (série + fração continuada de Lentz) | |

A validação em Python confere `erfc` contra `math.erfc`, o quantil contra
`statistics.NormalDist.inv_cdf`, e a qui-quadrado contra a forma fechada de gl 1 a 4
(que cobre 2 a 5 variantes).

---

## Casos degenerados

Todos com teste em [`testes/unidade.js`](../testes/unidade.js):

| Situação | Comportamento |
|---|---|
| n = 0 num braço | `valido: false`, p = 1, sem veredito |
| zero conversão nos dois | p = 1 (o z-test não é definido; não inventa) |
| τ = 0 ou variância 0 | mSPRT devolve p = 1 |
| amostra pequena demais pro qui-quadrado | SRM não opina (`aplicavel: false`) |
| 1 variante só | recusado antes de qualquer conta |
| conversão > atribuição | não quebra (mas é sintoma — investigue o dado) |
| baseline ou MDE fora de faixa | `amostraMinima` devolve `null`, a rota A não abre |

---

## Fontes

- Johari, Pekelis, Walsh — [*Always Valid Inference: Continuous Monitoring of A/B Tests*](https://arxiv.org/pdf/1512.04922)
- Johari, Koomen, Pekelis, Walsh — [*Peeking at A/B Tests* (KDD 2017)](http://library.usc.edu.ph/ACM/KKD%202017/pdfs/p1517.pdf)
- Kohavi, Tang, Xu — *Trustworthy Online Controlled Experiments* (o corte de SRM)
- Microsoft Research — [*Diagnosing Sample Ratio Mismatch in A/B Testing*](https://www.microsoft.com/en-us/research/articles/diagnosing-sample-ratio-mismatch-in-a-b-testing/)
- GrowthBook — [Build Your Own SDK](https://docs.growthbook.io/lib/build-your-own) (hash e faixas de bucket)
- Press et al. — *Numerical Recipes*, 3ª ed. (erfc, gama incompleta)
