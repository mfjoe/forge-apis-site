// footer-config.js - Configuration for footer content
// This file should be customized for each site

const FOOTER_CONFIG = {
  // Brand Information
  brand: {
    name: "Forge APIs",
    tagline: "PRODUCTION-READY APIS",
    description: "Professional gaming tools and calculators. 100% free, privacy-focused, no data collection."
  },

  // Footer Columns Configuration
  columns: [
    {
      title: "Gaming Tools",
      links: [
        { text: "DPI Calculator", url: "/dpi-calculator/" },
        { text: "Robux Calculator", url: "/gaming-calculators/robux/" },
        { text: "V-Bucks Calculator", url: "/gaming-calculators/vbucks/" },
        { text: "Minecoins Calculator", url: "/gaming-calculators/minecoins/" },
        { text: "FIFA Points Calculator", url: "/gaming-calculators/fifa-points/" },
        { text: "All Gaming Calculators", url: "/gaming-calculators/" }
      ]
    },
    {
      title: "Business Tools",
      links: [
        { text: "GST Calculator", url: "/gst-calculator/" },
        { text: "VA Disability Calculator", url: "/va-disability-calculator/" },
        { text: "API Documentation", url: "/docs/" }
      ]
    },
    {
      title: "Company",
      links: [
        { text: "About Us", url: "/about/" },
        { text: "Contact", url: "/contact/" },
        { text: "Privacy Policy", url: "/privacy/" },
        { text: "Terms of Service", url: "/terms/" }
      ]
    }
  ],

  // Social Media Links (optional)
  social: {
    twitter: "https://twitter.com/forgeapis",
    github: "https://github.com/forgeapis",
    // Add more as needed: linkedin, facebook, etc.
  },

  // Copyright Information
  copyright: {
    year: new Date().getFullYear(), // Auto-updates to current year
    entity: "Forge APIs",
    allRightsReserved: true
  },

  // Additional Footer Links (appear in bottom bar)
  bottomLinks: [
    { text: "Privacy Policy", url: "/privacy/" },
    { text: "Terms", url: "/terms/" },
    { text: "Contact", url: "/contact/" }
  ]
};

// Make config globally available
if (typeof window !== 'undefined') {
  window.FOOTER_CONFIG = FOOTER_CONFIG;
}