import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import RoleProtectedRoute from './components/common/RoleProtectedRoute';

// Pages for the 5 Required Features
import Home from './pages/Home';
import Explore from './pages/Explore';
import GigDetails from './pages/GigDetails';
import CreateGig from './pages/CreateGig';
import CreatorDashboard from './pages/CreatorDashboard';
import Bookings from './pages/Bookings';
import NotFound from './pages/NotFound';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Core Marketplace Navigation */}
        <Route index element={<Home />} />
        
        {/* Feature 2: Browse & Search */}
        <Route path="explore" element={<Explore />} />
        
        {/* Feature 3: Book a Gig (Form & Confirmation) */}
        <Route path="gigs/:id" element={<GigDetails />} />
        
        {/* Feature 1: Post a Gig */}
        <Route path="create-gig" element={<CreateGig />} />
        <Route path="gigs/create" element={<Navigate to="/create-gig" replace />} />

        {/* Feature 4: Creator Dashboard (Incoming bookings, Accept/Decline) */}
        <Route path="creator-dashboard" element={<CreatorDashboard />} />
        <Route path="dashboard" element={<Navigate to="/creator-dashboard" replace />} />
        <Route path="my-gigs" element={<Navigate to="/creator-dashboard" replace />} />

        {/* Feature 5: My Bookings (Status: Pending, Accepted, Declined) */}
        <Route path="bookings" element={<Bookings />} />
        <Route path="my-bookings" element={<Navigate to="/bookings" replace />} />

        {/* Zero-Auth Hackathon Compliance: Redirect auth paths to explore */}
        <Route path="login" element={<Navigate to="/explore" replace />} />
        <Route path="signin" element={<Navigate to="/explore" replace />} />
        <Route path="register" element={<Navigate to="/explore" replace />} />
        <Route path="signup" element={<Navigate to="/explore" replace />} />
        <Route path="profile" element={<Navigate to="/creator-dashboard" replace />} />

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
