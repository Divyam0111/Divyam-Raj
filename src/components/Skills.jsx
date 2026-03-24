import React from 'react';
import { motion } from 'framer-motion';

const Skills = ({ data }) => {
  return (
    <section id="skills" className="section">
      <div className="container">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center' }}
        >
          Technical <span className="gradient-text">Skills</span>
        </motion.h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', maxWidth: '1000px', margin: '0 auto' }}>
          {Object.entries(data).map(([category, list], index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-3d-card"
            >
              <h3 style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '30px', color: 'var(--text-bright)' }}>
                {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px' }}>
                {list.map((skill, i) => (
                  <motion.span 
                    key={i}
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(124, 58, 237, 0.2)', borderColor: 'var(--neon-purple)' }}
                    style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: '12px 24px', borderRadius: '30px', fontSize: '1rem', color: 'var(--text-bright)', cursor: 'default', transition: 'all 0.3s ease', boxShadow: 'var(--glow-cyan)' }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
