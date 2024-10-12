import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const controls = useAnimation();

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = heroRef.current.getBoundingClientRect();
      const x = (clientX - left) / width;
      const y = (clientY - top) / height;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    controls.start({
      backgroundPosition: `${mousePosition.x * 100}% ${mousePosition.y * 100}%`,
    });
  }, [mousePosition, controls]);

  return (
    <motion.div
      ref={heroRef}
      className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600"
      animate={controls}
      transition={{ type: 'spring', stiffness: 100, damping: 30 }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 text-center text-white">
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Welcome to EventHub
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Discover and create amazing college events
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link
            to="/events"
            className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-indigo-100 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Explore Events
          </Link>
        </motion.div>
      </div>
      <CursorInteractiveBubbles mousePosition={mousePosition} />
    </motion.div>
  );
};

const CursorInteractiveBubbles = ({ mousePosition }) => {
  const bubbles = [
    { size: 100, delay: 0 },
    { size: 80, delay: 0.2 },
    { size: 60, delay: 0.4 },
    { size: 40, delay: 0.6 },
  ];

  return (
    <>
      {bubbles.map((bubble, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full bg-white bg-opacity-10"
          style={{
            width: bubble.size,
            height: bubble.size,
          }}
          animate={{
            x: mousePosition.x * 100,
            y: mousePosition.y * 100,
            scale: [1, 1.1, 1],
          }}
          transition={{
            type: 'spring',
            stiffness: 150,
            damping: 15,
            delay: bubble.delay,
          }}
        />
      ))}
    </>
  );
};

export default Hero;
