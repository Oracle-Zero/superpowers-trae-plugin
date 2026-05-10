# Trae IDE Platform Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add native Trae IDE support to Superpowers with progressive enhancement architecture (plugin config + AGENTS.md + SessionStart Hook) and enable local copy synchronization with upstream repository.

**Architecture:** Create `.trae-plugin/plugin.json`, extend `hooks/session-start` for Trae environment detection, convert static copy to git repo with upstream remote, and document update workflow.

**Tech Stack:** Bash scripting, JSON configuration, Git, Superpowers skills framework

---

### Task 1: Convert Static Copy to Git Repository with Upstream Remote

**Files:**
- Modify: `F:\Code\superpowers` (initialize git repo)

**Context:** Current local copy is a static download without git history. Need to convert to proper git repo tracking upstream.

- [ ] **Step 1: Initialize git repository**

Run in `F:\Code\superpowers`:
```bash
git init
```

- [ ] **Step 2: Add all existing files to git**

```bash
git add -A
```

- [ ] **Step 3: Create initial commit**

```bash
git commit -m "Initial commit: Superpowers v5.1.0 static copy"
```

- [ ] **Step 4: Add upstream remote**

```bash
git remote add upstream https://github.com/obra/superpowers.git
```

- [ ] **Step 5: Fetch upstream branches**

```bash
git fetch upstream
```

Expected: Fetches upstream/main branch with all commits

- [ ] **Step 6: Create feature branch for Trae support**

```bash
git checkout -b trae-platform-support
```

- [ ] **Step 7: Verify git setup**

Run:
```bash
git remote -v
git branch -a
```

Expected output:
```
upstream  https://github.com/obra/superpowers.git (fetch)
upstream  https://github.com/obra/superpowers.git (push)
* trae-platform-support
  main
  remotes/upstream/main
```

- [ ] **Step 8: Commit git initialization**

Already committed in step 3. Feature branch created.

---

### Task 2: Create Trae Plugin Configuration

**Files:**
- Create: `F:\Code\superpowers\.trae-plugin\plugin.json`

**Context:** Already created in earlier session. Verify content is correct and commit.

- [ ] **Step 1: Read existing plugin.json**

Read: `F:\Code\superpowers\.trae-plugin\plugin.json`

Expected content:
```json
{
  "name": "superpowers",
  "displayName": "Superpowers",
  "description": "Core skills library: TDD, debugging, collaboration patterns, and proven techniques",
  "version": "5.1.0",
  "author": {
    "name": "Jesse Vincent",
    "email": "jesse@fsck.com"
  },
  "homepage": "https://github.com/obra/superpowers",
  "repository": "https://github.com/obra/superpowers",
  "license": "MIT",
  "keywords": [
    "skills",
    "tdd",
    "debugging",
    "collaboration",
    "best-practices",
    "workflows",
    "trae"
  ],
  "skills": "./skills/",
  "hooks": "./hooks/hooks.json"
}
```

- [ ] **Step 2: Verify "trae" keyword is present**

Check that `keywords` array includes `"trae"`.

- [ ] **Step 3: Verify skills path is correct**

Confirm `"skills": "./skills/"` points to `.trae/skills/` directory.

Check directory exists:
```bash
ls .trae/skills/
```

- [ ] **Step 4: Commit plugin configuration**

```bash
git add .trae-plugin/plugin.json
git commit -m "feat: add Trae IDE plugin configuration

- Create .trae-plugin/plugin.json with plugin metadata
- Point to skills directory and hooks configuration
- Add 'trae' to keywords for platform identification"
```

---

### Task 3: Extend Session-Start Hook for Trae Detection

**Files:**
- Modify: `F:\Code\superpowers\.trae\skills\hooks\session-start`

**Context:** Current hook script detects CLAUDE_PLUGIN_ROOT and CURSOR_PLUGIN_ROOT. Need to add TRAE_PLUGIN_ROOT detection.

- [ ] **Step 1: Read current session-start script**

Read: `F:\Code\superpowers\.trae\skills\hooks\session-start`

Find the section that outputs JSON based on platform detection (around line 46-55).

- [ ] **Step 2: Modify platform detection logic**

Replace the platform detection section (lines 46-55) with:

