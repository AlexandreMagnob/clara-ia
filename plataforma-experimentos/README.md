# Máquina de Experimentos — plataforma (GWT-3144)

Plataforma do time pra cadastrar hipóteses, lançar resultado por dia e fechar experimento
com pós-mortem documentado. Substitui a planilha "Máquina de Hipóteses".

**No ar:** https://maquina-experimentos.vercel.app

## Arquitetura

| Camada | Onde |
|---|---|
| Front-end | `app/` — HTML/CSS/JS puro, sem build. Publicado na Vercel |
| Banco + login | Supabase, projeto `maquina-experimentos` (ref `xmturuedgldjxoidyfnl`), região São Paulo |
| Organização Supabase | **CW Growth** — separada da org `Cardápio Web`, plano Free |

⚠️ **Este projeto é deliberadamente isolado do Supabase da Clara IA.** O projeto
`CW - Comercial` tem 19 tabelas (incluindo `leads`) sem RLS e legíveis pela `anon key` —
como a `anon key` vai embutida no navegador, publicar um site sobre aquele projeto
exporia a base de leads. Ver `reference_supabase-clara-ia-rls-aberto` na memória.

## Modelo de dados

```
profiles       id (=auth.users), nome, setor, email, papel (membro|lider)
experimentos   codigo*, titulo, setor, responsavel_id, status, resultado, direcao,
               data_inicio, data_fim, hipotese, predicao, metrica_primaria,
               metrica_ancora, baseline_valor, baseline_desc, metrica_guarda,
               aprendizado, link_posmortem, tipo_metrica, agregacao
bracos         experimento_id, nome, ordem
resultados     experimento_id, braco_id, data, taxa, vol, valido, obs
               (único por braco_id + data — o app faz upsert)
```

Schema completo e comentado em [`schema.sql`](schema.sql).

## Regras de acesso (impostas no banco, não na tela)

- **Membro** enxerga e edita só experimentos do próprio setor.
- **Líder** enxerga todos os setores e gerencia usuários (promove/rebaixa/exclui).
- Cadastro é aberto, mas **só e-mail `@cardapioweb.com`** — travado por `CHECK` na
  tabela `profiles`, então nem a API aceita outro domínio.
- **O primeiro que se cadastrar vira líder automaticamente** (resolve o ovo-e-galinha).
  Depois disso, todo mundo entra como membro.
- Confirmação de e-mail está desligada (`mailer_autoconfirm`) — é ferramenta interna.

Testado de verdade: um membro do Comercial não lê nem edita experimento do Growth
**nem consultando o banco direto pelo console do navegador**.

## Publicar uma alteração

Edite os arquivos em `app/` e rode o script de deploy (usa `VERCEL_TOKEN` do `.env`):

```bash
python scripts/deploy.py
```

O deploy vai direto pra produção em `maquina-experimentos.vercel.app`.

## Credenciais

Tudo no `.env` da raiz (fora do git):

| Variável | Pra que |
|---|---|
| `SUPABASE_ACCESS_TOKEN` | token de gestão da conta Supabase (cria projeto, roda SQL) |
| `EXPERIMENTOS_PROJECT_REF` | ref do projeto desta plataforma |
| `EXPERIMENTOS_SUPABASE_URL` / `EXPERIMENTOS_ANON_KEY` | usadas pelo app (a anon key é pública por design — vai no JS do navegador; a segurança está no RLS) |
| `EXPERIMENTOS_DB_PASSWORD` | senha do Postgres, só pra conexão direta |
| `VERCEL_TOKEN` | deploy |

## Pendente

- Coleta automática das métricas (hoje o lançamento diário é manual).
- Teste de significância estatística.
- Migrar os experimentos que já estão rodando (o Alexandre vai mandar a lista).
