import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';

// Public Pages
import HomePage from './pages/public/HomePage';
import ServicesPage from './pages/public/ServicesPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPassword from './pages/auth/ForgotPassword';

// Dashboard Pages
import CustomerDashboard from './pages/customer/DashboardPage';
import AdminLayout from './pages/admin/AdminLayout';
import ManagerLayout from './pages/manager/ManagerLayout';
import StaffLayout from './pages/staff/StaffLayout';
import BookingPage from './pages/booking/BookingPage';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--gold)' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  
  return children;
};

// Placeholder components for routes not yet implemented
const PlaceholderPage = ({ title }) => (
  <div style={{ padding: '40px', textAlign: 'center' }}>
    <h2 style={{ color: 'var(--gold)', marginBottom: '16px' }}>{title}</h2>
    <p style={{ color: 'var(--text3)' }}>This page is under construction.</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          <Route path="/book" element={<BookingPage />} />
          
          {/* Customer Routes */}
          <Route path="/customer" element={
            <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN', 'MANAGER', 'STAFF']}>
              <CustomerDashboard />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminLayout />
            </ProtectedRoute>
          } />

          {/* Manager Routes */}
          <Route path="/manager/*" element={
            <ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']}>
              <ManagerLayout />
            </ProtectedRoute>
          } />

          {/* Staff Routes */}
          <Route path="/staff/*" element={
            <ProtectedRoute allowedRoles={['STAFF', 'MANAGER', 'ADMIN']}>
              <StaffLayout />
            </ProtectedRoute>
          } />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
