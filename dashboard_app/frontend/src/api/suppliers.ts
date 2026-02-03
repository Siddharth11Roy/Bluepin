import apiClient from './client';
import type { Supplier, SuppliersResponse, SupplierFilters, SupplierChartsData } from '../types';

export const suppliersApi = {
    // Get filtered suppliers
    async getSuppliers(filters?: SupplierFilters): Promise<SuppliersResponse> {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    params.append(key, String(value));
                }
            });
        }
        const response = await apiClient.get<SuppliersResponse>(`/suppliers?${params}`);
        return response.data;
    },

    // Get top suppliers
    async getTopSuppliers(limit: number = 5, sortBy: string = 'rating'): Promise<Supplier[]> {
        const response = await apiClient.get<Supplier[]>('/top-suppliers', {
            params: { limit, sort_by: sortBy },
        });
        return response.data;
    },

    // Get supplier charts data
    async getSupplierCharts(filters?: SupplierFilters): Promise<SupplierChartsData> {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    params.append(key, String(value));
                }
            });
        }
        const response = await apiClient.get<SupplierChartsData>(`/charts/suppliers?${params}`);
        return response.data;
    },

    // Compare suppliers
    async compareSuppliers(supplierNames: string[]): Promise<Supplier[]> {
        const response = await apiClient.post<{ suppliers: Supplier[] }>('/compare-suppliers', {
            supplier_names: supplierNames,
        });
        return response.data.suppliers;
    },
};
