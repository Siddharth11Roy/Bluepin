# CSS Customization Guide

## Quick Color Theme Changes

### Change Primary Color
```css
:root {
    --primary: #your-color;
    --primary-dark: #darker-shade;
    --primary-light: #lighter-shade;
}
```

### Change Success (Supplier) Color
```css
:root {
    --success: #your-green;
}

.supplier-avatar,
.btn-supplier-action,
.supplier-price .price-value {
    /* Will automatically use new success color */
}
```

### Add Custom Gradient
```css
.custom-gradient {
    background: linear-gradient(135deg, #start-color, #end-color);
}

/* For text gradient */
.text-gradient {
    background: linear-gradient(135deg, #start-color, #end-color);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
```

## Animation Customizations

### Change Animation Speed
```css
:root {
    --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Make all animations faster */
:root {
    --transition-fast: 100ms;
    --transition-base: 200ms;
    --transition-slow: 300ms;
}
```

### Disable Hover Lift Effect
```css
.product-card-modern:hover,
.supplier-card-modern:hover,
.insight-card:hover {
    transform: none; /* Remove lift */
}
```

### Add Custom Hover Effect
```css
.product-card-modern:hover {
    transform: translateY(-8px) rotate(2deg); /* Slight tilt */
    /* or */
    transform: scale(1.05); /* Zoom effect */
}
```

## Card Customizations

### Change Card Border Radius
```css
.product-card-modern,
.supplier-card-modern,
.insight-card,
.filter-card {
    border-radius: 16px; /* Default is 20px */
}
```

### Add Card Borders
```css
.product-card-modern,
.supplier-card-modern {
    border: 2px solid var(--border-color);
}

[data-theme="dark"] .product-card-modern,
[data-theme="dark"] .supplier-card-modern {
    border-color: var(--gray-700);
}
```

### Change Shadow Intensity
```css
:root {
    --shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Lighter */
    --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.15);
    --shadow-xl: 0 16px 32px rgba(0, 0, 0, 0.2);
}

/* Or remove shadows completely */
.product-card-modern,
.supplier-card-modern {
    box-shadow: none;
}
```

## Layout Modifications

### Change Product Grid Columns
```css
/* Default: 4 columns on XL, 3 on LG */
.products-showcase .row > .col-xl-3 {
    flex: 0 0 20%; /* 5 columns */
    max-width: 20%;
}

/* Or use CSS Grid */
.products-showcase .row {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
}
```

### Change Supplier Card Width
```css
.supplier-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); /* Narrower */
    /* or */
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); /* Wider */
}
```

### Adjust Spacing
```css
/* Tighter spacing */
.dashboard-container {
    padding: 1rem 0;
}

.analytics-grid,
.products-showcase {
    margin-bottom: 2rem;
}

/* Looser spacing */
.dashboard-container {
    padding: 3rem 0;
}

.analytics-grid,
.products-showcase {
    margin-bottom: 5rem;
}
```

## Typography Changes

### Change Font Family
```css
body {
    font-family: 'Your Font', 'Fallback', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
    font-family: 'Your Heading Font', sans-serif;
}
```

### Adjust Font Sizes
```css
.hero-content h1 {
    font-size: 3rem; /* Smaller */
}

.product-title {
    font-size: 1.125rem; /* Larger */
}

.supplier-name {
    font-size: 1.25rem; /* Larger */
}
```

### Change Font Weights
```css
.product-title,
.supplier-name {
    font-weight: 700; /* Bolder */
}

.filter-label {
    font-weight: 600; /* Semi-bold */
}
```

## Badge Customizations

### Custom Badge Colors
```css
.badge-featured {
    background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
}

.badge-trending {
    background: linear-gradient(135deg, #ffd93d, #ffbc1f);
}

/* Add new badge type */
.badge-new {
    background: linear-gradient(135deg, #6c5ce7, #a29bfe);
    color: white;
    padding: 0.375rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
}
```

### Badge Positioning
```css
.product-badges {
    top: 0.5rem; /* Closer to top */
    left: 0.5rem; /* Closer to left */
    /* or move to right */
    left: auto;
    right: 1rem;
}
```

## Button Customizations

### Custom Button Style
```css
.btn-product-action {
    background: linear-gradient(135deg, #667eea, #764ba2); /* Purple gradient */
    border-radius: 25px; /* More rounded */
    padding: 0.75rem 1.5rem; /* Larger */
}

.btn-product-action:hover {
    transform: scale(1.05); /* Scale instead of slide */
}
```

### Add Icon Animations
```css
.btn-product-action i {
    transition: transform var(--transition-fast);
}

.btn-product-action:hover i {
    transform: translateX(5px); /* Icon slides */
}
```

## Image Effects

### Change Image Aspect Ratio
```css
.product-image-wrapper {
    aspect-ratio: 4/3; /* Wider */
    /* or */
    aspect-ratio: 3/4; /* Taller */
    /* or */
    aspect-ratio: 16/9; /* Widescreen */
}
```

