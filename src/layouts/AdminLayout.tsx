"use client";

import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  Mail, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';
import { cn } from '@/lib/utils';

const AdminLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error('Error signing out:', error);
      showError(`Error signing out: ${error.message || 'Unknown error'}`);
    }
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      name: 'Quotes',
      href: '/admin/quotes',
      icon: FileText,
    },
    {
      name: 'AMEB Bookings',
      href: '/admin/ameb-bookings',
      icon: Calendar,
    },
    {
      name: 'Email Templates',
      href: '/admin/email-templates',
      icon: Mail,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-brand-dark text-brand-light transition-transform duration-300 ease-in-out transform lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-brand-dark-alt">
          <div className="flex items-center">
            <div className="bg-brand-primary w-8 h-8 rounded-md flex items-center justify-center">
              <span className="font-bold text-brand-light">DB</span>
            </div>
            <span className="ml-3 text-xl font-bold">Admin Panel</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-brand-light"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive 
                      ? "bg-brand-primary text-brand-light" 
                      : "text-brand-light hover:bg-brand-dark-alt"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 bg-brand-light dark:bg-brand-dark border-b border-brand-secondary/20 lg:hidden">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="text-lg font-bold">Admin Panel</div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </header>

        <header className="hidden lg:flex items-center justify-between px-6 py-4 bg-brand-light dark:bg-brand-dark border-b border-brand-secondary/20">
          <div>
            <h1 className="text-2xl font-bold text-brand-dark dark:text-brand-light">Admin Dashboard</h1>
            <p className="text-sm text-brand-dark/80 dark:text-brand-light/80">
              Logged in as: {user?.email}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-brand-dark dark:text-brand-light">
              Welcome, {user?.email}!
            </span>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="border-brand-secondary/50 text-brand-dark dark:text-brand-light hover:bg-brand-secondary/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-brand-light dark:bg-brand-dark">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;