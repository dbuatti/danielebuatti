export default function NetworkPage() {
  return (
    <div className="space-y-6">
      <h2 className="font-display font-bold text-3xl text-white">Network Information</h2>
      <div className="card-glass rounded-xl p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl bg-neutral-900/50 border border-white/5 p-5">
            <h4 className="font-medium text-amber-300 mb-2">Primary Interface</h4>
            <p className="text-sm text-neutral-400">en0 — Wi-Fi / Ethernet</p>
            <p className="text-xl font-mono text-white mt-2">192.168.1.5</p>
          </div>
          <div className="rounded-xl bg-neutral-900/50 border border-white/5 p-5">
            <h4 className="font-medium text-amber-300 mb-2">VPN</h4>
            <p className="text-sm text-neutral-400">Tailscale / WireGuard</p>
            <p className="text-xl font-mono text-white mt-2 mt-1">100.64.x.x</p>
          </div>
        </div>
        <div className="rounded-xl bg-neutral-900/50 border border-white/5 p-5">
          <h4 className="font-medium text-amber-300 mb-2">Public IP</h4>
          <p className="text-neutral-400 text-sm">Dynamic / DHCP — updates on reconnect</p>
          <p className="text-xl font-mono text-white mt-2 mt-1">Check via refresh</p>
        </div>
      </div>
      <button onClick={async () => { if (window.electronAPI) { const { saved } = await window.electronAPI.saveData({ type: 'network-snapshot' }); alert(`Saved to ${saved}`); } }} className="btn-orb w-full">Save Network Snapshot</button>
    </div>
  );
}