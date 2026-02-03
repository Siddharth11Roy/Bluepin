import { useQuery } from '@tanstack/react-query';
import {
  Settings,
  RefreshCw,
  Database,
  Users,
  Package,
  Building2,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { statsApi } from '../../api';
import { formatCurrency, formatNumber } from '../../utils/formatters';

export default function AdminDashboard() {
  const { user } = useAuth();

  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: ['adminStats'],
    queryFn: statsApi.getStats,
  });

  if (!user?.is_admin) {
    return (
      <div className="card p-12 text-center">
        <Settings className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
          Access Denied
        </h3>
        <p className="text-slate-500 dark:text-slate-400">
          You don't have permission to view this page.
        </p>
      </div>
    );
  }

  const handleRefreshData = async () => {
    // TODO: Call backend refresh endpoint
    await refetch();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Settings className="w-8 h-8 text-slate-500" />
            Admin Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            System overview and management
          </p>
        </div>
        <button
          onClick={handleRefreshData}
          className="btn btn-primary flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-900/30">
              <Package className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Products</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {isLoading ? '...' : formatNumber(stats?.total_products || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
              <Building2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Suppliers</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {isLoading ? '...' : formatNumber(stats?.total_suppliers || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30">
              <TrendingUp className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Avg Product Price</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {isLoading ? '...' : formatCurrency(stats?.avg_product_price || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Reviews</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {isLoading ? '...' : formatNumber(stats?.total_reviews || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Database Status */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-slate-500" />
          Database Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <p className="text-sm text-slate-500 dark:text-slate-400">Products Database</p>
            <p className="text-lg font-medium text-slate-900 dark:text-white mt-1">
              {isLoading ? 'Loading...' : `${stats?.total_products || 0} records`}
            </p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <p className="text-sm text-slate-500 dark:text-slate-400">Suppliers Database</p>
            <p className="text-lg font-medium text-slate-900 dark:text-white mt-1">
              {isLoading ? 'Loading...' : `${stats?.total_suppliers || 0} records`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
