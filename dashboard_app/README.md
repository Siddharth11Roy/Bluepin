# Analytics Dashboard Application

A modern, interactive analytics dashboard built with Flask, featuring Power BI-like functionality for product and supplier data visualization and analysis.

## 🌟 Features

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
- **Product Cards**: Image-rich product display with key metrics
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

### Admin Dashboard
- **System Monitoring**: Cache status and data freshness
- **Data Refresh**: Manual data reload capability
- **Quick Actions**: Fast navigation to all dashboard sections
- **Key Metrics Overview**: System-wide statistics

## 🛠️ Technology Stack

- **Backend**: Flask 3.0
- **Data Processing**: Pandas, NumPy
- **Frontend**: 
  - Bootstrap 5 (responsive UI)
  - Chart.js 4 (interactive charts)
  - jQuery (AJAX calls)
- **Styling**: Custom CSS with animations
- **Icons**: Bootstrap Icons

## 📊 Architecture

```
dashboard_app/
├── app.py                 # Flask entry point
├── run.py                 # Application runner
├── config.py              # Configuration settings
├── requirements.txt       # Python dependencies
├── data/
│   ├── Product_Sheet.csv   # Product data
│   ├── supplier_results.csv # Supplier data
│   └── processed/          # Cache directory
├── app/
│   ├── __init__.py         # App factory
│   ├── routes/
│   │   ├── dashboard.py     # Main routes
│   │   ├── api.py           # REST API
│   │   └── admin.py         # Admin routes
│   ├── services/
│   │   ├── data_loader.py   # CSV loading
│   │   ├── aggregations.py  # KPI calculations
│   │   ├── filters.py       # Filter logic
│   │   └── comparisons.py   # Comparison engine
│   ├── static/
│   │   ├── css/
│   │   │   └── dashboard.css # Custom styles
│   │   └── js/
│   │       ├── dashboard.js  # Main JS
│   │       ├── charts.js     # Chart.js helpers
│   │       ├── filters.js    # Filter handling
│   │       └── ajax.js       # AJAX utilities
│   ├── templates/
│   │   ├── base.html        # Base template
│   │   ├── dashboard/       # Dashboard views
│   │   ├── components/      # Reusable components
│   │   └── admin/           # Admin views
│   └── utils/
│       ├── constants.py   # Constants
│       └── helpers.py     # Helper functions
└── README.md
```

## 🚀 Quick Start

### Installation

1. **Clone the repository**:
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

### Running the Application

**Method 1 - Using run.py**:
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

### Statistics & Overview
- `GET /api/stats` - Overview statistics
- `GET /api/categories` - Category breakdown
- `GET /api/price-distribution` - Price distribution data
- `GET /api/rating-distribution` - Rating distribution data
- `GET /api/location-stats` - Supplier location statistics

### Products
- `GET /api/products` - Filtered products list
- `GET /api/top-products?sort_by={metric}&limit={n}` - Top products
- `GET /api/charts/products` - Product chart data
- `GET /api/product-vs-suppliers/{product_id}` - Product-supplier comparison

### Suppliers
- `GET /api/suppliers` - Filtered suppliers list
- `GET /api/top-suppliers?sort_by={metric}&limit={n}` - Top suppliers
- `GET /api/charts/suppliers` - Supplier chart data

### Comparisons
- `GET /api/compare-products?ids[]={id1}&ids[]={id2}` - Compare products
- `GET /api/compare-suppliers?names[]={name1}&names[]={name2}` - Compare suppliers

### Admin
- `POST /admin/refresh-data` - Refresh cached data

## 🎨 Features & Interactions

### Interactive Filtering
- Real-time filter application
- All charts update based on active filters
- URL-based filter state (shareable links)
- Reset functionality

### Animations
- Fade-in animations for cards
- Slide-up animations for sections
- Counter animations for statistics
- Hover effects on all interactive elements
- Smooth transitions throughout

### Responsive Design
- Mobile-friendly layout
- Adaptive charts
- Touch-friendly controls
- Optimized for all screen sizes

## 📊 Data Format

### Products CSV
```csv
Image,Title,Price,Ratings,Review,Monthly Sales,Product Identifier
```

### Suppliers CSV
```csv
Supplier Round,Product Searched,Supplier Name,Listing Title,Location,Price,Rating,Reviews,Contact Phone,IndiaMART Link
```

## ⚙️ Configuration

Edit `config.py` to customize:
- Data file paths
- Cache timeout
- Pagination settings
- Dashboard refresh intervals

## 🔧 Development

### Adding New Features

1. **New Route**: Add to appropriate file in `app/routes/`
2. **New Service**: Create in `app/services/`
3. **New Template**: Add to `app/templates/`
4. **New API Endpoint**: Add to `app/routes/api.py`

### Testing

```bash
# Test data loading
python -c "from app.services.data_loader import DataLoader; print(DataLoader.load_products().shape)"

# Test aggregations
python -c "from app import create_app; app = create_app(); from app.services.aggregations import Aggregations; print(Aggregations.get_overview_stats())"
```

## 🛡️ Security Notes

- Change `SECRET_KEY` in production
- Implement authentication for admin panel
- Add rate limiting for API endpoints
- Validate all user inputs
- Use HTTPS in production

## 📝 Future Enhancements

- [ ] User authentication & authorization
- [ ] Export reports (PDF, Excel)
- [ ] Advanced analytics (trends, forecasting)
- [ ] Email notifications for threshold alerts
- [ ] Custom dashboard builder
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Real-time data updates via WebSocket
- [ ] Advanced search with Elasticsearch
- [ ] Data import wizard

## 👥 Scaling Considerations

### For 10K Products & 30K Suppliers

1. **Database Migration**:
   - Move from CSV to PostgreSQL/MySQL
   - Add proper indexing

2. **Caching Layer**:
   - Implement Redis for caching
   - Cache aggregated results

3. **Pagination**:
   - Implement server-side pagination
   - Load data in chunks

4. **Async Processing**:
   - Use Celery for background tasks
   - Async data refresh

5. **Performance**:
   - Add CDN for static assets
   - Optimize database queries
   - Implement lazy loading

## 📝 License

MIT License - Feel free to use for personal or commercial projects.

## 👤 Support

For issues or questions:
- Check the documentation
- Review the code comments
- Test with sample data first

---

**Built with ❤️ using Flask, Bootstrap, and Chart.js**