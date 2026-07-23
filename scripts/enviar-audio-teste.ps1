# =====================================================================
#  TESTE: enviar 1 audio pelo WhatsApp (Clara IA)
#  Edite SO as 2 linhas abaixo e rode o script.
# =====================================================================

$TO    = "55XXXXXXXXXXX"      # <-- SEU numero com DDI+DDD, so digitos. Ex: 5511999998888
$TOKEN = "COLE_SEU_TOKEN"     # <-- Token Bearer da Meta (campo apikey do fluxo)

# --- nao precisa mexer daqui pra baixo ---
$PHONE_ID = "963455253516904"
$AUDIO    = "$PSScriptRoot\clara-followup.ogg"

Write-Host "1/2 - Subindo o audio para a Meta..." -ForegroundColor Cyan
$up = curl.exe -s -X POST "https://graph.facebook.com/v24.0/$PHONE_ID/media" `
  -H "Authorization: Bearer $TOKEN" `
  -F "messaging_product=whatsapp" `
  -F "type=audio/ogg" `
  -F "file=@$AUDIO;type=audio/ogg" | ConvertFrom-Json

if (-not $up.id) {
  Write-Host "ERRO no upload. Resposta da Meta:" -ForegroundColor Red
  $up | ConvertTo-Json -Depth 5
  return
}
Write-Host ("   OK! media_id = " + $up.id) -ForegroundColor Green

Write-Host "2/2 - Enviando o audio para $TO ..." -ForegroundColor Cyan
$body = @{
  messaging_product = "whatsapp"
  to                = $TO
  type              = "audio"
  audio             = @{ id = $up.id }
} | ConvertTo-Json

$send = curl.exe -s -X POST "https://graph.facebook.com/v24.0/$PHONE_ID/messages" `
  -H "Authorization: Bearer $TOKEN" `
  -H "Content-Type: application/json" `
  -d $body | ConvertFrom-Json

if ($send.messages) {
  Write-Host "ENVIADO! Confira seu WhatsApp." -ForegroundColor Green
} else {
  Write-Host "ERRO no envio. Resposta da Meta:" -ForegroundColor Red
  $send | ConvertTo-Json -Depth 5
}
