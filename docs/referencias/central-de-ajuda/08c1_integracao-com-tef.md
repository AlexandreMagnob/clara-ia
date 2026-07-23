# Integração com TEF

Fonte: https://ajuda.cardapioweb.com/gestao/minha-empresa/formas-de-pagamentos/integracao-com-tef

> #### Pré-requisitos
>
> * Conta Mercado Pago ativa.
> * Maquininha vinculada à conta Mercado Pago.
> * A maquininha deve estar conectada à alguma rede wifi ou dados moveis

**Passo a passo para integrar a maquininha ao sistema:**

Antes de vincular a maquininha, é necessário integrar o sistema à sua conta do Mercado Pago. Para isso, basta seguir o passo a passo abaixo.

* Acesse o menu lateral esquerdo e clique em **Configurações**.
* Em seguida, selecione a opção **Integrações**.
* Na tela de integrações, clique em **Mercado Pago**.
* Por fim, clique no botão **Autorizar Integração** para vincular sua conta do Mercado Pago ao sistema.

Após clicar em **"Autorizar Integração"**, você será redirecionado para a página de login do **Mercado Pago**. Faça login na sua conta e siga o passo a passo simples indicado pela plataforma.
Ao concluir todas as etapas, a integração será realizada com sucesso.

> integração com mercado pago concluida — Após integrar sua conta do Mercado Pago ao sistema, o próximo passo é vincular a maquininha.

**Adicionando a maquininha ao sistema**

Após autorizar a integração com o Mercado Pago, siga os passos abaixo para adicionar a maquininha ao sistema:

* No menu lateral esquerdo, clique em **Minha Empresa**.
* Em seguida, selecione a opção **Formas de Pagamento**.
* Na parte inferior da tela, acesse a aba **Integração com Maquininha**.
* Clique no botão **Adicionar Maquininha**.
* Selecione a maquininha desejada — ela será identificada pelo **ID**, que corresponde ao número de série localizado na parte traseira do dispositivo.
* Defina um **nome interno** para facilitar a identificação da maquininha no sistema.
* Por fim, clique em **Adicionar** para concluir o processo.

> Nesta etapa, é necessário que a maquininha já esteja vinculada à sua conta do Mercado Pago.

A maquininha foi adicionada com sucesso e estará disponível na lista para utilização.

**Após a integração, a maquininha será automaticamente configurada no modo "Vinculado à Frente de Caixa", conforme padrão do Mercado Pago.**
Nesse modo, **não é mais possível digitar valores diretamente na maquininha** — todos os pagamentos devem ser lançados exclusivamente pelo sistema. Essa funcionalidade assegura que os valores pagos coincidam exatamente com os valores registrados, garantindo **conformidade fiscal** e maior controle nas vendas.

> * **Pagamentos rejeitados ou não autorizados** pela maquininha aparecerão no sistema com o status **"Cancelado"**. Esses registros **não impactam o valor final do pedido** e **não são exibidos na impressão do comprovante**.
> * Somente pagamentos nas modalidades **crédito, débito, vale-alimentação** e **vale-refeição** podem ser solicitados via maquininha.
> * ⚠️ Para aceitar vales, é necessário verificar a documentação oficial do Mercado Pago e seguir o procedimento de habilitação.
> * **Estornos não devem ser realizados diretamente pela maquininha**, pois isso pode gerar **inconsistências no sistema**. O processo correto deve sempre ser feito pelo sistema integrado.
> * Em alguns casos, o pagamento poderá ficar com o status **"Devolvendo"**, indicando que o **reembolso ainda está em processamento** pelo Mercado Pago.
> * Atualmente, a integração é compatível com apenas **dois modelos de maquininhas Mercado Pago**. Certifique-se de que o dispositivo utilizado esteja entre os modelos homologados.

**Modelos de maquininhas compatíveis**

Atualmente, são aceitos os seguintes dispositivos do Mercado Pago para integração via TAF:

* **Point Smart** – Mercado Pago
* **Point Pro 2** – Mercado Pago
* **Point Smart 2** – Mercado Pago

---

### Como lançar pagamentos com TEF

