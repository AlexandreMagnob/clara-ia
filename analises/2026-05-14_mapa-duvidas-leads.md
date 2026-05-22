# Mapa de Dúvidas dos Leads — Últimos 30 dias

**Período:** 14/04/2026 a 14/05/2026
**Base analisada:** 1.572 leads (tier 4+5, count_messages > 14, date_created > 14/04/2026)
**Metodologia:** SQL no Supabase — extração das linhas `] Lead :` do campo `conversa` + categorização semântica por padrões ILIKE por lead único

> **Como usar os exemplos:** cada exemplo inclui o e-mail do lead. Pesquise o e-mail no Supabase para acessar a conversa completa e validar o contexto.

---

## Tabela Resumo

| # | Categoria | Leads | % da base | Prioridade |
|---|---|---|---|---|
| 1 | Preço / Confusão mensal vs anual | 116 | 7,4% | CRÍTICA |
| 2 | iFood / Integração com plataformas de entrega | 248 | 15,8% | ALTA |
| 3 | Leads iniciando o negócio (ainda não abriram) | 134 | 8,5% | ALTA |
| 4 | Funcionalidades / módulos | 58 | 3,7% | ALTA |
| 5 | Hardware / impressora / infraestrutura | 35 | 2,2% | MÉDIA |
| 6 | Formas de pagamento / recebimento dos pedidos | 30 | 1,9% | ALTA |
| 7 | 'Você é humano ou IA?' | 20 | 1,3% | MÉDIA-ALTA |
| 8 | Comparação com concorrentes (Anota.i, Diggy) | 14 | 0,9% | MÉDIA |
| 9 | Trial / período de teste | 9 | 0,6% | MÉDIA |
| 10 | NFCe / Nota fiscal | 9 | 0,6% | MÉDIA |
| 11 | Leads fora do escopo (agências, distribuidoras) | 4+ | 0,3%* | CRÍTICA |
| 12 | Atendimento duplicado | 2+ | 0,1%* | CRÍTICA |

> \* Os números de "fora do escopo" e "atendimento duplicado" estão subestimados — os padrões ILIKE são conservadores para esses casos. O número real é maior (ver observações em cada categoria).

---

## Categoria 1 — Preço / Confusão Mensal vs Anual

**Leads:** 116 (7,4%)
**Gravidade:** CRÍTICA — principal barreira de conversão individual

### Padrão de confusão

O lead entende o valor (R$179,99 / R$209,99 / R$239,99) mas não entende o modelo: é mensal ou anual? Confunde "anual parcelado em 12x no cartão" com "mensalidade renovável todo mês". Resultado: o lead acha que vai gastar mais do que vai, entra em choque de preço, e a conversa emperra.

### Exemplos reais (com e-mail para validação)

| E-mail | Segmento | Mensagem do lead |
|---|---|---|
| `andersonboy428@gmail.com` | Outro | *"Ah, então R$179,99 é um valor anual que pode ser parcelado em 12x??"* |
| `vitoria_pvh@hotmail.com` | Açaiteria | *"Só para eu entender melhor, este é o valor a ser pago mensalmente para ter essas opções?"* |
| `jv.ganhador@gmail.com` | Hamburgueria | *"Eu pagaria então 180 12x?"* |
| `brendasousaleticia@gmail.com` | Açaiteria | *"Esse valor é mensal né?"* |
| `matheus_taquinho@hotmail.com` | Açaiteria | *"Esse valor é mensal?"* |
| `ceudeacai4@gmail.com` | Açaiteria | *"a mensalidade seria de qual valor?"* |
| `leandro5860@gmail.com` | Açaiteria | *"Achei salgado o valor de 179,99 para quem tá começando agora"* |
| `ermersongamer@gmail.com` | Açaiteria | *"Esse valor de 239,99 é fixo ou aumenta? Tem limite de pedidos? Como funciona"* |

### Diagnóstico

A Clara explica o preço mas o lead ainda sai confuso. O problema é sistêmico: **116 leads (7,4%) de um universo de 1.572 reproduziram essa dúvida** — o que significa que a explicação atual está falhando de forma consistente.

