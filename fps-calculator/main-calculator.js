/**
 * Main Calculator - Orchestrates all components and handles complete calculation flow
 */

// Store current configuration and results
let currentConfig = null;
let currentResults = null;

/**
 * Get selected GPU from autocomplete
 */
function getSelectedGPU() {
  const gpuInput = document.getElementById('gpu-input') || document.getElementById('gpu');
  const gpuValue = gpuInput ? gpuInput.value : '';
  
  if (!gpuValue) return null;
  
  // Find GPU in database
  const gpuKey = Object.keys(performanceDatabase.gpus || {}).find(key => {
    const gpu = performanceDatabase.gpus[key];
    return gpu.name.toLowerCase().includes(gpuValue.toLowerCase()) ||
           gpuValue.toLowerCase().includes(gpu.name.toLowerCase());
  });
  
  if (gpuKey) {
    return performanceDatabase.gpus[gpuKey];
  }
  
  // Return basic object if not found
  return { name: gpuValue, performanceScore: 50, tier: 'mid-range' };
}

/**
 * Get selected CPU from autocomplete
 */
function getSelectedCPU() {
  const cpuInput = document.getElementById('cpu-input') || document.getElementById('cpu');
  const cpuValue = cpuInput ? cpuInput.value : '';
  
  if (!cpuValue) return null;
  
  // Find CPU in database
  const cpuKey = Object.keys(performanceDatabase.cpus || {}).find(key => {
    const cpu = performanceDatabase.cpus[key];
    return cpu.name.toLowerCase().includes(cpuValue.toLowerCase()) ||
           cpuValue.toLowerCase().includes(cpu.name.toLowerCase());
  });
  
  if (cpuKey) {
    return performanceDatabase.cpus[cpuKey];
  }
  
  // Return basic object if not found
  return { name: cpuValue, gamingScore: 70, tier: 'mid-range' };
}

/**
 * Get selected Game from autocomplete
 */
function getSelectedGame() {
  const gameInput = document.getElementById('game-input') || document.getElementById('game');
  const gameValue = gameInput ? gameInput.value : '';
  
  if (!gameValue) return null;
  
  // Find game in database (games is an array of strings)
  const games = performanceDatabase.games || [];
  const gameName = games.find(game => {
    const gameLower = game.toLowerCase();
    const valueLower = gameValue.toLowerCase();
    return gameLower.includes(valueLower) || valueLower.includes(gameLower);
  });
  
  if (gameName) {
    // Return game object with name and type
    const gameType = gameName.includes('Valorant') || gameName.includes('CS2') || gameName.includes('Fortnite') ? 'competitive' : 
                     gameName.includes('Cyberpunk') || gameName.includes('Warzone') ? 'aaa' : 'aaa';
    return { name: gameName, type: gameType };
  }
  
  // Return basic object if not found
  return { name: gameValue, type: 'aaa' };
}

/**
 * Validate inputs
 */
function validateInputs(config) {
  if (!config.gpu || !config.gpu.name) {
    showError('Please select a GPU');
    return false;
  }
  
  if (!config.cpu || !config.cpu.name) {
    showError('Please select a CPU');
    return false;
  }
  
  if (!config.game || !config.game.name) {
    showError('Please select a game');
    return false;
  }
  
  if (!config.resolution) {
    showError('Please select a resolution');
    return false;
  }
  
  if (!config.settings) {
    showError('Please select graphics settings');
    return false;
  }
  
  if (!config.ram || config.ram === '') {
    showError('Please select RAM amount');
    return false;
  }
  
  return true;
}

/**
 * Estimate GPU usage percentage
 */
function estimateGPUUsage(gpu, game, resolution, settings) {
  if (!gpu || !game) return 85; // Default
  
  const gpuTier = gpu.tier || 'mid-range';
  const gameType = game.type || 'aaa';
  const res = resolution || '1440p';
  const set = settings || 'high';
  
  // Budget GPU on demanding game = 99% usage
  if (gpuTier === 'budget' && (gameType === 'aaa' || res === '4k')) {
    return 99;
  }
  
  // High-end GPU on competitive game at 1080p = CPU-bound, GPU at 60-70%
  if (gpuTier === 'ultra-high-end' && gameType === 'competitive' && res === '1080p') {
    return 65;
  }
  
  // Ultra settings = more GPU usage
  if (set === 'ultra' && res === '4k') {
    return 98;
  }
  
  // High settings at 1440p = balanced
  if (set === 'high' && res === '1440p') {
    return 85;
  }
  
  // Medium settings = less GPU usage
  if (set === 'medium' || set === 'low') {
    return 75;
  }
  
  // Default balanced usage
  return 90;
}

