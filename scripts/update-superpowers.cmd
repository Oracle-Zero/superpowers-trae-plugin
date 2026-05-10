@echo off
REM Update Superpowers to latest upstream version
REM
REM Usage: scripts\update-superpowers.cmd
REM
REM This script fetches the latest changes from the upstream repository
REM and merges them into your current branch.

echo ==========================================
echo   Superpowers Update Script
echo ==========================================
echo.

REM Check if we're in a git repo
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
    echo Error: Not a git repository!
    echo Run 'git init' first, then try again.
    exit /b 1
)

REM Check if upstream remote exists
git remote | findstr upstream >nul 2>&1
if errorlevel 1 (
    echo Error: 'upstream' remote not found!
    echo Run: git remote add upstream https://github.com/obra/superpowers.git
    exit /b 1
)

echo Fetching latest upstream changes...
git fetch upstream
echo.

REM Show current branch
echo Current branch:
git branch --show-current
echo.

REM Check for uncommitted changes
git diff-index --quiet HEAD --
if errorlevel 1 (
    echo Warning: You have uncommitted changes!
    echo Please commit or stash them before updating.
    echo.
    set /p CONTINUE="Continue anyway? (y/N) "
    if /i not "%CONTINUE%"=="y" (
        echo Update cancelled.
        exit /b 1
    )
)

echo Merging upstream/main into current branch...
git merge upstream/main

echo.
echo ==========================================
echo   Update complete!
echo ==========================================
echo.
echo If there were conflicts, resolve them and commit:
echo   git add ^<resolved-files^>
echo   git commit
