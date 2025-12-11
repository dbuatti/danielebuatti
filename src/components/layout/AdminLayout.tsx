"use client";

import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { LogOut, FileText, List, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/SessionContextProvider';

const AdminLayout: React.FC = () => {
  const { user } = useAuth();

  const handleLogout = async () => {
    // Implement logout logic here if needed, or rely on SessionContextProvider
    // For now, we'll just log out via the client
    // await supabase.auth.signOut(); 
    console.log('User logged out.');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md p-4 flex flex-col">
        <h1 className="text-2xl font-bold text-brand-primary mb-8">Admin Dashboard</h1>
        <nav className="flex-grow space-y-2">
          <Link to="/admin/quotes" className="flex items-center p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <List className="h-5 w-5 mr-3" />
            Quotes
          </Link>
          <Link to="/admin/drafts" className="flex items-center p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <FileText className="h-5 w-5 mr-3" />
            Drafts
          </Link>
          <Link to="/admin/quote-builder" className="flex items-center p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <PlusCircle className="h-5 w-5 mr-3" />
            New Quote
          </Link>
        </nav>
        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Logged in as: {user?.email}</p>
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;