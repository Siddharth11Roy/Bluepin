"""Test script to verify multi-CSV product loading"""
import os
import sys
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app import create_app
from app.services.data_loader import DataLoader

# Create app to initialize config
app = create_app()

with app.app_context():
    print("Loading products from all CSV files...")
    products = DataLoader.load_products(force_reload=True)
    
    print(f"\n✓ Total products loaded: {len(products)}")
    print(f"✓ Columns: {list(products.columns)}")
    
    if 'Category' in products.columns:
        categories = products['Category'].unique()
        print(f"\n✓ Categories found ({len(categories)}):")
        for cat in sorted(categories):
            count = len(products[products['Category'] == cat])
            print(f"  - {cat}: {count} products")
    
    print(f"\n✓ Sample product:")
    if not products.empty:
        sample = products.iloc[0]
        print(f"  Title: {sample.get('Title', 'N/A')}")
        print(f"  Category: {sample.get('Category', 'N/A')}")
        print(f"  Price: ₹{sample.get('Price', 0)}")
        print(f"  Rating: {sample.get('Ratings', 0)}")
        
    print("\n✓ Data loading successful!")
