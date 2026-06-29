'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface FadeProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

export const FadeLeft: React.FC<FadeProps> = ({ children, delay = 0, duration = 0.5 }) => {
  const shouldReduceMotion = useReducedMotion();

  const variants = {
    hidden: { opacity: 0, x: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration, delay, ease: [0.215, 0.61, 0.355, 1] }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

export default FadeLeft;
