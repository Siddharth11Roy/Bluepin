import os

class Config:
    """Base configuration"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    DATA_DIR = os.path.join(BASE_DIR, 'data')
    PRODUCT_CSV = os.path.join(DATA_DIR, 'Product_Sheet.csv')
    SUPPLIER_CSV = os.path.join(DATA_DIR, 'supplier_results.csv')
    PROCESSED_DIR = os.path.join(DATA_DIR, 'processed')
    
    # Cache settings
    CACHE_TIMEOUT = 300  # 5 minutes
    
    # Pagination
    ITEMS_PER_PAGE = 20
    
    # Dashboard refresh interval (seconds)
    DASHBOARD_REFRESH_INTERVAL = 30

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}