O modelo mental do lead é "mensalidade". A frase "anual parcelado em 12x no cartão" aciona a confusão porque parece exatamente uma mensalidade de cartão. A Clara precisa de uma âncora clara antes de mencionar o valor — algo como: *"O plano é anual — você paga uma vez no ano. Mas o CardápioWeb te dá a opção de parcelar em até 12x no cartão, sem juros. É diferente de mensalidade: você não recebe boleto todo mês."*

---

## Categoria 2 — iFood / Integração com Plataformas de Entrega

**Leads:** 248 (15,8%)
**Gravidade:** ALTA

### Padrão de confusão

Atenção: 248 leads mencionam "iFood" em algum contexto — mas isso inclui leads que apenas informam que usam iFood atualmente. O subconjunto que tem dúvidas específicas sobre **integração** (Entrega Fácil, pedidos integrados automaticamente) é menor, estimado em ~50–80 leads. Os principais sub-padrões:

1. **"Quero sair do iFood e usar o Cardápio Web"** — lead insatisfeito com as taxas, quer entender se consegue migrar.
2. **"A Entrega Fácil do iFood funciona com o Cardápio Web?"** — lead quer manter os entregadores do iFood mas sem a plataforma.
3. **"O sistema tem integração com iFood?"** — dúvida básica de compatibilidade.

### Exemplos reais (com e-mail para validação)

| E-mail | Segmento | Mensagem do lead |
|---|---|---|
| `caveonthegrill@gmail.com` | Açaiteria | *"Tem escopo de entrega fácil aí?"* |
| `acaidaora.capimmacio@gmail.com` | Açaiteria | *"Sim, ele faz a emissão de NFCe e integra com o iFood?"* |
| `carlosilva0320@gmail.com` | Açaiteria | *"Todo pedido que chegava via iFood era contabilizado para o sistema do Anota.ai pois estava integrado e eu não tinha conhecimento disso"* |
| `acai.point.sorv1339@gmail.com` | Açaiteria | *"Vcs tem integração com o iFood"* |
| `ceudeacai4@gmail.com` | Açaiteria | *"Ifood e 99"* (informando plataformas que usa) |

### Diagnóstico

A base RAG provavelmente não cobre com clareza o fluxo específico de **Entrega Fácil do iFood integrada ao Cardápio Web** — se é automático ou manual, e o que acontece com os pedidos. Como o iFood é o maior ponto de comparação do mercado, essa lacuna impacta muita conversa. Recomendação: enriquecer a base RAG com um documento específico sobre o fluxo de integração iFood × Cardápio Web.

---

## Categoria 3 — Leads Iniciando o Negócio (Ainda Não Abriram)

**Leads:** 134 (8,5%)
**Gravidade:** ALTA — volume significativo, problema de timing

### Padrão

Lead tem fit com o produto mas ainda não está operando. Varia de quem vai abrir em dias até quem está apenas "pensando em abrir". O script atual tende a encerrar esses leads por falta de timing no BANT.

### Exemplos reais (com e-mail para validação)

| E-mail | Segmento | Mensagem do lead |
|---|---|---|
| `marieduoliveira2302@gmail.com` | Confeitaria | *"Vou abrir oficialmente minha loja e quero um cardápio virtual e saber como colocar um valor justo e que eu lucre com isso"* |
| `ftvduarte@gmail.com` | Outro | *"gostaria de testar a plataforma de vocês, vou abrir apenas para amigos para tentar processos e equipamentos"* |

### Diagnóstico

134 leads (8,5%) não têm timing imediato mas têm intenção real. São o melhor público para uma cadência de nurturing. A janela de abertura de um negócio é o momento de maior receptividade para adotar um sistema — o lead ainda está montando tudo e não tem resistência a mudanças. Recomendação: criar uma trilha de follow-up específica para "vai abrir em X dias" com mensagens de valor sobre como se preparar antes da abertura.

---

## Categoria 4 — Funcionalidades / O que está incluído nos planos

**Leads:** 58 (3,7%)
**Gravidade:** ALTA

### Exemplos reais (com e-mail para validação)

