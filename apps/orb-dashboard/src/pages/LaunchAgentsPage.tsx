export default function LaunchAgentsPage() {
  const agents = [
    { name: 'com.user.opencode-proxy', status: 'loaded', path: '~/Library/LaunchAgents/', desc: 'Injects Authorization header for opencode web UI' },
    { name: 'com.user.landing', status: 'loaded', path: '~/Library/LaunchAgents/', desc: 'Auto-starts landing page server on port 6081' },
    { name: 'com.user.novnc', status: 'loaded', path: '~/Library/LaunchAgents/', desc: 'noVNC client for VNC access' },
  ];

  const systemAgents = [
    { name: 'tailscale', status: 'running', desc: 'Tailscale VPN daemon' },
    { name: 'screensharing', status: 'enabled', desc: 'Apple Remote Desktop legacy VNC' },
    { name: 'opencode', status: 'running', desc: 'AI coding agent server on :4096' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-display font-bold text-3xl text-white">Launch Agents & Daemons</h2>

      {/* User Launch Agents */}
      <div className="card-glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-300 mb-3">User Launch Agents</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-neutral-400">
              <th className="text-left font-medium py-2">Name</th>
              <th className="text-left font-medium py-2">Status</th>
              <th className="text-left font-medium py-2">Path</th>
              <th className="text-left font-medium py-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {agents.map(row => (
              <tr key={row.name} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-3 text-white font-mono text-xs">{row.name}</td>
                <td className="py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${row.status === 'loaded' ? 'bg-green-500/20 text-green-300' : 'bg-neutral-700 text-neutral-300'}`}>{row.status}</span></td>
                <td className="py-3 text-neutral-500 font-mono text-xs">{row.path}</td>
                <td className="py-3 text-neutral-400 text-xs">{row.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* System Launch Agents */}
      <div className="card-glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-300 mb-3">System Launch Agents & Daemons</h3>
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
                <td className="py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${row.status === 'running' || row.status === 'enabled' ? 'bg-green-500/20 text-green-300' : 'bg-neutral-700 text-neutral-300'}`}>{row.status}</span></td>
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