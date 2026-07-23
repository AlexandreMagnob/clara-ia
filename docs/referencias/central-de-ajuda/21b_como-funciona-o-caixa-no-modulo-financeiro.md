# Como funciona o caixa no Módulo Financeiro?

Fonte: https://ajuda.cardapioweb.com/modulos-do-sistema/modulo-financeiro/como-funciona-o-caixa-no-modulo-financeiro

---

## Visão geral: caixa e módulo financeiro

**Fechamento de caixa**

Ao realizar o fechamento do caixa, o sistema solicitará que você preencha a **conferência das formas de pagamento** (dinheiro, pix, cartão, etc.).

* Caso o valor informado na conferência seja menor do que o registrado pelo sistema, essa diferença será automaticamente registrada em: **Financeiro > Lançamentos > Contas a pagar**, com a descrição: *Faltou no caixa*

**Sangrias**

Ao fazer uma **sangria** (retirada de valor do caixa), o sistema registra automaticamente esse valor como uma **despesa** no módulo financeiro. Você pode visualizar em: **Financeiro > Lançamentos > Contas a pagar**

**Suprimentos**

Ao fazer um **suprimento** (entrada de valor no caixa), o valor será somado ao saldo do caixa, mas **não gera lançamento no financeiro**, já que não está ligado a uma movimentação externa.

**Vendas realizadas**

Todas as **vendas finalizadas** no sistema são lançadas automaticamente em: **Financeiro > Lançamentos > Contas a receber**

Esses registros são organizados por data e forma de pagamento, facilitando o controle financeiro da operação.

---

## Como fazer uma sangria no caixa (com o módulo financeiro ativo)

A sangria é usada para retirar valores do caixa durante o expediente. Com o módulo financeiro ativo, ela é registrada automaticamente como um lançamento em **contas a pagar**.

1. No menu lateral esquerdo, clique em **Caixa**.

> **Importante:** o caixa precisa estar **aberto** para realizar uma sangria.

2. No canto superior direito da tela, clique no botão **Sangria**.
3. Será exibida uma janela chamada **Nova sangria**. Escolha o tipo:

**Pagamento** — use quando o valor retirado for para pagar uma despesa (compra de insumos, pagamento emergencial, pequenos gastos, etc.)

**Sangria** — use quando a retirada for apenas para tirar o excesso de dinheiro do caixa. Esse valor será transferido para uma conta do tipo **Dinheiro** configurada em **Financeiro > Configurações > Contas**.

4. Preencha os campos obrigatórios (valor, motivo etc.).
5. Clique em **Salvar** ou em **Salvar e imprimir**, caso deseje gerar o comprovante da operação.

**Onde visualizar a sangria no financeiro:** após ser realizada, aparece em **Financeiro > Lançamentos > Contas a pagar**.

> **Observação:** A sangria só será exibida no módulo Financeiro após o fechamento do caixa em que ela foi realizada.

---

## Como fazer um suprimento no caixa com o módulo financeiro

1. No menu lateral esquerdo, clique em **Caixa**.
2. No canto superior direito da tela, clique na opção **Suprimento**.
3. Preencha:
   * **Descrição do suprimento** (ex: troco inicial, entrada de valores)
   * **Valor** que está sendo inserido no caixa
4. Clique em **Salvar**.

**Onde visualizar o suprimento no módulo financeiro:**

1. Clique em **Financeiro** > **Lançamentos**.
2. Clique na aba **Contas a Receber**.
3. O suprimento estará listado nessa tela, vinculado ao caixa onde foi realizado.

> **Observação:** o suprimento só será exibido no financeiro após o fechamento do caixa no qual ele foi registrado.

---

## Como fechar o caixa com o módulo financeiro

1. No menu lateral esquerdo, clique em **Caixa**.
2. Clique no botão **Fechar Caixa**, localizado no canto superior direito da tela.

**Conferência das formas de pagamento:**

Será exibida uma tela para registrar a **conferência das formas de pagamento**. Informe quanto há de cada forma de pagamento (dinheiro, cartão, pix, etc.).

Ao final da conferência, o sistema exibirá três valores:

* **Valor esperado:** Total que o sistema calcula com base nas vendas.
* **Valor em caixa:** Valor informado por você durante a conferência.
* **Diferença:** Diferença entre o valor esperado e o valor informado.
  * Se positiva → aparece em **Financeiro > Lançamentos > Contas a Receber** como **"Sobrou no caixa"**.
  * Se negativa → aparece em **Contas a Pagar** como **"Faltou no caixa"**.

**Dinheiro retirado no fechamento:**

Preencha o campo **Dinheiro retirado no fechamento** caso você retire algum valor em dinheiro ao fechar o caixa.

> **Importante:** Se você retirar dinheiro e não informar neste campo, o sistema considerará que o valor ficou no caixa. Isso impactará no valor inicial do próximo caixa, pois ele sempre começa com o valor deixado no fechamento anterior.

Após preencher todas as informações, clique em **Salvar**.
