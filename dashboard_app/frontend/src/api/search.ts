import apiClient from './client';

export interface SearchResult {
    type: 'product' | 'supplier';
    id: string;
    title: string;
    price: number;
    rating: number;
    category?: string;
    location?: string;
}

export const searchApi = {
    // Global search
    async search(query: string): Promise<SearchResult[]> {
        const response = await apiClient.get<{ results: SearchResult[] }>('/search', {
            params: { q: query },
        });
        return response.data.results;
    },
};
