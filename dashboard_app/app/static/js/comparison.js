/**
 * Comparison System
 * Handles product comparison with drag & drop
 */

class ComparisonManager {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('comparisonItems')) || [];
        this.maxItems = 4;
        this.init();
    }
    
    init() {
        this.updateUI();
        this.attachEventListeners();
    }
    
    attachEventListeners() {
        // Add to comparison buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-comparison')) {
                e.preventDefault();
                const btn = e.target.closest('.add-to-comparison');
                const productId = btn.dataset.productId;
                const productData = {
                    id: productId,
                    title: btn.dataset.productTitle,
                    price: btn.dataset.productPrice,
                    image: btn.dataset.productImage,
                    rating: btn.dataset.productRating
                };
                this.addItem(productData);
            }
        });
        
        // View comparison
        const viewBtn = document.getElementById('viewComparison');
        if (viewBtn) {
            viewBtn.addEventListener('click', () => this.viewComparison());
        }
        
        // Clear comparison
        const clearBtn = document.getElementById('clearComparison');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearAll());
        }
        
        // Comparison cart button
        const cartBtn = document.getElementById('comparisonCartBtn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => this.toggleComparisonPanel());
        }
    }
    
    addItem(item) {
        // Check if already added
        if (this.items.find(i => i.id === item.id)) {
            this.showNotification('Item already in comparison', 'warning');
            return;
        }
        
        // Check max limit
        if (this.items.length >= this.maxItems) {
            this.showNotification(`Maximum ${this.maxItems} items allowed`, 'warning');
            return;
        }
        
        // Add item
        this.items.push(item);
        this.saveToStorage();
        this.updateUI();
        this.showNotification('Added to comparison', 'success');
        
        // Animate button
        const btn = document.querySelector(`[data-product-id="${item.id}"]`);
        if (btn) {
            btn.classList.add('added');
            btn.innerHTML = '<i class="bi bi-check-circle"></i> Added';
        }
    }
    
    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.saveToStorage();
        this.updateUI();
    }
    
    clearAll() {
        if (confirm('Clear all comparison items?')) {
            this.items = [];
            this.saveToStorage();
            this.updateUI();
            this.showNotification('Comparison cleared', 'info');
        }
    }
    
    saveToStorage() {
        localStorage.setItem('comparisonItems', JSON.stringify(this.items));
    }
    
    updateUI() {
        const count = this.items.length;
        
        // Update badges
        const badges = document.querySelectorAll('#comparisonCount, #comparisonBarCount');
        badges.forEach(badge => {
            if (badge.id === 'comparisonCount') {
                badge.textContent = count;
                badge.style.display = count > 0 ? 'inline-block' : 'none';
            } else {
                badge.textContent = count;
            }
        });
        
        // Show/hide floating bar
        const bar = document.getElementById('comparisonBar');
        if (bar) {
            if (count > 0) {
                bar.style.display = 'block';
                setTimeout(() => bar.classList.add('show'), 10);
            } else {
                bar.classList.remove('show');
                setTimeout(() => bar.style.display = 'none', 300);
            }
        }
        
        // Update comparison buttons state
        document.querySelectorAll('.add-to-comparison').forEach(btn => {
            const productId = btn.dataset.productId;
            if (this.items.find(i => i.id === productId)) {
                btn.classList.add('added');
                btn.innerHTML = '<i class="bi bi-check-circle"></i> Added';
            } else {
                btn.classList.remove('added');
                btn.innerHTML = '<i class="bi bi-plus-circle"></i> Compare';
            }
        });
    }
    
    viewComparison() {
        if (this.items.length < 2) {
            this.showNotification('Add at least 2 items to compare', 'warning');
            return;
        }
        
        const ids = this.items.map(item => item.id);
        const params = ids.map(id => `ids[]=${encodeURIComponent(id)}`).join('&');
        window.location.href = `/comparisons?${params}`;
    }
    
    toggleComparisonPanel() {
        // TODO: Implement side panel to show comparison items
        if (this.items.length === 0) {
            this.showNotification('No items in comparison', 'info');
        } else {
            this.viewComparison();
        }
    }
    
    showNotification(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.innerHTML = `
            <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize comparison manager
let comparisonManager;
document.addEventListener('DOMContentLoaded', () => {
    comparisonManager = new ComparisonManager();
});