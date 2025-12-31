/**
 * Chart.js Configuration and Helpers
 * Creates and manages all dashboard charts
 */

// Chart color palette
const chartColors = {
    primary: 'rgba(13, 110, 253, 0.8)',
    success: 'rgba(25, 135, 84, 0.8)',
    warning: 'rgba(255, 193, 7, 0.8)',
    danger: 'rgba(220, 53, 69, 0.8)',
    info: 'rgba(13, 202, 240, 0.8)',
    purple: 'rgba(111, 66, 193, 0.8)',
    orange: 'rgba(253, 126, 20, 0.8)',
    teal: 'rgba(32, 201, 151, 0.8)'
};

const backgroundColors = [
    chartColors.primary,
    chartColors.success,
    chartColors.warning,
    chartColors.danger,
    chartColors.info,
    chartColors.purple,
    chartColors.orange,
    chartColors.teal
];

// Default chart options
const defaultOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                padding: 15,
                font: {
                    size: 12
                }
            }
        }
    },
    animation: {
        duration: 1000,
        easing: 'easeInOutQuart'
    }
};

// Create bar chart
function createBarChart(canvasId, labels, data, label, color) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: color || chartColors.primary,
                borderWidth: 0,
                borderRadius: 5
            }]
        },
        options: {
            ...defaultOptions,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Create pie chart
function createPieChart(canvasId, labels, data, title) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            ...defaultOptions,
            plugins: {
                ...defaultOptions.plugins,
                title: {
                    display: false
                }
            }
        }
    });
}

// Create line chart
function createLineChart(canvasId, labels, datasets) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    
    const chartDatasets = datasets.map((dataset, index) => ({
        label: dataset.label,
        data: dataset.data,
        borderColor: backgroundColors[index % backgroundColors.length],
        backgroundColor: backgroundColors[index % backgroundColors.length].replace('0.8', '0.2'),
        tension: 0.4,
        fill: true
    }));
    
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: chartDatasets
        },
        options: {
            ...defaultOptions,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Create scatter chart
function createScatterChart(canvasId, xData, yData, labels) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    
    const scatterData = xData.map((x, i) => ({
        x: x,
        y: yData[i]
    }));
    
    return new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Price vs Rating',
                data: scatterData,
                backgroundColor: chartColors.info,
                borderColor: chartColors.info.replace('0.8', '1'),
                borderWidth: 1,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            ...defaultOptions,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Price (₹)'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Rating'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            },
            plugins: {
                ...defaultOptions.plugins,
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Price: ₹${context.parsed.x.toFixed(0)}, Rating: ${context.parsed.y.toFixed(1)}`;
                        }
                    }
                }
            }
        }
    });
}

// Load overview charts
function loadOverviewCharts() {
    // Price distribution
    fetch('/api/price-distribution')
        .then(response => response.json())
        .then(data => {
            createBarChart('priceDistChart', data.bins, data.counts, 'Products', chartColors.primary);
        });
    
    // Rating distribution
    fetch('/api/rating-distribution')
        .then(response => response.json())
        .then(data => {
            createPieChart('ratingDistChart', data.labels, data.counts, 'Ratings');
        });
    
    // Location stats
    fetch('/api/location-stats')
        .then(response => response.json())
        .then(data => {
            const labels = data.map(d => d.location);
            const counts = data.map(d => d.supplier_count);
            createBarChart('locationChart', labels, counts, 'Suppliers', chartColors.success);
        });
    
    // Category breakdown
    fetch('/api/categories')
        .then(response => response.json())
        .then(data => {
            const labels = data.map(d => d.category);
            const counts = data.map(d => d.count);
            createPieChart('categoryChart', labels, counts, 'Categories');
        });
}

// Export functions
window.chartUtils = {
    createBarChart,
    createPieChart,
    createLineChart,
    createScatterChart,
    loadOverviewCharts
};