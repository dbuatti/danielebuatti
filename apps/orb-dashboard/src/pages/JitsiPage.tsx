export default function JitsiPage() {
  return (
    <div className="space-y-6">
      <h2 className="font-display font-bold text-3xl text-white">Jitsi Meet</h2>
      <div className="card-glass rounded-xl p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl bg-neutral-900/50 border border-white/5 p-5">
            <h4 className="font-medium text-amber-300 mb-2">Server Status</h4>
            <p className="text-sm text-neutral-400">danieles-mac-mini (100.116.158.22)</p>
            <p className="text-xl font-mono text-white mt-2">docker-compose</p>
            <p className="text-xs text-neutral-500 mt-1">5 containers running 17h</p>
          </div>
          <div className="rounded-xl bg-neutral-900/50 border border-white/5 p-5">
            <h4 className="font-medium text-amber-300 mb-2">Public Access</h4>
            <p className="text-sm text-neutral-400">No authentication</p>
            <p className="text-xs text-red-400 mt-1">⚠️ Security risk — world-accessible</p>
          </div>
        </div>
        <div className="rounded-xl bg-neutral-900/50 border border-white/5 p-5">
          <h4 className="font-medium text-amber-300 mb-2">Network Topology</h4>
          <p className="text-neutral-400 text-sm">Double NAT: VR1600v modem → Deco M5 mesh → Mac mini</p>
          <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-neutral-500">Modem IP:</span>
              <p className="text-neutral-200">192.168.1.1 (VR1600v)</p>
            </div>
            <div>
              <span className="text-neutral-500">Deco LAN:</span>
              <p className="text-neutral-200">192.168.68.0/24</p>
            </div>
            <div>
              <span className="text-neutral-500">Mac mini:</span>
              <p className="text-neutral-200">192.168.68.105 (Deco LAN)</p>
              <p className="text-xs text-neutral-500">Tailscale: 100.116.158.22</p>
            </div>
            <div>
              <span className="text-neutral-500">JVB Port:</span>
              <p className="text-neutral-200">10000/udp (published)</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-neutral-900/50 border border-white/5 p-5">
          <h4 className="font-medium text-amber-300 mb-2">JVB WebSocket / TLS Issue</h4>
          <p className="text-neutral-400 text-sm">JVB advertises <code className="text-amber-300">ws://</code> instead of <code className="text-amber-300">wss://</code>.</p>
          <p className="text-neutral-400 text-sm">Fix: set <code className="text-amber-300">tls = true</code> in JVB config to advertise secure WebSocket.</p>
          <p className="text-xs text-neutral-500 mt-2">Status: ❌ Not yet applied. Patches (fix-nginx.sh, fix-prosody.sh) don't survive Docker restart.</p>
        </div>
        <div className="rounded-xl bg-neutral-900/50 border border-white/5 p-5">
          <h4 className="font-medium text-amber-300 mb-2">Running Containers</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-400">jitsi-web-1:</span>
              <code className="text-neutral-100">Up 17 hours (:8000, :8443)</code>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">jitsi-prosody-1:</span>
              <code className="text-neutral-100">Up 17 hours (:5222, :5280)</code>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">jitsi-jvb-1:</span>
              <code className="text-neutral-100">Up 17 hours (port 10000/udp)</code>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">jitsi-jicofo-1:</span>
              <code className="text-neutral-100">Up 17 hours</code>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">jitsi-jibri-1:</span>
              <code className="text-neutral-100">Up 17 hours (recording)</code>
            </div>
          </div>
        </div>
      </div>
      <button onClick={async () => { if (window.electronAPI) { const { saved } = await window.electronAPI.saveData({ type: 'jitsi-status', timestamp: new Date().toISOString() }); alert(`Saved to ${saved}`); } }} className="btn-orb w-full">Save Jitsi Status</button>
    </div>
  );
}
