// User types
export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  is_admin: boolean;
  created_at?: string;
  last_login?: string;
}

// Product types
export interface Product {
  'Product Identifier': string;
  Title: string;
  Price: number;
  Ratings: number;
  Review: number;
  Image: string;
  Category: string;
  'Monthly Sales'?: number;
  Sales_Number?: number;
}

// AI Product with scoring
export interface AIProduct extends Product {
  AI_Total_Score: number;
  AI_Price_Score: number;
  AI_Rating_Score: number;
  AI_Reviews_Score: number;
  AI_Sales_Score: number;
  AI_Potential: string;
  AI_Potential_Color: string;
}

// Supplier types
export interface Supplier {
  'Supplier Name': string;
  Location: string;
  Price: number;
  Rating: number;
  Reviews: number;
  'Contact Phone': string;
  'IndiaMART Link': string;
  'Product Searched': string;
}

// Stats types
export interface DashboardStats {
  total_products: number;
  total_suppliers: number;
  total_sales_millions: number;
  total_reviews: number;
  avg_product_price: number;
  avg_supplier_price: number;
  avg_product_rating: number;
}

// Filter options
export interface FilterOptions {
  categories: string[];
  locations: string[];
  price_range: {
    min: number;
    max: number;
  };
  rating_range: {
    min: number;
    max: number;
  };
}

// Chart data
export interface ChartData {
  labels: string[];
  values: number[];
}

// Article types
export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: string;
  created_at: string;
  updated_at: string;
  published: boolean;
  featured_image?: string;
  views: number;
  category?: string;
  tags: string[];
}

// Wishlist item
export interface WishlistItem {
  id: number;
  product_identifier: string;
  product_title?: string;
  product_price?: number;
  product_rating?: number;
  product_image?: string;
  added_at: string;
  notes?: string;
}

// AI Distribution
export interface AIDistribution {
  total: number;
  high: number;
  moderate: number;
  low: number;
}

// Pagination
export interface Pagination {
  page: number;
  pages: number;
  total: number;
  has_prev: boolean;
  has_next: boolean;
  prev_num?: number;
  next_num?: number;
}
