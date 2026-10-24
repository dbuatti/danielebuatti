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

      {/* Comm Analytics Server */}
      <div className="card-glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-300 mb-3">Comm Analytics Server (Mac Mini)</h3>
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-xl bg-neutral-900/50 border border-white/5 p-4">
              <h4 className="font-medium text-white mb-1">Host</h4>
              <p className="text-xs text-neutral-400">Mac mini, ~/dyad-apps/comm-analytics</p>
              <p className="text-xs text-neutral-500 mt-1">Python 3.11, no framework</p>
            </div>
            <div className="rounded-xl bg-neutral-900/50 border border-white/5 p-4">
              <h4 className="font-medium text-white mb-1">Server</h4>
              <p className="text-xs text-neutral-400">src/serve.py (built-in Python web server)</p>
              <p className="text-xs text-neutral-500 mt-1">Background service: com.commanalytics.serve</p>
            </div>
            <div className="rounded-xl bg-neutral-900/50 border border-white/5 p-4">
              <h4 className="font-medium text-white mb-1">Listen</h4>
              <p className="text-xs text-neutral-400">127.0.0.1:8799 (local only)</p>
              <p className="text-xs text-neutral-500 mt-1">Remote via Tailscale Serve: port 8445</p>
            </div>
            <div className="rounded-xl bg-neutral-900/50 border border-white/5 p-4">
              <h4 className="font-medium text-white mb-1">Config</h4>
              <p className="text-xs text-neutral-400">COMM_HOST=0.0.0.0, COMM_TOKEN=local</p>
              <p className="text-xs text-neutral-500 mt-1">Starts at login, restarts on crash</p>
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
                <p className="text-xs text-neutral-400">Direct (Mini local)</p>
                <a href="http://127.0.0.1:8799/" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:underline text-xs font-mono">http://127.0.0.1:8799/</a>
                <p className="text-xs text-neutral-500">No auth</p>
              </div>
              <div className="rounded-lg bg-neutral-900/50 p-3">
                <p className="text-xs text-neutral-400">Tailscale IP</p>
                <a href="http://100.116.158.22:8799/?token=local" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:underline text-xs font-mono">http://100.116.158.22:8799/?token=local</a>
                <p className="text-xs text-neutral-500">Requires token</p>
              </div>
              <div className="rounded-lg bg-neutral-900/50 p-3">
                <p className="text-xs text-neutral-400">Tailscale Serve</p>
                <a href="https://danieles-mac-mini.tailab1fd5.ts.net:8445/" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:underline text-xs font-mono">https://danieles-mac-mini.tailab1fd5.ts.net:8445/</a>
                <p className="text-xs text-neutral-500">Tailnet only</p>
              </div>
            </div>
          </div>

          <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <h4 className="font-medium text-amber-300 mb-1 text-xs">Things to be aware of</h4>
            <ul className="text-xs text-neutral-400 space-y-1 list-disc list-inside">
              <li>Two copies: MacBook and Mini don't sync - changes must be copied manually</li>
              <li>Not in git on the Mini: folder isn't tracked by git (MBP repo has one commit)</li>
              <li>Full Disk Access still needed for /usr/local/bin/python3 on Mini (Messages + Mail sync)</li>
              <li>Replying: "Open chat" opens Beeper/Messages on the Mini screen - only works when at the Mini</li>
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