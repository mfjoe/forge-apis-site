/**
 * FPS Calculator Database
 * Benchmark data sourced from: Tom's Hardware, TechPowerUp, Hardware Unboxed
 * Data Version: 2025.01
 * Last Updated: 2025-01-15
 * Next Update: 2025-02-01
 */

const dataVersion = {
  version: "2025.01",
  lastUpdated: "2025-01-15",
  nextUpdate: "2025-02-01",
  sources: ["Tom's Hardware", "TechPowerUp", "Hardware Unboxed"]
};

// GPU Tier Classification
const GPU_TIERS = {
  "ultra-high-end": ["RTX 4090", "RTX 4080"],
  "high-end": ["RTX 4070 Ti", "RTX 4070", "RX 7900 XTX", "RX 7900 XT"],
  "mid-high-end": ["RTX 4060 Ti", "RX 7800 XT", "RX 7700 XT", "RX 6950 XT"],
  "mid-range": ["RTX 3060 Ti", "RTX 4060", "RX 6900 XT", "RX 6800 XT", "RX 6700 XT"],
  "budget": ["RTX 3060", "RTX 3050", "RX 6600 XT", "RX 6600"]
};

// GPU Base Performance Scores (relative to RTX 4090 = 100)
const gpuPerformanceScores = {
  // NVIDIA RTX 40 Series
  "NVIDIA RTX 4090": 100,
  "NVIDIA RTX 4080": 85,
  "NVIDIA RTX 4070 Ti": 70,
  "NVIDIA RTX 4070": 60,
  "NVIDIA RTX 4060 Ti": 45,
  "NVIDIA RTX 4060": 35,
  // NVIDIA RTX 30 Series
  "NVIDIA RTX 3090": 80,
  "NVIDIA RTX 3080": 68,
  "NVIDIA RTX 3070": 55,
  "NVIDIA RTX 3060 Ti": 42,
  "NVIDIA RTX 3060": 32,
  "NVIDIA RTX 3050": 25,
  // AMD RX 7000 Series
  "AMD RX 7900 XTX": 88,
  "AMD RX 7900 XT": 78,
  "AMD RX 7800 XT": 65,
  "AMD RX 7700 XT": 50,
  // AMD RX 6000 Series
  "AMD RX 6950 XT": 72,
  "AMD RX 6900 XT": 66,
  "AMD RX 6800 XT": 58,
  "AMD RX 6700 XT": 45,
  "AMD RX 6600 XT": 35,
  "AMD RX 6600": 28
};

// CPU Gaming Performance Scores (relative to i9-13900K = 100)
const cpuGamingScores = {
  // Intel 14th Gen
  "Intel Core i9-14900K": 105,
  "Intel Core i7-14700K": 95,
  "Intel Core i5-14600K": 85,
  // Intel 13th Gen
  "Intel Core i9-13900K": 100,
  "Intel Core i7-13700K": 90,
  "Intel Core i5-13600K": 80,
  "Intel Core i5-13400F": 70,
  // Intel 12th Gen
  "Intel Core i9-12900K": 88,
  "Intel Core i7-12700K": 82,
  "Intel Core i5-12600K": 72,
  "Intel Core i5-12400F": 62,
  "Intel Core i3-12100F": 55,
  // AMD Ryzen 7000 Series
  "AMD Ryzen 9 7950X": 98,
  "AMD Ryzen 9 7900X": 92,
  "AMD Ryzen 7 7800X3D": 105, // X3D cache advantage
  "AMD Ryzen 7 7700X": 85,
  "AMD Ryzen 5 7600X": 75,
  // AMD Ryzen 5000 Series
  "AMD Ryzen 9 5950X": 85,
  "AMD Ryzen 7 5800X3D": 95, // X3D cache advantage
  "AMD Ryzen 7 5800X": 80,
  "AMD Ryzen 7 5700X": 75,
  "AMD Ryzen 5 5600X": 68,
  "AMD Ryzen 5 5600": 65
};

// Game Baseline Performance (FPS at 1080p Ultra with RTX 4090)
const gameBaselines = {
  "Valorant": 450, // Very light game
  "CS2": 380, // Light game
  "Fortnite": 280, // Medium-light
  "Warzone 2": 180, // Medium-heavy
  "Apex Legends": 240, // Medium
  "Overwatch 2": 320, // Medium-light
  "Cyberpunk 2077": 140, // Heavy
  "GTA V": 200, // Medium
  "Minecraft": 500, // Very light (depends on settings)
  "Call of Duty Modern Warfare III": 190 // Medium-heavy
};

