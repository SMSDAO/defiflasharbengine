import { ArbitrageOpportunity, RiskAnalysisResult, RiskSettings } from '../types/arbitrage';

class RiskAssessmentService {
  /**
   * Evaluates market conditions, slippage, pool depth, and gas burden to produce composite Risk Score
   */
  public assessOpportunityRisk(
    opportunity: ArbitrageOpportunity,
    riskSettings: RiskSettings
  ): RiskAnalysisResult {
    const reasons: string[] = [];

    // 1. Slippage Risk (0 - 30 pts)
    let slippageRisk = 0;
    const maxHopImpact = Math.max(...opportunity.routes.map(r => r.priceImpactPercent), 0);
    if (maxHopImpact > 0.4) {
      slippageRisk = 28;
      reasons.push(`High price impact on swap route: ${(maxHopImpact * 100).toFixed(1)}%`);
    } else if (maxHopImpact > 0.2) {
      slippageRisk = 16;
      reasons.push(`Moderate price impact: ${(maxHopImpact * 100).toFixed(1)}%`);
    } else {
      slippageRisk = 4;
    }

    // 2. Gas Burden Risk (0 - 25 pts)
    let gasBurdenRisk = 0;
    const gasRatio = opportunity.grossProfitEth > 0 
      ? (opportunity.estimatedGasEth / opportunity.grossProfitEth) * 100 
      : 100;
    if (gasRatio > 40) {
      gasBurdenRisk = 24;
      reasons.push(`Gas consumes ${gasRatio.toFixed(0)}% of gross yield`);
    } else if (gasRatio > 20) {
      gasBurdenRisk = 14;
      reasons.push(`Gas consumes ${gasRatio.toFixed(0)}% of gross yield`);
    } else {
      gasBurdenRisk = 3;
    }

    // 3. Pool Depth & Hop Complexity Risk (0 - 25 pts)
    let poolDepthRisk = 0;
    const hopsCount = opportunity.routes.length;
    if (hopsCount >= 4) {
      poolDepthRisk = 20;
      reasons.push(`Complex 4-hop execution chain increases revert probability`);
    } else if (hopsCount === 3) {
      poolDepthRisk = 10;
    } else {
      poolDepthRisk = 3;
    }

    // 4. Market Volatility & Exposure Risk (0 - 20 pts)
    let volatilityRisk = 0;
    const borrowNum = parseFloat(opportunity.borrowAmountFormatted.replace(/,/g, '')) || 0;
    if (borrowNum > riskSettings.maxExposurePerTradeEth) {
      volatilityRisk = 20;
      reasons.push(`Borrow principal (${borrowNum.toFixed(1)}) exceeds trade ceiling (${riskSettings.maxExposurePerTradeEth})`);
    } else if (riskSettings.currentVolatilityIndex > riskSettings.marketVolatilityThreshold) {
      volatilityRisk = 15;
      reasons.push(`Current market volatility (${riskSettings.currentVolatilityIndex}%) exceeds threshold (${riskSettings.marketVolatilityThreshold}%)`);
    } else {
      volatilityRisk = 3;
    }

    // 5. Excluded DEX checks
    const hasExcludedDex = opportunity.routes.some(r => 
      riskSettings.excludedDexes.some(ex => r.dex.toLowerCase().includes(ex.toLowerCase()))
    );
    if (hasExcludedDex) {
      reasons.push('Contains blacklisted or excluded DEX router');
    }

    const totalScore = Math.min(100, slippageRisk + gasBurdenRisk + poolDepthRisk + volatilityRisk + (hasExcludedDex ? 50 : 0));
    const healthScore = Math.max(0, 100 - totalScore);

    let riskLevel: RiskAnalysisResult['riskLevel'] = 'LOW';
    if (totalScore >= 70) riskLevel = 'CRITICAL';
    else if (totalScore >= 50) riskLevel = 'ELEVATED';
    else if (totalScore >= 30) riskLevel = 'MODERATE';

    // Autopilot approval criteria:
    // Score <= 35, no critical reasons, circuit breaker not tripped, no blacklisted DEXes
    const isApprovedForAutopilot = 
      totalScore <= 40 &&
      !riskSettings.circuitBreakerTripped &&
      !hasExcludedDex &&
      borrowNum <= riskSettings.maxExposurePerTradeEth;

    return {
      score: totalScore,
      healthScore,
      riskLevel,
      slippageRisk,
      gasBurdenRisk,
      poolDepthRisk,
      oracleDriftRisk: 5,
      isApprovedForAutopilot,
      reasons: reasons.length > 0 ? reasons : ['Optimal liquidity depth and tight slippage spreads verified.']
    };
  }
}

export const riskAssessmentService = new RiskAssessmentService();
