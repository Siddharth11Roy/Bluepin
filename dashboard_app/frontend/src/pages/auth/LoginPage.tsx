import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { TrendingUp, User, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.password) {
      setError('Please provide both username and password.');
      return;
    }

    try {
      await login(formData);
    } catch {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-primary-600 to-purple-700">
        {/* Animated Bubbles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/10 animate-pulse"
              style={{
                width: `${20 + Math.random() * 80}px`,
                height: `${20 + Math.random() * 80}px`,
                left: `${10 + i * 10}%`,
                bottom: '-100px',
                animation: `rise ${5 + Math.random() * 7}s infinite ease-in`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 animate-slide-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-primary-600 mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">Welcome Back</h1>
            <p className="text-slate-500 mt-2">Sign in to your Bluepin account</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
              <span className="text-red-500">⚠️</span>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Enter your username"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.remember}
                  onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-primary-600 text-white font-semibold hover:shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center mt-6 text-slate-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-600 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Custom Keyframes */}
      <style>{`
        @keyframes rise {
          0% {
            bottom: -100px;
            transform: translateX(0);
          }
          50% {
            transform: translateX(100px);
          }
          100% {
            bottom: 100vh;
            transform: translateX(-100px);
          }
        }
      `}</style>
    </div>
  );
}
