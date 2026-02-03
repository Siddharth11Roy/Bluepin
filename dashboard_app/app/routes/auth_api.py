"""
JWT Authentication API routes for React frontend
"""
from flask import Blueprint, request, jsonify
from models import db, User
from datetime import datetime, timedelta
import hashlib
import hmac
import base64
import json
import os

bp = Blueprint('auth_api', __name__, url_prefix='/api/auth')

# Secret key for JWT - in production, use a proper secret from environment
SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'bluepin-dashboard-secret-key-change-in-production')
TOKEN_EXPIRY_HOURS = 24

def create_jwt(payload: dict) -> str:
    """Create a simple JWT token"""
    header = base64.urlsafe_b64encode(
        json.dumps({"alg": "HS256", "typ": "JWT"}).encode()
    ).rstrip(b'=').decode()
    
    payload_encoded = base64.urlsafe_b64encode(
        json.dumps(payload).encode()
    ).rstrip(b'=').decode()
    
    signature = hmac.new(
        SECRET_KEY.encode(),
        f"{header}.{payload_encoded}".encode(),
        hashlib.sha256
    ).digest()
    signature_encoded = base64.urlsafe_b64encode(signature).rstrip(b'=').decode()
    
    return f"{header}.{payload_encoded}.{signature_encoded}"

def decode_jwt(token: str) -> dict | None:
    """Decode and verify a JWT token"""
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None
        
        header, payload_encoded, signature = parts
        
        # Verify signature
        expected_sig = hmac.new(
            SECRET_KEY.encode(),
            f"{header}.{payload_encoded}".encode(),
            hashlib.sha256
        ).digest()
        expected_sig_encoded = base64.urlsafe_b64encode(expected_sig).rstrip(b'=').decode()
        
        if not hmac.compare_digest(signature, expected_sig_encoded):
            return None
        
        # Decode payload (add padding if needed)
        padding = 4 - len(payload_encoded) % 4
        if padding != 4:
            payload_encoded += '=' * padding
        
        payload = json.loads(base64.urlsafe_b64decode(payload_encoded))
        
        # Check expiry
        if 'exp' in payload:
            exp_time = datetime.fromisoformat(payload['exp'])
            if datetime.utcnow() > exp_time:
                return None
        
        return payload
    except Exception as e:
        print(f"JWT decode error: {e}")
        return None

def get_current_user_from_token() -> User | None:
    """Extract user from JWT in Authorization header"""
    auth_header = request.headers.get('Authorization', '')
    
    if not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header[7:]  # Remove 'Bearer '
    payload = decode_jwt(token)
    
    if not payload or 'user_id' not in payload:
        return None
    
    return User.query.get(payload['user_id'])

def user_to_dict(user: User) -> dict:
    """Convert User model to dictionary"""
    return {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'full_name': user.full_name,
        'is_admin': user.is_admin,
        'is_active': user.is_active,
        'created_at': user.created_at.isoformat() if user.created_at else None,
        'last_login': user.last_login.isoformat() if user.last_login else None,
    }


@bp.route('/login', methods=['POST'])
def api_login():
    """API login endpoint - returns JWT token"""
    data = request.get_json()
    
    if not data:
        return jsonify({'success': False, 'message': 'No data provided'}), 400
    
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({
            'success': False,
            'message': 'Please provide both username and password.'
        }), 400
    
    user = User.query.filter_by(username=username).first()
    
    if not user or not user.check_password(password):
        return jsonify({
            'success': False,
            'message': 'Invalid username or password.'
        }), 401
    
    if not user.is_active:
        return jsonify({
            'success': False,
            'message': 'Your account has been deactivated.'
        }), 403
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.session.commit()
    
    # Create JWT token
    expiry = datetime.utcnow() + timedelta(hours=TOKEN_EXPIRY_HOURS)
    token = create_jwt({
        'user_id': user.id,
        'username': user.username,
        'is_admin': user.is_admin,
        'exp': expiry.isoformat()
    })
    
    return jsonify({
        'success': True,
        'message': f'Welcome back, {user.full_name or user.username}!',
        'token': token,
        'user': user_to_dict(user)
    })


@bp.route('/signup', methods=['POST'])
def api_signup():
    """API signup endpoint"""
    data = request.get_json()
    
    if not data:
        return jsonify({'success': False, 'message': 'No data provided'}), 400
    
    username = data.get('username')
    email = data.get('email')
    full_name = data.get('full_name', '')
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
            'message': 'Username already exists.'
        }), 400
    
    if User.query.filter_by(email=email).first():
        return jsonify({
            'success': False,
            'message': 'Email already registered.'
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
            'message': 'Account created successfully!'
        })
    except Exception as e:
        db.session.rollback()
        print(f"Error creating user: {e}")
        return jsonify({
            'success': False,
            'message': 'An error occurred. Please try again.'
        }), 500


@bp.route('/me', methods=['GET'])
def api_me():
    """Get current user info from JWT token"""
    user = get_current_user_from_token()
    
    if not user:
        return jsonify({
            'success': False,
            'message': 'Not authenticated'
        }), 401
    
    return jsonify({
        'success': True,
        'user': user_to_dict(user)
    })


@bp.route('/logout', methods=['POST'])
def api_logout():
    """API logout endpoint - just returns success (client clears token)"""
    return jsonify({
        'success': True,
        'message': 'Logged out successfully'
    })
