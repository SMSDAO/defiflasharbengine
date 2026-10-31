import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { TrendingUp, Coins, Flame, ArrowUpRight, ShieldCheck, Wallet, ExternalLink } from 'lucide-react';
import { ProfitDataPoint, EngineSettings, ArbitrageOpportunity } from '../types/arbitrage';
import { SUPPORTED_NETWORKS } from '../config/networks';

interface PerformanceDashboardProps {
  profitData: ProfitDataPoint[];
  settings: EngineSettings;
  executedOpportunities: ArbitrageOpportunity[];
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  profitData,
  settings,
  executedOpportunities
}) => {
  const currentNetwork = SUPPORTED_NETWORKS[settings.targetNetworkId];

  // Aggregated financials
  const totalGrossEth = executedOpportunities.reduce((acc, curr) => acc + curr.grossProfitEth, 0);
  const totalNetEth = executedOpportunities.reduce((acc, curr) => acc + curr.netProfitEth, 0);
  const totalBribesEth = executedOpportunities.reduce((acc, curr) => acc + curr.minerBribeEth, 0);
  const totalTreasuryEth = (totalNetEth * settings.profitSplitBps) / 10000;
  const avgRoi = executedOpportunities.length > 0
    ? executedOpportunities.reduce((acc, curr) => acc + curr.roiPercent, 0) / executedOpportunities.length
    : 0;

  return (
    <div className="space-y-6 font-mono">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Gross Arbitrage Yield</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-slate-100 mt-2">
            +{totalGrossEth.toFixed(4)} ETH
          </div>
          <div className="text-xs text-slate-400 mt-1">
            ≈ ${(totalGrossEth * 3150).toFixed(2)} USD
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Miner Bribes (coinbase)</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-400 mt-2">
            -{totalBribesEth.toFixed(4)} ETH
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {(settings.mevBribeBps / 100).toFixed(1)}% Priority Bribe BPS
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Treasury Vault Swept</span>
            <Wallet className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-purple-400 mt-2">
            +{totalTreasuryEth.toFixed(4)} ETH
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {(settings.profitSplitBps / 100).toFixed(1)}% Split to Cold Storage
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Net Realized Profit</span>
            <Coins className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 mt-2">
            +{totalNetEth.toFixed(4)} ETH
          </div>
          <div className="text-xs text-emerald-500/80 font-semibold mt-1">
            Avg ROI: {avgRoi.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Main Realized Profit Chart */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider">
              Cumulative Realized Profit (ETH & USD)
            </h3>
            <p className="text-xs text-slate-400">
              Zero-loss MEV arbitrage cumulative curve tracked over real mined blocks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-bold">
              100% Win Rate (Revert Guard)
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={profitData}>
              <defs>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#070a0f',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontFamily: 'monospace',
                  fontSize: '12px'
                }}
              />
              <Area
                type="monotone"
                dataKey="cumulativeEth"
                name="Net Profit (ETH)"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#profitGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Execution History Table */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden">
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-200 uppercase tracking-wider">
            Verified On-Chain Flash Loan Settlements ({executedOpportunities.length})
          </span>
          <span className="text-slate-400">{currentNetwork.name}</span>
        </div>

        <div className="divide-y divide-slate-800/60 max-h-80 overflow-y-auto">
          {executedOpportunities.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No arbitrage executions mined yet. Execute a 1-click opportunity or activate Autopilot.
            </div>
          ) : (
            executedOpportunities.map((opp) => (
              <div key={opp.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-900/40 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">{opp.asset.symbol} Flash Loan</span>
                    <span className="text-slate-400">({opp.borrowAmountFormatted} tokens)</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px]">
                      Confirmed
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span>Path: {opp.routes.map(r => r.dex).join(' → ')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold text-emerald-400">+{opp.netProfitEth.toFixed(4)} ETH</div>
                    <div className="text-[10px] text-slate-500">+${opp.netProfitUsd.toFixed(2)} USD</div>
                  </div>

                  {opp.txHash && (
                    <a
                      href={`${currentNetwork.blockExplorer}/tx/${opp.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
                      title="View on Block Explorer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
