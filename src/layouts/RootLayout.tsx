"use client";

import React from 'react';
import { Outlet, ScrollRestoration, useLocation, useNavigationType } from 'react-router-dom';

const RootLayout: React.FC = () => {
  const location = useLocation();
  const navigationType = useNavigationType();

  // Custom scroll restoration logic:
  // We only want to restore scroll position if the user is navigating back/forward (POP).
  // For new navigations (PUSH/REPLACE), we want to scroll to the top (0, 0).
  // By returning a unique key for PUSH/REPLACE, we tell ScrollRestoration to save a new position (0, 0).
  // By returning the same key for POP, we tell ScrollRestoration to restore the saved position.
  const getKey = (prevLocation: any, currentLocation: any) => {
    if (navigationType === 'POP') {
      // When navigating back/forward, use the location key to restore position
      return currentLocation.key;
    }
    // For new navigations (PUSH/REPLACE), use a unique key to ensure scroll starts at 0
    return location.pathname;
  };

  return (
    <>
      <ScrollRestoration getKey={getKey} />
      <Outlet />
    </>
  );
};

export default RootLayout;