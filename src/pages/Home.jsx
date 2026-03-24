import React, { useState, useEffect, useRef, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Experience from '../components/Experience';
import Portfolio from '../components/Portfolio';
import Skills from '../components/Skills';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

class InfinityCurve extends THREE.Curve {
  constructor(scale = 1) {
    super();
    this.scale = scale;
  }
  getPoint(t, optionalTarget = new THREE.Vector3()) {
    const angle = t * Math.PI * 2;
    const x = Math.sin(angle) * 1.5;
    const y = Math.sin(angle) * Math.cos(angle) * 1.5;
    const z = Math.sin(angle * 2) * 0.2;
    return optionalTarget.set(x, y, z).multiplyScalar(this.scale);
  }
}

const infinityCurveInstance = new InfinityCurve(1.5);

const InfinityIcon = () => {
  const starRef = useRef();
  const groupRef = useRef();

  useFrame((state) => {
    // Calculate position along the curve based on elapsed time
    // Multiplier controls speed of the star
    const t = (state.clock.elapsedTime * 0.3) % 1; 
    const point = infinityCurveInstance.getPoint(t);
    
    if (starRef.current) {
      starRef.current.position.copy(point);
      // Spin the star itself for extra effect
      starRef.current.rotation.x += 0.05;
      starRef.current.rotation.y += 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Faint glowing track */}
      <mesh>
        <tubeGeometry args={[infinityCurveInstance, 64, 0.03, 8, true]} />
        <meshStandardMaterial color="#7c3aed" transparent opacity={0.3} emissive="#7c3aed" emissiveIntensity={0.5} wireframe />
      </mesh>

      {/* Moving Star */}
      <mesh ref={starRef}>
        <octahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial color="#ffffff" emissive="#00d4ff" emissiveIntensity={4} />
        <pointLight distance={5} intensity={5} color="#00d4ff" />
      </mesh>
    </group>
  );
};

const Loader = () => (
  <motion.div 
    initial={{ opacity: 1 }} 
    exit={{ opacity: 0 }} 
    transition={{ duration: 0.8 }} 
    style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'var(--bg-space-dark)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
  >
    <div style={{ width: '300px', height: '300px' }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <InfinityIcon />
      </Canvas>
    </div>
    <h3 className="gradient-text" style={{ marginTop: '20px', letterSpacing: '4px', fontWeight: 600 }}>INITIALIZING...</h3>
  </motion.div>
);

const Home = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/content').then(res => res.json()),
      new Promise(resolve => setTimeout(resolve, 1500)) // Guarantee at least 1.5s display of the beautiful loader
    ])
      .then(([data]) => {
        setContent(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (content?.settings?.template) {
      document.body.className = content.settings.template;
    }
  }, [content?.settings?.template]);

  if (!content && !loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '20vh' }}>Error loading content. Please check static data or database connection.</div>;

  return (
    <>
      <AnimatePresence>
        {loading && <Loader />}
      </AnimatePresence>
      
      {!loading && content && (
        <>
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }}>
            <Canvas camera={{ position: [0, 0, 1] }}>
              <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            </Canvas>
          </div>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 1 }}
            style={{ position: 'relative', zIndex: 10 }}
          >
            <Navbar />
            <main>
              <Hero data={content.hero} />
              <About data={content.about} />
              <Experience data={content.experience} />
              <Portfolio data={content.portfolio} />
              <Skills data={content.skills} />
              <Contact data={content.contact} />
            </main>
            <Footer />
          </motion.div>
        </>
      )}
    </>
  );
};

export default Home;
