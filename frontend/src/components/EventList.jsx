import React, { useState, useEffect } from 'react';
import { getEvents } from '../api/events';
import { Link } from 'react-router-dom';
import Hero from './Hero';
import Loader from './Loader';

function EventList() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
    // Refresh events every 5 minutes
    const intervalId = setInterval(fetchEvents, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const timestamp = new Date().getTime();
      const eventsData = await getEvents(timestamp);
      setEvents(Array.isArray(eventsData) ? eventsData : []);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <div className="text-center py-10 text-2xl text-red-600">{error}</div>;

  return (
    <>
      <Hero />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Upcoming Events</h2>
        {events.length === 0 ? (
          <p className="text-xl text-gray-600">No events found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event._id} className="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105">
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-2 text-indigo-600">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500"><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-500"><strong>Location:</strong> {event.location}</p>
                    <p className="text-sm text-gray-500"><strong>Capacity:</strong> {event.capacity}</p>
                  </div>
                  <Link
                    to={`/events/${event._id}/apply`}
                    className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors duration-300 ease-in-out transform hover:-translate-y-1"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default EventList;
