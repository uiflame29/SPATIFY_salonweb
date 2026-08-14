import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'ADMIN': return '/admin';
      case 'MANAGER': return '/manager';
      case 'STAFF': return '/staff';
      default: return '/customer';
    }
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 48px',
      background: 'rgba(10,10,26,0.9)',
      borderBottom: '1px solid var(--glass-border)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
        <Link to="/" className="serif" style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--gold)', letterSpacing: '2px' }}>
          SPATIFY
        </Link>
        <div style={{ display: 'flex', gap: '24px' }}>
          <Link to="/" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Home</Link>
          <Link to="/services" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Services</Link>
          <Link to="/book" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Booking</Link>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {!user ? (
          <>
            <Link to="/login" className="btn-ghost">Log In</Link>
            <Link to="/book" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '11px' }}>Book Now</Link>
          </>
        ) : (
          <>
            <span style={{ fontSize: '12px', color: 'var(--text2)' }}>Welcome, <span style={{ color: 'var(--gold)' }}>{user.firstName}</span></span>
            <Link to={getDashboardLink()} className="btn-ghost">Dashboard</Link>
            <button onClick={logout} className="btn-ghost" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
