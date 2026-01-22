from flask import Blueprint, jsonify, request
import pandas as pd
from app.services.data_loader import DataLoader
from app.services.aggregations import Aggregations
from app.services.filters import Filters
from app.services.comparisons import Comparisons

bp = Blueprint('api', __name__)

@bp.route('/stats')
def get_stats():
    """Get overview statistics"""
    stats = Aggregations.get_overview_stats()
    return jsonify(stats)

@bp.route('/products')
def get_products():
    """Get filtered products"""
    price_min = request.args.get('price_min', type=float)
    price_max = request.args.get('price_max', type=float)
    rating_min = request.args.get('rating_min', type=float)
    category = request.args.get('category')
    search = request.args.get('search')
    
    filtered = Filters.filter_products(
        price_min=price_min,
        price_max=price_max,
        rating_min=rating_min,
        category=category,
        search_term=search
    )
    
    return jsonify({
        'products': filtered.to_dict('records'),
        'count': len(filtered)
    })

@bp.route('/suppliers')
def get_suppliers():
    """Get filtered suppliers"""
    price_min = request.args.get('price_min', type=float)
    price_max = request.args.get('price_max', type=float)
    rating_min = request.args.get('rating_min', type=float)
    location = request.args.get('location')
    product = request.args.get('product')
    search = request.args.get('search')
    
    filtered = Filters.filter_suppliers(
        price_min=price_min,
        price_max=price_max,
        rating_min=rating_min,
        location=location,
        product_searched=product,
        search_term=search
    )
    
    return jsonify({
        'suppliers': filtered.to_dict('records'),
        'count': len(filtered)
    })

@bp.route('/top-products')
def get_top_products():
    """Get top products by metric"""
    sort_by = request.args.get('sort_by', 'ratings')
    limit = request.args.get('limit', 5, type=int)
    
    top = Aggregations.get_top_products(limit=limit, sort_by=sort_by)
    return jsonify(top)

@bp.route('/top-suppliers')
def get_top_suppliers():
    """Get top suppliers by metric"""
    sort_by = request.args.get('sort_by', 'rating')
    limit = request.args.get('limit', 5, type=int)
    
    top = Aggregations.get_top_suppliers(limit=limit, sort_by=sort_by)
    return jsonify(top)

@bp.route('/categories')
def get_categories():
    """Get category breakdown"""
    categories = Aggregations.get_category_breakdown()
    return jsonify(categories)

@bp.route('/price-distribution')
def get_price_distribution():
    """Get price distribution for charts"""
    bins = request.args.get('bins', 10, type=int)
    distribution = Aggregations.get_price_distribution(bins=bins)
    return jsonify(distribution)

@bp.route('/rating-distribution')
def get_rating_distribution():
    """Get rating distribution for charts"""
    distribution = Aggregations.get_rating_distribution()
    return jsonify(distribution)

@bp.route('/location-stats')
def get_location_stats():
    """Get supplier location statistics"""
    stats = Aggregations.get_supplier_location_stats()
    return jsonify(stats)

@bp.route('/compare-products')
def compare_products():
    """Compare multiple products"""
    identifiers = request.args.getlist('ids[]')
    comparison = Comparisons.compare_products(identifiers)
    return jsonify(comparison)

@bp.route('/compare-suppliers')
def compare_suppliers():
    """Compare multiple suppliers"""
    names = request.args.getlist('names[]')
    comparison = Comparisons.compare_suppliers(names)
    return jsonify(comparison)

@bp.route('/product-vs-suppliers/<product_id>')
def product_vs_suppliers(product_id):
    """Compare product with its suppliers"""
    comparison = Comparisons.product_vs_suppliers(product_id)
    if comparison is None:
        return jsonify({'error': 'Product not found'}), 404
    return jsonify(comparison)

@bp.route('/filter-options')
def get_filter_options():
    """Get all available filter options"""
    options = Filters.get_filter_options()
    return jsonify(options)

