import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  ArrowDown, 
  Sliders, 
  AlertTriangle, 
  RefreshCw, 
  Zap, 
  ShieldCheck, 
  ExternalLink,
  Flame,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { RouteStep, EngineSettings, ArbitrageOpportunity, TokenInfo } from '../types/arbitrage';
import { SUPPORTED_NETWORKS } from '../config/networks';
import { strategyTunerService } from '../services/strategyTunerService';
import { getTranslation } from '../locales/i18n';

interface AdvancedRouteBuilderProps {
  settings: EngineSettings;
  onExecuteCustomRoute: (opportunity: ArbitrageOpportunity) => void;
  isExecuting: boolean;
}

export const AdvancedRouteBuilder: React.FC<AdvancedRouteBuilderProps> = ({
  settings,
  onExecuteCustomRoute,
  isExecuting
}) => {
  const currentNetwork = SUPPORTED_NETWORKS[settings.targetNetworkId];
  const { language, riskSettings } = settings;
  const t = (key: Parameters<typeof getTranslation>[1], params?: any) => getTranslation(language, key, params);

  const [borrowAsset, setBorrowAsset] = useState<TokenInfo>(currentNetwork.tokens[0]);
  const [borrowAmount, setBorrowAmount] = useState<string>('15.0');
  const [hasChainlinkDrift, setHasChainlinkDrift] = useState<boolean>(false);
  const [driftPercentage, setDriftPercentage] = useState<number>(2.4);

  // Dynamic Steps List
  const [steps, setSteps] = useState<RouteStep[]>([
    {
      id: 'step-1',
      dex: 'Uniswap V3 (0.05%)',
      tokenIn: currentNetwork.tokens[0], // WETH
      tokenOut: currentNetwork.tokens[1], // USDC
      poolFeeBps: 500,
      expectedOut: '47,250.00',
      minAmountOut: '47,020.00',
      priceImpactPercent: 0.08,
      warningLevel: 'none'
    },
    {
      id: 'step-2',
      dex: 'Camelot DEX V2',
      tokenIn: currentNetwork.tokens[1], // USDC
      tokenOut: currentNetwork.tokens[4] || currentNetwork.tokens[0], // ARB
      poolFeeBps: 300,
      expectedOut: '60,180.00',
      minAmountOut: '59,850.00',
      priceImpactPercent: 0.12,
      warningLevel: 'none'
    },
    {
      id: 'step-3',
      dex: 'Balancer V2 Vault',
      tokenIn: currentNetwork.tokens[4] || currentNetwork.tokens[0], // ARB
      tokenOut: currentNetwork.tokens[0], // WETH
      poolFeeBps: 200,
      expectedOut: '15.062',
      minAmountOut: '15.045',
      priceImpactPercent: 0.11,
      warningLevel: 'none'
    }
  ]);

  // Recalculate Live ROI
  const numBorrow = parseFloat(borrowAmount) || 0;
  const roiData = strategyTunerService.calculateRouteROI(
    numBorrow,
    steps,
    0.0012,
    settings.mevBribeBps
  );

  // Check if any step uses an excluded DEX
  const hasExcludedDex = steps.some(step =>
    riskSettings.excludedDexes.some(ex => step.dex.toLowerCase().includes(ex.toLowerCase()))
  );

  // Add Step
  const handleAddStep = () => {
    if (steps.length >= 5) return;
    const lastStep = steps[steps.length - 1];
    const newStep: RouteStep = {
      id: `step-${Date.now()}`,
      dex: currentNetwork.dexes[0].name,
      tokenIn: lastStep.tokenOut,
      tokenOut: borrowAsset,
      poolFeeBps: 300,
      expectedOut: (numBorrow * 1.003).toFixed(3),
      minAmountOut: (numBorrow * 1.001).toFixed(3),
      priceImpactPercent: 0.14,
      warningLevel: 'none'
    };
    setSteps([...steps, newStep]);
  };

  // Remove Step
  const handleRemoveStep = (id: string) => {
    if (steps.length <= 2) return;
    setSteps(steps.filter(s => s.id !== id));
  };

  // Trigger Chainlink drift simulation
  const handleTestDrift = () => {
    setHasChainlinkDrift(!hasChainlinkDrift);
    if (!hasChainlinkDrift) {
      setSteps(steps.map(s => {
        const raw = parseFloat(s.expectedOut.replace(/,/g, ''));
        const safe = raw * (1 - (settings.slippageTolerancePercent / 100));
        return {
          ...s,
          minAmountOut: safe.toLocaleString('en-US', { maximumFractionDigits: 3 }),
          warningLevel: 'warning',
          warningMessage: 'Oracle Drift > 2.0% detected. minAmountOut recalculation enforced.'
        };
      }));
    } else {
      setSteps(steps.map(s => ({ ...s, warningLevel: 'none', warningMessage: undefined })));
    }
  };

  // Trigger Execution
  const handleExecute = () => {
    const customOpp: ArbitrageOpportunity = {
      id: `custom-${Date.now()}`,
      timestamp: Date.now(),
      asset: borrowAsset,
      borrowAmount: (numBorrow * 1e18).toString(),
      borrowAmountFormatted: numBorrow.toFixed(2),
      routes: steps,
      grossProfitEth: roiData.grossProfit,
      grossProfitUsd: roiData.grossProfit * 3150,
      estimatedGasEth: 0.0012,
      minerBribeEth: (roiData.grossProfit * settings.mevBribeBps) / 10000,
      netProfitEth: roiData.netProfit,
      netProfitUsd: roiData.netProfit * 3150,
      roiPercent: roiData.roi,
      confidenceScore: 92,
      status: 'detected',
      networkId: settings.targetNetworkId,
      isAutopilotEligible: roiData.netProfit >= settings.minNetProfitEth && !hasExcludedDex
    };

    onExecuteCustomRoute(customOpp);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Top Config Header */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span className="text-xs uppercase tracking-wider text-slate-400">{t('proMevWorkspace')}</span>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-slate-100">
              {t('builderTitle')}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {t('builderDesc')}
            </p>
          </div>

          {/* Chainlink Oracle Drift Indicator & Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleTestDrift}
              className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-2 transition-all ${
                hasChainlinkDrift
                  ? 'bg-amber-950/60 border-amber-500 text-amber-300 glow-amber'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${hasChainlinkDrift ? 'animate-spin' : ''}`} />
              {hasChainlinkDrift ? t('oracleDriftActive', { n: driftPercentage }) : t('simulateDrift')}
            </button>
          </div>
        </div>

        {/* Loan Asset & Principal Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-800">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">{t('borrowAsset')}</label>
            <select
              value={borrowAsset.symbol}
              onChange={(e) => {
                const found = currentNetwork.tokens.find(t => t.symbol === e.target.value);
                if (found) setBorrowAsset(found);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {currentNetwork.tokens.map((token) => (
                <option key={token.symbol} value={token.symbol}>
                  {token.symbol} - {token.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">{t('borrowAmount')}</label>
            <div className="relative">
              <input
                type="number"
                value={borrowAmount}
                onChange={(e) => setBorrowAmount(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500 pr-16"
              />
              <span className="absolute right-3 top-2 text-xs text-slate-500 font-bold">
                {borrowAsset.symbol}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">{t('aavePool')}</label>
            <div className="px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 truncate">
              {currentNetwork.aavePool}
            </div>
          </div>
        </div>
      </div>

      {/* Main Builder Steps Column & ROI Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Step Sequencing */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase font-bold text-slate-300 tracking-wider">
              {t('executionSequence')} ({steps.length} Hops)
            </h3>
            <button
              disabled={steps.length >= 5}
              onClick={handleAddStep}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500 text-xs text-cyan-400 flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              {t('addSwapHop')}
            </button>
          </div>

          {hasExcludedDex && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/80 text-xs text-rose-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Warning: This route contains a DEX currently on the risk exclusion list!</span>
            </div>
          )}

          {/* Draggable/Animated Swap Steps */}
          <div className="space-y-3">
            <AnimatePresence>
              {steps.map((step, idx) => (
                <motion.div
                  key={step.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all relative"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 text-[10px] font-bold text-cyan-400 flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-200">
                        {t('hopTitle', { n: idx + 1 })} {step.dex}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {step.warningLevel === 'warning' && (
                        <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-600/60 text-amber-300 text-[10px] flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Drift Recalibrated
                        </span>
                      )}
                      {steps.length > 2 && (
                        <button
                          onClick={() => handleRemoveStep(step.id)}
                          className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-[10px] text-slate-500 block">{t('routerTarget')}</span>
                      <span className="text-xs text-slate-300 font-semibold">{step.dex}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 block">{t('pairDirection')}</span>
                      <span className="text-xs text-cyan-400 font-bold">
                        {step.tokenIn.symbol} → {step.tokenOut.symbol}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 block">{t('protectedMinOut')}</span>
                      <span className="text-xs text-emerald-400 font-bold">
                        {step.minAmountOut} {step.tokenOut.symbol}
                      </span>
                    </div>
                  </div>

                  {step.warningMessage && (
                    <div className="mt-2.5 text-[11px] text-amber-400 bg-amber-950/30 p-2 rounded border border-amber-800/40">
                      {step.warningMessage}
                    </div>
                  )}

                  {idx < steps.length - 1 && (
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 z-10 w-6 h-6 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center text-slate-400 shadow-md">
                      <ArrowDown className="w-3 h-3" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Col: Real-Time ROI Engine & Execution */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-[#0c1017] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase text-slate-300 tracking-wider">
                {t('realTimeRoi')}
              </span>
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{t('borrowAmount')}:</span>
                <span className="font-semibold text-slate-200">{numBorrow} {borrowAsset.symbol}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{t('grossYield')}:</span>
                <span className="font-semibold text-cyan-400">+{roiData.grossProfit} ETH</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Gas & Reorg Protection:</span>
                <span className="font-semibold text-slate-400">-0.0012 ETH</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{t('minerBribe')} ({(settings.mevBribeBps / 100).toFixed(0)}%):</span>
                <span className="font-semibold text-amber-400">
                  -{((roiData.grossProfit * settings.mevBribeBps) / 10000).toFixed(5)} ETH
                </span>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">{t('netProfit')}</span>
                  <span className="text-lg font-bold text-emerald-400">
                    +{roiData.netProfit} ETH
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">ROI</span>
                  <span className="text-sm font-bold text-emerald-300">
                    +{roiData.roi}%
                  </span>
                </div>
              </div>
            </div>

            {/* Safety Assessment */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t('revertGuardEnabled')}
              </div>
              <p className="text-slate-400 text-[10px]">
                {t('excludedDexesNote')}
              </p>
            </div>

            {/* Execute Button */}
            <button
              disabled={isExecuting || !roiData.isProfitable || riskSettings.circuitBreakerTripped || hasExcludedDex}
              onClick={handleExecute}
              className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg ${
                riskSettings.circuitBreakerTripped
                  ? 'bg-rose-950/60 text-rose-400 border border-rose-800 cursor-not-allowed'
                  : hasExcludedDex
                  ? 'bg-amber-950/60 text-amber-400 border border-amber-800 cursor-not-allowed'
                  : isExecuting
                  ? 'bg-cyan-600 text-slate-950 animate-pulse'
                  : roiData.isProfitable
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/25 active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              {riskSettings.circuitBreakerTripped ? (
                <>
                  <ShieldAlert className="w-4 h-4" />
                  Circuit Breaker Tripped
                </>
              ) : isExecuting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  {t('broadcasting')}
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  {t('executePolymorphic')}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
