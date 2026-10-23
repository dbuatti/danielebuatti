import { useEffect, useState } from 'react';

export default function NASPage() {
  const [creds, setCreds] = useState({
    server: '100.124.90.53',
    user: 'admin',
    password: '',
    mount: '/Volumes/Moon Prism',
    share: 'Moon Prism',
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.loadNasCreds().then((result: any) => {
        if (result.success && result.creds) {
          setCreds(result.creds);
        }
      });
    }
  }, []);

  async function saveCreds() {
    if (window.electronAPI) {
      const result = await window.electronAPI.saveNasCreds(creds);
      setStatus(result.success ? 'Credentials saved (encrypted)' : 'Failed to save');
      setTimeout(() => setStatus(''), 3000);
    }
  }

  async function runMount() {
    if (window.electronAPI) {
      try {
        const result = await window.electronAPI.runMountNas();
        alert(`Mount script: ${result.success ? 'Success' : 'Failed'}\n${result.stdout || ''}`);
      } catch (e) {
        alert('Failed to execute mount script');
      }
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display font-bold text-3xl text-white">NAS Mounting</h2>

      {/* NAS Info Card */}
      <div className="card-glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-300 mb-3">Crystal Tokyo (NAS)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-neutral-400">Hostname</span>
            <p className="text-white font-mono">crystal-tokyo</p>
          </div>
          <div>
            <span className="text-neutral-400">Tailscale IP</span>
            <p className="text-white font-mono">100.124.90.53</p>
          </div>
          <div>
            <span className="text-neutral-400">SMB Path</span>
            <p className="text-white font-mono text-xs">smb://100.124.90.53/Moon Prism</p>
          </div>
          <div>
            <span className="text-neutral-400">Services</span>
            <p className="text-white text-xs">File sharing, Media archive, Backups</p>
          </div>
        </div>
      </div>

      {/* Credentials */}
      <div className="card-glass rounded-xl p-8">
        <h3 className="text-xl font-semibold text-white mb-4">Home Network (Tailscale)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Server IP</label>
              <input type="text" value={creds.server} onChange={e => setCreds({ ...creds, server: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-100 focus:border-amber-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Username</label>
              <input type="text" value={creds.user} onChange={e => setCreds({ ...creds, user: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-100 focus:border-amber-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Mount Point</label>
              <input type="text" value={creds.mount} onChange={e => setCreds({ ...creds, mount: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-100 focus:border-amber-500 focus:outline-none" />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Password (stored encrypted)</label>
              <input type="password" value={creds.password} onChange={e => setCreds({ ...creds, password: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-100 focus:border-amber-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Share</label>
              <input type="text" value={creds.share} onChange={e => setCreds({ ...creds, share: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-100 focus:border-amber-500 focus:outline-none" />
            </div>
            <button onClick={saveCreds} className="w-full py-2 px-4 bg-amber-600 text-white rounded-lg hover:bg-amber-500 transition-colors">
              Save Credentials (Encrypted)
            </button>
            {status && <p className="text-xs text-green-300">{status}</p>}
          </div>
        </div>

        {/* Away Network */}
        <div className="mt-6">
          <h4 className="text-lg font-medium text-white mb-2">Away Network</h4>
          <p className="text-neutral-400 text-sm">Tailscale works from anywhere — including personal hotspot. Just ensure Tailscale is connected.</p>
          <div className="mt-4 p-4 bg-neutral-900/50 rounded-lg border border-white/5">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-neutral-400">VPN Endpoint:</span>
                <p className="text-neutral-100">Tailscale (100.124.90.53)</p>
              </div>
              <div>
                <span className="text-neutral-400">Method:</span>
                <p className="text-neutral-100">UDP hole-punching via Tailscale</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mount Script */}
        <div className="mt-6">
          <h4 className="text-lg font-medium text-white mb-2">Mount NAS</h4>
          <p className="text-neutral-400 text-sm">Run the mount script for home or away access</p>
          <div className="mt-4 p-4 bg-neutral-900/50 rounded-lg border border-white/5">
            <p className="text-neutral-400 text-xs">Script: <code className="monospace">~/Library/Scripts/mount-nas.zsh</code></p>
            <p className="text-neutral-400 text-xs mt-1">Fixed from LAN IP 192.168.1.102 → Tailscale IP 100.124.90.53</p>
            <div className="mt-2">
              <button onClick={runMount} className="btn-orb w-full bg-amber-600 text-white hover:bg-amber-500 transition-colors">
                Run Mount Script
              </button>
            </div>
          </div>
        </div>

        <button onClick={async () => { if (window.electronAPI) { const { saved } = await window.electronAPI.saveData({ type: 'nas-config', home: creds, away: { vpn: 'tailscale' } }); alert(`Saved to ${saved}`); } }} className="btn-orb w-full">Save NAS Configuration</button>
      </div>
    </div>
  );
}