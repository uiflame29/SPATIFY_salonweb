import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../../components/ui';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    emailNotifications: true,
    smsNotifications: false
  });

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP Verification States
  const [step, setStep] = useState(1);
  const [otpCode, setOtpCode] = useState('');
  const [devOtp, setDevOtp] = useState(''); // To store OTP for dev visibility

  // Password Validation States
  const [validation, setValidation] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    symbol: false,
    match: false
  });

  const { register, verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    };
    setFormData(newFormData);

    if (name === 'password' || name === 'confirmPassword') {
      const pass = name === 'password' ? value : newFormData.password;
      const confirm = name === 'confirmPassword' ? value : newFormData.confirmPassword;

      setValidation({
        length: pass.length >= 8,
        upper: /[A-Z]/.test(pass),
        lower: /[a-z]/.test(pass),
        number: /\d/.test(pass),
        symbol: /[@$!%*?&]/.test(pass),
        match: pass.length > 0 && pass === confirm
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Password Validation
    const isAllValid = Object.values(validation).every(v => v);

    if (!isAllValid) {
      setError('Please fulfill all password requirements.');
      return;
    }

    setLoading(true);

    try {
      const result = await register(formData);
      setStep(2); // Move to OTP verification step

      if (result.otpCode) {
        setDevOtp(result.otpCode);
      }

      setSuccessMsg('Registration successful! Please check your email for the OTP.');
    } catch (err) {
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await verifyOtp(formData.email, otpCode);
      navigate('/customer');
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      await resendOtp(formData.email);
      setSuccessMsg('A new OTP has been sent to your email.');
    } catch (err) {
      setError(err.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 72px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <GlassCard style={{ maxWidth: '500px', width: '100%', padding: '40px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 className="serif" style={{ marginBottom: '8px' }}>Create an Account</h2>
          <p style={{ fontSize: '13px', color: 'var(--text3)' }}>Join Spatify and book your next appointment</p>
        </div>

        {error && (
          <div className="alert-box error" style={{ marginBottom: '24px' }}>
            {error}
          </div>
        )}

        {successMsg && (
          <div className="alert-box success" style={{ marginBottom: '24px' }}>
            {successMsg}
          </div>
        )}

        {step === 1 ? (
          <>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    className="form-input"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    className="form-input"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-input"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-input"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Password Checklist */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px'
              }}>
                <ValidationItem met={validation.length} text="8+ Characters" />
                <ValidationItem met={validation.upper} text="Uppercase Letter" />
                <ValidationItem met={validation.lower} text="Lowercase Letter" />
                <ValidationItem met={validation.number} text="Number" />
                <ValidationItem met={validation.symbol} text="Symbol (!@#$)" />
                <ValidationItem met={validation.match} text="Same Password" />
              </div>

              <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text2)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={formData.emailNotifications}
                    onChange={handleChange}
                  />
                  Receive email notifications for bookings
                </label>
              </div>

              <button
                type="submit"
                className="btn-block"
                disabled={loading}
                style={{ marginTop: '16px' }}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: 'var(--text3)' }}>
              Already have an account? <Link to="/login" style={{ color: 'var(--gold)', fontWeight: '600' }}>Log in here</Link>
            </div>
          </>
        ) : (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
            {devOtp && (
              <div className="alert-box" style={{ marginBottom: '16px', border: '1px dashed var(--gold)', background: 'rgba(212, 175, 55, 0.05)' }}>
                <p style={{ fontSize: '11px', color: 'var(--gold)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Development Hint</p>
                <p style={{ fontSize: '14px', fontWeight: '600' }}>Your OTP is: <span style={{ color: 'var(--gold)', letterSpacing: '2px' }}>{devOtp}</span></p>
              </div>
            )}

            <div>
              <label className="form-label">Enter 6-Digit Verification Code</label>
              <input
                type="text"
                className="form-input"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                maxLength="6"
                placeholder="000000"
                style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '8px', padding: '16px' }}
                required
              />
            </div>
            <button
              type="submit"
              className="btn-block"
              disabled={loading || otpCode.length !== 6}
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>

            <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text3)' }}>
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={handleResendOtp}
                className="btn-ghost"
                style={{ padding: 0, fontSize: '12px', display: 'inline', color: 'var(--gold)' }}
                disabled={loading}
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}
      </GlassCard>
    </div>
  );
};

const ValidationItem = ({ met, text }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '11px',
    color: met ? 'var(--gold)' : 'var(--text3)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: met ? 1 : 0.6,
    transform: met ? 'translateX(4px)' : 'none'
  }}>
    <div style={{
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      background: met ? 'var(--gold)' : 'rgba(255, 255, 255, 0.2)',
      boxShadow: met ? '0 0 10px var(--gold)' : 'none',
      transition: 'all 0.3s ease'
    }} />
    {text}
  </div>
);

export default RegisterPage;
