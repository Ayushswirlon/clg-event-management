import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../components/Auth/AuthContext";
import axios from "axios";
import { motion } from "framer-motion";
import { FiUpload, FiBell, FiCheck } from "react-icons/fi";
import Loader from "../components/Loader";

function EventManagement() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [notification, setNotification] = useState("");
  const [documents, setDocuments] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchManagedEvents();
  }, []);

  const fetchManagedEvents = async () => {
    try {
      const response = await axios.get("/api/events/managed-events", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEvents(response.data);
    } catch (error) {
      setError("Failed to fetch managed events");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceUpdate = async (eventId, participantId, status) => {
    try {
      await axios.post(
        `/api/events/${eventId}/attendance`,
        {
          attendees: [{ participant: participantId, status }],
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchManagedEvents();
    } catch (error) {
      setError("Failed to update attendance");
    }
  };

  const handleDocumentUpload = async (eventId) => {
    const formData = new FormData();
    documents.forEach((doc) => formData.append("documents", doc));

    try {
      await axios.post(`/api/events/${eventId}/documents`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setDocuments([]);
      fetchManagedEvents();
    } catch (error) {
      setError("Failed to upload documents");
    }
  };

  const handleNotificationSend = async (eventId) => {
    try {
      await axios.post(
        `/api/events/${eventId}/notifications`,
        {
          message: notification,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setNotification("");
      fetchManagedEvents();
    } catch (error) {
      setError("Failed to send notification");
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold mb-6">Event Management</h2>

      <div className="grid grid-cols-1 gap-6">
        {events.map((event) => (
          <motion.div
            key={event._id}
            className="bg-white p-6 rounded-lg shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-xl font-semibold mb-4">{event.title}</h3>
            <p className="text-gray-600 mb-4">
              Date: {new Date(event.date).toLocaleDateString()}
            </p>

            {/* Attendance Section */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">Attendance</h4>
              <div className="space-y-2">
                {event.participants?.map((participant) => (
                  <div
                    key={participant._id}
                    className="flex items-center justify-between"
                  >
                    <span>{participant.username}</span>
                    <div className="space-x-2">
                      <button
                        onClick={() =>
                          handleAttendanceUpdate(
                            event._id,
                            participant._id,
                            "present"
                          )
                        }
                        className="px-3 py-1 bg-green-500 text-white rounded"
                      >
                        Present
                      </button>
                      <button
                        onClick={() =>
                          handleAttendanceUpdate(
                            event._id,
                            participant._id,
                            "absent"
                          )
                        }
                        className="px-3 py-1 bg-red-500 text-white rounded"
                      >
                        Absent
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Document Upload Section */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">Documents</h4>
              <input
                type="file"
                multiple
                onChange={(e) => setDocuments(Array.from(e.target.files))}
                className="mb-2"
              />
              <button
                onClick={() => handleDocumentUpload(event._id)}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded"
              >
                <FiUpload className="mr-2" /> Upload Documents
              </button>
            </div>

            {/* Notification Section */}
            <div>
              <h4 className="font-medium mb-2">Send Notification</h4>
              <textarea
                value={notification}
                onChange={(e) => setNotification(e.target.value)}
                className="w-full p-2 border rounded mb-2"
                placeholder="Enter notification message..."
              />
              <button
                onClick={() => handleNotificationSend(event._id)}
                className="flex items-center px-4 py-2 bg-purple-500 text-white rounded"
              >
                <FiBell className="mr-2" /> Send Notification
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default EventManagement;
