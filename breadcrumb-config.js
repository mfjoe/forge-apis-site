// Breadcrumb Configuration - Single Source of Truth for All Breadcrumb Paths
// Automatically generates breadcrumbs based on page path

const breadcrumbConfig = {
  // Default breadcrumb structure
  default: [
    { name: "Home", url: "/" }
  ],
  
  // Custom breadcrumb paths for specific pages
  customPaths: {
    // Root level pages
    "/": [],
    "/terms.html": [{ name: "Home", url: "/" }, { name: "Terms of Service" }],
    "/privacy.html": [{ name: "Home", url: "/" }, { name: "Privacy Policy" }],
    "/cookies.html": [{ name: "Home", url: "/" }, { name: "Cookie Policy" }],
    
    // Gaming Calculators
    "/gaming-calculators/": [{ name: "Home", url: "/" }, { name: "Gaming Calculators" }],
    "/gaming-calculators/robux/": [{ name: "Home", url: "/" }, { name: "Gaming Calculators", url: "/gaming-calculators/" }, { name: "Robux Calculator" }],
    "/gaming-calculators/robux/guide.html": [{ name: "Home", url: "/" }, { name: "Gaming Calculators", url: "/gaming-calculators/" }, { name: "Robux Calculator", url: "/gaming-calculators/robux/" }, { name: "Guide" }],
    "/gaming-calculators/robux/tax-calculator.html": [{ name: "Home", url: "/" }, { name: "Gaming Calculators", url: "/gaming-calculators/" }, { name: "Robux Calculator", url: "/gaming-calculators/robux/" }, { name: "Tax Calculator" }],
    "/gaming-calculators/vbucks/": [{ name: "Home", url: "/" }, { name: "Gaming Calculators", url: "/gaming-calculators/" }, { name: "V-Bucks Calculator" }],
    "/gaming-calculators/vbucks/guide.html": [{ name: "Home", url: "/" }, { name: "Gaming Calculators", url: "/gaming-calculators/" }, { name: "V-Bucks Calculator", url: "/gaming-calculators/vbucks/" }, { name: "Guide" }],
    "/gaming-calculators/minecoins/": [{ name: "Home", url: "/" }, { name: "Gaming Calculators", url: "/gaming-calculators/" }, { name: "Minecoins Calculator" }],
    "/gaming-calculators/minecoins/guide.html": [{ name: "Home", url: "/" }, { name: "Gaming Calculators", url: "/gaming-calculators/" }, { name: "Minecoins Calculator", url: "/gaming-calculators/minecoins/" }, { name: "Guide" }],
    "/gaming-calculators/fifa-points/": [{ name: "Home", url: "/" }, { name: "Gaming Calculators", url: "/gaming-calculators/" }, { name: "FIFA Points Calculator" }],
    "/gaming-calculators/fifa-points/guide.html": [{ name: "Home", url: "/" }, { name: "Gaming Calculators", url: "/gaming-calculators/" }, { name: "FIFA Points Calculator", url: "/gaming-calculators/fifa-points/" }, { name: "Guide" }],
    "/gaming-calculators/cod-points/": [{ name: "Home", url: "/" }, { name: "Gaming Calculators", url: "/gaming-calculators/" }, { name: "COD Points Calculator" }],
    "/gaming-calculators/cod-points/guide.html": [{ name: "Home", url: "/" }, { name: "Gaming Calculators", url: "/gaming-calculators/" }, { name: "COD Points Calculator", url: "/gaming-calculators/cod-points/" }, { name: "Guide" }],
    "/gaming-calculators/apex-coins/": [{ name: "Home", url: "/" }, { name: "Gaming Calculators", url: "/gaming-calculators/" }, { name: "Apex Coins Calculator" }],
    "/gaming-calculators/apex-coins/guide.html": [{ name: "Home", url: "/" }, { name: "Gaming Calculators", url: "/gaming-calculators/" }, { name: "Apex Coins Calculator", url: "/gaming-calculators/apex-coins/" }, { name: "Guide" }],
    "/gaming-calculators/guides/comparison.html": [{ name: "Home", url: "/" }, { name: "Gaming Calculators", url: "/gaming-calculators/" }, { name: "Guide" }],
    "/gaming-calculators/guides/parents-guide.html": [{ name: "Home", url: "/" }, { name: "Gaming Calculators", url: "/gaming-calculators/" }, { name: "Parents Guide" }],
    
    // Gaming Tools
    "/dpi-calculator/": [{ name: "Home", url: "/" }, { name: "DPI Calculator" }],
    "/monitor-calculator/": [{ name: "Home", url: "/" }, { name: "Monitor Calculator" }],
    "/fps-calculator/": [{ name: "Home", url: "/" }, { name: "FPS Calculator" }],
    
    // Financial Tools
    "/gst-calculator/": [{ name: "Home", url: "/" }, { name: "GST Calculator" }],
    "/gst-calculator/guide.html": [{ name: "Home", url: "/" }, { name: "GST Calculator", url: "/gst-calculator/" }, { name: "Guide" }],
    "/tip-calculator/": [{ name: "Home", url: "/" }, { name: "Tip Calculator" }],
    "/va-calculator/": [{ name: "Home", url: "/" }, { name: "VA Disability Calculator" }],
    "/va-calculator/guide.html": [{ name: "Home", url: "/" }, { name: "VA Disability Calculator", url: "/va-calculator/" }, { name: "Guide" }],
    
    // API Products
    "/riskscore/": [{ name: "Home", url: "/" }, { name: "RiskScore API" }],
    "/dupecheck/": [{ name: "Home", url: "/" }, { name: "DupeCheck API" }]
  },
  
  // Category mappings for auto-generation
  categories: {
    "gaming-calculators": { name: "Gaming Calculators", url: "/gaming-calculators/" },
    "gaming-calculators/guides": { name: "Gaming Calculators", url: "/gaming-calculators/" },
    "dpi-calculator": { name: "Gaming Tools", url: "/" },
    "monitor-calculator": { name: "Gaming Tools", url: "/" },
    "fps-calculator": { name: "Gaming Tools", url: "/" },
    "gst-calculator": { name: "Financial Tools", url: "/" },
    "tip-calculator": { name: "Financial Tools", url: "/" },
    "va-calculator": { name: "Financial Tools", url: "/" }
  }
};

