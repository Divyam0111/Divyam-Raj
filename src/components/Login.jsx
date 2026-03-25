import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { motion } from 'framer-motion';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/content');
      const dbContent = await res.json();
      
      if (!res.ok) {
        throw new Error(dbContent.error ? `DB Connection Failed: ${dbContent.error}` : "Database fetch failed");
      }
      
      if (dbContent.settings && email === dbContent.settings.admin_email && password === dbContent.settings.admin_password) {
        const dummyToken = 'static-token-123';
        localStorage.setItem('token', dummyToken);
        onLogin(dummyToken);
      } else {
        setError('Invalid email or password.');
      }
    } catch (err) {
      setError(err.message || 'Error verifying credentials with server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }}>
        <Canvas camera={{ position: [0, 0, 1] }}>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </Canvas>
      </div>
      
      <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <motion.div 
          className="glass-3d-card"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          style={{ width: '100%', maxWidth: '450px', padding: '50px 40px', textAlign: 'center' }}
        >
          <div style={{ marginBottom: '30px' }}>
            <div style={{ 
              width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto',
              fontWeight: 800, fontSize: '1.5rem', color: '#fff', boxShadow: 'var(--glow-cyan)'
            }}>
              DR
            </div>
            <h2 style={{ fontSize: '2rem', marginBottom: '10px', letterSpacing: '-0.5px' }}>Admin <span className="gradient-text">Access</span></h2>
            <p style={{ color: 'var(--text-muted)' }}>Secure dashboard login</p>
          </div>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                style={{ width: '100%', padding: '15px', background: 'var(--bg-space-dark)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--text-bright)', fontSize: '1rem', outline: 'none', transition: 'border-color 0.3s' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--neon-cyan)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                style={{ width: '100%', padding: '15px', background: 'var(--bg-space-dark)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--text-bright)', fontSize: '1rem', outline: 'none', transition: 'border-color 0.3s' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--neon-purple)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
              />
            </div>
            
            {error && <p style={{ color: '#ff453a', fontSize: '0.9rem', textAlign: 'center', margin: '10px 0 0 0' }}>{error}</p>}
            
            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '16px', borderRadius: '30px', border: 'none', cursor: 'pointer', marginTop: '10px', fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>
              {loading ? 'Authenticating...' : 'Enter Dashboard'}
            </button>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
