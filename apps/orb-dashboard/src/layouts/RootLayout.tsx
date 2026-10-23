import { Outlet, Link, useLocation } from 'react-router-dom';
import { Globe, Database, Terminal, Server, Film, Gamepad2, Video, Laptop, ChevronRight, Link2 } from 'lucide-react';

export default function RootLayout() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Globe },
    { path: '/nas', label: 'NAS', icon: Database },
    { path: '/network', label: 'Network', icon: Server },
    { path: '/launch-agents', label: 'Agents', icon: Terminal },
    { path: '/stremio', label: 'Stremio', icon: Film },
    { path: '/crossover', label: 'CrossOver', icon: Gamepad2 },
    { path: '/jitsi', label: 'Jitsi', icon: Video },
    { path: '/devices', label: 'Devices', icon: Laptop },
    { path: '/links', label: 'Links', icon: Link2 },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 font-sans selection:bg-amber-500/30 selection:text-amber-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/5 bg-neutral-950/90 backdrop-blur-xl flex items-center px-6 gap-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 orb-glow-sm flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.4)] group-hover:scale-110 transition-transform duration-300">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </div>
          <div>
            <h1 className="font-display font-bold text-lg tracking-tight leading-none text-amber-300">The Orb</h1>
            <span className="text-[9px] text-neutral-500 tracking-[0.2em] uppercase">Central Repository</span>
          </div>
        </Link>

        {/* Breadcrumb */}
        <div className="hidden md:flex items-center gap-1 text-sm text-neutral-500 ml-4">
          <ChevronRight size={14} className="text-neutral-600" />
          <span className="text-neutral-300">
            {navItems.find(n => n.path === location.pathname)?.label || 'Dashboard'}
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="pt-20 px-6 max-w-7xl mx-auto pb-24 animate-fade-in">
        <Outlet />
      </main>

      {/* Bottom Nav (Dock-style) */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-1 px-3 py-2 rounded-2xl bg-neutral-900/90 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50">
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 group ${
                active
                  ? 'bg-amber-500/20 text-amber-300 scale-105'
                  : 'text-neutral-500 hover:text-neutral-200 hover:bg-white/5'
              }`}
            >
              <Icon size={18} strokeWidth={1.5} className={active ? 'drop-shadow-[0_0_6px_rgba(249,115,22,0.5)]' : ''} />
              <span className="text-[9px] font-medium tracking-wide">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}