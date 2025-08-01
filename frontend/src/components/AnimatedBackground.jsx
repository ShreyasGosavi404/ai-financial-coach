import React, { useEffect, useRef } from 'react';
import './AnimatedBackground.css';

const AnimatedBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Create floating elements
    const container = containerRef.current;
    if (!container) return;

    const createFloatingElement = (type, delay = 0) => {
      const element = document.createElement('div');
      element.className = `floating-element ${type}`;
      element.style.left = Math.random() * 100 + '%';
      element.style.animationDelay = delay + 's';
      element.style.animationDuration = (Math.random() * 10 + 15) + 's';
      
      // Add financial symbols
      if (type === 'symbol') {
        const symbols = ['$', '€', '£', '¥', '₹', '₿', '%', '↗', '↘', '📈', '💰', '🏦'];
        element.textContent = symbols[Math.random() * symbols.length | 0];
      }
      
      container.appendChild(element);
      
      // Remove element after animation
      setTimeout(() => {
        if (container.contains(element)) {
          container.removeChild(element);
        }
      }, 25000);
    };

    // Create initial elements
    for (let i = 0; i < 15; i++) {
      setTimeout(() => createFloatingElement('coin', i * 0.5), i * 100);
      setTimeout(() => createFloatingElement('symbol', i * 0.3), i * 150);
      setTimeout(() => createFloatingElement('particle', i * 0.2), i * 80);
    }

    // Continuously create new elements
    const interval = setInterval(() => {
      createFloatingElement('coin');
      createFloatingElement('symbol');
      createFloatingElement('particle');
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="animated-background" ref={containerRef}>
      {/* 3D Grid Background */}
      <div className="grid-container">
        <div className="grid-lines horizontal"></div>
        <div className="grid-lines vertical"></div>
      </div>
      
      {/* Gradient Orbs */}
      <div className="gradient-orb orb-1"></div>
      <div className="gradient-orb orb-2"></div>
      <div className="gradient-orb orb-3"></div>
      
      {/* Financial Chart Lines */}
      <svg className="chart-lines" viewBox="0 0 1200 800">
        <defs>
          <linearGradient id="chartGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4CAF50" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#2196F3" stopOpacity="0.3"/>
          </linearGradient>
          <linearGradient id="chartGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#4ECDC4" stopOpacity="0.2"/>
          </linearGradient>
        </defs>
        
        <path 
          d="M 0 400 Q 200 300 400 350 T 800 250 T 1200 200" 
          stroke="url(#chartGradient1)" 
          strokeWidth="3" 
          fill="none"
          className="chart-line line-1"
        />
        <path 
          d="M 0 500 Q 300 400 600 450 T 1000 350 T 1200 300" 
          stroke="url(#chartGradient2)" 
          strokeWidth="2" 
          fill="none"
          className="chart-line line-2"
        />
      </svg>
      
      {/* 3D Cubes */}
      <div className="cube-container">
        <div className="cube cube-1">
          <div className="cube-face front">₿</div>
          <div className="cube-face back">$</div>
          <div className="cube-face right">€</div>
          <div className="cube-face left">£</div>
          <div className="cube-face top">¥</div>
          <div className="cube-face bottom">₹</div>
        </div>
        
        <div className="cube cube-2">
          <div className="cube-face front">📊</div>
          <div className="cube-face back">📈</div>
          <div className="cube-face right">💰</div>
          <div className="cube-face left">🏦</div>
          <div className="cube-face top">💳</div>
          <div className="cube-face bottom">📉</div>
        </div>
      </div>
      
      {/* DNA Helix representing data flow */}
      <div className="dna-helix">
        <div className="dna-strand strand-1"></div>
        <div className="dna-strand strand-2"></div>
      </div>
    </div>
  );
};

export default AnimatedBackground;
