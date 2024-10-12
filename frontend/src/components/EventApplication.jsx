import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById, joinEvent } from '../api/events';
import { AuthContext } from './AuthContext';
import { motion } from 'framer-motion';
import Loader from './Loader';

function EventApplication() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applicationData, setApplicationData] = useState({
    name: '',
    email: '',
    reason: '',
  });
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEvent() {
      try {
        setLoading(true);
        const eventData = await getEventById(id);
        setEvent(eventData);
      } catch (err) {
        setError('Failed to fetch event details. Please try again later.');
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [id]);

  const handleInputChange = (e) => {
    setApplicationData({ ...applicationData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await joinEvent(id, applicationData);
      console.log('Application submitted successfully:', response);
      alert('Application submitted successfully!');
      navigate(`/events/${id}`);
    } catch (error) {
      console.error('Error submitting application:', error);
      setError(error.response?.data?.message || 'Failed to submit application. Please try again.');
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!event) return <div className="text-center">No event found.</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden"
    >
      <div className="px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">{event.title} - Application</h2>
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Event Details</h3>
          <p className="text-gray-600 dark:text-gray-400"><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
          <p className="text-gray-600 dark:text-gray-400"><strong>Location:</strong> {event.location}</p>
          <p className="text-gray-600 dark:text-gray-400"><strong>Capacity:</strong> {event.capacity}</p>
          <p className="text-gray-600 dark:text-gray-400"><strong>Description:</strong> {event.description}</p>
        </div>

        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Application Form</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={applicationData.name}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={applicationData.email}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason for Applying</label>
            <textarea
              id="reason"
              name="reason"
              value={applicationData.reason}
              onChange={handleInputChange}
              required
              rows="4"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            ></textarea>
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            Submit Application
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}

export default EventApplication;