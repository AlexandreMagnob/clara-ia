---
name: investigar-lead
description: >
  Investiga um lead (ou uma lista de leads) da operação comercial da CardápioWeb cruzando
  Supabase (tabela leads), conversa da Clara, Meetime, RD Station, Pipedrive e Kommo, e
  devolve um dossiê com timeline em horário de Brasília e veredito de onde o dado se perdeu.
  Use sempre que pedirem para investigar, rastrear ou achar um lead; entender por que um lead
  não recebeu mensagem, não chegou na Meetime, não virou deal, sumiu, duplicou ou diverge
  entre sistemas; quando derem um telefone, e-mail, nome ou link de deal e perguntarem "o que
  aconteceu com esse lead"; e quando enviarem uma lista ou CSV de leads para cruzar com os
  sistemas, auditar uma segmentação ou separar quem já é cliente. Por ditado de voz,
  "Lidia" = lead. Não use para métricas agregadas de experimento (no-show, taxa de FUP) —
  isso é análise de métrica, não investigação de lead.
---

# Investigar lead

Reconstrói a jornada de um lead pelos 6 pontos onde ela deixa rastro — Supabase, conversa
da Clara, Meetime, RD Station, Pipedrive e Kommo — e entrega o diagnóstico de onde o dado
se perdeu. **A investigação é 100% leitura**: nunca atualize registro em nenhum sistema
durante a varredura. Se a correção for óbvia, ela vai como recomendação no dossiê, não
como UPDATE.

Dois modos, escolhidos pela entrada:

- **1 lead** (telefone, e-mail, nome, link de deal) → **dossiê**: veredito + timeline.
- **Lista** (CSV, planilha, colado na conversa) → **planilha + resumo agregado**, com
  dossiê completo só das anomalias.

## Passo 0 — Normalizar a entrada

- **Telefone**: gere as variantes antes de buscar — com/sem DDI `55`, com/sem o nono
  dígito. O jeito robusto de casar no banco é pelos **últimos 8 dígitos** com `ilike`
  (`whatsapp.ilike.*NNNNNNNN*`), que atravessa as duas variações de uma vez.
- **Busque sempre por telefone E e-mail**, nunca só por e-mail: matching só por e-mail
  perde ~30% dos casos (validado na checagem de listas de parceria).
- **Link de deal do Pipedrive**: extraia o ID da URL e comece pelo Pipedrive, pescando
  telefone/e-mail da person para alimentar o resto da varredura.
- **Nome sozinho**: só como último recurso, e trate homônimo como ambiguidade — liste os
  candidatos em vez de escolher um.

## Ordem da varredura

O Supabase é o hub: a tabela `leads` guarda os ponteiros para os outros sistemas
(`pipedrive_id`, `pipedrive_id2`, `kommo_id`, `meetime_id`, `conversation_id`). Ache o
lead lá primeiro; nos demais sistemas, entre pelo ponteiro e só busque por telefone/e-mail
quando o ponteiro estiver vazio — ponteiro vazio já é um achado (a integração não gravou).

### 1. Supabase — tabela `leads`

Schema completo em `docs/integracoes/supabase-schema.md` (projeto CW - Comercial,
`rydlkqomjokkhxghgqde`). Vias de acesso, em ordem: MCP do Supabase; se indisponível,
PostgREST direto (`https://rydlkqomjokkhxghgqde.supabase.co/rest/v1/leads`, apikey no
`.env` do repo — use a credencial, nunca exiba o conteúdo do `.env`).

Campos que sustentam a timeline: `date_created`, `tier`, `usuario`, `status`,
`count_messages`, `followup_count`, `date_next_fup`, `last_assistant_updated`,
`tentativas_contato1`, `data_agendamento`, `closer`, `repassa_sdr`, `etapa_repasse`,
`created_by`, `modelo_llm`, `em_atendimento`, `break`, UTMs e os ponteiros externos.

Armadilhas conhecidas (ignorá-las já inverteu conclusão de experimento):

- **Campos que mentem**: `etapa_conversa`, `faturamento` e `reagendamento` não são
  confiáveis — nunca baseie veredito neles; use a `conversa` como fonte da verdade.
- **`usuario`** só existe para leads criados depois de 06/06/2026 e **muda no handoff**
  (o valor atual não diz quem atendeu primeiro).
- **`tier` é texto**: `tier > '3'` pega 3.1 e 3.2 junto. Para filtrar Clara use
  `tier=in.(4,5)`.
- **Linhas lixo**: existem registros de teste e incompletos. Nome vazio + conversa vazia
  + sem origem = provável lixo; marque como tal em vez de contar como "lead perdido".
- **Regex/filtros no PostgREST**: só padrões ASCII — acento no padrão devolve erro 500.
- A migração para o CDP (Postgres) corre em paralelo (`docs/guias/correlacao-leads-para-cdp.md`);
  o Supabase segue sendo a fonte primária. Se a investigação for justamente sobre
  divergência Supabase×CDP, compare os dois e diga qual está na frente.

### 2. Conversa da Clara (campo `conversa`)

O blob `conversa` é a fonte da verdade sobre o que aconteceu no WhatsApp. Extraia dele:
primeira mensagem da Clara, primeira resposta do lead, follow-ups (marcadores `[FUP n]`),
marcadores de experimento/pausa (`[PAR] ...`), agendamento e handoff.

- O dicionário de marcadores muda por experimento — confirme os marcadores vigentes na
  versão de prompt em produção (`prompts/`, maior número de versão) antes de classificar.
