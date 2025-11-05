/**
 * Bottleneck Analyzer - Detects CPU/GPU/RAM bottlenecks and provides upgrade recommendations
 */

// Resolution weighting (how much each component matters at different resolutions)
const resolutionWeights = {
  "1080p": { cpu: 0.6, gpu: 0.4 },  // CPU-heavy (lower resolution = more CPU bound)
  "1440p": { cpu: 0.4, gpu: 0.6 },  // Balanced
  "4k": { cpu: 0.25, gpu: 0.75 }    // GPU-heavy (higher resolution = more GPU bound)
};

// Game type modifiers (adjust CPU/GPU weights based on game type)
const gameTypeModifiers = {
  "competitive": { cpu: 0.15, gpu: -0.15 }, // Competitive FPS games are CPU-heavy
  "strategy": { cpu: 0.15, gpu: -0.15 },    // Strategy games are CPU-heavy
  "aaa": { cpu: 0, gpu: 0 },                // AAA games use both
  "racing": { cpu: 0, gpu: 0 },             // Racing games are GPU-heavy
  "sports": { cpu: 0, gpu: 0 }              // Sports games are balanced
};

// Severity thresholds and styles
const severityThresholds = {
  OPTIMAL: { min: 0, max: 5, icon: "✅", color: "#10b981", text: "Perfect balance", priority: "NONE" },
  MINIMAL: { min: 5, max: 10, icon: "✓", color: "#22c55e", text: "Excellent", priority: "LOW" },
  MODERATE: { min: 10, max: 20, icon: "⚠️", color: "#f59e0b", text: "Minor limitation", priority: "LOW" },
  SIGNIFICANT: { min: 20, max: 30, icon: "⚠️", color: "#f97316", text: "Upgrade recommended", priority: "MEDIUM" },
  SEVERE: { min: 30, max: 50, icon: "❌", color: "#ef4444", text: "Major bottleneck", priority: "HIGH" },
  CRITICAL: { min: 50, max: 100, icon: "🚫", color: "#dc2626", text: "Urgent upgrade needed", priority: "CRITICAL" }
};

// Game classification (for determining game type)
const gameClassification = {
  "competitive": ["Valorant", "CS2", "CS:GO", "Apex Legends", "Overwatch 2", "Rainbow Six Siege"],
  "strategy": ["Civilization VI", "Total War", "Crusader Kings", "Stellaris"],
  "aaa": ["Cyberpunk 2077", "Baldur's Gate 3", "Starfield", "The Last of Us", "Hogwarts Legacy"],
  "racing": ["Forza Horizon", "Gran Turismo", "F1", "Assetto Corsa"],
  "sports": ["FIFA", "Madden", "NBA 2K", "MLB The Show"]
};

/**
 * Determine game type from game name
 */
function getGameType(gameName) {
  const gameLower = gameName.toLowerCase();
  
  for (const [type, games] of Object.entries(gameClassification)) {
    if (games.some(game => gameLower.includes(game.toLowerCase()))) {
      return type;
    }
  }
  
  return "aaa"; // Default to AAA
}

/**
 * Calculate CPU score (0-100)
 */
function calculateCPUScore(cpu) {
  if (!cpu || !cpu.gamingScore) {
    return 70; // Default mid-range score
  }
  
  // Use gaming score directly (already 0-100 scale)
  return cpu.gamingScore;
}

/**
 * Calculate GPU score (0-100)
 */
function calculateGPUScore(gpu) {
  if (!gpu || !gpu.performanceScore) {
    return 50; // Default mid-range score
  }
  
  // Use performance score directly (already 0-100 scale)
  return gpu.performanceScore;
}

/**
 * Check RAM bottleneck
 */
