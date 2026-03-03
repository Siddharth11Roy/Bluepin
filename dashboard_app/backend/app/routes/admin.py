"""
Admin API routes
"""
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from functools import wraps
from app.models import User, Article
from app.extensions import db
from app.services.data_loader import DataLoader
from app.services.aggregations import Aggregations
from datetime import datetime
import re

bp = Blueprint('admin', __name__)

def admin_required(f):
    """Decorator to require admin access"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or not current_user.is_admin:
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function


@bp.route('/dashboard')
@login_required
@admin_required
def admin_dashboard():
    """Get admin dashboard data"""
    stats = Aggregations.get_overview_stats()
    cache_time = DataLoader.get_last_update_time()
    
    # Get user stats
    total_users = User.query.count()
    active_users = User.query.filter_by(is_active=True).count()
    admin_users = User.query.filter_by(is_admin=True).count()
    
    # Get article stats
    total_articles = Article.query.count()
    published_articles = Article.query.filter_by(published=True).count()
    
    return jsonify({
        'stats': stats,
        'cache_time': cache_time,
        'users': {
            'total': total_users,
            'active': active_users,
            'admins': admin_users
        },
        'articles': {
            'total': total_articles,
            'published': published_articles
        }
    })


@bp.route('/refresh-data', methods=['POST'])
@login_required
@admin_required
def refresh_data():
    """Refresh cached data"""
    try:
        DataLoader.refresh_data()
        return jsonify({
            'success': True,
            'message': 'Data refreshed successfully!'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


# ==================== ARTICLE MANAGEMENT ====================
@bp.route('/articles')
@login_required
@admin_required
def get_all_articles():
    """Get all articles (including unpublished)"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    pagination = Article.query.order_by(Article.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return jsonify({
        'articles': [article.to_dict() for article in pagination.items],
        'pagination': {
            'page': pagination.page,
            'pages': pagination.pages,
            'total': pagination.total,
            'has_prev': pagination.has_prev,
            'has_next': pagination.has_next
        }
    })


@bp.route('/articles', methods=['POST'])
@login_required
@admin_required
def create_article():
    """Create new article"""
    data = request.get_json()
    
    title = data.get('title')
    content = data.get('content')
    
    if not title or not content:
        return jsonify({'success': False, 'message': 'Title and content required'}), 400
    
    # Generate slug
    slug = re.sub(r'[^\w\s-]', '', title.lower())
    slug = re.sub(r'[-\s]+', '-', slug).strip('-')
    
    # Make slug unique
    base_slug = slug
    counter = 1
    while Article.query.filter_by(slug=slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1
    
    article = Article(
        title=title,
        slug=slug,
        content=content,
        excerpt=data.get('excerpt'),
        author_id=current_user.id,
        published=data.get('published', False),
        featured_image=data.get('featured_image'),
        category=data.get('category'),
        tags=','.join(data.get('tags', [])) if isinstance(data.get('tags'), list) else data.get('tags')
    )
    
    try:
        db.session.add(article)
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Article created successfully',
            'article': article.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


@bp.route('/articles/<int:article_id>', methods=['PUT'])
@login_required
@admin_required
def update_article(article_id):
    """Update article"""
    article = Article.query.get_or_404(article_id)
    data = request.get_json()
    
    if 'title' in data:
        article.title = data['title']
    if 'content' in data:
        article.content = data['content']
    if 'excerpt' in data:
        article.excerpt = data['excerpt']
    if 'published' in data:
        article.published = data['published']
    if 'featured_image' in data:
        article.featured_image = data['featured_image']
    if 'category' in data:
        article.category = data['category']
    if 'tags' in data:
        article.tags = ','.join(data['tags']) if isinstance(data['tags'], list) else data['tags']
    
    article.updated_at = datetime.utcnow()
    
    try:
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Article updated successfully',
            'article': article.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


@bp.route('/articles/<int:article_id>', methods=['DELETE'])
@login_required
@admin_required
def delete_article(article_id):
    """Delete article"""
    article = Article.query.get_or_404(article_id)
    
    try:
        db.session.delete(article)
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Article deleted successfully'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


# ==================== USER MANAGEMENT ====================
@bp.route('/users')
@login_required
@admin_required
def get_users():
    """Get all users"""
    users = User.query.order_by(User.created_at.desc()).all()
    
    return jsonify({
        'users': [{
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'full_name': user.full_name,
            'is_active': user.is_active,
            'is_admin': user.is_admin,
            'created_at': user.created_at.isoformat() if user.created_at else None,
            'last_login': user.last_login.isoformat() if user.last_login else None
        } for user in users]
    })


@bp.route('/users/<int:user_id>/toggle-admin', methods=['POST'])
@login_required
@admin_required
def toggle_admin(user_id):
    """Toggle user admin status"""
    user = User.query.get_or_404(user_id)
    
    if user.id == current_user.id:
        return jsonify({'success': False, 'message': 'Cannot modify your own admin status'}), 400
    
    user.is_admin = not user.is_admin
    
    try:
        db.session.commit()
        return jsonify({
            'success': True,
            'message': f"User {'promoted to' if user.is_admin else 'demoted from'} admin",
            'is_admin': user.is_admin
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


@bp.route('/users/<int:user_id>/toggle-active', methods=['POST'])
@login_required
@admin_required
def toggle_active(user_id):
    """Toggle user active status"""
    user = User.query.get_or_404(user_id)
    
    if user.id == current_user.id:
        return jsonify({'success': False, 'message': 'Cannot deactivate your own account'}), 400
    
    user.is_active = not user.is_active
    
    try:
        db.session.commit()
        return jsonify({
            'success': True,
            'message': f"User {'activated' if user.is_active else 'deactivated'}",
            'is_active': user.is_active
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


@bp.route('/users/<int:user_id>', methods=['PUT'])
@login_required
@admin_required
def update_user(user_id):
    """Update user"""
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    if user.id == current_user.id and 'is_admin' in data and not data['is_admin']:
        return jsonify({'success': False, 'message': 'Cannot remove your own admin status'}), 400
    
    if 'is_admin' in data:
        user.is_admin = data['is_admin']
    if 'is_active' in data:
        user.is_active = data['is_active']
    
    try:
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'User updated successfully'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


@bp.route('/users/<int:user_id>', methods=['DELETE'])
@login_required
@admin_required
def delete_user(user_id):
    """Delete user"""
    user = User.query.get_or_404(user_id)
    
    if user.id == current_user.id:
        return jsonify({'success': False, 'message': 'Cannot delete your own account'}), 400
    
    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'User deleted successfully'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


# ==================== STATS ====================
@bp.route('/stats')
@login_required
@admin_required
def get_stats():
    """Get admin dashboard statistics"""
    import pandas as pd
    from ..services.data_loader import load_data
    
    try:
        df = load_data()
        total_products = len(df)
        total_suppliers = df['Supplier Name'].nunique() if 'Supplier Name' in df.columns else 0
    except:
        total_products = 0
        total_suppliers = 0
    
    total_users = User.query.count()
    total_articles = Article.query.count()
    
    return jsonify({
        'total_products': total_products,
        'total_suppliers': total_suppliers,
        'total_users': total_users,
        'total_articles': total_articles
    })
