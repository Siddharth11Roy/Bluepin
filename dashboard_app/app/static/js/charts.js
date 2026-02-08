/**
 * Modern Chart.js Configuration with 3D Effects
 * Smooth animations and professional styling
 */

// Modern Color Palette
const modernColors = {
    primary: '#3b82f6',
    primaryLight: '#60a5fa',
    primaryDark: '#2563eb',
    success: '#10b981',
    successLight: '#34d399',
    warning: '#f59e0b',
    warningLight: '#fbbf24',
    danger: '#ef4444',
    dangerLight: '#f87171',
    info: '#06b6d4',
    infoLight: '#22d3ee',
    purple: '#8b5cf6',
    pink: '#ec4899',
    indigo: '#6366f1',
    gray: '#6b7280'
};

const gradients = {
    blue: ['#3b82f6', '#60a5fa', '#93c5fd'],
    green: ['#10b981', '#34d399', '#6ee7b7'],
    orange: ['#f59e0b', '#fbbf24', '#fcd34d'],
    red: ['#ef4444', '#f87171', '#fca5a5'],
    purple: ['#8b5cf6', '#a78bfa', '#c4b5fd'],
    cyan: ['#06b6d4', '#22d3ee', '#67e8f9']
};

// Chart.js Default Configuration
Chart.defaults.font.family = "'Inter', 'Segoe UI', sans-serif";
Chart.defaults.font.size = 13;
Chart.defaults.color = '#6b7280';
Chart.defaults.animation.duration = 1200;
Chart.defaults.animation.easing = 'easeInOutQuart';

// Default Options for all charts
const defaultChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        mode: 'index',
        intersect: false
    },
    plugins: {
        legend: {
            display: true,
            position: 'bottom',
            labels: {
                padding: 20,
                usePointStyle: true,
                pointStyle: 'circle',
                font: {
                    size: 12,
                    weight: '500'
                }
            }
        },
        tooltip: {
            enabled: true,
            backgroundColor: 'rgba(17, 24, 39, 0.95)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            titleFont: {
                size: 14,
                weight: '600'
            },
            bodyFont: {
                size: 13
            },
            displayColors: true,
            boxPadding: 6
        }
    }
};

/**
 * Create a gradient for canvas
 */
function createGradient(ctx, chartArea, colorStart, colorEnd) {
    if (!chartArea) return colorStart;

    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, colorEnd);
    gradient.addColorStop(1, colorStart);
    return gradient;
}

/**
 * Create 3D-style Bar Chart
 */
function create3DBarChart(canvasId, labels, data, label, color = modernColors.primary) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: function (context) {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return color;

                    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                    gradient.addColorStop(0, color + '99');
                    gradient.addColorStop(1, color);
                    return gradient;
                },
                borderWidth: 0,
                borderRadius: {
                    topLeft: 8,
                    topRight: 8
                },
                borderSkipped: false,
                barPercentage: 0.7,
                categoryPercentage: 0.8
            }]
        },
        options: {
            ...defaultChartOptions,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        padding: 10,
                        font: {
                            size: 12
                        }
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        padding: 10,
                        font: {
                            size: 11
                        },
                        maxRotation: 45,
                        minRotation: 0,
                        autoSkip: true,
                        maxTicksLimit: 10
                    }
                }
            },
            plugins: {
                ...defaultChartOptions.plugins,
                legend: {
                    display: false
                }
            }
        }
    });
}

/**
 * Create 3D-style Doughnut Chart
 */
