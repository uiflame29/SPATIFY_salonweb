import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { GlassCard } from '../../components/ui';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/public/services');
        setServices(res.data);
      } catch (err) {
        console.error("Failed to load services", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const categories = [...new Set(services.map(s => s.category))];

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 className="serif" style={{ marginBottom: '16px', fontSize: '42px' }}>Our Services</h1>
        <p style={{ color: 'var(--text2)', maxWidth: '600px', margin: '0 auto', fontSize: '16px', lineHeight: '1.6' }}>
          Discover our range of luxury treatments tailored to rejuvenate your body and elevate your style.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--gold)', fontSize: '18px' }}>Loading our premium services...</div>
      ) : (
        categories.map(category => (
          <div key={category} style={{ marginBottom: '60px' }}>
            <h2 className="serif" style={{ fontSize: '28px', color: 'var(--gold)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px', marginBottom: '32px' }}>
              {category}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
              {services.filter(s => s.category === category).map(service => (
                <GlassCard key={service.id} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '20px', fontWeight: '500', color: 'var(--text)', margin: 0 }}>{service.name}</h3>
                      <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--gold)' }}>₱{service.price}</div>
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--text2)', marginBottom: '24px', lineHeight: '1.6' }}>
                      {service.description}
                    </p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text3)' }}>⏱ {service.durationMinutes} minutes</span>
                    <Link to="/book" className="btn-secondary" style={{ padding: '8px 24px', fontSize: '12px' }}>Book Now</Link>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ServicesPage;
