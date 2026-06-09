"use client";

import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default RootLayout;
