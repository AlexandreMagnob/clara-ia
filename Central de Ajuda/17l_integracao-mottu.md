# Mottu

Fonte: https://ajuda.cardapioweb.com/automacao/integracoes/mottu

A **Mottu** é uma plataforma semelhante a **Bee Delivery**, com ela é possível solicitar entregadores deles para realizar entregas.

## Como integrar com a Mottu?

Antes de realizar a integração com o nosso sistema é importante que o nosso cliente tenha uma conta **ativa** na **Mottu**.

Para a ativar a integração é só informar o ID do logista e o API Token. Em seguida, configure na plataforma da Mottu a URL do webhook. Por fim, clique em "**Ativar em integração"** no nosso sistema.

O **ID do logista** pode ser encontrado facilmente na plataforma da **Mottu**.

Para obter o **API Token** deve ser aberto um chamado com o suporte da Mottu.

Com relação a **URL do webhook**, ele deve ser copiada no nosso sistema e informada no sistema da **Mottu**.

Após ativar a integração, na tela de **Gestão de pedidos** irá ter a opção de solicitar um entregador da **Mottu**.

Ao escolher a opção **Mottu** irá abrir uma janela com informações sobre essa solicitação, dentre as informações tem a previsão de coleta, a previsão para entrega, a distância total, o valor da entrega e se essa entrega já foi paga online ou não.

Ao clicar no botão "**SOLICITAR ENTREGADOR"**, a solicitação será enviada para a **Mottu**. Nos detalhes do pedido será mostrado que foi feita uma solicitação de entrega e o status dela.

Quando o status da entrega mudar na **Mottu**, o status da entrega no nosso sistema será atualizado automaticamente.

Quando o entregador coletar o pedido e iniciar a entrega, o status do pedido será atualizado automaticamente para "**Saiu para entrega"**.

Posteriormente, ao confirmar a entrega, o status do pedido em nosso sistema será alterado para "**Entregue"**.

Após solicitar um entregador, é possível cancelar a solicitação pelo nosso sistema enquanto a solicitação estiver em algum dos seguintes status: **Criado**, **Aceito**, **Pedido em preparação** ou **Previsto**.

Uma vez cancelada a entrega, o botão de solicitar entregador fica novamente disponível e é possível solicitar um entregador de alguma das integrações configuradas. 🚀✨

### Como obter o ID da loja?

**Passo 1:** No painel da mottu, no canto superior direito, clique na opção de perfil.

**Passo 2:** Em seguida, copie o ID.

**Passo 3:** Em **Configurações > Integrações > Mottu** na opção **ID do logista**, clique no botão "Informar" e cole o ID no campo especificado.

**Passo 4:** Após preencher o ID no campo destacado, clique em salvar.

Pronto! Você obteve o ID da loja!

### Como obter o API Token?

**Passo 1:** No painel da Mottu, em **Configurações >> Integrações**, localize a opção **Integração com a Mottu,** em seguida clique no botão **Ativar Integração.**

**Passo 2:** No painel de integração, copie o token (1), pois será necessário cadastrá-lo na integração do cardápio. Em seguida, selecione a opção **Cardápio Web** (2) e clique em **Concluir** (3).

**Passo 3:** No portal da Cardápio Web, em **Configurações > Integrações > Mottu** na opção **API Token**, clique no botão "Informar" e cole o Token no campo especificado.

**Passo 4:** Após preencher o Token no campo destacado, clique em salvar.

Pronto! Você obteve o API Token.

### Informando o Webhook da Mottu

**Passo 1:** Na tela inicial, vá até o menu lateral à esquerda e clique na opção "Configurações", representada por um ícone de engrenagem.

**Passo 2:** Dentro da aba "Configurações", selecione a opção "Integrações" no menu lateral.

**Passo 3:** Na tela de Integrações, localize a opção chamada "Webhook" e clique em "Ver mais" para acessar os detalhes.

**Passo 4:** Em seguida, insira a URL previamente copiada no Cardápio Web **Configurações** >> **Integrações** >> **Mottu**.

Após inserir a URL, clique no botão **Cadastrar URL** para salvar as alterações.

### Ativando a integração

Após preencher todas as informações da integração, vá em **Configurações > Integrações > Mottu** e clique em Ativar para concluir a ativação.

Para finalizar, integramos com a Mottu, garantindo eficiência e conectividade na operação. 🚀✨
