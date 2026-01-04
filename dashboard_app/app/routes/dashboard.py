from flask import Blueprint, render_template, request
from app.services.data_loader import DataLoader
from app.services.aggregations import Aggregations
from app.services.filters import Filters
from app.services.comparisons import Comparisons

bp = Blueprint('dashboard', __name__)

@bp.route('/')
@bp.route('/overview')
def overview():
    """Main overview dashboard"""
    stats = Aggregations.get_overview_stats()
    top_products = Aggregations.get_top_products(limit=6, sort_by='ratings')
    top_suppliers = Aggregations.get_top_suppliers(limit=6, sort_by='rating')
    categories = Aggregations.get_category_breakdown()
    
    return render_template('dashboard/overview.html',
                         stats=stats,
                         top_products=top_products,
                         top_suppliers=top_suppliers,
                         categories=categories,
                         active_page='overview')

@bp.route('/products')
def products():
    """Products dashboard with filtering"""
    # Get filter parameters
    price_min = request.args.get('price_min', type=float)
    price_max = request.args.get('price_max', type=float)
    rating_min = request.args.get('rating_min', type=float)
    category = request.args.get('category')
    search = request.args.get('search')
    
    # Apply filters
    filtered_products = Filters.filter_products(
        price_min=price_min,
        price_max=price_max,
        rating_min=rating_min,
        category=category,
        search_term=search
    )
    
    products_list = filtered_products.to_dict('records')
    filter_options = Filters.get_filter_options()
    
    return render_template('dashboard/products.html',
                         products=products_list,
                         filter_options=filter_options,
                         active_filters=request.args,
                         active_page='products')

@bp.route('/suppliers')
def suppliers():
    """Suppliers dashboard with filtering"""
    # Get filter parameters
    price_min = request.args.get('price_min', type=float)
    price_max = request.args.get('price_max', type=float)
    rating_min = request.args.get('rating_min', type=float)
    location = request.args.get('location')
    product = request.args.get('product')
    search = request.args.get('search')
    
    # Apply filters
    filtered_suppliers = Filters.filter_suppliers(
        price_min=price_min,
        price_max=price_max,
        rating_min=rating_min,
        location=location,
        product_searched=product,
        search_term=search
    )
    
    suppliers_list = filtered_suppliers.to_dict('records')
    filter_options = Filters.get_filter_options()
    
    return render_template('dashboard/suppliers.html',
                         suppliers=suppliers_list,
                         filter_options=filter_options,
                         active_filters=request.args,
                         active_page='suppliers')

@bp.route('/comparisons')
def comparisons():
    """Comparison dashboard"""
    products = DataLoader.load_products()
    suppliers = DataLoader.load_suppliers()
    
    product_list = products['Product Identifier'].unique().tolist()
    supplier_list = suppliers['Supplier Name'].unique().tolist()
    
    return render_template('dashboard/comparisons.html',
                         product_list=product_list,
                         supplier_list=supplier_list,
                         active_page='comparisons')

@bp.route('/product/<product_id>')
def product_detail(product_id):
    """Detailed product view"""
    product = DataLoader.get_product_by_identifier(product_id)
    
    if not product:
        return render_template('errors/404.html'), 404
    
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
    
    return render_template('dashboard/product_detail.html',
                         product=product,
                         suppliers=suppliers.to_dict('records') if not suppliers.empty else [],
                         comparison=comparison,
                         similar_products=similar,
                         active_page='products')