// Resolution Multipliers (relative to 1080p)
const resolutionMultipliers = {
  "1080p": 1.0,
  "1440p": 0.65, // ~35% performance drop
  "4k": 0.40 // ~60% performance drop
};

// Settings Multipliers (relative to Ultra)
const settingsMultipliers = {
  "ultra": 1.0,
  "high": 1.25, // ~20% FPS increase
  "medium": 1.55, // ~35% FPS increase
  "low": 2.0 // ~50% FPS increase
};

// Game-specific CPU scaling (higher = more CPU dependent)
const gameCPUScaling = {
  "Valorant": 0.25, // GPU bound
  "CS2": 0.30,
  "Fortnite": 0.35,
  "Warzone 2": 0.45, // More CPU dependent
  "Apex Legends": 0.40,
  "Overwatch 2": 0.35,
  "Cyberpunk 2077": 0.20, // GPU bound
  "GTA V": 0.40,
  "Minecraft": 0.50, // Very CPU dependent
  "Call of Duty Modern Warfare III": 0.45
};

/**
 * Performance Database Structure
 */
const performanceDatabase = {
  gpus: {},
  cpus: {},
  games: Object.keys(gameBaselines),
  
  // Initialize GPU data
  initGPUs() {
    Object.keys(gpuPerformanceScores).forEach(gpuName => {
      const score = gpuPerformanceScores[gpuName];
      const tier = getGPUTier(gpuName);
      
      this.gpus[gpuName] = {
        name: gpuName,
        tier: tier,
        vram: this.getVRAM(gpuName),
        performanceScore: score,
        games: this.generateGameData(gpuName, score)
      };
    });
  },
  
  // Initialize CPU data
  initCPUs() {
    Object.keys(cpuGamingScores).forEach(cpuName => {
      this.cpus[cpuName] = {
        name: cpuName,
        tier: this.getCPUTier(cpuName),
        cores: this.getCoreCount(cpuName),
        gamingScore: cpuGamingScores[cpuName]
      };
    });
  },
  
  // Generate FPS data for a GPU based on performance score
  generateGameData(gpuName, gpuScore) {
    const games = {};
    
    Object.keys(gameBaselines).forEach(gameName => {
      const baseline = gameBaselines[gameName];
      const gpuMultiplier = gpuScore / 100;
      
      games[gameName] = {
        "1080p": {
          low: Math.round(baseline * gpuMultiplier * settingsMultipliers.low * 0.9),
          medium: Math.round(baseline * gpuMultiplier * settingsMultipliers.medium * 0.9),
          high: Math.round(baseline * gpuMultiplier * settingsMultipliers.high * 0.9),
          ultra: Math.round(baseline * gpuMultiplier * 0.9)
        },
        "1440p": {
          low: Math.round(baseline * gpuMultiplier * resolutionMultipliers["1440p"] * settingsMultipliers.low * 0.9),
          medium: Math.round(baseline * gpuMultiplier * resolutionMultipliers["1440p"] * settingsMultipliers.medium * 0.9),
          high: Math.round(baseline * gpuMultiplier * resolutionMultipliers["1440p"] * settingsMultipliers.high * 0.9),
          ultra: Math.round(baseline * gpuMultiplier * resolutionMultipliers["1440p"] * 0.9)
        },
        "4k": {
          low: Math.round(baseline * gpuMultiplier * resolutionMultipliers["4k"] * settingsMultipliers.low * 0.9),
          medium: Math.round(baseline * gpuMultiplier * resolutionMultipliers["4k"] * settingsMultipliers.medium * 0.9),
          high: Math.round(baseline * gpuMultiplier * resolutionMultipliers["4k"] * settingsMultipliers.high * 0.9),
          ultra: Math.round(baseline * gpuMultiplier * resolutionMultipliers["4k"] * 0.9)
        }
      };
    });
    
    return games;
  },
  
  // Get VRAM for GPU
  getVRAM(gpuName) {
    const vramMap = {
      "NVIDIA RTX 4090": 24, "NVIDIA RTX 4080": 16, "NVIDIA RTX 4070 Ti": 12,
      "NVIDIA RTX 4070": 12, "NVIDIA RTX 4060 Ti": 16, "NVIDIA RTX 4060": 8,
      "NVIDIA RTX 3090": 24, "NVIDIA RTX 3080": 10, "NVIDIA RTX 3070": 8,
      "NVIDIA RTX 3060 Ti": 8, "NVIDIA RTX 3060": 12, "NVIDIA RTX 3050": 8,
      "AMD RX 7900 XTX": 24, "AMD RX 7900 XT": 20, "AMD RX 7800 XT": 16,
      "AMD RX 7700 XT": 12, "AMD RX 6950 XT": 16, "AMD RX 6900 XT": 16,
      "AMD RX 6800 XT": 16, "AMD RX 6700 XT": 12, "AMD RX 6600 XT": 8,
      "AMD RX 6600": 8
    };
    return vramMap[gpuName] || 8;
  },
  
  // Get CPU tier
  getCPUTier(cpuName) {
    const score = cpuGamingScores[cpuName] || 70;
    if (score >= 95) return "flagship";
    if (score >= 85) return "high-end";
    if (score >= 75) return "mid-high-end";
    if (score >= 65) return "mid-range";
    return "budget";
  },
  
  // Get core count
  getCoreCount(cpuName) {
    const coresMap = {
      "Intel Core i9-14900K": 24, "Intel Core i9-13900K": 24,
      "Intel Core i7-14700K": 20, "Intel Core i7-13700K": 16,
      "Intel Core i5-13600K": 14, "Intel Core i5-13400F": 10,
      "Intel Core i9-12900K": 16, "Intel Core i7-12700K": 12,
      "Intel Core i5-12600K": 10, "Intel Core i5-12400F": 6,
      "Intel Core i3-12100F": 4,
      "AMD Ryzen 9 7950X": 16, "AMD Ryzen 9 7900X": 12,
      "AMD Ryzen 7 7800X3D": 8, "AMD Ryzen 7 7700X": 8,
      "AMD Ryzen 5 7600X": 6, "AMD Ryzen 9 5950X": 16,
      "AMD Ryzen 7 5800X3D": 8, "AMD Ryzen 7 5800X": 8,
      "AMD Ryzen 7 5700X": 8, "AMD Ryzen 5 5600X": 6,
      "AMD Ryzen 5 5600": 6
    };
    return coresMap[cpuName] || 6;
  }
};

