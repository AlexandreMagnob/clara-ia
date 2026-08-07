# QA adversarial — o que foi encontrado e o que foi feito

> 06/08/2026 · antes da primeira publicação · veredito inicial: **NÃO SUBIR**

A plataforma foi entregue a um QA adversarial com a instrução de quebrá-la: inflar braço,
forjar conversão, fabricar vencedor, furar o redirect, poluir a amostra. Ele achou **7
furos** e uma lista de melhorias. Todos foram corrigidos, e cada um ganhou teste de
regressão.

Este documento existe porque a lista de furos é mais instrutiva que a lista de acertos —
quase todos eram invisíveis: o número saía errado sem erro nenhum aparecer.

---

## O que ele achou

### P0 · Reordenar variantes reatribuía todo mundo, calado

`lib/config.js` travava peso, seed, URL e conjunto de variantes com o teste rodando — mas
não a **ordem**. E a ordem é o que define as faixas de sorteio em `atribuir()`.

Inverter A e B fazia 100% dos visitantes passarem a receber a URL do outro braço. Mas a
atribuição já gravada não mudava (o dedupe barra a segunda): **eles viam a página B e
seguiam contados em A**. A divisão continuava 50/50, então o SRM não acusava. O teste
parecia perfeitamente saudável enquanto media coisa nenhuma. De quebra, inverter a ordem
troca quem é o controle, o que inverte o sinal do lift.

Não precisava de má-fé pra chegar lá: bastava remover e re-adicionar uma linha de variante
no painel. E no driver do Supabase o `obterTeste` trazia `ab_variantes(*)` **sem `order=`**,
então a ordem que voltava era a que o Postgres quisesse — duas leituras seguidas podiam
inverter A e B sozinhas.

**Corrigido:** `ordem` entrou no bloco de campos travados; o embed do PostgREST agora pede
`variantes.order=ordem.asc`.

### P1 · Dava pra fabricar o vencedor editando um campo

`baseline`, `mde`, `alfa`, `poder` e `min_dias` também não eram travados. A amostra alvo é
recalculada a cada análise a partir do valor **atual**, nunca do pré-registrado.

Com o mesmo dado (A 150/1500, B 190/1500, 10 dias): `mde=0.2` → amostra mínima 3839 →
`rodando`. `mde=0.4` → amostra mínima 1033 → **`vencedor B`**. Sem histórico de alteração.

É exatamente o peeking que a ferramenta existe pra impedir, virado num campo de formulário.

**Corrigido:** os seis parâmetros do plano de análise ficam congelados enquanto o teste
roda. Mudar plano de análise no meio invalida o experimento — é o motivo de o plano ser
pré-registrado.

### P1 · A rede de segurança do snippet era desligada por ela mesma

`app/ab.js` injeta `form_fields[cw_ab]` em todo formulário da página. Logo depois, a rede
de segurança do submit nativo perguntava:

```js
if (f.querySelector('[name^="form_fields"]') && window.jQuery) return; // "Elementor cuida"
```

A guarda casava **sempre**, porque o campo que ela encontrava tinha sido posto pelo próprio
snippet. Resultado: formulário não-Elementor com jQuery na página (o padrão em WordPress) →
**nenhuma conversão enviada**, em silêncio total.

**Corrigido:** a guarda agora reconhece formulário do Elementor de verdade
(`.elementor-form`). Coberto por `testes/snippet-dom.js`, que roda o `ab.js` real.

### P1 · Conversão valia para qualquer formulário do site, por 30 dias

`jQuery(document).on('submit_success', converteu)` é um listener de **documento**, e o
contexto sobrevive em `localStorage` por 30 dias. Newsletter do rodapé, popup de saída,
formulário de contato — em qualquer página — viravam conversão do teste.

O numerador deixava de medir a LP e passava a medir "qualquer formulário do site". Nada,
depois, separava os dois.

**Corrigido:** o contexto guarda a página em que o roteador largou o visitante; a conversão
(e o `view`) só valem nela.

### P1 · Salvar um teste apagava as variantes antes de recriá-las

No driver do Supabase, `salvarTeste` fazia `DELETE /ab_variantes` e depois `POST` — duas
chamadas HTTP, sem transação. Entre elas o teste existia com **zero variantes**, e o
roteador caía no fallback ou num 404 de texto puro. Com o INSERT falhando, ficava assim até
alguém salvar de novo — com o anúncio ativo.

Um "corrigir o nome do teste" podia derrubar a campanha.

**Corrigido:** upsert primeiro (`on_conflict=teste_slug,chave`), remoção das chaves que
saíram depois. Nunca existe instante sem variante.

### P1 · Conversão de conferência era adotada depois

O passo 4 do guia manda conferir a variante e enviar o formulário. Se o operador usasse
`?cwforce=B`, a visita não era contabilizada (correto) **mas o `cwvid` ia pra LP mesmo
assim**. A conversão nascia órfã — e no dia em que aquele navegador clicasse num anúncio de
verdade, a atribuição nascia e a órfã era adotada retroativamente, porque a agregação
varria por tipo, não por tempo.

Duas perdas: a conferência do guia nunca fechava (parecia `submit_success` quebrado, e o
guia mandava caçar esse fantasma), e lixo de QA entrava na conta.

