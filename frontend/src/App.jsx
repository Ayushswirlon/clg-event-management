import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./components/Auth/AuthContext.jsx";
import Layout from "./components/Layout/Layout.jsx";
import EventList from "./components/Events/EventList.jsx";
import EventForm from "./components/Events/EventForm.jsx";
import EventDetails from "./components/Events/EventDetails.jsx";
import EventParticipants from "./pages/EventParticipants.jsx";
import EventApplication from "./pages/EventApplication.jsx";
import Auth from "./components/auth.jsx";
import Profile from "./pages/Profile.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<EventList />} />
            <Route path="/create" element={<EventForm />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route
              path="/events/:id/participants"
              element={<EventParticipants />}
            />
            <Route path="/events/:id/apply" element={<EventApplication />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