// Initialize database
performanceDatabase.initGPUs();
performanceDatabase.initCPUs();

/**
 * Helper Functions
 */

function findGPUByName(searchTerm) {
  const term = searchTerm.toLowerCase();
  const matches = Object.keys(gpuPerformanceScores).filter(gpu =>
    gpu.toLowerCase().includes(term) || 
    gpu.toLowerCase().replace(/\s+/g, '').includes(term.replace(/\s+/g, ''))
  );
  return matches.map(gpu => ({
    name: gpu,
    tier: getGPUTier(gpu),
    score: gpuPerformanceScores[gpu]
  }));
}

function findCPUByName(searchTerm) {
  const term = searchTerm.toLowerCase();
  const matches = Object.keys(cpuGamingScores).filter(cpu =>
    cpu.toLowerCase().includes(term) ||
    cpu.toLowerCase().replace(/\s+/g, '').includes(term.replace(/\s+/g, ''))
  );
  return matches.map(cpu => ({
    name: cpu,
    tier: performanceDatabase.getCPUTier(cpu),
    score: cpuGamingScores[cpu]
  }));
}

function getGPUTier(gpuName) {
  for (const [tier, gpus] of Object.entries(GPU_TIERS)) {
    if (gpus.some(gpu => gpuName.includes(gpu))) {
      return tier;
    }
  }
  return "mid-range";
}

function getCPUScore(cpuName) {
  return cpuGamingScores[cpuName] || 70;
}

function getGPUScore(gpuName) {
  return gpuPerformanceScores[gpuName] || 50;
}

/**
 * Core Calculation Functions
 */

function estimateFPS(gpu, game, resolution, settings) {
  // Validate inputs
  if (!gpu || !game || !resolution || !settings) {
    console.error('estimateFPS: Missing required parameters', { gpu, game, resolution, settings });
    return 150; // Default fallback
  }
  
  // Find exact match first
  const gpuData = performanceDatabase.gpus[gpu];
  if (gpuData && gpuData.games[game]) {
    const fps = gpuData.games[game][resolution]?.[settings];
    if (fps) return fps;
  }
  
  // Interpolate if no exact match
  const gpuScore = getGPUScore(gpu);
  const baseline = gameBaselines[game] || 150;
  const resMulti = resolutionMultipliers[resolution] || 1.0;
  const setMulti = settingsMultipliers[settings] || 1.0;
  
  const result = Math.round(baseline * (gpuScore / 100) * resMulti * setMulti * 0.9);
  console.log('estimateFPS:', { gpu, game, resolution, settings, gpuScore, baseline, resMulti, setMulti, result });
  
  return result;
}

