export default function NetworkPage() {
  return (
    <div className="space-y-6">
      <h2 className="font-display font-bold text-3xl text-white">Network Information</h2>

      {/* Provider & Modem */}
      <div className="card-glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-300 mb-3">Infrastructure</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-neutral-400">Provider</span>
            <p className="text-white">TPG NBN</p>
          </div>
          <div>
            <span className="text-neutral-400">Modem</span>
            <p className="text-white">VR1600v</p>
          </div>
          <div>
            <span className="text-neutral-400">Mesh</span>
            <p className="text-white">Deco M5 (3 units)</p>
          </div>
          <div>
            <span className="text-neutral-400">Clients</span>
            <p className="text-white">16</p>
          </div>
        </div>
        <div className="mt-3 text-sm">
          <span className="text-neutral-400">Double NAT:</span>
          <span className="text-amber-300 ml-2">Yes</span>
        </div>
      </div>

      {/* Tailscale Nodes */}
      <div className="card-glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-300 mb-3">Tailscale Network (tailab1fd5.ts.net)</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-neutral-400">
              <th className="text-left font-medium py-2">Node</th>
              <th className="text-left font-medium py-2">IP</th>
              <th className="text-left font-medium py-2">Type</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'MBP', ip: '100.116.158.22', type: 'Main' },
              { name: 'Mini', ip: '100.116.158.22', type: 'Secondary' },
              { name: 'crystal-tokyo', ip: '100.124.90.53', type: 'NAS' },
            ].map(row => (
              <tr key={row.name} className="border-b border-white/5">
                <td className="py-3 text-white font-mono">{row.name}</td>
                <td className="py-3 text-neutral-300 font-mono text-xs">{row.ip}</td>
                <td className="py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-amber-500/20 text-amber-300">{row.type}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Jitsi */}
      <div className="card-glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-300 mb-3">Jitsi (Mini)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-neutral-400">Containers</span>
            <p className="text-white">5</p>
          </div>
          <div>
            <span className="text-neutral-400">Port</span>
            <p className="text-white font-mono">8443</p>
          </div>
          <div>
            <span className="text-neutral-400">WebSocket</span>
            <p className="text-amber-300">TLS issue (ws:// not wss://)</p>
          </div>
        </div>
      </div>

      {/* Port Conflicts */}
      <div className="card-glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-300 mb-3">Port Conflicts</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-neutral-400">
              <th className="text-left font-medium py-2">Service</th>
              <th className="text-left font-medium py-2">Port</th>
              <th className="text-left font-medium py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/5">
              <td className="py-3 text-white">Stremio</td>
              <td className="py-3 text-neutral-300 font-mono">11470</td>
              <td className="py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-red-500/20 text-red-300">Conflict</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <button onClick={async () => { if (window.electronAPI) { const { saved } = await window.electronAPI.saveData({ type: 'network-snapshot' }); alert(`Saved to ${saved}`); } }} className="btn-orb w-full">Save Network Snapshot</button>
    </div>
  );
}