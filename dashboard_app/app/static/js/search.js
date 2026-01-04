/**
 * Global Search System
 * Handles live search with autocomplete
 */

class GlobalSearch {
    constructor() {
        this.searchInput = document.getElementById('globalSearch');
        this.searchResults = document.getElementById('searchResults');
        this.debounceTimer = null;
        this.init();
    }
    
    init() {
        if (!this.searchInput) return;
        
        // Search on input
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(this.debounceTimer);
            const query = e.target.value.trim();
            
            if (query.length < 2) {
                this.hideResults();
                return;
            }
            
            this.debounceTimer = setTimeout(() => {
                this.performSearch(query);
            }, 300);
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl+K to focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.searchInput.focus();
            }
            
            // Escape to close results
            if (e.key === 'Escape') {
                this.hideResults();
                this.searchInput.blur();
            }
        });
        
        // Click outside to close
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-wrapper') && !e.target.closest('.search-results')) {
                this.hideResults();
            }
        });
    }
    
    async performSearch(query) {
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            this.displayResults(data);
        } catch (error) {
            console.error('Search error:', error);
        }
    }
    
    displayResults(data) {
        if (!this.searchResults) return;
        
        const hasResults = data.products.length > 0 || data.suppliers.length > 0;
        
        if (!hasResults) {
            this.searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
            this.showResults();
            return;
        }
        
        let html = '';
        
        // Products section
        if (data.products.length > 0) {
            html += '<div class="search-section"><div class="search-section-title"><i class="bi bi-box-seam"></i> Products</div>';
            data.products.forEach(product => {
                html += `
                    <a href="/product/${encodeURIComponent(product['Product Identifier'])}" class="search-result-item">
                        <img src="${product.Image}" class="search-result-image" alt="${product.Title}">
                        <div class="search-result-content">
                            <div class="search-result-title">${this.highlightQuery(product.Title, this.searchInput.value)}</div>
                            <div class="search-result-meta">
                                <span class="badge bg-success">₹${Math.round(product.Price)}</span>
                                <span class="badge bg-warning text-dark">${product.Ratings.toFixed(1)} ⭐</span>
                            </div>
                        </div>
                    </a>
                `;
            });
            html += '</div>';
        }
        
        // Suppliers section
        if (data.suppliers.length > 0) {
            html += '<div class="search-section"><div class="search-section-title"><i class="bi bi-building"></i> Suppliers</div>';
            data.suppliers.forEach(supplier => {
                html += `
                    <a href="/suppliers?search=${encodeURIComponent(supplier['Supplier Name'])}" class="search-result-item">
                        <div class="search-result-icon"><i class="bi bi-building"></i></div>
                        <div class="search-result-content">
                            <div class="search-result-title">${this.highlightQuery(supplier['Supplier Name'], this.searchInput.value)}</div>
                            <div class="search-result-meta">
                                <span><i class="bi bi-geo-alt"></i> ${supplier.Location}</span>
                                <span class="badge bg-warning text-dark">${supplier.Rating.toFixed(1)} ⭐</span>
                            </div>
                        </div>
                    </a>
                `;
            });
            html += '</div>';
        }
        
        this.searchResults.innerHTML = html;
        this.showResults();
    }
    
    highlightQuery(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    showResults() {
        if (this.searchResults) {
            this.searchResults.style.display = 'block';
            this.searchResults.classList.add('show');
        }
    }
    
    hideResults() {
        if (this.searchResults) {
            this.searchResults.classList.remove('show');
            setTimeout(() => {
                this.searchResults.style.display = 'none';
            }, 200);
        }
    }
}

// Initialize global search
document.addEventListener('DOMContentLoaded', () => {
    new GlobalSearch();
});