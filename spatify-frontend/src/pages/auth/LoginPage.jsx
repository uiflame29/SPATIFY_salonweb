import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../../components/ui';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);

      // Redirect based on role
      switch (user.role) {
        case 'ADMIN': navigate('/admin'); break;
        case 'MANAGER': navigate('/manager'); break;
        case 'STAFF': navigate('/staff'); break;
        default: navigate('/customer'); break;
      }
    } catch (err) {
      setError(err.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const [loginType, setLoginType] = useState('CUSTOMER');

  return (
    <div style={{ minHeight: 'calc(100vh - 72px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <GlassCard style={{ maxWidth: '440px', width: '100%', padding: '40px 32px' }}>

        {/* Tab Selection */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', background: 'rgba(255,255,255,0.02)', padding: '4px', borderRadius: '8px' }}>
          <button
            type="button"
            className="btn-ghost"
            style={{
              flex: 1,
              background: loginType === 'CUSTOMER' ? 'rgba(255,255,255,0.05)' : 'transparent',
              color: loginType === 'CUSTOMER' ? 'var(--gold)' : 'var(--text3)'
            }}
            onClick={() => setLoginType('CUSTOMER')}
          >
            Customer Login
          </button>
          <button
            type="button"
            className="btn-ghost"
            style={{
              flex: 1,
              background: loginType === 'STAFF' ? 'rgba(255,255,255,0.05)' : 'transparent',
              color: loginType === 'STAFF' ? 'var(--info)' : 'var(--text3)'
            }}
            onClick={() => setLoginType('STAFF')}
          >
            Employee Portal
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 className="serif" style={{ marginBottom: '8px' }}>
            {loginType === 'CUSTOMER' ? 'Welcome Back' : 'Employee Login'}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text3)' }}>
            {loginType === 'CUSTOMER' ? 'Log in to access your Spatify account' : 'Access Admin, Manager, or Staff dashboard'}
          </p>
        </div>

        {error && (
          <div className="alert-box error" style={{ marginBottom: '24px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="text"
              className="form-input"
              placeholder={loginType === 'CUSTOMER' ? "you@example.com" : "employee@spatify.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: '11px', color: 'var(--info)' }}>Forgot Password?</Link>
            </div>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-block"
            disabled={loading || !email || !password}
            style={{ marginTop: '24px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {loginType === 'CUSTOMER' && (
          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: 'var(--text3)' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--gold)', fontWeight: '600' }}>Create one here</Link>
          </div>
        )}

      </GlassCard>
    </div>
  );
};

export default LoginPage;
