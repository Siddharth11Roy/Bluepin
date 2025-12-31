#!/usr/bin/env python
"""Application runner script"""
from app import create_app
import os

app = create_app(os.getenv('FLASK_ENV', 'development'))

if __name__ == '__main__':
    print("="*50)
    print("🚀 Dashboard Application Starting...")
    print("📊 Access the dashboard at: http://localhost:5000")
    print("🔧 Admin panel at: http://localhost:5000/admin")
    print("="*50)
    app.run(debug=True, host='0.0.0.0', port=5000)