```bash
if [ -n "${TRAE_PLUGIN_ROOT:-}" ]; then
  # Trae IDE platform - uses SDK standard format
  printf '{\n  "additionalContext": "%s"\n}\n' "$session_context"
elif [ -n "${CURSOR_PLUGIN_ROOT:-}" ]; then
  # Cursor sets CURSOR_PLUGIN_ROOT (may also set CLAUDE_PLUGIN_ROOT)
  printf '{\n  "additional_context": "%s"\n}\n' "$session_context"
elif [ -n "${CLAUDE_PLUGIN_ROOT:-}" ] && [ -z "${COPILOT_CLI:-}" ]; then
  # Claude Code sets CLAUDE_PLUGIN_ROOT without COPILOT_CLI
  printf '{\n  "hookSpecificOutput": {\n    "hookEventName": "SessionStart",\n    "additionalContext": "%s"\n  }\n}\n' "$session_context"
else
  # Copilot CLI (sets COPILOT_CLI=1) or unknown platform — SDK standard format
  printf '{\n  "additionalContext": "%s"\n}\n' "$session_context"
fi
```

The SEARCH section to find:
```bash
if [ -n "${CURSOR_PLUGIN_ROOT:-}" ]; then
  # Cursor sets CURSOR_PLUGIN_ROOT (may also set CLAUDE_PLUGIN_ROOT)
  printf '{\n  "additional_context": "%s"\n}\n' "$session_context"
elif [ -n "${CLAUDE_PLUGIN_ROOT:-}" ] && [ -z "${COPILOT_CLI:-}" ]; then
  # Claude Code sets CLAUDE_PLUGIN_ROOT without COPILOT_CLI
  printf '{\n  "hookSpecificOutput": {\n    "hookEventName": "SessionStart",\n    "additionalContext": "%s"\n  }\n}\n' "$session_context"
else
  # Copilot CLI (sets COPILOT_CLI=1) or unknown platform — SDK standard format
  printf '{\n  "additionalContext": "%s"\n}\n' "$session_context"
fi
```

The REPLACE section:
```bash
if [ -n "${TRAE_PLUGIN_ROOT:-}" ]; then
  # Trae IDE platform - uses SDK standard format
  printf '{\n  "additionalContext": "%s"\n}\n' "$session_context"
elif [ -n "${CURSOR_PLUGIN_ROOT:-}" ]; then
  # Cursor sets CURSOR_PLUGIN_ROOT (may also set CLAUDE_PLUGIN_ROOT)
  printf '{\n  "additional_context": "%s"\n}\n' "$session_context"
elif [ -n "${CLAUDE_PLUGIN_ROOT:-}" ] && [ -z "${COPILOT_CLI:-}" ]; then
  # Claude Code sets CLAUDE_PLUGIN_ROOT without COPILOT_CLI
  printf '{\n  "hookSpecificOutput": {\n    "hookEventName": "SessionStart",\n    "additionalContext": "%s"\n  }\n}\n' "$session_context"
else
  # Copilot CLI (sets COPILOT_CLI=1) or unknown platform — SDK standard format
  printf '{\n  "additionalContext": "%s"\n}\n' "$session_context"
fi
```

- [ ] **Step 3: Verify script syntax**

Run:
```bash
bash -n .trae/skills/hooks/session-start
```

Expected: No output (syntax OK)

- [ ] **Step 4: Test hook output with mock TRAE_PLUGIN_ROOT**

Run:
```bash
TRAE_PLUGIN_ROOT=/test bash .trae/skills/hooks/session-start
```

Expected: Valid JSON output with `additionalContext` field containing using-superpowers content

- [ ] **Step 5: Verify JSON is valid**

Pipe output to jq (if available):
```bash
TRAE_PLUGIN_ROOT=/test bash .trae/skills/hooks/session-start | jq .
```

Expected: Pretty-printed JSON, no errors

- [ ] **Step 6: Commit hook changes**

```bash
git add .trae/skills/hooks/session-start
git commit -m "feat: extend session-start hook to detect Trae IDE platform

- Add TRAE_PLUGIN_ROOT environment variable detection
- Output SDK standard additionalContext format for Trae
- Maintain backward compatibility with Claude Code and Cursor"
```

---

### Task 4: Create Trae-Specific Hook Configuration (Optional)

**Files:**
- Create: `F:\Code\superpowers\.trae\skills\hooks\hooks-trae.json`

**Context:** Some platforms require separate hook configuration files. Create Trae-specific config as backup.

- [ ] **Step 1: Create hooks-trae.json**

Create file with content:
```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|clear|compact",
        "hooks": [
          {
            "type": "command",
            "command": "\"${TRAE_PLUGIN_ROOT}/hooks/run-hook.cmd\" session-start",
            "async": false
          }
        ]
      }
    ]
  }
}
```

- [ ] **Step 2: Verify JSON syntax**

Run:
```bash
jq . .trae/skills/hooks/hooks-trae.json
```

Expected: Pretty-printed JSON, no errors