@bp.route('/charts/products')
def get_product_charts():
    """Get chart data for products based on filters"""
    price_min = request.args.get('price_min', type=float)
    price_max = request.args.get('price_max', type=float)
    rating_min = request.args.get('rating_min', type=float)
    category = request.args.get('category')
    
    filtered = Filters.filter_products(
        price_min=price_min,
        price_max=price_max,
        rating_min=rating_min,
        category=category
    )
    
    # Replace NaN values with 0
    filtered = filtered.fillna(0)
    
    # Rating distribution
    rating_bins = [0, 1, 2, 3, 4, 5]
    rating_labels = ['0-1★', '1-2★', '2-3★', '3-4★', '4-5★']
    filtered['Rating_Bin'] = pd.cut(filtered['Ratings'], bins=rating_bins, labels=rating_labels, include_lowest=True)
    rating_dist = filtered['Rating_Bin'].value_counts().sort_index()
    
    rating_data = {
        'labels': rating_dist.index.tolist(),
        'values': rating_dist.values.tolist()
    }
    
    # Category distribution
    category_dist = filtered['Category'].value_counts()
    category_data = {
        'labels': category_dist.index.tolist(),
        'values': category_dist.values.tolist()
    }
    
    # Review distribution
    review_bins = [0, 100, 500, 1000, 5000, 10000, 100000]
    review_labels = ['0-100', '100-500', '500-1K', '1K-5K', '5K-10K', '10K+']
    filtered['Review_Bin'] = pd.cut(filtered['Review'], bins=review_bins, labels=review_labels)
    review_dist = filtered['Review_Bin'].value_counts().sort_index()
    
    review_data = {
        'labels': review_dist.index.tolist(),
        'values': review_dist.values.tolist()
    }
    
    return jsonify({
        'ratings': rating_data,
        'category': category_data,
        'reviews': review_data,
        'count': len(filtered)
    })

@bp.route('/charts/suppliers')
def get_supplier_charts():
    """Get chart data for suppliers based on filters"""
    price_min = request.args.get('price_min', type=float)
    price_max = request.args.get('price_max', type=float)
    rating_min = request.args.get('rating_min', type=float)
    location = request.args.get('location')
    
    filtered = Filters.filter_suppliers(
        price_min=price_min,
        price_max=price_max,
        rating_min=rating_min,
        location=location
    )
    
    # Replace NaN values with 0
    filtered = filtered.fillna(0)
    
    # Location distribution
    location_dist = filtered['Location'].value_counts().head(10)
    location_data = {
        'labels': location_dist.index.tolist(),
        'values': location_dist.values.tolist()
    }
    
    # Price vs Rating scatter
    scatter_data = {
        'prices': filtered['Price'].replace([float('inf'), float('-inf')], 0).tolist(),
        'ratings': filtered['Rating'].replace([float('inf'), float('-inf')], 0).tolist(),
        'labels': filtered['Supplier Name'].tolist()
    }
    
    # Round distribution
    round_dist = filtered['Supplier Round'].value_counts().sort_index()
    round_data = {
        'labels': [f'Round {int(r)}' for r in round_dist.index],
        'values': round_dist.values.tolist()
    }
    
    return jsonify({
        'location': location_data,
        'scatter': scatter_data,
        'rounds': round_data,
        'count': len(filtered)
    })

@bp.route('/product-detail/<product_id>')
def get_product_detail(product_id):
    """Get detailed product information"""
    product = DataLoader.get_product_by_identifier(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    suppliers = DataLoader.get_suppliers_for_product(product_id)
    comparison = Comparisons.product_vs_suppliers(product_id)
    
    return jsonify({
        'product': product,
        'suppliers': suppliers.to_dict('records') if not suppliers.empty else [],
        'comparison': comparison
    })

@bp.route('/search')
def search():
    """Global search endpoint"""
    query = request.args.get('q', '').lower()
    
    if len(query) < 2:
        return jsonify({'results': []})
    
    products = DataLoader.load_products()
    suppliers = DataLoader.load_suppliers()
    
    # Search products
    product_results = products[
        products['Title'].str.lower().str.contains(query, na=False) |
        products['Product Identifier'].str.lower().str.contains(query, na=False)
    ].head(5)
    
    # Search suppliers
    supplier_results = suppliers[
        suppliers['Supplier Name'].str.lower().str.contains(query, na=False) |
        suppliers['Location'].str.lower().str.contains(query, na=False)
    ].head(5)
    
    return jsonify({
        'products': product_results[['Product Identifier', 'Title', 'Price', 'Ratings', 'Image']].to_dict('records'),
        'suppliers': supplier_results[['Supplier Name', 'Location', 'Rating', 'Price']].to_dict('records')
    })

import pandas as pd