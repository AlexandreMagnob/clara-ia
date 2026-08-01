# -*- coding: utf-8 -*-
"""Correções dos furos apontados pelo QA adversarial (30/07)."""
import sb, sys, json

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

REF = 'xmturuedgldjxoidyfnl'


def roda(rotulo, sql):
    st, d = sb.run_sql(REF, sql)
    ok = st in (200, 201)
    print('  %-58s %s' % (rotulo, 'OK' if ok else 'FALHOU HTTP %s' % st))
    if not ok:
        print('      ', json.dumps(d, ensure_ascii=False)[:500])
    return ok


print('=== nomes atuais das FKs ===')
st, d = sb.run_sql(REF, """
select conrelid::regclass::text as tabela, conname, confdeltype
from pg_constraint
where contype='f' and connamespace='public'::regnamespace
order by 1,2;
""")
for r in (d or []):
    print('   %-24s %-42s ondelete=%s' % (r['tabela'], r['conname'], r['confdeltype']))

print()
print('=== 1. ESCALADA DE PRIVILÉGIO: auto-inserção de perfil só como membro ===')
roda('policy de insert exige papel=membro', """
drop policy if exists "usuario cria o proprio perfil" on public.profiles;
create policy "usuario cria o proprio perfil"
  on public.profiles for insert to authenticated
  with check (auth.uid() = id and papel = 'membro');
""")

print()
print('=== 2. TRAVA DO ÚLTIMO LÍDER NO BANCO (hoje era só JS) ===')
roda('trigger protege_ultimo_lider', """
create or replace function public.protege_ultimo_lider()
returns trigger language plpgsql as $$
begin
  if (TG_OP = 'UPDATE' and OLD.papel = 'lider' and NEW.papel <> 'lider')
     or (TG_OP = 'DELETE' and OLD.papel = 'lider') then
    if (select count(*) from public.profiles where papel = 'lider') <= 1 then
      raise exception 'Nao e possivel remover o ultimo lider da plataforma';
    end if;
  end if;
  return case when TG_OP = 'DELETE' then OLD else NEW end;
end $$;

drop trigger if exists trg_protege_ultimo_lider on public.profiles;
create trigger trg_protege_ultimo_lider
  before update or delete on public.profiles
  for each row execute function public.protege_ultimo_lider();
""")

print()
print('=== 3. FKs: excluir usuário não pode estourar erro ===')
roda('responsavel_id / created_by -> on delete set null', """
alter table public.experimentos
  drop constraint if exists experimentos_responsavel_id_fkey,
  add  constraint experimentos_responsavel_id_fkey
       foreign key (responsavel_id) references public.profiles(id) on delete set null;

alter table public.experimentos
  drop constraint if exists experimentos_created_by_fkey,
  add  constraint experimentos_created_by_fkey
       foreign key (created_by) references public.profiles(id) on delete set null;

alter table public.resultados
  drop constraint if exists resultados_created_by_fkey,
  add  constraint resultados_created_by_fkey
       foreign key (created_by) references public.profiles(id) on delete set null;
""")

print()
print('=== 4. resultado não pode apontar pra braço de OUTRO experimento ===')
roda('FK composta (braco_id, experimento_id)', """
alter table public.bracos
  drop constraint if exists bracos_id_experimento_uk,
  add  constraint bracos_id_experimento_uk unique (id, experimento_id);

alter table public.resultados
  drop constraint if exists resultados_braco_id_fkey,
  drop constraint if exists resultados_braco_do_experimento,
  add  constraint resultados_braco_do_experimento
       foreign key (braco_id, experimento_id)
       references public.bracos(id, experimento_id) on delete cascade;
""")

print()
print('=== 5. conferência ===')
st, d = sb.run_sql(REF, """
select conrelid::regclass::text as tabela, conname,
       case confdeltype when 'n' then 'SET NULL' when 'c' then 'CASCADE'
            when 'a' then 'NO ACTION' else confdeltype end as ao_excluir
from pg_constraint
where contype='f' and connamespace='public'::regnamespace
order by 1,2;
""")
for r in (d or []):
    print('   %-24s %-44s %s' % (r['tabela'], r['conname'], r['ao_excluir']))

st, d = sb.run_sql(REF, """
select polname, pg_get_expr(polwithcheck, polrelid) as with_check
from pg_policy where polrelid='public.profiles'::regclass and polcmd='a';
""")
print()
print('   policy de INSERT em profiles:')
for r in (d or []):
    print('     %s -> %s' % (r['polname'], r['with_check']))
