import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { GlassCard, Badge } from '../../components/ui';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const [formData, setFormData] = useState({
    productName: '', category: 'Hair Products', currentStock: 0, reorderLevel: 5, unitCost: 0
  });
  const [newStock, setNewStock] = useState(0);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await api.get('/manager/inventory');
      setInventory(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/manager/inventory', formData);
      setShowAddModal(false);
      fetchInventory();
    } catch (err) {
      alert('Failed to add inventory item');
    }
  };

  const handleStockUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/manager/inventory/${selectedItem.id}`, { currentStock: newStock });
      setShowStockModal(false);
      fetchInventory();
    } catch (err) {
      alert('Failed to update stock');
    }
  };

  const deleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) {
      try {
        await api.delete(`/manager/inventory/${id}`);
        fetchInventory();
      } catch (err) {
        alert('Failed to delete item');
      }
    }
  };

  const openAddModal = () => {
    setFormData({ productName: '', category: 'Hair Products', currentStock: 0, reorderLevel: 5, unitCost: 0 });
    setShowAddModal(true);
  };

  const openStockModal = (item) => {
    setSelectedItem(item);
    setNewStock(item.currentStock);
    setShowStockModal(true);
  };

  if (loading) return <div>Loading inventory...</div>;

  return (
    <div>
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Inventory Management</h2>
          <p>Track salon supplies and products</p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>+ Add Item</button>
      </div>

      <GlassCard style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Stock Level</th>
                <th>Unit Cost</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '24px' }}>No inventory items found.</td></tr>
              ) : inventory.map(item => (
                <tr key={item.id}>
                  <td style={{ fontWeight: '500' }}>{item.productName}</td>
                  <td>{item.category}</td>
                  <td>{item.currentStock} / {item.reorderLevel}</td>
                  <td>₱{item.unitCost}</td>
                  <td>
                    <Badge type={item.status === 'OK' ? 'success' : item.status === 'LOW_STOCK' ? 'warning' : 'danger'}>
                      {item.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-ghost" style={{ padding: '4px 8px', fontSize: '10px' }} onClick={() => openStockModal(item)}>Update Stock</button>
                      <button className="btn-ghost" style={{ padding: '4px 8px', fontSize: '10px', color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => deleteItem(item.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Add Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <GlassCard style={{ width: '100%', maxWidth: '500px' }}>
            <h3 style={{ marginBottom: '24px', color: 'var(--gold)' }}>Add New Item</h3>
            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input className="form-input" placeholder="Product Name" value={formData.productName} onChange={e => setFormData({...formData, productName: e.target.value})} required />
              <select className="form-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="Hair Products">Hair Products</option>
                <option value="Nail Supplies">Nail Supplies</option>
                <option value="Skincare">Skincare</option>
                <option value="Equipment">Equipment</option>
              </select>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label">Initial Stock</label>
                  <input type="number" className="form-input" value={formData.currentStock} onChange={e => setFormData({...formData, currentStock: parseInt(e.target.value)})} required />
                </div>
                <div>
                  <label className="form-label">Reorder Level</label>
                  <input type="number" className="form-input" value={formData.reorderLevel} onChange={e => setFormData({...formData, reorderLevel: parseInt(e.target.value)})} required />
                </div>
                <div>
                  <label className="form-label">Unit Cost (₱)</label>
                  <input type="number" className="form-input" value={formData.unitCost} onChange={e => setFormData({...formData, unitCost: parseFloat(e.target.value)})} required />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="button" className="btn-ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Add Item</button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* Stock Update Modal */}
      {showStockModal && selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <GlassCard style={{ width: '100%', maxWidth: '400px' }}>
            <h3 style={{ marginBottom: '16px', color: 'var(--gold)' }}>Update Stock: {selectedItem.productName}</h3>
            <form onSubmit={handleStockUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="form-label">New Stock Level</label>
                <input type="number" className="form-input" value={newStock} onChange={e => setNewStock(parseInt(e.target.value))} required />
              </div>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="button" className="btn-ghost" onClick={() => setShowStockModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Update Stock</button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
