import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { GlassCard, Badge } from '../../components/ui';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Review Modal State
  const [showReviewForm, setShowReviewForm] = useState(null); // stores booking object
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/my');
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to load bookings", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED': return <Badge type="success">Confirmed</Badge>;
      case 'PENDING': return <Badge type="warning">Pending</Badge>;
      case 'CANCELLED': return <Badge type="danger">Cancelled</Badge>;
      case 'COMPLETED': return <Badge type="info">Completed</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await api.post('/reviews', {
        serviceName: showReviewForm.serviceName,
        rating: rating,
        text: comment
      });
      setReviewSuccess("Testimonial shared! Check the Home Page.");
      setTimeout(() => {
        setShowReviewForm(null);
        setReviewSuccess('');
        setComment('');
        setRating(5);
      }, 2000);
    } catch (err) {
      console.error("Failed to submit review", err);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h2 className="serif" style={{ marginBottom: '8px' }}>Welcome, {user.firstName}</h2>
        <p style={{ color: 'var(--text3)' }}>Manage your appointments and preferences</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 768 ? '1fr 300px' : '1fr', gap: '32px' }}>
        <div>
          <h3 style={{ fontSize: '16px', marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>Your Appointments</h3>
          
          {loading ? (
            <div style={{ color: 'var(--gold)' }}>Loading appointments...</div>
          ) : bookings.length === 0 ? (
            <GlassCard style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>📅</div>
              <div style={{ color: 'var(--text2)', marginBottom: '16px' }}>You have no appointments yet.</div>
            </GlassCard>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {bookings.map(booking => (
                <GlassCard key={booking.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <div style={{ fontWeight: '600', color: 'var(--gold)' }}>{booking.serviceName}</div>
                      {getStatusBadge(booking.status)}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text2)' }}>
                      {booking.bookingDate} at {booking.timeSlot} • with {booking.staffName}
                    </div>
                    {/* Add Review Button for Confirmed/Completed bookings */}
                    {(booking.status === 'CONFIRMED' || booking.status === 'COMPLETED') && (
                      <button 
                        onClick={() => setShowReviewForm(booking)}
                        style={{ 
                          marginTop: '12px', 
                          fontSize: '11px', 
                          color: 'var(--gold)', 
                          background: 'none', 
                          border: '1px solid var(--gold)', 
                          padding: '4px 12px', 
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Write a Review
                      </button>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '600' }}>₱{booking.amount?.toLocaleString()}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase' }}>{booking.paymentMethod}</div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 style={{ fontSize: '16px', marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>Profile Details</h3>
          <GlassCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '4px' }}>Full Name</div>
                <div style={{ fontSize: '14px' }}>{user.name}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '4px' }}>Email Address</div>
                <div style={{ fontSize: '14px' }}>{user.email}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '4px' }}>Phone Number</div>
                <div style={{ fontSize: '14px' }}>{user.phone}</div>
              </div>
              <button className="btn-ghost" style={{ width: '100%', marginTop: '8px' }}>Edit Profile</button>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* REVIEW FORM MODAL */}
      {showReviewForm && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '24px'
        }}>
          <GlassCard style={{ maxWidth: '500px', width: '100%', padding: '32px' }} className="fade-in">
            <h3 className="serif" style={{ marginBottom: '16px' }}>Share Your Experience</h3>
            <p style={{ fontSize: '13px', color: 'var(--text3)', marginBottom: '24px' }}>
              Tell us what you thought about your **{showReviewForm.serviceName}**.
            </p>

            {reviewSuccess ? (
              <div className="alert-box success">{reviewSuccess}</div>
            ) : (
              <form onSubmit={handleReviewSubmit}>
                <div className="form-group">
                  <label className="form-label">Rating</label>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '24px', color: 'var(--gold)', cursor: 'pointer' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} onClick={() => setRating(star)}>
                        {star <= rating ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Your Comment</label>
                  <textarea 
                    className="form-input" 
                    rows="4" 
                    placeholder="Describe your visit..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'white', resize: 'none' }}
                  ></textarea>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button 
                    type="submit" 
                    className="btn-primary" 
                    disabled={submittingReview}
                    style={{ flex: 1 }}
                  >
                    {submittingReview ? 'Submitting...' : 'Post Testimonial'}
                  </button>
                  <button 
                    type="button" 
                    className="btn-ghost" 
                    onClick={() => setShowReviewForm(null)}
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
