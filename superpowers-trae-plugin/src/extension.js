const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const https = require('https');

/**
 * Superpowers Trae IDE Plugin Entry Point
 * 
 * This plugin provides two modes:
 * 1. Offline Install - Copies embedded skills from plugin to project
 * 2. Online Update   - Fetches latest skills from GitHub repository
 * 
 * @version 5.1.0
 */

// GitHub repository info for online updates
const GITHUB_REPO = 'obra/superpowers';
const GITHUB_BRANCH = 'main';
const GITHUB_BASE_URL = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}`;
const GITHUB_AGENTS_URL = `${GITHUB_BASE_URL}/AGENTS.md`;

// Skills to sync
const SKILLS = [
  'brainstorming',
  'dispatching-parallel-agents',
  'executing-plans',
  'finishing-a-development-branch',
  'receiving-code-review',
  'requesting-code-review',
  'subagent-driven-development',
  'systematic-debugging',
  'test-driven-development',
  'using-git-worktrees',
  'using-superpowers',
  'verification-before-completion',
  'writing-plans',
  'writing-skills'
];

/**
 * Plugin activation
 * 
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Superpowers extension activated');

  // Auto-install skills when workspace is opened
  const config = vscode.workspace.getConfiguration('superpowers');
  if (config.get('autoInstall', true)) {
    installSkillsToWorkspace();
  }

  // Register commands
  let showSkillsCmd = vscode.commands.registerCommand('superpowers.showSkills', () => {
    vscode.window.showInformationMessage(
      `Superpowers has ${SKILLS.length} skills installed. ` +
      `Skills: ${SKILLS.join(', ')}`
    );
  });

  let installCmd = vscode.commands.registerCommand('superpowers.installToProject', () => {
    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Installing Superpowers skills...',
        cancellable: false
      },
      (progress) => {
        return new Promise((resolve) => {
          progress.report({ increment: 0, message: 'Installing skills...' });
          installSkillsToWorkspace();
          progress.report({ increment: 100, message: 'Done!' });
          vscode.window.showInformationMessage('Superpowers skills installed to current project!');
          resolve();
        });
      }
    );
  });

  let updateCmd = vscode.commands.registerCommand('superpowers.updateSkills', () => {
    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Updating Superpowers skills from GitHub...',
        cancellable: false
      },
      async (progress) => {
        progress.report({ increment: 0, message: 'Checking GitHub...' });
        const result = await syncSkillsFromGitHub(progress);
        progress.report({ increment: 100, message: 'Done!' });
        if (result.success) {
          vscode.window.showInformationMessage(
            `Superpowers skills updated! ${result.updated}/${result.total} files downloaded from GitHub.`
          );
        } else {
          vscode.window.showErrorMessage(
            `Failed to update from GitHub: ${result.error}. Check your network connection.`
          );
        }
      }
    );
  });

  context.subscriptions.push(showSkillsCmd, installCmd, updateCmd);
}

/**
 * Install skills to current workspace (offline mode)
 * Copies embedded skill files from the plugin package to the project.
 * 
 * @returns {void}
 */
function installSkillsToWorkspace() {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    return;
  }

  const workspaceRoot = workspaceFolders[0].uri.fsPath;
  const projectSkillsDir = path.join(workspaceRoot, '.trae', 'skills');

  // Create .trae/skills directory if it doesn't exist
  if (!fs.existsSync(projectSkillsDir)) {
    fs.mkdirSync(projectSkillsDir, { recursive: true });
  }

  // Get the plugin's skills directory (embedded in the .vsix)
  const pluginSkillsDir = path.join(__dirname, '..', 'skills');

  if (!fs.existsSync(pluginSkillsDir)) {
    console.error(`Plugin skills directory not found: ${pluginSkillsDir}`);
    return;
  }

  // Copy each skill from plugin to project
  let installedCount = 0;
  for (const skillName of SKILLS) {
    const srcSkillDir = path.join(pluginSkillsDir, skillName);
    const destSkillDir = path.join(projectSkillsDir, skillName);

    if (fs.existsSync(srcSkillDir)) {
      copyDirRecursive(srcSkillDir, destSkillDir);
      installedCount++;
    } else {
      console.warn(`Skill not found in plugin: ${skillName}`);
    }
  }

  // Copy AGENTS.md if it doesn't exist in the project
  const agentsFile = path.join(workspaceRoot, 'AGENTS.md');
  if (!fs.existsSync(agentsFile)) {
    const srcAgents = path.join(__dirname, '..', 'AGENTS.md');
    if (fs.existsSync(srcAgents)) {
      fs.copyFileSync(srcAgents, agentsFile);
    }
  }

  // Copy .trae-plugin configuration if it doesn't exist
  const pluginConfigDir = path.join(workspaceRoot, '.trae-plugin');
  if (!fs.existsSync(pluginConfigDir)) {
    fs.mkdirSync(pluginConfigDir, { recursive: true });
    
    const srcPluginJson = path.join(__dirname, '..', 'plugin-config', 'plugin.json');
    if (fs.existsSync(srcPluginJson)) {
      fs.copyFileSync(srcPluginJson, path.join(pluginConfigDir, 'plugin.json'));
    }
  }

  if (installedCount > 0) {
    console.log(`[Superpowers] Installed ${installedCount} skills to: ${projectSkillsDir}`);
  }
}

/**
 * Sync skills from GitHub repository (online update mode)
 * Fetches the latest skill files from the upstream GitHub repository.
 * 
 * @returns {Promise<{success: boolean, updated: number, total: number, error?: string}>}
 */
async function syncSkillsFromGitHub() {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    return { success: false, updated: 0, total: 0, error: 'No workspace folder' };
  }

  const workspaceRoot = workspaceFolders[0].uri.fsPath;
  const skillsDir = path.join(workspaceRoot, '.trae', 'skills');

  if (!fs.existsSync(skillsDir)) {
    fs.mkdirSync(skillsDir, { recursive: true });
  }

  // Count total files to download
  let totalFiles = 0;
  const skillFiles = await getSkillFilesFromGitHub();
  for (const [skillName, files] of Object.entries(skillFiles)) {
    totalFiles += files.length;
  }

  let completedFiles = 0;
  let hasError = false;

  for (const [skillName, files] of Object.entries(skillFiles)) {
    const skillDir = path.join(skillsDir, skillName);

    if (!fs.existsSync(skillDir)) {
      fs.mkdirSync(skillDir, { recursive: true });
    }

    for (const relativePath of files) {
      try {
        const githubUrl = `${GITHUB_BASE_URL}/.trae/skills/${skillName}/${relativePath}`;
        const destPath = path.join(skillDir, relativePath);

        // Create subdirectory if needed (e.g., references/, examples/)
        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }

        await fetchFileFromGitHub(githubUrl, destPath);
        completedFiles++;
      } catch (error) {
        console.error(`[Superpowers] Failed to sync ${skillName}/${relativePath}:`, error.message);
        hasError = true;
      }
    }
  }

  // Also update AGENTS.md
  try {
    const agentsFile = path.join(workspaceRoot, 'AGENTS.md');
    await fetchFileFromGitHub(GITHUB_AGENTS_URL, agentsFile);
  } catch (error) {
    console.error('[Superpowers] Failed to update AGENTS.md:', error.message);
  }

  return {
    success: !hasError,
    updated: completedFiles,
    total: totalFiles,
    error: hasError ? 'Some files failed to download' : undefined
  };
}

/**
 * Get list of skill files from GitHub.
 * Since we can't use the GitHub API without a token, we use a hardcoded list
 * based on the known repository structure. This list is updated periodically.
 * 
 * @returns {Promise<Object>} Map of skill name to array of relative file paths
 */
async function getSkillFilesFromGitHub() {
  // This list mirrors the known structure of the upstream repository.
  // It should be updated when the upstream adds new files.
  return {
    'brainstorming': ['SKILL.md'],
    'dispatching-parallel-agents': ['SKILL.md'],
    'executing-plans': ['SKILL.md'],
    'finishing-a-development-branch': ['SKILL.md'],
    'receiving-code-review': ['SKILL.md'],
    'requesting-code-review': ['SKILL.md'],
    'subagent-driven-development': ['SKILL.md'],
    'systematic-debugging': ['SKILL.md'],
    'test-driven-development': ['SKILL.md'],
    'using-git-worktrees': ['SKILL.md'],
    'using-superpowers': ['SKILL.md'],
    'verification-before-completion': ['SKILL.md'],
    'writing-plans': ['SKILL.md'],
    'writing-skills': ['SKILL.md']
  };
}

/**
 * Fetch a file from GitHub and save it to the specified path
 * 
 * @param {string} url - GitHub raw content URL
 * @param {string} destPath - Destination file path
 * @returns {Promise<void>}
 */
function fetchFileFromGitHub(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        fetchFileFromGitHub(response.headers.location, destPath)
          .then(resolve)
          .catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        return;
      }

      const fileStream = fs.createWriteStream(destPath);
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(destPath, () => {}); // Delete the file on error
        reject(err);
      });
    }).on('error', reject);
  });
}

/**
 * Recursively copy directory
 * 
 * @param {string} src - Source directory
 * @param {string} dest - Destination directory
 */
function copyDirRecursive(src, dest) {
  // Create destination directory
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read source directory entries
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
