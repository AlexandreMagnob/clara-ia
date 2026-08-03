# Registro de acessos — conexões restritas do Mega Brain

> **Interno (prefixo `_`).** Fica no repo privado Clara IA de propósito: o Mega Brain é
> clonado pelo time inteiro e não deve expor quem tem acesso a quê.
> Criado em 25/07/2026 · atualizar sempre que liberar ou revogar alguém.

## Por que este arquivo existe

As conexões **Supabase** e **n8n** mexem com dados e automações de produção, então são
liberadas caso a caso. O controle real acontece **dentro da própria ferramenta** (membro
do projeto no Supabase, usuário no n8n) — este arquivo é só o registro de quem está
liberado, que serve para:

- saber a quem revogar quando alguém sai do time (offboarding);
- responder rápido "quem tem acesso ao banco?" sem abrir 3 painéis.

O Mega Brain **não** tem lista de nomes: as skills `/onboarding` e `/conectar` apenas
marcam as duas como 🔒 restritas e mandam falar comigo.

## Liberados hoje

| Pessoa | Supabase | n8n | Desde | Observação |
|---|---|---|---|---|
| Alexandre Magno | ✅ | ✅ | — | dono do projeto |

_(preencher conforme o time for entrando)_

## Como liberar alguém (checklist)

1. **Supabase:** adicionar a pessoa como membro do projeto (painel do Supabase).
   Preferir a chave **anon** (leitura) — a `service_role` permite apagar tabela e só deve
   ir para quem administra o banco.
2. **n8n:** criar/ativar o usuário na instância.
3. Registrar na tabela acima (pessoa, o quê, data).
4. Avisar a pessoa — a conexão passa a funcionar no `/conectar` dela, sem mais nada.

## Como revogar

Remover o acesso na ferramenta (passos 1 e 2), riscar a linha da tabela e anotar a data.
Revogar só na ferramenta basta para cortar o acesso — o registro é para não esquecer nada.
