"""
Main API routes for dashboard data
"""
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
import pandas as pd
from app.services.data_loader import DataLoader
from app.services.aggregations import Aggregations
from app.services.filters import Filters
from app.services.comparisons import Comparisons
from app.services.ai_analysis import AIAnalysis
from app.models import Wishlist, Article
from app.extensions import db

bp = Blueprint('api', __name__)

# ==================== STATS ====================
@bp.route('/stats')
@login_required
def get_stats():
    """Get overview statistics"""
    stats = Aggregations.get_overview_stats()
    return jsonify(stats)


# ==================== PRODUCTS ====================
@bp.route('/products')
@login_required
def get_products():
    """Get filtered products with pagination"""
    price_min = request.args.get('price_min', type=float)
    price_max = request.args.get('price_max', type=float)
    rating_min = request.args.get('rating_min', type=float)
    category = request.args.get('category')
    search = request.args.get('search')
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    filtered = Filters.filter_products(
        price_min=price_min,
        price_max=price_max,
        rating_min=rating_min,
        category=category,
        search_term=search
    )
    
    # Apply pagination
    total = len(filtered)
    total_pages = (total + per_page - 1) // per_page
    start_idx = (page - 1) * per_page
    end_idx = start_idx + per_page
    paginated = filtered.iloc[start_idx:end_idx]
    
    # Transform to frontend-expected format
    products = []
    for idx, row in paginated.iterrows():
        products.append({
            'id': idx,
            'product_identifier': row.get('Product Identifier', ''),
            'product_name': row.get('Title', 'Unknown Product'),
            'product_category': row.get('Category', 'Unknown'),
            'item_price': row.get('Price', 0),
            'avg_star_rating': row.get('Ratings', 0),
            'image_url': row.get('Image', ''),
            'reviews': row.get('Review', 0),
            'monthly_sales': row.get('Sales_Number', 0)
        })
    
    return jsonify({
        'products': products,
        'count': len(products),
        'total': total,
        'page': page,
        'per_page': per_page,
        'total_pages': total_pages
    })


@bp.route('/products/<product_id>')
@login_required
def get_product_detail(product_id):
    """Get detailed product view"""
    product = DataLoader.get_product_by_identifier(product_id)
    
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    # Get suppliers for this product
    suppliers = DataLoader.get_suppliers_for_product(product_id)
    
    # Get comparison data
    comparison = Comparisons.product_vs_suppliers(product_id)
    
    # Get similar products (same category)
    all_products = DataLoader.load_products()
    category = product.get('Category', '')
    similar = all_products[
        (all_products['Category'] == category) & 
        (all_products['Product Identifier'] != product_id)
    ].head(4).to_dict('records')
    
    return jsonify({
        'product': product,
        'suppliers': suppliers.to_dict('records') if not suppliers.empty else [],
        'comparison': comparison,
        'similar_products': similar
    })


@bp.route('/top-products')
@login_required
def get_top_products():
    """Get top products by metric"""
    sort_by = request.args.get('sort_by', 'ratings')
    limit = request.args.get('limit', 8, type=int)
    
    top = Aggregations.get_top_products(limit=limit, sort_by=sort_by)
    return jsonify(top)


@bp.route('/top-rated-products')
@login_required
def get_top_rated_products():
    """Get top rated products"""
    limit = request.args.get('limit', 8, type=int)
    min_rating = request.args.get('min_rating', 4.5, type=float)
    
    top = Aggregations.get_top_rated_products(limit=limit, min_rating=min_rating)
    return jsonify(top)


@bp.route('/best-sellers')
@login_required
def get_best_sellers():
    """Get best selling products"""
    limit = request.args.get('limit', 8, type=int)
    
    best = Aggregations.get_best_sellers(limit=limit)
    return jsonify(best)


# ==================== SUPPLIERS ====================
@bp.route('/suppliers')
@login_required
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


@bp.route('/top-suppliers')
@login_required
def get_top_suppliers():
    """Get top suppliers by metric"""
    sort_by = request.args.get('sort_by', 'rating')
    limit = request.args.get('limit', 6, type=int)
    
    top = Aggregations.get_top_suppliers(limit=limit, sort_by=sort_by)
    return jsonify(top)


