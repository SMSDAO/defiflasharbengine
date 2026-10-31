import { ArbitrageOpportunity, RouteStep } from '../types/arbitrage';

export interface DriftAnalysis {
  hasDrift: boolean;
  driftPercentage: number;
  oraclePriceUsd: number;
  dexEffectivePriceUsd: number;
  adjustedMinOut: string;
}

/**
 * Service to dynamically adjust slippage, recalculate minAmountOut against Chainlink oracle drift,
 * and tune execution parameters based on pool depth.
 */
class StrategyTunerService {
  /**
   * Chainlink Price Feed simulated drift check (>2% drift flags recalculation)
   */
  public evaluateChainlinkDrift(
    tokenSymbol: string,
    expectedPrice: number,
    dexPrice: number
  ): DriftAnalysis {
    const driftPercentage = Math.abs((dexPrice - expectedPrice) / expectedPrice) * 100;
    const hasDrift = driftPercentage > 2.0;

    return {
      hasDrift,
      driftPercentage: parseFloat(driftPercentage.toFixed(2)),
      oraclePriceUsd: expectedPrice,
      dexEffectivePriceUsd: dexPrice,
      adjustedMinOut: (dexPrice * (1 - (hasDrift ? 0.005 : 0.002))).toFixed(4)
    };
  }

  /**
   * Recalculates expected ROI and minimum amounts out for an arbitrary sequence of steps
   */
  public calculateRouteROI(
    borrowAmount: number,
    steps: RouteStep[],
    gasCostEth: number = 0.0012,
    minerBribeBps: number = 2500
  ): {
    grossProfit: number;
    netProfit: number;
    roi: number;
    isProfitable: boolean;
    cumulativeImpact: number;
  } {
    let currentAmount = borrowAmount;
    let cumulativeImpact = 0;

    for (const step of steps) {
      cumulativeImpact += step.priceImpactPercent;
      const feeDeduction = 1 - (step.poolFeeBps / 1000000);
      currentAmount = currentAmount * feeDeduction;
    }

    // Add slight arbitrage spread (e.g. 0.35% - 0.75% based on routes)
    const arbSpread = Math.max(0.003, 0.005 - cumulativeImpact * 0.01);
    const finalAmount = currentAmount * (1 + arbSpread);
    const grossProfit = Math.max(0, finalAmount - borrowAmount);
    const minerBribe = (grossProfit * minerBribeBps) / 10000;
    const netProfit = Math.max(0, grossProfit - gasCostEth - minerBribe);
    const roi = borrowAmount > 0 ? (netProfit / borrowAmount) * 100 : 0;

    return {
      grossProfit: parseFloat(grossProfit.toFixed(5)),
      netProfit: parseFloat(netProfit.toFixed(5)),
      roi: parseFloat(roi.toFixed(2)),
      isProfitable: netProfit > 0.005,
      cumulativeImpact: parseFloat(cumulativeImpact.toFixed(2))
    };
  }

  /**
   * Automatically auto-recalculates minAmountOut across an opportunity when drift is observed
   */
  public rebalanceMinAmounts(opportunity: ArbitrageOpportunity, slippageTolerancePercent: number): ArbitrageOpportunity {
    const updatedRoutes = opportunity.routes.map(step => {
      const rawNum = parseFloat(step.expectedOut.replace(/,/g, ''));
      if (isNaN(rawNum)) return step;

      const safeMin = rawNum * (1 - (slippageTolerancePercent / 100));
      return {
        ...step,
        minAmountOut: safeMin.toLocaleString('en-US', { maximumFractionDigits: 4 }),
        warningLevel: (step.priceImpactPercent > 0.3 ? 'warning' : 'none') as 'none' | 'warning' | 'critical'
      };
    });

    return {
      ...opportunity,
      routes: updatedRoutes
    };
  }
}

export const strategyTunerService = new StrategyTunerService();
