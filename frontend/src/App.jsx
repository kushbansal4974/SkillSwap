import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import RoleProtectedRoute from './components/common/RoleProtectedRoute';

// Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import GigDetails from './pages/GigDetails';
import CreateGig from './pages/CreateGig';
import EditGig from './pages/EditGig';
import MyGigs from './pages/MyGigs';
import Bookings from './pages/Bookings';
import CreatorDashboard from './pages/CreatorDashboard';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="explore" element={<Explore />} />
        <Route path="gigs/:id" element={<GigDetails />} />
        <Route path="login" element={<Login />} />
        <Route path="signin" element={<Navigate to="/login" replace />} />
        <Route path="register" element={<Register />} />
        <Route path="signup" element={<Navigate to="/register" replace />} />
        <Route path="profile" element={<Profile />} />

        {/* Creator-Only Routes */}
        <Route
          path="create-gig"
          element={
            <RoleProtectedRoute allowedRole="creator">
              <CreateGig />
            </RoleProtectedRoute>
          }
        />
        <Route path="gigs/create" element={<Navigate to="/create-gig" replace />} />
        <Route
          path="edit-gig/:id"
          element={
            <RoleProtectedRoute allowedRole="creator">
              <EditGig />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="my-gigs"
          element={
            <RoleProtectedRoute allowedRole="creator">
              <MyGigs />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="creator-dashboard"
          element={
            <RoleProtectedRoute allowedRole="creator">
              <CreatorDashboard />
            </RoleProtectedRoute>
          }
        />

        {/* Client-Only Routes */}
        <Route
          path="bookings"
          element={
            <RoleProtectedRoute allowedRole="client">
              <Bookings />
            </RoleProtectedRoute>
          }
        />

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
