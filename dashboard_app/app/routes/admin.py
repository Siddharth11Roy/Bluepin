from flask import Blueprint, render_template, request, jsonify, flash, redirect, url_for
from flask_login import login_required, current_user
from functools import wraps
from app.services.data_loader import DataLoader
from app.services.aggregations import Aggregations
from models import db, Article
from datetime import datetime
import os

bp = Blueprint('admin', __name__)


def admin_required(f):
    """Decorator to require admin access"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated:
            flash('Please log in to access this page.', 'error')
            return redirect(url_for('auth.login'))
        if not current_user.is_admin:
            flash('You do not have permission to access this page.', 'error')
            return redirect(url_for('dashboard.overview'))
        return f(*args, **kwargs)
    return decorated_function


@bp.route('/')
@bp.route('/dashboard')
@login_required
@admin_required
def admin_dashboard():
    """Admin dashboard for managing content"""
    stats = Aggregations.get_overview_stats()
    
    # Get data freshness
    cache_time = DataLoader._cache_timestamp
    
    return render_template('admin/admin_dashboard.html',
                         stats=stats,
                         cache_time=cache_time,
                         active_page='admin')

@bp.route('/refresh-data', methods=['POST'])
@login_required
@admin_required
def refresh_data():
    """Refresh cached data"""
    try:
        DataLoader.clear_cache()
        DataLoader.load_products(force_reload=True)
        DataLoader.load_suppliers(force_reload=True)
        return jsonify({
            'success': True,
            'message': 'Data refreshed successfully'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


@bp.route('/articles')
@login_required
@admin_required
def manage_articles():
    """Manage Bluepin University articles"""
    articles = Article.query.order_by(Article.created_at.desc()).all()
    return render_template('admin/manage_articles.html',
                         articles=articles,
                         active_page='admin')


@bp.route('/articles/new', methods=['GET', 'POST'])
@login_required
@admin_required
def new_article():
    """Create new article"""
    if request.method == 'POST':
        title = request.form.get('title')
        content = request.form.get('content')
        excerpt = request.form.get('excerpt')
        category = request.form.get('category')
        published = request.form.get('published') == 'on'
        
        if not title or not content:
            flash('Title and content are required', 'error')
            return render_template('admin/article_form.html', article=None)
        
        # Create slug from title
        slug = title.lower().replace(' ', '-')
        slug = ''.join(c for c in slug if c.isalnum() or c == '-')
        
        article = Article(
            title=title,
            slug=slug,
            content=content,
            excerpt=excerpt or content[:200],
            category=category,
            author_id=current_user.id,
            published=published
        )
        
        db.session.add(article)
        db.session.commit()
        
        flash('Article created successfully!', 'success')
        return redirect(url_for('admin.manage_articles'))
    
    return render_template('admin/article_form.html', article=None)


@bp.route('/articles/<int:article_id>/edit', methods=['GET', 'POST'])
@login_required
@admin_required
def edit_article(article_id):
    """Edit existing article"""
    article = Article.query.get_or_404(article_id)
    
    if request.method == 'POST':
        article.title = request.form.get('title')
        article.content = request.form.get('content')
        article.excerpt = request.form.get('excerpt')
        article.category = request.form.get('category')
        article.published = request.form.get('published') == 'on'
        article.updated_at = datetime.utcnow()
        
        # Update slug
        slug = article.title.lower().replace(' ', '-')
        article.slug = ''.join(c for c in slug if c.isalnum() or c == '-')
        
        db.session.commit()
        
        flash('Article updated successfully!', 'success')
        return redirect(url_for('admin.manage_articles'))
    
    return render_template('admin/article_form.html', article=article)


@bp.route('/articles/<int:article_id>/delete', methods=['POST'])
@login_required
@admin_required
def delete_article(article_id):
    """Delete article"""
    article = Article.query.get_or_404(article_id)
    db.session.delete(article)
    db.session.commit()
    
    flash('Article deleted successfully!', 'success')
    return redirect(url_for('admin.manage_articles'))