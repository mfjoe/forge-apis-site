/**
 * Latency Calculator - Click-to-Photon System Latency
 * Calculates total system latency breakdown with visual components
 */

// Mouse polling rate latency lookup table
const MOUSE_POLLING_LATENCY = {
  125: 4.0,
  500: 1.0,
  1000: 0.5,
  2000: 0.25,
  4000: 0.125,
  8000: 0.0625
};

// Panel type pixel response times (ms)
const PANEL_RESPONSE_TIME = {
  'TN': 1.5,
  'IPS': 3.0,
  'VA': 4.0,
  'OLED': 0.1
};

/**
 * Detect latency technology support
 */
function detectLatencyTechnology(gpu) {
  if (!gpu) return null;
  
  const gpuName = typeof gpu === 'string' ? gpu : (gpu?.name || '');
  const gpuUpper = gpuName.toUpperCase();
  
  // NVIDIA RTX series supports Reflex
  if (gpuUpper.includes('RTX 40') || gpuUpper.includes('RTX 30') || gpuUpper.includes('RTX 20')) {
    return 'reflex';
  }
  
  // AMD RX 6000/7000 series supports Anti-Lag
  if (gpuUpper.includes('RX 7') || gpuUpper.includes('RX 6')) {
    return 'anti-lag';
  }
  
  return null;
}

/**
 * Calculate mouse latency based on polling rate
 */
function calculateMouseLatency(pollingRate) {
  return MOUSE_POLLING_LATENCY[pollingRate] || 4.0;
}

/**
 * Calculate PC latency components
 */
function calculatePCLatency(config) {
  const {
    currentFPS,
    gpuUsage = 85,
    reflexEnabled = false,
    cpuTier = 'mid-range'
  } = config;
  
  // Input sampling (depends on CPU/GPU bound state)
  let inputSampling;
  if (gpuUsage > 95) {
    inputSampling = 1.0; // GPU-bound, CPU can sample faster
  } else if (gpuUsage < 50) {
    inputSampling = 3.0; // CPU-bound, slower sampling
  } else {
    inputSampling = 2.0; // Balanced
  }
  
  // CPU simulation time (depends on game complexity and CPU tier)
  let cpuSimulation;
  const cpuScores = {
    'flagship': 4.0,
    'high-end': 5.0,
    'mid-high-end': 6.0,
    'mid-range': 7.0,
    'budget': 8.0
  };
  cpuSimulation = cpuScores[cpuTier] || 6.0;
  
  // Render queue (eliminated by Reflex/Anti-Lag, otherwise 1.5 frames if GPU >95%)
  let renderQueue = 0;
  if (!reflexEnabled && gpuUsage > 95) {
    const frameTime = 1000 / currentFPS;
    renderQueue = frameTime * 1.5; // 1.5 frames buffered
  }
  
  // GPU render time
  const gpuRender = 1000 / currentFPS;
  
  return {
    inputSampling,
    cpuSimulation,
    renderQueue,
    gpuRender,
    total: inputSampling + cpuSimulation + renderQueue + gpuRender
  };
}

/**
 * Calculate display latency
 */
function calculateDisplayLatency(refreshRate, panelType, isGamingMonitor = true) {
  // Display processing time
  const displayProcessing = isGamingMonitor ? 2.0 : 5.0;
  
  // Scanout average (half of frame time)
  const scanoutAverage = (1000 / refreshRate) / 2;
  
  // Pixel response time
  const pixelResponse = PANEL_RESPONSE_TIME[panelType] || 3.0;
  
  return {
    displayProcessing,
    scanoutAverage,
    pixelResponse,
    total: displayProcessing + scanoutAverage + pixelResponse
  };
}

/**
 * Calculate network latency (one-way)
 */
function calculateNetworkLatency(ping) {
  if (!ping || ping === 0) return 0;
  return ping / 2; // One-way latency
}

/**
 * Main latency calculation function
 */
