/**
 * Autocomplete Component for FPS Calculator
 * Handles GPU, CPU, and Game selection with searchable dropdowns
 */

// Tier display configuration
const TIER_CONFIG = {
  "ultra-high-end": { label: "⚡ Ultra High-End", priority: 1 },
  "high-end": { label: "🔥 High-End", priority: 2 },
  "mid-high-end": { label: "💎 Mid-High-End", priority: 3 },
  "mid-range": { label: "📊 Mid-Range", priority: 4 },
  "budget": { label: "💰 Budget", priority: 5 },
  "flagship": { label: "⚡ Flagship", priority: 1 }
};

// Popular items that should rank high
const POPULAR_ITEMS = {
  gpu: ["NVIDIA RTX 4090", "NVIDIA RTX 4070", "NVIDIA RTX 3060", "AMD RX 7900 XTX"],
  cpu: ["Intel Core i9-13900K", "AMD Ryzen 7 7800X3D", "Intel Core i5-13600K"],
  game: ["Valorant", "CS2", "Fortnite", "Cyberpunk 2077"]
};

/**
 * Search function with smart matching
 */
function searchComponents(query, componentType, dataSource) {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const searchTerm = query.toLowerCase().trim();
  const results = [];
  const exactMatches = [];
  const prefixMatches = [];
  const partialMatches = [];
  const popularMatches = [];

  // Get data based on component type
  let items = [];
  if (componentType === 'gpu') {
    items = Object.keys(dataSource.gpus || {}).map(key => ({
      name: dataSource.gpus[key].name,
      tier: dataSource.gpus[key].tier,
      vram: dataSource.gpus[key].vram,
      score: dataSource.gpus[key].performanceScore,
      type: 'gpu'
    }));
  } else if (componentType === 'cpu') {
    items = Object.keys(dataSource.cpus || {}).map(key => ({
      name: dataSource.cpus[key].name,
      tier: dataSource.cpus[key].tier,
      cores: dataSource.cpus[key].cores,
      score: dataSource.cpus[key].gamingScore,
      type: 'cpu'
    }));
  } else if (componentType === 'game') {
    items = (dataSource.games || []).map(name => ({
      name: name,
      type: 'game'
    }));
  }

  // Search through items
  items.forEach(item => {
    const nameLower = item.name.toLowerCase();
    const nameNormalized = nameLower.replace(/\s+/g, '');
    const searchNormalized = searchTerm.replace(/\s+/g, '');
    const isPopular = POPULAR_ITEMS[componentType]?.includes(item.name);

    // Exact match
    if (nameLower === searchTerm) {
      exactMatches.push({ ...item, relevance: 100, isPopular });
    }
    // Prefix match (starts with)
    else if (nameLower.startsWith(searchTerm)) {
      prefixMatches.push({ ...item, relevance: 80, isPopular });
    }
    // Normalized match (no spaces)
    else if (nameNormalized.includes(searchNormalized)) {
      partialMatches.push({ ...item, relevance: 60, isPopular });
    }
    // Contains match
    else if (nameLower.includes(searchTerm)) {
      partialMatches.push({ ...item, relevance: 40, isPopular });
    }
  });

  // Combine and sort results
  // Boost popular items
  const boostPopular = (item) => {
    if (item.isPopular) {
      item.relevance += 10;
    }
    return item;
  };

  results.push(...exactMatches.map(boostPopular));
  results.push(...prefixMatches.map(boostPopular));
  results.push(...partialMatches.map(boostPopular));

  // Sort by relevance (highest first)
  results.sort((a, b) => {
    if (a.relevance !== b.relevance) {
      return b.relevance - a.relevance;
    }
    // If same relevance, popular items first
    if (a.isPopular !== b.isPopular) {
      return b.isPopular ? 1 : -1;
    }
    // Alphabetical for same relevance and popularity
    return a.name.localeCompare(b.name);
  });

  // Limit to 10 results
  return results.slice(0, 10);
}

/**
 * Highlight matching text in result
 */
