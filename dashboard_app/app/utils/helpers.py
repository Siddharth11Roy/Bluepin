"""Helper functions and utilities"""
import re
from datetime import datetime
import pandas as pd

def format_currency(amount):
    """Format amount as INR currency"""
    try:
        amount = float(amount)
        return f"₹{amount:,.0f}"
    except (ValueError, TypeError):
        return "₹0"

def format_number(num):
    """Format number with commas or as millions/thousands"""
    try:
        num = float(num)
        if num >= 1000000:
            return f"{num/1000000:.1f}M"
        elif num >= 1000:
            return f"{num/1000:.1f}K"
        else:
            return f"{int(num):,}"
    except (ValueError, TypeError):
        return "0"

def format_rating(rating):
    """Format rating with star emoji"""
    try:
        rating = float(rating)
        return f"{rating:.1f} ⭐"
    except (ValueError, TypeError):
        return "N/A"

def format_percentage(value, decimals=1):
    """Format value as percentage"""
    try:
        value = float(value)
        return f"{value:.{decimals}f}%"
    except (ValueError, TypeError):
        return "0%"

def truncate_text(text, length=50, suffix='...'):
    """Truncate text to specified length"""
    if not text:
        return ''
    text = str(text)
    return text if len(text) <= length else text[:length-len(suffix)] + suffix

def clean_phone_number(phone):
    """Clean and format phone number"""
    if not phone:
        return 'N/A'
    # Remove non-digit characters
    digits = re.sub(r'\D', '', str(phone))
    return digits if digits else 'N/A'

def extract_numeric(text):
    """Extract first numeric value from text"""
    if not text:
        return 0
    match = re.search(r'\d+(?:\.\d+)?', str(text))
    return float(match.group()) if match else 0

def parse_rating(rating_text):
    """Parse rating from text like '4.5 out of 5 stars'"""
    if not rating_text:
        return 0.0
    match = re.search(r'(\d+\.\d+|\d+)', str(rating_text))
    return float(match.group()) if match else 0.0

def calculate_discount_percentage(original, discounted):
    """Calculate discount percentage"""
    try:
        original = float(original)
        discounted = float(discounted)
        if original == 0:
            return 0
        return ((original - discounted) / original) * 100
    except (ValueError, TypeError, ZeroDivisionError):
        return 0

def get_rating_category(rating):
    """Categorize rating"""
    try:
        rating = float(rating)
        if rating >= 4.5:
            return 'excellent'
        elif rating >= 4.0:
            return 'very_good'
        elif rating >= 3.5:
            return 'good'
        elif rating >= 3.0:
            return 'average'
        else:
            return 'below_average'
    except (ValueError, TypeError):
        return 'unknown'

def get_price_category(price):
    """Categorize price"""
    try:
        price = float(price)
        if price < 500:
            return 'budget'
        elif price < 1500:
            return 'mid_range'
        elif price < 5000:
            return 'premium'
        else:
            return 'luxury'
    except (ValueError, TypeError):
        return 'unknown'

def format_timestamp(dt=None, format='%Y-%m-%d %H:%M:%S'):
    """Format datetime object"""
    if dt is None:
        dt = datetime.now()
    return dt.strftime(format)

def safe_divide(numerator, denominator, default=0):
    """Safe division with default value"""
    try:
        numerator = float(numerator)
        denominator = float(denominator)
        return numerator / denominator if denominator != 0 else default
    except (ValueError, TypeError, ZeroDivisionError):
        return default

def dataframe_to_dict_list(df):
    """Convert pandas DataFrame to list of dicts"""
    if df is None or df.empty:
        return []
    return df.to_dict('records')

def sanitize_filename(filename):
    """Sanitize filename for safe storage"""
    # Remove or replace unsafe characters
    filename = re.sub(r'[^\w\s.-]', '', filename)
    filename = re.sub(r'\s+', '_', filename)
    return filename[:255]  # Limit length

def generate_comparison_id(*items):
    """Generate unique ID for comparison"""
    sorted_items = sorted(str(item) for item in items)
    return '_'.join(sorted_items)

def calculate_statistics(values):
    """Calculate basic statistics for a list of values"""
    if not values:
        return {
            'mean': 0,
            'median': 0,
            'min': 0,
            'max': 0,
            'std': 0
        }
    
    series = pd.Series(values)
    return {
        'mean': float(series.mean()),
        'median': float(series.median()),
        'min': float(series.min()),
        'max': float(series.max()),
        'std': float(series.std())
    }

def get_trend_indicator(current, previous):
    """Get trend indicator (up/down/neutral)"""
    try:
        current = float(current)
        previous = float(previous)
        if current > previous:
            return 'up'
        elif current < previous:
            return 'down'
        else:
            return 'neutral'
    except (ValueError, TypeError):
        return 'unknown'

def create_pagination(total_items, page=1, per_page=20):
    """Create pagination metadata"""
    total_pages = (total_items + per_page - 1) // per_page
    
    return {
        'page': page,
        'per_page': per_page,
        'total_items': total_items,
        'total_pages': total_pages,
        'has_prev': page > 1,
        'has_next': page < total_pages,
        'prev_page': page - 1 if page > 1 else None,
        'next_page': page + 1 if page < total_pages else None
    }