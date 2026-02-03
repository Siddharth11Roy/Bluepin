// Product types

export interface Product {
    'Product Identifier': string;
    Title: string;
    Price: number;
    Ratings: number;
    Review: number;
    Category: string;
    Image: string;
    Sales_Number?: number;
}

export interface ProductsResponse {
    products: Product[];
    total: number;
    page?: number;
    per_page?: number;
}

export interface ProductFilters {
    price_min?: number;
    price_max?: number;
    rating_min?: number;
    category?: string;
    search?: string;
}

export interface ProductChartData {
    labels: string[];
    values: number[];
}

export interface ProductChartsData {
    ratings: ProductChartData;
    category: ProductChartData;
    reviews: ProductChartData;
    count: number;
}