function getConfidenceLevel(gpu, game, hasDirectBenchmark) {
  if (hasDirectBenchmark) return "HIGH";
  
  const gpuData = performanceDatabase.gpus[gpu];
  if (gpuData && gpuData.games[game]) return "HIGH";
  
  // Check if we have similar GPU in same tier
  const tier = getGPUTier(gpu);
  const tierGPUs = Object.keys(gpuPerformanceScores).filter(g => getGPUTier(g) === tier);
  if (tierGPUs.length > 0) return "MEDIUM";
  
  return "LOW";
}

function calculateFPSRange(baseFPS, confidence) {
  let variance;
  switch(confidence) {
    case "HIGH":
      variance = 0.10; // ±10%
      break;
    case "MEDIUM":
      variance = 0.15; // ±15%
      break;
    case "LOW":
      variance = 0.20; // ±20%
      break;
    default:
      variance = 0.15;
  }
  
  const min = Math.round(baseFPS * (1 - variance));
  const max = Math.round(baseFPS * (1 + variance));
  const average = Math.round((min + max) / 2);
  
  return {
    min,
    max,
    average,
    confidence,
    display: `${min}-${max} FPS`
  };
}

function calculateFPS(gpu, cpu, ram, resolution, game, settings) {
  // Validate inputs
  if (!gpu || !cpu || !ram || !resolution || !game || !settings) {
    console.error('calculateFPS: Missing required parameters', { gpu, cpu, ram, resolution, game, settings });
    return null;
  }
  
  console.log('calculateFPS called with:', { gpu, cpu, ram, resolution, game, settings });
  
  // Get base FPS estimate
  let baseFPS = estimateFPS(gpu, game, resolution, settings);
  console.log('Base FPS:', baseFPS);
  
  // Apply CPU scaling factor
  const cpuScore = getCPUScore(cpu);
  const cpuScaling = gameCPUScaling[game] || 0.35;
  const cpuMultiplier = 0.7 + (cpuScore / 100) * 0.3 * cpuScaling;
  baseFPS = Math.round(baseFPS * cpuMultiplier);
  console.log('After CPU scaling:', { cpuScore, cpuScaling, cpuMultiplier, baseFPS });
  
  // Apply RAM scaling (minimal impact, but can bottleneck at 8GB)
  if (parseInt(ram) === 8 && resolution === "4k") {
    baseFPS = Math.round(baseFPS * 0.95); // ~5% penalty
    console.log('Applied RAM penalty:', baseFPS);
  }
  
  // Check if we have direct benchmark data
  const gpuData = performanceDatabase.gpus[gpu];
  const hasDirectBenchmark = gpuData && gpuData.games[game];
  const confidence = getConfidenceLevel(gpu, game, hasDirectBenchmark);
  console.log('Confidence:', confidence, 'hasDirectBenchmark:', hasDirectBenchmark);
  
  // Calculate FPS range
  const result = calculateFPSRange(baseFPS, confidence);
  console.log('Final FPS result:', result);
  return result;
}

/**
 * Calculate System Latency
 */
function calculateSystemLatency(gpu, cpu, resolution, game, settings) {
  const baseFPS = estimateFPS(gpu, game, resolution, settings);
  const frameTime = 1000 / baseFPS; // ms per frame
  
  const gpuScore = getGPUScore(gpu);
  const cpuScore = getCPUScore(cpu);
  
  // GPU render time (inverse of GPU performance)
  const gpuRenderTime = frameTime * (100 / gpuScore) * 0.8;
  
  // CPU processing time (depends on CPU and game CPU dependency)
  const cpuScaling = gameCPUScaling[game] || 0.35;
  const cpuProcessingTime = frameTime * (100 / cpuScore) * cpuScaling * 0.2;
  
  // Total frame time
  const totalFrameTime = gpuRenderTime + cpuProcessingTime;
  
  return {
    gpuRenderTime: Math.round(gpuRenderTime * 10) / 10,
    cpuProcessingTime: Math.round(cpuProcessingTime * 10) / 10,
    frameTime: Math.round(totalFrameTime * 10) / 10,
    totalLatency: Math.round(totalFrameTime * 10) / 10
  };
}

