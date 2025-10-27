Write-Host "🧪 VA Calculator - Automated Test Suite" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Gray

# Check if Node.js is installed
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Node.js found: $(node --version)" -ForegroundColor Green

# Navigate to the project directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Check if dependencies are installed
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "📥 Installing Playwright browsers..." -ForegroundColor Yellow
    npx playwright install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Playwright browsers" -ForegroundColor Red
        exit 1
    }
}

# Create test results directory
if (!(Test-Path "test-results")) {
    New-Item -ItemType Directory -Path "test-results" | Out-Null
}

# Check if server is running on port 5500
$connection = Test-NetConnection -ComputerName localhost -Port 5500 -InformationLevel Quiet -WarningAction SilentlyContinue

if (!$connection) {
    Write-Host "⚠️  No server detected on port 5500" -ForegroundColor Yellow
    Write-Host "💡 Starting local server in background..." -ForegroundColor Cyan
    
    # Start server in background (requires npm serve package)
    $serverProcess = Start-Process -FilePath "npx" -ArgumentList "serve", "-p", "5500" -PassThru -WindowStyle Hidden
    
    # Wait for server to start
    Start-Sleep -Seconds 3
    
    Write-Host "✅ Server started on port 5500" -ForegroundColor Green
} else {
    Write-Host "✅ Server already running on port 5500" -ForegroundColor Green
}

# Run tests
Write-Host "`n🏃 Running all test suites...`n" -ForegroundColor Green

$testStartTime = Get-Date

# Run comprehensive test suite
npm run test:all

$testEndTime = Get-Date
$duration = ($testEndTime - $testStartTime).TotalSeconds

# Check test results
if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Tests completed successfully in $($duration.ToString('0.00')) seconds`n" -ForegroundColor Green
    
    # Open HTML report
    $reportPath = Join-Path $PWD "test-results\report.html"
    if (Test-Path $reportPath) {
        Write-Host "📊 Opening test report..." -ForegroundColor Cyan
        Start-Process $reportPath
    } else {
        Write-Host "⚠️  Report not found at: $reportPath" -ForegroundColor Yellow
    }
} else {
    Write-Host "`n❌ Tests failed! Please check the output above." -ForegroundColor Red
    exit 1
}

Write-Host "✨ All done!`n" -ForegroundColor Green

# Cleanup: Stop server if we started it
if ($serverProcess) {
    Write-Host "🛑 Stopping server..." -ForegroundColor Yellow
    Stop-Process -Id $serverProcess.Id -Force
}


