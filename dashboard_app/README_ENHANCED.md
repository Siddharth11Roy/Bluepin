# Analytics Dashboard Application - Enhanced Edition 🚀

A modern, feature-rich analytics dashboard built with Flask, featuring Power BI-like functionality with advanced UX enhancements including dark mode, global search, product comparison, and Amazon-style product detail pages.

## ✨ Enhanced Features (NEW!)

### 🌙 Dark Mode
- **Toggle Theme**: Switch between light and dark modes with smooth transitions
- **Persistent Storage**: Theme preference saved in browser localStorage
- **Dynamic Charts**: Chart.js colors automatically adapt to theme
- **Keyboard Accessible**: Fully functional with keyboard navigation

### 🔍 Global Search
- **Live Search**: Real-time search results as you type (300ms debounce)
- **Autocomplete Dropdown**: Shows top 5 products and suppliers
- **Keyboard Shortcuts**: 
  - `Ctrl+K` or `Cmd+K` to activate search
  - `Escape` to close results
- **Highlighted Matches**: Query text highlighted in yellow
- **Multi-category Results**: Searches both products and suppliers simultaneously

### ⚖️ Product Comparison System
- **Drag & Drop**: Add up to 4 products for comparison
- **Floating Comparison Bar**: Sticky bar at bottom shows selected count
- **Local Storage**: Comparison cart persists across sessions
- **Toast Notifications**: Visual feedback for add/remove actions
- **Side-by-Side View**: Detailed comparison table with winner badges
- **Quick Actions**: Clear all or view comparison from any page

### 🏷️ Amazon-Style Product Detail Pages
- **Image Zoom**: Hover over main image to see enlarged view
- **Rating Display**: Star ratings with review count
- **Tabbed Interface**:
  - **Suppliers Tab**: All suppliers with best price badge
  - **Analysis Tab**: Price comparison chart across suppliers
  - **Similar Products Tab**: Product recommendations
- **Quick Stats**: 4 stat boxes showing stock, rating, suppliers, price rank
- **Breadcrumb Navigation**: Easy navigation back to products
- **Price Comparison**: Visual chart showing price differences

### 🎨 Enhanced Floating Navbar
- **Glass Morphism Design**: Translucent background with blur effect
- **Integrated Search**: Search bar built into navbar
- **Comparison Badge**: Live count of items in comparison cart
- **Scroll Progress Bar**: Visual indicator at top showing page scroll
- **Auto-hide**: Navbar hides on scroll down, shows on scroll up
- **Back to Top Button**: Appears after 300px scroll
- **Theme Toggle**: Quick access to dark/light mode switch
- **Responsive**: Collapses gracefully on mobile devices

### 🎯 Additional Enhancements
- **Skeleton Loading**: Smooth loading states with animated skeletons
- **Ripple Effects**: Material Design-style button feedback
- **Smooth Scrolling**: Animated scroll behavior
- **Focus Visible**: Clear keyboard focus indicators for accessibility
- **Print Styles**: Optimized layouts for printing
- **Custom Scrollbar**: Styled scrollbars matching theme
- **Hover Effects**: Subtle animations on all interactive elements

## 🌟 Core Features

### Main Dashboard (Overview)
- **Real-time KPI Cards**: Total products, suppliers, average prices, ratings
- **Interactive Charts**: 
  - Price distribution histogram
  - Rating distribution pie chart
  - Supplier location breakdown
  - Category analysis
- **Top Products Showcase**: Grid view with product images, ratings, and prices
- **Top Suppliers Table**: Detailed supplier rankings with contact information
- **Animated Statistics**: Counter animations and smooth transitions

### Products Dashboard
- **Advanced Filtering**:
  - Price range (min/max)
  - Minimum rating filter
  - Category selection
  - Text search
- **Dynamic Charts** (auto-update with filters):
  - Category distribution
  - Review distribution
  - Price vs Rating scatter plot
- **Product Cards**: 
  - Image-rich product display with key metrics
  - "View Details" button for Amazon-style page
  - "Add to Compare" button for comparison system
- **Supplier Comparison**: Click any product to view and compare its suppliers

### Suppliers Dashboard
- **Multi-criteria Filtering**:
  - Price range
  - Rating filter
  - Location filter
  - Product filter
  - Search functionality
- **Visual Analytics**:
  - Suppliers by location bar chart
  - Supplier round distribution
  - Price vs Rating scatter analysis
