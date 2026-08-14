import React from 'react';
import { GlassCard } from '../../components/ui';

const SecurityCenter = () => {
  return (
    <div>
      <div className="dashboard-header">
        <h2>Security Center</h2>
        <p>Monitor system security and access controls</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        <GlassCard>
          <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Active Sessions</div>
          <div style={{ fontSize: '32px', color: 'var(--gold)', fontWeight: 'bold' }}>14</div>
        </GlassCard>
        <GlassCard>
          <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Failed Login Attempts (24h)</div>
          <div style={{ fontSize: '32px', color: 'var(--danger)', fontWeight: 'bold' }}>2</div>
        </GlassCard>
        <GlassCard>
          <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Password Policy</div>
          <div style={{ fontSize: '32px', color: 'var(--success)', fontWeight: 'bold' }}>Strict</div>
        </GlassCard>
      </div>

      <GlassCard>
        <h3 style={{ color: 'var(--gold)', marginBottom: '16px' }}>Security Settings</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
            <div>
              <div style={{ fontWeight: '500' }}>Two-Factor Authentication (2FA)</div>
              <div style={{ fontSize: '12px', color: 'var(--text3)' }}>Require 2FA for all staff and admin accounts</div>
            </div>
            <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '12px' }}>Enable</button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
            <div>
              <div style={{ fontWeight: '500' }}>Session Timeout</div>
              <div style={{ fontSize: '12px', color: 'var(--text3)' }}>Automatically log out inactive users after 30 minutes</div>
            </div>
            <button className="btn-ghost" style={{ padding: '8px 16px', fontSize: '12px' }}>Edit</button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: '500' }}>Force Password Reset</div>
              <div style={{ fontSize: '12px', color: 'var(--text3)' }}>Require all users to reset passwords every 90 days</div>
            </div>
            <button className="btn-ghost" style={{ padding: '8px 16px', fontSize: '12px' }}>Edit</button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default SecurityCenter;
