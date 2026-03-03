import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BiTachometer,
  BiBox,
  BiBuildings,
  BiBarChartAlt2,
  BiBot,
  BiBookOpen,
  BiCog,
  BiBell,
  BiCollection,
  BiMoon,
  BiSun,
  BiMenu,
  BiX,
  BiSearch,
  BiChevronDown,
  BiLogOut,
  BiUser,
} from 'react-icons/bi';

const navItems = [
  { path: '/', label: 'Dashboard', icon: BiTachometer },
  { path: '/products', label: 'Products', icon: BiBox },
  { path: '/suppliers', label: 'Suppliers', icon: BiBuildings },
  { path: '/comparisons', label: 'Compare', icon: BiBarChartAlt2 },
  { path: '/ai-analysis', label: 'AI Analysis', icon: BiBot },
  { path: '/university', label: 'Bluepin University', icon: BiBookOpen },
];

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 h-[70px] z-50 transition-all duration-250
        ${scrolled ? 'shadow-lg' : ''}
        ${theme === 'dark'
          ? 'bg-slate-900/85 backdrop-blur-xl border-b border-slate-700'
          : 'bg-white/85 backdrop-blur-xl border-b border-slate-200'
        }`}
    >
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 lg:px-8 gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 text-xl font-bold hover:scale-102 transition-transform">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-800 to-blue-500 rounded-lg flex items-center justify-center text-white text-lg">
            B
          </div>
          <span className="text-blue-800 dark:text-blue-400 hidden sm:block">Bluepin</span>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {mobileMenuOpen ? <BiX className="text-2xl" /> : <BiMenu className="text-2xl" />}
        </button>

        {/* Navigation Links */}
        <ul
          className={`
            lg:flex lg:items-center lg:gap-1
            ${mobileMenuOpen
              ? 'absolute top-[70px] left-0 right-0 flex flex-col bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-lg p-4 gap-2'
              : 'hidden'
            }
          `}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all
                    ${isActive
                      ? 'bg-gradient-to-r from-blue-800 to-blue-500 text-white'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }
                  `}
                >
                  <Icon className="text-lg" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
          {isAdmin && (
            <li>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all
                  ${location.pathname === '/admin'
                    ? 'bg-gradient-to-r from-blue-800 to-blue-500 text-white'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }
                `}
              >
                <BiCog className="text-lg" />
                <span>Admin Panel</span>
              </Link>
            </li>
          )}
        </ul>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md relative">
          <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
          <input
            type="text"
            placeholder="Search anything... (Ctrl+K)"
            className="w-full pl-10 pr-4 py-2.5 rounded-full border-2 border-slate-200 dark:border-slate-700 
              bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200
              focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
              transition-all text-sm"
          />
        </div>

        {/* Navbar Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <BiBell className="text-xl text-slate-600 dark:text-slate-400" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* Comparison Cart */}
          <button className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <BiCollection className="text-xl text-slate-600 dark:text-slate-400" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'light' ? (
              <BiMoon className="text-xl text-slate-600" />
            ) : (
              <BiSun className="text-xl text-yellow-400" />
            )}
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 
                hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <img
                src={`https://ui-avatars.com/api/?name=${user?.full_name || user?.username}&background=1e3a8a&color=fff`}
                alt="User"
                className="w-8 h-8 rounded-full"
              />
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {user?.full_name || user?.username}
                </span>
                <span className="text-xs text-slate-500">
                  {user?.is_admin ? 'Administrator' : 'User'}
                </span>
              </div>
              <BiChevronDown className="text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <BiUser /> My Profile
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <BiCog /> Settings
                </Link>
                <hr className="my-2 border-slate-200 dark:border-slate-700" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
                >
                  <BiLogOut /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
