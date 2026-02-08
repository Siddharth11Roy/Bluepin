from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
import pandas as pd
from app.services.data_loader import DataLoader
from app.services.aggregations import Aggregations
from app.services.filters import Filters
from app.services.comparisons import Comparisons
from models import db, Wishlist

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
    category = request.args.get('category')
    search = request.args.get('search')
    
    filtered = Filters.filter_suppliers(
        price_min=price_min,
        price_max=price_max,
        rating_min=rating_min,
        location=location,
        category=category,
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
    
    
    # Categories distribution (based on actual product categories from products data)
    # Load products to get categories
    products = DataLoader.load_products()
    
    # Get categories for products that suppliers are providing
    supplier_products = filtered['Product Searched'].unique()
    product_categories = products[products['Product Identifier'].isin(supplier_products)]['Category'].value_counts().head(8)
    
    category_data = {
        'labels': product_categories.index.tolist(),
        'values': product_categories.values.tolist()
    }
    
    # Price vs Rating - Line chart (average price per rating range)
    rating_bins = [0, 3.0, 3.5, 4.0, 4.5, 5.0]
    rating_labels = ['<3.0★', '3.0-3.5★', '3.5-4.0★', '4.0-4.5★', '4.5-5.0★']
    
    # Filter out invalid ratings
    valid_data = filtered[(filtered['Rating'] > 0) & (filtered['Price'] > 0)].copy()
    
    if len(valid_data) > 0:
        valid_data['Rating_Bin'] = pd.cut(valid_data['Rating'], bins=rating_bins, labels=rating_labels, include_lowest=True)
        price_by_rating = valid_data.groupby('Rating_Bin', observed=True)['Price'].mean()
        
        # Ensure all labels are present
        price_rating_data = {
            'labels': rating_labels,
            'prices': [price_by_rating.get(label, 0) for label in rating_labels]
        }
    else:
        price_rating_data = {
            'labels': rating_labels,
            'prices': [0] * len(rating_labels)
        }
    
    return jsonify({
        'location': location_data,
        'categories': category_data,
        'price_rating_line': price_rating_data,
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


# Wishlist API endpoints
@bp.route('/wishlist', methods=['GET'])
@login_required
def get_wishlist():
    """Get current user's wishlist"""
    wishlist_items = Wishlist.query.filter_by(user_id=current_user.id).order_by(Wishlist.added_at.desc()).all()
    
    return jsonify({
        'items': [{
            'id': item.id,
            'product_identifier': item.product_identifier,
            'product_title': item.product_title,
            'product_price': item.product_price,
            'product_rating': item.product_rating,
            'product_image': item.product_image,
            'added_at': item.added_at.isoformat(),
            'notes': item.notes
        } for item in wishlist_items],
        'count': len(wishlist_items)
    })


@bp.route('/wishlist/add', methods=['POST'])
@login_required
def add_to_wishlist():
    """Add product to wishlist"""
    data = request.get_json()
    
    product_id = data.get('product_identifier')
    if not product_id:
        return jsonify({'error': 'Product identifier is required'}), 400
    
    # Check if already in wishlist
    existing = Wishlist.query.filter_by(
        user_id=current_user.id,
        product_identifier=product_id
    ).first()
    
    if existing:
        return jsonify({'error': 'Product already in wishlist'}), 409
    
    # Add to wishlist
    wishlist_item = Wishlist(
        user_id=current_user.id,
        product_identifier=product_id,
        product_title=data.get('product_title'),
        product_price=data.get('product_price'),
        product_rating=data.get('product_rating'),
        product_image=data.get('product_image')
    )
    
    try:
        db.session.add(wishlist_item)
        db.session.commit()
        return jsonify({
            'message': 'Product added to wishlist',
            'id': wishlist_item.id
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to add to wishlist'}), 500


@bp.route('/wishlist/remove/<int:item_id>', methods=['DELETE'])
@login_required
def remove_from_wishlist(item_id):
    """Remove product from wishlist"""
    wishlist_item = Wishlist.query.filter_by(
        id=item_id,
        user_id=current_user.id
    ).first()
    
    if not wishlist_item:
        return jsonify({'error': 'Item not found'}), 404
    
    try:
        db.session.delete(wishlist_item)
        db.session.commit()
        return jsonify({'message': 'Item removed from wishlist'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to remove item'}), 500


@bp.route('/wishlist/clear', methods=['DELETE'])
@login_required
def clear_wishlist():
    """Clear all items from wishlist"""
    try:
        Wishlist.query.filter_by(user_id=current_user.id).delete()
        db.session.commit()
        return jsonify({'message': 'Wishlist cleared'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to clear wishlist'}), 500




import pandas as pd
from app.services.ai_analysis import AIAnalysis


# AI Analysis API endpoints
@bp.route('/ai-analysis/product/<product_id>')
@login_required
def analyze_product(product_id):
    """Analyze a single product and return AI scoring"""
    analysis = AIAnalysis.analyze_product_by_identifier(product_id)
    
    if not analysis:
        return jsonify({'error': 'Product not found'}), 404
    
    return jsonify(analysis)


@bp.route('/ai-analysis/all')
@login_required
def analyze_all_products():
    """Get AI analysis for all products"""
    products = AIAnalysis.analyze_all_products()
    
    # Convert to records
    result = products[[
        'Product Identifier', 'Title', 'Image', 'Price', 'Ratings', 'Review',
        'AI_Total_Score', 'AI_Potential', 'AI_Potential_Color',
        'AI_Price_Score', 'AI_Rating_Score', 'AI_Sales_Score', 'Category'
    ]].to_dict('records')
    
    return jsonify({
        'products': result,
        'count': len(result)
    })


@bp.route('/ai-analysis/distribution')
@login_required
def get_potential_distribution():
    """Get distribution of products by potential level"""
    distribution = AIAnalysis.get_potential_distribution()
    return jsonify(distribution)


@bp.route('/ai-analysis/top-products')
@login_required
def get_top_potential_products():
    """Get top products by AI score"""
    limit = request.args.get('limit', 10, type=int)
    top_products = AIAnalysis.get_top_potential_products(limit=limit)
    
    return jsonify({
        'products': top_products,
        'count': len(top_products)
    })
