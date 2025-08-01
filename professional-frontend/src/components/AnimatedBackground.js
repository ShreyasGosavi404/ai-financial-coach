import React, { useEffect, useRef } from 'react';
import './AnimatedBackground.css';

const AnimatedBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Enhanced floating elements with 3D effects
    const createFloatingElement = (type, delay = 0) => {
      const element = document.createElement('div');
      element.className = `floating-element ${type}`;
      element.style.left = Math.random() * 100 + '%';
      element.style.animationDelay = delay + 's';
      element.style.animationDuration = (Math.random() * 10 + 15) + 's';
      
      // Add financial symbols with enhanced styling
      if (type === 'symbol') {
        const symbols = ['$', '€', '£', '¥', '₹', '₿', '%', '↗', '↘', '📈', '💰', '🏦', '📊', '💳', '🔗'];
        element.textContent = symbols[Math.random() * symbols.length | 0];
        element.style.fontSize = (Math.random() * 20 + 20) + 'px';
        element.style.textShadow = '0 0 20px rgba(255, 255, 255, 0.8)';
      }
      
      // Enhanced particles with glow effects
      if (type === 'particle') {
        element.style.boxShadow = `0 0 ${Math.random() * 20 + 10}px rgba(${Math.random() * 255}, ${Math.random() * 255}, 255, 0.8)`;
        element.style.filter = 'blur(0.5px)';
      }
      
      container.appendChild(element);
      
      setTimeout(() => {
        if (container && container.contains(element)) {
          container.removeChild(element);
        }
      }, 30000);
    };

    // Create 3D cubes with financial symbols
    const create3DCube = () => {
      const cube = document.createElement('div');
      cube.className = 'floating-cube';
      
      // Create cube faces
      const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
      const symbols = ['₿', '$', '€', '£', '¥', '₹'];
      
      faces.forEach((face, index) => {
        const faceElement = document.createElement('div');
        faceElement.className = `cube-face ${face}`;
        faceElement.textContent = symbols[index] || '$';
        cube.appendChild(faceElement);
      });
      
      cube.style.left = Math.random() * 90 + '%';
      cube.style.top = Math.random() * 80 + '%';
      cube.style.animationDelay = Math.random() * 5 + 's';
      cube.style.animationDuration = (Math.random() * 15 + 20) + 's';
      
      container.appendChild(cube);
      
      setTimeout(() => {
        if (container && container.contains(cube)) {
          container.removeChild(cube);
        }
      }, 35000);
    };

    // Create gradient orbs with pulsing effects
    const createGradientOrb = () => {
      const orb = document.createElement('div');
      orb.className = 'gradient-orb-floating';
      
      const colors = [
        'linear-gradient(45deg, #4CAF50, #2196F3)',
        'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
        'linear-gradient(45deg, #FFD700, #FF6347)',
        'linear-gradient(45deg, #9C27B0, #3F51B5)'
      ];
      
      orb.style.background = colors[Math.floor(Math.random() * colors.length)];
      orb.style.left = Math.random() * 85 + '%';
      orb.style.top = Math.random() * 75 + '%';
      orb.style.animationDelay = Math.random() * 3 + 's';
      orb.style.animationDuration = (Math.random() * 12 + 18) + 's';
      
      container.appendChild(orb);
      
      setTimeout(() => {
        if (container && container.contains(orb)) {
          container.removeChild(orb);
        }
      }, 40000);
    };

    // Create initial enhanced elements
    for (let i = 0; i < 12; i++) {
      setTimeout(() => createFloatingElement('cube', i * 0.3), i * 200);
      setTimeout(() => createFloatingElement('orb', i * 0.4), i * 250);
      setTimeout(() => createFloatingElement('symbol', i * 0.2), i * 150);
      setTimeout(() => createFloatingElement('particle', i * 0.1), i * 100);
    }

    // Create 3D cubes and gradient orbs
    for (let i = 0; i < 6; i++) {
      setTimeout(() => create3DCube(), i * 1000);
      setTimeout(() => createGradientOrb(), i * 1500);
    }

    // Continuously create new enhanced elements
    const elementInterval = setInterval(() => {
      createFloatingElement('cube');
      createFloatingElement('orb');
      createFloatingElement('symbol');
      createFloatingElement('particle');
    }, 4000);

    const cubeInterval = setInterval(() => {
      create3DCube();
    }, 8000);

    const orbInterval = setInterval(() => {
      createGradientOrb();
    }, 6000);

    return () => {
      clearInterval(elementInterval);
      clearInterval(cubeInterval);
      clearInterval(orbInterval);
    };
  }, []);

  return <div ref={containerRef} className="animated-background" />;
};

export default AnimatedBackground;
