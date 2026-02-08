"""
Generate fake supplier data for testing
Creates 600 suppliers with random data and links them to products
"""

import pandas as pd
import random
from faker import Faker
import os

fake = Faker('en_IN')  # Indian locale for realistic data

# Load existing products to link suppliers
products_df = pd.read_csv('data/Product_Sheet.csv')
product_titles = products_df['Title'].tolist()
product_identifiers = products_df['Product Identifier'].tolist()

# Indian cities for suppliers
cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata',
    'Pune', 'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur',
    'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad',
    'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik',
    'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar', 'Varanasi'
]

# Company name suffixes
company_suffixes = [
    'Enterprises', 'Industries', 'Traders', 'Suppliers', 'Corporation',
    'International', 'Exports', 'Imports', 'Solutions', 'Services',
    'Manufacturing', 'Trading Co.', 'Distributors', 'Wholesale', 'Retail'
]

def generate_supplier_name():
    """Generate realistic Indian supplier names"""
    prefixes = ['Shree', 'Sri', 'Om', 'Jai', 'Sai', 'Ganesh', 'Lakshmi', 'Vishnu']
    names = [fake.last_name(), fake.company().split()[0], random.choice(['Kumar', 'Singh', 'Patel', 'Shah', 'Gupta'])]
    
    if random.random() > 0.5:
        return f"{random.choice(prefixes)} {random.choice(names)} {random.choice(company_suffixes)}"
    else:
        return f"{random.choice(names)} {random.choice(company_suffixes)}"

def generate_phone():
    """Generate Indian phone number"""
    return f"+91 {random.randint(70000, 99999)}{random.randint(10000, 99999)}"

def generate_price(base_price):
    """Generate supplier price based on product price with variation"""
    if pd.isna(base_price) or base_price == 0:
        base_price = random.randint(100, 5000)
    
    # Suppliers offer 5-30% variation from base price
    variation = random.uniform(-0.30, 0.15)
    supplier_price = base_price * (1 + variation)
    return max(50, round(supplier_price, 2))

def generate_rating():
    """Generate realistic supplier rating"""
    # Most suppliers have good ratings (3.5-5.0)
    weights = [0.05, 0.10, 0.20, 0.35, 0.30]  # Distribution for 1-5 stars
    rating_ranges = [(1.0, 2.0), (2.0, 3.0), (3.0, 3.5), (3.5, 4.5), (4.5, 5.0)]
    
    selected_range = random.choices(rating_ranges, weights=weights)[0]
    return round(random.uniform(selected_range[0], selected_range[1]), 1)

def generate_reviews():
    """Generate number of reviews"""
    # Most suppliers have moderate reviews
    weights = [0.30, 0.35, 0.20, 0.10, 0.05]
    review_ranges = [(10, 100), (100, 500), (500, 2000), (2000, 5000), (5000, 15000)]
    
    selected_range = random.choices(review_ranges, weights=weights)[0]
    return random.randint(selected_range[0], selected_range[1])

# Generate 613 suppliers
suppliers = []
num_suppliers = 613

print(f"Generating {num_suppliers} fake suppliers...")

for i in range(num_suppliers):
    # Select a random product to link
    product_idx = random.randint(0, len(products_df) - 1)
    product = products_df.iloc[product_idx]
    
    supplier = {
        'Supplier Round': random.randint(1, 5),
        'Product Searched': product['Title'],
        'Supplier Name': generate_supplier_name(),
        'Price': f"₹ {generate_price(product['Price'])}",
        'Rating': generate_rating(),
        'Reviews': generate_reviews(),
        'Location': random.choice(cities),
        'Contact Phone': generate_phone(),
        'IndiaMART Link': f"https://www.indiamart.com/supplier-{i+1}/",
        'Product Identifier': product['Product Identifier']
    }
    
    suppliers.append(supplier)
    
    if (i + 1) % 100 == 0:
        print(f"Generated {i + 1} suppliers...")

# Create DataFrame
suppliers_df = pd.DataFrame(suppliers)

# Save to CSV
output_path = 'data/supplier_results.csv'
suppliers_df.to_csv(output_path, index=False)

print(f"\n✅ Successfully generated {num_suppliers} suppliers!")
print(f"📁 Saved to: {output_path}")
print(f"\n📊 Statistics:")
print(f"   - Unique suppliers: {suppliers_df['Supplier Name'].nunique()}")
print(f"   - Unique locations: {suppliers_df['Location'].nunique()}")
print(f"   - Products with suppliers: {suppliers_df['Product Identifier'].nunique()}")
print(f"   - Avg rating: {suppliers_df['Rating'].mean():.2f}")
print(f"   - Avg reviews: {suppliers_df['Reviews'].mean():.0f}")
