import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminSidebar } from '../../components/layout/Sidebar';
import DashboardView from './DashboardView';
import UserManagement from './UserManagement';
import AuditLogsView from './AuditLogsView';
import ServicesManagement from './ServicesManagement';
import ReviewsManagement from './ReviewsManagement';

import SecurityCenter from './SecurityCenter';
import SystemSettings from './SystemSettings';

const AdminLayout = () => {
  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <div className="dashboard-content">
        <Routes>
          <Route path="/" element={<DashboardView />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/services" element={<ServicesManagement />} />
          <Route path="/reviews" element={<ReviewsManagement />} />
          <Route path="/security" element={<SecurityCenter />} />
          <Route path="/audit" element={<AuditLogsView />} />
          <Route path="/settings" element={<SystemSettings />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminLayout;
