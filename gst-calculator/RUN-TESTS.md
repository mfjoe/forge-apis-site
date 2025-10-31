# 🚀 Running GST Calculator Tests

Quick reference guide for running Playwright tests locally and in CI/CD.

---

## 📦 Installation

### First Time Setup
```bash
# Install Node.js dependencies
npm install

# Install Playwright browsers
npm run install:browsers

# Or combined
npm install && npx playwright install --with-deps
```

---

## 🧪 Running Tests

### Basic Commands

```bash
# Run all tests (starts server automatically)
npm test

# Run with visible browser
npm run test:headed

# Interactive UI mode (best for development)
npm run test:ui

# Debug mode (step through tests)
npm run test:debug
```

### Browser-Specific Tests

```bash
# Desktop browsers
npm run test:chrome
npm run test:firefox
npm run test:safari

# Mobile browsers
npm run test:mobile
npm run test:mobile-chrome
npm run test:mobile-safari
```

### Advanced Options

```bash
# Run specific test by name
npx playwright test -g "Restaurant bill"

# Run tests matching pattern
npm run test:grep "@smoke"

# Run tests in specific file
npx playwright test gst-calculator.spec.js

# Run with multiple workers (parallel)
npx playwright test --workers=4

# Run tests one by one (no parallel)
npx playwright test --workers=1

# Run and update snapshots
npm run test:update-snapshots
```

---

## 📊 Viewing Results

### HTML Report (Interactive)
```bash
# Open report in browser
npm run test:report

# Or manually
npx playwright show-report
```

The HTML report includes:
- ✅ Test pass/fail status
- 📸 Screenshots on failure
- 🎥 Video recordings
- 📋 Trace files for debugging
- ⏱️ Execution timeline
- 📊 Statistics and metrics

### Console Output
Tests automatically show in console with:
- List of running tests
- Pass/fail indicators
- Execution time
- Error messages

### JSON Report
Located at: `test-results/results.json`
```bash
# View JSON results
cat test-results/results.json | jq
```

---

## 🐛 Debugging

### Method 1: UI Mode (Recommended)
```bash
npm run test:ui
```
Features:
- Step through each test
- See live browser
- Inspect DOM
- View console logs
- Time travel debugging

### Method 2: Debug Mode
```bash
npm run test:debug
```
- Opens Playwright Inspector
- Pause at each step
- Execute commands manually

### Method 3: Headed Mode
```bash
npm run test:headed
```
- Watch tests run in real browser
- See what the test sees

### Method 4: Specific Test
```bash
npx playwright test --debug -g "specific test name"
```

---

## 🖥️ Server Management

### Automatic (Recommended)
Server starts automatically when you run tests.

### Manual Control
```bash
# Start Python server manually
npm run server:start

# Stop Python server
npm run server:stop

# Check if port 8000 is in use
lsof -i:8000
```

### Custom Port
Edit `playwright.config.js`:
```javascript
webServer: {
  command: 'python3 -m http.server 9000',
  url: 'http://localhost:9000',
  port: 9000,
}
```

---

## 🚀 CI/CD Integration

### GitHub Actions (Included)
File: `.github/workflows/playwright.yml`

Automatically runs on:
- Push to main/master/develop
- Pull requests
- Daily at 2 AM UTC

View results in GitHub Actions tab.

### GitLab CI
```yaml
# .gitlab-ci.yml
test:
  image: mcr.microsoft.com/playwright:v1.40.0-jammy
  script:
    - npm ci
    - npx playwright install
    - npm run test:ci
  artifacts:
    when: always
    paths:
      - playwright-report/
      - test-results/
    expire_in: 30 days
```

### Jenkins
```groovy
pipeline {
  agent any
  stages {
    stage('Test') {
      steps {
        sh 'npm ci'
        sh 'npx playwright install --with-deps'
        sh 'npm run test:ci'
      }
    }
  }
  post {
    always {
      junit 'test-results/junit.xml'
      archiveArtifacts 'playwright-report/**'
    }
  }
}
```

