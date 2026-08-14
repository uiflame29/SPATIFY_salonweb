import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { GlassCard, Badge } from '../../components/ui';

const ManagerAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/manager/audit-logs');
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading operational audit logs...</div>;

  return (
    <div>
      <div className="dashboard-header">
        <h2>Operational Audit Logs</h2>
        <p>Track system activities for Staff and Customers</p>
      </div>

      <GlassCard style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User / Email</th>
                <th>Role</th>
                <th>Action</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '24px' }}>No audit logs found.</td></tr>
              ) : logs.map(log => (
                <tr key={log.id}>
                  <td style={{ fontSize: '12px', color: 'var(--text3)' }}>{new Date(log.createdAt).toLocaleString()}</td>
                  <td>
                    <div style={{ fontWeight: '500' }}>{log.userName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{log.userEmail}</div>
                  </td>
                  <td><Badge type="info">{log.userRole}</Badge></td>
                  <td>{log.action}</td>
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

export default ManagerAuditLogs;
