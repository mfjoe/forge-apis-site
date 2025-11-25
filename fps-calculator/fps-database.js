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
  "ultra-high-end": ["RTX 4090", "RTX 4080", "RTX 4080 Super", "RTX 3090", "RTX 3080 Ti", "RX 7900 XTX"],
  "high-end": ["RTX 4070 Ti Super", "RTX 4070 Ti", "RTX 4070 Super", "RTX 4070", "RTX 3080", "RTX 3070 Ti", "RX 7900 XT", "RX 6950 XT"],
  "mid-high-end": ["RTX 4060 Ti", "RTX 3070", "RTX 2080 Ti", "RTX 2080 Super", "RX 7800 XT", "RX 7700 XT", "RX 6900 XT", "RX 6800 XT"],
  "mid-range": ["RTX 3060 Ti", "RTX 4060", "RTX 2080", "RTX 2070 Super", "RTX 2070", "RTX 2060 Super", "RX 6700 XT", "RX 5700 XT", "RX 6600 XT"],
  "budget": ["RTX 3060", "RTX 3050", "RTX 2060", "GTX 1660 Ti", "GTX 1660 Super", "GTX 1660", "RX 6600", "RX 5600 XT", "RX 5500 XT", "RX 580", "RX 570"]
};

// GPU Base Performance Scores (relative to RTX 4090 = 100)
const gpuPerformanceScores = {
  // NVIDIA RTX 40 Series
  "NVIDIA RTX 4090": 100,
  "NVIDIA RTX 4080 Super": 88,
  "NVIDIA RTX 4080": 85,
  "NVIDIA RTX 4070 Ti Super": 75,
  "NVIDIA RTX 4070 Ti": 70,
  "NVIDIA RTX 4070 Super": 65,
  "NVIDIA RTX 4070": 60,
  "NVIDIA RTX 4060 Ti": 45,
  "NVIDIA RTX 4060": 35,
  // NVIDIA RTX 30 Series
  "NVIDIA RTX 3090": 80,
  "NVIDIA RTX 3080 Ti": 75,
  "NVIDIA RTX 3080": 68,
  "NVIDIA RTX 3070 Ti": 62,
  "NVIDIA RTX 3070": 55,
  "NVIDIA RTX 3060 Ti": 42,
  "NVIDIA RTX 3060": 32,
  "NVIDIA RTX 3050": 25,
  // NVIDIA RTX 20 Series
  "NVIDIA RTX 2080 Ti": 65,
  "NVIDIA RTX 2080 Super": 58,
  "NVIDIA RTX 2080": 52,
  "NVIDIA RTX 2070 Super": 48,
  "NVIDIA RTX 2070": 42,
  "NVIDIA RTX 2060 Super": 38,
  "NVIDIA RTX 2060": 32,
  // NVIDIA GTX 16 Series
  "NVIDIA GTX 1660 Ti": 28,
  "NVIDIA GTX 1660 Super": 26,
  "NVIDIA GTX 1660": 24,
  // NVIDIA GTX 10 Series
  "NVIDIA GTX 1080 Ti": 50,
  "NVIDIA GTX 1080": 40,
  "NVIDIA GTX 1070 Ti": 36,
  "NVIDIA GTX 1070": 32,
  "NVIDIA GTX 1060": 22,
  // AMD RX 7000 Series
  "AMD RX 7900 XTX": 88,
  "AMD RX 7900 XT": 78,
  "AMD RX 7800 XT": 65,
  "AMD RX 7700 XT": 50,
  // AMD RX 6000 Series
  "AMD RX 6950 XT": 72,
  "AMD RX 6900 XT": 66,
  "AMD RX 6800 XT": 58,
  "AMD RX 6800": 52,
  "AMD RX 6700 XT": 45,
  "AMD RX 6600 XT": 35,
  "AMD RX 6600": 28,
  // AMD RX 5000 Series
  "AMD RX 5700 XT": 40,
  "AMD RX 5700": 35,
  "AMD RX 5600 XT": 30,
  "AMD RX 5500 XT": 24,
  // AMD RX 500 Series
  "AMD RX 590": 28,
  "AMD RX 580": 25,
  "AMD RX 570": 22,
  "AMD RX 560": 18,
  // Intel Arc Series
  "Intel Arc A770": 38,
  "Intel Arc A750": 32,
  "Intel Arc A580": 26
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

// Game Database with detailed performance data
const gamesDatabase = {
  // COMPETITIVE FPS GAMES
  valorant: {
    id: 'valorant',
    name: 'Valorant',
    tier: 'competitive',
    baselineMultiplier: 0.6, // Very well optimized
    cpuIntensive: true,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 450
  },
  cs2: {
    id: 'cs2',
    name: 'Counter-Strike 2',
    tier: 'competitive',
    baselineMultiplier: 0.75,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 380
  },
  overwatch2: {
    id: 'overwatch2',
    name: 'Overwatch 2',
    tier: 'competitive',
    baselineMultiplier: 0.8,
    cpuIntensive: false,
    ramMinimum: 6,
    ramRecommended: 8,
    baselineFPS: 320
  },
  r6siege: {
    id: 'r6siege',
    name: 'Rainbow Six Siege',
    tier: 'competitive',
    baselineMultiplier: 0.85,
    cpuIntensive: true,
    ramMinimum: 6,
    ramRecommended: 8,
    baselineFPS: 300
  },
  rocket_league: {
    id: 'rocket_league',
    name: 'Rocket League',
    tier: 'competitive',
    baselineMultiplier: 0.5,
    cpuIntensive: false,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 500
  },
  
  // BATTLE ROYALE GAMES
  fortnite: {
    id: 'fortnite',
    name: 'Fortnite',
    tier: 'battle-royale',
    baselineMultiplier: 0.7, // Well optimized
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 280
  },
  apex_legends: {
    id: 'apex_legends',
    name: 'Apex Legends',
    tier: 'battle-royale',
    baselineMultiplier: 0.9,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 240
  },
  warzone2: {
    id: 'warzone2',
    name: 'Call of Duty: Warzone 2.0',
    tier: 'battle-royale',
    baselineMultiplier: 1.2, // Demanding
    cpuIntensive: true,
    ramMinimum: 12,
    ramRecommended: 16,
    baselineFPS: 180
  },
  pubg: {
    id: 'pubg',
    name: 'PUBG: Battlegrounds',
    tier: 'battle-royale',
    baselineMultiplier: 1.0,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 200
  },
  the_finals: {
    id: 'the_finals',
    name: 'The Finals',
    tier: 'battle-royale',
    baselineMultiplier: 1.1,
    cpuIntensive: false,
    ramMinimum: 12,
    ramRecommended: 16,
    baselineFPS: 220
  },
  
  // AAA SINGLE-PLAYER GAMES
  cyberpunk2077: {
    id: 'cyberpunk2077',
    name: 'Cyberpunk 2077',
    tier: 'aaa',
    baselineMultiplier: 1.5, // Very demanding
    cpuIntensive: true,
    ramMinimum: 12,
    ramRecommended: 16,
    baselineFPS: 140
  },
  rdr2: {
    id: 'rdr2',
    name: 'Red Dead Redemption 2',
    tier: 'aaa',
    baselineMultiplier: 1.4,
    cpuIntensive: true,
    ramMinimum: 12,
    ramRecommended: 16,
    baselineFPS: 150
  },
  hogwarts_legacy: {
    id: 'hogwarts_legacy',
    name: 'Hogwarts Legacy',
    tier: 'aaa',
    baselineMultiplier: 1.3,
    cpuIntensive: false,
    ramMinimum: 12,
    ramRecommended: 16,
    baselineFPS: 160
  },
  starfield: {
    id: 'starfield',
    name: 'Starfield',
    tier: 'aaa',
    baselineMultiplier: 1.4,
    cpuIntensive: true,
    ramMinimum: 16,
    ramRecommended: 32,
    baselineFPS: 150
  },
  tlou: {
    id: 'tlou',
    name: 'The Last of Us Part I',
    tier: 'aaa',
    baselineMultiplier: 1.6, // Extremely demanding
    cpuIntensive: false,
    ramMinimum: 16,
    ramRecommended: 32,
    baselineFPS: 130
  },
  spiderman: {
    id: 'spiderman',
    name: "Marvel's Spider-Man Remastered",
    tier: 'aaa',
    baselineMultiplier: 1.2,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 170
  },
  god_of_war: {
    id: 'god_of_war',
    name: 'God of War',
    tier: 'aaa',
    baselineMultiplier: 1.1,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 180
  },
  horizon_zero_dawn: {
    id: 'horizon_zero_dawn',
    name: 'Horizon Zero Dawn',
    tier: 'aaa',
    baselineMultiplier: 1.1,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 180
  },
  witcher3: {
    id: 'witcher3',
    name: 'The Witcher 3',
    tier: 'aaa',
    baselineMultiplier: 0.9, // Older, well optimized
    cpuIntensive: false,
    ramMinimum: 6,
    ramRecommended: 8,
    baselineFPS: 200
  },
  elden_ring: {
    id: 'elden_ring',
    name: 'Elden Ring',
    tier: 'aaa',
    baselineMultiplier: 1.0,
    cpuIntensive: false,
    ramMinimum: 12,
    ramRecommended: 16,
    baselineFPS: 190
  },
  
  // MULTIPLAYER SHOOTERS
  cod_mw3: {
    id: 'cod_mw3',
    name: 'Call of Duty: Modern Warfare III',
    tier: 'multiplayer',
    baselineMultiplier: 1.1,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 190
  },
  battlefield_2042: {
    id: 'battlefield_2042',
    name: 'Battlefield 2042',
    tier: 'multiplayer',
    baselineMultiplier: 1.3,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 160
  },
  halo_infinite: {
    id: 'halo_infinite',
    name: 'Halo Infinite',
    tier: 'multiplayer',
    baselineMultiplier: 1.0,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 190
  },
  destiny2: {
    id: 'destiny2',
    name: 'Destiny 2',
    tier: 'multiplayer',
    baselineMultiplier: 0.9,
    cpuIntensive: false,
    ramMinimum: 6,
    ramRecommended: 8,
    baselineFPS: 200
  },
  hunt_showdown: {
    id: 'hunt_showdown',
    name: 'Hunt: Showdown',
    tier: 'multiplayer',
    baselineMultiplier: 1.1,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 12,
    baselineFPS: 180
  },
  
  // SURVIVAL/EXTRACTION
  tarkov: {
    id: 'tarkov',
    name: 'Escape from Tarkov',
    tier: 'survival',
    baselineMultiplier: 1.3, // Poor optimization
    cpuIntensive: true,
    ramMinimum: 12,
    ramRecommended: 32, // Known RAM hog
    baselineFPS: 160
  },
  rust: {
    id: 'rust',
    name: 'Rust',
    tier: 'survival',
    baselineMultiplier: 1.2,
    cpuIntensive: true,
    ramMinimum: 10,
    ramRecommended: 16,
    baselineFPS: 170
  },
  dayz: {
    id: 'dayz',
    name: 'DayZ',
    tier: 'survival',
    baselineMultiplier: 1.1,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 180
  },
  scum: {
    id: 'scum',
    name: 'SCUM',
    tier: 'survival',
    baselineMultiplier: 1.2,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 170
  },
  
  // RACING GAMES
  forza_horizon5: {
    id: 'forza_horizon5',
    name: 'Forza Horizon 5',
    tier: 'racing',
    baselineMultiplier: 1.2,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 170
  },
  gran_turismo7: {
    id: 'gran_turismo7',
    name: 'Gran Turismo 7',
    tier: 'racing',
    baselineMultiplier: 1.0,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 8,
    baselineFPS: 190
  },
  f1_24: {
    id: 'f1_24',
    name: 'F1 24',
    tier: 'racing',
    baselineMultiplier: 1.1,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 180
  },
  assetto_corsa_comp: {
    id: 'assetto_corsa_comp',
    name: 'Assetto Corsa Competizione',
    tier: 'racing',
    baselineMultiplier: 1.1,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 180
  },
  
  // SPORTS GAMES
  fifa24: {
    id: 'fifa24',
    name: 'EA Sports FC 24',
    tier: 'sports',
    baselineMultiplier: 0.8,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 8,
    baselineFPS: 220
  },
  nba2k24: {
    id: 'nba2k24',
    name: 'NBA 2K24',
    tier: 'sports',
    baselineMultiplier: 0.9,
    cpuIntensive: false,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 200
  },
  madden24: {
    id: 'madden24',
    name: 'Madden NFL 24',
    tier: 'sports',
    baselineMultiplier: 0.8,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 8,
    baselineFPS: 220
  },
  
  // POPULAR/CASUAL GAMES
  minecraft: {
    id: 'minecraft',
    name: 'Minecraft (Java)',
    tier: 'casual',
    baselineMultiplier: 0.4, // Vanilla is light
    cpuIntensive: true, // Single-threaded
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 500
  },
  minecraft_rtx: {
    id: 'minecraft_rtx',
    name: 'Minecraft RTX',
    tier: 'casual',
    baselineMultiplier: 1.3, // Ray tracing heavy
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 160
  },
  roblox: {
    id: 'roblox',
    name: 'Roblox',
    tier: 'casual',
    baselineMultiplier: 0.3, // Very light
    cpuIntensive: true,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 600
  },
  gta5: {
    id: 'gta5',
    name: 'Grand Theft Auto V',
    tier: 'popular',
    baselineMultiplier: 0.8, // Old but optimized
    cpuIntensive: true,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 200
  },
  gta_online: {
    id: 'gta_online',
    name: 'GTA Online',
    tier: 'popular',
    baselineMultiplier: 0.9, // More demanding than story
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 190
  },
  sims4: {
    id: 'sims4',
    name: 'The Sims 4',
    tier: 'casual',
    baselineMultiplier: 0.5,
    cpuIntensive: true,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 400
  },
  
  // MOBA GAMES
  lol: {
    id: 'lol',
    name: 'League of Legends',
    tier: 'moba',
    baselineMultiplier: 0.4, // Extremely optimized
    cpuIntensive: false,
    ramMinimum: 2,
    ramRecommended: 4,
    baselineFPS: 600
  },
  dota2: {
    id: 'dota2',
    name: 'Dota 2',
    tier: 'moba',
    baselineMultiplier: 0.6,
    cpuIntensive: true,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 450
  },
  smite: {
    id: 'smite',
    name: 'Smite',
    tier: 'moba',
    baselineMultiplier: 0.7,
    cpuIntensive: false,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 380
  },
  
  // HORROR GAMES
  sons_of_forest: {
    id: 'sons_of_forest',
    name: 'Sons of the Forest',
    tier: 'horror',
    baselineMultiplier: 1.2,
    cpuIntensive: true,
    ramMinimum: 12,
    ramRecommended: 16,
    baselineFPS: 170
  },
  phasmophobia: {
    id: 'phasmophobia',
    name: 'Phasmophobia',
    tier: 'horror',
    baselineMultiplier: 0.7,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 8,
    baselineFPS: 300
  },
  dead_by_daylight: {
    id: 'dead_by_daylight',
    name: 'Dead by Daylight',
    tier: 'horror',
    baselineMultiplier: 0.8,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 8,
    baselineFPS: 280
  },
  
  // SIMULATION GAMES
  msfs2020: {
    id: 'msfs2020',
    name: 'Microsoft Flight Simulator',
    tier: 'simulation',
    baselineMultiplier: 1.8, // Extremely demanding
    cpuIntensive: true,
    ramMinimum: 16,
    ramRecommended: 32,
    baselineFPS: 110
  },
  cities_skylines2: {
    id: 'cities_skylines2',
    name: 'Cities: Skylines II',
    tier: 'simulation',
    baselineMultiplier: 1.5, // Poor optimization at launch
    cpuIntensive: true,
    ramMinimum: 16,
    ramRecommended: 32,
    baselineFPS: 130
  },
  euro_truck_sim2: {
    id: 'euro_truck_sim2',
    name: 'Euro Truck Simulator 2',
    tier: 'simulation',
    baselineMultiplier: 0.7,
    cpuIntensive: true,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 300
  },
  
  // STRATEGY GAMES
  total_war_warhammer3: {
    id: 'total_war_warhammer3',
    name: 'Total War: Warhammer III',
    tier: 'strategy',
    baselineMultiplier: 1.3,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 160
  },
  age_of_empires4: {
    id: 'age_of_empires4',
    name: 'Age of Empires IV',
    tier: 'strategy',
    baselineMultiplier: 0.9,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 200
  },
  civilization6: {
    id: 'civilization6',
    name: 'Civilization VI',
    tier: 'strategy',
    baselineMultiplier: 0.7,
    cpuIntensive: true,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 300
  },
  
  // ADDITIONAL POPULAR GAMES
  baldurs_gate3: {
    id: 'baldurs_gate3',
    name: "Baldur's Gate 3",
    tier: 'aaa',
    baselineMultiplier: 1.0,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 190
  },
  
  // MORE COMPETITIVE FPS GAMES
  team_fortress2: {
    id: 'team_fortress2',
    name: 'Team Fortress 2',
    tier: 'competitive',
    baselineMultiplier: 0.5,
    cpuIntensive: false,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 500
  },
  paladins: {
    id: 'paladins',
    name: 'Paladins',
    tier: 'competitive',
    baselineMultiplier: 0.7,
    cpuIntensive: false,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 400
  },
  splitgate: {
    id: 'splitgate',
    name: 'Splitgate',
    tier: 'competitive',
    baselineMultiplier: 0.8,
    cpuIntensive: false,
    ramMinimum: 6,
    ramRecommended: 8,
    baselineFPS: 350
  },
  xdefiant: {
    id: 'xdefiant',
    name: 'XDefiant',
    tier: 'competitive',
    baselineMultiplier: 0.85,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 320
  },
  
  // MORE BATTLE ROYALE GAMES
  fall_guys: {
    id: 'fall_guys',
    name: 'Fall Guys',
    tier: 'battle-royale',
    baselineMultiplier: 0.6,
    cpuIntensive: false,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 450
  },
  naraka_bladepoint: {
    id: 'naraka_bladepoint',
    name: 'Naraka: Bladepoint',
    tier: 'battle-royale',
    baselineMultiplier: 1.0,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 190
  },
  realm_royale: {
    id: 'realm_royale',
    name: 'Realm Royale',
    tier: 'battle-royale',
    baselineMultiplier: 0.7,
    cpuIntensive: false,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 400
  },
  
  // MORE AAA SINGLE-PLAYER GAMES
  alan_wake_2: {
    id: 'alan_wake_2',
    name: 'Alan Wake 2',
    tier: 'aaa',
    baselineMultiplier: 1.5,
    cpuIntensive: false,
    ramMinimum: 16,
    ramRecommended: 32,
    baselineFPS: 140
  },
  assassins_creed_mirage: {
    id: 'assassins_creed_mirage',
    name: "Assassin's Creed Mirage",
    tier: 'aaa',
    baselineMultiplier: 1.2,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 170
  },
  assassins_creed_valhalla: {
    id: 'assassins_creed_valhalla',
    name: "Assassin's Creed Valhalla",
    tier: 'aaa',
    baselineMultiplier: 1.3,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 160
  },
  avatar_frontiers: {
    id: 'avatar_frontiers',
    name: 'Avatar: Frontiers of Pandora',
    tier: 'aaa',
    baselineMultiplier: 1.6,
    cpuIntensive: true,
    ramMinimum: 16,
    ramRecommended: 32,
    baselineFPS: 130
  },
  batman_arkham_knight: {
    id: 'batman_arkham_knight',
    name: 'Batman: Arkham Knight',
    tier: 'aaa',
    baselineMultiplier: 1.0,
    cpuIntensive: false,
    ramMinimum: 6,
    ramRecommended: 8,
    baselineFPS: 190
  },
  borderlands_3: {
    id: 'borderlands_3',
    name: 'Borderlands 3',
    tier: 'aaa',
    baselineMultiplier: 1.1,
    cpuIntensive: false,
    ramMinimum: 6,
    ramRecommended: 8,
    baselineFPS: 180
  },
  control: {
    id: 'control',
    name: 'Control',
    tier: 'aaa',
    baselineMultiplier: 1.2,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 170
  },
  death_stranding: {
    id: 'death_stranding',
    name: 'Death Stranding',
    tier: 'aaa',
    baselineMultiplier: 1.1,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 180
  },
  diablo_4: {
    id: 'diablo_4',
    name: 'Diablo IV',
    tier: 'aaa',
    baselineMultiplier: 1.0,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 190
  },
  dying_light_2: {
    id: 'dying_light_2',
    name: 'Dying Light 2',
    tier: 'aaa',
    baselineMultiplier: 1.2,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 170
  },
  far_cry_6: {
    id: 'far_cry_6',
    name: 'Far Cry 6',
    tier: 'aaa',
    baselineMultiplier: 1.1,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 180
  },
  final_fantasy_7_remake: {
    id: 'final_fantasy_7_remake',
    name: 'Final Fantasy VII Remake',
    tier: 'aaa',
    baselineMultiplier: 1.1,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 180
  },
  final_fantasy_16: {
    id: 'final_fantasy_16',
    name: 'Final Fantasy XVI',
    tier: 'aaa',
    baselineMultiplier: 1.2,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 170
  },
  forspoken: {
    id: 'forspoken',
    name: 'Forspoken',
    tier: 'aaa',
    baselineMultiplier: 1.4,
    cpuIntensive: true,
    ramMinimum: 12,
    ramRecommended: 16,
    baselineFPS: 150
  },
  ghostwire_tokyo: {
    id: 'ghostwire_tokyo',
    name: 'Ghostwire: Tokyo',
    tier: 'aaa',
    baselineMultiplier: 1.1,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 180
  },
  gotham_knights: {
    id: 'gotham_knights',
    name: 'Gotham Knights',
    tier: 'aaa',
    baselineMultiplier: 1.2,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 170
  },
  hitman_3: {
    id: 'hitman_3',
    name: 'Hitman 3',
    tier: 'aaa',
    baselineMultiplier: 1.0,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 190
  },
  horizon_forbidden_west: {
    id: 'horizon_forbidden_west',
    name: 'Horizon Forbidden West',
    tier: 'aaa',
    baselineMultiplier: 1.2,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 170
  },
  jedi_survivor: {
    id: 'jedi_survivor',
    name: 'Star Wars Jedi: Survivor',
    tier: 'aaa',
    baselineMultiplier: 1.3,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 160
  },
  lies_of_p: {
    id: 'lies_of_p',
    name: 'Lies of P',
    tier: 'aaa',
    baselineMultiplier: 1.0,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 190
  },
  lords_of_the_fallen: {
    id: 'lords_of_the_fallen',
    name: 'Lords of the Fallen',
    tier: 'aaa',
    baselineMultiplier: 1.3,
    cpuIntensive: true,
    ramMinimum: 12,
    ramRecommended: 16,
    baselineFPS: 160
  },
  marvels_spiderman_miles: {
    id: 'marvels_spiderman_miles',
    name: "Marvel's Spider-Man: Miles Morales",
    tier: 'aaa',
    baselineMultiplier: 1.2,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 170
  },
  metro_exodus: {
    id: 'metro_exodus',
    name: 'Metro Exodus',
    tier: 'aaa',
    baselineMultiplier: 1.1,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 180
  },
  plague_tale_requiem: {
    id: 'plague_tale_requiem',
    name: 'A Plague Tale: Requiem',
    tier: 'aaa',
    baselineMultiplier: 1.3,
    cpuIntensive: false,
    ramMinimum: 12,
    ramRecommended: 16,
    baselineFPS: 160
  },
  resident_evil_4_remake: {
    id: 'resident_evil_4_remake',
    name: 'Resident Evil 4 Remake',
    tier: 'aaa',
    baselineMultiplier: 1.1,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 180
  },
  resident_evil_village: {
    id: 'resident_evil_village',
    name: 'Resident Evil Village',
    tier: 'aaa',
    baselineMultiplier: 1.0,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 190
  },
  returnal: {
    id: 'returnal',
    name: 'Returnal',
    tier: 'aaa',
    baselineMultiplier: 1.2,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 170
  },
  sekiro: {
    id: 'sekiro',
    name: 'Sekiro: Shadows Die Twice',
    tier: 'aaa',
    baselineMultiplier: 0.9,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 8,
    baselineFPS: 200
  },
  shadow_of_the_tomb_raider: {
    id: 'shadow_of_the_tomb_raider',
    name: 'Shadow of the Tomb Raider',
    tier: 'aaa',
    baselineMultiplier: 1.0,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 190
  },
  star_wars_jedi_fallen: {
    id: 'star_wars_jedi_fallen',
    name: 'Star Wars Jedi: Fallen Order',
    tier: 'aaa',
    baselineMultiplier: 1.0,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 190
  },
  the_medium: {
    id: 'the_medium',
    name: 'The Medium',
    tier: 'aaa',
    baselineMultiplier: 1.2,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 170
  },
  uncharted_legacy: {
    id: 'uncharted_legacy',
    name: 'Uncharted: Legacy of Thieves Collection',
    tier: 'aaa',
    baselineMultiplier: 1.1,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 180
  },
  watch_dogs_legion: {
    id: 'watch_dogs_legion',
    name: 'Watch Dogs: Legion',
    tier: 'aaa',
    baselineMultiplier: 1.2,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 170
  },
  
  // MORE MULTIPLAYER SHOOTERS
  battlefield_v: {
    id: 'battlefield_v',
    name: 'Battlefield V',
    tier: 'multiplayer',
    baselineMultiplier: 1.1,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 180
  },
  battlefield_1: {
    id: 'battlefield_1',
    name: 'Battlefield 1',
    tier: 'multiplayer',
    baselineMultiplier: 1.0,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 190
  },
  cod_black_ops_cold_war: {
    id: 'cod_black_ops_cold_war',
    name: 'Call of Duty: Black Ops Cold War',
    tier: 'multiplayer',
    baselineMultiplier: 1.0,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 190
  },
  cod_warzone: {
    id: 'cod_warzone',
    name: 'Call of Duty: Warzone',
    tier: 'multiplayer',
    baselineMultiplier: 1.2,
    cpuIntensive: true,
    ramMinimum: 12,
    ramRecommended: 16,
    baselineFPS: 180
  },
  deep_rock_galactic: {
    id: 'deep_rock_galactic',
    name: 'Deep Rock Galactic',
    tier: 'multiplayer',
    baselineMultiplier: 0.8,
    cpuIntensive: false,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 220
  },
  insurgency_sandstorm: {
    id: 'insurgency_sandstorm',
    name: 'Insurgency: Sandstorm',
    tier: 'multiplayer',
    baselineMultiplier: 1.0,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 190
  },
  ready_or_not: {
    id: 'ready_or_not',
    name: 'Ready or Not',
    tier: 'multiplayer',
    baselineMultiplier: 1.1,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 180
  },
  squad: {
    id: 'squad',
    name: 'Squad',
    tier: 'multiplayer',
    baselineMultiplier: 1.2,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 170
  },
  titanfall_2: {
    id: 'titanfall_2',
    name: 'Titanfall 2',
    tier: 'multiplayer',
    baselineMultiplier: 0.9,
    cpuIntensive: false,
    ramMinimum: 6,
    ramRecommended: 8,
    baselineFPS: 200
  },
  
  // MORE SURVIVAL GAMES
  ark_survival_evolved: {
    id: 'ark_survival_evolved',
    name: 'ARK: Survival Evolved',
    tier: 'survival',
    baselineMultiplier: 1.3,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 160
  },
  conan_exiles: {
    id: 'conan_exiles',
    name: 'Conan Exiles',
    tier: 'survival',
    baselineMultiplier: 1.1,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 180
  },
  green_hell: {
    id: 'green_hell',
    name: 'Green Hell',
    tier: 'survival',
    baselineMultiplier: 1.0,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 190
  },
  grounded: {
    id: 'grounded',
    name: 'Grounded',
    tier: 'survival',
    baselineMultiplier: 0.9,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 8,
    baselineFPS: 200
  },
  project_zomboid: {
    id: 'project_zomboid',
    name: 'Project Zomboid',
    tier: 'survival',
    baselineMultiplier: 0.6,
    cpuIntensive: true,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 400
  },
  subnautica: {
    id: 'subnautica',
    name: 'Subnautica',
    tier: 'survival',
    baselineMultiplier: 0.9,
    cpuIntensive: false,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 200
  },
  the_forest: {
    id: 'the_forest',
    name: 'The Forest',
    tier: 'survival',
    baselineMultiplier: 1.0,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 190
  },
  valheim: {
    id: 'valheim',
    name: 'Valheim',
    tier: 'survival',
    baselineMultiplier: 0.8,
    cpuIntensive: true,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 220
  },
  v_rising: {
    id: 'v_rising',
    name: 'V Rising',
    tier: 'survival',
    baselineMultiplier: 0.9,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 200
  },
  
  // MORE RACING GAMES
  dirt_5: {
    id: 'dirt_5',
    name: 'DiRT 5',
    tier: 'racing',
    baselineMultiplier: 1.0,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 8,
    baselineFPS: 190
  },
  need_for_speed_heat: {
    id: 'need_for_speed_heat',
    name: 'Need for Speed Heat',
    tier: 'racing',
    baselineMultiplier: 1.0,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 8,
    baselineFPS: 190
  },
  trackmania: {
    id: 'trackmania',
    name: 'Trackmania',
    tier: 'racing',
    baselineMultiplier: 0.7,
    cpuIntensive: false,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 400
  },
  
  // MORE HORROR GAMES
  amnesia_the_bunker: {
    id: 'amnesia_the_bunker',
    name: 'Amnesia: The Bunker',
    tier: 'horror',
    baselineMultiplier: 0.9,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 8,
    baselineFPS: 200
  },
  outlast_trials: {
    id: 'outlast_trials',
    name: 'The Outlast Trials',
    tier: 'horror',
    baselineMultiplier: 1.0,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 190
  },
  resident_evil_2_remake: {
    id: 'resident_evil_2_remake',
    name: 'Resident Evil 2 Remake',
    tier: 'horror',
    baselineMultiplier: 0.9,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 8,
    baselineFPS: 200
  },
  resident_evil_3_remake: {
    id: 'resident_evil_3_remake',
    name: 'Resident Evil 3 Remake',
    tier: 'horror',
    baselineMultiplier: 0.9,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 8,
    baselineFPS: 200
  },
  the_evil_within_2: {
    id: 'the_evil_within_2',
    name: 'The Evil Within 2',
    tier: 'horror',
    baselineMultiplier: 1.0,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 8,
    baselineFPS: 190
  },
  
  // MORE STRATEGY GAMES
  company_of_heroes_3: {
    id: 'company_of_heroes_3',
    name: 'Company of Heroes 3',
    tier: 'strategy',
    baselineMultiplier: 1.1,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 180
  },
  crusader_kings_3: {
    id: 'crusader_kings_3',
    name: 'Crusader Kings III',
    tier: 'strategy',
    baselineMultiplier: 0.8,
    cpuIntensive: true,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 220
  },
  hearts_of_iron_4: {
    id: 'hearts_of_iron_4',
    name: 'Hearts of Iron IV',
    tier: 'strategy',
    baselineMultiplier: 0.7,
    cpuIntensive: true,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 300
  },
  stellaris: {
    id: 'stellaris',
    name: 'Stellaris',
    tier: 'strategy',
    baselineMultiplier: 0.8,
    cpuIntensive: true,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 220
  },
  
  // MORE INDIE/POPULAR GAMES
  among_us: {
    id: 'among_us',
    name: 'Among Us',
    tier: 'casual',
    baselineMultiplier: 0.3,
    cpuIntensive: false,
    ramMinimum: 2,
    ramRecommended: 4,
    baselineFPS: 600
  },
  apex_legends_mobile: {
    id: 'apex_legends_mobile',
    name: 'Apex Legends Mobile',
    tier: 'battle-royale',
    baselineMultiplier: 0.8,
    cpuIntensive: false,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 400
  },
  back_4_blood: {
    id: 'back_4_blood',
    name: 'Back 4 Blood',
    tier: 'multiplayer',
    baselineMultiplier: 1.0,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 190
  },
  borderlands_2: {
    id: 'borderlands_2',
    name: 'Borderlands 2',
    tier: 'popular',
    baselineMultiplier: 0.6,
    cpuIntensive: false,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 450
  },
  dead_island_2: {
    id: 'dead_island_2',
    name: 'Dead Island 2',
    tier: 'popular',
    baselineMultiplier: 1.1,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 180
  },
  dying_light: {
    id: 'dying_light',
    name: 'Dying Light',
    tier: 'popular',
    baselineMultiplier: 0.9,
    cpuIntensive: true,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 200
  },
  left_4_dead_2: {
    id: 'left_4_dead_2',
    name: 'Left 4 Dead 2',
    tier: 'popular',
    baselineMultiplier: 0.5,
    cpuIntensive: false,
    ramMinimum: 2,
    ramRecommended: 4,
    baselineFPS: 500
  },
  payday_2: {
    id: 'payday_2',
    name: 'Payday 2',
    tier: 'popular',
    baselineMultiplier: 0.7,
    cpuIntensive: false,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 400
  },
  terraria: {
    id: 'terraria',
    name: 'Terraria',
    tier: 'casual',
    baselineMultiplier: 0.4,
    cpuIntensive: true,
    ramMinimum: 2,
    ramRecommended: 4,
    baselineFPS: 500
  },
  vampire_survivors: {
    id: 'vampire_survivors',
    name: 'Vampire Survivors',
    tier: 'casual',
    baselineMultiplier: 0.3,
    cpuIntensive: true,
    ramMinimum: 2,
    ramRecommended: 4,
    baselineFPS: 600
  },
  warframe: {
    id: 'warframe',
    name: 'Warframe',
    tier: 'popular',
    baselineMultiplier: 0.8,
    cpuIntensive: false,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 400
  },
  world_of_warcraft: {
    id: 'world_of_warcraft',
    name: 'World of Warcraft',
    tier: 'popular',
    baselineMultiplier: 0.7,
    cpuIntensive: true,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 400
  },
  path_of_exile: {
    id: 'path_of_exile',
    name: 'Path of Exile',
    tier: 'popular',
    baselineMultiplier: 0.8,
    cpuIntensive: true,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 400
  },
  genshin_impact: {
    id: 'genshin_impact',
    name: 'Genshin Impact',
    tier: 'popular',
    baselineMultiplier: 0.9,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 200
  },
  honkai_star_rail: {
    id: 'honkai_star_rail',
    name: 'Honkai: Star Rail',
    tier: 'popular',
    baselineMultiplier: 0.8,
    cpuIntensive: false,
    ramMinimum: 6,
    ramRecommended: 8,
    baselineFPS: 400
  },
  
  // ADDITIONAL POPULAR GAMES (Batch 2)
  atomic_heart: {
    id: 'atomic_heart',
    name: 'Atomic Heart',
    tier: 'aaa',
    baselineMultiplier: 1.2,
    cpuIntensive: false,
    ramMinimum: 12,
    ramRecommended: 16,
    baselineFPS: 170
  },
  bayonetta_3: {
    id: 'bayonetta_3',
    name: 'Bayonetta 3',
    tier: 'aaa',
    baselineMultiplier: 0.9,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 8,
    baselineFPS: 200
  },
  callisto_protocol: {
    id: 'callisto_protocol',
    name: 'The Callisto Protocol',
    tier: 'aaa',
    baselineMultiplier: 1.3,
    cpuIntensive: false,
    ramMinimum: 12,
    ramRecommended: 16,
    baselineFPS: 160
  },
  chivalry_2: {
    id: 'chivalry_2',
    name: 'Chivalry 2',
    tier: 'multiplayer',
    baselineMultiplier: 1.0,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 190
  },
  darktide: {
    id: 'darktide',
    name: 'Warhammer 40,000: Darktide',
    tier: 'multiplayer',
    baselineMultiplier: 1.2,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 170
  },
  dead_space_remake: {
    id: 'dead_space_remake',
    name: 'Dead Space Remake',
    tier: 'aaa',
    baselineMultiplier: 1.3,
    cpuIntensive: false,
    ramMinimum: 12,
    ramRecommended: 16,
    baselineFPS: 160
  },
  deathloop: {
    id: 'deathloop',
    name: 'Deathloop',
    tier: 'aaa',
    baselineMultiplier: 1.1,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 180
  },
  destroy_all_humans_2: {
    id: 'destroy_all_humans_2',
    name: 'Destroy All Humans! 2',
    tier: 'popular',
    baselineMultiplier: 0.8,
    cpuIntensive: false,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 220
  },
  doom_eternal: {
    id: 'doom_eternal',
    name: 'DOOM Eternal',
    tier: 'aaa',
    baselineMultiplier: 0.9,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 8,
    baselineFPS: 200
  },
  dying_light_2_stay_human: {
    id: 'dying_light_2_stay_human',
    name: 'Dying Light 2: Stay Human',
    tier: 'aaa',
    baselineMultiplier: 1.2,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 170
  },
  evil_west: {
    id: 'evil_west',
    name: 'Evil West',
    tier: 'aaa',
    baselineMultiplier: 1.0,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 190
  },
  f1_23: {
    id: 'f1_23',
    name: 'F1 23',
    tier: 'racing',
    baselineMultiplier: 1.0,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 190
  },
  far_cry_5: {
    id: 'far_cry_5',
    name: 'Far Cry 5',
    tier: 'aaa',
    baselineMultiplier: 1.0,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 8,
    baselineFPS: 190
  },
  for_honor: {
    id: 'for_honor',
    name: 'For Honor',
    tier: 'multiplayer',
    baselineMultiplier: 0.9,
    cpuIntensive: false,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 200
  },
  ghost_recon_breakpoint: {
    id: 'ghost_recon_breakpoint',
    name: 'Tom Clancy\'s Ghost Recon Breakpoint',
    tier: 'multiplayer',
    baselineMultiplier: 1.1,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 180
  },
  ghost_recon_wildlands: {
    id: 'ghost_recon_wildlands',
    name: 'Tom Clancy\'s Ghost Recon Wildlands',
    tier: 'multiplayer',
    baselineMultiplier: 1.0,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 190
  },
  high_on_life: {
    id: 'high_on_life',
    name: 'High on Life',
    tier: 'popular',
    baselineMultiplier: 1.0,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 190
  },
  immortals_fenyx_rising: {
    id: 'immortals_fenyx_rising',
    name: 'Immortals Fenyx Rising',
    tier: 'aaa',
    baselineMultiplier: 1.0,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 8,
    baselineFPS: 190
  },
  kena_bridge_of_spirits: {
    id: 'kena_bridge_of_spirits',
    name: 'Kena: Bridge of Spirits',
    tier: 'aaa',
    baselineMultiplier: 1.1,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 180
  },
  lego_star_wars_skywalker: {
    id: 'lego_star_wars_skywalker',
    name: 'LEGO Star Wars: The Skywalker Saga',
    tier: 'popular',
    baselineMultiplier: 0.8,
    cpuIntensive: false,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 220
  },
  mafia_definitive: {
    id: 'mafia_definitive',
    name: 'Mafia: Definitive Edition',
    tier: 'aaa',
    baselineMultiplier: 1.0,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 8,
    baselineFPS: 190
  },
  marvels_guardians_galaxy: {
    id: 'marvels_guardians_galaxy',
    name: 'Marvel\'s Guardians of the Galaxy',
    tier: 'aaa',
    baselineMultiplier: 1.1,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 180
  },
  mass_effect_legendary: {
    id: 'mass_effect_legendary',
    name: 'Mass Effect: Legendary Edition',
    tier: 'aaa',
    baselineMultiplier: 0.9,
    cpuIntensive: false,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 200
  },
  monster_hunter_rise: {
    id: 'monster_hunter_rise',
    name: 'Monster Hunter Rise',
    tier: 'popular',
    baselineMultiplier: 0.9,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 8,
    baselineFPS: 200
  },
  monster_hunter_world: {
    id: 'monster_hunter_world',
    name: 'Monster Hunter: World',
    tier: 'popular',
    baselineMultiplier: 1.0,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 8,
    baselineFPS: 190
  },
  need_for_speed_unbound: {
    id: 'need_for_speed_unbound',
    name: 'Need for Speed Unbound',
    tier: 'racing',
    baselineMultiplier: 1.1,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 180
  },
  nioh_2: {
    id: 'nioh_2',
    name: 'Nioh 2',
    tier: 'aaa',
    baselineMultiplier: 1.0,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 8,
    baselineFPS: 190
  },
  outer_worlds: {
    id: 'outer_worlds',
    name: 'The Outer Worlds',
    tier: 'aaa',
    baselineMultiplier: 0.9,
    cpuIntensive: false,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 200
  },
  persona_5_royal: {
    id: 'persona_5_royal',
    name: 'Persona 5 Royal',
    tier: 'popular',
    baselineMultiplier: 0.7,
    cpuIntensive: false,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 300
  },
  plague_tale_innocence: {
    id: 'plague_tale_innocence',
    name: 'A Plague Tale: Innocence',
    tier: 'aaa',
    baselineMultiplier: 1.0,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 8,
    baselineFPS: 190
  },
  redfall: {
    id: 'redfall',
    name: 'Redfall',
    tier: 'multiplayer',
    baselineMultiplier: 1.2,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 170
  },
  remnant_2: {
    id: 'remnant_2',
    name: 'Remnant 2',
    tier: 'popular',
    baselineMultiplier: 1.1,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 180
  },
  resident_evil_7: {
    id: 'resident_evil_7',
    name: 'Resident Evil 7: Biohazard',
    tier: 'horror',
    baselineMultiplier: 0.9,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 8,
    baselineFPS: 200
  },
  saints_row: {
    id: 'saints_row',
    name: 'Saints Row',
    tier: 'popular',
    baselineMultiplier: 1.1,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 180
  },
  scp_secret_laboratory: {
    id: 'scp_secret_laboratory',
    name: 'SCP: Secret Laboratory',
    tier: 'multiplayer',
    baselineMultiplier: 0.7,
    cpuIntensive: false,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 400
  },
  sea_of_thieves: {
    id: 'sea_of_thieves',
    name: 'Sea of Thieves',
    tier: 'multiplayer',
    baselineMultiplier: 0.9,
    cpuIntensive: false,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 200
  },
  sniper_elite_5: {
    id: 'sniper_elite_5',
    name: 'Sniper Elite 5',
    tier: 'popular',
    baselineMultiplier: 1.0,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 8,
    baselineFPS: 190
  },
  sonic_frontiers: {
    id: 'sonic_frontiers',
    name: 'Sonic Frontiers',
    tier: 'popular',
    baselineMultiplier: 0.9,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 8,
    baselineFPS: 200
  },
  stray: {
    id: 'stray',
    name: 'Stray',
    tier: 'popular',
    baselineMultiplier: 0.9,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 8,
    baselineFPS: 200
  },
  street_fighter_6: {
    id: 'street_fighter_6',
    name: 'Street Fighter 6',
    tier: 'competitive',
    baselineMultiplier: 0.8,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 8,
    baselineFPS: 400
  },
  tekken_8: {
    id: 'tekken_8',
    name: 'Tekken 8',
    tier: 'competitive',
    baselineMultiplier: 0.9,
    cpuIntensive: false,
    ramMinimum: 8,
    ramRecommended: 8,
    baselineFPS: 380
  },
  tiny_tinas_wonderlands: {
    id: 'tiny_tinas_wonderlands',
    name: 'Tiny Tina\'s Wonderlands',
    tier: 'popular',
    baselineMultiplier: 1.0,
    cpuIntensive: false,
    ramMinimum: 6,
    ramRecommended: 8,
    baselineFPS: 190
  },
  total_war_three_kingdoms: {
    id: 'total_war_three_kingdoms',
    name: 'Total War: Three Kingdoms',
    tier: 'strategy',
    baselineMultiplier: 1.1,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 180
  },
  trackmania_2020: {
    id: 'trackmania_2020',
    name: 'Trackmania (2020)',
    tier: 'racing',
    baselineMultiplier: 0.6,
    cpuIntensive: false,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 500
  },
  vampire_the_masquerade_bloodhunt: {
    id: 'vampire_the_masquerade_bloodhunt',
    name: 'Vampire: The Masquerade - Bloodhunt',
    tier: 'battle-royale',
    baselineMultiplier: 1.0,
    cpuIntensive: true,
    ramMinimum: 8,
    ramRecommended: 16,
    baselineFPS: 190
  },
  wwe_2k23: {
    id: 'wwe_2k23',
    name: 'WWE 2K23',
    tier: 'sports',
    baselineMultiplier: 0.9,
    cpuIntensive: false,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 200
  },
  xcom_2: {
    id: 'xcom_2',
    name: 'XCOM 2',
    tier: 'strategy',
    baselineMultiplier: 0.8,
    cpuIntensive: true,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 220
  },
  yakuza_like_a_dragon: {
    id: 'yakuza_like_a_dragon',
    name: 'Yakuza: Like a Dragon',
    tier: 'popular',
    baselineMultiplier: 0.9,
    cpuIntensive: false,
    ramMinimum: 4,
    ramRecommended: 8,
    baselineFPS: 200
  }
};

// Legacy gameBaselines for backward compatibility (calculated from gamesDatabase)
const gameBaselines = {};
Object.keys(gamesDatabase).forEach(gameId => {
  const game = gamesDatabase[gameId];
  gameBaselines[game.name] = game.baselineFPS;
});

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
// Generated from gamesDatabase
const gameCPUScaling = {};
Object.keys(gamesDatabase).forEach(gameId => {
  const game = gamesDatabase[gameId];
  // Map cpuIntensive to scaling factor
  gameCPUScaling[game.name] = game.cpuIntensive ? 0.45 : 0.25;
});

/**
 * Performance Database Structure
 */
const performanceDatabase = {
  gpus: {},
  cpus: {},
  games: Object.keys(gamesDatabase).map(id => gamesDatabase[id].name),
  gamesDatabase: gamesDatabase, // Full game database with metadata
  
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
    
    Object.keys(gamesDatabase).forEach(gameId => {
      const game = gamesDatabase[gameId];
      const gameName = game.name;
      const baseline = game.baselineFPS;
      const gpuMultiplier = gpuScore / 100;
      // Apply game-specific baseline multiplier
      const adjustedBaseline = baseline * game.baselineMultiplier;
      
      games[gameName] = {
        "1080p": {
          low: Math.round(adjustedBaseline * gpuMultiplier * settingsMultipliers.low * 0.9),
          medium: Math.round(adjustedBaseline * gpuMultiplier * settingsMultipliers.medium * 0.9),
          high: Math.round(adjustedBaseline * gpuMultiplier * settingsMultipliers.high * 0.9),
          ultra: Math.round(adjustedBaseline * gpuMultiplier * 0.9)
        },
        "1440p": {
          low: Math.round(adjustedBaseline * gpuMultiplier * resolutionMultipliers["1440p"] * settingsMultipliers.low * 0.9),
          medium: Math.round(adjustedBaseline * gpuMultiplier * resolutionMultipliers["1440p"] * settingsMultipliers.medium * 0.9),
          high: Math.round(adjustedBaseline * gpuMultiplier * resolutionMultipliers["1440p"] * settingsMultipliers.high * 0.9),
          ultra: Math.round(adjustedBaseline * gpuMultiplier * resolutionMultipliers["1440p"] * 0.9)
        },
        "4k": {
          low: Math.round(adjustedBaseline * gpuMultiplier * resolutionMultipliers["4k"] * settingsMultipliers.low * 0.9),
          medium: Math.round(adjustedBaseline * gpuMultiplier * resolutionMultipliers["4k"] * settingsMultipliers.medium * 0.9),
          high: Math.round(adjustedBaseline * gpuMultiplier * resolutionMultipliers["4k"] * settingsMultipliers.high * 0.9),
          ultra: Math.round(adjustedBaseline * gpuMultiplier * resolutionMultipliers["4k"] * 0.9)
        }
      };
    });
    
    return games;
  },
  
  // Get game by ID or name
  getGame(gameIdOrName) {
    // Try by ID first
    if (gamesDatabase[gameIdOrName]) {
      return gamesDatabase[gameIdOrName];
    }
    // Try by name
    const game = Object.values(gamesDatabase).find(g => g.name === gameIdOrName);
    return game || null;
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

function getGameData(gameName) {
  // Try exact match first
  if (gamesDatabase[gameName]) {
    return gamesDatabase[gameName];
  }
  
  // Try matching by display name
  const gameKey = Object.keys(gamesDatabase).find(key => {
    const game = gamesDatabase[key];
    return game.name && (
      game.name.toLowerCase() === gameName.toLowerCase() ||
      game.name.toLowerCase().includes(gameName.toLowerCase()) ||
      gameName.toLowerCase().includes(game.name.toLowerCase())
    );
  });
  
  if (gameKey) {
    return gamesDatabase[gameKey];
  }
  
  // Return default if no match
  return null;
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
  // Find game in database
  const gameData = performanceDatabase.getGame(game);
  let baseline = 150;
  let baselineMultiplier = 1.0;
  
  if (gameData) {
    baseline = gameData.baselineFPS;
    baselineMultiplier = gameData.baselineMultiplier;
  } else {
    // Fallback to legacy gameBaselines
    baseline = gameBaselines[game] || 150;
  }
  
  const resMulti = resolutionMultipliers[resolution] || 1.0;
  const setMulti = settingsMultipliers[settings] || 1.0;
  
  // Apply baseline multiplier for game demand
  const adjustedBaseline = baseline * baselineMultiplier;
  const result = Math.round(adjustedBaseline * (gpuScore / 100) * resMulti * setMulti * 0.9);
  console.log('estimateFPS:', { gpu, game, resolution, settings, gpuScore, baseline, baselineMultiplier, adjustedBaseline, resMulti, setMulti, result });
  
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
  
  // Apply RAM scaling based on game-specific requirements
  const ramAmount = parseInt(ram);
  const gameData = getGameData(game);
  let ramMultiplier = 1.0;
  
  if (gameData && gameData.ramMinimum && gameData.ramRecommended) {
    const minRAM = gameData.ramMinimum;
    const recRAM = gameData.ramRecommended;
    
    if (ramAmount < minRAM) {
      // Severe penalty for RAM below minimum
      ramMultiplier = 0.60; // -40% FPS
      console.log('RAM below minimum:', { ramAmount, minRAM, penalty: '-40%' });
    } else if (ramAmount < recRAM) {
      // Moderate penalty for RAM below recommended
      ramMultiplier = 0.85; // -15% FPS
      console.log('RAM below recommended:', { ramAmount, recRAM, penalty: '-15%' });
    } else {
      // No penalty if RAM meets or exceeds recommended
      console.log('RAM meets requirements:', { ramAmount, recRAM });
    }
    
    // Additional penalty for 4K with lower RAM (high memory usage)
    if (resolution === "4k" && ramAmount < 16) {
      ramMultiplier *= 0.90; // Additional -10% penalty
      console.log('4K with low RAM: additional penalty applied');
    }
    
    baseFPS = Math.round(baseFPS * ramMultiplier);
    console.log('After RAM scaling:', { ramAmount, ramMultiplier, baseFPS });
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