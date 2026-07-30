-- ================================================================
-- Máquina de Experimentos — schema Supabase (GWT-3144)
-- Projeto ISOLADO do Supabase de leads da Clara IA — não rodar
-- isto no projeto de produção da Clara.
--
-- Rode este arquivo INTEIRO, uma vez só, no SQL Editor do projeto
-- novo (Supabase Dashboard → SQL Editor → New query → colar → Run).
-- ================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------
-- perfis (1:1 com auth.users — criado automaticamente no cadastro)
-- ---------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  setor text not null check (setor in ('Growth','Comercial','CS','Marketing','Produto')),
  papel text not null default 'membro' check (papel in ('membro','lider')),
  email text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "qualquer logado ve todos os perfis"
  on public.profiles for select
  to authenticated
  using (true);

create policy "usuario cria o proprio perfil"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "usuario edita o proprio nome e setor (nao o papel)"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and papel = (select papel from public.profiles where id = auth.uid())
  );

create policy "lider edita qualquer perfil, inclusive papel"
  on public.profiles for update
  to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.papel = 'lider'));

create policy "lider exclui outros perfis"
  on public.profiles for delete
  to authenticated
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.papel = 'lider')
    and id <> auth.uid()
  );

-- cria o perfil sozinho quando alguém se cadastra (nome/setor vêm do
-- signUp({options:{data:{nome,setor}}}) do app)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nome, setor, email, papel)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', split_part(new.email,'@',1)),
    coalesce(new.raw_user_meta_data->>'setor', 'Growth'),
    new.email,
    'membro'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------
-- experimentos
-- ---------------------------------------------------------------
create table public.experimentos (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  titulo text not null,
  setor text not null check (setor in ('Growth','Comercial','CS','Marketing','Produto')),
  responsavel_id uuid references public.profiles(id),
  status text not null default 'desenhado' check (status in ('desenhado','rodando','em_analise','concluido')),
  resultado text check (resultado in ('validada','refutada','inconclusivo')),
  direcao text not null default 'maior' check (direcao in ('maior','menor')),
  data_inicio date,
  data_fim date,
  hipotese text,
  predicao text,
  metrica_primaria text,
  metrica_ancora text,
  baseline_valor numeric,
  baseline_desc text,
  metrica_guarda text,
  aprendizado text,
  link_posmortem text,
  tipo_metrica text not null default 'percentual' check (tipo_metrica in ('percentual','moeda','numero')),
  agregacao text not null default 'media' check (agregacao in ('media','soma')),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.experimentos enable row level security;
create index on public.experimentos(setor);

create policy "ve experimentos do proprio setor, lider ve tudo"
  on public.experimentos for select
  to authenticated
  using (
    setor = (select setor from public.profiles where id = auth.uid())
    or (select papel from public.profiles where id = auth.uid()) = 'lider'
  );

create policy "cria experimento no proprio setor, lider em qualquer"
  on public.experimentos for insert
  to authenticated
  with check (
    setor = (select setor from public.profiles where id = auth.uid())
    or (select papel from public.profiles where id = auth.uid()) = 'lider'
  );

create policy "edita experimento visivel"
  on public.experimentos for update
  to authenticated
  using (
    setor = (select setor from public.profiles where id = auth.uid())
    or (select papel from public.profiles where id = auth.uid()) = 'lider'
  );

create policy "exclui experimento visivel"
  on public.experimentos for delete
  to authenticated
  using (
    setor = (select setor from public.profiles where id = auth.uid())
    or (select papel from public.profiles where id = auth.uid()) = 'lider'
  );

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger experimentos_set_updated_at
  before update on public.experimentos
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------
-- braços (sub-linhas do experimento: Mensal/Anual, nichos, etc.)
-- ---------------------------------------------------------------
create table public.bracos (
  id uuid primary key default gen_random_uuid(),
  experimento_id uuid not null references public.experimentos(id) on delete cascade,
  nome text not null,
  ordem int not null default 0
);

alter table public.bracos enable row level security;
create index on public.bracos(experimento_id);

create policy "bracos seguem a visibilidade do experimento"
  on public.bracos for all
  to authenticated
  using (exists (
    select 1 from public.experimentos e
    join public.profiles p on p.id = auth.uid()
    where e.id = bracos.experimento_id
      and (e.setor = p.setor or p.papel = 'lider')
  ));

-- ---------------------------------------------------------------
-- resultados (lançamento diário por braço)
-- ---------------------------------------------------------------
create table public.resultados (
  id uuid primary key default gen_random_uuid(),
  experimento_id uuid not null references public.experimentos(id) on delete cascade,
  braco_id uuid not null references public.bracos(id) on delete cascade,
  data date not null,
  taxa numeric,
  vol numeric,
  valido boolean not null default true,
  obs text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  unique (braco_id, data)
);

alter table public.resultados enable row level security;
create index on public.resultados(experimento_id);
create index on public.resultados(braco_id);

create policy "resultados seguem a visibilidade do experimento"
  on public.resultados for all
  to authenticated
  using (exists (
    select 1 from public.experimentos e
    join public.profiles p on p.id = auth.uid()
    where e.id = resultados.experimento_id
      and (e.setor = p.setor or p.papel = 'lider')
  ));

-- ================================================================
-- PASSO FINAL (rode depois, sozinho, DEPOIS de você se cadastrar
-- no app pelo menos uma vez — sem isso não existe líder nenhum):
--
-- update public.profiles set papel = 'lider'
--   where email = 'alexandre.magno@cardapioweb.com';
-- ================================================================
