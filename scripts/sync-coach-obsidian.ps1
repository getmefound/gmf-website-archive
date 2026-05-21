param(
  [string]$VaultRoot = "C:\Users\micha\Obsidian\Oracle\04 AI Outsource Hub",
  [string]$OutDir = "content\coach\obsidian-sync"
)

$ErrorActionPreference = "Stop"
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

$files = @(
  "02 Training\AOH Ground Truth.md",
  "02 Training\AOH Brand Voice v1.md",
  "02 Training\AOH Agent Architecture v1.md",
  "02 Training\AOH Agent Model Routing and Morning Brief.md",
  "02 Training\AOH GBP Client Access and Update Test.md",
  "02 Training\product-knowledge\Reviews Starter.md",
  "02 Training\product-knowledge\Reviews Pro.md",
  "02 Training\product-knowledge\Reviews + AI Visibility Bundle.md",
  "00 Core\2026-05-18 - Codex - Reply First Campaign Strategy.md",
  "00 Core\2026-04-28 - Claude - AOH Company Overview.md",
  "00 Core\2026-04-29 - Claude - AOH Website Copy.md"
)

$copied = @()
$missing = @()

foreach ($rel in $files) {
  $src = Join-Path $VaultRoot $rel
  if (Test-Path $src) {
    $name = ($rel -replace '[\\/:*?"<>|]', '_')
    $dst = Join-Path $OutDir $name
    Copy-Item -LiteralPath $src -Destination $dst -Force
    $copied += $dst
  } else {
    $missing += $src
  }
}

$stamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$manifest = @()
$manifest += "# Obsidian Sync Manifest"
$manifest += "Synced: $stamp"
$manifest += "VaultRoot: $VaultRoot"
$manifest += ""
$manifest += "## Copied"
foreach ($c in $copied) { $manifest += "- $c" }
$manifest += ""
$manifest += "## Missing"
if ($missing.Count -eq 0) {
  $manifest += "- None"
} else {
  foreach ($m in $missing) { $manifest += "- $m" }
}

$manifestPath = Join-Path $OutDir "SYNC_MANIFEST.md"
$manifest | Set-Content $manifestPath

Write-Output "Copied: $($copied.Count)"
Write-Output "Missing: $($missing.Count)"
Write-Output "Manifest: $manifestPath"
