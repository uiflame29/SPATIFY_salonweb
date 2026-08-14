import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../../components/ui';
import api from '../../api/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Backend should have an endpoint for this, for now we mock it
      // or we can just show a success message as if it sent
      await api.post('/auth/forgot-password', { email });
      setMessage('If an account exists with this email, you will receive password reset instructions shortly.');
    } catch (err) {
      // Even on error, we might want to show the same message for security
      // but for dev/demo we show the error
      if (err.response?.status === 404) {
          setError('Email not found. Please check your spelling or register a new account.');
      } else {
          setMessage('If an account exists with this email, you will receive password reset instructions shortly.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 72px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <GlassCard style={{ maxWidth: '440px', width: '100%', padding: '40px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 className="serif" style={{ marginBottom: '8px' }}>Reset Password</h2>
          <p style={{ fontSize: '13px', color: 'var(--text3)' }}>Enter your email to receive reset instructions</p>
        </div>

        {message && (
          <div className="alert-box success" style={{ marginBottom: '24px' }}>
            {message}
          </div>
        )}

        {error && (
          <div className="alert-box error" style={{ marginBottom: '24px' }}>
            {error}
          </div>
        )}

        {!message && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn-block" 
              disabled={loading || !email}
              style={{ marginTop: '24px' }}
            >
              {loading ? 'Sending Instructions...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: 'var(--text3)' }}>
          Remember your password? <Link to="/login" style={{ color: 'var(--gold)', fontWeight: '600' }}>Back to login</Link>
        </div>
      </GlassCard>
    </div>
  );
};

export default ForgotPassword;
