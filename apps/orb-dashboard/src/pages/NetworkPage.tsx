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

      {/* Server Hosting */}
      <div className="card-glass rounded-xl p-6 border-amber-500/20">
        <h3 className="text-lg font-semibold text-amber-300 mb-3">Server Hosting (Local Service Accessibility)</h3>
        <div className="space-y-3 text-sm">
          <p className="text-neutral-400">The MacBook is the only place the server runs — data lives there (Beeper DB, Messages chat.db, local mail). When the MacBook is asleep or away, the service is unreachable.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div className="rounded-xl bg-neutral-900/50 border border-white/5 p-4">
              <h4 className="font-medium text-white mb-1">Option 1: Prevent Sleep on Power</h4>
              <p className="text-xs text-neutral-400">System Settings → Battery → Options → "Prevent automatic sleeping on power adapter when display is off". Keeps it reachable while plugged in.</p>
              <p className="text-xs text-neutral-500 mt-1">Doesn't help when shut down, unplugged, or away.</p>
            </div>
            <div className="rounded-xl bg-neutral-900/50 border border-white/5 p-4">
              <h4 className="font-medium text-white mb-1">Option 2: Host on Mac Mini (Best)</h4>
              <p className="text-xs text-neutral-400">Mac Mini is always on, already on tailnet. Needs own copies of data: Messages (iCloud), Beeper (install + sign in), Mail (same accounts), app copy + Full Disk Access + launchd + Tailscale Serve.</p>
              <p className="text-xs text-neutral-500 mt-1">Address becomes: https://danieles-mac-mini.tailab1fd5.ts.net:8445/</p>
            </div>
          </div>
          <p className="text-xs text-red-300 mt-2">Option 3 (Cloud hosting) — NOT recommended. Private message/email content would sit on someone else's server.</p>
          <p className="text-xs text-neutral-500 mt-1">Recommendation: Do Option 1 now (takes a minute). Move to Mac Mini if you regularly want access while MacBook is closed or away. Security stays the same: Tailscale only, your login only.</p>
        </div>
      </div>

      {/* Remote Access / Tailscale */}
      <div className="card-glass rounded-xl p-6 border-amber-500/20">
        <h3 className="text-lg font-semibold text-amber-300 mb-3">Remote Access (Tailscale)</h3>
        <div className="space-y-3 text-sm">
          <p className="text-neutral-400">The Orb is now accessible as a web app from any device on your tailnet — no VNC needed.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div className="rounded-xl bg-neutral-900/50 border border-white/5 p-4">
              <h4 className="font-medium text-white mb-1">From MBP (local)</h4>
              <p className="text-xs text-neutral-400 font-mono">Open from Dock or /Applications/The Orb.app</p>
            </div>
            <div className="rounded-xl bg-neutral-900/50 border border-amber-500/20 p-4">
              <h4 className="font-medium text-amber-300 mb-1">From any device (tailnet) 🌐</h4>
              <p className="text-xs text-neutral-400">Web version served on port 8450</p>
              <a href="https://macbook-pro-6.tailab1fd5.ts.net:8446" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:underline text-xs font-mono mt-1 block">
                https://macbook-pro-6.tailab1fd5.ts.net:8446
              </a>
              <p className="text-xs text-neutral-500 mt-1">MBP instance (primary)</p>
            </div>
            <div className="rounded-xl bg-neutral-900/50 border border-green-500/20 p-4">
              <h4 className="font-medium text-green-300 mb-1">Backup instance (Mac Mini) 🌐</h4>
              <p className="text-xs text-neutral-400">Web version served on port 8450</p>
              <a href="https://danieles-mac-mini.tailab1fd5.ts.net:8449" target="_blank" rel="noopener noreferrer" className="text-green-300 hover:underline text-xs font-mono mt-1 block">
                https://danieles-mac-mini.tailab1fd5.ts.net:8449
              </a>
              <p className="text-xs text-neutral-500 mt-1">Mac Mini instance (backup/failover)</p>
            </div>
          </div>
          <div className="mt-3 p-3 bg-neutral-900/50 rounded-lg">
            <p className="text-xs text-neutral-400"><strong className="text-white">How it works:</strong> The Orb desktop app runs a built-in web server on port 8450. Tailscale Serve exposes it on your tailnet. Any device can access it via the URL above — no VNC, no desktop sharing needed.</p>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={async () => { if (window.electronAPI) { const r = await window.electronAPI.startWebServer(); alert(`Web server started on port ${r.port}`); } }} className="btn-ghost text-xs">Start Server</button>
            <button onClick={async () => { if (window.electronAPI) { await window.electronAPI.stopWebServer(); alert('Web server stopped'); } }} className="btn-ghost text-xs">Stop Server</button>
          </div>
        </div>
      </div>

      <button onClick={async () => { if (window.electronAPI) { const { saved } = await window.electronAPI.saveData({ type: 'network-snapshot' }); alert(`Saved to ${saved}`); } }} className="btn-orb w-full">Save Network Snapshot</button>
    </div>
  );
}