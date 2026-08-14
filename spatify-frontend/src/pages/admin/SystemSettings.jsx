import React, { useState } from 'react';
import { GlassCard } from '../../components/ui';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    salonName: 'Spatify Luxury Salon',
    contactEmail: 'contact@spatify.ph',
    contactPhone: '+63 917 123 4567',
    taxRate: 12,
    environmentalFee: 15,
    currency: 'PHP (₱)',
  });

  const handleSave = (e) => {
    e.preventDefault();
    alert('Settings saved successfully!');
  };

  return (
    <div>
      <div className="dashboard-header">
        <h2>System Settings</h2>
        <p>Configure global salon parameters</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        <GlassCard>
          <h3 style={{ color: 'var(--gold)', marginBottom: '24px' }}>General Configuration</h3>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="form-label">Salon Name</label>
                <input className="form-input" value={settings.salonName} onChange={e => setSettings({...settings, salonName: e.target.value})} />
              </div>
              <div>
                <label className="form-label">Contact Email</label>
                <input type="email" className="form-input" value={settings.contactEmail} onChange={e => setSettings({...settings, contactEmail: e.target.value})} />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="form-label">Contact Phone</label>
                <input className="form-input" value={settings.contactPhone} onChange={e => setSettings({...settings, contactPhone: e.target.value})} />
              </div>
              <div>
                <label className="form-label">Currency Display</label>
                <input className="form-input" value={settings.currency} disabled />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="form-label">Tax Rate (%)</label>
                <input type="number" className="form-input" value={settings.taxRate} onChange={e => setSettings({...settings, taxRate: parseFloat(e.target.value)})} />
              </div>
              <div>
                <label className="form-label">Default Environmental Fee (₱)</label>
                <input type="number" className="form-input" value={settings.environmentalFee} onChange={e => setSettings({...settings, environmentalFee: parseFloat(e.target.value)})} />
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button type="submit" className="btn-primary">Save Changes</button>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};

export default SystemSettings;
