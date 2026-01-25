# SQLite Database Usage Guide - Bluepin Dashboard

## Overview

The Bluepin Dashboard now uses SQLite database for user management, authentication, and wishlist functionality. This guide explains how to interact with and manage the database.

## Database Location

The SQLite database file is created automatically at:
```
dashboard_app/dashboard.db
```

## Database Schema

### Tables

#### 1. **users**
Stores user account information.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| username | STRING(80) | Unique username |
| email | STRING(120) | Unique email address |
| password_hash | STRING(255) | Hashed password |
| full_name | STRING(120) | User's full name |
| created_at | DATETIME | Account creation timestamp |
| last_login | DATETIME | Last login timestamp |
| is_active | BOOLEAN | Account active status |
| is_admin | BOOLEAN | Admin privileges flag |

#### 2. **wishlist**
Stores user wishlists (favorite products).

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| user_id | INTEGER | Foreign key to users.id |
| product_identifier | STRING(200) | Product ID |
| product_title | STRING(500) | Product name |
| product_price | FLOAT | Product price |
| product_rating | FLOAT | Product rating |
| product_image | TEXT | Product image URL |
| added_at | DATETIME | Timestamp when added |
| notes | TEXT | Optional user notes |

**Constraints:**
- Unique constraint on (user_id, product_identifier) - prevents duplicate products in wishlist

#### 3. **user_preferences**
Stores user settings and preferences.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| user_id | INTEGER | Foreign key to users.id (unique) |
| theme | STRING(20) | UI theme (light/dark) |
| notifications_enabled | BOOLEAN | Notifications on/off |
| email_notifications | BOOLEAN | Email notifications on/off |
| updated_at | DATETIME | Last update timestamp |

## Accessing the Database

### Using Python

```python
from models import db, User, Wishlist, UserPreference
from app import create_app

# Create app context
app = create_app()
with app.app_context():
    # Query users
    users = User.query.all()
    
    # Get specific user
    user = User.query.filter_by(username='john_doe').first()
    
    # Get user's wishlist
    wishlist_items = Wishlist.query.filter_by(user_id=user.id).all()
```

### Using SQLite Command Line

```bash
# Open database
sqlite3 dashboard.db

# List all tables
.tables

# View table schema
.schema users

# Query data
SELECT * FROM users;
SELECT * FROM wishlist WHERE user_id = 1;

# Exit
.quit
```

### Using DB Browser for SQLite

1. Download [DB Browser for SQLite](https://sqlitebrowser.org/)
2. Open `dashboard.db` file
3. Use the GUI to browse, edit, and query data

## Common Operations

### Creating a User Programmatically

```python
from models import db, User
from app import create_app

app = create_app()
with app.app_context():
    # Create new user
    user = User(
        username='newuser',
        email='user@example.com',
        full_name='New User'
    )
    user.set_password('securepassword')
    
    db.session.add(user)
    db.session.commit()
```

### Querying Wishlist

```python
from models import Wishlist
from app import create_app

app = create_app()
with app.app_context():
    # Get all wishlist items for user ID 1
    items = Wishlist.query.filter_by(user_id=1).all()
    
    for item in items:
        print(f"{item.product_title}: ₹{item.product_price}")
```

### Deleting User Data

```python
from models import db, User
from app import create_app

app = create_app()
with app.app_context():
    user = User.query.filter_by(username='olduser').first()
    if user:
        # This will also delete associated wishlist items (cascade)
        db.session.delete(user)
        db.session.commit()
```

## API Endpoints

### Wishlist Management

#### Get User Wishlist
```
GET /api/wishlist
Authorization: Required (logged in user)
Response: JSON array of wishlist items
```

#### Add to Wishlist
```
POST /api/wishlist/add
Authorization: Required
Body: {
    "product_identifier": "PROD-123",
    "product_title": "Product Name",
    "product_price": 1299.99,
    "product_rating": 4.5,
    "product_image": "http://..."
}
Response: 201 Created or 409 Conflict (already in wishlist)
```

#### Remove from Wishlist
```
DELETE /api/wishlist/remove/<item_id>
Authorization: Required
Response: 200 OK
```

#### Clear Wishlist
```
DELETE /api/wishlist/clear
Authorization: Required
Response: 200 OK
```

## Database Migrations

If you need to modify the database schema:

1. **Add new column:**
```python
# In models.py, add the new field
# Then in your terminal:
from models import db
from app import create_app

app = create_app()
with app.app_context():
    # Drop and recreate (WARNING: loses data)
    db.drop_all()
    db.create_all()
```

2. **For production, use Flask-Migrate:**
```bash
pip install Flask-Migrate
flask db init
flask db migrate -m "Add new column"
flask db upgrade
```

## Backup and Restore

### Backup
```bash
# Simple copy
cp dashboard.db dashboard_backup_$(date +%Y%m%d).db

# Or use SQLite dump
sqlite3 dashboard.db .dump > backup.sql
```

### Restore
```bash
# From backup file
cp dashboard_backup_20260125.db dashboard.db

# From SQL dump
sqlite3 dashboard.db < backup.sql
```

## Security Considerations

1. **Password Hashing:** Passwords are hashed using Werkzeug's `generate_password_hash` with PBKDF2
2. **SQL Injection:** SQLAlchemy ORM prevents SQL injection by using parameterized queries
3. **Session Security:** Flask-Login manages session security
4. **Database File:** Ensure `dashboard.db` has appropriate file permissions (not world-readable)

## Troubleshooting

### Database locked error
```python
# Ensure you're not accessing from multiple processes
# Use WAL mode for better concurrency:
import sqlite3
conn = sqlite3.connect('dashboard.db')
conn.execute('PRAGMA journal_mode=WAL')
conn.close()
```

### Reset database
```bash
# Delete database file
rm dashboard.db

# Restart application - it will recreate automatically
python app.py
```

### Inspect database size
```bash
ls -lh dashboard.db
sqlite3 dashboard.db "SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size();"
```

## Performance Tips

1. **Indexing:** The database already has indexes on frequently queried columns (username, email, user_id)
2. **Vacuum:** Periodically compact the database:
   ```bash
   sqlite3 dashboard.db "VACUUM;"
   ```
3. **Analyze:** Update statistics for query optimizer:
   ```bash
   sqlite3 dashboard.db "ANALYZE;"
   ```

## Environment Variables

Configure database location using environment variable:

```bash
export DATABASE_URL="sqlite:///path/to/custom/database.db"
```

Default: `sqlite:///dashboard.db` (in project root)

## Support

For issues or questions about the database:
- Check application logs
- Verify database file permissions
- Ensure SQLite3 is installed
- Check Python SQLAlchemy and Flask-SQLAlchemy versions

## References

- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Flask-SQLAlchemy](https://flask-sqlalchemy.palletsprojects.com/)
- [Flask-Login](https://flask-login.readthedocs.io/)
