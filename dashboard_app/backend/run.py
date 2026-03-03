#!/usr/bin/env python
"""Flask API Backend Runner"""
from app import create_app
import os

app = create_app()

if __name__ == '__main__':
    print("="*50)
    print("🚀 Bluepin Dashboard API Starting...")
    print("📡 API available at: http://localhost:5000/api")
    print("🔐 Auth endpoints at: http://localhost:5000/api/auth")
    print("⚙️  Admin endpoints at: http://localhost:5000/api/admin")
    print("="*50)
    app.run(debug=True, host='0.0.0.0', port=5000)