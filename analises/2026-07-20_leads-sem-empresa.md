# Leads sem `empresa` — diagnóstico de causa raiz

> Análise: 2026-07-20 · Escopo: julho/2026 (01–20/07, 7.400 leads) · Base: Supabase `leads`,
> execuções n8n, RD Station API, Kommo API.
> Disparador: 6 leads reportados sem empresa.

---

> ⚠️ **CORREÇÃO (20/07, após o censo e a varredura do site).** A versão original deste documento
> concluiu que "as LPs de produto não coletam empresa". **Isso estava errado.** A varredura das 130
> páginas mostrou que **17 LPs de produto TÊM campo de empresa, obrigatório** — o dado é coletado e
> descartado na integração Elementor→RD. A inferência "0% de `company_name` na API ⇒ o formulário não
> pergunta" não distingue *não coleta* de *coleta e perde*. Ver §4 (reescrita) e §9.
>
> Consequência prática: **o patch aplicado no n8n (§7 item 1) NÃO resolve esses casos** — ele lê
> `leads[0].company` da RD, e para essas LPs a RD nunca recebeu o dado.

## 1. Resumo executivo

**Não existe uma causa única — existem TRÊS, e elas se sobrepõem no mesmo lead.**

| | Leads (julho) | % do mês |
|---|---:|---:|
| Leads com `empresa` preenchida | 5.775 | 78,0% |
| **`empresa = ''` (string vazia) — leads reais do funil** | **668** | **9,0%** |
| `empresa = NULL` — registros de conversa, não são leads do funil (ver §6) | 957 | 12,9% |

Dos **668** leads reais sem empresa:

| Causa | Censo exato | Onde nasce | Recuperável? |
|---|---:|---|---|
| **A — Perda no n8n.** O dado chegou da RD e foi descartado | **244 (36,5%)** | Nós `Seta os campos1/3` do workflow de tier | **Sim** — CSV pronto (§7) |
| **C — Perda na integração Elementor→RD.** O form coleta, a RD nunca recebe | **98 (14,7%)** + 15 a verificar | 17 LPs de produto (§4.2) | Não pela RD — só via Elementor Submissions |
| **B — Origem não coleta.** O formulário nunca pergunta empresa | **311 (46,6%)** | Botão de WhatsApp (270, **já corrigido**), ManyChat (33), 14 LPs (§4.3) | Não sem mexer no form |

*(Números do censo dos 668, 100% processados. A estimativa original — A≈240 / B≈428 — acertou o A por
4 leads, mas o "B" continha ~98 casos que na verdade são a Causa C.)*

Duas medições independentes convergem para a Causa A: reponderação da amostra RD (**240 leads/mês**) e contagem direta nas execuções do n8n (**237 leads/mês**).

**Sobre os 6 leads reportados: são Causa B.** Todos entraram pelo widget `botao-whatsapp-geral`, que não pergunta empresa. Corrigir o n8n **não** resolve esses 6 — mas resolve ~240 outros por mês.

**Isto não é um incidente novo.** A série diária de maio a julho não mostra degrau: julho (9,0%) está melhor que maio (~20%). É um problema **crônico e estrutural**, não uma regressão recente.

---

## 2. Os 6 leads reportados

| Lead | Data | `empresa` | 1ª conversão (RD) | Veredito |
|---|---|---|---|---|
| julianafrotatito@gmail.com | 15/07 | `''` | `botao-whatsapp-geral` | B — origem |
| elianagabrielaa@hotmail.com | 15/07 | `''` | `botao-whatsapp-geral` | B — origem |
| luanabach2014@gmail.com | 15/07 | `''` | `botao-whatsapp-geral` | B — origem |
| tjunthiago@gmail.com | 16/07 | `''` | `botao-whatsapp-geral` | B — origem |
| dhullyannanunes@gmail.com | 16/07 | `''` | `botao-whatsapp-geral` | B — origem |
| dannibverni@hotmail.com | 17/06 | `''` | `botao-whatsapp-geral` (blog Pizzaria) | **B + perda de histórico** |

