#!/usr/bin/env node

/**
 * Pre-Flight Check Script for GST Calculator Playwright Tests
 * 
 * Verifies all prerequisites before running test suite
 * Run this before executing: npm test
 * 
 * Usage: node preflight-check.js
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

// ANSI Color Codes for beautiful terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
};

// Helper functions for colored output
const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.cyan}ℹ️  ${msg}${colors.reset}`),
  step: (num, msg) => console.log(`\n${colors.bright}${num} ${msg}${colors.reset}`),
  dim: (msg) => console.log(`${colors.dim}   ${msg}${colors.reset}`),
};

// Track check results
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  warningMessages: [],
};

// Configuration
const CONFIG = {
  minNodeVersion: 16,
  testFile: 'gst-calculator.spec.js',
  htmlFile: 'index.html',
  configFile: 'playwright.config.js',
  packageFile: 'package.json',
  serverUrl: 'http://localhost:8000',
  serverTimeout: 3000, // 3 seconds
};

/**
 * Print header
 */
function printHeader() {
  console.log('\n' + '='.repeat(70));
  console.log(colors.bright + colors.cyan + 
    '   🚀 GST CALCULATOR - PRE-FLIGHT CHECK' + colors.reset);
  console.log('='.repeat(70) + '\n');
  console.log(colors.dim + 'Verifying prerequisites before running Playwright tests...' + colors.reset);
}

/**
 * Check 1: Node.js version
 */
function checkNodeVersion() {
  log.step('1️⃣', 'Checking Node.js version...');
  
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  log.dim(`Current version: ${nodeVersion}`);
  log.dim(`Required: >= ${CONFIG.minNodeVersion}.0.0`);
  
  if (majorVersion >= CONFIG.minNodeVersion) {
    log.success(`Node.js version ${nodeVersion} is compatible`);
    results.passed++;
    return true;
  } else {
    log.error(`Node.js version ${nodeVersion} is too old`);
    log.error(`Please upgrade to Node.js ${CONFIG.minNodeVersion} or higher`);
    log.info(`Download from: https://nodejs.org/`);
    results.failed++;
    return false;
  }
}

/**
 * Check 2: package.json exists
 */
function checkPackageJson() {
  log.step('2️⃣', 'Checking package.json...');
  
  const packagePath = path.join(process.cwd(), CONFIG.packageFile);
  log.dim(`Looking for: ${packagePath}`);
  
  if (fs.existsSync(packagePath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      log.success(`package.json found`);
      log.dim(`Project: ${packageJson.name || 'Unknown'}`);
      log.dim(`Version: ${packageJson.version || 'Unknown'}`);
      results.passed++;
      return true;
    } catch (error) {
      log.error(`package.json exists but is invalid JSON`);
      log.error(`Error: ${error.message}`);
      results.failed++;
      return false;
    }
  } else {
    log.error(`package.json not found`);
    log.info(`Run: npm init -y`);
    results.failed++;
    return false;
  }
}

/**
 * Check 3: Playwright installed
 */
function checkPlaywrightInstalled() {
  log.step('3️⃣', 'Checking Playwright installation...');
  
  const packagePath = path.join(process.cwd(), CONFIG.packageFile);
  
  if (!fs.existsSync(packagePath)) {
    log.error(`Cannot check - package.json not found`);
    results.failed++;
    return false;
  }
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };
    
    const playwrightInstalled = deps['@playwright/test'];
    
    if (playwrightInstalled) {
      log.success(`Playwright installed: @playwright/test@${playwrightInstalled}`);
      
      // Check if node_modules exists
      const nodeModulesPath = path.join(process.cwd(), 'node_modules', '@playwright', 'test');
      if (fs.existsSync(nodeModulesPath)) {
        log.dim(`Node modules installed: ✓`);
      } else {
        log.warning(`Playwright in package.json but node_modules missing`);
        log.info(`Run: npm install`);
        results.warnings++;
        results.warningMessages.push('Run npm install to install dependencies');
      }
      
      results.passed++;
      return true;
    } else {
      log.error(`Playwright not found in dependencies`);
      log.info(`Run: npm install --save-dev @playwright/test`);
      results.failed++;
      return false;
    }
  } catch (error) {
    log.error(`Error reading package.json: ${error.message}`);
    results.failed++;
    return false;
  }
}

/**
 * Check 4: Test file exists
 */
