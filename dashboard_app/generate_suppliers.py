"""
Generate fake supplier data for testing.
Creates 6230 suppliers across all products (from processed CSVs).
"""

import pandas as pd
import random
import glob
import os

try:
    from faker import Faker
    fake = Faker('en_IN')
    use_faker = True
except ImportError:
    use_faker = False
    print("Faker not installed — using built-in name lists only.")

random.seed(42)

# ── Load all products from processed CSVs ────────────────────────────────────
processed_dir = os.path.join('data', 'processed')
csv_files = glob.glob(os.path.join(processed_dir, '*.csv'))

if not csv_files:
    # Fallback to old single CSV
    csv_files = ['data/Product_Sheet.csv']

all_dfs = []
for f in csv_files:
    try:
        df = pd.read_csv(f, encoding='utf-8-sig')
        df.columns = df.columns.str.strip()
        all_dfs.append(df)
    except Exception as e:
        print(f"Warning: could not read {f}: {e}")

products_df = pd.concat(all_dfs, ignore_index=True) if all_dfs else pd.DataFrame()

# Normalise identifier column
if 'Product Identified' in products_df.columns and 'Product Identifier' not in products_df.columns:
    products_df['Product Identifier'] = products_df['Product Identified']

# Drop rows with missing identifiers or titles
products_df = products_df.dropna(subset=['Title'])
products_df['Product Identifier'] = products_df.get('Product Identifier', products_df['Title'].str[:50])

print(f"Loaded {len(products_df)} products from {len(csv_files)} CSVs.")

# ── Reference data ────────────────────────────────────────────────────────────
cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata',
    'Pune', 'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur',
    'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad',
    'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik',
    'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar', 'Varanasi',
    'Coimbatore', 'Kochi', 'Amritsar', 'Madurai', 'Ranchi', 'Jodhpur',
    'Raipur', 'Kota', 'Guwahati', 'Chandigarh', 'Thiruvananthapuram', 'Mysuru',
    'Tiruchirappalli', 'Dehradun', 'Siliguri', 'Aligarh', 'Hubli', 'Mangaluru',
]

company_suffixes = [
    'Enterprises', 'Industries', 'Traders', 'Suppliers', 'Corporation',
    'International', 'Exports', 'Imports', 'Solutions', 'Services',
    'Manufacturing', 'Trading Co.', 'Distributors', 'Wholesale', 'Retail',
    'Associates', 'Brothers', 'Group', 'Agency', 'Works',
]

first_names = [
    'Shree', 'Sri', 'Om', 'Jai', 'Sai', 'Ganesh', 'Lakshmi', 'Vishnu',
    'Rama', 'Krishna', 'Shiva', 'Durga', 'Patel', 'Shah', 'Gupta',
    'Kumar', 'Singh', 'Sharma', 'Verma', 'Mishra', 'Agarwal', 'Jain',
    'Mehta', 'Chopra', 'Nair', 'Reddy', 'Iyer', 'Pillai', 'Naidu',
]

last_names = [
    'Kumar', 'Singh', 'Patel', 'Shah', 'Gupta', 'Sharma', 'Verma',
    'Mishra', 'Agarwal', 'Jain', 'Mehta', 'Chopra', 'Nair', 'Reddy',
    'Iyer', 'Pillai', 'Naidu', 'Rao', 'Bose', 'Das', 'Roy', 'Ghosh',
    'Banerjee', 'Mukherjee', 'Chatterjee', 'Dutta', 'Sen', 'Basu',
    'Tiwari', 'Pandey', 'Dubey', 'Shukla', 'Chaudhary', 'Yadav',
    'Joshi', 'Bhatt', 'Trivedi', 'Desai', 'Modi', 'Kapoor', 'Malhotra',
    'Khanna', 'Bhatia', 'Sethi', 'Arora', 'Anand', 'Dewan', 'Sachdeva',
]


# ── Helper functions ─────────────────────────────────────────────────────────
def generate_supplier_name():
    prefix = random.choice(first_names)
    last   = random.choice(last_names)
    suffix = random.choice(company_suffixes)
    style  = random.randint(0, 3)
    if style == 0:
        return f"{prefix} {last} {suffix}"
    elif style == 1:
        return f"{last} {suffix}"
    elif style == 2:
        extra = random.choice(last_names)
        return f"{last}-{extra} {suffix}"
    else:
        return f"{prefix} {last}-{random.choice(last_names)} {suffix}"


def generate_phone():
    return f"+91 {random.randint(7000000000, 9999999999)}"


def generate_price(base_price):
    try:
        base = float(str(base_price).replace('₹', '').replace(',', '').strip())
    except (ValueError, TypeError):
        base = random.randint(100, 5000)
    if base <= 0:
        base = random.randint(100, 5000)
    variation = random.uniform(-0.30, 0.20)
    return max(50, round(base * (1 + variation), 2))


def generate_rating():
    weights = [0.04, 0.08, 0.18, 0.38, 0.32]
    ranges  = [(1.0, 2.0), (2.0, 3.0), (3.0, 3.5), (3.5, 4.5), (4.5, 5.0)]
    lo, hi  = random.choices(ranges, weights=weights)[0]
    return round(random.uniform(lo, hi), 1)


def generate_reviews():
    weights = [0.28, 0.33, 0.22, 0.11, 0.06]
    ranges  = [(10, 100), (100, 500), (500, 2000), (2000, 5000), (5000, 15000)]
    lo, hi  = random.choices(ranges, weights=weights)[0]
    return random.randint(lo, hi)


# ── Generate 6230 suppliers ──────────────────────────────────────────────────
NUM_SUPPLIERS = 6230
suppliers = []

print(f"Generating {NUM_SUPPLIERS} fake suppliers across {len(products_df)} products...")

for i in range(NUM_SUPPLIERS):
    product = products_df.iloc[i % len(products_df)]   # cycle through all products evenly

    price_raw = product.get('Price', 500)
    supplier = {
        'Supplier Round':    (i // len(products_df)) + 1,
        'Product Searched':  str(product['Title']),
        'Supplier Name':     generate_supplier_name(),
        'Price':             f"₹ {generate_price(price_raw)}",
        'Rating':            generate_rating(),
        'Reviews':           generate_reviews(),
        'Location':          random.choice(cities),
        'Contact Phone':     generate_phone(),
        'IndiaMART Link':    f"https://www.indiamart.com/supplier-{i + 1}/",
        'Product Identifier': str(product.get('Product Identifier', product['Title'][:50])),
    }
    suppliers.append(supplier)

    if (i + 1) % 500 == 0:
        print(f"  Generated {i + 1}/{NUM_SUPPLIERS} suppliers...")

# ── Save ─────────────────────────────────────────────────────────────────────
suppliers_df = pd.DataFrame(suppliers)
output_path  = os.path.join('data', 'supplier_results.csv')
suppliers_df.to_csv(output_path, index=False)

print(f"\n✅  Done! {NUM_SUPPLIERS} suppliers saved to: {output_path}")
print(f"\n📊  Statistics:")
print(f"   Total rows:              {len(suppliers_df):,}")
print(f"   Unique supplier names:   {suppliers_df['Supplier Name'].nunique():,}")
print(f"   Products covered:        {suppliers_df['Product Identifier'].nunique():,} / {len(products_df):,}")
print(f"   Unique locations:        {suppliers_df['Location'].nunique()}")
print(f"   Avg rating:              {suppliers_df['Rating'].mean():.2f}")
print(f"   Avg reviews:             {suppliers_df['Reviews'].mean():.0f}")