function create3DDoughnutChart(canvasId, labels, data, title) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const colors = [
        modernColors.primary,
        modernColors.success,
        modernColors.warning,
        modernColors.danger,
        modernColors.info,
        modernColors.purple
    ];

    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 4,
                borderColor: '#ffffff',
                hoverBorderWidth: 6,
                hoverOffset: 15
            }]
        },
        options: {
            ...defaultChartOptions,
            cutout: '70%',
            plugins: {
                ...defaultChartOptions.plugins,
                legend: {
                    ...defaultChartOptions.plugins.legend,
                    position: 'right',
                    labels: {
                        ...defaultChartOptions.plugins.legend.labels,
                        padding: 15,
                        generateLabels: function (chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => {
                                    const dataset = data.datasets[0];
                                    const value = dataset.data[i];
                                    const total = dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((value / total) * 100).toFixed(1);

                                    return {
                                        text: `${label} (${percentage}%)`,
                                        fillStyle: dataset.backgroundColor[i],
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                }
            }
        }
    });
}

/**
 * Create Modern Line Chart with Area Fill
 */
function createModernLineChart(canvasId, labels, datasets, title) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const processedDatasets = datasets.map((dataset, index) => {
        const colorKeys = Object.keys(gradients);
        const gradientKey = colorKeys[index % colorKeys.length];
        const baseColor = gradients[gradientKey][0];

        return {
            label: dataset.label,
            data: dataset.data,
            borderColor: baseColor,
            backgroundColor: function (context) {
                const chart = context.chart;
                const { ctx, chartArea } = chart;
                if (!chartArea) return baseColor + '20';

                const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                gradient.addColorStop(0, baseColor + '00');
                gradient.addColorStop(1, baseColor + '40');
                return gradient;
            },
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointBackgroundColor: baseColor,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointHoverBackgroundColor: baseColor,
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 3
        };
    });

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: processedDatasets
        },
        options: {
            ...defaultChartOptions,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        padding: 10
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        padding: 10
                    }
                }
            }
        }
    });
}

/**
 * Create Horizontal Bar Chart
 */
function createHorizontalBarChart(canvasId, labels, data, label, color = modernColors.primary) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: function (context) {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return color;

                    const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
                    gradient.addColorStop(0, color + '99');
                    gradient.addColorStop(1, color);
                    return gradient;
                },
                borderWidth: 0,
                borderRadius: {
                    topRight: 8,
                    bottomRight: 8
                },
                borderSkipped: false,
                barPercentage: 0.7
            }]
        },
        options: {
            ...defaultChartOptions,
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        padding: 10
                    }
                },
                y: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        padding: 10,
                        font: {
                            size: 11
                        },
                        autoSkip: false,
                        callback: function (value) {
                            const label = this.getLabelForValue(value);
                            return label.length > 25 ? label.substring(0, 22) + '...' : label;
                        }
                    }
                }
            },
            plugins: {
                ...defaultChartOptions.plugins,
                legend: {
                    display: false
                }
            }
        }
    });
}

/**
 * Create Sparkline Chart (Mini Line Chart)
 */
function createSparkline(canvasId, data, color = modernColors.primary) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map((_, i) => i),
            datasets: [{
                data: data,
                borderColor: color,
                backgroundColor: function (context) {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return color + '20';

                    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                    gradient.addColorStop(0, color + '00');
                    gradient.addColorStop(1, color + '60');
                    return gradient;
                },
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            },
            scales: {
                x: { display: false },
                y: { display: false }
            },
            elements: {
                line: { borderWidth: 2 }
            }
        }
    });
}

/**
 * Create all sparklines for metric cards
 */
function createSparklines() {
    const sparklineData = [
        [65, 59, 80, 81, 56, 75, 90],
        [28, 48, 40, 59, 86, 77, 88],
        [33, 45, 37, 51, 44, 38, 40],
        [18, 38, 43, 49, 56, 57, 60],
        [45, 52, 58, 68, 75, 82, 95]  // Units sold trend
    ];

    const colors = [
        modernColors.primary,
        modernColors.success,
        modernColors.warning,
        modernColors.info,
        modernColors.purple
    ];

    sparklineData.forEach((data, index) => {
        createSparkline(`sparkline${index + 1}`, data, colors[index]);
    });
}

/**
 * Load Overview Charts
 */
