import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { GlassCard, Badge } from '../../components/ui';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', role: 'CUSTOMER', password: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.put(`/admin/users/${editingUser.id}`, formData);
      } else {
        await api.post('/admin/users', formData);
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save user');
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${id}`);
        fetchUsers();
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      const [first, ...rest] = user.name.split(' ');
      setFormData({ firstName: first, lastName: rest.join(' '), email: user.email, phone: user.phone || '', role: user.role, password: '' });
    } else {
      setEditingUser(null);
      setFormData({ firstName: '', lastName: '', email: '', phone: '', role: 'CUSTOMER', password: '' });
    }
    setShowModal(true);
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div>
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>User Management</h2>
          <p>Manage customers, staff, and system access</p>
        </div>
        <button className="btn-primary" onClick={() => openModal()}>+ Add User</button>
      </div>

      <GlassCard style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: '500', color: 'var(--text)' }}>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <Badge type={u.role === 'ADMIN' ? 'danger' : u.role === 'STAFF' ? 'info' : u.role === 'MANAGER' ? 'warning' : 'success'}>
                      {u.role}
                    </Badge>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-ghost" style={{ padding: '4px 8px', fontSize: '10px' }} onClick={() => openModal(u)}>Edit</button>
                      <button className="btn-ghost" style={{ padding: '4px 8px', fontSize: '10px', color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => deleteUser(u.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Basic Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <GlassCard style={{ width: '100%', maxWidth: '500px' }}>
            <h3 style={{ marginBottom: '24px', color: 'var(--gold)' }}>{editingUser ? 'Edit User' : 'Add New User'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <input className="form-input" placeholder="First Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
                <input className="form-input" placeholder="Last Name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
              </div>
              <input type="email" className="form-input" placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required disabled={!!editingUser} />
              <input type="text" className="form-input" placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              {!editingUser && (
                <input type="password" className="form-input" placeholder="Temporary Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
              )}
              <select className="form-input" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                <option value="CUSTOMER">Customer</option>
                <option value="STAFF">Staff</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="button" className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save User</button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
