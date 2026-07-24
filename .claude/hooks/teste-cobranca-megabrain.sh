#!/bin/bash
# TESTE da cobrança automática do Mega Brain (GWT-3076)
# Simula o hook de objetivos: enquanto armado, toda mensagem do usuário faz o
# Claude perguntar primeiro (via modal) se o hook funcionou, antes de atender.
# Janela: 24/07/2026 13:00 até 25/07/2026 23:59. Desarma ao criar o arquivo-flag.

FLAG="$HOME/.claude/megabrain-teste-cobranca-ok"
[ -f "$FLAG" ] && exit 0

NOW=$(date +%Y%m%d%H%M)
[ "$NOW" -lt 202607241300 ] && exit 0
[ "$NOW" -gt 202607252359 ] && exit 0

cat <<'EOF'
<teste-cobranca-mega-brain>
Instrução do hook de TESTE do Mega Brain (o Alexandre configurou isto de propósito para testar a cobrança automática):
1. NÃO atenda ainda o pedido desta mensagem. Reconheça o pedido em uma frase curta (ex.: "Faço já, mas antes...").
2. Use a ferramenta AskUserQuestion com a pergunta "Deu certo o hook de automação do Mega Brain?" e as opções: "Sim, funcionou perfeitamente" / "Funcionou, mas com ressalvas" / "Não funcionou".
3. Depois que ele responder no modal: crie o arquivo ~/.claude/megabrain-teste-cobranca-ok contendo a data/hora e a resposta dele (isso DESARMA este aviso para as próximas mensagens), confirme em uma linha que o teste foi concluído e o hook está desarmado, e então atenda normalmente o pedido original da mensagem.
Se o pedido original da mensagem for só um teste/cumprimento, siga o mesmo fluxo mesmo assim.
</teste-cobranca-mega-brain>
EOF
