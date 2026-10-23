export default function CrossOverPage() {
  const mbpGames = ["20 Minutes Till Dawn", "Arise", "Baldur's Gate 3", "Borderlands 2", "Disney Dreamlight Valley", "Hollow Knight: Silksong", "Lake", "Moss", "Persona 5 Royal", "Slime Rancher 2", "Split Fiction"];
  const miniGames = ["20 Minutes Till Dawn", "Arise", "Disney Dreamlight Valley", "Good Pizza", "Grand Theft Auto V Enhanced", "Hollow Knight: Silksong", "Lake", "Leaf it Alone", "Moonlighter 2", "Slime Rancher 2", "Split Fiction"];

  return (
    <div className="space-y-6">
      <h2 className="font-display font-bold text-3xl text-white">CrossOver</h2>

      {/* MBP */}
      <div className="card-glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-300 mb-3">MBP (Version 26.3)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
          <div>
            <span className="text-neutral-400">Path</span>
            <p className="text-white font-mono text-xs">/Applications/CrossOver.app</p>
          </div>
          <div>
            <span className="text-neutral-400">Wine</span>
            <p className="text-white">Whisky 2.4.5-0</p>
          </div>
          <div>
            <span className="text-neutral-400">Bottle</span>
            <p className="text-white">Main</p>
          </div>
          <div>
            <span className="text-neutral-400">Launchers</span>
            <p className="text-white">38</p>
          </div>
          <div>
            <span className="text-neutral-400">Location</span>
            <p className="text-white font-mono text-xs">/Volumes/Samsung SSD/Games/CrossOver/Bottles/Main</p>
          </div>
          <div>
            <span className="text-neutral-400">Syncthing</span>
            <p className="text-green-300">Running (daily sync)</p>
          </div>
        </div>
        <div>
          <span className="text-neutral-400 text-xs">Games:</span>
          <p className="text-neutral-300 text-xs mt-1">{mbpGames.join(', ')}</p>
        </div>
      </div>

      {/* Mini */}
      <div className="card-glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-300 mb-3">Mini (Version 26.0)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
          <div>
            <span className="text-neutral-400">Path</span>
            <p className="text-white font-mono text-xs">/Applications/CrossOver.app</p>
          </div>
          <div>
            <span className="text-neutral-400">Wine</span>
            <p className="text-white">CrossOver built-in</p>
          </div>
          <div>
            <span className="text-neutral-400">Bottle</span>
            <p className="text-white">Main</p>
          </div>
          <div>
            <span className="text-neutral-400">Launchers</span>
            <p className="text-white">10</p>
          </div>
          <div>
            <span className="text-neutral-400">Location</span>
            <p className="text-white font-mono text-xs">/Volumes/MEDIA/Games/CrossOver/Bottles/Main</p>
          </div>
        </div>
        <div>
          <span className="text-neutral-400 text-xs">Games:</span>
          <p className="text-neutral-300 text-xs mt-1">{miniGames.join(', ')}</p>
        </div>
      </div>

      {/* Sync Status */}
      <div className="card-glass rounded-xl p-6 border-amber-500/20">
        <h3 className="text-lg font-semibold text-amber-300 mb-3">Sync Status</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-neutral-400">MBP → Mini</span>
            <p className="text-amber-300">3.7 GB remaining</p>
          </div>
          <div>
            <span className="text-neutral-400">Status</span>
            <p className="text-white">In progress (since 2026-10-23)</p>
          </div>
        </div>
        <p className="text-xs text-neutral-500 mt-2">.stignore does NOT ignore cxbottle.conf — version mismatch risk (26.3 → 26.0)</p>
      </div>

      <button onClick={async () => { if (window.electronAPI) { const { saved } = await window.electronAPI.saveData({ type: 'crossover-status', bottle: 'Main', version: '26.3' }); alert(`Saved to ${saved}`); } }} className="btn-orb w-full">Save Status</button>
    </div>
  );
}