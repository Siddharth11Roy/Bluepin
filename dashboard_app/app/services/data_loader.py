import pandas as pd
import os
from flask import current_app
import json
from datetime import datetime

class DataLoader:
    """Service for loading and caching data"""
    
    _products_cache = None
    _suppliers_cache = None
    _cache_timestamp = None
    
    @classmethod
    def load_products(cls, force_reload=False):
        """Load products from CSV with caching"""
        if cls._products_cache is None or force_reload:
            csv_path = current_app.config['PRODUCT_CSV']
            df = pd.read_csv(csv_path)
            
            # Clean and process data
            df['Price'] = df['Price'].astype(str).str.replace(',', '').astype(float)
            df['Ratings'] = df['Ratings'].str.extract(r'(\d+\.\d+)').astype(float)
            df['Review'] = df['Review'].astype(str).str.replace(',', '').str.extract(r'(\d+)').fillna(0).astype(int)
            df['Monthly Sales'] = df['Monthly Sales'].fillna('0')
            
            # Extract sales number
            df['Sales_Number'] = df['Monthly Sales'].str.extract(r'(\d+)').fillna(0).astype(int)
            
            # Add category from product identifier
            df['Category'] = df['Product Identifier'].str.split().str[-2:].str.join(' ')
            
            cls._products_cache = df
            cls._cache_timestamp = datetime.now()
        
        return cls._products_cache.copy()
    
    @classmethod
    def load_suppliers(cls, force_reload=False):
        """Load suppliers from CSV with caching"""
        if cls._suppliers_cache is None or force_reload:
            csv_path = current_app.config['SUPPLIER_CSV']
            df = pd.read_csv(csv_path)
            
            # Clean and process data
            df['Price'] = df['Price'].fillna('₹ 0').astype(str).str.replace('₹', '').str.replace(',', '').str.split('/').str[0].astype(float)
            df['Rating'] = df['Rating'].fillna(0).astype(float)
            df['Reviews'] = df['Reviews'].fillna(0).astype(int)
            
            # Add supplier rank
            df['Supplier_Rank'] = df.groupby('Product Searched')['Supplier Round'].rank(method='dense')
            
            cls._suppliers_cache = df
            cls._cache_timestamp = datetime.now()
        
        return cls._suppliers_cache.copy()
    
    @classmethod
    def get_product_by_identifier(cls, identifier):
        """Get single product by identifier"""
        df = cls.load_products()
        product = df[df['Product Identifier'] == identifier]
        if not product.empty:
            return product.iloc[0].to_dict()
        return None
    
    @classmethod
    def get_suppliers_for_product(cls, product_identifier):
        """Get all suppliers for a specific product"""
        df = cls.load_suppliers()
        return df[df['Product Searched'] == product_identifier].copy()
    
    @classmethod
    def clear_cache(cls):
        """Clear all cached data"""
        cls._products_cache = None
        cls._suppliers_cache = None
        cls._cache_timestamp = None