@echo off
REM Superpowers Trae IDE 一键安装脚本
REM 
REM 使用方法：
REM   1. 下载此脚本
REM   2. 双击运行（或执行：.\install-superpowers-trae.cmd）
REM   3. 脚本会自动将 Superpowers 技能安装到你的 Trae 项目中
REM
REM 可选参数：
REM   install-superpowers-trae.cmd [项目路径]
REM   如果不提供项目路径，脚本会安装到当前目录

setlocal enabledelayedexpansion

echo ==========================================
echo   Superpowers Trae IDE 安装脚本
echo ==========================================
echo.

REM 确定脚本所在目录（Superpowers 源文件位置）
set "SCRIPT_DIR=%~dp0"
set "SCRIPT_DIR=%SCRIPT_DIR:~0,-1%"

REM 获取项目路径
if "%~1"=="" (
    set "PROJECT_DIR=%CD%"
) else (
    set "PROJECT_DIR=%~1"
)

echo 源文件位置: %SCRIPT_DIR%
echo 目标项目位置: %PROJECT_DIR%
echo.

REM 检查源文件是否存在
if not exist "%SCRIPT_DIR%\.trae\skills" (
    echo 错误: 未找到 Superpowers 技能文件!
    echo 请确保此脚本位于 Superpowers 根目录下
    pause
    exit /b 1
)

REM 检查目标项目目录是否存在
if not exist "%PROJECT_DIR%" (
    echo 错误: 项目目录不存在: %PROJECT_DIR%
    pause
    exit /b 1
)

echo 开始安装...
echo.

REM 1. 创建 .trae/skills 目录
echo [1/3] 安装技能文件...
if not exist "%PROJECT_DIR%\.trae" mkdir "%PROJECT_DIR%\.trae"
if not exist "%PROJECT_DIR%\.trae\skills" mkdir "%PROJECT_DIR%\.trae\skills"

xcopy /E /I /Y /Q "%SCRIPT_DIR%\.trae\skills\*" "%PROJECT_DIR%\.trae\skills\" >nul
echo   ✓ 技能文件已安装到 %PROJECT_DIR%\.trae\skills\

REM 2. 创建 .trae-plugin 目录并复制配置
echo [2/3] 安装插件配置...
if not exist "%PROJECT_DIR%\.trae-plugin" mkdir "%PROJECT_DIR%\.trae-plugin"

if exist "%SCRIPT_DIR%\.trae-plugin\plugin.json" (
    copy /Y "%SCRIPT_DIR%\.trae-plugin\plugin.json" "%PROJECT_DIR%\.trae-plugin\" >nul
    echo   ✓ 插件配置已安装
)

if exist "%SCRIPT_DIR%\.trae-plugin\hooks.json" (
    copy /Y "%SCRIPT_DIR%\.trae-plugin\hooks.json" "%PROJECT_DIR%\.trae-plugin\" >nul
)

REM 3. 复制 AGENTS.md
echo [3/3] 安装技能索引...
if exist "%SCRIPT_DIR%\AGENTS.md" (
    copy /Y "%SCRIPT_DIR%\AGENTS.md" "%PROJECT_DIR%\" >nul
    echo   ✓ AGENTS.md 已安装
) else (
    echo   ! 警告: 未找到 AGENTS.md，技能自动发现可能不可用
)

echo.
echo ==========================================
echo   安装完成!
echo ==========================================
echo.
echo Superpowers 技能已安装到:
echo   %PROJECT_DIR%
echo.
echo 已安装的内容:
echo   ✓ .trae/skills/        - 14个核心技能
echo   ✓ .trae-plugin/        - Trae插件配置
echo   ✓ AGENTS.md            - 技能索引文件
echo.
echo 下一步:
echo   1. 重启 Trae IDE
echo   2. 打开你的项目
echo   3. 尝试发送: "Let's make a react todo list"
echo      (应该会自动触发 brainstorming 技能)
echo.
echo 更新技能:
echo   运行 scripts\update-superpowers.cmd 获取最新版本
echo   然后重新运行此安装脚本
echo.
pause
