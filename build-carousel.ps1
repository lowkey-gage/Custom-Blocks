# Build script for Interactive Carousel block
Write-Host "Building Interactive Carousel..." -ForegroundColor Cyan

# Create temporary directory for build
$tempDir = "temp-build-carousel"
if (Test-Path $tempDir) {
    Remove-Item -Recurse -Force $tempDir
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Copy source files to temp
Copy-Item "blocks/interactive-gallery/index.js" "$tempDir/index.js"
Copy-Item "blocks/interactive-gallery/edit.js" "$tempDir/edit.js"
Copy-Item "blocks/interactive-gallery/save.js" "$tempDir/save.js"
Copy-Item "blocks/interactive-gallery/style.css" "$tempDir/style.css"
Copy-Item "blocks/interactive-gallery/editor.css" "$tempDir/editor.css"

Write-Host "Building with wp-scripts..." -ForegroundColor Yellow

# Temporarily hide webpack.config.js
if (Test-Path "webpack.config.js") {
    Rename-Item "webpack.config.js" "webpack.config.js.temp"
}

# Build from temp directory
$output = npx wp-scripts build "$tempDir/index.js" --output-path="$tempDir" 2>&1
$buildSuccess = $LASTEXITCODE -eq 0

# Restore webpack.config.js
if (Test-Path "webpack.config.js.temp") {
    Rename-Item "webpack.config.js.temp" "webpack.config.js"
}

if ($buildSuccess) {
    Write-Host "Build successful! Copying files..." -ForegroundColor Green
    
    # Rename and copy the built file
    Move-Item "$tempDir/index.js" "blocks/interactive-gallery/index.build.js" -Force
    Move-Item "$tempDir/index.asset.php" "blocks/interactive-gallery/index.asset.php" -Force
    
    # Copy CSS if it was processed
    if (Test-Path "$tempDir/style-index.css") {
        Copy-Item "$tempDir/style-index.css" "blocks/interactive-gallery/style-index.css" -Force
    }
    if (Test-Path "$tempDir/index.css") {
        Copy-Item "$tempDir/index.css" "blocks/interactive-gallery/editor-index.css" -Force
    }
    
    Write-Host "Carousel build complete!" -ForegroundColor Green
} else {
    Write-Host "Build failed!" -ForegroundColor Red
    Write-Host $output
}

# Cleanup
Remove-Item -Recurse -Force $tempDir

Write-Host ""
Write-Host "Done!" -ForegroundColor Cyan
