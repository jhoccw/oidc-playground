
import React, { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'json' }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-lg bg-zinc-900 border border-zinc-800 p-4">
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-400 transition-colors"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <pre className="mono text-sm overflow-x-auto text-zinc-300">
        <code>{code}</code>
      </pre>
    </div>
  );
};
