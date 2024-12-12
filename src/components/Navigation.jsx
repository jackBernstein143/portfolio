import React from 'react';
import { motion } from 'framer-motion';

function Navigation() {
  return (
    <nav>
      <ul style={{ 
        listStyle: 'none', 
        padding: 0,
        display: 'flex',
        gap: '2rem'  // Use gap for consistent spacing
      }}>
        {['Work', 'About', 'Contact'].map((item) => (
          <motion.li
            key={item}
            data-hover="true"
            whileHover={{ x: 10 }}
            style={{ 
              cursor: 'none',
              position: 'relative', // For absolute positioning of hover area
              fontSize: '1rem',
              padding: '20px 30px', // Increased padding significantly
              userSelect: 'none'
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20
            }}
          >
            {/* Invisible hover area */}
            <div
              data-hover="true"
              style={{
                position: 'absolute',
                top: '-10px',
                left: '-10px',
                right: '-10px',
                bottom: '-10px',
                zIndex: 1
              }}
            />
            {item}
          </motion.li>
        ))}
      </ul>
    </nav>
  );
}

export default Navigation;