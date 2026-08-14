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

export const ManagerSidebar = () => (
  <div className="sidebar">
    <div style={{ padding: '0 24px 20px', fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600' }}>
      Manager Portal
    </div>
    <SidebarItem to="/manager" end icon="📊" label="Operations Dashboard" />
    <SidebarItem to="/manager/appointments" icon="📅" label="Appointments" />
    <SidebarItem to="/manager/staff" icon="👥" label="Staff Activity" />
    
    <div style={{ padding: '24px 24px 8px', fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600' }}>
      Administration
    </div>
    <SidebarItem to="/manager/inventory" icon="📦" label="Inventory" />
    <SidebarItem to="/manager/payroll" icon="💰" label="Payroll Processing" />
    <SidebarItem to="/manager/attendance" icon="⏱️" label="Attendance" />
    <SidebarItem to="/manager/audit" icon="🛡️" label="Audit Logs" />
  </div>
);

export const StaffSidebar = () => (
  <div className="sidebar">
    <div style={{ padding: '0 24px 20px', fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600' }}>
      Staff Portal
    </div>
    <SidebarItem to="/staff" end icon="📊" label="My Dashboard" />
    <SidebarItem to="/staff/appointments" icon="📅" label="My Appointments" />
    <SidebarItem to="/staff/schedule" icon="⏱️" label="My Schedule" />
    <SidebarItem to="/staff/earnings" icon="💰" label="My Earnings" />
    <SidebarItem to="/staff/audit" icon="🛡️" label="Audit Logs" />
  </div>
);
