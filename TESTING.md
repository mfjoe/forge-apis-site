# VA Calculator - Complete Testing Guide

This guide provides comprehensive instructions for testing the VA Disability Benefits Calculator.

## Quick Start

### Windows (PowerShell)
```powershell
.\run-tests.ps1
```

### Windows (Batch)
```cmd
run-tests.bat
```

### Any Platform (npm)
```bash
npm run test:all
```

## Test Suites

The test suite consists of 5 comprehensive test files:

1. **calculations.spec.js** - Basic calculation logic (10 tests)
2. **bilateral.spec.js** - Bilateral factor calculations (8 tests)
3. **dependents.spec.js** - Dependent adjustments (12 tests)
4. **ui-interactions.spec.js** - UI/UX testing (15 tests)
5. **mobile.spec.js** - Mobile responsive testing (14 tests)

**Total: 59 tests** covering all calculator functionality.

## Prerequisites

- **Node.js** v14 or higher
- **npm** (comes with Node.js)
- **Local server** running on port 5500 (auto-started by scripts)

## Setup Instructions

### First Time Setup

```bash
# Install dependencies
npm install

# Install Playwright browsers
npm run install-browsers
```

### Verify Setup

```bash
# Check Node.js
node --version

# Check npm
npm --version

# Check Playwright
npx playwright --version
```

## Running Tests

### Comprehensive Test Suite

```bash
npm run test:all
```

This runs all 5 test suites sequentially and generates an HTML report.

### Individual Test Suites

```bash
npm run test:calculations    # Calculations only
npm run test:bilateral       # Bilateral factor only
npm run test:dependents      # Dependents only
npm run test:ui              # UI interactions only
npm run test:mobile           # Mobile layout only
```

### Test Modes

```bash
npm run test:headed          # Run with visible browser
npm run test:uimode          # Interactive UI mode
npm run test:debug           # Debug mode
npm test                     # Standard Playwright test run
```

## Test Reports

### Custom HTML Report

After running `npm run test:all`, a comprehensive HTML report is generated:

```
test-results/report.html
```

This report includes:
- Overall statistics (total, passed, failed, duration)
- Success rate percentage
- Per-suite breakdown
- Status indicators
- Generation timestamp

### Playwright HTML Report

View Playwright's built-in report:

```bash
npm run test:report
```

Opens the detailed Playwright report with:
- Test execution timeline
- Screenshots of failures
- Error traces
- Video recordings (if enabled)

## Automated Scripts

### PowerShell Script (Windows)

```powershell
.\run-tests.ps1
```

**Features:**
- ✅ Checks Node.js installation
- 📦 Auto-installs dependencies
- 🚀 Auto-starts server if needed
- 🏃 Runs all tests
- 📊 Opens HTML report
- 🛑 Cleanup

### Batch Script (Windows)

```cmd
run-tests.bat
```

**Features:**
- ✅ Node.js verification
- 📦 Dependency installation
- 🏃 Test execution
- 📊 Opens results

## Manual Server Setup

If you prefer to run the server manually:

```bash
# Start server
npx serve -p 5500

# In another terminal, run tests
npm run test:all
```

## Test Configuration

### Base URL

Default: `http://localhost:5500`

To change, edit `playwright.config.js`:

```javascript
use: {
  baseURL: 'http://your-url:port',
  // ...
}
```

### Browsers

Tests run on:
- Chromium
- Firefox
- WebKit (Safari)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

### Timeouts

Default timeout: 30 seconds per test

Adjust in `playwright.config.js`:

```javascript
use: {
  timeout: 60000, // 60 seconds
  // ...
}
```

## Understanding Test Results

### Success Indicators

- ✅ All tests passed
- ⚠️ Some tests passed with warnings
- ❌ Tests failed

### Test Output

```
🧪 VA Calculator - Comprehensive Test Suite
============================================================

[1/5] 🔢 Running Calculations tests...
   ✅ Calculations: 10/10 passed (3.45s)

============================================================
📊 FINAL TEST RESULTS
============================================================
✅ 🔢 Calculations: 10/10 passed (3.45s)
✅ 🦾 Bilateral Factor: 8/8 passed (2.89s)
✅ 👨‍👩‍👧‍👦 Dependents: 12/12 passed (4.12s)
✅ 🖱️ UI Interactions: 15/15 passed (5.67s)
✅ 📱 Mobile Layout: 14/14 passed (4.89s)
============================================================
Total Tests:    59
✅ Passed:      59
❌ Failed:      0
⏱️  Duration:    21.02s
📈 Success Rate: 100.0%
============================================================
```

## Troubleshooting

### "Connection refused"

**Solution:** Start a local server on port 5500

```bash
npx serve -p 5500
```

### "Tests are timing out"

**Possible causes:**
1. Server is slow to respond
2. Calculator JavaScript has errors
3. Network issues

**Solution:**
- Increase timeout in `playwright.config.js`
- Check browser console for JavaScript errors
- Run with `--headed` to see what's happening

### "Element not found"

**Possible causes:**
1. HTML structure changed
2. Selectors need updating

**Solution:**
- Update selectors in test files to match current HTML
- Use `page.screenshot()` to see current state
- Run with `--debug` to step through tests

### "Can't run PowerShell script"

**Solution:**

Run PowerShell as Administrator:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then run the script:

```powershell
.\run-tests.ps1
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npx playwright install --with-deps
      - run: npm run test:all
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results
          path: test-results/
```

### Azure DevOps

```yaml
- task: NodeTool@0
  inputs:
    versionSpec: '18.x'
    
- script: npm install
  displayName: 'Install dependencies'
  
- script: npx playwright install --with-deps
  displayName: 'Install Playwright'
  
- script: npm run test:all
  displayName: 'Run tests'
  continueOnError: true
```

## Contributing Tests

When adding new tests:

1. **Create test file** in `tests/` directory
2. **Update** `tests/run-all-tests.js` to include new suite
3. **Add npm script** to `package.json`
4. **Document** in `tests/README.md`

### Test Naming Convention

- Use descriptive names: `feature-name.spec.js`
- Group related tests with `test.describe()`
- Use clear test descriptions

### Test Structure

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/va-calculator/');
    await page.waitForSelector('.main-selector');
  });

  test('should do something specific', async ({ page }) => {
    // Test code
  });
});
```

## Best Practices

1. **Use waiting strategies** - Don't use arbitrary `waitForTimeout()`
2. **Take screenshots** - Help debug failures
3. **Use data attributes** - For stable selectors
4. **Test on multiple browsers** - Ensure compatibility
5. **Keep tests fast** - Avoid unnecessary waits
6. **Use clear assertions** - `expect(something).toBe(expected)`
7. **Document complex tests** - Add comments for clarity

## Need Help?

- **Check test output** for error messages
- **Review screenshots** in `test-results/`
- **Run with `--headed`** to see browser
- **Use `--debug`** to step through tests
- **Read Playwright docs** at https://playwright.dev

## Summary

The VA Calculator has comprehensive test coverage with:
- ✅ 59 automated tests
- ✅ 5 test suites
- ✅ Mobile responsive testing
- ✅ Cross-browser testing
- ✅ Detailed HTML reports
- ✅ Automated test runner scripts

Happy testing! 🧪

















