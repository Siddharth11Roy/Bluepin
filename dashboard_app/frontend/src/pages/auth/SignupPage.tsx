import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { TrendingUp, User, Mail, Lock, Eye, EyeOff, UserCircle } from 'lucide-react';

export default function SignupPage() {
  const { signup, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
    confirm_password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.username || !formData.email || !formData.password || !formData.confirm_password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      await signup(formData);
    } catch {
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-8">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-primary-600 to-purple-700">
        {/* Animated Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                width: `${15 + Math.random() * 60}px`,
                height: `${15 + Math.random() * 60}px`,
                left: `${5 + i * 8}%`,
                bottom: '-100px',
                animation: `rise ${6 + Math.random() * 6}s infinite ease-in`,
                animationDelay: `${Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 animate-slide-up">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-primary-600 mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">Create Account</h1>
            <p className="text-slate-500 mt-2">Join Bluepin Dashboard today</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
              <span className="text-red-500">⚠️</span>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Choose a username"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
                  autoFocus
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
                />
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Create a password"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirm_password}
                  onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                  placeholder="Confirm your password"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-primary-600 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center mt-6 text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">
              Sign in
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
            transform: translateX(80px);
          }
          100% {
            bottom: 100vh;
            transform: translateX(-80px);
          }
        }
      `}</style>
    </div>
  );
}
