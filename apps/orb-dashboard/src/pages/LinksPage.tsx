import { useState } from 'react';

interface LinkItem {
  label: string;
  url: string;
  description: string;
  category: string;
  icon: string;
}

const links: LinkItem[] = [
  // The Orb
  { label: 'The Orb (MBP Web)', url: 'https://macbook-pro-6.tailab1fd5.ts.net:8446', description: 'Central dashboard — accessible from any device on tailnet', category: 'The Orb', icon: '🔮' },
  { label: 'The Orb (Mini Web)', url: 'https://danieles-mac-mini.tailab1fd5.ts.net:8449', description: 'Backup instance on Mac mini — accessible from any device on tailnet', category: 'The Orb', icon: '🔮' },
  { label: 'The Orb (MBP Local)', url: 'http://localhost:8450', description: 'Local web server on MBP', category: 'The Orb', icon: '🔮' },

  // Comm Analytics
  { label: 'Comm Analytics (Definitive)', url: 'https://macbook-pro-6.tailab1fd5.ts.net:8445/', description: 'Comm Analytics server — definitive link, accessible from all devices', category: 'Analytics', icon: '📊' },
  { label: 'Comm Analytics (Mini - Direct)', url: 'http://127.0.0.1:8799/', description: 'Direct from Mac Mini (local, no auth)', category: 'Analytics', icon: '📊' },
  { label: 'Comm Analytics (Mini - Tailnet)', url: 'http://100.116.158.22:8799/?token=local', description: 'Via Tailscale IP (requires token, works with cookie)', category: 'Analytics', icon: '📊' },
  { label: 'Comm Analytics (Mini - Tailscale Serve)', url: 'https://danieles-mac-mini.tailab1fd5.ts.net:8445/', description: 'Via Tailscale Serve (port 8445)', category: 'Analytics', icon: '📊' },

  // NAS
  { label: 'NAS (Moon Prism)', url: 'smb://100.124.90.53/Moon%20Prism', description: 'Crystal Tokyo NAS — Tailscale IP 100.124.90.53', category: 'NAS', icon: '💾' },

  // OpenCode
  { label: 'OpenCode (MBP)', url: 'https://macbook-pro-6.tailab1fd5.ts.net:8444', description: 'AI coding agent — native HTML web UI (MBP)', category: 'OpenCode', icon: '🤖' },
  { label: 'OpenCode (Mini)', url: 'http://danieles-mac-mini.tailab1fd5.ts.net:4096', description: 'AI coding agent on Mac mini (if running)', category: 'OpenCode', icon: '🤖' },
  { label: 'OpenCode Landing', url: 'https://macbook-pro-6.tailab1fd5.ts.net:8443', description: 'Session list + links to chat and VNC', category: 'Network', icon: '🏠' },
  { label: 'noVNC (Full Desktop)', url: 'https://macbook-pro-6.tailab1fd5.ts.net:8443/vnc.html', description: 'Full desktop access from iPad', category: 'Network', icon: '🖥️' },

  // Stremio
  { label: 'Stremio Server', url: 'https://danieles-mac-mini.tailab1fd5.ts.net:8447', description: 'Stremio streaming server backend (Mini Docker)', category: 'Stremio', icon: '🎬' },
  { label: 'AIOStreams Config', url: 'http://danieles-mac-mini.tailab1fd5.ts.net:3000/stremio/configure', description: 'Configure AIOStreams addons and debrid', category: 'Stremio', icon: '🎬' },
  { label: 'AIOStreams Manifest', url: 'http://danieles-mac-mini.tailab1fd5.ts.net:3000/stremio/manifest.json', description: 'Manifest URL for Stremio client', category: 'Stremio', icon: '🎬' },
  { label: 'Stremio Server', url: 'https://danieles-mac-mini.tailab1fd5.ts.net:8447', description: 'Stremio streaming server backend (Mini Docker)', category: 'Stremio', icon: '🎬' },

  // Jitsi
  { label: 'Jitsi Meet', url: 'https://macbook-pro-6.tailab1fd5.ts.net:8443', description: 'Self-hosted video conferencing (Mini)', category: 'Jitsi', icon: '📹' },

  // Systems
  { label: 'Systems Repo (GitHub)', url: 'https://github.com/dbuatti/danielebuatti', description: 'Central repository for all system configs', category: 'Systems', icon: '📁' },
  { label: 'Neon Console', url: 'https://console.neon.tech', description: 'Database quota management', category: 'Systems', icon: '🗄️' },

  // Syncthing
  { label: 'Syncthing (MBP)', url: 'http://127.0.0.1:8384', description: 'Sync status — MBP', category: 'Sync', icon: '🔄' },
  { label: 'Syncthing (Mini)', url: 'http://danieles-mac-mini.tailab1fd5.ts.net:8384', description: 'Sync status — Mini', category: 'Sync', icon: '🔄' },
];

const categories = [...new Set(links.map(l => l.category))];

export default function LinksPage() {
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = links.filter(l =>
    l.label.toLowerCase().includes(search.toLowerCase()) ||
    l.description.toLowerCase().includes(search.toLowerCase()) ||
    l.category.toLowerCase().includes(search.toLowerCase())
  );

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(url);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display font-bold text-3xl text-white">Links</h2>
      <p className="text-neutral-400 text-sm">All your regularly accessible links in one place. Tap to open, or copy to clipboard.</p>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search links..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-100 focus:border-amber-500 focus:outline-none pl-10"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">🔍</span>
      </div>

      {/* Links by category */}
      {categories.map(cat => {
        const catLinks = filtered.filter(l => l.category === cat);
        if (catLinks.length === 0) return null;
        return (
          <div key={cat} className="card-glass rounded-xl p-6">
            <h3 className="text-lg font-semibold text-amber-300 mb-3">{cat}</h3>
            <div className="space-y-2">
              {catLinks.map(link => (
                <div key={link.url} className="flex items-center justify-between p-3 bg-neutral-900/50 rounded-lg hover:bg-neutral-900/80 transition-colors group">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="text-lg flex-shrink-0">{link.icon}</span>
                    <div className="min-w-0 flex-1">
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-white font-medium text-sm hover:text-amber-300 transition-colors">
                        {link.label}
                      </a>
                      <p className="text-neutral-500 text-xs truncate">{link.description}</p>
                      <p className="text-neutral-600 text-xs font-mono truncate mt-0.5">{link.url}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost text-xs"
                    >
                      Open
                    </a>
                    <button
                      onClick={() => copyUrl(link.url)}
                      className="btn-ghost text-xs"
                    >
                      {copied === link.url ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div className="text-center py-8 text-neutral-500">No links match your search.</div>
      )}
    </div>
  );
}