/**
 * AJAX Utilities
 * Handles all AJAX requests and dynamic data loading
 */

// Generic AJAX GET request
function ajaxGet(url, successCallback, errorCallback) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (successCallback) successCallback(data);
        })
        .catch(error => {
            console.error('AJAX Error:', error);
            if (errorCallback) errorCallback(error);
        });
}

// Generic AJAX POST request
function ajaxPost(url, data, successCallback, errorCallback) {
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (successCallback) successCallback(data);
        })
        .catch(error => {
            console.error('AJAX Error:', error);
            if (errorCallback) errorCallback(error);
        });
}

// Load products dynamically
function loadProducts(filters, containerId, callback) {
    const params = new URLSearchParams(filters);
    const url = `/api/products?${params}`;
    
    ajaxGet(url, 
        function(data) {
            if (callback) callback(data);
            updateProductsDisplay(data.products, containerId);
        },
        function(error) {
            showError(containerId, 'Failed to load products');
        }
    );
}

// Load suppliers dynamically
function loadSuppliers(filters, containerId, callback) {
    const params = new URLSearchParams(filters);
    const url = `/api/suppliers?${params}`;
    
    ajaxGet(url,
        function(data) {
            if (callback) callback(data);
            updateSuppliersDisplay(data.suppliers, containerId);
        },
        function(error) {
            showError(containerId, 'Failed to load suppliers');
        }
    );
}

// Update products display
function updateProductsDisplay(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (products.length === 0) {
        container.innerHTML = '<div class="col-12"><div class="alert alert-info">No products found matching your criteria.</div></div>';
        return;
    }
    
    let html = '';
    products.forEach(product => {
        html += `
            <div class="col-md-6 col-lg-4 col-xl-3 product-item animate-fade-in">
                <div class="card product-card-detailed h-100">
                    <img src="${product.Image}" class="card-img-top product-image-large" alt="${product.Title}">
                    <div class="card-body">
                        <h6 class="card-title" title="${product.Title}">${product.Title.substring(0, 60)}...</h6>
                        <div class="mb-2">
                            <span class="badge bg-success fs-6">₹${Math.round(product.Price)}</span>
                            <span class="badge bg-warning text-dark ms-2">
                                <i class="bi bi-star-fill"></i> ${product.Ratings.toFixed(1)}
                            </span>
                        </div>
                        <p class="card-text small text-muted mb-2">
                            <i class="bi bi-chat-left-text"></i> ${product.Review} reviews
                        </p>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Update suppliers display
function updateSuppliersDisplay(suppliers, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (suppliers.length === 0) {
        container.innerHTML = '<tr><td colspan="9" class="text-center"><div class="alert alert-info mb-0">No suppliers found matching your criteria.</div></td></tr>';
        return;
    }
    
    let html = '';
    suppliers.forEach(supplier => {
        html += `
            <tr class="animate-fade-in">
                <td><span class="badge bg-primary">${supplier['Supplier Round']}</span></td>
                <td><strong>${supplier['Supplier Name']}</strong></td>
                <td><small>${supplier['Product Searched'].substring(0, 30)}...</small></td>
                <td><i class="bi bi-geo-alt"></i> ${supplier.Location}</td>
                <td>₹${Math.round(supplier.Price)}</td>
                <td>
                    <span class="badge bg-warning text-dark">
                        ${supplier.Rating.toFixed(1)} <i class="bi bi-star-fill"></i>
                    </span>
                </td>
                <td>${supplier.Reviews}</td>
                <td><small>${supplier['Contact Phone']}</small></td>
                <td>
                    <a href="${supplier['IndiaMART Link']}" target="_blank" 
                       class="btn btn-sm btn-outline-primary">
                        <i class="bi bi-box-arrow-up-right"></i>
                    </a>
                </td>
            </tr>
        `;
    });
    
    container.innerHTML = html;
}

// Auto-refresh data at intervals
function enableAutoRefresh(callback, interval = 30000) {
    return setInterval(callback, interval);
}

// Disable auto-refresh
function disableAutoRefresh(intervalId) {
    if (intervalId) {
        clearInterval(intervalId);
    }
}

// Load chart data dynamically
function loadChartData(endpoint, params, callback) {
    const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
    
    ajaxGet(url,
        function(data) {
            if (callback) callback(data);
        },
        function(error) {
            console.error('Failed to load chart data:', error);
        }
    );
}

// Export functions
window.ajaxUtils = {
    ajaxGet,
    ajaxPost,
    loadProducts,
    loadSuppliers,
    updateProductsDisplay,
    updateSuppliersDisplay,
    enableAutoRefresh,
    disableAutoRefresh,
    loadChartData
};