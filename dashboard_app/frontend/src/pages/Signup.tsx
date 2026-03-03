import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BiUser, BiEnvelope, BiLock, BiShow, BiHide, BiIdCard } from 'react-icons/bi';

export default function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
    confirm_password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await signup(formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen auth-gradient-pink flex items-center justify-center relative overflow-hidden p-4 py-10">
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

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-10 animate-slide-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              ✨
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Create Account</h1>
            <p className="text-slate-500">Join Bluepin Dashboard today</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
              Account created successfully! Redirecting to login...
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="auth-input-wrapper">
              <BiIdCard className="auth-input-icon" />
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Full Name"
                className="auth-input"
              />
            </div>

            {/* Username */}
            <div className="auth-input-wrapper">
              <BiUser className="auth-input-icon" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                required
                className="auth-input"
              />
            </div>

            {/* Email */}
            <div className="auth-input-wrapper">
              <BiEnvelope className="auth-input-icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                className="auth-input"
              />
            </div>

            {/* Password */}
            <div className="auth-input-wrapper">
              <BiLock className="auth-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
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

            {/* Confirm Password */}
            <div className="auth-input-wrapper">
              <BiLock className="auth-input-icon" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
                className="auth-input auth-input-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="auth-toggle-password"
              >
                {showConfirmPassword ? <BiHide /> : <BiShow />}
              </button>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                required
                className="w-4 h-4 rounded border-slate-300 text-pink-600 focus:ring-pink-500 mt-0.5"
              />
              <span className="text-sm text-slate-600">
                I agree to the{' '}
                <a href="#" className="text-pink-600 hover:text-pink-800">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-pink-600 hover:text-pink-800">Privacy Policy</a>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-white
                bg-gradient-to-r from-pink-500 to-rose-500
                hover:from-pink-600 hover:to-rose-600
                focus:outline-none focus:ring-2 focus:ring-pink-500/50
                disabled:opacity-70 disabled:cursor-not-allowed
                transition-all transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="text-pink-600 font-semibold hover:text-pink-800 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
