import axios from 'axios';

const API_URL = 'http://localhost:5000/api/events';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getEvents = async (timestamp) => {
  try {
    const response = await axios.get(`${API_URL}?t=${timestamp}`);
    console.log('Raw API response:', response.data);
    const events = response.data.events || response.data; // Handle both possible structures
    console.log('Events being returned from getEvents:', events);
    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const createEvent = async (eventData) => {
  try {
    const response = await axios.post(API_URL, eventData, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const getEventById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

export const joinEvent = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/${id}/join`, {}, { 
      headers: getAuthHeader(),
    });
    console.log('Join event response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error joining event:', error.response?.data || error.message);
    throw error;
  }
};

export const getEventParticipants = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}/participants`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error fetching event participants:', error);
    throw error;
  }
};
