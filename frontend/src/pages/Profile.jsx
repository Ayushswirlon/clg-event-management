import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../components/Auth/AuthContext';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import Loader from '../components/Loader';
import { FiEdit2, FiCalendar, FiMapPin } from 'react-icons/fi';
import EditProfile from '../components/EditProfile';

function Profile() {
  const { isAuthenticated, user: contextUser, loading: contextLoading } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditProfile, setShowEditProfile] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isAuthenticated) {
        setError('You must be logged in to view this page.');
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        console.log('Fetching user profile...');
        const response = await axios.get('https://clg-event-management.onrender.com/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
        console.log('User profile received:', response.data);
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load user profile. Please try again.');
        setLoading(false);
      }
    };

    if (!contextLoading) {
      fetchUserProfile();
    }
  }, [isAuthenticated, contextLoading]);

  if (loading || contextLoading) return <Loader />;
  if (error) return <div className="text-center mt-8 text-red-500 dark:text-red-400">{error}</div>;
  if (!user) return <div className="text-center mt-8 text-gray-700 dark:text-gray-300">No user data available.</div>;

  console.log('Rendering profile with user data:', user);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8"
    >
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-32"></div>
        <div className="px-4 py-5 sm:p-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="sm:flex sm:space-x-5">
              <div className="flex-shrink-0">
                <img className="mx-auto h-20 w-20 rounded-full border-4 border-white dark:border-gray-700 -mt-10 shadow-lg" src={user.profilePicture || 'https://via.placeholder.com/80'} alt="" />
              </div>
              <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                <p className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">{user.username}</p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{user.email}</p>
              </div>
            </div>
            <div className="mt-5 sm:mt-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
                onClick={() => setShowEditProfile(true)}
              >
                <FiEdit2 className="mr-2" /> Edit Profile
              </motion.button>
            </div>
          </div>
          <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Bio</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200">{user.bio || 'No bio provided'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200">{user.role}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {user.role === 'collegeEventer' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Created Events</h2>
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {user.createdEvents.map(event => (
                <motion.li 
                  key={event._id}
                  whileHover={{ backgroundColor: 'rgba(243, 244, 246, 0.1)' }}
                >
                  <Link to={`/events/${event._id}`} className="block hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">{event.title}</p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200">
                            <FiCalendar className="mr-1" /> {new Date(event.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <FiMapPin className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                            {event.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Participated Events</h2>
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {user.participatedEvents.map(event => (
              <motion.li 
                key={event._id}
                whileHover={{ backgroundColor: 'rgba(243, 244, 246, 0.1)' }}
              >
                <Link to={`/events/${event._id}`} className="block hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">{event.title}</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200">
                          <FiCalendar className="mr-1" /> {new Date(event.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <FiMapPin className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                          {event.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>

      {showEditProfile && (
        <EditProfile onClose={() => setShowEditProfile(false)} />
      )}
    </motion.div>
  );
}

export default Profile;