/**
 * Get FPS context message
 */
function getFPSContext(averageFPS) {
  if (averageFPS >= 240) {
    return `<p>⚡ <strong>Excellent for competitive gaming!</strong> You can play at 240Hz+ with smooth performance.</p>`;
  }
  
  if (averageFPS >= 144) {
    return `<p>✓ <strong>Great for high refresh rate gaming!</strong> Perfect for 144Hz monitors.</p>`;
  }
  
  if (averageFPS >= 60) {
    return `<p>✓ <strong>Solid gaming performance.</strong> Smooth gameplay at 60+ FPS.</p>`;
  }
  
  if (averageFPS >= 30) {
    return `<p>⚠️ <strong>Playable but not optimal.</strong> Consider lowering settings for better performance.</p>`;
  }
  
  return `<p>❌ <strong>Below optimal performance.</strong> Significant upgrades or lower settings recommended.</p>`;
}

/**
 * Display FPS results
 */
function displayFPSResults(fpsResult, config) {
  console.log('displayFPSResults called with:', { fpsResult, config });
  const fpsResultsEl = document.getElementById('fps-results');
  if (!fpsResultsEl) {
    console.error('fps-results element not found!');
    return;
  }
  console.log('fps-results element found, displaying results');
  
  const resultsHTML = `
    <div class="result-card">
      <h3>⚡ Expected FPS Range</h3>
      <div class="fps-main-result">
        <h3>${fpsResult.display}</h3>
        <div class="confidence-badge" style="display: inline-block; padding: 8px 16px; background: var(--light-gray); border-radius: 20px; margin-top: 12px; font-weight: 600; font-size: 14px; color: var(--dark);">
          ${fpsResult.confidence || 'High'} Confidence (±${fpsResult.uncertainty || '10'}%)
        </div>
      </div>
      <div class="fps-range" id="fps-range" style="display: none;">${fpsResult.display}</div>
    </div>
    
    <div class="result-card">
      <h3>📋 Configuration</h3>
      <div class="config-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-top: 16px;">
        <div class="config-item">
          <span class="config-label">Game:</span>
          <strong>${config.game.name || config.game}</strong>
        </div>
        <div class="config-item">
          <span class="config-label">Resolution:</span>
          <strong>${config.resolution}</strong>
        </div>
        <div class="config-item">
          <span class="config-label">Settings:</span>
          <strong>${config.settings.charAt(0).toUpperCase() + config.settings.slice(1)}</strong>
        </div>
        <div class="config-item">
          <span class="config-label">GPU:</span>
          <strong>${config.gpu.name || config.gpu}</strong>
        </div>
        <div class="config-item">
          <span class="config-label">CPU:</span>
          <strong>${config.cpu.name || config.cpu}</strong>
        </div>
        <div class="config-item">
          <span class="config-label">RAM:</span>
          <strong>${config.ram}GB</strong>
        </div>
      </div>
    </div>
    
    <div class="result-card">
      <h3>📊 Performance Context</h3>
      <div class="fps-context">
        ${getFPSContext(fpsResult.average)}
      </div>
    </div>
  `;
  
  fpsResultsEl.innerHTML = resultsHTML;
  fpsResultsEl.style.display = 'block';
  fpsResultsEl.removeAttribute('hidden');
  console.log('FPS results displayed, element visibility:', fpsResultsEl.style.display);
}

/**
 * Display performance across games
 */
function displayPerformanceAcrossGames(config) {
  // Games is an array, not an object
  const gameNames = performanceDatabase.games || [];
  const currentGameName = config.game?.name || config.game || '';
  
  const gameComparisons = gameNames
    .filter(gameName => gameName !== currentGameName)
    .slice(0, 5) // Limit to 5 games
    .map(gameName => {
      try {
        const gpuName = config.gpu?.name || config.gpu || '';
        const cpuName = config.cpu?.name || config.cpu || '';
        const fps = calculateFPS(gpuName, cpuName, parseInt(config.ram), 
                                 config.resolution, gameName, config.settings);
        if (fps) {
          return { game: gameName, fps: fps.display, icon: '🎮' };
        }
      } catch (e) {
        console.error('Error calculating FPS for', gameName, e);
      }
      return null;
    })
    .filter(item => item !== null);
  
  if (gameComparisons.length === 0) return;
  
  const comparisonEl = document.getElementById('game-comparison');
  if (!comparisonEl) return;
  
  const comparisonHTML = `
    <div class="result-card">
      <h3>🎮 Performance in Other Games</h3>
      <div class="comparison-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-top: 16px;">
        ${gameComparisons.map(item => `
          <div class="comparison-card" style="padding: 16px; background: var(--light-gray); border-radius: 8px;">
            <div style="font-size: 24px; margin-bottom: 8px;">${item.icon}</div>
            <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px; color: var(--dark);">${item.game}</div>
            <div style="font-size: 18px; font-weight: 700; color: var(--primary);">${item.fps}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  comparisonEl.innerHTML = comparisonHTML;
  comparisonEl.style.display = 'block';
}