- **Detailed Table View**: Complete supplier information with IndiaMART links

### Comparison Tools
- **Product Comparison**: Compare up to 4 products side-by-side
- **Supplier Comparison**: Analyze multiple suppliers simultaneously
- **Visual Comparisons**: Bar charts showing comparative metrics
- **Winner Badges**: Automatic highlighting of best values
- **Persistent Cart**: Comparison selections saved in browser

### Admin Dashboard
- **System Monitoring**: Cache status and data freshness
- **Data Refresh**: Manual data reload capability
- **Quick Actions**: Fast navigation to all dashboard sections
- **Key Metrics Overview**: System-wide statistics

## 🛠️ Technology Stack

### Backend
- **Flask 3.0**: Modern Python web framework
- **Pandas 2.1.4**: Data manipulation and analysis
- **NumPy 1.26.2**: Numerical computing

### Frontend
- **Bootstrap 5.3.0**: Responsive UI framework with utility classes
- **Chart.js 4.4.0**: Interactive, animated charts
- **jQuery 3.7.1**: DOM manipulation and AJAX
- **Font Awesome 6.5.1**: Icon library
- **Custom CSS**: Advanced animations, dark mode, glass morphism

### Architecture Patterns
- **Service Layer Pattern**: Clean separation of concerns
- **RESTful API**: JSON endpoints for AJAX operations
- **Template Inheritance**: DRY principle with Jinja2
- **Module Organization**: Blueprint-based route organization

## 📊 Architecture

```
dashboard_app/
├── app/
│   ├── __init__.py              # App factory pattern
│   ├── routes/
│   │   ├── dashboard.py         # Main dashboard routes + product detail
│   │   ├── api.py               # REST API endpoints + search
│   │   └── admin.py             # Admin panel routes
│   ├── services/
│   │   ├── data_loader.py       # CSV loading with caching
│   │   ├── aggregations.py      # KPI calculations
│   │   ├── filters.py           # Multi-criteria filtering
│   │   └── comparisons.py       # Product/supplier comparisons
│   ├── static/
│   │   ├── css/
│   │   │   └── dashboard.css    # 1200+ lines with dark mode
│   │   ├── js/
│   │   │   ├── dashboard.js     # Core dashboard logic
│   │   │   ├── charts.js        # Chart.js wrappers
│   │   │   ├── filters.js       # Filter handling
│   │   │   ├── ajax.js          # AJAX utilities
│   │   │   ├── theme.js         # Dark mode + scroll features (NEW!)
│   │   │   ├── search.js        # Global search system (NEW!)
│   │   │   └── comparison.js    # Comparison cart manager (NEW!)
│   │   └── images/              # Product images
│   ├── templates/
│   │   ├── base.html            # Enhanced navbar with search + theme
│   │   ├── dashboard/
│   │   │   ├── overview.html    # Main dashboard
│   │   │   ├── products.html    # Product grid with comparison
│   │   │   ├── suppliers.html   # Supplier table
│   │   │   ├── comparisons.html # Comparison interface
│   │   │   └── product_detail.html # Amazon-style page (NEW!)
│   │   └── admin/
│   │       └── admin_dashboard.html
│   ├── utils/
│   │   ├── constants.py         # Configuration constants
│   │   └── helpers.py           # Utility functions
│   └── data/                    # CSV files location
├── config.py                    # App configuration
├── run.py                       # Application entry point
├── requirements.txt             # Python dependencies
└── README.md                    # Documentation
```

## 🚀 Quick Start

### Installation

1. **Navigate to project directory**:
```bash
cd dashboard_app
```

2. **Create virtual environment**:
```bash
python -m venv venv
```

3. **Activate virtual environment**:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

4. **Install dependencies**:
```bash
pip install -r requirements.txt
```

5. **Add your CSV data files** to `app/data/`:
   - `Product_Sheet.csv`
   - `supplier_results.csv`

### Running the Application

**Method 1 - Using run.py** (Recommended):
```bash
python run.py
```

**Method 2 - Using Flask CLI**:
```bash
set FLASK_APP=app.py
set FLASK_ENV=development
flask run
```

**Access the dashboard**:
- Main Dashboard: http://localhost:5000
- Products: http://localhost:5000/products
- Suppliers: http://localhost:5000/suppliers
- Comparisons: http://localhost:5000/comparisons
- Admin Panel: http://localhost:5000/admin

## 📝 API Endpoints

