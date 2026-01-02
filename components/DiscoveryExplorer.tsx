
import React, { useState } from 'react';
import { OIDCConfig } from '../types';
import { CodeBlock } from './CodeBlock';

const COMMON_ISSUERS = [
  { name: 'Google', url: 'https://accounts.google.com' },
  { name: 'Auth0', url: 'https://{your-tenant}.auth0.com' },
  { name: 'Okta', url: 'https://{your-org}.okta.com/oauth2/default' },
  { name: 'Azure AD', url: 'https://login.microsoftonline.com/{tenant-id}/v2.0' },
];

export const DiscoveryExplorer: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<OIDCConfig | null>(null);
  const [error, setError] = useState('');

  const fetchDiscovery = async (issuerUrl: string) => {
    setLoading(true);
    setError('');
    setConfig(null);
    try {
      const discoveryUrl = issuerUrl.endsWith('/') 
        ? `${issuerUrl}.well-known/openid-configuration`
        : `${issuerUrl}/.well-known/openid-configuration`;
      
      const response = await fetch(discoveryUrl);
      if (!response.ok) throw new Error('Failed to fetch discovery document');
      const data = await response.json();
      setConfig(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
          Discovery Explorer
        </h2>
        <p className="text-zinc-400 text-sm mb-4">
          Enter an OIDC Issuer URL to fetch its OpenID Configuration.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://accounts.google.com"
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
          />
          <button
            onClick={() => fetchDiscovery(url)}
            disabled={loading || !url}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {loading ? 'Fetching...' : 'Fetch'}
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs text-zinc-500 mr-2 self-center">Presets:</span>
          {COMMON_ISSUERS.map(issuer => (
            <button
              key={issuer.name}
              onClick={() => {
                setUrl(issuer.url);
                fetchDiscovery(issuer.url);
              }}
              className="text-xs px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            >
              {issuer.name}
            </button>
          ))}
        </div>
      </section>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/50 text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      {config && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold text-zinc-200">Raw Configuration</h3>
            <CodeBlock code={JSON.stringify(config, null, 2)} />
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-zinc-200">Key Endpoints</h3>
            <div className="space-y-3">
              {[
                { label: 'Authorization', val: config.authorization_endpoint },
                { label: 'Token', val: config.token_endpoint },
                { label: 'UserInfo', val: config.userinfo_endpoint },
                { label: 'JWKS URI', val: config.jwks_uri }
              ].map(item => (
                <div key={item.label} className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                  <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1 font-bold">{item.label}</div>
                  <div className="text-xs text-blue-400 break-all mono">{item.val || 'N/A'}</div>
                </div>
              ))}
            </div>
            <h3 className="text-lg font-semibold text-zinc-200 pt-4">Supported Features</h3>
            <div className="flex flex-wrap gap-2">
              {config.scopes_supported?.map(s => (
                <span key={s} className="px-2 py-1 bg-green-900/20 text-green-400 text-[10px] rounded border border-green-500/20">{s}</span>
              ))}
              {config.response_types_supported?.map(r => (
                <span key={r} className="px-2 py-1 bg-purple-900/20 text-purple-400 text-[10px] rounded border border-purple-500/20">{r}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
