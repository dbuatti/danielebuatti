export default function StremioPage() {
  return (
    <div className="space-y-6">
      <h2 className="font-display font-bold text-3xl text-white">Stremio</h2>

      {/* Status Summary */}
      <div className="card-glass rounded-xl p-6 border-green-500/20">
        <h3 className="text-lg font-semibold text-green-300 mb-3">✅ Stremio Fully Fixed — Running on Mini Docker Stack</h3>
        <p className="text-sm text-neutral-400">Native apps quit, ports freed, Docker containers running on Mini.</p>
      </div>

      {/* Native Apps */}
      <div className="card-glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-300 mb-3">Native Apps (Quit)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-neutral-900/50 border border-white/5 p-4">
            <h4 className="font-medium text-white mb-1">MBP Native App</h4>
            <p className="text-sm text-neutral-400">Path: /Applications/Stremio.app</p>
            <p className="text-xs text-neutral-500 mt-1">Status: Quit (ports freed)</p>
            <p className="text-xs text-neutral-500">Port: 11470/12470 (was running, zero addons)</p>
          </div>
          <div className="rounded-xl bg-neutral-900/50 border border-white/5 p-4">
            <h4 className="font-medium text-white mb-1">Mini Native App</h4>
            <p className="text-sm text-neutral-400">PID 7016 (was holding 11470)</p>
            <p className="text-xs text-neutral-500 mt-1">Status: Quit (ports freed)</p>
          </div>
        </div>
      </div>

      {/* Docker Stack */}
      <div className="card-glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-300 mb-3">Docker Stack (Mini)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-neutral-900/50 border border-green-500/20 p-4">
            <h4 className="font-medium text-white mb-1">stremio-server</h4>
            <p className="text-sm text-neutral-400">Port: 11470 + 12470</p>
            <p className="text-xs text-green-300 mt-1">✅ Running on Mini</p>
            <p className="text-xs text-neutral-500">Was: Created 6 weeks (port conflict)</p>
          </div>
          <div className="rounded-xl bg-neutral-900/50 border border-green-500/20 p-4">
            <h4 className="font-medium text-white mb-1">AIOStreams</h4>
            <p className="text-sm text-neutral-400">Port: 3000</p>
            <p className="text-xs text-green-300 mt-1">✅ Healthy (manifest: com.aiostreams.viren070)</p>
            <p className="text-xs text-neutral-500">Was: Up but disconnected</p>
          </div>
        </div>
      </div>

      {/* Access Points */}
      <div className="card-glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-300 mb-3">Access Points</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between p-3 bg-neutral-900/50 rounded-lg">
            <span className="text-neutral-400">AIOStreams Config Dashboard</span>
            <a href="http://danieles-mac-mini.tailab1fd5.ts.net:3000/stremio/configure" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:underline text-xs font-mono">
              danieles-mac-mini.tailab1fd5.ts.net:3000/stremio/configure
            </a>
          </div>
          <div className="flex items-center justify-between p-3 bg-neutral-900/50 rounded-lg">
            <span className="text-neutral-400">AIOStreams Manifest</span>
            <a href="http://danieles-mac-mini.tailab1fd5.ts.net:3000/stremio/manifest.json" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:underline text-xs font-mono">
              danieles-mac-mini.tailab1fd5.ts.net:3000/stremio/manifest.json
            </a>
          </div>
          <div className="flex items-center justify-between p-3 bg-neutral-900/50 rounded-lg">
            <span className="text-neutral-400">Stremio Web Player</span>
            <a href="https://app.strem.io/shell-v4.4/?streamingServer=http://100.116.158.22:11470" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:underline text-xs font-mono">
              app.strem.io (auto-redirects from Mini's 11470)
            </a>
          </div>
        </div>
      </div>

      {/* Security Fix */}
      <div className="card-glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-300 mb-3">Security Fix</h3>
        <div className="text-sm space-y-2">
          <p className="text-neutral-400">SECRET_KEY moved from hardcoded in compose → <code className="monospace">.env</code> file (mode 600)</p>
          <p className="text-neutral-400">Compose now maps both ports: 11470:11470 + 12470:12470</p>
        </div>
      </div>

      {/* Next Steps */}
      <div className="card-glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-300 mb-3">Next Steps</h3>
        <ol className="text-sm text-neutral-400 space-y-2 list-decimal list-inside">
          <li>Configure AIOStreams → open dashboard, add debrid accounts, install addons</li>
          <li>Install AIOStreams manifest in Stremio web/app → puzzle icon → paste manifest URL → Install</li>
          <li>Update per-system READMEs (Mini/MBP still show old status)</li>
        </ol>
      </div>

      <button onClick={async () => { if (window.electronAPI) { const { saved } = await window.electronAPI.saveData({ type: 'stremio-status', native: 'quit', docker: 'running', aiostreams: 'healthy' }); alert(`Saved to ${saved}`); } }} className="btn-orb w-full">Save Status</button>
    </div>
  );
}