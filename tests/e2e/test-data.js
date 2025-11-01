// test-data.js - Test fixtures and expected values

export default {
  // eDPI Calculator test cases
  edpiTestCases: [
    {
      name: 'TenZ Settings (Valorant)',
      dpi: 1600,
      sensitivity: 0.139,
      expectedEdpi: 222.4,
      game: 'valorant',
      expectedCategory: 'LOW',
      tolerance: 0.1 // Allow 0.1 difference for floating point
    },
    {
      name: 'Low Sensitivity CS2',
      dpi: 400,
      sensitivity: 2.0,
      expectedEdpi: 800,
      game: 'cs2',
      expectedCategory: 'MEDIUM',
      tolerance: 0.1
    },
    {
      name: 'High Sensitivity Apex',
      dpi: 800,
      sensitivity: 2.0,
      expectedEdpi: 1600,
      game: 'apex',
      expectedCategory: 'HIGH',
      tolerance: 0.1
    },
    {
      name: 'Fortnite Settings',
      dpi: 800,
      sensitivity: 0.065,
      expectedEdpi: 52,
      game: 'fortnite',
      expectedCategory: 'MEDIUM',
      tolerance: 0.1
    }
  ],

  // cm/360 Calculator test cases
  cm360TestCases: [
    {
      name: 'Standard CS2 Settings',
      dpi: 400,
      sensitivity: 2.0,
      game: 'cs2',
      expectedCm360: 51.95, // Calculated: (360 * 2.54) / (400 * 2.0 * 0.022) = 914.4 / 17.6 = 51.95
      tolerance: 0.5, // Allow 0.5cm difference
      expectedCategory: 'Medium'
    },
    {
      name: 'Valorant Low Sens',
      dpi: 800,
      sensitivity: 0.4,
      game: 'valorant',
      expectedCm360: 40.82, // (360 * 2.54) / (800 * 0.4 * 0.07) = 914.4 / 22.4 = 40.82
      tolerance: 0.5,
      expectedCategory: 'Medium'
    },
    {
      name: 'Apex High Sens',
      dpi: 800,
      sensitivity: 1.8,
      game: 'apex',
      expectedCm360: 28.86, // (360 * 2.54) / (800 * 1.8 * 0.022) = 914.4 / 31.68 = 28.86
      tolerance: 0.5,
      expectedCategory: 'Low'
    }
  ],

  // Sensitivity Analyzer test cases
  analyzerTestCases: [
    {
      name: 'Optimal Valorant Precision',
      edpi: 280,
      game: 'valorant',
      playstyle: 'precision',
      expectedRating: 'PERFECT',
      expectedOptimalRange: '200-350'
    },
    {
      name: 'Too High CS2 Aggressive',
      edpi: 1500,
      game: 'cs2',
      playstyle: 'aggressive',
      expectedRating: 'TOO HIGH',
      expectedOptimalRange: '900-1400'
    },
    {
      name: 'Too Low Apex Balanced',
      edpi: 700,
      game: 'apex',
      playstyle: 'balanced',
      expectedRating: 'TOO LOW',
      expectedOptimalRange: '1000-1600'
    }
  ],

  // DPI Comparison test cases
  comparisonTestCases: [
    {
      name: 'Identical eDPI Different DPI',
      setupA: { dpi: 400, sensitivity: 2.0 },
      setupB: { dpi: 800, sensitivity: 1.0 },
      expectedEdpiA: 800,
      expectedEdpiB: 800,
      expectedVerdict: 'IDENTICAL',
      tolerance: 0.1
    },
    {
      name: 'Different Sensitivity Levels',
      setupA: { dpi: 800, sensitivity: 0.35 },
      setupB: { dpi: 800, sensitivity: 1.5 },
      expectedEdpiA: 280,
      expectedEdpiB: 1200,
      expectedVerdict: 'DIFFERENT',
      tolerance: 0.1
    }
  ],

  // Pro player settings to verify
  proPlayerSettings: [
    {
      game: 'valorant',
      playerName: 'TenZ',
      expectedDpi: '1600',
      expectedSens: '0.139',
      expectedEdpi: '222.4'
    },
    {
      game: 'cs2',
      playerName: 's1mple',
      expectedDpi: '400',
      expectedSens: '3.09',
      expectedEdpi: '1236'
    },
    {
      game: 'apex',
      playerName: 'ImperialHal',
      expectedDpi: '800',
      expectedSens: '1.1',
      expectedEdpi: '880'
    }
  ],

  // Browser viewport sizes to test responsiveness
  viewports: [
    { name: 'Desktop HD', width: 1920, height: 1080 },
    { name: 'Desktop', width: 1280, height: 720 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Mobile', width: 375, height: 667 }
  ]
};

