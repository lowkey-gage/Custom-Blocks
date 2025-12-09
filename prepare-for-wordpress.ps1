# Cleanup and prepare WordPress plugin for deployment
Write-Host "WordPress Plugin - Cleanup & Package" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Cleanup development files
Write-Host "Step 1: Cleaning up development files..." -ForegroundColor Yellow

Write-Host "  [1/11] Deleting node_modules (this may take a minute)..." -ForegroundColor Gray
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "  [2/11] Deleting package.json..." -ForegroundColor Gray
Remove-Item -Path "package.json" -Force -ErrorAction SilentlyContinue

Write-Host "  [3/11] Deleting package-lock.json..." -ForegroundColor Gray
Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue

Write-Host "  [4/11] Deleting webpack.config.js..." -ForegroundColor Gray
Remove-Item -Path "webpack.config.js" -Force -ErrorAction SilentlyContinue

Write-Host "  [5/11] Deleting backup folder..." -ForegroundColor Gray
Remove-Item -Path "blocks/interactive-gallery-backup" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "  [6/11] Deleting blocks/index.js..." -ForegroundColor Gray
Remove-Item -Path "blocks/index.js" -Force -ErrorAction SilentlyContinue

Write-Host "  [7/11] Deleting blocks/index.asset.php..." -ForegroundColor Gray
Remove-Item -Path "blocks/index.asset.php" -Force -ErrorAction SilentlyContinue

Write-Host "  [8/11] Deleting index.css..." -ForegroundColor Gray
Remove-Item -Path "blocks/interactive-gallery/index.css" -Force -ErrorAction SilentlyContinue

Write-Host "  [9/11] Deleting style-index.css..." -ForegroundColor Gray
Remove-Item -Path "blocks/interactive-gallery/style-index.css" -Force -ErrorAction SilentlyContinue

Write-Host "  [10/11] Deleting editor-index.css..." -ForegroundColor Gray
Remove-Item -Path "blocks/interactive-gallery/editor-index.css" -Force -ErrorAction SilentlyContinue

Write-Host "  [11/11] Deleting assets folder..." -ForegroundColor Gray
Remove-Item -Path "assets" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "  Cleanup complete!" -ForegroundColor Green
Write-Host ""

# Step 2: Create ZIP
Write-Host "Step 2: Creating plugin ZIP file..." -ForegroundColor Yellow

$pluginName = "custom-blocks-plugin"
$parentDir = Split-Path -Parent (Get-Location)
$zipPath = Join-Path $parentDir "$pluginName.zip"

# Remove old zip if exists
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

# Get current directory name
$currentDir = Split-Path -Leaf (Get-Location)

# Create zip from parent directory to include folder structure
Push-Location ..
Compress-Archive -Path $currentDir -DestinationPath "$pluginName.zip" -Force
Pop-Location

Write-Host "  ZIP created successfully!" -ForegroundColor Green
Write-Host ""

# Step 3: Summary
Write-Host "Ready for WordPress!" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Plugin ZIP location:" -ForegroundColor White
Write-Host "  $zipPath" -ForegroundColor Yellow
Write-Host ""
Write-Host "Installation steps:" -ForegroundColor White
Write-Host "  1. WordPress Admin > Plugins > Add New" -ForegroundColor Gray
Write-Host "  2. Click 'Upload Plugin'" -ForegroundColor Gray
Write-Host "  3. Choose custom-blocks-plugin.zip" -ForegroundColor Gray
Write-Host "  4. Click 'Install Now' and 'Activate'" -ForegroundColor Gray
Write-Host ""
Write-Host "Your blocks:" -ForegroundColor White
Write-Host "  ✓ Interactive Carousel (autoplay, dots, swipe, fade)" -ForegroundColor Cyan
Write-Host "  ✓ Newsletter Block" -ForegroundColor Cyan
Write-Host ""
