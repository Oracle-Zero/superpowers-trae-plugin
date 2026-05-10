@echo off
REM Superpowers Trae IDE Plugin - Build Script for Windows
REM 
REM This script packages the Superpowers skills into a .vsix file
REM that can be installed in Trae IDE with a double-click.

echo ==========================================
echo   Superpowers Trae Plugin Builder
echo ==========================================
echo.

REM Check if Node.js is installed
where node >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed!
    echo.
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

REM Check if vsce is installed
npm list -g @vscode/vsce >nul 2>&1
if errorlevel 1 (
    echo Installing @vscode/vsce...
    npm install -g @vscode/vsce
)

echo.
echo Packaging Superpowers skills into .vsix file...
echo.

REM Package the extension
vsce package --no-dependencies

if errorlevel 1 (
    echo.
    echo Error: Packaging failed!
    echo.
    pause
    exit /b 1
)

echo.
echo ==========================================
echo   Build Complete!
echo ==========================================
echo.
echo The .vsix file has been created in the current directory.
echo.
echo To install in Trae IDE:
echo   1. Open Trae IDE
echo   2. Go to Extensions (Ctrl+Shift+X)
echo   3. Click the "..." menu in the top right
echo   4. Select "Install from VSIX..."
echo   5. Select the .vsix file
echo.
echo Or simply double-click the .vsix file!
echo.
pause
