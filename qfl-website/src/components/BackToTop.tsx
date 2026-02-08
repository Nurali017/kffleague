'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion } from 'motion/react';
import { buttonVisibility } from '@/lib/motion';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <motion.button
      onClick={scrollToTop}
      aria-label="Наверх"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={buttonVisibility}
      whileHover={{ scale: 1.1, backgroundColor: '#E5B73B' }}
      whileTap={{ scale: 0.95 }}
      className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-primary text-white shadow-lg flex items-center justify-center ${
        !isVisible ? 'pointer-events-none' : ''
      }`}
    >
      <ArrowUp className="w-5 h-5" />
    </motion.button>
  );
}