| E-mail | Segmento | Mensagem do lead |
|---|---|---|
| `hugofdrumond@gmail.com` | Hamburgueria | *"O que é o módulo de entregadores?"* |
| `andersonsonzinho0@gmail.com` | Outro | *(audio) "a gente não tem o PDV ainda completo, nem o computador e nem a impressora, entendeu? A gente tá querendo ter isso daí e pôr o aplicativo também pra poder rodar"* |
| `wallace.zionit@gmail.com` | Pizzaria | *(conversa sobre módulos — acessar pelo e-mail)* |

### Diagnóstico

Leads chegam sem entender que o Cardápio Web é um sistema completo de pedidos e gestão, não apenas um "cardápio digital". A Etapa 3 (Apresentação) precisa de uma abertura que re-posicione o produto como **sistema de vendas**, não como menu. A base RAG parece incompleta em: detalhes do módulo financeiro, módulo de entregadores, programa de fidelidade e marketplace.

---

## Categoria 5 — Hardware / Impressora / Infraestrutura

**Leads:** 35 (2,2%)
**Gravidade:** MÉDIA — bloqueio técnico real

### Exemplos reais (com e-mail para validação)

| E-mail | Segmento | Mensagem do lead |
|---|---|---|
| `mariana.colamonico@gmail.com` | Outro | *"Tipo é só eu ter a impressora, né?"* |
| `mayvisson2022@gmail.com` | Outro | *"Precisa de impressora?"* |
| `wesleytecbh@hotmail.com` | Hamburgueria | *"Estarei no iFood delivery e no meu WhatsApp esperando os pedidos... outra coisa: vc vai configurar minha impressora pra receber os pedidos?"* |
| `andersonsonzinho0@gmail.com` | Outro | *(audio) "a gente não tem o PDV ainda completo, nem o computador e nem a impressora"* |

### Diagnóstico

Dois sub-problemas: (1) Leads tier 4–5 frequentemente não têm computador, querem operar tudo pelo celular — a Clara precisa de resposta clara sobre o que é possível só no celular vs o que requer desktop. (2) Impressora térmica: lead assume que a impressora vai ser configurada pelo Cardápio Web — isso precisa ser esclarecido no script. A base RAG não tem um documento de "requisitos mínimos de infraestrutura".

---

## Categoria 6 — Formas de Pagamento / Recebimento dos Pedidos

**Leads:** 30 (1,9%)
**Gravidade:** ALTA — afeta decisão de compra

### Exemplos reais (com e-mail para validação)

| E-mail | Segmento | Mensagem do lead |
|---|---|---|
| `domparrilleiro@gmail.com` | Hamburgueria | *"Conheci a parte da página de cardápio e o formato de pedido, Cadastro e forma de pagamento"* |
| `hugofdrumond@gmail.com` | Hamburgueria | *"Vocês trabalham com mensalidade, qual o custo e forma de pagamento?"* |
| `paiva.vendedor@hotmail.com` | Confeitaria | *"O pagamento da mensalidade é feito como?"* |

### Diagnóstico

Confusão sobre o **fluxo do dinheiro**: lead quer saber se o dinheiro do pedido vai direto para sua conta ou passa pela plataforma primeiro; se precisa ter conta no Mercado Pago; se o PIX do cliente vai para o PIX do restaurante. A base RAG provavelmente não cobre: (a) quais gateways são suportados, (b) se o Pix é direto ou intermediado, (c) prazo de liquidação.

---

## Categoria 7 — 'Você é Humano ou IA?'

**Leads:** 20 (1,3%)
**Gravidade:** MÉDIA-ALTA — risco real de abandono

### Exemplos reais (com e-mail para validação)

| E-mail | Segmento | Mensagem do lead |
|---|---|---|
| `loridulori@gmail.com` | Sushi | *(lead testou explicitamente se era humano ou máquina — acessar conversa completa)* |
| `maxfunilaria82@gmail.com` | Outro | *(conversa sobre natureza da Clara — acessar pelo e-mail)* |
| `juliana.silvadpm@gmail.com` | Hamburgueria | *(questionamento sobre IA — acessar pelo e-mail)* |

### Observação sobre o caso Sushi

