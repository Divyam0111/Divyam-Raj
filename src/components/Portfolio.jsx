import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Github } from 'lucide-react';
import { motion } from 'framer-motion';

const Portfolio = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % data.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);

  return (
    <section id="portfolio" className="section">
      <div className="container">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center' }}
        >
          Selected <span className="gradient-text">Work</span>
        </motion.h2>
        
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
          <div style={{ overflow: 'hidden', padding: '40px 20px', position: 'relative' }}>
            <motion.div 
              style={{ display: 'flex', transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)', transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {data.map((item, index) => (
                <div key={index} style={{ minWidth: '100%', padding: '0 20px', boxSizing: 'border-box' }}>
                  <div className="glass-3d-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 0, overflow: 'hidden' }}>
                    <div style={{ height: '350px', backgroundImage: `url('/${item.image_url}')`, backgroundSize: 'cover', backgroundPosition: 'center', borderBottom: '1px solid var(--glass-border)' }} />
                    <div style={{ padding: '30px' }}>
                      <h3 style={{ fontSize: '1.8rem', color: 'var(--neon-cyan)', marginBottom: '15px' }}>{item.title}</h3>
                      <p style={{ marginBottom: '25px' }}>{item.description}</p>
                      <div style={{ display: 'flex', gap: '15px' }}>
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
                          <ExternalLink size={16} style={{ marginRight: '8px' }} /> Live Demo
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
            <button onClick={prev} className="btn-secondary" style={{ width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronLeft size={24} />
            </button>
            <button onClick={next} className="btn-secondary" style={{ width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