function checkTestFile() {
  log.step('4️⃣', 'Checking test file...');
  
  const testPath = path.join(process.cwd(), CONFIG.testFile);
  log.dim(`Looking for: ${testPath}`);
  
  if (fs.existsSync(testPath)) {
    const stats = fs.statSync(testPath);
    const fileSizeKB = (stats.size / 1024).toFixed(2);
    
    log.success(`Test file found: ${CONFIG.testFile}`);
    log.dim(`File size: ${fileSizeKB} KB`);
    
    // Count test cases (rough estimate)
    try {
      const content = fs.readFileSync(testPath, 'utf8');
      const testCount = (content.match(/test\(/g) || []).length;
      log.dim(`Estimated tests: ${testCount}`);
    } catch (error) {
      // Ignore if can't read
    }
    
    results.passed++;
    return true;
  } else {
    log.error(`Test file not found: ${CONFIG.testFile}`);
    log.info(`Create test file or check file name`);
    results.failed++;
    return false;
  }
}

/**
 * Check 5: Playwright config (optional)
 */
function checkPlaywrightConfig() {
  log.step('5️⃣', 'Checking Playwright config (optional)...');
  
  const configPath = path.join(process.cwd(), CONFIG.configFile);
  log.dim(`Looking for: ${configPath}`);
  
  if (fs.existsSync(configPath)) {
    log.success(`Config file found: ${CONFIG.configFile}`);
    
    // Try to read config details
    try {
      const content = fs.readFileSync(configPath, 'utf8');
      
      // Check for common config options
      const hasTestDir = content.includes('testDir');
      const hasTimeout = content.includes('timeout');
      const hasRetries = content.includes('retries');
      const hasWebServer = content.includes('webServer');
      
      log.dim(`Config includes:`);
      if (hasTestDir) log.dim(`  - testDir ✓`);
      if (hasTimeout) log.dim(`  - timeout ✓`);
      if (hasRetries) log.dim(`  - retries ✓`);
      if (hasWebServer) log.dim(`  - webServer ✓`);
    } catch (error) {
      // Ignore if can't read
    }
    
    results.passed++;
    return true;
  } else {
    log.warning(`Config file not found: ${CONFIG.configFile}`);
    log.info(`This is optional. Playwright will use defaults.`);
    log.info(`To create: npx playwright test --config`);
    results.warnings++;
    results.warningMessages.push('Consider creating playwright.config.js for better control');
    return true; // Not critical
  }
}

/**
 * Check 6: HTML file exists
 */
function checkHtmlFile() {
  log.step('6️⃣', 'Checking HTML file...');
  
  const htmlPath = path.join(process.cwd(), CONFIG.htmlFile);
  log.dim(`Looking for: ${htmlPath}`);
  
  if (fs.existsSync(htmlPath)) {
    const stats = fs.statSync(htmlPath);
    const fileSizeKB = (stats.size / 1024).toFixed(2);
    
    log.success(`HTML file found: ${CONFIG.htmlFile}`);
    log.dim(`File size: ${fileSizeKB} KB`);
    
    // Check if file contains GST calculator keywords
    try {
      const content = fs.readFileSync(htmlPath, 'utf8');
      const hasGST = content.toLowerCase().includes('gst');
      const hasCalculator = content.toLowerCase().includes('calculator');
      
      if (hasGST && hasCalculator) {
        log.dim(`Content verified: GST Calculator elements found ✓`);
      } else {
        log.warning(`File exists but may not be GST calculator`);
        results.warnings++;
        results.warningMessages.push('HTML file may not be the correct GST calculator');
      }
    } catch (error) {
      // Ignore if can't read
    }
    
    results.passed++;
    return true;
  } else {
    log.error(`HTML file not found: ${CONFIG.htmlFile}`);
    log.info(`Make sure ${CONFIG.htmlFile} exists in the current directory`);
    results.failed++;
    return false;
  }
}

/**
 * Check 7: Local server running
 */
async function checkLocalServer() {
  log.step('7️⃣', 'Checking local server...');
  
  log.dim(`Checking: ${CONFIG.serverUrl}`);
  log.dim(`Timeout: ${CONFIG.serverTimeout}ms`);
  
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      log.error(`Server not responding at ${CONFIG.serverUrl}`);
      log.info(`Start server with one of these commands:`);
      log.dim(`  - python3 -m http.server 8000`);
      log.dim(`  - python -m http.server 8000`);
      log.dim(`  - npx http-server -p 8000`);
      log.dim(`  - php -S localhost:8000`);
      log.info(`Or check if port 8000 is already in use:`);
      log.dim(`  - lsof -ti:8000`);
      results.failed++;
      resolve(false);
    }, CONFIG.serverTimeout);
    
    const req = http.get(CONFIG.serverUrl, (res) => {
      clearTimeout(timeout);
      
      log.success(`Server is running at ${CONFIG.serverUrl}`);
      log.dim(`Status code: ${res.statusCode}`);
      log.dim(`Server: ${res.headers.server || 'Unknown'}`);
      
      if (res.statusCode === 200) {
        log.dim(`Response: OK ✓`);
      } else {
        log.warning(`Unexpected status code: ${res.statusCode}`);
        results.warnings++;
        results.warningMessages.push(`Server returned status ${res.statusCode} instead of 200`);
      }
      
      results.passed++;
      resolve(true);
    });
    
    req.on('error', (error) => {
      clearTimeout(timeout);
      
      if (error.code === 'ECONNREFUSED') {
        log.error(`Connection refused - server not running`);
      } else if (error.code === 'ENOTFOUND') {
        log.error(`Host not found`);
      } else {
        log.error(`Error: ${error.message}`);
      }
      
      log.info(`Start a local server on port 8000`);
      log.dim(`  python3 -m http.server 8000`);
      
      results.failed++;
      resolve(false);
    });
    
    req.setTimeout(CONFIG.serverTimeout, () => {
      clearTimeout(timeout);
      req.destroy();
      log.error(`Request timed out after ${CONFIG.serverTimeout}ms`);
      results.failed++;
      resolve(false);
    });
  });
}

