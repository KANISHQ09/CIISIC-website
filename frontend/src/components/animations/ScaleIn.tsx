'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface ScaleProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

export const ScaleIn: React.FC<ScaleProps> = ({ children, delay = 0, duration = 0.5 }) => {
  const shouldReduceMotion = useReducedMotion();

  const variants = {
    hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 },
    visible: { opacity: 1, scale: 1 }
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

export default ScaleIn;
