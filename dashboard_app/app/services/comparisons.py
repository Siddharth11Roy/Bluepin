import pandas as pd
from app.services.data_loader import DataLoader
import numpy as np

class Comparisons:
    """Service for comparing products and suppliers"""
    
    @staticmethod
    def compare_products(product_identifiers):
        """Compare multiple products side by side"""
        if not product_identifiers:
            return []
        
        products = DataLoader.load_products()
        compared = products[products['Product Identifier'].isin(product_identifiers)]
        
        result = compared.to_dict('records')
        
        # Add comparison metrics
        if len(result) > 1:
            prices = [p['Price'] for p in result]
            ratings = [p['Ratings'] for p in result]
            reviews = [p['Review'] for p in result]
            
            for i, product in enumerate(result):
                product['is_cheapest'] = product['Price'] == min(prices)
                product['is_highest_rated'] = product['Ratings'] == max(ratings)
                product['is_most_reviewed'] = product['Review'] == max(reviews)
        
        return result
    
    @staticmethod
    def compare_suppliers(supplier_names):
        """Compare multiple suppliers"""
        if not supplier_names:
            return []
        
        suppliers = DataLoader.load_suppliers()
        compared = suppliers[suppliers['Supplier Name'].isin(supplier_names)]
        
        # Aggregate by supplier
        agg = compared.groupby('Supplier Name').agg({
            'Price': 'mean',
            'Rating': 'mean',
            'Reviews': 'sum',
            'Location': 'first',
            'Contact Phone': 'first',
            'Product Searched': 'count'
        }).reset_index()
        
        agg.columns = ['name', 'avg_price', 'avg_rating', 'total_reviews', 
                       'location', 'phone', 'product_count']
        
        result = agg.to_dict('records')
        
        # Add comparison metrics
        if len(result) > 1:
            prices = [s['avg_price'] for s in result]
            ratings = [s['avg_rating'] for s in result]
            reviews = [s['total_reviews'] for s in result]
            
            for supplier in result:
                supplier['is_cheapest'] = supplier['avg_price'] == min(prices)
                supplier['is_highest_rated'] = supplier['avg_rating'] == max(ratings)
                supplier['is_most_reviewed'] = supplier['total_reviews'] == max(reviews)
        
        return result
    
    @staticmethod
    def product_vs_suppliers(product_identifier):
        """Compare product with its suppliers"""
        product = DataLoader.get_product_by_identifier(product_identifier)
        suppliers = DataLoader.get_suppliers_for_product(product_identifier)
        
        if product is None or suppliers.empty:
            return None
        
        # Calculate price comparison
        product_price = product['Price']
        supplier_prices = suppliers['Price'].tolist()
        avg_supplier_price = np.mean(supplier_prices)
        min_supplier_price = np.min(supplier_prices)
        max_supplier_price = np.max(supplier_prices)
        
        savings = ((product_price - min_supplier_price) / product_price * 100) if min_supplier_price < product_price else 0
        
        # Calculate rating comparison
        product_rating = product['Ratings']
        avg_supplier_rating = suppliers['Rating'].mean()
        
        return {
            'product': product,
            'suppliers': suppliers.to_dict('records'),
            'price_comparison': {
                'product_price': float(product_price),
                'avg_supplier_price': float(avg_supplier_price),
                'min_supplier_price': float(min_supplier_price),
                'max_supplier_price': float(max_supplier_price),
                'potential_savings': float(savings)
            },
            'rating_comparison': {
                'product_rating': float(product_rating),
                'avg_supplier_rating': float(avg_supplier_rating),
                'rating_diff': float(product_rating - avg_supplier_rating)
            },
            'supplier_count': len(suppliers)
        }