# ==================== CATEGORIES & DISTRIBUTIONS ====================
@bp.route('/categories')
@login_required
def get_categories():
    """Get category breakdown"""
    categories = Aggregations.get_category_breakdown()
    return jsonify(categories)


@bp.route('/charts/category-distribution')
@login_required 
def get_category_distribution():
    """Get category distribution for charts"""
    categories = Aggregations.get_category_breakdown()
    return jsonify({
        'labels': [c['category'] for c in categories],
        'values': [c['count'] for c in categories]
    })


@bp.route('/price-distribution')
@login_required
def get_price_distribution():
    """Get price distribution for charts"""
    bins = request.args.get('bins', 10, type=int)
    distribution = Aggregations.get_price_distribution(bins=bins)
    return jsonify(distribution)


@bp.route('/rating-distribution')
@login_required
def get_rating_distribution():
    """Get rating distribution for charts"""
    distribution = Aggregations.get_rating_distribution()
    return jsonify(distribution)


@bp.route('/location-stats')
@login_required
def get_location_stats():
    """Get supplier location statistics"""
    stats = Aggregations.get_supplier_location_stats()
    return jsonify(stats)


@bp.route('/filter-options')
@login_required
def get_filter_options():
    """Get all available filter options"""
    options = Filters.get_filter_options()
    
    # Return in format expected by frontend
    return jsonify({
        'categories': options.get('categories', []),
        'suppliers': options.get('locations', []),  # Map locations to suppliers for frontend
        'brands': [],  # Not available in current data
        'price_range': options.get('price_range', {}),
        'rating_range': options.get('rating_range', {})
    })


# ==================== COMPARISONS ====================
@bp.route('/compare-products')
@login_required
def compare_products():
    """Compare multiple products"""
    identifiers = request.args.getlist('ids[]')
    comparison = Comparisons.compare_products(identifiers)
    return jsonify(comparison)


@bp.route('/compare-suppliers')
@login_required
def compare_suppliers():
    """Compare multiple suppliers"""
    names = request.args.getlist('names[]')
    comparison = Comparisons.compare_suppliers(names)
    return jsonify(comparison)


@bp.route('/product-vs-suppliers/<product_id>')
@login_required
def product_vs_suppliers(product_id):
    """Compare product with its suppliers"""
    comparison = Comparisons.product_vs_suppliers(product_id)
    if comparison is None:
        return jsonify({'error': 'Product not found'}), 404
    return jsonify(comparison)


# ==================== CHARTS ====================
@bp.route('/charts/products')
@login_required
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
@login_required
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
    
    # Replace NaN values
    filtered = filtered.fillna(0)
    
    # Location distribution (top 10)
    location_dist = filtered['Location'].value_counts().head(10)
    location_data = {
        'labels': location_dist.index.tolist(),
        'values': location_dist.values.tolist()
    }
    
    # Category distribution
    if 'Product Searched' in filtered.columns:
        category_dist = filtered['Product Searched'].value_counts().head(10)
        category_data = {
            'labels': category_dist.index.tolist(),
            'values': category_dist.values.tolist()
        }
    else:
        category_data = {'labels': [], 'values': []}
    
    return jsonify({
        'location': location_data,
        'categories': category_data,
        'count': len(filtered)
    })


@bp.route('/charts/overview')
@login_required
def get_overview_charts():
    """Get overview chart data"""
    stats = Aggregations.get_overview_stats()
    categories = Aggregations.get_category_breakdown()
    location_stats = Aggregations.get_supplier_location_stats()
    price_dist = Aggregations.get_price_distribution()
    rating_dist = Aggregations.get_rating_distribution()
    
    return jsonify({
        'stats': stats,
        'categories': categories,
        'locations': location_stats,
        'price_distribution': price_dist,
        'rating_distribution': rating_dist
    })


# ==================== AI ANALYSIS ====================
@bp.route('/ai-analysis')
@login_required
def get_ai_analysis():
    """Get AI analysis data"""
    distribution = AIAnalysis.get_potential_distribution()
    top_products = AIAnalysis.get_top_potential_products(limit=12)
    
    return jsonify({
        'distribution': distribution,
        'top_products': top_products
    })


