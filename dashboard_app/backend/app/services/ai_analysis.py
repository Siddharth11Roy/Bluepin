"""
AI Analysis Service for Product Scoring

Bluepin Scoring Formula:

1. SELLING PRICE (SP) – Margin Possibility (Max 25 points)
   ₹999 - ₹2,500 → 25 points
   ₹599 - ₹999 → 22 points
   ₹299 - ₹599 → 20 points
   ₹249 - ₹299 → 18 points
   > ₹2,500 → 15 points
   < ₹249 → 10 points

2. RATINGS – Post-Sale Risk (Max 30 points)
   > 4.3 → 30 points
   4.0 - 4.29 → 22 points
   3.7 - 3.99 → 12 points
   < 3.7 → 0 points

3. REVIEWS COUNT – Competition Density (Max 20 points)
   < 200 → 20 points
   200 - 800 → 14 points
   800 - 2,000 → 8 points
   > 2,000 → 0 points

4. MONTHLY SALES – Demand vs Competition (Max 25 points)
   300 - 1,500 → 25 points
   150 - 300 → 20 points
   1,500 - 3,000 → 18 points
   > 3,000 → 12 points
   < 150 → 10 points

Total Score Classification:
- 75 - 100 → High Potential
- 60 - 74 → Moderate Potential
- 45 - 59 → Low Potential
- Below 45 → Avoid
"""

import pandas as pd
from app.services.data_loader import DataLoader


