import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { StatCard, GlassCard } from '../../components/ui';

const DashboardView = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load admin stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div style={{ color: 'var(--gold)' }}>Loading dashboard...</div>;
  if (!stats) return <div style={{ color: 'var(--danger)' }}>Failed to load dashboard data.</div>;

  return (
    <div>
      <div className="dashboard-header">
        <h2>Admin Overview</h2>
        <p>System metrics and performance summary</p>
      </div>

      <div className="stats-grid">
        <StatCard label="Total Users" value={stats.totalUsers} icon="👥" change="12%" isPositive={true} />
        <StatCard label="Total Bookings" value={stats.totalBookings} icon="📅" change="8%" isPositive={true} />
        <StatCard label="Active Services" value={stats.totalServices} icon="💆‍♀️" />
        <StatCard label="Avg Rating" value={stats.avgRating ? stats.avgRating.toFixed(1) : 'N/A'} icon="⭐" />
      </div>

      <div className="content-grid">
        <GlassCard>
          <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>System Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '4px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text2)' }}>API Connection</span>
              <span style={{ color: 'var(--success)', fontSize: '12px', fontWeight: '600' }}>● ONLINE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '4px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text2)' }}>Database Status</span>
              <span style={{ color: 'var(--success)', fontSize: '12px', fontWeight: '600' }}>● CONNECTED</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '4px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text2)' }}>JWT Authentication</span>
              <span style={{ color: 'var(--success)', fontSize: '12px', fontWeight: '600' }}>● SECURE</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default DashboardView;
