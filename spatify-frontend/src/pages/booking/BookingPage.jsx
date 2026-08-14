import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../../components/ui';

const BookingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [services, setServices] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [selectedService, setSelectedService] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Terms and Conditions State
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const TIME_SLOTS = [
    '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', 
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, staffRes] = await Promise.all([
          api.get('/public/services'),
          api.get('/public/staff')
        ]);
        setServices(servicesRes.data);
        setStaffList(staffRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        // Fallback for demo
        try {
            const sRes = await api.get('/public/services');
            setServices(sRes.data);
            setStaffList([{ id: 5, name: 'Maria Santos' }, { id: 6, name: 'John Dela Cruz' }]);
        } catch(e) {}
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedService || !bookingDate || !timeSlot) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!termsAccepted) {
      setError("You must accept the Terms and Conditions to proceed.");
      return;
    }
    
    // Redirect guests to login before final confirmation
    if (!user) {
      navigate('/login');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      await api.post('/bookings', {
        serviceId: selectedService.id,
        staffId: selectedStaff ? selectedStaff.id : null,
        bookingDate,
        timeSlot,
        paymentMethod
      });
      navigate('/customer', { state: { message: 'Booking confirmed successfully!' } });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create booking.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--gold)' }}>Loading booking system...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 className="serif">Book an Appointment</h2>
        <p style={{ color: 'var(--text3)' }}>Tailor your luxury experience at Spatify.</p>
      </div>

      {error && <div className="alert-box error" style={{ marginBottom: '24px' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: window.innerWidth > 992 ? '1fr 1fr' : '1fr', 
          gap: '32px',
          alignItems: 'start'
        }}>
          {/* LEFT COLUMN: SERVICE SELECTION */}
          <div>
            <GlassCard style={{ height: '100%' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '24px', color: 'var(--gold)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
                1. Select Service
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {services.map(service => (
                  <div 
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    style={{ 
                      padding: '16px', 
                      border: `1.5px solid ${selectedService?.id === service.id ? 'var(--gold)' : 'rgba(255,255,255,0.05)'}`,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      background: selectedService?.id === service.id ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.02)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: selectedService?.id === service.id ? 'scale(1.02)' : 'scale(1)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: '600', color: selectedService?.id === service.id ? 'var(--gold)' : 'var(--text)' }}>{service.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '4px' }}>{service.durationMinutes} mins • {service.category}</div>
                      </div>
                      <div style={{ fontWeight: '700', color: 'var(--gold)' }}>₱{service.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* RIGHT COLUMN: DATE, TIME, STAFF, PAYMENT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* DATE & TIME */}
            <GlassCard className="fade-in">
              <h3 style={{ fontSize: '18px', marginBottom: '24px', color: 'var(--gold)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
                2. Appointment Schedule
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '12px', opacity: 0.7 }}>Select Date</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '12px', opacity: 0.7 }}>Time Slot</label>
                  <select 
                    className="form-input"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    required
                  >
                    <option value="">Choose time</option>
                    {TIME_SLOTS.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>
            </GlassCard>

            {/* STAFF SELECTION */}
            <GlassCard className="fade-in" style={{ opacity: selectedService ? 1 : 0.5 }}>
              <h3 style={{ fontSize: '18px', marginBottom: '20px', color: 'var(--gold)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
                3. Choose Specialist
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
                <div 
                  onClick={() => setSelectedStaff(null)}
                  style={{ 
                    padding: '12px', 
                    border: `1.5px solid ${selectedStaff === null ? 'var(--gold)' : 'rgba(255,255,255,0.05)'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    background: selectedStaff === null ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.02)',
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: '500' }}>Any Available</div>
                </div>
                {staffList.map(staff => (
                  <div 
                    key={staff.id}
                    onClick={() => setSelectedStaff(staff)}
                    style={{ 
                      padding: '12px', 
                      border: `1.5px solid ${selectedStaff?.id === staff.id ? 'var(--gold)' : 'rgba(255,255,255,0.05)'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      background: selectedStaff?.id === staff.id ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: '500' }}>{staff.name}</div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* PAYMENT & SUMMARY */}
            <GlassCard className="fade-in" style={{ opacity: (selectedService && bookingDate && timeSlot) ? 1 : 0.5 }}>
              <h3 style={{ fontSize: '18px', marginBottom: '20px', color: 'var(--gold)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
                4. Payment & Review
              </h3>
              <div className="form-group">
                <select 
                  className="form-input"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ marginBottom: '20px' }}
                >
                  <option value="cash">Pay at Salon (Cash)</option>
                  <option value="maya">PayMaya E-Wallet</option>
                </select>
              </div>

              {selectedService && (
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                    <span style={{ color: 'var(--text3)' }}>{selectedService.name}</span>
                    <span>₱{selectedService.price}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                    <span style={{ color: 'var(--text3)' }}>Environmental Tax</span>
                    <span>₱15.00</span>
                  </div>
                  {paymentMethod === 'maya' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                      <span style={{ color: 'var(--text3)' }}>E-Wallet Fee (2%)</span>
                      <span>₱{(selectedService.price * 0.02).toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginTop: '15px', 
                    paddingTop: '15px', 
                    borderTop: '1px dashed rgba(255,255,255,0.1)',
                    fontSize: '18px',
                    fontWeight: '700',
                    color: 'var(--gold)'
                  }}>
                    <span>Total Amount</span>
                    <span>₱{(selectedService.price + (paymentMethod === 'maya' ? selectedService.price * 0.02 : 0) + 15).toFixed(2)}</span>
                  </div>
                </div>
              )}
            </GlassCard>
          </div>
        </div>

        {/* BOTTOM COLUMN: CONFIRM BUTTON */}
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <input 
              type="checkbox" 
              id="terms-checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--gold)', cursor: 'pointer' }}
            />
            <label htmlFor="terms-checkbox" style={{ fontSize: '14px', color: 'var(--text2)', cursor: 'pointer' }}>
              I have read and agree to the <span onClick={() => setShowTermsModal(true)} style={{ color: 'var(--gold)', textDecoration: 'underline', fontWeight: '600' }}>Terms and Conditions</span>
            </label>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={submitting || !selectedService || !bookingDate || !timeSlot || !termsAccepted}
            style={{ 
              padding: '18px 80px', 
              fontSize: '16px', 
              letterSpacing: '1px',
              textTransform: 'uppercase',
              boxShadow: termsAccepted ? '0 10px 30px rgba(212, 175, 55, 0.2)' : 'none',
              opacity: termsAccepted ? 1 : 0.5
            }}
          >
            {submitting ? 'Creating your luxury session...' : 'Confirm Appointment'}
          </button>
        </div>
      </form>

      {/* TERMS AND CONDITIONS MODAL */}
      {showTermsModal && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', 
          zIndex: 9999, padding: '24px' 
        }}>
          <GlassCard style={{ maxWidth: '700px', width: '100%', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="serif" style={{ color: 'var(--gold)', margin: 0 }}>Terms & Conditions</h2>
              <button onClick={() => setShowTermsModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text3)', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
            </div>
            
            <div style={{ overflowY: 'auto', paddingRight: '12px', marginBottom: '24px', fontSize: '14px', color: 'var(--text2)', lineHeight: '1.8' }}>
              <h4 style={{ color: 'var(--gold)' }}>1. Booking & Cancellation</h4>
              <p>Appointments can be booked up to 30 days in advance. Cancellations must be made at least 24 hours prior to the scheduled time to avoid a cancellation fee of ₱500. Late arrivals beyond 15 minutes may result in an abbreviated service or rescheduling.</p>
              
              <h4 style={{ color: 'var(--gold)', marginTop: '20px' }}>2. Health & Safety</h4>
              <p>For your safety and ours, please disclose any allergies, skin conditions, or medical issues prior to your treatment. We reserve the right to refuse service if a condition may be aggravated by the treatment or poses a risk to staff.</p>
              
              <h4 style={{ color: 'var(--gold)', marginTop: '20px' }}>3. Payments & Fees</h4>
              <p>All prices are inclusive of 12% VAT. An additional environmental tax of ₱15.00 is applied to all services. Payments made via e-wallets (PayMaya) incur a 2% convenience fee. Cash payments are accepted at the salon counter.</p>
              
              <h4 style={{ color: 'var(--gold)', marginTop: '20px' }}>4. Privacy Policy</h4>
              <p>Your personal data, including contact information and appointment history, is stored securely and used solely for managing your bookings and improving our services. We do not sell your information to third parties.</p>
              
              <h4 style={{ color: 'var(--gold)', marginTop: '20px' }}>5. Conduct</h4>
              <p>Spatify maintains a sanctuary of peace. We request all guests to silence their mobile devices and maintain a moderate volume to respect the experience of other clients.</p>
            </div>
            
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', textAlign: 'center' }}>
              <button 
                onClick={() => { setTermsAccepted(true); setShowTermsModal(false); }}
                className="btn-primary"
                style={{ padding: '12px 40px' }}
              >
                I Understand and Accept
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
