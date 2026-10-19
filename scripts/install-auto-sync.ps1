param([switch]$Uninstall)
$ErrorActionPreference = 'Stop'
$taskRoot = Split-Path -Parent $PSScriptRoot
$taskName = 'PlanKraft-GitHub-AutoSync'
$taskLauncher = Join-Path $PSScriptRoot 'start-auto-sync.ps1'
$taskExisting = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if ($taskExisting -and -not ($taskExisting.Actions.Arguments -like ('*' + $taskLauncher + '*'))) {
    throw 'An unrelated task already uses this name. It was not changed.'
}
if ($Uninstall) {
    $taskState = Join-Path $taskRoot '.auto-sync'
    New-Item -ItemType Directory -Path $taskState -Force | Out-Null
    Set-Content -LiteralPath (Join-Path $taskState 'paused') -Value 'Auto-sync uninstalled.'
    if ($taskExisting) {
        Stop-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
        Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
    }
    Write-Output 'Auto-sync disabled and its Windows startup task removed.'
    exit 0
}
$taskNode = (Get-Command node.exe -ErrorAction Stop).Source
& $taskNode (Join-Path $PSScriptRoot 'auto-sync.mjs') --check
if ($LASTEXITCODE -ne 0) { throw 'Repository checks failed; startup was not configured.' }
$taskIdentity = [Security.Principal.WindowsIdentity]::GetCurrent().Name
$taskArguments = '-NoProfile -NonInteractive -WindowStyle Hidden -ExecutionPolicy Bypass -File "{0}" -NodePath "{1}"' -f $taskLauncher, $taskNode
$taskAction = New-ScheduledTaskAction -Execute (Join-Path $PSHOME 'powershell.exe') -Argument $taskArguments -WorkingDirectory $taskRoot
$taskTrigger = New-ScheduledTaskTrigger -AtLogOn -User $taskIdentity
$taskPrincipal = New-ScheduledTaskPrincipal -UserId $taskIdentity -LogonType Interactive -RunLevel Limited
$taskSettings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit ([TimeSpan]::Zero) -MultipleInstances IgnoreNew -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 1)
Register-ScheduledTask -TaskName $taskName -Action $taskAction -Trigger $taskTrigger -Principal $taskPrincipal -Settings $taskSettings -Description 'Sync saved Plan Kraft project changes to mathes2004/plan_kraft after 30 seconds idle.' -Force | Out-Null
$taskPaused = Join-Path $taskRoot '.auto-sync\paused'
if (Test-Path -LiteralPath $taskPaused) { Remove-Item -LiteralPath $taskPaused }
Start-ScheduledTask -TaskName $taskName
Write-Output 'Auto-sync installed for this Windows user and started. Logs and status: .auto-sync/.'