### Enhanced Endpoints (NEW!)
- `GET /api/search?query={text}` - Global search across products & suppliers
- `GET /api/product-detail/<product_id>` - Full product details with suppliers

### Statistics & Overview
- `GET /api/stats` - Overview statistics
- `GET /api/categories` - Category breakdown
- `GET /api/price-distribution` - Price distribution data
- `GET /api/rating-distribution` - Rating distribution data
- `GET /api/location-stats` - Supplier location statistics

### Products
- `GET /api/products?category=&min_price=&max_price=&min_rating=` - Filtered products
- `GET /api/top-products?sort_by={metric}&limit={n}` - Top products
- `GET /api/charts/products` - Product chart data
- `GET /api/product-vs-suppliers/{product_id}` - Product-supplier comparison

### Suppliers
- `GET /api/suppliers?country=&min_quality=&min_capacity=` - Filtered suppliers
- `GET /api/top-suppliers?sort_by={metric}&limit={n}` - Top suppliers
- `GET /api/charts/suppliers` - Supplier chart data

### Comparisons
- `POST /api/compare-products` - Compare products (body: `{product_ids: []}`)
- `POST /api/compare-suppliers` - Compare suppliers (body: `{supplier_ids: []}`)

### Admin
- `POST /admin/refresh-data` - Refresh cached data

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` (Windows) / `Cmd+K` (Mac) | Activate global search |
| `Escape` | Close search results |
| `Tab` | Navigate through search results |
| Click moon/sun icon | Toggle dark mode |

## 🎨 Using Enhanced Features

### Dark Mode
1. Click the moon (🌙) / sun (☀️) icon in the navbar
2. Theme automatically switches
3. Preference saved in browser localStorage
4. Charts adapt colors automatically

### Global Search
1. Click search bar or press `Ctrl+K`
2. Type your query (minimum 2 characters)
3. See live results for products and suppliers
4. Click any result to navigate
5. Press `Escape` or click outside to close

### Product Comparison
1. Browse products on Products page
2. Click "Add to Compare" on product cards (max 4)
3. See comparison count in navbar and floating bar
4. Click "View Comparison" in floating bar for details
5. Click "Clear All" to reset comparison
6. Cart persists even after closing browser

### Product Detail Page
1. Click any product image or "View Details" button
2. Hover over main image to zoom in
3. Navigate tabs:
   - **Suppliers**: See all suppliers, best price highlighted
   - **Analysis**: Price comparison chart
   - **Similar Products**: Related items
4. Use breadcrumb to go back

### Filtering & Charts
1. Use filter controls on Products/Suppliers pages
2. Charts update automatically
3. All filters work together
4. Click "Reset Filters" to clear

## 📊 Data Format

### Product_Sheet.csv
Required columns:
```csv
Product ID,Product Name,Category,Price,Rating,Stock,Image
```
Or variations like: `product_id`, `name`, etc.

### supplier_results.csv
Required columns:
```csv
Supplier ID,Supplier Name,Product,Country,Quality Score,Price,Capacity
```
Or variations like: `supplier_id`, `price_per_unit`, `production_capacity`, etc.

## ⚙️ Configuration

Edit `config.py` to customize:

```python
class Config:
    SECRET_KEY = 'your-secret-key-here'
    DATA_FOLDER = 'app/data'
    PRODUCTS_FILE = 'Product_Sheet.csv'
    SUPPLIERS_FILE = 'supplier_results.csv'
    MAX_COMPARISON_ITEMS = 4
    SEARCH_DEBOUNCE_MS = 300
```

### CSS Customization

Edit theme colors in `app/static/css/dashboard.css`:

```css
:root {
    --primary-color: #0d6efd;
    --success-color: #198754;
    --warning-color: #ffc107;
    /* ...more variables */
}

[data-theme="dark"] {
    --bg-primary: #1a1d23;
    --text-primary: #e0e0e0;
    /* ...dark mode overrides */
}
```

### Chart Customization

Edit `app/static/js/charts.js`:

```javascript
const ChartColors = {
    primary: 'rgba(13, 110, 253, 0.8)',
    success: 'rgba(25, 135, 84, 0.8)',
    // ...customize colors
};
```

## 🎯 Performance Optimizations

- **CSV Caching**: Data cached in memory after first load
- **Debounced Search**: 300ms delay prevents excessive API calls
- **Local Storage**: Theme and cart stored client-side
- **Lazy Loading**: Images load on demand
- **Minified Libraries**: CDN-hosted production builds
- **CSS Transitions**: Hardware-accelerated animations
- **AJAX Filtering**: No full page reloads

## 🔧 Development

### Adding New Features

1. **New Route**: Add to `app/routes/dashboard.py` or `api.py`
2. **New Service**: Create in `app/services/`
3. **New Template**: Add to `app/templates/dashboard/`
4. **New JavaScript Module**: Add to `app/static/js/`
5. **New Styles**: Add to `app/static/css/dashboard.css`

### Testing

```bash
# Test data loading
python -c "from app.services.data_loader import DataLoader; print(DataLoader.load_products().shape)"

