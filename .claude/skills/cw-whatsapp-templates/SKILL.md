---
name: cw-whatsapp-templates
description: Use when creating, updating, listing, or troubleshooting WhatsApp Business API message templates for Cardápio Web accounts via Meta Graph API.
metadata:
  type: reference
---

# WhatsApp Templates — Meta Graph API (Cardápio Web)

## Uso rápido (via script)

```bash
python create_template.py
```

O script lê o `.env` automaticamente e guia o processo interativamente.
Inputs necessários: conta, nome do template, corpo da mensagem.

## Arquivos

| Arquivo | Finalidade |
|---|---|
| `.env` | Credenciais das duas contas CW |
| `create_template.py` | Script interativo de criação |
| `SKILL.md` | Referência da API |

## Contas CW

| Conta | WABA ID | Phone ID |
|---|---|---|
| Clara SDR (CW) | 25775259532138577 | 963455253516904 |
| CW Comercial | 1307716393706459 | 567465706453207 |

> Tokens estão no `.env`. System User tokens não expiram.

## Regras de nomenclatura

- Somente: lowercase, alfanumérico, underscore
- Proibido: acento, hífen, maiúscula
- Exemplo: `confirmação-hoje-Marcos` → `confirmacao_hoje_marcos`

## Restrições da Meta API

| Restrição | Detalhe |
|---|---|
| Variável no início ou fim | Proibido — adicionar texto antes: "Oi, {{nome}}" |
| Botão quick_reply | Máximo 25 caracteres |
| Editar template APPROVED | Não permitido — deletar e recriar |
| Recriar após deletar | Lockout de 4 semanas no mesmo nome — usar sufixo `_b`, `_v2` etc. |
| URL dinâmica em botão | Usa `{{1}}` posicional, independente do `parameter_format` do body |

## Criar template

```
POST https://graph.facebook.com/v21.0/{WABA_ID}/message_templates
Authorization: Bearer {TOKEN}
Content-Type: application/json
```

### MARKETING — named params (padrão)

```json
{
  "name": "nome_do_template",
  "language": "pt_BR",
  "category": "MARKETING",
  "parameter_format": "NAMED",
  "components": [
    {
      "type": "BODY",
      "text": "Oi, {{nome}}! Texto aqui.",
      "example": {
        "body_text_named_params": [
          {"param_name": "nome", "example": "Maria"}
        ]
      }
    }
  ]
}
```

### Com múltiplas variáveis (nome + user)

```json
"example": {
  "body_text_named_params": [
    {"param_name": "nome", "example": "Maria"},
    {"param_name": "user", "example": "Marcos Silva"}
  ]
}
```

### Adicionar botão QUICK_REPLY

```json
{
  "type": "BUTTONS",
  "buttons": [{"type": "QUICK_REPLY", "text": "Não quero mensagens"}]
}
```

### Adicionar botão URL dinâmica

```json
{
  "type": "BUTTONS",
  "buttons": [
    {
      "type": "URL",
      "text": "Criar meu cardápio",
      "url": "https://onboarding.cardapioweb.com/?id={{1}}",
      "example": ["https://onboarding.cardapioweb.com/?id=abc123"]
    }
  ]
}
```

### UTILITY — com header e footer

```json
{
  "category": "UTILITY",
  "components": [
    {"type": "HEADER", "format": "TEXT", "text": "Texto do header"},
    {"type": "BODY", "text": "...", "example": {...}},
    {"type": "FOOTER", "text": "Texto do rodapé"},
    {"type": "BUTTONS", "buttons": [...]}
  ]
}
```

## Verificar status

```
GET https://graph.facebook.com/v21.0/{TEMPLATE_ID}?fields=name,status,rejected_reason&access_token={TOKEN}
```

Status: `PENDING` → `APPROVED` | `REJECTED`

## Listar templates da conta

```
GET https://graph.facebook.com/v21.0/{WABA_ID}/message_templates?fields=id,name,status,category,language,components&limit=50&access_token={TOKEN}
```

## Deletar template

```
DELETE https://graph.facebook.com/v21.0/{WABA_ID}/message_templates?name={TEMPLATE_NAME}&hsm_id={TEMPLATE_ID}&access_token={TOKEN}
```

> Aguardar 4 semanas para recriar com o mesmo nome.

## Enviar template via n8n (HTTP Request node)

```json
{
  "messaging_product": "whatsapp",
  "to": "{{ $json.phone }}",
  "type": "template",
  "template": {
    "name": "nome_do_template",
    "language": {"code": "pt_BR"},
    "components": [
      {
        "type": "body",
        "parameters": [
          {"type": "text", "parameter_name": "nome", "text": "{{ $json.first_name }}"},
          {"type": "text", "parameter_name": "user", "text": "{{ $json.agent_name }}"}
        ]
      }
    ]
  }
}
```

### Com botão URL dinâmica

```json
{
  "type": "button",
  "sub_type": "url",
  "index": "0",
  "parameters": [{"type": "text", "text": "{{ $json.onboarding_id }}"}]
}
```

### Gerar onboarding_id (hash SHA-256 do email) no n8n

Usar nó **Crypto**:
- Action: Hash
- Type: SHA256
- Value: `{{ $json.email }}`
- Property Name: `onboarding_id`

## Erros comuns

| Código | Mensagem | Causa | Fix |
|---|---|---|---|
| `2388299` | Parâmetros no início ou fim | `{{nome}}` no começo/fim do body | Adicionar texto antes: "Oi, {{nome}}" |
| `2388039` | Status não pode ser alterado | Template APPROVED não editável | Deletar e recriar com nome novo |
| `2388023` | Idioma sendo excluído | Recriou imediatamente após deletar | Aguardar 4 semanas ou usar nome diferente |
| `100` | Missing Permission | Token sem escopo correto | Usar System User Token com `whatsapp_business_management` |
| — | Botão rejeitado | Texto > 25 chars | "Não quero mensagens" = 19 chars ✓ |
