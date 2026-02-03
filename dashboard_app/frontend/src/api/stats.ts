import apiClient from './client';
import type { OverviewStats, CategoryData, ChartData, FilterOptions, LocationStats } from '../types';

export const statsApi = {
    // Get overview statistics
    async getStats(): Promise<OverviewStats> {
        const response = await apiClient.get<OverviewStats>('/stats');
        return response.data;
    },

    // Get category breakdown
    async getCategories(): Promise<CategoryData[]> {
        const response = await apiClient.get<CategoryData[]>('/categories');
        return response.data;
    },

    // Get price distribution
    async getPriceDistribution(): Promise<ChartData> {
        const response = await apiClient.get<ChartData>('/price-distribution');
        return response.data;
    },

    // Get rating distribution
    async getRatingDistribution(): Promise<ChartData> {
        const response = await apiClient.get<ChartData>('/rating-distribution');
        return response.data;
    },

    // Get supplier location stats
    async getLocationStats(): Promise<LocationStats[]> {
        const response = await apiClient.get<LocationStats[]>('/location-stats');
        return response.data;
    },

    // Get filter options
    async getFilterOptions(): Promise<FilterOptions> {
        const response = await apiClient.get<FilterOptions>('/filter-options');
        return response.data;
    },
};
