import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiMoon, FiSun } from 'react-icons/fi';
import Footer from './Footer';
import Hero from './Hero';

function Layout({ children }) {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <nav className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <motion.span 
                  className="text-2xl font-bold text-primary-600 dark:text-primary-400"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  EventHub
                </motion.span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
              <NavLink to="/">Events</NavLink>
              <NavLink to="/create">Create Event</NavLink>
              {isAuthenticated ? (
                <>
                  <NavLink to="/profile">Profile</NavLink>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={logout}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition duration-150 ease-in-out"
                  >
                    Sign out
                  </motion.button>
                </>
              ) : (
                <NavLink to="/auth" className="btn">Sign In</NavLink>
              )}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                {darkMode ? <FiSun /> : <FiMoon />}
              </motion.button>
            </div>
            <div className="sm:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                {isMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <motion.div 
            className="sm:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <MobileNavLink to="/">Events</MobileNavLink>
              <MobileNavLink to="/create">Create Event</MobileNavLink>
              {isAuthenticated ? (
                <>
                  <MobileNavLink to="/profile">Profile</MobileNavLink>
                  <button onClick={logout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300">
                    Sign out
                  </button>
                </>
              ) : (
                <MobileNavLink to="/auth">Sign In</MobileNavLink>
              )}
            </div>
          </motion.div>
        )}
      </nav>

      {location.pathname === '/' && <Hero />}

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      <Footer />
    </div>
  );
}

const NavLink = ({ to, children, className }) => (
  <Link
    to={to}
    className={`px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150 ease-in-out ${className}`}
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, children }) => (
  <Link
    to={to}
    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150 ease-in-out"
  >
    {children}
  </Link>
);

export default Layout;
