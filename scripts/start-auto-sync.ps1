param([Parameter(Mandatory = $true)][string]$NodePath)
$ErrorActionPreference = 'Stop'
$taskRoot = Split-Path -Parent $PSScriptRoot
$taskState = Join-Path $taskRoot '.auto-sync'
New-Item -ItemType Directory -Path $taskState -Force | Out-Null
if (Test-Path -LiteralPath (Join-Path $taskState 'paused')) { exit 0 }
$taskScript = Join-Path $PSScriptRoot 'auto-sync.mjs'
$taskProcess = Start-Process -FilePath $NodePath -ArgumentList @(('"{0}"' -f $taskScript), '--watch') -WorkingDirectory $taskRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $taskState 'watcher.stdout.log') -RedirectStandardError (Join-Path $taskState 'watcher.stderr.log') -Wait -PassThru
exit $taskProcess.ExitCode
