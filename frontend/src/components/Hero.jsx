import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Discover Amazing College Events
        </h1>
        <p className="mt-6 max-w-2xl text-xl">
          Join exciting events, meet new people, and make the most of your college experience.
        </p>
        <div className="mt-10">
          <Link
            to="/events"
            className="inline-block bg-white text-indigo-600 px-8 py-3 border border-transparent text-base font-medium rounded-md hover:bg-indigo-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
          >
            Explore Events
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Hero;
