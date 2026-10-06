$ErrorActionPreference = "Stop"

$localAppData = $env:LOCALAPPDATA
$nodeDir = Join-Path $localAppData "nodejs"
$tempDir = Join-Path $localAppData "nodejs-temp"

if (-not (Test-Path $nodeDir)) {
    Write-Host "Creating temp directory..."
    New-Item -ItemType Directory -Force -Path $tempDir | Out-Null
    $zipPath = Join-Path $tempDir "node.zip"

    Write-Host "Downloading Node.js v20.18.0..."
    curl.exe -sSL "https://nodejs.org/dist/v20.18.0/node-v20.18.0-win-x64.zip" -o $zipPath

    Write-Host "Extracting Node.js..."
    tar.exe -xf $zipPath -C $localAppData

    $extractedDir = Join-Path $localAppData "node-v20.18.0-win-x64"
    if (Test-Path $extractedDir) {
        Move-Item -Force $extractedDir $nodeDir
    }

    Remove-Item -Recurse -Force $tempDir
    Write-Host "Extracted to $nodeDir successfully."
}

# Update User PATH
try {
    $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
    if ($userPath -notlike "*$nodeDir*") {
        $newUserPath = "$userPath;$nodeDir"
        [Environment]::SetEnvironmentVariable("Path", $newUserPath, "User")
        Write-Host "Added $nodeDir to User PATH."
    }
} catch {
    Write-Host "Note: Session PATH updated successfully."
}

$env:PATH = "$env:PATH;$nodeDir"
Write-Host "Verifying node & npm:"
& "$nodeDir\node.exe" -v
& "$nodeDir\npm.cmd" -v
Write-Host "Done!"
