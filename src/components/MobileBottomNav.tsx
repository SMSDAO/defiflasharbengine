import React from 'react';
import { Zap, Sliders, Radio, ShieldCheck, Sparkles, Cpu, BarChart3 } from 'lucide-react';
import { SupportedLanguage } from '../types/arbitrage';
import { getTranslation } from '../locales/i18n';

interface MobileBottomNavProps {
  activeTab: 'simple' | 'advanced' | 'mempool' | 'risk' | 'analyzer' | 'console' | 'performance';
  setActiveTab: (tab: 'simple' | 'advanced' | 'mempool' | 'risk' | 'analyzer' | 'console' | 'performance') => void;
  isAutopilotRunning: boolean;
  language: SupportedLanguage;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  isAutopilotRunning,
  language
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#090d14]/95 backdrop-blur-lg border-t border-slate-800/80 px-1 py-1.5 xl:hidden">
      <div className="flex items-center justify-around">
        <button
          onClick={() => setActiveTab('simple')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-mono transition-colors ${
            activeTab === 'simple'
              ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5 mb-0.5" />
          <span>Simple</span>
        </button>

        <button
          onClick={() => setActiveTab('advanced')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-mono transition-colors ${
            activeTab === 'advanced'
              ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 mb-0.5" />
          <span>Builder</span>
        </button>

        <button
          onClick={() => setActiveTab('mempool')}
          className={`relative flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-mono transition-colors ${
            activeTab === 'mempool'
              ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Radio className="w-3.5 h-3.5 mb-0.5 text-emerald-400" />
            <span className="absolute -top-0.5 -right-0.5 w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span>Mempool</span>
        </button>

        <button
          onClick={() => setActiveTab('risk')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-mono transition-colors ${
            activeTab === 'risk'
              ? 'text-purple-400 bg-purple-950/40 border border-purple-800/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 mb-0.5" />
          <span>Risk</span>
        </button>

        <button
          onClick={() => setActiveTab('analyzer')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-mono transition-colors ${
            activeTab === 'analyzer'
              ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 mb-0.5" />
          <span>Analyzer</span>
        </button>

        <button
          onClick={() => setActiveTab('console')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-mono transition-colors ${
            activeTab === 'console'
              ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 mb-0.5" />
          <span>Daemon</span>
        </button>

        <button
          onClick={() => setActiveTab('performance')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-mono transition-colors ${
            activeTab === 'performance'
              ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 mb-0.5" />
          <span>Stats</span>
        </button>
      </div>
    </nav>
  );
};
