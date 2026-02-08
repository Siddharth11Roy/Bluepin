"""
AI Analysis Service for Product Scoring

Scoring Formula:
- Price: <200=4, <250=6, 250-550=10, >550=8
- Ratings: >4.5=10, >4.2=8, >4.0=6, >3.6=4, <3.6=2
- Sales: 10k+=6, 5k+=8, 500+=10, 200-500=8, <200=6

Total Score Classification:
- >= 24: High Potential
- >= 18: Moderate Potential
- < 18: Low Potential
"""

import pandas as pd
from app.services.data_loader import DataLoader


class AIAnalysis:
    """Service for AI-based product analysis and scoring"""
    
    @staticmethod
    def calculate_price_score(price):
        """
        Calculate price score based on product price
        
        Args:
            price (float): Product price
            
        Returns:
            int: Price score (4, 6, 8, or 10)
        """
        if pd.isna(price) or price < 0:
            return 0
        
        if price < 200:
            return 4
        elif price < 250:
            return 6
        elif 250 <= price <= 550:
            return 10
        else:  # price > 550
            return 8
    
    @staticmethod
    def calculate_rating_score(rating):
        """
        Calculate rating score based on product rating
        
        Args:
            rating (float): Product rating (0-5 scale)
            
        Returns:
            int: Rating score (2, 4, 6, 8, or 10)
        """
        if pd.isna(rating) or rating < 0:
            return 0
        
        if rating > 4.5:
            return 10
        elif rating > 4.2:
            return 8
        elif rating > 4.0:
            return 6
        elif rating > 3.6:
            return 4
        else:  # rating <= 3.6
            return 2
    
    @staticmethod
    def calculate_sales_score(sales):
        """
        Calculate sales score based on monthly sales/reviews
        
        Args:
            sales (int): Number of sales or reviews
            
        Returns:
            int: Sales score (6, 8, or 10)
        """
        if pd.isna(sales) or sales < 0:
            return 0
        
        if sales >= 10000:
            return 6
        elif sales >= 5000:
            return 8
        elif sales >= 500:
            return 10
        elif sales >= 200:
            return 8
        else:  # sales < 200
            return 6
    
    @staticmethod
    def classify_potential(total_score):
        """
        Classify product potential based on total score
        
        Args:
            total_score (int): Sum of all scores
            
        Returns:
            str: Potential classification
        """
        if total_score >= 24:
            return "High Potential"
        elif total_score >= 18:
            return "Moderate Potential"
        else:
            return "Low Potential"
    
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
            "Low Potential": "danger"
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
        
        # Sales - Use Monthly Sales field instead of Review
        sales = product_data.get('Monthly Sales')
        if pd.isna(sales) or sales is None:
            missing_data.append('Monthly Sales')
            sales = 0
        else:
            # Handle if Monthly Sales is a string (e.g., "1.2K", "500")
            if isinstance(sales, str):
                sales = sales.strip().upper()
                if 'K' in sales:
                    sales = float(sales.replace('K', '')) * 1000
                elif 'M' in sales:
                    sales = float(sales.replace('M', '')) * 1000000
                else:
                    try:
                        sales = float(sales)
                    except:
                        missing_data.append('Monthly Sales')
                        sales = 0
            else:
                sales = float(sales) if sales > 0 else 0
                if sales <= 0:
                    missing_data.append('Monthly Sales')
        
        # Calculate individual scores
        price_score = cls.calculate_price_score(price)
        rating_score = cls.calculate_rating_score(rating)
        sales_score = cls.calculate_sales_score(sales)
        
        # Calculate total score
        total_score = price_score + rating_score + sales_score
        
        # Classify potential
        potential = cls.classify_potential(total_score)
        
        # Build result
        result = {
            'price': price,
            'price_score': price_score,
            'rating': rating,
            'rating_score': rating_score,
            'sales': sales,
            'sales_score': sales_score,
            'total_score': total_score,
            'potential': potential,
            'potential_color': cls.get_potential_color(potential),
            'missing_data': missing_data,
            'has_missing_data': len(missing_data) > 0,
            'breakdown': {
                'Price Analysis': f'₹{price:.2f} → Score: {price_score}/10' if 'Price' not in missing_data else 'Data Missing',
                'Rating Analysis': f'{rating:.1f}★ → Score: {rating_score}/10' if 'Ratings' not in missing_data else 'Data Missing',
                'Sales Analysis': f'{int(sales):,} sales → Score: {sales_score}/10' if 'Monthly Sales' not in missing_data else 'Data Missing'
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
        
        # Calculate scores for all products using Monthly Sales
        products['AI_Price_Score'] = products['Price'].apply(cls.calculate_price_score)
        products['AI_Rating_Score'] = products['Ratings'].apply(cls.calculate_rating_score)
        products['AI_Sales_Score'] = products['Monthly Sales'].apply(lambda x: cls.calculate_sales_score(parse_sales(x)))
        products['AI_Total_Score'] = (
            products['AI_Price_Score'] + 
            products['AI_Rating_Score'] + 
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
            'Product Identifier', 'Title', 'Image', 'Price', 'Ratings', 'Monthly Sales',
            'AI_Total_Score', 'AI_Potential', 'AI_Potential_Color',
            'AI_Price_Score', 'AI_Rating_Score', 'AI_Sales_Score'
        ]].to_dict('records')