class AIAnalysis:
    """Service for AI-based product analysis and scoring"""
    
    @staticmethod
    def calculate_price_score(price):
        """
        Calculate price score based on product selling price
        
        Args:
            price (float): Product price
            
        Returns:
            int: Price score (10, 15, 18, 20, 22, or 25)
        """
        if pd.isna(price) or price < 0:
            return 0
        
        if 999 <= price <= 2500:
            return 25
        elif 599 <= price < 999:
            return 22
        elif 299 <= price < 599:
            return 20
        elif 249 <= price < 299:
            return 18
        elif price > 2500:
            return 15
        else:  # price < 249
            return 10
    
    @staticmethod
    def calculate_rating_score(rating):
        """
        Calculate rating score based on product rating
        
        Args:
            rating (float): Product rating (0-5 scale)
            
        Returns:
            int: Rating score (0, 12, 22, or 30)
        """
        if pd.isna(rating) or rating < 0:
            return 0
        
        if rating > 4.3:
            return 30
        elif 4.0 <= rating <= 4.29:
            return 22
        elif 3.7 <= rating <= 3.99:
            return 12
        else:  # rating < 3.7
            return 0
    
    @staticmethod
    def calculate_reviews_score(reviews):
        """
        Calculate reviews count score based on competition density
        
        Args:
            reviews (int): Number of reviews
            
        Returns:
            int: Reviews score (0, 8, 14, or 20)
        """
        if pd.isna(reviews) or reviews < 0:
            return 0
        
        if reviews < 200:
            return 20
        elif 200 <= reviews <= 800:
            return 14
        elif 800 < reviews <= 2000:
            return 8
        else:  # reviews > 2000
            return 0
    
    @staticmethod
    def calculate_sales_score(sales):
        """
        Calculate sales score based on monthly sales demand vs competition
        
        Args:
            sales (int): Number of monthly sales
            
        Returns:
            int: Sales score (10, 12, 18, 20, or 25)
        """
        if pd.isna(sales) or sales < 0:
            return 0
        
        if 300 <= sales <= 1500:
            return 25
        elif 150 <= sales < 300:
            return 20
        elif 1500 < sales <= 3000:
            return 18
        elif sales > 3000:
            return 12
        else:  # sales < 150
            return 10
    
    @staticmethod
    def classify_potential(total_score):
        """
        Classify product potential based on total score
        
        Args:
            total_score (int): Sum of all scores (max 100)
            
        Returns:
            str: Potential classification
        """
        if total_score >= 75:
            return "High Potential"
        elif total_score >= 60:
            return "Moderate Potential"
        elif total_score >= 45:
            return "Low Potential"
        else:
            return "Avoid"
    
    @staticmethod
    def get_potential_color(potential):
        """
        Get color code for potential level
        
        Args:
            potential (str): Potential classification
            
        Returns:
            str: Color code
        """
        color_map = {
            "High Potential": "success",
            "Moderate Potential": "warning",
            "Low Potential": "info",
            "Avoid": "danger"
        }
        return color_map.get(potential, "secondary")
    
    @classmethod
    def analyze_product(cls, product_data):
        """
        Analyze a single product and return scoring details
        
        Args:
            product_data (dict or pd.Series): Product data
            
        Returns:
            dict: Analysis results with scores and classification
        """
        # Extract values and check for missing data
        missing_data = []
        
        # Price
        price = product_data.get('Price')
        if pd.isna(price) or price is None or price <= 0:
            missing_data.append('Price')
            price = 0
        else:
            price = float(price)
        
        # Rating
        rating = product_data.get('Ratings')
        if pd.isna(rating) or rating is None or rating <= 0:
            missing_data.append('Ratings')
            rating = 0
        else:
            rating = float(rating)
        
        # Reviews Count
        reviews = product_data.get('Review')
        if pd.isna(reviews) or reviews is None:
            missing_data.append('Review')
            reviews = 0
        else:
            reviews = int(reviews) if reviews > 0 else 0
        
        # Sales - Use Monthly Sales field
        sales = product_data.get('Monthly Sales')
        if pd.isna(sales) or sales is None:
            missing_data.append('Monthly Sales')
            sales = 0
        else:
            # Handle if Monthly Sales is a string (e.g., "1.2K", "500", "700+ BOUGHT IN PAST MONTH")
            if isinstance(sales, str):
                import re
                sales = sales.strip().upper()
                # Extract numeric value with optional decimal and K/M suffix
                match = re.search(r'(\d+\.?\d*)\s*([KM])?', sales)
                if match:
                    number = float(match.group(1))
                    suffix = match.group(2)
                    if suffix == 'K':
                        sales = number * 1000
                    elif suffix == 'M':
                        sales = number * 1000000
                    else:
                        sales = number
                else:
                    missing_data.append('Monthly Sales')
                    sales = 0
            else:
                sales = float(sales) if sales > 0 else 0
                if sales <= 0:
                    missing_data.append('Monthly Sales')
        
        # Calculate individual scores
        price_score = cls.calculate_price_score(price)
        rating_score = cls.calculate_rating_score(rating)
        reviews_score = cls.calculate_reviews_score(reviews)
        sales_score = cls.calculate_sales_score(sales)
        
        # Calculate total score
        total_score = price_score + rating_score + reviews_score + sales_score
        
        # Classify potential
        potential = cls.classify_potential(total_score)
        
        # Build result
        result = {
            'price': price,
            'price_score': price_score,
            'rating': rating,
            'rating_score': rating_score,
            'reviews': reviews,
            'reviews_score': reviews_score,
            'sales': sales,
            'sales_score': sales_score,
            'total_score': total_score,
            'potential': potential,
            'potential_color': cls.get_potential_color(potential),
            'missing_data': missing_data,
            'has_missing_data': len(missing_data) > 0,
            'breakdown': {
                'Selling Price': f'₹{price:.2f} → Score: {price_score}/25' if 'Price' not in missing_data else 'Data Missing',
                'Ratings': f'{rating:.1f}★ → Score: {rating_score}/30' if 'Ratings' not in missing_data else 'Data Missing',
                'Reviews Count': f'{int(reviews):,} reviews → Score: {reviews_score}/20' if 'Review' not in missing_data else 'Data Missing',
                'Monthly Sales': f'{int(sales):,} sales → Score: {sales_score}/25' if 'Monthly Sales' not in missing_data else 'Data Missing'
            }
        }
        
        return result
    
    @classmethod
    def analyze_product_by_identifier(cls, product_identifier):
        """
        Analyze a product by its identifier
        
        Args:
            product_identifier (str): Product identifier
            
        Returns:
            dict: Analysis results or None if product not found
        """
        product = DataLoader.get_product_by_identifier(product_identifier)
        if not product:
            return None
        
        analysis = cls.analyze_product(product)
        analysis['product_identifier'] = product_identifier
        analysis['product_title'] = product.get('Title', 'Unknown')
        analysis['product_image'] = product.get('Image', '')
        
        return analysis
    
    @classmethod
    def analyze_all_products(cls):
        """
        Analyze all products and return with scores
        
        Returns:
            pd.DataFrame: Products with analysis scores
        """
        products = DataLoader.load_products()
        
        # Helper function to parse sales values
        def parse_sales(value):
            if pd.isna(value) or value is None:
                return 0
            if isinstance(value, str):
                value = value.strip().upper()
                try:
                    if 'K' in value:
                        return float(value.replace('K', '').replace(',', '')) * 1000
                    elif 'M' in value:
                        return float(value.replace('M', '').replace(',', '')) * 1000000
                    else:
                        return float(value.replace(',', ''))
                except (ValueError, AttributeError):
                    return 0
            try:
                return float(value) if value > 0 else 0
            except (ValueError, TypeError):
                return 0
        
        # Calculate scores for all products
        products['AI_Price_Score'] = products['Price'].apply(cls.calculate_price_score)
        products['AI_Rating_Score'] = products['Ratings'].apply(cls.calculate_rating_score)
        products['AI_Reviews_Score'] = products['Review'].apply(cls.calculate_reviews_score)
        products['AI_Sales_Score'] = products['Monthly Sales'].apply(lambda x: cls.calculate_sales_score(parse_sales(x)))
        products['AI_Total_Score'] = (
            products['AI_Price_Score'] + 
            products['AI_Rating_Score'] + 
            products['AI_Reviews_Score'] +
            products['AI_Sales_Score']
        )
        products['AI_Potential'] = products['AI_Total_Score'].apply(cls.classify_potential)
        products['AI_Potential_Color'] = products['AI_Potential'].apply(cls.get_potential_color)
        
        return products
    
    @classmethod
    def get_potential_distribution(cls):
        """
        Get distribution of products by potential level
        
        Returns:
            dict: Count of products in each potential category
        """
        products = cls.analyze_all_products()
        distribution = products['AI_Potential'].value_counts().to_dict()
        
        return {
            'high': distribution.get('High Potential', 0),
            'moderate': distribution.get('Moderate Potential', 0),
            'low': distribution.get('Low Potential', 0),
            'avoid': distribution.get('Avoid', 0),
            'total': len(products)
        }
    
    @classmethod
    def get_top_potential_products(cls, limit=10):
        """
        Get top products by AI score
        
        Args:
            limit (int): Number of products to return
            
        Returns:
            list: Top products with analysis
        """
        products = cls.analyze_all_products()
        top_products = products.nlargest(limit, 'AI_Total_Score')
        
        return top_products[[
            'Product Identifier', 'Title', 'Image', 'Price', 'Ratings', 'Review', 'Monthly Sales',
            'AI_Total_Score', 'AI_Potential', 'AI_Potential_Color',
            'AI_Price_Score', 'AI_Rating_Score', 'AI_Reviews_Score', 'AI_Sales_Score'
        ]].to_dict('records')
