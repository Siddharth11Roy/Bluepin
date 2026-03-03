"""
Script to create an admin user for Bluepin Dashboard
Run this script to create the admin account
"""
from app import create_app
from models import db, User

def create_admin():
    app = create_app()
    with app.app_context():
        # Check if admin already exists
        admin = User.query.filter_by(username='admin').first()
        
        if admin:
            print("✓ Admin user already exists")
            print(f"  Username: admin")
            print(f"  Email: {admin.email}")
            print(f"  Is Admin: {admin.is_admin}")
            return
        
        # Create new admin user
        admin = User(
            username='admin',
            email='admin@bluepin.com',
            full_name='Bluepin Administrator',
            is_admin=True
        )
        admin.set_password('admin123')  # Default password
        
        db.session.add(admin)
        db.session.commit()
        
        print("✓ Admin user created successfully!")
        print("\n" + "="*50)
        print("ADMIN LOGIN CREDENTIALS:")
        print("="*50)
        print(f"Username: admin")
        print(f"Password: admin123")
        print(f"Email: admin@bluepin.com")
        print("="*50)
        print("\n⚠️  IMPORTANT: Please change the password after first login!")

if __name__ == '__main__':
    create_admin()
