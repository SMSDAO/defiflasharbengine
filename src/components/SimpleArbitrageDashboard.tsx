import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  ArrowRight, 
  ShieldCheck, 
  Flame, 
  Play, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert,
  Activity
} from 'lucide-react';
import { ArbitrageOpportunity, EngineSettings } from '../types/arbitrage';
import { getTranslation } from '../locales/i18n';

interface SimpleArbitrageDashboardProps {
  opportunities: ArbitrageOpportunity[];
  onExecute: (opp: ArbitrageOpportunity) => void;
  executingId: string | null;
  settings: EngineSettings;
}

export const SimpleArbitrageDashboard: React.FC<SimpleArbitrageDashboardProps> = ({
  opportunities,
  onExecute,
  executingId,
  settings
}) => {
  const { language, riskSettings } = settings;
  const t = (key: Parameters<typeof getTranslation>[1], params?: any) => getTranslation(language, key, params);

  return (
    <div className="space-y-6 font-mono">
      {/* Overview Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/20 to-slate-900 border border-slate-800 p-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold">
                {t('feedActive')}
              </span>
              <span className="text-slate-400 text-xs">
                {t('scannedCount', { n: opportunities.length })}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight">
              {t('simpleTitle')}
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl mt-1">
              {t('simpleDesc')}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800/80 p-3.5 rounded-xl">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">{t('topDetectedSpread')}</div>
              <div className="text-lg font-bold text-emerald-400">
                +{opportunities.length > 0 ? Math.max(...opportunities.map(o => o.netProfitEth)).toFixed(4) : '0.0000'} ETH
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 glow-emerald">
              <Flame className="w-5 h-5 fill-current animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 gap-4">
        {opportunities.map((opp, idx) => {
          const isExecuting = executingId === opp.id;
          const meetsAutopilotGate = opp.netProfitEth >= settings.minNetProfitEth && (opp.riskAnalysis ? opp.riskAnalysis.isApprovedForAutopilot : true);

          // Confidence color gradient
          const confidenceColor = 
            opp.confidenceScore >= 90 ? 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40' :
            opp.confidenceScore >= 75 ? 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40' :
            'text-amber-400 border-amber-500/30 bg-amber-950/40';

          const riskBadgeColor = 
            !opp.riskAnalysis || opp.riskAnalysis.riskLevel === 'LOW' ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60' :
            opp.riskAnalysis.riskLevel === 'MODERATE' ? 'bg-cyan-950/60 text-cyan-300 border-cyan-700/60' :
            opp.riskAnalysis.riskLevel === 'ELEVATED' ? 'bg-amber-950/60 text-amber-300 border-amber-700/60' :
            'bg-rose-950/60 text-rose-300 border-rose-700/60';

          return (
            <motion.div
              key={opp.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`relative rounded-xl border transition-all overflow-hidden ${
                opp.status === 'mined'
                  ? 'bg-emerald-950/20 border-emerald-500/60 glow-emerald'
                  : 'bg-slate-900/60 border-slate-800/90 hover:border-cyan-500/50'
              }`}
            >
              {/* Subtle Confidence Heatmap Indicator Bar on Top */}
              <div 
                className="h-1 w-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-purple-500" 
                style={{ opacity: opp.confidenceScore / 100 }} 
              />

              <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                {/* Left: Token, Borrow Amount & Path */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs font-bold text-slate-100 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-cyan-400 fill-current" />
                      {opp.asset.symbol} {t('flashLoan')}
                    </span>
                    <span className="text-xs text-slate-400">
                      {t('principal')} <strong className="text-slate-200">{opp.borrowAmountFormatted} {opp.asset.symbol}</strong>
                    </span>

                    {/* Confidence Score Pill */}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border flex items-center gap-1 ${confidenceColor}`}>
                      <ShieldCheck className="w-3 h-3" />
                      {opp.confidenceScore}% {t('routeConfidence')}
                    </span>

                    {/* Risk Score Pill */}
                    {opp.riskAnalysis && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border flex items-center gap-1 ${riskBadgeColor}`}>
                        <Activity className="w-3 h-3" />
                        Risk: {opp.riskAnalysis.score}/100 ({opp.riskAnalysis.riskLevel})
                      </span>
                    )}

                    {/* Autopilot Badge */}
                    {meetsAutopilotGate && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-950/60 text-purple-300 border border-purple-800/60 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {t('autopilotEligible')}
                      </span>
                    )}

                    {opp.status === 'mined' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-slate-950 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {t('minedInBlock')}
                      </span>
                    )}
                  </div>

                  {/* Route Steps Visual Trail */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-slate-500 text-[11px] uppercase tracking-wider">{t('arbitragePath')}</span>
                    {opp.routes.map((step, sIdx) => (
                      <React.Fragment key={step.id}>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-200">
                          <span className="text-cyan-400 font-semibold">{step.dex}</span>
                          <span className="text-slate-500">({step.tokenIn.symbol} → {step.tokenOut.symbol})</span>
                          {step.warningLevel === 'warning' && (
                            <AlertTriangle className="w-3 h-3 text-amber-400" />
                          )}
                        </div>
                        {sIdx < opp.routes.length - 1 && (
                          <ArrowRight className="w-3 h-3 text-slate-600" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Right: Profit Breakdown & Action Button */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                  {/* Financial Stats */}
                  <div className="grid grid-cols-3 sm:flex sm:items-center gap-4 text-left">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">{t('grossYield')}</div>
                      <div className="text-xs font-semibold text-slate-200">+{opp.grossProfitEth.toFixed(4)} ETH</div>
                      <div className="text-[10px] text-slate-500">${opp.grossProfitUsd.toFixed(1)}</div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">{t('minerBribe')}</div>
                      <div className="text-xs font-semibold text-amber-400">-{opp.minerBribeEth.toFixed(4)} ETH</div>
                      <div className="text-[10px] text-slate-500">{(settings.mevBribeBps / 100).toFixed(0)}% bribe</div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">{t('netProfit')}</div>
                      <div className="text-sm font-bold text-emerald-400">+{opp.netProfitEth.toFixed(4)} ETH</div>
                      <div className="text-[10px] text-emerald-500/80 font-semibold">+{opp.roiPercent.toFixed(1)}% ROI</div>
                    </div>
                  </div>

                  {/* 1-Click Execution Trigger */}
                  <button
                    disabled={isExecuting || opp.status === 'mined' || settings.riskSettings.circuitBreakerTripped}
                    onClick={() => onExecute(opp)}
                    className={`w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${
                      settings.riskSettings.circuitBreakerTripped
                        ? 'bg-rose-950/60 text-rose-400 border border-rose-800 cursor-not-allowed'
                        : opp.status === 'mined'
                        ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                        : isExecuting
                        ? 'bg-cyan-600 text-slate-950 animate-pulse'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 hover:shadow-cyan-500/25 active:scale-95'
                    }`}
                  >
                    {settings.riskSettings.circuitBreakerTripped ? (
                      <>
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Circuit Tripped
                      </>
                    ) : isExecuting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        {t('simulatingExecuting')}
                      </>
                    ) : opp.status === 'mined' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        {t('executed')}
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        {t('oneClickExecute')}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
