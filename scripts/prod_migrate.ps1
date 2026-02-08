<#
.SYNOPSIS
  Script PowerShell para realizar backup, testar conexão e aplicar migrations em BD remoto.

USO
  Execute no PowerShell local. O script pede senha do Postgres de forma segura.

  # Prefer setting POSTGRES_HOST/POSTGRES_PORT/POSTGRES_DB/POSTGRES_USER in your .env
  # and run the script without arguments:
  #   .\scripts\prod_migrate.ps1
  # Or explicitly pass environment variables:
  #   .\scripts\prod_migrate.ps1 -Host $env:POSTGRES_HOST -Port $env:POSTGRES_PORT -Database $env:POSTGRES_DB -User $env:POSTGRES_USER

#>

param(
  [string]$Host,
  [int]$Port,
  [string]$Database,
  [string]$User,
  [string]$BackupDir = ".",
  [switch]$SkipBackup
)

# If parameters were not provided, fall back to environment variables, then sensible defaults
if (-not $Host) { $Host = $env:POSTGRES_HOST }
if (-not $Host) { $Host = '72.60.143.197' }

if (-not $Port) {
  if ($env:POSTGRES_PORT) { $Port = [int]$env:POSTGRES_PORT } else { $Port = 5432 }
}

if (-not $Database) { $Database = $env:POSTGRES_DB }
if (-not $Database) { $Database = 'datavisio' }

if (-not $User) { $User = $env:POSTGRES_USER }
if (-not $User) { $User = 'postgres' }

function Fail([string]$msg) {
  Write-Error $msg
  exit 1
}

Write-Host "Produção: host=$Host port=$Port db=$Database user=$User" -ForegroundColor Cyan

$securePwd = Read-Host -AsSecureString "Digite a senha do usuário postgres (entrada oculta)"
$plainPwd = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePwd))

if (-not $SkipBackup) {
  $timestamp = (Get-Date).ToString('yyyyMMdd-HHmm')
  $backupFile = Join-Path $BackupDir "backup_${Database}_$timestamp.dump"
  Write-Host "Fazendo backup em: $backupFile" -ForegroundColor Yellow
  $env:PGPASSWORD = $plainPwd
  $pgDump = "pg_dump"
  $pgDumpArgs = "-h $Host -p $Port -U $User -d $Database -F c -b -v -f `"$backupFile`""
  $res = & $pgDump $pgDumpArgs 2>&1
  if ($LASTEXITCODE -ne 0) { Write-Error "pg_dump falhou:`n$res"; Fail "Backup falhou" }
  Write-Host "Backup concluído" -ForegroundColor Green
}

Write-Host "Configurando DATABASE_URL temporário e testando conexão..." -ForegroundColor Cyan
$env:DATABASE_URL = "postgresql://$User:$plainPwd@$Host:$Port/$Database?sslmode=disable"

Write-Host "Rodando npm run db:test" -ForegroundColor Cyan
$test = npm run db:test 2>&1
if ($LASTEXITCODE -ne 0) { Write-Error "Teste de conexão falhou:`n$test"; Fail "Teste de conexão falhou" }
Write-Host "Conexão OK" -ForegroundColor Green

Write-Host "Aplicando migrations (npm run db:migrate)..." -ForegroundColor Cyan
$m = npm run db:migrate 2>&1
if ($LASTEXITCODE -ne 0) { Write-Error "Migrations falharam:`n$m"; Fail "Migrations falharam" }
Write-Host "Migrations aplicadas com sucesso" -ForegroundColor Green

# cleanup
Remove-Variable plainPwd -ErrorAction SilentlyContinue
Remove-Variable securePwd -ErrorAction SilentlyContinue
Remove-Variable PGPASSWORD -ErrorAction SilentlyContinue
