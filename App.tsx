
import React, { useState } from 'react';
import { ViewType } from './types';
import { DiscoveryExplorer } from './components/DiscoveryExplorer';
import { JWTDebugger } from './components/JWTDebugger';
import { RequestBuilder } from './components/RequestBuilder';
import { GeminiAssistant } from './components/GeminiAssistant';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('discovery');

  const navItems = [
    { id: 'discovery', label: 'Discovery', icon: '🌐' },
    { id: 'builder', label: 'Auth Builder', icon: '🛠️' },
    { id: 'debugger', label: 'JWT Debugger', icon: '🔍' },
    { id: 'assistant', label: 'AI Expert', icon: '🤖' },
  ];

  const renderView = () => {
    switch (activeView) {
      case 'discovery': return <DiscoveryExplorer />;
      case 'builder': return <RequestBuilder />;
      case 'debugger': return <JWTDebugger />;
      case 'assistant': return <GeminiAssistant />;
      default: return <DiscoveryExplorer />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col p-6 space-y-8 sticky top-0 h-auto md:h-screen">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="bg-blue-600 p-1 rounded text-lg">O</span>
            OIDC Master
          </h1>
          <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest font-bold">Dev Debugging Suite</p>
        </div>

        <div className="space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as ViewType)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeView === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-zinc-800 space-y-4">
          <div className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-800">
            <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Status</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-xs text-zinc-300 font-medium">System Ready</span>
            </div>
          </div>
          <p className="text-[10px] text-zinc-600 leading-relaxed text-center italic">
            "Identity is who you are, OIDC is how you prove it."
          </p>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs text-blue-500 font-bold uppercase tracking-widest mb-1">Environment: Development</div>
            <h2 className="text-3xl font-extrabold text-white">
              {navItems.find(i => i.id === activeView)?.label}
            </h2>
          </div>
          <div className="flex gap-4">
            <div className="text-right hidden md:block">
              <div className="text-xs text-zinc-500">Last Session</div>
              <div className="text-xs text-zinc-300 font-mono">{new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </header>

        <div className="transition-all duration-300 ease-in-out">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
