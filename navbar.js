// Navbar Generator - Dynamically creates navbar from navbar-config.js

(function() {
  'use strict';
  
  // Wait for config to be available
  if (typeof navbarConfig === 'undefined') {
    console.error('navbar-config.js must be loaded before navbar.js');
    return;
  }
  
  function generateNavbar() {
    const config = navbarConfig;
    
    // Generate desktop nav links
    let desktopLinks = '';
    config.links.forEach(link => {
      desktopLinks += `<a href="${link.url}">${link.name}</a>`;
    });
    
    // Generate mobile menu (if configured)
    let mobileMenuContent = '';
    
    if (config.mobileMenu && config.mobileMenu.sections) {
      // Add contact link at top if configured
      if (config.mobileMenu.contactLink) {
        mobileMenuContent += `<a href="${config.mobileMenu.contactLink.url}" class="mobile-menu-link">${config.mobileMenu.contactLink.name}</a>`;
        mobileMenuContent += '<div class="mobile-menu-divider"></div>';
      }
      
      // Add sections
      config.mobileMenu.sections.forEach((section, index) => {
        if (index > 0) {
          mobileMenuContent += '<div class="mobile-menu-divider"></div>';
        }
        mobileMenuContent += `<div class="mobile-menu-section-title">${section.title}</div>`;
        section.links.forEach(link => {
          mobileMenuContent += `<a href="${link.url}" class="mobile-menu-link">${link.name}</a>`;
        });
      });
    }
    
    // If no mobile menu content, add desktop links to mobile menu
    if (!mobileMenuContent && config.links.length > 0) {
      config.links.forEach(link => {
        mobileMenuContent += `<a href="${link.url}" class="mobile-menu-link">${link.name}</a>`;
      });
    }
    
    // Build complete navbar HTML
    const navbarHTML = `
      <nav>
        <div class="container">
          <a href="${config.logo.href}" class="logo">
            ${config.logo.svg}
          </a>
          <div class="nav-links">
            ${desktopLinks}
          </div>

          <!-- Mobile Menu Button -->
          <button class="mobile-menu-btn" id="mobileMenuBtn">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </button>

          <!-- Mobile Menu -->
          <div class="mobile-menu" id="mobileMenu">
            <div class="mobile-menu-content">
              ${mobileMenuContent}
            </div>
          </div>
        </div>
      </nav>
    `;
    
    return navbarHTML;
  }
  
  // Initialize mobile menu functionality
  function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
      // Toggle menu
      mobileMenuBtn.addEventListener('click', function() {
        mobileMenuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
      });
      
      // Close menu when clicking outside
      mobileMenu.addEventListener('click', function(e) {
        if (e.target === mobileMenu) {
          mobileMenuBtn.classList.remove('active');
          mobileMenu.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
      
      // Close menu when clicking on a link
      const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
      mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
          mobileMenuBtn.classList.remove('active');
          mobileMenu.classList.remove('active');
          document.body.style.overflow = '';
        });
      });
      
      // Close menu on escape key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
          mobileMenuBtn.classList.remove('active');
          mobileMenu.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }
  }
  
  // Initialize scroll effect for navbar
  function initScrollEffect() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 20) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
      
      lastScroll = currentScroll;
    });
  }
  
  // Initialize smooth scrolling for anchor links
  function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '#top') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const navHeight = document.querySelector('nav').offsetHeight;
          const targetPosition = targetElement.offsetTop - navHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
  
  // Insert navbar when DOM is ready
  function initNavbar() {
    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
      navbarContainer.innerHTML = generateNavbar();
    } else {
      // If no container, try to find existing nav and replace it
      const existingNav = document.querySelector('nav');
      if (existingNav) {
        existingNav.outerHTML = generateNavbar();
      } else {
        // Insert at beginning of body
        document.body.insertAdjacentHTML('afterbegin', generateNavbar());
      }
    }
    
    // Initialize functionality after navbar is inserted
    setTimeout(() => {
      initMobileMenu();
      initScrollEffect();
      initSmoothScroll();
    }, 0);
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavbar);
  } else {
    initNavbar();
  }
})();

