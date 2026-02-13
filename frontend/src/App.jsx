import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/authContext';

import Home from "./pages/Home";
import UserSignUp from './pages/Auth/UserSignUp';
import UserSignIn from './pages/Auth/UserSignIn';
import AdminSignIn from './pages/Auth/adminSignIn';
import AdminSignUp from './pages/Auth/adminSignUp';

import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/common/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1a2e',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/userSignUp" element={<UserSignUp />} />
        <Route path="/userSignIn" element={<UserSignIn />} />
        <Route path="/adminSignUp" element={<AdminSignUp />} />
        <Route path="/adminSignIn" element={<AdminSignIn />} />

        {/* Protected User Routes */}
        <Route 
          path="/userDashboard" 
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected Admin Routes */}
        <Route 
          path="/adminDashboard" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AuthProvider>
  );
};

export default App;
