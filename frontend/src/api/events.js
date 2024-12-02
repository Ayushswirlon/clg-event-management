import axios from './axiosConfig';

const API_URL = 'https://clg-event-management.onrender.com/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getEvents = async (timestamp) => {
  try {
    console.log('Fetching events from:', `${API_URL}/events?t=${timestamp}`);
    const response = await axios.get(`${API_URL}/events`, {
      params: { t: timestamp }
    });
    console.log('Received events:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
};

export const createEvent = async (eventData) => {
  try {
    const response = await axios.post(API_URL, eventData, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error.response || error);
    throw error;
  }
};

export const getEventById = async (id) => {
  try {
    console.log('Sending request to:', `${API_URL}/events/${id}`);
    const response = await axios.get(`${API_URL}/events/${id}`);
    console.log('Received response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in getEventById:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
};

export const joinEvent = async (eventId, applicationData) => {
  try {
    console.log('Joining event:', `/events/${eventId}/join`);
    const response = await axios.post(`/events/${eventId}/join`, applicationData);
    console.log('Join event response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error joining event:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
};

export const getEventParticipants = async (eventId) => {
  try {
    console.log('Fetching event participants:', `/events/${eventId}/participants`);
    const response = await axios.get(`/events/${eventId}/participants`);
    console.log('Event participants response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching event participants:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
};
