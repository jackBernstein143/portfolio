import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMousePosition } from '../hooks/useMousePosition';

const GlitchText = ({ text }) => {
  const mousePosition = useMousePosition();
  const [isHovered, setIsHovered] = useState(false);
  
  const letters = Array.from(text);

  const letterVariants = {
    hover: (i) => ({
      y: Math.sin(i * 0.5) * 10,
      x: Math.cos(i * 0.5) * 10,
      transition: {
        duration: 0.2,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }),
    normal: {
      y: 0,
      x: 0
    }
  };

  return (
    <motion.h1 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        position: 'relative'
      }}
    >
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          variants={letterVariants}
          animate={isHovered ? "hover" : "normal"}
          custom={i}
          style={{
            display: 'inline-block',
            position: 'relative',
            cursor: 'default'
          }}
        >
          {letter}
        </motion.span>
      ))}
    </motion.h1>
  );
};

export default GlitchText; 