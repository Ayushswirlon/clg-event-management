import React, { useState, useEffect } from 'react';
import { getEvents } from '../../api/events';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Loader from '../Loader';
import SearchBar from '../SearchBar';

function EventList() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, filter]);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const timestamp = new Date().getTime();
      console.log('Fetching events with timestamp:', timestamp);
      const eventsData = await getEvents(timestamp);
      console.log('Received events data:', eventsData);
      setEvents(Array.isArray(eventsData) ? eventsData : []);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again later.');
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (filter !== 'all') {
      filtered = filtered.filter(event => event.category === filter);
    }

    setFilteredEvents(filtered);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  if (isLoading) return <Loader />;
  if (error) return <div className="text-center py-10 text-2xl text-red-600">{error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-8">Upcoming Events</h2>
      
      <SearchBar onSearch={handleSearch} />

      <div className="mb-6">
        <label htmlFor="category-filter" className="mr-2">Filter by category:</label>
        <select
          id="category-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-2 py-1 border rounded"
        >
          <option value="all">All</option>
          <option value="academic">Academic</option>
          <option value="social">Social</option>
          <option value="sports">Sports</option>
        </select>
      </div>

      {filteredEvents.length === 0 ? (
        <p className="text-xl text-gray-600 dark:text-gray-400">No events found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <motion.div
              key={event._id}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105"
              whileHover={{ y: -5 }}
            >
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2 text-indigo-600 dark:text-indigo-400">{event.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{event.description}</p>
                <div className="mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400"><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400"><strong>Location:</strong> {event.location}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400"><strong>Capacity:</strong> {event.capacity}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400"><strong>Category:</strong> {event.category}</p>
                </div>
                <Link
                  to={`/events/${event._id}/apply`}
                  className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors duration-300 ease-in-out transform hover:-translate-y-1"
                >
                  Apply Now
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default EventList;
