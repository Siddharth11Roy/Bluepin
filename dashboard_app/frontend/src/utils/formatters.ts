// Currency formatter
export function formatCurrency(value: number, locale: string = 'en-IN'): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

// Number formatter with commas
export function formatNumber(value: number, locale: string = 'en-IN'): string {
    return new Intl.NumberFormat(locale).format(value);
}

// Compact number formatter (e.g., 1.2M, 500K)
export function formatCompact(value: number): string {
    if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
}

// Percentage formatter
export function formatPercent(value: number, decimals: number = 1): string {
    return `${value.toFixed(decimals)}%`;
}

// Rating formatter
export function formatRating(value: number): string {
    return value.toFixed(1);
}

// Truncate text with ellipsis
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength)}...`;
}

// Relative time formatter
export function formatRelativeTime(date: Date | string): string {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return past.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: past.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
}
