import React from 'react';
import { Mail, Linkedin, Github } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = ({ data }) => {
  return (
    <section id="contact" className="section">
      <div className="container">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center' }}
        >
          {data.title.split(' ')[0]} <span className="gradient-text">{data.title.split(' ').slice(1).join(' ')}</span>
        </motion.h2>

        <motion.div 
          className="glass-3d-card"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}
        >
          <h3 style={{ fontSize: '2rem', marginBottom: '20px' }}>{data.heading}</h3>
          <p style={{ margin: '0 auto 40px auto' }}>{data.description}</p>

          <a href={`mailto:${data.email}`} className="btn btn-primary" style={{ marginBottom: '40px', padding: '16px 32px', fontSize: '1.1rem' }}>
            <Mail size={20} style={{ marginRight: '10px' }} /> {data.email}
          </a>

          <div>
            <h4 style={{ color: 'var(--text-muted)', marginBottom: '20px', fontWeight: 400 }}>Connect With Me</h4>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <a href="https://linkedin.com/in/divyamr" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '15px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Linkedin size={24} />
              </a>
              <a href="https://github.com/Divyam0111" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '15px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Github size={24} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