> ✅ Requisitos para utilizar a integração com TAF (Mercado Pago)
>
> * **Integração com o Mercado Pago ativa** — A conta do cliente deve estar conectada ao sistema através da autorização na tela de Integrações.
> * **Maquininha vinculada à conta Mercado Pago** — A maquininha precisa estar corretamente registrada e ativa na mesma conta Mercado Pago utilizada na integração.
> * **Maquininha adicionada ao sistema** — Após a autorização da conta, a maquininha deve ser vinculada ao sistema na tela **Formas de Pagamento**, ativando o modo TEF.

**Como solicitar pagamento em pedidos já confirmados**

**✅ Solicitando o pagamento**

* No menu lateral esquerdo, clique em **"Gestão de Pedidos"**.
* Selecione o pedido para o qual deseja registrar o pagamento.
* Ao clicar no pedido, um resumo será exibido no canto direito da tela.
* Encontre a seção **"Formas de Pagamento"** dentro desse resumo.
* Ao lado da opção **"Marcar como pago"**, localize o **ícone de pagamento** (representado por um símbolo semelhante ao de pagamento por aproximação).
* Clique nesse ícone. Uma nova aba será aberta, permitindo que você **selecione a maquininha** desejada para concluir a cobrança.

Caso exista apenas uma maquininha registrada, ela será selecionada automaticamente. Ao clicar em solicitar, será enviada uma requisição para a maquininha e ela fica aguardando o pagamento.

Após selecionar a maquininha desejada, clique em **"Solicitar"** para iniciar o processo de pagamento.
Em seguida, o valor será exibido automaticamente na tela da maquininha para que o cliente possa realizar o pagamento.

Quando o pagamento for concluído com sucesso, ele será **atualizado automaticamente no sistema**, e o pedido será marcado como **pago**.

> Após a confirmação do pagamento, ele **não poderá ser editado ou excluído**. No entanto, estarão disponíveis as opções de **Reembolso** e **Imprimir Segunda Via**.

**Ao clicar nos três pontinhos ao lado do status "Pago", serão exibidas duas opções: *Imprimir segunda via* e *Reembolsar*.**
Ao selecionar **Reembolsar**, uma janela de confirmação será apresentada.

Após confirmar a ação clicando em **"Confirmar"**, o estorno será processado automaticamente no cartão do cliente, e o pagamento será atualizado com o status **Devolvido** no sistema.

Com isso, você poderá seguir com o cancelamento do pedido ou realizar a alteração da forma de pagamento, conforme necessário.

> **Observação:** Embora seja possível realizar estornos diretamente pela maquininha do Mercado Pago, **essa ação não é registrada no sistema**, o que pode gerar inconsistências no controle financeiro e fiscal.
> Por isso, **não recomendamos realizar estornos diretamente na maquininha**. O ideal é que o estabelecimento sempre utilize a opção de **reembolso pelo sistema**, garantindo o registro correto da operação e mantendo a integridade dos dados.

Todo o processo descrito acima também se aplica às Mesas/Comandas.

Ao clicar no botão de pagamento ou em Fechar Conta, será exibida a tela de pagamentos, onde você poderá solicitar o pagamento pela maquininha clicando no botão ao lado do valor do pedido.

Depois de pago, é possível **Reembolsar** o pagamento ou **Imprimir a segunda via**.

Ao clicar em **Imprimir Segunda Via**, o comprovante irá sair na impressora padrão do sistema!

> As informações exibidas no comprovante atendem aos requisitos fiscais específicos de alguns estados do Brasil.
>
> **Sobre o CNPJ e a Razão Social**
>
> * O **CNPJ** é obtido diretamente da tela **Minha Empresa**.
> * A **Razão Social** utilizada é a cadastrada nas informações fiscais do estabelecimento.
> * Caso a Razão Social não esteja preenchida, será usado o nome do estabelecimento registrado na tela **Minha Empresa**.
>
> Essa regra vale apenas para estabelecimentos que **não emitem notas fiscais pela plataforma**. Para os que emitem, as configurações fiscais já estarão definidas, e a Razão Social será aplicada normalmente na impressão do comprovante.

Pronto! Agora você já conhece todas as formas de pagamento disponíveis para facilitar a experiência do seu cliente. 🚀✨
