<#
.SYNOPSIS
    Kjorer alle WengenCMS-migrasjonsskript mot Supabase i riktig rekkefolge.

.DESCRIPTION
    Alle SQL-filer er idempotente (trygt a kjore flere ganger).
    Forutsetter at SUPABASE_TOKEN er satt som miljoevariabel, eller oppgitt som parameter.

.PARAMETER Token
    Supabase Management API-token.
    Hentes fra miljoevariabelen SUPABASE_TOKEN hvis ikke oppgitt.
    Generer pa: https://supabase.com/dashboard/account/tokens

.PARAMETER ProjectRef
    Supabase-prosjekt-ID. Finn det i Supabase-dashboardet under Project Settings -> General.

.EXAMPLE
    $env:SUPABASE_TOKEN = "sbp_xxxxx"
    .\supabase\kjor-alt.ps1 -ProjectRef "abcdefghij1234567890"
#>
param(
    [string]$Token      = $env:SUPABASE_TOKEN,
    [Parameter(Mandatory)]
    [string]$ProjectRef
)

if (-not $Token) {
    Write-Error "SUPABASE_TOKEN mangler. Sett variabelen eller oppgi -Token."
    Write-Host "  Generer token: https://supabase.com/dashboard/account/tokens" -ForegroundColor Yellow
    exit 1
}

$Root   = Split-Path $PSScriptRoot -Parent
$Script = Join-Path $PSScriptRoot "Invoke-SupabaseSQL.ps1"

$Filer = @(
    "schema.sql",        # 1. Kjerne: profiles, organizations, roller, trigger
    "artikler.sql",      # 2. Eksempel-innholdstype: artikler + seksjoner
    "seed-artikler.sql"  # 3. Lorem ipsum-seed (kan hoppes over i prod)
)

Write-Host ""
Write-Host "WengenCMS – migrasjon mot prosjekt: $ProjectRef" -ForegroundColor Cyan
Write-Host ("=" * 55) -ForegroundColor Cyan

$Steg = 1
foreach ($fil in $Filer) {
    $sti = Join-Path $PSScriptRoot $fil
    Write-Host ""
    Write-Host "[$Steg/$($Filer.Count)] $fil" -ForegroundColor Yellow
    & $Script -SqlFile $sti -Token $Token -ProjectRef $ProjectRef
    if ($LASTEXITCODE -ne 0) {
        Write-Host "AVBRYTER – feil i $fil" -ForegroundColor Red
        exit 1
    }
    $Steg++
}

Write-Host ""
Write-Host "Ferdig! Alle $($Filer.Count) skript kjort vellykket." -ForegroundColor Green
Write-Host ""
Write-Host "Neste steg:" -ForegroundColor Cyan
Write-Host "  1. Sett NEXT_PUBLIC_SUPABASE_URL og NEXT_PUBLIC_SUPABASE_ANON_KEY i apps/web/.env.local"
Write-Host "  2. pnpm install"
Write-Host "  3. pnpm dev"
