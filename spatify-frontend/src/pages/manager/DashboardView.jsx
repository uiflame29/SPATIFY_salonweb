import React from 'react';
import { StatCard, GlassCard } from '../../components/ui';

const ManagerDashboardView = () => {
  return (
    <div>
      <div className="dashboard-header">
        <h2>Manager Operations Dashboard</h2>
        <p>Daily operations and staff management</p>
      </div>

      <div className="stats-grid">
        <StatCard label="Today's Appointments" value="12" icon="📅" />
        <StatCard label="Staff Present" value="4/5" icon="👥" />
        <StatCard label="Pending Payroll" value="2" icon="💰" />
        <StatCard label="Low Stock Items" value="3" icon="📦" change="Action needed" isPositive={false} />
      </div>

      <div className="content-grid">
        <GlassCard>
          <h3>Recent Operations</h3>
          <p style={{ color: 'var(--text3)' }}>No recent operations.</p>
        </GlassCard>
      </div>
    </div>
  );
};

export default ManagerDashboardView;
