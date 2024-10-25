import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEventById, joinEvent } from '../../api/events.js';
import { AuthContext } from '../Auth/AuthContext.jsx';
import Loader from '../Loader';

function EventDetails() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function fetchEvent() {
      try {
        setLoading(true);
        console.log('Fetching event with ID:', id);
        const eventData = await getEventById(id);
        console.log('Received event data:', eventData);
        setEvent(eventData);
      } catch (err) {
        setError('Failed to fetch event details. Please try again later.');
        console.error('Error fetching event:', err);
        if (err.response) {
          console.error('Response status:', err.response.status);
          console.error('Response data:', err.response.data);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [id]);

  const handleJoinEvent = async () => {
    try {
      await joinEvent(id);
      // Refresh event data after joining
      const updatedEvent = await getEventById(id);
      setEvent(updatedEvent);
    } catch (error) {
      setError('Failed to join the event. Please try again.');
      console.error('Error joining event:', error);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!event) return <div>No event found.</div>;

  const isParticipant = event.participants.some(participant => participant._id === user?._id);
  const isOrganizer = event.organizer._id === user?._id;

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {/* ... existing event details ... */}
          <div className="px-4 py-5 sm:p-6">
            {user && !isParticipant && !isOrganizer && (
              <button
                onClick={handleJoinEvent}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Join Event
              </button>
            )}
            {isParticipant && (
              <p className="text-green-600">You are participating in this event</p>
            )}
            {isOrganizer && (
              <Link
                to={`/events/${event._id}/participants`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                View Participants
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