# Test search
python -c "from app import create_app; app = create_app(); with app.test_client() as c: print(c.get('/api/search?query=test').json)"

# Test dark mode (check localStorage in browser)
# Open DevTools > Application > Local Storage > localhost:5000
```

## 🌐 Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 90+ |
| Edge | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Opera | 76+ |

**Features requiring modern browsers:**
- CSS Custom Properties (dark mode)
- Local Storage API
- Backdrop Filter (glass morphism)
- Flexbox & Grid

## 🛡️ Security Best Practices

- ✅ Change `SECRET_KEY` in production
- ✅ Implement authentication for admin panel
- ✅ Add rate limiting for API endpoints
- ✅ Validate all user inputs
- ✅ Use HTTPS in production
- ✅ Add CSRF protection
- ✅ Sanitize CSV data on upload

## 📝 Troubleshooting

### CSV Files Not Loading
- Ensure files are in `app/data/` directory
- Check file names match `config.py` settings
- Verify CSV format and column names
- Check console for error messages

### Charts Not Displaying
- Check browser console for JavaScript errors
- Ensure Chart.js CDN is accessible
- Verify data format in API responses
- Clear browser cache

### Dark Mode Not Persisting
- Check browser localStorage is enabled
- Clear browser cache and retry
- Ensure JavaScript is not blocked
- Check console for errors

### Search Not Working
- Verify `/api/search` endpoint is accessible
- Check network tab for AJAX errors
- Ensure minimum 2 characters are typed
- Check if search.js is loaded

### Comparison Cart Issues
- Clear localStorage: `localStorage.clear()`
- Check if comparison.js is loaded
- Verify max 4 items limit
- Check console for errors

## 🚀 Future Enhancements

- [ ] User authentication & authorization
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Export reports (PDF, Excel, CSV)
- [ ] Email notifications & alerts
- [ ] Real-time updates via WebSockets
- [ ] Advanced analytics (trends, forecasting, ML)
- [ ] Multi-language support (i18n)
- [ ] Mobile app (React Native)
- [ ] Wishlist functionality
- [ ] Shopping cart integration
- [ ] Advanced search filters (price history, availability)
- [ ] Supplier ratings & reviews
- [ ] Product recommendations AI

## 📈 Scaling for Production

### For 10K+ Products & 30K+ Suppliers

1. **Database Migration**:
   - Move from CSV to PostgreSQL/MySQL
   - Add proper indexing on search columns
   - Implement full-text search

2. **Caching Layer**:
   - Implement Redis for caching
   - Cache aggregated results for 15 min
   - Use Redis for session storage

3. **Pagination**:
   - Server-side pagination (50 items/page)
   - Infinite scroll or "Load More" buttons
   - Virtual scrolling for large tables

4. **Search Optimization**:
   - Elasticsearch integration
   - Fuzzy matching
   - Search result ranking

5. **Background Jobs**:
   - Celery for async tasks
   - Scheduled data refresh
   - Email queue processing

6. **Performance**:
   - CDN for static assets
   - Gzip compression
   - Optimize database queries
   - Lazy load images
   - Bundle & minify JS/CSS

## 📄 License

MIT License - Free to use for personal or commercial projects.

## 👥 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 🙏 Acknowledgments

- **Bootstrap Team**: Excellent UI framework
- **Chart.js Team**: Powerful visualization library
- **Flask Community**: Amazing Python web framework
- **Font Awesome**: Comprehensive icon library
- **jQuery Foundation**: DOM manipulation utilities
- All open-source contributors

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review code comments
- Test with sample data first

---

**Built with ❤️ using Flask, Bootstrap, Chart.js, and modern web technologies**

*v2.0 - Enhanced Edition with Dark Mode, Global Search, Product Comparison, and Amazon-Style Product Pages*
