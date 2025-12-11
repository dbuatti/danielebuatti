"use client";

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/SessionContextProvider';

interface ProtectedRouteProps {
  element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Loading state is handled inside SessionContextProvider, but we return the element wrapper here
    return element; 
  }

  if (!user) {
    // Redirect unauthenticated users to the login page (or index page for simplicity)
    return <Navigate to="/" replace />;
  }

  // Render the element (which usually contains an <Outlet /> for nested routes)
  return element;
};

export default ProtectedRoute;