function calculateSystemLatency(config) {
  const {
    mousePollingRate = 1000,
    currentFPS = 144,
    refreshRate = 144,
    monitorType = 'IPS',
    networkPing = 0,
    gpuUsage = 85,
    reflexEnabled = false,
    isGamingMonitor = true,
    cpuTier = 'mid-range',
    gpu
  } = config;
  
  // Calculate each component
  const mouseLatency = calculateMouseLatency(mousePollingRate);
  const pcLatency = calculatePCLatency({
    currentFPS,
    gpuUsage,
    reflexEnabled,
    cpuTier
  });
  const displayLatency = calculateDisplayLatency(refreshRate, monitorType, isGamingMonitor);
  const networkLatency = calculateNetworkLatency(networkPing);
  
  // Total latency
  const total = mouseLatency + pcLatency.total + displayLatency.total + networkLatency;
  
  // Determine rating
  let rating;
  if (total <= 40) {
    rating = 'EXCELLENT';
  } else if (total <= 60) {
    rating = 'GOOD';
  } else if (total <= 80) {
    rating = 'AVERAGE';
  } else if (total <= 100) {
    rating = 'FAIR';
  } else {
    rating = 'POOR';
  }
  
  // Generate recommendation
  const recommendation = getLatencyRecommendation(total, rating, pcLatency.renderQueue, networkLatency);
  
  // Calculate uncertainty
  const uncertainty = calculateUncertainty(config);
  
  return {
    total: Math.round(total * 100) / 100,
    breakdown: {
      mouse: Math.round(mouseLatency * 100) / 100,
      pc: Math.round(pcLatency.total * 100) / 100,
      display: Math.round(displayLatency.total * 100) / 100,
      network: Math.round(networkLatency * 100) / 100
    },
    components: {
      inputSampling: Math.round(pcLatency.inputSampling * 100) / 100,
      cpuSimulation: Math.round(pcLatency.cpuSimulation * 100) / 100,
      renderQueue: Math.round(pcLatency.renderQueue * 100) / 100,
      gpuRender: Math.round(pcLatency.gpuRender * 100) / 100,
      displayProcessing: Math.round(displayLatency.displayProcessing * 100) / 100,
      scanoutAverage: Math.round(displayLatency.scanoutAverage * 100) / 100,
      pixelResponse: Math.round(displayLatency.pixelResponse * 100) / 100
    },
    rating,
    recommendation,
    uncertainty,
    reflexEnabled,
    technology: detectLatencyTechnology(gpu)
  };
}

/**
 * Calculate uncertainty based on configuration
 */
function calculateUncertainty(config) {
  let uncertainty = 2; // Base uncertainty
  
  // Higher uncertainty if GPU usage is estimated
  if (config.gpuUsage === undefined) {
    uncertainty += 2;
  }
  
  // Higher uncertainty if network ping is not provided
  if (!config.networkPing || config.networkPing === 0) {
    uncertainty += 1;
  }
  
  // Higher uncertainty if CPU tier is not specific
  if (config.cpuTier === 'mid-range') {
    uncertainty += 1;
  }
  
  return Math.round(uncertainty * 10) / 10;
}

/**
 * Get latency recommendation
 */
function getLatencyRecommendation(total, rating, renderQueue, networkLatency) {
  if (rating === 'EXCELLENT') {
    return 'Your latency is competitive for esports gaming. This setup is optimized for competitive play.';
  }
  
  if (rating === 'GOOD') {
    return 'Your latency is solid for gaming. Minor optimizations could improve responsiveness.';
  }
  
  if (rating === 'AVERAGE') {
    return 'Your latency is acceptable for casual gaming. Consider optimizations for better responsiveness.';
  }
  
  if (rating === 'FAIR') {
    return 'Noticeable input lag detected. Significant optimizations recommended for better gaming experience.';
  }
  
  return 'Significant input delay. System optimization highly recommended for playable gaming experience.';
}

/**
 * Get latency optimizations
 */
