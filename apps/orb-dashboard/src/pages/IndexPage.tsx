import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Monitor, Database, Server, Terminal, ExternalLink, RefreshCw, Zap, Film, Gamepad2, Laptop } from 'lucide-react';

interface SystemInfo {
  timestamp: string;
  hostname: string;
  network: any;
  launchAgents: string;
  ipAddresses: string;
}

export default function IndexPage() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [commStatus, setCommStatus] = useState<'idle' | 'launching' | 'success' | 'error'>('idle');

  async function loadSystemInfo() {
    if (window.electronAPI) {
      try {
        const info = await window.electronAPI.getSystemInfo();
        setSystemInfo(info);
      } catch (e) {
        console.error('Failed to load system info:', e);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    loadSystemInfo();
  }, []);

  async function handleOpenCommAnalytics() {
    setCommStatus('launching');
    if (window.electronAPI) {
      try {
        const result = await window.electronAPI.openCommAnalytics();
        if (result.success) setCommStatus('success');
        else setCommStatus('error');
      } catch {
        setCommStatus('error');
      }
    }
    setTimeout(() => setCommStatus('idle'), 2000);
  }

  const StatusIndicator = ({ label, value, icon: Icon }: { label: string; value: string; icon: any }) => (
    <div className="card-glass rounded-xl p-5 flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
        <Icon size={22} className="text-amber-400" strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium text-neutral-400 tracking-wide uppercase">{label}</p>
        <p className="text-base font-mono text-neutral-100 truncate mt-1">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Hero / Orb */}
      <div className="relative flex flex-col items-center text-center py-10">
        <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 orb-glow flex items-center justify-center shadow-[0_0_60px_rgba(249,115,22,0.5),0_0_120px_rgba(249,115,22,0.2)] animate-pulse-slow">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        </div>
        <h2 className="mt-6 font-display font-bold text-4xl md:text-5xl tracking-tight text-white">The Orb</h2>
        <p className="mt-2 text-neutral-400 max-w-md">Central repository for system state, network, launch agents, and NAS access.</p>
      </div>

      {/* Comm Analytics Button */}
      <div className="card-glass rounded-2xl p-8 border-amber-500/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/5 flex items-center justify-center">
              <Monitor size={32} className="text-amber-400" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-xl text-white">Comm Analytics</h3>
              <p className="text-neutral-500 text-sm mt-0.5">Launch the local analytics application</p>
            </div>
          </div>
          <button
            onClick={handleOpenCommAnalytics}
            disabled={commStatus === 'launching'}
            className={`btn-orb flex items-center gap-2 justify-center min-w-[180px] ${
              commStatus === 'launching' ? 'opacity-70 cursor-wait' :
              commStatus === 'success' ? 'bg-green-600' :
              commStatus === 'error' ? 'bg-red-600' : ''
            }`}
          >
            {commStatus === 'launching' && <RefreshCw size={18} className="animate-spin" />}
            {commStatus === 'success' && <Zap size={18} />}
            {commStatus === 'error' && <Zap size={18} />}
            {(commStatus === 'idle' || commStatus === 'launching') && <ExternalLink size={18} />}
            <span className="font-semibold">
              {commStatus === 'launching' ? 'Launching...' :
               commStatus === 'success' ? 'Launched!' :
               commStatus === 'error' ? 'Failed' : 'Open App'}
            </span>
          </button>
        </div>
      </div>

      {/* Quick System Overview */}
      <section className="space-y-4">
        <h3 className="font-display font-semibold text-xl text-white">System Snapshot</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusIndicator
            label="MBP Hostname"
            value="macbook-pro-6.tailab1fd5.ts.net"
            icon={Monitor}
          />
          <StatusIndicator
            label="MBP Disk"
            value="837 GB / 926 GB (95%)"
            icon={Server}
          />
          <StatusIndicator
            label="Launch Agents"
            value="3 user + 12 system"
            icon={Terminal}
          />
          <StatusIndicator
            label="Mini Disk"
            value="185 GB / 228 GB (94%)"
            icon={Database}
          />
        </div>
      </section>

      {/* Quick Nav Cards */}
      <section className="space-y-4">
        <h3 className="font-display font-semibold text-xl text-white">Modules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/nas" className="card-glass rounded-xl p-6 group hover:border-amber-500/30 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 transition-colors">
                <Database size={24} className="text-amber-400" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-semibold text-white">NAS Mounting</h4>
                <p className="text-neutral-500 text-sm mt-1">crystal-tokyo @ 100.124.90.53, Moon Prism share, Tailscale mount</p>
              </div>
            </div>
          </Link>
          <Link to="/network" className="card-glass rounded-xl p-6 group hover:border-amber-500/30 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 transition-colors">
                <Server size={24} className="text-amber-400" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-semibold text-white">Network Info</h4>
                <p className="text-neutral-500 text-sm mt-1">TPG NBN, Deco M5, VR1600v, Jitsi, JVB TLS issue</p>
              </div>
            </div>
          </Link>
          <Link to="/launch-agents" className="card-glass rounded-xl p-6 group hover:border-amber-500/30 transition-all duration-300 md:col-span-2">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 transition-colors">
                <Terminal size={24} className="text-amber-400" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-semibold text-white">Launch Agents & Daemons</h4>
                <p className="text-neutral-500 text-sm mt-1">All user & system launch agents, plists, status</p>
              </div>
            </div>
          </Link>
          <Link to="/stremio" className="card-glass rounded-xl p-6 group hover:border-amber-500/30 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 transition-colors">
                <Film size={24} className="text-amber-400" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-semibold text-white">Stremio</h4>
                <p className="text-neutral-500 text-sm mt-1">Server status, port conflicts, restart</p>
              </div>
            </div>
          </Link>
          <Link to="/crossover" className="card-glass rounded-xl p-6 group hover:border-amber-500/30 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 transition-colors">
                <Gamepad2 size={24} className="text-amber-400" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-semibold text-white">CrossOver</h4>
                <p className="text-neutral-500 text-sm mt-1">Bottles, launchers, sync status, disk usage</p>
              </div>
            </div>
          </Link>
          <Link to="/devices" className="card-glass rounded-xl p-6 group hover:border-amber-500/30 transition-all duration-300 md:col-span-2">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 transition-colors">
                <Laptop size={24} className="text-amber-400" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-semibold text-white">Devices</h4>
                <p className="text-neutral-500 text-sm mt-1">All 5 Tailscale machines with specs, IPs, and status</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <button onClick={loadSystemInfo} disabled={loading} className="btn-outline flex items-center gap-2">
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Refresh Snapshot
        </button>
      </div>
    </div>
  );
}