/**
 * Get settings optimization recommendations
 */
function getSettingsOptimizations(config, currentFPS) {
  const tips = [];
  
  if (currentFPS < 60) {
    if (config.resolution !== '1080p') {
      tips.push({
        action: 'Lower resolution to 1080p',
        expectedGain: '+40-60% FPS',
        impact: 'High'
      });
    }
    
    if (config.settings === 'ultra') {
      tips.push({
        action: 'Switch settings from Ultra to High',
        expectedGain: '+20-30% FPS',
        impact: 'Medium'
      });
    }
    
    tips.push({
      action: 'Disable ray tracing (if enabled)',
      expectedGain: '+40-50% FPS',
      impact: 'High (if RT enabled)'
    });
  }
  
  if (currentFPS < 144 && currentFPS >= 60) {
    if (config.settings === 'ultra') {
      tips.push({
        action: 'Lower shadow quality to Medium',
        expectedGain: '+15-20% FPS',
        impact: 'Low visual impact'
      });
    }
    
    if (config.resolution === '4k') {
      tips.push({
        action: 'Lower resolution to 1440p',
        expectedGain: '+50-70% FPS',
        impact: 'High'
      });
    }
  }
  
  // Check for DLSS/FSR support
  if (config.gpu.name && config.gpu.name.includes('RTX') && config.resolution !== '1080p') {
    tips.push({
      action: 'Enable DLSS Quality mode',
      expectedGain: '+30-40% FPS',
      impact: 'Minimal visual quality loss'
    });
  }
  
  if (config.gpu.name && config.gpu.name.includes('RX') && config.resolution !== '1080p') {
    tips.push({
      action: 'Enable FSR Quality mode',
      expectedGain: '+30-40% FPS',
      impact: 'Minimal visual quality loss'
    });
  }
  
  return tips;
}

/**
 * Display optimization tips
 */
function displayOptimizationTips(fpsResult, bottleneckResult, latencyResult, config) {
  const settingsTips = getSettingsOptimizations(config, fpsResult.average);
  const optimizationEl = document.getElementById('optimization-tips');
  
  if (!optimizationEl) return;
  
  if (settingsTips.length === 0 && !bottleneckResult && !latencyResult) {
    optimizationEl.style.display = 'none';
    return;
  }
  
  let tipsHTML = '<div class="result-card"><h3>💡 How to Improve Performance</h3>';
  
  if (settingsTips.length > 0) {
    tipsHTML += `
      <div style="margin-top: 16px;">
        <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 12px; color: var(--dark);">Settings Optimizations</h4>
        <div class="tips-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 12px;">
          ${settingsTips.map(tip => `
            <div style="padding: 12px; background: var(--light-gray); border-radius: 8px; border-left: 3px solid var(--primary);">
              <div style="font-weight: 600; font-size: 13px; margin-bottom: 4px; color: var(--dark);">${tip.action}</div>
              <div style="font-size: 12px; color: var(--success); font-weight: 600; margin-bottom: 2px;">${tip.expectedGain}</div>
              <div style="font-size: 11px; color: var(--gray);">${tip.impact}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  tipsHTML += '</div>';
  optimizationEl.innerHTML = tipsHTML;
  optimizationEl.style.display = 'block';
}

/**
 * Show error message
 */
function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.style.cssText = `
    padding: 16px;
    background: #fee;
    border: 2px solid #fcc;
    border-radius: 8px;
    color: #c33;
    font-weight: 600;
    margin-bottom: 16px;
    animation: slideDown 0.3s ease-out;
  `;
  errorDiv.innerHTML = `⚠️ ${message}`;
  
  const form = document.getElementById('fps-calculator-form');
  if (form) {
    form.insertBefore(errorDiv, form.firstChild);
    
    setTimeout(() => {
      errorDiv.style.opacity = '0';
      setTimeout(() => errorDiv.remove(), 300);
    }, 4000);
  }
}

