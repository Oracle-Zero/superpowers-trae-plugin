/**
 * Superpowers Trae IDE Plugin
 * 
 * This plugin provides professional AI development skills for Trae IDE.
 * It handles session start hooks and skill loading.
 * 
 * @package superpowers-trae
 * @version 5.1.0
 */

const path = require('path');
const fs = require('fs');

// Plugin configuration
const PLUGIN_NAME = 'superpowers-trae';
const SKILLS_DIR = path.join(__dirname, 'skills');

/**
 * Session Start Hook Handler
 * 
 * Injects using-superpowers bootstrap content at session start.
 * This enables automatic skill triggering.
 * 
 * @returns {Object} JSON object with additionalContext for session
 */
function handleSessionStart() {
  try {
    // Load using-superpowers skill content
    const usingSuperpowersPath = path.join(SKILLS_DIR, 'using-superpowers', 'SKILL.md');
    
    if (!fs.existsSync(usingSuperpowersPath)) {
      console.error(`Warning: ${usingSuperpowersPath} not found`);
      return {};
    }
    
    const skillContent = fs.readFileSync(usingSuperpowersPath, 'utf8');
    
    // Extract content between frontmatter
    const frontmatterEnd = skillContent.indexOf('---', 3);
    let bootstrapContent = '';
    
    if (frontmatterEnd !== -1) {
      bootstrapContent = skillContent.substring(frontmatterEnd + 3).trim();
    } else {
      bootstrapContent = skillContent.trim();
    }
    
    // Escape for JSON
    const escapedContent = bootstrapContent
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '')
      .replace(/\t/g, '\\t');
    
    // Output SDK standard format
    const output = {
      additionalContext: `Superpowers skills loaded: ${escapedContent}`
    };
    
    console.log(JSON.stringify(output));
    
    return output;
  } catch (error) {
    console.error(`Error in session-start hook: ${error.message}`);
    return {};
  }
}

/**
 * Main entry point
 * 
 * Handles command-line arguments for different hook events
 */
function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'session-start';
  
  switch (command) {
    case 'session-start':
      handleSessionStart();
      break;
    default:
      console.error(`Unknown command: ${command}`);
      process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

// Export for programmatic use
module.exports = {
  handleSessionStart,
  PLUGIN_NAME,
  SKILLS_DIR
};
