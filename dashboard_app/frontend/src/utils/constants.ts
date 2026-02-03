// API base URL
export const API_BASE_URL = '/api';

// Navigation items
export const NAV_ITEMS = {
    main: [
        { label: 'Dashboard', path: '/', icon: 'LayoutDashboard' },
        { label: 'Products', path: '/products', icon: 'Package' },
        { label: 'Suppliers', path: '/suppliers', icon: 'Building2' },
        { label: 'Compare', path: '/comparisons', icon: 'BarChart3' },
    ],
    analytics: [
        { label: 'AI Analysis', path: '/ai-analysis', icon: 'Bot' },
        { label: 'Trends', path: '/trends', icon: 'TrendingUp' },
    ],
    settings: [
        { label: 'Admin Panel', path: '/admin', icon: 'Settings' },
        { label: 'Help Center', path: '/help', icon: 'HelpCircle' },
    ],
} as const;

// Chart colors
export const CHART_COLORS = {
    primary: '#3b82f6',
    primaryLight: '#60a5fa',
    primaryDark: '#2563eb',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    purple: '#8b5cf6',
    pink: '#ec4899',
    cyan: '#06b6d4',
    orange: '#f97316',
} as const;

// Chart gradient colors for different charts
export const CHART_GRADIENTS = [
    CHART_COLORS.primary,
    CHART_COLORS.success,
    CHART_COLORS.warning,
    CHART_COLORS.purple,
    CHART_COLORS.pink,
    CHART_COLORS.cyan,
    CHART_COLORS.orange,
] as const;

// Pagination defaults
export const PAGINATION = {
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
} as const;

// Default avatar URL generator
export function getAvatarUrl(name: string): string {
    const encodedName = encodeURIComponent(name);
    return `https://ui-avatars.com/api/?name=${encodedName}&background=3b82f6&color=fff`;
}