**Corrigido:** `cwvid` só sai quando a visita conta; e a agregação descarta conversão
anterior à atribuição. O guia foi reescrito pra mandar conferir em janela anônima sem
`cwforce`, explicando por quê.

### P1 · O painel relia tudo, para sempre

`/api/resultados` sem slug analisava **todo** teste, inclusive encerrados, em série — e cada
um pagina os eventos de 1000 em 1000. 220 mil eventos = 220 idas ao PostgREST em sequência,
~18s, acima do limite da função (10s no Hobby, 15s no Pro).

E falha em silêncio: o 504 vai pro log, o painel simplesmente para de abrir e o cron para
de produzir veredito. O custo crescia sozinho e nunca caía.

**Corrigido:** o padrão passou a ser só testes vivos (`rodando`/`pausado`); `?todos=1` traz
o resto. `maxDuration` declarado por função no `vercel.json`.

### P2 · Dava pra fabricar a amostra por fora

Como `lib/hash.js` é público e o slug está na URL do anúncio, dá pra calcular quais ids de
visitante caem em cada braço. O QA fez 600 requisições com cookie escolhido a dedo mais 300
conversões: `A: 30/300, B: 300/300`, **SRM p = 1,0**, trava de evidência verde. Só o ciclo
mínimo segurava, e ele cai sozinho em 7 dias.

O `ip_hash` era gravado em toda linha desde o começo e **nunca era lido por ninguém**.

**Corrigido:** a agregação passou a medir concentração de IP, e a trava "origem do tráfego"
barra o veredito acima de 25% num único `ip_hash`. Corte alto de propósito — NAT de
operadora e rede corporativa colocam gente de verdade atrás de um IP só. Mais um freio por
IP em `/api/ev`, honesto sobre ser por instância.

---

## Melhorias aplicadas

| O quê | Por quê |
|---|---|
| Correção de Šidák para comparações múltiplas | 6 braços davam **20,1%** de falso positivo em teste A/A, contra os 5% prometidos. Agora 3,3%. Ver [`estatistica.md`](estatistica.md) |
| `/t/` só aceita GET e HEAD | um HEAD de verificador de link rodava o fluxo e gravava atribuição de quem nunca viu página |
| Timeout de 800ms na gravação da atribuição | aguardar é o certo, mas sem teto um soluço do banco segura o clique pago até a função estourar |
| `cwvid` não sai para tráfego fora da cobertura | com `cobertura < 1`, conversão órfã era **estrutural** — o aviso de saúde acenderia todo dia e treinaria o time a ignorá-lo |
| `cruzouEm` usa o alfa do teste | estava com `0.05` cravado; afetava só o rótulo exibido, não o veredito |
| `Access-Control-Max-Age` em `/api/ev` | o `sendBeacon` com Blob JSON obriga preflight a cada conversão — no pior momento, com a página navegando |
| `MutationObserver` com debounce, ancorado no `<body>` | varria o DOM inteiro a cada mutação; LP com carrossel muta o tempo todo |
| `DELETE /api/testes` exige confirmação repetindo o slug | `ab_eventos` tem `on delete cascade`: apagar o teste apagava todo o dado bruto, sem confirmação e sem export |
| Guarda de corpo não-objeto em `/api/ev` e `/api/testes` | `JSON.parse('null')` é JSON válido e não é objeto — endpoint público não pode dar 500 com corpo malformado |

---

## O que o QA atacou e **não** quebrou

Vale registrar, porque é onde o desenho segurou:

- `/api/ev` recusa `tipo=assignment` — navegador não cria atribuição.
- Conversão que declara "sou B" mas cujo dono foi atribuído a A vai para **A** (30 casos).
- A lista de domínios resiste a `cardapioweb.com.invasor.net`, credencial embutida,
  `javascript:`, `data:`, barra dupla e `http://` sem `AB_PERMITIR_HTTP`.
- O fuso está certo na virada de dia e de mês; `dia("lixo")` não quebra.
- SRM pega braço zerado (p = 1,8e-219) e não opina com esperado < 5.
- 1 variante, n = 0 e τ = 0 são recusados antes de qualquer conta.
- Paginação e agregação toleram evento duplicado no arquivo.

---

## O que fica em aberto

- **O campo escondido pode não chegar ao lead.** O guia trata `form_fields[cw_ab]` como
  rede de segurança, mas o Elementor Pro monta o registro a partir dos campos configurados
  no formulário, e o `cw-site-tracking.php` captura **por rótulo**. Um input injetado por
  JS, sem rótulo e sem id registrado, tende a ser descartado nos dois. **Confirme
  submetendo um formulário de teste e olhando a submissão no Elementor antes de contar com
  esse plano B.** Não dá pra verificar isso sem o WordPress na frente.
- **O freio por IP em `/api/ev` é por instância**, não global — serverless não compartilha
  estado. Segura laço acidental e retry em loop; não segura ataque distribuído. A defesa
  real contra amostra fabricada é a trava de origem do tráfego, na análise.
- **Šidák é conservador.** Dunnett aproveitaria a correlação entre comparações que dividem
  o mesmo controle e daria um pouco mais de poder. Só vale a pena se testes de 3+ braços
  virarem rotina.