function checkRAMBottleneck(ramAmount, ramSpeed, game) {
  // RAM capacity checks
  if (ramAmount < 8) {
    return {
      issue: "CAPACITY",
      severity: "CRITICAL",
      message: "8GB RAM is insufficient for modern gaming",
      recommendation: "Upgrade to 16GB immediately",
      impact: "Severe stuttering and frame drops"
    };
  }
  
  if (ramAmount === 8) {
    return {
      issue: "CAPACITY",
      severity: "HIGH",
      message: "16GB minimum recommended for modern gaming (2025)",
      recommendation: "Upgrade to 16GB for optimal performance",
      impact: "10-20% performance loss, potential stuttering"
    };
  }
  
  if (ramAmount === 16) {
    // Check if game is VRAM-hungry (this is about system RAM, not VRAM)
    // Most games are fine with 16GB, but some AAA titles can use 14GB+
    const vramHungryGames = ["Starfield", "Baldur's Gate 3", "Cities: Skylines 2"];
    const gameLower = game.toLowerCase();
    const isHungry = vramHungryGames.some(g => gameLower.includes(g.toLowerCase()));
    
    if (isHungry) {
      return {
        issue: "CAPACITY",
        severity: "MODERATE",
        message: "16GB is sufficient but 32GB recommended for future-proofing",
        recommendation: "Consider upgrading to 32GB within 6-12 months",
        impact: "Minor limitations in memory-intensive scenarios"
      };
    }
    
    return {
      issue: "NONE",
      message: "16GB RAM is sufficient for most games"
    };
  }
  
  // 32GB+ is optimal
  return {
    issue: "NONE",
    message: "RAM capacity is optimal"
  };
}

/**
 * Determine bottleneck severity
 */
function getSeverity(percentage) {
  for (const [severity, config] of Object.entries(severityThresholds)) {
    if (percentage >= config.min && percentage < config.max) {
      return severity;
    }
  }
  return "CRITICAL"; // Default for 50%+
}

/**
 * Main bottleneck analysis function
 */
function analyzeBottleneck(cpu, gpu, ram, resolution, game, fpsResult) {
  // Validate inputs
  if (!cpu || !gpu || !ram || !resolution || !game) {
    return null;
  }
  
  // Get component scores
  const cpuScore = calculateCPUScore(cpu);
  const gpuScore = calculateGPUScore(gpu);
  
  // Get resolution weights
  const weights = resolutionWeights[resolution] || resolutionWeights["1440p"];
  
  // Get game type and apply modifiers
  const gameType = getGameType(game);
  const modifiers = gameTypeModifiers[gameType] || { cpu: 0, gpu: 0 };
  
  // Apply game type modifiers to weights
  let adjustedCPUWeight = weights.cpu + modifiers.cpu;
  let adjustedGPUWeight = weights.gpu + modifiers.gpu;
  
  // Normalize weights (ensure they sum to 1)
  const totalWeight = adjustedCPUWeight + adjustedGPUWeight;
  adjustedCPUWeight = adjustedCPUWeight / totalWeight;
  adjustedGPUWeight = adjustedGPUWeight / totalWeight;
  
  // Calculate effective scores (weighted)
  const effectiveCPUScore = cpuScore * adjustedCPUWeight;
  const effectiveGPUScore = gpuScore * adjustedGPUWeight;
  
  // Determine bottleneck
  const ratio = effectiveGPUScore / effectiveCPUScore;
  let bottleneck;
  let percentage;
  let explanation;
  
  // Special cases
  // Ultra high-end GPU (4090) with mid CPU at 1080p - always some CPU limitation
  if (gpuScore >= 90 && cpuScore < 80 && resolution === "1080p") {
    bottleneck = "CPU";
    percentage = Math.min(30, Math.round((90 - cpuScore) * 0.3));
    explanation = "Your high-end GPU is being limited by CPU performance at 1080p. This is common and expected.";
  }
  // Budget GPU with flagship CPU - GPU bottleneck is optimal
  else if (gpuScore < 50 && cpuScore >= 90) {
    bottleneck = "GPU";
    percentage = Math.round((90 - gpuScore) * 0.4);
    explanation = "Your GPU is the limiting factor, which is optimal for gaming. Your CPU has headroom for future GPU upgrades.";
  }
  // Balanced system
  else if (ratio >= 0.9 && ratio <= 1.1) {
    bottleneck = "NONE";
    percentage = 0;
    explanation = "Your system is well-balanced. No significant bottlenecks detected.";
  }
  // CPU bottleneck
  else if (ratio > 1.3) {
    bottleneck = "CPU";
    percentage = Math.round((ratio - 1.0) * 20);
    percentage = Math.min(50, Math.max(0, percentage));
    explanation = `Your CPU is limiting GPU performance by approximately ${percentage}%. Consider CPU upgrade for better performance.`;
  }
  // GPU bottleneck
  else if (ratio < 0.7) {
    bottleneck = "GPU";
    percentage = Math.round((1.0 - ratio) * 20);
    percentage = Math.min(50, Math.max(0, percentage));
    explanation = `Your GPU is the primary limiting factor. This is normal and expected - GPU bottleneck is optimal for gaming.`;
  }
  // Balanced (close ratio)
  else {
    bottleneck = "NONE";
    percentage = Math.round((Math.abs(ratio - 1.0)) * 15);
    explanation = "Your system is well-balanced with minimal bottleneck.";
  }
  
  // Check RAM bottleneck
  const ramBottleneck = checkRAMBottleneck(ram, null, game);
  
  // Determine severity
  const severity = getSeverity(percentage);
  const severityConfig = severityThresholds[severity];
  
  // Get upgrade recommendations
  const recommendations = getUpgradeRecommendations(bottleneck, cpu, gpu, severity, percentage);
  
  // Get optimization tips
  const optimizationTips = getOptimizationTips(bottleneck, ramBottleneck);
  
  // Get resolution advice
  const resolutionAdvice = getResolutionAdvice(bottleneck, resolution);
  
  return {
    bottleneck,
    severity,
    percentage,
    explanation,
    icon: severityConfig.icon,
    color: severityConfig.color,
    upgradePriority: severityConfig.priority,
    recommendations,
    optimizationTips,
    resolutionAdvice,
    ramBottleneck,
    componentScores: {
      cpu: cpuScore,
      gpu: gpuScore,
      effectiveCPU: Math.round(effectiveCPUScore),
      effectiveGPU: Math.round(effectiveGPUScore),
      ratio: Math.round(ratio * 100) / 100
    }
  };
}

