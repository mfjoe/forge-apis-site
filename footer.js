// footer.js - Universal footer generator
// Works with footer-config.js to generate consistent footers across all sites

(function() {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooter);
  } else {
    initFooter();
  }

  function initFooter() {
    // Check if config is loaded
    if (typeof FOOTER_CONFIG === 'undefined') {
      console.error('FOOTER_CONFIG not found. Make sure footer-config.js is loaded before footer.js');
      return;
    }

    // Find footer container
    const footerContainer = document.getElementById('footer-container');
    if (!footerContainer) {
      console.warn('Footer container (#footer-container) not found in page');
      return;
    }

    // Generate and insert footer HTML
    footerContainer.innerHTML = generateFooterHTML();

    // Add footer styles if not already present
    if (!document.getElementById('footer-styles')) {
      addFooterStyles();
    }
  }

  function generateFooterHTML() {
    const config = FOOTER_CONFIG;
    
    return `
      <footer class="footer">
        <div class="footer-container">
          <div class="footer-content">
            <!-- Brand Column -->
            <div class="footer-brand">
              ${generateLogoSVG(config.brand.name, config.brand.tagline)}
              <p>${config.brand.description}</p>
            </div>

            <!-- Link Columns -->
            <div class="footer-links">
              ${config.columns.map(column => generateColumnHTML(column)).join('')}
            </div>
          </div>

          <!-- Footer Bottom -->
          <div class="footer-bottom">
            <p>
              © ${config.copyright.year} ${config.copyright.entity}${config.copyright.allRightsReserved ? '. All rights reserved.' : ''}
            </p>
            ${config.bottomLinks && config.bottomLinks.length > 0 ? `
              <div class="footer-bottom-links">
                ${config.bottomLinks.map((link, index) => `
                  <a href="${link.url}">${link.text}</a>${index < config.bottomLinks.length - 1 ? '<span class="footer-separator">•</span>' : ''}
                `).join('')}
              </div>
            ` : ''}
          </div>
        </div>
      </footer>
    `;
  }

  function generateColumnHTML(column) {
    return `
      <div class="footer-column">
        <h4>${column.title}</h4>
        ${column.links.map(link => `
          <a href="${link.url}"${link.external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${link.text}</a>
        `).join('')}
      </div>
    `;
  }

  function generateLogoSVG(brandName, tagline) {
    // Parse brand name (e.g., "Forge APIs" -> "Forge" + "APIs")
    const words = brandName.split(' ');
    const firstWord = words[0] || '';
    const secondWord = words.slice(1).join(' ') || '';

    return `
      <svg width="240" height="80" viewBox="0 0 240 80" xmlns="http://www.w3.org/2000/svg" class="footer-logo">
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
        </g>
        <text x="75" y="45" font-family="Inter, system-ui, -apple-system, sans-serif" font-size="28" font-weight="800" fill="#ffffff">${firstWord}</text>
        ${secondWord ? `<text x="150" y="45" font-family="Inter, system-ui, -apple-system, sans-serif" font-size="28" font-weight="400" fill="#9CA3AF">${secondWord}</text>` : ''}
        <text x="75" y="63" font-family="Inter, system-ui, -apple-system, sans-serif" font-size="9" fill="#6B7280" letter-spacing="0.5">${tagline.toUpperCase()}</text>
      </svg>
    `;
  }

  function addFooterStyles() {
    const styleElement = document.createElement('style');
    styleElement.id = 'footer-styles';
    styleElement.textContent = `
      /* Footer Styles - Generated by footer.js */
      .footer {
        background: #0a0e27;
        color: white;
        padding: 60px 0 30px;
        margin-top: 80px;
      }

      .footer-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
      }

      .footer-content {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 60px;
        margin-bottom: 30px;
      }

      .footer-brand {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .footer-brand p {
        color: #9ca3af;
        margin: 0;
        font-size: 14px;
        line-height: 1.6;
      }

      .footer-logo {
        max-width: 240px;
        height: auto;
        margin-bottom: 8px;
      }

      .footer-links {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 60px;
        justify-items: start;
      }

      .footer-column {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .footer-column h4 {
        font-size: 14px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin: 0 0 16px 0;
        color: white;
      }

      .footer-column a {
        color: #9ca3af;
        text-decoration: none;
        transition: color 0.3s;
        font-size: 14px;
        line-height: 1.5;
      }

      .footer-column a:hover {
        color: white;
      }

      .footer-bottom {
        padding-top: 24px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        text-align: center;
        color: #6b7280;
        font-size: 14px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        align-items: center;
      }

      .footer-bottom p {
        margin: 0;
      }

      .footer-bottom-links {
        display: flex;
        gap: 8px;
        align-items: center;
        flex-wrap: wrap;
        justify-content: center;
      }

      .footer-bottom-links a {
        color: #6b7280;
        text-decoration: none;
        transition: color 0.3s;
        font-size: 14px;
      }

      .footer-bottom-links a:hover {
        color: white;
      }

      .footer-separator {
        color: #6b7280;
        margin: 0 4px;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .footer {
          padding: 40px 0 20px;
          margin-top: 60px;
        }

        .footer-content {
          grid-template-columns: 1fr;
          gap: 40px;
        }

        .footer-links {
          grid-template-columns: 1fr;
          gap: 32px;
        }

        .footer-column {
          gap: 10px;
        }

        .footer-column h4 {
          margin-bottom: 12px;
        }

        .footer-bottom {
          padding-top: 20px;
          font-size: 13px;
        }

        .footer-bottom-links {
          flex-direction: column;
          gap: 8px;
        }

        .footer-separator {
          display: none;
        }
      }

      @media (max-width: 480px) {
        .footer {
          padding: 30px 0 20px;
          margin-top: 40px;
        }

        .footer-logo {
          max-width: 200px;
        }

        .footer-brand p {
          font-size: 13px;
        }

        .footer-column a {
          font-size: 13px;
        }

        .footer-bottom {
          font-size: 12px;
        }
      }
    `;
    
    document.head.appendChild(styleElement);
  }
})();