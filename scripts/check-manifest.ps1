$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$manifestPath = Join-Path $repoRoot "manuscript/MANIFEST.md"

if (-not (Test-Path $manifestPath)) {
    throw "Missing manuscript/MANIFEST.md"
}

$content = Get-Content -Raw $manifestPath
$matches = [regex]::Matches($content, '`([^`]+\.md)`')
$missing = @()

foreach ($match in $matches) {
    $relative = $match.Groups[1].Value
    $fullPath = Join-Path (Join-Path $repoRoot "manuscript") $relative
    if (-not (Test-Path $fullPath)) {
        $missing += $relative
    }
}

if ($missing.Count -gt 0) {
    Write-Error "Missing manifest paths:`n$($missing -join "`n")"
    exit 1
}

Write-Host "All manuscript manifest paths exist."