- [ ] **Step 3: Commit hook configuration**

```bash
git add .trae/skills/hooks/hooks-trae.json
git commit -m "feat: add Trae-specific hook configuration

- Create hooks-trae.json with TRAE_PLUGIN_ROOT reference
- Configure SessionStart hook to run polyglot script
- Provides fallback if Trae requires separate hook config"
```

---

### Task 5: Verify Skills Directory Structure

**Files:**
- Verify: `F:\Code\superpowers\.trae\skills\` (all skill directories)

**Context:** Skills were copied from `skills/skills/` to `.trae/skills/` root. Need to verify all 14 skills are present with correct structure.

- [ ] **Step 1: List all skill directories**

Run:
```bash
ls -d .trae/skills/*/
```

Expected: 14 skill directories:
```
.trae/skills/brainstorming/
.trae/skills/dispatching-parallel-agents/
.trae/skills/executing-plans/
.trae/skills/finishing-a-development-branch/
.trae/skills/receiving-code-review/
.trae/skills/requesting-code-review/
.trae/skills/subagent-driven-development/
.trae/skills/systematic-debugging/
.trae/skills/test-driven-development/
.trae/skills/using-git-worktrees/
.trae/skills/using-superpowers/
.trae/skills/verification-before-completion/
.trae/skills/writing-plans/
.trae/skills/writing-skills/
```

- [ ] **Step 2: Verify each skill has SKILL.md**

Run:
```bash
for skill in .trae/skills/*/; do
  if [ ! -f "${skill}SKILL.md" ]; then
    echo "Missing SKILL.md in ${skill}"
  fi
done
```

Expected: No output (all skills have SKILL.md)

- [ ] **Step 3: Verify SKILL.md frontmatter**

Check a few skills have valid frontmatter:
```bash
head -4 .trae/skills/brainstorming/SKILL.md
head -4 .trae/skills/systematic-debugging/SKILL.md
```

Expected: YAML frontmatter with `name:` and `description:` fields

- [ ] **Step 4: Commit verification (no changes needed)**

If all checks pass, no commit needed. If any issues found, fix and commit.

---

### Task 6: Create Cross-Platform Update Scripts

**Files:**
- Create: `F:\Code\superpowers\scripts\update-superpowers.sh`
- Create: `F:\Code\superpowers\scripts\update-superpowers.cmd`

**Context:** Provide convenient scripts for users to update their local copy from upstream.

- [ ] **Step 1: Create Unix update script**

Create: `scripts/update-superpowers.sh`

```bash
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
```

- [ ] **Step 2: Create Windows update script**

Create: `scripts/update-superpowers.cmd`

```batch
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
```

- [ ] **Step 3: Make Unix script executable**

Run:
```bash
chmod +x scripts/update-superpowers.sh
```

- [ ] **Step 4: Test scripts syntax**

Run:
```bash
bash -n scripts/update-superpowers.sh
```

Expected: No output (syntax OK)

- [ ] **Step 5: Commit update scripts**

```bash
git add scripts/update-superpowers.sh scripts/update-superpowers.cmd
git commit -m "feat: add cross-platform update scripts

- Create update-superpowers.sh for Unix/macOS
- Create update-superpowers.cmd for Windows
- Both scripts fetch and merge upstream/main
- Include safety checks for git repo and uncommitted changes"
```

---

### Task 7: Create Setup Documentation

**Files:**
- Create: `F:\Code\superpowers\docs\TRAEO_SETUP.md`

**Context:** Document how to set up and maintain the local Superpowers copy for Trae IDE users.

- [ ] **Step 1: Create setup documentation**

Create: `docs/TRAEO_SETUP.md`

```markdown
# Superpowers Trae IDE Setup Guide

## Quick Start

### 1. Initialize Git Repository (if not already done)

```bash
cd F:\Code\superpowers
git init
git add -A
git commit -m "Initial commit: Superpowers v5.1.0 static copy"
git remote add upstream https://github.com/obra/superpowers.git
git fetch upstream
```

### 2. Update to Latest Version

**Option A: Using update script (Recommended)**

```bash
# Windows
scripts\update-superpowers.cmd

# Unix/macOS
./scripts/update-superpowers.sh
```

**Option B: Manual update**

```bash
git fetch upstream
git merge upstream/main
```

### 3. Install Skills to Your Project

**Option A: Copy to project**

```bash
# Copy skills to your Trae project
cp -r .trae/skills your-project/.trae/skills
cp -r .trae-plugin your-project/.trae-plugin
cp AGENTS.md your-project/
```

**Option B: Use openskills (when available)**

