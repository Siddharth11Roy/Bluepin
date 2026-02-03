import { NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import {
  LayoutDashboard,
  Package,
  Building2,
  BarChart3,
  Bot,
  TrendingUp,
  Settings,
  HelpCircle,
  Moon,
  Sun,
  X,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = {
  main: [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Products', path: '/products', icon: Package },
    { label: 'Suppliers', path: '/suppliers', icon: Building2 },
    { label: 'Compare', path: '/comparisons', icon: BarChart3 },
  ],
  analytics: [
    { label: 'AI Analysis', path: '/ai-analysis', icon: Bot },
    { label: 'Trends', path: '/trends', icon: TrendingUp },
  ],
  settings: [
    { label: 'Admin Panel', path: '/admin', icon: Settings },
    { label: 'Help Center', path: '/help', icon: HelpCircle },
  ],
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/overview';
    }
    return location.pathname.startsWith(path);
  };

  const linkClasses = (path: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive(path)
        ? 'bg-primary-50 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 border-l-2 border-primary-500 ml-[-2px]'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
    }`;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white dark:bg-slate-900 text-slate-900 dark:text-white flex flex-col z-50 transform transition-transform duration-300 border-r border-slate-200 dark:border-slate-800 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400 bg-clip-text text-transparent">
              Bluepin
            </span>
          </NavLink>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 scrollbar-thin">
          {/* Main Section */}
          <div className="mb-8">
            <span className="px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Main
            </span>
            <ul className="mt-3 space-y-1">
              {navItems.main.map((item) => (
                <li key={item.path}>
                  <NavLink to={item.path} className={linkClasses(item.path)} onClick={onClose}>
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {isActive(item.path) && (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Analytics Section */}
          <div className="mb-8">
            <span className="px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Analytics
            </span>
            <ul className="mt-3 space-y-1">
              {navItems.analytics.map((item) => (
                <li key={item.path}>
                  <NavLink to={item.path} className={linkClasses(item.path)} onClick={onClose}>
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Settings Section */}
          <div>
            <span className="px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Settings
            </span>
            <ul className="mt-3 space-y-1">
              {navItems.settings.map((item) => (
                <li key={item.path}>
                  <NavLink to={item.path} className={linkClasses(item.path)} onClick={onClose}>
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Footer - Theme Toggle */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-5 h-5" />
                <span className="font-medium">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-5 h-5" />
                <span className="font-medium">Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
