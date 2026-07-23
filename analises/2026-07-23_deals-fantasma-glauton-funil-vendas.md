# Deals-fantasma do Glauton no Funil de Vendas — causa raiz

**Data:** 23/07/2026 · **Gatilho:** Whenna reportou 366 negócios de julho com proprietário Glauton Santos (SEO) no dashboard "CLO | NEG INI (ANÁLISE SDR)" · **Status:** ✅ FÁBRICA ESTANCADA em 23/07 14:04 e **VALIDADA em produção 14:05–15:01** (4 indicações novas na pipe 38 — Monique Custodio, Wilson/Sushi Tem, Thiago/Pizzas PerTutti, Eric Fontes — e **zero fantasma novo**; 15 execuções pós-fix do workflow, todas success); limpeza retroativa pendente

## Atualização 23/07 14:04 — correção aplicada

O workflow culpado é o **"[PAR][PIPEDRIVE] Vincular cupom com PARCEIRO"** (`Y0puhUsMR7IDSUvU`, do Alexandre). Intenção: deal novo com cupom → achar o deal do parceiro no funil de acompanhamento → criar atividade "Indicação via Cupom" nele. O fantasma era o **fallback** de quando não achava: "Criar perfil" + "Pipedrive" (create sem stage/owner/person válido). Ajuste aplicado com autorização dele (backup pré/pós em scratchpad, verificação pós-escrita ok):

1. Nós **"Criar perfil"** e **"Pipedrive"** (create do fantasma) → **desabilitados**.
2. **"Fitrar por FUNIL"**: `return resultadosFiltrados.length > 0 ? ... : items` → `return resultadosFiltrados;` (sem match agora encerra limpo, antes vazava a resposta crua da busca pro IF).
3. Caminho bom (atividade no deal do parceiro) intacto; workflow segue ativo.

⚠️ Descoberta na aplicação: o filtro procura o parceiro no **funil 44** ([PAR][OPS] Acompanhamento de parceiros), mas o deal do parceiro real testado (Júnior Belfort, 412049) está no **funil 42** ([PAR] Acompanhamento de Parceiros Ativos) — ou seja, o "vincular" quase nunca casava e por isso ~tudo caía no fallback. Religar o vínculo = apontar o filtro pro 42 (decisão do Alexandre; ambos os funis têm deals open).

Confirmado pelo Alexandre: o `[PAR][MAIN][ADICAO]` está **como deveria ser** (by design, inclusive o deal que cai na Reunião Marcada) — não mexer.

## TL;DR

Um workflow do n8n **num projeto restrito** (id `Y0puhUsMR7IDSUvU`, inacessível pela API key do Growth) escuta o webhook `create.deal` do Pipedrive e, **para todo deal criado com o campo "Cupom" preenchido**, cria um person órfão + um **deal só com título** — sem stage (cai na 1ª etapa do funil default = **"Reunião Marcada"/Funil de Vendas**) e sem owner (cai no **dono do token = Glauton**). Como o fluxo de indicações de Parcerias cria deals com cupom, cada indicação gera 1–2 fantasmas. Roda desde **jul/2025** (data bate com o webhook `create.deal` criado em 10/07/2025); **~3.550 deals-fantasma acumulados** (~340–420/mês).

## Anatomia do fantasma (366 em julho, filtro: pipe 2, add_time 01–23/07, owner Glauton 11726977)

- 100% `origin=API`, criador = Glauton (token "Pipedrive - Comercial"), nascem direto na stage 43 (Reunião Marcada), status open.
- **Sem person, sem org, sem NENHUM campo custom, sem nota, sem atividade** — só título (nome do lead indicado).
- Só dia útil, horário comercial (padrão do time de Parcerias); 99 são duplicatas internas (mesmo lead 2×).
- 286 nascem **+1 a +3 segundos** depois de um deal homônimo do fluxo de indicações (pipe 38 / stage 43-default).

## Cadeia causal (provada por execução, 23/07 15:04 UTC)

Indicação de parceiro entra no `[PAR][MAIN][ADICAO][LEADS]` (webhook da página de adição manual):

