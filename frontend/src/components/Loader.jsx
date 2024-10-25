import React from 'react';
import { motion } from 'framer-motion';

const LoaderDot = ({ delay }) => (
  <motion.div
    className="w-3 h-3 bg-blue-500 rounded-full"
    animate={{
      scale: [1, 1.5, 1],
      opacity: [0.5, 1, 0.5]
    }}
    transition={{
      duration: 1,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut"
    }}
  />
);

function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
      <div className="flex space-x-2">
        <LoaderDot delay={0} />
        <LoaderDot delay={0.2} />
        <LoaderDot delay={0.4} />
      </div>
    </div>
  );
}

export default Loader;
