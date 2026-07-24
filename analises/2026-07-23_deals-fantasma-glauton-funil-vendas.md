# Deals-fantasma do Glauton no Funil de Vendas — investigação e correção

**Data:** 23/07/2026 · **Reportado por:** Whenna (dashboard "CLO | NEG INI (ANÁLISE SDR)") · **Investigação e correção:** Alexandre + Claude
**Status:** ✅ Causa identificada com prova direta · ✅ Correção aplicada às 14:04 · ✅ Validada em produção às 15:01 · ⏳ Limpeza retroativa pendente

---

## 1. Resumo executivo

O dashboard de análise dos SDRs mostrava **366 negócios criados em julho com proprietário Glauton Santos** — que é do SEO e não deveria receber lead nenhum. A investigação provou que esses negócios **não são leads reais nem erro de atribuição**: são **deals-fantasma** criados automaticamente por um fallback defeituoso do workflow n8n **"[PAR][PIPEDRIVE] Vincular cupom com PARCEIRO"**, que roda a cada negócio criado no Pipedrive com o campo **Cupom** preenchido (as indicações de Parcerias). O defeito existia desde **julho/2025** e acumulou **~3.551 deals-fantasma** (~340–420/mês). O fallback foi desativado em 23/07 às 14:04 e a correção foi validada em produção na mesma tarde: 4 indicações novas entraram e **zero fantasma nasceu**.

## 2. O problema reportado

No filtro "Negócio criado em julho + Funil de Vendas", o Glauton aparecia com **366 negócios** — quase o dobro do 1º SDR real (João Paulo, 184) — todos "Sem valor" no campo [QUAL] Análise do lead pelo SDR. Suspeitas iniciais: lead duplicado, automação do Pipedrive atribuindo errado, ou integração criando deals no lugar errado.

## 3. O que foi analisado

1. **Pipedrive, lead a lead (API):** os 366 deals foram puxados e caracterizados um a um. Perfil 100% homogêneo: `origin=API`, criador = Glauton (dono do token usado pelas automações), nascem **direto na etapa "Reunião Marcada"** (stage 43), status open, **sem person, sem organização, sem nenhum campo custom, sem nota e sem atividade** — só o título com o nome do lead. 99 são duplicatas internas (mesmo nome 2×). Só nascem em dia útil, em horário comercial.
2. **Histórico:** o mesmo padrão (deal do Glauton na pipe 2, sem person) existe desde **jul/2025**: 122, 182, 220, 244, 221, 195, 336, 248, 337, 342, 321, 419 e 364/mês — **~3.551 no total**.
3. **Cruzamento de gêmeos:** 286 dos 366 fantasmas nascem **+1 a +3 segundos** depois de um deal homônimo criado pelo fluxo de indicações de Parcerias (funil "[PAR] Clientes do parceiro" — 393 deals em julho, owners Letícia Rocha/Layza/Wanessa/Michael/Marília). IDs consecutivos: ex. 462010 (indicação, Layza) → 462011 (fantasma); 462084 (indicação, Letícia) → 462085 (fantasma).
4. **Varredura do n8n (278 workflows crawleados):** inventário de todos os nós que criam ou duplicam deal no Pipedrive; dissecados os suspeitos ([SDR] Tool Agendar Reunião, [PAR][MAIN][ADICAO], [PAR][CORE], webhooks reativos). Confirmado com o Alexandre: **o [PAR][MAIN][ADICAO] está correto, by design** — não era o problema.
5. **Webhooks da conta Pipedrive (29 inscritos):** datados um a um para eliminar suspeitos externos — cenário legado do Make (out/2024), WordPress (mai/2026) e ingest do Railway (20/07/2026) **não batem** com o início do padrão (jul/2025). O webhook **`create.deal` criado em 10/07/2025 bate exatamente**.
6. **Meetime, RD e Kommo:** eliminados por evidência — houve fantasma em execução que não tocou nenhum dos três (caso José Alberto: 2 fantasmas sem chamada a Meetime/Kommo/RD).
7. **Flagrante ao vivo:** um vigia monitorou a criação de deals em tempo real e capturou 3 fantasmas nascendo (15:04 UTC), junto com **todas as ~2.000 execuções do n8n daquela janela**. Abrindo as execuções nó a nó, o criador apareceu com prova direta: o nó final do workflow "Vincular cupom com PARCEIRO" **devolveu exatamente os IDs dos fantasmas** (462085, 462088, 462089 — execuções 106988855, 106989118, 106989116).

## 4. Causa raiz

