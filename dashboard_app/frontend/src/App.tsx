import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Overview from './pages/Overview';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Suppliers from './pages/Suppliers';
import Comparisons from './pages/Comparisons';
import AIAnalysis from './pages/AIAnalysis';
import University from './pages/University';
import ArticleDetail from './pages/ArticleDetail';
import Wishlist from './pages/Wishlist';
import AdminDashboard from './pages/AdminDashboard';
import ArticleForm from './pages/ArticleForm';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes with Layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Overview />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="comparisons" element={<Comparisons />} />
            <Route path="ai-analysis" element={<AIAnalysis />} />
            <Route path="university" element={<University />} />
            <Route path="university/:id" element={<ArticleDetail />} />
            <Route path="wishlist" element={<Wishlist />} />
            
            {/* Admin Routes */}
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/articles/new" element={<ArticleForm />} />
            <Route path="admin/articles/:id" element={<ArticleForm />} />
          </Route>

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
