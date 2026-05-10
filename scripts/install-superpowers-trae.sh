#!/usr/bin/env bash
# Superpowers Trae IDE 一键安装脚本
# 
# 使用方法：
#   1. 下载此脚本
#   2. 运行: ./install-superpowers-trae.sh [项目路径]
#   3. 脚本会自动将 Superpowers 技能安装到你的 Trae 项目中
#
# 如果不提供项目路径，脚本会安装到当前目录

set -euo pipefail

echo "=========================================="
echo "  Superpowers Trae IDE 安装脚本"
echo "=========================================="
echo ""

# 确定脚本所在目录（Superpowers 源文件位置）
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# 获取项目路径
if [ $# -eq 0 ]; then
    PROJECT_DIR="$(pwd)"
else
    PROJECT_DIR="$1"
fi

echo "源文件位置: ${SCRIPT_DIR}"
echo "目标项目位置: ${PROJECT_DIR}"
echo ""

# 检查源文件是否存在
if [ ! -d "${SCRIPT_DIR}/.trae/skills" ]; then
    echo "错误: 未找到 Superpowers 技能文件!"
    echo "请确保此脚本位于 Superpowers 根目录下"
    exit 1
fi

# 检查目标项目目录是否存在
if [ ! -d "${PROJECT_DIR}" ]; then
    echo "错误: 项目目录不存在: ${PROJECT_DIR}"
    exit 1
fi

echo "开始安装..."
echo ""

# 1. 创建 .trae/skills 目录
echo "[1/3] 安装技能文件..."
mkdir -p "${PROJECT_DIR}/.trae/skills"
cp -r "${SCRIPT_DIR}/.trae/skills/"* "${PROJECT_DIR}/.trae/skills/"
echo "  ✓ 技能文件已安装到 ${PROJECT_DIR}/.trae/skills/"

# 2. 创建 .trae-plugin 目录并复制配置
echo "[2/3] 安装插件配置..."
mkdir -p "${PROJECT_DIR}/.trae-plugin"

if [ -f "${SCRIPT_DIR}/.trae-plugin/plugin.json" ]; then
    cp "${SCRIPT_DIR}/.trae-plugin/plugin.json" "${PROJECT_DIR}/.trae-plugin/"
    echo "  ✓ 插件配置已安装"
fi

# 3. 复制 AGENTS.md
echo "[3/3] 安装技能索引..."
if [ -f "${SCRIPT_DIR}/AGENTS.md" ]; then
    cp "${SCRIPT_DIR}/AGENTS.md" "${PROJECT_DIR}/"
    echo "  ✓ AGENTS.md 已安装"
else
    echo "  ! 警告: 未找到 AGENTS.md，技能自动发现可能不可用"
fi

echo ""
echo "=========================================="
echo "  安装完成!"
echo "=========================================="
echo ""
echo "Superpowers 技能已安装到:"
echo "  ${PROJECT_DIR}"
echo ""
echo "已安装的内容:"
echo "  ✓ .trae/skills/        - 14个核心技能"
echo "  ✓ .trae-plugin/        - Trae插件配置"
echo "  ✓ AGENTS.md            - 技能索引文件"
echo ""
echo "下一步:"
echo "  1. 重启 Trae IDE"
echo "  2. 打开你的项目"
echo "  3. 尝试发送: \"Let's make a react todo list\""
echo "     (应该会自动触发 brainstorming 技能)"
echo ""
echo "更新技能:"
echo "  运行 ./scripts/update-superpowers.sh 获取最新版本"
echo "  然后重新运行此安装脚本"
echo ""
