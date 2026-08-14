import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { GlassCard, Badge } from '../../components/ui';

const StaffAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/staff/audit-logs');
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading my activity logs...</div>;

  return (
    <div>
      <div className="dashboard-header">
        <h2>My Activity Logs</h2>
        <p>Review your recent system actions</p>
      </div>

      <GlassCard style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr><td colSpan="3" style={{ textAlign: 'center', padding: '24px' }}>No recent activity found.</td></tr>
              ) : logs.map(log => (
                <tr key={log.id}>
                  <td style={{ fontSize: '12px', color: 'var(--text3)' }}>{new Date(log.createdAt).toLocaleString()}</td>
                  <td style={{ color: 'var(--text2)' }}>{log.action}</td>
                  <td><Badge type={log.status === 'success' ? 'success' : 'danger'}>{log.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default StaffAuditLogs;
