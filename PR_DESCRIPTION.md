# Trae IDE Platform Support - PR Description

## What problem are you trying to solve?

Trae IDE users cannot use Superpowers skills natively. The current implementation lacks a `.trae-plugin/plugin.json` configuration and SessionStart Hook support for the Trae IDE platform. This means Trae users must manually copy skill files and cannot benefit from automatic skill triggering.

## What does this PR change?

Adds native Trae IDE support to Superpowers with progressive enhancement architecture:
1. Creates `.trae-plugin/plugin.json` plugin configuration
2. Extends `hooks/session-start` to detect `TRAE_PLUGIN_ROOT` environment variable
3. Creates Trae-specific hook configuration (`hooks-trae.json`)
4. Adds cross-platform update scripts for maintaining local copies
5. Provides setup documentation for Trae users

## Is this change appropriate for the core library?

Yes. This is a general-purpose platform integration that benefits all Trae IDE users. It:
- Follows the same pattern as existing Claude Code and Cursor support
- Adds zero dependencies
- Uses generic environment variable detection (not project-specific)
- Benefits anyone using Trae IDE with Superpowers skills

## What alternatives did you consider?

1. **Separate plugin repository**: Would require users to install two separate packages. Merged into core is simpler for users.
2. **AGENTS.md only approach**: Would work but lacks SessionStart Hook integration for automatic triggering. This PR provides both.
3. **Standalone installation script**: Included as a fallback, but the primary approach integrates with the existing hooks system.

## Does this PR contain multiple unrelated changes?

No. All changes are related to Trae IDE platform support:
- Plugin config, hook extension, and update scripts all serve the same goal
- Each change is necessary for a complete integration

## Existing PRs
- [x] I have reviewed all open AND closed PRs for duplicates or prior art
- Related PRs: None found for Trae IDE support

## Environment tested

| Harness (e.g. Claude Code, Cursor) | Harness version | Model | Model version/ID |
|-------------------------------------|-----------------|-------|------------------|
| Trae IDE | Current | Qwen | Qwen3.6-Plus |

## New harness support

This PR adds Trae IDE support with the following integration approach:

1. **Plugin Configuration**: `.trae-plugin/plugin.json` declares skills directory and hooks
2. **Hook Detection**: `session-start` script detects `TRAE_PLUGIN_ROOT` environment variable
3. **Bootstrap Loading**: Hook injects `using-superpowers` content at session start
4. **Fallback**: `AGENTS.md` provides skill summaries even if hooks are not supported

**Progressive Enhancement Layers:**
- Layer 1: Plugin config → Trae can discover skills
- Layer 2: AGENTS.md → AI can see skill summaries
- Layer 3: SessionStart Hook → Full auto-trigger experience

**Note:** The acceptance test requires a clean Trae session where "Let's make a react todo list" auto-triggers brainstorming. This requires Trae to support SessionStart hooks, which may depend on Trae IDE version and configuration. The infrastructure is in place; actual triggering depends on Trae's hook support.

## Evaluation

- Initial prompt: "我想为 Superpowers 提供 Trae 平台的支持"
- Eval sessions: 1 (current implementation session)
- Outcomes: Successfully created all necessary files, verified hook outputs valid JSON

## Rigor

- [x] If this is a skills change: I used `superpowers:writing-plans` and followed the implementation plan
- [x] This change was tested adversarially where possible (hook output verified with mock env vars)
- [x] No changes to existing skill content - only infrastructure additions

## Human review
- [x] A human has reviewed the COMPLETE proposed diff before submission

## File Changes Summary

| File | Change | Lines |
|------|--------|-------|
| `.trae-plugin/plugin.json` | Create | +24 |
| `.trae/skills/hooks/hooks-trae.json` | Create | +16 |
| `.trae/skills/hooks/session-start` | Modify | +4/-1 |
| `scripts/update-superpowers.sh` | Create | +62 |
| `scripts/update-superpowers.cmd` | Create | +62 |
| `docs/TRAEO_SETUP.md` | Create | +110 |
| **Total** | 6 files | +278/-1 |
