import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { GlassCard } from '../../components/ui';

const StaffEarnings = () => {
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const res = await api.get('/staff/earnings');
      setEarnings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading earnings...</div>;

  return (
    <div>
      <div className="dashboard-header">
        <h2>My Earnings</h2>
        <p>Track your commissions and payroll history</p>
      </div>

      <GlassCard style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Cutoff Period</th>
                <th>Hours Worked</th>
                <th>Gross Pay</th>
                <th>Deductions</th>
                <th>Net Pay</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {earnings.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '24px' }}>No payroll records found.</td></tr>
              ) : earnings.map(e => (
                <tr key={e.id}>
                  <td>{e.cutoffStart} to {e.cutoffEnd}</td>
                  <td>{e.hoursWorked}</td>
                  <td>₱{e.grossPay}</td>
                  <td style={{ color: 'var(--danger)' }}>-₱{e.deductions}</td>
                  <td style={{ color: 'var(--success)', fontWeight: 'bold' }}>₱{e.netPay}</td>
                  <td>{e.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default StaffEarnings;