A lead `loridulori@gmail.com` (segmento Sushi) é o caso mais documentado: passou por múltiplos chatbots ruins antes da Clara, testou diretamente se era humano ou máquina, e expressou alívio quando a conversa funcionou bem. Representa um perfil crescente no mercado: **"queimado por IAs ruins"**.

### Diagnóstico

A Clara não tem um protocolo definido para quando perguntada sobre sua natureza. Responder de forma ambígua piora a desconfiança. Protocolo recomendado: ser honesta sobre ser uma IA, mas diferenciar positivamente — *"Sou uma assistente de IA do Cardápio Web, mas toda reunião é conduzida por um especialista humano. E estou aqui para garantir que você chegue nessa reunião com todas as suas dúvidas respondidas."*

---

## Categoria 8 — Comparação com Concorrentes

**Leads:** 14 (0,9%)
**Gravidade:** MÉDIA — oportunidade de diferenciação

### Exemplos reais (com e-mail para validação)

| E-mail | Segmento | Mensagem do lead |
|---|---|---|
| `ermersongamer@gmail.com` | Açaiteria | *"Eu trabalhava somente no delivery com outro sócio, e usamos o sistema (Anota.i)"* |
| `darllan_ddm@hotmail.com` | Restaurante | *"Já usei o Anota.i"* |
| `caiotorati@hotmail.com` | Hamburgueria | *"Anota.i"* (mencionou como ponto de comparação) |
| `loridulori@gmail.com` | Sushi | *"Diggy"* (testando alternativa) |

### Diagnóstico

Lead que veio de experiência ruim com concorrente (Anota.i, Diggy) está em modo defensivo — precisa de validação antes de comprometer dinheiro. A Clara precisa de um script para esse perfil: reconhecer a experiência sem atacar o concorrente, e focar no que é diferente. Um caso documentado (`carlosilva0320@gmail.com`, Açaiteria) é particularmente valioso: o lead teve pedidos contabilizados no sistema do Anota.i sem saber — e estava preocupado com isso se repetir.

---

## Categoria 9 — Trial / Período de Teste

**Leads:** 9 (0,6%)
**Gravidade:** MÉDIA

### Exemplos reais (com e-mail para validação)

| E-mail | Segmento | Mensagem do lead |
|---|---|---|
| `crisborgest@gmail.com` | Hamburgueria | *"Existe algum período de teste?"* |
| `darllan_ddm@hotmail.com` | Restaurante | *"Gostaria de saber se tem o período de testes"* |
| `jhenniferraiene1@gmail.com` | Hamburgueria | *"Teria algum período de teste?"* |

### Diagnóstico

Lead com receio de comprometer orçamento sem testar. O script atual já tem contorno de ROI, mas pode ser mais persuasivo: *"Não temos trial, mas nossa demonstração ao vivo com o especialista é melhor que qualquer teste — você sai sabendo exatamente o que vai ganhar antes de pagar qualquer coisa."* Adicionalmente: o lead `gerlanalves6918@gmail.com` (Pizzaria) enviou screenshot de um concorrente (cardapio.ai) com planos a partir de R$49,90/mês — vale verificar se esse concorrente está captando leads que deveriam ser da CardápioWeb.

---

## Categoria 10 — NFCe / Nota Fiscal

**Leads:** 9 (0,6%)
**Gravidade:** MÉDIA — lacuna específica da base RAG

### Exemplos reais (com e-mail para validação)

| E-mail | Segmento | Mensagem do lead |
|---|---|---|
| `acaidaora.capimmacio@gmail.com` | Açaiteria | *"Sim, ele faz a emissão de NFCe e integra com o iFood?"* |
| `mariana.colamonico@gmail.com` | Outro | *(pergunta sobre NFCe — acessar pelo e-mail)* |

### Diagnóstico

Leads perguntando se o sistema emite NFCe (Nota Fiscal de Consumidor Eletrônica). A base RAG provavelmente não cobre isso claramente. Se o sistema não emite, a Clara precisa saber redirecionar para a solução atual dos clientes (NF avulsa, integração com emissor próprio).

---

## Categoria 11 — Leads Fora do Escopo / Perfil Errado