/**
 * Show success message
 */
function showSuccess(message) {
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.style.cssText = `
    padding: 16px;
    background: #efe;
    border: 2px solid #cfc;
    border-radius: 8px;
    color: #3c3;
    font-weight: 600;
    margin-bottom: 16px;
    animation: slideDown 0.3s ease-out;
  `;
  successDiv.innerHTML = `✓ ${message}`;
  
  const form = document.getElementById('fps-calculator-form');
  if (form) {
    form.insertBefore(successDiv, form.firstChild);
    
    setTimeout(() => {
      successDiv.style.opacity = '0';
      setTimeout(() => successDiv.remove(), 300);
    }, 3000);
  }
}

/**
 * Generate shareable link
 */
function generateShareableLink(config, results) {
  if (!config || !results) return window.location.href;
  
  const params = new URLSearchParams({
    gpu: config.gpu.name || config.gpu,
    cpu: config.cpu.name || config.cpu,
    game: config.game.name || config.game,
    res: config.resolution,
    settings: config.settings,
    ram: config.ram,
    fps: results.fpsResult ? results.fpsResult.average : 0
  });
  
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
}

/**
 * Copy results link to clipboard
 */
function copyResultsLink() {
  if (!currentConfig || !currentResults) {
    showError('No results to share');
    return;
  }
  
  const shareUrl = generateShareableLink(currentConfig, currentResults);
  
  navigator.clipboard.writeText(shareUrl).then(() => {
    showSuccess('Link copied to clipboard!');
  }).catch(() => {
    showError('Failed to copy link');
  });
}

/**
 * Reset calculator
 */
function resetCalculator() {
  // Clear all inputs
  const inputs = document.querySelectorAll('#fps-calculator-form input[type="text"], #fps-calculator-form input[type="number"]');
  inputs.forEach(input => {
    input.value = '';
  });
  
  // Reset dropdowns to defaults
  const ramSelect = document.getElementById('ram-select') || document.getElementById('ram');
  if (ramSelect) ramSelect.value = '16';
  
  const resolutionSelect = document.getElementById('resolution-select') || document.getElementById('resolution');
  if (resolutionSelect) resolutionSelect.value = '1080p';
  
  const settingsSelect = document.getElementById('settings-select') || document.getElementById('graphics-settings');
  if (settingsSelect) settingsSelect.value = 'high';
  
  // Reset checkboxes
  const gamingMonitor = document.getElementById('is-gaming-monitor');
  if (gamingMonitor) gamingMonitor.checked = true;
  
  const lowLatencyMode = document.getElementById('low-latency-mode');
  if (lowLatencyMode) lowLatencyMode.checked = false;
  
  // Hide results
  const resultsContainer = document.getElementById('results-container') || document.getElementById('results-section');
  if (resultsContainer) {
    resultsContainer.style.display = 'none';
  }
  
  // Clear stored data
  currentConfig = null;
  currentResults = null;
  
  // Scroll back to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  showSuccess('Calculator reset');
}

/**
 * Load configuration from URL parameters
 */
function loadConfigFromURL() {
  const params = new URLSearchParams(window.location.search);
  
  if (params.has('gpu')) {
    const gpuInput = document.getElementById('gpu-input') || document.getElementById('gpu');
    if (gpuInput) gpuInput.value = params.get('gpu');
  }
  
  if (params.has('cpu')) {
    const cpuInput = document.getElementById('cpu-input') || document.getElementById('cpu');
    if (cpuInput) cpuInput.value = params.get('cpu');
  }
  
  if (params.has('game')) {
    const gameInput = document.getElementById('game-input') || document.getElementById('game');
    if (gameInput) gameInput.value = params.get('game');
  }
  
  if (params.has('res')) {
    const resolutionSelect = document.getElementById('resolution-select') || document.getElementById('resolution');
    if (resolutionSelect) resolutionSelect.value = params.get('res');
  }
  
  if (params.has('settings')) {
    const settingsSelect = document.getElementById('settings-select') || document.getElementById('graphics-settings');
    if (settingsSelect) settingsSelect.value = params.get('settings');
  }
  
  if (params.has('ram')) {
    const ramSelect = document.getElementById('ram-select') || document.getElementById('ram');
    if (ramSelect) ramSelect.value = params.get('ram');
  }
  
  // Auto-calculate if all parameters are present
  if (params.has('gpu') && params.has('cpu') && params.has('game')) {
    setTimeout(() => {
      const calculateBtn = document.getElementById('calculate-btn');
      if (calculateBtn) {
        calculateBtn.click();
      }
    }, 500);
  }
}

