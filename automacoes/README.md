# Automações — workflows do N8N e salesbots do Kommo

Exports em JSON. Todo arquivo aqui é um workflow que **roda em produção** (ou uma proposta
explicitamente marcada como tal).

## Estrutura

| Pasta | Conteúdo |
|---|---|
| `clara-sdr/` | Núcleo da Clara, rodando sobre o **Supabase**. |
| `cdp/` | As mesmas automações **migradas para o CDP**. Nomes espelham `clara-sdr/`. |
| `kommo/` | Registro de mensagens e templates no Kommo. |
| `salesbots/<sdr>/` | Salesbots do Kommo, um por SDR humano. |
| `jira/` | IA de quebra de atividades (Slack → IA → Jira). |
| `tier-e-roteamento/` | Definição de tier do lead e envio para a Meetime. |
| `experimentos/` | Automações de apoio à Máquina de Hipóteses. |
| `parcerias/` | Automações do time de Parcerias. |
| `_versoes-antigas/` | Exports superados, guardados só como histórico. |

## A migração para o CDP

`clara-sdr/` e `cdp/` são **o mesmo workflow em dois bancos**, rodando em paralelo durante a
migração. O nome do arquivo é idêntico nas duas pastas de propósito — dá para diffar direto:

```bash
diff <(jq -S . clara-sdr/sdr_follow-up.json) <(jq -S . cdp/sdr_follow-up.json)
```

Quando a migração terminar, `cdp/` vira o novo `clara-sdr/` e a pasta antiga sai.
Guia da migração: [../docs/guias/GUIA-migracao-leads-para-CDP.md](../docs/guias/GUIA-migracao-leads-para-CDP.md).

> ⚠️ `clara-sdr/sdr_follow-up.json` é o export de **13/07** e **já contém os nós do CDP** —
> ele passou na frente da pasta `cdp/`, cujo export é de 19/06. Ao mexer no FUP, compare as
> datas antes de assumir qual é o mais novo. O export antigo está em `_versoes-antigas/`.

## Salesbots

Cinco SDRs, **mesmos nomes de arquivo** em cada pasta — o que muda é só o conteúdo. Isso
permite comparar a cadência de um SDR com a de outro sem tradução mental:

```bash
diff salesbots/caique/followup-1.json salesbots/gaby/followup-1.json
```

Estágios: `abertura` · `followup-1..5` · `breakup` · `confirmacao-hoje` ·
`confirmacao-amanha` · `confirmacao-30-minutos` · `noshow-abertura` ·
`noshow-followup-1..2` · `noshow-breakup`.

> A pasta `taty/` não tem `abertura.json` — os outros quatro SDRs têm. Confirmar se é
> intencional ou se o export ficou faltando.

## Como adicionar um workflow novo

1. Exporta do N8N (`⋯ → Download`).
2. Renomeia para `<área>_<slug>.json` — sem colchete, acento ou espaço.
   `[SDR] Tool consulta_agenda` → `sdr_tool-consulta-agenda.json`
3. Salva na pasta da área. Se a área não existe ainda, cria e documenta na tabela acima.
4. Reexportou um workflow que já existe? **Sobrescreve** o arquivo — o histórico é do git,
   não do nome. Só use `_versoes-antigas/` quando quiser manter as duas versões vivas.

> Os JSON do N8N carregam IDs de credencial, mas **não** os segredos. Ainda assim, dê uma
> olhada no diff antes de commitar um export novo.
