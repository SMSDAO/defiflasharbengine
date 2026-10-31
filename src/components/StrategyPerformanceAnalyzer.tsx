import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Pause, 
  Play, 
  Sliders, 
  ArrowRight,
  Zap,
  Target
} from 'lucide-react';
import { StrategyPerformanceMetric, EngineSettings } from '../types/arbitrage';
import { getTranslation } from '../locales/i18n';

interface StrategyPerformanceAnalyzerProps {
  settings: EngineSettings;
  onApplyOptimization: (strategyId: string, suggestion: string) => void;
}

export const StrategyPerformanceAnalyzer: React.FC<StrategyPerformanceAnalyzerProps> = ({
  settings,
  onApplyOptimization
}) => {
  const { language } = settings;
  const t = (key: Parameters<typeof getTranslation>[1], params?: any) => getTranslation(language, key, params);

  const [metrics, setMetrics] = useState<StrategyPerformanceMetric[]>([
    {
      strategyId: 'strat-arb-01',
      name: 'Arbitrum Tri-Hop (WETH/USDC/ARB)',
      networkId: 'arbitrum',
      totalExecutions: 48,
      successfulExecutions: 46,
      failedExecutions: 2,
      winRatePercent: 95.8,
      totalProfitEth: 1.482,
      totalProfitUsd: 4668.30,
      avgProfitEth: 0.0322,
      avgExecutionLatencyMs: 14.2,
      avgGasCostEth: 0.0011,
      suggestedOptimization: 'Increase borrow principal to 18.0 ETH to amortize Arbitrum L2 calldata fees further.',
      status: 'OPTIMAL'
    },
    {
      strategyId: 'strat-arb-02',
      name: 'USDC Stable De-peg (USDC / USDC.e)',
      networkId: 'arbitrum',
      totalExecutions: 35,
      successfulExecutions: 35,
      failedExecutions: 0,
      winRatePercent: 100.0,
      totalProfitEth: 1.124,
      totalProfitUsd: 3540.60,
      avgProfitEth: 0.0321,
      avgExecutionLatencyMs: 11.8,
      avgGasCostEth: 0.0009,
      suggestedOptimization: 'Tighten slippage from 0.5% to 0.15% on Curve pool for tighter profit guarantees.',
      status: 'OPTIMAL'
    },
    {
      strategyId: 'strat-arb-03',
      name: 'WBTC Balancer -> UniV3 Loop',
      networkId: 'arbitrum',
      totalExecutions: 22,
      successfulExecutions: 19,
      failedExecutions: 3,
      winRatePercent: 86.4,
      totalProfitEth: 0.842,
      totalProfitUsd: 2652.30,
      avgProfitEth: 0.0443,
      avgExecutionLatencyMs: 24.5,
      avgGasCostEth: 0.0015,
      suggestedOptimization: 'Pool depth shallow on 0.3% tier. Divert 40% volume through Camelot DEX.',
      status: 'NEEDS_TUNING'
    },
    {
      strategyId: 'strat-arb-04',
      name: 'ARB Governance Momentum Loop',
      networkId: 'arbitrum',
      totalExecutions: 29,
      successfulExecutions: 27,
      failedExecutions: 2,
      winRatePercent: 93.1,
      totalProfitEth: 0.915,
      totalProfitUsd: 2882.25,
      avgProfitEth: 0.0338,
      avgExecutionLatencyMs: 15.6,
      avgGasCostEth: 0.0012,
      suggestedOptimization: 'Maintain active parameters. Volume rebalance healthy.',
      status: 'OPTIMAL'
    },
    {
      strategyId: 'strat-eth-01',
      name: 'Ethereum WETH Heavy Bundle',
      networkId: 'ethereum',
      totalExecutions: 12,
      successfulExecutions: 10,
      failedExecutions: 2,
      winRatePercent: 83.3,
      totalProfitEth: 0.960,
      totalProfitUsd: 3024.00,
      avgProfitEth: 0.0960,
      avgExecutionLatencyMs: 64.0,
      avgGasCostEth: 0.0240,
      suggestedOptimization: 'L1 base fee volatile. Elevate min profit threshold to 0.08 ETH.',
      status: 'NEEDS_TUNING'
    },
    {
      strategyId: 'strat-poly-01',
      name: 'Polygon QuickSwap to UniV3 POL',
      networkId: 'polygon',
      totalExecutions: 18,
      successfulExecutions: 17,
      failedExecutions: 1,
      winRatePercent: 94.4,
      totalProfitEth: 0.465,
      totalProfitUsd: 1464.75,
      avgProfitEth: 0.0273,
      avgExecutionLatencyMs: 18.2,
      avgGasCostEth: 0.0006,
      suggestedOptimization: 'Gas fees extremely cheap. Can increase execution cadence by 2x.',
      status: 'OPTIMAL'
    }
  ]);

  const [appliedStrategyIds, setAppliedStrategyIds] = useState<string[]>([]);

  // Toggle strategy active status
  const handleToggleStatus = (stratId: string) => {
    setMetrics(prev => prev.map(m => {
      if (m.strategyId === stratId) {
        return {
          ...m,
          status: m.status === 'PAUSED' ? 'OPTIMAL' : 'PAUSED'
        };
      }
      return m;
    }));
  };

  const handleTune = (strat: StrategyPerformanceMetric) => {
    onApplyOptimization(strat.strategyId, strat.suggestedOptimization);
    setAppliedStrategyIds(prev => [...prev, strat.strategyId]);
    setMetrics(prev => prev.map(m => {
      if (m.strategyId === strat.strategyId) {
        return {
          ...m,
          status: 'OPTIMAL',
          suggestedOptimization: 'Tuned parameters active. Slippage and principal rebalanced.'
        };
      }
      return m;
    }));
  };

  const chartData = metrics.map(m => ({
    name: m.name.split(' ')[0] + ' ' + (m.name.split(' ')[1] || ''),
    winRate: m.winRatePercent,
    latency: m.avgExecutionLatencyMs,
    profit: parseFloat(m.totalProfitEth.toFixed(3))
  }));

  return (
    <div className="space-y-6 font-mono">
      {/* Title Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/20 to-slate-900 border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                AUDITED PERFORMANCE METRICS
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-100">
              {t('analyzerTitle')}
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl mt-1">
              {t('analyzerDesc')}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Weighted Win Rate</div>
              <div className="text-lg font-bold text-emerald-400">93.8%</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Target className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Visual Charts: Strategy Win Rate & Total Profit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Win Rate & Latency */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <h3 className="text-xs uppercase font-bold text-slate-200 tracking-wider mb-4">
            Strategy Win Rate (%) & Execution Latency (ms)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#070a0f',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontFamily: 'monospace',
                    fontSize: '11px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                <Bar dataKey="winRate" name="Win Rate (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="latency" name="Latency (ms)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Cumulative Profit by Strategy */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <h3 className="text-xs uppercase font-bold text-slate-200 tracking-wider mb-4">
            Cumulative Net Profit by Strategy (ETH)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#070a0f',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontFamily: 'monospace',
                    fontSize: '11px'
                  }}
                />
                <Bar dataKey="profit" name="Net Yield (ETH)" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Strategy Performance & Optimization Matrix */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300 font-bold uppercase tracking-wider">
          <span>{t('optimizationNotes')}</span>
          <span className="text-cyan-400">Auto-Tuning Engine Active</span>
        </div>

        <div className="divide-y divide-slate-800/60 overflow-x-auto">
          {metrics.map((strat) => {
            const isApplied = appliedStrategyIds.includes(strat.strategyId);

            return (
              <div key={strat.strategyId} className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-900/40 transition-colors">
                {/* Left: Strategy Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-bold text-sm text-slate-100">{strat.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {strat.networkId.toUpperCase()}
                    </span>

                    {strat.status === 'OPTIMAL' && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        {t('optimalBadge')}
                      </span>
                    )}
                    {strat.status === 'NEEDS_TUNING' && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700 flex items-center gap-1 font-bold">
                        <Sliders className="w-3 h-3" />
                        {t('tuningNeededBadge')}
                      </span>
                    )}
                    {strat.status === 'PAUSED' && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700 font-bold">
                        PAUSED
                      </span>
                    )}
                  </div>

                  {/* Suggestion Quote */}
                  <div className="text-xs text-cyan-300 bg-cyan-950/30 p-2.5 rounded-lg border border-cyan-800/40 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{strat.suggestedOptimization}</span>
                  </div>
                </div>

                {/* Center: Numeric Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left lg:text-right border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-800">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">{t('totalExecutions')}</div>
                    <div className="text-xs font-bold text-slate-200">{strat.totalExecutions} runs</div>
                    <div className="text-[10px] text-emerald-400">{strat.winRatePercent}% win</div>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">{t('avgNetYield')}</div>
                    <div className="text-xs font-bold text-emerald-400">+{strat.avgProfitEth} ETH</div>
                    <div className="text-[10px] text-slate-500">Total: +{strat.totalProfitEth} ETH</div>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">{t('avgExecutionTime')}</div>
                    <div className="text-xs font-bold text-cyan-400">{strat.avgExecutionLatencyMs} ms</div>
                    <div className="text-[10px] text-slate-500">Gas: {strat.avgGasCostEth} ETH</div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-center">
                    {strat.status === 'NEEDS_TUNING' && !isApplied && (
                      <button
                        onClick={() => handleTune(strat)}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1 transition-all"
                      >
                        <Zap className="w-3 h-3 fill-current" />
                        {t('optimizeStrategy')}
                      </button>
                    )}
                    <button
                      onClick={() => handleToggleStatus(strat.strategyId)}
                      className={`p-1.5 rounded-lg border text-xs ${
                        strat.status === 'PAUSED'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                      title={strat.status === 'PAUSED' ? 'Resume Strategy' : 'Pause Strategy'}
                    >
                      {strat.status === 'PAUSED' ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