### Adjust Image Zoom
```css
.product-card-modern:hover .product-image {
    transform: scale(1.15); /* More zoom */
    /* or */
    transform: scale(1.05); /* Less zoom */
}
```

### Add Image Filters
```css
.product-image {
    transition: all var(--transition-base);
}

.product-card-modern:hover .product-image {
    filter: brightness(1.1) contrast(1.05);
    /* or */
    filter: grayscale(0) saturate(1.2);
}
```

### Change Overlay Color
```css
.product-overlay {
    background: rgba(59, 130, 246, 0.7); /* Blue overlay */
    /* or */
    background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.8)); /* Gradient */
}
```

## Filter Customizations

### Sticky Filters
```css
.filter-section {
    position: sticky;
    top: 80px; /* Below navbar */
    z-index: 100;
    background: var(--bg-secondary);
    padding: 1rem 0;
}
```

### Horizontal Filters
```css
.filter-body .row {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: 1rem;
}

.filter-body .row > div {
    flex: 0 0 auto;
    min-width: 200px;
}
```

## Dark Mode Customizations

### Adjust Dark Mode Colors
```css
[data-theme="dark"] {
    --bg-primary: #0f172a; /* Darker */
    --bg-secondary: #1e293b;
    --bg-tertiary: #334155;
}
```

### Different Hover in Dark Mode
```css
[data-theme="dark"] .product-card-modern:hover {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8); /* Stronger shadow */
}

[data-theme="dark"] .product-overlay {
    background: rgba(0, 0, 0, 0.8); /* Darker overlay */
}
```

## Responsive Customizations

### Custom Mobile Layout
```css
@media (max-width: 576px) {
    .hero-content h1 {
        font-size: 2rem; /* Smaller on mobile */
    }
    
    .product-card-modern {
        border-radius: 12px; /* Less rounded on mobile */
    }
    
    .filter-body {
        padding: 1rem; /* Less padding */
    }
}
```

### Tablet Adjustments
```css
@media (min-width: 768px) and (max-width: 992px) {
    .products-showcase .row {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .supplier-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
```

## Performance Optimizations

### Reduce Animations on Low-End Devices
```css
@media (prefers-reduced-motion: reduce) {
    .product-card-modern:hover {
        transform: none;
    }
    
    .product-image {
        transition: none;
    }
}
```

### GPU Acceleration
```css
.product-card-modern,
.supplier-card-modern {
    will-change: transform;
    transform: translateZ(0); /* Force GPU */
}
```

## Special Effects

### Add Glow Effect
```css
.product-card-modern:hover {
    box-shadow: 0 0 30px rgba(59, 130, 246, 0.4);
}
```

### Add Border Animation
```css
.product-card-modern {
    position: relative;
    overflow: hidden;
}

.product-card-modern::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, var(--primary), var(--secondary));
    border-radius: 20px;
    opacity: 0;
    transition: opacity var(--transition-base);
    z-index: -1;
}

.product-card-modern:hover::before {
    opacity: 1;
}
```

### Add Shine Effect
```css
.product-image-wrapper::after {
    content: '';
    position: absolute;
    top: -100%;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        45deg,
        transparent 40%,
        rgba(255, 255, 255, 0.3) 50%,
        transparent 60%
    );
    transition: all 0.6s;
}

.product-card-modern:hover .product-image-wrapper::after {
    left: 100%;
    top: 100%;
}
```

## Print Styles

### Optimize for Printing
```css
@media print {
    .filter-section,
    .results-actions,
    .btn-wishlist,
    .product-overlay {
        display: none !important;
    }
    
    .product-card-modern {
        break-inside: avoid;
        box-shadow: none;
        border: 1px solid #ccc;
    }
}
```

## Accessibility Enhancements

### High Contrast Mode
```css
@media (prefers-contrast: high) {
    .product-card-modern,
    .supplier-card-modern {
        border: 2px solid currentColor;
    }
    
    .product-overlay {
        background: rgba(0, 0, 0, 0.9);
    }
}
```

### Focus Styles
```css
.product-card-modern:focus-within,
.btn-product-action:focus {
    outline: 3px solid var(--primary);
    outline-offset: 2px;
}
```

## Testing Your Changes

1. **Clear Browser Cache**: Ctrl+Shift+R / Cmd+Shift+R
2. **Check Responsive**: Use browser dev tools
3. **Test Dark Mode**: Toggle theme switcher
4. **Test Animations**: Reduce motion in OS settings
5. **Print Preview**: File > Print Preview

## Browser Support

Minimum requirements:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

For older browsers, add:
```css
/* Fallbacks for older browsers */
@supports not (aspect-ratio: 1) {
    .product-image-wrapper {
        padding-top: 100%; /* 1:1 ratio fallback */
    }
}

@supports not (gap: 1rem) {
    .row > * {
        margin-bottom: 1rem;
    }
}
```
