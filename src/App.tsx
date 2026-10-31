import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { SideDrawer } from './components/SideDrawer';
import { SimpleArbitrageDashboard } from './components/SimpleArbitrageDashboard';
import { AdvancedRouteBuilder } from './components/AdvancedRouteBuilder';
import { MempoolMonitor } from './components/MempoolMonitor';
import { DaemonExecutionConsole } from './components/DaemonExecutionConsole';
import { PerformanceDashboard } from './components/PerformanceDashboard';
import { RiskManagementDashboard } from './components/RiskManagementDashboard';
import { StrategyPerformanceAnalyzer } from './components/StrategyPerformanceAnalyzer';
import { NotificationToast, ToastMessage } from './components/NotificationToast';
import { 
  ArbitrageOpportunity, 
  EngineSettings, 
  ExecutionLog, 
  MempoolTransaction, 
  ProfitDataPoint,
  RiskSettings
} from './types/arbitrage';
import { STRATEGY_PRESETS } from './utils/strategyLibrary';
import { mempoolStreamService } from './services/mempoolStreamService';
import { executeMevFlashLoan } from './services/mevExecutionService';
import { riskAssessmentService } from './services/riskAssessmentService';
import { playSoundAlert } from './utils/audioAlert';

export default function App() {
  // Navigation & Drawers
  const [activeTab, setActiveTab] = useState<'simple' | 'advanced' | 'mempool' | 'risk' | 'analyzer' | 'console' | 'performance'>('simple');
  const [activeDrawer, setActiveDrawer] = useState<'network' | 'strategy' | 'risk' | 'free-rpc' | null>(null);

  // Engine Settings
  const [settings, setSettings] = useState<EngineSettings>({
    autopilotEnabled: false,
    minNetProfitEth: 0.015,
    mevBribeBps: 2500, // 25% miner bribe
    profitSplitBps: 2000, // 20% to treasury
    treasuryAddress: '0x71C836642F3a49350814A0450354F15494498595',
    maxGasPriceGwei: 0.85,
    slippageTolerancePercent: 0.5,
    gasReserveMinEth: 0.005,
    audioAlertsEnabled: true,
    browserNotificationsEnabled: true,
    targetNetworkId: 'arbitrum',
    flashLoanContractAddress: '0x3F4bEbC188555239eF6e5593c6A2B3D4468fCe52',
    useFlashbotsRelay: true,
    language: 'en',
    riskSettings: {
      maxExposurePerTradeEth: 100.0,
      maxExposurePerNetworkEth: 250.0,
      maxDailyLossEth: 2.5,
      currentDailyLossEth: 0.042,
      gasPriceThresholdGwei: 4.5,
      marketVolatilityThreshold: 4.0,
      currentVolatilityIndex: 2.1,
      minLiquidityDepthUsd: 50000,
      circuitBreakerTripped: false,
      circuitBreakerReason: '',
      circuitBreakerTriggeredAt: null,
      excludedDexes: [],
      excludedPools: []
    }
  });

  // State
  const [walletBalance, setWalletBalance] = useState<string>('0.0482');
  const [isAutopilotRunning, setIsAutopilotRunning] = useState<boolean>(false);
  const [mempoolTxs, setMempoolTxs] = useState<MempoolTransaction[]>([]);
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [executedOpportunities, setExecutedOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Opportunities with initial risk assessment
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>(() => {
    return STRATEGY_PRESETS.map(opp => ({
      ...opp,
      riskAnalysis: riskAssessmentService.assessOpportunityRisk(opp, settings.riskSettings)
    }));
  });

  // Logs & Metrics
  const [logs, setLogs] = useState<ExecutionLog[]>([
    {
      id: 'log-0',
      timestamp: new Date().toLocaleTimeString(),
      level: 'SIMULATION',
      message: '[SYSTEM] Initialized Enterprise Multi-Chain Flash Loan Arbitrage Engine v1.1.0'
    },
    {
      id: 'log-1',
      timestamp: new Date().toLocaleTimeString(),
      level: 'AUTOPILOT',
      message: '[CONNECT] Connected to Arbitrum One Sequencer feed (42161). Low latency mode active.'
    },
    {
      id: 'log-2',
      timestamp: new Date().toLocaleTimeString(),
      level: 'ALERT',
      message: '[RISK] Multi-chain strategy tuner & circuit breaker contracts synchronized.'
    }
  ]);

  const [metrics, setMetrics] = useState({
    blocksProcessed: 268491040,
    simulationsPassed: 24,
    simulationsFailed: 3,
    txsMined: 7,
    totalProfitEth: 0.4582,
    activeRelay: 'Flashbots Protect'
  });

  // Profit Chart Data Points
  const [profitData, setProfitData] = useState<ProfitDataPoint[]>([
    { time: '10:00', cumulativeEth: 0.042, cumulativeUsd: 132.3, instantEth: 0.042, gasCostEth: 0.0011, txHash: '0x8f...1a' },
    { time: '10:15', cumulativeEth: 0.089, cumulativeUsd: 280.3, instantEth: 0.047, gasCostEth: 0.0012, txHash: '0x4c...2b' },
    { time: '10:30', cumulativeEth: 0.165, cumulativeUsd: 519.7, instantEth: 0.076, gasCostEth: 0.0014, txHash: '0x7e...3d' },
    { time: '10:45', cumulativeEth: 0.248, cumulativeUsd: 781.2, instantEth: 0.083, gasCostEth: 0.0013, txHash: '0x2a...9c' },
    { time: '11:00', cumulativeEth: 0.384, cumulativeUsd: 1209.6, instantEth: 0.136, gasCostEth: 0.0016, txHash: '0x99...4f' },
    { time: '11:15', cumulativeEth: 0.458, cumulativeUsd: 1442.7, instantEth: 0.074, gasCostEth: 0.0013, txHash: '0x1d...3e' }
  ]);

  // Toast Helper
  const addToast = useCallback((type: ToastMessage['type'], title: string, description: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [ { id, type, title, description }, ...prev.slice(0, 4) ]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5500);
  }, []);

  // Settings Updater
  const handleUpdateSettings = (newSettings: Partial<EngineSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      if (newSettings.targetNetworkId && newSettings.targetNetworkId !== prev.targetNetworkId) {
        mempoolStreamService.setNetwork(newSettings.targetNetworkId);
        addToast('info', 'Network Switched', `Active engine switched to ${newSettings.targetNetworkId.toUpperCase()}`);
      }
      return updated;
    });
  };

  // Risk Settings Updater
  const handleUpdateRiskSettings = (newRisk: Partial<RiskSettings>) => {
    setSettings(prev => {
      const updatedRisk = { ...prev.riskSettings, ...newRisk };
      return { ...prev, riskSettings: updatedRisk };
    });
    addToast('info', 'Risk Parameters Updated', 'Exposure thresholds and DEX exclusion lists updated.');
  };

  // Reset Circuit Breaker
  const handleResetCircuitBreaker = () => {
    setSettings(prev => ({
      ...prev,
      riskSettings: {
        ...prev.riskSettings,
        circuitBreakerTripped: false,
        circuitBreakerReason: '',
        circuitBreakerTriggeredAt: null
      }
    }));
    playSoundAlert('success');
    addToast('success', 'Circuit Breaker Reset', 'Execution pipeline reopened for atomic flash minting.');
    setLogs(prev => [
      ...prev,
      {
        id: `log-reset-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        level: 'AUTOPILOT',
        message: '[CIRCUIT BREAKER] Reset verified by operator. Standby for opportunities.'
      }
    ]);
  };

  // Emergency Stop / Manual Circuit Breaker Trip
  const handleEmergencyStop = () => {
    setIsAutopilotRunning(false);
    setSettings(prev => ({
      ...prev,
      autopilotEnabled: false,
      riskSettings: {
        ...prev.riskSettings,
        circuitBreakerTripped: true,
        circuitBreakerReason: 'Manual emergency circuit halt triggered by operator',
        circuitBreakerTriggeredAt: Date.now()
      }
    }));
    if (settings.audioAlertsEnabled) playSoundAlert('alert');
    addToast('error', 'CIRCUIT BREAKER TRIGGERED', 'Emergency halt engaged. All execution pipelines frozen.');

    setLogs(prev => [
      ...prev,
      {
        id: `log-stop-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        level: 'ERROR',
        message: '[CIRCUIT BREAKER] EMERGENCY STOP ACTIVATED. All background execution halted.'
      }
    ]);
  };

  // Apply Algorithmic Strategy Optimization
  const handleApplyOptimization = (strategyId: string, suggestion: string) => {
    playSoundAlert('success');
    addToast('success', 'Parameter Tune Applied', `Adjusted parameters for strategy: ${strategyId}`);
    setLogs(prev => [
      ...prev,
      {
        id: `log-tune-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        level: 'AUTOPILOT',
        message: `[STRATEGY TUNER] Applied optimization to ${strategyId}: ${suggestion}`
      }
    ]);
  };

  // Execute Arbitrage
  const handleExecuteArbitrage = useCallback(async (opportunity: ArbitrageOpportunity) => {
    if (executingId) return;

    // Evaluate risk score
    const risk = riskAssessmentService.assessOpportunityRisk(opportunity, settings.riskSettings);
    if (!risk.isApprovedForAutopilot && settings.riskSettings.circuitBreakerTripped) {
      addToast('error', 'Trade Aborted by Risk Engine', risk.reasons[0] || 'Risk threshold exceeded.');
      return;
    }

    setExecutingId(opportunity.id);

    setLogs(prev => [
      ...prev,
      {
        id: `log-exec-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        level: 'EXECUTING',
        message: `[EXECUTING] Borrowing ${opportunity.borrowAmountFormatted} ${opportunity.asset.symbol} for ${opportunity.routes.map(r => r.dex).join(' -> ')} (Risk: ${risk.score}/100)`
      }
    ]);

    const result = await executeMevFlashLoan(opportunity, settings);

    if (result.success) {
      const updatedOpp: ArbitrageOpportunity = {
        ...opportunity,
        status: 'mined',
        txHash: result.txHash,
        riskAnalysis: risk
      };

      setOpportunities(prev => prev.map(o => o.id === opportunity.id ? updatedOpp : o));
      setExecutedOpportunities(prev => [updatedOpp, ...prev]);

      // Update financials
      setMetrics(prev => ({
        ...prev,
        simulationsPassed: prev.simulationsPassed + 1,
        txsMined: prev.txsMined + 1,
        totalProfitEth: prev.totalProfitEth + result.netProfitEth
      }));

      // Append chart point
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setProfitData(prev => [
        ...prev,
        {
          time: nowStr,
          cumulativeEth: parseFloat((metrics.totalProfitEth + result.netProfitEth).toFixed(4)),
          cumulativeUsd: parseFloat(((metrics.totalProfitEth + result.netProfitEth) * 3150).toFixed(2)),
          instantEth: result.netProfitEth,
          gasCostEth: 0.0012,
          txHash: result.txHash!
        }
      ]);

      addToast(
        'success',
        'Flash Loan Mined!',
        `Secured +${result.netProfitEth.toFixed(4)} ETH net profit after ${(settings.mevBribeBps / 100).toFixed(0)}% miner bribe.`
      );
    } else {
      setMetrics(prev => ({ ...prev, simulationsFailed: prev.simulationsFailed + 1 }));
      addToast('error', 'Execution Aborted', result.error || 'Transaction simulation reverted.');
    }

    setLogs(prev => [...prev, ...result.logs]);
    setExecutingId(null);
  }, [executingId, settings, metrics, addToast]);

  // Autopilot Toggle
  const handleToggleAutopilot = () => {
    const nextState = !isAutopilotRunning;
    setIsAutopilotRunning(nextState);
    setSettings(prev => ({ ...prev, autopilotEnabled: nextState }));

    if (nextState) {
      if (settings.audioAlertsEnabled) playSoundAlert('success');
      addToast('success', 'Autopilot Engaged', 'Scanning mempool and auto-executing whenever net profit and risk criteria are met.');
      setLogs(prev => [
        ...prev,
        {
          id: `log-ap-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          level: 'AUTOPILOT',
          message: `[AUTOPILOT] Autonomous agent active on ${settings.targetNetworkId.toUpperCase()}. Profit gate: ${settings.minNetProfitEth} ETH. Max trade: ${settings.riskSettings.maxExposurePerTradeEth} ETH.`
        }
      ]);
    } else {
      if (settings.audioAlertsEnabled) playSoundAlert('warning');
      addToast('warning', 'Autopilot Disengaged', 'System paused into manual execution mode.');
      setLogs(prev => [
        ...prev,
        {
          id: `log-ap-pause-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          level: 'SKIPPED',
          message: '[AUTOPILOT] Autopilot disengaged by operator.'
        }
      ]);
    }
  };

  // Start Mempool Stream
  useEffect(() => {
    mempoolStreamService.start(settings.targetNetworkId);

    const unsubMempool = mempoolStreamService.subscribeMempool((tx) => {
      setMempoolTxs(prev => [tx, ...prev.slice(0, 39)]);
      setMetrics(prev => ({ ...prev, blocksProcessed: prev.blocksProcessed + 1 }));
    });

    const unsubOpps = mempoolStreamService.subscribeOpportunities((opp) => {
      const risk = riskAssessmentService.assessOpportunityRisk(opp, settings.riskSettings);
      const assessedOpp: ArbitrageOpportunity = { ...opp, riskAnalysis: risk };

      setOpportunities(prev => [assessedOpp, ...prev.slice(0, 24)]);
      if (settings.audioAlertsEnabled) {
        playSoundAlert('ping');
      }

      // Autopilot Execution Decision Gate:
      // Must pass: autopilot enabled, net profit threshold, risk approval (score <= 40, no circuit trip)
      if (
        isAutopilotRunning && 
        assessedOpp.netProfitEth >= settings.minNetProfitEth && 
        risk.isApprovedForAutopilot &&
        !settings.riskSettings.circuitBreakerTripped
      ) {
        handleExecuteArbitrage(assessedOpp);
      }
    });

    return () => {
      unsubMempool();
      unsubOpps();
      mempoolStreamService.stop();
    };
  }, [
    settings.targetNetworkId, 
    isAutopilotRunning, 
    settings.minNetProfitEth, 
    settings.audioAlertsEnabled, 
    settings.riskSettings, 
    handleExecuteArbitrage
  ]);

  return (
    <div className="min-h-screen bg-[#070a0f] text-slate-100 flex flex-col relative cyber-grid">
      {/* Background ambient neon glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-10 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-1/3 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Main Header */}
      <Header
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDrawer={setActiveDrawer}
        walletBalance={walletBalance}
        isAutopilotRunning={isAutopilotRunning}
        onToggleAutopilot={handleToggleAutopilot}
        onEmergencyStop={handleEmergencyStop}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 pb-24 xl:pb-12">
        {activeTab === 'simple' && (
          <SimpleArbitrageDashboard
            opportunities={opportunities}
            onExecute={handleExecuteArbitrage}
            executingId={executingId}
            settings={settings}
          />
        )}

        {activeTab === 'advanced' && (
          <AdvancedRouteBuilder
            settings={settings}
            onExecuteCustomRoute={handleExecuteArbitrage}
            isExecuting={!!executingId}
          />
        )}

        {activeTab === 'mempool' && (
          <MempoolMonitor
            transactions={mempoolTxs}
            isAutopilotRunning={isAutopilotRunning}
            onInspectOpportunity={(oppId) => {
              const opp = opportunities.find(o => o.id === oppId);
              if (opp) handleExecuteArbitrage(opp);
            }}
          />
        )}

        {activeTab === 'risk' && (
          <RiskManagementDashboard
            settings={settings}
            onUpdateRiskSettings={handleUpdateRiskSettings}
            onResetCircuitBreaker={handleResetCircuitBreaker}
            onTriggerEmergencyHalt={handleEmergencyStop}
          />
        )}

        {activeTab === 'analyzer' && (
          <StrategyPerformanceAnalyzer
            settings={settings}
            onApplyOptimization={handleApplyOptimization}
          />
        )}

        {activeTab === 'console' && (
          <DaemonExecutionConsole
            logs={logs}
            onClearLogs={() => setLogs([])}
            isAutopilotRunning={isAutopilotRunning}
            onToggleAutopilot={handleToggleAutopilot}
            onEmergencyStop={handleEmergencyStop}
            metrics={metrics}
          />
        )}

        {activeTab === 'performance' && (
          <PerformanceDashboard
            profitData={profitData}
            settings={settings}
            executedOpportunities={executedOpportunities}
          />
        )}
      </main>

      {/* Persistent Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAutopilotRunning={isAutopilotRunning}
        language={settings.language}
      />

      {/* Slide-out Drawers */}
      <SideDrawer
        isOpen={activeDrawer !== null}
        onClose={() => setActiveDrawer(null)}
        drawerType={activeDrawer}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      {/* Toast Alerts */}
      <NotificationToast
        toasts={toasts}
        onDismiss={(id) => setToasts(prev => prev.filter(t => t.id !== id))}
      />
    </div>
  );
}
