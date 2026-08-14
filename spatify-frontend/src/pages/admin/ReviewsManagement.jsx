import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { GlassCard } from '../../components/ui';

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [response, setResponse] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await api.get('/public/reviews');
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/admin/reviews/${selectedReview.id}/reply`, { response });
      setShowModal(false);
      fetchReviews();
    } catch (err) {
      alert('Failed to submit reply');
    }
  };

  const openModal = (review) => {
    setSelectedReview(review);
    setResponse(review.response || '');
    setShowModal(true);
  };

  if (loading) return <div>Loading reviews...</div>;

  return (
    <div>
      <div className="dashboard-header">
        <h2>Reviews & Feedback</h2>
        <p>Monitor and respond to customer reviews</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {reviews.map(r => (
          <GlassCard key={r.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <div style={{ fontWeight: '600', color: 'var(--text)' }}>{r.userName} <span style={{ color: 'var(--text3)', fontWeight: 'normal', fontSize: '12px' }}>on {r.serviceName}</span></div>
                <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{new Date(r.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="stars">
                {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
              </div>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '16px' }}>"{r.text}"</p>
            {r.responded && (
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '4px', marginBottom: '16px', fontSize: '12px' }}>
                <span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>Spatify Response: </span>
                <span style={{ color: 'var(--text2)' }}>{r.response}</span>
              </div>
            )}
            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {r.responded ? (
                <div style={{ fontSize: '12px', color: 'var(--success)' }}>✓ Responded</div>
              ) : (
                <div style={{ fontSize: '12px', color: 'var(--warning)' }}>Pending Response</div>
              )}
              <button className="btn-ghost" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => openModal(r)}>
                {r.responded ? 'Edit Reply' : 'Reply'}
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {showModal && selectedReview && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <GlassCard style={{ width: '100%', maxWidth: '500px' }}>
            <h3 style={{ marginBottom: '16px', color: 'var(--gold)' }}>Reply to Review</h3>
            <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '16px', fontStyle: 'italic' }}>
              "{selectedReview.text}" - {selectedReview.userName}
            </div>
            <form onSubmit={handleReplySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <textarea 
                className="form-input" 
                placeholder="Write your official response here..." 
                value={response} 
                onChange={e => setResponse(e.target.value)} 
                required 
                rows="4" 
              />
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="button" className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Submit Reply</button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default ReviewsManagement;
