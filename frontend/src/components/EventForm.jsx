import React, { useState, useContext } from 'react';
import { createEvent } from '../api/events';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiUsers, FiFileText, FiType } from 'react-icons/fi';

function EventForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('You must be logged in to create an event.');
      return;
    }

    if (user.role !== 'collegeEventer') {
      setError('Only college event organizers can create events.');
      return;
    }

    try {
      const newEvent = await createEvent({ title, description, date, location, capacity: parseInt(capacity) });
      console.log('Event created successfully:', newEvent);
      navigate('/');
    } catch (error) {
      console.error('Error creating event:', error);
      setError('An error occurred while creating the event. Please try again.');
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };

  if (!user) {
    return <div className="text-center text-red-500">Please log in to create an event.</div>;
  }

  if (user.role !== 'collegeEventer') {
    return <div className="text-center text-red-500">Only college event organizers can create events.</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden"
    >
      <div className="px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Create New Event</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiType className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white dark:border-gray-600"
                placeholder="Event Title"
              />
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 pt-2 flex items-start pointer-events-none">
                <FiFileText className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white dark:border-gray-600"
                placeholder="Event Description"
              />
            </div>
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white dark:border-gray-600"
              />
            </div>
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white dark:border-gray-600"
                placeholder="Event Location"
              />
            </div>
          </div>
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Capacity</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUsers className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="capacity"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                required
                min="1"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white dark:border-gray-600"
                placeholder="Event Capacity"
              />
            </div>
          </div>
          <div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              Create Event
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default EventForm;
