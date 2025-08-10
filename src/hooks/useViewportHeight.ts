import { useEffect, useState } from 'react';

/**
 * Custom hook to handle viewport height on mobile devices,
 * especially iOS Safari where the viewport height changes when
 * the address bar appears/disappears
 */
export const useViewportHeight = () => {
  const [vh, setVh] = useState<number>(0);

  useEffect(() => {
    // Only run on client side to avoid hydration mismatch
    if (typeof window === 'undefined') return;

    const updateVh = () => {
      const newVh = window.innerHeight * 0.01;
      setVh(newVh);
      document.documentElement.style.setProperty('--vh', `${newVh}px`);
    };

    // Set initial value
    updateVh();

    // Add event listeners
    window.addEventListener('resize', updateVh);
    window.addEventListener('orientationchange', updateVh);

    // iOS Safari specific events
    window.addEventListener('scroll', updateVh);
    
    return () => {
      window.removeEventListener('resize', updateVh);
      window.removeEventListener('orientationchange', updateVh);
      window.removeEventListener('scroll', updateVh);
    };
  }, []);

  return vh;
};
