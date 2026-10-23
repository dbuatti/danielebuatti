import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Monitor, Database, Server, Terminal, ExternalLink, RefreshCw, Zap, Film, Gamepad2, Video, Laptop, Cpu, HardDrive, Wifi } from 'lucide-react';

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
    setLoading(true);
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
    setTimeout(() => setCommStatus('idle'), 2500);
  }

  const modules = [
    { path: '/nas', label: 'NAS', icon: Database, desc: 'Mount scripts, credentials, home & away access', color: 'amber' },
    { path: '/network', label: 'Network', icon: Wifi, desc: 'TPG NBN, Deco M5, Tailscale nodes, Jitsi', color: 'blue' },
    { path: '/launch-agents', label: 'Launch Agents', icon: Terminal, desc: '3 user + 12 system agents', color: 'green' },
    { path: '/stremio', label: 'Stremio', icon: Film, desc: 'Running on Mini Docker, AIOStreams healthy', color: 'purple' },
    { path: '/crossover', label: 'CrossOver', icon: Gamepad2, desc: 'Bottles, 38 launchers, 3.7 GB sync remaining', color: 'orange' },
    { path: '/jitsi', label: 'Jitsi', icon: Video, desc: '5 containers, WebSocket TLS issue', color: 'red' },
    { path: '/devices', label: 'Devices', icon: Laptop, desc: '5 Tailscale machines with specs', color: 'cyan' },
  ];

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Hero / Orb */}
      <div className="relative flex flex-col items-center text-center py-8">
        <div className="relative w-36 h-36 rounded-full bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 orb-glow flex items-center justify-center shadow-[0_0_60px_rgba(249,115,22,0.5),0_0_120px_rgba(249,115,22,0.2)] animate-pulse-slow">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        </div>
        <h2 className="mt-5 font-display font-bold text-4xl md:text-5xl tracking-tight text-white">The Orb</h2>
        <p className="mt-2 text-neutral-400 max-w-lg text-sm">Central repository for system state, network infrastructure, launch agents, NAS access, and device management.</p>
      </div>

      {/* Comm Analytics Button */}
      <div className="card-glass rounded-2xl p-6 border-amber-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/5 flex items-center justify-center flex-shrink-0">
              <Monitor size={28} className="text-amber-400" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg text-white">Comm Analytics</h3>
              <p className="text-neutral-500 text-sm mt-0.5">Launch the local analytics application</p>
            </div>
          </div>
          <button
            onClick={handleOpenCommAnalytics}
            disabled={commStatus === 'launching'}
            className={`btn-orb flex items-center gap-2 justify-center min-w-[160px] ${
              commStatus === 'launching' ? 'opacity-70 cursor-wait' :
              commStatus === 'success' ? '!bg-green-600' :
              commStatus === 'error' ? '!bg-red-600' : ''
            }`}
          >
            {commStatus === 'launching' && <RefreshCw size={16} className="animate-spin" />}
            {commStatus === 'success' && <Zap size={16} />}
            {commStatus === 'error' && <Zap size={16} />}
            {commStatus === 'idle' && <ExternalLink size={16} />}
            <span className="font-semibold text-sm">
              {commStatus === 'launching' ? 'Launching...' :
               commStatus === 'success' ? 'Launched!' :
               commStatus === 'error' ? 'Failed' : 'Open App'}
            </span>
          </button>
        </div>
      </div>

      {/* Quick System Overview */}
      <section className="space-y-4">
        <h3 className="section-title">System Snapshot</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'MBP Hostname', value: 'macbook-pro-6.tailab1fd5.ts.net', icon: Monitor, color: 'text-amber-400' },
            { label: 'MBP Disk', value: '837 GB / 926 GB (95%)', icon: HardDrive, color: 'text-orange-400' },
            { label: 'Launch Agents', value: '3 user + 12 system', icon: Terminal, color: 'text-green-400' },
            { label: 'Mini Disk', value: '185 GB / 228 GB (94%)', icon: HardDrive, color: 'text-blue-400' },
          ].map(item => (
            <div key={item.label} className="card-glass rounded-xl p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                <item.icon size={18} className={item.color} strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                <p className="label">{item.label}</p>
                <p className="text-sm font-mono text-neutral-100 truncate mt-0.5">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modules Grid */}
      <section className="space-y-4">
        <h3 className="section-title">Modules</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {modules.map(({ path, label, icon: Icon, desc }) => (
            <Link key={path} to={path} className="card-glass rounded-xl p-5 group hover:border-amber-500/30 transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 transition-colors">
                  <Icon size={20} className="text-amber-400" strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-white text-sm">{label}</h4>
                  <p className="text-neutral-500 text-xs mt-1 leading-relaxed">{desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <button onClick={loadSystemInfo} disabled={loading} className="btn-outline flex items-center gap-2 text-sm">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh Snapshot
        </button>
      </div>
    </div>
  );
}