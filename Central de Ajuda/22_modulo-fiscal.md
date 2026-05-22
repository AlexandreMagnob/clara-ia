# Módulo Fiscal

Fonte: https://ajuda.cardapioweb.com/modulos-do-sistema/modulo-fiscal

Com o módulo fiscal da Cardápio Web, é possível emitir notas fiscais de forma prática e dentro das exigências legais.

> Módulo Fiscal é um recurso adicional do sistema, disponível por R$ 69,99 / mês no plano mensal.
> Com o módulo, você pode emitir até 2.500 notas por mês, e caso precise emitir mais do que isso, será cobrada uma pequena taxa de apenas R$ 0,05 centavos por cada nota excedente.

## Antes de começar

Caso você tente localizar a Cardápio Web na SEFAZ e não encontre, isso acontece porque utilizamos uma empresa intermediária para a emissão das notas. Neste caso, será necessário inserir os dados dessa empresa durante a configuração.

> **Nosso sistema utiliza o eNotas como emissor fiscal.**
>
> * **CNPJ** 57.743.975/0001-27
> * **Razão Social:** Enotas Desenvolvimento de Softwares LTDA
> * **Nome Comercial:** eNotas Gateway
> * **Versão do Programa Aplicativo Fiscal:** 2.0

## Acesso às configurações

No menu lateral do sistema, acesse **"Fiscal"** e, em seguida, clique em **"Configurações"**.

> **Todas as configurações devem ser realizadas com o apoio do seu contador.** Ele possui o conhecimento necessário para preencher corretamente os campos exigidos por lei. Informações incorretas podem gerar penalidades fiscais para sua empresa.

## Etapas da Configuração Fiscal

#### 1. Dados da Empresa

Nesta etapa, preencha:

* CNPJ da empresa
* Inscrição Estadual
* Razão Social
* Código do Regime Tributário
* Demais informações cadastrais

> Campos com * são obrigatórios.

* Após o preenchimento, clique em **SALVAR** para liberar as próximas etapas.

### Envio Automático de XMLs das Notas Fiscais para a Contabilidade

Agora o sistema permite enviar **automaticamente os XMLs das notas fiscais do mês** diretamente para o e-mail cadastrado.

**Como ativar o recurso?**

* Acesse a tela de **Configurações Fiscais** clicando em **"Fiscal"**, depois em **"Configurações"** e, em seguida, em **"Dados da Empresa"**
* No campo **"E-mail do contador"**, insira o endereço desejado (pode ser o e-mail do seu contador, por exemplo);
* Clique em **Salvar**.

Pronto! A partir daí, o envio automático estará habilitado.

**Como funciona?**

No dia **03 de cada mês**, o sistema enviará automaticamente para o e-mail informado:

* Um **resumo das notas emitidas e canceladas**;
* Um **link para download dos XMLs** das notas fiscais do mês.

Além disso, quando o envio automático estiver ativo, será exibido um aviso no **pop-up do botão "Baixar XMLs"** na tela de notas fiscais, informando que o envio automático está habilitado.

---

#### 2. Configurações Fiscais Gerais

Aqui você irá configurar:

* **CSC (Código de Segurança do Consumidor)**
* **Número da nota fiscal**
* **Série da nota**

**A tela é dividida em dois ambientes:**

* **Homologação**: ambiente de testes (sem validade jurídica)
* **Produção**: ambiente oficial de emissão (com validade jurídica)

**Número e Série da Nota**
Consulte a última nota emitida pelo seu CNPJ. Se for sua primeira emissão, preencha com o número **1** em ambos os campos.

**CSC e ID do CSC**
São fornecidos pela SEFAZ do seu estado e são obrigatórios para a emissão de NFC-e.

> Se seu contador enviou apenas um CSC e ID, você pode utilizá-los nos dois ambientes.

#### 3. Certificado Digital Modelo A1

Adicione o certificado digital no formato **.PFX ou .P12** e, em seguida, insira a senha correspondente.

> Apenas certificados digitais **modelo A1** são aceitos. Outros formatos não são compatíveis com o sistema.

#### 4. Ambiente de Emissão

Defina o ambiente que será utilizado para emissão das notas:

* **Homologação**: usado para testes, sem validade jurídica
* **Produção**: emissão oficial, com validade jurídica

Após concluir todas as etapas anteriores, a próxima etapa será a configuração fiscal dos **produtos cadastrados no sistema**.

> A Cardápio Web oferece o sistema fiscal para todos os usuários que assinam este módulo, respeitando os parâmetros legais exigidos por cada estado.
> No entanto, **não nos responsabilizamos por informações inseridas incorretamente ou pelo uso indevido do sistema**, que possa infringir legislações fiscais.

A correta configuração fiscal é essencial para garantir que sua empresa opere conforme as normas legais, evitando problemas tributários e assegurando a emissão de notas de forma segura e eficaz.

---

## Autorização de Emissão Fiscal

Clientes de todos os estados brasileiros podem emitir notas fiscais normalmente através do Cardápio Web.

Para os estados do **Paraná** e **Santa Catarina**, a emissão também é possível, desde que seja solicitada previamente a autorização junto ao nosso suporte.

**Emissão fiscal no Estado do Paraná**
Será necessário emitir o *Documento de Cadastro de Autorização de Uso* no site da SEFAZ do Pará.
Ao preencher o cadastro, utilize os seguintes dados do nosso emissor fiscal:

* **CNPJ:** 57.743.975/0001-27
* **Razão Social:** Enotas Desenvolvimento de Softwares LTDA
* **Nome Comercial:** eNotas Gateway
* **Versão do Programa Aplicativo Fiscal:** 2.0

Após concluir o procedimento, envie o documento para a nossa equipe de suporte.

**Emissão fiscal em Santa Catarina**
Não é necessário emitir nenhum documento. Apenas entre em contato com a nossa equipe de suporte, informando que deseja a autorização para emissão de notas.
O suporte fará a solicitação diretamente com o nosso emissor fiscal.

> **O prazo máximo para a conclusão do procedimento de autorização é de até dois dias úteis.**
