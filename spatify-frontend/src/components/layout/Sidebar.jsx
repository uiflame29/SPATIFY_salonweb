import React from 'react';
import { NavLink } from 'react-router-dom';

const SidebarItem = ({ to, icon, label, end = false }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
  >
    <span style={{ width: '20px', textAlign: 'center' }}>{icon}</span>
    {label}
  </NavLink>
);

export const AdminSidebar = () => (
  <div className="sidebar">
    <div style={{ padding: '0 24px 20px', fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600' }}>
      Admin Portal
    </div>
    <SidebarItem to="/admin" end icon="📊" label="Dashboard Overview" />
    <SidebarItem to="/admin/users" icon="👥" label="User Management" />
    <SidebarItem to="/admin/services" icon="💆‍♀️" label="Services Catalog" />
    <SidebarItem to="/admin/reviews" icon="⭐" label="Reviews & Feedback" />
    <div style={{ padding: '24px 24px 8px', fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600' }}>
      System & Security
    </div>
    <SidebarItem to="/admin/security" icon="🔐" label="Security Center" />
    <SidebarItem to="/admin/audit" icon="📋" label="Audit Logs" />
    <SidebarItem to="/admin/settings" icon="⚙️" label="System Settings" />
  </div>
);
