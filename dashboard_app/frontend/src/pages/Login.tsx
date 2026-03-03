import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BiUser, BiLock, BiShow, BiHide, BiLogOut } from 'react-icons/bi';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, logout, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password, remember);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // If already authenticated, show option to continue or logout
  if (isAuthenticated) {
    return (
      <div className="min-h-screen auth-gradient-purple flex items-center justify-center relative overflow-hidden p-4">
        {/* Animated Bubbles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="auth-bubble"
              style={{
                width: `${[40, 20, 50, 80, 35, 45, 90, 25, 15][i]}px`,
                height: `${[40, 20, 50, 80, 35, 45, 90, 25, 15][i]}px`,
                left: `${[10, 20, 35, 50, 55, 65, 70, 80, 90][i]}%`,
                animationDuration: `${[8, 5, 7, 11, 6, 8, 12, 6, 5][i]}s`,
                animationDelay: `${[0, 1, 2, 0, 1, 3, 2, 2, 1][i]}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-10 animate-slide-up text-center">
            <div className="text-5xl mb-4">👋</div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              Welcome back, {user?.full_name || user?.username}!
            </h1>
            <p className="text-slate-500 mb-6">You are already logged in.</p>
            
            <div className="space-y-4">
              <Link
                to="/"
                className="block w-full py-3 rounded-xl font-semibold text-white
                  bg-gradient-to-r from-indigo-500 to-purple-600
                  hover:from-indigo-600 hover:to-purple-700
                  transition-all transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                Continue to Dashboard
              </Link>
              
              <button
                onClick={handleLogout}
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-slate-700
                  bg-slate-100 hover:bg-slate-200
                  flex items-center justify-center gap-2
                  transition-all disabled:opacity-70"
              >
                <BiLogOut className="text-lg" />
                {loading ? 'Logging out...' : 'Sign out & switch account'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen auth-gradient-purple flex items-center justify-center relative overflow-hidden p-4">
      {/* Animated Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="auth-bubble"
            style={{
              width: `${[40, 20, 50, 80, 35, 45, 90, 25, 15][i]}px`,
              height: `${[40, 20, 50, 80, 35, 45, 90, 25, 15][i]}px`,
              left: `${[10, 20, 35, 50, 55, 65, 70, 80, 90][i]}%`,
              animationDuration: `${[8, 5, 7, 11, 6, 8, 12, 6, 5][i]}s`,
              animationDelay: `${[0, 1, 2, 0, 1, 3, 2, 2, 1][i]}s`,
            }}
          />
        ))}
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-10 animate-slide-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              🔐
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h1>
            <p className="text-slate-500">Sign in to your Bluepin Dashboard</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="auth-input-wrapper">
              <BiUser className="auth-input-icon" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                className="auth-input"
              />
            </div>

            {/* Password */}
            <div className="auth-input-wrapper">
              <BiLock className="auth-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="auth-input auth-input-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="auth-toggle-password"
              >
                {showPassword ? <BiHide /> : <BiShow />}
              </button>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-white
                bg-gradient-to-r from-indigo-500 to-purple-600
                hover:from-indigo-600 hover:to-purple-700
                focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                disabled:opacity-70 disabled:cursor-not-allowed
                transition-all transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-slate-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
