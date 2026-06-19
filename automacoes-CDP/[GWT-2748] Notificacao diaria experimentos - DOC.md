# GWT-2748 — Notificação diária de experimentos ativos no Slack

Workflow n8n que, todo dia às **09:00**, lê a planilha da Máquina de Hipóteses,
filtra os experimentos com status **Rodando** e posta a lista no canal **#growth**.
Resolve o problema de experimentos rodando sem ninguém preencher a métrica do dia.

---

## Como funciona (5 nós)

`Todo dia 09:00` → `Ler experimentos` → `Só status Rodando` → `Montar mensagem` → `Enviar no #growth`

| Nó | O que faz |
| --- | --- |
| **Todo dia 09:00** | Schedule Trigger — dispara diariamente às 9h. |
| **Ler experimentos** | Lê a aba da [planilha de experimentos](https://docs.google.com/spreadsheets/d/1v8dDnjwihOFBGwcDhYSTV0rnorlUxXPnT5JGPUrjk64/edit?gid=168394971) (1ª linha = cabeçalho). |
| **Só status Rodando** | Mantém só as linhas onde `Status = Rodando`. |
| **Montar mensagem** | Junta todos os experimentos numa única mensagem (ID, nome, responsável, métrica, prazo, link do Jira). |
| **Enviar no #growth** | Posta no canal `#growth` (`C08HQ7SJRBP`) com a credencial *Slack Doguinho Bot*. |

---

## Setup (1ª vez, dentro do n8n)

1. **Importar:** n8n → *Workflows* → *Import from File* → `[GWT] Notificacao diaria experimentos ativos.json`.
2. **Credencial do Google Sheets:** abra o nó **Ler experimentos** e selecione (ou crie)
   a credencial *Google Sheets OAuth2*. O placeholder `TROCAR_CREDENCIAL_SHEETS` precisa
   ser substituído pela sua conta com acesso à planilha.
3. **Confirmar a aba:** ainda no nó **Ler experimentos**, confirme que o *Sheet* aponta para
   a aba certa (gid `168394971`). Se a planilha tiver uma linha de título acima do cabeçalho,
   ajuste *Options → Header Row* para a linha correta.
4. **Slack:** a credencial *Slack Doguinho Bot* e o canal `#growth` já vêm preenchidos.
   Garanta que o bot foi convidado pro canal (`/invite @Doguinho` no #growth).
5. **Testar:** clique em *Test workflow* e confira a mensagem chegando no #growth.
6. **Ativar:** ligue o toggle *Active* no canto superior direito.

---

## 👉 Como adicionar um novo experimento ao tracking

**Não precisa mexer no n8n.** O tracking é dirigido pela coluna **Status** da planilha:

1. Crie/edite a linha do experimento na [planilha](https://docs.google.com/spreadsheets/d/1v8dDnjwihOFBGwcDhYSTV0rnorlUxXPnT5JGPUrjk64/edit?gid=168394971).
2. Preencha pelo menos: **ID** (EXP-XX), **Nome curto**, **Responsável** e **Métrica**.
   (Opcionais que enriquecem a mensagem: **Data término** e **Link Jira**.)
3. Coloque a coluna **Status** em **`Rodando`** (exatamente assim, sem espaços extras).
4. Pronto. No próximo disparo das 09:00 ele já aparece na lista do #growth.

**Para tirar um experimento da lista:** mude o Status para `Em análise`, `Concluído` ou
qualquer valor diferente de `Rodando`.

> ⚠️ Só linhas com `Status = Rodando` entram. As sub-linhas de criativos/variações (CR..)
> ficam com Status vazio de propósito e por isso **não** poluem a notificação.

---

## Ajustes rápidos

- **Horário:** nó *Todo dia 09:00* → `Trigger at Hour`.
- **Só dias úteis:** no Schedule, troque para *Weeks* e marque Seg–Sex.
- **Outro canal:** nó *Enviar no #growth* → campo *Channel*.
- **Incluir "Em análise" na lista:** nó *Só status Rodando* → adicione uma segunda condição
  `Status = Em análise` e mude o combinador para **OR**.
- **Marcar (@) o responsável:** nó *Montar mensagem* → objeto `SLACK_IDS`. A chave é o nome
  normalizado da coluna *Responsável* (minúsculo, sem acento); o valor é o **member ID** do
  Slack (`U...`, em *perfil → ⋯ More → Copy member ID*). Enquanto o ID estiver como
  `U_TROCAR_...`, o fluxo mostra o nome em texto puro (não pinga). Para um responsável novo,
  basta adicionar mais uma linha no mapa.
