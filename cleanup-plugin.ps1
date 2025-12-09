# Cleanup script - Remove development files not needed for WordPress
Write-Host "WordPress Plugin Cleanup" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

$itemsToDelete = @()

# Check what exists and add to delete list
if (Test-Path "node_modules") {
    $size = (Get-ChildItem "node_modules" -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1MB
    $itemsToDelete += @{Path="node_modules"; Size="$([int]$size) MB"; Type="Directory"}
}

if (Test-Path "package.json") {
    $itemsToDelete += @{Path="package.json"; Size="1 KB"; Type="File"}
}

if (Test-Path "package-lock.json") {
    $size = (Get-Item "package-lock.json").Length / 1KB
    $itemsToDelete += @{Path="package-lock.json"; Size="$([int]$size) KB"; Type="File"}
}

if (Test-Path "webpack.config.js") {
    $itemsToDelete += @{Path="webpack.config.js"; Size="15 KB"; Type="File"}
}

if (Test-Path "blocks/interactive-gallery-backup") {
    $itemsToDelete += @{Path="blocks/interactive-gallery-backup"; Size="~50 KB"; Type="Directory"}
}

if (Test-Path "blocks/index.js") {
    $itemsToDelete += @{Path="blocks/index.js"; Size="3 KB"; Type="File"}
}

if (Test-Path "blocks/index.asset.php") {
    $itemsToDelete += @{Path="blocks/index.asset.php"; Size="<1 KB"; Type="File"}
}

if (Test-Path "blocks/interactive-gallery/index.css") {
    $itemsToDelete += @{Path="blocks/interactive-gallery/index.css"; Size="2 KB"; Type="File"}
}

if (Test-Path "blocks/interactive-gallery/style-index.css") {
    $itemsToDelete += @{Path="blocks/interactive-gallery/style-index.css"; Size="3 KB"; Type="File"}
}

if (Test-Path "blocks/interactive-gallery/editor-index.css") {
    $itemsToDelete += @{Path="blocks/interactive-gallery/editor-index.css"; Size="1 KB"; Type="File"}
}

if (Test-Path "blocks/newsletter-block/index.css") {
    $itemsToDelete += @{Path="blocks/newsletter-block/index.css"; Size="1 KB"; Type="File"}
}

if (Test-Path "blocks/newsletter-block/style-index.css") {
    $itemsToDelete += @{Path="blocks/newsletter-block/style-index.css"; Size="1 KB"; Type="File"}
}

if (Test-Path "assets") {
    $itemsToDelete += @{Path="assets"; Size="~1 KB"; Type="Directory"}
}

# Display what will be deleted
if ($itemsToDelete.Count -eq 0) {
    Write-Host "Nothing to clean up!" -ForegroundColor Green
    exit
}

Write-Host "The following items will be DELETED:" -ForegroundColor Yellow
Write-Host ""
foreach ($item in $itemsToDelete) {
    Write-Host "  [$($item.Type)] $($item.Path) - $($item.Size)" -ForegroundColor White
}
Write-Host ""

$totalSize = 389 # Approximate
Write-Host "Total space to free: ~$totalSize MB" -ForegroundColor Cyan
Write-Host ""

# Ask for confirmation
$confirmation = Read-Host "Are you sure you want to delete these items? (yes/no)"

if ($confirmation -eq "yes") {
    Write-Host ""
    Write-Host "Deleting..." -ForegroundColor Yellow
    
    foreach ($item in $itemsToDelete) {
        try {
            if (Test-Path $item.Path) {
                Remove-Item -Path $item.Path -Recurse -Force -ErrorAction Stop
                Write-Host "  Deleted: $($item.Path)" -ForegroundColor Green
            }
        } catch {
            Write-Host "  Failed to delete: $($item.Path)" -ForegroundColor Red
            Write-Host "    Error: $_" -ForegroundColor Red
        }
    }
    
    Write-Host ""
    Write-Host "Cleanup complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your WordPress plugin is now production-ready!" -ForegroundColor Cyan
    Write-Host "Just upload the entire folder to wp-content/plugins/" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "Cleanup cancelled." -ForegroundColor Yellow
}