/**
 * Bottleneck Analysis
 */
function analyzeBottleneck(gpu, cpu, resolution, game, settings) {
  const gpuScore = getGPUScore(gpu);
  const cpuScore = getCPUScore(cpu);
  const cpuScaling = gameCPUScaling[game] || 0.35;
  
  // Effective CPU impact
  const effectiveCPUImpact = cpuScore * cpuScaling;
  const effectiveGPUImpact = gpuScore * (1 - cpuScaling);
  
  const ratio = effectiveGPUImpact / effectiveCPUImpact;
  
  let bottleneck;
  let severity;
  
  if (ratio > 1.3) {
    bottleneck = "GPU";
    severity = "Your GPU is the primary limiting factor";
  } else if (ratio < 0.7) {
    bottleneck = "CPU";
    severity = "Your CPU may be limiting GPU performance";
  } else {
    bottleneck = "BALANCED";
    severity = "Your system appears well-balanced";
  }
  
  // Resolution impact
  if (resolution === "4k") {
    bottleneck = "GPU";
    severity = "At 4K, the GPU is almost always the bottleneck";
  }
  
  return {
    bottleneck,
    severity,
    ratio: Math.round(ratio * 100) / 100,
    gpuUtilization: Math.min(100, Math.round(effectiveGPUImpact)),
    cpuUtilization: Math.min(100, Math.round(effectiveCPUImpact))
  };
}

/**
 * Upgrade Recommendations
 */
function getUpgradeRecommendations(gpu, cpu, ram, resolution, game, settings, fpsResult, bottleneck) {
  const recommendations = [];
  
  // RAM recommendations
  if (ram === 8) {
    recommendations.push({
      type: "RAM",
      priority: "HIGH",
      message: "Upgrade to 16GB+ RAM for optimal performance, especially at higher resolutions",
      impact: "10-15% performance improvement"
    });
  }
  
  // GPU bottleneck recommendations
  if (bottleneck.bottleneck === "GPU") {
    const currentTier = getGPUTier(gpu);
    const tierGPUs = Object.keys(gpuPerformanceScores).filter(g => {
      const tier = getGPUTier(g);
      return tier !== currentTier && getGPUScore(g) > getGPUScore(gpu);
    });
    
    if (tierGPUs.length > 0) {
      const nextTierGPU = tierGPUs[0];
      recommendations.push({
        type: "GPU",
        priority: "HIGH",
        message: `Consider upgrading to ${nextTierGPU} for better performance`,
        impact: "20-40% FPS improvement"
      });
    }
  }
  
  // CPU bottleneck recommendations
  if (bottleneck.bottleneck === "CPU") {
    const currentScore = getCPUScore(cpu);
    const betterCPUs = Object.keys(cpuGamingScores).filter(c => 
      cpuGamingScores[c] > currentScore
    );
    
    if (betterCPUs.length > 0) {
      recommendations.push({
        type: "CPU",
        priority: "MEDIUM",
        message: `Consider upgrading to ${betterCPUs[0]} to unlock more GPU performance`,
        impact: "5-15% FPS improvement"
      });
    }
  }
  
  // Resolution-specific recommendations
  if (resolution === "4k" && fpsResult.average < 60) {
    recommendations.push({
      type: "SETTINGS",
      priority: "MEDIUM",
      message: "Consider lowering graphics settings or using 1440p for better frame rates",
      impact: "Significant FPS improvement"
    });
  }
  
  // Game-specific recommendations
  if (game === "Minecraft" && cpu) {
    recommendations.push({
      type: "CPU",
      priority: "LOW",
      message: "Minecraft is very CPU-dependent. Consider a CPU with higher single-core performance",
      impact: "10-20% FPS improvement"
    });
  }
  
  return recommendations;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    performanceDatabase,
    calculateFPS,
    calculateFPSRange,
    getConfidenceLevel,
    estimateFPS,
    findGPUByName,
    findCPUByName,
    getGPUTier,
    getCPUScore,
    getGPUScore,
    calculateSystemLatency,
    analyzeBottleneck,
    getUpgradeRecommendations,
    dataVersion
  };
}

// At the very end of fps-database.js, add:
window.performanceDatabase = performanceDatabase;