/**
 * Get upgrade recommendations
 */
function getUpgradeRecommendations(bottleneck, cpu, gpu, severity, percentage) {
  if (bottleneck === "NONE" || severity === "OPTIMAL" || severity === "MINIMAL") {
    return [];
  }
  
  const recommendations = [];
  
  if (bottleneck === "CPU") {
    const cpuName = cpu.name || "";
    const cpuTier = cpu.tier || "mid-range";
    
    // Get better CPUs from database
    const betterCPUs = Object.keys(performanceDatabase.cpus || {})
      .map(key => performanceDatabase.cpus[key])
      .filter(c => c.gamingScore > cpu.gamingScore)
      .sort((a, b) => b.gamingScore - a.gamingScore);
    
    if (betterCPUs.length > 0) {
      // Budget option (next tier up)
      const budgetCPU = betterCPUs.find(c => c.gamingScore <= cpu.gamingScore + 10) || betterCPUs[betterCPUs.length - 1];
      // Mid-range option (significant upgrade)
      const midCPU = betterCPUs.find(c => c.gamingScore >= cpu.gamingScore + 15 && c.gamingScore <= cpu.gamingScore + 25) || betterCPUs[Math.floor(betterCPUs.length / 2)];
      // Best option (high-end)
      const bestCPU = betterCPUs[0];
      
      if (budgetCPU) {
        recommendations.push({
          tier: "budget",
          component: "CPU",
          suggested: budgetCPU.name,
          expectedGain: `+${Math.round(percentage * 0.3)}-${Math.round(percentage * 0.5)}% FPS`,
          estimatedCost: "$150-$250",
          description: "Small but noticeable improvement"
        });
      }
      
      if (midCPU && midCPU !== budgetCPU) {
        recommendations.push({
          tier: "mid-range",
          component: "CPU",
          suggested: midCPU.name,
          expectedGain: `+${Math.round(percentage * 0.5)}-${Math.round(percentage * 0.7)}% FPS`,
          estimatedCost: "$250-$400",
          description: "Significant performance improvement"
        });
      }
      
      if (bestCPU && bestCPU !== midCPU && bestCPU !== budgetCPU) {
        recommendations.push({
          tier: "best",
          component: "CPU",
          suggested: bestCPU.name,
          expectedGain: `+${Math.round(percentage * 0.7)}-${Math.round(percentage * 0.9)}% FPS`,
          estimatedCost: "$400-$600",
          description: "Maximum performance unlock"
        });
      }
    }
  }
  
  if (bottleneck === "GPU") {
    const gpuName = gpu.name || "";
    
    // Get better GPUs from database
    const betterGPUs = Object.keys(performanceDatabase.gpus || {})
      .map(key => performanceDatabase.gpus[key])
      .filter(g => g.performanceScore > gpu.performanceScore)
      .sort((a, b) => b.performanceScore - a.performanceScore);
    
    if (betterGPUs.length > 0) {
      // Budget option
      const budgetGPU = betterGPUs.find(g => g.performanceScore <= gpu.performanceScore + 15) || betterGPUs[betterGPUs.length - 1];
      // Mid-range option
      const midGPU = betterGPUs.find(g => g.performanceScore >= gpu.performanceScore + 25 && g.performanceScore <= gpu.performanceScore + 40) || betterGPUs[Math.floor(betterGPUs.length / 2)];
      // Best option
      const bestGPU = betterGPUs[0];
      
      if (budgetGPU) {
        recommendations.push({
          tier: "budget",
          component: "GPU",
          suggested: budgetGPU.name,
          expectedGain: `+${Math.round(percentage * 0.4)}-${Math.round(percentage * 0.6)}% FPS`,
          estimatedCost: "$300-$500",
          description: "Moderate GPU upgrade"
        });
      }
      
      if (midGPU && midGPU !== budgetGPU) {
        recommendations.push({
          tier: "mid-range",
          component: "GPU",
          suggested: midGPU.name,
          expectedGain: `+${Math.round(percentage * 0.6)}-${Math.round(percentage * 0.8)}% FPS`,
          estimatedCost: "$500-$800",
          description: "Significant GPU upgrade"
        });
      }
      
      if (bestGPU && bestGPU !== midGPU && bestGPU !== budgetGPU) {
        recommendations.push({
          tier: "best",
          component: "GPU",
          suggested: bestGPU.name,
          expectedGain: `+${Math.round(percentage * 0.8)}-${Math.round(percentage * 1.0)}% FPS`,
          estimatedCost: "$800-$1600",
          description: "Maximum GPU performance"
        });
      }
    }
  }
  
  return recommendations;
}

