import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventParticipants } from '../api/events';
import { AuthContext } from '../components/Auth/AuthContext'; // Adjust the import path as needed
import Loader from '../components/Loader';

function EventParticipants() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login'); // Redirect to login page if user is not authenticated
      return;
    }

    async function fetchParticipants() {
      try {
        setLoading(true);
        console.log('Fetching participants for event ID:', id);
        const participantsData = await getEventParticipants(id);
        console.log('Received participants data:', participantsData);
        setParticipants(participantsData);
      } catch (err) {
        setError('Failed to fetch participants. Please try again later.');
        console.error('Error fetching participants:', err);
        if (err.response) {
          console.error('Response status:', err.response.status);
          console.error('Response data:', err.response.data);
          if (err.response.status === 401) {
            // Handle unauthorized access (e.g., redirect to login)
            navigate('/login');
          }
        }
      } finally {
        setLoading(false);
      }
    }
    fetchParticipants();
  }, [id, user, navigate]);

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
