
import React, { useState, useEffect } from 'react';
import { AuthRequestParams } from '../types.ts';
import { generateRandomString, buildAuthorizeUrl } from '../utils/oidc.ts';
import { CodeBlock } from './CodeBlock.tsx';

export const RequestBuilder: React.FC = () => {
  const [params, setParams] = useState<AuthRequestParams>({
    issuer: 'https://accounts.google.com/o/oauth2/v2/auth',
    clientId: '',
    redirectUri: 'http://localhost:3000/callback',
    scope: 'openid profile email',
    responseType: 'code',
    state: generateRandomString(16),
    nonce: generateRandomString(16),
  });

  const [generatedUrl, setGeneratedUrl] = useState('');

  useEffect(() => {
    const { issuer, ...rest } = params;
    try {
      const url = buildAuthorizeUrl(issuer, rest);
      setGeneratedUrl(url);
    } catch (e) {
      setGeneratedUrl('Invalid Auth Endpoint');
    }
  }, [params]);

  const updateParam = (key: keyof AuthRequestParams, value: string) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const regenerateSecrets = () => {
    setParams(prev => ({
      ...prev,
      state: generateRandomString(16),
      nonce: generateRandomString(16)
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 space-y-4">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-green-500 rounded-full"></span>
            Auth Request Builder
          </h2>
          
          <div className="space-y-3">
            <label className="block">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1 block">Auth Endpoint</span>
              <input
                type="text"
                value={params.issuer}
                onChange={(e) => updateParam('issuer', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-green-500/50 outline-none transition-all"
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1 block">Client ID</span>
              <input
                type="text"
                value={params.clientId}
                onChange={(e) => updateParam('clientId', e.target.value)}
                placeholder="your-client-id"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-green-500/50 outline-none transition-all"
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1 block">Redirect URI</span>
              <input
                type="text"
                value={params.redirectUri}
                onChange={(e) => updateParam('redirectUri', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-green-500/50 outline-none transition-all"
              />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1 block">Response Type</span>
                <select
                  value={params.responseType}
                  onChange={(e) => updateParam('responseType', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-green-500/50 outline-none appearance-none"
                >
                  <option value="code">code (Auth Code)</option>
                  <option value="token">token (Implicit)</option>
                  <option value="id_token">id_token</option>
                  <option value="code id_token">code id_token (Hybrid)</option>
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1 block">Scope</span>
                <input
                  type="text"
                  value={params.scope}
                  onChange={(e) => updateParam('scope', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-green-500/50 outline-none transition-all"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="block relative">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1 block">State</span>
                <input
                  type="text"
                  value={params.state}
                  onChange={(e) => updateParam('state', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-green-500/50 outline-none transition-all"
                />
              </label>
              <label className="block relative">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1 block">Nonce</span>
                <input
                  type="text"
                  value={params.nonce}
                  onChange={(e) => updateParam('nonce', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-green-500/50 outline-none transition-all"
                />
              </label>
            </div>
            
            <button
              onClick={regenerateSecrets}
              className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-bold transition-colors border border-zinc-700"
            >
              Regenerate Random State/Nonce
            </button>
          </div>
        </section>

        <section className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 h-full flex flex-col">
            <h3 className="text-lg font-semibold text-zinc-200 mb-4">Generated URL</h3>
            <div className="flex-1">
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg break-all text-xs mono text-green-400 mb-4 h-48 overflow-y-auto leading-relaxed scrollbar-thin scrollbar-thumb-zinc-800">
                {generatedUrl}
              </div>
              
              <div className="space-y-3">
                <a
                  href={generatedUrl === 'Invalid Auth Endpoint' ? '#' : generatedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full text-center py-3 rounded-lg font-bold transition-all shadow-lg ${
                    generatedUrl === 'Invalid Auth Endpoint' 
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-500 text-white shadow-green-900/20'
                  }`}
                  onClick={(e) => generatedUrl === 'Invalid Auth Endpoint' && e.preventDefault()}
                >
                  Initiate Auth Flow
                </a>
                <button
                  onClick={() => navigator.clipboard.writeText(generatedUrl)}
                  disabled={generatedUrl === 'Invalid Auth Endpoint'}
                  className="block w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  Copy URL
                </button>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-800">
              <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-3">Next Steps</h4>
              <ul className="text-xs text-zinc-400 space-y-2 list-disc pl-4">
                <li>Once you login, you'll be redirected to your <code className="text-green-400">redirect_uri</code>.</li>
                <li>Check the URL fragment or query params for the <code className="text-green-400">code</code>, <code className="text-green-400">id_token</code>, or <code className="text-green-400">access_token</code>.</li>
                <li>Paste those results into the **JWT Inspector** to debug.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
