import React, { useEffect, useRef, useState } from 'react';
import { Route } from 'react-router-dom';
// import './Hero.css';/

const Hero = () => {
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const lastMousePosition = useRef({ x: 0, y: 0 });
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const hero = heroRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = hero.clientWidth;
      canvas.height = hero.clientHeight;
    };

    const drawGrid = (offsetX, offsetY) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(75, 85, 99, 0.3)';
      ctx.lineWidth = 1;

      const gridSize = 40;
      const cols = Math.ceil(canvas.width / gridSize) + 1;
      const rows = Math.ceil(canvas.height / gridSize) + 1;

      for (let i = 0; i < cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize + offsetX, 0);
        ctx.lineTo(i * gridSize + offsetX, canvas.height);
        ctx.stroke();
      }

      for (let i = 0; i < rows; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize + offsetY);
        ctx.lineTo(canvas.width, i * gridSize + offsetY);
        ctx.stroke();
      }
    };

    const animate = () => {
      time += 0.005;
      let offsetX, offsetY;

      if (isMouseMoving) {
        offsetX = (mousePosition.current.x - canvas.width / 2) * 0.05;
        offsetY = (mousePosition.current.y - canvas.height / 2) * 0.05;
      } else {
        offsetX = Math.cos(time) * 20;
        offsetY = Math.sin(time) * 20;
      }

      drawGrid(offsetX, offsetY);
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePosition.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };

      if (
        Math.abs(mousePosition.current.x - lastMousePosition.current.x) > 1 ||
        Math.abs(mousePosition.current.y - lastMousePosition.current.y) > 1
      ) {
        setIsMouseMoving(true);
        lastMousePosition.current = { ...mousePosition.current };

        clearTimeout(mouseTimeout);
        mouseTimeout = setTimeout(() => setIsMouseMoving(false), 100);
      }
    };

    let mouseTimeout;

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    hero.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      hero.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(mouseTimeout);
    };
  }, [isMouseMoving]);

  return (
    <section 
      ref={heroRef} 
      className="relative bg-gray-900 text-white min-h-screen flex items-center justify-center overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none"></canvas>
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl sm:text-6xl font-bold mb-6">Welcome to Our Event Platform</h1>
        <p className="text-xl sm:text-2xl mb-10">Discover and join amazing events in your area</p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <a  href="/" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
            Explore Events
          </a>
          <a href="/create" className="bg-transparent hover:bg-blue-500 text-blue-500 hover:text-white font-bold py-3 px-6 rounded-lg border border-blue-500 hover:border-transparent transition duration-300">
            Create Event
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
