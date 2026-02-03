import apiClient from './client';
import type { Product, ProductsResponse, ProductFilters, ProductChartsData } from '../types';

export const productsApi = {
    // Get filtered products
    async getProducts(filters?: ProductFilters): Promise<ProductsResponse> {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    params.append(key, String(value));
                }
            });
        }
        const response = await apiClient.get<ProductsResponse>(`/products?${params}`);
        return response.data;
    },

    // Get top products
    async getTopProducts(limit: number = 5, sortBy: string = 'ratings'): Promise<Product[]> {
        const response = await apiClient.get<Product[]>('/top-products', {
            params: { limit, sort_by: sortBy },
        });
        return response.data;
    },

    // Get product detail
    async getProductDetail(productId: string): Promise<Product> {
        const response = await apiClient.get<Product>(`/product/${productId}`);
        return response.data;
    },

    // Get product charts data
    async getProductCharts(filters?: ProductFilters): Promise<ProductChartsData> {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    params.append(key, String(value));
                }
            });
        }
        const response = await apiClient.get<ProductChartsData>(`/charts/products?${params}`);
        return response.data;
    },

    // Compare products
    async compareProducts(productIds: string[]): Promise<Product[]> {
        const response = await apiClient.post<{ products: Product[] }>('/compare-products', {
            product_ids: productIds,
        });
        return response.data.products;
    },

    // Product vs suppliers comparison
    async productVsSuppliers(productId: string): Promise<{
        product: Product;
        suppliers: unknown[];
        comparison: unknown;
    }> {
        const response = await apiClient.get(`/product/${productId}/vs-suppliers`);
        return response.data;
    },
};
