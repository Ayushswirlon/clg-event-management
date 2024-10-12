import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getEventParticipants } from '../api/events';
import Loader from './Loader';

function EventParticipants() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    async function fetchParticipants() {
      try {
        setLoading(true);
        const participantsData = await getEventParticipants(id);
        setParticipants(participantsData);
      } catch (err) {
        setError('Failed to fetch participants. Please try again later.');
        console.error('Error fetching participants:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchParticipants();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Event Participants</h2>
        <ul className="divide-y divide-gray-200">
          {participants.map((participant) => (
            <li key={participant._id} className="py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <img className="h-8 w-8 rounded-full" src={participant.profilePicture || 'https://via.placeholder.com/40'} alt="" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{participant.username}</p>
                  <p className="text-sm text-gray-500 truncate">{participant.email}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default EventParticipants;
