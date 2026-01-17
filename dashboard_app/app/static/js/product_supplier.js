/**
 * Product & Supplier Page Enhancements
 * Modern interactions and animations
 */

document.addEventListener('DOMContentLoaded', function() {
    initFilterToggle();
    initCounterAnimations();
    initViewToggle();
    initImageLazyLoad();
});

/**
 * Initialize filter collapse/expand toggle
 */
function initFilterToggle() {
    const toggleBtn = document.getElementById('toggleFilters');
    const filterCollapse = document.getElementById('filterCollapse');
    
    if (toggleBtn && filterCollapse) {
        toggleBtn.addEventListener('click', function() {
            filterCollapse.classList.toggle('collapsed');
            const icon = this.querySelector('i');
            
            if (filterCollapse.classList.contains('collapsed')) {
                icon.classList.remove('bi-chevron-up');
                icon.classList.add('bi-chevron-down');
            } else {
                icon.classList.remove('bi-chevron-down');
                icon.classList.add('bi-chevron-up');
            }
        });
    }
}

/**
 * Animate counter numbers
 */
function initCounterAnimations() {
    const counters = document.querySelectorAll('.counter');
    
    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    };
    
    // Intersection Observer for counters
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                animateCounter(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

/**
 * Toggle between grid and list view (future enhancement)
 */
function initViewToggle() {
    const gridView = document.getElementById('gridView');
    const listView = document.getElementById('listView');
    const productGrid = document.getElementById('productsGrid');
    
    if (gridView && listView && productGrid) {
        gridView.addEventListener('click', function() {
            productGrid.classList.remove('list-view');
            gridView.classList.add('active');
            listView.classList.remove('active');
        });
        
        listView.addEventListener('click', function() {
            productGrid.classList.add('list-view');
            listView.classList.add('active');
            gridView.classList.remove('active');
        });
    }
}

/**
 * Lazy load images for better performance
 */
function initImageLazyLoad() {
    const images = document.querySelectorAll('.product-image, .supplier-avatar-img');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    images.forEach(img => {
        if (img.dataset.src) {
            imageObserver.observe(img);
        }
    });
}

/**
 * Add smooth scroll to top button functionality
 */
function initScrollToTop() {
    const scrollButton = document.querySelector('.back-to-top');
    
    if (scrollButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollButton.classList.add('visible');
            } else {
                scrollButton.classList.remove('visible');
            }
        });
        
        scrollButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Add wishlist functionality
 */
function initWishlist() {
    const wishlistButtons = document.querySelectorAll('.btn-wishlist');
    
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            this.classList.toggle('active');
            const icon = this.querySelector('i');
            
            if (this.classList.contains('active')) {
                icon.classList.remove('bi-plus-circle');
                icon.classList.add('bi-check-circle-fill');
                
                // Add animation
                this.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
            } else {
                icon.classList.remove('bi-check-circle-fill');
                icon.classList.add('bi-plus-circle');
            }
        });
    });
}

// Initialize wishlist on load
initWishlist();

/**
 * Filter form enhancements
 */
document.addEventListener('DOMContentLoaded', function() {
    const filterForm = document.getElementById('productFilterForm') || document.getElementById('supplierFilterForm');
    
    if (filterForm) {
        // Auto-submit on Enter key
        filterForm.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                document.getElementById('applyFilters').click();
            }
        });
        
        // Clear individual filters with double-click
        const filterInputs = filterForm.querySelectorAll('input, select');
        filterInputs.forEach(input => {
            input.addEventListener('dblclick', function() {
                this.value = '';
            });
        });
    }
});

/**
 * Stagger animation for cards
 */
function staggerAnimation() {
    const cards = document.querySelectorAll('.product-card-modern, .supplier-card-modern');
    
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.05}s`;
    });
}

// Initialize on load
staggerAnimation();

/**
 * Add hover effect sound (optional, commented out)
 */
// function initHoverSounds() {
//     const cards = document.querySelectorAll('.product-card-modern, .supplier-card-modern');
//     const hoverSound = new Audio('/static/sounds/hover.mp3');
    
//     cards.forEach(card => {
//         card.addEventListener('mouseenter', () => {
//             hoverSound.currentTime = 0;
//             hoverSound.play().catch(() => {});
//         });
//     });
// }
