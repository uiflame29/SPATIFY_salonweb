import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { GlassCard, Badge } from '../../components/ui';

const AuditLogsView = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/admin/audit-logs');
        setLogs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = filter === 'ALL' 
    ? logs 
    : logs.filter(log => log.userRole === filter);

  const roles = [
    { label: 'All Roles', value: 'ALL' },
    { label: 'Admin', value: 'ADMIN' },
    { label: 'Manager', value: 'MANAGER' },
    { label: 'Staff', value: 'STAFF' },
    { label: 'Customer', value: 'CUSTOMER' }
  ];

  if (loading) return <div>Loading logs...</div>;

  return (
    <div>
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
        <div>
          <h2>System Audit Logs</h2>
          <p>Track security events and administrative actions</p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          {roles.map(role => (
            <button
              key={role.value}
              onClick={() => setFilter(role.value)}
              className={filter === role.value ? 'btn-gold' : 'btn-ghost'}
              style={{ padding: '6px 12px', fontSize: '11px' }}
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>

      <GlassCard style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User / Role</th>
                <th>Action</th>
                <th>IP Address</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(log => (
                <tr key={log.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>{new Date(log.createdAt).toLocaleString()}</td>
                  <td>
                    <div style={{ color: 'var(--text)' }}>{log.userEmail}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text3)' }}>{log.userRole}</div>
                  </td>
                  <td style={{ color: 'var(--text)' }}>{log.action}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '11px' }}>{log.ipAddress}</td>
                  <td>
                    <Badge type={log.status === 'success' ? 'success' : log.status === 'failed' ? 'danger' : 'warning'}>
                      {log.status}
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

export default AuditLogsView;