/**
 * Get optimization tips
 */
function getOptimizationTips(bottleneck, ramBottleneck) {
  const tips = [];
  
  // General tips
  tips.push("Close background applications (Discord, Chrome tabs, etc.)");
  tips.push("Update GPU drivers to latest version");
  tips.push("Enable Game Mode in Windows Settings");
  
  // CPU-specific tips
  if (bottleneck === "CPU") {
    tips.push("Disable Windows Game Bar and Xbox Game DVR");
    tips.push("Set CPU power plan to 'High Performance'");
    tips.push("Close unnecessary Windows services");
    tips.push("Disable Windows Defender real-time scanning during gaming");
  }
  
  // GPU-specific tips
  if (bottleneck === "GPU") {
    tips.push("Lower graphics settings (especially shadows and reflections)");
    tips.push("Disable VSync if not needed");
    tips.push("Enable DLSS/FSR if available");
    tips.push("Close other GPU-intensive applications");
  }
  
  // RAM tips
  if (ramBottleneck && ramBottleneck.issue !== "NONE") {
    tips.push("Close unnecessary applications to free RAM");
    tips.push("Disable Windows startup programs");
    tips.push("Consider upgrading RAM (see recommendations above)");
  }
  
  return tips;
}

/**
 * Get resolution-specific advice
 */
