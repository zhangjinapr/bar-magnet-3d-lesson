$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$releaseDir = Join-Path $projectRoot 'release'
$version = (Get-Content -LiteralPath (Join-Path $projectRoot 'package.json') -Raw | ConvertFrom-Json).version
$zipPath = Join-Path $releaseDir ("bar-magnet-3d-offline-v$version.zip")

New-Item -ItemType Directory -Path $releaseDir -Force | Out-Null
Compress-Archive -LiteralPath @(
  (Join-Path $projectRoot 'index.html'),
  (Join-Path $projectRoot 'README-for-buyers.txt')
) -DestinationPath $zipPath -Force
Write-Output "Created $zipPath"
