# Saipos

Fonte: https://ajuda.cardapioweb.com/automacao/integracoes/saipos

Para realizar a integração no sistema, é necessário ter o seu ***IdPartner***. Você pode obter essa informação entrando em contato com o suporte da **SAIPOS**, que solicitará **o código da loja em nosso sistema**. Esse código está disponível na seção de integração com a **SAIPOS** no sistema da Cardápio Web.

Após informar o **IdPartner**, é necessário **ativar a integração**, que vem desativada por padrão. Assim que estiver ativada, se você desejar pausar a integração temporariamente, pode simplesmente acessar as configurações da integração e desativá-la.

Para que a integração funcione corretamente, os códigos internos dos produtos na SAIPOS devem ser registrados no campo **"Código PDV"** dos produtos em nosso sistema.

Para acessar esse campo, clique em **"Categorias"**, depois em **"produtos"** e cole em **"código pdv"**.

No sistema da SAIPOS, acesse o menu principal e selecione a opção **"Canais de Venda"** e **"Integrações"**.

Em seguida, localize a opção **"Cardápio Web"**. Se a caixa de seleção estiver marcada, isso indica que a **integração está ativa**. Depois, clique no ícone da engrenagem para acessar as configurações adicionais.

Na tela de configurações que aparecerá, você encontrará as opções de **pagamento da integração**. Algumas formas de pagamento podem já estar cadastradas por padrão. O aspecto mais importante é assegurar que cada forma de pagamento em **nosso sistema tenha uma equivalente na SAIPOS**.

Para facilitar essa verificação, na integração da SAIPOS em nosso sistema, há o botão **"VER FORMAS DE PAGAMENTO"**. Ao clicar nele, uma janela será aberta exibindo todas as formas de pagamento ativas do estabelecimento em nosso sistema.

Cada forma de pagamento é convertida em três informações enviadas para a SAIPOS: **código, complemento e indicação de se é pagamento online ou não.**

Por exemplo, no nosso sistema, o pagamento via PicPay é enviado para a SAIPOS com o código 'OTHER', o complemento 'picpay' e como pagamento não online.
Na tela de configurações da SAIPOS, é importante localizar a forma de pagamento equivalente, identificando qual opção na SAIPOS corresponde exatamente a essa configuração.

> **Observações:**
>
> * Pedidos de mesas e comandas não são transmitidos do Cardápio para a SAIPOS.
> * Pedidos do iFood também não são enviados para a SAIPOS.
> * Quando um pedido é cancelado em nosso sistema, ele também é cancelado na SAIPOS.
> * Pedidos com pagamento por Pix automático, antes da confirmação do pagamento, também não são enviados para a SAIPOS.

Com a integração SAIPOS ativa, você potencializa o gerenciamento de pedidos e agiliza o atendimento, oferecendo uma experiência completa e eficiente aos seus clientes. 🚀✨
