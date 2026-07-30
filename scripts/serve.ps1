. "$PSScriptRoot\common.ps1"

$sitePython = Initialize-SiteEnvironment
Write-Host "Site URL: http://127.0.0.1:8000/" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop." -ForegroundColor DarkGray
& $sitePython -m mkdocs serve --strict --dev-addr 127.0.0.1:8000
if ($LASTEXITCODE -ne 0) { throw "The local server exited with an error." }
