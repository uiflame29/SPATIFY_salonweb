import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { GlassCard, Badge } from '../../components/ui';

const StaffSchedule = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await api.get('/staff/attendance');
      setAttendance(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading attendance records...</div>;

  return (
    <div>
      <div className="dashboard-header">
        <h2>My Attendance & Schedule</h2>
        <p>View your actual clock-in/out logs and shifts</p>
      </div>

      <GlassCard style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Clock In</th>
                <th>Clock Out</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '24px' }}>No attendance records found.</td></tr>
              ) : attendance.map((a, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: '500', color: 'var(--text)' }}>{a.date}</td>
                  <td style={{ color: 'var(--success)' }}>{a.checkIn || '--:--'}</td>
                  <td style={{ color: 'var(--text3)' }}>{a.checkOut || '--:--'}</td>
                  <td>
                    <Badge type={a.checkOut ? 'info' : 'success'}>
                      {a.checkOut ? 'COMPLETED' : 'ACTIVE'}
                    </Badge>
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

export default StaffSchedule;
