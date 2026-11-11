const tailscaleNodes = [
  { name: 'macbook-pro-6', ip: '100.74.213.103', lan: '192.168.68.116 (Wi-Fi)', os: 'macOS 26.7', type: 'Primary Mac', online: true },
  { name: 'danieles-mac-mini', ip: '100.116.158.22', lan: '192.168.68.105 (Wi-Fi)', os: 'macOS 14.8.7', type: 'Secondary Mac / Server', online: true },
  { name: 'crystal-tokyo', ip: '100.124.90.53', lan: '192.168.2.100 (NAS LAN)', os: 'Linux', type: 'NAS', online: true },
  { name: 'ipad-pro-12-9-gen-5', ip: '100.67.83.5', lan: '—', os: 'iOS', type: 'Tablet', online: true },
  { name: 'iphone173', ip: '100.118.89.79', lan: '—', os: 'iOS', type: 'Phone', online: false },
];

const serveMap = [
  { host: 'MBP', port: '443', target: '127.0.0.1:11470', note: 'Dead — Stremio not running on MBP (502)' },
  { host: 'MBP', port: '8443', target: '127.0.0.1:6081', note: 'Landing page + noVNC' },
  { host: 'MBP', port: '8444', target: '127.0.0.1:4097', note: 'OpenCode (via auth proxy)' },
  { host: 'MBP', port: '8445', target: '127.0.0.1:8799', note: 'Comm Analytics (definitive)' },
  { host: 'MBP', port: '8446', target: '127.0.0.1:8450', note: 'The Orb' },
  { host: 'Mini', port: '443 (Funnel)', target: '127.0.0.1:8000', note: 'Jitsi Meet (public)' },
  { host: 'Mini', port: '8445', target: '127.0.0.1:8799', note: 'Comm Analytics (Mini copy)' },
  { host: 'Mini', port: '8447', target: '127.0.0.1:11470', note: 'Stremio server' },
  { host: 'Mini', port: '8448', target: '127.0.0.1:3000', note: 'AIOStreams' },
  { host: 'Mini', port: '8449', target: '127.0.0.1:8450', note: 'The Orb (backup)' },
];

