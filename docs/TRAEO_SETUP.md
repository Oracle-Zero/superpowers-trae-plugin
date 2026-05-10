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
