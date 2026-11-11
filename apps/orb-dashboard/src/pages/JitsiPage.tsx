export default function JitsiPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-3xl text-white">Jitsi Meet</h2>
        <p className="text-neutral-500 text-sm mt-1">Audited 11 Nov 2026</p>
      </div>
      <div className="card-glass rounded-xl p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl bg-neutral-900/50 border border-white/5 p-5">
            <h4 className="font-medium text-amber-300 mb-2">Server Status</h4>
            <p className="text-sm text-neutral-400">danieles-mac-mini (100.116.158.22)</p>
            <p className="text-xl font-mono text-white mt-2">docker-compose</p>
            <p className="text-xs text-neutral-500 mt-1">4 containers running — up 8 days</p>
          </div>
          <div className="rounded-xl bg-neutral-900/50 border border-white/5 p-5">
            <h4 className="font-medium text-amber-300 mb-2">Public Access</h4>
            <a href="https://danieles-mac-mini.tailab1fd5.ts.net/" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:underline text-xs font-mono">
              https://danieles-mac-mini.tailab1fd5.ts.net/
            </a>
            <p className="text-sm text-neutral-400 mt-1">Tailscale Funnel :443 → :8000</p>
            <p className="text-xs text-red-400 mt-1">⚠️ No authentication — world-accessible</p>
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
              <p className="text-neutral-200">192.168.68.105 (Wi-Fi)</p>
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
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-5">
          <h4 className="font-medium text-red-300 mb-2">⚠️ Stale config after 11 Nov router reset</h4>
          <ul className="text-sm text-neutral-400 space-y-1 list-disc list-inside">
            <li><code className="text-amber-300">JVB_ADVERTISE_IPS=125.254.16.55</code> — an old TPG public IP. Current public IP is <code className="text-amber-300">115.129.82.205</code>, so media candidates are wrong.</li>
            <li><code className="text-amber-300">PUBLIC_URL=https://conviction-remix-words-tion.trycloudflare.com</code> — that quick tunnel is dead (connection refused).</li>
            <li>The Tailscale Funnel <code className="text-amber-300">:443 → :8000</code> still serves the web UI (HTTP 200).</li>
            <li><code className="text-amber-300">125.254.16.55</code> is actually the NAS's public IP, not this site's — copied from the wrong box.</li>
          </ul>
          <p className="text-xs text-neutral-500 mt-2">File: <code>~/jitsi/.env</code> on the Mini. Fix needs a compose restart.</p>
        </div>
        <div className="rounded-xl bg-neutral-900/50 border border-white/5 p-5">
          <h4 className="font-medium text-amber-300 mb-2">Running Containers (4)</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-400">jitsi-web-1:</span>
              <code className="text-neutral-100">Up 8 days (:8000, :8443)</code>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">jitsi-prosody-1:</span>
              <code className="text-neutral-100">Up 8 days (:5222, :5280, :5347)</code>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">jitsi-jvb-1:</span>
              <code className="text-neutral-100">Up 8 days (:8080, 10000/udp)</code>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">jitsi-jicofo-1:</span>
              <code className="text-neutral-100">Up 8 days (:8888)</code>
            </div>
          </div>
          <p className="text-xs text-neutral-500 mt-2">No jibri (recording) container is deployed.</p>
        </div>
      </div>
      <button onClick={async () => { if (window.electronAPI) { const { saved } = await window.electronAPI.saveData({ type: 'jitsi-status', timestamp: new Date().toISOString() }); alert(`Saved to ${saved}`); } }} className="btn-orb w-full">Save Jitsi Status</button>
    </div>
  );
}
