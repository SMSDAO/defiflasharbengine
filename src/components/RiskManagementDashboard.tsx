import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Flame, 
  Activity, 
  RotateCcw, 
  Plus, 
  X, 
  Bell, 
  Volume2, 
  Zap,
  Lock,
  Layers,
  Sliders,
  DollarSign
} from 'lucide-react';
import { EngineSettings, RiskSettings } from '../types/arbitrage';
import { getTranslation } from '../locales/i18n';
import { playSoundAlert } from '../utils/audioAlert';

interface RiskManagementDashboardProps {
  settings: EngineSettings;
  onUpdateRiskSettings: (newRiskSettings: Partial<RiskSettings>) => void;
  onResetCircuitBreaker: () => void;
  onTriggerEmergencyHalt: () => void;
}

export const RiskManagementDashboard: React.FC<RiskManagementDashboardProps> = ({
  settings,
  onUpdateRiskSettings,
  onResetCircuitBreaker,
  onTriggerEmergencyHalt
}) => {
  const { language, riskSettings } = settings;
  const t = (key: Parameters<typeof getTranslation>[1], params?: any) => getTranslation(language, key, params);

  const [newDexExclusion, setNewDexExclusion] = useState('');
  const [newPoolExclusion, setNewPoolExclusion] = useState('');

  // Add DEX exclusion
  const handleAddDex = () => {
    if (!newDexExclusion.trim()) return;
    if (!riskSettings.excludedDexes.includes(newDexExclusion.trim())) {
      onUpdateRiskSettings({
        excludedDexes: [...riskSettings.excludedDexes, newDexExclusion.trim()]
      });
    }
    setNewDexExclusion('');
  };

  // Remove DEX exclusion
  const handleRemoveDex = (dex: string) => {
    onUpdateRiskSettings({
      excludedDexes: riskSettings.excludedDexes.filter(d => d !== dex)
    });
  };

  // Add Pool exclusion
  const handleAddPool = () => {
    if (!newPoolExclusion.trim()) return;
    if (!riskSettings.excludedPools.includes(newPoolExclusion.trim())) {
      onUpdateRiskSettings({
        excludedPools: [...riskSettings.excludedPools, newPoolExclusion.trim()]
      });
    }
    setNewPoolExclusion('');
  };

  // Remove Pool exclusion
  const handleRemovePool = (pool: string) => {
    onUpdateRiskSettings({
      excludedPools: riskSettings.excludedPools.filter(p => p !== pool)
    });
  };

  // Test Notification
  const handleTestNotification = () => {
    playSoundAlert('alert');
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🚨 MEV Risk Alert (Arbitrum One)', {
        body: 'Simulated high-frequency gas spike / slippage drift breached alert threshold.'
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('🚨 MEV Risk Alert Active', {
            body: 'Browser notifications enabled for critical circuit breaker trips.'
          });
        }
      });
    }
  };

  const isVolatilityBreached = riskSettings.currentVolatilityIndex > riskSettings.marketVolatilityThreshold;
  const isLossNearLimit = (riskSettings.currentDailyLossEth / riskSettings.maxDailyLossEth) > 0.75;

  return (
    <div className="space-y-6 font-mono">
      {/* Top Banner & Status */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950/20 to-slate-900 border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                INSTITUTIONAL RISK CONTROL
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-100">
              {t('riskTitle')}
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl mt-1">
              {t('riskDesc')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleTestNotification}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 text-xs text-slate-200 flex items-center gap-2 transition-colors"
            >
              <Bell className="w-3.5 h-3.5 text-cyan-400" />
              Test Audio & Browser Alert
            </button>

            {riskSettings.circuitBreakerTripped ? (
              <button
                onClick={onResetCircuitBreaker}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all glow-emerald"
              >
                <RotateCcw className="w-4 h-4" />
                {t('resetBreaker')}
              </button>
            ) : (
              <button
                onClick={onTriggerEmergencyHalt}
                className="px-4 py-2 rounded-xl bg-rose-950/70 hover:bg-rose-900 border border-rose-700 text-rose-300 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)]"
              >
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                {t('manualHalt')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Key Risk Indicators Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* System Health Score */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{t('healthScore')}</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">
            96 <span className="text-xs text-slate-500">/ 100</span>
          </div>
          <div className="mt-2 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 w-[96%]" />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Low default slippage hazard</span>
        </div>

        {/* 24h Drawdown vs Cap */}
        <div className={`p-5 rounded-2xl border transition-all ${
          isLossNearLimit 
            ? 'bg-rose-950/20 border-rose-500/60 glow-rose' 
            : 'bg-slate-900/70 border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{t('var24h')}</span>
            <DollarSign className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-2">
            {riskSettings.currentDailyLossEth.toFixed(3)} <span className="text-xs text-slate-500">/ {riskSettings.maxDailyLossEth} ETH</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">
            Automatic trip if daily drawdown hits ceiling
          </span>
        </div>

        {/* Market Volatility Index */}
        <div className={`p-5 rounded-2xl border transition-all ${
          isVolatilityBreached 
            ? 'bg-amber-950/20 border-amber-500/60 glow-amber' 
            : 'bg-slate-900/70 border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{t('marketVolatility')}</span>
            <Flame className={`w-4 h-4 ${isVolatilityBreached ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-2 flex items-center gap-2">
            <span>{riskSettings.currentVolatilityIndex}%</span>
            {isVolatilityBreached && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700">
                Breach
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">
            Threshold alert: &gt;{riskSettings.marketVolatilityThreshold}%
          </span>
        </div>

        {/* Circuit Breaker Status */}
        <div className={`p-5 rounded-2xl border transition-all ${
          riskSettings.circuitBreakerTripped 
            ? 'bg-rose-950/40 border-rose-500 glow-rose' 
            : 'bg-slate-900/70 border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{t('circuitStatus')}</span>
            <Lock className={`w-4 h-4 ${riskSettings.circuitBreakerTripped ? 'text-rose-400' : 'text-emerald-400'}`} />
          </div>
          <div className={`text-base font-bold mt-2 ${
            riskSettings.circuitBreakerTripped ? 'text-rose-400' : 'text-emerald-400'
          }`}>
            {riskSettings.circuitBreakerTripped ? t('circuitTripped') : t('circuitOperational')}
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block truncate">
            {riskSettings.circuitBreakerReason || 'Ready for atomic flash minting'}
          </span>
        </div>
      </div>

      {/* Main Settings Tuning Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Exposure Limits & Gas Price Caps */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs uppercase font-bold text-slate-200 tracking-wider">
              Capital Exposure & Gas Safety Gates
            </h3>
          </div>

          {/* Exposure per Trade */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">{t('exposurePerTrade')}</span>
              <span className="font-bold text-cyan-400">{riskSettings.maxExposurePerTradeEth} ETH</span>
            </div>
            <input
              type="range"
              min="5"
              max="250"
              step="5"
              value={riskSettings.maxExposurePerTradeEth}
              onChange={(e) => onUpdateRiskSettings({ maxExposurePerTradeEth: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">
              Flash loan borrow principals exceeding this amount are rejected before simulation.
            </span>
          </div>

          {/* Exposure per Network */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">{t('exposurePerNetwork')}</span>
              <span className="font-bold text-purple-400">{riskSettings.maxExposurePerNetworkEth} ETH</span>
            </div>
            <input
              type="range"
              min="20"
              max="500"
              step="10"
              value={riskSettings.maxExposurePerNetworkEth}
              onChange={(e) => onUpdateRiskSettings({ maxExposurePerNetworkEth: parseFloat(e.target.value) })}
              className="w-full accent-purple-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">
              Cumulative active liquidity deployment cap for {settings.targetNetworkId.toUpperCase()}.
            </span>
          </div>

          {/* Gas Price Ceiling Alert */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">{t('gasAlertThreshold')}</span>
              <span className="font-bold text-amber-400">{riskSettings.gasPriceThresholdGwei} Gwei</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="50"
              step="0.2"
              value={riskSettings.gasPriceThresholdGwei}
              onChange={(e) => onUpdateRiskSettings({ gasPriceThresholdGwei: parseFloat(e.target.value) })}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">
              Triggers instant audio and UI alert if Arbitrum sequencer priority fees exceed ceiling.
            </span>
          </div>

          {/* Volatility Threshold */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">{t('volatilityThreshold')}</span>
              <span className="font-bold text-rose-400">{riskSettings.marketVolatilityThreshold}%</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="15.0"
              step="0.5"
              value={riskSettings.marketVolatilityThreshold}
              onChange={(e) => onUpdateRiskSettings({ marketVolatilityThreshold: parseFloat(e.target.value) })}
              className="w-full accent-rose-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">
              Pauses autopilot if 15-minute DEX volatility spikes over limit.
            </span>
          </div>
        </div>

        {/* Right: DEX & Liquidity Pool Exclusion Management */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs uppercase font-bold text-slate-200 tracking-wider">
              DEX & Toxic Pool Isolation Filter
            </h3>
          </div>

          {/* Excluded DEXes */}
          <div className="space-y-2">
            <label className="text-xs text-slate-300 block">{t('excludedDexes')}</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="e.g. Sushiswap V1, LowFeeDEX"
                value={newDexExclusion}
                onChange={(e) => setNewDexExclusion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddDex()}
                className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleAddDex}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-cyan-400 font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {riskSettings.excludedDexes.length === 0 ? (
                <span className="text-[11px] text-slate-500">No DEXes blacklisted. All standard routers active.</span>
              ) : (
                riskSettings.excludedDexes.map(dex => (
                  <span
                    key={dex}
                    className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5"
                  >
                    {dex}
                    <button onClick={() => handleRemoveDex(dex)} className="text-slate-500 hover:text-rose-400">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Excluded Pools */}
          <div className="space-y-2 pt-3 border-t border-slate-800/80">
            <label className="text-xs text-slate-300 block">{t('excludedPools')}</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="0x... (contract address of pool)"
                value={newPoolExclusion}
                onChange={(e) => setNewPoolExclusion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddPool()}
                className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleAddPool}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-cyan-400 font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {riskSettings.excludedPools.length === 0 ? (
                <span className="text-[11px] text-slate-500">No pools isolated.</span>
              ) : (
                riskSettings.excludedPools.map(pool => (
                  <span
                    key={pool}
                    className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5 font-mono"
                  >
                    {pool.slice(0, 8)}...{pool.slice(-6)}
                    <button onClick={() => handleRemovePool(pool)} className="text-slate-500 hover:text-rose-400">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
