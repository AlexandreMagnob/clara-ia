Perdidos na Meetime (nunca tiveram reunião):


SELECT pe.name AS "Nome", pe.telephone AS "Telefone", pe.email AS "Email",
       d.segment AS "Segmento", d.tier AS "Tier",
       d.lost_at AS "Data perda", d.loss_reason AS "Motivo"
FROM commercial_deals d
JOIN persons pe ON pe.id = d.person_id
WHERE d.discarded_at IS NULL
  AND d.status = 'lost'
  AND d.scheduled_meeting_at IS NULL
  AND NOT (d.custom_properties ? 'oportunidade_at')
  AND d.stage IS DISTINCT FROM 'oportunidade'
  AND d.lost_at >= '2026-07-09'
ORDER BY d.lost_at DESC;



RESULTADO 

[
  {
    "Nome": "Dino Cesar",
    "Telefone": "5586998210410",
    "Email": "churritzteresina@gmail.com",
    "Empresa": "CHURRITZ",
    "Segmento": "Confeitaria",
    "Tier": "1",
    "Closer": "Rebeca Cabral",
    "Data reunião": "2026-07-17T10:00:00.000Z",
    "Virou oportunidade em": "2026-07-14T16:32:36.896Z"
  },
  {
    "Nome": "",
    "Telefone": "5583999019449",
    "Email": null,
    "Empresa": null,
    "Segmento": null,
    "Tier": null,
    "Closer": "Luan Nicolas",
    "Data reunião": "2026-07-16T18:30:00.000Z",
    "Virou oportunidade em": "2026-07-14T22:29:27.880Z"
  },
  {
    "Nome": "Ruana Braga",
    "Telefone": "5519981821512",
    "Email": "lamassafoods@gmail.com",
    "Empresa": "La Massa Pizzaria",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Closer": "Rebeca Cabral",
    "Data reunião": "2026-07-16T18:00:00.000Z",
    "Virou oportunidade em": "2026-07-15T14:18:15.215Z"
  },
  {
    "Nome": "",
    "Telefone": "5531998971492",
    "Email": null,
    "Empresa": null,
    "Segmento": null,
    "Tier": null,
    "Closer": "Luan Nicolas",
    "Data reunião": "2026-07-16T10:00:00.000Z",
    "Virou oportunidade em": "2026-07-15T13:51:52.381Z"
  },
  {
    "Nome": "Ricardo RL",
    "Telefone": "5516981232147",
    "Email": "ricardo.bertolazzo@hotmail.com",
    "Empresa": "RiLi Dogs",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Closer": "Luiz Moura",
    "Data reunião": "2026-07-16T10:00:00.000Z",
    "Virou oportunidade em": "2026-07-15T13:44:04.545Z"
  },
  {
    "Nome": "Diego amancio",
    "Telefone": "5521964516387",
    "Email": "diego.dxwill@gmail.com",
    "Empresa": "Sabor de xerem",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Closer": "Ranier Oliveira",
    "Data reunião": "2026-07-15T18:00:00.000Z",
    "Virou oportunidade em": "2026-07-15T13:28:58.567Z"
  },
  {
    "Nome": "Yasmin Barbosa",
    "Telefone": "5573991368605",
    "Email": "yasminbarbosaa08@gmail.com",
    "Empresa": "Restaurante",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Closer": "Luiz Moura",
    "Data reunião": "2026-07-15T17:15:00.000Z",
    "Virou oportunidade em": "2026-07-14T14:00:08.183Z"
  },
  {
    "Nome": "Eduardo Gabriel Carvalho Lima Cardoso",
    "Telefone": "5587999127998",
    "Email": "gabriellima4539@yahoo.com",
    "Empresa": "Prontta Marmitaria Congelada",
    "Segmento": "Marmitaria",
    "Tier": "1",
    "Closer": "Leandro dos Santos",
    "Data reunião": "2026-07-15T17:15:00.000Z",
    "Virou oportunidade em": "2026-07-14T21:38:04.457Z"
  },
  {
    "Nome": "Francyellen Reis",
    "Telefone": "5519984591627",
    "Email": "reisfrancyellen@gmail.com",
    "Empresa": "Marmita da Dona Fran",
    "Segmento": "Marmitaria",
    "Tier": "5",
    "Closer": "Rebeca Cabral",
    "Data reunião": "2026-07-15T17:15:00.000Z",
    "Virou oportunidade em": "2026-07-13T21:15:00.203Z"
  },
  {
    "Nome": "Carlos vinícius costa de oliveira",
    "Telefone": "5586995203601",
    "Email": "vinicius.oec@gmail.com",
    "Empresa": "restaurante",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Closer": "Luan Nicolas",
    "Data reunião": "2026-07-15T17:15:00.000Z",
    "Virou oportunidade em": "2026-07-14T14:31:19.758Z"
  },
  {
    "Nome": "Ingrid Campelo",
    "Telefone": "5598988129984",
    "Email": "ingridnessa@hotmail.com",
    "Empresa": "Mocotó Delas",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Closer": "Cleber Rodrigues",
    "Data reunião": "2026-07-15T16:30:00.000Z",
    "Virou oportunidade em": "2026-07-14T19:55:35.384Z"
  },
  {
    "Nome": "everton bernardo da silva",
    "Telefone": "5511952153755",
    "Email": "ochappahamburgueria@gmail.com",
    "Empresa": "Ochappa Hamburgueria",
    "Segmento": "Hamburgueria",
    "Tier": "1",
    "Closer": "Leandro dos Santos",
    "Data reunião": "2026-07-15T15:45:00.000Z",
    "Virou oportunidade em": "2026-07-14T19:49:33.387Z"
  },
  {
    "Nome": "Edson Dias",
    "Telefone": "5562991183046",
    "Email": "edsonbatistadeoliveira44@gmail.com",
    "Empresa": "Pizzaria Oliver's",
    "Segmento": "Pizzaria",
    "Tier": "5",
    "Closer": "Luiz Moura",
    "Data reunião": "2026-07-15T15:45:00.000Z",
    "Virou oportunidade em": null
  },
  {
    "Nome": "Júlia Silva",
    "Telefone": "5531985170400",
    "Email": "juliasilva9662@gmail.com",
    "Empresa": "Açaí dois amores",
    "Segmento": "Açaiteria",
    "Tier": "2",
    "Closer": "Rebeca Cabral",
    "Data reunião": "2026-07-15T15:45:00.000Z",
    "Virou oportunidade em": "2026-07-13T23:42:41.687Z"
  },
  {
    "Nome": "Natali ",
    "Telefone": "5567996351817",
    "Email": "natalymt15@gmail.com",
    "Empresa": "",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Closer": "João Paulo Maciel",
    "Data reunião": "2026-07-15T15:45:00.000Z",
    "Virou oportunidade em": "2026-07-14T00:21:13.507Z"
  },
  {
    "Nome": "Jackeliny Cajueiro da Silva",
    "Telefone": "5541988648755",
    "Email": "papacajupizzaria@gmail.com",
    "Empresa": "PapaCaju Pizzaria",
    "Segmento": "Pizzaria",
    "Tier": "2",
    "Closer": "Luan Nicolas",
    "Data reunião": "2026-07-15T15:45:00.000Z",
    "Virou oportunidade em": "2026-07-14T20:19:14.119Z"
  },
  {
    "Nome": "Andréa Pereira",
    "Telefone": "5511964541368",
    "Email": "marcelodeus69@gmail.com",
    "Empresa": "Paraíso dos assados",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Closer": "Taty Freitas",
    "Data reunião": "2026-07-15T14:30:00.000Z",
    "Virou oportunidade em": "2026-07-15T12:52:04.942Z"
  },
  {
    "Nome": "",
    "Telefone": "5527999081922",
    "Email": null,
    "Empresa": null,
    "Segmento": null,
    "Tier": null,
    "Closer": "Leandro dos Santos",
    "Data reunião": "2026-07-15T14:15:00.000Z",
    "Virou oportunidade em": "2026-07-14T14:26:15.949Z"
  },
  {
    "Nome": "Adriana Picolo da Silva",
    "Telefone": "5521975720090",
    "Email": "adrianapdg@hotmail.com",
    "Empresa": "Delícias da Dri",
    "Segmento": "Lanchonete",
    "Tier": "5",
    "Closer": "Ranier Oliveira",
    "Data reunião": "2026-07-15T14:15:00.000Z",
    "Virou oportunidade em": "2026-07-14T22:18:38.443Z"
  },
  {
    "Nome": "Erica camargo",
    "Telefone": "5511991496436",
    "Email": "eri_hasp@hotmail.com",
    "Empresa": "Brownie Cake",
    "Segmento": "Confeitaria",
    "Tier": "1",
    "Closer": "João Paulo Maciel",
    "Data reunião": "2026-07-15T13:30:00.000Z",
    "Virou oportunidade em": "2026-07-14T13:25:01.610Z"
  },
  {
    "Nome": "ROMARIO CESAR DA CRUZ",
    "Telefone": "5521965769847",
    "Email": "romariocesarnovo3@gmail.com",
    "Empresa": "Mini vulcão da tata",
    "Segmento": "Confeitaria",
    "Tier": "4",
    "Closer": "Leandro dos Santos",
    "Data reunião": "2026-07-15T13:30:00.000Z",
    "Virou oportunidade em": "2026-07-14T20:18:44.741Z"
  },
  {
    "Nome": "Suzanne Mahaut",
    "Telefone": "5521994552282",
    "Email": "performancedigital4.0@gmail.com",
    "Empresa": "Poparte",
    "Segmento": "Outro",
    "Tier": "5",
    "Closer": "Rebeca Cabral",
    "Data reunião": "2026-07-15T13:30:00.000Z",
    "Virou oportunidade em": "2026-07-14T20:59:31.075Z"
  },
  {
    "Nome": "Francisco Eliezer carvalho de Morais ",
    "Telefone": "5585992049343",
    "Email": "eliezermorais@yahoo.com.br",
    "Empresa": "Restaurante Ilha moraiss",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Closer": "Rebeca Cabral",
    "Data reunião": "2026-07-15T13:30:00.000Z",
    "Virou oportunidade em": "2026-07-15T13:10:53.089Z"
  },
  {
    "Nome": "ANDRE almeida",
    "Telefone": "5531997263065",
    "Email": "divinuhcontato@gmail.com",
    "Empresa": "DIVINUH",
    "Segmento": "Hamburgueria",
    "Tier": "3.1",
    "Closer": "Miguel Nunes",
    "Data reunião": "2026-07-15T10:15:00.000Z",
    "Virou oportunidade em": "2026-07-14T20:24:33.009Z"
  },
  {
    "Nome": "",
    "Telefone": "5586981262115",
    "Email": null,
    "Empresa": null,
    "Segmento": null,
    "Tier": null,
    "Closer": "Luiz Moura",
    "Data reunião": "2026-07-15T10:15:00.000Z",
    "Virou oportunidade em": "2026-07-14T17:15:01.686Z"
  },
  {
    "Nome": "Joao Luz",
    "Telefone": "5511933467313",
    "Email": "engmarcossousa@gmail.com",
    "Empresa": "Tito Palermo",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Closer": "João Paulo Maciel",
    "Data reunião": "2026-07-15T10:15:00.000Z",
    "Virou oportunidade em": "2026-07-14T18:51:31.062Z"
  },
  {
    "Nome": "Eduardo dos santos inacio",
    "Telefone": "5551998885350",
    "Email": "eduinacio.3557@gmail.com",
    "Empresa": "Pizzaria webber",
    "Segmento": "Pizzaria",
    "Tier": "4",
    "Closer": "Taty Freitas",
    "Data reunião": "2026-07-15T10:15:00.000Z",
    "Virou oportunidade em": "2026-07-14T12:58:23.342Z"
  },
  {
    "Nome": "Paulo Henrique de Paula Silva",
    "Telefone": "5511999332887",
    "Email": "phpsilva5@gmail.com",
    "Empresa": "Amado Salgadao",
    "Segmento": "Pastelaria",
    "Tier": "3.1",
    "Closer": "Ranier Oliveira",
    "Data reunião": "2026-07-15T10:00:00.000Z",
    "Virou oportunidade em": "2026-07-14T18:09:42.771Z"
  },
  {
    "Nome": "CARLOS EDUARDO COUTINHO BARBOSA DA SILVA",
    "Telefone": "5527997634221",
    "Email": "carlos.ecb.ce@gmail.com",
    "Empresa": "dona pipoca gourmet",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Closer": "Luiz Moura",
    "Data reunião": "2026-07-15T10:00:00.000Z",
    "Virou oportunidade em": "2026-07-13T20:55:51.691Z"
  },
  {
    "Nome": "Gabriele Frazão dos Santos silva ",
    "Telefone": "5522992015295",
    "Email": "gabrielefrazao@yahoo.com",
    "Empresa": "Nuvem de mel ",
    "Segmento": "Confeitaria",
    "Tier": "1",
    "Closer": "Leandro dos Santos",
    "Data reunião": "2026-07-15T10:00:00.000Z",
    "Virou oportunidade em": "2026-07-13T18:54:40.697Z"
  },
  {
    "Nome": "Anderson da Conceição Araújo",
    "Telefone": "5593991434564",
    "Email": "andersondaconceicaoaraujo@gmail.com",
    "Empresa": "MEG BURGUER",
    "Segmento": "Hamburgueria",
    "Tier": "5",
    "Closer": "Gustavo Duarte Pinheiro Silva",
    "Data reunião": "2026-07-15T10:00:00.000Z",
    "Virou oportunidade em": "2026-07-14T15:16:29.235Z"
  },
  {
    "Nome": "",
    "Telefone": "5511986450308",
    "Email": null,
    "Empresa": null,
    "Segmento": null,
    "Tier": null,
    "Closer": "Luan Nicolas",
    "Data reunião": "2026-07-15T10:00:00.000Z",
    "Virou oportunidade em": "2026-07-13T19:18:25.719Z"
  },
  {
    "Nome": "Vinicius Ferreira",
    "Telefone": "5511940728473",
    "Email": "viiniciusferreira01@outlook.com",
    "Empresa": "Zen sushi",
    "Segmento": "Sushi",
    "Tier": "5",
    "Closer": "Leticia Silva",
    "Data reunião": "2026-07-15T09:15:00.000Z",
    "Virou oportunidade em": null
  },
  {
    "Nome": "Antony Mendes",
    "Telefone": "5548992113770",
    "Email": "antonymcypriano@gmail.com",
    "Empresa": "Marmita da Lita",
    "Segmento": "Marmitaria",
    "Tier": "3.1",
    "Closer": "Luiz Moura",
    "Data reunião": "2026-07-14T18:15:00.000Z",
    "Virou oportunidade em": "2026-07-14T16:44:18.533Z"
  },
  {
    "Nome": "Luan Oliveira",
    "Telefone": "5511946601342",
    "Email": "luanoliveiracontact@gmail.com",
    "Empresa": "Jaguar lanches",
    "Segmento": "Lanchonete",
    "Tier": "3.1",
    "Closer": "Miguel Nunes",
    "Data reunião": "2026-07-14T18:15:00.000Z",
    "Virou oportunidade em": "2026-07-14T18:58:18.225Z"
  },
  {
    "Nome": "Lívia Peixouto",
    "Telefone": "5575981040030",
    "Email": "atpsorveteria@gmail.com",
    "Empresa": "Real do Solar",
    "Segmento": "Outro",
    "Tier": "1",
    "Closer": "Leandro dos Santos",
    "Data reunião": "2026-07-14T18:00:00.000Z",
    "Virou oportunidade em": "2026-07-13T21:51:44.381Z"
  },
  {
    "Nome": "Paola Holanda Saraiva",
    "Telefone": "5511917946295",
    "Email": "paola.estetica06@gmail.com",
    "Empresa": "Make por 10",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Closer": "Cleber Rodrigues",
    "Data reunião": "2026-07-14T18:00:00.000Z",
    "Virou oportunidade em": "2026-07-14T18:34:01.511Z"
  },
  {
    "Nome": "Júlia",
    "Telefone": "5533984592406",
    "Email": "juliamarcos231119@gmail.com",
    "Empresa": "",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Closer": "Gustavo Duarte Pinheiro Silva",
    "Data reunião": "2026-07-14T18:00:00.000Z",
    "Virou oportunidade em": "2026-07-14T12:49:47.679Z"
  },
  {
    "Nome": "VINICIUS PEREIRA FRANCO",
    "Telefone": "5533991419000",
    "Email": "murtafrancodistribuidora@gmail.com",
    "Empresa": "Açaizinho_lourdes",
    "Segmento": "Outro",
    "Tier": "1",
    "Closer": "João Paulo Maciel",
    "Data reunião": "2026-07-14T17:45:00.000Z",
    "Virou oportunidade em": "2026-07-10T19:58:00.318Z"
  },
  {
    "Nome": "Laura ",
    "Telefone": "5581998379775",
    "Email": "laurasantana12234@gmail.com",
    "Empresa": "",
    "Segmento": "Lanchonete",
    "Tier": "1",
    "Closer": "Rebeca Cabral",
    "Data reunião": "2026-07-14T17:15:00.000Z",
    "Virou oportunidade em": "2026-07-13T21:36:24.617Z"
  },
  {
    "Nome": "",
    "Telefone": "5521969515194",
    "Email": "well.borges95@gmail.com",
    "Empresa": null,
    "Segmento": null,
    "Tier": null,
    "Closer": "João Paulo Maciel",
    "Data reunião": "2026-07-14T17:15:00.000Z",
    "Virou oportunidade em": "2026-07-13T21:38:49.406Z"
  },
  {
    "Nome": "Italo",
    "Telefone": "5511987212655",
    "Email": "Italluspizza@gmail.com",
    "Empresa": "Itallus pizzaria",
    "Segmento": "",
    "Tier": "1",
    "Closer": "João Paulo Maciel",
    "Data reunião": "2026-07-14T17:15:00.000Z",
    "Virou oportunidade em": "2026-07-14T21:46:34.060Z"
  },
  {
    "Nome": "Nicolas Benke",
    "Telefone": "5511989463773",
    "Email": "nicolas.benke@acad.pucrs.br",
    "Empresa": "Van Belge",
    "Segmento": "Confeitaria",
    "Tier": "1",
    "Closer": "Leandro dos Santos",
    "Data reunião": "2026-07-14T17:15:00.000Z",
    "Virou oportunidade em": "2026-07-13T20:18:12.644Z"
  },
  {
    "Nome": "gilmara costa",
    "Telefone": "5561983786621",
    "Email": "futorrito.contato@gmail.com",
    "Empresa": "",
    "Segmento": "Sushi",
    "Tier": "1",
    "Closer": "Luan Nicolas",
    "Data reunião": "2026-07-14T17:15:00.000Z",
    "Virou oportunidade em": "2026-07-13T21:31:16.206Z"
  },
  {
    "Nome": "Graziele",
    "Telefone": "5521998817643",
    "Email": "pensaodocoelhodelivery@gmail.com",
    "Empresa": "",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Closer": "Ranier Oliveira",
    "Data reunião": "2026-07-14T17:00:00.000Z",
    "Virou oportunidade em": "2026-07-13T14:45:07.090Z"
  },
  {
    "Nome": "Michelle ",
    "Telefone": "5511932128415",
    "Email": "mi.ruizparis@gmail.com",
    "Empresa": "",
    "Segmento": "Outro",
    "Tier": "4",
    "Closer": "Miguel Nunes",
    "Data reunião": "2026-07-14T17:00:00.000Z",
    "Virou oportunidade em": "2026-07-14T14:30:47.990Z"
  },
  {
    "Nome": "TIAGO MEDEIROS BRAGA",
    "Telefone": "5521964720112",
    "Email": "realezapizzariadevelivery@gmail.com",
    "Empresa": "realeza pizzaria",
    "Segmento": "Pizzaria",
    "Tier": "3.1",
    "Closer": "Letícia Wendy",
    "Data reunião": "2026-07-14T16:30:00.000Z",
    "Virou oportunidade em": "2026-07-14T18:40:14.744Z"
  },
  {
    "Nome": "Arthur",
    "Telefone": "5519971576985",
    "Email": "contao@cafecantodasaguas.com.br",
    "Empresa": "Café Canto das Águas",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Closer": "Cleber Rodrigues",
    "Data reunião": "2026-07-14T16:30:00.000Z",
    "Virou oportunidade em": "2026-07-14T16:44:31.625Z"
  },
  {
    "Nome": "RODRIGO CASASOLA",
    "Telefone": "5549988405007",
    "Email": "rodrigocasasola2020@gmail.com",
    "Empresa": "DELIVERY",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Closer": "Gustavo Duarte Pinheiro Silva",
    "Data reunião": "2026-07-14T16:30:00.000Z",
    "Virou oportunidade em": "2026-07-14T18:34:17.891Z"
  },
  {
    "Nome": "",
    "Telefone": "5511940747828",
    "Email": null,
    "Empresa": null,
    "Segmento": null,
    "Tier": null,
    "Closer": "João Paulo Maciel",
    "Data reunião": "2026-07-14T16:15:00.000Z",
    "Virou oportunidade em": "2026-07-13T19:18:36.723Z"
  },
  {
    "Nome": "Helen Duarte",
    "Telefone": "5548999936494",
    "Email": "hhelenduarte2019@gmail.com",
    "Empresa": "Duarte Doces",
    "Segmento": "Confeitaria",
    "Tier": "1",
    "Closer": "Rebeca Cabral",
    "Data reunião": "2026-07-14T16:15:00.000Z",
    "Virou oportunidade em": "2026-07-14T14:54:19.918Z"
  },
  {
    "Nome": "Letícia da Silva Santana",
    "Telefone": "5566996144452",
    "Email": "tocadaoncagn10@gmail.com",
    "Empresa": "Toca da Onça",
    "Segmento": "Hamburgueria",
    "Tier": "1",
    "Closer": "Leandro dos Santos",
    "Data reunião": "2026-07-14T16:15:00.000Z",
    "Virou oportunidade em": "2026-07-13T18:42:07.348Z"
  },
  {
    "Nome": "Isabella Vipieski",
    "Telefone": "5541995590663",
    "Email": "larachocolab@gmail.com",
    "Empresa": "Lara Chocolab",
    "Segmento": "Confeitaria",
    "Tier": "1",
    "Closer": "Leandro dos Santos",
    "Data reunião": "2026-07-14T16:15:00.000Z",
    "Virou oportunidade em": "2026-07-14T17:27:30.756Z"
  },
  {
    "Nome": "Rafael",
    "Telefone": "5521999612676",
    "Email": "rafaelmab21@gmail.com",
    "Empresa": "Granofino",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Closer": "Luiz Moura",
    "Data reunião": "2026-07-14T16:00:00.000Z",
    "Virou oportunidade em": "2026-07-14T16:40:29.517Z"
  },
  {
    "Nome": "Paulo",
    "Telefone": "5519981937776",
    "Email": "paulo_triby@hotmail.com",
    "Empresa": "Bellus Salgados",
    "Segmento": "Outro",
    "Tier": "1",
    "Closer": "João Paulo Maciel",
    "Data reunião": "2026-07-14T15:45:00.000Z",
    "Virou oportunidade em": "2026-07-14T12:56:14.083Z"
  },
  {
    "Nome": "Thaís Vilela",
    "Telefone": "5511933829144",
    "Email": "thatavilela84@gmail.com",
    "Empresa": "Panda Sabores",
    "Segmento": "Marmitaria",
    "Tier": "5",
    "Closer": "Letícia Wendy",
    "Data reunião": "2026-07-14T15:45:00.000Z",
    "Virou oportunidade em": null
  },
  {
    "Nome": "Sheila Araujo",
    "Telefone": "5527999711558",
    "Email": "sheypresentes@hotmail.com",
    "Empresa": "Shey Presentes",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Closer": "Gustavo Duarte Pinheiro Silva",
    "Data reunião": "2026-07-14T15:45:00.000Z",
    "Virou oportunidade em": "2026-07-13T13:24:05.543Z"
  },
  {
    "Nome": "Joao",
    "Telefone": "5575981888776",
    "Email": "joao.jonatan@gmail.com",
    "Empresa": "",
    "Segmento": "Pastelaria",
    "Tier": "3.2",
    "Closer": "Miguel Nunes",
    "Data reunião": "2026-07-14T15:15:00.000Z",
    "Virou oportunidade em": "2026-07-14T13:58:09.301Z"
  },
  {
    "Nome": "Mariana Estevão",
    "Telefone": "5547992695454",
    "Email": "pizzariadonbrothers@gmail.com",
    "Empresa": "Pizzaria Don Brothers",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Closer": "Rebeca Cabral",
    "Data reunião": "2026-07-14T14:30:00.000Z",
    "Virou oportunidade em": "2026-07-13T14:48:09.851Z"
  },
  {
    "Nome": "Samara Alves Santos",
    "Telefone": "5575983619634",
    "Email": "contatossamaraa@gmail.com",
    "Empresa": "Vixe Sabor",
    "Segmento": "Restaurante",
    "Tier": "4",
    "Closer": "Leandro dos Santos",
    "Data reunião": "2026-07-14T14:30:00.000Z",
    "Virou oportunidade em": "2026-07-13T18:55:44.426Z"
  },
  {
    "Nome": "Fernando Barbosa",
    "Telefone": "5531999538770",
    "Email": "acaiplanet9@gmail.com",
    "Empresa": "Açaí Planet Conexões",
    "Segmento": "Açaiteria",
    "Tier": "3.1",
    "Closer": "Miguel Nunes",
    "Data reunião": "2026-07-14T14:30:00.000Z",
    "Virou oportunidade em": "2026-07-14T17:29:50.552Z"
  },
  {
    "Nome": "Nicolas Barbosa de Lima",
    "Telefone": "5527995319020",
    "Email": "nicolaslima096@gmail.com",
    "Empresa": "Frangonico",
    "Segmento": "Outro",
    "Tier": "1",
    "Closer": "João Paulo Maciel",
    "Data reunião": "2026-07-14T14:30:00.000Z",
    "Virou oportunidade em": "2026-07-13T15:59:03.119Z"
  },
  {
    "Nome": "Katia",
    "Telefone": "5511941981722",
    "Email": "katiamorgan132@gmail.com",
    "Empresa": "Leve sabor",
    "Segmento": "Marmitaria",
    "Tier": "5",
    "Closer": "Miguel Nunes",
    "Data reunião": "2026-07-14T14:30:00.000Z",
    "Virou oportunidade em": "2026-07-13T15:02:27.863Z"
  },
  {
    "Nome": "LEONARDO SILVA RIBEIRO",
    "Telefone": "5521966913010",
    "Email": "leonardos.ribeiro51@gmail.com",
    "Empresa": "CABULOSO BURGER",
    "Segmento": "Lanchonete",
    "Tier": "3.1",
    "Closer": "Luiz Moura",
    "Data reunião": "2026-07-14T14:15:00.000Z",
    "Virou oportunidade em": "2026-07-13T21:26:34.716Z"
  },
  {
    "Nome": "Luck",
    "Telefone": "5583998635314",
    "Email": "pastelariadaedi@gmail.com",
    "Empresa": "Pastelaria da Edi",
    "Segmento": "Pastelaria",
    "Tier": "3.1",
    "Closer": "Gustavo Duarte Pinheiro Silva",
    "Data reunião": "2026-07-14T14:15:00.000Z",
    "Virou oportunidade em": "2026-07-13T22:00:21.753Z"
  },
  {
    "Nome": "Carlos Henrique Cunha",
    "Telefone": "5519999823932",
    "Email": "carlinhoscunha.1982@gmail.com",
    "Empresa": "Famiglia Souza",
    "Segmento": "Lanchonete",
    "Tier": "5",
    "Closer": "Ranier Oliveira",
    "Data reunião": "2026-07-14T14:15:00.000Z",
    "Virou oportunidade em": "2026-07-14T13:13:51.808Z"
  },
  {
    "Nome": "",
    "Telefone": "5511981167748",
    "Email": null,
    "Empresa": null,
    "Segmento": null,
    "Tier": null,
    "Closer": "João Paulo Maciel",
    "Data reunião": "2026-07-14T14:00:00.000Z",
    "Virou oportunidade em": "2026-07-13T19:11:47.188Z"
  },
  {
    "Nome": "João Vitor Leão",
    "Telefone": "5562982570113",
    "Email": "fiodeprata85@gmail.com",
    "Empresa": "Fio De Prata Espetaria",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Closer": "Luan Nicolas",
    "Data reunião": "2026-07-14T14:00:00.000Z",
    "Virou oportunidade em": "2026-07-14T14:43:03.537Z"
  },
  {
    "Nome": "Julio César",
    "Telefone": "5521984009163",
    "Email": "shalon.salgado2026@gmail.com",
    "Empresa": "Shalon Salgados",
    "Segmento": "Lanchonete",
    "Tier": "4",
    "Closer": "Taty Freitas",
    "Data reunião": "2026-07-14T13:30:00.000Z",
    "Virou oportunidade em": "2026-07-13T19:34:47.114Z"
  },
  {
    "Nome": "bar e espetinho do bahia",
    "Telefone": "5511940135972",
    "Email": "vsribeiro86@gmail.com",
    "Empresa": "Valdin santos Ribeiro",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Closer": "Luan Nicolas",
    "Data reunião": "2026-07-14T13:30:00.000Z",
    "Virou oportunidade em": "2026-07-13T19:36:14.296Z"
  },
  {
    "Nome": "Rickelms Alves De Oliveira",
    "Telefone": "5563984224466",
    "Email": "rickelmsalves319@gmail.com",
    "Empresa": "Bella vita pizzaria",
    "Segmento": "Pizzaria",
    "Tier": "3.1",
    "Closer": "Gustavo Duarte Pinheiro Silva",
    "Data reunião": "2026-07-14T13:30:00.000Z",
    "Virou oportunidade em": "2026-07-14T14:09:04.419Z"
  },
  {
    "Nome": "Wesley Tavares",
    "Telefone": "5588993644293",
    "Email": "wesleytavares162@gmail.com",
    "Empresa": "Vulcão Pizzaria",
    "Segmento": "Pizzaria",
    "Tier": "3.1",
    "Closer": "Leticia Silva",
    "Data reunião": "2026-07-14T13:30:00.000Z",
    "Virou oportunidade em": null
  },
  {
    "Nome": "joao victor costa aprigio",
    "Telefone": "5584991847907",
    "Email": "joaovictorgemadinho@gmail.com",
    "Empresa": "mare pizza",
    "Segmento": "Pizzaria",
    "Tier": "3.1",
    "Closer": "Ranier Oliveira",
    "Data reunião": "2026-07-14T13:30:00.000Z",
    "Virou oportunidade em": "2026-07-14T14:07:51.952Z"
  },
  {
    "Nome": "Joice Santos Bussade",
    "Telefone": "5522992900629",
    "Email": "jsbussade@gmail.com",
    "Empresa": "Donna di Crema",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Closer": "Taty Freitas",
    "Data reunião": "2026-07-14T12:45:00.000Z",
    "Virou oportunidade em": "2026-07-14T12:38:54.106Z"
  },
  {
    "Nome": "Emerson Queiroz Silva",
    "Telefone": "5543991191100",
    "Email": "21villadoce@gmail.com",
    "Empresa": "Villa Doce",
    "Segmento": "Confeitaria",
    "Tier": "1",
    "Closer": "Rebeca Cabral",
    "Data reunião": "2026-07-14T11:30:00.000Z",
    "Virou oportunidade em": "2026-07-14T14:03:17.146Z"
  },
  {
    "Nome": "Adriana Donato dos Anjos",
    "Telefone": "5515991495885",
    "Email": "adriana.donato.anjos@hotmail.com",
    "Empresa": "Pudim da Dri",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Closer": "Ranier Oliveira",
    "Data reunião": "2026-07-14T10:45:00.000Z",
    "Virou oportunidade em": "2026-07-14T12:25:30.840Z"
  },
  {
    "Nome": "MARCOS VINICIO CAMARGO DA SILVA",
    "Telefone": "5532984314496",
    "Email": "marcoscooparao@hotmail.com",
    "Empresa": "Pizzaria",
    "Segmento": "Pizzaria",
    "Tier": "4",
    "Closer": "Ranier Oliveira",
    "Data reunião": "2026-07-14T10:45:00.000Z",
    "Virou oportunidade em": "2026-07-13T14:58:23.224Z"
  },
  {
    "Nome": "Jaqueline ",
    "Telefone": "5531994703928",
    "Email": "jaquelinelilianbh@hotmail.com",
    "Empresa": "",
    "Segmento": "Lanchonete",
    "Tier": "5",
    "Closer": "Letícia Wendy",
    "Data reunião": "2026-07-14T10:30:00.000Z",
    "Virou oportunidade em": null
  },
  {
    "Nome": "Julia freitas",
    "Telefone": "5524999725919",
    "Email": "freitasacaiteria010708@gmail.com",
    "Empresa": "",
    "Segmento": "Açaiteria",
    "Tier": "2",
    "Closer": "João Paulo Maciel",
    "Data reunião": "2026-07-14T10:30:00.000Z",
    "Virou oportunidade em": "2026-07-10T20:44:25.916Z"
  },
  {
    "Nome": "Patrick Cassaneli",
    "Telefone": "5521991203652",
    "Email": "patrickcassaneli@gmail.com",
    "Empresa": "Sabor dos Sonhos",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Closer": "Taty Freitas",
    "Data reunião": "2026-07-14T10:15:00.000Z",
    "Virou oportunidade em": "2026-07-13T22:36:57.275Z"
  },
  {
    "Nome": "Mimo Doce ",
    "Telefone": "5591999666393",
    "Email": "silveiraisilveira21@gmail.com",
    "Empresa": "",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Closer": "Cleber Rodrigues",
    "Data reunião": "2026-07-14T10:00:00.000Z",
    "Virou oportunidade em": "2026-07-14T14:21:21.545Z"
  },
  {
    "Nome": "Nathalia Moraes",
    "Telefone": "5511965722755",
    "Email": "nathaliamoraes101010@gmail.com",
    "Empresa": "Nonna maria",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Closer": "Ranier Oliveira",
    "Data reunião": "2026-07-14T10:00:00.000Z",
    "Virou oportunidade em": "2026-07-14T13:07:52.183Z"
  },
  {
    "Nome": "Letícia Galvão",
    "Telefone": "5571991724186",
    "Email": "legalvao2504@gmail.com",
    "Empresa": "Crepefy",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Closer": "Gustavo Duarte Pinheiro Silva",
    "Data reunião": "2026-07-14T10:00:00.000Z",
    "Virou oportunidade em": "2026-07-13T16:38:37.335Z"
  },
  {
    "Nome": "Nathália Cristina Ferreira Ottani",
    "Telefone": "5519992770565",
    "Email": "nathycferreira@hotmail.com",
    "Empresa": "Nalo Doces",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Closer": "Cleber Rodrigues",
    "Data reunião": "2026-07-14T10:00:00.000Z",
    "Virou oportunidade em": "2026-07-13T19:07:37.060Z"
  },
  {
    "Nome": "Karina Matsue Aramaqui",
    "Telefone": "5511982832824",
    "Email": "contatocookieaholic@gmail.com",
    "Empresa": "Cookieaholic",
    "Segmento": "Confeitaria",
    "Tier": "1",
    "Closer": "Cleber Rodrigues",
    "Data reunião": "2026-07-14T10:00:00.000Z",
    "Virou oportunidade em": "2026-07-14T12:33:24.110Z"
  },
  {
    "Nome": "Allan Rocha",
    "Telefone": "5521992076505",
    "Email": "allanbrenorocha223@gmail.com",
    "Empresa": "",
    "Segmento": "Pizzaria",
    "Tier": "4",
    "Closer": "Cleber Rodrigues",
    "Data reunião": "2026-07-14T09:15:00.000Z",
    "Virou oportunidade em": "2026-07-13T19:57:06.673Z"
  },
  {
    "Nome": "Márcio",
    "Telefone": "5579999759956",
    "Email": "marciogoncalves@sementedovem.net.br",
    "Empresa": "",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Closer": "Rebeca Cabral",
    "Data reunião": "2026-07-14T09:15:00.000Z",
    "Virou oportunidade em": "2026-07-13T20:44:05.846Z"
  },
  {
    "Nome": "Ricardo",
    "Telefone": "5543996168696",
    "Email": "playfoodpark@gmail.com",
    "Empresa": "",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Closer": "Letícia Wendy",
    "Data reunião": "2026-07-14T09:15:00.000Z",
    "Virou oportunidade em": "2026-07-13T20:53:52.200Z"
  },
  {
    "Nome": "Roberta Barcelos",
    "Telefone": "5521995246941",
    "Email": "barsan_fabrica@hotmail.com",
    "Empresa": "Barsan Doces e Salgados",
    "Segmento": "Outro",
    "Tier": "5",
    "Closer": "Leticia Silva",
    "Data reunião": "2026-07-14T09:15:00.000Z",
    "Virou oportunidade em": null
  },
  {
    "Nome": "Elioenai Silva dos Santos",
    "Telefone": "5577981469075",
    "Email": "eli_oe_nai@hotmail.com",
    "Empresa": "Mesa Nobre Delivery",
    "Segmento": "Hamburgueria",
    "Tier": "3.1",
    "Closer": "Ranier Oliveira",
    "Data reunião": "2026-07-13T19:00:00.000Z",
    "Virou oportunidade em": "2026-07-13T19:59:26.864Z"
  },
  {
    "Nome": "Deyvid Martins",
    "Telefone": "5585984135922",
    "Email": "Deyvidmartins1@gmail.com",
    "Empresa": "",
    "Segmento": "",
    "Tier": "2",
    "Closer": "Ranier Oliveira",
    "Data reunião": "2026-07-13T18:30:00.000Z",
    "Virou oportunidade em": "2026-07-13T21:31:17.348Z"
  },
  {
    "Nome": "jefferson arruda",
    "Telefone": "5544991018735",
    "Email": "jeffersonmorass@hotmail.com",
    "Empresa": "arrudas pizza",
    "Segmento": "Pizzaria",
    "Tier": "3.1",
    "Closer": "Miguel Nunes",
    "Data reunião": "2026-07-13T18:15:00.000Z",
    "Virou oportunidade em": "2026-07-13T16:12:05.365Z"
  },
  {
    "Nome": "José Joalysonn Eustaquio Da Silva",
    "Telefone": "5511943614903",
    "Email": "joalysonn887kkj@gmail.com",
    "Empresa": "Bull Vendas",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Closer": "Leandro dos Santos",
    "Data reunião": "2026-07-13T18:15:00.000Z",
    "Virou oportunidade em": "2026-07-13T16:04:04.436Z"
  },
  {
    "Nome": "Vida Augusta da Silva",
    "Telefone": "5527998748390",
    "Email": "vidaaugusta.esr@gmail.com",
    "Empresa": "Dona Eva refeições",
    "Segmento": "Marmitaria",
    "Tier": "2",
    "Closer": "João Paulo Maciel",
    "Data reunião": "2026-07-13T18:15:00.000Z",
    "Virou oportunidade em": "2026-07-13T19:06:57.243Z"
  },
  {
    "Nome": "Nina Regina Alves Rodrigues",
    "Telefone": "5537998442495",
    "Email": "doceria.doceatelie05@gmail.com",
    "Empresa": "doce atelie",
    "Segmento": "Lanchonete",
    "Tier": "3.1",
    "Closer": "Gustavo Duarte Pinheiro Silva",
    "Data reunião": "2026-07-13T18:00:00.000Z",
    "Virou oportunidade em": "2026-07-13T18:08:37.267Z"
  },
  {
    "Nome": "Gustavo Jerfferson da Silva ",
    "Telefone": "5511969775104",
    "Email": "dogugadoces@gmail.com",
    "Empresa": "",
    "Segmento": "Confeitaria",
    "Tier": "4",
    "Closer": "Ranier Oliveira",
    "Data reunião": "2026-07-13T18:00:00.000Z",
    "Virou oportunidade em": "2026-07-13T17:41:21.848Z"
  },
  {
    "Nome": "Carlos Eduardo",
    "Telefone": "5515997326021",
    "Email": "cadusps1@gmail.com",
    "Empresa": "Taunt Cookies",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Closer": "Letícia Wendy",
    "Data reunião": "2026-07-13T18:00:00.000Z",
    "Virou oportunidade em": "2026-07-13T14:35:51.593Z"
  },
  {
    "Nome": "Priscila ferreira Falcao",
    "Telefone": "5513988557392",
    "Email": "theoffpriscila@gmail.com",
    "Empresa": "Priscila",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Closer": "Ranier Oliveira",
    "Data reunião": "2026-07-13T17:15:00.000Z",
    "Virou oportunidade em": "2026-07-13T13:31:48.018Z"
  },
  {
    "Nome": "Júlia Priess Niehues",
    "Telefone": "5547996657991",
    "Email": "juliapniehues@gmail.com",
    "Empresa": "Priess Cakes",
    "Segmento": "Confeitaria",
    "Tier": "1",
    "Closer": "Rebeca Cabral",
    "Data reunião": "2026-07-13T17:15:00.000Z",
    "Virou oportunidade em": "2026-07-13T18:30:55.612Z"
  },
  {
    "Nome": "Katherine Solorzano",
    "Telefone": "5595991113139",
    "Email": "misterpepitosupervisores@gmail.com",
    "Empresa": null,
    "Segmento": "Lanchonete",
    "Tier": null,
    "Closer": "Leticia Silva",
    "Data reunião": "2026-07-13T17:15:00.000Z",
    "Virou oportunidade em": null
  },
  {
    "Nome": "Matheus ",
    "Telefone": "5581995325636",
    "Email": "lopesmatheus954@gmail.com",
    "Empresa": "",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Closer": "Letícia Wendy",
    "Data reunião": "2026-07-13T16:30:00.000Z",
    "Virou oportunidade em": "2026-07-13T18:34:25.959Z"
  },
  {
    "Nome": "Rubia Setti",
    "Telefone": "5554992055341",
    "Email": "rubiasetti2@gmail.com",
    "Empresa": "Heróis do Sabor Pizzaria",
    "Segmento": "Pizzaria",
    "Tier": "2",
    "Closer": "João Paulo Maciel",
    "Data reunião": "2026-07-13T16:15:00.000Z",
    "Virou oportunidade em": "2026-07-13T17:53:19.802Z"
  },
  {
    "Nome": "",
    "Telefone": "5511965672012",
    "Email": "glauconot@gmail.com",
    "Empresa": null,
    "Segmento": null,
    "Tier": null,
    "Closer": "Luan Nicolas",
    "Data reunião": "2026-07-13T16:15:00.000Z",
    "Virou oportunidade em": "2026-07-13T17:08:00.749Z"
  },
  {
    "Nome": "Carla Marina",
    "Telefone": "5524993955729",
    "Email": "yeastbakery.yb@gmail.com",
    "Empresa": "Yeast Bakery",
    "Segmento": "Confeitaria",
    "Tier": "1",
    "Closer": "Leandro dos Santos",
    "Data reunião": "2026-07-13T16:15:00.000Z",
    "Virou oportunidade em": "2026-07-13T17:55:49.380Z"
  },
  {
    "Nome": "Daniele Corrêa",
    "Telefone": "5521992717776",
    "Email": "criaaeweb@gmail.com",
    "Empresa": "Cria Aê",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Closer": "Leandro dos Santos",
    "Data reunião": "2026-07-13T16:15:00.000Z",
    "Virou oportunidade em": "2026-07-13T18:03:42.452Z"
  },
  {
    "Nome": "Monica costa",
    "Telefone": "5563993054039",
    "Email": "monicap.27costa@gmail.com",
    "Empresa": "Marmitaria da nina",
    "Segmento": "Restaurante",
    "Tier": "4",
    "Closer": "Letícia Wendy",
    "Data reunião": "2026-07-13T15:45:00.000Z",
    "Virou oportunidade em": "2026-07-13T18:22:32.716Z"
  },
  {
    "Nome": "wagner ramom",
    "Telefone": "5581993267979",
    "Email": "wagnerramonr@gmail.com",
    "Empresa": "ZINA BURGUER",
    "Segmento": "Hamburgueria",
    "Tier": "4",
    "Closer": "Luiz Moura",
    "Data reunião": "2026-07-13T15:45:00.000Z",
    "Virou oportunidade em": "2026-07-13T16:30:09.486Z"
  },
  {
    "Nome": "Gabriela",
    "Telefone": "5513978209760",
    "Email": "batate.recheada@gmail.com",
    "Empresa": "Batate",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Closer": "Ranier Oliveira",
    "Data reunião": "2026-07-13T15:45:00.000Z",
    "Virou oportunidade em": "2026-07-13T12:27:05.284Z"
  },
  {
    "Nome": "Leonardo Guedes",
    "Telefone": "5551997799309",
    "Email": "leoguedes95@gmail.com",
    "Empresa": "Alternativas burger",
    "Segmento": "Hamburgueria",
    "Tier": "1",
    "Closer": "Rebeca Cabral",
    "Data reunião": "2026-07-13T15:45:00.000Z",
    "Virou oportunidade em": "2026-07-13T17:27:10.165Z"
  },
  {
    "Nome": "danilo alves",
    "Telefone": "5517981151914",
    "Email": "danilosep2@gmail.com",
    "Empresa": "slechi sorvetes e açai",
    "Segmento": "Açaiteria",
    "Tier": "1",
    "Closer": "João Paulo Maciel",
    "Data reunião": "2026-07-13T15:45:00.000Z",
    "Virou oportunidade em": "2026-07-13T19:08:09.137Z"
  },
  {
    "Nome": "Vitor Costa ",
    "Telefone": "5511968330061",
    "Email": "vitorcos2034@outlook.com",
    "Empresa": "Adsvitorcosta ",
    "Segmento": "Outro",
    "Tier": "4",
    "Closer": "MARILIA DA SILVA ARAUJO",
    "Data reunião": "2026-07-13T14:45:00.000Z",
    "Virou oportunidade em": "2026-07-10T15:00:15.723Z"
  },
  {
    "Nome": "Andre Mota",
    "Telefone": "5521995037990",
    "Email": "picogastronomia@gmail.com",
    "Empresa": "",
    "Segmento": "Lanchonete",
    "Tier": "3.1",
    "Closer": "Luiz Moura",
    "Data reunião": "2026-07-13T14:30:00.000Z",
    "Virou oportunidade em": "2026-07-13T15:02:54.284Z"
  },
  {
    "Nome": "Giovana",
    "Telefone": "5513991493233",
    "Email": "pizzariaterranostra26@gmail.com",
    "Empresa": "Terra Nostra Pizzaria",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Closer": "Luan Nicolas",
    "Data reunião": "2026-07-13T14:30:00.000Z",
    "Virou oportunidade em": "2026-07-12T16:02:19.280Z"
  },
  {
    "Nome": "Jueli Gomes De Lima",
    "Telefone": "5515996133642",
    "Email": "tete_amoitaoca@hotmail.com",
    "Empresa": "Esfihas & Cia",
    "Segmento": "Restaurante",
    "Tier": "2",
    "Closer": "Leandro dos Santos",
    "Data reunião": "2026-07-13T14:30:00.000Z",
    "Virou oportunidade em": "2026-07-09T22:36:07.555Z"
  },
  {
    "Nome": "Fernando Flauzino",
    "Telefone": "5512988895625",
    "Email": "fernandofeliciano5@gmail.com",
    "Empresa": "Cutelo Atelier",
    "Segmento": "Marmitaria",
    "Tier": "3.1",
    "Closer": "Gustavo Duarte Pinheiro Silva",
    "Data reunião": "2026-07-13T14:15:00.000Z",
    "Virou oportunidade em": "2026-07-10T17:09:48.775Z"
  },
  {
    "Nome": "CHARLES MÜLLER",
    "Telefone": "5522992577561",
    "Email": "charles20miiller@gmail.com",
    "Empresa": "Churrasco",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Closer": "Taty Freitas",
    "Data reunião": "2026-07-13T14:15:00.000Z",
    "Virou oportunidade em": "2026-07-10T14:53:11.087Z"
  },
  {
    "Nome": "MARILTON CONCEICAO DE SOUSA JUNIOR",
    "Telefone": "5575988358413",
    "Email": "marilton.jr@gmail.com",
    "Empresa": "Disk larica",
    "Segmento": "Hamburgueria",
    "Tier": "1",
    "Closer": "Luan Nicolas",
    "Data reunião": "2026-07-13T14:00:00.000Z",
    "Virou oportunidade em": "2026-07-13T12:32:58.581Z"
  },
  {
    "Nome": "Mércia de Lima Queiroz",
    "Telefone": "5531982705999",
    "Email": "merciadelima@yahoo.com.br",
    "Empresa": "MMC cestas e flores",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Closer": "Ranier Oliveira",
    "Data reunião": "2026-07-13T13:30:00.000Z",
    "Virou oportunidade em": "2026-07-09T19:02:56.293Z"
  },
  {
    "Nome": "Eric William",
    "Telefone": "5511997171160",
    "Email": "pizzariaebuffetsantafe@outlook.com",
    "Empresa": "Santa Fe",
    "Segmento": "Pizzaria",
    "Tier": "4",
    "Closer": "Letícia Wendy",
    "Data reunião": "2026-07-13T13:30:00.000Z",
    "Virou oportunidade em": null
  },
  {
    "Nome": "Helen Cristiane",
    "Telefone": "5568992214756",
    "Email": "helengauna78@gmail.com",
    "Empresa": "Frango Dourado",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Closer": "Luiz Moura",
    "Data reunião": "2026-07-13T10:45:00.000Z",
    "Virou oportunidade em": null
  },
  {
    "Nome": "Priscila Salviano",
    "Telefone": "5547999123775",
    "Email": "priscilarpsaviano@gmail.com",
    "Empresa": "Sampa Burguer",
    "Segmento": "Hamburgueria",
    "Tier": "5",
    "Closer": "Leticia Silva",
    "Data reunião": "2026-07-13T10:45:00.000Z",
    "Virou oportunidade em": null
  },
  {
    "Nome": "Danilo João Medrado Lobo",
    "Telefone": "5564992219381",
    "Email": "danilojoaomedrado@gmail.com",
    "Empresa": "Rei das Vitaminas",
    "Segmento": "Lanchonete",
    "Tier": "1",
    "Closer": "Rebeca Cabral",
    "Data reunião": "2026-07-13T10:30:00.000Z",
    "Virou oportunidade em": "2026-07-09T13:49:39.077Z"
  },
  {
    "Nome": "Michael Iplinsky Lima",
    "Telefone": "5561994655910",
    "Email": "iplinsky@hotmail.com",
    "Empresa": "The empada",
    "Segmento": "Lanchonete",
    "Tier": "2",
    "Closer": "Leandro dos Santos",
    "Data reunião": "2026-07-10T18:15:00.000Z",
    "Virou oportunidade em": "2026-07-10T13:11:35.030Z"
  },
  {
    "Nome": "Vera Lucia Leandro de Melo",
    "Telefone": "5511981177340",
    "Email": "adm.veramelo@gmail.com",
    "Empresa": "Vera Melo Cakes",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Closer": "Ranier Oliveira",
    "Data reunião": "2026-07-10T18:15:00.000Z",
    "Virou oportunidade em": "2026-07-10T20:37:26.286Z"
  },
  {
    "Nome": "Geovana",
    "Telefone": "5545998005256",
    "Email": "geovanaliran@gmail.com",
    "Empresa": "Gelato Giorno",
    "Segmento": "Confeitaria",
    "Tier": "2",
    "Closer": "Luiz Moura",
    "Data reunião": "2026-07-10T18:00:00.000Z",
    "Virou oportunidade em": "2026-07-09T22:03:29.089Z"
  },
  {
    "Nome": "Tálita Mara",
    "Telefone": "5564981220371",
    "Email": "talitamara20000@gmail.com",
    "Empresa": "Na brasa assados",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Closer": "Cleber Rodrigues",
    "Data reunião": "2026-07-10T18:00:00.000Z",
    "Virou oportunidade em": "2026-07-10T19:24:22.326Z"
  },
  {
    "Nome": "Sâmyla",
    "Telefone": "5577991416470",
    "Email": "mylafernandes52@gmail.com",
    "Empresa": "Quintal Gourmet",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Closer": "Luan Nicolas",
    "Data reunião": "2026-07-10T17:45:00.000Z",
    "Virou oportunidade em": "2026-07-10T18:06:24.151Z"
  },
  {
    "Nome": "Gislaine ",
    "Telefone": "5584996711566",
    "Email": "gislainnerdg@gmail.com",
    "Empresa": "Oxente Restaurante & Petiscaria",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Closer": "Gustavo Duarte Pinheiro Silva",
    "Data reunião": "2026-07-10T17:15:00.000Z",
    "Virou oportunidade em": "2026-07-09T18:23:54.672Z"
  },
  {
    "Nome": "Jaqueline Barbaglia",
    "Telefone": "5516994039199",
    "Email": "jaqueline.barbaglia@gmail.com",
    "Empresa": "Restaurante Sabor Caseiro",
    "Segmento": "Restaurante",
    "Tier": "2",
    "Closer": "João Paulo Maciel",
    "Data reunião": "2026-07-10T17:15:00.000Z",
    "Virou oportunidade em": "2026-07-10T19:08:17.935Z"
  },
  {
    "Nome": "Weber Gonçalves de Souza",
    "Telefone": "553598646735",
    "Email": "webergoncalvesdesouza@gmail.com",
    "Empresa": "mc Reynad lanche",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Closer": "Cleber Rodrigues",
    "Data reunião": "2026-07-10T17:15:00.000Z",
    "Virou oportunidade em": "2026-07-09T21:03:27.457Z"
  },
  {
    "Nome": "Wallace Melo",
    "Telefone": "5511977161011",
    "Email": "wallace@revgrow.group",
    "Empresa": "",
    "Segmento": "",
    "Tier": "2",
    "Closer": "Luan Nicolas",
    "Data reunião": "2026-07-10T17:15:00.000Z",
    "Virou oportunidade em": "2026-07-10T19:43:28.496Z"
  },
  {
    "Nome": "Edvam de Jesus Silva Filho",
    "Telefone": "5511961438429",
    "Email": "Majinburgerloja1@gmail.com",
    "Empresa": "Majin Burger",
    "Segmento": "Hamburgueria",
    "Tier": "3.1",
    "Closer": "Letícia Wendy",
    "Data reunião": "2026-07-10T16:30:00.000Z",
    "Virou oportunidade em": "2026-07-10T19:16:16.927Z"
  },
  {
    "Nome": "Railton Cardoso do santos",
    "Telefone": "5589994391187",
    "Email": "railtonsantos450@gmail.com",
    "Empresa": "Recanto do sabor",
    "Segmento": "Pastelaria",
    "Tier": "1",
    "Closer": "Rebeca Cabral",
    "Data reunião": "2026-07-10T15:45:00.000Z",
    "Virou oportunidade em": "2026-07-10T10:31:23.963Z"
  },
  {
    "Nome": "Lima Rodrigues Amarildo",
    "Telefone": "5511976071005",
    "Email": "amarildolima911@gmail.com",
    "Empresa": "Chapa quente",
    "Segmento": "Hamburgueria",
    "Tier": "5",
    "Closer": "Miguel Nunes",
    "Data reunião": "2026-07-10T15:45:00.000Z",
    "Virou oportunidade em": "2026-07-10T18:17:25.109Z"
  },
  {
    "Nome": "Gabriel Albani",
    "Telefone": "5521996582393",
    "Email": "jap40sg@gmail.com",
    "Empresa": "Jap40 delivery",
    "Segmento": "",
    "Tier": "1",
    "Closer": "Luan Nicolas",
    "Data reunião": "2026-07-10T15:45:00.000Z",
    "Virou oportunidade em": "2026-07-09T21:21:12.941Z"
  },
  {
    "Nome": "{{full_name}}",
    "Telefone": "5521975462134",
    "Email": "Walterbatsoujr@gmail.com",
    "Empresa": "",
    "Segmento": "",
    "Tier": "2",
    "Closer": "Leandro dos Santos",
    "Data reunião": "2026-07-10T15:45:00.000Z",
    "Virou oportunidade em": "2026-07-09T17:22:56.770Z"
  },
  {
    "Nome": "Caroline",
    "Telefone": "5531973074372",
    "Email": "carolbmarques@hotmail.com",
    "Empresa": "Restaurante Gostinho Caseiro",
    "Segmento": "Restaurante",
    "Tier": "4",
    "Closer": "Luiz Moura",
    "Data reunião": "2026-07-10T15:00:00.000Z",
    "Virou oportunidade em": null
  },
  {
    "Nome": "rodrigo pinheiro",
    "Telefone": "5582998253764",
    "Email": "eu.rodrigopinheirof@gmail.com",
    "Empresa": "",
    "Segmento": "Outro",
    "Tier": "1",
    "Closer": "Luan Nicolas",
    "Data reunião": "2026-07-10T14:30:00.000Z",
    "Virou oportunidade em": "2026-07-09T18:17:42.314Z"
  },
  {
    "Nome": "CLEBER De Araujo",
    "Telefone": "5538984100109",
    "Email": "lanchonete@gmail.com",
    "Empresa": "MAROFA",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Closer": "Gustavo Duarte Pinheiro Silva",
    "Data reunião": "2026-07-10T14:15:00.000Z",
    "Virou oportunidade em": "2026-07-10T15:55:22.125Z"
  },
  {
    "Nome": "Mariana Gabriela Antonacci Cruz",
    "Telefone": "5534991999812",
    "Email": "shekinah.lanches.2025@gmail.com",
    "Empresa": "Shekinah Lanches",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Closer": "Luiz Moura",
    "Data reunião": "2026-07-10T14:15:00.000Z",
    "Virou oportunidade em": "2026-07-09T18:32:57.191Z"
  },
  {
    "Nome": "Denisse Torrico Bazan",
    "Telefone": "5522998065511",
    "Email": "denisse_3111@hotmail.com",
    "Empresa": "Sweet Cake confeitaria",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Closer": "Letícia Wendy",
    "Data reunião": "2026-07-10T10:45:00.000Z",
    "Virou oportunidade em": "2026-07-10T13:06:14.931Z"
  },
  {
    "Nome": "Marlon do nascimento barboza",
    "Telefone": "5521974464704",
    "Email": "marlondonascimentobarbosa18@gmail.com",
    "Empresa": "Yas doces",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Closer": "Cleber Rodrigues",
    "Data reunião": "2026-07-10T10:45:00.000Z",
    "Virou oportunidade em": "2026-07-09T17:51:37.899Z"
  },
  {
    "Nome": "Roberto Mazoli",
    "Telefone": "5521988470800",
    "Email": "betinho@calmon.net.br",
    "Empresa": "Mazoli meier",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Closer": "Luan Nicolas",
    "Data reunião": "2026-07-10T10:30:00.000Z",
    "Virou oportunidade em": "2026-07-10T12:31:12.910Z"
  },
  {
    "Nome": "Valdez",
    "Telefone": "5534988472336",
    "Email": "dombaconura@gmail.com",
    "Empresa": "Dom Bacon",
    "Segmento": "Hamburgueria",
    "Tier": "1",
    "Closer": "Leandro dos Santos",
    "Data reunião": "2026-07-10T10:00:00.000Z",
    "Virou oportunidade em": "2026-07-09T17:17:01.837Z"
  },
  {
    "Nome": "Bruno Leno leal",
    "Telefone": "5531975227539",
    "Email": "bruninholeno794@gmail.com",
    "Empresa": "Big Boss Burguer lanches",
    "Segmento": "Hamburgueria",
    "Tier": "1",
    "Closer": "Guilherme Gomes",
    "Data reunião": "2026-07-10T10:00:00.000Z",
    "Virou oportunidade em": "2026-07-10T01:57:02.323Z"
  },
  {
    "Nome": "Daniel Mendonça Valim",
    "Telefone": "5516982028044",
    "Email": "danielvalim0411@gmail.com",
    "Empresa": "TENDA",
    "Segmento": "Outro",
    "Tier": "1",
    "Closer": "Rebeca Cabral",
    "Data reunião": "2026-07-10T09:30:00.000Z",
    "Virou oportunidade em": "2026-07-09T15:15:17.983Z"
  },
  {
    "Nome": "DAVI VIANA FERRI",
    "Telefone": "5532988274255",
    "Email": "daviferri9@gmail.com",
    "Empresa": "LV SERVICOS E SOLUCOES DIGITAIS LTDA",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Closer": "Layza Batista",
    "Data reunião": "2026-07-10T09:30:00.000Z",
    "Virou oportunidade em": "2026-07-09T18:15:02.207Z"
  },
  {
    "Nome": "Vitor Vinicius",
    "Telefone": "5571988991519",
    "Email": "biguar13@gmail.com",
    "Empresa": "Point do Biguar",
    "Segmento": "Pastelaria",
    "Tier": "5",
    "Closer": "Luiz Moura",
    "Data reunião": "2026-07-10T09:15:00.000Z",
    "Virou oportunidade em": "2026-07-09T13:15:31.441Z"
  },
  {
    "Nome": "Hedilaine Feitosa",
    "Telefone": "5519988205828",
    "Email": "hedifeitosa1@gmail.com",
    "Empresa": "Neo poke",
    "Segmento": "Sushi",
    "Tier": "3.1",
    "Closer": "Ranier Oliveira",
    "Data reunião": "2026-07-10T09:15:00.000Z",
    "Virou oportunidade em": "2026-07-09T13:08:16.260Z"
  },
  {
    "Nome": "Gabriel Amorim",
    "Telefone": "5571992983138",
    "Email": "reidocombossa@gmail.com",
    "Empresa": "Rei do Combo Hamburgueria",
    "Segmento": "Hamburgueria",
    "Tier": "3.1",
    "Closer": "Cleber Rodrigues",
    "Data reunião": "2026-07-10T09:15:00.000Z",
    "Virou oportunidade em": "2026-07-09T16:19:41.642Z"
  },
  {
    "Nome": "Livia Marina",
    "Telefone": "5531989261749",
    "Email": "marinalivia359@gmail.com",
    "Empresa": "Doce",
    "Segmento": "Confeitaria",
    "Tier": "1",
    "Closer": "Guilherme Gomes",
    "Data reunião": "2026-07-09T18:15:00.000Z",
    "Virou oportunidade em": "2026-07-09T20:39:45.503Z"
  },
  {
    "Nome": "Sidiney",
    "Telefone": "5538998646959",
    "Email": "sidineymatosdasilva@gmail.com",
    "Empresa": "Samuca lanches",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Closer": "Luiz Moura",
    "Data reunião": "2026-07-09T18:00:00.000Z",
    "Virou oportunidade em": "2026-07-09T20:24:10.069Z"
  },
  {
    "Nome": "Nathalia Pimenta",
    "Telefone": "5527996164628",
    "Email": "mercearianopote@gmail.com",
    "Empresa": "Mercearia no pote",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Closer": "Rebeca Cabral",
    "Data reunião": "2026-07-09T17:45:00.000Z",
    "Virou oportunidade em": "2026-07-09T16:48:53.780Z"
  },
  {
    "Nome": "Acarajé da Neide | Cidade Baixa",
    "Telefone": "5571994078181",
    "Email": "acarajedaneide97@gmail.com",
    "Empresa": "Acaraje da neide",
    "Segmento": "Outro",
    "Tier": "2",
    "Closer": "Guilherme Gomes",
    "Data reunião": "2026-07-09T17:45:00.000Z",
    "Virou oportunidade em": "2026-07-09T20:25:21.579Z"
  },
  {
    "Nome": "Vitória",
    "Telefone": "5581995410817",
    "Email": "vitoriareginadelimamelo@gmail.com",
    "Empresa": "Açaí do Vale",
    "Segmento": "Açaiteria",
    "Tier": "5",
    "Closer": "Ranier Oliveira",
    "Data reunião": "2026-07-09T17:30:00.000Z",
    "Virou oportunidade em": "2026-07-09T20:35:45.082Z"
  },
  {
    "Nome": "Luana",
    "Telefone": "5584996772123",
    "Email": "luanajhenni@gmail.com",
    "Empresa": "Da Lú confeitaria",
    "Segmento": "Lanchonete",
    "Tier": "3.1",
    "Closer": "Cleber Rodrigues",
    "Data reunião": "2026-07-09T17:15:00.000Z",
    "Virou oportunidade em": "2026-07-09T19:50:10.571Z"
  },
  {
    "Nome": "Juliana Cinara Rodrigues",
    "Telefone": "5511993049466",
    "Email": "juliepop.co@gmail.com",
    "Empresa": "Julie Cookies | Julie Pop",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Closer": "Gustavo Duarte Pinheiro Silva",
    "Data reunião": "2026-07-09T17:15:00.000Z",
    "Virou oportunidade em": "2026-07-09T17:50:00.756Z"
  },
  {
    "Nome": "Marcos Piccioli",
    "Telefone": "5563992945852",
    "Email": "deck.burgeer@outlook.com",
    "Empresa": "Deck Burguer",
    "Segmento": "Hamburgueria",
    "Tier": "2",
    "Closer": "João Paulo Maciel",
    "Data reunião": "2026-07-09T17:15:00.000Z",
    "Virou oportunidade em": "2026-07-09T17:39:21.639Z"
  },
  {
    "Nome": "Kaio Alison",
    "Telefone": "5588999145306",
    "Email": "kaioalisonrs@gmail.com",
    "Empresa": "Hyrai sushi",
    "Segmento": "Sushi",
    "Tier": "1",
    "Closer": "Leandro dos Santos",
    "Data reunião": "2026-07-09T17:15:00.000Z",
    "Virou oportunidade em": "2026-07-09T14:04:07.322Z"
  },
  {
    "Nome": "Hudson Back",
    "Telefone": "5561996353642",
    "Email": "hudsonback1@hotmail.com",
    "Empresa": "",
    "Segmento": "Pizzaria",
    "Tier": "4",
    "Closer": "Letícia Wendy",
    "Data reunião": "2026-07-09T16:30:00.000Z",
    "Virou oportunidade em": null
  },
  {
    "Nome": "Paulo Henrique Ferreira Dias",
    "Telefone": "5521967319273",
    "Email": "juizdeforaoeste@pastaway.com.br",
    "Empresa": "Pastaway",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Closer": "Rebeca Cabral",
    "Data reunião": "2026-07-09T16:15:00.000Z",
    "Virou oportunidade em": "2026-07-09T16:33:03.106Z"
  },
  {
    "Nome": "Danilo Raffo",
    "Telefone": "5541999411000",
    "Email": "daniloraffo1702@gmail.com",
    "Empresa": "Prato Nobre",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Closer": "Luan Nicolas",
    "Data reunião": "2026-07-09T16:15:00.000Z",
    "Virou oportunidade em": "2026-07-09T15:12:40.859Z"
  },
  {
    "Nome": "Vitor Silva",
    "Telefone": "5585988967623",
    "Email": "vittorsillva1804@gmail.com",
    "Empresa": "Comerciais online",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Closer": "Layza Batista",
    "Data reunião": "2026-07-09T16:00:00.000Z",
    "Virou oportunidade em": "2026-07-09T16:38:58.649Z"
  },
  {
    "Nome": "Rarielson Castro",
    "Telefone": "5571991700315",
    "Email": "rarielsoncastro@gmail.com",
    "Empresa": "Ramaiana Chagas Confeitaria",
    "Segmento": "Confeitaria",
    "Tier": "2",
    "Closer": "Luan Nicolas",
    "Data reunião": "2026-07-09T15:45:00.000Z",
    "Virou oportunidade em": "2026-07-08T20:15:12.903Z"
  },
  {
    "Nome": "Karen Hartfeil",
    "Telefone": "5551996189318",
    "Email": "karenlauroscomercial@gmail.com",
    "Empresa": "Zokai",
    "Segmento": "Sushi",
    "Tier": "3.1",
    "Closer": "Cleber Rodrigues",
    "Data reunião": "2026-07-09T15:45:00.000Z",
    "Virou oportunidade em": "2026-07-09T14:15:52.869Z"
  },
  {
    "Nome": "Ester Sousa",
    "Telefone": "5521965221151",
    "Email": "estersousa1662@gmail.com",
    "Empresa": "Ester Sousa Confeitaria",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Closer": "Luiz Moura",
    "Data reunião": "2026-07-09T15:45:00.000Z",
    "Virou oportunidade em": "2026-07-09T17:15:52.972Z"
  },
  {
    "Nome": "Gabrielle",
    "Telefone": "5531987441859",
    "Email": "gabsousa2004@gmail.com",
    "Empresa": "",
    "Segmento": "Outro",
    "Tier": "4",
    "Closer": "Ranier Oliveira",
    "Data reunião": "2026-07-09T15:45:00.000Z",
    "Virou oportunidade em": "2026-07-09T15:10:55.591Z"
  },
  {
    "Nome": "Carla Andrade",
    "Telefone": "5521987780494",
    "Email": "dalmuschurrascaria@gmail.com",
    "Empresa": "Dalmus churrascaria",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Closer": "Guilherme Gomes",
    "Data reunião": "2026-07-09T14:30:00.000Z",
    "Virou oportunidade em": "2026-07-09T10:58:14.781Z"
  },
  {
    "Nome": "Jefferson Sebastião de Oliveira",
    "Telefone": "5584998687966",
    "Email": "jeffinhotkd852@gmail.com",
    "Empresa": "Esquinão do açai",
    "Segmento": "Açaiteria",
    "Tier": "3.1",
    "Closer": "Luiz Moura",
    "Data reunião": "2026-07-09T14:15:00.000Z",
    "Virou oportunidade em": "2026-07-09T17:04:27.373Z"
  },
  {
    "Nome": "Tiago",
    "Telefone": "5519988527828",
    "Email": "tsfsousa.sousa@gmail.com",
    "Empresa": "LONDON BURGUER",
    "Segmento": "Lanchonete",
    "Tier": "5",
    "Closer": "Ranier Oliveira",
    "Data reunião": "2026-07-09T11:00:00.000Z",
    "Virou oportunidade em": null
  },
  {
    "Nome": "Guilherme Medeiros",
    "Telefone": "5567992617003",
    "Email": "guilhermemilmed28@gmail.com",
    "Empresa": "Cookies do Gui",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Closer": "Cleber Rodrigues",
    "Data reunião": "2026-07-09T10:45:00.000Z",
    "Virou oportunidade em": "2026-07-08T20:43:19.222Z"
  },
  {
    "Nome": "Isabella reis",
    "Telefone": "5511954535501",
    "Email": "dejaisa1802@outlook.com",
    "Empresa": "Bella Reis doces artesanais",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Closer": "Letícia Wendy",
    "Data reunião": "2026-07-09T10:45:00.000Z",
    "Virou oportunidade em": "2026-07-09T13:55:19.384Z"
  },
  {
    "Nome": "Nayara Jennifer",
    "Telefone": "5531994908056",
    "Email": "nayarajennifermf@gmail.com",
    "Empresa": "Sofitê Doceria Artesanal",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Closer": "Luiz Moura",
    "Data reunião": "2026-07-09T10:45:00.000Z",
    "Virou oportunidade em": "2026-07-09T12:51:33.870Z"
  },
  {
    "Nome": "HELDER JAIRO",
    "Telefone": "5571991021677",
    "Email": "deposito321vai@gmail.com",
    "Empresa": "3,2,1 VAI",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Closer": "João Paulo Maciel",
    "Data reunião": "2026-07-09T10:30:00.000Z",
    "Virou oportunidade em": "2026-07-08T21:37:28.059Z"
  },
  {
    "Nome": "Nattalia",
    "Telefone": "5551994733131",
    "Email": "nattaliabrair@hotmail.com",
    "Empresa": "Toscana galeteria",
    "Segmento": "Outro",
    "Tier": "1",
    "Closer": "Luan Nicolas",
    "Data reunião": "2026-07-09T10:00:00.000Z",
    "Virou oportunidade em": "2026-07-09T13:07:56.395Z"
  },
  {
    "Nome": "Matheus Barreto",
    "Telefone": "5544997622640",
    "Email": "maitheusbr@gmail.com",
    "Empresa": "Tenho empresa de marketing e vendas para food (tenho mais de 30 clientes)",
    "Segmento": "Outro",
    "Tier": "1",
    "Closer": "João Paulo Maciel",
    "Data reunião": "2026-07-09T10:00:00.000Z",
    "Virou oportunidade em": "2026-07-09T12:49:28.672Z"
  },
  {
    "Nome": "Dayane araujo Fernandes",
    "Telefone": "5594992579228",
    "Email": "dayaraujofernandes@gmail.com",
    "Empresa": "Açaí ponto 6",
    "Segmento": "Açaiteria",
    "Tier": "5",
    "Closer": "Leticia Silva",
    "Data reunião": "2026-07-09T10:00:00.000Z",
    "Virou oportunidade em": null
  },
  {
    "Nome": "JAIR GUIMARAES HILGUERA",
    "Telefone": "5524999149648",
    "Email": "bardogauchoanobom@gmail.com",
    "Empresa": "Bar do gaúcho do ano bom",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Closer": "Cleber Rodrigues",
    "Data reunião": "2026-07-09T10:00:00.000Z",
    "Virou oportunidade em": "2026-07-08T20:04:15.841Z"
  },
  {
    "Nome": "Katiussia mariano teixeira",
    "Telefone": "5532998561626",
    "Email": "penelopefranca54@gmail.com",
    "Empresa": null,
    "Segmento": "Marmitaria",
    "Tier": "Tier 3.1",
    "Closer": "Ranier Oliveira",
    "Data reunião": "2026-07-09T09:15:00.000Z",
    "Virou oportunidade em": "2026-07-08T22:13:09.132Z"
  }
]


Perdidos na Meetime (nunca tiveram reunião):


SELECT pe.name AS "Nome", pe.telephone AS "Telefone", pe.email AS "Email",
       d.segment AS "Segmento", d.tier AS "Tier",
       d.lost_at AS "Data perda", d.loss_reason AS "Motivo"
FROM commercial_deals d
JOIN persons pe ON pe.id = d.person_id
WHERE d.discarded_at IS NULL
  AND d.status = 'lost'
  AND d.scheduled_meeting_at IS NULL
  AND NOT (d.custom_properties ? 'oportunidade_at')
  AND d.stage IS DISTINCT FROM 'oportunidade'
  AND d.lost_at >= '2026-07-09'
ORDER BY d.lost_at DESC;


RESULTADO


[
  {
    "Nome": "",
    "Telefone": "5512991507664",
    "Email": null,
    "Segmento": null,
    "Tier": null,
    "Data perda": "2026-07-15T11:29:06.673Z",
    "Motivo": "[PAR] Não tem interesse no momento"
  },
  {
    "Nome": "Naiane dos Santos Mendes",
    "Telefone": "5575998076477",
    "Email": "mendesnaiane9807@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "5",
    "Data perda": "2026-07-15T11:21:48.566Z",
    "Motivo": "[PAR] Não tem interesse no momento"
  },
  {
    "Nome": "Danilo",
    "Telefone": "5571993172482",
    "Email": "oxe.cookie@outlook.com",
    "Segmento": "Açaiteria",
    "Tier": "4",
    "Data perda": "2026-07-15T11:21:03.979Z",
    "Motivo": "[IS] Quer falar com suporte"
  },
  {
    "Nome": "Samuel Henrique",
    "Telefone": "5531973276877",
    "Email": "samuel.henrique@2bizcompany.com.br",
    "Segmento": "Sushi",
    "Tier": "1",
    "Data perda": "2026-07-15T11:13:55.276Z",
    "Motivo": "[PAR] Duplicado"
  },
  {
    "Nome": "Fernanda Perez",
    "Telefone": "5513981906595",
    "Email": "nandaperez26@gmail.com",
    "Segmento": "Outro",
    "Tier": "4",
    "Data perda": "2026-07-15T10:53:33.799Z",
    "Motivo": "[IS] Cliente quer funcionalidade que não temos"
  },
  {
    "Nome": "Gabi Oliveira",
    "Telefone": "5585987525575",
    "Email": "bibi@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "1",
    "Data perda": "2026-07-15T10:48:39.037Z",
    "Motivo": "[BDR][CLIENTES] Realizou a indicação"
  },
  {
    "Nome": "Valmir",
    "Telefone": "5511995264511",
    "Email": "valmir@securitizar.com.br",
    "Segmento": "Pizzaria",
    "Tier": "2",
    "Data perda": "2026-07-15T10:47:22.423Z",
    "Motivo": "[IS] Cliente quer funcionalidade que não temos"
  },
  {
    "Nome": "Eloá Vicente Ramos",
    "Telefone": "5511956854024",
    "Email": "eloaramos167@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "4",
    "Data perda": "2026-07-15T10:44:32.359Z",
    "Motivo": "[N] Lead não tem orçamento"
  },
  {
    "Nome": "Rogério Júnior",
    "Telefone": "5515997571563",
    "Email": "rogeriochave123@gmail.com",
    "Segmento": "Outro",
    "Tier": "2",
    "Data perda": "2026-07-15T10:44:23.776Z",
    "Motivo": "[IS] Lead desqualificado"
  },
  {
    "Nome": "Paula Taissa",
    "Telefone": "5583999675776",
    "Email": "paulataissa8@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "2",
    "Data perda": "2026-07-15T10:02:41.510Z",
    "Motivo": "[N] Lead não tem orçamento"
  },
  {
    "Nome": "beatriz junqueira",
    "Telefone": "5521964580210",
    "Email": "beatrizjunqueira3272@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-15T10:01:01.499Z",
    "Motivo": "[PAR] Lead desqualificado"
  },
  {
    "Nome": "Gardenia Maria da Silva Folha",
    "Telefone": "5589981340647",
    "Email": "gardeniafolha79@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Data perda": "2026-07-15T10:00:03.191Z",
    "Motivo": "[IS] Lead desqualificado"
  },
  {
    "Nome": "Vilmar Lopes",
    "Telefone": "5566999637331",
    "Email": "vilmarlopps2@gmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-15T09:48:56.264Z",
    "Motivo": "[PAR] Lead desqualificado"
  },
  {
    "Nome": "Naotememail",
    "Telefone": "(18) 99803-9717",
    "Email": "naotememail@gmail.com",
    "Segmento": null,
    "Tier": "Agentes",
    "Data perda": "2026-07-15T09:40:11.956Z",
    "Motivo": "[IS] Prospect sem interesse"
  },
  {
    "Nome": "Talita",
    "Telefone": "5543998696304",
    "Email": "talita_beda@hotmail.com",
    "Segmento": "Pastelaria",
    "Tier": "Tier 1",
    "Data perda": "2026-07-15T09:28:38.124Z",
    "Motivo": "[IS][N] Lead recebeu última tentativa de contato"
  },
  {
    "Nome": "Naianyfm",
    "Telefone": "(62) 99370-2903",
    "Email": "naianyfm@hotmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 2",
    "Data perda": "2026-07-15T09:27:58.913Z",
    "Motivo": "[IS][N] Lead recebeu última tentativa de contato"
  },
  {
    "Nome": "Alisson Largado",
    "Telefone": "(71) 99143-0171",
    "Email": "alisson_largado@hotmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-15T08:55:55.281Z",
    "Motivo": "[RH] Deixou de responder"
  },
  {
    "Nome": "Roberto richardy",
    "Telefone": "5569981014330",
    "Email": "robertorichardy058@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:59.177Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Bruno hencher",
    "Telefone": "5551983176018",
    "Email": "brunohencher3972@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Data perda": "2026-07-15T03:00:58.031Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Alexandre Alves",
    "Telefone": "5511911423195",
    "Email": "batatariazuga@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "5",
    "Data perda": "2026-07-15T03:00:57.940Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Lyvia Aldighieri",
    "Telefone": "5521999685153",
    "Email": "enflyvia@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "5",
    "Data perda": "2026-07-15T03:00:57.929Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Kayo Henrique Santos da Silva",
    "Telefone": "5571987673871",
    "Email": "kayo234hsilva@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "5",
    "Data perda": "2026-07-15T03:00:57.548Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Di_vinodoce’s",
    "Telefone": "5521970967339",
    "Email": "ticianepires31@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-15T03:00:57.534Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Delícias da Taty",
    "Telefone": "5591984971731",
    "Email": "sarahcacheada15@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-15T03:00:57.344Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gastronomia e arte.",
    "Telefone": "5585981312406",
    "Email": "valdohc@hotmail.com",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Data perda": "2026-07-15T03:00:57.242Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ivanildo Teodósio",
    "Telefone": "5515981616989",
    "Email": "ivanildomendesteodosio@gmail.com",
    "Segmento": "Sushi",
    "Tier": "5",
    "Data perda": "2026-07-15T03:00:57.202Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Silvinha",
    "Telefone": "5518991650189",
    "Email": "silviasantana19872302@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "5",
    "Data perda": "2026-07-15T03:00:57.141Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Marmitex da Família",
    "Telefone": "5543999837675",
    "Email": "edneiamariaoliveira62@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "5",
    "Data perda": "2026-07-15T03:00:57.051Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Elaine maria da Silva oliveira",
    "Telefone": "5517992238877",
    "Email": "elainemoliver1995@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-15T03:00:56.785Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Marcella lopes",
    "Telefone": "5541997035625",
    "Email": "marcellalopes223@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-15T03:00:56.771Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Leticia Vinhas",
    "Telefone": "5571986963065",
    "Email": "leticiavinhas24@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Data perda": "2026-07-15T03:00:56.644Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Bruna Ramos romualdo",
    "Telefone": "5571985195049",
    "Email": "bruna2015rose@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "5",
    "Data perda": "2026-07-15T03:00:56.637Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Marmita Caseira",
    "Telefone": "5527998167820",
    "Email": "thaissoutomaialinda@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Data perda": "2026-07-15T03:00:56.631Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "La Fiori Chocolateria",
    "Telefone": "5562991375445",
    "Email": "contato.edgedigital@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-15T03:00:56.491Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Hinaracy maria de Araújo Dias",
    "Telefone": "5571981599919",
    "Email": "hinadelicias@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-15T03:00:56.483Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Monalisa Teles",
    "Telefone": "5521973587093",
    "Email": "lysamachado15@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "5",
    "Data perda": "2026-07-15T03:00:56.377Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Anderson Moreira Ferreira",
    "Telefone": "5522998555618",
    "Email": "a.m.f@hotmail.com.br",
    "Segmento": "Pizzaria",
    "Tier": "5",
    "Data perda": "2026-07-15T03:00:56.365Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Aline ",
    "Telefone": "55219640497",
    "Email": "naturelevepornatureza@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-15T03:00:56.350Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Andre Sulzbach",
    "Telefone": "5551994244799",
    "Email": "sulzbachandre@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "5",
    "Data perda": "2026-07-15T03:00:56.330Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Larissa Daiane da Silva Mota oliveira",
    "Telefone": "5518991539461",
    "Email": "larissadaianedasilvamotaolivei@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Data perda": "2026-07-15T03:00:56.296Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Bruno Alex",
    "Telefone": "5543984835877",
    "Email": "brunoalexdasilva840@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "2",
    "Data perda": "2026-07-15T03:00:56.294Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ivani Eloi",
    "Telefone": "5519991181381",
    "Email": "ivani.arizona1999@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "2",
    "Data perda": "2026-07-15T03:00:56.284Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Franciely Lemos",
    "Telefone": "5549991803012",
    "Email": "francielylemosdasilva@hotmail.com",
    "Segmento": "Pizzaria",
    "Tier": "2",
    "Data perda": "2026-07-15T03:00:56.279Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jildemário",
    "Telefone": "5571991272314",
    "Email": "jildemariorsantos@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:56.010Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Burguer da Vi | Delivery",
    "Telefone": "5586994409999",
    "Email": "av1011752@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:56.006Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Joilson Almeida Mecenas",
    "Telefone": "5567998154669",
    "Email": "joilsonjopba@hotmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:56.005Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Juan Crystian",
    "Telefone": "5592985926912",
    "Email": "juan.crystian@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:55.992Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "David Pereira",
    "Telefone": "5519971580938",
    "Email": "dsantos25jesus@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:55.990Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Aline Souza",
    "Telefone": "5571991961546",
    "Email": "alinesouza.nutrir@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:55.977Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Vera Lúcia",
    "Telefone": "5527997514752",
    "Email": "vl4771093@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:55.975Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Kemylly Evelly Reis Nunes",
    "Telefone": "5594981285923",
    "Email": "kemyllyevelly@gmail.com",
    "Segmento": "Outro",
    "Tier": "4",
    "Data perda": "2026-07-15T03:00:55.965Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jheicy leriane ap denner nobre",
    "Telefone": "5531992553727",
    "Email": "jheicyleriane98@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "4",
    "Data perda": "2026-07-15T03:00:55.962Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Joice Ketlen",
    "Telefone": "5561992200610",
    "Email": "joiceketlen2010@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:55.958Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Thallys Henrique",
    "Telefone": "5511953327366",
    "Email": "henriquethallys1997@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:55.942Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Rubens Bueno",
    "Telefone": "5519981111542",
    "Email": "rubimbueno@yahoo.com.br",
    "Segmento": "Pizzaria",
    "Tier": "2",
    "Data perda": "2026-07-15T03:00:55.936Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "joao",
    "Telefone": "5531971572810",
    "Email": "joaoguilhermeferrari@hotmail.com",
    "Segmento": "Restaurante",
    "Tier": "Tier 1",
    "Data perda": "2026-07-15T03:00:55.936Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "KONIG BRASIL",
    "Telefone": "5581996125922",
    "Email": "EMPRESA.KONIGBRASIL@GMAIL.COM",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Data perda": "2026-07-15T03:00:55.928Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Empório do Salgado",
    "Telefone": "5517992052681",
    "Email": "salgadoemporio15@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "2",
    "Data perda": "2026-07-15T03:00:55.924Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Vivian Correia",
    "Telefone": "5583991804879",
    "Email": "viviancamilly120@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "Tier 2",
    "Data perda": "2026-07-15T03:00:55.923Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Arthur Luides",
    "Telefone": "5511963851298",
    "Email": "lojabarradejangada@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Data perda": "2026-07-15T03:00:55.923Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Acarajé Point Joao Pessoa",
    "Telefone": "5583991394639",
    "Email": "isabellaemara@gmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-15T03:00:55.546Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Oberdan Lira Silva",
    "Telefone": "5583989075236",
    "Email": "oberdanweb@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:54.526Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Adilene Santos França",
    "Telefone": "5571988968574",
    "Email": "adilenesantosfranca@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-15T03:00:54.520Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Fabiana luiza barbosa",
    "Telefone": "5511993612603",
    "Email": "Fabianaluizabarbosa9@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-15T03:00:54.516Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Larissa Vieira",
    "Telefone": "5521975498472",
    "Email": "lucas.ruelles112@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:54.513Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Kauane sampaio",
    "Telefone": "5521973134293",
    "Email": "kauanesampaio64@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-15T03:00:54.249Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Livia Durkes",
    "Telefone": "5547988333790",
    "Email": "ribeirolivianascimento2019@gmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-15T03:00:54.184Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Fabiana Oliveira",
    "Telefone": "5553984041849",
    "Email": "carla752016@outlook.com",
    "Segmento": "Marmitaria",
    "Tier": "5",
    "Data perda": "2026-07-15T03:00:54.135Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Silvana Andriotti",
    "Telefone": "5553981296084",
    "Email": "silvanaandriotti@gmail.com",
    "Segmento": "Sushi",
    "Tier": "5",
    "Data perda": "2026-07-15T03:00:54.038Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Carlos Pereira",
    "Telefone": "5521965048969",
    "Email": "lithoraldasaguas27@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Data perda": "2026-07-15T03:00:54.023Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Rosineide Silva dos Santos",
    "Telefone": "5571996657144",
    "Email": "rosineidemuniz310@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "5",
    "Data perda": "2026-07-15T03:00:54.009Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Renata Isabelle Silva de Souza",
    "Telefone": "5551997040914",
    "Email": "osvaldosil47@gmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-15T03:00:53.934Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Eduarda Queiroz",
    "Telefone": "5521983471251",
    "Email": "dudaoqueiroz120@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-15T03:00:53.871Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Claudia Germano",
    "Telefone": "5521974954322",
    "Email": "gratidaoassessoria2021@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "5",
    "Data perda": "2026-07-15T03:00:53.819Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Robson  de Oliveira Melo",
    "Telefone": "5521990773473",
    "Email": "robsburguer45@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "5",
    "Data perda": "2026-07-15T03:00:53.791Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jhonata",
    "Telefone": "5548991359603",
    "Email": "jhonidailha@hotmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:51.541Z",
    "Motivo": "[N] Lead desapareceu (estava engajado e sumiu de repente)"
  },
  {
    "Nome": "Leila Menezes Araújo",
    "Telefone": "5521992512030",
    "Email": "leilaly4@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "Tier 4",
    "Data perda": "2026-07-15T03:00:51.504Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Fábio Leal",
    "Telefone": "5581993824884",
    "Email": "fabio-ogato2011@hotmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:51.302Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Mirian de Sousa Abreu",
    "Telefone": "5521976621393",
    "Email": "firmianofamilia@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:51.299Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "De Lu Salgaderia",
    "Telefone": "5521986528913",
    "Email": "delightsofluu@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:51.297Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Lucilene Gomes de Araújo Silva",
    "Telefone": "5561986177978",
    "Email": "luci-nha-20@hotmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:51.287Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Eduardo Sousa",
    "Telefone": "558396022175",
    "Email": "eduardocampinagrandepb@hotmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:51.283Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gabriela albino",
    "Telefone": "5516997400804",
    "Email": "docedagabyy@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:51.278Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "𝕊𝕖𝕟𝕤𝕙𝕚 𝕊𝕦𝕤𝕙𝕚",
    "Telefone": "5511995020909",
    "Email": "contato@senshisushi.com.br",
    "Segmento": "Sushi",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:51.271Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Paulo Junior",
    "Telefone": "5591985049427",
    "Email": "paulojuniorpromolter6@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:51.175Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Karen ketrili Gomes omena",
    "Telefone": "5582991252018",
    "Email": "karenketrili7@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "1",
    "Data perda": "2026-07-15T03:00:51.089Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Patricia Souza",
    "Telefone": "5592984812407",
    "Email": "anapatjesus@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:51.083Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ana Débora",
    "Telefone": "5581999030858",
    "Email": "anadeboraandrade123@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:50.535Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Raissa alves",
    "Telefone": "5512997159104",
    "Email": "raissa.alvesgomes255@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:50.521Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Mara Rocha",
    "Telefone": "5527997110036",
    "Email": "marabarbosabarbosa2613@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:50.505Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Laís",
    "Telefone": "5585992650532",
    "Email": "slais7632@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "1",
    "Data perda": "2026-07-15T03:00:50.488Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "ery johnson.",
    "Telefone": "5581999447912",
    "Email": "erybdp@hotmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:50.352Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "shimiti Yoshida",
    "Telefone": "5511947907900",
    "Email": "arnaldoyoshida@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:50.351Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Alexandre",
    "Telefone": "5517981343254",
    "Email": "alexandreessu273@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:50.338Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Felipe Gon Garoze",
    "Telefone": "5527996528073",
    "Email": "fgaroze@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:50.326Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Fernando Colen",
    "Telefone": "5535984681431",
    "Email": "fernandorcolen@gmail.com",
    "Segmento": "Sushi",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:50.325Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Valeria Trindade",
    "Telefone": "5519996260123",
    "Email": "liriosconsignado@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:50.317Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Maira Motta",
    "Telefone": "5569999313692",
    "Email": "motta132928@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:50.314Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Luiz C. Arruda Filho",
    "Telefone": "5542991563954",
    "Email": "luizinhoa244@gmail.com",
    "Segmento": "",
    "Tier": "2",
    "Data perda": "2026-07-15T03:00:50.314Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Tutu Bezerra",
    "Telefone": "5565999224440",
    "Email": "tutusexpresso@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:50.303Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ateliê das guloseimas ( Stephanie Rocha)",
    "Telefone": "5573988666913",
    "Email": "stphainesantosrocha@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:50.300Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Raimundo Antunes Filho",
    "Telefone": "5585996213715",
    "Email": "gepouantunes@hotmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:50.298Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Stefania",
    "Telefone": "5581683582876",
    "Email": "stefanialarissa4@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:50.285Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Manu Lanches e Petiscos |Rio De Janeiro RJ",
    "Telefone": "5521975887197",
    "Email": "falecommanuela@hotmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:50.283Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Cantinho do Cheff",
    "Telefone": "5585987055054",
    "Email": "davila.aquiraz@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:50.251Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Aldecir da Silva alves",
    "Telefone": "5561995983931",
    "Email": "aldeciralves628@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:50.247Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Bianca Charret",
    "Telefone": "5522992837355",
    "Email": "biancacharret@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:50.244Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Felipe Trevisan Algarte",
    "Telefone": "5516988206304",
    "Email": "ftalgarte@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "1",
    "Data perda": "2026-07-15T03:00:50.233Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Fernanda Ingrid",
    "Telefone": "5588921595039",
    "Email": "fernandafernandaingrid@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:50.221Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Neto-rj Oliveira",
    "Telefone": "5521995123736",
    "Email": "sebastiaoliveira52@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:50.220Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ivansilvar9drigues",
    "Telefone": "5551981697923",
    "Email": "ivansilva7869@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:50.219Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Julia",
    "Telefone": "5531995129308",
    "Email": "juliamicaelle432@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:50.117Z",
    "Motivo": "[N] Lead desapareceu (estava engajado e sumiu de repente)"
  },
  {
    "Nome": "Empadas do bigodinho",
    "Telefone": "5598981870825",
    "Email": "rael.r1999@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "Tier 5",
    "Data perda": "2026-07-15T03:00:50.095Z",
    "Motivo": "[N] Lead desapareceu (estava engajado e sumiu de repente)"
  },
  {
    "Nome": "Mariana Pacheco",
    "Telefone": "5511969094649",
    "Email": "mari-pacheco.18@hotmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:50.083Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Louise",
    "Telefone": "5598988901077",
    "Email": "josyanamarinho@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.775Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "carllos.",
    "Telefone": "5562985670434",
    "Email": "pizzadutche@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.647Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Kettelly Lacerda",
    "Telefone": "5561993986988",
    "Email": "kettellylacerda80@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.619Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Amanda Alves Barros ",
    "Telefone": "5511937725814",
    "Email": "amandaalvesbarros70@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:49.580Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gustavo Dias",
    "Telefone": "5535988797355",
    "Email": "gustavo@masselligroup.com.br",
    "Segmento": "Outro",
    "Tier": "1",
    "Data perda": "2026-07-15T03:00:49.551Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Cristhian Souza",
    "Telefone": "5548984040405",
    "Email": "cristhianeduardo1976@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.546Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Felipe Verdolin",
    "Telefone": "5541996666234",
    "Email": "felipecoxielo@gmail.com",
    "Segmento": "Sushi",
    "Tier": "1",
    "Data perda": "2026-07-15T03:00:49.524Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Matheus Kauan",
    "Telefone": "5583986246375",
    "Email": "matheuskauan.mk09@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.520Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Igor Pires",
    "Telefone": "5551999701137",
    "Email": "igaoads1@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "Tier 1",
    "Data perda": "2026-07-15T03:00:49.514Z",
    "Motivo": "[PAR] Parceiro não correspondeu às tentativas de contato"
  },
  {
    "Nome": "Daniel Berg De Barros",
    "Telefone": "5582981593005",
    "Email": "daniel38berg@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.510Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "priscila rodrigues",
    "Telefone": "5585986269801",
    "Email": "priscilasegdotrabalho@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "2",
    "Data perda": "2026-07-15T03:00:49.507Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Xis do Gaúcho do Ceará",
    "Telefone": "5585992680737",
    "Email": "rafaela2015pinheiro@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.469Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Janete Bernardo",
    "Telefone": "5585988292556",
    "Email": "janeteterapias@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.429Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "YAN’S BURGUER",
    "Telefone": "5519997260332",
    "Email": "yandimov.10@hotmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.406Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Chef Aurio Cosentino",
    "Telefone": "5547999831083",
    "Email": "aurionir@hotmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.400Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Pedro Lucas ",
    "Telefone": "5562991224455",
    "Email": "pedroluccas76@hotmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.375Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "carlos",
    "Telefone": "5511937242495",
    "Email": "crloshenrique2021@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.361Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Marcelo",
    "Telefone": "5515996482700",
    "Email": "mrvendasonlinee@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.340Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "BAITA BRASA HAMBURGUERIA ARTESANAL | DELIVERY E PRESENCIAL",
    "Telefone": "5551989050103",
    "Email": "baitabrasaoficial@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.334Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "sonete",
    "Telefone": "5575982084591",
    "Email": "solribeirocarneiro@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.327Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Cris Oliveira",
    "Telefone": "5561986295666",
    "Email": "crisllibella@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.326Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Alexandre",
    "Telefone": "5577988689584",
    "Email": "xandesousa62@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 1",
    "Data perda": "2026-07-15T03:00:49.318Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Leila De Menezes",
    "Telefone": "5513988556899",
    "Email": "leila_leozinho@hotmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.291Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Emanuel",
    "Telefone": "5548996170406",
    "Email": "emanuelangelo903@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.279Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Tribo Burger",
    "Telefone": "5511978223423",
    "Email": "burger.tribo@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.277Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "GEOVANNA DE SOUSA SILVA",
    "Telefone": "5511978541415",
    "Email": "geovannasousa2004@outlook.com.br",
    "Segmento": "Hamburgueria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:49.267Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ana Livia",
    "Telefone": "5545984033512",
    "Email": "analivia0803@icloud.com",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.266Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Cleidimar Sousa da Cruz",
    "Telefone": "5584996991606",
    "Email": "araujocleidimar52@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.265Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Leticia Carvalho",
    "Telefone": "5521973025843",
    "Email": "comercial.rosas@outlook.com.br",
    "Segmento": "Marmitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.263Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Josildo Jose de frança",
    "Telefone": "5581995617722",
    "Email": "josildojosedefranca@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.255Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Cleidson Lima Silva",
    "Telefone": "5511958596898",
    "Email": "tomhitmania@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.250Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Sabrina Pinho",
    "Telefone": "5531986938642",
    "Email": "sasahpinho@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.242Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Samira de Souza Mateus da Silva",
    "Telefone": "5547996073749",
    "Email": "samiradesouzamateus2@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.238Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Nivailde Fernandes da Silva",
    "Telefone": "5531996016443",
    "Email": "mikejegi321@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.225Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Joao Pedro Queiroz",
    "Telefone": "5575999756280",
    "Email": "joaopedroqueiroz409@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.224Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Tiago",
    "Telefone": "5511966325955",
    "Email": "nikkisespeto_@outlook.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.212Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Emanuel Vitor do Nascimento Arruda",
    "Telefone": "5581981644519",
    "Email": "emmhanuelnettho@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.211Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "jaqueline",
    "Telefone": "5585999614166",
    "Email": "jaquelinej997@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.206Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ricardo Lira Lessa",
    "Telefone": "5585997119291",
    "Email": "helizete.ricardo@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.199Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Luiz Geronimo Tavares",
    "Telefone": "5585991875424",
    "Email": "luizgeronimo98@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.187Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Washington",
    "Telefone": "5521980399424",
    "Email": "pastelariaklk@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.185Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Meat's Burger",
    "Telefone": "5564992707269",
    "Email": "milenaalmeida638@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.185Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Confeitaria especialista em bolos porcelana",
    "Telefone": "558799977200",
    "Email": "roberta_kalado@hotmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.185Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Fabrícia da silva",
    "Telefone": "5585986658480",
    "Email": "fabriciam889@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.174Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Thiago",
    "Telefone": "5511976007432",
    "Email": "borabar888@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "1",
    "Data perda": "2026-07-15T03:00:49.171Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Alexsandra Maria Menezes Ramos.",
    "Telefone": "5511960753068",
    "Email": "Aleartsan@yahoo.com.br",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.159Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Paulo Basilio",
    "Telefone": "5534996563729",
    "Email": "saboracaidelivery@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:49.148Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Rodrigo Ferreira",
    "Telefone": "5566999383824",
    "Email": "rodrigoferreirasnp2009@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:49.136Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ana",
    "Telefone": "5511994599754",
    "Email": "oxeacai26@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-15T03:00:49.122Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Vinicius",
    "Telefone": "5581992202775",
    "Email": "viniciusltnascimento@gmail.com",
    "Segmento": "Outro",
    "Tier": "1",
    "Data perda": "2026-07-15T03:00:49.096Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Isabelly Gomes de Carvalho",
    "Telefone": "5561993961468",
    "Email": "isagomesdecarvalho09@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "Tier 4",
    "Data perda": "2026-07-15T03:00:48.924Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Giuliana lins",
    "Telefone": "5569993806644",
    "Email": "lynsjulia456@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:48.920Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Raiza",
    "Telefone": "5562982834786",
    "Email": "trilhas.amazoniamangalo@gmail.com",
    "Segmento": "",
    "Tier": "2",
    "Data perda": "2026-07-15T03:00:48.887Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Brenda Silva",
    "Telefone": "5591985764309",
    "Email": "brendasilva8433@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:48.887Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Victoria Mainart Ferreira",
    "Telefone": "5531987179094",
    "Email": "victoriamainart210@gail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:48.876Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gabryella Cavalcante silva",
    "Telefone": "5561994201959",
    "Email": "gabryellacavalcantesilva@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:48.850Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Bacanas Lanches",
    "Telefone": "5543984116140",
    "Email": "bacanaslanches44@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:48.832Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Kariny Gabrielly Garcia lira",
    "Telefone": "5565996955297",
    "Email": "dungachamagas@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:48.824Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Thaís Viana",
    "Telefone": "5531971101739",
    "Email": "bboca2000@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:48.823Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Caroline Vargas ",
    "Telefone": "5551996841454",
    "Email": "carolinevargas1801@hotmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:48.823Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Thyago Firmino",
    "Telefone": "5582996253585",
    "Email": "lookbaryprimavera@gmail.com",
    "Segmento": "Outro",
    "Tier": "1",
    "Data perda": "2026-07-15T03:00:48.810Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Fabricio",
    "Telefone": "5541998995399",
    "Email": "Contato@pudimdenovo.com.br",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:48.793Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Karen Gomes",
    "Telefone": "5534998622558",
    "Email": "amorempedacositba@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:48.788Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Vanessa Nunes Do Nascimento Dos Santos",
    "Telefone": "5511982416320",
    "Email": "vanessagha53@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:48.780Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Mariana leocadio misael spinelli",
    "Telefone": "5515998261478",
    "Email": "mariana.junior91@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:48.775Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Inez Oliveira ",
    "Telefone": "5534997689544",
    "Email": "inezoliveira240@yahoo.com.br",
    "Segmento": "Marmitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:48.770Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Pizzaria DMais B.Roxo",
    "Telefone": "5521969307837",
    "Email": "batistavieira971@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:48.766Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Larissa Arantes",
    "Telefone": "5517992748300",
    "Email": "aranteslarissa44@gmail.com",
    "Segmento": "",
    "Tier": "1",
    "Data perda": "2026-07-15T03:00:48.762Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Francisco Carlos",
    "Telefone": "5581986596832",
    "Email": "franciscocfmoura@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 5",
    "Data perda": "2026-07-15T03:00:48.757Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Igor Fernandes",
    "Telefone": "5561992925219",
    "Email": "igorfjulio8@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-15T03:00:48.751Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Isabely Simião",
    "Telefone": "5515998595130",
    "Email": "contatoisabelypontes@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "2",
    "Data perda": "2026-07-15T03:00:48.751Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Miguel de Souza lisboa pereira",
    "Telefone": "5571982151883",
    "Email": "migueldesouzalisboapereira02@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:48.742Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Rafael da Silva Farias",
    "Telefone": "5583994151749",
    "Email": "izamarasimoesmateus20@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:48.677Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gabrielly Hermann",
    "Telefone": "5554999075585",
    "Email": "gabriellyhermanndeoliveira@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "4",
    "Data perda": "2026-07-15T03:00:48.671Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "BRUNO DOS SANTOS AURELIO",
    "Telefone": "5567991985254",
    "Email": "brunodossantosaurelio@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:48.669Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "João Victor",
    "Telefone": "5561984561612",
    "Email": "joaovictordaniel357@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-15T03:00:48.663Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "fernando freitas",
    "Telefone": "5593991344287",
    "Email": "silvajunior3101@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "Tier 4",
    "Data perda": "2026-07-15T03:00:48.657Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "João Vitor Ferreira goncalves",
    "Telefone": "5521989367134",
    "Email": "Jvjupaloma@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:48.628Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "ALINE OLIVEIRA DE ABREU",
    "Telefone": "5519998479399",
    "Email": "oliveiraaline5163@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:48.623Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Rodolfo Santana",
    "Telefone": "5519998585088",
    "Email": "rodolfo.netpiracicaba@hotmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:48.617Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Lidiane Fernanda Coutinho",
    "Telefone": "5512981361143",
    "Email": "coutinholidiane90@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-15T03:00:48.616Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Taísa Carla",
    "Telefone": "5517996680227",
    "Email": "taithihortifrutis@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:48.611Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "RAFAELA BENICE DA SILVA",
    "Telefone": "5511957466648",
    "Email": "rafaela.benice@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:48.605Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Brenda Rosalem ",
    "Telefone": "5554996440937",
    "Email": "rosalen_gbrenda@outlook.com",
    "Segmento": "Marmitaria",
    "Tier": null,
    "Data perda": "2026-07-15T03:00:48.594Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Matheus",
    "Telefone": "5585999554904",
    "Email": "matheus.medeiros@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:48.591Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Francisco Canindé da Silva",
    "Telefone": "5584987293279",
    "Email": "fsilwa9@gmail.com",
    "Segmento": "Outro",
    "Tier": null,
    "Data perda": "2026-07-15T03:00:48.588Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jaqueline Matos alves",
    "Telefone": "5598984019037",
    "Email": "alicegusmaoalves@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "2",
    "Data perda": "2026-07-15T03:00:48.580Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Rozalia de Santana Acioly",
    "Telefone": "5581991053854",
    "Email": "rozaliaaciolly@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:48.579Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Rafael Lins Barbosa",
    "Telefone": "5513997291447",
    "Email": "tstrafaelbarbosa@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:48.578Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Elizeu Eidans Farias",
    "Telefone": "5569984277386",
    "Email": "jaguarmalarmesafo@hotmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:48.568Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Fabiano ",
    "Telefone": "5541988026969",
    "Email": "fabianorobertolima@gmail.com",
    "Segmento": "Sushi",
    "Tier": "2",
    "Data perda": "2026-07-15T03:00:48.566Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Richard",
    "Telefone": "5515991652092",
    "Email": "isabeldiasnascimento1@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-15T03:00:48.557Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Hellen Carpes",
    "Telefone": "5511996549971",
    "Email": "hcarpes61@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:48.554Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Rayane",
    "Telefone": "5527988284334000",
    "Email": "henrickysteve@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:48.528Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Sheila de Oliveira Schernovski",
    "Telefone": "5545991298778",
    "Email": "sheilaviera599@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:48.488Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Nicolas mieszkowski",
    "Telefone": "5583998490169",
    "Email": "planetxburguer@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:48.487Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Maria Lidiane da silva",
    "Telefone": "5586999911398",
    "Email": "gessivaldocarvalho890@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:48.479Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Marta Dionezio",
    "Telefone": "5518996952164",
    "Email": "mmartadionezio@bol.com.br",
    "Segmento": "Marmitaria",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-15T03:00:48.476Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Lucas Gomes de Oliveira",
    "Telefone": "5561991366313",
    "Email": "ol.lucas3@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:48.468Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Daniela ferreira",
    "Telefone": "5562981613154",
    "Email": "danydanys2017@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 1",
    "Data perda": "2026-07-15T03:00:48.465Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Giovanna",
    "Telefone": "5521984110915",
    "Email": "lojascasamagdalena@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:48.463Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Victor Hugo Alves dos Reis",
    "Telefone": "5535984722421",
    "Email": "alvesvictor238@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": null,
    "Data perda": "2026-07-15T03:00:48.447Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Juliana Melissa",
    "Telefone": "5511911512410",
    "Email": "pipocadaju2026@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 2",
    "Data perda": "2026-07-15T03:00:48.394Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Elison Conceição",
    "Telefone": "5515991577696",
    "Email": "elisonconceicao96@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "Tier 1",
    "Data perda": "2026-07-15T03:00:48.378Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Itamara prado",
    "Telefone": "5594992271349",
    "Email": "itamaraprado7@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "1",
    "Data perda": "2026-07-15T03:00:48.365Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Sabrina Alves",
    "Telefone": "5511933825213",
    "Email": "sabrinaalvessgde@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "4",
    "Data perda": "2026-07-15T03:00:48.318Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Samuel ",
    "Telefone": "5579996552575",
    "Email": "sam.luiz.oliveira@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:48.101Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gloria landim",
    "Telefone": "5511997114564",
    "Email": "sthefaniegloria@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:47.725Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "KYMZ RESTAURANT",
    "Telefone": "5511917328900",
    "Email": "zayedpubg10@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:47.722Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Keylla Cristina",
    "Telefone": "5582996160971",
    "Email": "keyllacristina259@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:47.685Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Chef_Cícero",
    "Telefone": "5585989179938",
    "Email": "cicerorodriguesbarbosar@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:47.650Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Rosane costa",
    "Telefone": "5549999064954",
    "Email": "rosanedeoliveiracosta1@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:47.650Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Juliana Machado",
    "Telefone": "5551991915066",
    "Email": "julianamachadojuh682@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:47.616Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Marcos Damasceno",
    "Telefone": "5511981957316",
    "Email": "marcosdamalenda@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-15T03:00:47.589Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Bruno Nascimento",
    "Telefone": "5521992732439",
    "Email": "brunosilvanascimento87@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Data perda": "2026-07-15T03:00:47.585Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "FABIO GALHARDO COSTA",
    "Telefone": "5516994012450",
    "Email": "fabiogalhardo@hotmail.com",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Data perda": "2026-07-15T03:00:47.568Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "FÁTIMA ",
    "Telefone": "5581973341349",
    "Email": "ygorlau28@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:47.557Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ana karolayne pereira bezerra ",
    "Telefone": "5581995747570",
    "Email": "anthony.gabrielps2025@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:47.557Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Chocolove doceria",
    "Telefone": "5521990083097",
    "Email": "doceriachocolove9@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:47.544Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "DAYANNE AMORIM",
    "Telefone": "5564993254758",
    "Email": "AMORIMDAYANNE59@GMAIL.COM",
    "Segmento": "Confeitaria",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-15T03:00:47.526Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "CAROLINE BERNARDES",
    "Telefone": "5548996398043",
    "Email": "carolcakesedoces@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:47.451Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Nicole Tedesco",
    "Telefone": "5554999965631",
    "Email": "nicoletedesco2000@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:47.451Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Antonio modolo neto",
    "Telefone": "5511984956162",
    "Email": "antoniomodolo@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:47.441Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Katiuce Cassia Rodrigues Malheiros",
    "Telefone": "5538984368478",
    "Email": "rarianydias@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "5",
    "Data perda": "2026-07-15T03:00:47.437Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Cristiano Soares",
    "Telefone": "5581999013052",
    "Email": "mssyrhk@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:47.433Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Lilian Bertola",
    "Telefone": "5511957982152",
    "Email": "contato@chocolatesecia.com.br",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:47.432Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Fabiana A. Martins",
    "Telefone": "5511941866669",
    "Email": "fabianaamve@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-15T03:00:47.419Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gabriela Ouverney",
    "Telefone": "5522998301831",
    "Email": "gabiouverneylab@gmail.com",
    "Segmento": "",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:47.384Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ana Luiza Barreto",
    "Telefone": "5531986796244",
    "Email": "aninha97583@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:47.374Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Mini Festa Box",
    "Telefone": "5562994784431",
    "Email": "minifestabox@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-15T03:00:47.365Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Rangel Abadio Santos Melo ",
    "Telefone": "5534991824934",
    "Email": "rangelabadio9@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:47.349Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Cristiano santos",
    "Telefone": "5511948466417",
    "Email": "cristianosimoes11052004@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-15T03:00:47.323Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Josiene Santos Silva",
    "Telefone": "5511964429610",
    "Email": "josisantos928@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:47.319Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Andressa Pereira Mendes",
    "Telefone": "5569993860932",
    "Email": "andressapereiramendes0204@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:47.319Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "jeferson luis piva",
    "Telefone": "5548998540369",
    "Email": "pesonalpiva2010@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:47.307Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Maria Julia",
    "Telefone": "5586994011512",
    "Email": "todapattymf@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-15T03:00:47.307Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Kamily ",
    "Telefone": "5554991459138",
    "Email": "marikamily62@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:47.294Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "LEONARDO LUIZ LIMA PEREIRA",
    "Telefone": "5521991780130",
    "Email": "leonardolima.rj@hotmail.com.br",
    "Segmento": "Confeitaria",
    "Tier": null,
    "Data perda": "2026-07-15T03:00:47.281Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Dona Brownie",
    "Telefone": "5584992151389",
    "Email": "adriely.fsc01@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:47.280Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Keila",
    "Telefone": "5521995039847",
    "Email": "keilacsantos01@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:47.234Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Luana ",
    "Telefone": "5521993433284",
    "Email": "luanasilva7961@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-15T03:00:47.230Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Alexandre Taboza",
    "Telefone": "5581985654133",
    "Email": "ogrego.pe.br@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-15T03:00:47.205Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jesus Edwar Lorant Velázquez",
    "Telefone": "5595984134713",
    "Email": "jesusedwar44@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:47.173Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Sandra Pompermayer",
    "Telefone": "5511949609000",
    "Email": "dashiasian@gmail.com",
    "Segmento": "Sushi",
    "Tier": "2",
    "Data perda": "2026-07-15T03:00:47.085Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "roberta fernandes",
    "Telefone": "5548999521728",
    "Email": "boartenabrasa@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:47.067Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ruth Costa verônica",
    "Telefone": "5598970124623",
    "Email": "ruthcostaveronica86@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:47.053Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Alisson ",
    "Telefone": "5573999981661",
    "Email": "tapiocae2025@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-15T03:00:47.051Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Leticia Tolentino",
    "Telefone": "5537999869262",
    "Email": "letolentino@hotmail.com",
    "Segmento": "Confeitaria",
    "Tier": "1",
    "Data perda": "2026-07-15T03:00:47.047Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Roger azevedo",
    "Telefone": "5522997861247",
    "Email": "rogerazevedo@live.com",
    "Segmento": "Hamburgueria",
    "Tier": "2",
    "Data perda": "2026-07-15T03:00:47.034Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gabriel do bem comer",
    "Telefone": "5555838844310",
    "Email": "bemcomer@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Data perda": "2026-07-15T03:00:47.018Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Thayse Gajko",
    "Telefone": "5551992878773",
    "Email": "gajkogajko@hotmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:47.011Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Johnny Houmsi",
    "Telefone": "5517996469396",
    "Email": "j.mysoul.h@hotmail.com",
    "Segmento": "Restaurante",
    "Tier": "2",
    "Data perda": "2026-07-15T03:00:46.997Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Bruno Maccari",
    "Telefone": "5547988383956",
    "Email": "brunomaccari123@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "2",
    "Data perda": "2026-07-15T03:00:46.962Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Josiane Domingues de Albuquerque",
    "Telefone": "5521968629400",
    "Email": "jdominguesdealbuquerque@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:46.923Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Welliton Soares Mundim",
    "Telefone": "5566999378426",
    "Email": "welliton@leveia.com.br",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 1",
    "Data perda": "2026-07-15T03:00:46.923Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Renata",
    "Telefone": "5521983521336",
    "Email": "gabriellebatista335@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "2",
    "Data perda": "2026-07-15T03:00:46.911Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "PABLO RICARDO CLAUDINO DE LIRA",
    "Telefone": "5582999802671",
    "Email": "pablolira827@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "4",
    "Data perda": "2026-07-15T03:00:46.885Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Luna Almeida",
    "Telefone": "5511968259506",
    "Email": "luna130almeida@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:46.879Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Catharina Melo",
    "Telefone": "5575991998839",
    "Email": "acatharinamelo@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "1",
    "Data perda": "2026-07-15T03:00:46.861Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Moisés",
    "Telefone": "55349912562",
    "Email": "098sesiom@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:46.821Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Thalia stelmach dos Santos",
    "Telefone": "5542988727060",
    "Email": "thaliasantosstelmach@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:46.350Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Evelin Karolaine soares",
    "Telefone": "5516993508919",
    "Email": "evelinkarolaine75@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-15T03:00:46.270Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Maria Eduarda de Lima Hoffmann",
    "Telefone": "5555991640790",
    "Email": "zaza0909.abc@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:46.257Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Juliana de Sousa Alves Ribeiro",
    "Telefone": "5588999984360",
    "Email": "juliana2804@icloud.com",
    "Segmento": "Lanchonete",
    "Tier": "3.1",
    "Data perda": "2026-07-15T03:00:46.226Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Caio Roberto Ferreira Silva",
    "Telefone": "5592984016063",
    "Email": "hamburgueriabessa28@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "1",
    "Data perda": "2026-07-14T18:54:53.972Z",
    "Motivo": "[IS] Fechou com Representante"
  },
  {
    "Nome": "SANDRA RABELO DE AZEVEDO",
    "Telefone": "5522998935122",
    "Email": "sandra.aze77@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-14T18:41:26.076Z",
    "Motivo": "[N] Lead quer fechar no futuro"
  },
  {
    "Nome": "Camila Silva",
    "Telefone": "5538999536221",
    "Email": "cantinhodoacaizinho@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "5",
    "Data perda": "2026-07-14T18:41:08.539Z",
    "Motivo": "[N] Lead fechou com concorrente"
  },
  {
    "Nome": "ALISON",
    "Telefone": "5575992145013",
    "Email": "jukinhapanpizz@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Data perda": "2026-07-14T18:27:05.570Z",
    "Motivo": "[N] Lead fechou com concorrente"
  },
  {
    "Nome": "Camilamengarelli",
    "Telefone": null,
    "Email": "camilamengarelli09@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "Tier 2",
    "Data perda": "2026-07-14T17:59:07.702Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "TESTE FORMS TOTEM",
    "Telefone": "5585995785478",
    "Email": "hgyutfgbhuohgiyuvbihuhojiuhyi@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "2",
    "Data perda": "2026-07-14T17:07:21.092Z",
    "Motivo": "[PAR] Perda de teste"
  },
  {
    "Nome": "Kauanpereiraribeiro",
    "Telefone": "(85) 98830-0769",
    "Email": "kauanpereiraribeiro1@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-14T16:59:32.564Z",
    "Motivo": "[REP] Sem interesse no momento"
  },
  {
    "Nome": "STAEL CRISTINA ",
    "Telefone": "5533998262715",
    "Email": "strategiasolucoesconsultoria@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "1",
    "Data perda": "2026-07-14T16:58:42.500Z",
    "Motivo": "[IS] Cliente quer funcionalidade que não temos"
  },
  {
    "Nome": "Amâncio Alves da Silva ",
    "Telefone": "5566999199269",
    "Email": "amancioalves94@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "Tier 5",
    "Data perda": "2026-07-14T16:47:54.432Z",
    "Motivo": "[IS] Prospect sem interesse"
  },
  {
    "Nome": "A",
    "Telefone": "(47) 99943-0513",
    "Email": "a",
    "Segmento": null,
    "Tier": "Agentes",
    "Data perda": "2026-07-14T16:46:20.103Z",
    "Motivo": "[IS][N] Lead sumiu após envio da fatura"
  },
  {
    "Nome": "Danilomelocavalcanti",
    "Telefone": "(81) 99651-6466",
    "Email": "danilomelocavalcanti@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-14T16:44:01.965Z",
    "Motivo": "[IS] Prospect sem interesse"
  },
  {
    "Nome": "Junia Gabriela",
    "Telefone": "5531998293779",
    "Email": "junia4622@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "4",
    "Data perda": "2026-07-14T16:01:59.985Z",
    "Motivo": "[IS] Lead acha que a plataforma não vale o investimento"
  },
  {
    "Nome": "Bruno Azevedo",
    "Telefone": "5519997658296",
    "Email": "seocrepecampinas@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-14T15:58:15.573Z",
    "Motivo": "[IS] Lead desqualificado"
  },
  {
    "Nome": "Ingrid de Oliveira Mikos Ramos",
    "Telefone": "5567996398259",
    "Email": "oingrid783@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-14T15:48:13.206Z",
    "Motivo": "[IS] Lead duplicado"
  },
  {
    "Nome": "Augusto Giannini",
    "Telefone": "5515996186965",
    "Email": "giannini.aag@gmail.com",
    "Segmento": "Outro",
    "Tier": "1",
    "Data perda": "2026-07-14T15:39:54.376Z",
    "Motivo": "[IS] Lead duplicado"
  },
  {
    "Nome": "Joelson Nascimento",
    "Telefone": "5592991907673",
    "Email": "joelson_tuca@hotmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-14T15:34:38.030Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "Wallison .",
    "Telefone": "5531992527348",
    "Email": "redemineiros.financeiro@hotmail.com",
    "Segmento": "Restaurante",
    "Tier": "4",
    "Data perda": "2026-07-14T15:32:58.311Z",
    "Motivo": "[N] Lead não tem orçamento"
  },
  {
    "Nome": "wennethon eslau",
    "Telefone": "5581996772720",
    "Email": "wennethon@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "Tier 1",
    "Data perda": "2026-07-14T15:32:18.366Z",
    "Motivo": "[IS] Lead duplicado"
  },
  {
    "Nome": "JEAN CARLOS CRUZ DE QUADROS",
    "Telefone": "5549998128005",
    "Email": "jeanwhichesterpm@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-14T15:31:42.035Z",
    "Motivo": "[IS] Prospect sem interesse"
  },
  {
    "Nome": "Daniel hiroyuki izumi",
    "Telefone": "5512991293414",
    "Email": "izumi123yuki@gmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-14T15:26:51.582Z",
    "Motivo": "[ERR] Lead com número de outra pessoa"
  },
  {
    "Nome": "Saladinhaverde",
    "Telefone": null,
    "Email": "saladinhaverde@gmail.com",
    "Segmento": null,
    "Tier": "Tier 2",
    "Data perda": "2026-07-14T15:23:10.752Z",
    "Motivo": "[IS][N] Lead recebeu última tentativa de contato"
  },
  {
    "Nome": "MARIA OZÂNIA",
    "Telefone": "5534996306075",
    "Email": "pizzaria.av.2026@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "5",
    "Data perda": "2026-07-14T15:21:40.836Z",
    "Motivo": "[IS] Lead desqualificado"
  },
  {
    "Nome": "Weidila bruna ",
    "Telefone": "5562985114144",
    "Email": "weidilabruna@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Data perda": "2026-07-14T15:20:41.286Z",
    "Motivo": "[PAR] Parceiro quer revenda"
  },
  {
    "Nome": "JONAS BASTOS MARQUES",
    "Telefone": "5594992702903",
    "Email": "marques290394@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "3.2",
    "Data perda": "2026-07-14T15:19:18.941Z",
    "Motivo": "[N] Lead não tem orçamento"
  },
  {
    "Nome": "Luciana",
    "Telefone": "5519992717194",
    "Email": "luciana_bueno_7@hotmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-14T15:16:21.026Z",
    "Motivo": "[REP] Sem interesse no momento"
  },
  {
    "Nome": "",
    "Telefone": "5547997669074",
    "Email": null,
    "Segmento": null,
    "Tier": null,
    "Data perda": "2026-07-14T15:09:40.859Z",
    "Motivo": "[IS] Fechou com Representante"
  },
  {
    "Nome": "Cleciene Pereira maia",
    "Telefone": "5564993122878",
    "Email": "clecienemaia9088@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-14T15:01:21.706Z",
    "Motivo": "[IS] Prospect sem interesse"
  },
  {
    "Nome": "Natally Gomes Farias",
    "Telefone": "5597984131024",
    "Email": "natallygomes183@gmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-14T14:29:42.155Z",
    "Motivo": "[ERR] Lead está procurando emprego"
  },
  {
    "Nome": "Armandocasadonorte",
    "Telefone": "(11) 91343-2059",
    "Email": "armandocasadonorte@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "Tier 1",
    "Data perda": "2026-07-14T14:26:31.391Z",
    "Motivo": "[IS][N] Lead recebeu última tentativa de contato"
  },
  {
    "Nome": "Raipcavalcante",
    "Telefone": null,
    "Email": "raipcavalcante33@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": null,
    "Data perda": "2026-07-14T14:24:25.801Z",
    "Motivo": "[IS][N] Lead quer fechar no futuro"
  },
  {
    "Nome": "Samuel Profeta",
    "Telefone": "5519998949980",
    "Email": "profetasj@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "2",
    "Data perda": "2026-07-14T12:00:44.605Z",
    "Motivo": "[IS][N] Lead fechou com concorrente"
  },
  {
    "Nome": "",
    "Telefone": "5521965919961",
    "Email": null,
    "Segmento": null,
    "Tier": null,
    "Data perda": "2026-07-14T11:28:33.132Z",
    "Motivo": "[IS][PRE] Lead desqualificado pelo perfil"
  },
  {
    "Nome": "Wellington Lima da Silva",
    "Telefone": "5511939565284",
    "Email": "well.limadasilva1403@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-14T11:27:17.643Z",
    "Motivo": "[IS] Lead já é cliente"
  },
  {
    "Nome": "Keliane Silva Vieira",
    "Telefone": "5574998024533",
    "Email": "vieirakeliane74@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Data perda": "2026-07-14T11:10:56.950Z",
    "Motivo": "[ERR] Lead com número de outra pessoa"
  },
  {
    "Nome": "Flavinha Guia de turismo",
    "Telefone": "5512997515456",
    "Email": "flaviajoaoed@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-14T10:57:26.599Z",
    "Motivo": "[N] Lead quer fechar no futuro"
  },
  {
    "Nome": "",
    "Telefone": "5512991356263",
    "Email": null,
    "Segmento": null,
    "Tier": null,
    "Data perda": "2026-07-14T10:49:55.970Z",
    "Motivo": "[IS] Prospect sem interesse"
  },
  {
    "Nome": "Glenda dias da silva",
    "Telefone": "5511958916671",
    "Email": "glendasilva.utg@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-14T10:46:31.448Z",
    "Motivo": "[IS] Prospect sem interesse"
  },
  {
    "Nome": "Josy Oliveira Silva",
    "Telefone": "5573988967222",
    "Email": "josilva.sp@hotmail.com",
    "Segmento": "Pizzaria",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-14T10:37:55.521Z",
    "Motivo": "[IS][N] Lead recebeu última tentativa de contato"
  },
  {
    "Nome": "Regis Braga Rodrigues",
    "Telefone": "5527992925515",
    "Email": "pousadafsamaritana@gmail.com",
    "Segmento": "Outro",
    "Tier": "4",
    "Data perda": "2026-07-14T10:34:01.455Z",
    "Motivo": "[N] Lead não tem orçamento"
  },
  {
    "Nome": "Cintia",
    "Telefone": "5511996551110",
    "Email": "lafelicitapizzaria@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "2",
    "Data perda": "2026-07-14T10:33:25.445Z",
    "Motivo": "[IS] Lead já é cliente"
  },
  {
    "Nome": "Pensão da tia Dilma",
    "Telefone": "5521974766548",
    "Email": "dilmapensao@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Data perda": "2026-07-14T10:33:07.213Z",
    "Motivo": "[N] Lead não tem orçamento"
  },
  {
    "Nome": "Marcos",
    "Telefone": "5531982338138",
    "Email": "marcosdosreis288@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "4",
    "Data perda": "2026-07-14T10:28:34.656Z",
    "Motivo": "[IS] Lead desqualificado"
  },
  {
    "Nome": "",
    "Telefone": "5511994197425",
    "Email": null,
    "Segmento": null,
    "Tier": null,
    "Data perda": "2026-07-14T10:28:24.921Z",
    "Motivo": "[IS] Lead desqualificado"
  },
  {
    "Nome": "Alexia Supriano Nascimento",
    "Telefone": "5562995198752",
    "Email": "alexiasupriano29@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "4",
    "Data perda": "2026-07-14T10:28:14.965Z",
    "Motivo": "[IS][SDR] Leads querendo contato com a 99Food"
  },
  {
    "Nome": "Ilker Duch Rocha",
    "Telefone": "5521979083890",
    "Email": "ilkerrocha@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T10:23:45.533Z",
    "Motivo": "[IS][N] Lead desapareceu (estava engajado e sumiu de repente)"
  },
  {
    "Nome": "TESTE ALEXANDRE",
    "Telefone": "5585958945895",
    "Email": "juhygtfdresdawswdefrgthyjugf@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "1",
    "Data perda": "2026-07-14T10:15:20.263Z",
    "Motivo": "[PAR] Perda de teste"
  },
  {
    "Nome": "Ana Carolina",
    "Telefone": "5531974010411",
    "Email": "belchioracai@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T10:13:34.976Z",
    "Motivo": "[IS][N][IN] Lead nunca respondeu"
  },
  {
    "Nome": "Larissa Marinho Moura",
    "Telefone": "5598987519543",
    "Email": "larissamarinhomoura@outlook.com.br",
    "Segmento": "Açaiteria",
    "Tier": "2",
    "Data perda": "2026-07-14T10:06:25.727Z",
    "Motivo": "[N] Lead perdeu o interesse no momento"
  },
  {
    "Nome": "Bruna Karolline",
    "Telefone": "5598985341312",
    "Email": "cakedeliciaslz@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-14T10:05:31.954Z",
    "Motivo": "[N] Lead não tem orçamento"
  },
  {
    "Nome": "eduardo dantas",
    "Telefone": "5519998629864",
    "Email": "dantas4.4@hotmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-14T10:02:10.856Z",
    "Motivo": "[IS] Prospect sem interesse"
  },
  {
    "Nome": "Rafaela Oliveira",
    "Telefone": "5511944540342",
    "Email": "rafaearthur577@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T09:53:14.378Z",
    "Motivo": "[N] Lead não tem orçamento"
  },
  {
    "Nome": "Fernando Oliveira",
    "Telefone": "5551997663574",
    "Email": "fe.rossa45@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T09:53:12.778Z",
    "Motivo": "[ERR] Lead com número de outra pessoa"
  },
  {
    "Nome": "Vitória Guimarães",
    "Telefone": "5544998468350",
    "Email": "vitoriasantoguimaraes432@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T09:42:37.046Z",
    "Motivo": "[N] Lead fechou com concorrente"
  },
  {
    "Nome": "MARCIO LUCAS HENRIQUE DA SILVA",
    "Telefone": "5581992698360",
    "Email": "marciamariamaria074@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-14T09:17:15.889Z",
    "Motivo": "[ERR] Lead está procurando emprego"
  },
  {
    "Nome": "Fábio Lúcio Amaral de Melo",
    "Telefone": "5581998270812",
    "Email": "fabiomelo1081@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:01:00.362Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Viviane Almeida",
    "Telefone": "5511978911043",
    "Email": "vivianecaedoso32@gmail.com",
    "Segmento": "Restaurante",
    "Tier": null,
    "Data perda": "2026-07-14T03:00:53.598Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Aline de Sá",
    "Telefone": "5569992856025",
    "Email": "lesinhabluesky@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:53.216Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Mario Sergio de Souza Soares",
    "Telefone": "5585991526189",
    "Email": "mariosoares497@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:53.203Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Vivi Goulart",
    "Telefone": "5522981484647",
    "Email": "vivinegoulartsantos@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:53.189Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Adriana Pereira",
    "Telefone": "5521974796940",
    "Email": "dricanjknk7@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:53.175Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Isaac Veloso",
    "Telefone": "5561991643873",
    "Email": "isaacveloso_gomes@hotmail.com",
    "Segmento": "Pizzaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:53.159Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Fabiana Luiza",
    "Telefone": "5581985556911",
    "Email": "fabianaluiza-350@hotmail.com",
    "Segmento": "Lanchonete",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:53.013Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Renan Menezes Rios",
    "Telefone": "5511998234273",
    "Email": "renan.futuratel@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:52.994Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Primavera Pizzaria",
    "Telefone": "5577933019352",
    "Email": "jamball@hotmail.com.br",
    "Segmento": "Pizzaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:52.689Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Bruna oliveira",
    "Telefone": "5596984250512",
    "Email": "lovesalgaditos@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:52.675Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Rafael Souza",
    "Telefone": "5521971480658",
    "Email": "rafael.santificai@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:52.660Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "brownie da tia mili",
    "Telefone": "5515988295983",
    "Email": "milianeantoineciceron@gmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:52.644Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Maiara Moreira | Confeitaria Artesanal | Butantã - SP",
    "Telefone": "5511958416665",
    "Email": "lala_fnd@hotmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:52.627Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Vânia Marcia Ruas do Carmo",
    "Telefone": "5537984257365",
    "Email": "carlossilvadocarmo1956@gmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:52.613Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Claudia Pires",
    "Telefone": "5512991949603",
    "Email": "bagrecrau@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:52.598Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "M&R lancheria",
    "Telefone": "5545998417956",
    "Email": "rafaelpereira1712@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:52.581Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "helena cristina lopes",
    "Telefone": "5511969504410",
    "Email": "dudusdog@hotmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:52.566Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Airton Behle Martins",
    "Telefone": "5547992588872",
    "Email": "lancheriacomebem@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:52.557Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Isabelli Lins",
    "Telefone": "5511993160104",
    "Email": "isabelli.lins@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:52.556Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "RANALIA ARCANJO",
    "Telefone": "5563991048636",
    "Email": "acaidarhanny@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-14T03:00:52.543Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Victorya",
    "Telefone": "5511910336654",
    "Email": "dixxvitoria07@gmail.com",
    "Segmento": "Outro",
    "Tier": "2",
    "Data perda": "2026-07-14T03:00:52.542Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Hayandra Araujo Reis",
    "Telefone": "5531986520074",
    "Email": "hayaraujo3103@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "1",
    "Data perda": "2026-07-14T03:00:52.535Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Samara Soares",
    "Telefone": "5519995829578",
    "Email": "samarasoaressantos1990@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "2",
    "Data perda": "2026-07-14T03:00:52.531Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gabriel Dantas",
    "Telefone": "5571983446106",
    "Email": "gabrieldantas1991@proton.me",
    "Segmento": "Outro",
    "Tier": "2",
    "Data perda": "2026-07-14T03:00:52.529Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Kiara",
    "Telefone": "5544988253134",
    "Email": "mrcupimcomercial@gmail.com",
    "Segmento": "Outro",
    "Tier": "1",
    "Data perda": "2026-07-14T03:00:52.520Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "jorgenei Torres",
    "Telefone": "5522999281512",
    "Email": "coruja.nei.torres@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:52.515Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "kauã christoni",
    "Telefone": "5514998228826",
    "Email": "kaua48137@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:52.514Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Raimundo Márcio lima de souza",
    "Telefone": "5585988147330",
    "Email": "cheffsouza2021@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:52.499Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Rafa",
    "Telefone": "5592994774261",
    "Email": "scalabriny2014@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:52.484Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Julio Cesar carneiro",
    "Telefone": "5579996425645",
    "Email": "casabravafood@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:52.434Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ls Sucos Naturais Detox e comida saudável",
    "Telefone": "5585985025107",
    "Email": "mariaalucinele2029@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:52.403Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "antonio damiao de oliveira bar",
    "Telefone": "5585988405817",
    "Email": "damiaolane@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:52.403Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Rodrigo Marques",
    "Telefone": "5538997255782",
    "Email": "roodssbh@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:52.387Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Alessandro Rodrigues carvalho",
    "Telefone": "5519971118743",
    "Email": "Alessandro.rodrigues98055@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:52.125Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Joildo Silva",
    "Telefone": "5591999625498",
    "Email": "joildosmilly@hotmail.com",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:52.121Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Anderson Pereira",
    "Telefone": "5568999144316",
    "Email": "arpengenhariaczs@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:52.121Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "pluto",
    "Telefone": "5521971552193",
    "Email": "fabianemiran@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:52.107Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Pedro Vicente de Oliveira",
    "Telefone": "5521988326275",
    "Email": "pedrovicentedeoliveira@gmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:52.094Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gleice biagioni",
    "Telefone": "5513997691115",
    "Email": "gleicebiaggionis@hotmail.com",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:52.093Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Anderson Lima",
    "Telefone": "5561981492721",
    "Email": "dudaslanche52@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:52.079Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Henrique Whendel Gomes Sampaio",
    "Telefone": "5586988770422",
    "Email": "boyp7786@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:52.079Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Mega Combos Vila Prudente",
    "Telefone": "5511945972694",
    "Email": "barduleo2014@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:52.079Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Nova Opção Lubrificantes",
    "Telefone": "5511998497865",
    "Email": "novaopcaolubrificantes@yahoo.com.br",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:52.064Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Rogerio Rodrigues da Silva",
    "Telefone": "553499722131",
    "Email": "rogeriarodrigues1973@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:52.064Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "João Delfino",
    "Telefone": "5517997463893",
    "Email": "jr.mirassol@hotmail.com",
    "Segmento": "Lanchonete",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:52.063Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Dione Corrêa",
    "Telefone": "5591981253627",
    "Email": "dione.kaelle@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:52.048Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Cristina Rodrigues Batista",
    "Telefone": "5515992500448",
    "Email": "cristinarodriguesbatista284@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:52.034Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Bruna Soares",
    "Telefone": "5521980912140",
    "Email": "lovebruna@hotmail.com",
    "Segmento": "Marmitaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:52.034Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Rodrigo Pereira",
    "Telefone": "5524992719582",
    "Email": "rodrigorpcz@yahoo.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:52.028Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Silvinha",
    "Telefone": "5521971882392",
    "Email": "silviahelenamarcolino1509@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:52.020Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Delícia no pote",
    "Telefone": "5581983043324",
    "Email": "adrianagaldino335@gmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:52.019Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Dandah Oliveira",
    "Telefone": "5521969207143",
    "Email": "dandamarcelly2017@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.988Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Paloma Braga",
    "Telefone": "5511976720015",
    "Email": "Pbraga9@gmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.987Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gilnara Costa | Introdução Alimentar",
    "Telefone": "5591987174406",
    "Email": "gilnaralima@hotmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.975Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Flavio Vanzellotte",
    "Telefone": "5512974058350",
    "Email": "trezedogbanda@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.974Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Thammy Ferreira",
    "Telefone": "5571991281934",
    "Email": "pregadoratamy31@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.974Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Marineuza Dos Santos",
    "Telefone": "5521995465773",
    "Email": "marineuzadosantossantos@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.933Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Suellia Rodrigues",
    "Telefone": "5511949967593",
    "Email": "suelliarodrigues@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.925Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Mônica Lopes de Lima",
    "Telefone": "55987291884",
    "Email": "chavedavirada2025@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.921Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Dona Fatima Feijoada No Balde",
    "Telefone": "556195172181",
    "Email": "Vanfsmota@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.916Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Rosana Costa",
    "Telefone": "5577988432174",
    "Email": "rosanacosta19@hotmail.com",
    "Segmento": "Marmitaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.915Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Kelly Cristina",
    "Telefone": "5511981425852",
    "Email": "kelly.cristina97sa@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.909Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Valeria Albuquerque",
    "Telefone": "5591993234488",
    "Email": "valeriaalbuquerque38@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.901Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "mãe e filha",
    "Telefone": "5527997600218",
    "Email": "clecia.psouza@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.901Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Junior Vargas",
    "Telefone": "5548992223504",
    "Email": "juniorvargas@hotmail.it",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.895Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Sorveteria Delicias Geladas",
    "Telefone": "5519999715558",
    "Email": "yasmin201405@gmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.891Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Victor Nascif",
    "Telefone": "5532991462976",
    "Email": "nascifvictor7@gmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.888Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Burguer e Grill do Edson",
    "Telefone": "5586999696037",
    "Email": "burgueregrilldoedson@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.888Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Nathan Oliveira",
    "Telefone": "5511993278784",
    "Email": "nathanbrugo@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.876Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Lúcia Helena de Melo",
    "Telefone": "5585997631277",
    "Email": "lhmlucy@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.864Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Johny salus",
    "Telefone": "5551960000515",
    "Email": "tritaocamisetas@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.863Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Bia pedroza",
    "Telefone": "5521968520476",
    "Email": "annabepedroza@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.860Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Paula Cristine",
    "Telefone": "5521974916584",
    "Email": "kauaamoreterno93@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.849Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Joise Silva",
    "Telefone": "554899147132",
    "Email": "oliveiradasilvajoisemeire@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.848Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Bendita Marmita",
    "Telefone": "5569993643867",
    "Email": "jaquelinesantana2606@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.837Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "thys",
    "Telefone": "5573988098027",
    "Email": "ml93509@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.832Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Leandro César",
    "Telefone": "5563991332233",
    "Email": "gramaleda@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.828Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Pastelaria do Nilsinho",
    "Telefone": "5535999411332",
    "Email": "taty_vilela27@hotmail.com",
    "Segmento": "Pastelaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.821Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "IMPÉRIO DISTRIBUIDORA",
    "Telefone": "5567991981665",
    "Email": "imperiodistribuidora3l@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.821Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Júlio César Pereira da Silva",
    "Telefone": "5585999613901",
    "Email": "juliopereiradasilva006@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.818Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Esfiharia Premium Bauru",
    "Telefone": "5514996507830",
    "Email": "leandromcastro89@gmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.813Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gabriela Ribeiro",
    "Telefone": "5548996695425",
    "Email": "gabrielaaribeiro12@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.806Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Devinho Felix",
    "Telefone": "5582987518318",
    "Email": "deivinho_thaly@hotmail.com",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.803Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Melissa Santos da Luz",
    "Telefone": "5555219808853",
    "Email": "melissa.luz19@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.798Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "July",
    "Telefone": "5533991140317",
    "Email": "julyduforno@gmail.com",
    "Segmento": "",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.753Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "VV BURGUER",
    "Telefone": "5569992831206",
    "Email": "wevelynvictor347@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.741Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Mariana Carvalho",
    "Telefone": "5521987035439",
    "Email": "mariana.oliveira20@icloud.com",
    "Segmento": "Lanchonete",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.738Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Everaldo Morais",
    "Telefone": "5598985302867",
    "Email": "everaldo985302867@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.711Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Adailton de jesus",
    "Telefone": "5571992064951",
    "Email": "aaj040195@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.698Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Natalina Nascimento Dos Santos",
    "Telefone": "5577981682538",
    "Email": "natalina.nascimentos.79230@hotmail.com",
    "Segmento": "Pizzaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.692Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Hamburgueria Vita",
    "Telefone": "5521967953331",
    "Email": "rbestudio4@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.641Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Tanise pereira da silva",
    "Telefone": "5551980904293",
    "Email": "tanisemarla@hotmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 4",
    "Data perda": "2026-07-14T03:00:51.609Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Rossana Bittencourt Godoy",
    "Telefone": "5555992128403",
    "Email": "rossanabc2008@gmail.com",
    "Segmento": "Outro",
    "Tier": "4",
    "Data perda": "2026-07-14T03:00:51.596Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Elisabete tomaz",
    "Telefone": "5514998994401",
    "Email": "foquinhatoma@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "4",
    "Data perda": "2026-07-14T03:00:51.594Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "nayara ",
    "Telefone": "5511917712662",
    "Email": "nayaradc114@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "4",
    "Data perda": "2026-07-14T03:00:51.586Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "beatriz mattus",
    "Telefone": "5519998883645",
    "Email": "beatrizmattus99@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "4",
    "Data perda": "2026-07-14T03:00:51.584Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Klilber",
    "Telefone": "5521979863978",
    "Email": "klilberstorm@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "4",
    "Data perda": "2026-07-14T03:00:51.579Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Alpha Sushis | Comida Japonesa | Poke | Cariacica",
    "Telefone": "5527988470864",
    "Email": "dszmbw94rr@privaterelay.appleid.com",
    "Segmento": "Sushi",
    "Tier": "2",
    "Data perda": "2026-07-14T03:00:51.553Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "karla sousa",
    "Telefone": "5561981698517",
    "Email": "karlathiene@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Data perda": "2026-07-14T03:00:51.550Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Eric Barros",
    "Telefone": "5561999843688",
    "Email": "supremedelicatessenpituba@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "2",
    "Data perda": "2026-07-14T03:00:51.538Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ana Raisa Sousa de lima",
    "Telefone": "5585996352661",
    "Email": "raisasousa71@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "1",
    "Data perda": "2026-07-14T03:00:51.537Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Camilla Alves",
    "Telefone": "5521964073576",
    "Email": "camillacunhaalves@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "Tier 2",
    "Data perda": "2026-07-14T03:00:51.537Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Alan Ribeiro",
    "Telefone": "5581984246304",
    "Email": "allam_ribeiro@hotmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.440Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Luiz Felipe Rodrigues Siqueira ",
    "Telefone": "5564992469424",
    "Email": "luizfeliperds678@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.380Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Carmem silva",
    "Telefone": "5581985414214",
    "Email": "ocaseirinho2012@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.345Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Wendel Victor",
    "Telefone": "5514991433980",
    "Email": "wendel.victoor8855@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-14T03:00:51.183Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Mariana",
    "Telefone": "5549999324187",
    "Email": "marianahugenoc@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.139Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Analia Nunes Alves",
    "Telefone": "5521964671929",
    "Email": "nunesanalia08@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:51.019Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Camilla Batista",
    "Telefone": "5583987520271",
    "Email": "camissalgados@gmail.com",
    "Segmento": "Outro",
    "Tier": null,
    "Data perda": "2026-07-14T03:00:50.878Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Giovanna Abijaude",
    "Telefone": "5573999292921",
    "Email": "santabrasaitb@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:50.875Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Vera Guelfi",
    "Telefone": "5511971761123",
    "Email": "guelfivera.veruska@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:50.871Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Sávio mhuryel moreira serafim",
    "Telefone": "5564992999667",
    "Email": "saviogamer1985@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:50.864Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Welington",
    "Telefone": "5516994140548",
    "Email": "confitcozinhasaudavel@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:50.861Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Wellington Souza",
    "Telefone": "5516997220724",
    "Email": "wsouzadesigner@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:50.860Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Celimar Firmino",
    "Telefone": "5571986212881",
    "Email": "firminocelimar@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-14T03:00:50.855Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Matheus Rafael dos Santos",
    "Telefone": "5511986108005",
    "Email": "mamalindo1073@icloud.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:50.832Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Alda ",
    "Telefone": "5561991512569",
    "Email": "pizzariarun@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:50.831Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Adriane Sales",
    "Telefone": "5527998315101",
    "Email": "adriane.costa1988@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:50.829Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ale Pinheiro",
    "Telefone": "5511961830892",
    "Email": "alexandrefeliciano@rocketmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:50.820Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Patrick gabriel ",
    "Telefone": "5551989528426",
    "Email": "patrickgabriel0302@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:50.819Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Maria Clara",
    "Telefone": "5573999795280",
    "Email": "mariacl141519@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:50.816Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Maria GORETE",
    "Telefone": "5562995023508",
    "Email": "irlandaimport@hotmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:50.816Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ana Carolina Rodrigues",
    "Telefone": "5517988383315",
    "Email": "karolrodrigues85201@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:50.802Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Hugo",
    "Telefone": "5521970950575",
    "Email": "hugorany892@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:50.791Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Maria Gleiciene",
    "Telefone": "5585988885199",
    "Email": "gleicyenetbr@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:46.991Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ana Tereza Matos Araujo",
    "Telefone": "5579981332091",
    "Email": "docuraaraujo@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:46.877Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Lore Santos",
    "Telefone": "5592981122824",
    "Email": "tici.lorena@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:46.847Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "IURE SANTOS FRAGA",
    "Telefone": "5579998018924",
    "Email": "iurimilmeupix@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:46.719Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Marynayra ",
    "Telefone": "5531985780153",
    "Email": "ddocesmary@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:46.706Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Macia Tomaz",
    "Telefone": "5521999086522",
    "Email": "bibipereira35358@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:46.554Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Lucimare Rondon de Moraes ",
    "Telefone": "5565992711877",
    "Email": "lu123rondon@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:46.024Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gabriela Filassi Pradela",
    "Telefone": "5517981134010",
    "Email": "gabi.filassi@outlook.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:45.924Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Thamires da silva",
    "Telefone": "5521991758634",
    "Email": "tata.viperr@gmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:45.911Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Laricão lanches",
    "Telefone": "5596981125029",
    "Email": "leo1633silva@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:45.759Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Alessandra",
    "Telefone": "5592982165005",
    "Email": "mestredasesfirrasarabe@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:45.724Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Cintya Cibele",
    "Telefone": "5581997112734",
    "Email": "cintyacibele26@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:45.660Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Michele Abreu Cymas",
    "Telefone": "5521972353279",
    "Email": "michelecymas@yahoo.com.br",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:45.572Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gerlane nascimento costa",
    "Telefone": "5586999961625",
    "Email": "brendadosreissantana28@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:45.562Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Weverton Bonifácio de oliveira",
    "Telefone": "5531991647150",
    "Email": "wevertonbosb@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:45.561Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Milna Mara Ateliê Gourmet",
    "Telefone": "5513974054367",
    "Email": "milnamara@hotmail.com",
    "Segmento": "Pastelaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:45.531Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Priscila",
    "Telefone": "5592992839474",
    "Email": "Sopadolorenzo@gmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:45.260Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Graziella Miranda",
    "Telefone": "5511939484643",
    "Email": "graziellacurvel4@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:45.253Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Julio Bispo",
    "Telefone": "5579999157908",
    "Email": "jrbrayn@hotmail.com",
    "Segmento": "Outro",
    "Tier": "4",
    "Data perda": "2026-07-14T03:00:45.186Z",
    "Motivo": "[PAR] Parceiro não correspondeu às tentativas de contato"
  },
  {
    "Nome": "Maria Eduarda",
    "Telefone": "5521981063562",
    "Email": "maria201634070165410@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:44.325Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Diogo",
    "Telefone": "5521991221956",
    "Email": "Churrascoou@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:44.082Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gleice Kelly lima dos Santos",
    "Telefone": "5571996832637",
    "Email": "kellylimasantos128@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:43.915Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Sergio edson",
    "Telefone": "5516981013898",
    "Email": "spretodasilva@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "Tier 2",
    "Data perda": "2026-07-14T03:00:43.758Z",
    "Motivo": "[N] Lead desapareceu (estava engajado e sumiu de repente)"
  },
  {
    "Nome": "Kamylly Eduarda",
    "Telefone": "5521968891079",
    "Email": "isislanches11@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:43.478Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Daniele brandao",
    "Telefone": "5521983718983",
    "Email": "dejbrandao@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "2",
    "Data perda": "2026-07-14T03:00:43.417Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Kaillany Lima Rocha",
    "Telefone": "5527999691633",
    "Email": "limarochakaillany@gmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:43.313Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Larissa Nogueira",
    "Telefone": "5585997305516",
    "Email": "larissa190619@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:42.791Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Nilton Júnior",
    "Telefone": "5551995817488",
    "Email": "niltonjunior48@hoail.com",
    "Segmento": "Marmitaria",
    "Tier": "Tier 1",
    "Data perda": "2026-07-14T03:00:42.777Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Bianca Daniel de Gois",
    "Telefone": "5515998141029",
    "Email": "biancadrsilva@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:42.763Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Edilson Ferreira",
    "Telefone": "5547996934820",
    "Email": "edilsonbacabal@hotmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:42.753Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Vinícius Gabriel",
    "Telefone": "5519988868743",
    "Email": "viniciusgabrielsantos07@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:42.749Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Janaina",
    "Telefone": "5521968079709",
    "Email": "comidadajana.dl@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:42.728Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gisele Vitalino Lopes",
    "Telefone": "5573999270960",
    "Email": "giselevlopes86@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-14T03:00:42.714Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Yoshida",
    "Telefone": "5521988935309",
    "Email": "yoshidasushichefe@outlook.com.br",
    "Segmento": "Sushi",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:42.651Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Stephanie",
    "Telefone": "5531975058188",
    "Email": "phannymoura@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-14T03:00:42.601Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Divina Gourmet",
    "Telefone": "5575992858291",
    "Email": "gulapizz123@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:42.588Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Evelyn",
    "Telefone": "5581988301516",
    "Email": "evelyndantas163@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:42.588Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Adriano Claro",
    "Telefone": "5535999259646",
    "Email": "adriano.claro1@hotmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:42.588Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Sarah Monize",
    "Telefone": "5512988522323",
    "Email": "sarahmonize@hotmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:42.588Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Thiago Carvalho",
    "Telefone": "5519971266751",
    "Email": "Adm.alfasalgados@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:42.575Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Por Pâmela Marques | Irajá Rj",
    "Telefone": "5521998994166",
    "Email": "mell.marques25@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:42.575Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Adriana ",
    "Telefone": "5513997362860",
    "Email": "drika_mendiole@hotmail.com",
    "Segmento": "Marmitaria",
    "Tier": "Tier 1",
    "Data perda": "2026-07-14T03:00:42.574Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Iatiçara Oliveira da Silva",
    "Telefone": "5597981187465",
    "Email": "iaticara@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:42.562Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Carmelita Oliveira Dos Santos e Silva",
    "Telefone": "5575981448929",
    "Email": "carmelitaoss10@gmail.com",
    "Segmento": "",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:42.562Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Adalberto Silva",
    "Telefone": "5512982090061",
    "Email": "adalberto.r.silva@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 2",
    "Data perda": "2026-07-14T03:00:42.549Z",
    "Motivo": "[N] Lead desapareceu (estava engajado e sumiu de repente)"
  },
  {
    "Nome": "Leonardo Miranda",
    "Telefone": "5551982069710",
    "Email": "leonardomiranda.rs@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-14T03:00:42.548Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Andre Matsukawa",
    "Telefone": "5517992704161",
    "Email": "mauromatsukawa1@gmail.com",
    "Segmento": "Sushi",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-14T03:00:42.525Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Renata",
    "Telefone": "5511985679488",
    "Email": "renataerenan2010@hotmail.com.br",
    "Segmento": "Restaurante",
    "Tier": "Tier 1",
    "Data perda": "2026-07-14T03:00:42.517Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Aldeliria Maria",
    "Telefone": "5567998456139",
    "Email": "aldeliriam@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:42.513Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jefferson Adelino silva",
    "Telefone": "5581995935369",
    "Email": "rose881888@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:42.468Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Alexandre S Murta da Silva",
    "Telefone": "559987595515",
    "Email": "murtalex@yahoo.com.br",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:42.382Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Marcos alencar",
    "Telefone": "5592984528323",
    "Email": "marcosalencarfam@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:42.303Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jonathan Camilo",
    "Telefone": "5511943055307",
    "Email": "camilojonathandossantos@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:42.274Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Aline Nascimento",
    "Telefone": "5538999102895",
    "Email": "alinenascinentomota2@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "4",
    "Data perda": "2026-07-14T03:00:42.224Z",
    "Motivo": "[PAR] Parceiro não correspondeu às tentativas de contato"
  },
  {
    "Nome": "Djeannilk Damasceno",
    "Telefone": "5585987621532",
    "Email": "djdamasceno01@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:42.212Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Letícia de quadra",
    "Telefone": "5547996201626",
    "Email": "leticiadequadra460@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:42.144Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ariane de Castro Rodrigues Luz",
    "Telefone": "5511984015877",
    "Email": "maiordeliciadoces@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:42.083Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Bruno Silva Ranquino ",
    "Telefone": "5521964134787",
    "Email": "bruno.ranquino@gmail.com",
    "Segmento": "Outro",
    "Tier": null,
    "Data perda": "2026-07-14T03:00:42.077Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Leticia",
    "Telefone": "5521970389071",
    "Email": "leticiacordeiro1208@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:42.071Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Blenda",
    "Telefone": "5596984159961",
    "Email": "blenda.karinny@icloud.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 5",
    "Data perda": "2026-07-14T03:00:42.022Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Thiago Veloso",
    "Telefone": "5511955305806",
    "Email": "thvloso@gmail.com",
    "Segmento": "Outro",
    "Tier": "1",
    "Data perda": "2026-07-14T03:00:42.000Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "GABRIEL HENRIQUE DOS SANTOS",
    "Telefone": "5517988067397",
    "Email": "gs740592@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-14T03:00:41.994Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Yara Alcoforado",
    "Telefone": "5581994065457",
    "Email": "yara.alcoforado@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:41.994Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Claudilene silva raposo",
    "Telefone": "5562982232332",
    "Email": "Lara23112003@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:40.082Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "O Hamburgueiro | Hamburgueria Artesanal",
    "Telefone": "5511916380788",
    "Email": "henriquefernandesss14@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:39.243Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Léo Pizza",
    "Telefone": "5571988853233",
    "Email": "comerbemcaseiro@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "2",
    "Data perda": "2026-07-14T03:00:39.228Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Sandra ",
    "Telefone": "5582987060637",
    "Email": "purefilter2023@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": null,
    "Data perda": "2026-07-14T03:00:39.211Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Higor Peria Bertolette",
    "Telefone": "5519996522818",
    "Email": "mansanntos@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:39.028Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Caroline Martini",
    "Telefone": "5518997678615",
    "Email": "carol.zootecnia@hotmail.com",
    "Segmento": "Sushi",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:39.025Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Alisson Oliveira",
    "Telefone": "5585992217740",
    "Email": "alissonmotorola2024@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "1",
    "Data perda": "2026-07-14T03:00:39.022Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "salmos23.4",
    "Telefone": "5585981333359",
    "Email": "luhm457@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "Tier 2",
    "Data perda": "2026-07-14T03:00:39.017Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Pablo",
    "Telefone": "5562991971955",
    "Email": "pablow1072@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:39.012Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Alex José Grosso",
    "Telefone": "5519999872870",
    "Email": "bigpudimrc@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:38.975Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "JEISIELY SILVA",
    "Telefone": "5594992289595",
    "Email": "jeisysrocha15@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:38.968Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Mariani Marcondes",
    "Telefone": "5542999665578",
    "Email": "mariani.marcondes@escola.pr.gov.br",
    "Segmento": "Hamburgueria",
    "Tier": "4",
    "Data perda": "2026-07-14T03:00:38.968Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jhonathan Rodrigues Soares ",
    "Telefone": "5531996427754",
    "Email": "jhonathanr946@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-14T03:00:38.967Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "LORENE HIGUERAS",
    "Telefone": "5521993039335",
    "Email": "lorenehigueraa@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "Tier 2",
    "Data perda": "2026-07-14T03:00:38.953Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Amanda Barbosa Carneiro ",
    "Telefone": "5562991106506",
    "Email": "amandabarbosa236@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:38.929Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ricardo Araújo",
    "Telefone": "5549991646126",
    "Email": "rcardo1578@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "4",
    "Data perda": "2026-07-14T03:00:38.925Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "João Paulo Oliveira Nogueira",
    "Telefone": "5521987101057",
    "Email": "nhacpizzaria@hotmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:38.922Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Carlos Henrique",
    "Telefone": "5531996142009",
    "Email": "onobrecarlos@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-14T03:00:38.915Z",
    "Motivo": "[PAR] Parceiro não correspondeu às tentativas de contato"
  },
  {
    "Nome": "Wellyka Kelly da Costa Pinheiro Alencar ",
    "Telefone": "5599985540058",
    "Email": "wellyka.99@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:38.912Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Carlinhos Lanches",
    "Telefone": "5567999164407",
    "Email": "carlinhoslanches2000@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "2",
    "Data perda": "2026-07-14T03:00:38.909Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Raissa Rocha",
    "Telefone": "5571999431077",
    "Email": "raissaeurocha@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:38.906Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Maria tereza",
    "Telefone": "5534998033130",
    "Email": "mariaterezasouzaf5@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "4",
    "Data perda": "2026-07-14T03:00:38.882Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "MATHEUS CARVALHO",
    "Telefone": "5568999757023",
    "Email": "matheus.dourado.carvalho@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:38.882Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Arthur Victor Cabral da Silva",
    "Telefone": "5584996321357",
    "Email": "arthurcabral.net@outlook.com",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Data perda": "2026-07-14T03:00:38.876Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Alexandre Orlandin ",
    "Telefone": "5551998506888",
    "Email": "labelladonnacriciuma@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "Tier 1",
    "Data perda": "2026-07-14T03:00:38.874Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Raiane Natália",
    "Telefone": "5543999762296",
    "Email": "raianelopes012020@gmail.com",
    "Segmento": "Outro",
    "Tier": "4",
    "Data perda": "2026-07-14T03:00:38.869Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "EMERSON",
    "Telefone": "5511978313297",
    "Email": "skinaodosassados@gmail.com",
    "Segmento": "",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:38.869Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Rita Barbosa da Silva",
    "Telefone": "5575998441041",
    "Email": "rita93barbosa@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:38.854Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Silvana  Rodrigues da Silva",
    "Telefone": "5514996022272",
    "Email": "deliciaseaperitivos@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "Tier 1",
    "Data perda": "2026-07-14T03:00:38.853Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "MIKELE Silva",
    "Telefone": "5585992064107",
    "Email": "mikelepaz98@gmail.com",
    "Segmento": "Outro",
    "Tier": "4",
    "Data perda": "2026-07-14T03:00:38.833Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Patrícia Bernardes",
    "Telefone": "5571988298240",
    "Email": "patybernardes1010@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "2",
    "Data perda": "2026-07-14T03:00:38.817Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "DARY BENTO",
    "Telefone": "558494829090",
    "Email": "bentodary@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "2",
    "Data perda": "2026-07-14T03:00:38.795Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Paulo VICTOR",
    "Telefone": "5585921545340",
    "Email": "pv256432@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:38.787Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Lucas Cardoso Silva",
    "Telefone": "5519971107343",
    "Email": "silvaamaloka77@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "1",
    "Data perda": "2026-07-14T03:00:38.773Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Thiago S Costa",
    "Telefone": "5582996295987",
    "Email": "thiagoscosta96@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:38.759Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Davi Paia",
    "Telefone": "5531972561095",
    "Email": "davi20paia@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:38.752Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Matheus Souza",
    "Telefone": "5571999577450",
    "Email": "elteteuzim@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": null,
    "Data perda": "2026-07-14T03:00:38.738Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "MAURICIO AUGUSTO DE OLIVEIRA VAZ GUEDES",
    "Telefone": "5512981699526",
    "Email": "guedes32a@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:38.726Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "PRISCILA",
    "Telefone": "5535998717049",
    "Email": "PRISCILAAPARECIDAMADEIRA@GMAIL.COM",
    "Segmento": "Hamburgueria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:38.724Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Cristielli Karine aparecida milhorini",
    "Telefone": "5511996508212",
    "Email": "cristiellikarine@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-14T03:00:38.718Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Tempero do chef /self-service e galeteria",
    "Telefone": "558592532121",
    "Email": "manoe.icp03@gmail.com",
    "Segmento": "Restaurante",
    "Tier": null,
    "Data perda": "2026-07-14T03:00:38.714Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Michela do Nascimento Marinho Oliveira",
    "Telefone": "5581983228838",
    "Email": "michelle1011oliveira@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:38.710Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "rogerio",
    "Telefone": "5592985134324",
    "Email": "rogerio-tere1@live.com",
    "Segmento": "Sushi",
    "Tier": "2",
    "Data perda": "2026-07-14T03:00:38.645Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Diego da Silva soares",
    "Telefone": "5513981665533",
    "Email": "Adegadizeira@gmail.com",
    "Segmento": "Outro",
    "Tier": "4",
    "Data perda": "2026-07-14T03:00:38.642Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Marli José da Fonseca",
    "Telefone": "5531993239053",
    "Email": "marlijosefonseca@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:38.618Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ana Carolina",
    "Telefone": "5511968441500",
    "Email": "karolsilva.biel44@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:38.590Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Pizzaria dom Juan",
    "Telefone": "5511949289472",
    "Email": "jean.adventure46@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "2",
    "Data perda": "2026-07-14T03:00:38.418Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Richesse Gourmet",
    "Telefone": "5573999943539",
    "Email": "liafigueiredo55figueiredo@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:38.318Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Wanderson Meireles",
    "Telefone": "5566992131634",
    "Email": "wandersonmeireles715@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:38.095Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Anna laura",
    "Telefone": "5531983366312",
    "Email": "annalau839@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:38.069Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Bianca Gabriella Antunes",
    "Telefone": "5566999352106",
    "Email": "mateusdograu066@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 4",
    "Data perda": "2026-07-14T03:00:38.067Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Misael borges",
    "Telefone": "5521974107368",
    "Email": "simoneduilio12@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:38.056Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jean melquiades da Silva",
    "Telefone": "5547992887675",
    "Email": "oxentechawarmas@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:38.015Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "arthur gabriel",
    "Telefone": "5535938035533",
    "Email": "g3correa01@gmail.com",
    "Segmento": "Sushi",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:38.000Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Thais velozo",
    "Telefone": "5519994865454",
    "Email": "chefacai5@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": null,
    "Data perda": "2026-07-14T03:00:37.981Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Guilherme Da Silva Oliveira Paes",
    "Telefone": "5561991166730",
    "Email": "guilhermesilva9568@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:37.968Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Barbara Michelle",
    "Telefone": "5571987686961",
    "Email": "barbaramichelly.santana@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-14T03:00:37.961Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gabriel salvador",
    "Telefone": "5551989762213",
    "Email": "gabriel.salvadorlima@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:37.949Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "João Ferreira dos Santos Neto",
    "Telefone": "5566999341770",
    "Email": "jf8229229@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "Tier 1",
    "Data perda": "2026-07-14T03:00:37.907Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Danieli Lopes",
    "Telefone": "5567996714713",
    "Email": "dani.nagosttri@gmail.com",
    "Segmento": "Sushi",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:37.878Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "joao victor brito",
    "Telefone": "5598988162220",
    "Email": "joaovictorbrito587@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "4",
    "Data perda": "2026-07-14T03:00:37.691Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "sandro costa",
    "Telefone": "5527998790883",
    "Email": "sandrocostanv@gmail.com",
    "Segmento": null,
    "Tier": null,
    "Data perda": "2026-07-14T03:00:37.676Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Bruno",
    "Telefone": "5587991362417",
    "Email": "bnboliveira22@gmail.com",
    "Segmento": "Outro",
    "Tier": "2",
    "Data perda": "2026-07-14T03:00:37.662Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Cookiezando",
    "Telefone": "5584991889224",
    "Email": "llorenaaraujjo@gmail.com",
    "Segmento": "Outro",
    "Tier": "4",
    "Data perda": "2026-07-14T03:00:37.659Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Wilgner",
    "Telefone": "5535998101312",
    "Email": "wilgnerpvs@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:37.643Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "michelle meirelles",
    "Telefone": "5551992841124",
    "Email": "mebrepresentacao@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:37.632Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Renata Oliveira",
    "Telefone": "5531986707161",
    "Email": "renatrabalho@hotmail.com",
    "Segmento": "Restaurante",
    "Tier": "4",
    "Data perda": "2026-07-14T03:00:37.626Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Duane Lima Rocha",
    "Telefone": "553188133703",
    "Email": "duannelima@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "2",
    "Data perda": "2026-07-14T03:00:37.619Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ramira Fernandes",
    "Telefone": "5532999160032",
    "Email": "ramiira.fernandes@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:37.612Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Cilvana ",
    "Telefone": "5519992570651",
    "Email": "isadoracristinarosasantos@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "4",
    "Data perda": "2026-07-14T03:00:37.603Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jessica elizama",
    "Telefone": "5534991364385",
    "Email": "jessicaelizama@hotmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:37.595Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Thiago",
    "Telefone": "5548999897807",
    "Email": "fornariaragazzi@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:37.592Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Daniel Pereira",
    "Telefone": "5583996905503",
    "Email": "danielpkxd24@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:37.581Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Vinicius",
    "Telefone": "5573982138003",
    "Email": "vinicius-154@hotmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "2",
    "Data perda": "2026-07-14T03:00:37.579Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Silvio Torraca Salvino",
    "Telefone": "5524992748884",
    "Email": "silviotorraca2@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:37.567Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Pedro Victor Nunes de Oliveira",
    "Telefone": "5586994149734",
    "Email": "pvnunesoliveira@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "4",
    "Data perda": "2026-07-14T03:00:37.565Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Alex",
    "Telefone": "55199713502",
    "Email": "alexsilva212003@yahoo.com.br",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:37.552Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Daniel Alberto",
    "Telefone": "5534997730387",
    "Email": "bugreestetcar@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:37.521Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "João Pedro",
    "Telefone": "5511923363217",
    "Email": "trescacauoficial@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-14T03:00:37.517Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "LUCAS PACHECO DE CARVALHO",
    "Telefone": "5547992708664",
    "Email": "lucaspachecocarvalho22@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "Tier 4",
    "Data perda": "2026-07-14T03:00:37.512Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Carlos Eduardo",
    "Telefone": "5561996146197",
    "Email": "carloseduardomuniz20@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:37.508Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Valdir Dias de Oliveira",
    "Telefone": "5521985855551",
    "Email": "malabimlanches@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "Tier 1",
    "Data perda": "2026-07-14T03:00:37.483Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Aline Schardong",
    "Telefone": "5551999712615",
    "Email": "alineschardongnascimento@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-14T03:00:37.477Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Elisângela Barros Assunção Falcão",
    "Telefone": "5585981208721",
    "Email": "assuncaoelisangela527@gmail.com",
    "Segmento": "Outro",
    "Tier": "4",
    "Data perda": "2026-07-14T03:00:37.472Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Sandra Freire",
    "Telefone": "5596981285771",
    "Email": "freiresandra570@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-14T03:00:37.471Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "César gutierre",
    "Telefone": "5512996793875",
    "Email": "gutierrecesar2@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "4",
    "Data perda": "2026-07-14T03:00:37.471Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Luana Brandão Amparo",
    "Telefone": "5571999641587",
    "Email": "luanabrandaoluanabrandao@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:37.461Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Adriana Soares",
    "Telefone": "5582988511754",
    "Email": "andreiicarlos7@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:37.458Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Maria Aparecida de Medeiros",
    "Telefone": "5584921631330",
    "Email": "rosaliamedeiros76@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:37.447Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Emili Souza",
    "Telefone": "5511945525151",
    "Email": "emilysouzad1@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:37.443Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Giovana",
    "Telefone": "5514996676244",
    "Email": "brilhodeacucarconfeitaria@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 4",
    "Data perda": "2026-07-14T03:00:37.376Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Restaurante Dominguez",
    "Telefone": "5555229923692",
    "Email": "construtorflavio2@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-14T03:00:37.371Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Marcos ",
    "Telefone": "5512997902709",
    "Email": "mdanilocruz33@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:37.319Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Lucas Oliveira Santana Souza",
    "Telefone": "5527998185980",
    "Email": "lucasoliveirasantanasouza@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "4",
    "Data perda": "2026-07-14T03:00:37.282Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "yasmin meira moraes",
    "Telefone": "5551980400081",
    "Email": "yasmin.meiramoraes@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "4",
    "Data perda": "2026-07-14T03:00:37.230Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Adriano Figueredo dos Santos",
    "Telefone": "5521992976978",
    "Email": "karolaynethomaz0519@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "4",
    "Data perda": "2026-07-14T03:00:37.215Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Priscyla Crispim",
    "Telefone": "5583986821377",
    "Email": "comiumpudimm@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:37.191Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Roberta Eloisa ",
    "Telefone": "5584981885380",
    "Email": "eloisa30cabral@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": null,
    "Data perda": "2026-07-14T03:00:37.164Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "raquel Novaes",
    "Telefone": "5511943767786",
    "Email": "novaesraquel13@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:37.147Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "ARTHUR DA SILVA PAIVA",
    "Telefone": "5581994786734",
    "Email": "arthurdasilvapaiva14@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:37.122Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Samily Souza",
    "Telefone": "5573988699600",
    "Email": "samilysouza0509@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "1",
    "Data perda": "2026-07-14T03:00:37.076Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Hecilia ",
    "Telefone": "5598992303081",
    "Email": "hecilialima5@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:36.944Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "MATHEUS RAFAEL DOS SANTOS",
    "Telefone": "5511986108006",
    "Email": "MAMALINDO1@ICLOUD.COM",
    "Segmento": "Outro",
    "Tier": "1",
    "Data perda": "2026-07-14T03:00:36.936Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Flávia Silva",
    "Telefone": "55939922427",
    "Email": "mflavia01062000@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "2",
    "Data perda": "2026-07-14T03:00:36.928Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Luiz Gustavo Zecchin Nogueira",
    "Telefone": "5515997890957",
    "Email": "gustavozn@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "4",
    "Data perda": "2026-07-14T03:00:36.911Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Vânia Fernandes ",
    "Telefone": "5511953627395",
    "Email": "mcvania01@hotmail.com",
    "Segmento": "Lanchonete",
    "Tier": null,
    "Data perda": "2026-07-14T03:00:36.897Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ingrid Vargas",
    "Telefone": "5548991200141",
    "Email": "ingridvargasjaques01@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 4",
    "Data perda": "2026-07-14T03:00:36.895Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ionara Sousa",
    "Telefone": "5585996928713",
    "Email": "ionarasousa021@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:36.879Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Maria Nilda Vasconcelos Lima",
    "Telefone": "5585987202451",
    "Email": "988637456ma@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": null,
    "Data perda": "2026-07-14T03:00:36.864Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Paulo Melo",
    "Telefone": "5511999783999",
    "Email": "phdmeloalmeida@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "2",
    "Data perda": "2026-07-14T03:00:36.864Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Elianai Ribeiro Neves de Souza",
    "Telefone": "5531987799092",
    "Email": "elianai.italinea@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:36.850Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Beatriz da Silva",
    "Telefone": "5521980927907",
    "Email": "beatrizsmoliveira@hotmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:36.837Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Fábio Santos ",
    "Telefone": "5512992537099",
    "Email": "mestredasbatatasbrasil@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-14T03:00:36.818Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Claudia Coelho Pereira",
    "Telefone": "5521991794568",
    "Email": "gabbolos3@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:36.807Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "MIcaele José Machado",
    "Telefone": "5561999089542",
    "Email": "cantinhodoartesanato367@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:36.803Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Clara",
    "Telefone": "5588994620242",
    "Email": "auraprime0lojaonline@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:36.793Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Walter Garcia",
    "Telefone": "5516988129860",
    "Email": "mgwaltergarcia@yahoo.com.br",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:36.744Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Taynan ",
    "Telefone": "5521971087482",
    "Email": "tsalvatosimonato@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:36.742Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Giovani",
    "Telefone": "5544997394844",
    "Email": "giovaniblack@hotmail.com",
    "Segmento": "Marmitaria",
    "Tier": "2",
    "Data perda": "2026-07-14T03:00:36.712Z",
    "Motivo": "[PAR] Parceiro não correspondeu às tentativas de contato"
  },
  {
    "Nome": "Thayane da Conceição Silva",
    "Telefone": "5521973195417",
    "Email": "thaygulaberto@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:36.704Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Katia Peron",
    "Telefone": "5513997029779",
    "Email": "katiaperon.kp@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-14T03:00:36.678Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gabriel  hermann",
    "Telefone": "5592986386927",
    "Email": "gabrielhermann157@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:36.664Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Kevin Lucas",
    "Telefone": "5581986435366",
    "Email": "kevin579lucas@icloud.com",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:36.648Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Nelson Goes Giorgi",
    "Telefone": "5512996727689",
    "Email": "restaurantegiorgi@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": null,
    "Data perda": "2026-07-14T03:00:36.624Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Regiane",
    "Telefone": "5519983354292",
    "Email": "regiguster@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:36.608Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Mariana Hoffmann Albuquerque",
    "Telefone": "554196629101",
    "Email": "mari4630@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:36.595Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Paulo de Tasso",
    "Telefone": "5598988538854",
    "Email": "xdwdrfu@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "Tier 1",
    "Data perda": "2026-07-14T03:00:36.579Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ana Paula ",
    "Telefone": "5563991095384",
    "Email": "anafigueiredoo34@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:36.579Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gustavo leite Marcelino",
    "Telefone": "5511917263099",
    "Email": "gustavoleitemarcelino@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-14T03:00:36.579Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Viviane Adriane de Oliveira ",
    "Telefone": "5541998927084",
    "Email": "vivleitester@hotmail.com",
    "Segmento": "Restaurante",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-14T03:00:36.565Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Claudio Oliveira",
    "Telefone": "5511990019920",
    "Email": "newpizzas277@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "Tier 2",
    "Data perda": "2026-07-14T03:00:36.564Z",
    "Motivo": "[PAR] Parceiro não correspondeu às tentativas de contato"
  },
  {
    "Nome": "Altemir lima",
    "Telefone": "5514991422504",
    "Email": "alteirlima625@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:36.551Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Mychele",
    "Telefone": "5521985257932",
    "Email": "Rodriguesmichele916@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-14T03:00:36.548Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Malena bonfim",
    "Telefone": "5516997756221",
    "Email": "valmorenasintra@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-14T03:00:36.538Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "marcelo",
    "Telefone": "5522997925252",
    "Email": "poyoc21743@cadebek.com",
    "Segmento": "Açaiteria",
    "Tier": "4",
    "Data perda": "2026-07-14T03:00:36.537Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "beatriz reis",
    "Telefone": "5571983840698",
    "Email": "beatrizreis944@gmeil.com",
    "Segmento": "Pizzaria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-14T03:00:36.522Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Elimara Ribeiro",
    "Telefone": "5531994037588",
    "Email": "sorvelika@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:36.522Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Eduardo Oliveira",
    "Telefone": "5521980519348",
    "Email": "ciganno.arabia@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "4",
    "Data perda": "2026-07-14T03:00:35.940Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Hakai Sushi Delivery",
    "Telefone": "5555869991100",
    "Email": "geraldofilho.pi@hotmail.com",
    "Segmento": "Sushi",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:35.914Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Lígia",
    "Telefone": "5531998011930",
    "Email": "ligia.prado2021@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:35.640Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Victoria de moraes",
    "Telefone": "5522997141717",
    "Email": "vicmoraes91@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:35.607Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Adriana Rossi Colombelli",
    "Telefone": "5545998067967",
    "Email": "adrianarcolombelli@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-14T03:00:35.605Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Felipe Barbosa da Silva",
    "Telefone": "5519998856300",
    "Email": "fbarbosadesign@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:35.587Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Felipe Carvalho",
    "Telefone": "5521999849674",
    "Email": "felipe.lc90@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:35.571Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Lucas Baiense Vieira",
    "Telefone": "5527998749535",
    "Email": "lucas_bvieira@hotmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:35.480Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Flavia Adriane Maciel Gomes",
    "Telefone": "5555984422627",
    "Email": "gomesadrianemaciel@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-14T03:00:35.416Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Carlos Alberto Romão Romão Silva",
    "Telefone": "5519996430799",
    "Email": "motiroherbal@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-14T03:00:35.341Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "GUILHERME DE SOUZA NOGUEIRA",
    "Telefone": "5547999807096",
    "Email": "nonnarosacanoinhas@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-13T19:20:45.652Z",
    "Motivo": "[IS] Prospect sem interesse"
  },
  {
    "Nome": "TESTE ALE 2",
    "Telefone": "5585974367236",
    "Email": "wergthyjukiokljiuythre54wthyhuj@gmail.com",
    "Segmento": "Outro",
    "Tier": "1",
    "Data perda": "2026-07-13T19:07:26.087Z",
    "Motivo": "[PAR] Perda de teste"
  },
  {
    "Nome": "Igor Girão Rodrigues",
    "Telefone": "5588921715036",
    "Email": "igorgirao97@gmail.com",
    "Segmento": "Sushi",
    "Tier": "1",
    "Data perda": "2026-07-13T19:05:51.265Z",
    "Motivo": "[PAR] Parceiro quer revenda"
  },
  {
    "Nome": "Marcela Rodrigues da Cruz",
    "Telefone": "5516982140312",
    "Email": "marcelarodriguesdac@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "4",
    "Data perda": "2026-07-13T19:02:39.465Z",
    "Motivo": "[IS] Lead desqualificado"
  },
  {
    "Nome": "Karina",
    "Telefone": "5569992178374",
    "Email": "Bemtevigastronomia@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-13T18:56:39.781Z",
    "Motivo": "[IS] Prospect sem interesse"
  },
  {
    "Nome": "Jacinto Medeiros",
    "Telefone": "5521981803589",
    "Email": "jacinto.medeiros13@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "2",
    "Data perda": "2026-07-13T18:53:38.388Z",
    "Motivo": "[IS] Lead desqualificado"
  },
  {
    "Nome": "Darliene Costa",
    "Telefone": "5585991682850",
    "Email": "darlienecosta191@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "4",
    "Data perda": "2026-07-13T18:41:27.024Z",
    "Motivo": "[IS] Lead desqualificado"
  },
  {
    "Nome": "Taciana pereira da silva",
    "Telefone": "5517996179308",
    "Email": "100miseria123@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "3.1",
    "Data perda": "2026-07-13T18:29:31.485Z",
    "Motivo": "[IS][N][IN] Lead nunca respondeu"
  },
  {
    "Nome": "Ana Paula",
    "Telefone": "5521983503440",
    "Email": "annapaulla231@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "2",
    "Data perda": "2026-07-13T18:27:21.615Z",
    "Motivo": "[N] Lead fechou com concorrente"
  },
  {
    "Nome": "Paulo",
    "Telefone": "5585986162688",
    "Email": "paulo_davidson@hotmail.com",
    "Segmento": "Pizzaria",
    "Tier": "4",
    "Data perda": "2026-07-13T18:26:57.358Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "Kbdocesfinos",
    "Telefone": null,
    "Email": "kbdocesfinos@hotmail.com",
    "Segmento": "Confeitaria",
    "Tier": null,
    "Data perda": "2026-07-13T18:25:20.956Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "Morton",
    "Telefone": "5516327191801",
    "Email": "elfieheckq6jiq@khlsch.us",
    "Segmento": "Pizzaria",
    "Tier": "4",
    "Data perda": "2026-07-13T18:24:07.695Z",
    "Motivo": "[IS][BDR] Sem contato com a Empresa"
  },
  {
    "Nome": "Marcelo Rodrigues",
    "Telefone": "5511999311775",
    "Email": "mrodplay@uol.com.br",
    "Segmento": "Pizzaria",
    "Tier": "2",
    "Data perda": "2026-07-13T18:19:12.613Z",
    "Motivo": "[IS] Lead já é cliente"
  },
  {
    "Nome": "JULIA MARIA RODRIGUES DE OLIVEIRA",
    "Telefone": "5586999610112",
    "Email": "bicktrufasbombolos@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-13T18:17:37.722Z",
    "Motivo": "[IS][N][IN] Lead nunca respondeu"
  },
  {
    "Nome": "Josiane",
    "Telefone": "5541995306886",
    "Email": "domraffaellopizzaria@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Data perda": "2026-07-13T18:08:31.546Z",
    "Motivo": "[IS][N][IN] Lead nunca respondeu"
  },
  {
    "Nome": "IANA FRANCISCA DOS SANTOS SILVEIRA",
    "Telefone": "5521993650961",
    "Email": "ianafrancis.ss@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Data perda": "2026-07-13T18:06:00.107Z",
    "Motivo": "[IS] Lead desqualificado"
  },
  {
    "Nome": "igor de sousa umburanas",
    "Telefone": "5537999079889",
    "Email": "estacaodoacaraje98@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-13T17:36:40.334Z",
    "Motivo": "[N] Lead quer fechar no futuro"
  },
  {
    "Nome": "Anayana Antunes",
    "Telefone": "5567991907039",
    "Email": "anayanaantunes.mkt@gmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-13T17:31:03.389Z",
    "Motivo": "[IS] Cliente quer funcionalidade que não temos"
  },
  {
    "Nome": "adega RD",
    "Telefone": "5511922258372",
    "Email": "adegard01@gmail.com",
    "Segmento": "Outro",
    "Tier": "1",
    "Data perda": "2026-07-13T17:18:22.731Z",
    "Motivo": "[IS] Lead desqualificado"
  },
  {
    "Nome": "Carolina Lenz",
    "Telefone": "5551981672200",
    "Email": "musushiecozinha@gmail.com",
    "Segmento": "Sushi",
    "Tier": "1",
    "Data perda": "2026-07-13T17:12:17.928Z",
    "Motivo": "[N] Lead perdeu o interesse no momento"
  },
  {
    "Nome": "Michael reques",
    "Telefone": "5547999431401",
    "Email": "michaelreques@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Data perda": "2026-07-13T17:05:18.943Z",
    "Motivo": "[IS] Lead já é cliente"
  },
  {
    "Nome": "Iago Rafael Melo",
    "Telefone": "5581988783848",
    "Email": "Iagorafael.94@gmail.com",
    "Segmento": "",
    "Tier": "2",
    "Data perda": "2026-07-13T16:54:01.028Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "Rodrigo da Silva Correa",
    "Telefone": "5514991197927",
    "Email": "rodrigounivem@yahoo.com.br",
    "Segmento": "Hamburgueria",
    "Tier": "3.1",
    "Data perda": "2026-07-13T16:51:34.758Z",
    "Motivo": "[N] Lead não tem orçamento"
  },
  {
    "Nome": "Marcos Levi | Lifestyle",
    "Telefone": "5571996861946",
    "Email": "levsibr1234@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-13T16:50:46.049Z",
    "Motivo": "[IS] Prospect sem interesse"
  },
  {
    "Nome": "RAFAE",
    "Telefone": "5542999458257",
    "Email": "depaularafaelcezar@gmail.com",
    "Segmento": "Sushi",
    "Tier": "2",
    "Data perda": "2026-07-13T16:35:59.071Z",
    "Motivo": "[IS] Lead desqualificado"
  },
  {
    "Nome": "Renata",
    "Telefone": "5521983488846",
    "Email": "lamenhoodrio@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Data perda": "2026-07-13T16:30:32.509Z",
    "Motivo": "[IS] Lead duplicado"
  },
  {
    "Nome": "Debora rabello moreno",
    "Telefone": "5513991681336",
    "Email": "deboracoracy2019@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-13T16:17:39.123Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "cristiano",
    "Telefone": "5511999613193",
    "Email": "matosdeoliveiracristiano@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.1",
    "Data perda": "2026-07-13T16:06:37.724Z",
    "Motivo": "[IS] Prospect sem interesse"
  },
  {
    "Nome": "Samuel Silva",
    "Telefone": "5535998263810",
    "Email": "sr.silva.salgados@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "1",
    "Data perda": "2026-07-13T16:03:05.372Z",
    "Motivo": "[IS] Cliente quer funcionalidade que não temos"
  },
  {
    "Nome": "jonathan.afg@gmail.com",
    "Telefone": "5521982251684",
    "Email": "jonathan.afg@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-13T15:58:15.588Z",
    "Motivo": "[N] Lead fechou com concorrente"
  },
  {
    "Nome": "Mirian",
    "Telefone": "(14) 99748-3550",
    "Email": "mirian@gmail.com",
    "Segmento": null,
    "Tier": "Prospecção de Agências",
    "Data perda": "2026-07-13T15:55:59.449Z",
    "Motivo": "[IS][N] Lead não tem orçamento"
  },
  {
    "Nome": "Luan Melo",
    "Telefone": "5585989412193",
    "Email": "luanpmelo946@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "2",
    "Data perda": "2026-07-13T15:52:49.204Z",
    "Motivo": "[IS] Prospect sem interesse"
  },
  {
    "Nome": "Nelci Soares",
    "Telefone": "5545999778542",
    "Email": "lancherocha2025@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "5",
    "Data perda": "2026-07-13T15:46:18.299Z",
    "Motivo": "[N] Lead fechou com concorrente"
  },
  {
    "Nome": "Whelyopessoa",
    "Telefone": "(85) 98507-7705",
    "Email": "whelyopessoa@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-13T15:43:08.239Z",
    "Motivo": "[IS][N] Lead recebeu última tentativa de contato"
  },
  {
    "Nome": "Rogério ",
    "Telefone": "5541984525313",
    "Email": "beneditospizza@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "4",
    "Data perda": "2026-07-13T15:37:46.636Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "Stefano Raimundo",
    "Telefone": "5532991641620",
    "Email": "rafaela2023rafael@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-13T15:34:16.960Z",
    "Motivo": "[IS] Lead desqualificado"
  },
  {
    "Nome": "Rafael Fernandes de Souza",
    "Telefone": "5519982304392",
    "Email": "rafaelfernandes386@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "2",
    "Data perda": "2026-07-13T15:25:06.319Z",
    "Motivo": "[IS] Lead já é cliente"
  },
  {
    "Nome": "Patrícia Silva",
    "Telefone": "5519982451671",
    "Email": "maria.brolezzi13@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "1",
    "Data perda": "2026-07-13T15:00:01.937Z",
    "Motivo": "[IS] Lead desqualificado"
  },
  {
    "Nome": "Willemberg Pereira Santos",
    "Telefone": "5574991100000",
    "Email": "sagbalimentos@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "1",
    "Data perda": "2026-07-13T13:53:45.800Z",
    "Motivo": "[N] Lead fechou com concorrente"
  },
  {
    "Nome": "Camila ",
    "Telefone": "5511974350081",
    "Email": "camomilapudim@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-13T13:40:42.686Z",
    "Motivo": "[IS][N] Lead não tem orçamento"
  },
  {
    "Nome": "JULIO",
    "Telefone": "5528999013226",
    "Email": "julioyahala@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Data perda": "2026-07-13T13:33:31.134Z",
    "Motivo": "[IS] Prospect sem interesse"
  },
  {
    "Nome": "Paulo Montenegro",
    "Telefone": "5511999157057",
    "Email": "mineiraoabc@gmail.com.br",
    "Segmento": "Outro",
    "Tier": "2",
    "Data perda": "2026-07-13T13:32:40.530Z",
    "Motivo": "[IS] Cliente quer funcionalidade que não temos"
  },
  {
    "Nome": "Cristiano da Silva ",
    "Telefone": "5521982397343",
    "Email": "cristianocentergrill@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "1",
    "Data perda": "2026-07-13T13:29:51.457Z",
    "Motivo": "[ERR] Lead queria falar com suporte"
  },
  {
    "Nome": "Thyarla Miranda",
    "Telefone": "5511947801382",
    "Email": "bellasantaines@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "2",
    "Data perda": "2026-07-13T13:10:13.906Z",
    "Motivo": "[IS] Prospect sem interesse"
  },
  {
    "Nome": "Cristiane neves",
    "Telefone": "5531996816793",
    "Email": "cristianenevesdosreis2024@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "4",
    "Data perda": "2026-07-13T12:14:07.745Z",
    "Motivo": "[N] Lead não tem orçamento"
  },
  {
    "Nome": "Pedro",
    "Telefone": "5531996169341",
    "Email": "pedrodirt5@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "2",
    "Data perda": "2026-07-13T11:59:24.983Z",
    "Motivo": "[IS] Lead vai demorar a abrir o delivery (ainda não abriu)"
  },
  {
    "Nome": "Letícia",
    "Telefone": "5516997639335",
    "Email": "leticiaananias@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "4",
    "Data perda": "2026-07-13T11:30:10.574Z",
    "Motivo": "[IS] Lead desqualificado"
  },
  {
    "Nome": "Carolina  Coelho",
    "Telefone": "5521989940489",
    "Email": "anacarolinamattoscoelho@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-13T11:20:23.228Z",
    "Motivo": "[RH] Deixou de responder"
  },
  {
    "Nome": "Victoriaarisi",
    "Telefone": "(48) 98411-7276",
    "Email": "victoriaarisi@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-13T11:06:23.541Z",
    "Motivo": "[IS] Lead só quer saber o preço (porque não tem no site)"
  },
  {
    "Nome": "CLAUDEMIR DE SOUZA BEZERRA",
    "Telefone": "558488350217",
    "Email": "claudemir_rn@hotmail.com",
    "Segmento": "Outro",
    "Tier": "4",
    "Data perda": "2026-07-13T10:49:30.528Z",
    "Motivo": "[N] Lead perdeu o interesse no momento"
  },
  {
    "Nome": "Suelen Cristine Rangel",
    "Telefone": "5521968557793",
    "Email": "suelenrangel03@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "1",
    "Data perda": "2026-07-13T10:49:11.340Z",
    "Motivo": "[IS] Lead desqualificado"
  },
  {
    "Nome": "Keyllasoares",
    "Telefone": "(82) 99139-6242",
    "Email": "keyllasoares2004@gmail.com",
    "Segmento": "Sushi",
    "Tier": "Tier 2",
    "Data perda": "2026-07-13T10:43:15.046Z",
    "Motivo": "[IS][N] Lead recebeu última tentativa de contato"
  },
  {
    "Nome": "Maryellen Dias",
    "Telefone": "(38) 99154-3951",
    "Email": "maryellen_dias@hotmail.com",
    "Segmento": "Restaurante",
    "Tier": "Tier 1",
    "Data perda": "2026-07-13T10:40:03.352Z",
    "Motivo": "[IS][N] Lead recebeu última tentativa de contato"
  },
  {
    "Nome": "Cascopub",
    "Telefone": "(51) 99978-6242",
    "Email": "cascopub@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 1",
    "Data perda": "2026-07-13T10:39:19.627Z",
    "Motivo": "[IS][N] Lead recebeu última tentativa de contato"
  },
  {
    "Nome": "Rdbebidasesalgados",
    "Telefone": "'+55 11 98085 2771",
    "Email": "rdbebidasesalgados2022@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-13T10:36:22.809Z",
    "Motivo": "[IS][N] Lead não tem orçamento"
  },
  {
    "Nome": "Priscylacristina",
    "Telefone": "(21) 97750-6610",
    "Email": "priscylacristina22@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "Tier 1",
    "Data perda": "2026-07-13T10:36:00.626Z",
    "Motivo": "[IS][N] Lead recebeu última tentativa de contato"
  },
  {
    "Nome": "sem",
    "Telefone": null,
    "Email": "sem@gmail.com",
    "Segmento": null,
    "Tier": "Agentes",
    "Data perda": "2026-07-13T10:21:08.780Z",
    "Motivo": "[IS][N] Lead quer fechar no futuro"
  },
  {
    "Nome": "Eduardaagmoreira",
    "Telefone": "(44) 99865-4889",
    "Email": "eduardaagmoreira@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 1",
    "Data perda": "2026-07-13T10:17:57.501Z",
    "Motivo": "[IS][N] Lead recebeu última tentativa de contato"
  },
  {
    "Nome": "Farasmakr",
    "Telefone": "(21) 97728-6762",
    "Email": "farasmakr@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 1",
    "Data perda": "2026-07-13T10:13:14.022Z",
    "Motivo": "[IS][N] Lead recebeu última tentativa de contato"
  },
  {
    "Nome": "Fernando Ferreira",
    "Telefone": "5511988929142",
    "Email": "0879nando@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Data perda": "2026-07-13T09:57:44.526Z",
    "Motivo": "[N] Lead fechou com concorrente"
  },
  {
    "Nome": "Bianca Ozilio",
    "Telefone": "(11) 95950-1511, +1 195-950-1511",
    "Email": "bianca.ozilio@gmail.com",
    "Segmento": null,
    "Tier": "Tier 2",
    "Data perda": "2026-07-13T09:50:37.008Z",
    "Motivo": "[IS][N] Lead fechou com concorrente"
  },
  {
    "Nome": "Becconnicholas",
    "Telefone": "5551992550492, (51) 99255-0492",
    "Email": "becconnicholas@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "Tier 4",
    "Data perda": "2026-07-13T09:45:31.236Z",
    "Motivo": "[IS][N] Lead recebeu última tentativa de contato"
  },
  {
    "Nome": "Jennifer Nepomuceno",
    "Telefone": "5532988325266",
    "Email": "jenifernaiara@hotmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-13T09:40:05.871Z",
    "Motivo": "[IS] Prospect sem interesse"
  },
  {
    "Nome": "Ana Paula Soares de Oliveira Almeida",
    "Telefone": "5515988118721",
    "Email": "paulaoliver82@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": null,
    "Data perda": "2026-07-13T09:34:35.540Z",
    "Motivo": "[IS][N] Lead recebeu última tentativa de contato"
  },
  {
    "Nome": "Douglas ",
    "Telefone": "5581984799860",
    "Email": "Douglasliraa937@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "5",
    "Data perda": "2026-07-13T09:28:47.157Z",
    "Motivo": "[N] Lead não tem orçamento"
  },
  {
    "Nome": "Jackson douglas souza coelho soares",
    "Telefone": "5569992442504",
    "Email": "tropicalpvh@hotmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Data perda": "2026-07-13T09:05:16.932Z",
    "Motivo": "[IS] Prospect sem interesse"
  },
  {
    "Nome": "Heenrique",
    "Telefone": "(84) 99401-0000",
    "Email": "heenrique@gmail.com",
    "Segmento": null,
    "Tier": "Prospecção de Agências",
    "Data perda": "2026-07-13T07:56:21.303Z",
    "Motivo": "[IS][N] Lead recebeu última tentativa de contato"
  },
  {
    "Nome": "Lucas Gomes",
    "Telefone": "5521972706709",
    "Email": "lucasg080194@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "2",
    "Data perda": "2026-07-11T19:57:20.265Z",
    "Motivo": "[IS] Lead já é cliente"
  },
  {
    "Nome": "CARLOS JOSE CABRAL DA SILVA",
    "Telefone": "5582998012710",
    "Email": "SABORESHODELICIA@GMAIL.COM",
    "Segmento": "Restaurante",
    "Tier": "Tier 1",
    "Data perda": "2026-07-11T03:00:53.627Z",
    "Motivo": "[N] Lead desapareceu (estava engajado e sumiu de repente)"
  },
  {
    "Nome": "Márcia Valéria dos Santos Arantes",
    "Telefone": "5521988141832",
    "Email": "arantesmvs@hotmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 5",
    "Data perda": "2026-07-11T03:00:52.558Z",
    "Motivo": "[N] Lead desapareceu (estava engajado e sumiu de repente)"
  },
  {
    "Nome": "Rosângela Rosendo de souza ",
    "Telefone": "5531984240067",
    "Email": "rosangelarozendodesouza23@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "Tier 5",
    "Data perda": "2026-07-11T03:00:52.525Z",
    "Motivo": "[N] Lead desapareceu (estava engajado e sumiu de repente)"
  },
  {
    "Nome": "Maria luiza Barbalho",
    "Telefone": "5584994268989",
    "Email": "marianasconfeitariaa@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "2",
    "Data perda": "2026-07-11T03:00:52.384Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Clara irlane",
    "Telefone": "5581993790535",
    "Email": "claranascimento082112@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "2",
    "Data perda": "2026-07-11T03:00:52.377Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gustavo Alexandre Lima",
    "Telefone": "5519994599177",
    "Email": "mas_ter@hotmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "2",
    "Data perda": "2026-07-11T03:00:52.369Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "CARLOS BATISTA",
    "Telefone": "5532991979536",
    "Email": "caje0032@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "Tier 1",
    "Data perda": "2026-07-11T03:00:52.365Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "FABRICIO BARBOSA",
    "Telefone": "5521965268712",
    "Email": "fabriciobarbosamatola@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "Tier 2",
    "Data perda": "2026-07-11T03:00:52.355Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Andriele cruz",
    "Telefone": "5551995386992",
    "Email": "13andrielecruz@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "1",
    "Data perda": "2026-07-11T03:00:52.326Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Patricia",
    "Telefone": "5551999998493",
    "Email": "patricialutzdearaujo@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "1",
    "Data perda": "2026-07-11T03:00:52.309Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Anny carolliny",
    "Telefone": "5563991265318",
    "Email": "anny_carolliny_rj@hotmail.com",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Data perda": "2026-07-11T03:00:52.298Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "ELEPHANTS PIZZA",
    "Telefone": "5585996520083",
    "Email": "andrea.lima0972@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "2",
    "Data perda": "2026-07-11T03:00:52.296Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Samara michelle ",
    "Telefone": "5588992541882",
    "Email": "alveesmichelle@711gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:52.287Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Fabio",
    "Telefone": "5535991174125",
    "Email": "fabioavelaralves.faa@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "1",
    "Data perda": "2026-07-11T03:00:52.274Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Maria das Gracas Gomes",
    "Telefone": "5511970345032",
    "Email": "maisgreice@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:52.272Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Wallburger - Hamburgueria Artesanal Smash House",
    "Telefone": "5511946647529",
    "Email": "Edu.financaswmb@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:52.262Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "André Luiz Brito Almeida",
    "Telefone": "5531998263065",
    "Email": "divinuh.adm@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "2",
    "Data perda": "2026-07-11T03:00:52.261Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Santo Thadeu",
    "Telefone": "5511981818181",
    "Email": "santothadeu@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "1",
    "Data perda": "2026-07-11T03:00:52.251Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "R.",
    "Telefone": "5511942062200",
    "Email": "Riquelicarla87@gmail.com",
    "Segmento": "",
    "Tier": "2",
    "Data perda": "2026-07-11T03:00:52.223Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Frangão Lanches Divinópolis",
    "Telefone": "5537999075921",
    "Email": "frangaolanches3@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:52.206Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Mirian  Gomes",
    "Telefone": "5555129916540",
    "Email": "mirian.hector@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 2",
    "Data perda": "2026-07-11T03:00:52.201Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "THAYANE",
    "Telefone": "5591992369798",
    "Email": "thayane91braga@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "Tier 1",
    "Data perda": "2026-07-11T03:00:51.444Z",
    "Motivo": "[N] Lead desapareceu (estava engajado e sumiu de repente)"
  },
  {
    "Nome": "Felipe Lima",
    "Telefone": "5582991324564",
    "Email": "luisfelipeoficial2021@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:49.645Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Naiara",
    "Telefone": "5561993922092",
    "Email": "kinhanathan@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-11T03:00:49.644Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Restô Marajó",
    "Telefone": "5591980107793",
    "Email": "sival.g.cunha@outlook.com",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:49.619Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Amanda Correia",
    "Telefone": "5592994674034",
    "Email": "contato.nobretta@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:49.488Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Thássia Juliana de Oliveira",
    "Telefone": "5562981671819",
    "Email": "thassiajuliana20@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:49.476Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Brunna Allicy Alves Cardoso",
    "Telefone": "5562982604821",
    "Email": "brunnaallicy6@gmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-11T03:00:49.334Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jessica Silva",
    "Telefone": "5513981669141",
    "Email": "jessica.pdb@hotmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-11T03:00:49.329Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Solimar Rosa Silva Rosa",
    "Telefone": "5582999399581",
    "Email": "sol_agata_2008@hotmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-11T03:00:49.286Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Glaucia Castilho",
    "Telefone": "5555219737873",
    "Email": "glauciacastilho@gmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-11T03:00:49.284Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Lorrayne Prates maforte",
    "Telefone": "5527999624916",
    "Email": "lorrayneprates670@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-11T03:00:49.280Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Francisco noglas irineu de Holanda",
    "Telefone": "5588981922171",
    "Email": "holandanouglas@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:49.244Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Estefane Lima",
    "Telefone": "5596991234842",
    "Email": "esterlima30@icloud.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-11T03:00:49.238Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "joacir krein",
    "Telefone": "5551995628021",
    "Email": "joacirjosekreinecialtda@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-11T03:00:49.202Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Kaylane Costa",
    "Telefone": "5555119899096",
    "Email": "kaylanedomingoscosta5@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "5",
    "Data perda": "2026-07-11T03:00:49.182Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "CREPE HALL",
    "Telefone": "5583991766676",
    "Email": "crepehall@gmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-11T03:00:49.166Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Mariana Souza Assis",
    "Telefone": "5573981643374",
    "Email": "souzaassismariana29@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:49.158Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Thiago Oliveira Machado",
    "Telefone": "5521983672217",
    "Email": "th6318011@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:49.155Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Sara e Anny",
    "Telefone": "5566996952006",
    "Email": "miicarvalhoxs@gmail.com",
    "Segmento": "Outro",
    "Tier": "4",
    "Data perda": "2026-07-11T03:00:49.146Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "LUCAS DANIEL DA SILVA OLIVEIRA",
    "Telefone": "5562993890414",
    "Email": "ld0527922@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:49.144Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "André Roque de Souza",
    "Telefone": "5511998512324",
    "Email": "casasalgadomania@yahoo.com.br",
    "Segmento": "Lanchonete",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-11T03:00:49.136Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Cleiton Sodre",
    "Telefone": "5561991871383",
    "Email": "cleitonsodre@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:49.133Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Emanuel Araújo - Prosper",
    "Telefone": "5585992206424",
    "Email": "route662025@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:49.124Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "GISLENE GABRIELLY DO ROSARIO SILVA",
    "Telefone": "5562982571351",
    "Email": "silvagislene979@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-11T03:00:49.121Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "CONSORCIO YAMAHA AUTORIZADO",
    "Telefone": "5511946150000",
    "Email": "mrsimplifica@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:49.112Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "TAMIRES FERREIRA DAS NEVES",
    "Telefone": "5521971347262",
    "Email": "tamires.ferreira20@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:49.110Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Luis Claudio",
    "Telefone": "5561983276335",
    "Email": "luis27k@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "1",
    "Data perda": "2026-07-11T03:00:49.100Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jessica",
    "Telefone": "5528999267456",
    "Email": "jessicadebona1971@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:49.087Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Rafaela Antunes",
    "Telefone": "5528999482159",
    "Email": "rafaaffonso15@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:49.062Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Giovana",
    "Telefone": "5511968472016",
    "Email": "oliveirataddeigiovana@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:49.052Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Edimilson Pereira da Silva",
    "Telefone": "5511926021085",
    "Email": "kellycsp1988@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-11T03:00:49.052Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Darci De Jesus Cabral",
    "Telefone": "5511952461801",
    "Email": "cabraldarci02@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": null,
    "Data perda": "2026-07-11T03:00:49.050Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Sheylaem2026",
    "Telefone": "5524992156406",
    "Email": "moisessouza2912@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:49.040Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Beatriz raulino",
    "Telefone": "5547996489239",
    "Email": "beatrizraulino300@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "5",
    "Data perda": "2026-07-11T03:00:49.017Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Francine Mambi Asobo",
    "Telefone": "5561981697332",
    "Email": "fran.m.asobo@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Data perda": "2026-07-11T03:00:49.017Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Rafael ",
    "Telefone": "5521994038554",
    "Email": "rafaelcastilhoni@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:48.927Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Isaque Emanuel ",
    "Telefone": "5531933012989",
    "Email": "pedronalberto2030@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:48.900Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Carlos Leite de Faria",
    "Telefone": "5512982533295",
    "Email": "carlosmackenzie2025@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:48.892Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ana Laura",
    "Telefone": "5514991848930",
    "Email": "aninha456bento@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "4",
    "Data perda": "2026-07-11T03:00:48.823Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Dayana vitorio de aguiar",
    "Telefone": "5511915700041",
    "Email": "dayavitorio102419@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-11T03:00:48.726Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Luyane",
    "Telefone": "5522996111903",
    "Email": "luyanedossantos181@gmai.com",
    "Segmento": "Lanchonete",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:48.339Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Thaylor ",
    "Telefone": "5548988217690",
    "Email": "vidanovadeus2025@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "4",
    "Data perda": "2026-07-11T03:00:48.314Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Izabelle Oliveira",
    "Telefone": "5522998852303",
    "Email": "izabellegomes1218@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-11T03:00:48.076Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "KAUA CINTRA ARAUJO",
    "Telefone": "5562981370417",
    "Email": "kauacintra62@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:48.065Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Sara Mayumi Hino",
    "Telefone": "5591982728345",
    "Email": "saramhino@gmail.com",
    "Segmento": "Outro",
    "Tier": "4",
    "Data perda": "2026-07-11T03:00:47.891Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Marcio",
    "Telefone": "5511988254230",
    "Email": "marcioalmeidart@gmail.com",
    "Segmento": "Outro",
    "Tier": "4",
    "Data perda": "2026-07-11T03:00:47.838Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Thais santos",
    "Telefone": "5521965094223",
    "Email": "cakesthais@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-11T03:00:47.813Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jaqueline Gomes dos Santos Castr3o",
    "Telefone": "5565996695380",
    "Email": "naiobidocesgourmet@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:47.799Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Helton",
    "Telefone": "5585984106617",
    "Email": "heltoncenl@gmail.com",
    "Segmento": "",
    "Tier": "5",
    "Data perda": "2026-07-11T03:00:47.792Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Kiara Barreto Raul",
    "Telefone": "5522992123712",
    "Email": "kbarretoraul@gmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-11T03:00:47.768Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "VanBurguer |  Tá de rango? Vem pra VanBurguer!",
    "Telefone": "5571986058934",
    "Email": "valter2018va@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "5",
    "Data perda": "2026-07-11T03:00:47.738Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Giovanna Bromiel",
    "Telefone": "5543988002828",
    "Email": "gibromiel@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-11T03:00:47.724Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Luana Araujo",
    "Telefone": "5511979884000",
    "Email": "luaninha21pega@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "5",
    "Data perda": "2026-07-11T03:00:47.578Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Juliana lira",
    "Telefone": "5521989859532",
    "Email": "miaudelivery@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "5",
    "Data perda": "2026-07-11T03:00:47.564Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Alessandra Alves",
    "Telefone": "5573998380605",
    "Email": "aallessandraalves@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "5",
    "Data perda": "2026-07-11T03:00:47.539Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Edvania",
    "Telefone": "5585997177996",
    "Email": "vaniaribeiro7319@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "5",
    "Data perda": "2026-07-11T03:00:47.526Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Analìna",
    "Telefone": "5586998267667",
    "Email": "mariaanalina@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Data perda": "2026-07-11T03:00:47.421Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Vanderson Oliveira",
    "Telefone": "5524993215804",
    "Email": "dersonmarcolam2119@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "5",
    "Data perda": "2026-07-11T03:00:47.409Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Marcelo Albuquerque sarmento",
    "Telefone": "5591992664785",
    "Email": "marceloalbuquerquesarmentoa@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "5",
    "Data perda": "2026-07-11T03:00:47.392Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Yara neves",
    "Telefone": "5588982335439",
    "Email": "yaraneves2112@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "4",
    "Data perda": "2026-07-11T03:00:47.383Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Evelin Daiane Bernardes Sampaio ",
    "Telefone": "5515981329538",
    "Email": "daianinhaevelyn95@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:47.371Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Guelter Fernandes",
    "Telefone": "5527998392667",
    "Email": "guelterfernandes09@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "5",
    "Data perda": "2026-07-11T03:00:47.357Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Time | Pizzaria  em Conselheiro Lafaiete",
    "Telefone": "5531982914004",
    "Email": "Christianmelo2018@outlook.com",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.356Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Aline Freitas",
    "Telefone": "5527998739972",
    "Email": "alinefrefel.af@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.355Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Tô na Tana",
    "Telefone": "5512982623738",
    "Email": "tana_bsq@hotmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.347Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "WBruno",
    "Telefone": "5561991503589",
    "Email": "wbrunosilva11@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.346Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Maria Eduarda Rodrigues Calori",
    "Telefone": "5518997778173",
    "Email": "calorimariaeduarda50@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.344Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ricardo C",
    "Telefone": "5521999950510",
    "Email": "rickconde@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-11T03:00:47.334Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jean Melo",
    "Telefone": "5587981621569",
    "Email": "jeanmelo028@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.334Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Francisco Pereira dos Santos",
    "Telefone": "5585992751331",
    "Email": "franciscogtl@hotmail.com",
    "Segmento": "Outro",
    "Tier": null,
    "Data perda": "2026-07-11T03:00:47.325Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jeferson istaleo da silva",
    "Telefone": "5514998671594",
    "Email": "jefersonsilva783@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.323Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "AÇAÍ DO BITTEN",
    "Telefone": "5561991709258",
    "Email": "sampaiojullia5@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-11T03:00:47.322Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Valéria Lopes",
    "Telefone": "5511945359256",
    "Email": "lela.lopes1974@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": null,
    "Data perda": "2026-07-11T03:00:47.314Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Pedro Cerqueira",
    "Telefone": "5575999449863",
    "Email": "casadopastel2k26@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.311Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jéssica",
    "Telefone": "5511953319632",
    "Email": "marjessconfeitaria@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.311Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Rodrigo Freitas",
    "Telefone": "5562985637690",
    "Email": "pubdottgastrobar@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.311Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Lucas de Lima Silva",
    "Telefone": "5584994577123",
    "Email": "limalucas514@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Data perda": "2026-07-11T03:00:47.301Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Santorini Lounge",
    "Telefone": "5531984134384",
    "Email": "emanuel.marisom99@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.299Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Tainara Figueredo",
    "Telefone": "5548998286079",
    "Email": "tainaraalisson12@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.298Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Manoel",
    "Telefone": "5585991724377",
    "Email": "manoelbg885@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.298Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Samuel Gomes",
    "Telefone": "5562981766658",
    "Email": "devsarigom@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.288Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "William Kamila Francisco",
    "Telefone": "5542988734904",
    "Email": "quetalbancarochef@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.288Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Fernanda Helena",
    "Telefone": "5534999230918",
    "Email": "fernandahelena3122@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.287Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Laryne Bonfim Barbosa",
    "Telefone": "5585991902992",
    "Email": "larynebonfim95@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.284Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "altivo Soares Neto",
    "Telefone": "5511916462931",
    "Email": "altivosoares03@gmail.com",
    "Segmento": "Outro",
    "Tier": null,
    "Data perda": "2026-07-11T03:00:47.276Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Márcio Venâncio",
    "Telefone": "5535984727374",
    "Email": "marciochrisfamilia@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.275Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Raimundo Moreira",
    "Telefone": "5592991760845",
    "Email": "raimundomoreira38pinto@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-11T03:00:47.275Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Paulo Andrade de Souza",
    "Telefone": "5521991505967",
    "Email": "yakifomeyakisoba@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-11T03:00:47.266Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "REPÚBLICA",
    "Telefone": "5568996027401",
    "Email": "mateusbarros26052004@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.264Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Pricila",
    "Telefone": "5538998328633",
    "Email": "pricilanunes2102@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.259Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Eduardo Felipe Santos de Oliveira Felipe",
    "Telefone": "5582994230696",
    "Email": "eduardo.empreendedor.adm@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.253Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Marcelo Lobo",
    "Telefone": "5522999022428",
    "Email": "marcelolobot.crespo@gmail.com",
    "Segmento": "Sushi",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.253Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Fernando Castilha Gonçalves",
    "Telefone": "5517992682456",
    "Email": "fernandocastilhagoncalves@outlook.com",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.251Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Josiane Gonçalves Martins",
    "Telefone": "5517996769655",
    "Email": "loskimosorveteseacai@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.245Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Matheus",
    "Telefone": "5511986630244",
    "Email": "mlelishenrique@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.224Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Luiz souza",
    "Telefone": "5551991188892",
    "Email": "taurinusgourmet@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-11T03:00:47.222Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Marcos ambrosio",
    "Telefone": "5522998424156",
    "Email": "ambrosiozyon@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.220Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Natan M Silveira",
    "Telefone": "5535999544900",
    "Email": "nataansilveira1432@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.217Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Allicy bandeira silva santos",
    "Telefone": "5599984274096",
    "Email": "allicybsilva@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.211Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Márcia Larios",
    "Telefone": "5566996082979",
    "Email": "marcialarios@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.207Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Alex Guedes",
    "Telefone": "5583998415710",
    "Email": "alexboarding@hotmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.207Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Alberto Duarte",
    "Telefone": "5511963209004",
    "Email": "tinhozaga@hotmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.200Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Daniel Gabardo",
    "Telefone": "554197960873",
    "Email": "danielgabardo18@hotmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.199Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Carla Maria bezerra",
    "Telefone": "5581985159493",
    "Email": "carlamariabezerra1@icloud.com",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.195Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Osana Cristina",
    "Telefone": "5521978777684",
    "Email": "osana69.cristina@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.183Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "John Dayvid",
    "Telefone": "5581988001213",
    "Email": "john.dayvid@yahoo.com.br",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.182Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Eliane Oliveira Silva de Alcântara",
    "Telefone": "5562995461241",
    "Email": "oliveirasilvae265@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.176Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "George Gomes",
    "Telefone": "5561998284449",
    "Email": "george.carmo@hotmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.175Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jefferson",
    "Telefone": "5591985594583",
    "Email": "fgabriela1236@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.170Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Tapiok Ed",
    "Telefone": "5583991969702",
    "Email": "ednalvataveira14@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.163Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Deco OLiveira",
    "Telefone": "5519999199727",
    "Email": "peduma123@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.163Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jak Teodoro",
    "Telefone": "5561991229123",
    "Email": "jakteodoro@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.157Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Leonardo frasson",
    "Telefone": "5519996928826",
    "Email": "leonardofrasson@yahoo.com.br",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.152Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Irandim Sena",
    "Telefone": "5596981105635",
    "Email": "irandim011@hotmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.149Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Edílson Camargo",
    "Telefone": "5521977214678",
    "Email": "edilsonmaia115@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.144Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gabriel Vergara Pereira",
    "Telefone": "5553991857617",
    "Email": "gabrielvergarapereira@hotmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-11T03:00:47.135Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Thayron correia da silva",
    "Telefone": "5582993041715",
    "Email": "novothayron@gmail.com",
    "Segmento": "Outro",
    "Tier": null,
    "Data perda": "2026-07-11T03:00:47.125Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jucelaine Paula da Silva",
    "Telefone": "5517981161979",
    "Email": "bellagusto.ata@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.124Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Washington Garcia",
    "Telefone": "5511937194026",
    "Email": "washingtoncp338@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.118Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Anderson Netto",
    "Telefone": "5521994470992",
    "Email": "andersonamil12@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": null,
    "Data perda": "2026-07-11T03:00:47.114Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Philipi Pierre",
    "Telefone": "5569993550949",
    "Email": "philipi_opo_ro@hotmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-11T03:00:47.113Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Leandro barbosa",
    "Telefone": "5511997421376",
    "Email": "Leandrofour@yahoo.com.br",
    "Segmento": "Marmitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.108Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "SAULO",
    "Telefone": "5528999017553",
    "Email": "Saulocostapk@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.102Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Rodrigo Lehnen de Figueiredo",
    "Telefone": "5527999168908",
    "Email": "rodrigolehnen@yahoo.com.br",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.101Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Sharle Almeida da Silva",
    "Telefone": "5532999906077",
    "Email": "sharle46@yahoo.com",
    "Segmento": "Pastelaria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.098Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Harlen Santana",
    "Telefone": "5591980808492",
    "Email": "harlensantana6@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "Tier 1",
    "Data perda": "2026-07-11T03:00:47.097Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Caipira Do Pastel",
    "Telefone": "5575991299953",
    "Email": "caipiradopastel@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.091Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Eliza Carvalho Porto Marins",
    "Telefone": "5522988571022",
    "Email": "elizaacarvalhoo@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.089Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "FILIPE SANTOS DE SENA",
    "Telefone": "5531985856046",
    "Email": "filipesena66@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "1",
    "Data perda": "2026-07-11T03:00:47.087Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Vianzo | Cultura do Café Especial",
    "Telefone": "5577998673189",
    "Email": "Contato@cafevianzo.com",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.085Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "THALES",
    "Telefone": "5531980134437",
    "Email": "pandaoliver@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.079Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Michel Barcellos",
    "Telefone": "5528999224708",
    "Email": "assadosdonacreusa@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.074Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Wesley",
    "Telefone": "5511992610051",
    "Email": "bigd.lanches@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": null,
    "Data perda": "2026-07-11T03:00:47.072Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Mateus Alves",
    "Telefone": "5547988802225",
    "Email": "wm.materiais.empresa@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:47.067Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Vânia Lucia Silva de Oliveira",
    "Telefone": "5522999526555",
    "Email": "vanialuciaoliveira26080122@gmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-11T03:00:47.066Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Faby Santos",
    "Telefone": "5511959293952",
    "Email": "pierresants28@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "5",
    "Data perda": "2026-07-11T03:00:47.059Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Isaque Xavier da Silva ",
    "Telefone": "5585992871834",
    "Email": "isaquexavier015@gmail.com",
    "Segmento": "",
    "Tier": "5",
    "Data perda": "2026-07-11T03:00:47.055Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "José Fernandes alves junior",
    "Telefone": "5577998331110",
    "Email": "dufernandes1992@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:47.029Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Kátia Silene",
    "Telefone": "5571994182172",
    "Email": "ksavasconcelos@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "5",
    "Data perda": "2026-07-11T03:00:47.029Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Fernanda Gimenes",
    "Telefone": "5555419848494",
    "Email": "fernandaproencag@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-11T03:00:47.021Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ricardo Raimundo da Silva ",
    "Telefone": "5535998890327",
    "Email": "ricardoalagoas100@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "5",
    "Data perda": "2026-07-11T03:00:47.007Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Kelly Mara",
    "Telefone": "5527981191240",
    "Email": "kellymara2024@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "5",
    "Data perda": "2026-07-11T03:00:46.996Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Rosimeire de Almeida Albuquerque",
    "Telefone": "5582982242355",
    "Email": "adm.royalgaleteria@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-11T03:00:46.971Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Marines Santos de lima",
    "Telefone": "5511986588913",
    "Email": "santosmarines110@gmail.com",
    "Segmento": "",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:46.964Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Clube do Açaí",
    "Telefone": "552199302629",
    "Email": "prr0205rj@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "5",
    "Data perda": "2026-07-11T03:00:46.959Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Herbert Cláudio",
    "Telefone": "5561985740545",
    "Email": "mcclaudio_@hotmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 2",
    "Data perda": "2026-07-11T03:00:46.935Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Fabricio Silva",
    "Telefone": "5581995468087",
    "Email": "fabriciouulsilva47@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "Tier 1",
    "Data perda": "2026-07-11T03:00:46.931Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Eryck veloso",
    "Telefone": "5585987610546",
    "Email": "verasveloso@yahoo.com.br",
    "Segmento": "Açaiteria",
    "Tier": "Tier 1",
    "Data perda": "2026-07-11T03:00:46.886Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Danny Rodrigues",
    "Telefone": "5513997900223",
    "Email": "rodriguessdanny62@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:46.885Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Dhiego Ferreira",
    "Telefone": "5515991796289",
    "Email": "diego.fereira12@hotmail.com",
    "Segmento": "Pizzaria",
    "Tier": "2",
    "Data perda": "2026-07-11T03:00:46.872Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Vinicius Goulart",
    "Telefone": "5524981675832",
    "Email": "semlimites.food@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "Tier 2",
    "Data perda": "2026-07-11T03:00:46.872Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "FRANCISCO ARAGAO GOMES JUNIOR",
    "Telefone": "5585986060903",
    "Email": "juniorrago@hotmail.com",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Data perda": "2026-07-11T03:00:46.868Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Matheus Galvão",
    "Telefone": "5511924723110",
    "Email": "burguertaloco@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "2",
    "Data perda": "2026-07-11T03:00:46.861Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "William",
    "Telefone": "5582993029647",
    "Email": "pastaerisomcz@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Data perda": "2026-07-11T03:00:46.859Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Eduardo Braga",
    "Telefone": "5598999677573",
    "Email": "Dudizx0@gmail.com",
    "Segmento": "",
    "Tier": "1",
    "Data perda": "2026-07-11T03:00:46.846Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "vitor miyoshi",
    "Telefone": "5517997376900",
    "Email": "goldgrillsteak@outlook.com",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 1",
    "Data perda": "2026-07-11T03:00:46.836Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Adriele Cristina",
    "Telefone": "5585999540311",
    "Email": "adrielecristina6451@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:46.834Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "caio alexandre",
    "Telefone": "5521976384595",
    "Email": "alexandrecaio377@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:46.822Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Lindomar da paixão Miranda",
    "Telefone": "5591984738996",
    "Email": "lindapaixao0@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:46.810Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Vitor pinheiro",
    "Telefone": "5585999999875",
    "Email": "vitorpinheirooficial@outlook.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-11T03:00:46.794Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Alisson De Oliveira Amaro",
    "Telefone": "5527992292005",
    "Email": "alyssonoliveira01@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:46.783Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Camila Carneiro Garcia",
    "Telefone": "5562992579646",
    "Email": "camilacarneiro9225@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:46.781Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Lavinia Góis dos Santos",
    "Telefone": "5574999209749",
    "Email": "lucasssilva200305@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:46.771Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Mauricio Ribeiro",
    "Telefone": "5551982225355",
    "Email": "mauricio@tem.app.br",
    "Segmento": "Hamburgueria",
    "Tier": "5",
    "Data perda": "2026-07-11T03:00:46.758Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Conrado Saraiva Neto Junior",
    "Telefone": "5555969812002",
    "Email": "conradsaraiva1212@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 2",
    "Data perda": "2026-07-11T03:00:46.735Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Rafael",
    "Telefone": "55199658114",
    "Email": "manszhzuzjshsdhdbnss@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:46.639Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Janderson Araújo",
    "Telefone": "5582987652162",
    "Email": "smashers082@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:46.626Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Francisco Lopes Lima",
    "Telefone": "5594992129515",
    "Email": "franciiscolima97@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:46.615Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Alexandre Rocha",
    "Telefone": "5511983027730",
    "Email": "ale.nakupenda@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "2",
    "Data perda": "2026-07-11T03:00:46.591Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Geovana Lacerda",
    "Telefone": "5521968829177",
    "Email": "geovanabernardino20@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-11T03:00:46.577Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Aline",
    "Telefone": "5519981294320",
    "Email": "silvaaline517@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "4",
    "Data perda": "2026-07-11T03:00:46.563Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Renan tonzar",
    "Telefone": "5517997896830",
    "Email": "rtonzar300@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "2",
    "Data perda": "2026-07-11T03:00:46.389Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "jose roberto macedo",
    "Telefone": "5521965690844",
    "Email": "betocaldeireiro@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Data perda": "2026-07-11T03:00:46.337Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Andrea",
    "Telefone": "5521974879925",
    "Email": "dedeiagourmet2010@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:46.320Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Amanda",
    "Telefone": "5521966837038",
    "Email": "lorrainevliese71@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-11T03:00:46.308Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Íris Melo ",
    "Telefone": "5513981383545",
    "Email": "meloiris31@gmail.com",
    "Segmento": "Outro",
    "Tier": "1",
    "Data perda": "2026-07-11T03:00:46.296Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Maria Aparecida dos Santos",
    "Telefone": "5515997566966",
    "Email": "mariaapsantos304@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:46.296Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Vladimir  Alves Amorim",
    "Telefone": "5531987657735",
    "Email": "vladimiramorim2@gmail.com",
    "Segmento": "Outro",
    "Tier": "2",
    "Data perda": "2026-07-11T03:00:46.283Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Edinei Monteiro",
    "Telefone": "554998310023",
    "Email": "edineimonteiro22@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "2",
    "Data perda": "2026-07-11T03:00:46.209Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Victor Sales Segóvia",
    "Telefone": "5562999683234",
    "Email": "paiolemporiorural@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 1",
    "Data perda": "2026-07-11T03:00:46.209Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gustavo Alves",
    "Telefone": "5522999993965",
    "Email": "fritaeoficiall@gmail.com",
    "Segmento": "Outro",
    "Tier": "2",
    "Data perda": "2026-07-11T03:00:46.208Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Marcela Bosco",
    "Telefone": "5511948221277",
    "Email": "marcelabosco7@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:46.197Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "marco antonio ferreira gomes",
    "Telefone": "5521983583524",
    "Email": "marcoformiw2@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": null,
    "Data perda": "2026-07-11T03:00:46.195Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Silvia Chiesse Totti do Amaral",
    "Telefone": "5518996773083",
    "Email": "amaraltotti@outlook.com",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:46.183Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "ANA BEATRIZ DA COSTA NEVES",
    "Telefone": "5585999583727",
    "Email": "anabeatrizdacosta12345@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "1",
    "Data perda": "2026-07-11T03:00:46.182Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jhonatan Magrini",
    "Telefone": "5567981549753",
    "Email": "supremo.burger025@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "1",
    "Data perda": "2026-07-11T03:00:46.145Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Bruno Félix",
    "Telefone": "5511932756665",
    "Email": "brufelix488@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 2",
    "Data perda": "2026-07-11T03:00:46.116Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Stephany Lopes de Sousa",
    "Telefone": "5561993364589",
    "Email": "stephanylopesdesousa0508@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "2",
    "Data perda": "2026-07-11T03:00:46.096Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "William ",
    "Telefone": "5511985379902",
    "Email": "willoliveira99@hotmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 1",
    "Data perda": "2026-07-11T03:00:46.082Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Picos Lanches - Maracajá",
    "Telefone": "5548984551008",
    "Email": "mauricio_poligress@hotmail.com",
    "Segmento": "Lanchonete",
    "Tier": "2",
    "Data perda": "2026-07-11T03:00:46.080Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Victor hugo",
    "Telefone": "5583981531375",
    "Email": "helapet199@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:46.009Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Simeão melo",
    "Telefone": "5592982257595",
    "Email": "symeaoreis@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-11T03:00:45.997Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Livia Monike",
    "Telefone": "5514997668728",
    "Email": "liviamonike236@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:45.926Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "ronaldo luiz",
    "Telefone": "5569992903337",
    "Email": "ronaldoluizfreires13@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:45.917Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Kelly costa",
    "Telefone": "5521964483069",
    "Email": "kellyfamiliacorrea@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:45.915Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Marina Mello",
    "Telefone": "5521979497371",
    "Email": "mary_bnm@hotmail.com",
    "Segmento": "Confeitaria",
    "Tier": "2",
    "Data perda": "2026-07-11T03:00:45.906Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Daisy Aparecida Da Silva",
    "Telefone": "5531982434491",
    "Email": "daisysilva389@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:45.853Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Débora Porto",
    "Telefone": "5521966984680",
    "Email": "londinhadeby@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:45.832Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "BRASEIRO BURGUER",
    "Telefone": "5562998704448",
    "Email": "maironkrutsch@hotmail.com",
    "Segmento": "Hamburgueria",
    "Tier": null,
    "Data perda": "2026-07-11T03:00:45.827Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Roti bar ",
    "Telefone": "5519992978528",
    "Email": "tiana@rebru.com.br",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Data perda": "2026-07-11T03:00:45.814Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Vanessa",
    "Telefone": "5585921479988",
    "Email": "vanroodrigues97@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "1",
    "Data perda": "2026-07-11T03:00:45.813Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Thiago de Jesus Cunha",
    "Telefone": "5521988995956",
    "Email": "thhgu@hotmail.com",
    "Segmento": "Pizzaria",
    "Tier": "2",
    "Data perda": "2026-07-11T03:00:45.803Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gabriela",
    "Telefone": "5511966654853",
    "Email": "marciogomes0480@hotmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "2",
    "Data perda": "2026-07-11T03:00:45.788Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Carlos",
    "Telefone": "5521965318969",
    "Email": "cintiabrivio05@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:45.768Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Diogo Ferreira",
    "Telefone": "5511996206761",
    "Email": "diogo.9620@outlook.com",
    "Segmento": "Outro",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-11T03:00:45.759Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Thifany",
    "Telefone": "5582987186699",
    "Email": "santosthifany067@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:45.758Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "The Wish - Hamburgueria & Choperia",
    "Telefone": "5515998246713",
    "Email": "prfreitas94@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 2",
    "Data perda": "2026-07-11T03:00:45.746Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Amanda",
    "Telefone": "5545991168648",
    "Email": "amandaduartx@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Data perda": "2026-07-11T03:00:45.737Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ellen Andrade",
    "Telefone": "5531993380342",
    "Email": "dikassabores@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Data perda": "2026-07-11T03:00:45.735Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Julio felix",
    "Telefone": "5513997160963",
    "Email": "julionascimentoshoppe@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-11T03:00:45.722Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Bianca azeredo",
    "Telefone": "5521999092285",
    "Email": "biadoceatelie@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "2",
    "Data perda": "2026-07-11T03:00:45.712Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Victor Belo Hermes",
    "Telefone": "5521966988019",
    "Email": "victorbelohermes@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Data perda": "2026-07-11T03:00:45.710Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Diego Estevam ",
    "Telefone": "5511946430095",
    "Email": "diiiestevan@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "1",
    "Data perda": "2026-07-11T03:00:45.706Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Alexandre Félix",
    "Telefone": "5573988340769",
    "Email": "felixalexandre903@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "2",
    "Data perda": "2026-07-11T03:00:45.702Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "anderson pereira leite",
    "Telefone": "5521971812515",
    "Email": "k2beachclub@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Data perda": "2026-07-11T03:00:45.683Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Thais Nachbar",
    "Telefone": "5544991554341",
    "Email": "thaisnachbar20@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "1",
    "Data perda": "2026-07-11T03:00:45.678Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jesumar alves pereira Júnior",
    "Telefone": "5538999853420",
    "Email": "tempcapcut9@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 1",
    "Data perda": "2026-07-11T03:00:45.653Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Anderson ANDERSON ARANTES GONCALVES",
    "Telefone": "5511942622108",
    "Email": "anderson.arantes.242@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "1",
    "Data perda": "2026-07-11T03:00:45.632Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Eduardo ",
    "Telefone": "5565345846686",
    "Email": "matheusgabrieledmai@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": null,
    "Data perda": "2026-07-11T03:00:45.626Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Danielle de Brito",
    "Telefone": "5511973683232",
    "Email": "bp_dani@hotmail.com",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Data perda": "2026-07-11T03:00:45.624Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Claudiane",
    "Telefone": "5522997934851",
    "Email": "goliveiramilani@gmail.com",
    "Segmento": "Outro",
    "Tier": "1",
    "Data perda": "2026-07-11T03:00:45.615Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Bruno Nascimento",
    "Telefone": "5544984290561",
    "Email": "bruno.nascimento98maringa@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:45.614Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ayra Estefane",
    "Telefone": "5594984004399",
    "Email": "bollosbellos@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "2",
    "Data perda": "2026-07-11T03:00:45.611Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Stephany",
    "Telefone": "5511930508261",
    "Email": "teodorostephany5@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 1",
    "Data perda": "2026-07-11T03:00:45.603Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jeniffer Capretz",
    "Telefone": "5511992673254",
    "Email": "jenifferantunis@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "4",
    "Data perda": "2026-07-11T03:00:45.603Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Carlos Alberto Massashigue Sumida",
    "Telefone": "5511954491266",
    "Email": "sumidacarlos@gmail.com",
    "Segmento": "Outro",
    "Tier": "1",
    "Data perda": "2026-07-11T03:00:45.591Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Luiz Antonio",
    "Telefone": "5567999969985",
    "Email": "luizantonio.lisbon@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:45.583Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jose Aristides de Souza",
    "Telefone": "5581986874227",
    "Email": "josearistides201840@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Data perda": "2026-07-11T03:00:45.581Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Samuel Renault",
    "Telefone": "5577991355227",
    "Email": "samrenault@hotmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "2",
    "Data perda": "2026-07-11T03:00:45.579Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Alex",
    "Telefone": "5511978485361",
    "Email": "alexsandro.henriquee22@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "2",
    "Data perda": "2026-07-11T03:00:45.568Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "cleane lourdes santos",
    "Telefone": "5583987183562",
    "Email": "cafedalourdes@hotmail.com",
    "Segmento": "Lanchonete",
    "Tier": "Tier 2",
    "Data perda": "2026-07-11T03:00:45.567Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Carolina Guimarães",
    "Telefone": "5521967673355",
    "Email": "ateliecarolguimaraes@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "2",
    "Data perda": "2026-07-11T03:00:45.557Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Claudinei Gonçalves",
    "Telefone": "5565992725457",
    "Email": "claudiney.siova2015@hotmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 1",
    "Data perda": "2026-07-11T03:00:45.555Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Neto Marsola",
    "Telefone": "5591984306994",
    "Email": "nersola@hotmail.com",
    "Segmento": "Pizzaria",
    "Tier": "2",
    "Data perda": "2026-07-11T03:00:45.554Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ana Victoria",
    "Telefone": "5575992645990",
    "Email": "anavictoriarro@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 2",
    "Data perda": "2026-07-11T03:00:45.537Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jessica de cassia",
    "Telefone": "5547997507622",
    "Email": "jessicaklay230@gmail.com",
    "Segmento": "Outro",
    "Tier": "4",
    "Data perda": "2026-07-11T03:00:45.535Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "KACIANO ALVIM",
    "Telefone": "5532991662685",
    "Email": "kaciano_alvim@hotmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "2",
    "Data perda": "2026-07-11T03:00:45.504Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Luan Santos",
    "Telefone": "5511940147951",
    "Email": "luanmiguel90@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "2",
    "Data perda": "2026-07-11T03:00:45.493Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Reinaldo Guerra",
    "Telefone": "5583988864794",
    "Email": "acompanhamentoobrasccb@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:45.491Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Tigela de Maria Bufft  self-service",
    "Telefone": "5585982005340",
    "Email": "tiagorodriguestrl87@gmail.com",
    "Segmento": "Restaurante",
    "Tier": null,
    "Data perda": "2026-07-11T03:00:45.459Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Anderson Queiroz",
    "Telefone": "5561993560789",
    "Email": "andersonqueiroz.pacific@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:45.448Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Emerson Bastos",
    "Telefone": "5575981752750",
    "Email": "emersonbts08@gmail.com",
    "Segmento": "Restaurante",
    "Tier": null,
    "Data perda": "2026-07-11T03:00:45.448Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Lyessa aparecida",
    "Telefone": "5567991255539",
    "Email": "lyessaguimaraes948@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-11T03:00:45.438Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "JOAO PEDRO DOS SANTOS RANGEL",
    "Telefone": "5522998289524",
    "Email": "joaopedrosr413@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "Tier 1",
    "Data perda": "2026-07-11T03:00:45.438Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Bruna Tobias",
    "Telefone": "5514991267091",
    "Email": "bruna.cafelandia@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:45.429Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Karolaynne Stephany Barbosa Moura",
    "Telefone": "5581994628968",
    "Email": "karolaynnestephany16@icloudgmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:45.380Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Rodrigo Cardoso",
    "Telefone": "5548988513264",
    "Email": "rodrigomoveisrm@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:45.376Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Eduarda Moura ",
    "Telefone": "5569984174010",
    "Email": "mdudamoura589@icloud.com",
    "Segmento": "Outro",
    "Tier": null,
    "Data perda": "2026-07-11T03:00:45.363Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Graziella ",
    "Telefone": "5521996247796",
    "Email": "cakesgrazi2025@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:45.361Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Pedro Henrique dos Santos Gomes",
    "Telefone": "5534997252716",
    "Email": "ph071435@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:45.324Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Emili Cristina",
    "Telefone": "5517996349459",
    "Email": "millybass412@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:45.307Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Darlene filho ribeiro",
    "Telefone": "5555929947254",
    "Email": "joseaugustofranciscodocarmo@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:45.303Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Junior Vieira",
    "Telefone": "5528999787362",
    "Email": "jr.vieirav18@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "2",
    "Data perda": "2026-07-11T03:00:45.271Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Valdemir Brito",
    "Telefone": "5591993295253",
    "Email": "valdemirbrito@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "Tier 2",
    "Data perda": "2026-07-11T03:00:45.245Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Sterfany lima barros",
    "Telefone": "5592986308124",
    "Email": "burguernanys@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:45.234Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "VITOR HUGO",
    "Telefone": "5524981773976",
    "Email": "vitinhohygino@hotmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "1",
    "Data perda": "2026-07-11T03:00:45.045Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "MANOEL FRANCISCO DA SILVA",
    "Telefone": "5573991210683",
    "Email": "manoelsilva8145@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:45.026Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ana Clara",
    "Telefone": "5575983745977",
    "Email": "aninhasilvaa1000@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:45.014Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Elizel Cardoso frança da rocha",
    "Telefone": "5562991626673",
    "Email": "elizeucardoso200777@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:45.013Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Omar Gonçalves",
    "Telefone": "5565999107906",
    "Email": "omarfortes31@gmail.com",
    "Segmento": "Outro",
    "Tier": "1",
    "Data perda": "2026-07-11T03:00:45.002Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "neto morais",
    "Telefone": "556692214276",
    "Email": "netinhoconfresa@hotmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "2",
    "Data perda": "2026-07-11T03:00:45.002Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gustavo Naide",
    "Telefone": "5527998932058",
    "Email": "gustavonaide05@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:44.999Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Debora sangi",
    "Telefone": "5566984532271",
    "Email": "sangidebora366@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:44.991Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Sheila Lima",
    "Telefone": "5511965503907",
    "Email": "lepointsobremesas@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:44.989Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jadelson Brandão",
    "Telefone": "5571999181704",
    "Email": "sardinha49@outlook.com",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:44.989Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Bruna",
    "Telefone": "55119396132",
    "Email": "b.akemy04@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "2",
    "Data perda": "2026-07-11T03:00:44.975Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Bruno Maia",
    "Telefone": "5521999899723",
    "Email": "heroisepizza@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "4",
    "Data perda": "2026-07-11T03:00:44.966Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Dulce Helena Ribeiro",
    "Telefone": "5551981853657",
    "Email": "dulcehelena.ribeiro@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:44.964Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Joysiele Antônio Rodrigues",
    "Telefone": "55389988296",
    "Email": "joysinharodriguesccb23@gmail.com",
    "Segmento": "Outro",
    "Tier": "2",
    "Data perda": "2026-07-11T03:00:44.963Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Rodrigo Silva",
    "Telefone": "5593984331255",
    "Email": "guigo_mcp@hotmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-11T03:00:44.948Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "ANA JÚLIA DA SILVA NASCIMENTO",
    "Telefone": "5592992509732",
    "Email": "nsc.anajulia@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-11T03:00:44.934Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Francisca de Oliveira ventura",
    "Telefone": "5592994495545",
    "Email": "ofrancisca164@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "Tier 1",
    "Data perda": "2026-07-11T03:00:44.933Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Mary Bekas",
    "Telefone": "5519999050212",
    "Email": "Bekasamparo@gmail.com",
    "Segmento": "Outro",
    "Tier": "2",
    "Data perda": "2026-07-11T03:00:44.923Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Adevilson de oliveira ",
    "Telefone": "5542999786302",
    "Email": "entregasiguassu@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-11T03:00:44.922Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Mayara vitrio",
    "Telefone": "5519992186232",
    "Email": "maynhamary@hotmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 1",
    "Data perda": "2026-07-11T03:00:44.922Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Pratinho da naza",
    "Telefone": "5588994852239",
    "Email": "elisbyjfernandes12@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-11T03:00:44.910Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Edvaldo",
    "Telefone": "55199946811",
    "Email": "edvaldorthr@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-11T03:00:44.901Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Império Conveniência",
    "Telefone": "5515998071850",
    "Email": "heitornaufal321@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 2",
    "Data perda": "2026-07-11T03:00:44.897Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Edmilson",
    "Telefone": "5533987075387",
    "Email": "edmilsonsamora4@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:44.885Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Wagner Soares",
    "Telefone": "5511958217048",
    "Email": "sousa.wagnersoares@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-11T03:00:44.871Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Rafael Libério",
    "Telefone": "5537991558786",
    "Email": "raysansanchez3@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "4",
    "Data perda": "2026-07-11T03:00:44.858Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Maria Eduarda Rodrigues da silva",
    "Telefone": "5546999026104",
    "Email": "rodrigues.silva.maria2408@escola.pr.gov.br",
    "Segmento": "Açaiteria",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:44.834Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Carolina",
    "Telefone": "5573991338853",
    "Email": "carolinaoliveira.direito@gmail.com",
    "Segmento": "Outro",
    "Tier": null,
    "Data perda": "2026-07-11T03:00:44.823Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ana Paula Scaffa Shiotsuka",
    "Telefone": "5567996310154",
    "Email": "anascaffa@hotmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-11T03:00:44.809Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Andressa gomes Ferreira",
    "Telefone": "5585999994254",
    "Email": "andressagomes123457o@gmail.com",
    "Segmento": "Sushi",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:44.809Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Izabela",
    "Telefone": "5511953035223",
    "Email": "xavierisabela438@gmail.com",
    "Segmento": "Sushi",
    "Tier": "4",
    "Data perda": "2026-07-11T03:00:44.809Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Sthefanne Kessia",
    "Telefone": "5533984011696",
    "Email": "sthefannekessia67@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-11T03:00:44.799Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Leticia Malaspina Gomes",
    "Telefone": "5514997101821",
    "Email": "leticiamalaspina23@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "1",
    "Data perda": "2026-07-11T03:00:44.798Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Priscilla Suana",
    "Telefone": "5511983547501",
    "Email": "priscillasuana@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-11T03:00:44.798Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "CLAUDIO KARAI TUPÃ NOCEDA",
    "Telefone": "5545998099251",
    "Email": "claudionoceda0@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-11T03:00:44.796Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Daniely Soares",
    "Telefone": "5531989906579",
    "Email": "soaresdaniely18@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:44.785Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gustavo",
    "Telefone": "5561995882120",
    "Email": "gustavoassuncao3138@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:44.777Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ryan Rocha da Silveira",
    "Telefone": "5524992984111",
    "Email": "ryanrochapessoal@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:44.776Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Maurene da costa santos",
    "Telefone": "5594991941910",
    "Email": "maurenedacostasantos@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:44.765Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Livia Mara",
    "Telefone": "5535998419785",
    "Email": "liviamara803@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:44.758Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Pedro silva",
    "Telefone": "5511997656233",
    "Email": "jppedrosilva443@gmail.com",
    "Segmento": "Sushi",
    "Tier": "Tier 5",
    "Data perda": "2026-07-11T03:00:44.754Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Camila Ferreira da Silva",
    "Telefone": "5521972397073",
    "Email": "ferreiradasilvacamila57@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:44.743Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Lizandra Barbosa de Sousa",
    "Telefone": "5585988809475",
    "Email": "lizandrataiba@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:44.739Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Maykon Boechat",
    "Telefone": "5522988282821",
    "Email": "maykynho.boechat@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:44.736Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Alex",
    "Telefone": "558189598124",
    "Email": "alexsaturninodesouza2@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:44.720Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "MAIKON GABRIEL DOS SANTOS SCHULZ",
    "Telefone": "5569993321483",
    "Email": "maikonsantos28@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-11T03:00:44.720Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jorge Barbosa Barbosa",
    "Telefone": "5561998213322",
    "Email": "restsantoprazer@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:44.706Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ruana Letícia Souza Alves",
    "Telefone": "5581999583744",
    "Email": "souzaruana235@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-11T03:00:44.698Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Yasmin ",
    "Telefone": "5562999614048",
    "Email": "yasminaccs2@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:44.594Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Quaini.windson domicio da silva",
    "Telefone": "5561998078136",
    "Email": "ryukaisushieomakase@gmail.com",
    "Segmento": "Sushi",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:44.525Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Carlito Félix",
    "Telefone": "5581987299100",
    "Email": "carlitofelix612@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-11T03:00:44.519Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Larissa gabrielle",
    "Telefone": "5511978729546",
    "Email": "larissa2017manu@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "5",
    "Data perda": "2026-07-11T03:00:44.519Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "assessoria Omega",
    "Telefone": "5519999592852",
    "Email": "assessoriaomega1@gmail.com",
    "Segmento": "Outro",
    "Tier": "1",
    "Data perda": "2026-07-11T03:00:44.491Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "henrique",
    "Telefone": "5511974769527",
    "Email": "henriquebin9914@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Data perda": "2026-07-11T03:00:44.442Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "ROSEMARY TELES",
    "Telefone": "5594981424788",
    "Email": "rosemarytellesdecristo@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:43.679Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Marisa Santos",
    "Telefone": "5511967757009",
    "Email": "marisasantos7@hotmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:43.671Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jonelito Junior",
    "Telefone": "5571999535326",
    "Email": "actualizaalpha@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:43.666Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Thaís Dos Santos de Oliveira",
    "Telefone": "5527999219100",
    "Email": "thaysandolly@gmail.com",
    "Segmento": "Sushi",
    "Tier": null,
    "Data perda": "2026-07-11T03:00:43.637Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Edilene",
    "Telefone": "5543999691534",
    "Email": "edilenejrf@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:43.578Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jessica Gomes",
    "Telefone": "5516997253402",
    "Email": "todahoracs@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "5",
    "Data perda": "2026-07-11T03:00:43.559Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Glauciane Vieira de Oliveira",
    "Telefone": "5521967576581",
    "Email": "glauciannydeoliveira@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:43.525Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Hevelyn Beatriz",
    "Telefone": "5551990168387",
    "Email": "hevelynbeltrao@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:43.510Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Alef Teles",
    "Telefone": "5575988466260",
    "Email": "contatoeualefteles11@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:43.470Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jennyfer Brito",
    "Telefone": "5511995643488",
    "Email": "jennysantos_brito@hotmail.com",
    "Segmento": "Confeitaria",
    "Tier": null,
    "Data perda": "2026-07-11T03:00:43.458Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Cleber Marques",
    "Telefone": "5568992368341",
    "Email": "clebermendes@live.com",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:43.457Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gesse assunção da paixão",
    "Telefone": "5569993618875",
    "Email": "magnataariquemes@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": null,
    "Data perda": "2026-07-11T03:00:43.456Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "maria bittencourt",
    "Telefone": "5531989596409",
    "Email": "bittmarya@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 4",
    "Data perda": "2026-07-11T03:00:43.442Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Sidiney Rodrigues de Oliveira",
    "Telefone": "5592994923360",
    "Email": "indiopapaxana@gmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-11T03:00:43.440Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Maria Isabella",
    "Telefone": "5569992783405",
    "Email": "mariaisabellalini345@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:43.411Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "NATHALIA RAMALHO",
    "Telefone": "5516996458377",
    "Email": "nathaliarvramalho@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Data perda": "2026-07-11T03:00:43.391Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ryan araujo teles",
    "Telefone": "5516993940187",
    "Email": "ryanteles262@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:43.350Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Danielle ",
    "Telefone": "5592992461061",
    "Email": "burgernanys6@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:43.344Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Maria Izabel Gomes",
    "Telefone": "5562984329461",
    "Email": "izabelmit@hotmail.com",
    "Segmento": "Marmitaria",
    "Tier": null,
    "Data perda": "2026-07-11T03:00:43.320Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Clecio de Paula Silva Filho",
    "Telefone": "5566999899789",
    "Email": "cleciodepaula692@gmail.com",
    "Segmento": "Outro",
    "Tier": "4",
    "Data perda": "2026-07-11T03:00:43.316Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Amanda Niejelski",
    "Telefone": "5541996787989",
    "Email": "amanda.niejelski@hotmail.com",
    "Segmento": "Confeitaria",
    "Tier": "4",
    "Data perda": "2026-07-11T03:00:43.284Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Laricia Duarte de mesquita",
    "Telefone": "5585988932807",
    "Email": "sushisudareparquelandia@gmail.com",
    "Segmento": "Sushi",
    "Tier": "4",
    "Data perda": "2026-07-11T03:00:43.272Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "André Phelipe",
    "Telefone": "5538991682375",
    "Email": "andrephelipesantosenge@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "2",
    "Data perda": "2026-07-11T03:00:43.253Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Rafael",
    "Telefone": "5521979117228",
    "Email": "lilianenlouza@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:43.251Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Suzana Da Silva Nunes Mendes",
    "Telefone": "5521985840442",
    "Email": "fis.suzana.nunes@gmail.com",
    "Segmento": "",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:43.219Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Pedro Ribeiro",
    "Telefone": "5562981489671",
    "Email": "admin.vo.duquinha@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:43.209Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "TACIANA FERREIRA DOS SANTOS",
    "Telefone": "5598985112747",
    "Email": "gathacyanaferreira@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:43.203Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Carlos Alberto Matheus Lima Do Carmo",
    "Telefone": "5521985854027",
    "Email": "carlosindiobet@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "Tier 4",
    "Data perda": "2026-07-11T03:00:43.199Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Good Burger House",
    "Telefone": "5561995110829",
    "Email": "goodburgerhouse2021@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:43.196Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gabriel Silva",
    "Telefone": "5527997551212",
    "Email": "gabrielsilvabelo@gmail.com",
    "Segmento": "Outro",
    "Tier": "4",
    "Data perda": "2026-07-11T03:00:43.189Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Davi Gonçalves de Sousa",
    "Telefone": "5511925477479",
    "Email": "sousahamburgueria@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "4",
    "Data perda": "2026-07-11T03:00:43.162Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Tainara",
    "Telefone": "5512997336269",
    "Email": "tainarasamuel2023@gmail.com",
    "Segmento": "Outro",
    "Tier": "2",
    "Data perda": "2026-07-11T03:00:43.158Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Fábio de Lima Santos",
    "Telefone": "5514991220004",
    "Email": "erickmanoelzq7@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:43.149Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Debora",
    "Telefone": "5511970509081",
    "Email": "deborahmorena48@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:43.138Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Evandro Oliveira da Silva",
    "Telefone": "5511951970370",
    "Email": "eo820105@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:43.113Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Quintal da Fogazza",
    "Telefone": "5511974036479",
    "Email": "quintaldafogazzavilaantonieta@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:43.100Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Quintal Do Léo",
    "Telefone": "5511970586363",
    "Email": "leonardobigatto@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "2",
    "Data perda": "2026-07-11T03:00:41.939Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Monique Barbosa de Souza",
    "Telefone": "5521973748613",
    "Email": "barbosamonique607@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-11T03:00:40.528Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jean Carlos Costa Brito",
    "Telefone": "5567981512878",
    "Email": "janjaotranstorno@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "5",
    "Data perda": "2026-07-11T03:00:37.622Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Wellington messias de souza",
    "Telefone": "5519981143804",
    "Email": "batutamessias@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-11T03:00:35.733Z",
    "Motivo": "[N] Lead desapareceu (estava engajado e sumiu de repente)"
  },
  {
    "Nome": "Maycon de sousa lopes",
    "Telefone": "5598991791032",
    "Email": "maycondesousalopes56@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-11T03:00:35.530Z",
    "Motivo": "[N] Lead desapareceu (estava engajado e sumiu de repente)"
  },
  {
    "Nome": "Lauri jarbas pivoto da silvva",
    "Telefone": "5581991877477",
    "Email": "Lauripivoto@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:35.277Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Na Chapa",
    "Telefone": "5522999639723",
    "Email": "nachapaifood@outlook.com",
    "Segmento": "Restaurante",
    "Tier": "Tier 4",
    "Data perda": "2026-07-11T03:00:35.265Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "carlos manuel filipe castilho filipe castilho",
    "Telefone": "5516991873351",
    "Email": "filipecastilho1978@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "4",
    "Data perda": "2026-07-11T03:00:35.245Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "George",
    "Telefone": "5511947626925",
    "Email": "georgejesus012@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:35.205Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Olavo",
    "Telefone": "5551982400266",
    "Email": "olavobarcellos@gmail.com",
    "Segmento": "",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:35.170Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Weslley Lima",
    "Telefone": "5551981998998",
    "Email": "limaluci174@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:35.141Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Paulo Trombetta",
    "Telefone": "5565999964315",
    "Email": "ptrombetta212@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:35.135Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Thamires",
    "Telefone": "5511941442392",
    "Email": "ramosthamires371@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-11T03:00:35.127Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Fabios L Boladão",
    "Telefone": "5521964246895",
    "Email": "fabioslancher@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-11T03:00:35.123Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Antônio Carlos Barbosa",
    "Telefone": "5516996261411",
    "Email": "antoniobarbosa4363@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": null,
    "Data perda": "2026-07-11T03:00:35.109Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Elizabete Goedert bonin",
    "Telefone": "5549999656644",
    "Email": "elizabetegoedertbonin@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:35.049Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Daniela Luiza do Carmo",
    "Telefone": "5511949837357",
    "Email": "danyluy@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 4",
    "Data perda": "2026-07-11T03:00:35.049Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Sergio Carioca",
    "Telefone": "5592992058935",
    "Email": "scarioca444@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:34.991Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Elisângela oliveira de carvalho",
    "Telefone": "5511915135431",
    "Email": "eo675659@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:34.988Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ravena doces",
    "Telefone": "5545998075483",
    "Email": "kemillyklein84@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 4",
    "Data perda": "2026-07-11T03:00:34.973Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Thiago Salustriano",
    "Telefone": "5588993642584",
    "Email": "salustrianothiago492@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:34.915Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gilka Lima",
    "Telefone": "5511654338849",
    "Email": "limagilka45@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:34.900Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Joel Fernandes",
    "Telefone": "5583987239503",
    "Email": "jfdobatidaofernandes@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-11T03:00:34.896Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Davi oliveira",
    "Telefone": "5561982224599",
    "Email": "do307323@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "3.1",
    "Data perda": "2026-07-11T03:00:34.871Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Antônio Joaquim de Oliveira Neto ",
    "Telefone": "5511984434262",
    "Email": "75joaquim@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Data perda": "2026-07-10T18:34:55.910Z",
    "Motivo": "[IS] Quer falar com suporte"
  },
  {
    "Nome": "Eduardo",
    "Telefone": "(85) 99901-2943",
    "Email": "eduardo@gmail.com",
    "Segmento": null,
    "Tier": "Adição manual",
    "Data perda": "2026-07-10T18:15:38.819Z",
    "Motivo": "[REP] Sem interesse no momento"
  },
  {
    "Nome": "Gleyciane Dias Pereira",
    "Telefone": "5562994368709",
    "Email": "gleycianedias2307@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-10T18:15:03.519Z",
    "Motivo": "[REP] Sem interesse no momento"
  },
  {
    "Nome": "Sandubadogotinhaoficial",
    "Telefone": null,
    "Email": "sandubadogotinhaoficial2023@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": null,
    "Data perda": "2026-07-10T18:13:11.436Z",
    "Motivo": "[REP] Sem interesse no momento"
  },
  {
    "Nome": "Juliana ",
    "Telefone": "5511975382330",
    "Email": "ju.isquierdomiron@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-10T18:11:26.210Z",
    "Motivo": "[REP] Sem interesse no momento"
  },
  {
    "Nome": "Viniciustavercosa",
    "Telefone": "(34) 99952-4489",
    "Email": "viniciustavercosa@hotmail.com",
    "Segmento": "Lanchonete",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-10T18:09:19.465Z",
    "Motivo": "[REP] Sem interesse no momento"
  },
  {
    "Nome": "Alexdeaquinocosta",
    "Telefone": "(18) 98131-5372",
    "Email": "alexdeaquinocosta@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 5",
    "Data perda": "2026-07-10T18:01:25.835Z",
    "Motivo": "[IS] Prospect sem interesse"
  },
  {
    "Nome": "Vieiragerson",
    "Telefone": "(81) 99369-7603, (83) 99693-2796",
    "Email": "vieiragerson231@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-10T18:00:46.325Z",
    "Motivo": "[REP] Sem interesse no momento"
  },
  {
    "Nome": "Ewerton J M",
    "Telefone": "21969190471",
    "Email": "ewerton.j.m@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "Tier 1",
    "Data perda": "2026-07-10T18:00:09.690Z",
    "Motivo": "[REP] Sem interesse no momento"
  },
  {
    "Nome": "Lucas Leal L",
    "Telefone": "(61) 99214-4961",
    "Email": "lucas.leal.l@hotmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-10T17:58:37.201Z",
    "Motivo": "[IS][N] Lead recebeu última tentativa de contato"
  },
  {
    "Nome": "Marcelo Ferreira Batista",
    "Telefone": "5555199925405",
    "Email": "ferreirabatistamarcelo80@gmail.com",
    "Segmento": "Outro",
    "Tier": "4",
    "Data perda": "2026-07-10T17:46:39.074Z",
    "Motivo": "[IS] Lead com contato indisponível"
  },
  {
    "Nome": "Igor Ribeiro Nascimento",
    "Telefone": "5581984043863",
    "Email": "igorgold2004@icloud.com",
    "Segmento": "Açaiteria",
    "Tier": "2",
    "Data perda": "2026-07-10T16:15:03.370Z",
    "Motivo": "[IS] Prospect sem interesse"
  },
  {
    "Nome": "",
    "Telefone": "5521964687866",
    "Email": null,
    "Segmento": null,
    "Tier": null,
    "Data perda": "2026-07-10T16:10:06.900Z",
    "Motivo": "[ERR] Lead queria falar com suporte"
  },
  {
    "Nome": "gustavo",
    "Telefone": "55999092523",
    "Email": "gustavobera@icloud.com",
    "Segmento": null,
    "Tier": null,
    "Data perda": "2026-07-10T16:06:16.987Z",
    "Motivo": "[IS][LF] Cliente quer funcionalidade que não temos"
  },
  {
    "Nome": "...",
    "Telefone": "(85) 98180-1328",
    "Email": "...",
    "Segmento": null,
    "Tier": "Adição manual",
    "Data perda": "2026-07-10T15:34:58.579Z",
    "Motivo": "[IS][N] Lead recebeu última tentativa de contato"
  },
  {
    "Nome": "Junior Lima",
    "Telefone": "5521992914348",
    "Email": "Nelimentos2022@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-10T15:34:03.721Z",
    "Motivo": "[IS][N] Lead recebeu última tentativa de contato"
  },
  {
    "Nome": "Cristiano Maia",
    "Telefone": "5585991118566",
    "Email": "cristianomaia2507@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "5",
    "Data perda": "2026-07-10T15:19:50.467Z",
    "Motivo": "[IS] Lead duplicado"
  },
  {
    "Nome": "Jean de Oliveira",
    "Telefone": "5519993517810",
    "Email": "jean.oliveira.1251@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-10T15:01:55.005Z",
    "Motivo": "[IS][N] Lead quer testar concorrente"
  },
  {
    "Nome": "Valdir Moraes dos Santos",
    "Telefone": "5573981289645",
    "Email": "moraesecarvalho@hotmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Data perda": "2026-07-10T14:21:17.527Z",
    "Motivo": "[IS] Lead duplicado"
  },
  {
    "Nome": "Geovanecliveira",
    "Telefone": null,
    "Email": "geovanecliveira@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "Tier 1",
    "Data perda": "2026-07-10T14:07:50.769Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "CLEDSON MONTEIRO DE SOUSA",
    "Telefone": "5561996875529",
    "Email": "cledsonrcr@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "4",
    "Data perda": "2026-07-10T13:25:24.633Z",
    "Motivo": "[N] Lead perdeu o interesse no momento"
  },
  {
    "Nome": "RAFAELA GONZAGA MOREIRA COSTA",
    "Telefone": "5595981295207",
    "Email": "vitrinedosbolosjp@hotmail.com",
    "Segmento": "Confeitaria",
    "Tier": "2",
    "Data perda": "2026-07-10T13:02:04.215Z",
    "Motivo": "[IS] Prospect sem interesse"
  },
  {
    "Nome": "RAFA ROAS",
    "Telefone": "5533997342990",
    "Email": "rafaroasdelivery@gmail.com",
    "Segmento": "Sushi",
    "Tier": "3.1",
    "Data perda": "2026-07-10T11:41:01.999Z",
    "Motivo": "[IS] Prospect sem interesse"
  },
  {
    "Nome": "Douglas Nunes",
    "Telefone": "5551996030039",
    "Email": "acaidamalurs@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "3.1",
    "Data perda": "2026-07-10T11:19:01.067Z",
    "Motivo": "[IS] Lead entrou em contato por engano"
  },
  {
    "Nome": "walker coutinho cunha filho",
    "Telefone": "5583993143005",
    "Email": "walkercunha@hotmail.com",
    "Segmento": "Sushi",
    "Tier": "Tier 1",
    "Data perda": "2026-07-10T11:17:42.759Z",
    "Motivo": "[IS] Prospect sem interesse"
  },
  {
    "Nome": "Alexia",
    "Telefone": "5553991866507",
    "Email": "arprass20@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "2",
    "Data perda": "2026-07-10T11:06:02.345Z",
    "Motivo": "[N] Lead não tem orçamento"
  },
  {
    "Nome": "Maria Joana",
    "Telefone": "5599991310759",
    "Email": "mariajoanaguedes6826@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "5",
    "Data perda": "2026-07-10T10:56:06.478Z",
    "Motivo": "[PAR] Não tem interesse no momento"
  },
  {
    "Nome": "Jeferson Gonçalves da Rocha",
    "Telefone": "5531999893490",
    "Email": "jefersonrocha451@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-10T10:54:03.406Z",
    "Motivo": "[IS] Lead já é cliente"
  },
  {
    "Nome": "Vinicius Dias",
    "Telefone": "5573999142424",
    "Email": "viniciusdias@outlook.com",
    "Segmento": "Açaiteria",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-10T10:53:59.803Z",
    "Motivo": "[RH] Deixou de responder"
  },
  {
    "Nome": "CIbele duartw",
    "Telefone": "5511932063788",
    "Email": "saborescec@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-10T10:38:42.585Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "Valeria Azevedo",
    "Telefone": "5521965349346",
    "Email": "valeriaazevedotacona@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-10T10:37:05.618Z",
    "Motivo": "[IS] Prospect sem interesse"
  },
  {
    "Nome": "Andressa Sthefanie",
    "Telefone": "5582991810580",
    "Email": "deliciasdadessa94@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-10T10:36:08.420Z",
    "Motivo": "[N] Lead não tem orçamento"
  },
  {
    "Nome": "Lianet Trujillo Lemus",
    "Telefone": "5554996919766",
    "Email": "I0438982@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "5",
    "Data perda": "2026-07-10T10:31:26.394Z",
    "Motivo": "[IS] Lead internacional"
  },
  {
    "Nome": "IVAN DE OLIVEIRA BELL JUNIOR",
    "Telefone": "5551984799641",
    "Email": "restaurantepeb@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "4",
    "Data perda": "2026-07-10T10:29:06.861Z",
    "Motivo": "[N] Lead não tem orçamento"
  },
  {
    "Nome": "PATRICIA APARECIDA",
    "Telefone": "5562994558762",
    "Email": "patriciaparecida066@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Data perda": "2026-07-10T10:20:50.355Z",
    "Motivo": "[GOAT][IS] Tem time interno"
  },
  {
    "Nome": "Drikalê Pastelaria",
    "Telefone": "5534992761852",
    "Email": "adriana3658@hotmail.com",
    "Segmento": "Pastelaria",
    "Tier": "5",
    "Data perda": "2026-07-10T10:00:59.678Z",
    "Motivo": "[IS] Lead desqualificado"
  },
  {
    "Nome": "Jordan Braga Daniel",
    "Telefone": "5521972912256",
    "Email": "jordanbraga224@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-10T09:57:37.196Z",
    "Motivo": "[N] Lead não tem orçamento"
  },
  {
    "Nome": "Maraisa",
    "Telefone": "5531981215319",
    "Email": "rockfrangodelivery@gmail.com",
    "Segmento": "Outro",
    "Tier": "1",
    "Data perda": "2026-07-10T09:40:57.578Z",
    "Motivo": "[IS] Prospect sem interesse"
  },
  {
    "Nome": "André",
    "Telefone": "5592981585395",
    "Email": "churrascododeco2019@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Data perda": "2026-07-10T09:38:17.106Z",
    "Motivo": "[IS] Lead já é cliente"
  },
  {
    "Nome": "Cibele Shimizu",
    "Telefone": "5511922874464",
    "Email": "shimidorayaki@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-10T09:32:12.908Z",
    "Motivo": "[IS] Prospect sem interesse"
  },
  {
    "Nome": "Lofcakealdeota",
    "Telefone": "(85) 98800-0812",
    "Email": "lofcakealdeota@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 1",
    "Data perda": "2026-07-10T09:27:20.613Z",
    "Motivo": "[IS][N] Lead recebeu última tentativa de contato"
  },
  {
    "Nome": "Leticia ",
    "Telefone": "5511961149994",
    "Email": "estevesleticia731@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.1",
    "Data perda": "2026-07-10T09:25:39.098Z",
    "Motivo": "[N] Lead fechou com concorrente"
  },
  {
    "Nome": "Dinho ",
    "Telefone": "5579999072535",
    "Email": "josealves6379@gmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-10T09:19:32.900Z",
    "Motivo": "[IS] Cliente quer funcionalidade que não temos"
  },
  {
    "Nome": "Fabio Santana Maciel",
    "Telefone": "5533999352854",
    "Email": "Santanamacielf@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "4",
    "Data perda": "2026-07-10T09:15:22.679Z",
    "Motivo": "[IS] Lead desqualificado"
  },
  {
    "Nome": "Sara Inácio Lima Amaral",
    "Telefone": "5519988738034",
    "Email": "bolodovoo@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "4",
    "Data perda": "2026-07-10T09:15:06.712Z",
    "Motivo": "[GOAT][IS] Tem time interno"
  },
  {
    "Nome": "Mariana Amorim",
    "Telefone": "5519992943351",
    "Email": "divina.mordida.comercial1@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "Tier 2",
    "Data perda": "2026-07-10T03:00:43.074Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Tanicleia Pires dos Santos",
    "Telefone": "5586998210469",
    "Email": "tanicleiapiresdossantos@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:42.537Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Carla Roberta da Silva Barbosa",
    "Telefone": "5581996111204",
    "Email": "maosdemelconfeitariape@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:42.523Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Baita Burgão Tchê | Hambúrguer Artesanal",
    "Telefone": "5587991621829",
    "Email": "klebyaluci@hotmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 2",
    "Data perda": "2026-07-10T03:00:37.168Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Pedro",
    "Telefone": "5567991101419",
    "Email": "p.gil.nunes@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "1",
    "Data perda": "2026-07-10T03:00:37.151Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "MICHAEL PLATINI",
    "Telefone": "5581995784510",
    "Email": "michaelplatini10@hotmail.com",
    "Segmento": "Outro",
    "Tier": "2",
    "Data perda": "2026-07-10T03:00:37.145Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Daniely Pedreti Marino",
    "Telefone": "5519989153719",
    "Email": "dpmarino93@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "2",
    "Data perda": "2026-07-10T03:00:37.104Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Tatiana Félix Taveira Mantovani",
    "Telefone": "5531994959096",
    "Email": "charcutariamantovani@gmail.com",
    "Segmento": "Outro",
    "Tier": "1",
    "Data perda": "2026-07-10T03:00:37.101Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Marília gabriely máximo rodrigues dos santos",
    "Telefone": "55119635547",
    "Email": "promessagourmet@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "2",
    "Data perda": "2026-07-10T03:00:37.088Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Bruno",
    "Telefone": "5521995764374",
    "Email": "brunomaanaim@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 1",
    "Data perda": "2026-07-10T03:00:37.084Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Mirian_crystal",
    "Telefone": "5583999543366",
    "Email": "altamiramedeiros4@gmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:36.294Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Carina ",
    "Telefone": "5565998014614",
    "Email": "carina.acezar@gmail.com",
    "Segmento": "",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:36.283Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Leonardo Santos",
    "Telefone": "5521984228468",
    "Email": "leonardos_nunes@hotmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:36.282Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Danielle ",
    "Telefone": "5599988005299",
    "Email": "danilanches1990@gmail.com",
    "Segmento": null,
    "Tier": null,
    "Data perda": "2026-07-10T03:00:36.279Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Pedro Gusmão",
    "Telefone": "5514988339109",
    "Email": "gusmo.pedro@yahoo.com",
    "Segmento": "Hamburgueria",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:36.269Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Marcelo Oliveira",
    "Telefone": "5579998337904",
    "Email": "marcelogastronomia1@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:36.266Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Francisco Pinheiro de Andrade",
    "Telefone": "5584991575949",
    "Email": "snacktimeseusabor2009@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "Tier 5",
    "Data perda": "2026-07-10T03:00:36.264Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Arthur Lucas da Silva",
    "Telefone": "5582987738850",
    "Email": "arthurlucasdasilva10203040@gmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:36.258Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Oxigiri",
    "Telefone": "5571981686370",
    "Email": "leors75@gmail.com",
    "Segmento": "Sushi",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:36.256Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Kaliandra Gomes",
    "Telefone": "5581991218093",
    "Email": "kaligomes1304@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:36.255Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jadson",
    "Telefone": "5596991796022",
    "Email": "jadson42114@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "4",
    "Data perda": "2026-07-10T03:00:36.240Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Carmem Oliveira",
    "Telefone": "5563992887342",
    "Email": "carmemoliveira9321@hotmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:36.235Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Fabiana Santos Silva",
    "Telefone": "5587988612822",
    "Email": "fab140374@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:36.229Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Bigoli",
    "Telefone": "5554992701722",
    "Email": "directorcamarotto@hotmail.it",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:36.223Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Dalize Lima de melo Aidar",
    "Telefone": "5551999932145",
    "Email": "dalize@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:36.215Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Pedro",
    "Telefone": "5516997590481",
    "Email": "acabamentodeinteriores@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "4",
    "Data perda": "2026-07-10T03:00:36.212Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Viviane Cristina Teixeira",
    "Telefone": "5547997081542",
    "Email": "vivianecristina181@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:36.210Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "armando nadler",
    "Telefone": "553492796620",
    "Email": "armandonadler@gmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:36.198Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Walle Christian Brito",
    "Telefone": "5588988447460",
    "Email": "zhaybrito@gmail.com",
    "Segmento": "Sushi",
    "Tier": "3.2",
    "Data perda": "2026-07-10T03:00:36.194Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Sandra Santos",
    "Telefone": "5571988112013",
    "Email": "cacfinanceiro2020@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:36.186Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Letícia Machado",
    "Telefone": "5521983660743",
    "Email": "leticia.7.oliveira@hotmail.com",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:36.162Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Tainá Pauline roso",
    "Telefone": "5555991752494",
    "Email": "tayroso0910@gmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:36.128Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Marcelo Araujo",
    "Telefone": "5553999941230",
    "Email": "marcelo_araujo1417@outlook.com",
    "Segmento": "Lanchonete",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:36.125Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Lá Casa Dog Burguer",
    "Telefone": "5588997319684",
    "Email": "franciscocleidvandomarques@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:36.113Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Kemmilly Lemos ",
    "Telefone": "5581983001164",
    "Email": "rsb16051996@hotmail.com",
    "Segmento": "Açaiteria",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:36.111Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Emanuelle Nunes",
    "Telefone": "5527998334637",
    "Email": "restaurantemaeefilha14@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:36.111Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Erisley Gomes Fernandes",
    "Telefone": "558494528321",
    "Email": "erisleygomes33@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:36.105Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Maria aldelane Luzia de souza",
    "Telefone": "5585999576448",
    "Email": "aldelanesouza1@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:36.098Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Marco Ruocco",
    "Telefone": "5511999226246",
    "Email": "bethgmdh@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:36.097Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Joel Lino",
    "Telefone": "5511952392392",
    "Email": "ninojnk@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:36.059Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Fernando Monteiro",
    "Telefone": "5521994609052",
    "Email": "fernandocrecirj@outlook.com.br",
    "Segmento": "Lanchonete",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:36.019Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "JC_lanches",
    "Telefone": "5585994310872",
    "Email": "joaobatistadasilva185743@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:35.692Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Waldemir",
    "Telefone": "5586999531235",
    "Email": "waldemirmariano14@gmail.com",
    "Segmento": "Sushi",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:35.688Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Doutor Salgado /salgados de festa São José sc",
    "Telefone": "5548988275073",
    "Email": "gerfsonconceicao23@gmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:35.652Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Estefani Evangelista",
    "Telefone": "5511945983382",
    "Email": "doutorapudim@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:35.646Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Cristiano Oliveira de Souza",
    "Telefone": "5588988466527",
    "Email": "ocristianooliveiradesouza@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:35.621Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Francisleide Bor sges",
    "Telefone": "5579991510669",
    "Email": "francisborges27@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:35.598Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Wanessa Merielly",
    "Telefone": "558198488927",
    "Email": "wancut@outlook.com",
    "Segmento": "Restaurante",
    "Tier": "Tier 5",
    "Data perda": "2026-07-10T03:00:35.584Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Pablo Moises Monte Ferreira",
    "Telefone": "5591999139940",
    "Email": "dr.pablomonte@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:35.532Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "CIRLANDIA FREITAS",
    "Telefone": "5588921546991",
    "Email": "carlosfreitasilva12@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-10T03:00:35.521Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Tatiana Suim",
    "Telefone": "5527996282817",
    "Email": "tatiana.suim81@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:35.521Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Elza carvalho",
    "Telefone": "5562982176828",
    "Email": "elza.regin@hotmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:35.518Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Aline Costa",
    "Telefone": "5541995205136",
    "Email": "docemenina.dm23@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:35.516Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "DOGZ• | Hotdog - Itaborai",
    "Telefone": "5521967789575",
    "Email": "Contatovictorsantanavt@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:35.502Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Explosão da marmita",
    "Telefone": "5511958667024",
    "Email": "tatianemagalhaes644@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:35.491Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Luciana Viana",
    "Telefone": "5521983511890",
    "Email": "lucianaviana.gm@yahoo.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:35.490Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Alexandre Robert",
    "Telefone": "5511951325519",
    "Email": "alexandresousa30@hotmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:35.483Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Elenice",
    "Telefone": "5574999283217",
    "Email": "lanequeirozo@hotmail.com",
    "Segmento": "Marmitaria",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:35.461Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "thay fachinello",
    "Telefone": "5549991073505",
    "Email": "tfachi31@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Data perda": "2026-07-10T03:00:35.449Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Thiago",
    "Telefone": "5575999444938",
    "Email": "thio.olivares@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-10T03:00:35.443Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Caio",
    "Telefone": "5521995500110",
    "Email": "caioabanca@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "Tier 4",
    "Data perda": "2026-07-10T03:00:35.433Z",
    "Motivo": "[N] Lead desapareceu (estava engajado e sumiu de repente)"
  },
  {
    "Nome": "Gabriel lopes",
    "Telefone": "5514996555548",
    "Email": "gaahlopes015@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "4",
    "Data perda": "2026-07-10T03:00:35.405Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Pietra Oliveira",
    "Telefone": "5551980192444",
    "Email": "piietracarolina@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "4",
    "Data perda": "2026-07-10T03:00:35.400Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "PAULO HENRIQUE DE FREITAS CARVALHO",
    "Telefone": "5511967298954",
    "Email": "phfreitasc@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-10T03:00:35.398Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Simone Braga",
    "Telefone": "5521970135068",
    "Email": "bragasimone1107@gmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:35.392Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Pizzaria Araújo",
    "Telefone": "5561996907299",
    "Email": "danielalves143@hotmail.com",
    "Segmento": "Pizzaria",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:35.386Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Giulliana Sabino de Carvalho Andrade dos Santos",
    "Telefone": "5521971912958",
    "Email": "elizetecarvalho336@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Data perda": "2026-07-10T03:00:35.379Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Roner Marinho de Oliveira",
    "Telefone": "5592985829078",
    "Email": "oliveira.roner89@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Data perda": "2026-07-10T03:00:35.371Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Box30 Pizza • Food Trailer para Eventos",
    "Telefone": "5551999217798",
    "Email": "box30pizza@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:35.366Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Natasha Ribeiro ",
    "Telefone": "5585998100580",
    "Email": "natasha_s.ribeiro@yahoo.com.br",
    "Segmento": "Açaiteria",
    "Tier": "3.2",
    "Data perda": "2026-07-10T03:00:35.358Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gabriele dos Santos Teles ",
    "Telefone": "5514999007991",
    "Email": "gabrielesantosteleseliane@gamil.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-10T03:00:35.352Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Evanise mendes",
    "Telefone": "5565999241827",
    "Email": "vanmendys@hotmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:35.344Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Andre Silva",
    "Telefone": "5522992741295",
    "Email": "andrebradock12@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": null,
    "Data perda": "2026-07-10T03:00:35.344Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Doces de Magrela - BOLOS CASEIROS SEPETIBA",
    "Telefone": "5521980662397",
    "Email": "kekinhasz@hotmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:35.329Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Cleane Oliveira",
    "Telefone": "5585998668845",
    "Email": "cleane.oliveira1@icloud.com",
    "Segmento": "Açaiteria",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:35.319Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Vilma Aparecida",
    "Telefone": "5531995740923",
    "Email": "vilmaapferreirarochafelipe@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:35.269Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Stephany fernanda ",
    "Telefone": "5581998459202",
    "Email": "stephanyhilderio2@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-10T03:00:35.259Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Churrascaria a moda da casa",
    "Telefone": "5585996507995",
    "Email": "churrascariaamodadacasaoficial@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:35.250Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Allan Ferreira Santos",
    "Telefone": "5527988448039",
    "Email": "fernandoaclaudia40@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-10T03:00:35.242Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ana Beatriz vidal ",
    "Telefone": "5514991989159",
    "Email": "saborunicobb@gmail.com",
    "Segmento": "",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:35.240Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gismara Lodi Frassato",
    "Telefone": "5517997196169",
    "Email": "gismarafrassato@gmail.com",
    "Segmento": "Outro",
    "Tier": "2",
    "Data perda": "2026-07-10T03:00:35.224Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Myrian Dos Passos",
    "Telefone": "5515991644773",
    "Email": "myriandospassos691@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:35.207Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Monica Danielle",
    "Telefone": "5582998059841",
    "Email": "monicadlm81@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:35.195Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Josilenne Reis",
    "Telefone": "5571991270064",
    "Email": "josir4343@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:35.171Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Giovanna",
    "Telefone": "5515998086068",
    "Email": "gmbatalin@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:35.079Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Flávio Bastos",
    "Telefone": "5521970769130",
    "Email": "flavinhoejhon@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:35.051Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Hugo",
    "Telefone": "5592984666369",
    "Email": "liral8875@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-10T03:00:34.913Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Mirian Rodrigues",
    "Telefone": "5521936183230",
    "Email": "rodriguesrodriguesmirian@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Data perda": "2026-07-10T03:00:34.913Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Tanara Vargas da Cruz",
    "Telefone": "5554992186846",
    "Email": "tanaravargasdacruz@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-10T03:00:34.873Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Rosangela Lopes",
    "Telefone": "5531986298655",
    "Email": "rosangeladeoliveira001@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-10T03:00:34.858Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Marcela",
    "Telefone": "5581994380021",
    "Email": "marcelakarla221213@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:34.852Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Cauã Azevedo",
    "Telefone": "5521993069247",
    "Email": "cauadesouza.13@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-10T03:00:34.843Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Fabiane Façan",
    "Telefone": "5521993923663",
    "Email": "fabianerangel@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:34.841Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Washingto William Cabral da conceição",
    "Telefone": "5575992471486",
    "Email": "vc4telecom@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:34.833Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Casa da Pizza",
    "Telefone": "5575988160045",
    "Email": "raynefrazao23@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:34.793Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Letícia ",
    "Telefone": "5541985214337",
    "Email": "leticia.teixeira-@outlook.com",
    "Segmento": "Outro",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-10T03:00:34.749Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ione c Silva ",
    "Telefone": "5517992284547",
    "Email": "ionecsilva1211@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-10T03:00:34.746Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Alessandra Leao",
    "Telefone": "5591988548040",
    "Email": "lelecrisleao@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "5",
    "Data perda": "2026-07-10T03:00:34.651Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Claudio Aparecido Ramos",
    "Telefone": "5544999253217",
    "Email": "claudinhobrahma_2012@hotmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-10T03:00:34.650Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Rosineia Cruz",
    "Telefone": "5512991222544",
    "Email": "rosineiacruz040@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "4",
    "Data perda": "2026-07-10T03:00:34.635Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Joanna de Toledo",
    "Telefone": "5515981500813",
    "Email": "jojots2601@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-10T03:00:34.619Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Maria Fernanda Viana de Sousa",
    "Telefone": "5598984670698",
    "Email": "mariafernandavianasousa27@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-10T03:00:34.606Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ana Mel",
    "Telefone": "5588982366181",
    "Email": "ana.mel88982366181@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": null,
    "Data perda": "2026-07-10T03:00:34.572Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Edson Souza chef de Cozinha",
    "Telefone": "5544984390965",
    "Email": "edsouza18@hotmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-10T03:00:34.527Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "F E l I P E R A M O N",
    "Telefone": "5521974772828",
    "Email": "feeeliperamon@hotmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-10T03:00:34.527Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Thaynara vieira",
    "Telefone": "5521992635012",
    "Email": "confeitariafiljasdamae@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-10T03:00:34.513Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Cleber Avelino Uchoa Lima",
    "Telefone": "5511937376804",
    "Email": "klebaogk01@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-10T03:00:34.512Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Débora Müller ",
    "Telefone": "5541997252057",
    "Email": "debmuller663@icloud.com",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-10T03:00:34.500Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Naely Santos",
    "Telefone": "5531990704907",
    "Email": "naely9878@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-10T03:00:34.487Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Olavo dos Santos Rezende",
    "Telefone": "556792201551",
    "Email": "olavorbt2015@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-10T03:00:34.486Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Deimaklen Lima de Oliveira",
    "Telefone": "5588993467194",
    "Email": "ldeimaklen@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Data perda": "2026-07-10T03:00:34.416Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Recebimento boulangerie",
    "Telefone": "5511999715354",
    "Email": "recebimentoboulangerie@lejaaz.com.br",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Data perda": "2026-07-10T03:00:34.416Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Lourdes Santos",
    "Telefone": "5511970813780",
    "Email": "mde650@yahoo.com.br",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-10T03:00:34.369Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jp Delivery ",
    "Telefone": "5521978820788",
    "Email": "jp483421@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "4",
    "Data perda": "2026-07-10T03:00:34.368Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "teste não ligar",
    "Telefone": "5585989749496",
    "Email": "teste.nao.ligar@teste.com",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-09T19:20:25.597Z",
    "Motivo": "[PAR] Perda de teste"
  },
  {
    "Nome": "Ana Clara",
    "Telefone": "5512997597985",
    "Email": "anaclararoseta1425@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "1",
    "Data perda": "2026-07-09T18:14:58.110Z",
    "Motivo": "[IS] Prospect sem interesse"
  },
  {
    "Nome": "Geane Eufrásio da Silva",
    "Telefone": "5589994265277",
    "Email": "mf4599829@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 4",
    "Data perda": "2026-07-09T17:35:52.257Z",
    "Motivo": "[IS] Lead desqualificado"
  },
  {
    "Nome": "Gleidney santana Brito ",
    "Telefone": "5575981529449",
    "Email": "gleidneybritoo@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-09T17:30:24.214Z",
    "Motivo": "[IS][PRE] Não é prioridade"
  },
  {
    "Nome": "Uildjan",
    "Telefone": "5591985662896",
    "Email": "uildjan.barbosa.7@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-09T16:38:17.924Z",
    "Motivo": "[IS] Quer falar com suporte"
  },
  {
    "Nome": "Fernando dias",
    "Telefone": "5581998626260",
    "Email": "fernandodias847@gmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-09T16:27:41.312Z",
    "Motivo": "[IS] Lead desqualificado"
  },
  {
    "Nome": "valentim filho",
    "Telefone": "5585999711166",
    "Email": "valentimfilho01@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Data perda": "2026-07-09T16:26:18.101Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "Ustane Lopes Martins",
    "Telefone": "5531996632788",
    "Email": "ustane01@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "2",
    "Data perda": "2026-07-09T16:15:02.615Z",
    "Motivo": "[IS] Lead com contato indisponível"
  },
  {
    "Nome": "MILTON GABRIEL RODRIGUES MACIEL",
    "Telefone": "5533936180461",
    "Email": "miltongrmaciel@gmail.com",
    "Segmento": "Outro",
    "Tier": "1",
    "Data perda": "2026-07-09T15:02:27.155Z",
    "Motivo": "[N] Lead fechou com concorrente"
  },
  {
    "Nome": "Josivan",
    "Telefone": "5585985525997",
    "Email": "ggbarbershop99@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "2",
    "Data perda": "2026-07-09T15:00:35.921Z",
    "Motivo": "[IS] Lead desqualificado"
  },
  {
    "Nome": "Aline",
    "Telefone": "5591981877405",
    "Email": "091983319381aline123@gmail.com",
    "Segmento": "Outro",
    "Tier": null,
    "Data perda": "2026-07-09T14:41:21.945Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "Nany burguer ",
    "Telefone": "5511983246790",
    "Email": "nany_zuca@hotmai.com",
    "Segmento": "Hamburgueria",
    "Tier": "1",
    "Data perda": "2026-07-09T14:32:46.269Z",
    "Motivo": "[N] Lead perdeu o interesse no momento"
  },
  {
    "Nome": "Sérgio Henrique da Silva Carvalho",
    "Telefone": "5521973516041",
    "Email": "tocadogauchogrill2018v@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Data perda": "2026-07-09T14:30:53.487Z",
    "Motivo": "[N] Lead não tem orçamento"
  },
  {
    "Nome": "Dilma Bezerra da Silva",
    "Telefone": "5581985926139",
    "Email": "dilmabezerra905@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Data perda": "2026-07-09T13:05:34.550Z",
    "Motivo": "[N] Lead não tem orçamento"
  },
  {
    "Nome": "Bruno Luiz Bittencourt",
    "Telefone": "5551983241990",
    "Email": "choppdivino@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-09T12:06:47.245Z",
    "Motivo": "[N] Lead fechou com concorrente"
  },
  {
    "Nome": "Thaisa Milena",
    "Telefone": "5581989968553",
    "Email": "thaisamilena46@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "2",
    "Data perda": "2026-07-09T11:58:52.151Z",
    "Motivo": "[N] Lead não tem orçamento"
  },
  {
    "Nome": "Carioca’s Hambúrgueria e Cia",
    "Telefone": "5521972126595",
    "Email": "priscila.bec@hotmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "2",
    "Data perda": "2026-07-09T11:36:59.474Z",
    "Motivo": "[IS] Lead já é cliente"
  },
  {
    "Nome": "Lunna",
    "Telefone": "5585997389907",
    "Email": "lunnaamrr@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Data perda": "2026-07-09T11:35:38.456Z",
    "Motivo": "[IS] Lead duplicado"
  },
  {
    "Nome": "Guilene Lourenço",
    "Telefone": "5517992033026",
    "Email": "guiandreia63@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-09T11:06:57.331Z",
    "Motivo": "[N] Lead não tem orçamento"
  },
  {
    "Nome": "Dayanne",
    "Telefone": "5511952343956",
    "Email": "dayanne.estrelareal@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Data perda": "2026-07-09T10:56:17.732Z",
    "Motivo": "[N] Lead está fechado no momento"
  },
  {
    "Nome": "Emerson Turchatto",
    "Telefone": "5541997499936",
    "Email": "emersonturchatto1982@gmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-09T10:51:35.775Z",
    "Motivo": "[N] Lead fechou com concorrente"
  },
  {
    "Nome": "DOGÃO do KBÇÃO / LANCHONETE",
    "Telefone": "5511988217520",
    "Email": "dogaodokbcaoe10@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-09T10:47:41.919Z",
    "Motivo": "[IS] Lead já é cliente"
  },
  {
    "Nome": "Bruna Martins",
    "Telefone": "5554984491719",
    "Email": "brubs.miro1998@outlook.com",
    "Segmento": "Pizzaria",
    "Tier": "2",
    "Data perda": "2026-07-09T10:46:20.956Z",
    "Motivo": "[IS] Prospect sem interesse"
  },
  {
    "Nome": "Ailton Marcelino",
    "Telefone": "5584994060430",
    "Email": "pizzzagargamel@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Data perda": "2026-07-09T10:35:09.113Z",
    "Motivo": "[IS] Lead com contato indisponível"
  },
  {
    "Nome": "Leda Facundo",
    "Telefone": "5585988808242",
    "Email": "bduardomacedo@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "1",
    "Data perda": "2026-07-09T10:34:23.102Z",
    "Motivo": "[IS] Lead acha que a plataforma não vale o investimento"
  },
  {
    "Nome": "Raimundo Oliveira",
    "Telefone": "5511949991551",
    "Email": "rfeliciooliveira496@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Data perda": "2026-07-09T10:29:08.373Z",
    "Motivo": "[ERR] Lead com número de outra pessoa"
  },
  {
    "Nome": "Marlene Conceição de Carvalho",
    "Telefone": "5598988059564",
    "Email": "exata.marlene@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "3.1",
    "Data perda": "2026-07-09T10:26:53.011Z",
    "Motivo": "[IS] Lead desqualificado"
  },
  {
    "Nome": "Khatlen Rocha Brito",
    "Telefone": "556191201579",
    "Email": "restaurante.mineiraoo@gmail.com",
    "Segmento": "Restaurante",
    "Tier": null,
    "Data perda": "2026-07-09T10:26:37.189Z",
    "Motivo": "[IS] Lead já é cliente"
  },
  {
    "Nome": "Chapadinha iPhones",
    "Telefone": "5598985721358",
    "Email": "mikhaellhomem@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "5",
    "Data perda": "2026-07-09T10:25:53.579Z",
    "Motivo": "[IS] Lead com contato indisponível"
  },
  {
    "Nome": "Tatiane Regine",
    "Telefone": "5555759992123",
    "Email": "andradeetatiane487@gmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-09T10:19:42.781Z",
    "Motivo": "[IS] Lead com contato indisponível"
  },
  {
    "Nome": "Hércules",
    "Telefone": "5521982944005",
    "Email": "hercules7omaz@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Data perda": "2026-07-09T10:05:26.470Z",
    "Motivo": "[IS] Lead quer ser revendedor"
  },
  {
    "Nome": "IAGO XAVIER BRITTO DIAS",
    "Telefone": "5585987352229",
    "Email": "iagodias190681@gmail.com",
    "Segmento": "Outro",
    "Tier": "1",
    "Data perda": "2026-07-09T10:02:38.398Z",
    "Motivo": "[IS] Lead já é cliente"
  },
  {
    "Nome": "Iracilda Gomes Franco",
    "Telefone": "5561992706678",
    "Email": "infinity.iracilda@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Data perda": "2026-07-09T09:59:16.382Z",
    "Motivo": "[N] Lead perdeu o interesse no momento"
  },
  {
    "Nome": "Isadora Ritielly Rodrigues Xavier",
    "Telefone": "5531971598340",
    "Email": "isadora15.rrx@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "2",
    "Data perda": "2026-07-09T09:58:06.100Z",
    "Motivo": "[N] Lead perdeu o interesse no momento"
  },
  {
    "Nome": "Marcelo",
    "Telefone": "5511973349062",
    "Email": "exburguer.vargemgrande@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-09T09:26:29.425Z",
    "Motivo": "[IS][N] Lead fechou com concorrente"
  },
  {
    "Nome": "Mauricio Ferreira da Silva",
    "Telefone": "5511997816609",
    "Email": "mfds.mauricio@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "4",
    "Data perda": "2026-07-09T03:01:21.897Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Karen Costa",
    "Telefone": "5517997035700",
    "Email": "karencosta@goviaglobal.com",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:01:21.896Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Marcio Souza Cabral",
    "Telefone": "5521976427816",
    "Email": "kaua31571810@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "Tier 4",
    "Data perda": "2026-07-09T03:01:21.891Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Larissa Silva",
    "Telefone": "5521992497699",
    "Email": "larissaroxxx78@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:01:21.890Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ângela Michele",
    "Telefone": "5585992503342",
    "Email": "angelasilvasopai@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-09T03:01:21.885Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Maíra",
    "Telefone": "5573991185439",
    "Email": "mairaripoli2015@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-09T03:01:21.873Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Karoline Pereira",
    "Telefone": "5521983254490",
    "Email": "karolaine2008p@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "4",
    "Data perda": "2026-07-09T03:01:21.869Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Atila Sousa",
    "Telefone": "5585989206058",
    "Email": "atilasousa2006@gmail.com",
    "Segmento": "Outro",
    "Tier": "4",
    "Data perda": "2026-07-09T03:01:21.866Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Raquel Marques Silva",
    "Telefone": "5521969008191",
    "Email": "ingridymarques1234@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:01:21.813Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Maria Alice dos t",
    "Telefone": "5581983131592",
    "Email": "985640072manugaby@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": null,
    "Data perda": "2026-07-09T03:01:21.807Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ivolnado Martins",
    "Telefone": "5511965067579",
    "Email": "lorranyluizza@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-09T03:01:21.804Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Isabelly Santo",
    "Telefone": "5511992912399",
    "Email": "isabelly.isabelly22010@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:01:21.793Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Eyshela Priscilla",
    "Telefone": "5582996588201",
    "Email": "eyshelacalvancante@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:01:21.792Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Rodrigo da silva",
    "Telefone": "5582999091962",
    "Email": "dayaneadsr@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "4",
    "Data perda": "2026-07-09T03:01:21.783Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Evandro Santos",
    "Telefone": "5551989691757",
    "Email": "evandror7214@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:01:21.781Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Natália",
    "Telefone": "5581985552308",
    "Email": "natalia.cfcbandeirantes@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:01:21.778Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "ANDRE MARQUES CARDOSO SILVA",
    "Telefone": "5586995486548",
    "Email": "marques.vip33@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:01:21.768Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "DAVI GONCALVES DE SOUSA",
    "Telefone": "5511912286544",
    "Email": "daviparalelepipedo2022@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "4",
    "Data perda": "2026-07-09T03:01:21.765Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "QUEILA Nunes",
    "Telefone": "5511985492142",
    "Email": "qnunes@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-09T03:01:21.756Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Robert  De Jesus",
    "Telefone": "5511988178818",
    "Email": "robertjesus6719@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "Tier 1",
    "Data perda": "2026-07-09T03:01:21.686Z",
    "Motivo": "[N] Lead desapareceu (estava engajado e sumiu de repente)"
  },
  {
    "Nome": "Ariane stayara campos",
    "Telefone": "5581921431227",
    "Email": "skyoficial412@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-09T03:01:21.683Z",
    "Motivo": "[N] Lead desapareceu (estava engajado e sumiu de repente)"
  },
  {
    "Nome": "Kevyn",
    "Telefone": "5566992184746",
    "Email": "kevynpablo34@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "Tier 4",
    "Data perda": "2026-07-09T03:01:21.673Z",
    "Motivo": "[N] Lead desapareceu (estava engajado e sumiu de repente)"
  },
  {
    "Nome": "Esterfane ddos santos silva da costa",
    "Telefone": "5521975833295",
    "Email": "esterfanecosta1965@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-09T03:01:21.673Z",
    "Motivo": "[N] Lead desapareceu (estava engajado e sumiu de repente)"
  },
  {
    "Nome": "Faby Bueno cakes",
    "Telefone": "5511963190816",
    "Email": "fabianasbueno@yahoo.com.br",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-09T03:01:21.639Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Walter",
    "Telefone": "5566996013414",
    "Email": "walter@salefumaca.com",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 1",
    "Data perda": "2026-07-09T03:01:21.634Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Paulo Henrique Da Silva Santos",
    "Telefone": "5511937037255",
    "Email": "veg.cozinhapaladar@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "4",
    "Data perda": "2026-07-09T03:01:21.631Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Natalia V",
    "Telefone": "5594996650823",
    "Email": "nataliav_@outlook.com",
    "Segmento": "Hamburgueria",
    "Tier": "2",
    "Data perda": "2026-07-09T03:01:21.623Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Thays",
    "Telefone": "5545991548429",
    "Email": "poraotoledobar@gmail.com",
    "Segmento": "Outro",
    "Tier": "1",
    "Data perda": "2026-07-09T03:01:21.622Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Cairo",
    "Telefone": "5585987437024",
    "Email": "rootsburguer.co@gmail.com",
    "Segmento": null,
    "Tier": "Adição manual",
    "Data perda": "2026-07-09T03:01:21.620Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Alberto GuzmÃ¡n",
    "Telefone": "5595991630489",
    "Email": "albertojose14620@gmail.com",
    "Segmento": null,
    "Tier": "Tier 2",
    "Data perda": "2026-07-09T03:01:21.617Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "𝐓𝐀𝐁𝐄𝐑𝐍𝐀 𝐃𝐎 𝐎𝐆𝐑𝐎",
    "Telefone": "5521990589551",
    "Email": "tabernadoogrolanches@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "2",
    "Data perda": "2026-07-09T03:01:21.612Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Guilherme Borsoi",
    "Telefone": "5512996002964",
    "Email": "guiborsoi3221@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "2",
    "Data perda": "2026-07-09T03:01:21.609Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "leandro e tavitian",
    "Telefone": "5511961999590",
    "Email": "diretoria@amuur.com.br",
    "Segmento": "Outro",
    "Tier": "Tier 1",
    "Data perda": "2026-07-09T03:01:21.608Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Kelly vale",
    "Telefone": "5585998077480",
    "Email": "sebastianakvale@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "2",
    "Data perda": "2026-07-09T03:01:21.605Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "eduardo maia",
    "Telefone": "5521964805418",
    "Email": "eduardo_maia9@hotmail.com",
    "Segmento": "Marmitaria",
    "Tier": "1",
    "Data perda": "2026-07-09T03:01:21.598Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "LINDOMAR ALVES DA SILVA",
    "Telefone": "5561998138517",
    "Email": "lindomar.celma@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 2",
    "Data perda": "2026-07-09T03:01:21.596Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gustavo Montuan | Gastronomia & Negócios",
    "Telefone": "5511973087620",
    "Email": "gustavomontuan@icloud.com",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 2",
    "Data perda": "2026-07-09T03:01:21.594Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "RODOLFO MORENO DE OLIVEIRA",
    "Telefone": "5518997444931",
    "Email": "rodolfo0oliveira@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-09T03:01:21.594Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Thiago Franco",
    "Telefone": "5511921431214",
    "Email": "thiagotfrancobr@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "5",
    "Data perda": "2026-07-09T03:01:21.583Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Daniela Dias",
    "Telefone": "5565999436962",
    "Email": "contatodanieladias@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 5",
    "Data perda": "2026-07-09T03:01:21.581Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jordana Expresso",
    "Telefone": "5585989747192",
    "Email": "expresscombos@outlook.com",
    "Segmento": "Sushi",
    "Tier": null,
    "Data perda": "2026-07-09T03:01:21.566Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Tainara Martins",
    "Telefone": "5535988954668",
    "Email": "tainaram102@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "2",
    "Data perda": "2026-07-09T03:01:21.540Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Iago",
    "Telefone": "5534996517466",
    "Email": "iagolyniter@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "1",
    "Data perda": "2026-07-09T03:01:21.536Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "MARCELO MARQUES DUARTE",
    "Telefone": "5535997528152",
    "Email": "marceloduarterpt@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:01:21.122Z",
    "Motivo": "[N] Lead desapareceu (estava engajado e sumiu de repente)"
  },
  {
    "Nome": "Danyelly Vieira",
    "Telefone": "5514997928954",
    "Email": "danytheo2018@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "5",
    "Data perda": "2026-07-09T03:01:21.105Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Maiara Moura da Silva",
    "Telefone": "5521967212440",
    "Email": "maiaramoura.contato@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "Tier 4",
    "Data perda": "2026-07-09T03:01:21.081Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Hellen ",
    "Telefone": "5573998386221",
    "Email": "coresabor9@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "1",
    "Data perda": "2026-07-09T03:01:21.050Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Marcos",
    "Telefone": "5511984153717",
    "Email": "marcosgnunes@hotmail.com",
    "Segmento": "Confeitaria",
    "Tier": "1",
    "Data perda": "2026-07-09T03:01:21.047Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Bruno ",
    "Telefone": "5551984494710",
    "Email": "sabordovenenoofc@gmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-09T03:01:20.267Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Karollayne kerolly",
    "Telefone": "5581988194359",
    "Email": "karolkerolly23@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "4",
    "Data perda": "2026-07-09T03:01:20.184Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Geovane Matheus Oliveira da Silva",
    "Telefone": "5548996133022",
    "Email": "tubet818@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:01:20.164Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Sebastiana Rosalina",
    "Telefone": "5512992293511",
    "Email": "goestania63@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-09T03:01:20.141Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gabriel souza",
    "Telefone": "5521972224200",
    "Email": "gabrielsouza122190@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "Tier 5",
    "Data perda": "2026-07-09T03:01:20.120Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Erick Dias Lopes",
    "Telefone": "5598988744256",
    "Email": "erikediaslopes@gmil.com",
    "Segmento": "Lanchonete",
    "Tier": null,
    "Data perda": "2026-07-09T03:01:20.072Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Rodrigo Pereira",
    "Telefone": "5593984035537",
    "Email": "napolipizza2024@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "Tier 1",
    "Data perda": "2026-07-09T03:01:20.066Z",
    "Motivo": "[N] Lead desapareceu (estava engajado e sumiu de repente)"
  },
  {
    "Nome": "Fernando Oliveira",
    "Telefone": "5511981449149",
    "Email": "kabrasaburguer@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "5",
    "Data perda": "2026-07-09T03:01:20.043Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Andreia Laís franco",
    "Telefone": "5545988375476",
    "Email": "sabordeinverno8@gmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-09T03:01:19.720Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Josi  Loureiro",
    "Telefone": "5521998227546",
    "Email": "jovisini@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "5",
    "Data perda": "2026-07-09T03:01:19.702Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Luciana Telles",
    "Telefone": "5511961970260",
    "Email": "lugtelles@hotmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 5",
    "Data perda": "2026-07-09T03:01:19.681Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Wallas marcel pereira da Silva",
    "Telefone": "5562981578551",
    "Email": "wallismarcel789@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "4",
    "Data perda": "2026-07-09T03:01:19.626Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Nathany Boaventura Félix",
    "Telefone": "5519982654791",
    "Email": "thany.marcos@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 5",
    "Data perda": "2026-07-09T03:01:19.600Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Érika Margarida Luiz",
    "Telefone": "55954539043",
    "Email": "margaridaluiz.erika@yahoo.com.br",
    "Segmento": "Confeitaria",
    "Tier": "Tier 2",
    "Data perda": "2026-07-09T03:01:19.585Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Adriely Cléssia",
    "Telefone": "5581982244475",
    "Email": "adrry.css1999@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 4",
    "Data perda": "2026-07-09T03:01:19.572Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Michele Teixeira",
    "Telefone": "5521979085995",
    "Email": "mt7828046@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 5",
    "Data perda": "2026-07-09T03:01:19.563Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Lhorelayne",
    "Telefone": "5521986633341",
    "Email": "lhorelayneferraz861@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:01:19.517Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "felipe andrade silva",
    "Telefone": "5513997775204",
    "Email": "financeiroamericanacai@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "Tier 1",
    "Data perda": "2026-07-09T03:01:19.490Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Mario Sekimura",
    "Telefone": "5565981220988",
    "Email": "mariosekimura@hotmail.com",
    "Segmento": "Restaurante",
    "Tier": "Tier 2",
    "Data perda": "2026-07-09T03:01:19.457Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "TEUSBURGUER",
    "Telefone": "5594999447388",
    "Email": "teus18sousa@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 2",
    "Data perda": "2026-07-09T03:01:19.444Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Maria Priscila Rodrigues do Nascimento",
    "Telefone": "5581983408607",
    "Email": "priscilarodriguees21@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": null,
    "Data perda": "2026-07-09T03:01:19.430Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Otávio",
    "Telefone": "5519997626279",
    "Email": "ecommerce.sweetduo@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-09T03:01:19.415Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jefferson Russo Lima",
    "Telefone": "5591996222586",
    "Email": "jeffersonrussoo@gmail.com",
    "Segmento": "Outro",
    "Tier": "2",
    "Data perda": "2026-07-09T03:01:19.392Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "FABIANA GOMES",
    "Telefone": "5531998488525",
    "Email": "fabinhalegal21@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:01:19.377Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Vinicius",
    "Telefone": "5553991273044",
    "Email": "vinimonteirosouza@outlook.com",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:01:19.376Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ligiane Maria da costa vasconcelos",
    "Telefone": "5585996275847",
    "Email": "ligia.vasconcelos2016@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 1",
    "Data perda": "2026-07-09T03:01:19.364Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Vitoria régia de Lima",
    "Telefone": "5585991483317",
    "Email": "marceloferr642@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:01:19.364Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "JENNIFER APARECIDA",
    "Telefone": "5511959477027",
    "Email": "jenniferfreiresilva13@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "Tier 1",
    "Data perda": "2026-07-09T03:01:19.362Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jullya Alves",
    "Telefone": "5562992433045",
    "Email": "alvesjullya68@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-09T03:01:19.342Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Vitória",
    "Telefone": "5511990365765",
    "Email": "vitoriacaroline18vi@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:01:19.338Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Maria Clara",
    "Telefone": "5534998226343",
    "Email": "delicatebolosedoces@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "1",
    "Data perda": "2026-07-09T03:01:19.322Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Germanna Morais",
    "Telefone": "5585981346061",
    "Email": "germanna_morais@hotmail.com",
    "Segmento": "Restaurante",
    "Tier": "2",
    "Data perda": "2026-07-09T03:01:19.313Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Bruno ",
    "Telefone": "5591981039089",
    "Email": "brunofurtadoaf@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:01:19.311Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "vanessa martins",
    "Telefone": "5521979000440",
    "Email": "nutritintel@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": null,
    "Data perda": "2026-07-09T03:01:19.310Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Carlos Daniel",
    "Telefone": "5514998894547",
    "Email": "9988945carlosdaniel@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:01:19.309Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Miguel Soares",
    "Telefone": "5533987250400",
    "Email": "soaresmiguel67609@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:01:19.300Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "creme sinos",
    "Telefone": "5551981878355",
    "Email": "selmaflorianii@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:01:19.297Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Thaise de Souza pereira",
    "Telefone": "5551994139343",
    "Email": "thaisecollina13@gmail.com",
    "Segmento": "Restaurante",
    "Tier": null,
    "Data perda": "2026-07-09T03:01:19.297Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "jullyclair gomes figueira silva",
    "Telefone": "5521965148089",
    "Email": "graficagomes079@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:01:19.297Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Larissa Ramos",
    "Telefone": "5565993198778",
    "Email": "ramos_lia@icloud.com",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:01:19.286Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "fernanda",
    "Telefone": "5561998675666",
    "Email": "fernandam996@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-09T03:01:19.286Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Luis fernando da Silva Pereira",
    "Telefone": "5583993841967",
    "Email": "luisfernandosilvapr2@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-09T03:01:19.286Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Douglas Felipe",
    "Telefone": "5582982042527",
    "Email": "douglasfpgomes@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:01:19.284Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Mariana Chaves",
    "Telefone": "5521992590213",
    "Email": "chvsmariana@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:01:19.275Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "ANdré Santos",
    "Telefone": "5521996647331",
    "Email": "andre.santos.tests@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-09T03:01:19.273Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Emilly Costa",
    "Telefone": "5521977357902",
    "Email": "ec1009929@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:01:19.271Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Erylazia",
    "Telefone": "5584986304299",
    "Email": "erylaziapmcai@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:01:19.251Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Tropicália Confeitaria Artesanal",
    "Telefone": "5535996713525",
    "Email": "tropicaliadoceria@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:01:19.240Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Brasa",
    "Telefone": "5542998716625",
    "Email": "gabrielawestphaldecastro14@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-09T03:01:19.238Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Nataniel saraiva Sampaio",
    "Telefone": "5586988494726",
    "Email": "natanielsampaio@hotmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "1",
    "Data perda": "2026-07-09T03:01:19.234Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Marcelle Agra Alexandria",
    "Telefone": "5521982285131",
    "Email": "marcelle_alexandria@hotmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:01:19.228Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Tehu grill",
    "Telefone": "5521966549517",
    "Email": "tehugrill@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-09T03:01:19.223Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Carolina ",
    "Telefone": "5566996847418",
    "Email": "carollsiillva15@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-09T03:01:19.201Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Caroline",
    "Telefone": "5566996951435",
    "Email": "carolinemartins09812@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:01:19.179Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Anderson Ther",
    "Telefone": "5522981860439",
    "Email": "andersonther@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:01:19.134Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "William Monteiro",
    "Telefone": "5534999296809",
    "Email": "willmonteiro@outlook.com.br",
    "Segmento": "Outro",
    "Tier": "Tier 1",
    "Data perda": "2026-07-09T03:01:19.133Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "TQ Real | Tequenhos ou Tequeños",
    "Telefone": "5513996356048",
    "Email": "tqreal.br@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-09T03:01:19.122Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "CLENILDA DE OLIVEIRA",
    "Telefone": "5588981490821",
    "Email": "clenildao207@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:01:19.026Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Mariane Alves dos Santos",
    "Telefone": "5571983970704",
    "Email": "rihannasophia1806@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:01:18.822Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Tassiani ",
    "Telefone": "5517991026521",
    "Email": "tassianipereira82@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:01:18.805Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Cristiana Lima Dos Santos",
    "Telefone": "5511973042433",
    "Email": "crisalana354@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": null,
    "Data perda": "2026-07-09T03:01:18.799Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "EDUARDA PEGO DOS SANTOS",
    "Telefone": "5511920509950",
    "Email": "eduarda.santos23pego@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-09T03:01:18.786Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Kamila Cordeiro",
    "Telefone": "5542998123667",
    "Email": "cordeirokamila9@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-09T03:01:18.757Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Augusto Walkasther",
    "Telefone": "5561991404385",
    "Email": "augatao@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:01:18.738Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gildásio Souza Santos",
    "Telefone": "5511962350715",
    "Email": "gildasioweb@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Data perda": "2026-07-09T03:01:18.427Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Paulo Vitor Costa",
    "Telefone": "5547997113522",
    "Email": "paulovitorpvc2016@outlook.com",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:01:18.423Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Celso Araújo",
    "Telefone": "5582999597728",
    "Email": "phellip.araujo@hotmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-09T03:01:18.375Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Juares",
    "Telefone": "5522988043323",
    "Email": "sagres.gotasdouro@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:01:18.368Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Nicoly",
    "Telefone": "5511981272253",
    "Email": "nicolynini299@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-09T03:01:18.350Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "TONY ANDERSON",
    "Telefone": "5521977474299",
    "Email": "tonyandersonlk01@gmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-09T03:01:18.341Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Everado",
    "Telefone": "5521970699324",
    "Email": "franciscoeveraldooliveira565@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-09T03:01:18.339Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Andreza Silva",
    "Telefone": "5591984160083",
    "Email": "andrezasilvao1405@gmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Data perda": "2026-07-09T03:01:18.338Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ingridy marques",
    "Telefone": "5581983390732",
    "Email": "ingridysmarques@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 5",
    "Data perda": "2026-07-09T03:01:18.338Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Suely karine",
    "Telefone": "5581988920527",
    "Email": "suelykarina2308@icloud.com",
    "Segmento": "Lanchonete",
    "Tier": "5",
    "Data perda": "2026-07-09T03:01:18.325Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Rosemeire Teixeira",
    "Telefone": "5511972285890",
    "Email": "tex.meire@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 5",
    "Data perda": "2026-07-09T03:01:18.324Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Victoria Morales",
    "Telefone": "5511987161302",
    "Email": "victoria@keepermidias.com",
    "Segmento": "Outro",
    "Tier": "4",
    "Data perda": "2026-07-09T03:01:18.295Z",
    "Motivo": "[PAR] Parceiro não correspondeu às tentativas de contato"
  },
  {
    "Nome": "maria",
    "Telefone": "5593991269785",
    "Email": "cmariacosta25@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-09T03:01:18.220Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ana Rafaela",
    "Telefone": "5582994292623",
    "Email": "soutorafaela575@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-09T03:01:17.811Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Eucidilei Nunes de Macedo Leley",
    "Telefone": "552197376084",
    "Email": "leleynunesmacedo@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:01:17.806Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Mel Cacau | Confeitaria em Joinville",
    "Telefone": "5547989010172",
    "Email": "elisangelaemel@hotmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:01:17.786Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Annaely pereira",
    "Telefone": "5522999292584",
    "Email": "annaelypereira@icloud.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:01:17.761Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Pastel de feira",
    "Telefone": "5592991244684",
    "Email": "vivibelamodas@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-09T03:01:17.756Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Bruno Rodrigo Vaz da Costa",
    "Telefone": "5534999809472",
    "Email": "massaferapizza@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "5",
    "Data perda": "2026-07-09T03:01:17.741Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Alexandre Vasconcelos",
    "Telefone": "5562994631512",
    "Email": "cozinhadajodeliverymr@gmail.com",
    "Segmento": "Outro",
    "Tier": null,
    "Data perda": "2026-07-09T03:01:17.713Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Kauan",
    "Telefone": "5585921714122",
    "Email": "kauanrholanda@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:01:17.689Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Bruna Nascimento Silveira",
    "Telefone": "5516991587658",
    "Email": "brunasilveira.comunicacao@gmail.com",
    "Segmento": null,
    "Tier": "Adição manual",
    "Data perda": "2026-07-09T03:01:17.683Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Walbert ",
    "Telefone": "5573991917649",
    "Email": "w.palmito@hotmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:01:17.657Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Fernanda zucolau",
    "Telefone": "5519989967327",
    "Email": "ferzucolau85@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:01:17.657Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "hallana ",
    "Telefone": "5566996921412",
    "Email": "cloves_tedesco@outlook.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:01:17.610Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Cleiton Roberto da Silva",
    "Telefone": "5584994142691",
    "Email": "camarapcentrall@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:01:17.587Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "LUCAS MONTOYA",
    "Telefone": "5511940309661",
    "Email": "montoyalucas023@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:01:17.574Z",
    "Motivo": "[N] Lead desapareceu (estava engajado e sumiu de repente)"
  },
  {
    "Nome": "Maria",
    "Telefone": "5591981914663",
    "Email": "jozecabral77@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-09T03:01:17.554Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ane victoria",
    "Telefone": "5548996054336",
    "Email": "anevictoriag@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:01:17.551Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Roselaine",
    "Telefone": "5521987479770",
    "Email": "carlacorreafranca@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-09T03:01:17.516Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Cezar Mangia",
    "Telefone": "5535991399260",
    "Email": "cezar.c.mangia@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:01:17.431Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Rafael Dolsan",
    "Telefone": "5547999309258",
    "Email": "atacado.financeiro@hotmail.com",
    "Segmento": "Pizzaria",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-09T03:01:17.425Z",
    "Motivo": "[N] Lead desapareceu (estava engajado e sumiu de repente)"
  },
  {
    "Nome": "Danilo Melo",
    "Telefone": "558986157562",
    "Email": "danilorheno@hotmail.com",
    "Segmento": "Sushi",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:01:17.412Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jefferson da Silva",
    "Telefone": "5567991910072",
    "Email": "pegemontecg@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:01:17.407Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Paulista Sabores - Açaíteria e Pastelaria (loja e Delivery)",
    "Telefone": "5587999443595",
    "Email": "cleber.cord77@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-09T03:01:17.394Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Matheus ",
    "Telefone": "5519989605096",
    "Email": "matburanello@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-09T03:01:17.375Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Viviane wittrock",
    "Telefone": "5551992287448",
    "Email": "vivianewittrock@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": null,
    "Data perda": "2026-07-09T03:01:17.343Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Beatriz Oliveira",
    "Telefone": "5571982852453",
    "Email": "beatriznascimentodejesusolv40@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "Tier 5",
    "Data perda": "2026-07-09T03:01:17.340Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Mileny Marcelly",
    "Telefone": "5551995804455",
    "Email": "milenymarcellysilva@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "Tier 5",
    "Data perda": "2026-07-09T03:01:17.336Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Larissa de Souza",
    "Telefone": "5524998572347",
    "Email": "empreendedora.sublime@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "5",
    "Data perda": "2026-07-09T03:01:17.330Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Neto Gamarra",
    "Telefone": "5584999283375",
    "Email": "cacacabacos@hotmail.com",
    "Segmento": "Pizzaria",
    "Tier": "5",
    "Data perda": "2026-07-09T03:01:17.325Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Denis Sousa",
    "Telefone": "556699611172",
    "Email": "denis.s.sousa92@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Data perda": "2026-07-09T03:01:17.324Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Aurister DE Siqueira",
    "Telefone": "5561991357215",
    "Email": "oicca2023@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "5",
    "Data perda": "2026-07-09T03:01:17.310Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Fabiana R",
    "Telefone": "5512988038698",
    "Email": "fabirvbonadio@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "5",
    "Data perda": "2026-07-09T03:01:17.304Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jose aparecido barbosa ",
    "Telefone": "5561986010293",
    "Email": "zezin.ap@hotmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Data perda": "2026-07-09T03:01:17.049Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jardel de souza",
    "Telefone": "5533999871364",
    "Email": "jardelff2026ctga@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 5",
    "Data perda": "2026-07-09T03:01:17.022Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Hellen Caroliny Pereira Rocha",
    "Telefone": "5562992929704",
    "Email": "hellenengp@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": null,
    "Data perda": "2026-07-09T03:01:17.017Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "cynaraangela977@hotmail.com",
    "Telefone": "5511985557041",
    "Email": "cynaraangela977@hotmail.com",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Data perda": "2026-07-09T03:01:16.983Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gabriela Ribeiro da Silva",
    "Telefone": "5524998751185",
    "Email": "gabi.nog.281@gmail.com",
    "Segmento": "Outro",
    "Tier": "2",
    "Data perda": "2026-07-09T03:01:16.833Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Raquel Oliveira",
    "Telefone": "5574988281871",
    "Email": "jullymollt@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:01:16.318Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ana Beatriz",
    "Telefone": "5521991430853",
    "Email": "euanabeatrizfrederico49@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:01:16.314Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "LEONARDO DE ARAUJO GOMES",
    "Telefone": "5592991845711",
    "Email": "leonardodearaujogomes@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:01:16.312Z",
    "Motivo": "[N] Lead desapareceu (estava engajado e sumiu de repente)"
  },
  {
    "Nome": "MARCOS PAULO DE SOUZA TELLES",
    "Telefone": "5524992591460",
    "Email": "marcostelles1996@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-09T03:01:10.523Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Plínio Felix de Oliveira",
    "Telefone": "5579998216287",
    "Email": "felix_oliveira@hotmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "1",
    "Data perda": "2026-07-09T03:01:10.483Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Amanda Tamiris Becalli de Lima",
    "Telefone": "5531973370745",
    "Email": "helioburguerepizza@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "Tier 1",
    "Data perda": "2026-07-09T03:01:10.476Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Cassiano Duarte Silva",
    "Telefone": "5588994457475",
    "Email": "cassiano1995duarte@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "2",
    "Data perda": "2026-07-09T03:01:10.474Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Andréia Fogazzaria",
    "Telefone": "55629914330",
    "Email": "vinicius.mkt2016@gmail.com",
    "Segmento": "Outro",
    "Tier": "1",
    "Data perda": "2026-07-09T03:01:10.469Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Luziane de souza cruz",
    "Telefone": "5574981403683",
    "Email": "LUZDSCRUZ@GMAIL.COM",
    "Segmento": "Outro",
    "Tier": "2",
    "Data perda": "2026-07-09T03:01:10.462Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Leo Raposo",
    "Telefone": "559885190865",
    "Email": "leonardodsrodrigues@hotmail.com",
    "Segmento": "Restaurante",
    "Tier": "2",
    "Data perda": "2026-07-09T03:01:10.433Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Hamburgueria Buba Burgers",
    "Telefone": "5569992360152",
    "Email": "ferreirarenatto28@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "2",
    "Data perda": "2026-07-09T03:01:10.405Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gabriela Vieira",
    "Telefone": "5519997693584",
    "Email": "pat.milena.silva123@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 2",
    "Data perda": "2026-07-09T03:01:10.402Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Keity Dias",
    "Telefone": "559391734057",
    "Email": "paqdias@hotmail.com",
    "Segmento": "Restaurante",
    "Tier": "2",
    "Data perda": "2026-07-09T03:01:10.398Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gustavo",
    "Telefone": "5588999992810",
    "Email": "gustavosunbeer@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "1",
    "Data perda": "2026-07-09T03:01:10.332Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Paulo César",
    "Telefone": "5541991015013",
    "Email": "hevenifood@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "1",
    "Data perda": "2026-07-09T03:01:10.332Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Bruna de Souza novais",
    "Telefone": "5514991963415",
    "Email": "brunasconfeitaria@hotmail.com",
    "Segmento": "Confeitaria",
    "Tier": "2",
    "Data perda": "2026-07-09T03:01:10.319Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Robson Junior",
    "Telefone": "5511979779888",
    "Email": "robson.nogueira.junior@gmail.com",
    "Segmento": "Outro",
    "Tier": "2",
    "Data perda": "2026-07-09T03:01:10.280Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "José Roberto da Silva",
    "Telefone": "5585991863213",
    "Email": "nataliacavalcante343@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:00:53.925Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "roseane",
    "Telefone": "5532999265836",
    "Email": "michellemartinsalves31@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:00:53.923Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Amanda",
    "Telefone": "5548991407329",
    "Email": "acaimilgrau339@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:00:53.911Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Cristiane",
    "Telefone": "5547991008126",
    "Email": "crisespindola756@gmail.com",
    "Segmento": "",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:00:53.908Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jéssyca",
    "Telefone": "5511964296583",
    "Email": "jessyca1706.vp@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:00:53.896Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Erick Leonardo",
    "Telefone": "5531999189506",
    "Email": "horizontezoom2026@gmail.com",
    "Segmento": "Sushi",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:00:53.848Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Danilo Torazzi Arndt",
    "Telefone": "5541996557376",
    "Email": "danilo_danu@hotmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:00:53.837Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Samara Pires de Albuquerque",
    "Telefone": "5521982593846",
    "Email": "smarapires081@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:00:53.835Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Jamile Marques Campos",
    "Telefone": "5577999995489",
    "Email": "jamileassistentesocial@outlook.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:00:53.825Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Anderson Abreu",
    "Telefone": "5585996709082",
    "Email": "anderson.abreuenter@yahoo.com.br",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:00:53.823Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Renata Pagani Louzada",
    "Telefone": "5519993540234",
    "Email": "seubento.comercial@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:00:53.823Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "EvellynSirlane Sálvia",
    "Telefone": "5561993853923",
    "Email": "sirlanesouz@icloud.com",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:00:53.798Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "ART IN",
    "Telefone": "5511995386650",
    "Email": "artindonuts@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:00:53.793Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Silvana Soares Freitas",
    "Telefone": "5585921747374",
    "Email": "silcafe30526@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:00:53.786Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Osvaldo Landry Rodrigues",
    "Telefone": "5519991272558",
    "Email": "landryrodrigues@bol.com.br",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:00:53.781Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Fagner saraiva",
    "Telefone": "5587999384336",
    "Email": "fagnersaraiva38@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:00:53.774Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Natacha",
    "Telefone": "5519996570703",
    "Email": "natachabergmann94@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:00:53.772Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Stefanie cristina",
    "Telefone": "5547988379949",
    "Email": "stefanie.cristinaa@hotmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:00:53.760Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Rafael rodrigues de souza",
    "Telefone": "5511964224387",
    "Email": "rafaelrodriguescna@gmail.com",
    "Segmento": "",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:00:53.605Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Mikaelly Brito",
    "Telefone": "5569993629668",
    "Email": "desejopipocariagourmet@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-09T03:00:53.601Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Cleirce",
    "Telefone": "5519989846760",
    "Email": "cleircefialho1@hotmail.com",
    "Segmento": "Açaiteria",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:00:53.593Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Maria Regina Serra De Araújo",
    "Telefone": "5521997783735",
    "Email": "crys.maria368@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:00:53.591Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Daniel Pyrrho Tambasco Filho",
    "Telefone": "5516992699341",
    "Email": "danitambasco08@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:00:53.589Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Stephanie Monteiro ",
    "Telefone": "5524993220449",
    "Email": "gestorastephanie@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "1",
    "Data perda": "2026-07-09T03:00:53.544Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Kellyanny sousa",
    "Telefone": "5588999906397",
    "Email": "kellyannyvieira9@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:00:53.528Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "willams Anderson da costa Mendes",
    "Telefone": "5591992645330",
    "Email": "maisanascimento801@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:00:53.486Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Yasmin",
    "Telefone": "5517996826939",
    "Email": "yasmingarccia@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "4",
    "Data perda": "2026-07-09T03:00:53.474Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "dd",
    "Telefone": "5549989895664",
    "Email": "teste@firemail.com.br",
    "Segmento": "Outro",
    "Tier": "4",
    "Data perda": "2026-07-09T03:00:53.467Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "anny caroliny",
    "Telefone": "5511987566323",
    "Email": "annycaroliny20050904@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "4",
    "Data perda": "2026-07-09T03:00:53.461Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "OSCAR ",
    "Telefone": "5589981457436",
    "Email": "60690249000106me@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:00:53.452Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Matheus Gabriel Silva dos Santos",
    "Telefone": "5511918454438",
    "Email": "mg22222w@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-09T03:00:53.436Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Larissa Nascimento",
    "Telefone": "5581996875099",
    "Email": "larinasci1234@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": null,
    "Data perda": "2026-07-09T03:00:53.431Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ana ruth",
    "Telefone": "5598984087878",
    "Email": "anacalmon123@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:00:53.417Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Feijoada Da Fernanda | Delivery",
    "Telefone": "5581994584627",
    "Email": "adriano.jesus26@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-09T03:00:53.405Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "IORRANA VITORIA ALVES DE LIMA",
    "Telefone": "5511949447223",
    "Email": "yorranalima868@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:00:53.391Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Leonardo cavalieri",
    "Telefone": "5511968644625",
    "Email": "Cavalieri166@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:00:53.378Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "leticia silva nunes",
    "Telefone": "5577999373176",
    "Email": "contatoleticyasilva@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-09T03:00:53.363Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Suellen Ferro",
    "Telefone": "5519996160375",
    "Email": "nutrisuellenferro@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": null,
    "Data perda": "2026-07-09T03:00:53.350Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Felipe Silva",
    "Telefone": "5588998409059",
    "Email": "felipealvesspfc07@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:00:53.336Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "thayla",
    "Telefone": "5541995814412",
    "Email": "housedogpremium@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:00:53.307Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Prime Burger | Hamburgueria Artesanal",
    "Telefone": "5585991298738",
    "Email": "jeffersonfilho7@hotmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:00:53.157Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Marcelo da Silva Rodrigues",
    "Telefone": "5521995534550",
    "Email": "marcelobombar9@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-09T03:00:53.143Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ana Lucia",
    "Telefone": "5594991549448",
    "Email": "francoartesanal@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-09T03:00:53.114Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ana Luiza Santos",
    "Telefone": "5577991638933",
    "Email": "anaslu312@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "Tier 4",
    "Data perda": "2026-07-09T03:00:53.112Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Nirene Nogueira",
    "Telefone": "5537998050065",
    "Email": "nogueiranirene@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:00:53.099Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "HS",
    "Telefone": "5511956959453",
    "Email": "caua4899@gmail.com",
    "Segmento": "Outro",
    "Tier": "4",
    "Data perda": "2026-07-09T03:00:53.087Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Adrielle Delfino",
    "Telefone": "5528999344180",
    "Email": "adrielipdfino@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:00:53.072Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Vitória braz de lima",
    "Telefone": "5511916013450",
    "Email": "luizadf6@hotmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:00:53.041Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Thainá  Silva",
    "Telefone": "5519993579087",
    "Email": "thainakyky2020@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:00:53.020Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Luiz Tadeu Ehrlich junior ",
    "Telefone": "5519994258240",
    "Email": "xmegagordaooficial@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "1",
    "Data perda": "2026-07-09T03:00:52.996Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Maria luiza Araújo",
    "Telefone": "5518988169786",
    "Email": "araujonlu18@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "2",
    "Data perda": "2026-07-09T03:00:52.982Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Vitória",
    "Telefone": "5585997039772",
    "Email": "anavitorialimadeoliveira1708@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "Tier 3.2",
    "Data perda": "2026-07-09T03:00:52.974Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Fabio Cardoso Santos",
    "Telefone": "5591980272177",
    "Email": "eguadopastelpa@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "2",
    "Data perda": "2026-07-09T03:00:52.970Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Juliana Av",
    "Telefone": "5511958876546",
    "Email": "Julianaguedesatelie@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "2",
    "Data perda": "2026-07-09T03:00:52.958Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "EVERTON XISTO DA SILVA",
    "Telefone": "5531997402606",
    "Email": "xisto2509@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "1",
    "Data perda": "2026-07-09T03:00:52.924Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Bruna Moraes marques",
    "Telefone": "5544998464845",
    "Email": "cv616696@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Data perda": "2026-07-09T03:00:52.919Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "naelson",
    "Telefone": "5511971760000",
    "Email": "naelsonpj7@gmail.com",
    "Segmento": "Outro",
    "Tier": "1",
    "Data perda": "2026-07-09T03:00:52.907Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Karina Maciel de Jesus",
    "Telefone": "5537998148883",
    "Email": "karinamacieldejesus@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:00:52.899Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Débora França",
    "Telefone": "5521968522588",
    "Email": "deboradf162@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:00:52.895Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "SAMUEL NASCIMENTO DOS SANTOS",
    "Telefone": "5573981637350",
    "Email": "samuccaroleplay@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "Tier 4",
    "Data perda": "2026-07-09T03:00:52.895Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Raquel Ferreira Gomes Lima",
    "Telefone": "5587999336588",
    "Email": "arnaldocesarr98@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "1",
    "Data perda": "2026-07-09T03:00:52.886Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "LUIZA ALVES BARBOSA",
    "Telefone": "5573998640705",
    "Email": "la1965066@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "Tier 1",
    "Data perda": "2026-07-09T03:00:52.884Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Lucas Colucci",
    "Telefone": "5519981339127",
    "Email": "lucascoluccii@gmail.com",
    "Segmento": "Outro",
    "Tier": "Tier 1",
    "Data perda": "2026-07-09T03:00:52.863Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "francisco henrique da costa araujo",
    "Telefone": "5522998611658",
    "Email": "jpa58689@gmail.com",
    "Segmento": "Sushi",
    "Tier": "2",
    "Data perda": "2026-07-09T03:00:52.862Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Mateus Torrentes",
    "Telefone": "5521981465844",
    "Email": "mateus.torrentes@gmail.com",
    "Segmento": "Outro",
    "Tier": "1",
    "Data perda": "2026-07-09T03:00:52.850Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Cristiano",
    "Telefone": "5522999739935",
    "Email": "fernandess25@hotmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "2",
    "Data perda": "2026-07-09T03:00:52.850Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Ralf monteiro de Oliveira",
    "Telefone": "5531986123701",
    "Email": "ralfmonteiro97@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Data perda": "2026-07-09T03:00:52.839Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Michel Henrique",
    "Telefone": "5555989601261",
    "Email": "michenrique1989@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "Tier 5",
    "Data perda": "2026-07-09T03:00:52.816Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "José Rafael",
    "Telefone": "5512996541495",
    "Email": "bruno.simoes280345@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "Tier 1",
    "Data perda": "2026-07-09T03:00:52.810Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Lucas Emanuel da Silva Carvalho",
    "Telefone": "5584999975849",
    "Email": "lucasemaneul207@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "Tier 2",
    "Data perda": "2026-07-09T03:00:52.782Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Aniele Piper",
    "Telefone": "5545998113905",
    "Email": "oliverpiper7@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Data perda": "2026-07-09T03:00:52.768Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gabriel Pimentel",
    "Telefone": "5548991594812",
    "Email": "esustecnologia@hotmail.com",
    "Segmento": "Pizzaria",
    "Tier": "Tier 5",
    "Data perda": "2026-07-09T03:00:52.762Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Danilson",
    "Telefone": "5511982475065",
    "Email": "danilson.gc@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "1",
    "Data perda": "2026-07-09T03:00:52.749Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gaby ",
    "Telefone": "5544988432334",
    "Email": "vr279727@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "1",
    "Data perda": "2026-07-09T03:00:52.723Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Flávia Miranda",
    "Telefone": "5521968851508",
    "Email": "flaviasmiranda68@gmail.com",
    "Segmento": "Outro",
    "Tier": null,
    "Data perda": "2026-07-09T03:00:52.683Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "REINALDO GOULARTE DA SILVA",
    "Telefone": "5519989685063",
    "Email": "reinaldornd@hotmail.com",
    "Segmento": "Outro",
    "Tier": "1",
    "Data perda": "2026-07-09T03:00:52.679Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Wanessa Lima",
    "Telefone": "5581998488927",
    "Email": "duofeijoadaria@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "Tier 5",
    "Data perda": "2026-07-09T03:00:52.654Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Mariana Caldas",
    "Telefone": "5521987394377",
    "Email": "contato.nanacozinha@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Data perda": "2026-07-09T03:00:52.634Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Mohammed Kermany",
    "Telefone": "5521983242741",
    "Email": "mohammedkermany7@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "2",
    "Data perda": "2026-07-09T03:00:52.620Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Michely Souza",
    "Telefone": "5521972239917",
    "Email": "michelyaparecida88@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "5",
    "Data perda": "2026-07-09T03:00:52.563Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Guilherme Conceição",
    "Telefone": "5521983313761",
    "Email": "gui201610rodrigues@gmail.com",
    "Segmento": "Outro",
    "Tier": "1",
    "Data perda": "2026-07-09T03:00:52.505Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Elzimeire Araujo",
    "Telefone": "5585985148117",
    "Email": "elzimeirearaujo@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "Tier 1",
    "Data perda": "2026-07-09T03:00:52.463Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gabriela Rodrigues",
    "Telefone": "5515988263887",
    "Email": "gmenezesrodrigues708@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Data perda": "2026-07-09T03:00:52.438Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Meduza Marketing",
    "Telefone": "5521997752205",
    "Email": "contatomeduzamkt@gmail.com",
    "Segmento": "Outro",
    "Tier": "1",
    "Data perda": "2026-07-09T03:00:52.402Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Emilly da Rosa Wujastyk",
    "Telefone": "5547997453122",
    "Email": "domgourmetpenha@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Data perda": "2026-07-09T03:00:52.391Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "DAVID LUIZ CARDOSO",
    "Telefone": "5524992650645",
    "Email": "transportadoravrboy@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "1",
    "Data perda": "2026-07-09T03:00:52.342Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Lyvio moreno carvalho de Macedo",
    "Telefone": "5511934243764",
    "Email": "lyvio.macedo1984@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "Tier 2",
    "Data perda": "2026-07-09T03:00:52.163Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gabriel",
    "Telefone": "5521977470199",
    "Email": "Gabriel.wallace230699@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:00:52.133Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "haykkonen mullher",
    "Telefone": "5522998169574",
    "Email": "haykkonenmullervieira@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": null,
    "Data perda": "2026-07-09T03:00:52.106Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Allan",
    "Telefone": "5562985604613",
    "Email": "pizzacrostini@gmail.com",
    "Segmento": "",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:00:52.106Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Italo Mattos Nascimento",
    "Telefone": "5571994040042",
    "Email": "italomatos96@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:00:52.100Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Mariane",
    "Telefone": "5531996527488",
    "Email": "aneo97216@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:00:52.094Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Eu Fabinho Monteiro",
    "Telefone": "5511964294540",
    "Email": "constantino_monteiro83@hotmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:00:52.092Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Sara Pereira",
    "Telefone": "5531996832262",
    "Email": "sarapereiralobao@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.1",
    "Data perda": "2026-07-09T03:00:52.092Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Rodrigo Cibella",
    "Telefone": "5533999041994",
    "Email": "rodrigocibella@outlook.com",
    "Segmento": "Outro",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-09T03:00:52.079Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Alessandra Monsalvarga",
    "Telefone": "5511961231020",
    "Email": "estacaodoces@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "1",
    "Data perda": "2026-07-09T03:00:52.064Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "fabiana Xavier Ferreira",
    "Telefone": "5521987324503",
    "Email": "fabianaxavierferreira3@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "Tier 3.1",
    "Data perda": "2026-07-09T03:00:52.055Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "VANESSA ZANELLO TARALLO",
    "Telefone": "5519991371242",
    "Email": "vantarallo@gmail.com",
    "Segmento": "Outro",
    "Tier": "1",
    "Data perda": "2026-07-09T03:00:52.053Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Carol B",
    "Telefone": "5524988298641",
    "Email": "carolzinhamtm@hotmail.com",
    "Segmento": "Confeitaria",
    "Tier": "2",
    "Data perda": "2026-07-09T03:00:52.053Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Juliana",
    "Telefone": "5511949266893",
    "Email": "pudimdajuh@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "2",
    "Data perda": "2026-07-09T03:00:52.050Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Camila",
    "Telefone": "5577999286844",
    "Email": "milla.aguiar99@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "Tier 1",
    "Data perda": "2026-07-09T03:00:52.043Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Maristella Chanoft",
    "Telefone": "5511119472766",
    "Email": "c_maristella@hotmail.com",
    "Segmento": "Confeitaria",
    "Tier": "2",
    "Data perda": "2026-07-09T03:00:51.986Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Thaís Crescente",
    "Telefone": "5521996550379",
    "Email": "t.crescente@hotmail.com",
    "Segmento": "Outro",
    "Tier": "1",
    "Data perda": "2026-07-09T03:00:51.985Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Cleber Lacerda Silva",
    "Telefone": "5583996965994",
    "Email": "cleberlacerda73@hotmail.com",
    "Segmento": "Restaurante",
    "Tier": "2",
    "Data perda": "2026-07-09T03:00:51.952Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Clebson Gleydson",
    "Telefone": "5514981398569",
    "Email": "clebsongleydson591@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "2",
    "Data perda": "2026-07-09T03:00:51.950Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Roberto Costa",
    "Telefone": "5511959652680",
    "Email": "roberto.matias@pobrejuan.com.br",
    "Segmento": "Restaurante",
    "Tier": "2",
    "Data perda": "2026-07-09T03:00:51.941Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gilvania Rodrigues ",
    "Telefone": "5591982631697",
    "Email": "gil.rodri.e@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "2",
    "Data perda": "2026-07-09T03:00:51.939Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Carlos Alberto",
    "Telefone": "5534996678889",
    "Email": "dckarpov@hotmail.com",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Data perda": "2026-07-09T03:00:51.939Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Wesley Belchiol",
    "Telefone": "5585985981033",
    "Email": "wesleydbelchioll@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:00:51.927Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Caio Fontolan",
    "Telefone": "5514997550902",
    "Email": "cafefontolan@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:00:51.900Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Gilmar Xavier",
    "Telefone": "5511934952273",
    "Email": "xaviergilmar331@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:00:51.899Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Bruna",
    "Telefone": "55219864252",
    "Email": "brunarocha3357@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "2",
    "Data perda": "2026-07-09T03:00:51.856Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  },
  {
    "Nome": "Guilherme Ferreira",
    "Telefone": "5511954438107",
    "Email": "gui1026silva@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Data perda": "2026-07-09T03:00:49.938Z",
    "Motivo": "[IS] Lead não correspondeu ás tentativas de contato"
  }
]





Viraram clientes (ganho no Pipe):


SELECT pe.name AS "Nome", pe.telephone AS "Telefone", pe.email AS "Email",
       d.custom_properties->>'empresa' AS "Empresa", d.segment AS "Segmento",
       d.tier AS "Tier", COALESCE(u.name, d.custom_properties->>'closer') AS "Closer",
       d.scheduled_meeting_at AS "Data reunião", d.won_at AS "Data ganho"
FROM commercial_deals d
JOIN persons pe ON pe.id = d.person_id
LEFT JOIN users u ON u.id = d.closer_user_id
WHERE d.discarded_at IS NULL
  AND d.status = 'won'
  AND d.won_at >= '2026-07-09'
ORDER BY d.won_at DESC;



RESULTADO



[
  {
    "Nome": "Daniele Corrêa",
    "Telefone": "5521992717776",
    "Email": "criaaeweb@gmail.com",
    "Empresa": "Cria Aê",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Closer": "Leandro dos Santos",
    "Data reunião": "2026-07-13T16:15:00.000Z",
    "Data ganho": "2026-07-15T11:30:14.606Z"
  },
  {
    "Nome": "Gabriele Frazão dos Santos silva ",
    "Telefone": "5522992015295",
    "Email": "gabrielefrazao@yahoo.com",
    "Empresa": "Nuvem de mel ",
    "Segmento": "Confeitaria",
    "Tier": "1",
    "Closer": "Leandro dos Santos",
    "Data reunião": "2026-07-15T10:00:00.000Z",
    "Data ganho": "2026-07-15T11:15:35.938Z"
  },
  {
    "Nome": "Paulo Henrique de Paula Silva",
    "Telefone": "5511999332887",
    "Email": "phpsilva5@gmail.com",
    "Empresa": "Amado Salgadao",
    "Segmento": "Pastelaria",
    "Tier": "3.1",
    "Closer": "Ranier Oliveira",
    "Data reunião": "2026-07-15T10:00:00.000Z",
    "Data ganho": "2026-07-15T11:05:44.463Z"
  },
  {
    "Nome": "ANDRE almeida",
    "Telefone": "5531997263065",
    "Email": "divinuhcontato@gmail.com",
    "Empresa": "DIVINUH",
    "Segmento": "Hamburgueria",
    "Tier": "3.1",
    "Closer": "Miguel Nunes",
    "Data reunião": "2026-07-15T10:15:00.000Z",
    "Data ganho": "2026-07-15T10:46:51.387Z"
  },
  {
    "Nome": "Adalberto Santos ",
    "Telefone": "5511945269588",
    "Email": "ad-santos01@hotmail.com",
    "Empresa": "",
    "Segmento": "Marmitaria",
    "Tier": "3.2",
    "Closer": "Letícia Rocha",
    "Data reunião": null,
    "Data ganho": "2026-07-15T10:11:19.564Z"
  },
  {
    "Nome": "Gustavo Jerfferson da Silva ",
    "Telefone": "5511969775104",
    "Email": "dogugadoces@gmail.com",
    "Empresa": "",
    "Segmento": "Confeitaria",
    "Tier": "4",
    "Closer": "Ranier Oliveira",
    "Data reunião": "2026-07-13T18:00:00.000Z",
    "Data ganho": "2026-07-15T10:01:01.729Z"
  },
  {
    "Nome": "Leonardo Santana",
    "Telefone": "5547997055387",
    "Email": "contatogaelo@gmail.com",
    "Empresa": "GAELO COMIDA BRASILEIRA",
    "Segmento": "Marmitaria",
    "Tier": "4",
    "Closer": "João Paulo Maciel",
    "Data reunião": null,
    "Data ganho": "2026-07-14T19:07:28.907Z"
  },
  {
    "Nome": "",
    "Telefone": "5521969515194",
    "Email": "well.borges95@gmail.com",
    "Empresa": null,
    "Segmento": null,
    "Tier": null,
    "Closer": "João Paulo Maciel",
    "Data reunião": "2026-07-14T17:15:00.000Z",
    "Data ganho": "2026-07-14T19:04:16.839Z"
  },
  {
    "Nome": "TIAGO MEDEIROS BRAGA",
    "Telefone": "5521964720112",
    "Email": "realezapizzariadevelivery@gmail.com",
    "Empresa": "realeza pizzaria",
    "Segmento": "Pizzaria",
    "Tier": "3.1",
    "Closer": "Letícia Wendy",
    "Data reunião": "2026-07-14T16:30:00.000Z",
    "Data ganho": "2026-07-14T18:45:33.986Z"
  },
  {
    "Nome": "",
    "Telefone": "5575999903539",
    "Email": "rezaalendatm@gmail.com",
    "Empresa": null,
    "Segmento": null,
    "Tier": null,
    "Closer": "Luan Nicolas",
    "Data reunião": null,
    "Data ganho": "2026-07-14T18:41:09.419Z"
  },
  {
    "Nome": "Laura ",
    "Telefone": "5581998379775",
    "Email": "laurasantana12234@gmail.com",
    "Empresa": "",
    "Segmento": "Lanchonete",
    "Tier": "1",
    "Closer": "Rebeca Cabral",
    "Data reunião": "2026-07-14T17:15:00.000Z",
    "Data ganho": "2026-07-14T17:52:41.793Z"
  },
  {
    "Nome": "Sheila Araujo",
    "Telefone": "5527999711558",
    "Email": "sheypresentes@hotmail.com",
    "Empresa": "Shey Presentes",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Closer": "Gustavo Duarte Pinheiro Silva",
    "Data reunião": "2026-07-14T15:45:00.000Z",
    "Data ganho": "2026-07-14T16:51:08.440Z"
  },
  {
    "Nome": "Helen Duarte",
    "Telefone": "5548999936494",
    "Email": "hhelenduarte2019@gmail.com",
    "Empresa": "Duarte Doces",
    "Segmento": "Confeitaria",
    "Tier": "1",
    "Closer": "Rebeca Cabral",
    "Data reunião": "2026-07-14T16:15:00.000Z",
    "Data ganho": "2026-07-14T16:45:15.409Z"
  },
  {
    "Nome": "Yasmin",
    "Telefone": "5531985811218",
    "Email": "yayaconfeitaria2020@gmail.com",
    "Empresa": "Yaya Confeitaria e Cafeteria",
    "Segmento": "Confeitaria",
    "Tier": "1",
    "Closer": "Rebeca Cabral",
    "Data reunião": null,
    "Data ganho": "2026-07-14T16:42:07.601Z"
  },
  {
    "Nome": "Isabella Vipieski",
    "Telefone": "5541995590663",
    "Email": "larachocolab@gmail.com",
    "Empresa": "Lara Chocolab",
    "Segmento": "Confeitaria",
    "Tier": "1",
    "Closer": "Leandro dos Santos",
    "Data reunião": "2026-07-14T16:15:00.000Z",
    "Data ganho": "2026-07-14T16:40:02.617Z"
  },
  {
    "Nome": "Biancacasemiro",
    "Telefone": "(12) 99729-7174",
    "Email": "biancacasemiro33@gmail.com",
    "Empresa": null,
    "Segmento": "Hamburgueria",
    "Tier": "Tier 5",
    "Closer": "Ranier Oliveira",
    "Data reunião": null,
    "Data ganho": "2026-07-14T16:29:21.710Z"
  },
  {
    "Nome": "Cintia André",
    "Telefone": "5515974010359",
    "Email": "cintia.andresantos@gmail.com",
    "Empresa": "Bunker Bebibas",
    "Segmento": "Outro",
    "Tier": "1",
    "Closer": "Rebeca Cabral",
    "Data reunião": null,
    "Data ganho": "2026-07-14T16:16:05.262Z"
  },
  {
    "Nome": "Pablo Ribeiro Andrade Pereira",
    "Telefone": "5511953917599",
    "Email": "pablo.ribeiroap@gmail.com",
    "Empresa": null,
    "Segmento": null,
    "Tier": null,
    "Closer": "João Paulo Maciel",
    "Data reunião": null,
    "Data ganho": "2026-07-14T16:01:01.225Z"
  },
  {
    "Nome": "Joao",
    "Telefone": "5575981888776",
    "Email": "joao.jonatan@gmail.com",
    "Empresa": "",
    "Segmento": "Pastelaria",
    "Tier": "3.2",
    "Closer": "Miguel Nunes",
    "Data reunião": "2026-07-14T15:15:00.000Z",
    "Data ganho": "2026-07-14T15:52:13.458Z"
  },
  {
    "Nome": "Lion gusmao",
    "Telefone": "5575991450065",
    "Email": "acclion01@gmail.com",
    "Empresa": "Lion macarrao ao vivo",
    "Segmento": "Marmitaria",
    "Tier": "3.1",
    "Closer": "João Paulo Maciel",
    "Data reunião": null,
    "Data ganho": "2026-07-14T15:22:24.086Z"
  },
  {
    "Nome": "Nicolas Barbosa de Lima",
    "Telefone": "5527995319020",
    "Email": "nicolaslima096@gmail.com",
    "Empresa": "Frangonico",
    "Segmento": "Outro",
    "Tier": "1",
    "Closer": "João Paulo Maciel",
    "Data reunião": "2026-07-14T14:30:00.000Z",
    "Data ganho": "2026-07-14T15:18:06.251Z"
  },
  {
    "Nome": "João Vitor Leão",
    "Telefone": "5562982570113",
    "Email": "fiodeprata85@gmail.com",
    "Empresa": "Fio De Prata Espetaria",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Closer": "Luan Nicolas",
    "Data reunião": "2026-07-14T14:00:00.000Z",
    "Data ganho": "2026-07-14T15:11:37.930Z"
  },
  {
    "Nome": "Gislaine ",
    "Telefone": "5584996711566",
    "Email": "gislainnerdg@gmail.com",
    "Empresa": "Oxente Restaurante & Petiscaria",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Closer": "Gustavo Duarte Pinheiro Silva",
    "Data reunião": "2026-07-10T17:15:00.000Z",
    "Data ganho": "2026-07-14T15:10:47.494Z"
  },
  {
    "Nome": "bar e espetinho do bahia",
    "Telefone": "5511940135972",
    "Email": "vsribeiro86@gmail.com",
    "Empresa": "Valdin santos Ribeiro",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Closer": "Luan Nicolas",
    "Data reunião": "2026-07-14T13:30:00.000Z",
    "Data ganho": "2026-07-14T15:08:24.962Z"
  },
  {
    "Nome": "Fernando Barbosa",
    "Telefone": "5531999538770",
    "Email": "acaiplanet9@gmail.com",
    "Empresa": "Açaí Planet Conexões",
    "Segmento": "Açaiteria",
    "Tier": "3.1",
    "Closer": "Miguel Nunes",
    "Data reunião": "2026-07-14T14:30:00.000Z",
    "Data ganho": "2026-07-14T15:06:02.075Z"
  },
  {
    "Nome": "Luck",
    "Telefone": "5583998635314",
    "Email": "pastelariadaedi@gmail.com",
    "Empresa": "Pastelaria da Edi",
    "Segmento": "Pastelaria",
    "Tier": "3.1",
    "Closer": "Gustavo Duarte Pinheiro Silva",
    "Data reunião": "2026-07-14T14:15:00.000Z",
    "Data ganho": "2026-07-14T14:54:21.112Z"
  },
  {
    "Nome": "Júlia Priess Niehues",
    "Telefone": "5547996657991",
    "Email": "juliapniehues@gmail.com",
    "Empresa": "Priess Cakes",
    "Segmento": "Confeitaria",
    "Tier": "1",
    "Closer": "Rebeca Cabral",
    "Data reunião": "2026-07-13T17:15:00.000Z",
    "Data ganho": "2026-07-14T14:46:34.537Z"
  },
  {
    "Nome": "Matheus ",
    "Telefone": "5581995325636",
    "Email": "lopesmatheus954@gmail.com",
    "Empresa": "",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Closer": "Letícia Wendy",
    "Data reunião": "2026-07-13T16:30:00.000Z",
    "Data ganho": "2026-07-14T14:27:07.400Z"
  },
  {
    "Nome": "Joice Santos Bussade",
    "Telefone": "5522992900629",
    "Email": "jsbussade@gmail.com",
    "Empresa": "Donna di Crema",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Closer": "Taty Freitas",
    "Data reunião": "2026-07-14T12:45:00.000Z",
    "Data ganho": "2026-07-14T14:11:42.992Z"
  },
  {
    "Nome": "Micael Fernandes ",
    "Telefone": "5511954891534",
    "Email": "micaelmotos2@gmail.com",
    "Empresa": "",
    "Segmento": "Marmitaria",
    "Tier": "4",
    "Closer": "João Paulo Maciel",
    "Data reunião": null,
    "Data ganho": "2026-07-14T14:05:06.270Z"
  },
  {
    "Nome": "joao victor costa aprigio",
    "Telefone": "5584991847907",
    "Email": "joaovictorgemadinho@gmail.com",
    "Empresa": "mare pizza",
    "Segmento": "Pizzaria",
    "Tier": "3.1",
    "Closer": "Ranier Oliveira",
    "Data reunião": "2026-07-14T13:30:00.000Z",
    "Data ganho": "2026-07-14T14:04:34.714Z"
  },
  {
    "Nome": "Leidiane Borcatt",
    "Telefone": "5569992406385",
    "Email": "leydyborcattbrum@gmail.com",
    "Empresa": "Açaí fora de rota",
    "Segmento": "Açaiteria",
    "Tier": "1",
    "Closer": "Leandro dos Santos",
    "Data reunião": null,
    "Data ganho": "2026-07-14T14:00:23.807Z"
  },
  {
    "Nome": "Rickelms Alves De Oliveira",
    "Telefone": "5563984224466",
    "Email": "rickelmsalves319@gmail.com",
    "Empresa": "Bella vita pizzaria",
    "Segmento": "Pizzaria",
    "Tier": "3.1",
    "Closer": "Gustavo Duarte Pinheiro Silva",
    "Data reunião": "2026-07-14T13:30:00.000Z",
    "Data ganho": "2026-07-14T13:58:15.440Z"
  },
  {
    "Nome": "",
    "Telefone": "5515998312001",
    "Email": "nerilanches@gmail.com",
    "Empresa": null,
    "Segmento": null,
    "Tier": null,
    "Closer": "Leandro dos Santos",
    "Data reunião": null,
    "Data ganho": "2026-07-14T13:35:44.779Z"
  },
  {
    "Nome": "Ctxparanotic",
    "Telefone": "5561985329050",
    "Email": "ctxparanotic@gmail.com",
    "Empresa": null,
    "Segmento": "Outro",
    "Tier": "Tier 1",
    "Closer": "Leandro dos Santos",
    "Data reunião": null,
    "Data ganho": "2026-07-14T11:56:54.453Z"
  },
  {
    "Nome": "Victorfraaga",
    "Telefone": "5551989392293",
    "Email": "victorfraaga@gmail.com",
    "Empresa": null,
    "Segmento": "Pizzaria",
    "Tier": null,
    "Closer": "Gustavo Duarte Pinheiro Silva",
    "Data reunião": null,
    "Data ganho": "2026-07-14T11:28:49.038Z"
  },
  {
    "Nome": "Julia freitas",
    "Telefone": "5524999725919",
    "Email": "freitasacaiteria010708@gmail.com",
    "Empresa": "",
    "Segmento": "Açaiteria",
    "Tier": "2",
    "Closer": "João Paulo Maciel",
    "Data reunião": "2026-07-14T10:30:00.000Z",
    "Data ganho": "2026-07-14T11:23:42.182Z"
  },
  {
    "Nome": "José Júnior",
    "Telefone": "5582999201061",
    "Email": "josejuninho8@gmail.com",
    "Empresa": "Box Esfihas",
    "Segmento": "Outro",
    "Tier": "4",
    "Closer": "Ranier Oliveira",
    "Data reunião": null,
    "Data ganho": "2026-07-14T11:10:05.619Z"
  },
  {
    "Nome": "lucas moreira",
    "Telefone": "5511964692081",
    "Email": "lucasviniciusmoreiramachado@gmail.com",
    "Empresa": "artigiani",
    "Segmento": "Outro",
    "Tier": "1",
    "Closer": "Luan Nicolas",
    "Data reunião": null,
    "Data ganho": "2026-07-14T11:00:47.085Z"
  },
  {
    "Nome": "Tuttopizzacv",
    "Telefone": "5521981387628",
    "Email": "tuttopizzacv@gmail.com",
    "Empresa": null,
    "Segmento": "Pizzaria",
    "Tier": "Tier 1",
    "Closer": "Guilherme Gomes",
    "Data reunião": null,
    "Data ganho": "2026-07-14T06:52:59.001Z"
  },
  {
    "Nome": "Victoria",
    "Telefone": "5596991280059",
    "Email": "victoriasouza42@gmail.com",
    "Empresa": null,
    "Segmento": "Confeitaria",
    "Tier": "Tier 5",
    "Closer": "Guilherme Gomes",
    "Data reunião": null,
    "Data ganho": "2026-07-13T23:19:45.587Z"
  },
  {
    "Nome": "Patric Miranda",
    "Telefone": "5549999890063",
    "Email": "patric.miranda@voxcity.com.br",
    "Empresa": "Pizza halley",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Closer": "Guilherme Gomes",
    "Data reunião": null,
    "Data ganho": "2026-07-13T20:27:22.720Z"
  },
  {
    "Nome": "Wallace Melo",
    "Telefone": "5511977161011",
    "Email": "wallace@revgrow.group",
    "Empresa": "",
    "Segmento": "",
    "Tier": "2",
    "Closer": "Luan Nicolas",
    "Data reunião": "2026-07-10T17:15:00.000Z",
    "Data ganho": "2026-07-13T19:38:56.095Z"
  },
  {
    "Nome": "Deyvid Martins",
    "Telefone": "5585984135922",
    "Email": "Deyvidmartins1@gmail.com",
    "Empresa": "",
    "Segmento": "",
    "Tier": "2",
    "Closer": "Ranier Oliveira",
    "Data reunião": "2026-07-13T18:30:00.000Z",
    "Data ganho": "2026-07-13T19:34:53.786Z"
  },
  {
    "Nome": "",
    "Telefone": "5511940175982",
    "Email": "point66.adm@gmail.com",
    "Empresa": null,
    "Segmento": null,
    "Tier": null,
    "Closer": "Luan Nicolas",
    "Data reunião": null,
    "Data ganho": "2026-07-13T19:28:22.567Z"
  },
  {
    "Nome": "jefferson arruda",
    "Telefone": "5544991018735",
    "Email": "jeffersonmorass@hotmail.com",
    "Empresa": "arrudas pizza",
    "Segmento": "Pizzaria",
    "Tier": "3.1",
    "Closer": "Miguel Nunes",
    "Data reunião": "2026-07-13T18:15:00.000Z",
    "Data ganho": "2026-07-13T19:18:07.581Z"
  },
  {
    "Nome": "danilo alves",
    "Telefone": "5517981151914",
    "Email": "danilosep2@gmail.com",
    "Empresa": "slechi sorvetes e açai",
    "Segmento": "Açaiteria",
    "Tier": "1",
    "Closer": "João Paulo Maciel",
    "Data reunião": "2026-07-13T15:45:00.000Z",
    "Data ganho": "2026-07-13T19:04:12.363Z"
  },
  {
    "Nome": "Geiseliel Santos",
    "Telefone": "5588889945583",
    "Email": "geiselielsantos@gmail.com",
    "Empresa": null,
    "Segmento": "Outro",
    "Tier": "Tier 1",
    "Closer": "Leandro dos Santos",
    "Data reunião": null,
    "Data ganho": "2026-07-13T19:01:00.926Z"
  },
  {
    "Nome": "Marina Silva Vasconcelos",
    "Telefone": "5568984041337",
    "Email": "marina.silva.vasconcelos@outlook.com",
    "Empresa": "Mama donuts",
    "Segmento": "Confeitaria",
    "Tier": "1",
    "Closer": "Leandro dos Santos",
    "Data reunião": null,
    "Data ganho": "2026-07-13T18:39:24.359Z"
  },
  {
    "Nome": "Carlos Eduardo",
    "Telefone": "5515997326021",
    "Email": "cadusps1@gmail.com",
    "Empresa": "Taunt Cookies",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Closer": "Letícia Wendy",
    "Data reunião": "2026-07-13T18:00:00.000Z",
    "Data ganho": "2026-07-13T18:20:25.517Z"
  },
  {
    "Nome": "Rodrigo",
    "Telefone": "5521991925003",
    "Email": "potitjf@hotmail.com",
    "Empresa": "Misterburguer",
    "Segmento": "Hamburgueria",
    "Tier": "1",
    "Closer": "Luan Nicolas",
    "Data reunião": null,
    "Data ganho": "2026-07-13T18:10:14.934Z"
  },
  {
    "Nome": "Leonardo Guedes",
    "Telefone": "5551997799309",
    "Email": "leoguedes95@gmail.com",
    "Empresa": "Alternativas burger",
    "Segmento": "Hamburgueria",
    "Tier": "1",
    "Closer": "Rebeca Cabral",
    "Data reunião": "2026-07-13T15:45:00.000Z",
    "Data ganho": "2026-07-13T17:44:56.155Z"
  },
  {
    "Nome": "Gregório Nogueira de Sá",
    "Telefone": "5544999253324",
    "Email": "franguinhodasogra@gmail.com",
    "Empresa": null,
    "Segmento": "Restaurante",
    "Tier": "Tier 1",
    "Closer": "Leandro dos Santos",
    "Data reunião": null,
    "Data ganho": "2026-07-13T17:42:32.781Z"
  },
  {
    "Nome": "Rubia Setti",
    "Telefone": "5554992055341",
    "Email": "rubiasetti2@gmail.com",
    "Empresa": "Heróis do Sabor Pizzaria",
    "Segmento": "Pizzaria",
    "Tier": "2",
    "Closer": "João Paulo Maciel",
    "Data reunião": "2026-07-13T16:15:00.000Z",
    "Data ganho": "2026-07-13T17:14:26.256Z"
  },
  {
    "Nome": "Andre Mota",
    "Telefone": "5521995037990",
    "Email": "picogastronomia@gmail.com",
    "Empresa": "",
    "Segmento": "Lanchonete",
    "Tier": "3.1",
    "Closer": "Luiz Moura",
    "Data reunião": "2026-07-13T14:30:00.000Z",
    "Data ganho": "2026-07-13T17:14:08.639Z"
  },
  {
    "Nome": "",
    "Telefone": "5511965672012",
    "Email": "glauconot@gmail.com",
    "Empresa": null,
    "Segmento": null,
    "Tier": null,
    "Closer": "Luan Nicolas",
    "Data reunião": "2026-07-13T16:15:00.000Z",
    "Data ganho": "2026-07-13T17:11:14.400Z"
  },
  {
    "Nome": "Mariana Gabriela Antonacci Cruz",
    "Telefone": "5534991999812",
    "Email": "shekinah.lanches.2025@gmail.com",
    "Empresa": "Shekinah Lanches",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Closer": "Luiz Moura",
    "Data reunião": "2026-07-10T14:15:00.000Z",
    "Data ganho": "2026-07-13T17:00:15.009Z"
  },
  {
    "Nome": "José Luiz Lopes Loureiro",
    "Telefone": "5511988621000",
    "Email": "ze.loureiro1985@hotmail.com",
    "Empresa": "Forno & Orégano",
    "Segmento": "Pizzaria",
    "Tier": "2",
    "Closer": "Taty Freitas",
    "Data reunião": null,
    "Data ganho": "2026-07-13T17:00:04.281Z"
  },
  {
    "Nome": "Carla Marina",
    "Telefone": "5524993955729",
    "Email": "yeastbakery.yb@gmail.com",
    "Empresa": "Yeast Bakery",
    "Segmento": "Confeitaria",
    "Tier": "1",
    "Closer": "Leandro dos Santos",
    "Data reunião": "2026-07-13T16:15:00.000Z",
    "Data ganho": "2026-07-13T16:58:34.207Z"
  },
  {
    "Nome": "Gabriela",
    "Telefone": "5513978209760",
    "Email": "batate.recheada@gmail.com",
    "Empresa": "Batate",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Closer": "Ranier Oliveira",
    "Data reunião": "2026-07-13T15:45:00.000Z",
    "Data ganho": "2026-07-13T16:46:10.767Z"
  },
  {
    "Nome": "José Américo ",
    "Telefone": "5511992806280",
    "Email": "jasmourajr@live.com",
    "Empresa": "Nutrisport ",
    "Segmento": "",
    "Tier": "5",
    "Closer": "Gustavo Duarte Pinheiro Silva",
    "Data reunião": null,
    "Data ganho": "2026-07-13T15:57:56.828Z"
  },
  {
    "Nome": "L",
    "Telefone": "(21) 97594-3435",
    "Email": "l",
    "Empresa": null,
    "Segmento": null,
    "Tier": "Agentes",
    "Closer": "Luan Nicolas",
    "Data reunião": null,
    "Data ganho": "2026-07-13T15:33:56.460Z"
  },
  {
    "Nome": "Eric William",
    "Telefone": "5511997171160",
    "Email": "pizzariaebuffetsantafe@outlook.com",
    "Empresa": "Santa Fe",
    "Segmento": "Pizzaria",
    "Tier": "4",
    "Closer": "Letícia Wendy",
    "Data reunião": "2026-07-13T13:30:00.000Z",
    "Data ganho": "2026-07-13T15:21:55.930Z"
  },
  {
    "Nome": "Jose Dias",
    "Telefone": "5586994359467",
    "Email": "jwjwdias@gmail.com",
    "Empresa": "Regina espetos",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Closer": "Leandro dos Santos",
    "Data reunião": null,
    "Data ganho": "2026-07-13T15:19:15.600Z"
  },
  {
    "Nome": "Rodberto Santana ribeiro",
    "Telefone": "5563999892616",
    "Email": "rodbertos@gmail.com",
    "Empresa": null,
    "Segmento": "Outro",
    "Tier": "Tier 3.2",
    "Closer": "Rebeca Cabral",
    "Data reunião": null,
    "Data ganho": "2026-07-13T15:15:23.428Z"
  },
  {
    "Nome": "CHARLES MÜLLER",
    "Telefone": "5522992577561",
    "Email": "charles20miiller@gmail.com",
    "Empresa": "Churrasco",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Closer": "Taty Freitas",
    "Data reunião": "2026-07-13T14:15:00.000Z",
    "Data ganho": "2026-07-13T15:09:33.451Z"
  },
  {
    "Nome": "Laís Barbalho",
    "Telefone": "5521983905784",
    "Email": "contato@laisbarbalho.com.br",
    "Empresa": "Laís Barbalho Doceria",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Closer": "Ranier Oliveira",
    "Data reunião": null,
    "Data ganho": "2026-07-13T15:00:03.551Z"
  },
  {
    "Nome": "Mércia de Lima Queiroz",
    "Telefone": "5531982705999",
    "Email": "merciadelima@yahoo.com.br",
    "Empresa": "MMC cestas e flores",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Closer": "Ranier Oliveira",
    "Data reunião": "2026-07-13T13:30:00.000Z",
    "Data ganho": "2026-07-13T14:30:56.420Z"
  },
  {
    "Nome": "THIAGO HENRIQUE MEDEIROS",
    "Telefone": "5531971234626",
    "Email": "thii4m@gmail.com",
    "Empresa": "Bar do banha",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Closer": "Leandro dos Santos",
    "Data reunião": null,
    "Data ganho": "2026-07-13T14:28:23.011Z"
  },
  {
    "Nome": "Samuel",
    "Telefone": "5592579071",
    "Email": "samuelmonteiroadv@hotmail.com",
    "Empresa": "Delicatessen sabor do trigo",
    "Segmento": "Confeitaria",
    "Tier": "1",
    "Closer": "João Paulo Maciel",
    "Data reunião": null,
    "Data ganho": "2026-07-13T14:24:45.488Z"
  },
  {
    "Nome": "Anne Karoenny Moura Cronemberger",
    "Telefone": "5586994815657",
    "Email": "annecronemberger@hotmail.com",
    "Empresa": "Um Bráuni",
    "Segmento": "Confeitaria",
    "Tier": "1",
    "Closer": "João Paulo Maciel",
    "Data reunião": null,
    "Data ganho": "2026-07-13T14:22:29.375Z"
  },
  {
    "Nome": "Helen Cristiane",
    "Telefone": "5568992214756",
    "Email": "helengauna78@gmail.com",
    "Empresa": "Frango Dourado",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Closer": "Luiz Moura",
    "Data reunião": "2026-07-13T10:45:00.000Z",
    "Data ganho": "2026-07-13T11:54:27.176Z"
  },
  {
    "Nome": "Atos felipe",
    "Telefone": "5563984486129",
    "Email": "atos26165@gmail.com",
    "Empresa": "Pamonharia delicia",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Closer": "Gustavo Duarte Pinheiro Silva",
    "Data reunião": null,
    "Data ganho": "2026-07-13T10:19:53.241Z"
  },
  {
    "Nome": "Igor Lacerda",
    "Telefone": "5542999435983",
    "Email": "bruttoburger12345@gmail.com",
    "Empresa": "Brutto Burger",
    "Segmento": "Hamburgueria",
    "Tier": "4",
    "Closer": "Luiz Moura",
    "Data reunião": null,
    "Data ganho": "2026-07-13T09:17:47.710Z"
  },
  {
    "Nome": "Caroline Queiroga ",
    "Telefone": "5521972860314",
    "Email": "carollineqm@gmail.con",
    "Empresa": "",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Closer": "João Paulo Maciel",
    "Data reunião": null,
    "Data ganho": "2026-07-12T16:07:39.052Z"
  },
  {
    "Nome": "Jean ",
    "Telefone": "5565992616195",
    "Email": "jeanvelarde22@gmail.com",
    "Empresa": "",
    "Segmento": "Restaurante",
    "Tier": "5",
    "Closer": "João Paulo Maciel",
    "Data reunião": null,
    "Data ganho": "2026-07-11T16:55:26.177Z"
  },
  {
    "Nome": "Amanda Domingues",
    "Telefone": "5511980300826",
    "Email": "ad.amandadomingues@gmail.com",
    "Empresa": "Aggregati",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Closer": "João Paulo Maciel",
    "Data reunião": null,
    "Data ganho": "2026-07-11T16:12:36.286Z"
  },
  {
    "Nome": "Ellyson Vicente Soprani Monteiro da Costa",
    "Telefone": "5519997560323",
    "Email": "ellysonvicente34@gmail.com",
    "Empresa": null,
    "Segmento": null,
    "Tier": "Adição manual",
    "Closer": "João Paulo Maciel",
    "Data reunião": null,
    "Data ganho": "2026-07-11T12:17:31.607Z"
  },
  {
    "Nome": "Caiofcezar",
    "Telefone": "5531995641371",
    "Email": "caiofcezar@yahoo.com.br",
    "Empresa": null,
    "Segmento": "Restaurante",
    "Tier": "Tier 1",
    "Closer": "João Paulo Maciel",
    "Data reunião": null,
    "Data ganho": "2026-07-11T12:15:06.175Z"
  },
  {
    "Nome": "Matheus",
    "Telefone": "5511980175338",
    "Email": "matheusf89@hotmail.com",
    "Empresa": "Oliveira salgados",
    "Segmento": "Lanchonete",
    "Tier": "2",
    "Closer": "Luan Nicolas",
    "Data reunião": null,
    "Data ganho": "2026-07-10T20:30:35.246Z"
  },
  {
    "Nome": "Vera Melo Cakes ",
    "Telefone": "551198117340",
    "Email": "adm.veramelo@gmail.com",
    "Empresa": "",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Closer": "Ranier Oliveira",
    "Data reunião": null,
    "Data ganho": "2026-07-10T19:09:07.431Z"
  },
  {
    "Nome": "Yuri Kritski se Oliveira",
    "Telefone": "5541988510410",
    "Email": "essavida@gmail.com",
    "Empresa": null,
    "Segmento": "Hamburgueria",
    "Tier": "Tier 1",
    "Closer": "Cleber Rodrigues",
    "Data reunião": null,
    "Data ganho": "2026-07-10T18:59:08.831Z"
  },
  {
    "Nome": "Geovana",
    "Telefone": "5545998005256",
    "Email": "geovanaliran@gmail.com",
    "Empresa": "Gelato Giorno",
    "Segmento": "Confeitaria",
    "Tier": "2",
    "Closer": "Luiz Moura",
    "Data reunião": "2026-07-10T18:00:00.000Z",
    "Data ganho": "2026-07-10T18:49:32.479Z"
  },
  {
    "Nome": "Amanda Souza",
    "Telefone": "5596981100922",
    "Email": "amandasouza.app@gmail.com",
    "Empresa": "Vip bistro",
    "Segmento": "Restaurante",
    "Tier": "3.2",
    "Closer": "Luiz Moura",
    "Data reunião": null,
    "Data ganho": "2026-07-10T18:47:28.128Z"
  },
  {
    "Nome": "Michael Iplinsky Lima",
    "Telefone": "5561994655910",
    "Email": "iplinsky@hotmail.com",
    "Empresa": "The empada",
    "Segmento": "Lanchonete",
    "Tier": "2",
    "Closer": "Leandro dos Santos",
    "Data reunião": "2026-07-10T18:15:00.000Z",
    "Data ganho": "2026-07-10T18:45:30.667Z"
  },
  {
    "Nome": "Livia Marina",
    "Telefone": "5531989261749",
    "Email": "marinalivia359@gmail.com",
    "Empresa": "Doce",
    "Segmento": "Confeitaria",
    "Tier": "1",
    "Closer": "Guilherme Gomes",
    "Data reunião": "2026-07-09T18:15:00.000Z",
    "Data ganho": "2026-07-10T18:28:58.694Z"
  },
  {
    "Nome": "Henrique Saude",
    "Telefone": "5533999435244",
    "Email": "cantinaurbanaburgue@gmail.com",
    "Empresa": "Cantina Urbana",
    "Segmento": "Hamburgueria",
    "Tier": "2",
    "Closer": "Luan Nicolas",
    "Data reunião": null,
    "Data ganho": "2026-07-10T18:17:44.444Z"
  },
  {
    "Nome": "Edvam de Jesus Silva Filho",
    "Telefone": "5511961438429",
    "Email": "Majinburgerloja1@gmail.com",
    "Empresa": "Majin Burger",
    "Segmento": "Hamburgueria",
    "Tier": "3.1",
    "Closer": "Letícia Wendy",
    "Data reunião": "2026-07-10T16:30:00.000Z",
    "Data ganho": "2026-07-10T17:07:41.019Z"
  },
  {
    "Nome": "Gabriel Albani",
    "Telefone": "5521996582393",
    "Email": "jap40sg@gmail.com",
    "Empresa": "Jap40 delivery",
    "Segmento": "",
    "Tier": "1",
    "Closer": "Luan Nicolas",
    "Data reunião": "2026-07-10T15:45:00.000Z",
    "Data ganho": "2026-07-10T16:53:34.901Z"
  },
  {
    "Nome": "Daniel Fachini",
    "Telefone": "5513991297070",
    "Email": "dilettoita@gmail.com",
    "Empresa": null,
    "Segmento": "Pizzaria",
    "Tier": "Tier 3.2",
    "Closer": "Rebeca Cabral",
    "Data reunião": null,
    "Data ganho": "2026-07-10T16:47:15.525Z"
  },
  {
    "Nome": "DAVI VIANA FERRI",
    "Telefone": "5532988274255",
    "Email": "daviferri9@gmail.com",
    "Empresa": "LV SERVICOS E SOLUCOES DIGITAIS LTDA",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Closer": "Layza Batista",
    "Data reunião": "2026-07-10T09:30:00.000Z",
    "Data ganho": "2026-07-10T16:23:59.261Z"
  },
  {
    "Nome": "Fabricio",
    "Telefone": "5512991221764",
    "Email": "almeidafabricio472@gmail.com",
    "Empresa": "Fabricio Pizzaria",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Closer": "Luan Nicolas",
    "Data reunião": null,
    "Data ganho": "2026-07-10T15:23:10.244Z"
  },
  {
    "Nome": "João Wasem",
    "Telefone": "5549988236979",
    "Email": "qgdojao2025@gmail.com",
    "Empresa": "QG DO JAO PIZZA BAR",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Closer": "João Paulo Maciel",
    "Data reunião": null,
    "Data ganho": "2026-07-10T15:20:59.307Z"
  },
  {
    "Nome": "Beatriz Polycarpo",
    "Telefone": "5519994978830",
    "Email": "beatriz.polycarpo@outlook.com",
    "Empresa": null,
    "Segmento": "Confeitaria",
    "Tier": null,
    "Closer": "Rebeca Cabral",
    "Data reunião": null,
    "Data ganho": "2026-07-10T14:30:24.665Z"
  },
  {
    "Nome": "WELLINGTON NEVES FURTADO",
    "Telefone": "5585981474864",
    "Email": "wellingtonnevescontador@gmail.com",
    "Empresa": "HORTALICIA ",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Closer": "João Paulo Maciel",
    "Data reunião": null,
    "Data ganho": "2026-07-10T11:59:08.163Z"
  },
  {
    "Nome": "Denisse Torrico Bazan",
    "Telefone": "5522998065511",
    "Email": "denisse_3111@hotmail.com",
    "Empresa": "Sweet Cake confeitaria",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Closer": "Letícia Wendy",
    "Data reunião": "2026-07-10T10:45:00.000Z",
    "Data ganho": "2026-07-10T11:17:44.411Z"
  },
  {
    "Nome": "Alexandre Barboza",
    "Telefone": "5551984047049",
    "Email": "cumbucabistro@gmail.com",
    "Empresa": "Cumbuca Padaria Artesanal",
    "Segmento": "Outro",
    "Tier": "1",
    "Closer": "Luan Nicolas",
    "Data reunião": null,
    "Data ganho": "2026-07-10T11:15:49.496Z"
  },
  {
    "Nome": "Marcos Piccioli",
    "Telefone": "5563992945852",
    "Email": "deck.burgeer@outlook.com",
    "Empresa": "Deck Burguer",
    "Segmento": "Hamburgueria",
    "Tier": "2",
    "Closer": "João Paulo Maciel",
    "Data reunião": "2026-07-09T17:15:00.000Z",
    "Data ganho": "2026-07-09T19:30:30.050Z"
  },
  {
    "Nome": "Mikaelle chagas dos Santos",
    "Telefone": "5531995561644",
    "Email": "marmitadavovoeunice@gmail.com",
    "Empresa": "Marmitas da vovó Eunice",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Closer": "Luiz Moura",
    "Data reunião": null,
    "Data ganho": "2026-07-09T19:29:09.529Z"
  },
  {
    "Nome": "FILHÃO PIZZA",
    "Telefone": "5521972182771",
    "Email": "filhaopizza@gmail.com",
    "Empresa": "Filhao pizzaria",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Closer": "Leandro dos Santos",
    "Data reunião": null,
    "Data ganho": "2026-07-09T19:20:28.722Z"
  },
  {
    "Nome": "Sidiney",
    "Telefone": "5538998646959",
    "Email": "sidineymatosdasilva@gmail.com",
    "Empresa": "Samuca lanches",
    "Segmento": "Lanchonete",
    "Tier": "3.2",
    "Closer": "Luiz Moura",
    "Data reunião": "2026-07-09T18:00:00.000Z",
    "Data ganho": "2026-07-09T19:15:11.730Z"
  },
  {
    "Nome": "Nathalia Pimenta",
    "Telefone": "5527996164628",
    "Email": "mercearianopote@gmail.com",
    "Empresa": "Mercearia no pote",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Closer": "Rebeca Cabral",
    "Data reunião": "2026-07-09T17:45:00.000Z",
    "Data ganho": "2026-07-09T18:27:55.302Z"
  },
  {
    "Nome": "Vitória",
    "Telefone": "5581995410817",
    "Email": "vitoriareginadelimamelo@gmail.com",
    "Empresa": "Açaí do Vale",
    "Segmento": "Açaiteria",
    "Tier": "5",
    "Closer": "Ranier Oliveira",
    "Data reunião": "2026-07-09T17:30:00.000Z",
    "Data ganho": "2026-07-09T18:11:06.210Z"
  },
  {
    "Nome": "Luana",
    "Telefone": "5584996772123",
    "Email": "luanajhenni@gmail.com",
    "Empresa": "Da Lú confeitaria",
    "Segmento": "Lanchonete",
    "Tier": "3.1",
    "Closer": "Cleber Rodrigues",
    "Data reunião": "2026-07-09T17:15:00.000Z",
    "Data ganho": "2026-07-09T17:52:34.180Z"
  },
  {
    "Nome": "thiago Silva",
    "Telefone": "5581998181587",
    "Email": "tbpizza2026@gmail.com",
    "Empresa": "tbpizza",
    "Segmento": "Pizzaria",
    "Tier": "3.1",
    "Closer": "Ranier Oliveira",
    "Data reunião": null,
    "Data ganho": "2026-07-09T17:32:55.131Z"
  },
  {
    "Nome": "Hudson Back",
    "Telefone": "5561996353642",
    "Email": "hudsonback1@hotmail.com",
    "Empresa": "",
    "Segmento": "Pizzaria",
    "Tier": "4",
    "Closer": "Letícia Wendy",
    "Data reunião": "2026-07-09T16:30:00.000Z",
    "Data ganho": "2026-07-09T17:14:38.145Z"
  },
  {
    "Nome": "Gutenberg",
    "Telefone": "5581997592103",
    "Email": "bergjr@hotmail.com",
    "Empresa": "Vó Vina Pizza",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Closer": "Luan Nicolas",
    "Data reunião": null,
    "Data ganho": "2026-07-09T17:09:10.959Z"
  },
  {
    "Nome": "Danilo Raffo",
    "Telefone": "5541999411000",
    "Email": "daniloraffo1702@gmail.com",
    "Empresa": "Prato Nobre",
    "Segmento": "Outro",
    "Tier": "3.2",
    "Closer": "Luan Nicolas",
    "Data reunião": "2026-07-09T16:15:00.000Z",
    "Data ganho": "2026-07-09T16:58:39.029Z"
  },
  {
    "Nome": "Paulo Henrique Ferreira Dias",
    "Telefone": "5521967319273",
    "Email": "juizdeforaoeste@pastaway.com.br",
    "Empresa": "Pastaway",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Closer": "Rebeca Cabral",
    "Data reunião": "2026-07-09T16:15:00.000Z",
    "Data ganho": "2026-07-09T16:42:52.475Z"
  },
  {
    "Nome": "Arthur Bezerra",
    "Telefone": "5584996764404",
    "Email": "agenciagerencialize@gmail.com",
    "Empresa": "Prime Carnes",
    "Segmento": "Outro",
    "Tier": "4",
    "Closer": "Cleber Rodrigues",
    "Data reunião": null,
    "Data ganho": "2026-07-09T16:09:43.717Z"
  },
  {
    "Nome": "HELDER JAIRO",
    "Telefone": "5571991021677",
    "Email": "deposito321vai@gmail.com",
    "Empresa": "3,2,1 VAI",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Closer": "João Paulo Maciel",
    "Data reunião": "2026-07-09T10:30:00.000Z",
    "Data ganho": "2026-07-09T15:42:18.562Z"
  },
  {
    "Nome": "Tiago",
    "Telefone": "5519988527828",
    "Email": "tsfsousa.sousa@gmail.com",
    "Empresa": "LONDON BURGUER",
    "Segmento": "Lanchonete",
    "Tier": "5",
    "Closer": "Ranier Oliveira",
    "Data reunião": "2026-07-09T11:00:00.000Z",
    "Data ganho": "2026-07-09T15:34:50.566Z"
  },
  {
    "Nome": "Brunocsantos",
    "Telefone": "(12) 99740-2852",
    "Email": "brunocsantos18@gmail.com",
    "Empresa": null,
    "Segmento": "Hamburgueria",
    "Tier": "Tier 1",
    "Closer": "Leandro dos Santos",
    "Data reunião": null,
    "Data ganho": "2026-07-09T15:27:47.374Z"
  },
  {
    "Nome": "O Simpson Burger",
    "Telefone": "5592982829871",
    "Email": "paulooliveira36636690@gmail.com",
    "Empresa": "O SIMPSON BURGER",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Closer": "Cleber Rodrigues",
    "Data reunião": null,
    "Data ganho": "2026-07-09T15:26:54.223Z"
  },
  {
    "Nome": "Bengoacaichapadinha",
    "Telefone": "(99) 98440-6949",
    "Email": "bengoacaichapadinha@gmail.com",
    "Empresa": null,
    "Segmento": null,
    "Tier": null,
    "Closer": "Luan Nicolas",
    "Data reunião": null,
    "Data ganho": "2026-07-09T15:15:30.203Z"
  },
  {
    "Nome": "Ana clara de Sousa Fontinele ",
    "Telefone": "5599985265635",
    "Email": "anaclara1122@icloud.com",
    "Empresa": "MANÁ PIZZAs ",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Closer": "Letícia Wendy",
    "Data reunião": null,
    "Data ganho": "2026-07-09T14:36:52.370Z"
  },
  {
    "Nome": "Grazyelledasilvabarbosa",
    "Telefone": "85994021319",
    "Email": "grazyelledasilvabarbosa@gmail.com",
    "Empresa": null,
    "Segmento": "Pizzaria",
    "Tier": "Tier 1",
    "Closer": "Luan Nicolas",
    "Data reunião": null,
    "Data ganho": "2026-07-09T14:11:40.972Z"
  },
  {
    "Nome": "Arthur",
    "Telefone": "5567991000481",
    "Email": "alcantaramoronarthur999@gmail.com",
    "Empresa": "cesaresaracini",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Closer": "Cleber Rodrigues",
    "Data reunião": null,
    "Data ganho": "2026-07-09T09:29:37.222Z"
  },
  {
    "Nome": "Welida Natacha dos Réis filho",
    "Telefone": "5596991148478",
    "Email": "natacha24reis@gmail.com",
    "Empresa": "Atelier royal cakes",
    "Segmento": "Confeitaria",
    "Tier": "2",
    "Closer": "Rebeca Cabral",
    "Data reunião": null,
    "Data ganho": "2026-07-09T08:46:21.101Z"
  }
]





Perdidos no Pipe (tiveram reunião e não fecharam):


SELECT pe.name AS "Nome", pe.telephone AS "Telefone", pe.email AS "Email",
       d.segment AS "Segmento", d.tier AS "Tier",
       COALESCE(u.name, d.custom_properties->>'closer') AS "Closer",
       d.scheduled_meeting_at AS "Data reunião",
       d.lost_at AS "Data perda", d.loss_reason AS "Motivo"
FROM commercial_deals d
JOIN persons pe ON pe.id = d.person_id
LEFT JOIN users u ON u.id = d.closer_user_id
WHERE d.discarded_at IS NULL
  AND d.status = 'lost'
  AND (d.scheduled_meeting_at IS NOT NULL
       OR d.custom_properties ? 'oportunidade_at'
       OR d.stage IN ('oportunidade','cliente'))
  AND d.lost_at >= '2026-07-09'
ORDER BY d.lost_at DESC;



RESULTADO


[
  {
    "Nome": "Nina Regina Alves Rodrigues",
    "Telefone": "5537998442495",
    "Email": "doceria.doceatelie05@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.1",
    "Closer": "Gustavo Duarte Pinheiro Silva",
    "Data reunião": "2026-07-13T18:00:00.000Z",
    "Data perda": "2026-07-15T11:14:42.732Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "Rennan",
    "Telefone": "5581998967317",
    "Email": "wedsonrennan@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Closer": "Leandro dos Santos",
    "Data reunião": null,
    "Data perda": "2026-07-15T11:01:58.136Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "Luan Oliveira",
    "Telefone": "5511946601342",
    "Email": "luanoliveiracontact@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.1",
    "Closer": "Miguel Nunes",
    "Data reunião": "2026-07-14T18:15:00.000Z",
    "Data perda": "2026-07-15T10:56:02.099Z",
    "Motivo": "[IS][N] Lead não tem orçamento"
  },
  {
    "Nome": "MARCOS VINICIO CAMARGO DA SILVA",
    "Telefone": "5532984314496",
    "Email": "marcoscooparao@hotmail.com",
    "Segmento": "Pizzaria",
    "Tier": "4",
    "Closer": "Ranier Oliveira",
    "Data reunião": "2026-07-14T10:45:00.000Z",
    "Data perda": "2026-07-15T10:39:47.664Z",
    "Motivo": "[IS] Lead já é cliente"
  },
  {
    "Nome": "Eduardo dos santos inacio",
    "Telefone": "5551998885350",
    "Email": "eduinacio.3557@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "4",
    "Closer": "Taty Freitas",
    "Data reunião": "2026-07-15T10:15:00.000Z",
    "Data perda": "2026-07-15T10:23:52.153Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "Vinicius Ferreira",
    "Telefone": "5511940728473",
    "Email": "viiniciusferreira01@outlook.com",
    "Segmento": "Sushi",
    "Tier": "5",
    "Closer": "Leticia Silva",
    "Data reunião": "2026-07-15T09:15:00.000Z",
    "Data perda": "2026-07-15T09:33:49.983Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "Leonardo",
    "Telefone": "5515997690905",
    "Email": "lagoeiro.leonardo@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Closer": "Rebeca Cabral",
    "Data reunião": null,
    "Data perda": "2026-07-15T09:21:14.811Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "MARILTON CONCEICAO DE SOUSA JUNIOR",
    "Telefone": "5575988358413",
    "Email": "marilton.jr@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "1",
    "Closer": "Luan Nicolas",
    "Data reunião": "2026-07-13T14:00:00.000Z",
    "Data perda": "2026-07-14T18:22:18.297Z",
    "Motivo": "[IS] Lead já é cliente"
  },
  {
    "Nome": "VINICIUS PEREIRA FRANCO",
    "Telefone": "5533991419000",
    "Email": "murtafrancodistribuidora@gmail.com",
    "Segmento": "Outro",
    "Tier": "1",
    "Closer": "João Paulo Maciel",
    "Data reunião": "2026-07-14T17:45:00.000Z",
    "Data perda": "2026-07-14T18:18:53.430Z",
    "Motivo": "[IS][LF] Cliente quer funcionalidade que não temos"
  },
  {
    "Nome": "Karen Hartfeil",
    "Telefone": "5551996189318",
    "Email": "karenlauroscomercial@gmail.com",
    "Segmento": "Sushi",
    "Tier": "3.1",
    "Closer": "Cleber Rodrigues",
    "Data reunião": "2026-07-09T15:45:00.000Z",
    "Data perda": "2026-07-14T17:59:25.559Z",
    "Motivo": "[IS] Prospect sem interesse"
  },
  {
    "Nome": "JAIR GUIMARAES HILGUERA",
    "Telefone": "5524999149648",
    "Email": "bardogauchoanobom@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "3.1",
    "Closer": "Cleber Rodrigues",
    "Data reunião": "2026-07-09T10:00:00.000Z",
    "Data perda": "2026-07-14T17:01:39.857Z",
    "Motivo": "Inviável continuar a reunião por conta do aúdio e não respondeu mais"
  },
  {
    "Nome": "A",
    "Telefone": "(47) 99943-0513",
    "Email": "a",
    "Segmento": null,
    "Tier": "Agentes",
    "Closer": "Luan Nicolas",
    "Data reunião": null,
    "Data perda": "2026-07-14T16:46:20.103Z",
    "Motivo": "[IS][N] Lead sumiu após envio da fatura"
  },
  {
    "Nome": "Erica camargo",
    "Telefone": "5511991496436",
    "Email": "eri_hasp@hotmail.com",
    "Segmento": "Confeitaria",
    "Tier": "1",
    "Closer": "João Paulo Maciel",
    "Data reunião": "2026-07-15T13:30:00.000Z",
    "Data perda": "2026-07-14T16:02:49.814Z",
    "Motivo": "[IS] Lead duplicado"
  },
  {
    "Nome": "Thaís Vilela",
    "Telefone": "5511933829144",
    "Email": "thatavilela84@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "5",
    "Closer": "Letícia Wendy",
    "Data reunião": "2026-07-14T15:45:00.000Z",
    "Data perda": "2026-07-14T15:56:18.631Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "Paulo",
    "Telefone": "5519981937776",
    "Email": "paulo_triby@hotmail.com",
    "Segmento": "Outro",
    "Tier": "1",
    "Closer": "João Paulo Maciel",
    "Data reunião": "2026-07-14T15:45:00.000Z",
    "Data perda": "2026-07-14T15:48:11.109Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "Jaqueline ",
    "Telefone": "5531994703928",
    "Email": "jaquelinelilianbh@hotmail.com",
    "Segmento": "Lanchonete",
    "Tier": "5",
    "Closer": "Letícia Wendy",
    "Data reunião": "2026-07-14T10:30:00.000Z",
    "Data perda": "2026-07-14T15:39:57.794Z",
    "Motivo": "[IS] Lead duplicado"
  },
  {
    "Nome": "Katia",
    "Telefone": "5511941981722",
    "Email": "katiamorgan132@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "5",
    "Closer": "Miguel Nunes",
    "Data reunião": "2026-07-14T14:30:00.000Z",
    "Data perda": "2026-07-14T15:12:49.939Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "Elioenai Silva dos Santos",
    "Telefone": "5577981469075",
    "Email": "eli_oe_nai@hotmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.1",
    "Closer": "Ranier Oliveira",
    "Data reunião": "2026-07-13T19:00:00.000Z",
    "Data perda": "2026-07-14T14:59:57.830Z",
    "Motivo": "[IS][N] Lead quer fechar no futuro"
  },
  {
    "Nome": "Samara Alves Santos",
    "Telefone": "5575983619634",
    "Email": "contatossamaraa@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "4",
    "Closer": "Leandro dos Santos",
    "Data reunião": "2026-07-14T14:30:00.000Z",
    "Data perda": "2026-07-14T14:39:20.805Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "Nathalia Moraes",
    "Telefone": "5511965722755",
    "Email": "nathaliamoraes101010@gmail.com",
    "Segmento": "Outro",
    "Tier": "3.1",
    "Closer": "Ranier Oliveira",
    "Data reunião": "2026-07-14T10:00:00.000Z",
    "Data perda": "2026-07-14T14:25:54.615Z",
    "Motivo": "[IS] Prospect sem interesse"
  },
  {
    "Nome": "Carlos Henrique Cunha",
    "Telefone": "5519999823932",
    "Email": "carlinhoscunha.1982@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "5",
    "Closer": "Ranier Oliveira",
    "Data reunião": "2026-07-14T14:15:00.000Z",
    "Data perda": "2026-07-14T14:22:27.838Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "",
    "Telefone": "5511981167748",
    "Email": null,
    "Segmento": null,
    "Tier": null,
    "Closer": "João Paulo Maciel",
    "Data reunião": "2026-07-14T14:00:00.000Z",
    "Data perda": "2026-07-14T14:12:07.038Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "LEONARDO SILVA RIBEIRO",
    "Telefone": "5521966913010",
    "Email": "leonardos.ribeiro51@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "3.1",
    "Closer": "Luiz Moura",
    "Data reunião": "2026-07-14T14:15:00.000Z",
    "Data perda": "2026-07-14T13:53:46.242Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "Acarajé da Neide | Cidade Baixa",
    "Telefone": "5571994078181",
    "Email": "acarajedaneide97@gmail.com",
    "Segmento": "Outro",
    "Tier": "2",
    "Closer": "Guilherme Gomes",
    "Data reunião": "2026-07-09T17:45:00.000Z",
    "Data perda": "2026-07-14T11:41:08.345Z",
    "Motivo": "[IS] Lead duplicado"
  },
  {
    "Nome": "gilmara costa",
    "Telefone": "5561983786621",
    "Email": "futorrito.contato@gmail.com",
    "Segmento": "Sushi",
    "Tier": "1",
    "Closer": "Luan Nicolas",
    "Data reunião": "2026-07-14T17:15:00.000Z",
    "Data perda": "2026-07-14T11:20:44.054Z",
    "Motivo": "[IS] Lead duplicado"
  },
  {
    "Nome": "Adriana Donato dos Anjos",
    "Telefone": "5515991495885",
    "Email": "adriana.donato.anjos@hotmail.com",
    "Segmento": "Confeitaria",
    "Tier": "5",
    "Closer": "Ranier Oliveira",
    "Data reunião": "2026-07-14T10:45:00.000Z",
    "Data perda": "2026-07-14T09:31:38.609Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "Fabiano mayworm ",
    "Telefone": "5521975720667",
    "Email": "altashorash51@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "4",
    "Closer": "Leticia Silva",
    "Data reunião": "2026-07-08T17:15:00.000Z",
    "Data perda": "2026-07-14T09:31:09.710Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "Roberta Barcelos",
    "Telefone": "5521995246941",
    "Email": "barsan_fabrica@hotmail.com",
    "Segmento": "Outro",
    "Tier": "5",
    "Closer": "Leticia Silva",
    "Data reunião": "2026-07-14T09:15:00.000Z",
    "Data perda": "2026-07-14T09:23:57.768Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "Márcio",
    "Telefone": "5579999759956",
    "Email": "marciogoncalves@sementedovem.net.br",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Closer": "Rebeca Cabral",
    "Data reunião": "2026-07-14T09:15:00.000Z",
    "Data perda": "2026-07-14T09:18:48.725Z",
    "Motivo": "[IS] Lead duplicado"
  },
  {
    "Nome": "José Joalysonn Eustaquio Da Silva",
    "Telefone": "5511943614903",
    "Email": "joalysonn887kkj@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Closer": "Leandro dos Santos",
    "Data reunião": "2026-07-13T18:15:00.000Z",
    "Data perda": "2026-07-13T18:33:32.344Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "Priscila ferreira Falcao",
    "Telefone": "5513988557392",
    "Email": "theoffpriscila@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.1",
    "Closer": "Ranier Oliveira",
    "Data reunião": "2026-07-13T17:15:00.000Z",
    "Data perda": "2026-07-13T17:18:42.358Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "Letícia da Silva Santana",
    "Telefone": "5566996144452",
    "Email": "tocadaoncagn10@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "1",
    "Closer": "Leandro dos Santos",
    "Data reunião": "2026-07-14T16:15:00.000Z",
    "Data perda": "2026-07-13T17:08:03.332Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "Jueli Gomes De Lima",
    "Telefone": "5515996133642",
    "Email": "tete_amoitaoca@hotmail.com",
    "Segmento": "Restaurante",
    "Tier": "2",
    "Closer": "Leandro dos Santos",
    "Data reunião": "2026-07-13T14:30:00.000Z",
    "Data perda": "2026-07-13T14:45:37.145Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "Giovana",
    "Telefone": "5513991493233",
    "Email": "pizzariaterranostra26@gmail.com",
    "Segmento": "Pizzaria",
    "Tier": "1",
    "Closer": "Luan Nicolas",
    "Data reunião": "2026-07-13T14:30:00.000Z",
    "Data perda": "2026-07-13T14:41:26.380Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "CLEBER De Araujo",
    "Telefone": "5538984100109",
    "Email": "lanchonete@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "3.2",
    "Closer": "Gustavo Duarte Pinheiro Silva",
    "Data reunião": "2026-07-10T14:15:00.000Z",
    "Data perda": "2026-07-13T13:40:04.662Z",
    "Motivo": "[IS][N] Lead quer fechar no futuro"
  },
  {
    "Nome": "Priscilla Reis",
    "Telefone": "5521966327797",
    "Email": "priscillareis014@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "4",
    "Closer": "Ranier Oliveira",
    "Data reunião": "2026-07-08T18:00:00.000Z",
    "Data perda": "2026-07-13T10:37:19.390Z",
    "Motivo": "[IS][PRE] Não é prioridade"
  },
  {
    "Nome": "Danilo João Medrado Lobo",
    "Telefone": "5564992219381",
    "Email": "danilojoaomedrado@gmail.com",
    "Segmento": "Lanchonete",
    "Tier": "1",
    "Closer": "Rebeca Cabral",
    "Data reunião": "2026-07-13T10:30:00.000Z",
    "Data perda": "2026-07-13T10:31:46.881Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "Priscila Salviano",
    "Telefone": "5547999123775",
    "Email": "priscilarpsaviano@gmail.com",
    "Segmento": "Hamburgueria",
    "Tier": "5",
    "Closer": "Leticia Silva",
    "Data reunião": "2026-07-13T10:45:00.000Z",
    "Data perda": "2026-07-13T10:10:12.144Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "Katiussia mariano teixeira",
    "Telefone": "5532998561626",
    "Email": "penelopefranca54@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "Tier 3.1",
    "Closer": "Ranier Oliveira",
    "Data reunião": "2026-07-09T09:15:00.000Z",
    "Data perda": "2026-07-13T09:37:37.421Z",
    "Motivo": "[IS] Prospect sem interesse"
  },
  {
    "Nome": "Caroline",
    "Telefone": "5531973074372",
    "Email": "carolbmarques@hotmail.com",
    "Segmento": "Restaurante",
    "Tier": "4",
    "Closer": "Luiz Moura",
    "Data reunião": "2026-07-10T15:00:00.000Z",
    "Data perda": "2026-07-10T15:41:14.585Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "...",
    "Telefone": "(85) 98180-1328",
    "Email": "...",
    "Segmento": null,
    "Tier": "Adição manual",
    "Closer": "João Paulo Maciel",
    "Data reunião": null,
    "Data perda": "2026-07-10T15:34:58.579Z",
    "Motivo": "[IS][N] Lead recebeu última tentativa de contato"
  },
  {
    "Nome": "Roberto Mazoli",
    "Telefone": "5521988470800",
    "Email": "betinho@calmon.net.br",
    "Segmento": "Pizzaria",
    "Tier": "3.2",
    "Closer": "Luan Nicolas",
    "Data reunião": "2026-07-10T10:30:00.000Z",
    "Data perda": "2026-07-10T14:54:47.131Z",
    "Motivo": "[IS] Lead duplicado"
  },
  {
    "Nome": "Marlon do nascimento barboza",
    "Telefone": "5521974464704",
    "Email": "marlondonascimentobarbosa18@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Closer": "Cleber Rodrigues",
    "Data reunião": "2026-07-10T10:45:00.000Z",
    "Data perda": "2026-07-10T11:16:35.562Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "Luana Fiuza Araújo Trindade",
    "Telefone": "5537991318657",
    "Email": "Luaninhafiuza.lf@gmail.com",
    "Segmento": "Marmitaria",
    "Tier": "3.2",
    "Closer": null,
    "Data reunião": null,
    "Data perda": "2026-07-10T10:47:14.008Z",
    "Motivo": "[IS] Lead já é cliente"
  },
  {
    "Nome": "Vitor Vinicius",
    "Telefone": "5571988991519",
    "Email": "biguar13@gmail.com",
    "Segmento": "Pastelaria",
    "Tier": "5",
    "Closer": "Luiz Moura",
    "Data reunião": "2026-07-10T09:15:00.000Z",
    "Data perda": "2026-07-10T09:28:55.259Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "Juliana Cinara Rodrigues",
    "Telefone": "5511993049466",
    "Email": "juliepop.co@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "3.2",
    "Closer": "Gustavo Duarte Pinheiro Silva",
    "Data reunião": "2026-07-09T17:15:00.000Z",
    "Data perda": "2026-07-09T18:01:11.401Z",
    "Motivo": "[IS][N] Lead não tem orçamento"
  },
  {
    "Nome": "Kaio Alison",
    "Telefone": "5588999145306",
    "Email": "kaioalisonrs@gmail.com",
    "Segmento": "Sushi",
    "Tier": "1",
    "Closer": "Leandro dos Santos",
    "Data reunião": "2026-07-09T17:15:00.000Z",
    "Data perda": "2026-07-09T17:39:24.254Z",
    "Motivo": "[IS][N] Lead não tem orçamento"
  },
  {
    "Nome": "Matheus Barreto",
    "Telefone": "5544997622640",
    "Email": "maitheusbr@gmail.com",
    "Segmento": "Outro",
    "Tier": "1",
    "Closer": "João Paulo Maciel",
    "Data reunião": "2026-07-09T10:00:00.000Z",
    "Data perda": "2026-07-09T16:19:43.715Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "Rarielson Castro",
    "Telefone": "5571991700315",
    "Email": "rarielsoncastro@gmail.com",
    "Segmento": "Confeitaria",
    "Tier": "2",
    "Closer": "Luan Nicolas",
    "Data reunião": "2026-07-09T15:45:00.000Z",
    "Data perda": "2026-07-09T15:51:32.949Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "Carla Andrade",
    "Telefone": "5521987780494",
    "Email": "dalmuschurrascaria@gmail.com",
    "Segmento": "Restaurante",
    "Tier": "1",
    "Closer": "Guilherme Gomes",
    "Data reunião": "2026-07-09T14:30:00.000Z",
    "Data perda": "2026-07-09T14:42:57.820Z",
    "Motivo": "[IS] No-show"
  },
  {
    "Nome": "Jefferson Sebastião de Oliveira",
    "Telefone": "5584998687966",
    "Email": "jeffinhotkd852@gmail.com",
    "Segmento": "Açaiteria",
    "Tier": "3.1",
    "Closer": "Luiz Moura",
    "Data reunião": "2026-07-09T14:15:00.000Z",
    "Data perda": "2026-07-09T14:28:42.064Z",
    "Motivo": "[IS] No-show"
  }
]