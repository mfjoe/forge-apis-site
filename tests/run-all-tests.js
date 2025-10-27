import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧪 VA Calculator - Comprehensive Test Suite\n');
console.log('='.repeat(60));

// Ensure test-results directory exists
const resultsDir = path.join(__dirname, '..', 'test-results');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

const testSuites = [
  { name: 'Calculations', file: 'calculations.spec.js', color: '🔢' },
  { name: 'Bilateral Factor', file: 'bilateral.spec.js', color: '🦾' },
  { name: 'Dependents', file: 'dependents.spec.js', color: '👨‍👩‍👧‍👦' },
  { name: 'UI Interactions', file: 'ui-interactions.spec.js', color: '🖱️' },
  { name: 'Mobile Layout', file: 'mobile.spec.js', color: '📱' },
];

const results = {
  suites: [],
  total: 0,
  passed: 0,
  failed: 0,
  duration: 0
};

const startTime = Date.now();

testSuites.forEach((suite, index) => {
  console.log(`\n[${index + 1}/${testSuites.length}] ${suite.color} Running ${suite.name} tests...`);
  
  const suiteStartTime = Date.now();
  
  try {
    const output = execSync(
      `npx playwright test tests/${suite.file} --reporter=json`,
      { encoding: 'utf-8', cwd: path.join(__dirname, '..'), stdio: 'pipe' }
    );
    
    const result = JSON.parse(output);
    const suiteDuration = ((Date.now() - suiteStartTime) / 1000).toFixed(2);
    
    const suiteResult = {
      name: suite.name,
      total: result.stats.expected,
      passed: result.stats.expected - result.stats.unexpected,
      failed: result.stats.unexpected,
      duration: suiteDuration,
      color: suite.color
    };
    
    results.suites.push(suiteResult);
    results.total += suiteResult.total;
    results.passed += suiteResult.passed;
    results.failed += suiteResult.failed;
    
    if (suiteResult.failed === 0) {
      console.log(`   ✅ ${suite.name}: ${suiteResult.passed}/${suiteResult.total} passed (${suiteDuration}s)`);
    } else {
      console.log(`   ⚠️  ${suite.name}: ${suiteResult.passed}/${suiteResult.total} passed, ${suiteResult.failed} failed (${suiteDuration}s)`);
    }
  } catch (error) {
    console.error(`   ❌ ${suite.name}: Failed to run - ${error.message}`);
    results.failed++;
  }
});

const endTime = Date.now();
results.duration = ((endTime - startTime) / 1000).toFixed(2);

console.log('\n' + '='.repeat(60));
console.log('📊 FINAL TEST RESULTS');
console.log('='.repeat(60));

results.suites.forEach(suite => {
  const status = suite.failed === 0 ? '✅' : '⚠️';
  console.log(`${status} ${suite.color} ${suite.name}: ${suite.passed}/${suite.total} passed (${suite.duration}s)`);
});

console.log('='.repeat(60));
console.log(`Total Tests:    ${results.total}`);
console.log(`✅ Passed:      ${results.passed}`);
console.log(`❌ Failed:      ${results.failed}`);
console.log(`⏱️  Duration:    ${results.duration}s`);
console.log(`📈 Success Rate: ${results.total > 0 ? ((results.passed / results.total) * 100).toFixed(1) : 0}%`);
console.log('='.repeat(60));

// Generate HTML report
const suiteRows = results.suites.map(suite => `
  <tr>
    <td>${suite.color}</td>
    <td><strong>${suite.name}</strong></td>
    <td>${suite.total}</td>
    <td class="passed">${suite.passed}</td>
    <td class="failed">${suite.failed}</td>
    <td>${suite.duration}s</td>
    <td>${suite.failed === 0 ? '✅' : '⚠️'}</td>
  </tr>
`).join('');

const htmlReport = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VA Calculator Test Results</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
      max-width: 1200px; 
      margin: 0 auto; 
      padding: 2rem;
      background: #f5f5f5;
    }
    .header { 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 2rem;
    }
    .header h1 { font-size: 2rem; margin-bottom: 0.5rem; }
    .header p { opacity: 0.9; }
    .summary { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
      gap: 1rem; 
      margin-bottom: 2rem;
    }
    .card { 
      background: white; 
      padding: 1.5rem; 
      border-radius: 8px; 
      text-align: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .card h2 { 
      margin: 0; 
      font-size: 2.5rem; 
      font-weight: 700;
    }
    .card p { 
      margin-top: 0.5rem;
      color: #666;
      font-weight: 600;
    }
    .passed { color: #10b981; }
    .failed { color: #ef4444; }
    .duration { color: #667eea; }
    .rate { color: #764ba2; }
    table {
      width: 100%;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    th {
      background: #f7fafc;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: #4a5568;
      border-bottom: 2px solid #e2e8f0;
    }
    td {
      padding: 1rem;
      border-bottom: 1px solid #e2e8f0;
    }
    tr:last-child td {
      border-bottom: none;
    }
    .footer {
      margin-top: 2rem;
      text-align: center;
      color: #666;
      font-size: 0.9rem;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🧪 VA Calculator Test Results</h1>
    <p>Comprehensive Test Suite Report</p>
  </div>
  
  <div class="summary">
    <div class="card">
      <h2>${results.total}</h2>
      <p>Total Tests</p>
    </div>
    <div class="card">
      <h2 class="passed">${results.passed}</h2>
      <p>Passed</p>
    </div>
    <div class="card">
      <h2 class="failed">${results.failed}</h2>
      <p>Failed</p>
    </div>
    <div class="card">
      <h2 class="duration">${results.duration}s</h2>
      <p>Duration</p>
    </div>
    <div class="card">
      <h2 class="rate">${results.total > 0 ? ((results.passed / results.total) * 100).toFixed(1) : 0}%</h2>
      <p>Success Rate</p>
    </div>
  </div>
  
  <table>
    <thead>
      <tr>
        <th></th>
        <th>Test Suite</th>
        <th>Total</th>
        <th>Passed</th>
        <th>Failed</th>
        <th>Duration</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${suiteRows}
    </tbody>
  </table>
  
  <div class="footer">
    <p>Generated: ${new Date().toLocaleString()}</p>
    <p>Run all tests with: <code>node tests/run-all-tests.js</code></p>
  </div>
</body>
</html>
`;

fs.writeFileSync(path.join(resultsDir, 'report.html'), htmlReport);
console.log('\n📄 HTML report generated: test-results/report.html');
console.log('   Open in browser: file://' + path.join(resultsDir, 'report.html') + '\n');

process.exit(results.failed > 0 ? 1 : 0);