/**
 * Main calculation function
 */
function performCompleteCalculation() {
  // Get all user inputs
  const ramSelect = document.getElementById('ram-select') || document.getElementById('ram');
  const resolutionSelect = document.getElementById('resolution-select') || document.getElementById('resolution');
  const settingsSelect = document.getElementById('settings-select') || document.getElementById('graphics-settings');
  
  const config = {
    gpu: getSelectedGPU(),
    cpu: getSelectedCPU(),
    ram: ramSelect ? ramSelect.value : null,
    resolution: resolutionSelect ? resolutionSelect.value : null,
    game: getSelectedGame(),
    settings: settingsSelect ? settingsSelect.value : null,
    
    // Latency-specific inputs
    mousePollingRate: document.getElementById('mouse-polling-rate') ? parseInt(document.getElementById('mouse-polling-rate').value) || 1000 : 1000,
    refreshRate: document.getElementById('monitor-refresh-rate') ? parseInt(document.getElementById('monitor-refresh-rate').value) || 144 : 144,
    panelType: document.getElementById('panel-type') ? document.getElementById('panel-type').value || 'IPS' : 'IPS',
    networkPing: document.getElementById('network-ping') ? parseInt(document.getElementById('network-ping').value) || 0 : 0,
    reflexEnabled: document.getElementById('low-latency-mode') ? document.getElementById('low-latency-mode').checked : false,
    gamingMonitor: document.getElementById('is-gaming-monitor') ? document.getElementById('is-gaming-monitor').checked : true
  };
  
  // Validate inputs
  if (!validateInputs(config)) {
    return;
  }
  
  // Store config
  currentConfig = config;
  
  try {
    // Debug: Log config
    console.log('Calculation config:', config);
    
    // Get GPU and CPU names as strings
    const gpuName = config.gpu?.name || config.gpu || '';
    const cpuName = config.cpu?.name || config.cpu || '';
    const gameName = config.game?.name || config.game || '';
    
    console.log('Resolved names:', { gpuName, cpuName, gameName, ram: config.ram, resolution: config.resolution, settings: config.settings });
    
    // Perform all calculations
    const fpsResult = calculateFPS(gpuName, cpuName, parseInt(config.ram), config.resolution, gameName, config.settings);
    
    console.log('FPS Result:', fpsResult);
    
    if (!fpsResult) {
      console.error('calculateFPS returned null');
      showError('Unable to calculate FPS. Please check your inputs.');
      return;
    }
    
    // Get CPU and GPU objects from database
    const cpuObj = config.cpu;
    const gpuObj = config.gpu;
    
    // Estimate GPU usage
    const estimatedGPUUsage = estimateGPUUsage(gpuObj, config.game, config.resolution, config.settings);
    
    // Analyze bottleneck
    let bottleneckResult = null;
    try {
      bottleneckResult = analyzeBottleneck(cpuObj, gpuObj, parseInt(config.ram), 
                                                  config.resolution, config.game.name || config.game, fpsResult);
      console.log('Bottleneck result:', bottleneckResult);
    } catch (error) {
      console.error('Error analyzing bottleneck:', error);
      bottleneckResult = { bottleneck: 'NONE', severity: 'OPTIMAL', percentage: 0 };
    }
    
    // Calculate system latency
    const latencyConfig = {
      ...config,
      currentFPS: fpsResult.average,
      gpuUsage: estimatedGPUUsage,
      cpuTier: cpuObj.tier || 'mid-range'
    };
    
    let latencyResult = null;
    try {
      latencyResult = calculateSystemLatency(latencyConfig);
      console.log('Latency result:', latencyResult);
      
      // Ensure components object exists
      if (!latencyResult.components) {
        console.warn('Latency result missing components, adding defaults');
        latencyResult.components = {
          inputSampling: 2.0,
          cpuSimulation: 6.0,
          renderQueue: 0,
          gpuRender: 1000 / fpsResult.average,
          displayProcessing: 2.0,
          scanoutAverage: (1000 / latencyConfig.refreshRate) / 2,
          pixelResponse: 3.0
        };
      }
    } catch (error) {
      console.error('Error calculating latency:', error);
      latencyResult = { 
        total: 50, 
        rating: 'GOOD', 
        breakdown: { mouse: 1, pc: 30, display: 15, network: 4 },
        components: {
          inputSampling: 2.0,
          cpuSimulation: 6.0,
          renderQueue: 0,
          gpuRender: 1000 / fpsResult.average,
          displayProcessing: 2.0,
          scanoutAverage: 3.47,
          pixelResponse: 3.0
        },
        uncertainty: 5.0,
        recommendation: 'Latency calculation encountered an error, showing estimate.'
      };
    }
    
    // Get upgrade recommendations (use fps-database version)
    let recommendations = [];
    try {
      recommendations = getUpgradeRecommendations(
        gpuName, cpuName, parseInt(config.ram), 
        config.resolution, gameName, config.settings,
        fpsResult, bottleneckResult
      );
      console.log('Recommendations:', recommendations);
    } catch (error) {
      console.error('Error getting recommendations:', error);
    }
    
    // Get latency optimizations
    let latencyOptimizations = [];
    try {
      latencyOptimizations = getLatencyOptimizations(latencyResult, latencyConfig);
      console.log('Latency optimizations:', latencyOptimizations);
    } catch (error) {
      console.error('Error getting latency optimizations:', error);
    }
    
        // Store results
        currentResults = {
          fpsResult,
          bottleneckResult,
          latencyResult,
          recommendations,
          latencyOptimizations
        };
        
        // Save results to localStorage
        saveResultsToLocalStorage(config, currentResults);
        
        // Display all results
        displayResults(fpsResult, bottleneckResult, latencyResult, config, recommendations, latencyOptimizations);
        
        // Update timestamp
        const timestampEl = document.getElementById('calc-timestamp');
        if (timestampEl) {
          timestampEl.textContent = new Date().toLocaleString();
        }
        
        showSuccess('Calculation complete!');
    
  } catch (error) {
    console.error('Calculation error:', error);
    showError('An error occurred during calculation. Please try again.');
  }
}

