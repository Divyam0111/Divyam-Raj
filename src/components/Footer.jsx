import React from 'react';

const Footer = () => {
  return (
    <footer style={{ padding: '40px 24px', textAlign: 'center', borderTop: '1px solid var(--glass-border)', background: 'var(--bg-space-dark)', position: 'relative', zIndex: 10 }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
        <p style={{ margin: '0', fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center' }}>&copy; 2026 Divyam Raj. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
