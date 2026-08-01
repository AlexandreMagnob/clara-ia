# Clara IA — Instruções do projeto

## Contexto CardápioWeb (SEMPRE ler)
Antes de responder sobre a CardápioWeb, leia os dois arquivos de contexto:

- **`contexto-cardapioweb/CONTEXTO.md`** — empresa e operação comercial (RevOps): o que é a
  CardápioWeb, arquitetura de receita/funil, times (SDR/BDR/Closer/Gestão/Parcerias),
  ferramentas, métricas, gargalos e glossário. Produto/planos/preços ainda a completar.
  Use para qualquer pergunta sobre o negócio. Cuidado: "Clara" (gestora) ≠ "Clara IA" (bot).
- **`contexto-cardapioweb/PERFIL-OPERACIONAL.md`** — meu papel (Coordenador de Growth),
  equipe GWT, projetos ativos (Clara IA SDR, dashboards, Ads), aprendizados e padrões
  de trabalho. Use para entender quem você é e como você prefere trabalhar.

Os PDFs originais ficam em `contexto-cardapioweb/fontes/`. Se faltar um dado no CONTEXTO.md
mas ele estiver em `fontes/`, consulte a fonte e proponha atualizar o CONTEXTO.md.

Atenção: dados com data (métricas, versões de prompt, projeções) podem ficar
desatualizados — sempre prefira a informação mais recente e confirme antes de afirmar.

## Números que saem para fora
Antes de entregar qualquer número que vai circular — reporte ao Gerardo, veredito
VALIDADA/REFUTADA de experimento, slide, PDF, dashboard — acione o agente
`cetico-de-numero` com a afirmação pronta e espere o veredito. Ele é read-only e refaz a
conta por rota independente. Se voltar DIVERGENTE, o número não sai antes de reconciliar.
Acione também sempre que eu estranhar um resultado.

## Organização do repositório
O `README.md` da raiz tem o mapa completo e a tabela "onde eu coloco uma coisa nova".
Siga a convenção existente ao criar arquivo — não invente pasta nova sem necessidade:

- `automacoes/<área>/<área>_<slug>.json` — exports do N8N. `clara-sdr/` (Supabase) e `cdp/`
  são o mesmo workflow em dois bancos, com nomes de arquivo espelhados.
- `prompts/<agente>/AAAA-MM-DD_system-prompt-<agente>-vX.Y.md` — a versão em produção é a de
  maior número, não existe pasta `atual/`.
- `experimentos/<codigo>_<slug>.md` — o **plano** (GWT-xxxx, EXP-xx, SM30Hx).
- `analises/AAAA-MM-DD_<slug>.md` — o **resultado**; dados brutos em `analises/dados/`.
- `docs/` — guias, referências de API, arquitetura, processos.

Nomes sem acento, espaço ou colchete; `kebab-case`. Prefixo `_` = material interno.
Cada pasta principal tem README com as regras dela — leia antes de mexer.

## Segredos
Nunca versione credencial. `.env` e `CONEXAO.md` (senhas de cPanel/FTP/DB) estão no
`.gitignore` — não os leia para exibir conteúdo nem os mova para fora do bloqueio.
Antes de sugerir `git add -A`, confira o `git status`.
