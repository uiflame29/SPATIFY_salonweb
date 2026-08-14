import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { GlassCard } from '../../components/ui';

const HomePage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCount, setShowCount] = useState(5);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/public/reviews');
        setReviews(res.data);
      } catch (err) {
        console.error("Failed to load reviews", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleSeeMore = () => {
    setShowCount(prev => prev + 5);
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }}></div>

        <div style={{ maxWidth: '800px', zIndex: 1 }} className="fade-in">
          <div style={{ fontSize: '11px', color: 'var(--gold)', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '24px', fontWeight: '600' }}>
            Elevate Your Senses
          </div>
          <h1 style={{ marginBottom: '24px' }}>
            Experience True Luxury & Wellness
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text2)', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.8' }}>
            Step into a sanctuary of elegance. Spatify offers premium hair, nail, and body treatments designed to rejuvenate your body and elevate your spirit.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/book" className="btn-primary" style={{ padding: '16px 40px', fontSize: '13px' }}>
              Book an Appointment
            </Link>
            <Link to="/services" className="btn-secondary" style={{ padding: '16px 40px', fontSize: '13px' }}>
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" style={{ padding: '80px 24px', background: 'var(--bg2)', borderTop: '1px solid var(--glass-border2)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontSize: '11px', color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>Testimonials</div>
            <h2 className="serif">What Our Clients Say</h2>
            <p style={{ color: 'var(--text3)', marginTop: '8px' }}>Real stories from our valued customers</p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--gold)' }}>Loading testimonials...</div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
                {reviews.slice(0, showCount).map((review) => (
                  <GlassCard key={review.id} style={{ display: 'flex', flexDirection: 'column', gap: '20px', transition: 'all 0.3s ease' }} className="fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ 
                          width: '44px', 
                          height: '44px', 
                          borderRadius: '50%', 
                          background: 'linear-gradient(45deg, rgba(201,168,76,0.2), rgba(201,168,76,0.05))', 
                          border: '1.5px solid var(--gold)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          color: 'var(--gold)', 
                          fontWeight: '700', 
                          fontSize: '14px',
                          boxShadow: '0 4px 15px rgba(201,168,76,0.1)'
                        }}>
                          {review.userInitials}
                        </div>
                        <div>
                          <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text)' }}>{review.userName}</div>
                          <div style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: '500', textTransform: 'uppercase' }}>
                            {review.serviceName}
                          </div>
                        </div>
                      </div>
                      <div style={{ color: 'var(--gold)', fontSize: '12px', letterSpacing: '1px' }}>
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--text2)', fontStyle: 'italic', lineHeight: '1.7', borderLeft: '2px solid var(--gold)', paddingLeft: '16px' }}>
                      "{review.text}"
                    </p>
                    <div style={{ fontSize: '10px', color: 'var(--text3)', textAlign: 'right' }}>
                      {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </GlassCard>
                ))}
              </div>

              <div style={{ textAlign: 'center', marginTop: '48px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
                {showCount < reviews.length ? (
                  <button 
                    onClick={handleSeeMore} 
                    className="btn-secondary"
                    style={{ padding: '12px 32px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}
                  >
                    See More Reviews
                  </button>
                ) : reviews.length > 5 && (
                  <button 
                    onClick={() => setShowCount(5)} 
                    className="btn-ghost"
                    style={{ padding: '12px 32px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}
                  >
                    See Less
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
