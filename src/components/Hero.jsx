import React from 'react';
import { motion } from 'framer-motion';

const Hero = ({ data }) => {
  return (
    <section id="home" className="section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ zIndex: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10vh' }}>
        
        <motion.div 
          className="hero-image-container animate-float"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          style={{ marginBottom: '30px' }}
        >
          <img src={`/${data.profile_image}`} alt="Profile" />
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 400, color: 'var(--text-muted)', marginBottom: '10px' }}
        >
          {data.subtitle}
        </motion.h2>
        
        <motion.h1 
          className="gradient-text"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, type: 'spring' }}
          style={{ margin: '10px 0 20px 0' }}
        >
          {data.title}
        </motion.h1>
        
        <motion.h3 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '40px' }}
        >
          {data.description}
        </motion.h3>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <a href="#portfolio" className="btn btn-primary">{data.cta_text}</a>
          <a href={`/${data.resume_text}`} download className="btn btn-secondary">{data.resume_text}</a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