**Prova de que o dado nunca existiu:** no evento de conversão do `botao-whatsapp-geral` a RD entrega exatamente estas chaves — `name, email, personal_phone, conversion_identifier, cf_qual_o_seu_segmento, cf_qual_faturamento_do_ultimo_mes, cf_utm_source, cf_origem_campanha, traffic_source`. **Não existe campo de empresa no formulário.**

Sinal secundário coerente: o `name` desses leads vira `"thiaGO ."`, `"Daniela ."`, `"Dhullyanna ."` — o ponto no sobrenome é artefato de formulário curto que só pede o primeiro nome.

**Caso Daniela (o mais instrutivo).** Ela aparece duas vezes na base:

| Data | `empresa` | utm | Origem |
|---|---|---|---|
| 16/06 | `Famiglia Bela Massa Pizzaria` | google / paidsearch | `LP - GOOGLE - PAGO` |
| 17/06 | `''` | *(vazio)* | `botao-whatsapp-geral` |

O mesmo lead entrou por uma LP (com empresa) e depois pelo botão de WhatsApp (sem empresa) — e o segundo registro nasceu vazio. A RD **ainda guarda** `Famiglia Bela Massa Pizzaria` no histórico. Generalizando: `botao-whatsapp-geral` aparece em **85% dos leads sem empresa** em alguma posição da jornada, e como ele não coleta empresa, "zera" o campo mesmo em leads que a RD já conhecia.

---

## 3. Causa A — o dado chega e é descartado no n8n

### 3.1 O bug

Workflow **`[SQL] Automação para definir tier dos leads e enviar para a meetime`** (`GADrDhIEi1NvOJn9`, ativo).

O nó `Verifica se veio do botão de WPP1` roteia pelo **user-agent**:

```
{{ $json.headers['user-agent'] }}  notEquals  "Typhoeus - https://github.com/typhoeus/typhoeus"
```

`Typhoeus` é o cliente HTTP da própria RD Station. Ou seja:

- **user-agent ≠ Typhoeus** (formulários do site, WordPress/axios) → `Seta os campos5` / `campos6` → **têm o campo `Empresa`** ✅
- **user-agent = Typhoeus** (webhook enviado pela RD) → `Seta os campos3` → **NÃO tem o campo `Empresa`** ❌

Auditoria dos 7 nós `Seta os campos*` **no workflow ao vivo** (139 nós):

| Nó | Campos | Mapeia `Empresa`? |
|---|---:|---|
| Seta os campos | 19 | SIM |
| **Seta os campos1** | 17 | **NÃO** |
| Seta os campos2 | 19 | SIM |
| **Seta os campos3** | 24 | **NÃO** |
| Seta os campos5 | 26 | SIM |
| Seta os campos6 | 28 | SIM |
| Seta os campos7 | 20 | SIM |

São **2 branches furados de 7** — clássica omissão de copy-paste. O `Seta os campos6` mapeia assim (cadeia de fallback completa); o `campos3` simplesmente não tem a linha:

```js
={{ $('Webhook').item.json.body.Empresa || $('Webhook').item.json.body['Empresa '] ||
    $('Webhook').item.json.body.empresa || $('Webhook').item.json.body.nome_da_empresa ||
    $('Webhook').item.json.body.company || $('Webhook').item.json.body.leads?.[0]?.company || '' }}
```

O erro fica **silencioso** por causa do `|| ""` no nó de envio, que converte o campo ausente em string vazia em vez de falhar:

```
"empresa": "{{ $('Seta os campos3').item.json.Empresa || ""}}"
```

### 3.2 Prova end-to-end

Execução n8n **105542184** → RD enviou no payload:

```json
"leads": [{ "name": "Eliza Vieira dos Santos", "company": "Dolce bolos e doces", ... }]
```

Registro correspondente no Supabase (`date_created` 2026-07-20 14:20):

```
name = 'Eliza Vieira dos Santos' | empresa = '' | utm = google/cpc | tier = 3.1
```

**A RD mandou `Dolce bolos e doces`. O banco gravou `''`.** O dado existia e foi descartado entre um ponto e outro.

Outros exemplos capturados no mesmo período (18–20/07):