function highlightMatch(text, query) {
  if (!query) return text;
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Create result item HTML
 */
function createResultItem(item, query, index) {
  const isHighlighted = index === 0;
  const highlightedName = highlightMatch(item.name, query);
  
  let badge = '';
  let details = '';
  
  if (item.type === 'gpu') {
    const tierConfig = TIER_CONFIG[item.tier] || { label: item.tier };
    badge = `<span class="tier-badge tier-${item.tier}">${tierConfig.label}</span>`;
    details = `<span class="item-details">${item.vram}GB VRAM</span>`;
  } else if (item.type === 'cpu') {
    const tierConfig = TIER_CONFIG[item.tier] || { label: item.tier };
    badge = `<span class="tier-badge tier-${item.tier}">${tierConfig.label}</span>`;
    details = `<span class="item-details">${item.cores} cores</span>`;
  } else if (item.type === 'game') {
    badge = `<span class="game-icon">🎮</span>`;
  }
  
  return `
    <div class="autocomplete-item ${isHighlighted ? 'highlighted' : ''}" 
         data-index="${index}" 
         data-value="${item.name}"
         role="option"
         aria-selected="${isHighlighted}">
      <div class="item-content">
        <div class="item-name" data-name="${item.name}">${highlightedName}</div>
        <div class="item-meta">
          ${badge}
          ${details}
        </div>
      </div>
    </div>
  `;
}

/**
 * Group results by tier and create HTML
 */
function createResultsHTML(results, query, componentType) {
  if (results.length === 0) {
    return `
      <div class="autocomplete-empty">
        <p>No ${componentType === 'gpu' ? 'GPUs' : componentType === 'cpu' ? 'CPUs' : 'games'} found</p>
        <p class="empty-hint">Try a different search term</p>
      </div>
    `;
  }

  // Group by tier
  const grouped = {};
  results.forEach((item, index) => {
    const tier = item.tier || 'other';
    if (!grouped[tier]) {
      grouped[tier] = [];
    }
    grouped[tier].push({ ...item, originalIndex: index });
  });

  // Sort tiers by priority
  const tierOrder = Object.keys(grouped).sort((a, b) => {
    const priorityA = TIER_CONFIG[a]?.priority || 99;
    const priorityB = TIER_CONFIG[b]?.priority || 99;
    return priorityA - priorityB;
  });

  let html = '';
  tierOrder.forEach((tier, tierIndex) => {
    const tierConfig = TIER_CONFIG[tier] || { label: tier };
    const items = grouped[tier];
    
    html += `
      <div class="tier-group" data-tier="${tier}">
        <div class="tier-header">${tierConfig.label}</div>
        ${items.map((item, itemIndex) => 
          createResultItem(item, query, item.originalIndex)
        ).join('')}
      </div>
    `;
  });

  return html;
}

/**
 * Debounce function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Initialize autocomplete component
 */
function initAutocomplete(inputId, dataSource, onSelect, componentType) {
  const input = document.getElementById(inputId);
  if (!input) return;

  // Create wrapper if it doesn't exist
  let wrapper = input.parentElement;
  if (!wrapper.classList.contains('autocomplete-wrapper')) {
    wrapper = document.createElement('div');
    wrapper.className = 'autocomplete-wrapper';
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);
  }

  // Create dropdown
  const dropdown = document.createElement('div');
  dropdown.className = 'autocomplete-dropdown';
  dropdown.id = `${inputId}-dropdown`;
  dropdown.setAttribute('role', 'listbox');
  dropdown.setAttribute('aria-label', `${componentType} selection`);
  wrapper.appendChild(dropdown);

  // State
  let selectedIndex = -1;
  let results = [];
  let isOpen = false;

  // Clear button
  const clearBtn = document.createElement('button');
  clearBtn.type = 'button';
  clearBtn.className = 'autocomplete-clear';
  clearBtn.innerHTML = '×';
  clearBtn.setAttribute('aria-label', 'Clear selection');
  clearBtn.style.display = 'none';
  wrapper.appendChild(clearBtn);

  // Show/hide clear button
  function updateClearButton() {
    clearBtn.style.display = input.value ? 'flex' : 'none';
  }

  // Clear input
  clearBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    input.value = '';
    input.focus();
    closeDropdown();
    updateClearButton();
    if (onSelect) onSelect(null);
  });

  // Open dropdown
  function openDropdown() {
    if (!isOpen) {
      dropdown.classList.add('active');
      isOpen = true;
      input.setAttribute('aria-expanded', 'true');
    }
  }

  // Close dropdown
  function closeDropdown() {
    if (isOpen) {
      dropdown.classList.remove('active');
      isOpen = false;
      selectedIndex = -1;
      input.setAttribute('aria-expanded', 'false');
    }
  }

  // Update dropdown content
  function updateDropdown(query) {
    if (!query || query.trim().length === 0) {
      dropdown.innerHTML = '';
      closeDropdown();
      return;
    }

    results = searchComponents(query, componentType, dataSource);
    dropdown.innerHTML = createResultsHTML(results, query, componentType);
    
    // Update ARIA
    dropdown.setAttribute('aria-owns', results.map((_, i) => `${inputId}-option-${i}`).join(' '));

    if (results.length > 0) {
      openDropdown();
      selectedIndex = 0;
      updateHighlight();
    } else {
      openDropdown(); // Show empty state
    }
  }

  // Update highlighted item
  function updateHighlight() {
    const items = dropdown.querySelectorAll('.autocomplete-item');
    items.forEach((item, index) => {
      item.classList.toggle('highlighted', index === selectedIndex);
      item.setAttribute('aria-selected', index === selectedIndex);
    });

    // Scroll into view
    if (items[selectedIndex]) {
      items[selectedIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  // Select item
  function selectItem(index) {
    if (index >= 0 && index < results.length) {
      const item = results[index];
      input.value = item.name;
      closeDropdown();
      updateClearButton();
      if (onSelect) onSelect(item);
      input.setAttribute('aria-activedescendant', '');
    }
  }

  // Debounced search
  const debouncedSearch = debounce((query) => {
    updateDropdown(query);
  }, 300);

  // Input event
  input.addEventListener('input', (e) => {
    const query = e.target.value;
    updateClearButton();
    debouncedSearch(query);
  });

  // Focus event
  input.addEventListener('focus', () => {
    if (input.value && results.length > 0) {
      openDropdown();
    }
  });

  // Click on dropdown item
  dropdown.addEventListener('click', (e) => {
    const item = e.target.closest('.autocomplete-item');
    if (item) {
      const index = parseInt(item.dataset.index);
      selectItem(index);
    }
  });

  // Keyboard navigation
  input.addEventListener('keydown', (e) => {
    if (!isOpen && e.key !== 'Escape') return;

    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (results.length > 0) {
          selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
          updateHighlight();
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (results.length > 0) {
          selectedIndex = Math.max(selectedIndex - 1, 0);
          updateHighlight();
        }
        break;

      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          selectItem(selectedIndex);
        }
        break;

      case 'Escape':
        e.preventDefault();
        closeDropdown();
        input.blur();
        break;

      case 'Tab':
        closeDropdown();
        break;
    }
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) {
      closeDropdown();
    }
  });

  // Mobile: Check if dropdown should be positioned above
  function checkPosition() {
    if (!isOpen) return;
    
    const rect = wrapper.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const dropdownHeight = 300; // Estimated max height

    if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
      dropdown.classList.add('position-above');
    } else {
      dropdown.classList.remove('position-above');
    }
  }

  // Update position on scroll/resize
  window.addEventListener('scroll', checkPosition, true);
  window.addEventListener('resize', checkPosition);
  input.addEventListener('focus', checkPosition);

  // Initialize
  input.setAttribute('autocomplete', 'off');
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-expanded', 'false');
  updateClearButton();
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initAutocomplete,
    searchComponents,
    highlightMatch
  };
}

