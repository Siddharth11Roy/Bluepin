import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BiShield, BiUser, BiPlus, BiEdit, BiTrash, BiSearch,
  BiPackage, BiStore, BiBook, BiCheckCircle, BiXCircle
} from 'react-icons/bi';
import { useAuth } from '../context/AuthContext';
import * as api from '../api/services';

interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  is_admin: boolean;
  created_at: string;
}

interface Article {
  id: number;
  title: string;
  category: string;
  author: string;
  created_at: string;
  published: boolean;
}

interface AdminStats {
  total_users: number;
  total_products: number;
  total_suppliers: number;
  total_articles: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'articles'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user && !user.is_admin) {
      navigate('/');
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [statsData, usersData, articlesData] = await Promise.all([
        api.getAdminStats(),
        api.getAdminUsers(),
        api.getAdminArticles()
      ]);
      setStats(statsData);
      setUsers(usersData.users || []);
      setArticles(articlesData.articles || []);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserAdmin = async (userId: number, isAdmin: boolean) => {
    try {
      await api.updateUser(userId, { is_admin: !isAdmin });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_admin: !isAdmin } : u));
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const deleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const deleteArticle = async (articleId: number) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      await api.deleteArticle(articleId);
      setArticles(prev => prev.filter(a => a.id !== articleId));
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredArticles = articles.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user?.is_admin) {
    return (
      <div className="floating-card text-center py-16 max-w-lg mx-auto">
        <BiShield className="text-6xl text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Access Denied</h2>
        <p className="text-slate-500 mb-6">You don't have permission to access this page.</p>
        <Link to="/" className="btn-primary">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-3">
            <BiShield className="text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Manage users, content, and system settings
          </p>
        </div>
        <Link to="/admin/articles/new" className="btn-primary">
          <BiPlus className="text-lg" />
          New Article
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="floating-card metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
              <BiUser className="text-2xl" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">
            {stats?.total_users || 0}
          </h3>
          <p className="text-slate-500 text-sm">Total Users</p>
        </div>

        <div className="floating-card metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg">
              <BiPackage className="text-2xl" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">
            {stats?.total_products?.toLocaleString() || 0}
          </h3>
          <p className="text-slate-500 text-sm">Products</p>
        </div>

        <div className="floating-card metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <BiStore className="text-2xl" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">
            {stats?.total_suppliers?.toLocaleString() || 0}
          </h3>
          <p className="text-slate-500 text-sm">Suppliers</p>
        </div>

        <div className="floating-card metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
              <BiBook className="text-2xl" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">
            {stats?.total_articles || 0}
          </h3>
          <p className="text-slate-500 text-sm">Articles</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="floating-card">
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 mb-6">
          {(['overview', 'users', 'articles'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSearchQuery(''); }}
              className={`px-4 py-3 font-medium capitalize transition-all border-b-2 -mb-px ${
                activeTab === tab
                  ? 'text-primary border-primary'
                  : 'text-slate-500 border-transparent hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        {(activeTab === 'users' || activeTab === 'articles') && (
          <div className="mb-6">
            <div className="relative max-w-md">
              <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeTab}...`}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 
                  bg-white dark:bg-slate-700 text-slate-700 dark:text-white
                  focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Users */}
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Recent Users</h3>
              <div className="space-y-3">
                {users.slice(0, 5).map(user => (
                  <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                        {user.username?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-700 dark:text-white">{user.username}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    {user.is_admin && (
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Articles */}
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Recent Articles</h3>
              <div className="space-y-3">
                {articles.slice(0, 5).map(article => (
                  <div key={article.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <div>
                      <p className="font-medium text-slate-700 dark:text-white">{article.title}</p>
                      <p className="text-sm text-slate-500">{article.category} • {formatDate(article.created_at)}</p>
                    </div>
                    <Link to={`/admin/articles/${article.id}`} className="text-primary hover:text-primary-dark">
                      <BiEdit className="text-xl" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">User</th>
                  <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">Role</th>
                  <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">Joined</th>
                  <th className="text-right py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                          {u.username?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-700 dark:text-white">{u.username}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{u.email}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleUserAdmin(u.id, u.is_admin)}
                        className={`text-xs font-medium px-2 py-1 rounded-full transition-colors ${
                          u.is_admin 
                            ? 'text-primary bg-primary/10 hover:bg-primary/20' 
                            : 'text-slate-500 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {u.is_admin ? 'Admin' : 'User'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{formatDate(u.created_at)}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                        disabled={u.id === user?.id}
                      >
                        <BiTrash className="text-xl" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">Title</th>
                  <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">Category</th>
                  <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">Author</th>
                  <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">Date</th>
                  <th className="text-right py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map(article => (
                  <tr key={article.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-4 font-medium text-slate-700 dark:text-white">{article.title}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{article.category}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{article.author}</td>
                    <td className="py-3 px-4">
                      {article.published ? (
                        <span className="flex items-center gap-1 text-emerald-600">
                          <BiCheckCircle />
                          Published
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-600">
                          <BiXCircle />
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{formatDate(article.created_at)}</td>
                    <td className="py-3 px-4 text-right flex justify-end gap-2">
                      <Link
                        to={`/admin/articles/${article.id}`}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <BiEdit className="text-xl" />
                      </Link>
                      <button
                        onClick={() => deleteArticle(article.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <BiTrash className="text-xl" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
