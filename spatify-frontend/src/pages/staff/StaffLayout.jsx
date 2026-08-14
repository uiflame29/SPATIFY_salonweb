import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { StaffSidebar } from '../../components/layout/AdditionalSidebars';
import DashboardView from './DashboardView';
import StaffAppointments from './StaffAppointments';
import StaffEarnings from './StaffEarnings';

import StaffSchedule from './StaffSchedule';
import StaffAuditLogs from './StaffAuditLogs';

const StaffLayout = () => {
  return (
    <div className="dashboard-layout">
      <StaffSidebar />
      <div className="dashboard-content">
        <Routes>
          <Route path="/" element={<DashboardView />} />
          <Route path="/appointments" element={<StaffAppointments />} />
          <Route path="/schedule" element={<StaffSchedule />} />
          <Route path="/earnings" element={<StaffEarnings />} />
          <Route path="/audit" element={<StaffAuditLogs />} />
          <Route path="*" element={<Navigate to="/staff" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default StaffLayout;