| Data | Lead | `company` que a RD enviou e foi perdido |
|---|---|---|
| 20/07 14:30 | Eliza Vieira dos Santos | Dolce bolos e doces |
| 20/07 14:23 | YANKA | Limone |
| 20/07 13:24 | Aline Madeira de Souza | Point da sardinha |
| 20/07 11:42 | Paula Fernandes | Nakoa poke e sushi |
| 20/07 06:20 | Larissa Oliveira do Carmo | Encantos da Batata |
| 20/07 03:46 | Marileide Maria da Silva | EdyPizzas |

### 3.3 Quantificação

**Medição 1 — 600 execuções reais (18–20/07):**

| Branch | Volume | % |
|---|---:|---:|
| FORM (`campos6/5`) — OK | 552 | 92% |
| **RD (`campos3`) — quebrado** | **48** | **8%** |

Dentro do branch quebrado: **19 de 48 (40%)** traziam empresa real no payload → perda confirmada. Isso é **3,2% de todos os leads** → **~237 leads/mês**.

> O volume do branch quebrado (8%) bate com a taxa de `empresa=''` observada no banco (9%) — corroboração independente de que praticamente **todo** lead que passa pelo `campos3` sai sem empresa.

**Medição 2 — amostra de 130 leads validados na API da RD**, reponderada pelo `utm_medium` da população:

| Estrato | Leads (pop.) | Taxa de perda real | Estimativa |
|---|---:|---:|---:|
| *(sem utm_medium)* | 260 | 32% | 83 |
| paidsearch | 168 | 28% | 47 |
| paid | 111 | 44% | 49 |
| social | 84 | 28% | 24 |
| **cpc** | 40 | **88%** | 35 |
| outros | 5 | ~40% | 2 |
| **Total** | **668** | | **~240** |

As duas medições convergem: **~240 leads/mês perdem um nome de empresa que a CardápioWeb já tinha em mãos.**

> ⚠️ A amostra de 130 é **estratificada** (25 por `utm_medium`), então o 44,6% bruto dela **não** é taxa populacional. Os números acima já estão reponderados. As taxas *por estrato* são válidas.

---

## 4. Onde está ocorrendo — mapa por formulário

A separação por `conversion_identifier` é **binária e limpa**: cada formulário é ~100% de uma causa ou ~100% da outra.

### 4.1 Coletam empresa, mas o dado se perde (Causa A — corrigir o n8n)

| Formulário | Leads na amostra | % perda |
|---|---:|---:|
| **LP - GOOGLE ADS 3** | 18 | 100% |
| **LP - META ADS** | 17 | 100% |
| Conversão site institucional | 6 | 100% |
| [FORMS] [O Cardápio Digital] [2026] | 5 | 100% |
| LP - GOOGLE - PAGO | 3 | 100% |
| LP - INSTAGRAM - ORGÂNICO | 3 | 100% |
| LEADS CONTENT | 2 | 100% |

O estrato **`cpc` é o mais crítico: 88% é perda real, não falta de coleta.** Tráfego pago de busca converte em LP que pede empresa — e o dado morre no caminho. É o tráfego mais caro da casa perdendo qualificação.

### 4.2 Coletam empresa, mas a RD nunca recebe (Causa C — integração Elementor→RD)

> Seção **reescrita** após a varredura das 130 páginas do site. A versão anterior classificava estes
> formulários como "não coletam" — errado.

Verificado no HTML: **17 LPs de produto têm `<input name="form_fields[Empresa]" required>`**. O usuário
digita a empresa e ela é descartada antes de chegar na RD. Confirmado em 69 conversões inspecionadas
(Módulo Financeiro 30, Cardápio Digital 29, Roteirização 10): **nenhuma chave com empresa em nenhuma
das três camadas** — payload da conversão, registro do contato, campos customizados.