function getResolutionAdvice(bottleneck, resolution) {
  if (bottleneck === "CPU" && resolution === "4k") {
    return "Your CPU bottleneck will be less noticeable at 4K since the GPU is the primary limiting factor at this resolution.";
  }
  
  if (bottleneck === "CPU" && resolution === "1080p") {
    return "CPU bottlenecks are most noticeable at 1080p. Consider upgrading CPU or increasing resolution to 1440p.";
  }
  
  if (bottleneck === "GPU" && resolution === "1080p") {
    return "GPU bottleneck at 1080p is normal and expected. Your GPU is working efficiently. Consider upgrading GPU for better performance.";
  }
  
  if (bottleneck === "GPU" && resolution === "4k") {
    return "GPU bottleneck at 4K is expected and normal. The GPU is the primary limiting factor at this resolution.";
  }
  
  if (bottleneck === "NONE") {
    return "Your system is well-balanced for this resolution. No changes needed.";
  }
  
  return "";
}

/**
 * Get educational tooltip text
 */
function getBottleneckEducation(topic) {
  const education = {
    "what-is-bottleneck": "A bottleneck is when one component limits the performance of others. For example, a slow CPU prevents a fast GPU from reaching its full potential.",
    "gpu-bottleneck-bad": "No! GPU bottleneck is actually optimal for gaming. It means your GPU is working at full capacity, which is what you want. CPU bottleneck is the problem.",
    "cpu-bottleneck-bad": "Yes, CPU bottleneck means your CPU is preventing your GPU from working at full capacity. This reduces FPS and responsiveness.",
    "should-upgrade": "It depends on your resolution and games. At 1080p, CPU matters more. At 4K, GPU matters more. Check the recommendations above for specific advice."
  };
  
  return education[topic] || "";
}

/**
 * Create visual bottleneck chart data
 */
function createBottleneckChartData(bottleneckResult) {
  const { componentScores } = bottleneckResult;
  
  const maxScore = Math.max(componentScores.cpu, componentScores.gpu, 100);
  
  return {
    cpu: {
      score: componentScores.cpu,
      percentage: Math.round((componentScores.cpu / maxScore) * 100),
      color: bottleneckResult.bottleneck === "CPU" ? "#ef4444" : "#10b981"
    },
    gpu: {
      score: componentScores.gpu,
      percentage: Math.round((componentScores.gpu / maxScore) * 100),
      color: bottleneckResult.bottleneck === "GPU" ? "#f59e0b" : "#10b981"
    },
    balance: componentScores.ratio
  };
}

/**
 * Predict FPS improvement from upgrade
 */
function predictUpgradeImprovement(currentComponent, newComponent, bottleneck, resolution, gameType) {
  // Get current and new scores
  const currentScore = bottleneck === "CPU" 
    ? calculateCPUScore(currentComponent)
    : calculateGPUScore(currentComponent);
    
  const newScore = bottleneck === "CPU"
    ? calculateCPUScore(newComponent)
    : calculateGPUScore(newComponent);
  
  // Calculate improvement percentage
  const improvement = ((newScore - currentScore) / currentScore) * 100;
  
  // Apply resolution weighting
  const weights = resolutionWeights[resolution] || resolutionWeights["1440p"];
  const relevantWeight = bottleneck === "CPU" ? weights.cpu : weights.gpu;
  
  // Estimated FPS improvement (conservative estimate)
  const fpsImprovement = improvement * relevantWeight * 0.7; // 70% of theoretical improvement
  
  return {
    improvement: Math.round(improvement * 10) / 10,
    fpsImprovement: Math.round(fpsImprovement * 10) / 10,
    estimatedFPSGain: `+${Math.round(fpsImprovement)}-${Math.round(fpsImprovement * 1.3)} FPS`
  };
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    analyzeBottleneck,
    calculateCPUScore,
    calculateGPUScore,
    checkRAMBottleneck,
    getUpgradeRecommendations,
    getOptimizationTips,
    getResolutionAdvice,
    getBottleneckEducation,
    createBottleneckChartData,
    predictUpgradeImprovement,
    getGameType,
    getSeverity,
    resolutionWeights,
    gameTypeModifiers,
    severityThresholds
  };
}

