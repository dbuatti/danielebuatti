export default function NASPage() {
  return (
    <div className="space-y-6">
      <h2 className="font-display font-bold text-3xl text-white">NAS Mounting</h2>
      <div className="card-glass rounded-xl p-8">
        <h3 className="text-xl font-semibold text-white mb-4">Home Network</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Server IP</label>
              <input type="text" defaultValue="100.124.90.53" className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-100 focus:border-amber-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Username</label>
              <input type="text" defaultValue="admin" className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-100 focus:border-amber-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Mount Point</label>
              <input type="text" defaultValue="/mnt/nas" className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-100 focus:border-amber-500 focus:outline-none" />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Password</label>
              <input type="password" defaultValue="••••••••" className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-100 focus:border-amber-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Share</label>
              <input type="text" defaultValue="NAS-Share" className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-100 focus:border-amber-500 focus:outline-none" />
            </div>
            <button className="w-full py-2 px-4 bg-amber-600 text-white rounded-lg hover:bg-amber-500 transition-colors">
              Test Connection
            </button>
          </div>
        </div>
        <div className="mt-6">
          <h4 className="text-lg font-medium text-white mb-2">Away Network</h4>
          <p className="text-neutral-400 text-sm">VPN/Cellular settings for remote NAS access</p>
          <div className="mt-4 p-4 bg-neutral-900/50 rounded-lg border border-white/5">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-neutral-400">VPN Endpoint:</span>
                <p className="text-neutral-100">vpn.nas-provider.com</p>
              </div>
              <div>
                <span className="text-neutral-400">DNS:</span>
                <p className="text-neutral-100">1.1.1.1, 8.8.8.8</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <h4 className="text-lg font-medium text-white mb-2">Mount NAS</h4>
          <p className="text-neutral-400 text-sm">Run the mount script for home or away access</p>
          <div className="mt-4 p-4 bg-neutral-900/50 rounded-lg border border-white/5">
            <p className="text-neutral-400">The script <code className="monospace">~/Library/Scripts/mount-nas.zsh</code> handles both home and away scenarios.</p>
            <div className="mt-2">
              <button
                onClick={async () => {
                  if (window.electronAPI) {
                    try {
                      const result = await window.electronAPI.runMountNas();
                      alert(`Mount script executed: ${result.success ? 'Success' : 'Failed'}`);
                    } catch (e) {
                      alert('Failed to execute mount script');
                    }
                  }
                }}
                className="btn-orb w-full bg-amber-600 text-white hover:bg-amber-500 transition-colors"
              >
                Run Mount Script
              </button>
            </div>
          </div>
        </div>
        <button onClick={async () => { if (window.electronAPI) { const { saved } = await window.electronAPI.saveData({ type: 'nas-config', home: {ip: '100.124.90.53', user: 'admin', mount: '/mnt/nas'}, away: {vpn: 'vpn.nas-provider.com'} }); alert(`Saved to ${saved}`); } }} className="btn-orb w-full">Save NAS Configuration</button>
      </div>
    </div>
  );
}