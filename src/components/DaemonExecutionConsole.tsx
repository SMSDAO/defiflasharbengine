import React, { useRef, useEffect } from 'react';
import { Terminal, ShieldAlert, Cpu, CheckCircle2, Play, Square, Download, Trash2, ArrowUpRight } from 'lucide-react';
import { ExecutionLog } from '../types/arbitrage';

interface DaemonExecutionConsoleProps {
  logs: ExecutionLog[];
  onClearLogs: () => void;
  isAutopilotRunning: boolean;
  onToggleAutopilot: () => void;
  onEmergencyStop: () => void;
  metrics: {
    blocksProcessed: number;
    simulationsPassed: number;
    simulationsFailed: number;
    txsMined: number;
    totalProfitEth: number;
    activeRelay: string;
  };
}

export const DaemonExecutionConsole: React.FC<DaemonExecutionConsoleProps> = ({
  logs,
  onClearLogs,
  isAutopilotRunning,
  onToggleAutopilot,
  onEmergencyStop,
  metrics
}) => {
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Download logs as text file
  const handleExportLogs = () => {
    const text = logs.map(l => `[${l.timestamp}] [${l.level}] ${l.message}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mev-daemon-logs-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Top Daemon Health & Metrics Panel */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Daemon Status</div>
          <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            OPERATIONAL
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Blocks Synced</div>
          <div className="text-sm font-bold text-slate-200 mt-1">#{metrics.blocksProcessed}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">staticCall Passed</div>
          <div className="text-sm font-bold text-cyan-400 mt-1">{metrics.simulationsPassed}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Reverts Filtered</div>
          <div className="text-sm font-bold text-rose-400 mt-1">{metrics.simulationsFailed}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">MEV Relay</div>
          <div className="text-xs font-bold text-purple-400 truncate mt-1">Flashbots Protect</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Total Realized Net</div>
          <div className="text-sm font-bold text-emerald-400 mt-1">+{metrics.totalProfitEth.toFixed(4)} ETH</div>
        </div>
      </div>

      {/* Terminal View */}
      <div className="rounded-2xl bg-[#070a0f] border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[520px]">
        {/* Terminal Title Bar */}
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 mr-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-slate-300">
              enterprise-arbitrage-daemon.log [tty0]
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportLogs}
              className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs flex items-center gap-1"
              title="Export Log File"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClearLogs}
              className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs flex items-center gap-1"
              title="Clear Console Output"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onEmergencyStop}
              className="px-2.5 py-1 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-bold flex items-center gap-1"
            >
              <ShieldAlert className="w-3 h-3" />
              STOP
            </button>
          </div>
        </div>

        {/* Scrollable Terminal Content */}
        <div className="p-4 flex-1 overflow-y-auto space-y-2 text-xs font-mono scanlines-overlay">
          {logs.map((log) => {
            const levelColor = 
              log.level === 'SIMULATION' ? 'text-cyan-400 bg-cyan-950/40 border-cyan-800' :
              log.level === 'EXECUTING' ? 'text-amber-400 bg-amber-950/40 border-amber-800' :
              log.level === 'MINED' ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800 font-bold' :
              log.level === 'AUTOPILOT' ? 'text-purple-400 bg-purple-950/40 border-purple-800' :
              log.level === 'SKIPPED' ? 'text-slate-400 bg-slate-900 border-slate-800' :
              'text-rose-400 bg-rose-950/40 border-rose-800 font-bold';

            return (
              <div key={log.id} className="flex items-start gap-2.5 leading-relaxed">
                <span className="text-slate-600 select-none">{log.timestamp}</span>
                <span className={`px-1.5 py-0.2 rounded border text-[10px] select-none ${levelColor}`}>
                  {log.level}
                </span>
                <span className="text-slate-300 flex-1 break-all">
                  {log.message}
                </span>
              </div>
            );
          })}
          <div ref={terminalEndRef} />
        </div>

        {/* Console Action Bar */}
        <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-500">Autopilot Execution Engine:</span>
            <span className={`font-bold ${isAutopilotRunning ? 'text-emerald-400' : 'text-slate-500'}`}>
              {isAutopilotRunning ? 'ACTIVE (MONITORING MEMPOOL)' : 'STANDBY'}
            </span>
          </div>

          <button
            onClick={onToggleAutopilot}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              isAutopilotRunning
                ? 'bg-rose-950/60 text-rose-300 border border-rose-800 hover:bg-rose-900'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 glow-emerald'
            }`}
          >
            {isAutopilotRunning ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                Disengage Autopilot
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                Engage Autopilot
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
