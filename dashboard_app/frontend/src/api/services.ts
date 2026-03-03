import api from './client';

// ==================== AUTH ====================
export const authService = {
  login: (username: string, password: string, remember?: boolean) =>
    api.post('/auth/login', { username, password, remember }),
  
  signup: (data: {
    username: string;
    email: string;
    password: string;
    confirm_password: string;
    full_name?: string;
  }) => api.post('/auth/signup', data),
  
  logout: () => api.post('/auth/logout'),
  
  checkAuth: () => api.get('/auth/check'),
  
  getCurrentUser: () => api.get('/auth/me'),
};

// ==================== DASHBOARD ====================
export const dashboardService = {
  getStats: () => api.get('/stats'),
  
  getOverviewCharts: () => api.get('/charts/overview'),
  
  getCategories: () => api.get('/categories'),
  
  getPriceDistribution: (bins?: number) =>
    api.get('/price-distribution', { params: { bins } }),
  
  getRatingDistribution: () => api.get('/rating-distribution'),
  
  getLocationStats: () => api.get('/location-stats'),
};

// ==================== PRODUCTS ====================
export const productService = {
  getProducts: (filters?: {
    price_min?: number;
    price_max?: number;
    rating_min?: number;
    category?: string;
    search?: string;
  }) => api.get('/products', { params: filters }),
  
  getProductDetail: (productId: string) => api.get(`/products/${productId}`),
  
  getTopProducts: (sortBy?: string, limit?: number) =>
    api.get('/top-products', { params: { sort_by: sortBy, limit } }),
  
  getTopRatedProducts: (limit?: number, minRating?: number) =>
    api.get('/top-rated-products', { params: { limit, min_rating: minRating } }),
  
  getBestSellers: (limit?: number) =>
    api.get('/best-sellers', { params: { limit } }),
  
  getProductCharts: (filters?: {
    price_min?: number;
    price_max?: number;
    rating_min?: number;
    category?: string;
  }) => api.get('/charts/products', { params: filters }),
};

// ==================== SUPPLIERS ====================
export const supplierService = {
  getSuppliers: (filters?: {
    price_min?: number;
    price_max?: number;
    rating_min?: number;
    location?: string;
    category?: string;
    search?: string;
  }) => api.get('/suppliers', { params: filters }),
  
  getTopSuppliers: (sortBy?: string, limit?: number) =>
    api.get('/top-suppliers', { params: { sort_by: sortBy, limit } }),
  
  getSupplierCharts: (filters?: {
    price_min?: number;
    price_max?: number;
    rating_min?: number;
    location?: string;
  }) => api.get('/charts/suppliers', { params: filters }),
};

// ==================== COMPARISONS ====================
export const comparisonService = {
  compareProducts: (ids: string[]) =>
    api.get('/compare-products', { params: { 'ids[]': ids } }),
  
  compareSuppliers: (names: string[]) =>
    api.get('/compare-suppliers', { params: { 'names[]': names } }),
  
  productVsSuppliers: (productId: string) =>
    api.get(`/product-vs-suppliers/${productId}`),
};

// ==================== AI ANALYSIS ====================
export const aiService = {
  getAnalysis: () => api.get('/ai-analysis'),
  
  getAIProducts: (filters?: {
    potential?: string;
    price_range?: string;
    search?: string;
    limit?: number;
  }) => api.get('/ai-analysis/products', { params: filters }),
};

// ==================== WISHLIST ====================
export const wishlistService = {
  getWishlist: () => api.get('/wishlist'),
  
  addToWishlist: (product: {
    product_identifier: string;
    product_title?: string;
    product_price?: number;
    product_rating?: number;
    product_image?: string;
    notes?: string;
  }) => api.post('/wishlist', product),
  
  removeFromWishlist: (itemId: number) => api.delete(`/wishlist/${itemId}`),
};

// ==================== UNIVERSITY (ARTICLES) ====================
export const articleService = {
  getArticles: (params?: {
    page?: number;
    per_page?: number;
    category?: string;
    search?: string;
  }) => api.get('/articles', { params }),
  
  getArticle: (slug: string) => api.get(`/articles/${slug}`),
};

// ==================== FILTERS ====================
export const filterService = {
  getFilterOptions: () => api.get('/filter-options'),
};

