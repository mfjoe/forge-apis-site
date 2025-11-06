// Navbar Configuration - Single Source of Truth for All Navbar Links
// Update this file when adding new navigation links

const navbarConfig = {
  logo: {
    href: "/",
    svg: `
      <svg width="240" height="80" viewBox="0 0 240 80" xmlns="http://www.w3.org/2000/svg">
        <!-- Digital/Tech Anvil with Crossed Hammers -->
        <g transform="translate(15, 15)">
          <!-- Digital Anvil (geometric/tech style) -->
          <path d="M 15 35 L 12 40 L 48 40 L 45 35 Z" fill="#1E293B" stroke="#0066FF" stroke-width="0.5"/>
          <rect x="18" y="30" width="24" height="5" fill="#334155" rx="1"/>
          <rect x="16" y="28" width="28" height="2" fill="#475569"/>
          <!-- Tech pattern on anvil -->
          <line x1="20" y1="32" x2="40" y2="32" stroke="#0066FF" stroke-width="0.5" opacity="0.6"/>
          <line x1="22" y1="34" x2="38" y2="34" stroke="#00D4AA" stroke-width="0.5" opacity="0.6"/>
          <!-- Crossed Hammers (geometric style) -->
          <!-- Left hammer -->
          <g transform="rotate(-30 30 25)">
            <rect x="28" y="15" width="4" height="18" fill="#0066FF" rx="0.5"/>
            <path d="M 25 12 L 35 12 L 36 16 L 24 16 Z" fill="#0052CC"/>
            <rect x="24" y="13" width="2" height="2" fill="#00D4AA"/>
            <rect x="34" y="13" width="2" height="2" fill="#00D4AA"/>
          </g>
          <!-- Right hammer -->
          <g transform="rotate(30 30 25)">
            <rect x="28" y="15" width="4" height="18" fill="#0066FF" rx="0.5"/>
            <path d="M 25 12 L 35 12 L 36 16 L 24 16 Z" fill="#0052CC"/>
            <rect x="24" y="13" width="2" height="2" fill="#00D4AA"/>
            <rect x="34" y="13" width="2" height="2" fill="#00D4AA"/>
          </g>
          <!-- Digital Fire/Energy (geometric flames) -->
          <path d="M 28 10 L 30 5 L 31 8 L 33 3 L 33 10 L 31 8 L 29 11 Z" fill="#FF6B35" opacity="0.9"/>
          <path d="M 26 12 L 27 9 L 28 11 L 29 8 L 29 13 Z" fill="#FFA500" opacity="0.8"/>
          <path d="M 31 12 L 32 9 L 33 11 L 34 8 L 34 13 Z" fill="#FFA500" opacity="0.8"/>
          <!-- Tech sparks (pixels) -->
          <rect x="12" y="20" width="2" height="2" fill="#00D4AA" opacity="0.8"/>
          <rect x="46" y="20" width="2" height="2" fill="#00D4AA" opacity="0.8"/>
          <rect x="10" y="25" width="1.5" height="1.5" fill="#FFD700" opacity="0.7"/>
          <rect x="48" y="25" width="1.5" height="1.5" fill="#FFD700" opacity="0.7"/>
        </g>
        <!-- Text: Forge -->
        <text x="75" y="45" font-family="Inter, system-ui, -apple-system, sans-serif" font-size="28" font-weight="800" fill="#0A0E27">Forge</text>
        <!-- Text: APIs -->
        <text x="150" y="45" font-family="Inter, system-ui, -apple-system, sans-serif" font-size="28" font-weight="400" fill="#6B7280">APIs</text>
        <!-- Tagline -->
        <text x="75" y="63" font-family="Inter, system-ui, -apple-system, sans-serif" font-size="9" fill="#9CA3AF" letter-spacing="0.5">PRODUCTION-READY APIS</text>
      </svg>
    `
  },
  links: [
    { name: "Calculators", url: "#calculators" },
    { name: "Pro Settings", url: "#pro-settings" },
    { name: "FAQ", url: "#faq" }
  ],
  mobileMenu: {
    sections: [
      {
        title: "Free Tools",
        links: [
          { name: "FPS Calculator", url: "/fps-calculator/" },
          { name: "Monitor Calculator", url: "/monitor-calculator/" },
          { name: "DPI Calculator", url: "/dpi-calculator/" },
          { name: "GST Calculator India", url: "/gst-calculator/" },
          { name: "Gaming Currency Calculators", url: "/gaming-calculators/" },
          { name: "VA Disability Benefits Calculator", url: "/va-calculator/" },
          { name: "Restaurant Tip Calculator", url: "/tip-calculator/" }
        ]
      }
    ]
  }
};

