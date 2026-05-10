#!/usr/bin/env bash
# Update Superpowers to latest upstream version
#
# Usage: ./scripts/update-superpowers.sh
#
# This script fetches the latest changes from the upstream repository
# and merges them into your current branch.

set -euo pipefail

echo "=========================================="
echo "  Superpowers Update Script"
echo "=========================================="
echo ""

# Check if we're in a git repo
if ! git rev-parse --is-inside-work-tree &>/dev/null; then
  echo "Error: Not a git repository!"
  echo "Run 'git init' first, then try again."
  exit 1
fi

# Check if upstream remote exists
if ! git remote | grep -q upstream; then
  echo "Error: 'upstream' remote not found!"
  echo "Run: git remote add upstream https://github.com/obra/superpowers.git"
  exit 1
fi

echo "Fetching latest upstream changes..."
git fetch upstream
echo ""

# Show current branch
current_branch=$(git branch --show-current)
echo "Current branch: ${current_branch}"
echo ""

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
  echo "Warning: You have uncommitted changes!"
  echo "Please commit or stash them before updating."
  echo ""
  read -p "Continue anyway? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Update cancelled."
    exit 1
  fi
fi

echo "Merging upstream/main into current branch..."
git merge upstream/main

echo ""
echo "=========================================="
echo "  Update complete!"
echo "=========================================="
echo ""
echo "If there were conflicts, resolve them and commit:"
echo "  git add <resolved-files>"
echo "  git commit"