export default function NetworkPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-3xl text-white">Network Information</h2>
        <p className="text-neutral-500 text-sm mt-1">Last audited: 11 Nov 2026 (after router/modem power-cycle)</p>
      </div>

      {/* Provider & Modem */}
      <div className="card-glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-300 mb-3">Infrastructure</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-neutral-400">Provider</span>
            <p className="text-white">TPG NBN (AS7545)</p>
            <p className="text-xs text-neutral-500">Melbourne, VIC</p>
          </div>
          <div>
            <span className="text-neutral-400">Public IP</span>
            <p className="text-white font-mono text-xs">115.129.82.205</p>
            <p className="text-xs text-neutral-500">Changed on reset</p>
          </div>
          <div>
            <span className="text-neutral-400">Modem</span>
            <p className="text-white">TP-Link VR1600v</p>
            <p className="text-xs text-neutral-500 font-mono">192.168.1.1</p>
          </div>
          <div>
            <span className="text-neutral-400">Mesh</span>
            <p className="text-white">Deco M5 (3 units)</p>
            <p className="text-xs text-neutral-500 font-mono">192.168.68.1</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-neutral-400">LAN Subnet</span>
            <p className="text-white font-mono text-xs">192.168.68.0/24</p>
          </div>
          <div>
            <span className="text-neutral-400">NAS Segment</span>
            <p className="text-white font-mono text-xs">192.168.2.0/24</p>
          </div>
          <div>
            <span className="text-neutral-400">Double NAT</span>
            <p className="text-amber-300">Yes (harmless for calls)</p>
          </div>
          <div>
            <span className="text-neutral-400">Deco MAC</span>
            <p className="text-white font-mono text-xs">84:D8:1B:E6:19:44</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-neutral-900/50 rounded-lg">
          <p className="text-xs text-neutral-400 font-mono">
            Path: MBP/Mini (192.168.68.x) → Deco 192.168.68.1 → Modem 192.168.1.1 → NAS 192.168.2.100 → Internet
          </p>
        </div>
      </div>

      {/* Tailscale Nodes */}
      <div className="card-glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-300 mb-3">Tailscale Network (tailab1fd5.ts.net)</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-neutral-400">
              <th className="text-left font-medium py-2">Node</th>
              <th className="text-left font-medium py-2">Tailscale IP</th>
              <th className="text-left font-medium py-2">LAN</th>
              <th className="text-left font-medium py-2">OS</th>
              <th className="text-left font-medium py-2">Role</th>
              <th className="text-left font-medium py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {tailscaleNodes.map(row => (
              <tr key={row.name} className="border-b border-white/5">
                <td className="py-3 text-white font-mono text-xs">{row.name}</td>
                <td className="py-3 text-neutral-300 font-mono text-xs">{row.ip}</td>
                <td className="py-3 text-neutral-400 font-mono text-xs">{row.lan}</td>
                <td className="py-3 text-neutral-400 text-xs">{row.os}</td>
                <td className="py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-amber-500/20 text-amber-300">{row.type}</span></td>
                <td className="py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${row.online ? 'bg-green-500/20 text-green-300' : 'bg-neutral-700 text-neutral-300'}`}>
                    {row.online ? 'online' : 'offline'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-neutral-500 mt-3">All Tailscale IPs survived the router reset unchanged. Only LAN and public IPs moved.</p>
      </div>

      {/* Tailscale Serve */}
      <div className="card-glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-300 mb-3">Tailscale Serve / Funnel Map</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-neutral-400">
              <th className="text-left font-medium py-2">Host</th>
              <th className="text-left font-medium py-2">Public Port</th>
              <th className="text-left font-medium py-2">Local Target</th>
              <th className="text-left font-medium py-2">Service</th>
            </tr>
          </thead>
          <tbody>
            {serveMap.map((row, i) => (
              <tr key={`${row.host}-${row.port}-${i}`} className="border-b border-white/5">
                <td className="py-2 text-white text-xs">{row.host}</td>
                <td className="py-2 text-neutral-300 font-mono text-xs">{row.port}</td>
                <td className="py-2 text-neutral-400 font-mono text-xs">{row.target}</td>
                <td className="py-2 text-neutral-400 text-xs">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Jitsi */}
      <div className="card-glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-300 mb-3">Jitsi (Mini)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-neutral-400">Containers</span>
            <p className="text-white">4 (web, jicofo, jvb, prosody)</p>
          </div>
          <div>
            <span className="text-neutral-400">Port</span>
            <p className="text-white font-mono">8443 / 8000</p>
          </div>
          <div>
            <span className="text-neutral-400">Public URL</span>
            <p className="text-white font-mono text-xs">danieles-mac-mini:443</p>
          </div>
          <div>
            <span className="text-neutral-400">Uptime</span>
            <p className="text-white">8 days</p>
          </div>
        </div>
        <p className="text-xs text-neutral-500 mt-3">No Jibri recording container is deployed. Public via Tailscale Funnel on :443 → 127.0.0.1:8000.</p>
      </div>

      {/* Server Hosting */}
      <div className="card-glass rounded-xl p-6 border-amber-500/20">
        <h3 className="text-lg font-semibold text-amber-300 mb-3">Server Hosting (Local Service Accessibility)</h3>
        <div className="space-y-3 text-sm">
          <p className="text-neutral-400">Comm Analytics now runs on <strong className="text-white">both</strong> machines. The MBP copy is the definitive link (it holds the live Beeper DB, Messages chat.db and local mail). The Mini copy is the failover.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div className="rounded-xl bg-neutral-900/50 border border-white/5 p-4">
              <h4 className="font-medium text-white mb-1">MBP — definitive</h4>
              <p className="text-xs text-neutral-400 font-mono">localhost:8799 → :8445</p>
              <a href="https://macbook-pro-6.tailab1fd5.ts.net:8445/" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:underline text-xs font-mono mt-1 block">
                https://macbook-pro-6.tailab1fd5.ts.net:8445/
              </a>
              <p className="text-xs text-neutral-500 mt-1">Unreachable when the MBP is asleep or away.</p>
            </div>
            <div className="rounded-xl bg-neutral-900/50 border border-white/5 p-4">
              <h4 className="font-medium text-white mb-1">Mini — failover</h4>
              <p className="text-xs text-neutral-400 font-mono">localhost:8799 → :8445</p>
              <a href="https://danieles-mac-mini.tailab1fd5.ts.net:8445/" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:underline text-xs font-mono mt-1 block">
                https://danieles-mac-mini.tailab1fd5.ts.net:8445/
              </a>
              <p className="text-xs text-neutral-500 mt-1">Always on. Data is a separate copy.</p>
            </div>
          </div>
          <p className="text-xs text-amber-300 mt-2">The two copies do NOT sync — changes have to be copied manually.</p>
          <p className="text-xs text-neutral-500 mt-1">Security stays the same: Tailscale only, your login only.</p>
        </div>
      </div>

      {/* Remote Access / Tailscale */}
      <div className="card-glass rounded-xl p-6 border-amber-500/20">
        <h3 className="text-lg font-semibold text-amber-300 mb-3">Remote Access (Tailscale)</h3>
        <div className="space-y-3 text-sm">
          <p className="text-neutral-400">The Orb is accessible as a web app from any device on your tailnet — no VNC needed.</p>
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
            <p className="text-xs text-neutral-400"><strong className="text-white">How it works:</strong> The Orb desktop app runs a built-in web server on port 8450. Tailscale Serve exposes it on your tailnet. Both instances are now kept alive by a LaunchAgent (<code className="text-amber-300">com.user.the-orb</code>).</p>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={async () => { if (window.electronAPI) { const r = await window.electronAPI.startWebServer(); alert(`Web server started on port ${r.port}`); } }} className="btn-ghost text-xs">Start Server</button>
            <button onClick={async () => { if (window.electronAPI) { await window.electronAPI.stopWebServer(); alert('Web server stopped'); } }} className="btn-ghost text-xs">Stop Server</button>
          </div>
        </div>
      </div>

      {/* Comm Analytics Server */}
      <div className="card-glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-300 mb-3">Comm Analytics Server</h3>
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-xl bg-neutral-900/50 border border-white/5 p-4">
              <h4 className="font-medium text-white mb-1">Host</h4>
              <p className="text-xs text-neutral-400">MBP (definitive) + Mac mini (failover)</p>
              <p className="text-xs text-neutral-500 mt-1">~/dyad-apps/comm-analytics — Python 3.11, no framework</p>
            </div>
            <div className="rounded-xl bg-neutral-900/50 border border-white/5 p-4">
              <h4 className="font-medium text-white mb-1">Server</h4>
              <p className="text-xs text-neutral-400">src/serve.py (built-in Python web server)</p>
              <p className="text-xs text-neutral-500 mt-1">Background service: com.commanalytics.serve</p>
            </div>
            <div className="rounded-xl bg-neutral-900/50 border border-white/5 p-4">
              <h4 className="font-medium text-white mb-1">Listen</h4>
              <p className="text-xs text-neutral-400">127.0.0.1:8799 (local only)</p>
              <p className="text-xs text-neutral-500 mt-1">Remote via Tailscale Serve: port 8445 on both hosts</p>
            </div>
            <div className="rounded-xl bg-neutral-900/50 border border-white/5 p-4">
              <h4 className="font-medium text-white mb-1">Auth</h4>
              <p className="text-xs text-neutral-400">Tailscale-User-Login allowlist</p>
              <p className="text-xs text-neutral-500 mt-1">COMM_TAILSCALE_USERS=daniele.buatti@gmail.com</p>
            </div>
          </div>

          <div className="mt-3">
            <h4 className="font-medium text-white mb-2">Data Sources (read-only)</h4>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10 text-neutral-400">
                  <th className="text-left py-1">Source</th>
                  <th className="text-left py-1">Reader</th>
                  <th className="text-left py-1">Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5"><td className="py-1 text-white">Beeper (WhatsApp, IG, Messenger, LinkedIn, Discord)</td><td className="py-1 text-neutral-400">extract.py</td><td className="py-1 text-neutral-500">Beeper local DB on mini</td></tr>
                <tr className="border-b border-white/5"><td className="py-1 text-white">iMessage / SMS</td><td className="py-1 text-neutral-400">imessage_native.py</td><td className="py-1 text-neutral-500">~/Library/Messages/chat.db (needs Full Disk Access)</td></tr>
                <tr className="border-b border-white/5"><td className="py-1 text-white">Email</td><td className="py-1 text-neutral-400">email_store.py, extract_gmail.py</td><td className="py-1 text-neutral-500">Apple Mail local store + optional Gmail</td></tr>
                <tr className="border-b border-white/5"><td className="py-1 text-white">Calendar</td><td className="py-1 text-neutral-400">calendar_read.py</td><td className="py-1 text-neutral-500">Apple Calendar (date clash check)</td></tr>
              </tbody>
            </table>
            <p className="text-xs text-neutral-500 mt-2">Merged into data/messages.jsonl (~69k messages)</p>
          </div>

          <div className="mt-3">
            <h4 className="font-medium text-white mb-2">Processing Pipeline (Sync, via make_report.sh)</h4>
            <ol className="text-xs text-neutral-400 space-y-1 list-decimal list-inside">
              <li><strong className="text-white">Extract:</strong> Read each source, merge new messages, dedup</li>
              <li><strong className="text-white">Classify:</strong> analyze.py (reply needed, urgency), email_classify.py (Needs you / Not sure / Receipts / Newsletters / Spam), booking_decision.py + calendar_check.py (proposed dates vs calendar)</li>
              <li><strong className="text-white">Drafts:</strong> drafts.py writes suggested replies via local Ollama (no cloud)</li>
              <li><strong className="text-white">Media:</strong> media_extract.py finds links/recommendations to data/media.json</li>
              <li><strong className="text-white">Build:</strong> to_html.py produces dashboard.html (single page, no frameworks)</li>
            </ol>
          </div>

          <div className="mt-3">
            <h4 className="font-medium text-white mb-2">Dashboard Views</h4>
            <p className="text-xs text-neutral-400">Today, Inbox, Email, Follow-ups, Media, Calendar, People, Insights, Settings + side panel (Decide today, Needs a reply, Coming up)</p>
            <p className="text-xs text-neutral-500 mt-1">Data from /api/app-data; Media from /api/media. Saves to data/: preferences.json, tasks.json, email_preferences.json, media_state.json</p>
          </div>

          <div className="mt-3">
            <h4 className="font-medium text-white mb-2">Access Points</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="rounded-lg bg-neutral-900/50 p-3">
                <p className="text-xs text-neutral-400">Definitive (MBP)</p>
                <a href="https://macbook-pro-6.tailab1fd5.ts.net:8445/" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:underline text-xs font-mono">https://macbook-pro-6.tailab1fd5.ts.net:8445/</a>
                <p className="text-xs text-neutral-500">Tailnet only</p>
              </div>
              <div className="rounded-lg bg-neutral-900/50 p-3">
                <p className="text-xs text-neutral-400">Failover (Mini)</p>
                <a href="https://danieles-mac-mini.tailab1fd5.ts.net:8445/" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:underline text-xs font-mono">https://danieles-mac-mini.tailab1fd5.ts.net:8445/</a>
                <p className="text-xs text-neutral-500">Tailnet only</p>
              </div>
              <div className="rounded-lg bg-neutral-900/50 p-3">
                <p className="text-xs text-neutral-400">Tailscale IP (Mini)</p>
                <a href="http://100.116.158.22:8799/?token=local" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:underline text-xs font-mono">http://100.116.158.22:8799/?token=local</a>
                <p className="text-xs text-neutral-500">Token bootstrap</p>
              </div>
            </div>
          </div>

          <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <h4 className="font-medium text-amber-300 mb-1 text-xs">Things to be aware of</h4>
            <ul className="text-xs text-neutral-400 space-y-1 list-disc list-inside">
              <li>Two copies: MacBook and Mini don't sync — changes must be copied manually</li>
              <li>Not in git on the Mini: folder isn't tracked by git (MBP repo has one commit)</li>
              <li>Full Disk Access still needed for /usr/local/bin/python3 on Mini (Messages + Mail sync)</li>
              <li>Replying: "Open chat" opens Beeper/Messages on the host screen — only works at that machine</li>
              <li>Some marks (e.g. "Mark handled") are per-device (browser localStorage)</li>
              <li>Outside connections: media lookups (YouTube/Spotify/Vimeo/SoundCloud), thumbnail images, optional Gmail</li>
            </ul>
          </div>
        </div>
      </div>

      <button onClick={async () => { if (window.electronAPI) { const { saved } = await window.electronAPI.saveData({ type: 'network-snapshot' }); alert(`Saved to ${saved}`); } }} className="btn-orb w-full">Save Network Snapshot</button>
    </div>
  );
}
