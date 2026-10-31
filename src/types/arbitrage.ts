export type NetworkId = 'arbitrum' | 'ethereum' | 'polygon' | 'optimism' | 'zksync';

export type SupportedLanguage = 'en' | 'es' | 'zh';

export interface TokenInfo {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  icon?: string;
}

export interface NetworkConfig {
  id: NetworkId;
  name: string;
  chainId: number;
  nativeCurrency: { name: string; symbol: string; decimals: number };
  rpcUrl: string;
  fallbackRpcs: string[];
  blockExplorer: string;
  aavePool: string;
  aaveAddressesProvider: string;
  weth: string;
  tokens: TokenInfo[];
  dexes: {
    name: string;
    routerAddress: string;
    factoryAddress?: string;
    type: 'uniswap_v3' | 'balancer_v2' | 'uniswap_v2' | 'curve';
  }[];
}

export interface RouteStep {
  id: string;
  dex: string;
  tokenIn: TokenInfo;
  tokenOut: TokenInfo;
  poolFeeBps: number;
  expectedOut: string;
  minAmountOut: string;
  priceImpactPercent: number;
  warningLevel: 'none' | 'warning' | 'critical';
  warningMessage?: string;
}

export interface RiskAnalysisResult {
  score: number; // 0 (safest) to 100 (highest risk)
  healthScore: number; // 100 (best) to 0 (worst)
  riskLevel: 'LOW' | 'MODERATE' | 'ELEVATED' | 'CRITICAL';
  slippageRisk: number;
  gasBurdenRisk: number;
  poolDepthRisk: number;
  oracleDriftRisk: number;
  isApprovedForAutopilot: boolean;
  reasons: string[];
}

export interface ArbitrageOpportunity {
  id: string;
  timestamp: number;
  asset: TokenInfo;
  borrowAmount: string;
  borrowAmountFormatted: string;
  routes: RouteStep[];
  grossProfitEth: number;
  grossProfitUsd: number;
  estimatedGasEth: number;
  minerBribeEth: number;
  netProfitEth: number;
  netProfitUsd: number;
  roiPercent: number;
  confidenceScore: number; // 0 - 100
  riskAnalysis?: RiskAnalysisResult;
  status: 'detected' | 'simulating' | 'executing' | 'mined' | 'reverted' | 'skipped';
  txHash?: string;
  revertReason?: string;
  networkId: NetworkId;
  isAutopilotEligible: boolean;
}

export interface MempoolTransaction {
  hash: string;
  timestamp: number;
  from: string;
  to: string;
  valueEth: string;
  gasPriceGwei: number;
  dexTarget: string;
  actionType: 'SWAP' | 'LARGE_SELL' | 'LARGE_BUY' | 'LIQUIDITY_SHIFT' | 'ORACLE_UPDATE';
  detectedOpportunityId?: string;
  latencyMs: number;
  threatLevel: 'low' | 'medium' | 'high';
}

export interface ExecutionLog {
  id: string;
  timestamp: string;
  level: 'SIMULATION' | 'EXECUTING' | 'MINED' | 'SKIPPED' | 'AUTOPILOT' | 'ERROR' | 'ALERT';
  message: string;
  metadata?: Record<string, unknown>;
}

export interface RiskSettings {
  maxExposurePerTradeEth: number;
  maxExposurePerNetworkEth: number;
  maxDailyLossEth: number;
  currentDailyLossEth: number;
  gasPriceThresholdGwei: number;
  marketVolatilityThreshold: number; // e.g. 4.5%
  currentVolatilityIndex: number; // e.g. 2.1%
  minLiquidityDepthUsd: number;
  circuitBreakerTripped: boolean;
  circuitBreakerReason?: string;
  circuitBreakerTriggeredAt?: number | null;
  excludedDexes: string[];
  excludedPools: string[];
}

export interface StrategyPerformanceMetric {
  strategyId: string;
  name: string;
  networkId: NetworkId;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  winRatePercent: number;
  totalProfitEth: number;
  totalProfitUsd: number;
  avgProfitEth: number;
  avgExecutionLatencyMs: number;
  avgGasCostEth: number;
  suggestedOptimization: string;
  status: 'OPTIMAL' | 'ACCEPTABLE' | 'NEEDS_TUNING' | 'PAUSED';
}

export interface EngineSettings {
  autopilotEnabled: boolean;
  minNetProfitEth: number;
  mevBribeBps: number; // e.g. 2500 = 25%
  profitSplitBps: number; // e.g. 2000 = 20% to treasury
  treasuryAddress: string;
  maxGasPriceGwei: number;
  slippageTolerancePercent: number;
  gasReserveMinEth: number;
  audioAlertsEnabled: boolean;
  browserNotificationsEnabled: boolean;
  targetNetworkId: NetworkId;
  flashLoanContractAddress: string;
  useFlashbotsRelay: boolean;
  language: SupportedLanguage;
  riskSettings: RiskSettings;
}

export interface ProfitDataPoint {
  time: string;
  cumulativeEth: number;
  cumulativeUsd: number;
  instantEth: number;
  gasCostEth: number;
  txHash: string;
}
