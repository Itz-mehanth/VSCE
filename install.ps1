#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Install and test HDR/EXR 360 Viewer extension

.DESCRIPTION
    Quick start script to install the extension and open a test file

.EXAMPLE
    .\install.ps1
#>

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "HDR/EXR 360 Viewer Extension" -ForegroundColor Cyan
Write-Host "Installation Script" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Check if VS Code is installed
try {
    $codeVersion = & code --version 2>&1
    Write-Host "[OK] VS Code found: $($codeVersion[0])" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] VS Code not found." -ForegroundColor Red
    Write-Host "Please install VS Code from https://code.visualstudio.com" -ForegroundColor Yellow
    exit 1
}

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$vsixPath = Join-Path $scriptPath "hdr-exr-360-viewer-0.0.1.vsix"
$hdrPath = Join-Path $scriptPath "citrus_orchard_road_puresky_1k.hdr"

# Check if VSIX exists
if (-not (Test-Path $vsixPath)) {
    Write-Host "[ERROR] Extension package not found: $vsixPath" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[1/3] Installing extension..." -ForegroundColor Yellow
& code --install-extension $vsixPath

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Extension installed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "[2/3] Extension ready. Opening test file..." -ForegroundColor Yellow
    Write-Host ""
    
    if (Test-Path $hdrPath) {
        Write-Host "[OK] Test file found. Opening in VS Code..." -ForegroundColor Green
        Start-Sleep -Seconds 2
        & code $hdrPath
        
        Write-Host ""
        Write-Host "SUCCESS! Extension installed and ready!" -ForegroundColor Green
        Write-Host ""
        Write-Host "CONTROLS:" -ForegroundColor Cyan
        Write-Host "  Mouse drag     - Rotate view" -ForegroundColor Gray
        Write-Host "  Scroll wheel   - Zoom in/out" -ForegroundColor Gray
        Write-Host "  Space bar      - Toggle auto-rotation" -ForegroundColor Gray
        Write-Host "  R key          - Reset camera" -ForegroundColor Gray
        Write-Host ""
        Write-Host "TIP: Adjust exposure slider in top-right to reveal details!" -ForegroundColor Cyan
    } else {
        Write-Host "[WARN] Test file not found" -ForegroundColor Yellow
        Write-Host "You can open any .hdr or .exr file to test the extension" -ForegroundColor Gray
    }
} else {
    Write-Host "[ERROR] Failed to install extension" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Press Enter to exit..." -ForegroundColor Gray
Read-Host
