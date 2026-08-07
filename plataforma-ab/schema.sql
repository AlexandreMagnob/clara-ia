-- ═══════════════════════════════════════════════════════════════════════════
-- Plataforma de teste A/B de landing page — schema Postgres/Supabase
-- GWT-3256
--
-- Rodar no SQL Editor do Supabase. Lembrete que já custou tempo ao time:
-- chave `anon`/`service_role` NÃO cria tabela — CREATE TABLE só sai pelo SQL
-- Editor, pela senha do Postgres ou por PAT/MCP oficial.
--
-- Este projeto tem que ficar numa base ISOLADA da Clara IA. O projeto
-- `CW - Comercial` tem tabelas sem RLS legíveis pela anon key, e esta
-- plataforma serve um site público.
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists ab_testes (
  slug            text primary key
                  check (slug ~ '^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$'),
  nome            text not null,
  hipotese        text default '',
  jira            text default '',
  status          text not null default 'rascunho'
                  check (status in ('rascunho','rodando','pausado','encerrado')),
  -- A seed fixa a atribuição. Mudar seed = resortear todo mundo.
  seed            text not null,
  cobertura       numeric not null default 1 check (cobertura > 0 and cobertura <= 1),
  baseline        numeric check (baseline > 0 and baseline < 1),
  mde             numeric default 0.2 check (mde > 0),
  alfa            numeric default 0.05 check (alfa > 0 and alfa < 1),
  poder           numeric default 0.8 check (poder > 0 and poder < 1),
  min_dias        int default 7 check (min_dias >= 1),
  max_dias        int default 30,
  vencedor        text,
  ultimo_veredito text,
  obs             text default '',
  criado_em       timestamptz not null default now(),
  atualizado_em   timestamptz not null default now(),
  iniciado_em     timestamptz,
  encerrado_em    timestamptz,
  check (max_dias >= min_dias)
);

create table if not exists ab_variantes (
  id          bigserial primary key,
  teste_slug  text not null references ab_testes(slug) on delete cascade,
  chave       text not null check (chave ~ '^[A-Za-z0-9_-]{1,12}$'),
  nome        text not null,
  url         text not null check (url like 'https://%'),
  peso        numeric not null check (peso > 0 and peso <= 1),
  ordem       int not null default 0,
  unique (teste_slug, chave)
);

create table if not exists ab_eventos (
  id            bigserial primary key,
  teste         text not null references ab_testes(slug) on delete cascade,
  variante      text not null,
  visitante     text not null,
  tipo          text not null check (tipo in ('assignment','view','conversion')),
  criado_em     timestamptz not null default now(),
  dia           date not null,
  bot           boolean not null default false,
  ua            text,
  ip_hash       text,          -- sha256(sal + ip), 16 chars. Nunca o IP.
  referrer      text,
  utm_source    text,
  utm_campaign  text,
  utm_medium    text,
  valor         numeric,
  -- ESTA restrição é a deduplicação. Sem ela, refresh na página vira
  -- atribuição nova e o denominador incha de forma desigual entre os braços.
  unique (teste, visitante, tipo)
);

create index if not exists ab_eventos_teste_dia on ab_eventos (teste, dia);
create index if not exists ab_eventos_teste_tipo on ab_eventos (teste, tipo);
create index if not exists ab_eventos_visitante on ab_eventos (teste, visitante);

-- ═══════════════════════════════════════════════════════════════════════════
-- Visão de conferência: contagem por variante já aplicando as duas regras de
-- integridade (denominador = atribuição; conversão vai pra variante ATRIBUÍDA).
-- A plataforma calcula isso em JS; esta visão existe pra auditar por SQL.
-- ═══════════════════════════════════════════════════════════════════════════

create or replace view ab_resumo as
with atribuicao as (
  select distinct on (teste, visitante)
         teste, visitante, variante, dia
    from ab_eventos
   where tipo = 'assignment' and not bot
   order by teste, visitante, criado_em
),
conversao as (
  select distinct on (e.teste, e.visitante)
         e.teste, e.visitante, a.variante, e.dia
    from ab_eventos e
    join atribuicao a on a.teste = e.teste and a.visitante = e.visitante
   where e.tipo = 'conversion' and not e.bot
   order by e.teste, e.visitante, e.criado_em
)
select a.teste,
       a.variante,
       count(*)                        as atribuicoes,
       count(c.visitante)              as conversoes,
       round(count(c.visitante)::numeric / nullif(count(*),0), 6) as taxa,
       min(a.dia)                      as primeiro_dia,
       max(a.dia)                      as ultimo_dia
  from atribuicao a
  left join conversao c on c.teste = a.teste and c.visitante = a.visitante
 group by a.teste, a.variante
 order by a.teste, a.variante;

-- ═══════════════════════════════════════════════════════════════════════════
-- RLS
--
-- A anon key vai embutida no navegador, então RLS é a única segurança real.
-- Aqui o desenho é: NINGUÉM lê nem escreve pela anon key. Todo acesso passa
-- pelas funções da API, que usam a service_role (que ignora RLS) do lado do
-- servidor, atrás do AB_ADMIN_TOKEN.
-- ═══════════════════════════════════════════════════════════════════════════

alter table ab_testes    enable row level security;
alter table ab_variantes enable row level security;
alter table ab_eventos   enable row level security;

-- Nenhuma policy criada de propósito: RLS ligada sem policy = nega tudo para
-- anon e authenticated. Não apague este comentário achando que faltou algo.

comment on table  ab_eventos is 'Eventos brutos. UNIQUE(teste,visitante,tipo) é a deduplicação.';
comment on column ab_eventos.variante is 'Variante DECLARADA pelo evento. A agregação usa a atribuída, não esta.';
comment on column ab_testes.seed is 'Fixa a atribuição por hash. Mudar = resortear todos os visitantes.';
