export default function LaunchAgentsPage() {
  return (
    <div className="space-y-6">
      <h2 className="font-display font-bold text-3xl text-white">Launch Agents</h2>
      <div className="card-glass rounded-xl p-8">
        <h3 className="text-lg font-semibold text-white mb-4">Active Launch Agents</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-neutral-400">
              <th className="text-left font-medium py-2">Name</th>
              <th className="text-left font-medium py-2">Status</th>
              <th className="text-left font-medium py-2">Path</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'com.user.launchagent', status: 'running', path: '~/Library/LaunchAgents/' },
              { name: 'com.apple.timeagent', status: 'stopped', path: '/System/Library/LaunchAgents/' },
              { name: 'org.tailscale.tailscaled', status: 'running', path: '/Library/LaunchDaemons/' },
              { name: 'vnc.launchagent', status: 'running', path: '~/Library/LaunchAgents/' },
            ].map(row => (
              <tr key={row.name} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-3 text-white font-mono">{row.name}</td>
                <td className="py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${row.status === 'running' ? 'bg-green-500/20 text-green-300' : 'bg-neutral-700 text-neutral-300'}`}>{row.status}</span></td>
                <td className="py-3 text-neutral-500 font-mono text-xs">{row.path}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={async () => { if (window.electronAPI) { const { saved } = await window.electronAPI.saveData({ type: 'launch-agents' }); alert(`Saved to ${saved}`); } }} className="btn-orb w-full">Save Launch Agent List</button>
    </div>
  );
}