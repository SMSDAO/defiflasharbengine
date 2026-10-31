import { ArbitrageOpportunity, MempoolTransaction, NetworkId } from '../types/arbitrage';
import { STRATEGY_PRESETS } from '../utils/strategyLibrary';

type MempoolSubscriber = (tx: MempoolTransaction) => void;
type OpportunitySubscriber = (opp: ArbitrageOpportunity) => void;

class MempoolStreamService {
  private mempoolSubscribers: Set<MempoolSubscriber> = new Set();
  private opportunitySubscribers: Set<OpportunitySubscriber> = new Set();
  private isStreaming: boolean = false;
  private streamInterval: any = null;
  private currentNetwork: NetworkId = 'arbitrum';

  public start(network: NetworkId = 'arbitrum') {
    this.currentNetwork = network;
    if (this.isStreaming) return;
    this.isStreaming = true;

    // Simulate high-frequency mempool scanner
    this.streamInterval = setInterval(() => {
      this.generateMempoolEvent();
    }, 2800);
  }

  public stop() {
    this.isStreaming = false;
    if (this.streamInterval) {
      clearInterval(this.streamInterval);
      this.streamInterval = null;
    }
  }

  public setNetwork(network: NetworkId) {
    this.currentNetwork = network;
  }

  public subscribeMempool(cb: MempoolSubscriber) {
    this.mempoolSubscribers.add(cb);
    return () => this.mempoolSubscribers.delete(cb);
  }

  public subscribeOpportunities(cb: OpportunitySubscriber) {
    this.opportunitySubscribers.add(cb);
    return () => this.opportunitySubscribers.delete(cb);
  }

  private generateMempoolEvent() {
    const dexList = ['Uniswap V3', 'Balancer V2', 'Camelot DEX', 'Sushiswap', 'Curve Finance'];
    const actionTypes: Array<MempoolTransaction['actionType']> = ['SWAP', 'LARGE_SELL', 'LARGE_BUY', 'LIQUIDITY_SHIFT'];
    
    const randomDex = dexList[Math.floor(Math.random() * dexList.length)];
    const randomAction = actionTypes[Math.floor(Math.random() * actionTypes.length)];
    const randomValue = (Math.random() * 45 + 2).toFixed(2);
    const gasPrice = parseFloat((Math.random() * 0.4 + 0.1).toFixed(3));
    const randomHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

    const tx: MempoolTransaction = {
      hash: randomHash,
      timestamp: Date.now(),
      from: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      to: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      valueEth: randomValue,
      gasPriceGwei: gasPrice,
      dexTarget: randomDex,
      actionType: randomAction,
      latencyMs: Math.floor(Math.random() * 25 + 12),
      threatLevel: randomAction === 'LARGE_SELL' || randomAction === 'LARGE_BUY' ? 'high' : 'low'
    };

    // Broadcast to mempool listeners
    this.mempoolSubscribers.forEach(cb => cb(tx));

    // Probability of generating arbitrage opportunity
    if (Math.random() > 0.45) {
      const matchedPreset = STRATEGY_PRESETS[Math.floor(Math.random() * STRATEGY_PRESETS.length)];
      
      // Inject slight live variation
      const jitter = (Math.random() * 0.015 - 0.005);
      const grossEth = Math.max(0.004, matchedPreset.grossProfitEth + jitter);
      const grossUsd = grossEth * 3150;
      const gasCost = 0.0008;
      const bribe = grossEth * 0.25;
      const netProfitEth = Math.max(0.002, grossEth - gasCost - bribe);
      const netProfitUsd = netProfitEth * 3150;

      const dynamicOpp: ArbitrageOpportunity = {
        ...matchedPreset,
        id: `opp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: Date.now(),
        grossProfitEth: parseFloat(grossEth.toFixed(5)),
        grossProfitUsd: parseFloat(grossUsd.toFixed(2)),
        netProfitEth: parseFloat(netProfitEth.toFixed(5)),
        netProfitUsd: parseFloat(netProfitUsd.toFixed(2)),
        confidenceScore: Math.floor(Math.random() * 22 + 78),
        status: 'detected',
        networkId: this.currentNetwork,
        isAutopilotEligible: netProfitEth >= 0.01
      };

      tx.detectedOpportunityId = dynamicOpp.id;
      this.opportunitySubscribers.forEach(cb => cb(dynamicOpp));
    }
  }
}

export const mempoolStreamService = new MempoolStreamService();
