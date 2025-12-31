from flask import Flask
from config import config
import os

def create_app(config_name='default'):
    """Application factory pattern"""
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Ensure directories exist
    os.makedirs(app.config['PROCESSED_DIR'], exist_ok=True)
    
    # Register blueprints
    from app.routes import dashboard, api, admin
    app.register_blueprint(dashboard.bp)
    app.register_blueprint(api.bp, url_prefix='/api')
    app.register_blueprint(admin.bp, url_prefix='/admin')
    
    # Register template filters
    from app.utils import helpers
    app.jinja_env.filters['format_currency'] = helpers.format_currency
    app.jinja_env.filters['format_number'] = helpers.format_number
    
    return app