import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, ShieldAlert, Zap, Filter, ArrowUpRight, Activity, Clock } from 'lucide-react';
import { MempoolTransaction } from '../types/arbitrage';

interface MempoolMonitorProps {
  transactions: MempoolTransaction[];
  isAutopilotRunning: boolean;
  onInspectOpportunity?: (oppId: string) => void;
}

export const MempoolMonitor: React.FC<MempoolMonitorProps> = ({
  transactions,
  isAutopilotRunning,
  onInspectOpportunity
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredTxs = transactions.filter(tx => {
    if (filterType === 'ALL') return true;
    if (filterType === 'SWAP') return tx.actionType === 'SWAP';
    if (filterType === 'LARGE') return tx.actionType === 'LARGE_SELL' || tx.actionType === 'LARGE_BUY';
    if (filterType === 'ARB') return !!tx.detectedOpportunityId;
    return true;
  });

  return (
    <div className="space-y-5 font-mono">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs uppercase tracking-wider text-slate-400">Low-Latency Block & Mempool Feed</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-slate-100">
            Real-Time Mempool <span className="text-emerald-400">Transaction Stream</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Intercepting pending decentralized exchange swaps and pool rebalances before block inclusion.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {['ALL', 'SWAP', 'LARGE', 'ARB'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterType(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 glow-cyan'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat === 'ALL' && 'All Streams'}
              {cat === 'SWAP' && 'Swaps'}
              {cat === 'LARGE' && 'Whale Orders'}
              {cat === 'ARB' && 'Arb Triggers'}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Table / Stream */}
      <div className="rounded-2xl bg-[#090d14] border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Streaming {filteredTxs.length} pending events</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-400 font-semibold">Sub-second WebSockets OK</span>
          </div>
        </div>

        <div className="divide-y divide-slate-800/60 max-h-[600px] overflow-y-auto">
          <AnimatePresence>
            {filteredTxs.map((tx) => {
              const isWhale = tx.actionType === 'LARGE_SELL' || tx.actionType === 'LARGE_BUY';
              const hasArb = !!tx.detectedOpportunityId;

              return (
                <motion.div
                  key={tx.hash}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                    hasArb
                      ? 'bg-emerald-950/20 border-l-4 border-l-emerald-500'
                      : isWhale
                      ? 'bg-amber-950/20 border-l-4 border-l-amber-500'
                      : 'hover:bg-slate-900/40'
                  }`}
                >
                  {/* Left: Tx Hash, Type, DEX */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-200">
                        {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                      </span>

                      {/* Action Type Badge */}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tx.actionType === 'LARGE_BUY' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        tx.actionType === 'LARGE_SELL' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                        'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        {tx.actionType}
                      </span>

                      <span className="text-xs text-cyan-400 font-semibold">
                        {tx.dexTarget}
                      </span>

                      {/* Autopilot Pulse indicator */}
                      {isAutopilotRunning && hasArb && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 glow-emerald">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          AUTOPILOT ENGAGING
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-[11px] text-slate-500">
                      <span>From: {tx.from.slice(0, 8)}...</span>
                      <span>To: {tx.to.slice(0, 8)}...</span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3" />
                        {tx.latencyMs}ms latency
                      </span>
                    </div>
                  </div>

                  {/* Right: Value, Gas, and Opportunity Action */}
                  <div className="flex items-center gap-4 self-end md:self-center">
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-200">{tx.valueEth} ETH</div>
                      <div className="text-[10px] text-slate-500">{tx.gasPriceGwei} Gwei gas</div>
                    </div>

                    {hasArb && onInspectOpportunity && (
                      <button
                        onClick={() => onInspectOpportunity(tx.detectedOpportunityId!)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1 transition-all"
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        Capture Arb
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
