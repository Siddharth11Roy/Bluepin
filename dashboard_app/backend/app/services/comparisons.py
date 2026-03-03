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
        
        # Replace NaN values with None before converting to dict
        compared = compared.replace({np.nan: None, np.inf: None, -np.inf: None})
        result = compared.to_dict('records')
        
        # Add AI analysis scores for each product
        from app.services.ai_analysis import AIAnalysis
        for product in result:
            ai_result = AIAnalysis.analyze_product(product)
            product['ai_score'] = ai_result.get('total_score', 0)
            product['ai_potential'] = ai_result.get('potential', 'Unknown')
        
        # Add comparison metrics
        if len(result) > 1:
            prices = [p['Price'] for p in result if p['Price'] is not None]
            ratings = [p['Ratings'] for p in result if p['Ratings'] is not None]
            reviews = [p['Review'] for p in result if p['Review'] is not None]
            ai_scores = [p['ai_score'] for p in result if p['ai_score'] is not None]
            
            for i, product in enumerate(result):
                product['is_cheapest'] = product['Price'] == min(prices) if prices and product['Price'] is not None else False
                product['is_highest_rated'] = product['Ratings'] == max(ratings) if ratings and product['Ratings'] is not None else False
                product['is_most_reviewed'] = product['Review'] == max(reviews) if reviews and product['Review'] is not None else False
                product['is_best_ai_score'] = product['ai_score'] == max(ai_scores) if ai_scores and product['ai_score'] is not None else False
        
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
            'Rating': 'mean',
            'Reviews': 'sum',
            'Location': 'first',
            'Contact Phone': 'first',
            'Product Searched': 'count'
        }).reset_index()
        
        agg.columns = ['name', 'avg_rating', 'total_reviews', 
                       'location', 'phone', 'product_count']
        
        # Replace NaN values with None before converting to dict
        agg = agg.replace({np.nan: None, np.inf: None, -np.inf: None})
        result = agg.to_dict('records')
        
        # Add comparison metrics
        if len(result) > 1:
            ratings = [s['avg_rating'] for s in result if s['avg_rating'] is not None]
            reviews = [s['total_reviews'] for s in result if s['total_reviews'] is not None]
            
            for supplier in result:
                supplier['is_highest_rated'] = supplier['avg_rating'] == max(ratings) if ratings and supplier['avg_rating'] is not None else False
                supplier['is_most_reviewed'] = supplier['total_reviews'] == max(reviews) if reviews and supplier['total_reviews'] is not None else False
        
        return result
    
    @staticmethod
    def product_vs_suppliers(product_identifier):
        """Compare product with its suppliers"""
        product = DataLoader.get_product_by_identifier(product_identifier)
        suppliers = DataLoader.get_suppliers_for_product(product_identifier)
        
        if product is None or suppliers.empty:
            return None
        
        # Replace NaN values in suppliers dataframe
        suppliers = suppliers.replace({np.nan: None, np.inf: None, -np.inf: None})
        
        # Calculate price comparison
        product_price = product['Price'] if pd.notna(product['Price']) else 0
        supplier_prices = [p for p in suppliers['Price'].tolist() if p is not None]
        
        if supplier_prices:
            avg_supplier_price = np.mean(supplier_prices)
            min_supplier_price = np.min(supplier_prices)
            max_supplier_price = np.max(supplier_prices)
            savings = ((product_price - min_supplier_price) / product_price * 100) if product_price > 0 and min_supplier_price < product_price else 0
        else:
            avg_supplier_price = 0
            min_supplier_price = 0
            max_supplier_price = 0
            savings = 0
        
        # Calculate rating comparison
        product_rating = product['Ratings'] if pd.notna(product['Ratings']) else 0
        supplier_ratings = [r for r in suppliers['Rating'].tolist() if r is not None]
        avg_supplier_rating = np.mean(supplier_ratings) if supplier_ratings else 0
        
        return {
            'product': product,
            'suppliers': suppliers.to_dict('records'),
            'price_comparison': {
                'product_price': float(product_price) if product_price else 0,
                'avg_supplier_price': float(avg_supplier_price) if avg_supplier_price else 0,
                'min_supplier_price': float(min_supplier_price) if min_supplier_price else 0,
                'max_supplier_price': float(max_supplier_price) if max_supplier_price else 0,
                'potential_savings': float(savings) if savings else 0
            },
            'rating_comparison': {
                'product_rating': float(product_rating) if product_rating else 0,
                'avg_supplier_rating': float(avg_supplier_rating) if avg_supplier_rating else 0,
                'rating_diff': float(product_rating - avg_supplier_rating) if (product_rating and avg_supplier_rating) else 0
            },
            'supplier_count': len(suppliers)
        }