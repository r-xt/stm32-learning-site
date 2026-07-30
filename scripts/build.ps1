. "$PSScriptRoot\common.ps1"

$sitePython = Initialize-SiteEnvironment
Set-Location -LiteralPath $script:ProjectRoot

Write-Host "Building the site in strict mode..." -ForegroundColor Cyan
& $sitePython -m mkdocs build --clean --strict
if ($LASTEXITCODE -ne 0) { throw "The strict MkDocs build failed." }

Write-Host "Checking content, links, and offline output..." -ForegroundColor Cyan
& $sitePython (Join-Path $PSScriptRoot "check_site.py")
if ($LASTEXITCODE -ne 0) { throw "Site verification failed." }

$distDir = Join-Path $script:ProjectRoot "dist"
if (-not (Test-Path -LiteralPath $distDir)) {
    New-Item -ItemType Directory -Path $distDir | Out-Null
}
$zipPath = Join-Path $distDir "stm32-learning-site-offline.zip"
Compress-Archive -Path (Join-Path $script:ProjectRoot "site\*") -DestinationPath $zipPath -Force
Write-Host "Build complete: $zipPath" -ForegroundColor Green