```bash
openskills install obra/superpowers --platform trae
```

## Updating Skills

When upstream Superpowers releases new skills or updates:

1. Run the update script:
   ```bash
   scripts\update-superpowers.cmd  # Windows
   ./scripts/update-superpowers.sh  # Unix/macOS
   ```

2. Resolve any conflicts if they exist

3. Copy updated skills to your projects:
   ```bash
   # For each project using Superpowers
   cp -r .trae/skills/* your-project/.trae/skills/
   ```

## Troubleshooting

### "upstream remote not found"

Add the upstream remote:
```bash
git remote add upstream https://github.com/obra/superpowers.git
git fetch upstream
```

### Merge conflicts during update

1. Check conflicted files:
   ```bash
   git status
   ```

2. Resolve conflicts in each file

3. Mark as resolved:
   ```bash
   git add <resolved-file>
   ```

4. Complete merge:
   ```bash
   git commit
   ```

### Skills not showing in Trae

1. Verify skills are in correct location:
   ```bash
   ls .trae/skills/
   ```

2. Each skill should have a `SKILL.md` file

3. Check AGENTS.md exists in project root

4. Restart Trae IDE
```

- [ ] **Step 2: Commit documentation**

```bash
git add docs/TRAEO_SETUP.md
git commit -m "docs: add Trae IDE setup and maintenance guide

- Document git initialization steps
- Provide update workflows (script and manual)
- Include troubleshooting section
- Explain how to install skills to projects"
```

---

### Task 8: Final Verification and Testing

**Files:**
- All files created/modified in previous tasks

**Context:** Verify everything works correctly before marking implementation complete.

- [ ] **Step 1: Verify git remote configuration**

Run:
```bash
git remote -v
```

Expected output:
```
upstream  https://github.com/obra/superpowers.git (fetch)
upstream  https://github.com/obra/superpowers.git (push)
```

- [ ] **Step 2: Test hook with TRAE_PLUGIN_ROOT**

Run:
```bash
TRAE_PLUGIN_ROOT=/test bash .trae/skills/hooks/session-start | head -10
```

Expected: Valid JSON starting with `{` and containing `additionalContext`

- [ ] **Step 3: Verify all skills have SKILL.md**

Run:
```bash
find .trae/skills -name "SKILL.md" | wc -l
```

Expected: 14 (or more if skills were added upstream)

- [ ] **Step 4: Verify plugin.json is valid JSON**

Run:
```bash
jq . .trae-plugin/plugin.json > /dev/null && echo "Valid JSON" || echo "Invalid JSON"
```

Expected: "Valid JSON"

- [ ] **Step 5: Check git log for all commits**

Run:
```bash
git log --oneline
```

Expected: At least 6 commits (one per task)

- [ ] **Step 6: Create summary of changes**

Run:
```bash
git diff --stat upstream/main
```

Review all changes made for Trae support.

---

### Task 9: Submit PR to Superpowers Official Repository

**Files:**
- All files in `F:\Code\superpowers`

**Context:** Submit Trae platform support PR to upstream Superpowers repository.

- [ ] **Step 1: Read PR template**

Read: `.trae/skills/.github/PULL_REQUEST_TEMPLATE.md`

Fill in every section with specific answers (no placeholders).

- [ ] **Step 2: Prepare PR description**

Based on PR template, include:
- Problem solved: Trae IDE users cannot use Superpowers natively
- Specific changes: Plugin config, hook extension, update scripts
- Testing: Hook output verified, skills structure correct
- Environment table: Trae IDE tested on Windows

- [ ] **Step 3: Push branch to your fork**

If you have a fork:
```bash
git remote add origin https://github.com/YOUR_USERNAME/superpowers.git
git push -u origin trae-platform-support
```

- [ ] **Step 4: Create PR**

Go to: `https://github.com/obra/superpowers/compare`

Select your branch and create pull request.

- [ ] **Step 5: Document PR link**

Save the PR URL for reference:
```
https://github.com/obra/superpowers/pull/XXX
```

---

## Implementation Notes

### Order Dependencies
- Task 1 (git init) must complete before any other task
- Task 3 (hook extension) depends on Task 1 (git repo exists)
- Task 9 (PR submission) depends on all previous tasks

### Testing Strategy
- Each task includes verification steps
- Hook output tested with mocked environment variable
- JSON validity checked with jq
- Git operations verified with remote -v and log

### Rollback Plan
If any task fails:
1. Check git status for uncommitted changes
2. Use `git checkout -- <file>` to revert file changes
3. Use `git reset --hard HEAD` to reset entire working directory
4. Re-run the failed task