/**
 * Display all results
 */
function displayResults(fpsResult, bottleneckResult, latencyResult, config, recommendations, latencyOptimizations) {
  console.log('displayResults called with:', { fpsResult, bottleneckResult, latencyResult, config });
  
  // Show results container
  const resultsContainer = document.getElementById('results-container') || document.getElementById('results-section');
  console.log('Results container found:', resultsContainer);
  
  if (resultsContainer) {
    console.log('Setting results container to visible');
    resultsContainer.style.display = 'block';
    resultsContainer.classList.add('active');
    
    // Force visibility
    resultsContainer.removeAttribute('hidden');
    
    // Scroll to results smoothly
    setTimeout(() => {
      resultsContainer.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  } else {
    console.error('Results container not found!');
  }
  
  // Display FPS results (using existing function)
  displayFPSResults(fpsResult, config);
  
  // Display bottleneck analysis (using existing function if available)
  if (bottleneckResult && typeof updateBottleneckVisualization === 'function') {
    updateBottleneckVisualization(bottleneckResult);
  }
  
  // Display latency breakdown (using existing function if available)
  if (latencyResult && typeof updateLatencyVisualization === 'function') {
    updateLatencyVisualization(latencyResult, latencyOptimizations);
  }
  
  // Display performance across games
  displayPerformanceAcrossGames(config);
  
  // Display optimization tips
  displayOptimizationTips(fpsResult, bottleneckResult, latencyResult, config);
}

// Prevent double-tap zoom on buttons
function preventDoubleTapZoom() {
  const buttons = document.querySelectorAll('button, .btn');
  buttons.forEach(button => {
    button.addEventListener('touchstart', function(e) {
      const now = Date.now();
      const lastTouch = parseInt(this.getAttribute('data-last-touch') || '0');
      if (now - lastTouch < 300) {
        e.preventDefault();
      }
      this.setAttribute('data-last-touch', now.toString());
    });
  });
}

// Smooth scroll for mobile results
function scrollToResults() {
  const resultsContainer = document.getElementById('results-container') || document.getElementById('results-section');
  if (!resultsContainer) return;
  
  const nav = document.querySelector('nav');
  const navHeight = nav ? nav.offsetHeight : 0;
  const targetPosition = resultsContainer.offsetTop - navHeight - 20;
  
  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });
}

// Network error handling
window.addEventListener('offline', () => {
  showNotification('You are offline. The calculator works offline!', 'info');
});

