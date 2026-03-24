import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <nav ref={navRef} style={{ 
      position: 'fixed', top: 0, width: '100%', zIndex: 1000, 
      transition: 'all 0.4s ease',
      padding: isScrolled ? '15px 0' : '25px 0',
      borderBottom: isScrolled ? '1px solid var(--glass-border)' : '1px solid transparent',
      background: isScrolled ? 'var(--glass-bg)' : 'transparent',
      backdropFilter: isScrolled ? 'blur(20px)' : 'none',
      WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'none'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px' }}>
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 800, textDecoration: 'none', color: 'var(--text-bright)', letterSpacing: '-0.5px' }}>
          Divyam<span className="gradient-text">Raj</span>
        </Link>

        {/* Desktop Nav */}
        <ul style={{ gap: '30px', listStyle: 'none', margin: 0, alignItems: 'center' }} className="desktop-nav">
          {['Home', 'About', 'Experience', 'Portfolio', 'Skills', 'Contact'].map(item => (
            <li key={item}>
              <a href={`#${item.toLowerCase()}`} style={{ 
                textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500, transition: 'color 0.3s' 
              }} onMouseOver={e => e.target.style.color = 'var(--neon-cyan)'} onMouseOut={e => e.target.style.color = 'var(--text-muted)'}>
                {item}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile Toggle */}
        <div className="mobile-toggle" style={{ cursor: 'pointer', zIndex: 1001 }} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} color="var(--neon-cyan)" /> : <Menu size={28} color="var(--text-bright)" />}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ position: 'absolute', top: '100%', left: 0, width: '100%', background: 'var(--glass-bg)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--glass-border)', padding: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}
          >
             {['Home', 'About', 'Experience', 'Portfolio', 'Skills', 'Contact'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-bright)', fontSize: '1.2rem', fontWeight: 500 }}>
                {item}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
