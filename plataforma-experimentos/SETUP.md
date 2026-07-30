# Setup do backend — Máquina de Experimentos

Passo a passo pra criar o projeto Supabase novo (isolado do banco de leads da Clara
IA) e me passar só o que é seguro compartilhar.

## 1. Criar o projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e entre com sua conta (ou crie uma).
2. **New project**.
3. Nome: `maquina-experimentos` (ou o que preferir).
4. **Database Password**: escolha uma senha forte pra isso — é a senha raiz do
   Postgres, não é a sua senha de login no app. Guarde num cofre de senha seu
   (não precisa me mandar essa).
5. Região: `South America (São Paulo)` — mais perto, menos latência.
6. Clique em **Create new project** e espere uns 2 minutos ele provisionar.

## 2. Rodar o schema

1. No projeto criado, vá em **SQL Editor** (menu lateral) → **New query**.
2. Abra o arquivo [`schema.sql`](schema.sql) desta mesma pasta, copie o conteúdo
   inteiro e cole lá.
3. Clique em **Run**. Deve criar as tabelas sem erro (se der erro, me manda o
   print que eu ajusto).
4. **Não rode ainda** o bloco comentado do final (a promoção pra líder) — isso é
   o passo 4 abaixo, depois que o app existir e você se cadastrar.

## 3. Conferir que login por e-mail/senha está ligado

1. Vá em **Authentication → Providers**.
2. Confirme que **Email** está habilitado (vem ligado por padrão).
3. Em **Authentication → URL Configuration**, não precisa mexer em nada agora —
   ajusto quando eu tiver a URL do site publicado no Vercel.

## 4. O que me mandar de volta

Vá em **Project Settings → API** e me passe só estes dois (são feitos pra serem
públicos, não são segredo — a segurança real está nas regras de acesso que já
criei no schema):

- **Project URL** (algo como `https://xxxxxxxx.supabase.co`)
- **anon / public key** (a chave longa em "Project API keys", a que diz `anon`
  `public` — **não** a `service_role`, essa aí sim é sensível e não precisa me
  passar)

Com isso eu construo e publico o app de verdade no Vercel, com login por
e-mail/senha real. Depois de você se cadastrar pela primeira vez lá (com
`alexandre.magno@cardapioweb.com` e a senha que você mesmo escolher na tela),
eu te aviso pra rodar o último comando do `schema.sql` (o que te promove a
líder) — ou rodo eu mesmo, se preferir, contanto que eu tenha acesso ao SQL
Editor nesse momento.
