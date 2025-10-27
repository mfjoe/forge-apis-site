@echo off
echo.
echo ================================================================
echo   VA Calculator - Automated Test Suite
echo ================================================================
echo.

REM Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js found
node --version
echo.

REM Navigate to script directory
cd /d "%~dp0"

REM Check if dependencies are installed
if not exist "node_modules\" (
    echo [INFO] Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo.
    echo [INFO] Installing Playwright browsers...
    call npx playwright install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install Playwright browsers
        pause
        exit /b 1
    )
)

REM Create test results directory
if not exist "test-results\" mkdir test-results

echo.
echo ================================================================
echo   Running All Test Suites
echo ================================================================
echo.

REM Run tests
call npm run test:all

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [SUCCESS] Tests completed successfully!
    echo.
    echo Opening test report...
    start test-results\report.html
) else (
    echo.
    echo [ERROR] Tests failed!
    pause
    exit /b 1
)

echo.
echo ================================================================
echo   All Done!
echo ================================================================
echo.


