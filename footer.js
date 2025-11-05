// Footer Generator - Dynamically creates footer from footer-config.js

(function() {
  'use strict';
  
  // Wait for config to be available
  if (typeof footerConfig === 'undefined') {
    console.error('footer-config.js must be loaded before footer.js');
    return;
  }
  
  function generateFooter() {
    const config = footerConfig;
    
    // Generate logo SVG (same as in index.html)
    const logoSVG = `
      <svg width="300" height="100" viewBox="0 0 240 80" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(15, 15)">
          <path d="M 15 35 L 12 40 L 48 40 L 45 35 Z" fill="#1E293B" stroke="#0066FF" stroke-width="0.5"/>
          <rect x="18" y="30" width="24" height="5" fill="#334155" rx="1"/>
          <rect x="16" y="28" width="28" height="2" fill="#475569"/>
          <line x1="20" y1="32" x2="40" y2="32" stroke="#0066FF" stroke-width="0.5" opacity="0.6"/>
          <line x1="22" y1="34" x2="38" y2="34" stroke="#00D4AA" stroke-width="0.5" opacity="0.6"/>
          <g transform="rotate(-30 30 25)">
            <rect x="28" y="15" width="4" height="18" fill="#0066FF" rx="0.5"/>
            <path d="M 25 12 L 35 12 L 36 16 L 24 16 Z" fill="#0052CC"/>
            <rect x="24" y="13" width="2" height="2" fill="#00D4AA"/>
            <rect x="34" y="13" width="2" height="2" fill="#00D4AA"/>
          </g>
          <g transform="rotate(30 30 25)">
            <rect x="28" y="15" width="4" height="18" fill="#0066FF" rx="0.5"/>
            <path d="M 25 12 L 35 12 L 36 16 L 24 16 Z" fill="#0052CC"/>
            <rect x="24" y="13" width="2" height="2" fill="#00D4AA"/>
            <rect x="34" y="13" width="2" height="2" fill="#00D4AA"/>
          </g>
          <path d="M 28 10 L 30 5 L 31 8 L 33 3 L 33 10 L 31 8 L 29 11 Z" fill="#FF6B35" opacity="0.9"/>
          <path d="M 26 12 L 27 9 L 28 11 L 29 8 L 29 13 Z" fill="#FFA500" opacity="0.8"/>
          <path d="M 31 12 L 32 9 L 33 11 L 34 8 L 34 13 Z" fill="#FFA500" opacity="0.8"/>
          <rect x="12" y="20" width="2" height="2" fill="#00D4AA" opacity="0.8"/>
          <rect x="46" y="20" width="2" height="2" fill="#00D4AA" opacity="0.8"/>
          <rect x="10" y="25" width="1.5" height="1.5" fill="#FFD700" opacity="0.7"/>
          <rect x="48" y="25" width="1.5" height="1.5" fill="#FFD700" opacity="0.7"/>
        </g>
        <text x="75" y="45" font-family="Inter, system-ui, -apple-system, sans-serif" font-size="28" font-weight="800" fill="#FFFFFF">Forge</text>
        <text x="150" y="45" font-family="Inter, system-ui, -apple-system, sans-serif" font-size="28" font-weight="400" fill="#9CA3AF">APIs</text>
        <text x="75" y="63" font-family="Inter, system-ui, -apple-system, sans-serif" font-size="9" fill="#9CA3AF" letter-spacing="0.5">PRODUCTION-READY APIS</text>
      </svg>
    `;
    
    // Generate tools section HTML
    function generateToolsSection() {
      let html = '<div class="footer-column"><h4>Products</h4>';
      
      // Premium APIs
      if (config.tools.apis && config.tools.apis.items.length > 0) {
        html += '<div class="footer-subsection"><h5>Premium APIs</h5>';
        config.tools.apis.items.forEach(item => {
          html += `<a href="${item.url}">${item.name}</a>`;
        });
        html += '</div>';
      }
      
      // Free Tools section (combines gaming and financial tools)
      let hasFreeTools = (config.tools.gaming && config.tools.gaming.items.length > 0) || 
                         (config.tools.financial && config.tools.financial.items.length > 0);
      
      if (hasFreeTools) {
        html += '<div class="footer-subsection"><h5>Free Tools</h5>';
        
        // Gaming Tools
        if (config.tools.gaming && config.tools.gaming.items.length > 0) {
          config.tools.gaming.items.forEach(item => {
            html += `<a href="${item.url}">${item.name}</a>`;
          });
        }
        
        // Financial Tools
        if (config.tools.financial && config.tools.financial.items.length > 0) {
          config.tools.financial.items.forEach(item => {
            html += `<a href="${item.url}">${item.name}</a>`;
          });
        }
        
        html += '</div>';
      }
      
      html += '</div>';
      return html;
    }
    
    // Generate company section
    function generateCompanySection() {
      let html = '<div class="footer-column"><h4>Company</h4>';
      config.company.items.forEach(item => {
        html += `<a href="${item.url}">${item.name}</a>`;
      });
      html += '</div>';
      return html;
    }
    
    // Generate legal section
    function generateLegalSection() {
      let html = '<div class="footer-column"><h4>Legal</h4>';
      config.legal.items.forEach(item => {
        html += `<a href="${item.url}">${item.name}</a>`;
      });
      html += '</div>';
      return html;
    }
    
    // Build complete footer HTML
    const footerHTML = `
      <footer class="footer">
        <div class="container">
          <div class="footer-content">
            <div class="footer-brand">
              <a href="${config.brand.logo.href || '/'}" class="logo">
                ${logoSVG}
              </a>
              <p>${config.brand.tagline}</p>
              <p style="margin-top: 20px">${config.bottom.copyright}</p>
            </div>
            
            <div class="footer-links">
              ${generateToolsSection()}
              ${generateCompanySection()}
              ${generateLegalSection()}
            </div>
          </div>
          
          <div class="footer-bottom">
            <div class="footer-bottom-left">
              <p>${config.bottom.copyright}</p>
              <p class="footer-note">${config.bottom.tagline}</p>
            </div>
            <div class="footer-bottom-right">
              <a href="${config.bottom.contact.url}" class="footer-contact-link">
                ${config.bottom.contact.text}
              </a>
            </div>
          </div>
        </div>
      </footer>
    `;
    
    return footerHTML;
  }
  
  // Insert footer when DOM is ready
  function initFooter() {
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
      footerContainer.innerHTML = generateFooter();
    } else {
      // If no container, try to find existing footer and replace it
      const existingFooter = document.querySelector('footer.footer');
      if (existingFooter) {
        existingFooter.outerHTML = generateFooter();
      } else {
        // Insert at end of body
        document.body.insertAdjacentHTML('beforeend', generateFooter());
      }
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooter);
  } else {
    initFooter();
  }
})();

