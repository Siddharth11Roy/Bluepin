from flask import Blueprint, render_template, request, jsonify, flash, redirect, url_for
from app.services.data_loader import DataLoader
from app.services.aggregations import Aggregations
import os

bp = Blueprint('admin', __name__)

@bp.route('/')
@bp.route('/dashboard')
def admin_dashboard():
    """Admin dashboard for managing content"""
    stats = Aggregations.get_overview_stats()
    
    # Get data freshness
    cache_time = DataLoader._cache_timestamp
    
    return render_template('admin/admin_dashboard.html',
                         stats=stats,
                         cache_time=cache_time,
                         active_page='admin')

@bp.route('/refresh-data', methods=['POST'])
def refresh_data():
    """Refresh cached data"""
    try:
        DataLoader.clear_cache()
        DataLoader.load_products(force_reload=True)
        DataLoader.load_suppliers(force_reload=True)
        return jsonify({
            'success': True,
            'message': 'Data refreshed successfully'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500