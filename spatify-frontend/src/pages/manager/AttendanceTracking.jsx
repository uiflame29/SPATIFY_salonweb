import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { GlassCard, Badge } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

const AttendanceTracking = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState('');

  useEffect(() => {
    fetchAttendance();
    fetchStaff();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await api.get('/manager/attendance');
      setAttendance(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await api.get('/manager/staff/activity');
      setStaffList(res.data);
      if (res.data.length > 0) setSelectedStaff(res.data[0].id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClockIn = async (e) => {
    e.preventDefault();
    try {
      await api.post('/manager/attendance/clock-in', { staffId: selectedStaff });
      setShowModal(false);
      fetchAttendance();
    } catch (err) {
      alert('Failed to clock in');
    }
  };

  const handleClockOut = async (id) => {
    try {
      await api.put(`/manager/attendance/clock-out/${id}`);
      fetchAttendance();
    } catch (err) {
      alert('Failed to clock out');
    }
  };

  const deleteAttendance = async (id) => {
    if (window.confirm('Delete this attendance record?')) {
      try {
        await api.delete(`/manager/attendance/${id}`);
        fetchAttendance();
      } catch (err) {
        alert('Failed to delete record');
      }
    }
  };

  if (loading) return <div>Loading attendance records...</div>;

  return (
    <div>
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Attendance Tracking</h2>
          <p>Monitor staff clock-in and clock-out times</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>+ Manual Clock-In</button>
      </div>

      <GlassCard style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Staff Member</th>
                <th>Date</th>
                <th>Clock In</th>
                <th>Clock Out</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendance.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '24px' }}>No attendance records found.</td></tr>
              ) : attendance.map(a => (
                <tr key={a.id}>
                  <td style={{ fontWeight: '500' }}>{a.staff?.firstName} {a.staff?.lastName}</td>
                  <td>{a.date}</td>
                  <td style={{ color: 'var(--success)' }}>{a.checkIn || '--:--'}</td>
                  <td style={{ color: 'var(--text3)' }}>{a.checkOut || '--:--'}</td>
                  <td>
                    <Badge type={a.checkOut ? 'info' : 'success'}>
                      {a.checkOut ? 'COMPLETED' : 'ACTIVE'}
                    </Badge>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {!a.checkOut && (
                        <button className="btn-ghost" style={{ padding: '4px 8px', fontSize: '10px' }} onClick={() => handleClockOut(a.id)}>Clock Out</button>
                      )}
                      <button className="btn-ghost" style={{ padding: '4px 8px', fontSize: '10px', color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => deleteAttendance(a.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Manual Clock In Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <GlassCard style={{ width: '100%', maxWidth: '400px' }}>
            <h3 style={{ marginBottom: '24px', color: 'var(--gold)' }}>Manual Clock-In</h3>
            <form onSubmit={handleClockIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="form-label">Select Staff Member</label>
                <select className="form-input" value={selectedStaff} onChange={e => setSelectedStaff(e.target.value)} required>
                  {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="button" className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Clock In Now</button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default AttendanceTracking;
