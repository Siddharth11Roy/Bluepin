"""
Authentication API routes for login, signup, and logout
"""
from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from app.models import User
from app.extensions import db
from datetime import datetime

bp = Blueprint('auth', __name__)

@bp.route('/login', methods=['POST'])
def login():
    """User login API"""
    if current_user.is_authenticated:
        return jsonify({
            'success': True,
            'message': 'Already logged in',
            'user': {
                'id': current_user.id,
                'username': current_user.username,
                'email': current_user.email,
                'full_name': current_user.full_name,
                'is_admin': current_user.is_admin
            }
        })
    
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    remember = data.get('remember', False)
    
    if not username or not password:
        return jsonify({
            'success': False,
            'message': 'Please provide both username and password.'
        }), 400
    
    user = User.query.filter_by(username=username).first()
    
    if user and user.check_password(password):
        if not user.is_active:
            return jsonify({
                'success': False,
                'message': 'Your account has been deactivated. Please contact support.'
            }), 403
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        login_user(user, remember=remember)
        
        return jsonify({
            'success': True,
            'message': f'Welcome back, {user.full_name or user.username}!',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'full_name': user.full_name,
                'is_admin': user.is_admin
            }
        })
    else:
        return jsonify({
            'success': False,
            'message': 'Invalid username or password.'
        }), 401


@bp.route('/signup', methods=['POST'])
def signup():
    """User registration API"""
    if current_user.is_authenticated:
        return jsonify({
            'success': False,
            'message': 'Already logged in. Please logout first.'
        }), 400
    
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    full_name = data.get('full_name')
    password = data.get('password')
    confirm_password = data.get('confirm_password')
    
    # Validation
    if not all([username, email, password, confirm_password]):
        return jsonify({
            'success': False,
            'message': 'Please fill in all required fields.'
        }), 400
    
    if password != confirm_password:
        return jsonify({
            'success': False,
            'message': 'Passwords do not match.'
        }), 400
    
    if len(password) < 6:
        return jsonify({
            'success': False,
            'message': 'Password must be at least 6 characters long.'
        }), 400
    
    # Check if user exists
    if User.query.filter_by(username=username).first():
        return jsonify({
            'success': False,
            'message': 'Username already exists. Please choose another.'
        }), 400
    
    if User.query.filter_by(email=email).first():
        return jsonify({
            'success': False,
            'message': 'Email already registered. Please use another or login.'
        }), 400
    
    # Create new user
    user = User(
        username=username,
        email=email,
        full_name=full_name
    )
    user.set_password(password)
    
    try:
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Account created successfully! Please log in.'
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': 'An error occurred while creating your account. Please try again.'
        }), 500


@bp.route('/logout', methods=['POST'])
@login_required
def logout():
    """User logout API"""
    logout_user()
    return jsonify({
        'success': True,
        'message': 'You have been logged out successfully.'
    })


@bp.route('/me', methods=['GET'])
@login_required
def get_current_user():
    """Get current logged in user"""
    return jsonify({
        'success': True,
        'user': {
            'id': current_user.id,
            'username': current_user.username,
            'email': current_user.email,
            'full_name': current_user.full_name,
            'is_admin': current_user.is_admin,
            'created_at': current_user.created_at.isoformat() if current_user.created_at else None,
            'last_login': current_user.last_login.isoformat() if current_user.last_login else None
        }
    })


@bp.route('/check', methods=['GET'])
def check_auth():
    """Check if user is authenticated"""
    if current_user.is_authenticated:
        return jsonify({
            'authenticated': True,
            'user': {
                'id': current_user.id,
                'username': current_user.username,
                'email': current_user.email,
                'full_name': current_user.full_name,
                'is_admin': current_user.is_admin
            }
        })
    return jsonify({'authenticated': False})
