"""
Bluepin University routes for article listing and viewing
"""
from flask import Blueprint, render_template, request, abort
from flask_login import login_required
from models import Article
from sqlalchemy import desc

bp = Blueprint('university', __name__, url_prefix='/university')


@bp.route('/')
@login_required
def index():
    """Display all published articles"""
    page = request.args.get('page', 1, type=int)
    per_page = 12
    category = request.args.get('category')
    search = request.args.get('search')
    
    query = Article.query.filter_by(published=True)
    
    # Filter by category
    if category:
        query = query.filter_by(category=category)
    
    # Search functionality
    if search:
        query = query.filter(
            (Article.title.contains(search)) | 
            (Article.content.contains(search)) |
            (Article.excerpt.contains(search))
        )
    
    # Pagination
    articles = query.order_by(desc(Article.created_at)).paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    # Get all categories for filter
    categories = Article.query.with_entities(Article.category).distinct().all()
    categories = [c[0] for c in categories if c[0]]
    
    return render_template('dashboard/university.html',
                         articles=articles,
                         categories=categories,
                         active_page='university')


@bp.route('/<slug>')
@login_required
def article_detail(slug):
    """Display single article"""
    article = Article.query.filter_by(slug=slug, published=True).first_or_404()
    
    # Increment view count
    article.views += 1
    from models import db
    db.session.commit()
    
    # Get related articles (same category)
    related_articles = Article.query.filter(
        Article.published == True,
        Article.category == article.category,
        Article.id != article.id
    ).order_by(desc(Article.created_at)).limit(3).all()
    
    return render_template('dashboard/article_detail.html',
                         article=article,
                         related_articles=related_articles,
                         active_page='university')
