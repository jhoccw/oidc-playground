
import React, { useState, useEffect } from 'react';
import { decodeJWT, formatTime } from '../utils/oidc';
import { DecodedJWT } from '../types';
import { CodeBlock } from './CodeBlock';

export const JWTDebugger: React.FC = () => {
  const [tokenInput, setTokenInput] = useState('');
  const [decoded, setDecoded] = useState<DecodedJWT | null>(null);

  useEffect(() => {
    if (tokenInput.trim()) {
      const res = decodeJWT(tokenInput);
      setDecoded(res);
    } else {
      setDecoded(null);
    }
  }, [tokenInput]);

  return (
    <div className="space-y-6">
      <section className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
          JWT Inspector
        </h2>
        <textarea
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          placeholder="Paste your ID Token or Access Token here..."
          className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm mono text-zinc-300 resize-none"
        />
      </section>

      {!decoded && tokenInput && (
        <div className="p-4 bg-yellow-900/20 border border-yellow-500/50 text-yellow-400 rounded-lg text-sm">
          Invalid JWT format. Please ensure it has three parts separated by dots.
        </div>
      )}

      {decoded && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-2">Header</h3>
              <CodeBlock code={JSON.stringify(decoded.header, null, 2)} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-2">Payload</h3>
              <CodeBlock code={JSON.stringify(decoded.payload, null, 2)} />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-2">Claim Validation</h3>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg divide-y divide-zinc-800">
                <div className="p-4 flex justify-between items-center">
                  <span className="text-zinc-400 text-sm font-medium">Issuer (iss)</span>
                  <span className="text-zinc-200 text-xs mono text-right break-all ml-4">{decoded.payload.iss || 'Missing'}</span>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <span className="text-zinc-400 text-sm font-medium">Subject (sub)</span>
                  <span className="text-zinc-200 text-xs mono text-right break-all ml-4">{decoded.payload.sub || 'Missing'}</span>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <span className="text-zinc-400 text-sm font-medium">Audience (aud)</span>
                  <span className="text-zinc-200 text-xs mono text-right break-all ml-4">
                    {Array.isArray(decoded.payload.aud) ? decoded.payload.aud.join(', ') : decoded.payload.aud || 'Missing'}
                  </span>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <span className="text-zinc-400 text-sm font-medium">Expires at (exp)</span>
                  <div className="text-right">
                    <div className="text-zinc-200 text-xs mono">{formatTime(decoded.payload.exp)}</div>
                    {decoded.payload.exp && decoded.payload.exp < Date.now() / 1000 ? (
                      <span className="text-[10px] text-red-400 font-bold uppercase">Expired</span>
                    ) : (
                      <span className="text-[10px] text-green-400 font-bold uppercase">Valid</span>
                    )}
                  </div>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <span className="text-zinc-400 text-sm font-medium">Issued at (iat)</span>
                  <span className="text-zinc-200 text-xs mono">{formatTime(decoded.payload.iat)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
              <h3 className="text-sm font-bold text-zinc-200 mb-2">Security Note</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Signature verification is not performed in this browser tool. Always verify signatures in your backend using the public keys from the provider's <code className="text-blue-400">jwks_uri</code>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
