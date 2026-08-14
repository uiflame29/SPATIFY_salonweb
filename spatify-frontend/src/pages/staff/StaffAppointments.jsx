import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { GlassCard, Badge } from '../../components/ui';

const StaffAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/staff/appointments');
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      fetchAppointments();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div>Loading appointments...</div>;

  return (
    <div>
      <div className="dashboard-header">
        <h2>My Appointments</h2>
        <p>View and manage your upcoming schedule</p>
      </div>

      <GlassCard style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Service</th>
                <th>Date / Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '24px' }}>No appointments found.</td></tr>
              ) : appointments.map(a => (
                <tr key={a.id}>
                  <td style={{ fontWeight: '500' }}>{a.customerName}</td>
                  <td style={{ color: 'var(--gold)' }}>{a.serviceName}</td>
                  <td>
                    <div style={{ whiteSpace: 'nowrap' }}>{a.bookingDate}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text3)' }}>{a.timeSlot}</div>
                  </td>
                  <td>
                    <Badge type={a.status === 'CONFIRMED' ? 'success' : a.status === 'PENDING' ? 'warning' : a.status === 'CANCELLED' ? 'danger' : 'info'}>
                      {a.status}
                    </Badge>
                  </td>
                  <td>
                    {a.status === 'CONFIRMED' && (
                      <button className="btn-success" onClick={() => updateStatus(a.id, 'COMPLETED')}>Complete</button>
                    )}
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

export default StaffAppointments;
