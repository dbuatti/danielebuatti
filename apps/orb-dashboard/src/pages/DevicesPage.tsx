export default function DevicesPage() {
  const devices = [
    {
      name: 'crystal-tokyo',
      account: 'daniele.buatti@gmail.com',
      ip: '100.124.90.53',
      version: '1.58.2-1',
      os: 'Linux 4.4.302+',
      status: 'Connected',
      role: 'NAS (Synology)',
      specs: {
        type: 'Linux node (NAS)',
        services: ['File sharing', 'Media archive', 'Backups', 'SMB', 'Tailscale subnet router'],
        disk: 'Unknown',
        location: 'Home network',
      },
    },
    {
      name: 'danieles-mac-mini',
      account: 'daniele.buatti@gmail.com',
      ip: '100.116.158.22',
      version: '1.104.1',
      os: 'macOS 14.8.7',
      status: 'Connected',
      funnel: true,
      role: 'Secondary Mac / Server',
      specs: {
        type: 'Mac Mini',
        services: ['Jitsi (5 containers)', 'Stremio Docker stack', 'Syncthing', 'Planner sync', 'Tailscale'],
        disk: '228 GB total, 185 GB used (94%)',
        location: 'Home network',
        hostname: 'danieles-mac-mini',
      },
    },
    {
      name: 'ipad-pro-12-9-gen-5',
      account: 'daniele.buatti@gmail.com',
      ip: '100.67.83.5',
      version: '1.104.1',
      os: 'iOS 26.7.2',
      status: 'Connected',
      role: 'Tablet / Mobile',
      specs: {
        type: 'iPad Pro 12.9" (5th gen)',
        services: ['Tailscale', 'Stremio client', 'noVNC web access'],
        location: 'Mobile',
      },
    },
    {
      name: 'iphone173',
      account: 'daniele.buatti@gmail.com',
      ip: '100.118.89.79',
      version: '1.104.1',
      os: 'iOS 27.2.0',
      status: 'Last seen Oct 22, 11:44 PM GMT+11',
      role: 'Phone / Mobile',
      specs: {
        type: 'iPhone',
        services: ['Tailscale', 'Stremio client'],
        location: 'Mobile',
      },
    },
    {
      name: 'macbook-pro-6',
      account: 'daniele.buatti@gmail.com',
      ip: '100.74.213.103',
      version: '1.104.1',
      os: 'macOS 26.7.0',
      status: 'Connected',
      role: 'Primary Mac (this machine)',
      specs: {
        type: 'MacBook Pro (M1 Pro)',
        services: ['The Orb', 'opencode', 'Syncthing', 'VNC', 'Tailscale', 'Hammerspoon'],
        disk: '926 GB total, 837 GB used (95%)',
        location: 'Home / Mobile',
        hostname: 'macbook-pro-6.tailab1fd5.ts.net',
      },
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-display font-bold text-3xl text-white">Devices (Tailscale)</h2>
      <p className="text-neutral-400 text-sm">All machines on your tailnet (tailab1fd5.ts.net)</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {devices.map(dev => (
          <div key={dev.name} className="card-glass rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white text-lg">{dev.name}</h3>
                <p className="text-neutral-500 text-xs">{dev.role}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${dev.status === 'Connected' ? 'bg-green-500/20 text-green-300' : 'bg-amber-500/20 text-amber-300'}`}>
                {dev.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-neutral-400">Tailscale IP</span>
                <p className="text-white font-mono text-xs">{dev.ip}</p>
              </div>
              <div>
                <span className="text-neutral-400">Version</span>
                <p className="text-white font-mono text-xs">{dev.version}</p>
              </div>
              <div>
                <span className="text-neutral-400">OS</span>
                <p className="text-white text-xs">{dev.os}</p>
              </div>
              <div>
                <span className="text-neutral-400">Account</span>
                <p className="text-white text-xs">{dev.account}</p>
              </div>
              {dev.funnel && (
                <div>
                  <span className="text-neutral-400">Funnel</span>
                  <p className="text-green-300 text-xs">Enabled</p>
                </div>
              )}
              {dev.specs.disk && (
                <div>
                  <span className="text-neutral-400">Disk</span>
                  <p className="text-white text-xs">{dev.specs.disk}</p>
                </div>
              )}
              {dev.specs.hostname && (
                <div>
                  <span className="text-neutral-400">Hostname</span>
                  <p className="text-white font-mono text-xs">{dev.specs.hostname}</p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-white/5">
              <span className="text-neutral-400 text-xs">Services:</span>
              <div className="flex flex-wrap gap-1 mt-2">
                {dev.specs.services.map(s => (
                  <span key={s} className="px-2 py-0.5 rounded-full text-xs bg-amber-500/10 text-amber-300">{s}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={async () => { if (window.electronAPI) { const { saved } = await window.electronAPI.saveData({ type: 'tailscale-devices', devices }); alert(`Saved to ${saved}`); } }} className="btn-orb w-full">Save Device List</button>
    </div>
  );
}