**Leads identificados:** 4+ (padrão conservador — número real estimado em 15–25)
**Gravidade:** CRÍTICA — desperdício de recursos da Clara

### Subtipos confirmados

**Agências de marketing:**

| E-mail | Segmento | Mensagem do lead |
|---|---|---|
| `inoovasuporte@gmail.com` | Pastelaria | *"Na verdade a Esquina do Pastel é um cliente meu, tenho uma agencia de marketing, vou cuidar dessa parte do cardápio"* |

**Distribuidoras:**

| E-mail | Segmento | Mensagem do lead |
|---|---|---|
| `larissamariafragasilveira92@gmail.com` | Outro | *"Não, o meu é distribuidora de bebidas em geral"* |
| `thainarafernando41@gmail.com` | Restaurante | *"Tenho uma distribuidora"* |

### Diagnóstico

O campo `segmento = 'Outro'` concentra grande parte desses leads. O problema começa antes da Clara: formulários de captação não filtram por tipo de negócio, e a tierização não exclui perfis incompatíveis antes de jogá-los no funil. Recomendação: adicionar lógica de pré-qualificação por segmento na etapa de triagem, antes de criar a conversa.

---

## Categoria 12 — Atendimento Duplicado / Confusão de Identidade

**Leads confirmados:** 2+ (padrão muito conservador — número real provavelmente maior)
**Gravidade:** CRÍTICA — destrói confiança imediatamente

### Exemplos reais (com e-mail para validação)

| E-mail | Segmento | Mensagem do lead |
|---|---|---|
| `reinoacucarado12@gmail.com` | Confeitaria | *"Cardápio de outra pessoa empresa.."* (recebeu contato duplicado — acessar conversa completa) |
| `deborahribeiro0528@outlook.com` | Hamburgueria | *(lead retornando após ser abordado 2x — acessar pelo e-mail)* |

### Diagnóstico

Lead recebe dois contatos do Cardápio Web para o mesmo assunto — provavelmente automação de follow-up disparando depois que a Clara já iniciou conversa, ou dois números abordando o mesmo lead. O número real de leads afetados é provavelmente maior que 2 — as frases mais comuns usadas nesse contexto (*"já me mandou mensagem antes"*, *"vocês já me contactaram"*) não foram capturadas pelo filtro conservador. Recomendação: investigar a lógica de disparo do follow-up e garantir deduplicação por WhatsApp antes de disparar.

---

## Observações Importantes

### Inconsistência no nome da Clara
Em várias conversas, a Clara é chamada por nomes diferentes: "Dayana", "Daiane", "Thais", "Rian", "Ryan Filipe". Isso pode indicar que o nome da persona varia entre conversas, ou que leads estão confundindo a Clara com atendentes humanos anteriores. Vale verificar se o nome "Clara" está sendo aplicado de forma consistente em todas as conversas ativas.

### Concorrente cardapio.ai capturando atenção
O lead `gerlanalves6918@gmail.com` (Pizzaria) enviou screenshot de um concorrente chamado "cardapio.ai" com planos a partir de R$49,90/mês. Se esse concorrente está aparecendo no radar dos mesmos leads que a CardápioWeb atinge, vale monitorar.

### Leads com > 134 mensagens têm padrão de abandono por resposta automática do WhatsApp
Vários leads com muitas mensagens têm respostas automáticas do WhatsApp Business no início da conversa (tipo *"Laise Ribeiro | Shake Point agradece seu contato. Como podemos ajudar?"*) — isso distorce o `count_messages` e pode estar afetando o filtro de leads "ativos". Vale investigar se o threshold de `count_messages > 14` está capturando leads com muita troca de mensagem automática sem conversa real.

---

*Análise gerada em 14/05/2026 com base em 1.572 leads (tier 4+5, last 30 days, count_messages > 14)*
*Metodologia: SQL no Supabase — filtro `] Lead :` nas linhas do campo `conversa` + categorização ILIKE por lead único*
*Os e-mails são identificadores para pesquisa no Supabase — pesquise pelo e-mail no filtro da tabela `leads` para acessar a conversa completa*