1. **Braço sem e-mail** (ex.: Carol Empório Saladeria): Meetime + Kommo + `[PAR][CORE] Enviar leads de parcerias` → cria deal **462084** na pipe 38/stage 210 com cupom `JUNIORBELFORTCW` (owner corrigido p/ Letícia Rocha).
2. **Braço com e-mail** (ex.: José Alberto): cria **462086** *(sem `stage_id` → caiu na default 43 do Funil de Vendas!)* e **462087** (pipe 38/212), ambos com cupom, owner corrigido p/ Wanessa.
3. **Cada evento `create.deal` com cupom dispara o workflow oculto** `Y0puhUsMR7IDSUvU`: `Webhook → Pegar novos cadastros → Tem o Cupom Preenchido? → Encontrar NEGOCIO (parceiro pelo cupom) → Criar perfil (person órfão) → Pipedrive (cria o deal-fantasma)`. Execuções 106988855 (criou **462085**), 106989116 (criou **462089**), 106989118 (criou **462088**).
4. Fantasma não tem cupom → não se retroalimenta. Deals da Meetime não têm cupom → não geram fantasma (por isso o volume segue o ritmo de Parcerias, não o de reuniões).

Aritmética do flagrante: Carol 1 deal com cupom → 1 fantasma; José 2 deals com cupom → 2 fantasmas. n8n visível, Meetime, Kommo, RD, Sheets, Make, Railway e WordPress **excluídos por evidência** (janela de execuções capturada ao vivo; Railway/WP são webhooks recentes demais; Make de out/2024 não bate com início em jul/2025).

## Histórico (owner Glauton, pipe 2, sem person)

| mês | qtde | | mês | qtde |
|---|---|---|---|---|
| 2025-07 | 122 | | 2026-02 | 248 |
| 2025-08 | 182 | | 2026-03 | 337 |
| 2025-09 | 220 | | 2026-04 | 342 |
| 2025-10 | 244 | | 2026-05 | 321 |
| 2025-11 | 221 | | 2026-06 | 419 |
| 2025-12 | 195 | | 2026-07 | 364 (até dia 23) |
| 2026-01 | 336 | | **total** | **~3.551** |

## Problemas correlatos encontrados no caminho

- **`[PAR][MAIN][ADICAO]` nó "Create a deal" sem `stage_id`**: o deal de indicação com e-mail cai em "Reunião Marcada" do Funil de Vendas (owner = time de Parcerias via round-robin) sem reunião real — polui a pipe dos closers por outra via (ex.: 462086/Wanessa; explica parte dos deals de Letícia Rocha na pipe 2).
- **Persons órfãos**: o workflow oculto cria 1 person por fantasma (~3,5 mil persons duplicados, owner Glauton).
- Padrão geral: todo create sem `user_id` vira deal do Glauton (dono do token). O mesmo mecanismo explica os volumes dele nas pipes 65 (1.339/mês — intake da Clara, por design), 28 (352 — prospecções perdidas Meetime) e 60 (159 — REP).

## Correção — status

1. ✅ **Estancar:** feito 23/07 14:04 (ver "Atualização" acima). O workflow era do próprio Alexandre, não de projeto de Dev.
2. ⏳ **Higiene:** deletar/arquivar os ~3.551 fantasmas (todos open, stage 43) + persons órfãos. Lista de julho pronta em `analises/dados/2026-07-23_deals-fantasma-glauton-funil-vendas-julho.csv`; rodar em lote só com OK e dry-run.
3. ❌ Descartado: `[PAR][MAIN][ADICAO]` é by design (confirmado pelo Alexandre) — não mexer.
4. ⏳ **Religar o vínculo (opcional):** apontar o "Fitrar por FUNIL" pro funil 42 (hoje mira o 44) pra atividade de indicação voltar a ser criada no deal do parceiro — decisão do Alexandre.
5. **Paliativo p/ Whenna até a limpeza:** nos dashboards CLO, filtrar proprietário ≠ Glauton (ou "person não vazio").

## Dados

- `analises/dados/2026-07-23_deals-fantasma-glauton-funil-vendas-julho.csv` — 366 fantasmas de julho com gêmeo da pipe 38 e delta em segundos.
- Evidências (execuções, workflows, webhooks) citadas por id ao longo do texto; token do Pipedrive é o do Glauton (`/v1/users/me`), credencial n8n "Pipedrive - Comercial".
