import React from 'react';

export const GlassCard = ({ children, className = '', ...props }) => (
  <div className={`glass-card ${className}`} {...props}>
    {children}
  </div>
);

export const StatCard = ({ label, value, icon, change, isPositive }) => (
  <div className="stat-card">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
      </div>
      <div style={{ fontSize: '24px' }}>{icon}</div>
    </div>
    {change && (
      <div className={`stat-change ${isPositive ? 'positive' : 'negative'}`}>
        {isPositive ? '↑' : '↓'} {change} from last month
      </div>
    )}
  </div>
);

export const Badge = ({ children, type = 'info' }) => (
  <span className={`badge badge-${type}`}>
    {children}
  </span>
);
