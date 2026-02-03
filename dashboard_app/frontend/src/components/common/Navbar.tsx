import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Menu,
  Search,
  Bell,
  Layers,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { getAvatarUrl } from '../../utils/constants';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Navigate to search results
      console.log('Search:', searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between px-4 h-16 lg:px-6">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden transition-colors"
          >
            <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                isSearchFocused ? 'text-primary-500' : 'text-slate-400'
              }`}
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search anything... (Ctrl+K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-64 lg:w-80 pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </form>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Comparison Cart */}
          <button className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Layers className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <img
                src={getAvatarUrl(user?.full_name || user?.username || 'User')}
                alt="User"
                className="w-8 h-8 rounded-full"
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {user?.full_name || user?.username}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {user?.is_admin ? 'Administrator' : 'User'}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 animate-slide-down">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {user?.full_name || user?.username}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {user?.email}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    navigate('/profile');
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <User className="w-4 h-4" />
                  My Profile
                </button>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    navigate('/settings');
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    navigate('/help');
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <HelpCircle className="w-4 h-4" />
                  Help
                </button>

                <hr className="my-2 border-slate-100 dark:border-slate-700" />

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll Progress Bar */}
      <div className="h-0.5 bg-slate-100 dark:bg-slate-800">
        <div
          id="scroll-progress"
          className="h-full bg-gradient-to-r from-primary-500 to-purple-500 w-0 transition-all duration-100"
        />
      </div>
    </header>
  );
}
