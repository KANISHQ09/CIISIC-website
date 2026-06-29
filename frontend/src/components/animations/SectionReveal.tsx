'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface SectionRevealProps {
  children: React.ReactNode;
  delay?: number;
}

export const SectionReveal: React.FC<SectionRevealProps> = ({ children, delay = 0.1 }) => {
  const shouldReduceMotion = useReducedMotion();

  const variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 1, 0.5, 1] }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

export default SectionReveal;
