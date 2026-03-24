import React from 'react';
import { motion } from 'framer-motion';

const Experience = ({ data }) => {
  return (
    <section id="experience" className="section">
      <div className="container">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center' }}
        >
          My <span className="gradient-text">Experience</span>
        </motion.h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', maxWidth: '800px', margin: '0 auto' }}>
          {data.map((exp, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass-3d-card"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: '#fff', padding: '5px', flexShrink: 0 }}>
                  <img src={`/${exp.logo}`} alt={exp.company} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div>
                  <h3 style={{ marginBottom: '5px', fontSize: '1.4rem' }}>{exp.title}</h3>
                  <h4 style={{ color: 'var(--neon-cyan)', fontWeight: 500, fontSize: '1.1rem' }}>{exp.company} | <span style={{ color: 'var(--text-muted)' }}>{exp.period}</span></h4>
                </div>
              </div>
              <p style={{ margin: 0 }}>{exp.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
