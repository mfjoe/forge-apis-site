# VA Calculator - PowerShell Test Runner

This PowerShell script automates the entire test process for the VA Calculator.

## Features

- ✅ **Checks Node.js installation** - Verifies Node.js is available
- 📦 **Auto-installs dependencies** - Installs npm packages if needed
- 🚀 **Auto-starts server** - Launches local server on port 5500 if not running
- 🏃 **Runs all test suites** - Executes comprehensive test suite
- 📊 **Opens HTML report** - Automatically opens test results in browser
- 🛑 **Auto-cleanup** - Stops background server when done

## Usage

### From the project root directory:

```powershell
.\run-tests.ps1
```

### Or from anywhere:

```powershell
cd ForgeApis\forge-apis-site
.\run-tests.ps1
```

## What It Does

1. **Checks Prerequisites**
   - Verifies Node.js is installed
   - Shows Node.js version

2. **Installs Dependencies** (if needed)
   - Runs `npm install` if node_modules doesn't exist
   - Installs Playwright browsers

3. **Ensures Server is Running**
   - Checks if server is running on port 5500
   - Starts server automatically if needed

4. **Runs All Test Suites**
   - Executes `npm run test:all`
   - Shows progress and results

5. **Displays Results**
   - Shows total duration
   - Opens HTML report in browser
   - Indicates success or failure

6. **Cleanup**
   - Stops background server process
   - Returns to normal state

## Example Output

```
🧪 VA Calculator - Automated Test Suite
============================================================
✅ Node.js found: v18.17.0
✅ Server already running on port 5500

🏃 Running all test suites...

[1/5] 🔢 Running Calculations tests...
   ✅ Calculations: 10/10 passed (3.45s)
...

============================================================
📊 FINAL TEST RESULTS
============================================================
Total Tests:    59
✅ Passed:      59
❌ Failed:      0
⏱️  Duration:    21.02s
📈 Success Rate: 100.0%
============================================================

✅ Tests completed successfully in 21.02 seconds

📊 Opening test report...
✨ All done!
```

## Requirements

- **Node.js** - v14 or higher
- **PowerShell** - Windows PowerShell or PowerShell Core
- **npm** - Comes with Node.js
- **Internet Connection** - For downloading Playwright browsers

## Troubleshooting

### "Node.js is not installed"
Install Node.js from https://nodejs.org/

### "Script execution is disabled"
Run PowerShell as Administrator and execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### "Port 5500 is already in use"
Stop any process using port 5500, or manually start a server on that port before running the script.

### "Tests fail"
Make sure:
1. Your VA calculator is working properly
2. Server is accessible at http://localhost:5500
3. All dependencies are installed

## Manual Server Start

If you prefer to start the server manually:

```powershell
cd ForgeApis\forge-apis-site
npx serve -p 5500
```

Then in another terminal:
```powershell
npm run test:all
```

## Alternative Commands

If you prefer not to use the PowerShell script:

```powershell
# Run all tests
npm run test:all

# Run individual suites
npm run test:calculations
npm run test:bilateral
npm run test:dependents
npm run test:ui
npm run test:mobile

# View report
npm run test:report
```

## CI/CD Integration

The script is designed to work with CI/CD pipelines. Simply call it from your build scripts:

```yaml
# GitHub Actions example
- name: Run Tests
  run: pwsh .\run-tests.ps1
```

The script will exit with code 0 on success, or 1 on failure, making it suitable for automated builds.