### CircleCI
```yaml
# .circleci/config.yml
version: 2.1
jobs:
  test:
    docker:
      - image: mcr.microsoft.com/playwright:v1.40.0-jammy
    steps:
      - checkout
      - run: npm ci
      - run: npx playwright install
      - run: npm run test:ci
      - store_artifacts:
          path: playwright-report
      - store_test_results:
          path: test-results
```

---

## 📸 Screenshots & Videos

### Location
```
test-results/
├── screenshots/
│   └── Desktop-Chrome-failed-test.png
├── videos/
│   └── Desktop-Chrome-failed-test.webm
└── traces/
    └── Desktop-Chrome-failed-test.zip
```

### Configuration
Edit `playwright.config.js`:
```javascript
use: {
  screenshot: 'only-on-failure',  // or 'on', 'off'
  video: 'retain-on-failure',     // or 'on', 'off', 'retain-on-failure'
  trace: 'on-first-retry',        // or 'on', 'off', 'retain-on-failure'
}
```

---

## 🎯 Test Tags

### Run Smoke Tests
```bash
npx playwright test --grep @smoke
```

### Skip Slow Tests
```bash
npx playwright test --grep-invert @slow
```

### Tag Your Tests
```javascript
test('should calculate GST @smoke @critical', async ({ page }) => {
  // test code
});
```

---

## 🔧 Troubleshooting

### Port 8000 Already In Use
```bash
# Kill process on port 8000
npm run server:stop

# Or manually
lsof -ti:8000 | xargs kill -9
```

### Browsers Not Installed
```bash
npx playwright install --with-deps
```

### Tests Hanging
```bash
# Run with reduced workers
npx playwright test --workers=1

# Increase timeout in config
timeout: 60 * 1000  // 60 seconds
```

### WebKit (Safari) Issues
```bash
# Install WebKit dependencies
sudo npx playwright install-deps webkit
```

### Permission Denied
```bash
# Make sure Python server can access files
chmod -R 755 .
```

---

## 📈 Performance

### Parallel Execution
```bash
# Run with 4 parallel workers (faster)
npx playwright test --workers=4

# Run serially (slower but more stable)
npx playwright test --workers=1
```

### Sharding (CI/CD)
```bash
# Split tests across 3 machines
npx playwright test --shard=1/3  # Machine 1
npx playwright test --shard=2/3  # Machine 2
npx playwright test --shard=3/3  # Machine 3
```

---

## 📝 Test Writing

### Generate Tests with Codegen
```bash
# Record interactions as test code
npm run codegen

# Or manually
npx playwright codegen http://localhost:8000/gst-calculator
```

### Example Test
```javascript
const { test, expect } = require('@playwright/test');

test('my new test', async ({ page }) => {
  await page.goto('/gst-calculator');
  await page.fill('#amount', '10000');
  await page.selectOption('#gstRateDropdown', '18');
  
  const total = await page.locator('#totalAmount').textContent();
  expect(total).toContain('11,800');
});
```

---

## 🎓 Best Practices

1. **Use Page Objects**: Organize selectors
2. **Wait for Elements**: Use `waitFor` methods
3. **Descriptive Names**: Clear test descriptions
4. **Independent Tests**: Each test should be self-contained
5. **Clean Up**: Reset state after tests
6. **Screenshots**: Take screenshots for debugging
7. **Retries**: Configure retries for flaky tests
8. **Timeouts**: Set appropriate timeouts

---

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)

---

## ✅ Quick Checklist

Before committing:
- [ ] All tests pass locally
- [ ] Tests run in headed mode successfully
- [ ] Mobile tests pass
- [ ] CI/CD configuration updated
- [ ] New tests added for new features
- [ ] Screenshots/videos work
- [ ] Server starts automatically
- [ ] No hardcoded waits (`page.waitForTimeout`)

---

**Need Help?** Check the detailed docs or run `npx playwright --help`

