/**
 * Filters JavaScript
 * Handles filter interactions and dynamic updates
 */

// Apply filters with animation
function applyFilters(formId, endpoint) {
    const form = document.getElementById(formId);
    const formData = new FormData(form);
    const params = new URLSearchParams(formData);
    
    // Show loading state
    const applyBtn = document.getElementById('applyFilters');
    if (applyBtn) {
        applyBtn.disabled = true;
        applyBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Loading...';
    }
    
    // Redirect with parameters
    window.location.href = `${endpoint}?${params}`;
}

// Reset filters
function resetFilters(endpoint) {
    window.location.href = endpoint;
}

// Auto-apply filters on change (with debounce)
function enableAutoFilter(formId, endpoint, delay = 500) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    const inputs = form.querySelectorAll('.filter-input');
    const debouncedApply = window.dashboardUtils.debounce(() => {
        applyFilters(formId, endpoint);
    }, delay);
    
    inputs.forEach(input => {
        input.addEventListener('change', debouncedApply);
        if (input.type === 'text') {
            input.addEventListener('input', debouncedApply);
        }
    });
}

// Update filter options dynamically
function updateFilterOptions(filters) {
    // Update category options
    if (filters.categories) {
        const categorySelect = document.querySelector('select[name="category"]');
        if (categorySelect) {
            const currentValue = categorySelect.value;
            categorySelect.innerHTML = '<option value="">All</option>';
            filters.categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat;
                if (cat === currentValue) option.selected = true;
                categorySelect.appendChild(option);
            });
        }
    }
    
    // Update location options
    if (filters.locations) {
        const locationSelect = document.querySelector('select[name="location"]');
        if (locationSelect) {
            const currentValue = locationSelect.value;
            locationSelect.innerHTML = '<option value="">All</option>';
            filters.locations.forEach(loc => {
                const option = document.createElement('option');
                option.value = loc;
                option.textContent = loc;
                if (loc === currentValue) option.selected = true;
                locationSelect.appendChild(option);
            });
        }
    }
}

// Get active filters from URL
function getActiveFilters() {
    const params = new URLSearchParams(window.location.search);
    const filters = {};
    
    for (const [key, value] of params) {
        if (value) {
            filters[key] = value;
        }
    }
    
    return filters;
}

// Display active filters as badges
function displayActiveFilterBadges(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const filters = getActiveFilters();
    container.innerHTML = '';
    
    if (Object.keys(filters).length === 0) {
        container.innerHTML = '<span class="text-muted">No active filters</span>';
        return;
    }
    
    for (const [key, value] of Object.entries(filters)) {
        const badge = document.createElement('span');
        badge.className = 'badge bg-primary me-2 mb-2';
        badge.innerHTML = `${key}: ${value} <i class="bi bi-x-circle ms-1" style="cursor: pointer;"></i>`;
        
        // Add click handler to remove filter
        badge.querySelector('i').addEventListener('click', function() {
            removeFilter(key);
        });
        
        container.appendChild(badge);
    }
}

// Remove a specific filter
function removeFilter(filterKey) {
    const params = new URLSearchParams(window.location.search);
    params.delete(filterKey);
    window.location.href = `${window.location.pathname}?${params}`;
}

// Price range slider handler
function initializePriceSlider(sliderId, minInputId, maxInputId) {
    const slider = document.getElementById(sliderId);
    const minInput = document.getElementById(minInputId);
    const maxInput = document.getElementById(maxInputId);
    
    if (!slider || !minInput || !maxInput) return;
    
    // Update inputs when slider changes
    slider.addEventListener('input', function() {
        const values = this.value.split(',');
        minInput.value = values[0];
        maxInput.value = values[1];
    });
    
    // Update slider when inputs change
    function updateSlider() {
        slider.value = `${minInput.value},${maxInput.value}`;
    }
    
    minInput.addEventListener('input', updateSlider);
    maxInput.addEventListener('input', updateSlider);
}

// Export functions
window.filterUtils = {
    applyFilters,
    resetFilters,
    enableAutoFilter,
    updateFilterOptions,
    getActiveFilters,
    displayActiveFilterBadges,
    removeFilter,
    initializePriceSlider
};