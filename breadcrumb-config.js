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
    "/gaming-calculators/guides/comparison.html": [{ name: "Home", url: "/" }, { name: "Gaming Calculators", url: "/gaming-calculators/" }, { name: "Guide" }],
    "/gaming-calculators/guides/parents-guide.html": [{ name: "Home", url: "/" }, { name: "Gaming Calculators", url: "/gaming-calculators/" }, { name: "Parents Guide" }],
    
    // Gaming Tools
    "/gaming-currency-converter/": [{ name: "Home", url: "/" }, { name: "Calculators", url: "/" }, { name: "Gaming Currency Converter" }],
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

