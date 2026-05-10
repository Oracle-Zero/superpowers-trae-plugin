# Trae IDE Platform Support Design

## Overview

Add native Trae IDE support to Superpowers, enabling automatic skill discovery and triggering in Trae projects. This implementation follows the progressive enhancement architecture with three fallback layers.

**Goal:** Enable Superpowers skills to work natively in Trae IDE with the same experience as Claude Code and Cursor.

**Architecture:** Progressive enhancement with three layers: plugin config → AGENTS.md → SessionStart Hook

**Success Criteria:** In a clean Trae session, sending "Let's make a react todo list" auto-triggers the brainstorming skill.

## Design Principles

1. **Zero dependencies** - Core Superpowers remains dependency-free
2. **Generic functionality** - Trae support benefits all users, not just one project
3. **Progressive enhancement** - Works even if Trae doesn't support all features
4. **Backward compatibility** - No breaking changes to existing platform support
5. **Single source of truth** - Skills shared across all platforms, no duplication

## System Architecture

```
┌─────────────────────────────────────────────┐
│           User Interaction Layer             │
├─────────────────────────────────────────────┤
│  Trae IDE Chat Interface                     │
│  Auto skill triggering or manual invocation  │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│         Bootstrap Layer                      │
├─────────────────────────────────────────────┤
│  AGENTS.md (Required)                        │
│  - Contains all skill summaries              │
│  - Trae native skill discovery mechanism     │
│  - Works regardless of Hook support          │
│                                              │
│  SessionStart Hook (Optional Enhancement)    │
│  - Injects using-superpowers full content    │
│  - Only activates if Trae supports Hooks     │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│         Platform Integration Layer           │
├─────────────────────────────────────────────┤
│  .trae-plugin/plugin.json                    │
│  - Trae IDE plugin configuration             │
│  - Points to skills directory and hooks      │
│                                              │
│  hooks/hooks.json (Extended)                 │
│  - Adds Trae environment variable detection  │
│  - Reuses run-hook.cmd polyglot script       │
│                                              │
│  openskills tool (Extended)                  │
│  - Adds Trae platform recognition            │
│  - Supports `openskills install` to Trae     │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│         Skills Layer                         │
├─────────────────────────────────────────────┤
│  .trae/skills/<skill-name>/SKILL.md          │
│  - 14 core skill files                       │
│  - Shared across all platforms               │
└─────────────────────────────────────────────┘
```

## File Structure

### New Files

#### 1. `.trae-plugin/plugin.json`

Trae IDE plugin configuration file:

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

**Responsibilities:**
- Declares plugin metadata
- Points to skills directory (`.trae/skills/`)
- References hook configuration

#### 2. `hooks/hooks-trae.json` (Optional)

Trae-specific hook configuration (if Trae requires separate hook format):

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

### Modified Files

#### 1. `hooks/session-start`

Extend environment variable detection to support Trae:

**Current logic:**
```bash
if [ -n "${CURSOR_PLUGIN_ROOT:-}" ]; then
  # Cursor platform
elif [ -n "${CLAUDE_PLUGIN_ROOT:-}" ] && [ -z "${COPILOT_CLI:-}" ]; then
  # Claude Code platform
else
  # Copilot CLI or unknown
fi
```

**Extended logic:**
```bash
if [ -n "${TRAE_PLUGIN_ROOT:-}" ]; then
  # Trae IDE platform - uses SDK standard format
  printf '{\n  "additionalContext": "%s"\n}\n' "$session_context"
elif [ -n "${CURSOR_PLUGIN_ROOT:-}" ]; then
  # Cursor sets CURSOR_PLUGIN_ROOT
  printf '{\n  "additional_context": "%s"\n}\n' "$session_context"
elif [ -n "${CLAUDE_PLUGIN_ROOT:-}" ] && [ -z "${COPILOT_CLI:-}" ]; then
  # Claude Code sets CLAUDE_PLUGIN_ROOT without COPILOT_CLI
  printf '{\n  "hookSpecificOutput": {\n    "hookEventName": "SessionStart",\n    "additionalContext": "%s"\n  }\n}\n' "$session_context"
else
  # Copilot CLI (sets COPILOT_CLI=1) or unknown platform — SDK standard format
  printf '{\n  "additionalContext": "%s"\n}\n' "$session_context"
fi
```

**Rationale:** Trae likely sets `TRAE_PLUGIN_ROOT` similar to how Cursor sets `CURSOR_PLUGIN_ROOT`. The output format follows the SDK standard (`additionalContext`) unless platform-specific nesting is required.

