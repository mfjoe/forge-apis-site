// Footer Configuration - Single Source of Truth for All Footer Links
// Update this file when adding new tools/categories

const footerConfig = {
  brand: {
    name: "Forge APIs",
    tagline: "Production-ready APIs for modern applications.",
    logo: {
      enabled: true,
      href: "/"
    }
  },
  
  tools: {
    gaming: {
      title: "Gaming Tools",
      items: [
        { name: "FPS Calculator", url: "/fps-calculator/", icon: "⚡" },
        { name: "Monitor Calculator", url: "/monitor-calculator/", icon: "🖥️" },
        { name: "DPI Calculator", url: "/dpi-calculator/", icon: "🖱️" },
        { name: "Gaming Currency Calculators", url: "/gaming-calculators/", icon: "💎" }
      ]
    },
    financial: {
      title: "Financial Tools",
      items: [
        { name: "GST Calculator India", url: "/gst-calculator/", icon: "🧮" },
        { name: "Restaurant Tip Calculator", url: "/tip-calculator/", icon: "💰" },
        { name: "VA Disability Benefits Calculator", url: "/va-calculator/", icon: "🎖️" }
      ]
    },
    apis: {
      title: "Premium APIs",
      items: [
        { name: "RiskScore API", url: "/riskscore/", icon: "🔒" },
        { name: "DupeCheck", url: "/dupecheck/", icon: "🔍" }
      ]
    }
  },
  
  company: {
    title: "Company",
    items: [
      { name: "Forge APIs", url: "https://forgeapis.com" },
      { name: "Contact Us", url: "mailto:hello@forgeapis.com" }
    ]
  },
  
  legal: {
    title: "Legal",
    items: [
      { name: "Privacy Policy", url: "/privacy.html" },
      { name: "Cookie Policy", url: "/cookies.html" },
      { name: "Terms of Service", url: "/terms.html" }
    ]
  },
  
  bottom: {
    copyright: `© ${new Date().getFullYear()} Forge APIs. All rights reserved.`,
    tagline: "Building the future of APIs, one endpoint at a time.",
    contact: {
      text: "📧 Contact Us",
      url: "mailto:hello@forgeapis.com"
    }
  }
};

