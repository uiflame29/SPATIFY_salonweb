import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { GlassCard, Badge } from '../../components/ui';

const ServicesManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', category: 'Hair Treatment', durationMinutes: 60, price: 0, active: true
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get('/public/services');
      setServices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await api.put(`/admin/services/${editingService.id}`, formData);
      } else {
        await api.post('/admin/services', formData);
      }
      setShowModal(false);
      fetchServices();
    } catch (err) {
      alert('Failed to save service');
    }
  };

  const deleteService = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await api.delete(`/admin/services/${id}`);
        fetchServices();
      } catch (err) {
        alert('Failed to delete service');
      }
    }
  };

  const openModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData(service);
    } else {
      setEditingService(null);
      setFormData({ name: '', description: '', category: 'Hair Treatment', durationMinutes: 60, price: 0, active: true });
    }
    setShowModal(true);
  };

  if (loading) return <div>Loading services...</div>;

  return (
    <div>
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Services Catalog</h2>
          <p>Manage salon offerings and pricing</p>
        </div>
        <button className="btn-primary" onClick={() => openModal()}>+ Add Service</button>
      </div>

      <GlassCard style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Category</th>
                <th>Duration</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: '500', color: 'var(--gold)' }}>{s.name}</td>
                  <td>{s.category}</td>
                  <td>{s.durationMinutes} mins</td>
                  <td>₱{s.price}</td>
                  <td>
                    <Badge type={s.active ? 'success' : 'danger'}>
                      {s.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-ghost" style={{ padding: '4px 8px', fontSize: '10px' }} onClick={() => openModal(s)}>Edit</button>
                      <button className="btn-ghost" style={{ padding: '4px 8px', fontSize: '10px', color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => deleteService(s.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <GlassCard style={{ width: '100%', maxWidth: '500px' }}>
            <h3 style={{ marginBottom: '24px', color: 'var(--gold)' }}>{editingService ? 'Edit Service' : 'Add New Service'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input className="form-input" placeholder="Service Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              <textarea className="form-input" placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required rows="3" />
              <select className="form-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="Hair Treatment">Hair Treatment</option>
                <option value="Massage">Massage</option>
                <option value="Nail Care">Nail Care</option>
                <option value="Facial">Facial</option>
              </select>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label">Duration (mins)</label>
                  <input type="number" className="form-input" value={formData.durationMinutes} onChange={e => setFormData({...formData, durationMinutes: parseInt(e.target.value)})} required />
                </div>
                <div>
                  <label className="form-label">Price (₱)</label>
                  <input type="number" className="form-input" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} required />
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} />
                Active (visible to customers)
              </label>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="button" className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Service</button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default ServicesManagement;