// ==================== ADMIN ====================
export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  
  refreshData: () => api.post('/admin/refresh-data'),
  
  // Stats
  getStats: () => api.get('/admin/stats'),
  
  // Articles
  getArticles: (page?: number, perPage?: number) =>
    api.get('/admin/articles', { params: { page, per_page: perPage } }),
  
  createArticle: (data: {
    title: string;
    content: string;
    summary?: string;
    published?: boolean;
    image_url?: string;
    category?: string;
    tags?: string[];
    author?: string;
    read_time?: number;
  }) => api.post('/admin/articles', data),
  
  updateArticle: (id: number, data: Partial<{
    title: string;
    content: string;
    summary: string;
    published: boolean;
    image_url: string;
    category: string;
    tags: string[];
  }>) => api.put(`/admin/articles/${id}`, data),
  
  deleteArticle: (id: number) => api.delete(`/admin/articles/${id}`),
  
  // Users
  getUsers: () => api.get('/admin/users'),
  
  updateUser: (userId: number, data: { is_admin?: boolean; is_active?: boolean }) => 
    api.put(`/admin/users/${userId}`, data),
  
  deleteUser: (userId: number) => api.delete(`/admin/users/${userId}`),
  
  toggleAdmin: (userId: number) => api.post(`/admin/users/${userId}/toggle-admin`),
  
  toggleActive: (userId: number) => api.post(`/admin/users/${userId}/toggle-active`),
};

// ==================== HELPER EXPORTS ====================
// These are convenience functions that match what components are importing

// Auth
export const login = (username: string, password: string, remember?: boolean) =>
  authService.login(username, password, remember).then(r => r.data);

export const signup = (data: any) =>
  authService.signup(data).then(r => r.data);

export const logout = () => authService.logout();

export const checkAuth = () => authService.checkAuth().then(r => r.data);

export const getCurrentUser = () => authService.getCurrentUser().then(r => r.data);

// Dashboard
export const getStats = () => dashboardService.getStats().then(r => r.data);

export const getCategoryDistribution = () => 
  api.get('/charts/category-distribution').then(r => r.data);

export const getPriceDistribution = () =>
  dashboardService.getPriceDistribution().then(r => ({
    labels: r.data.bins || [],
    values: r.data.counts || []
  }));

export const getRatingDistribution = () =>
  dashboardService.getRatingDistribution().then(r => ({
    labels: r.data.labels || [],
    values: r.data.counts || []
  }));

// Products
export const getProducts = (filters?: any, page?: number, perPage?: number) =>
  api.get('/products', { params: { ...filters, page, per_page: perPage } }).then(r => r.data);

export const getProductById = (id: number) =>
  api.get(`/products/${id}`).then(r => r.data);

export const getFilterOptions = () =>
  filterService.getFilterOptions().then(r => r.data);

// Suppliers
export const getSuppliers = (filters?: any, page?: number, perPage?: number) =>
  api.get('/suppliers', { params: { ...filters, page, per_page: perPage } }).then(r => r.data);

// AI Analysis
export const getAIAnalysis = () =>
  aiService.getAnalysis().then(r => r.data);

// Wishlist
export const getWishlist = () =>
  wishlistService.getWishlist().then(r => r.data);

export const addToWishlist = (productId: number) =>
  api.post('/wishlist', { product_id: productId }).then(r => r.data);

export const removeFromWishlist = (productId: number) =>
  api.delete(`/wishlist/${productId}`).then(r => r.data);

// Articles
export const getArticles = (params?: any) =>
  articleService.getArticles(params).then(r => r.data);

export const getArticleById = (id: number) =>
  api.get(`/articles/${id}`).then(r => r.data);

// Admin
export const getAdminStats = () =>
  adminService.getStats().then(r => r.data);

export const getAdminUsers = () =>
  adminService.getUsers().then(r => r.data);

export const getAdminArticles = () =>
  adminService.getArticles().then(r => r.data);

export const updateUser = (userId: number, data: any) =>
  adminService.updateUser(userId, data).then(r => r.data);

export const deleteUser = (userId: number) =>
  adminService.deleteUser(userId).then(r => r.data);

export const createArticle = (data: any) =>
  adminService.createArticle(data).then(r => r.data);

export const updateArticle = (id: number, data: any) =>
  adminService.updateArticle(id, data).then(r => r.data);

export const deleteArticle = (id: number) =>
  adminService.deleteArticle(id).then(r => r.data);