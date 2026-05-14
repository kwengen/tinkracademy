<#
.SYNOPSIS
    Kjorer SQL mot Supabase via Management API.

.DESCRIPTION
    Sender en SQL-streng eller innholdet av en .sql-fil til
    Supabase Management API og skriver ut resultatet.

.PARAMETER SqlFile
    Sti til .sql-fil som skal kjores.

.PARAMETER Sql
    SQL-streng som skal kjores direkte (alternativ til SqlFile).

.PARAMETER Token
    Supabase Management API-token.
    Hentes automatisk fra miljoevariabelen SUPABASE_TOKEN hvis ikke oppgitt.
    Generer token paa: https://supabase.com/dashboard/account/tokens

.PARAMETER ProjectRef
    Supabase prosjekt-ID. Standard: rusqzivkoswjgdjhjkvi

.EXAMPLE
    # Kjor en SQL-fil
    .\Invoke-SupabaseSQL.ps1 -SqlFile .\tema-seksjoner.sql -Token sbp_xxxxx

.EXAMPLE
    # Token fra miljoevariabel
    $env:SUPABASE_TOKEN = "sbp_xxxxx"
    .\Invoke-SupabaseSQL.ps1 -SqlFile .\seed-kommunesamarbeid-seksjoner.sql

.EXAMPLE
    # Inline SQL
    .\Invoke-SupabaseSQL.ps1 -Sql "SELECT count(*) FROM tema_seksjoner"
#>
param(
    [string]$SqlFile,
    [string]$Sql,
    [string]$Token      = $env:SUPABASE_TOKEN,
    [Parameter(Mandatory)]
    [string]$ProjectRef
)

# Validering

if (-not $Token) {
    Write-Error "Token mangler. Oppgi -Token eller sett SUPABASE_TOKEN."
    Write-Host "  Generer token: https://supabase.com/dashboard/account/tokens" -ForegroundColor Yellow
    exit 1
}

if ($SqlFile -and $Sql) {
    Write-Error "Oppgi enten -SqlFile eller -Sql, ikke begge."
    exit 1
}

if ($SqlFile) {
    if (-not (Test-Path $SqlFile)) {
        Write-Error "Finner ikke filen: $SqlFile"
        exit 1
    }
    # Les filen som UTF-8 eksplisitt (File::ReadAllText er mer robust enn Get-Content)
    $Sql   = [System.IO.File]::ReadAllText($SqlFile, [System.Text.Encoding]::UTF8)
    $label = Split-Path $SqlFile -Leaf
} elseif ($Sql) {
    $label = "inline SQL"
} else {
    Write-Error "Oppgi -SqlFile eller -Sql."
    exit 1
}

# Kall API

$url      = "https://api.supabase.com/v1/projects/$ProjectRef/database/query"
$bodyJson = @{ query = $Sql } | ConvertTo-Json -Depth 3 -Compress

# Eksplisitt UTF-8 encoding – sikrer at aeoaa ikke korrupteres.
# PowerShell 5.1 sender string-body med systemkoding (Windows-1252 paa norsk
# Windows), som odelagge norske tegn i Supabase. Bytes-tilnermingen er trygg.
$bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($bodyJson)

Write-Host "Kjoerer: $label" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod `
        -Method      Post `
        -Uri         $url `
        -Headers     @{ Authorization = "Bearer $Token"; "Content-Type" = "application/json; charset=utf-8" } `
        -Body        $bodyBytes `
        -ErrorAction Stop

    Write-Host "OK: Vellykket" -ForegroundColor Green
    if ($response) { $response | Format-Table }
}
catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    $msg        = $_.ErrorDetails.Message
    if (-not $msg) { $msg = $_.Exception.Message }
    Write-Host "FEIL (HTTP $statusCode): $msg" -ForegroundColor Red
    exit 1
}