function loadOverviewCharts() {
    // Fetch chart data from the API
    fetch('/api/chart-data')
        .then(response => response.json())
        .then(data => {
            // Price Distribution Chart (3D Bar)
            if (data.price_distribution) {
                create3DBarChart(
                    'priceDistChart',
                    data.price_distribution.labels,
                    data.price_distribution.data,
                    'Number of Products',
                    modernColors.primary
                );
            }

            // Rating Distribution Chart (3D Doughnut)
            if (data.rating_distribution) {
                create3DDoughnutChart(
                    'ratingDistChart',
                    data.rating_distribution.labels,
                    data.rating_distribution.data,
                    'Rating Distribution'
                );
            }

            // Location Chart (Horizontal Bar)
            if (data.location_distribution) {
                createHorizontalBarChart(
                    'locationChart',
                    data.location_distribution.labels,
                    data.location_distribution.data,
                    'Number of Suppliers',
                    modernColors.danger
                );
            }

            // Category Chart (Doughnut)
            if (data.category_distribution) {
                create3DDoughnutChart(
                    'categoryChart',
                    data.category_distribution.labels,
                    data.category_distribution.data,
                    'Product Categories'
                );
            }
        })
        .catch(error => {
            console.error('Error loading chart data:', error);

            // Fallback demo data
            loadDemoCharts();
        });
}

/**
 * Load Demo Charts (Fallback)
 */
function loadDemoCharts() {
    // Price Distribution
    create3DBarChart(
        'priceDistChart',
        ['0-5k', '5k-10k', '10k-20k', '20k-50k', '50k+'],
        [245, 187, 156, 98, 45],
        'Number of Products',
        modernColors.primary
    );

    // Rating Distribution
    create3DDoughnutChart(
        'ratingDistChart',
        ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
        [320, 240, 80, 30, 10],
        'Rating Distribution'
    );

    // Location Distribution
    createHorizontalBarChart(
        'locationChart',
        ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'],
        [45, 38, 35, 28, 25, 22],
        'Number of Suppliers',
        modernColors.danger
    );

    // Category Distribution
    create3DDoughnutChart(
        'categoryChart',
        ['Electronics', 'Fashion', 'Home', 'Books', 'Sports'],
        [180, 145, 98, 75, 52],
        'Product Categories'
    );
}

/**
 * Animate Counter Numbers
 */
function animateCounters() {
    const counters = document.querySelectorAll('.counter');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };

        updateCounter();
    });
}

/**
 * Export functions for global use
 */
window.chartFunctions = {
    create3DBarChart,
    create3DDoughnutChart,
    createModernLineChart,
    createHorizontalBarChart,
    createSparkline,
    createSparklines,
    loadOverviewCharts,
    animateCounters
};

/**
 * Simple wrapper functions for compact dashboard
 */
function createPieChart(canvasId, labels, data, title) {
    return create3DDoughnutChart(canvasId, labels, data, title);
}

function createBarChart(canvasId, labels, data, title, color) {
    return create3DBarChart(canvasId, labels, data, title, color);
}

function createScatterChart(canvasId, pricesArray, ratingsArray, labelsArray) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    // Convert arrays to scatter plot format
    const scatterData = pricesArray.map((price, index) => ({
        x: price,
        y: ratingsArray[index]
    }));

    return new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Products',
                data: scatterData,
                backgroundColor: modernColors.primary + '80',
                borderColor: modernColors.primary,
                borderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const index = context.dataIndex;
                            const label = labelsArray[index] || '';
                            return [
                                label,
                                `Price: ₹${context.parsed.x.toFixed(0)}`,
                                `Rating: ${context.parsed.y.toFixed(1)}`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Price (₹)',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Rating',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    min: 0,
                    max: 5,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            }
        }
    });
}

/**
 * Create Simple Line Chart
 */
function createLineChart(canvasId, labels, data, label, color = modernColors.primary) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                borderColor: color,
                backgroundColor: function (context) {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return color + '20';

                    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                    gradient.addColorStop(0, color + '00');
                    gradient.addColorStop(1, color + '40');
                    return gradient;
                },
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: color,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverBackgroundColor: color,
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    ...defaultChartOptions.plugins.tooltip,
                    callbacks: {
                        label: function (context) {
                            return `${label}: ₹${context.parsed.y.toFixed(0)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Average Price (₹)',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        padding: 10,
                        callback: function (value) {
                            return '₹' + value.toFixed(0);
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Rating Range',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        padding: 10
                    }
                }
            }
        }
    });
}

// Make functions globally available
window.createPieChart = createPieChart;
window.createBarChart = createBarChart;
window.createScatterChart = createScatterChart;
window.createLineChart = createLineChart;
window.createHorizontalBarChart = createHorizontalBarChart;
