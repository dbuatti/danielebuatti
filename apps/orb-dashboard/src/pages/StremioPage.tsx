export default function StremioPage() {
  return (
    <div className="space-y-6">
      <h2 className="font-display font-bold text-3xl text-white">Stremio</h2>

      {/* Native App */}
      <div className="card-glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-300 mb-3">Native App</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-neutral-400">Path</span>
            <p className="text-white font-mono text-xs">/Applications/Stremio.app</p>
          </div>
          <div>
            <span className="text-neutral-400">Port</span>
            <p className="text-white font-mono">11470</p>
          </div>
          <div>
            <span className="text-neutral-400">Addons</span>
            <p className="text-white">Not installed</p>
          </div>
          <div>
            <span className="text-neutral-400">Status</span>
            <p className="text-green-300">Running</p>
          </div>
        </div>
      </div>

      {/* Docker Stack */}
      <div className="card-glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-300 mb-3">Docker Stack (/Volumes/MEDIA/stremio-stack/)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-neutral-900/50 border border-white/5 p-4">
            <h4 className="font-medium text-white mb-1">AIOStreams</h4>
            <p className="text-sm text-neutral-400">Port 3000</p>
            <p className="text-xs text-green-300 mt-1">Running (has DB)</p>
          </div>
          <div className="rounded-xl bg-neutral-900/50 border border-white/5 p-4">
            <h4 className="font-medium text-white mb-1">stremio-server</h4>
            <p className="text-sm text-neutral-400">Port 11470</p>
            <p className="text-xs text-red-300 mt-1">Stuck — port conflict with native app</p>
          </div>
        </div>
      </div>

      {/* Port Conflict */}
      <div className="card-glass rounded-xl p-6 border-red-500/20">
        <h3 className="text-lg font-semibold text-red-300 mb-3">Port Conflict</h3>
        <p className="text-sm text-neutral-400">Between: Stremio native app and stremio-server container (both use port 11470)</p>
        <p className="text-sm text-amber-300 mt-2">Recommendation: Quit native Stremio or change container port to 11471</p>
        <p className="text-xs text-neutral-500 mt-1">Last attempted restart: 2026-10-23</p>
      </div>

      <button onClick={async () => { if (window.electronAPI) { const { saved } = await window.electronAPI.saveData({ type: 'stremio-status', port: 11470, status: 'running' }); alert(`Saved to ${saved}`); } }} className="btn-orb w-full">Save Status</button>
    </div>
  );
}