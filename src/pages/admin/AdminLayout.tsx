"use client";

import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { useSession } from '@/components/SessionContextProvider';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, FileText, Home, Music, MailOpen, Gift, ClipboardList } from 'lucide-react'; // NEW: Import Gift and ClipboardList icons
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from 'next-themes';
import DynamicImage from '@/components/DynamicImage';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const AdminLayout: React.FC = () => {
  const { user, isLoading } = useSession();
  const navigate = useNavigate();
  const location = useLocation(); // Initialize useLocation
  const { theme } = useTheme();

  const brandSymbolSrc = theme === "dark" ? "/logo-pinkwhite.png" : "/blue-pink-ontrans.png";
  const textLogoSrc = theme === "dark" ? "/logo-white-trans-45.png" : "/logo-dark-blue-transparent-25.png";

  if (isLoading) {
    return null; // Loading state is handled by SessionContextProvider
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-light dark:bg-brand-dark-alt border-r border-brand-secondary/50 p-6 flex flex-col shadow-lg">
        <div className="flex flex-col items-center mb-8">
          <DynamicImage
            src={brandSymbolSrc}
            alt="Daniele Buatti Brand Symbol"
            className="h-10 w-auto mb-2"
            width={40}
            height={40}
          />
          <DynamicImage
            src={textLogoSrc}
            alt="Daniele Buatti Logo"
            className="h-14 w-auto"
            width={220}
            height={56}
          />
          <h2 className="text-xl font-bold text-brand-primary mt-4">Admin Panel</h2>
        </div>
        <nav className="flex-grow space-y-2">
          <Link to="/admin" className={cn(
            "flex items-center gap-3 p-3 rounded-md text-brand-dark dark:text-brand-light hover:bg-brand-secondary/20 dark:hover:bg-brand-dark/50 transition-colors",
            location.pathname === '/admin' ? 'bg-brand-secondary/30 dark:bg-brand-dark/60 font-semibold text-brand-primary' : ''
          )}>
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
          <Link to="/admin/quotes" className={cn(
            "flex items-center gap-3 p-3 rounded-md text-brand-dark dark:text-brand-light hover:bg-brand-secondary/20 dark:hover:bg-brand-dark/50 transition-colors",
            location.pathname.startsWith('/admin/quotes') ? 'bg-brand-secondary/30 dark:bg-brand-dark/60 font-semibold text-brand-primary' : ''
          )}>
            <FileText className="h-5 w-5" />
            Quotes
          </Link>
          <Link to="/admin/ameb-bookings" className={cn(
            "flex items-center gap-3 p-3 rounded-md text-brand-dark dark:text-brand-light hover:bg-brand-secondary/20 dark:hover:bg-brand-dark/50 transition-colors",
            location.pathname.startsWith('/admin/ameb-bookings') ? 'bg-brand-secondary/30 dark:bg-brand-dark/60 font-semibold text-brand-primary' : ''
          )}>
            <Music className="h-5 w-5" /> {/* Using Music icon for AMEB */}
            AMEB Bookings
          </Link>
          <Link to="/admin/email-templates" className={cn(
            "flex items-center gap-3 p-3 rounded-md text-brand-dark dark:text-brand-light hover:bg-brand-secondary/20 dark:hover:bg-brand-dark/50 transition-colors",
            location.pathname.startsWith('/admin/email-templates') ? 'bg-brand-secondary/30 dark:bg-brand-dark/60 font-semibold text-brand-primary' : ''
          )}>
            <MailOpen className="h-5 w-5" />
            Email Templates
          </Link>
          <Link to="/admin/gift-cards" className={cn(
            "flex items-center gap-3 p-3 rounded-md text-brand-dark dark:text-brand-light hover:bg-brand-secondary/20 dark:hover:bg-brand-dark/50 transition-colors",
            location.pathname.startsWith('/admin/gift-cards') ? 'bg-brand-secondary/30 dark:bg-brand-dark/60 font-semibold text-brand-primary' : ''
          )}>
            <Gift className="h-5 w-5" /> {/* NEW: Gift Cards Link */}
            Gift Cards
          </Link>
          <Link to="/admin/job-decision-filter" className={cn(
            "flex items-center gap-3 p-3 rounded-md text-brand-dark dark:text-brand-light hover:bg-brand-secondary/20 dark:hover:bg-brand-dark/50 transition-colors",
            location.pathname.startsWith('/admin/job-decision-filter') ? 'bg-brand-secondary/30 dark:bg-brand-dark/60 font-semibold text-brand-primary' : ''
          )}>
            <ClipboardList className="h-5 w-5" /> {/* NEW: Job Decision Filter Link */}
            Job Decision Filter
          </Link>
        </nav>
        <div className="mt-auto space-y-2">
          <Separator className="bg-brand-secondary/50 my-4" />
          <Button asChild variant="ghost" className="w-full justify-start text-brand-dark dark:text-brand-light hover:bg-brand-secondary/20 dark:hover:bg-brand-dark/50">
            <Link to="/">
              <Home className="h-5 w-5 mr-3" />
              Back to Site
            </Link>
          </Button>
          <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-red-500 hover:bg-red-500/10 dark:hover:bg-red-500/20">
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-brand-light dark:bg-brand-dark border-b border-brand-secondary/50 p-4 shadow-sm flex items-center justify-between">
          <h1 className="text-2xl font-bold text-brand-dark dark:text-brand-light">
            {location.pathname === '/admin' ? 'Admin Dashboard' :
             location.pathname.startsWith('/admin/quotes') ? 'Quotes' :
             location.pathname.startsWith('/admin/ameb-bookings') ? 'AMEB Bookings' :
             location.pathname.startsWith('/admin/email-templates') ? 'Email Templates' :
             location.pathname.startsWith('/admin/gift-cards') ? 'Gift Cards' :
             location.pathname.startsWith('/admin/job-decision-filter') ? 'Job Decision Filter' : 'Admin'} {/* NEW: Update header for Job Decision Filter */}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-brand-dark/80 dark:text-brand-light/80 text-sm">
              Logged in as: <strong className="text-brand-primary">{user?.email}</strong>
            </span>
          </div>
        </header>
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet /> {/* Renders child routes */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;