- Marcadores podem quebrar em múltiplas linhas; não assuma "1 marcador = 1 linha".
- `count_messages = 0` ou conversa vazia com `tentativas_contato1 > 0` indica falha de
  entrega do primeiro contato (cheque `id_start_message`), não lead que ignorou.

### 3. Meetime

Entre pelo `meetime_id`; sem ponteiro, busque na API REST da Meetime por e-mail e
telefone. Token no cofre [REVOPS] Credenciais — e o token é **por usuário**: resultados
podem mudar conforme o dono do token (aprendizado da troca Meetime→Whenna).

- Os nós da Meetime no n8n **perdem lead em silêncio**: ausência na Meetime é um achado
  provável de descarte silencioso, não prova de que o lead não deveria estar lá.
- Registre cadência e etapa atual, se houver.

### 4. RD Station

A API de contatos da RD busca por **e-mail** (`GET /platform/contacts/email:{email}`) —
sem e-mail não há consulta confiável, registre "não verificável na RD". Token vigente
fica na Data Table `rd_station_token` do n8n (leia via API REST do n8n; o MCP do n8n não
abre nós). **Nunca renove o token por fora** — isso derruba a renovação automática dos
workflows. Colete conversões (eventos) e tags, com data.

### 5. Pipedrive

Use o MCP do Pipedrive (`searchPersons`, `searchDeals`, `getDeal`...). Armadilhas:

- Nos resultados de search o ID vem aninhado em `item.id`, não na raiz.
- Cheque **duplicidade de deals** para a mesma person — é padrão conhecido; liste todos
  com estágio e dono em vez de parar no primeiro.
- O validador de que o lead passou pela Clara é o campo **"Passou por IA" = Sim** no deal.
- `pipedrive_id` = funil IA-SDR; `pipedrive_id2` = deal criado após reunião agendada.
  Os dois vazios + conversa com agendamento = integração falhou na criação do deal.

### 6. Kommo (quando aplicável)

Entre por `kommo_id`/`conversation_id` (leads de salesbot). A API do Kommo devolve
**204 sem corpo** quando não acha — trate como "não existe", não como erro de chamada.

## Regras transversais

- **Horário sempre em Brasília**: Supabase e APIs devolvem UTC; converta (−3h) antes de
  escrever qualquer timestamp. Timestamp "no futuro" no dossiê = esqueceu de converter.
- **Prova pelo efeito, nunca pelo log**: o log de execuções do n8n se auto-deleta.
  "Não há execução no n8n" não prova que a automação não rodou; o que prova é o efeito
  (ou a ausência dele) nos bancos. Nunca escreva "a automação não rodou" com base em log
  ausente.
- **Não afirmar sem verificar**: se um sistema estava inacessível (sem auth, API fora),
  a coluna/linha correspondente é "não verificado", escrito assim — nunca "não existe".
- **Veredito é diagnóstico, não chute**: cada veredito precisa apontar a evidência
  (campo, data, ausência de ponteiro). Se a evidência não fecha, o veredito é
  "inconclusivo" com o que falta verificar.

## Saída — modo 1 lead (dossiê)

Formato fixo, pronto pra colar:

```
**Veredito: [uma frase — onde o lead está ou onde o dado se perdeu, com o padrão de falha nomeado]**

DD/MM HH:MM — [evento] ([sistema])
DD/MM HH:MM — [evento] ([sistema])
— (o que NÃO aconteceu: sistemas onde o lead não existe ou não foi verificado)

Recomendação: [se houver correção óbvia — o quê e onde, sem executar]
```

Timeline em ordem cronológica, um evento por linha, sistema de origem entre parênteses.
A linha de ausências é obrigatória — o que faltou é metade do diagnóstico.

## Saída — modo lista

1. **Varredura em lote**: agrupe as consultas ao Supabase em chunks (~20 leads por
   request com `or=(...)`) em vez de 1 request por lead. Nas APIs externas, espace as
   chamadas (≥1s leitura; se algo escrever em massa algum dia, a regra é Wait ≥5s).
2. **CSV** em `analises/dados/AAAA-MM-DD_<slug>.csv` (convenção do repo: kebab-case, sem
   acento), uma linha por lead:

   `telefone, email, nome, no_supabase, tier, usuario, clara_abriu, lead_respondeu,
   agendou, na_meetime, cadencia, na_rd, deal_pipedrive, no_kommo, e_cliente, veredito`

   Valores: `sim` / `nao` / `nao_verificado` / `lixo`. `e_cliente` usa o método validado
   PD+RD+Meetime (deal ganho ou base de clientes), matching por telefone+e-mail.
3. **Resumo agregado** no topo da resposta, sempre volume junto de taxa
   ("36 leads: 24 completos, 8 sem Meetime, 4 sem conversa" — nunca só percentual), com
   os vereditos agrupados por padrão de falha.
4. **Dossiê só das anomalias**: os 2–3 casos fora do padrão ganham timeline completa;
   o resto vive na planilha.
5. **Lista grande (>100)**: avise o custo antes. Rode o cruzamento barato (Supabase +
   Pipedrive em lote) no todo e o parse de conversa só nos que falharam o cruzamento —
   ou numa amostra, se o usuário preferir.

## Referências no repo

- `docs/integracoes/supabase-schema.md` — schema completo da tabela `leads`
- `docs/arquitetura/visao-geral.md` — fluxo macro (tier → Clara → closer)
- `docs/guias/correlacao-leads-para-cdp.md` — mapa leads→CDP e vocabulário de `status`
- `analises/` — investigações anteriores (padrões de falha já vistos)