#### 2. `hooks/run-hook.cmd`

The existing cross-platform polyglot script should already work for Trae, as it:
- Searches for Git bash in standard Windows locations
- Falls back to bash on PATH
- Gracefully exits if no bash found

No changes needed unless Trae has specific bash path requirements.

#### 3. `AGENTS.md`

Already created. Contains summaries of all 14 skills for auto-discovery.

**Status:** No changes needed unless skill content changes.

### External Changes (openskills)

Submit PR to `https://github.com/numman-ali/openskills` to add Trae platform support:

```javascript
// Platform detection logic (pseudo-code)
function detectPlatform(projectDir) {
  const traConfig = path.join(projectDir, '.trae');
  if (existsSync(traeConfig)) {
    return {
      platform: 'trae',
      skillsDir: path.join(projectDir, '.trae', 'skills'),
      pluginConfig: path.join(projectDir, '.trae-plugin', 'plugin.json'),
      agentsFile: path.join(projectDir, 'AGENTS.md')
    };
  }
  // ... existing platform detection
}

// Installation command support
if (platform === 'trae') {
  // Install to .trae/skills/
  // Copy .trae-plugin/plugin.json
  // Generate AGENTS.md
}
```

## Installation Flow

### Method 1: Via openskills (Recommended)

```bash
# Global installation (available in all Trae projects)
openskills install obra/superpowers --global --platform trae

# Project-level installation (current project only)
cd your-project
openskills install obra/superpowers --platform trae
```

### Method 2: Manual Installation

```bash
# 1. Clone or copy skill files to project
git clone https://github.com/obra/superpowers.git
cp -r superpowers/.trae/skills your-project/.trae/skills
cp superpowers/.trae-plugin your-project/.trae-plugin
cp superpowers/AGENTS.md your-project/

# 2. Enable in Trae IDE
# - Open Settings > Rules & Skills
# - Confirm Superpowers skills are visible
```

## Fallback Strategy

```
┌─────────────────────────────────────┐
│   User sends message in Trae        │
└──────────────┬──────────────────────┘
               ▼
┌─────────────────────────────────────┐
│  Does Trae support SessionStart?    │
└──────────────┬──────────────────────┘
          ┌────┴────┐
         Yes│        │No
           ▼         ▼
    ┌──────────┐  ┌──────────────┐
    │Hook injects│ │AGENTS.md works│
    │full content│ │Skill summaries│
    └─────┬────┘  └──────┬───────┘
          │              │
          ▼              ▼
    ┌──────────────────────────┐
    │  AI detects user intent  │
    │  Auto-triggers skill     │
    └──────────────────────────┘
```

**Fallback levels:**
1. SessionStart Hook works → Full experience (using-superpowers injected)
2. Hook not supported → AGENTS.md enables skill discovery
3. AGENTS.md not loaded → User manually specifies skill name

## Error Handling

| Scenario | Detection | Response |
|----------|-----------|----------|
| `TRAE_PLUGIN_ROOT` not set | Hook script checks env vars | Fall back to generic output format |
| Bash not found | `run-hook.cmd` exits silently | Hook fails gracefully, AGENTS.md takes over |
| Skills directory missing | Trae IDE shows no skills | User runs installation command |
| Invalid JSON output | Hook returns malformed JSON | Trae ignores hook, uses AGENTS.md |
| Platform not recognized | No env vars match | Use SDK standard `additionalContext` format |

## Testing Strategy

### Unit Tests

1. **Hook script tests**
   - Test `session-start` with `TRAE_PLUGIN_ROOT` set
   - Verify JSON output is valid
   - Verify `additionalContext` contains using-superpowers content

2. **Plugin config validation**
   - Validate `.trae-plugin/plugin.json` schema
   - Verify `skills` path points to existing directory

3. **Skill file structure**
   - All 14 skills have `SKILL.md`
   - Each `SKILL.md` has valid frontmatter (name, description)

### Integration Tests

1. **Acceptance test (official requirement)**
   - Open clean Trae session
   - Send: "Let's make a react todo list"
   - Expected: AI auto-triggers brainstorming skill before writing code
   - Provide complete session transcript in PR

2. **Manual trigger test**
   - Send: "Use systematic-debugging to fix this bug"
   - Expected: AI loads and follows systematic-debugging skill

