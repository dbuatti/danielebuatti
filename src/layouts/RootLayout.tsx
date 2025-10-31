"use client";

import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';

const RootLayout: React.FC = () => {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
};

export default RootLayout;