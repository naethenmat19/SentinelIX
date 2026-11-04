import React from 'react';
import { ShieldCheck, Activity, Terminal, Server, Cpu } from 'lucide-react';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-[#111827] border border-gray-800 rounded-xl p-8 shadow-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-600/10 border border-blue-500/30 rounded-lg text-blue-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              SentinelX
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
                Phase 1 Initialized
              </span>
            </h1>
            <p className="text-sm text-gray-400">Security Operations Center (SOC) Platform</p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between p-3.5 bg-gray-900/70 border border-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-medium text-gray-300">Frontend Environment</span>
            </div>
            <span className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              React + Vite + Tailwind CSS Active
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-gray-900/70 border border-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <Server className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium text-gray-300">Backend API</span>
            </div>
            <span className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
              Express + TypeScript Ready
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-gray-900/70 border border-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-medium text-gray-300">Modular Architecture</span>
            </div>
            <span className="text-xs px-2 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
              Routes / Controllers / Services
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span>Workspace: Ready for Phase 2 (Auth & RBAC)</span>
          </div>
          <span>Port: 5173</span>
        </div>
      </div>
    </div>
  );
};

export default App;
