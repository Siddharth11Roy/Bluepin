import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Update scroll progress bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollProgress = document.getElementById('scroll-progress');
      if (scrollProgress) {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = `${Math.min(scrollPercent, 100)}%`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="lg:pl-64">
        {/* Navbar */}
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Page Content */}
        <main className="p-4">
          <div className="w-full">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 py-4 px-4 lg:px-6">
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1">
                📊 Bluepin Analytics © 2026
              </span>
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
                Support
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