/**
 * Print summary
 */
function printSummary() {
  console.log('\n' + '='.repeat(70));
  console.log(colors.bright + '📊 PRE-FLIGHT CHECK SUMMARY' + colors.reset);
  console.log('='.repeat(70) + '\n');
  
  // Results
  const totalChecks = results.passed + results.failed;
  const passRate = totalChecks > 0 ? ((results.passed / totalChecks) * 100).toFixed(1) : 0;
  
  console.log(`${colors.green}✅ Passed:  ${results.passed}${colors.reset}`);
  console.log(`${colors.red}❌ Failed:  ${results.failed}${colors.reset}`);
  console.log(`${colors.yellow}⚠️  Warnings: ${results.warnings}${colors.reset}`);
  console.log(`${colors.cyan}📈 Pass Rate: ${passRate}%${colors.reset}\n`);
  
  // Warnings
  if (results.warnings > 0) {
    console.log(colors.yellow + '⚠️  WARNINGS:' + colors.reset);
    results.warningMessages.forEach((msg, idx) => {
      console.log(`${colors.yellow}  ${idx + 1}. ${msg}${colors.reset}`);
    });
    console.log('');
  }
  
  // Final status
  if (results.failed === 0) {
    console.log(colors.bgGreen + colors.bright + '                                                                      ' + colors.reset);
    console.log(colors.bgGreen + colors.bright + '  ✅ ALL CRITICAL CHECKS PASSED - READY TO RUN TESTS!                ' + colors.reset);
    console.log(colors.bgGreen + colors.bright + '                                                                      ' + colors.reset);
    console.log('');
    console.log(colors.green + '🚀 Next steps:' + colors.reset);
    console.log(colors.dim + '   1. Run tests:      npm test' + colors.reset);
    console.log(colors.dim + '   2. View report:    npm run report' + colors.reset);
    console.log(colors.dim + '   3. Debug mode:     npm run test:debug' + colors.reset);
    console.log('');
  } else {
    console.log(colors.bgRed + colors.bright + '                                                                      ' + colors.reset);
    console.log(colors.bgRed + colors.bright + '  ❌ CRITICAL CHECKS FAILED - CANNOT RUN TESTS                        ' + colors.reset);
    console.log(colors.bgRed + colors.bright + '                                                                      ' + colors.reset);
    console.log('');
    console.log(colors.red + '🔧 Fix the errors above and run this check again:' + colors.reset);
    console.log(colors.dim + '   node preflight-check.js' + colors.reset);
    console.log('');
  }
  
  console.log('='.repeat(70) + '\n');
}

/**
 * Print footer
 */
function printFooter() {
  console.log(colors.dim + 'For more information, see:' + colors.reset);
  console.log(colors.dim + '  - TESTING-GUIDE.md (comprehensive guide)' + colors.reset);
  console.log(colors.dim + '  - QUICK-REFERENCE.md (command cheat sheet)' + colors.reset);
  console.log(colors.dim + '  - RUN-TESTS.md (all test commands)' + colors.reset);
  console.log('');
  console.log(colors.cyan + '📞 Need help? Check documentation or run: npm run help' + colors.reset);
  console.log('');
}

/**
 * Main function
 */
async function main() {
  try {
    printHeader();
    
    // Run all checks
    checkNodeVersion();
    checkPackageJson();
    checkPlaywrightInstalled();
    checkTestFile();
    checkPlaywrightConfig();
    checkHtmlFile();
    await checkLocalServer();
    
    // Print summary
    printSummary();
    printFooter();
    
    // Exit with appropriate code
    if (results.failed === 0) {
      process.exit(0); // Success
    } else {
      process.exit(1); // Failure
    }
  } catch (error) {
    console.error(colors.red + '\n❌ UNEXPECTED ERROR:' + colors.reset);
    console.error(colors.red + error.message + colors.reset);
    console.error(colors.dim + error.stack + colors.reset);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

// Export for testing
module.exports = {
  checkNodeVersion,
  checkPackageJson,
  checkPlaywrightInstalled,
  checkTestFile,
  checkPlaywrightConfig,
  checkHtmlFile,
  checkLocalServer,
};

