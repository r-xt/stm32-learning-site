$ErrorActionPreference = "Stop"
$script:ProjectRoot = Split-Path -Parent $PSScriptRoot

function Initialize-SiteEnvironment {
    Set-Location -LiteralPath $script:ProjectRoot
    $venvPython = Join-Path $script:ProjectRoot ".venv\Scripts\python.exe"

    if (-not (Test-Path -LiteralPath $venvPython)) {
        Write-Host "First run: creating an isolated Python environment..." -ForegroundColor Cyan
        & python -m venv (Join-Path $script:ProjectRoot ".venv")
        if ($LASTEXITCODE -ne 0) { throw "Could not create the Python environment. Confirm Python 3 is installed." }
    }

    $sitePackages = Join-Path $script:ProjectRoot ".venv\Lib\site-packages"
    $mkdocsPackage = Join-Path $sitePackages "mkdocs"
    $materialPackage = Join-Path $sitePackages "material"
    if (-not (Test-Path -LiteralPath $mkdocsPackage) -or -not (Test-Path -LiteralPath $materialPackage)) {
        Write-Host "First run: installing site dependencies (network required)..." -ForegroundColor Cyan
        & $venvPython -m pip install --disable-pip-version-check -r (Join-Path $script:ProjectRoot "requirements.txt") | Out-Host
        if ($LASTEXITCODE -ne 0) { throw "Dependency installation failed. Check the network and pip output above." }
    }

    return $venvPython
}