3. **Fallback test**
   - Disable SessionStart Hook
   - Send: "Let's build a todo app"
   - Expected: AI still discovers skills via AGENTS.md

## Acceptance Criteria

### Required (for official PR)

- [x] `.trae-plugin/plugin.json` created with valid configuration
- [x] Skills directory structure correct (`.trae/skills/<name>/SKILL.md`)
- [x] `hooks/session-start` detects `TRAE_PLUGIN_ROOT`
- [x] Hook outputs valid JSON with `additionalContext`
- [x] AGENTS.md contains all 14 skill summaries
- [x] No breaking changes to existing platform support
- [x] All platforms share same skill files (no duplication)

### Desired

- [ ] openskills tool accepts Trae support PR
- [ ] Acceptance test passes with transcript
- [ ] `openskills install` works for Trae

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Trae doesn't support SessionStart Hook | Medium | Medium | AGENTS.md serves as fallback |
| Trae uses different env var name | Medium | Low | Detect multiple variable names |
| openskills rejects PR | Low | Medium | Provide standalone install script as backup |
| Official rejects Trae support PR | Low | High | Ensure implementation is generic, not project-specific |
| Skill file paths inconsistent | Low | Medium | Strictly follow `.trae/skills/` convention |

## Implementation Order

1. Create `.trae-plugin/plugin.json`
2. Extend `hooks/session-start` for Trae detection
3. Verify skill directory structure (already done)
4. Test hook output with `TRAE_PLUGIN_ROOT`
5. Submit openskills PR for Trae support
6. Submit Superpowers PR for Trae platform support
7. Provide acceptance test transcript

## References

- Superpowers contributing guidelines: `.trae/skills/CLAUDE.md`
- Superpowers PR template: `.trae/skills/.github/PULL_REQUEST_TEMPLATE.md`
- New harness support requirement: Must load bootstrap at session start
- Acceptance test: Auto-trigger brainstorming on "Let's make a react todo list"

## Local Copy Synchronization

### Problem

The current local copy at `F:\Code\superpowers` is a static snapshot downloaded from `https://github.com/obra/superpowers.git`. This means:
- No git history or remote tracking
- Cannot easily pull upstream updates
- Manual re-download required for each new version

### Solution: Convert to Git Repository with Upstream Remote

Convert the static copy into a proper git repository that tracks the upstream Superpowers repository:

```bash
# Initialize git repo in current directory
cd F:\Code\superpowers
git init

# Add all existing files
git add -A
git commit -m "Initial commit: Superpowers v5.1.0 static copy"

# Add upstream remote
git remote add upstream https://github.com/obra/superpowers.git

# Fetch upstream branches
git fetch upstream

# Create a local branch for Trae-specific changes
git checkout -b trae-platform-support
```

### Update Workflow

Once converted, users can update to latest upstream version:

```bash
# Fetch latest upstream changes
git fetch upstream

# Option 1: Merge upstream into local branch (preserves local changes)
git merge upstream/main

# Option 2: Rebase local changes on top of upstream
git rebase upstream/main

# Resolve any conflicts, then commit
git add -A
git commit  # if merge
git rebase --continue  # if rebase
```

### Automated Update Script (Optional)

Create a simple update script for convenience:

**`scripts/update-superpowers.sh`**
```bash
#!/usr/bin/env bash
# Update Superpowers to latest upstream version

set -euo pipefail

echo "Fetching latest upstream changes..."
git fetch upstream

echo "Current branch: $(git branch --show-current)"
echo "Merging upstream/main..."

git merge upstream/main

echo "Update complete!"
echo "Resolve any conflicts if they exist, then commit."
```

**`scripts/update-superpowers.cmd`** (Windows)
```batch
@echo off
REM Update Superpowers to latest upstream version

echo Fetching latest upstream changes...
git fetch upstream

echo Current branch:
git branch --show-current

echo Merging upstream/main...
git merge upstream/main

echo Update complete!
echo Resolve any conflicts if they exist, then commit.
```

### Benefits

1. **Easy updates** - Single command to pull latest upstream changes
2. **Preserves local changes** - Git merge/rebase handles Trae-specific modifications
3. **Version tracking** - Can see what version you're on vs upstream
4. **Contribute back** - Can submit PRs to upstream if desired
5. **Rollback capability** - Can revert to previous versions if needed

### Implementation in Design

This synchronization capability should be:
1. Set up during the initial project setup (convert static copy to git repo)
2. Documented in README or setup guide
3. Optionally include update scripts in `scripts/` directory
