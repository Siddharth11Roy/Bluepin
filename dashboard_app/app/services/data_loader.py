import pandas as pd
import os
from flask import current_app
import json
from datetime import datetime
import glob

class DataLoader:
    """Service for loading and caching data"""
    
    _products_cache = None
    _suppliers_cache = None
    _cache_timestamp = None
    
    @classmethod
    def load_products(cls, force_reload=False):
        """Load products from all CSV files in processed folder with caching"""
        if cls._products_cache is None or force_reload:
            processed_dir = current_app.config['PROCESSED_DIR']
            
            # Find all CSV files in processed folder
            csv_files = glob.glob(os.path.join(processed_dir, '*.csv'))
            
            if not csv_files:
                # Fallback to old single CSV if no files in processed folder
                csv_path = current_app.config['PRODUCT_CSV']
                if os.path.exists(csv_path):
                    csv_files = [csv_path]
                else:
                    # Return empty dataframe if no data files found
                    return pd.DataFrame()
            
            all_products = []
            
            # Load each CSV and extract category from filename
            for csv_file in csv_files:
                try:
                    df = pd.read_csv(csv_file)
                    
                    # Extract category from filename (e.g., "Car and Automobiles - P C.csv" -> "Car and Automobiles")
                    filename = os.path.basename(csv_file)
                    category = filename.replace(' - P C.csv', '').replace('.csv', '')
                    
                    # Add category column
                    df['Category'] = category
                    
                    all_products.append(df)
                except Exception as e:
                    print(f"Error loading {csv_file}: {e}")
                    continue
            
            if not all_products:
                return pd.DataFrame()
            
            # Combine all dataframes
            df = pd.concat(all_products, ignore_index=True)
            
            # Clean and process data
            # Handle text fields - convert to string and fill NaN
            df['Title'] = df['Title'].fillna('Unknown Product').astype(str)
            df['Image'] = df['Image'].fillna('').astype(str)
            
            # Clean price
            df['Price'] = df['Price'].astype(str).str.replace(',', '').str.replace('₹', '').str.strip()
            df['Price'] = pd.to_numeric(df['Price'], errors='coerce').fillna(0)
            
            # Clean ratings
            df['Ratings'] = df['Ratings'].astype(str).str.extract(r'(\d+\.?\d*)').fillna(0).astype(float)
            
            # Clean reviews
            df['Review'] = df['Review'].astype(str).str.replace(',', '').str.extract(r'(\d+)').fillna(0).astype(int)
            
            # Clean monthly sales
            df['Monthly Sales'] = df['Monthly Sales'].fillna('0').astype(str)
            
            # Extract sales number
            df['Sales_Number'] = df['Monthly Sales'].str.extract(r'(\d+)').fillna(0).astype(int)
            
            # Use Product Identified as Product Identifier (fix typo in CSV)
            if 'Product Identified' in df.columns and 'Product Identifier' not in df.columns:
                df['Product Identifier'] = df['Product Identified'].fillna('Unknown').astype(str)
            elif 'Product Identifier' in df.columns:
                df['Product Identifier'] = df['Product Identifier'].fillna('Unknown').astype(str)
            else:
                # Create Product Identifier from Title if neither exists
                df['Product Identifier'] = df['Title'].str[:50]
            
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