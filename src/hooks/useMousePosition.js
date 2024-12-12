import { useState, useEffect } from 'react';

export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    console.log('Mouse position hook initialized'); // Debug log

    const updateMousePosition = (e) => {
      const pos = { x: e.clientX, y: e.clientY };
      console.log('Mouse moved:', pos); // Debug log
      setMousePosition(pos);
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return mousePosition;
};
