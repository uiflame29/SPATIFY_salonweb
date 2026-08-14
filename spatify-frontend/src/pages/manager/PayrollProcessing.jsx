import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { GlassCard, Badge } from '../../components/ui';

const PayrollProcessing = () => {
  const [payroll, setPayroll] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    staffId: '', cutoffStart: '', cutoffEnd: '', hoursWorked: 0, hourlyRate: 0, grossPay: 0, deductions: 0, netPay: 0, status: 'PENDING'
  });

  useEffect(() => {
    fetchPayroll();
    fetchStaff();
  }, []);

  const fetchPayroll = async () => {
    try {
      const res = await api.get('/manager/payroll');
      setPayroll(res.data);
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
    } catch (err) {
      console.error(err);
    }
  };

  // Auto-calculate pay when hours or rate changes
  useEffect(() => {
    const gross = formData.hoursWorked * formData.hourlyRate;
    const net = gross - formData.deductions;
    setFormData(prev => ({ ...prev, grossPay: gross, netPay: net }));
  }, [formData.hoursWorked, formData.hourlyRate, formData.deductions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/manager/payroll', formData);
      setShowModal(false);
      fetchPayroll();
    } catch (err) {
      alert('Failed to save payroll record');
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/manager/payroll/${id}`, { status: newStatus });
      fetchPayroll();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const deletePayroll = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await api.delete(`/manager/payroll/${id}`);
        fetchPayroll();
      } catch (err) {
        alert('Failed to delete record');
      }
    }
  };

  const openModal = () => {
    setFormData({
      staffId: staffList.length > 0 ? staffList[0].id : '', 
      cutoffStart: new Date().toISOString().split('T')[0], 
      cutoffEnd: new Date().toISOString().split('T')[0], 
      hoursWorked: 80, hourlyRate: 150, grossPay: 12000, deductions: 500, netPay: 11500, status: 'PENDING'
    });
    setShowModal(true);
  };

  if (loading) return <div>Loading payroll...</div>;

  return (
    <div>
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Payroll Processing</h2>
          <p>Manage staff earnings and disbursements</p>
        </div>
        <button className="btn-primary" onClick={openModal}>
          + Create Payroll Record
        </button>
      </div>

      <GlassCard style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Staff Name</th>
                <th>Cutoff Period</th>
                <th>Hours</th>
                <th>Gross Pay</th>
                <th>Net Pay</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payroll.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '24px' }}>No payroll records found.</td></tr>
              ) : payroll.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: '500' }}>{p.staff?.firstName || 'Unknown'} {p.staff?.lastName || ''}</td>
                  <td>{p.cutoffStart} to {p.cutoffEnd}</td>
                  <td>{p.hoursWorked}</td>
                  <td>₱{p.grossPay}</td>
                  <td style={{ color: 'var(--success)', fontWeight: 'bold' }}>₱{p.netPay}</td>
                  <td>
                    <Badge type={p.status === 'PAID' ? 'success' : p.status === 'PROCESSED' ? 'info' : 'warning'}>
                      {p.status}
                    </Badge>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {p.status === 'PENDING' && (
                        <button className="btn-ghost" style={{ padding: '4px 8px', fontSize: '10px' }} onClick={() => updateStatus(p.id, 'PROCESSED')}>Process</button>
                      )}
                      {p.status === 'PROCESSED' && (
                        <button className="btn-ghost" style={{ padding: '4px 8px', fontSize: '10px', color: 'var(--success)', borderColor: 'var(--success)' }} onClick={() => updateStatus(p.id, 'PAID')}>Mark Paid</button>
                      )}
                      <button className="btn-ghost" style={{ padding: '4px 8px', fontSize: '10px', color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => deletePayroll(p.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Add Payroll Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <GlassCard style={{ width: '100%', maxWidth: '600px' }}>
            <h3 style={{ marginBottom: '24px', color: 'var(--gold)' }}>Create Payroll Record</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="form-label">Select Staff</label>
                <select className="form-input" value={formData.staffId} onChange={e => setFormData({...formData, staffId: e.target.value})} required>
                  {staffList.map(s => <option key={s.id} value={s.id}>{s.name} ({s.email})</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label">Cutoff Start</label>
                  <input type="date" className="form-input" value={formData.cutoffStart} onChange={e => setFormData({...formData, cutoffStart: e.target.value})} required />
                </div>
                <div>
                  <label className="form-label">Cutoff End</label>
                  <input type="date" className="form-input" value={formData.cutoffEnd} onChange={e => setFormData({...formData, cutoffEnd: e.target.value})} required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label">Hours Worked</label>
                  <input type="number" className="form-input" value={formData.hoursWorked} onChange={e => setFormData({...formData, hoursWorked: parseFloat(e.target.value)})} required />
                </div>
                <div>
                  <label className="form-label">Hourly Rate (₱)</label>
                  <input type="number" className="form-input" value={formData.hourlyRate} onChange={e => setFormData({...formData, hourlyRate: parseFloat(e.target.value)})} required />
                </div>
                <div>
                  <label className="form-label">Deductions (₱)</label>
                  <input type="number" className="form-input" value={formData.deductions} onChange={e => setFormData({...formData, deductions: parseFloat(e.target.value)})} required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'rgba(201,168,76,0.1)', padding: '16px', borderRadius: '8px', marginTop: '8px' }}>
                <div>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text3)' }}>Gross Pay</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold' }}>₱{formData.grossPay}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--success)' }}>Net Pay</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--success)' }}>₱{formData.netPay}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="button" className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Payroll</button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default PayrollProcessing;
