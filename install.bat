@echo off
REM Quick start script for HDR/EXR 360 Viewer Extension

echo.
echo ====================================
echo HDR/EXR 360 Viewer Extension
echo Quick Start
echo ====================================
echo.

REM Check if VS Code is installed
where code >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] VS Code is not installed or not in PATH
    echo Please install VS Code from https://code.visualstudio.com
    pause
    exit /b 1
)

echo [1/3] Installing extension...
code --install-extension "%~dp0hdr-exr-360-viewer-0.0.1.vsix"

if %errorlevel% equ 0 (
    echo [2/3] Extension installed successfully!
    echo.
    echo [3/3] Opening test file...
    echo.
    timeout /t 2 /nobreak
    
    REM Open the included test HDR file
    if exist "%~dp0citrus_orchard_road_puresky_1k.hdr" (
        code "%~dp0citrus_orchard_road_puresky_1k.hdr"
        echo.
        echo SUCCESS! The extension is now installed and ready.
        echo The test HDR file should open in the 360 viewer.
        echo.
        echo CONTROLS:
        echo   - Mouse drag to rotate
        echo   - Scroll wheel to zoom
        echo   - Space bar to toggle auto-rotation
        echo   - R key to reset view
    ) else (
        echo Warning: Test HDR file not found
        echo Open any .hdr or .exr file to test the extension
    )
) else (
    echo [ERROR] Failed to install extension
    pause
    exit /b 1
)

echo.
pause