| LP com campo empresa | Página |
|---|---|
| LP - Módulo Financeiro | `/modulo-financeiro-cw` |
| LP - Cardápio Digital | `/cardapio-digital` |
| LP - Roteirização de entregas | `/roteirizacao-de-entregas` |
| LP - Cupons e descontos | `/cupons-e-descontos-para-pedidos` |
| LP - Disparador de WhatsApp | `/cardapioweb-com-disparador-de-whatsapp-delivery` |
| LP - Emissor de Nota Fiscal | `/emissor-de-nota-fiscal` |
| LP - Agendamento de pedidos | `/sistema-de-agendamento-de-pedidos` |
| LP - Sistema de controle de estoque | `/sistema-de-estoque-para-restaurante` |
| LP - Programa de fidelidade | `/programa-de-fidelidade` |
| LP - Chatbot | `/seusite-com-br-chatbot-whatsapp-delivery` |
| LP - Cardapio para mesas | `/cardapio-qr-code-digital-para-mesas` |
| LP - Gestão de mesas e comandas | `/gestao-de-mesas-e-comandas` |
| LP - Módulo KDS | `/monitor-kds` |
| LP - Automações de WhatsApp | `/ferramentas-automacoes-de-whatsapp` |
| LP - CRM | `/tef-para-restaurantes` |
| LP - CAMPANHA DE INDICAÇÃO | `/indique-e-ganhe` |
| LP - Fispal | `/presente` |

**Causa raiz.** As conversões de `LP - GOOGLE ADS 3` na RD carregam a assinatura dos nossos próprios
nós `Cria conversão na RD2/RD3` (`cf_crid`, `cf_cid`, `cf_agid`, `traffic_source` como string simples).
São **dois caminhos distintos**:

- **LPs de aquisição** → form → **webhook n8n** → o n8n cria a conversão na RD já com `company_name` ✅
- **LPs de produto** → **integração nativa Elementor→RD** (`traffic_source` vem como blob encodado do
  JS da RD) → conversão sem `company_name` ❌

Ou seja: as LPs de produto **não estão plugadas no webhook do n8n**. A correção é o mapeamento na aba
"Ações após o envio" do formulário — ou, mais robusto, plugá-las no mesmo webhook das LPs de aquisição.

### 4.3 Realmente não coletam empresa (Causa B — adicionar campo)

| Formulário | Volume julho | Situação |
|---|---:|---|
| **botao-whatsapp-geral** | 508 conv. / 270 leads | ✅ **corrigido pelo usuário em 20/07** (verificado: conversões passaram a trazer `company`) |
| ManyChat | 47 / 33 leads | pendente — inferido por 0% na API, **não verificado no fluxo do bot** |
| LP - Sistema para Restaurante | — | `/sistema-para-restaurante` |
| LP - Sistema para Delivery | — | `/sistema-para-delivery-cw` |
| LP - Cardápio Ruim (3 páginas) | — | `/resultado-cardapio-{positivo,mediano,negativo}` |
| LP - Automação (2 páginas) | — | `/automacao`, `/pagina-teste-de-eventos` |
| LP - CW EXPERIENCE | — | `/cw-experience` |
| LP - CRM | 4 | `/crm` |
| LP - Cardápio Digital Para Balcão | — | `/cardapio-digital-para-balcao` |
| LP - Controle de Caixa / Controle de fiado / Gestão de impressoras / Sistema de Avaliações | — | idem |

⚠️ **Pegadinha:** o identificador `LP - CRM` aponta para **duas páginas diferentes** —
`/tef-para-restaurantes` (TEM o campo) e `/crm` (NÃO tem). Mesmo nome de formulário, configurações
distintas. Vale checar se há outros casos assim antes de tratar identificador como sinônimo de página.

---

## 5. Impacto a jusante

O problema não fica só no Supabase:

1. **Meetime recebe o lead sem empresa.** Dos 8 nós `Cria Body da Meetime`, **4 leem do `Seta os campos3`** e fazem `company: d["Empresa"]` → `undefined` → o `JSON.stringify` **remove a chave** do body. O SDR abre a cadência e não vê a empresa.
2. **A RD é sobrescrita destrutivamente.** O nó `Cria conversão na RD1` posta de volta `"company_name": "{{ ...Empresa }}"`. Quando vem vazio, grava `"(não informado)"` como **valor literal** — foi assim que a Daniela perdeu `Famiglia Bela Massa Pizzaria` no registro de julho. Confirmado: das 291 conversões analisadas, as 3 ocorrências de `(não informado)` são **todas** de conversões criadas pelo nosso próprio n8n.
3. **Qualificação e personalização degradadas.** Sem empresa, a Clara não consegue usar o nome do estabelecimento na abertura, e a prova social por segmento (SM30H7) perde ancoragem.

---

## 6. Nota sobre os 957 `NULL` — não são o mesmo problema

Os 957 registros com `empresa = NULL` **não são leads do funil**:

| | `NULL` (957) | `VAZIO` (668) | `ok` (5.775) |
|---|---:|---:|---:|
| tem email | **0%** | 100% | 100% |
| tem nome | **0%** | 100% | 100% |
| tem `usuario` | **0%** | 100% | 100% |
| tem segmento | **0%** | 93% | 99% |
| `created_by` | `Agent` (99%) | — | — |

São stubs criados pelo workflow `[SDR] [KOMMO] Registro de mensagens recebidas` para **qualquer** mensagem que chega no WhatsApp (cliente existente, engano, etc.). Esse fluxo não tem campo `empresa` — por isso `NULL`. **Devem ser excluídos de qualquer métrica de "leads sem empresa"**, senão inflam o problema em ~2,4×.

---

## 7. Como resolver — priorizado

| # | Ação | Ataca | Esforço | Ganho estimado |
|---|---|---|---|---|
| **1** | **Adicionar o mapeamento `Empresa` nos nós `Seta os campos3` e `Seta os campos1`**, copiando a cadeia de fallback do `campos6` | Causa A | Baixo (2 nós) | **~240 leads/mês** |
| 2 | **Parar de postar `"(não informado)"` na RD** — enviar vazio quando não houver dado | Sobrescrita destrutiva | Baixo | Preserva histórico |
| 3 | **Enriquecer pelo histórico da RD** antes de gravar: consultar `/contacts/{uuid}/events` e usar o último `company_name` real | Causa A2 + mitiga B | Médio | ~18 leads/mês + recupera recorrentes |
| 4 | **Adicionar campo empresa** no widget `botao-whatsapp-geral` e nas LPs de produto | Causa B | Médio | até ~428/mês, **mas custa conversão** |
| 5 | Trocar os `\|\| ""` por validação que falhe/alerte quando `Empresa` vier ausente num branch que deveria tê-la | Prevenção | Baixo | evita reincidência silenciosa |

**Correção do item 1** — adicionar ao `Seta os campos3` (e `campos1`) o assignment:

```js
Empresa = {{ $('Webhook').item.json.body.leads?.[0]?.company
             || $('Webhook').item.json.body.Empresa
             || $('Webhook').item.json.body.empresa
             || '' }}
```

Sobre o item 4: é a única forma de atacar a Causa B, mas **adicionar campo em formulário derruba taxa de conversão**. Recomendo avaliar A/B antes — e priorizar os itens 1–3, que são ganho puro sem custo de conversão.

---

## 8. Ressalvas e achados laterais

- **O export do workflow no repositório está desatualizado** (108 nós) frente ao ativo no n8n (139 nós). Toda a análise usou o **workflow ao vivo** via API. Vale reexportar.
- **Retenção de log do n8n é de ~3,7 dias** (16/07 22:56 → 20/07 14:44). As execuções dos 6 leads (15–16/07) **já não existiam**; a prova de perda veio de casos equivalentes capturados em 18–20/07. Consistente com o padrão já conhecido de auto-deleção de logs.
- **`kommo_id` desalinhado (achado lateral, não relacionado).** Amostrando leads e batendo o nome contra a API do Kommo, encontrei divergência **inclusive em leads saudáveis** (14 de 60): p.ex. `julianafrotatito` → Kommo id 16986958 = "Aryson Ribeiro"; `tjunthiago` → 13899632 = "Leticia Soares Araújo". Não é causa da falta de empresa, mas é um problema de integridade referencial que merece investigação própria.
- 🔒 **Credenciais da RD Station em texto puro.** O `client_secret` e o `refresh_token` da RD estão **hardcoded** no nó `obtém um novo access_token` do workflow `[UTIL] Obter credenciais da RD Station` (`cELdAgFAnojseUQJ`), legíveis por qualquer um com a API key do n8n. Recomendo mover para credencial nativa do n8n e **rotacionar**.

### Fontes
- Supabase `leads` — 30.092 registros (mai–jul/2026), agregação local.
- n8n API — 600 execuções com `includeData=true` do workflow `GADrDhIEi1NvOJn9`.
- RD Station API v2 — 130 contatos, 291 eventos de conversão (somente GET).
- Kommo API v4 — amostragem de `leads/{id}` para checagem de integridade.