O workflow **"[PAR][PIPEDRIVE] Vincular cupom com PARCEIRO"** (n8n, `Y0puhUsMR7IDSUvU`) escuta o evento `create.deal` do Pipedrive. Para todo negócio criado com **Cupom** preenchido, ele deveria localizar o deal do parceiro no funil de acompanhamento e registrar ali uma atividade "Indicação via Cupom". Dois defeitos combinados desviavam praticamente tudo para um fallback que criava o fantasma:

| # | Defeito | Efeito |
|---|---------|--------|
| 1 | O filtro procurava o parceiro no **funil 44** ([PAR][OPS]), mas os deals dos parceiros estão no **funil 42** (Acompanhamento de Parceiros Ativos) | O "vincular" quase nunca casava |
| 2 | No código do filtro, `return ... : items` devolvia a resposta **crua** da busca quando não havia match, em vez de vazio | O IF seguinte empurrava tudo pro fallback |
| 3 | O fallback ("Criar perfil" + "Pipedrive") criava person órfão e deal **sem `stage_id`** e **sem `user_id`**, com `person_id` apontando pra um id de usuário | Deal cai na 1ª etapa default do funil padrão (= **Reunião Marcada / Funil de Vendas**) e o owner vira o **dono do token da API = Glauton**; person não vincula |

Cada indicação de parceiro gera 1 ou 2 deals com cupom (dependendo do braço do fluxo de adição) → **1 ou 2 fantasmas por indicação**. O fantasma nasce sem cupom, por isso não se retroalimentava. Deals da Meetime não têm cupom, por isso nunca geraram fantasma — o volume seguia o ritmo de Parcerias (dias úteis), não o de reuniões.

## 5. O que foi feito (23/07, 14:04, autorizado pelo Alexandre)

Ajuste cirúrgico no próprio workflow, com backup pré/pós e verificação após a escrita:

1. **Nós "Criar perfil" e "Pipedrive" (o create do fantasma) → desabilitados.** É o desligamento da fábrica.
2. **"Fitrar por FUNIL" corrigido:** `return resultadosFiltrados;` — sem match, o fluxo agora encerra limpo em vez de vazar a resposta crua pro fallback.
3. **Nada mais foi tocado:** o caminho bom (atividade no deal do parceiro), o webhook, o filtro de cupom e o [PAR][MAIN][ADICAO] ficaram exatamente como estavam. Workflow segue ativo.

Verificação pós-escrita: 10 nós, conexões intactas, nomes com acento preservados, apenas os 2 nós esperados desabilitados a mais.

## 6. Validação em produção (23/07, 14:05–15:01)

Vigia monitorou por 55 minutos após o ajuste:

- **4 indicações novas** entraram no funil de Parcerias (Monique Custodio 14:23, Wilson/Sushi Tem 14:35, Thiago/Pizzas PerTutti 14:37, Eric Fontes 14:56 — horário de Brasília). Antes do ajuste, cada uma teria gerado 1–2 fantasmas.
- **Zero deal novo para o Glauton** no Funil de Vendas.
- O workflow processou os eventos normalmente: 15 execuções pós-fix, **todas success** — a correção não introduziu erro.

## 7. Pendências

| # | Item | Situação |
|---|------|----------|
| 1 | **Limpeza retroativa**: ~3.551 deals-fantasma (todos open na Reunião Marcada) + persons órfãos criados pelo mesmo fallback | Aguardando OK para preparar dry-run; lista de julho pronta no CSV abaixo |
| 2 | **Religar o "vincular"** (opcional): apontar o filtro pro funil 42 para a atividade "Indicação via Cupom" voltar a nascer no deal do parceiro | Decisão do Alexandre; hoje o fluxo não cria nada quando não há match |
| 3 | **Paliativo nos dashboards CLO** até a limpeza: filtrar proprietário ≠ Glauton (os 366 de julho continuam aparecendo) | Sugerido à Whenna |

## 8. Anexos e evidências

- **CSV com os 366 fantasmas de julho** (id, título, data de criação em Brasília, deal-gêmeo da indicação e delta em segundos): `analises/dados/2026-07-23_deals-fantasma-glauton-funil-vendas-julho.csv`
- Evidências citadas por id ao longo do texto: deals 462084–462089 (trio Carol/José do flagrante), execuções n8n 106988855/106989116/106989118 (criação dos fantasmas), webhook Pipedrive `create.deal` id 2877370 (10/07/2025).
- Observação lateral encontrada no caminho: o volume do Glauton em outras pipes tem outro mecanismo (creates sem `user_id`, by design nas automações): [IA] Chatbot de SDR 1.339/mês, [MEETIME] Prospecções perdidas 352, [REP] Prospecção 159.