function getLatencyOptimizations(latencyResult, config) {
  const optimizations = [];
  const { breakdown, components, technology, reflexEnabled } = latencyResult;
  
  // Reflex/Anti-Lag recommendation
  if (technology && !reflexEnabled && components.renderQueue > 0) {
    const improvement = Math.round(components.renderQueue * 1.2 * 10) / 10;
    optimizations.push({
      type: 'TECHNOLOGY',
      title: `Enable ${technology === 'reflex' ? 'NVIDIA Reflex' : 'AMD Anti-Lag'}`,
      description: `Eliminates render queue and reduces PC latency`,
      improvement: `-${improvement}-${Math.round(improvement * 1.3 * 10) / 10}ms`,
      priority: 'HIGH',
      impact: 'high'
    });
  }
  
  // Mouse polling rate upgrade
  if (config.mousePollingRate < 1000 && breakdown.mouse > 0.5) {
    const currentLatency = breakdown.mouse;
    const newLatency = calculateMouseLatency(1000);
    const improvement = Math.round((currentLatency - newLatency) * 10) / 10;
    if (improvement > 0.5) {
      optimizations.push({
        type: 'HARDWARE',
        title: 'Upgrade to 1000Hz mouse',
        description: 'Higher polling rate reduces input delay',
        improvement: `-${improvement}ms`,
        priority: 'MEDIUM',
        impact: 'medium'
      });
    }
  }
  
  // High refresh rate monitor upgrade
  if (config.refreshRate < 240 && breakdown.display > 5) {
    const currentDisplay = breakdown.display;
    const estimatedNewDisplay = calculateDisplayLatency(240, config.monitorType, true).total;
    const improvement = Math.round((currentDisplay - estimatedNewDisplay) * 10) / 10;
    if (improvement > 1) {
      optimizations.push({
        type: 'HARDWARE',
        title: 'Upgrade to 240Hz monitor',
        description: 'Higher refresh rate reduces display latency',
        improvement: `-${improvement}ms`,
        priority: 'MEDIUM',
        impact: 'medium'
      });
    }
  }
  
  // Network optimization
  if (breakdown.network > 20) {
    optimizations.push({
      type: 'NETWORK',
      title: 'Improve internet connection',
      description: 'Lower ping reduces network latency significantly',
      improvement: `-${Math.round(breakdown.network * 0.3)}-${Math.round(breakdown.network * 0.5)}ms`,
      priority: 'HIGH',
      impact: 'high'
    });
  }
  
  // Close background apps
  if (components.cpuSimulation > 6) {
    optimizations.push({
      type: 'SOFTWARE',
      title: 'Close background applications',
      description: 'Reduces CPU load and simulation time',
      improvement: '-2-5ms',
      priority: 'LOW',
      impact: 'low'
    });
  }
  
  // Gaming monitor optimization
  if (!config.isGamingMonitor && breakdown.display > 6) {
    const improvement = 3; // Gaming monitors have 3ms less processing
    optimizations.push({
      type: 'SETTINGS',
      title: 'Enable Game Mode on monitor',
      description: 'Reduces display processing time',
      improvement: `-${improvement}ms`,
      priority: 'LOW',
      impact: 'medium'
    });
  }
  
  return optimizations;
}

/**
 * Calculate "before optimization" comparison
 */
function calculateOptimizationComparison(currentConfig, optimizedConfig) {
  const current = calculateSystemLatency(currentConfig);
  const optimized = calculateSystemLatency(optimizedConfig);
  
  const improvement = current.total - optimized.total;
  const improvementPercent = Math.round((improvement / current.total) * 100);
  
  return {
    before: current,
    after: optimized,
    improvement: Math.round(improvement * 10) / 10,
    improvementPercent,
    breakdown: {
      mouse: current.breakdown.mouse - optimized.breakdown.mouse,
      pc: current.breakdown.pc - optimized.breakdown.pc,
      display: current.breakdown.display - optimized.breakdown.display,
      network: current.breakdown.network - optimized.breakdown.network
    }
  };
}

/**
 * Create visual breakdown chart data
 */
function createLatencyChartData(latencyResult) {
  const { breakdown, total } = latencyResult;
  
  const colors = {
    mouse: '#0066ff',      // Blue
    pc: '#10b981',         // Green
    display: '#f59e0b',    // Orange
    network: '#ef4444'      // Red
  };
  
  const labels = {
    mouse: 'Mouse Input',
    pc: 'PC Processing',
    display: 'Display',
    network: 'Network'
  };
  
  const tooltips = {
    mouse: 'Time from button click to PC receiving input signal',
    pc: 'Time for CPU/GPU to process and render the frame',
    display: 'Time from GPU output to pixels changing on screen',
    network: 'Round-trip time to game server (one-way shown)'
  };
  
  const data = [];
  
  Object.keys(breakdown).forEach(key => {
    if (breakdown[key] > 0) {
      data.push({
        label: labels[key],
        value: breakdown[key],
        percentage: Math.round((breakdown[key] / total) * 100),
        color: colors[key],
        tooltip: tooltips[key]
      });
    }
  });
  
  return data;
}

/**
 * Get component tooltip text
 */
function getComponentTooltip(component) {
  const tooltips = {
    inputSampling: 'Time for PC to detect and process mouse/keyboard input',
    cpuSimulation: 'CPU time to simulate game logic and physics',
    renderQueue: 'Buffered frames waiting to be displayed (eliminated by Reflex/Anti-Lag)',
    gpuRender: 'GPU time to render the frame',
    displayProcessing: 'Monitor processing time (Game Mode reduces this)',
    scanoutAverage: 'Average time for monitor to scan pixels (half of refresh period)',
    pixelResponse: 'Time for pixels to change color (varies by panel type)'
  };
  
  return tooltips[component] || '';
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateSystemLatency,
    calculateMouseLatency,
    calculatePCLatency,
    calculateDisplayLatency,
    calculateNetworkLatency,
    detectLatencyTechnology,
    getLatencyOptimizations,
    calculateOptimizationComparison,
    createLatencyChartData,
    getComponentTooltip,
    MOUSE_POLLING_LATENCY,
    PANEL_RESPONSE_TIME
  };
}

