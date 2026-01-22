import pandas as pd
from app.services.data_loader import DataLoader

class Filters:
    """Service for filtering data based on user selections"""
    
    @staticmethod
    def filter_products(price_min=None, price_max=None, rating_min=None, 
                       category=None, search_term=None):
        """Filter products based on multiple criteria"""
        df = DataLoader.load_products()
        
        # Apply filters
        if price_min is not None:
            df = df[df['Price'] >= float(price_min)]
        
        if price_max is not None:
            df = df[df['Price'] <= float(price_max)]
        
        if rating_min is not None:
            df = df[df['Ratings'] >= float(rating_min)]
        
        if category and category != 'all':
            df = df[df['Category'].str.contains(category, case=False, na=False)]
        
        if search_term:
            df = df[df['Title'].str.contains(search_term, case=False, na=False) | 
                   df['Product Identifier'].str.contains(search_term, case=False, na=False)]
        
        return df
    
    @staticmethod
    def filter_suppliers(price_min=None, price_max=None, rating_min=None,
                        location=None, product_searched=None, search_term=None):
        """Filter suppliers based on multiple criteria"""
        df = DataLoader.load_suppliers()
        
        # Apply filters
        if price_min is not None:
            df = df[df['Price'] >= float(price_min)]
        
        if price_max is not None:
            df = df[df['Price'] <= float(price_max)]
        
        if rating_min is not None:
            df = df[df['Rating'] >= float(rating_min)]
        
        if location and location != 'all':
            df = df[df['Location'].str.contains(location, case=False, na=False)]
        
        if product_searched and product_searched != 'all':
            df = df[df['Product Searched'] == product_searched]
        
        if search_term:
            df = df[df['Supplier Name'].str.contains(search_term, case=False, na=False) | 
                   df['Listing Title'].str.contains(search_term, case=False, na=False)]
        
        return df
    
    @staticmethod
    def get_filter_options():
        """Get all available filter options"""
        products = DataLoader.load_products()
        suppliers = DataLoader.load_suppliers()
        
        # Handle empty dataframes
        if products.empty:
            return {
                'categories': [],
                'locations': sorted(suppliers['Location'].unique().tolist()) if not suppliers.empty else [],
                'products': [],
                'price_range': {
                    'product_min': 0,
                    'product_max': 0,
                    'supplier_min': float(suppliers['Price'].min()) if not suppliers.empty else 0,
                    'supplier_max': float(suppliers['Price'].max()) if not suppliers.empty else 0
                },
                'rating_range': {
                    'product_min': 0,
                    'product_max': 5,
                    'supplier_min': float(suppliers['Rating'].min()) if not suppliers.empty else 0,
                    'supplier_max': float(suppliers['Rating'].max()) if not suppliers.empty else 5
                }
            }
        
        return {
            'categories': sorted(products['Category'].unique().tolist()),
            'locations': sorted(suppliers['Location'].unique().tolist()) if not suppliers.empty else [],
            'products': sorted(products['Product Identifier'].unique().tolist()),
            'price_range': {
                'product_min': float(products['Price'].min()),
                'product_max': float(products['Price'].max()),
                'supplier_min': float(suppliers['Price'].min()) if not suppliers.empty else 0,
                'supplier_max': float(suppliers['Price'].max()) if not suppliers.empty else 0
            },
            'rating_range': {
                'product_min': float(products['Ratings'].min()),
                'product_max': float(products['Ratings'].max()),
                'supplier_min': float(suppliers['Rating'].min()) if not suppliers.empty else 0,
                'supplier_max': float(suppliers['Rating'].max()) if not suppliers.empty else 5
            }
        }