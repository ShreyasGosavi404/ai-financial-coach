import React, { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Enhanced 3D floating elements with professional animations
    const createFloatingElement = (type, delay = 0) => {
      const element = document.createElement('div');
      element.className = `floating-element ${type}`;
      
      // Random positioning with 3D perspective
      element.style.left = Math.random() * 100 + '%';
      element.style.top = Math.random() * 100 + '%';
      element.style.animationDelay = delay + 's';
      element.style.animationDuration = (Math.random() * 15 + 20) + 's';
      
      // 3D transform properties
      element.style.transform = `
        translateZ(${Math.random() * 200 - 100}px) 
        rotateX(${Math.random() * 360}deg) 
        rotateY(${Math.random() * 360}deg)
      `;
      
      // Enhanced styling based on type
      if (type === 'cube') {
        element.style.width = (Math.random() * 30 + 15) + 'px';
        element.style.height = element.style.width;
        element.style.background = `linear-gradient(45deg, 
          rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 255, 0.3),
          rgba(255, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.3)
        )`;
        element.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        element.style.borderRadius = '4px';
        element.style.boxShadow = '0 0 20px rgba(0, 150, 255, 0.3)';
      } else if (type === 'orb') {
        const size = Math.random() * 40 + 20;
        element.style.width = size + 'px';
        element.style.height = size + 'px';
        element.style.borderRadius = '50%';
        element.style.background = `radial-gradient(circle, 
          rgba(${Math.floor(Math.random() * 255)}, 255, ${Math.floor(Math.random() * 255)}, 0.4),
          rgba(255, ${Math.floor(Math.random() * 255)}, 255, 0.1)
        )`;
        element.style.filter = 'blur(1px)';
        element.style.boxShadow = '0 0 30px rgba(255, 100, 255, 0.4)';
      } else if (type === 'symbol') {
        const symbols = ['$', '€', '£', '¥', '₹', '₿', '%', '↗', '↘', '📈', '💰', '🏦', '📊', '💳', '🎯'];
        element.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        element.style.fontSize = (Math.random() * 20 + 15) + 'px';
        element.style.color = `rgba(${Math.floor(Math.random() * 255)}, 255, 255, 0.7)`;
        element.style.textShadow = '0 0 10px rgba(0, 255, 255, 0.5)';
        element.style.fontWeight = 'bold';
      } else if (type === 'particle') {
        const size = Math.random() * 8 + 3;
        element.style.width = size + 'px';
        element.style.height = size + 'px';
        element.style.borderRadius = '50%';
        element.style.background = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 255, 0.6)`;
        element.style.boxShadow = '0 0 15px rgba(100, 200, 255, 0.8)';
      }
      
      container.appendChild(element);
      
      // Remove element after animation with cleanup
      setTimeout(() => {
        if (container && container.contains(element)) {
          container.removeChild(element);
        }
      }, 35000);
    };

    // Create enhanced 3D rotating cubes
    const create3DCube = () => {
      const cube = document.createElement('div');
      cube.className = 'floating-cube-3d';
      cube.style.left = Math.random() * 100 + '%';
      cube.style.top = Math.random() * 100 + '%';
      cube.style.animationDuration = (Math.random() * 20 + 25) + 's';
      cube.style.animationDelay = Math.random() * 5 + 's';
      
      // Create 6 faces for true 3D cube
      for (let i = 0; i < 6; i++) {
        const face = document.createElement('div');
        face.className = `cube-face face-${i + 1}`;
        cube.appendChild(face);
      }
      
      container.appendChild(cube);
      
      setTimeout(() => {
        if (container && container.contains(cube)) {
          container.removeChild(cube);
        }
      }, 45000);
    };

    // Create gradient orbs with pulsing effect
    const createGradientOrb = () => {
      const orb = document.createElement('div');
      orb.className = 'gradient-orb';
      orb.style.left = Math.random() * 100 + '%';
      orb.style.top = Math.random() * 100 + '%';
      orb.style.animationDuration = (Math.random() * 15 + 20) + 's';
      orb.style.animationDelay = Math.random() * 3 + 's';
      
      const colors = [
        'rgba(255, 100, 200, 0.3)',
        'rgba(100, 255, 200, 0.3)',
        'rgba(200, 100, 255, 0.3)',
        'rgba(255, 200, 100, 0.3)',
        'rgba(100, 200, 255, 0.3)'
      ];
      
      orb.style.background = `radial-gradient(circle, ${colors[Math.floor(Math.random() * colors.length)]}, transparent)`;
      
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
