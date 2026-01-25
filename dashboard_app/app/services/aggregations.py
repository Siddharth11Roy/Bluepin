import pandas as pd
import numpy as np
from app.services.data_loader import DataLoader

class Aggregations:
    """Service for computing KPIs and aggregated metrics"""
    
    @staticmethod
    def get_overview_stats():
        """Get high-level overview statistics"""
        products = DataLoader.load_products()
        suppliers = DataLoader.load_suppliers()
        
        # Calculate total sales in millions
        total_sales = products['Price'].sum()
        total_sales_millions = total_sales / 1000000
        
        stats = {
            'total_products': len(products),
            'total_suppliers': len(suppliers['Supplier Name'].unique()),
            'avg_product_rating': float(products['Ratings'].mean()),
            'avg_supplier_rating': float(suppliers['Rating'].mean()),
            'total_reviews': int(products['Review'].sum()),
            'total_supplier_reviews': int(suppliers['Reviews'].sum()),
            'total_sales_millions': float(total_sales_millions),
            'price_range': {
                'min': float(products['Price'].min()),
                'max': float(products['Price'].max())
            }
        }
        
        return stats
    
    @staticmethod
    def get_top_products(limit=5, sort_by='ratings'):
        """Get top products by various metrics"""
        products = DataLoader.load_products()
        
        if sort_by == 'ratings':
            top = products.nlargest(limit, 'Ratings')
        elif sort_by == 'reviews':
            top = products.nlargest(limit, 'Review')
        elif sort_by == 'sales':
            top = products.nlargest(limit, 'Sales_Number')
        elif sort_by == 'price_low':
            top = products.nsmallest(limit, 'Price')
        else:
            top = products.head(limit)
        
        return top.to_dict('records')
    
    @staticmethod
    def get_top_suppliers(limit=5, sort_by='rating'):
        """Get top suppliers by various metrics"""
        suppliers = DataLoader.load_suppliers()
        
        # Aggregate by supplier name
        agg_suppliers = suppliers.groupby('Supplier Name').agg({
            'Rating': 'mean',
            'Reviews': 'sum',
            'Price': 'mean',
            'Location': 'first',
            'Contact Phone': 'first'
        }).reset_index()
        
        if sort_by == 'rating':
            top = agg_suppliers.nlargest(limit, 'Rating')
        elif sort_by == 'reviews':
            top = agg_suppliers.nlargest(limit, 'Reviews')
        elif sort_by == 'price_low':
            top = agg_suppliers.nsmallest(limit, 'Price')
        else:
            top = agg_suppliers.head(limit)
        
        return top.to_dict('records')
    
    @staticmethod
    def get_category_breakdown():
        """Get product distribution by category"""
        products = DataLoader.load_products()
        category_stats = products.groupby('Category').agg({
            'Price': ['mean', 'min', 'max'],
            'Ratings': 'mean',
            'Review': 'sum',
            'Product Identifier': 'count'
        }).round(2)
        
        result = []
        for category in category_stats.index:
            result.append({
                'category': category,
                'count': int(category_stats.loc[category, ('Product Identifier', 'count')]),
                'avg_price': float(category_stats.loc[category, ('Price', 'mean')]),
                'min_price': float(category_stats.loc[category, ('Price', 'min')]),
                'max_price': float(category_stats.loc[category, ('Price', 'max')]),
                'avg_rating': float(category_stats.loc[category, ('Ratings', 'mean')]),
                'total_reviews': int(category_stats.loc[category, ('Review', 'sum')])
            })
        
        return result
    
    @staticmethod
    def get_price_distribution(bins=10):
        """Get price distribution data for charts"""
        products = DataLoader.load_products()
        hist, edges = np.histogram(products['Price'], bins=bins)
        
        return {
            'bins': [f"₹{int(edges[i])}-{int(edges[i+1])}" for i in range(len(edges)-1)],
            'counts': hist.tolist()
        }
    
    @staticmethod
    def get_rating_distribution():
        """Get rating distribution"""
        products = DataLoader.load_products()
        rating_bins = [0, 2, 3, 4, 4.5, 5]
        labels = ['0-2', '2-3', '3-4', '4-4.5', '4.5-5']
        
        products['Rating_Bin'] = pd.cut(products['Ratings'], bins=rating_bins, labels=labels)
        distribution = products['Rating_Bin'].value_counts().sort_index()
        
        return {
            'labels': distribution.index.tolist(),
            'counts': distribution.values.tolist()
        }
    
    @staticmethod
    def get_supplier_location_stats():
        """Get supplier statistics by location"""
        suppliers = DataLoader.load_suppliers()
        location_stats = suppliers.groupby('Location').agg({
            'Supplier Name': 'nunique',
            'Price': 'mean',
            'Rating': 'mean',
            'Reviews': 'sum'
        }).round(2).reset_index()
        
        location_stats.columns = ['location', 'supplier_count', 'avg_price', 'avg_rating', 'total_reviews']
        return location_stats.to_dict('records')