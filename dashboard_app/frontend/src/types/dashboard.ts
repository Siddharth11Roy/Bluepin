// Dashboard statistics types
export interface OverviewStats {
    total_products: number;
    total_suppliers: number;
    avg_product_price: number;
    avg_supplier_price: number;
    avg_product_rating: number;
    avg_supplier_rating: number;
    total_reviews: number;
    total_supplier_reviews: number;
    total_sales_millions: number;
    price_range: {
        min: number;
        max: number;
    };
}

export interface CategoryData {
    category: string;
    count: number;
    avg_price: number;
    min_price: number;
    max_price: number;
    avg_rating: number;
    total_reviews: number;
}

export interface ChartData {
    labels?: string[];
    bins?: string[];
    counts: number[];
}

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

export interface LocationStats {
    location: string;
    supplier_count: number;
    avg_price: number;
    avg_rating: number;
    total_reviews: number;
}
