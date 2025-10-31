# 🚀 Pre-Flight Check - Usage Guide

> Verify your setup before running GST Calculator tests

---

## 🎯 What is Pre-Flight Check?

The pre-flight check script (`preflight-check.js`) verifies that your environment is correctly set up before running Playwright tests. It helps you catch configuration issues early and provides helpful fix suggestions.

---

## ⚡ Quick Start

### Run Pre-Flight Check

```bash
# Method 1: Using npm script (recommended)
npm run preflight

# Method 2: Using npm check alias
npm run check

# Method 3: Direct execution
node preflight-check.js
```

---

## 📋 What Gets Checked

The script performs **7 comprehensive checks**:

### 1️⃣ Node.js Version
- ✅ Checks: Node.js >= 16.0.0
- ❌ Fix: Upgrade Node.js from [nodejs.org](https://nodejs.org/)

### 2️⃣ package.json Exists
- ✅ Checks: File exists and is valid JSON
- ❌ Fix: Run `npm init -y`

### 3️⃣ Playwright Installed
- ✅ Checks: @playwright/test in dependencies
- ❌ Fix: Run `npm install --save-dev @playwright/test`

### 4️⃣ Test File Exists
- ✅ Checks: gst-calculator.spec.js exists
- ❌ Fix: Create test file or check file name

### 5️⃣ Playwright Config (Optional)
- ✅ Checks: playwright.config.js exists
- ⚠️ Warning: Optional but recommended

### 6️⃣ HTML File Exists
- ✅ Checks: index.html exists
- ❌ Fix: Ensure HTML file is in the current directory

### 7️⃣ Local Server Running
- ✅ Checks: Server responding at http://localhost:8000
- ❌ Fix: Start server with `python3 -m http.server 8000`

---

## 📊 Example Output

### ✅ All Checks Passing

```
======================================================================
   🚀 GST CALCULATOR - PRE-FLIGHT CHECK
======================================================================

Verifying prerequisites before running Playwright tests...

1️⃣ Checking Node.js version...
   Current version: v18.17.0
   Required: >= 16.0.0
✅ Node.js version v18.17.0 is compatible

2️⃣ Checking package.json...
   Looking for: /path/to/package.json
✅ package.json found
   Project: gst-calculator-tests
   Version: 1.0.0

3️⃣ Checking Playwright installation...
✅ Playwright installed: @playwright/test@^1.40.0
   Node modules installed: ✓

4️⃣ Checking test file...
   Looking for: /path/to/gst-calculator.spec.js
✅ Test file found: gst-calculator.spec.js
   File size: 45.23 KB
   Estimated tests: 47

5️⃣ Checking Playwright config (optional)...
   Looking for: /path/to/playwright.config.js
✅ Config file found: playwright.config.js
   Config includes:
     - testDir ✓
     - timeout ✓
     - retries ✓
     - webServer ✓

6️⃣ Checking HTML file...
   Looking for: /path/to/index.html
✅ HTML file found: index.html
   File size: 178.45 KB
   Content verified: GST Calculator elements found ✓

7️⃣ Checking local server...
   Checking: http://localhost:8000
   Timeout: 3000ms
✅ Server is running at http://localhost:8000
   Status code: 200
   Response: OK ✓

======================================================================
📊 PRE-FLIGHT CHECK SUMMARY
======================================================================

✅ Passed:  7
❌ Failed:  0
⚠️  Warnings: 0
📈 Pass Rate: 100.0%

══════════════════════════════════════════════════════════════════
  ✅ ALL CRITICAL CHECKS PASSED - READY TO RUN TESTS!                
══════════════════════════════════════════════════════════════════

🚀 Next steps:
   1. Run tests:      npm test
   2. View report:    npm run report
   3. Debug mode:     npm run test:debug

======================================================================
```

---

### ❌ Some Checks Failing

```
======================================================================
   🚀 GST CALCULATOR - PRE-FLIGHT CHECK
======================================================================

1️⃣ Checking Node.js version...
   Current version: v14.17.0
   Required: >= 16.0.0
❌ Node.js version v14.17.0 is too old
❌ Please upgrade to Node.js 16 or higher
ℹ️  Download from: https://nodejs.org/

7️⃣ Checking local server...
   Checking: http://localhost:8000
   Timeout: 3000ms
❌ Connection refused - server not running
ℹ️  Start a local server on port 8000
     python3 -m http.server 8000

======================================================================
📊 PRE-FLIGHT CHECK SUMMARY
======================================================================

✅ Passed:  5
❌ Failed:  2
⚠️  Warnings: 0
📈 Pass Rate: 71.4%

══════════════════════════════════════════════════════════════════
  ❌ CRITICAL CHECKS FAILED - CANNOT RUN TESTS                        
══════════════════════════════════════════════════════════════════

🔧 Fix the errors above and run this check again:
   node preflight-check.js

======================================================================
```

---

## 🎨 Output Features

### Color Coding
- 🟢 **Green (✅)** - Check passed
- 🔴 **Red (❌)** - Check failed
- 🟡 **Yellow (⚠️)** - Warning
- 🔵 **Cyan (ℹ️)** - Information

### Exit Codes
- **0** - All critical checks passed (ready to test)
- **1** - One or more critical checks failed

---

## 🔧 Common Fixes

### Server Not Running

**Error:**
```
❌ Server not responding at http://localhost:8000
```

**Fix:**
```bash
# Start Python HTTP server
python3 -m http.server 8000

# Or Python 2
python -m SimpleHTTPServer 8000

# Or Node.js http-server
npx http-server -p 8000

# Or PHP
php -S localhost:8000
```

### Port Already in Use

**Check what's using port 8000:**
```bash
lsof -ti:8000
```

**Kill the process:**
```bash
lsof -ti:8000 | xargs kill -9
```

### Playwright Not Installed

**Error:**
```
❌ Playwright not found in dependencies
```

**Fix:**
```bash
npm install --save-dev @playwright/test
npm run install  # Install browsers
```

### Node.js Too Old

**Error:**
```
❌ Node.js version v14.17.0 is too old
```

**Fix:**
1. Download latest Node.js from [nodejs.org](https://nodejs.org/)
2. Or use nvm:
   ```bash
   nvm install 18
   nvm use 18
   ```

---

## 🚀 Integration with Testing Workflow

### Recommended Workflow

```bash
# Step 1: Run pre-flight check
npm run preflight

# Step 2: If all checks pass, run tests
npm test

# Step 3: View results
npm run report
```

### Automated CI/CD

Add to your CI pipeline:

```yaml
# .github/workflows/test.yml
- name: Pre-flight check
  run: npm run preflight

- name: Run tests
  run: npm test
```

---

## 📝 Advanced Usage

### Custom Configuration

Edit `preflight-check.js` to customize:

```javascript
const CONFIG = {
  minNodeVersion: 16,           // Minimum Node.js version
  testFile: 'gst-calculator.spec.js',  // Test file name
  htmlFile: 'index.html',        // HTML file name
  configFile: 'playwright.config.js',  // Config file name
  packageFile: 'package.json',   // Package file name
  serverUrl: 'http://localhost:8000',  // Server URL
  serverTimeout: 3000,           // Server timeout (ms)
};
```

### Programmatic Use

```javascript
const preflight = require('./preflight-check.js');

async function runChecks() {
  const nodeOk = preflight.checkNodeVersion();
  const packageOk = preflight.checkPackageJson();
  const serverOk = await preflight.checkLocalServer();
  
  if (nodeOk && packageOk && serverOk) {
    console.log('All checks passed!');
  }
}
```

---

## 🐛 Troubleshooting

### Check Hangs on Server Test

**Cause:** Server not responding, waiting for timeout

**Fix:** 
- Ensure server is running
- Check firewall settings
- Try a different port

### Permission Denied Errors

**Cause:** Insufficient file permissions

**Fix:**
```bash
chmod +x preflight-check.js
```

### Module Not Found

**Cause:** Running from wrong directory

**Fix:**
```bash
cd gst-calculator  # Navigate to correct directory
npm run preflight
```

---

## 📚 Related Documentation

- **TESTING-GUIDE.md** - Comprehensive testing guide
- **QUICK-REFERENCE.md** - Command cheat sheet
- **RUN-TESTS.md** - All test commands
- **README-TESTING.md** - Technical test details

---

## ✅ Best Practices

1. **Run pre-flight before every test session**
2. **Fix all critical errors before testing**
3. **Address warnings for optimal setup**
4. **Use in CI/CD pipelines**
5. **Keep Node.js and dependencies updated**

---

## 💡 Tips

- Run `npm run preflight` before `npm test`
- Add as a `pretest` script in package.json for automation
- Check logs if any test fails unexpectedly
- Keep server running in a separate terminal

---

## 📞 Support

**Need help?**
- Check: **TESTING-GUIDE.md** → "Common Issues"
- Run: `npm run help`
- Contact: QA team or project maintainer

---

**Happy Testing!** 🚀

*Pre-Flight Check v1.0.0 | ForgeAPIs GST Calculator*

