from flask import Flask
from flask_login import LoginManager
from flask_caching import Cache
from config import config
import os

# Initialize cache
cache = Cache()

def create_app(config_name='default'):
    """Application factory pattern"""
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Configure caching
    app.config['CACHE_TYPE'] = 'SimpleCache'  # In-memory cache
    app.config['CACHE_DEFAULT_TIMEOUT'] = 300  # 5 minutes
    
    # Initialize extensions
    from models import db
    db.init_app(app)
    
    # Initialize cache
    cache.init_app(app)
    
    # Initialize Flask-Login
    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'
    login_manager.login_message = 'Please log in to access this page.'
    login_manager.login_message_category = 'info'
    
    @login_manager.user_loader
    def load_user(user_id):
        from models import User
        return User.query.get(int(user_id))
    
    # Ensure directories exist
    os.makedirs(app.config['PROCESSED_DIR'], exist_ok=True)
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    # Register blueprints
    from app.routes import dashboard, api, admin, auth, university
    app.register_blueprint(auth.bp)
    app.register_blueprint(dashboard.bp)
    app.register_blueprint(api.bp, url_prefix='/api')
    app.register_blueprint(admin.bp, url_prefix='/admin')
    app.register_blueprint(university.bp)
    
    # Register template filters
    from app.utils import helpers
    app.jinja_env.filters['format_currency'] = helpers.format_currency
    app.jinja_env.filters['format_number'] = helpers.format_number
    
    return app