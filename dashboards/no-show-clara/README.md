# Dashboard de No-show da Clara IA — GWT-2750

Dashboard do não-comparecimento das reuniões agendadas pela Clara IA, por **dia**, **hora** e
**segmento**, mais o **tempo médio entre a marcação e o horário da reunião**.

- `index.html` — dashboard estático (Chart.js via CDN). Lê `./data.json`; se não existir, cai no `./data.sample.json`.
- `data.sample.json` — dados ilustrativos (volumes reais do Supabase, desfechos placeholder).
- `data.json` — **gerado pelo n8n** (não versionar se vier dado sensível; hoje é só agregado).

## Como rodar local
```
cd dashboards/no-show-clara
python -m http.server 8000   # http://localhost:8000
```
(precisa de servidor por causa do `fetch`; abrir o arquivo direto não carrega o JSON).

---

## Modelo de dados (a decisão central)

| O que | Onde mora | Observação |
|---|---|---|
| Reunião agendada | Supabase `leads.data_agendamento` | timestamptz em **UTC** → converter p/ `America/Sao_Paulo` |
| Segmento | Supabase `leads.segmento` | 11 valores; vazio → `(vazio)` |
| Momento da marcação | **Pipedrive** `deal.add_time` (deal = `pipedrive_id2`) | NÃO usar `date_updated` do Supabase: ele sobe junto com os lembretes |
| No-show | **Pipedrive** `status=lost` E `lost_reason = "[IS] No-show"` | confirmado nos deals reais; `status=lost` sozinho NÃO serve (mistura no-show com "veio e não fechou") |
| Realizada | Pipedrive `won` OU `lost` com motivo ≠ no-show | |
| Pendente | Pipedrive `open` / sem desfecho | fica **fora** do denominador da taxa |
| **Atribuição (filtro obrigatório)** | Pipedrive `[TRACK] Passou por IA?` = **Sim** | só conta reunião atribuída à Clara; ver chave abaixo |

> ⚠️ **Sempre filtrar `Passou por IA = Sim`** ao puxar os deals — senão entram reuniões agendadas por SDR humano.
> Campo: key `6eac4a1164e70734e1a77a691a857bffa84bb9a1` (enum) · opção **Sim = id `1661`** (Não = 1662).
> No snapshot atual: 283 de 286 agendados do Supabase batem com Sim; 0 com Não; o resto são deals inexistentes.

**Lead time** = `data_agendamento − add_time`. Faixas: `<4h`, `4–24h`, `1–2 dias`, `>2 dias`.

---

## Pipeline n8n (diário, 07h Fortaleza = 10h UTC)

1. **Schedule Trigger** — cron `0 10 * * *`.
2. **Supabase → SELECT** (credential `Supabase - Revenue` / `kRKH2lDi70K6YQIf`). Query base:
   ```sql
   SELECT lead_id, pipedrive_id2, closer, modelo_llm,
          coalesce(nullif(trim(segmento),''),'(vazio)') AS segmento,
          data_agendamento,
          (data_agendamento AT TIME ZONE 'America/Sao_Paulo') AS data_local,
          EXTRACT(HOUR FROM data_agendamento AT TIME ZONE 'America/Sao_Paulo')::int AS hora_local
   FROM leads
   WHERE etapa_conversa = 'agendado'
     AND data_agendamento IS NOT NULL
     AND data_agendamento >= date_trunc('month', now()) - interval '2 months';
   ```
3. **Pipedrive (HTTP/GET deal)** por `pipedrive_id2` (API v1/v2, `pipeline_id=2`, token `{{ $json.token_pipedrive }}`,
   credenciais do nó `[REVOPS] Credenciais`). Pegar `add_time`, `status`, `lost_reason` e o campo
   `6eac4a1164e70734e1a77a691a857bffa84bb9a1` ([TRACK] Passou por IA?).
4. **Code (filtra + classifica)** — para cada reunião:
   - **Descartar** se `[TRACK] Passou por IA?` ≠ `1661` (Sim) ou se o deal não existe (404).
   - `desfecho` = `no_show` se `status=lost` e `lost_reason="[IS] No-show"`; `realizada` se won ou lost-outro; senão (`open`) `pendente`.
   - `lead_time_h` = (`data_agendamento` − `add_time`) em horas → faixa.
   - Agrega: `por_dia`, `por_hora`, `por_segmento`, `por_faixa_antecedencia`, `kpis`.
5. **Saída** — monta o `data.json` no formato abaixo e:
   - **Opção A (atual):** commit no repo via GitHub (mesmo padrão do GWT Sprint Dashboard) → Vercel publica.
   - **Opção B (futuro):** migrar o front pro Lovable consumindo o mesmo `data.json`.

### Contrato do `data.json`
Formato **granular** (1 registro por reunião) — o front agrega e recalcula tudo conforme o filtro de data.
Não contém dado pessoal (sem nome/WhatsApp).
```json
{
  "gerado_em": "2026-06-16T10:00:00-03:00",
  "benchmark": 0.30,
  "registros": [
    { "d": "2026-06-15", "h": 16, "seg": "Confeitaria", "o": "no_show", "lt": 41.2 }
  ]
}
```
- `d` = data local (America/Sao_Paulo) da reunião · `h` = hora local (0–23)
- `seg` = segmento (vazio → `(vazio)`)
- `o` = desfecho: `no_show` | `realizada` | `pendente`
- `lt` = lead time em horas (marcação→reunião); `null` se não calculável

O n8n só precisa emitir esse array — KPIs, por dia/hora/segmento/antecedência e o filtro de data são
calculados no `index.html`.

---

## D.O.D (anexar na GWT-2750)
- [ ] URL do dashboard publicado (Vercel)
- [ ] Print com filtros aplicados
- [ ] Lista de fontes: Supabase `leads` + Pipedrive (motivo `IS-noshow`, `add_time`) — ver tabela acima
- [ ] Vídeo curto explicando a atividade e os detalhes

## Confirmado (16/06/2026)
- Funil: `Funil de Vendas` (pipeline_id=2), estágio "Reunião Marcada".
- No-show = `status=lost` + `lost_reason = "[IS] No-show"`.
- Realizada = `won` ou `lost` com outro motivo. Pendente = `open`.
- O estágio do deal NÃO avança de forma confiável (won fica em "Reunião Marcada"), por isso usar `status`+`lost_reason`, não o estágio.

## Snapshot real (abr–jun/2026, 286 agendados)
- Taxa de no-show: **39,3%** (270 com desfecho). Lead time médio **41h**, mediana **37h**.
- Pior por hora: 16h (54%) e 17h (52%). Pior por segmento: Marmitaria (59%), Confeitaria (53%).
- Antecedência × no-show (monotônico): <4h 23% · 4–24h 34% · 1–2d 38% · >2d 47%.

## A decidir
1. Período fixo (desde abr/2026) ou janela móvel de 90 dias.
2. Onde publicar: Vercel (atual) e depois migrar o front pro Lovable.
