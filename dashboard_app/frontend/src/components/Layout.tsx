import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <Navbar />
      
      {/* Main Content */}
      <main className="pt-[70px]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--bg-primary)] border-t border-[var(--border-color)] py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-800 to-blue-500 rounded-lg flex items-center justify-center text-white text-sm">
              B
            </div>
            <span className="text-slate-600 dark:text-slate-400">
              Bluepin Analytics © 2026
            </span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
