export default function LaunchAgentsPage() {
  const mbpAgents = [
    { name: 'com.user.opencode-proxy', status: 'running', pid: '4487', desc: 'Injects Authorization header for opencode web UI (:4097)' },
    { name: 'com.user.landing', status: 'running', pid: '4491', desc: 'Landing page server on :6081' },
    { name: 'com.user.novnc', status: 'running', pid: '4479', desc: 'noVNC + websockify on :6080 → VNC :5900' },
    { name: 'com.user.the-orb', status: 'running', pid: 'launchd', desc: 'The Orb app + web server on :8450 (added 11 Nov)' },
    { name: 'com.commanalytics.serve', status: 'running', pid: 'launchd', desc: 'Comm Analytics server on 127.0.0.1:8799' },
    { name: 'com.user.gmail-sync', status: 'failed', pid: 'exit 1', desc: 'Gmail sync — currently failing' },
    { name: 'com.mount-nas', status: 'idle', pid: '—', desc: 'NAS mount helper for Moon Prism' },
    { name: 'com.fnh.hub', status: 'loaded', pid: '—', desc: 'FNH study hub' },
    { name: 'sh.brew.syncthing', status: 'running', pid: '4558', desc: 'Syncthing on :8384' },
    { name: 'pm2.danielebuatti', status: 'loaded', pid: '—', desc: 'PM2 process manager for node services' },
    { name: 'daniele.static-planner.pull', status: 'loaded', pid: '—', desc: 'Pulls static-planner schedule updates' },
    { name: 'daniele.tick-rename', status: 'loaded', pid: '—', desc: 'Renames calendar ticks (Neon quota issue)' },
  ];

  const miniAgents = [
    { name: 'com.user.the-orb', status: 'running', pid: 'launchd', desc: 'Python Orb web server on :8450 (Electron crashes on Mini GPU)' },
    { name: 'com.commanalytics.serve', status: 'running', pid: 'launchd', desc: 'Comm Analytics server on 127.0.0.1:8799' },
    { name: 'com.danielebuatti.opencode', status: 'running', pid: '612', desc: 'OpenCode server on :4096' },
    { name: 'ai.opencode.web', status: 'running', pid: '977', desc: 'Second OpenCode web server on :4096' },
    { name: 'com.user.stremio-health-check', status: 'idle', pid: 'exit 0', desc: 'Checks Stremio container health' },
    { name: 'com.charmingdivinations.auto-tunnel', status: 'failed', pid: 'exit 1', desc: 'Auto SSH tunnel helper — failing' },
  ];

  const systemAgents = [
    { name: 'tailscale', status: 'running', desc: 'Tailscale VPN daemon (both machines)' },
    { name: 'screensharing', status: 'enabled', desc: 'Apple Remote Desktop legacy VNC (MBP :5900)' },
    { name: 'docker', status: 'running', desc: 'Docker Desktop — 7 containers on Mini' },
    { name: 'syncthing', status: 'running', desc: 'Syncthing file sync (both machines)' },
    { name: 'plexmediaserver', status: 'running', desc: 'Plex on Mini :32400' },
  ];

  const statusBadge = (status: string) => {
    const cls = status === 'running' || status === 'enabled' || status === 'loaded'
      ? 'bg-green-500/20 text-green-300'
      : status === 'failed'
        ? 'bg-red-500/20 text-red-300'
        : 'bg-neutral-700 text-neutral-300';
    return <span className={`px-2 py-0.5 rounded-full text-xs ${cls}`}>{status}</span>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-3xl text-white">Launch Agents & Daemons</h2>
        <p className="text-neutral-500 text-sm mt-1">Audited 11 Nov 2026</p>
      </div>

      {/* MBP Agents */}
      <div className="card-glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-300 mb-3">MBP — User Launch Agents</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-neutral-400">
              <th className="text-left font-medium py-2">Name</th>
              <th className="text-left font-medium py-2">Status</th>
              <th className="text-left font-medium py-2">PID</th>
              <th className="text-left font-medium py-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {mbpAgents.map(row => (
              <tr key={row.name} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-3 text-white font-mono text-xs">{row.name}</td>
                <td className="py-3">{statusBadge(row.status)}</td>
                <td className="py-3 text-neutral-500 font-mono text-xs">{row.pid}</td>
                <td className="py-3 text-neutral-400 text-xs">{row.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mini Agents */}
      <div className="card-glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-300 mb-3">Mac Mini — User Launch Agents</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-neutral-400">
              <th className="text-left font-medium py-2">Name</th>
              <th className="text-left font-medium py-2">Status</th>
              <th className="text-left font-medium py-2">PID</th>
              <th className="text-left font-medium py-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {miniAgents.map(row => (
              <tr key={row.name} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-3 text-white font-mono text-xs">{row.name}</td>
                <td className="py-3">{statusBadge(row.status)}</td>
                <td className="py-3 text-neutral-500 font-mono text-xs">{row.pid}</td>
                <td className="py-3 text-neutral-400 text-xs">{row.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* System Agents */}
      <div className="card-glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-300 mb-3">System Services</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-neutral-400">
              <th className="text-left font-medium py-2">Name</th>
              <th className="text-left font-medium py-2">Status</th>
              <th className="text-left font-medium py-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {systemAgents.map(row => (
              <tr key={row.name} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-3 text-white font-mono text-xs">{row.name}</td>
                <td className="py-3">{statusBadge(row.status)}</td>
                <td className="py-3 text-neutral-400 text-xs">{row.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={async () => { if (window.electronAPI) { const { saved } = await window.electronAPI.saveData({ type: 'launch-agents' }); alert(`Saved to ${saved}`); } }} className="btn-orb w-full">Save Launch Agent List</button>
    </div>
  );
}
