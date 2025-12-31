"""Constants and configuration values"""

# Chart configuration
CHART_COLORS = [
    'rgba(13, 110, 253, 0.8)',  # Primary
    'rgba(25, 135, 84, 0.8)',   # Success
    'rgba(255, 193, 7, 0.8)',   # Warning
    'rgba(220, 53, 69, 0.8)',   # Danger
    'rgba(13, 202, 240, 0.8)',  # Info
    'rgba(111, 66, 193, 0.8)',  # Purple
    'rgba(253, 126, 20, 0.8)',  # Orange
    'rgba(32, 201, 151, 0.8)',  # Teal
]

# Rating categories
RATING_CATEGORIES = {
    'excellent': (4.5, 5.0),
    'very_good': (4.0, 4.5),
    'good': (3.5, 4.0),
    'average': (3.0, 3.5),
    'below_average': (0, 3.0)
}

# Price ranges (in INR)
PRICE_RANGES = {
    'budget': (0, 500),
    'mid_range': (500, 1500),
    'premium': (1500, 5000),
    'luxury': (5000, float('inf'))
}

# Pagination
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100

# Cache timeouts (seconds)
CACHE_SHORT = 300      # 5 minutes
CACHE_MEDIUM = 1800    # 30 minutes
CACHE_LONG = 3600      # 1 hour

# Dashboard refresh intervals (seconds)
REFRESH_INTERVALS = {
    'overview': 30,
    'products': 60,
    'suppliers': 60,
    'charts': 120
}

# Sort options
PRODUCT_SORT_OPTIONS = [
    ('ratings', 'Rating (High to Low)'),
    ('price_low', 'Price (Low to High)'),
    ('price_high', 'Price (High to Low)'),
    ('reviews', 'Most Reviewed'),
    ('sales', 'Best Selling')
]

SUPPLIER_SORT_OPTIONS = [
    ('rating', 'Rating (High to Low)'),
    ('price_low', 'Price (Low to High)'),
    ('reviews', 'Most Reviewed'),
    ('location', 'Location')
]

# Export formats
EXPORT_FORMATS = ['csv', 'excel', 'json']

# File upload settings
ALLOWED_EXTENSIONS = {'csv', 'xlsx', 'xls'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

# API rate limiting
RATE_LIMIT_CALLS = 100
RATE_LIMIT_PERIOD = 60  # seconds