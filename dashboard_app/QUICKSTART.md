# Quick Start Guide - Enhanced Dashboard

## 🎯 5-Minute Setup

### 1. Install & Run (2 minutes)
```bash
cd dashboard_app
python -m venv venv
venv\Scripts\activate      # Windows
pip install -r requirements.txt
python run.py
```

Open: http://localhost:5000

### 2. Explore Features (3 minutes)

#### Try Dark Mode
- Click the 🌙 moon icon (top-right navbar)
- Watch everything smoothly transition
- Theme persists even after closing browser

#### Test Global Search
- Press `Ctrl+K` or click search bar
- Type any product/supplier name
- See instant results with images
- Click result to navigate
- Press `Escape` to close

#### Compare Products
- Go to Products page
- Click "Add to Compare" on 2-3 products
- See floating bar at bottom
- Click "View Comparison"
- See side-by-side details with charts

#### View Product Details
- Click any product image or "View Details"
- Hover over main image to zoom
- Switch between tabs:
  - Suppliers (with best price)
  - Analysis (price chart)
  - Similar Products

#### Try Filtering
- Select category dropdown
- Set price range
- Set minimum rating
- Watch charts update automatically

## 🔥 Pro Tips

### Keyboard Shortcuts
- `Ctrl+K`: Open search (works from any page)
- `Escape`: Close search or modals
- `Tab`: Navigate search results

### Hidden Features
- **Scroll Progress**: Watch the colored bar at top of page
- **Back to Top**: Scroll down 300px to see button appear
- **Navbar Auto-hide**: Scroll down = hides, scroll up = shows
- **Image Zoom**: Hover over any product detail image
- **Animation**: Cards fade in as you scroll

### Best Practices
1. **Add Products to Compare**: Max 4 items for best layout
2. **Use Search**: Faster than browsing when you know what you want
3. **Dark Mode**: Easier on eyes during long sessions
4. **Filters**: Combine multiple filters for precise results

## 📊 Sample Workflows

### Workflow 1: Find Cheapest Supplier
1. Search for product name (`Ctrl+K`)
2. Click product to open detail page
3. Go to "Suppliers" tab
4. Look for green "Best Price" badge
5. Click supplier contact

### Workflow 2: Compare Similar Products
1. Go to Products page
2. Filter by category
3. Add 3-4 products to comparison
4. Click "View Comparison"
5. Check price, rating, stock columns
6. Note green "Winner" badges

### Workflow 3: Analyze Market
1. Go to Dashboard (Overview)
2. Check KPI cards for totals
3. View price distribution chart
4. Check rating breakdown
5. See top products and suppliers
6. Use filters to drill down

## 🎨 Customization Quick Guide

### Change Theme Colors
Edit `app/static/css/dashboard.css`:
```css
:root {
    --primary-color: #0d6efd;  /* Change to your brand color */
}
```

### Adjust Search Delay
Edit `app/static/js/search.js`:
```javascript
this.debounceDelay = 300;  // Change to 500ms for slower typing
```

### Change Max Comparison Items
Edit `config.py`:
```python
MAX_COMPARISON_ITEMS = 4  # Change to 6 for more items
```

## ❓ Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Dark mode won't toggle | Clear browser cache, refresh page |
| Search shows no results | Check if CSV files are loaded, min 2 chars needed |
| Charts not showing | Verify Chart.js CDN is accessible, check console |
| Comparison cart empty after refresh | Feature uses localStorage - check if enabled |
| Product images not loading | Verify image URLs in CSV, check `static/images/` folder |

## 📱 Mobile Usage

All features work on mobile:
- ✅ Tap moon icon for dark mode
- ✅ Tap search bar (no Ctrl+K needed)
- ✅ Tap "Add to Compare" buttons
- ✅ Swipe through product images
- ✅ All filters accessible
- ✅ Charts responsive and touch-friendly

## 🔗 Page Guide

| Page | URL | Purpose |
|------|-----|---------|
| Dashboard | `/` | Overview with KPIs and charts |
| Products | `/products` | Browse and filter products, add to comparison |
| Suppliers | `/suppliers` | View and analyze supplier data |
| Comparisons | `/comparisons` | Side-by-side product comparison |
| Product Detail | `/product/<id>` | Amazon-style detailed product page |
| Admin | `/admin` | System monitoring and data refresh |

## 💡 Common Questions

**Q: How do I clear comparison cart?**
A: Click "Clear All" in floating bar, or open DevTools > Application > Local Storage > Clear

**Q: Can I share a filtered view?**
A: Yes, filter parameters are in URL - just copy and share the link

**Q: How to refresh data without restarting?**
A: Go to Admin page, click "Refresh Data"

**Q: Does dark mode affect performance?**
A: No, it's pure CSS with minimal JavaScript

**Q: Can I compare products and suppliers together?**
A: No, products and suppliers have separate comparison systems

---

**Need help?** Check the full README_ENHANCED.md for detailed documentation!
