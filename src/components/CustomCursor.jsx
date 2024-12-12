import React from 'react';
import { motion } from 'framer-motion';

const CustomCursor = ({ mousePosition }) => {
  const [isHovering, setIsHovering] = React.useState(false);
  const cursorSize = 20; // Diameter of cursor
  const cursorOffset = cursorSize / 2; // Half the size for centering

  React.useEffect(() => {
    const handleMouseOver = (e) => {
      if (e.target.classList.contains('text-link') || 
          e.target.hasAttribute('data-hover')) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = (e) => {
      if (e.target.classList.contains('text-link') || 
          e.target.hasAttribute('data-hover')) {
        setIsHovering(false);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <motion.div
      animate={{
        x: mousePosition.x - cursorOffset,
        y: mousePosition.y - cursorOffset,
        scale: isHovering ? 2.5 : 1
      }}
      transition={{
        type: "tween", // Changed to tween for more precise movement
        duration: 0.1
      }}
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 99999,
        width: `${cursorSize}px`,
        height: `${cursorSize}px`,
        backgroundColor: 'rgba(255, 0, 0, 0.3)',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)', // Center the cursor on the point
        top: 0,
        left: 0
      }}
    />
  );
};

export default CustomCursor;