@bp.route('/ai-analysis/products')
@login_required
def get_ai_products():
    """Get AI scored products with filters"""
    potential = request.args.get('potential')  # high, moderate, low
    price_range = request.args.get('price_range')  # 0-500, 500-1000, etc.
    search = request.args.get('search')
    limit = request.args.get('limit', 50, type=int)
    
    products = AIAnalysis.get_top_potential_products(limit=limit)
    
    # Apply filters
    if potential:
        products = [p for p in products if p.get('AI_Potential', '').lower() == potential.lower()]
    
    if price_range:
        parts = price_range.split('-')
        if len(parts) == 2:
            min_price = float(parts[0])
            max_price = float(parts[1].replace('+', '99999'))
            products = [p for p in products if min_price <= p.get('Price', 0) <= max_price]
    
    if search:
        search_lower = search.lower()
        products = [p for p in products if search_lower in p.get('Title', '').lower()]
    
    return jsonify({
        'products': products,
        'count': len(products)
    })


# ==================== WISHLIST ====================
@bp.route('/wishlist')
@login_required
def get_wishlist():
    """Get user's wishlist"""
    items = Wishlist.query.filter_by(user_id=current_user.id).order_by(Wishlist.added_at.desc()).all()
    
    return jsonify({
        'items': [{
            'id': item.id,
            'product_identifier': item.product_identifier,
            'product_title': item.product_title,
            'product_price': item.product_price,
            'product_rating': item.product_rating,
            'product_image': item.product_image,
            'added_at': item.added_at.isoformat() if item.added_at else None,
            'notes': item.notes
        } for item in items],
        'count': len(items)
    })


@bp.route('/wishlist', methods=['POST'])
@login_required
def add_to_wishlist():
    """Add product to wishlist"""
    data = request.get_json()
    
    product_id = data.get('product_identifier')
    if not product_id:
        return jsonify({'success': False, 'message': 'Product identifier required'}), 400
    
    # Check if already in wishlist
    existing = Wishlist.query.filter_by(
        user_id=current_user.id,
        product_identifier=product_id
    ).first()
    
    if existing:
        return jsonify({'success': False, 'message': 'Product already in wishlist'}), 400
    
    # Add to wishlist
    wishlist_item = Wishlist(
        user_id=current_user.id,
        product_identifier=product_id,
        product_title=data.get('product_title'),
        product_price=data.get('product_price'),
        product_rating=data.get('product_rating'),
        product_image=data.get('product_image'),
        notes=data.get('notes')
    )
    
    try:
        db.session.add(wishlist_item)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Added to wishlist', 'id': wishlist_item.id})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


@bp.route('/wishlist/<int:item_id>', methods=['DELETE'])
@login_required
def remove_from_wishlist(item_id):
    """Remove product from wishlist"""
    item = Wishlist.query.filter_by(id=item_id, user_id=current_user.id).first()
    
    if not item:
        return jsonify({'success': False, 'message': 'Item not found'}), 404
    
    try:
        db.session.delete(item)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Removed from wishlist'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


# ==================== UNIVERSITY (ARTICLES) ====================
@bp.route('/articles')
@login_required
def get_articles():
    """Get published articles"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 12, type=int)
    category = request.args.get('category')
    search = request.args.get('search')
    
    query = Article.query.filter_by(published=True)
    
    if category:
        query = query.filter_by(category=category)
    
    if search:
        query = query.filter(Article.title.ilike(f'%{search}%'))
    
    pagination = query.order_by(Article.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    # Get unique categories
    categories = db.session.query(Article.category).filter(
        Article.published == True,
        Article.category.isnot(None)
    ).distinct().all()
    
    return jsonify({
        'articles': [article.to_dict() for article in pagination.items],
        'pagination': {
            'page': pagination.page,
            'pages': pagination.pages,
            'total': pagination.total,
            'has_prev': pagination.has_prev,
            'has_next': pagination.has_next,
            'prev_num': pagination.prev_num,
            'next_num': pagination.next_num
        },
        'categories': [c[0] for c in categories if c[0]]
    })


@bp.route('/articles/<slug>')
@login_required
def get_article(slug):
    """Get single article by slug"""
    article = Article.query.filter_by(slug=slug, published=True).first()
    
    if not article:
        return jsonify({'error': 'Article not found'}), 404
    
    # Increment view count
    article.views += 1
    db.session.commit()
    
    return jsonify(article.to_dict())
