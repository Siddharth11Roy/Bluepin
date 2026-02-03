// Supplier types
export interface Supplier {
    'Supplier Round': string;
    'Supplier Name': string;
    'Product Searched': string;
    Location: string;
    Price: number;
    Rating: number;
    Reviews: number;
    'Contact Phone': string;
    'IndiaMART Link': string;
}

export interface SuppliersResponse {
    suppliers: Supplier[];
    count: number;
    total?: number;
}

export interface SupplierFilters {
    price_min?: number;
    price_max?: number;
    rating_min?: number;
    location?: string;
    product?: string;
    search?: string;
}

export interface ScatterData {
    prices: number[];
    ratings: number[];
    labels: string[];
}

export interface ChartData {
    labels: string[];
    values: number[];
}

export interface SupplierChartsData {
    location: ChartData;
    scatter: ScatterData;
    rounds: ChartData;
    count: number;
}
