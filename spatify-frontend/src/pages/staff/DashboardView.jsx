import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { StatCard, GlassCard } from '../../components/ui';

const StaffDashboardView = () => {
  const { user } = useAuth();
  
  return (
    <div>
      <div className="dashboard-header">
        <h2>Welcome, {user.firstName}</h2>
        <p>Your performance and upcoming appointments</p>
      </div>

      <div className="stats-grid">
        <StatCard label="Today's Appointments" value="3" icon="📅" />
        <StatCard label="Completed Services" value="42" icon="💆‍♀️" />
        <StatCard label="Total Earnings" value="₱12,500" icon="💰" />
        <StatCard label="Average Rating" value="4.8" icon="⭐" />
      </div>

      <div className="content-grid">
        <GlassCard>
          <h3>Upcoming Appointments</h3>
          <p style={{ color: 'var(--text3)' }}>No upcoming appointments today.</p>
        </GlassCard>
      </div>
    </div>
  );
};

export default StaffDashboardView;
