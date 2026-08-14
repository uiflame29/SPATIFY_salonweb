import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { GlassCard, Badge } from '../../components/ui';

const StaffActivity = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaffActivity();
  }, []);

  const fetchStaffActivity = async () => {
    try {
      const res = await api.get('/manager/staff/activity');
      setStaff(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading staff activity...</div>;

  return (
    <div>
      <div className="dashboard-header">
        <h2>Staff Activity</h2>
        <p>Monitor staff performance and current status</p>
      </div>

      <GlassCard style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Staff Member</th>
                <th>Email</th>
                <th>Status</th>
                <th>Recent Bookings Handled</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '24px' }}>No staff members found.</td></tr>
              ) : staff.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: '500' }}>{s.name}</td>
                  <td style={{ color: 'var(--text2)' }}>{s.email}</td>
                  <td>
                    <Badge type={s.status === 'Active' ? 'success' : 'warning'}>{s.status}</Badge>
                  </td>
                  <td>{s.bookingsHandled} bookings</td>
                  <td>
                    <button className="btn-ghost" style={{ padding: '4px 8px', fontSize: '10px' }}>View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default StaffActivity;
