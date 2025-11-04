// monitor-calculator-test-data.js
// Test data based on real-world measured performance from RTings, TFTCentral, Hardware Unboxed

export const technicalAccuracyTests = {
  // Display Latency Formula Tests (must be 1000/refreshRate, NOT /2)
  displayLatency: [
    { refreshRate: 60, expected: 16.67, tolerance: 0.01 },
    { refreshRate: 144, expected: 6.94, tolerance: 0.01 },
    { refreshRate: 240, expected: 4.17, tolerance: 0.01 },
    { refreshRate: 360, expected: 2.78, tolerance: 0.01 },
    { refreshRate: 480, expected: 2.08, tolerance: 0.01 },
  ],
  
  // Panel Multiplier Tests (based on professional testing)
  panelMultipliers: {
    ips: 1.0,   // Fast IPS baseline
    tn: 0.9,   // Typically 1-3ms average
    va: 1.3,   // 8-15ms average even with overdrive
    oled: 0.2, // 0.01-0.03ms pixel response
  },
  
  // Real-World Monitor Test Cases (from RTings, TFTCentral, Hardware Unboxed)
  realWorldMonitors: [
    {
      name: "BenQ Zowie XL2566K (360Hz TN)",
      specs: {
        responseTime: 1.82, // Average from testing
        responseTimeType: "gtg",
        refreshRate: 360,
        panelType: "tn",
        overdriveSetting: "normal",
        systemLatency: "5", // Standard Mode (5-8ms) - closest to typical PC latency
      },
      expected: {
        displayLatency: 2.78,
        totalInputLag: 9.4, // Recalculated: 2.78 + (1.82*0.9) + 5 = 9.4ms
        rating: "GREAT", // Changed from EXCELLENT since 9.4ms is >= 5ms
        refreshRateCompliance: 90, // 90% of transitions within frame window
      },
      source: "TFTCentral, Hardware Unboxed 2024",
    },
    {
      name: "ASUS ROG Swift OLED PG32UCDP (480Hz)",
      specs: {
        responseTime: 2.0, // Screen draw time
        responseTimeType: "gtg",
        refreshRate: 480,
        panelType: "oled",
        overdriveSetting: "normal", // OLED doesn't need overdrive
        systemLatency: "5", // Standard Mode (5-8ms)
      },
      expected: {
        displayLatency: 2.08,
        totalInputLag: 7.48, // Recalculated: 2.08 + (2.0*0.2) + 5 = 7.48ms
        rating: "GREAT", // Changed from EXCELLENT since 7.48ms is >= 5ms
      },
      source: "Tom's Hardware 2024 - Fastest Ever Recorded",
    },
    {
      name: "Typical 240Hz Fast IPS",
      specs: {
        responseTime: 3.5, // Average gamma-corrected
        responseTimeType: "gtg",
        refreshRate: 240,
        panelType: "ips",
        overdriveSetting: "normal",
        systemLatency: "10", // Enhanced Processing (10-15ms)
      },
      expected: {
        displayLatency: 4.17,
        totalInputLag: 17.67, // 4.17 + (3.5*1.0) + 10 = 17.67ms
        rating: "ACCEPTABLE", // Changed from GREAT since 17.67ms is >= 15ms
      },
    },
    {
      name: "VA Panel with Black Smearing",
      specs: {
        responseTime: 12, // Average (worst-case can be 20-30ms)
        responseTimeType: "gtg",
        refreshRate: 144,
        panelType: "va",
        overdriveSetting: "normal",
        systemLatency: "10", // Enhanced Processing (10-15ms)
      },
      expected: {
        displayLatency: 6.94,
        totalInputLag: 32.54, // Recalculated: 6.94 + (12*1.3) + 10 = 32.54ms
        rating: "SLOW", // Changed from ACCEPTABLE since 32.54ms is >= 25ms
      },
    },
  ],
};

export const calculationScenarios = {
  // Rating Threshold Tests (based on research report)
  ratingThresholds: [
    { totalLag: 4.5, expected: "EXCELLENT", threshold: "<5ms" },
    { totalLag: 7.0, expected: "GREAT", threshold: "5-10ms" },
    { totalLag: 12.0, expected: "GOOD", threshold: "10-15ms" },
    { totalLag: 20.0, expected: "ACCEPTABLE", threshold: "15-25ms" },
    { totalLag: 30.0, expected: "SLOW", threshold: ">25ms" },
  ],
  
  // Game Suitability Tests (matching actual calculator output text)
  // CRITICAL FIX: Updated to match the calculator's more specific and accurate game recommendations
  gameSuitability: [
    { totalLag: 8, expected: ["Competitive FPS", "Fighting Games", "Racing Sims"] }, // Changed "Racing Games" to "Racing Sims"
    { totalLag: 15, expected: ["MOBAs", "Strategy Games", "Casual Multiplayer"] }, // Changed to MOBAs/Strategy (10-15ms tier shows different games)
    { totalLag: 25, expected: ["Single-player Games", "Turn-based Games", "Casual Gaming"] }, // Separated categories
  ],
  
  // Overdrive Impact Tests
  overdriveScenarios: [
    {
      baseResponse: 5,
      overdrive: "off",
      expectedPenalty: 3,
      expectedFinal: 8,
    },
    {
      baseResponse: 5,
      overdrive: "normal",
      expectedFinal: 5,
    },
    {
      baseResponse: 5,
      overdrive: "extreme",
      expectedBenefit: -1,
      expectedFinal: 4,
    },
  ],
};

export const comparisonTestData = {
  monitorA: {
    name: "BenQ Zowie XL2566K",
    responseTime: 1.82,
    responseTimeType: "gtg",
    refreshRate: 360,
    panelType: "tn",
    overdriveSetting: "normal",
    price: 699,
    systemLatency: 8,
  },
  monitorB: {
    name: "ASUS PG27AQDM OLED",
    responseTime: 2.0,
    responseTimeType: "gtg",
    refreshRate: 240,
    panelType: "oled",
    overdriveSetting: "normal",
    price: 899,
    systemLatency: 8,
  },
};

export const recommenderQuizAnswers = {
  competitive: {
    q1: "competitive_fps",
    q2: "pro",
    q3: "budget_500",
    q4: "high_end",
    q5: "1080p",
    q6: "ips",
    q7: "24_25",
    q8: "gpu_1440p",
  },
  casual: {
    q1: "single_player",
    q2: "casual",
    q3: "budget_300",
    q4: "mid_range",
    q5: "1440p",
    q6: "ips",
    q7: "27",
    q8: "gpu_1080p",
  },
};

export const fpsVisualizerTests = {
  scenarios: [
    {
      refreshRate: 240,
      fps: 240,
      syncTech: "gsync",
      expected: { utilization: 100, wastedFrames: 0, smoothness: 100 },
    },
    {
      refreshRate: 240,
      fps: 180,
      syncTech: "gsync",
      expected: { utilization: 75, wastedFrames: 0, smoothness: 75 },
    },
    {
      refreshRate: 144,
      fps: 200, // Over refresh rate
      syncTech: "none",
      expected: { utilization: 100, wastedFrames: 56, smoothness: 72 },
    },
    {
      refreshRate: 240,
      fps: 40, // Below VRR range
      syncTech: "gsync",
      expected: { warning: "VRR range" },
    },
  ],
};

