param(
  [string]$SourcePath = "index.html",
  [string]$BackupPath = "backup/index.backup.html"
)

$ErrorActionPreference = "Stop"

$resolvedSource = Resolve-Path -Path $SourcePath
$backupDirectory = Split-Path -Path $BackupPath -Parent

if ($backupDirectory -and -not (Test-Path -Path $backupDirectory)) {
  New-Item -ItemType Directory -Path $backupDirectory -Force | Out-Null
}

Copy-Item -Path $resolvedSource.Path -Destination $BackupPath -Force
Write-Output ("Backup updated: {0} -> {1}" -f $resolvedSource.Path, (Resolve-Path -Path (Split-Path -Path $BackupPath -Parent)).Path + "\" + (Split-Path -Path $BackupPath -Leaf))
