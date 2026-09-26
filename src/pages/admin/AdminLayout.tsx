import React, { Suspense } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSession } from '@/components/SessionContextProvider';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, FileText, Home, Music, MailOpen, Gift, ClipboardList, Users, ShoppingBag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from 'next-themes';
import DynamicImage from '@/components/DynamicImage';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import PageLoader from '@/components/PageLoader';
import { usePageMeta } from "@/hooks/use-page-meta";

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/leads', label: 'Leads', icon: Users },
  { to: '/admin/quotes', label: 'Quotes', icon: FileText },
  { to: '/admin/store', label: 'Store', icon: ShoppingBag },
  { to: '/admin/ameb-bookings', label: 'AMEB Bookings', icon: Music },
  { to: '/admin/email-templates', label: 'Email Templates', icon: MailOpen },
  { to: '/admin/gift-cards', label: 'Gift Cards', icon: Gift },
  { to: '/admin/job-decision-filter', label: 'Job Decision Filter', icon: ClipboardList },
];

const headerTitles: Record<string, string> = {
  '/admin': 'Admin Dashboard',
  '/admin/leads': 'Leads',
  '/admin/store': 'Store Management',
  '/admin/ameb-bookings': 'AMEB Bookings',
  '/admin/email-templates': 'Email Templates',
  '/admin/gift-cards': 'Gift Cards',
  '/admin/job-decision-filter': 'Job Decision Filter',
};

function getHeaderTitle(pathname: string): string {
  for (const [prefix, title] of Object.entries(headerTitles)) {
    if (pathname === prefix || pathname.startsWith(prefix + '/')) {
      return title;
    }
  }
  if (pathname.startsWith('/admin/quotes')) {
    if (pathname.includes('/edit/')) return 'Edit Quote';
    if (pathname.includes('/create-quote')) return 'Quote Builder';
    return 'Quotes';
  }
  return 'Admin';
}

const AdminLayout: React.FC = () => {
  usePageMeta(
    "Admin | Daniele Buatti",
    "Admin dashboard.",
    { noindex: true },
  );

  const { user, isLoading } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  const brandSymbolSrc = theme === "dark" ? "/logo-pinkwhite.png" : "/blue-pink-ontrans.png";
  const textLogoSrc = theme === "dark" ? "/logo-white-trans-45.png" : "/logo-dark-blue-transparent-25.png";

  if (isLoading) return null;

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div data-no-reveal className="flex min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light">
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
          {navItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-md text-brand-dark dark:text-brand-light hover:bg-brand-secondary/20 dark:hover:bg-brand-dark/50 transition-colors",
                  isActive && "bg-brand-secondary/30 dark:bg-brand-dark/60 font-semibold text-brand-primary"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
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

      <div className="flex-1 flex flex-col">
        <header className="bg-brand-light dark:bg-brand-dark border-b border-brand-secondary/50 p-4 shadow-sm flex items-center justify-between">
          <h1 className="text-2xl font-bold text-brand-dark dark:text-brand-light">
            {getHeaderTitle(location.pathname)}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-brand-dark/80 dark:text-brand-light/80 text-sm">
              Logged in as: <strong className="text-brand-primary">{user?.email}</strong>
            </span>
          </div>
        </header>
        <div className="flex-1 p-8 overflow-y-auto">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;