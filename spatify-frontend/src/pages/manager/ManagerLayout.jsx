import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ManagerSidebar } from '../../components/layout/AdditionalSidebars';
import DashboardView from './DashboardView';
import ManagerAppointments from './ManagerAppointments';
import InventoryManagement from './InventoryManagement';
import PayrollProcessing from './PayrollProcessing';

import StaffActivity from './StaffActivity';
import AttendanceTracking from './AttendanceTracking';
import ManagerAuditLogs from './ManagerAuditLogs';

const ManagerLayout = () => {
  return (
    <div className="dashboard-layout">
      <ManagerSidebar />
      <div className="dashboard-content">
        <Routes>
          <Route path="/" element={<DashboardView />} />
          <Route path="/appointments" element={<ManagerAppointments />} />
          <Route path="/staff" element={<StaffActivity />} />
          <Route path="/inventory" element={<InventoryManagement />} />
          <Route path="/payroll" element={<PayrollProcessing />} />
          <Route path="/attendance" element={<AttendanceTracking />} />
          <Route path="/audit" element={<ManagerAuditLogs />} />
          <Route path="*" element={<Navigate to="/manager" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default ManagerLayout;
