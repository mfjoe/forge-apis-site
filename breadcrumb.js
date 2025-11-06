// Breadcrumb Generator - Dynamically creates breadcrumbs from breadcrumb-config.js

(function() {
  'use strict';
  
  // Wait for config to be available
  if (typeof breadcrumbConfig === 'undefined') {
    console.error('breadcrumb-config.js must be loaded before breadcrumb.js');
    return;
  }
  
  function getCurrentPath() {
    // Get the current page path
    const path = window.location.pathname;
    // Remove trailing slash for consistency
    return path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
  }
  
  function getPageTitle() {
    // Try to get page title from document title or h1
    const title = document.querySelector('h1')?.textContent || 
                 document.title.split('|')[0].trim() ||
                 document.title.split('-')[0].trim();
    return title || 'Page';
  }
  
  function generateBreadcrumbs() {
    const config = breadcrumbConfig;
    const currentPath = getCurrentPath();
    
    // Check if there's a custom path defined (try with and without trailing slash)
    let breadcrumbs = config.customPaths[currentPath] || 
                     config.customPaths[currentPath + '/'] ||
                     (currentPath.endsWith('/') ? config.customPaths[currentPath.slice(0, -1)] : null);
    
    // If no custom path, auto-generate from URL structure
    if (!breadcrumbs) {
      breadcrumbs = config.default.slice(); // Start with Home
      
      // Parse path segments
      const segments = currentPath.split('/').filter(s => s);
      
      if (segments.length > 0) {
        // Build breadcrumb path
        let currentUrl = '';
        
        segments.forEach((segment, index) => {
          currentUrl += '/' + segment;
          
          // Check if this is a category
          const category = config.categories[segment] || config.categories[currentUrl.slice(1)];
          
          if (category && index === 0) {
            // Add category
            breadcrumbs.push({ name: category.name, url: category.url });
          } else if (index === segments.length - 1) {
            // Last segment - current page
            const pageName = segment
              .replace(/-/g, ' ')
              .replace(/\.html$/, '')
              .replace(/\b\w/g, l => l.toUpperCase());
            breadcrumbs.push({ name: pageName });
          } else {
            // Intermediate segment
            const segmentName = segment
              .replace(/-/g, ' ')
              .replace(/\b\w/g, l => l.toUpperCase());
            breadcrumbs.push({ name: segmentName, url: currentUrl + '/' });
          }
        });
      }
    }
    
    // Generate HTML
    let html = '<nav class="breadcrumb-list" aria-label="Breadcrumb">';
    
    breadcrumbs.forEach((item, index) => {
      const isLast = index === breadcrumbs.length - 1;
      
      html += '<div class="breadcrumb-item">';
      
      if (isLast || !item.url) {
        // Current page - no link
        html += `<span class="breadcrumb-current">${item.name}</span>`;
      } else {
        // Link
        html += `<a href="${item.url}" class="breadcrumb-link">${item.name}</a>`;
      }
      
      html += '</div>';
    });
    
    html += '</nav>';
    
    return html;
  }
  
  // Insert breadcrumb when DOM is ready
  function initBreadcrumb() {
    const breadcrumbContainer = document.getElementById('breadcrumb-container');
    const nav = document.querySelector('nav');
    
    const breadcrumbHTML = `<div class="breadcrumb"><div class="container">${generateBreadcrumbs()}</div></div>`;
    
    if (breadcrumbContainer) {
      breadcrumbContainer.innerHTML = breadcrumbHTML;
    } else if (nav && nav.nextElementSibling) {
      // Insert after nav if no container exists
      nav.insertAdjacentHTML('afterend', breadcrumbHTML);
    } else {
      // Insert at beginning of body content
      const container = document.querySelector('.container, main, section');
      if (container) {
        container.insertAdjacentHTML('beforebegin', breadcrumbHTML);
      }
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBreadcrumb);
  } else {
    initBreadcrumb();
  }
})();

