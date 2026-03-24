import React from 'react';
import { motion } from 'framer-motion';

const About = ({ data }) => {
  return (
    <section id="about" className="section">
      <div className="container">
        <motion.div
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.6 }}
           className="glass-3d-card"
           style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}
        >
          <h2>{data.title}</h2>
          <p style={{ margin: '0 auto 20px auto' }}>{data.p1}</p>
          <p style={{ margin: '0 auto 20px auto' }}>{data.p2}</p>
          <p style={{ margin: '0 auto', color: 'var(--neon-cyan)', fontSize: '1.2rem' }}>{data.p3}</p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