window.addEventListener('online', () => {
  showNotification('Back online', 'success');
});

// Browser compatibility check
function checkBrowserCompatibility() {
  const isCompatible = 
    'querySelector' in document &&
    'addEventListener' in window &&
    'localStorage' in window;
  
  if (!isCompatible) {
    showError('Your browser is not supported. Please use a modern browser.');
    return false;
  }
  return true;
}

// Notification system
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()">×</button>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// Form validation with visual feedback
function validateForm() {
  let isValid = true;
  const requiredFields = [
    { id: 'gpu-input', name: 'GPU', fallback: 'gpu' },
    { id: 'cpu-input', name: 'CPU', fallback: 'cpu' },
    { id: 'game-input', name: 'Game', fallback: 'game' }
  ];
  
  requiredFields.forEach(field => {
    const input = document.getElementById(field.id) || document.getElementById(field.fallback);
    if (!input) return;
    
    const value = input.value.trim();
    
    if (!value) {
      isValid = false;
      showFieldError(input, `${field.name} is required`);
    } else {
      clearFieldError(input);
    }
  });
  
  return isValid;
}

function showFieldError(input, message) {
  input.classList.add('error');
  
  let errorElement = input.nextElementSibling;
  if (!errorElement || !errorElement.classList.contains('error-message')) {
    errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    input.parentNode.insertBefore(errorElement, input.nextSibling);
  }
  
  errorElement.textContent = message;
}

function clearFieldError(input) {
  input.classList.remove('error');
  const errorElement = input.nextElementSibling;
  if (errorElement && errorElement.classList.contains('error-message')) {
    errorElement.remove();
  }
}

// Save/share results functionality
function saveResultsToLocalStorage(config, results) {
  const savedResults = {
    timestamp: new Date().toISOString(),
    config: config,
    results: results
  };
  
  try {
    localStorage.setItem('fps-calculator-last-result', JSON.stringify(savedResults));
    
    // Keep history of last 5 calculations
    let history = JSON.parse(localStorage.getItem('fps-calculator-history') || '[]');
    history.unshift(savedResults);
    history = history.slice(0, 5); // Keep only last 5
    localStorage.setItem('fps-calculator-history', JSON.stringify(history));
  } catch (e) {
    console.warn('Could not save to localStorage:', e);
  }
}

function loadLastResults() {
  try {
    const saved = localStorage.getItem('fps-calculator-last-result');
    if (saved) {
      const data = JSON.parse(saved);
      showLoadLastButton(data);
    }
  } catch (e) {
    console.warn('Could not load from localStorage:', e);
  }
}

function showLoadLastButton(data) {
  const form = document.getElementById('fps-calculator-form');
  if (!form) return;
  
  // Check if button already exists
  if (document.getElementById('load-last-btn')) return;
  
  const button = document.createElement('button');
  button.id = 'load-last-btn';
  button.type = 'button';
  button.className = 'btn btn-secondary';
  button.innerHTML = '🔄 Load Last Calculation';
  button.style.marginBottom = '20px';
  button.style.width = '100%';
  
  button.addEventListener('click', () => {
    // Populate form with saved data
    const gpuInput = document.getElementById('gpu-input') || document.getElementById('gpu');
    const cpuInput = document.getElementById('cpu-input') || document.getElementById('cpu');
    const gameInput = document.getElementById('game-input') || document.getElementById('game');
    
    if (gpuInput && data.config.gpu) {
      gpuInput.value = data.config.gpu.name || data.config.gpu;
    }
    if (cpuInput && data.config.cpu) {
      cpuInput.value = data.config.cpu.name || data.config.cpu;
    }
    if (gameInput && data.config.game) {
      gameInput.value = data.config.game.name || data.config.game;
    }
    
    // Populate other fields
    if (data.config.ram) {
      const ramSelect = document.getElementById('ram-select') || document.getElementById('ram');
      if (ramSelect) ramSelect.value = data.config.ram;
    }
    if (data.config.resolution) {
      const resolutionSelect = document.getElementById('resolution-select') || document.getElementById('resolution');
      if (resolutionSelect) resolutionSelect.value = data.config.resolution;
    }
    if (data.config.settings) {
      const settingsSelect = document.getElementById('settings-select') || document.getElementById('graphics-settings');
      if (settingsSelect) settingsSelect.value = data.config.settings;
    }
    
    // Show saved results
    if (data.results) {
      displayResults(data.results.fpsResult, data.results.bottleneckResult, 
                    data.results.latencyResult, data.config, 
                    data.results.recommendations, data.results.latencyOptimizations);
    }
    
    showNotification('Previous calculation loaded', 'success');
  });
  
  form.insertBefore(button, form.firstChild);
}

