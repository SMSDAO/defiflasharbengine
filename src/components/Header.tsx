import React from 'react';
import { 
  Zap, 
  ShieldAlert, 
  Cpu, 
  Radio, 
  Volume2, 
  VolumeX, 
  SlidersHorizontal, 
  Sliders, 
  Globe2, 
  Wallet,
  Play,
  Square,
  ShieldCheck,
  Sparkles,
  BarChart3,
  Languages
} from 'lucide-react';
import { EngineSettings, SupportedLanguage } from '../types/arbitrage';
import { SUPPORTED_NETWORKS } from '../config/networks';
import { getTranslation } from '../locales/i18n';

interface HeaderProps {
  settings: EngineSettings;
  onUpdateSettings: (newSettings: Partial<EngineSettings>) => void;
  activeTab: 'simple' | 'advanced' | 'mempool' | 'risk' | 'analyzer' | 'console' | 'performance';
  setActiveTab: (tab: 'simple' | 'advanced' | 'mempool' | 'risk' | 'analyzer' | 'console' | 'performance') => void;
  onOpenDrawer: (drawer: 'network' | 'strategy' | 'risk' | 'free-rpc') => void;
  walletBalance: string;
  isAutopilotRunning: boolean;
  onToggleAutopilot: () => void;
  onEmergencyStop: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onUpdateSettings,
  activeTab,
  setActiveTab,
  onOpenDrawer,
  walletBalance,
  isAutopilotRunning,
  onToggleAutopilot,
  onEmergencyStop
}) => {
  const currentNetwork = SUPPORTED_NETWORKS[settings.targetNetworkId];
  const { language } = settings;
  const t = (key: Parameters<typeof getTranslation>[1], params?: any) => getTranslation(language, key, params);

  const languagesList: { id: SupportedLanguage; label: string }[] = [
    { id: 'en', label: 'EN' },
    { id: 'es', label: 'ES' },
    { id: 'zh', label: '中文' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#090d14]/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Branding & Status */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-widest text-slate-100 uppercase font-mono">
                  {t('brandName')}<span className="text-cyan-400">{t('brandSub')}</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/50 font-mono">
                  v1.1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {t('tagline')}
              </p>
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => onOpenDrawer('network')}
              className="px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded text-slate-200 font-mono flex items-center gap-1"
            >
              <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
              {currentNetwork.nativeCurrency.symbol}
            </button>
            <button
              onClick={onToggleAutopilot}
              className={`p-2 rounded border font-mono text-xs flex items-center justify-center ${
                isAutopilotRunning
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-400 glow-emerald'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              {isAutopilotRunning ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>
          </div>
        </div>

        {/* Center: Navigation Tabs */}
        <div className="hidden xl:flex items-center bg-slate-900/90 p-1 rounded-lg border border-slate-800/80 font-mono text-xs">
          <button
            onClick={() => setActiveTab('simple')}
            className={`px-2.5 py-1.5 rounded transition-all flex items-center gap-1.5 ${
              activeTab === 'simple'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            {t('simpleMode')}
          </button>

          <button
            onClick={() => setActiveTab('advanced')}
            className={`px-2.5 py-1.5 rounded transition-all flex items-center gap-1.5 ${
              activeTab === 'advanced'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            {t('routeBuilder')}
          </button>

          <button
            onClick={() => setActiveTab('mempool')}
            className={`px-2.5 py-1.5 rounded transition-all flex items-center gap-1.5 ${
              activeTab === 'mempool'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            {t('mempoolStream')}
          </button>

          <button
            onClick={() => setActiveTab('risk')}
            className={`px-2.5 py-1.5 rounded transition-all flex items-center gap-1.5 ${
              activeTab === 'risk'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            {t('riskDashboard')}
          </button>

          <button
            onClick={() => setActiveTab('analyzer')}
            className={`px-2.5 py-1.5 rounded transition-all flex items-center gap-1.5 ${
              activeTab === 'analyzer'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            {t('strategyAnalyzer')}
          </button>

          <button
            onClick={() => setActiveTab('console')}
            className={`px-2.5 py-1.5 rounded transition-all flex items-center gap-1.5 ${
              activeTab === 'console'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            {t('daemonConsole')}
          </button>

          <button
            onClick={() => setActiveTab('performance')}
            className={`px-2.5 py-1.5 rounded transition-all flex items-center gap-1.5 ${
              activeTab === 'performance'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            {t('analytics')}
          </button>
        </div>

        {/* Right: Quick Action Controls & Language Selector */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
            {languagesList.map(item => (
              <button
                key={item.id}
                onClick={() => onUpdateSettings({ language: item.id })}
                className={`px-2 py-1 rounded transition-colors ${
                  settings.language === item.id 
                    ? 'bg-cyan-500 text-slate-950 font-bold' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Free Public RPC & Presets Hub Button */}
          <button
            onClick={() => onOpenDrawer('free-rpc')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-600/60 hover:bg-emerald-900/40 text-xs text-emerald-300 font-mono transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)]"
            title="100% Free Public RPCs & Zero Subscription MEV Relays"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold">FREE RPCs & MEV</span>
          </button>

          {/* Network Selector Badge */}
          <button
            onClick={() => onOpenDrawer('network')}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 font-mono transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>{currentNetwork.name}</span>
            <span className="text-[10px] text-slate-500">#{currentNetwork.chainId}</span>
          </button>

          {/* Gas Reserve Status */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
            <Wallet className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">{t('gasReserve')}</span>
            <span className="text-emerald-400 font-semibold">{walletBalance} ETH</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => onUpdateSettings({ audioAlertsEnabled: !settings.audioAlertsEnabled })}
            className={`p-2 rounded-lg border font-mono transition-colors ${
              settings.audioAlertsEnabled
                ? 'bg-slate-900 border-slate-700 text-cyan-400'
                : 'bg-slate-950 border-slate-800 text-slate-600'
            }`}
            title={settings.audioAlertsEnabled ? 'Sound alerts enabled' : 'Sound alerts muted'}
          >
            {settings.audioAlertsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Risk Drawer Button */}
          <button
            onClick={() => onOpenDrawer('risk')}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors"
            title="Risk & Profit Settings"
          >
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
          </button>

          {/* Autopilot Button */}
          <button
            onClick={onToggleAutopilot}
            className={`hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-mono text-xs font-semibold border transition-all ${
              isAutopilotRunning
                ? 'bg-emerald-500/20 border-emerald-500/80 text-emerald-300 glow-emerald'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isAutopilotRunning ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
            {isAutopilotRunning ? t('autopilotEngaged') : t('engageAutopilot')}
          </button>

          {/* Emergency Stop Button */}
          <button
            onClick={onEmergencyStop}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-950/40 border border-rose-800/80 text-rose-300 hover:bg-rose-900/60 font-mono text-xs font-semibold transition-all shadow-[0_0_12px_rgba(244,63,94,0.2)]"
            title="Emergency Circuit Breaker"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">{t('circuitStop')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
