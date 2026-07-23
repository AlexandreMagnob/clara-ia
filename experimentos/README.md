# Experimentos

O **plano**: hipótese, desenho, como medir, o que falta implementar.
Quando o experimento fecha e vira número, o resultado vai para
[../analises/](../analises/) e o pós-mortem para o Confluence (skill `pos-mortem-experimento`).

## Convenção

```
<codigo>_<slug>.md      ← o plano
<codigo>_<artefato>.js  ← código que o experimento precisa (Code node, patch)
```

O código é o do Jira/Máquina de Hipóteses, minúsculo: `gwt-2733`, `exp-16`, `sm30h7`.
Tudo do mesmo experimento compartilha o prefixo, então `ls exp-16*` junta o conjunto.

Se um experimento passar de ~4 arquivos, promova para pasta `<codigo>/` e mantenha os
nomes internos sem o prefixo repetido.

## Em aberto

| Código | Experimento | Estado |
|---|---|---|
| [GWT-2733](gwt-2733_closer-atrasado.md) | Clara tranquiliza o lead e avisa o closer quando ele atrasa | aguardando export do JSON |
| [GWT-2748](gwt-2748_notificacao-diaria-experimentos.md) | Notificação diária dos experimentos ativos | automação em [`../automacoes/experimentos/`](../automacoes/experimentos/) |
| [EXP-16](exp-16_plano-mensal-vs-anual.md) | A/B de plano mensal vs anual | implementado, em teste |
| [SM30H7](sm30h7_prova-social.md) | Prova social por segmento na Etapa 3 | Code node pronto, casos reais pendentes |

Mantenha esta tabela viva — é ela que responde "o que está rodando agora?".