// Performance monitoring
window.addEventListener('load', () => {
  if ('performance' in window && 'timing' in window.performance) {
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    console.log(`Page loaded in ${loadTime}ms`);
    
    // Send to analytics if load time is slow
    if (loadTime > 3000 && typeof gtag !== 'undefined') {
      gtag('event', 'slow_page_load', {
        'load_time': loadTime,
        'page_path': window.location.pathname
      });
    }
  }
});

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Auto-select game based on page URL
  const path = window.location.pathname;
  const gameMapping = {
    '/valorant': 'valorant',
    '/cs2': 'cs2',
    '/fortnite': 'fortnite',
    '/warzone': 'warzone2',
    '/apex-legends': 'apex',
    '/overwatch-2': 'overwatch2',
    '/cyberpunk-2077': 'cyberpunk2077',
    '/gta-v': 'gtav',
    '/minecraft': 'minecraft',
    '/cod-modern-warfare': 'codmw3'
  };
  
  for (const [urlPart, gameId] of Object.entries(gameMapping)) {
    if (path.includes(urlPart)) {
      // Auto-populate game field
      const gameInput = document.getElementById('game-input') || document.getElementById('game');
      if (gameInput && typeof performanceDatabase !== 'undefined' && performanceDatabase.games) {
        const gameData = performanceDatabase.games[gameId];
        if (gameData) {
          gameInput.value = gameData.name;
          gameInput.setAttribute('data-selected-id', gameId);
          
          // Disable game selection (make it read-only on game pages)
          gameInput.setAttribute('readonly', 'true');
          if (!gameInput.style.background) {
            gameInput.style.background = '#f8f9fa';
          }
        }
      }
      break;
    }
  }
  
  // Check browser compatibility
  if (!checkBrowserCompatibility()) {
    return;
  }
  
  // Prevent double-tap zoom
  preventDoubleTapZoom();
  
  // Load config from URL if present
  loadConfigFromURL();
  
  // Load last results
  loadLastResults();
  
  // Add calculate button event listener
  const calculateBtn = document.getElementById('calculate-btn');
  if (calculateBtn) {
    calculateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Validate form
      if (!validateForm()) {
        return;
      }
      
      // Show loading state
      calculateBtn.disabled = true;
      const originalText = calculateBtn.textContent;
      calculateBtn.textContent = '⏳ Calculating...';
      
      // Show loading skeleton
      const skeleton = document.getElementById('loading-skeleton');
      if (skeleton) {
        skeleton.style.display = 'block';
      }
      
      // Small delay for UX
      setTimeout(() => {
        performCompleteCalculation();
        
        // Hide loading skeleton
        if (skeleton) {
          skeleton.style.display = 'none';
        }
        
        // Reset button
        calculateBtn.disabled = false;
        calculateBtn.textContent = originalText;
        
        // Scroll to results after calculation (mobile only)
        if (window.innerWidth < 768) {
          setTimeout(scrollToResults, 100);
        }
        
        // Track usage
        if (typeof gtag !== 'undefined') {
          gtag('event', 'calculator_used', {
            'event_category': 'engagement',
            'event_label': 'FPS Calculator'
          });
        }
      }, 500);
    });
  }
  
  // Add reset button if exists
  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetCalculator);
  }
  
  // Add share button if exists
  const shareBtn = document.getElementById('share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', copyResultsLink);
  }
  
  // Add form submit listener
  const form = document.getElementById('fps-calculator-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const calculateBtn = document.getElementById('calculate-btn');
      if (calculateBtn) {
        calculateBtn.click();
      }
    });
  }
});

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    performCompleteCalculation,
    validateInputs,
    estimateGPUUsage,
    getFPSContext,
    displayFPSResults,
    displayPerformanceAcrossGames,
    getSettingsOptimizations,
    displayOptimizationTips,
    showError,
    showSuccess,
    showNotification,
    generateShareableLink,
    copyResultsLink,
    resetCalculator,
    loadConfigFromURL,
    saveResultsToLocalStorage,
    loadLastResults,
    validateForm,
    showFieldError,
    clearFieldError,
    preventDoubleTapZoom,
    scrollToResults,
    checkBrowserCompatibility
  };
}

