import { ArbitrageOpportunity } from '../types/arbitrage';

export const STRATEGY_PRESETS: ArbitrageOpportunity[] = [
  // 1. WETH Triangular on Arbitrum One
  {
    id: 'strat-arb-01',
    timestamp: Date.now(),
    networkId: 'arbitrum',
    asset: { symbol: 'WETH', name: 'Wrapped Ether', address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', decimals: 18 },
    borrowAmount: '12000000000000000000',
    borrowAmountFormatted: '12.00',
    routes: [
      {
        id: 'r1',
        dex: 'Uniswap V3 (0.05%)',
        tokenIn: { symbol: 'WETH', name: 'Wrapped Ether', address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', decimals: 18 },
        tokenOut: { symbol: 'USDC', name: 'USD Coin', address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6 },
        poolFeeBps: 500,
        expectedOut: '37,820.50',
        minAmountOut: '37,650.00',
        priceImpactPercent: 0.08,
        warningLevel: 'none'
      },
      {
        id: 'r2',
        dex: 'Camelot DEX V2',
        tokenIn: { symbol: 'USDC', name: 'USD Coin', address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6 },
        tokenOut: { symbol: 'ARB', name: 'Arbitrum Token', address: '0x912CE59144191C1204E64559FE8253a0e49E6548', decimals: 18 },
        poolFeeBps: 300,
        expectedOut: '48,150.00',
        minAmountOut: '47,900.00',
        priceImpactPercent: 0.12,
        warningLevel: 'none'
      },
      {
        id: 'r3',
        dex: 'Balancer V2 Vault',
        tokenIn: { symbol: 'ARB', name: 'Arbitrum Token', address: '0x912CE59144191C1204E64559FE8253a0e49E6548', decimals: 18 },
        tokenOut: { symbol: 'WETH', name: 'Wrapped Ether', address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', decimals: 18 },
        poolFeeBps: 200,
        expectedOut: '12.048',
        minAmountOut: '12.032',
        priceImpactPercent: 0.09,
        warningLevel: 'none'
      }
    ],
    grossProfitEth: 0.048,
    grossProfitUsd: 151.20,
    estimatedGasEth: 0.0012,
    minerBribeEth: 0.012,
    netProfitEth: 0.0348,
    netProfitUsd: 109.62,
    roiPercent: 2.89,
    confidenceScore: 94,
    status: 'detected',
    isAutopilotEligible: true
  },
  // 2. USDC Stablecoin De-peg Arbitrage (USDC vs USDC.e)
  {
    id: 'strat-arb-02',
    timestamp: Date.now(),
    networkId: 'arbitrum',
    asset: { symbol: 'USDC', name: 'USD Coin', address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6 },
    borrowAmount: '75000000000',
    borrowAmountFormatted: '75,000.00',
    routes: [
      {
        id: 'r1',
        dex: 'Curve Finance (StableSwap)',
        tokenIn: { symbol: 'USDC', name: 'USD Coin', address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6 },
        tokenOut: { symbol: 'USDC.e', name: 'Bridged USDC', address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', decimals: 6 },
        poolFeeBps: 40,
        expectedOut: '75,285.00',
        minAmountOut: '75,220.00',
        priceImpactPercent: 0.02,
        warningLevel: 'none'
      },
      {
        id: 'r2',
        dex: 'Uniswap V3 (0.01%)',
        tokenIn: { symbol: 'USDC.e', name: 'Bridged USDC', address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', decimals: 6 },
        tokenOut: { symbol: 'USDC', name: 'USD Coin', address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6 },
        poolFeeBps: 100,
        expectedOut: '75,210.00',
        minAmountOut: '75,180.00',
        priceImpactPercent: 0.03,
        warningLevel: 'none'
      }
    ],
    grossProfitEth: 0.066,
    grossProfitUsd: 210.00,
    estimatedGasEth: 0.0009,
    minerBribeEth: 0.016,
    netProfitEth: 0.0491,
    netProfitUsd: 154.66,
    roiPercent: 2.12,
    confidenceScore: 98,
    status: 'detected',
    isAutopilotEligible: true
  },
  // 3. WBTC Cross-DEX Balancer -> Uniswap V3
  {
    id: 'strat-arb-03',
    timestamp: Date.now(),
    networkId: 'arbitrum',
    asset: { symbol: 'WBTC', name: 'Wrapped BTC', address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f', decimals: 8 },
    borrowAmount: '200000000',
    borrowAmountFormatted: '2.00',
    routes: [
      {
        id: 'r1',
        dex: 'Balancer V2 Vault',
        tokenIn: { symbol: 'WBTC', name: 'Wrapped BTC', address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f', decimals: 8 },
        tokenOut: { symbol: 'WETH', name: 'Wrapped Ether', address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', decimals: 18 },
        poolFeeBps: 300,
        expectedOut: '44.82',
        minAmountOut: '44.60',
        priceImpactPercent: 0.15,
        warningLevel: 'none'
      },
      {
        id: 'r2',
        dex: 'Uniswap V3 (0.3%)',
        tokenIn: { symbol: 'WETH', name: 'Wrapped Ether', address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', decimals: 18 },
        tokenOut: { symbol: 'WBTC', name: 'Wrapped BTC', address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f', decimals: 8 },
        poolFeeBps: 3000,
        expectedOut: '2.0084',
        minAmountOut: '2.0042',
        priceImpactPercent: 0.18,
        warningLevel: 'warning',
        warningMessage: 'Pool depth shallow on 0.3% tier'
      }
    ],
    grossProfitEth: 0.18,
    grossProfitUsd: 567.00,
    estimatedGasEth: 0.0014,
    minerBribeEth: 0.045,
    netProfitEth: 0.1336,
    netProfitUsd: 420.84,
    roiPercent: 4.22,
    confidenceScore: 89,
    status: 'detected',
    isAutopilotEligible: true
  },
  // 4. ARB Governance Token Momentum Loop
  {
    id: 'strat-arb-04',
    timestamp: Date.now(),
    networkId: 'arbitrum',
    asset: { symbol: 'ARB', name: 'Arbitrum Token', address: '0x912CE59144191C1204E64559FE8253a0e49E6548', decimals: 18 },
    borrowAmount: '80000000000000000000000',
    borrowAmountFormatted: '80,000.00',
    routes: [
      {
        id: 'r1',
        dex: 'Camelot DEX',
        tokenIn: { symbol: 'ARB', name: 'Arbitrum Token', address: '0x912CE59144191C1204E64559FE8253a0e49E6548', decimals: 18 },
        tokenOut: { symbol: 'USDC', name: 'USD Coin', address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6 },
        poolFeeBps: 300,
        expectedOut: '62,720.00',
        minAmountOut: '62,500.00',
        priceImpactPercent: 0.19,
        warningLevel: 'none'
      },
      {
        id: 'r2',
        dex: 'Uniswap V3',
        tokenIn: { symbol: 'USDC', name: 'USD Coin', address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6 },
        tokenOut: { symbol: 'ARB', name: 'Arbitrum Token', address: '0x912CE59144191C1204E64559FE8253a0e49E6548', decimals: 18 },
        poolFeeBps: 500,
        expectedOut: '80,950.00',
        minAmountOut: '80,600.00',
        priceImpactPercent: 0.17,
        warningLevel: 'none'
      }
    ],
    grossProfitEth: 0.082,
    grossProfitUsd: 258.30,
    estimatedGasEth: 0.0008,
    minerBribeEth: 0.020,
    netProfitEth: 0.0612,
    netProfitUsd: 192.78,
    roiPercent: 3.15,
    confidenceScore: 92,
    status: 'detected',
    isAutopilotEligible: true
  },
  // 5. USDT/USDC Flash Bridge on Arbitrum
  {
    id: 'strat-arb-05',
    timestamp: Date.now(),
    networkId: 'arbitrum',
    asset: { symbol: 'USDT', name: 'Tether USD', address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', decimals: 6 },
    borrowAmount: '100000000000',
    borrowAmountFormatted: '100,000.00',
    routes: [
      {
        id: 'r1',
        dex: 'Curve Finance (3pool)',
        tokenIn: { symbol: 'USDT', name: 'Tether USD', address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', decimals: 6 },
        tokenOut: { symbol: 'DAI', name: 'Dai Stablecoin', address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', decimals: 18 },
        poolFeeBps: 40,
        expectedOut: '100,240.00',
        minAmountOut: '100,180.00',
        priceImpactPercent: 0.01,
        warningLevel: 'none'
      },
      {
        id: 'r2',
        dex: 'Uniswap V3 (0.01%)',
        tokenIn: { symbol: 'DAI', name: 'Dai Stablecoin', address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', decimals: 18 },
        tokenOut: { symbol: 'USDT', name: 'Tether USD', address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', decimals: 6 },
        poolFeeBps: 100,
        expectedOut: '100,195.00',
        minAmountOut: '100,140.00',
        priceImpactPercent: 0.02,
        warningLevel: 'none'
      }
    ],
    grossProfitEth: 0.052,
    grossProfitUsd: 164.00,
    estimatedGasEth: 0.0009,
    minerBribeEth: 0.013,
    netProfitEth: 0.0381,
    netProfitUsd: 120.01,
    roiPercent: 1.95,
    confidenceScore: 97,
    status: 'detected',
    isAutopilotEligible: true
  },
  // 6. Sushiswap V2 vs Uniswap V3 WETH Discrepancy
  {
    id: 'strat-arb-06',
    timestamp: Date.now(),
    networkId: 'arbitrum',
    asset: { symbol: 'WETH', name: 'Wrapped Ether', address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', decimals: 18 },
    borrowAmount: '8000000000000000000',
    borrowAmountFormatted: '8.00',
    routes: [
      {
        id: 'r1',
        dex: 'Sushiswap V2',
        tokenIn: { symbol: 'WETH', name: 'Wrapped Ether', address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', decimals: 18 },
        tokenOut: { symbol: 'USDC', name: 'USD Coin', address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6 },
        poolFeeBps: 3000,
        expectedOut: '25,290.00',
        minAmountOut: '25,180.00',
        priceImpactPercent: 0.28,
        warningLevel: 'none'
      },
      {
        id: 'r2',
        dex: 'Uniswap V3 (0.05%)',
        tokenIn: { symbol: 'USDC', name: 'USD Coin', address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6 },
        tokenOut: { symbol: 'WETH', name: 'Wrapped Ether', address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', decimals: 18 },
        poolFeeBps: 500,
        expectedOut: '8.031',
        minAmountOut: '8.020',
        priceImpactPercent: 0.06,
        warningLevel: 'none'
      }
    ],
    grossProfitEth: 0.031,
    grossProfitUsd: 97.65,
    estimatedGasEth: 0.0011,
    minerBribeEth: 0.007,
    netProfitEth: 0.0229,
    netProfitUsd: 72.13,
    roiPercent: 2.18,
    confidenceScore: 91,
    status: 'detected',
    isAutopilotEligible: true
  },
  // 7. Ethereum Mainnet WETH Heavy Bundle
  {
    id: 'strat-eth-01',
    timestamp: Date.now(),
    networkId: 'ethereum',
    asset: { symbol: 'WETH', name: 'Wrapped Ether', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', decimals: 18 },
    borrowAmount: '40000000000000000000',
    borrowAmountFormatted: '40.00',
    routes: [
      {
        id: 'r1',
        dex: 'Uniswap V3',
        tokenIn: { symbol: 'WETH', name: 'Wrapped Ether', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', decimals: 18 },
        tokenOut: { symbol: 'DAI', name: 'Dai Stablecoin', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', decimals: 18 },
        poolFeeBps: 500,
        expectedOut: '126,450.00',
        minAmountOut: '126,000.00',
        priceImpactPercent: 0.12,
        warningLevel: 'none'
      },
      {
        id: 'r2',
        dex: 'Curve Finance (TriCrypto)',
        tokenIn: { symbol: 'DAI', name: 'Dai Stablecoin', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', decimals: 18 },
        tokenOut: { symbol: 'WETH', name: 'Wrapped Ether', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', decimals: 18 },
        poolFeeBps: 200,
        expectedOut: '40.165',
        minAmountOut: '40.120',
        priceImpactPercent: 0.08,
        warningLevel: 'none'
      }
    ],
    grossProfitEth: 0.165,
    grossProfitUsd: 519.75,
    estimatedGasEth: 0.028,
    minerBribeEth: 0.041,
    netProfitEth: 0.096,
    netProfitUsd: 302.40,
    roiPercent: 1.84,
    confidenceScore: 86,
    status: 'detected',
    isAutopilotEligible: true
  },
  // 8. Polygon QuickSwap to UniV3 POL Arbitrage
  {
    id: 'strat-poly-01',
    timestamp: Date.now(),
    networkId: 'polygon',
    asset: { symbol: 'USDC', name: 'USD Coin', address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', decimals: 6 },
    borrowAmount: '35000000000',
    borrowAmountFormatted: '35,000.00',
    routes: [
      {
        id: 'r1',
        dex: 'QuickSwap DEX',
        tokenIn: { symbol: 'USDC', name: 'USD Coin', address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', decimals: 6 },
        tokenOut: { symbol: 'WETH', name: 'Wrapped Ether', address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', decimals: 18 },
        poolFeeBps: 3000,
        expectedOut: '11.12',
        minAmountOut: '11.08',
        priceImpactPercent: 0.14,
        warningLevel: 'none'
      },
      {
        id: 'r2',
        dex: 'Uniswap V3',
        tokenIn: { symbol: 'WETH', name: 'Wrapped Ether', address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', decimals: 18 },
        tokenOut: { symbol: 'USDC', name: 'USD Coin', address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', decimals: 6 },
        poolFeeBps: 500,
        expectedOut: '35,118.00',
        minAmountOut: '35,090.00',
        priceImpactPercent: 0.05,
        warningLevel: 'none'
      }
    ],
    grossProfitEth: 0.037,
    grossProfitUsd: 118.00,
    estimatedGasEth: 0.0006,
    minerBribeEth: 0.009,
    netProfitEth: 0.0274,
    netProfitUsd: 86.31,
    roiPercent: 1.78,
    confidenceScore: 93,
    status: 'detected',
    isAutopilotEligible: true
  },
  // 9. Optimism Velodrome to UniV3 OP Token Loop
  {
    id: 'strat-op-01',
    timestamp: Date.now(),
    networkId: 'optimism',
    asset: { symbol: 'WETH', name: 'Wrapped Ether', address: '0x4200000000000000000000000000000000000006', decimals: 18 },
    borrowAmount: '14000000000000000000',
    borrowAmountFormatted: '14.00',
    routes: [
      {
        id: 'r1',
        dex: 'Velodrome V2',
        tokenIn: { symbol: 'WETH', name: 'Wrapped Ether', address: '0x4200000000000000000000000000000000000006', decimals: 18 },
        tokenOut: { symbol: 'OP', name: 'Optimism Token', address: '0x4200000000000000000000000000000000000042', decimals: 18 },
        poolFeeBps: 200,
        expectedOut: '22,400.00',
        minAmountOut: '22,250.00',
        priceImpactPercent: 0.16,
        warningLevel: 'none'
      },
      {
        id: 'r2',
        dex: 'Uniswap V3',
        tokenIn: { symbol: 'OP', name: 'Optimism Token', address: '0x4200000000000000000000000000000000000042', decimals: 18 },
        tokenOut: { symbol: 'WETH', name: 'Wrapped Ether', address: '0x4200000000000000000000000000000000000006', decimals: 18 },
        poolFeeBps: 500,
        expectedOut: '14.054',
        minAmountOut: '14.040',
        priceImpactPercent: 0.11,
        warningLevel: 'none'
      }
    ],
    grossProfitEth: 0.054,
    grossProfitUsd: 170.10,
    estimatedGasEth: 0.0007,
    minerBribeEth: 0.013,
    netProfitEth: 0.0403,
    netProfitUsd: 126.94,
    roiPercent: 2.38,
    confidenceScore: 90,
    status: 'detected',
    isAutopilotEligible: true
  },
  // 10. Arbitrum 4-Hop Multi-DEX Flash Loop
  {
    id: 'strat-arb-07',
    timestamp: Date.now(),
    networkId: 'arbitrum',
    asset: { symbol: 'WETH', name: 'Wrapped Ether', address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', decimals: 18 },
    borrowAmount: '18000000000000000000',
    borrowAmountFormatted: '18.00',
    routes: [
      {
        id: 'r1',
        dex: 'Uniswap V3 (0.05%)',
        tokenIn: { symbol: 'WETH', name: 'Wrapped Ether', address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', decimals: 18 },
        tokenOut: { symbol: 'USDC', name: 'USD Coin', address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6 },
        poolFeeBps: 500,
        expectedOut: '56,790.00',
        minAmountOut: '56,500.00',
        priceImpactPercent: 0.11,
        warningLevel: 'none'
      },
      {
        id: 'r2',
        dex: 'Curve Finance (3pool)',
        tokenIn: { symbol: 'USDC', name: 'USD Coin', address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6 },
        tokenOut: { symbol: 'USDT', name: 'Tether USD', address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', decimals: 6 },
        poolFeeBps: 40,
        expectedOut: '56,860.00',
        minAmountOut: '56,800.00',
        priceImpactPercent: 0.01,
        warningLevel: 'none'
      },
      {
        id: 'r3',
        dex: 'Camelot DEX',
        tokenIn: { symbol: 'USDT', name: 'Tether USD', address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', decimals: 6 },
        tokenOut: { symbol: 'ARB', name: 'Arbitrum Token', address: '0x912CE59144191C1204E64559FE8253a0e49E6548', decimals: 18 },
        poolFeeBps: 300,
        expectedOut: '72,400.00',
        minAmountOut: '72,100.00',
        priceImpactPercent: 0.13,
        warningLevel: 'none'
      },
      {
        id: 'r4',
        dex: 'Balancer V2',
        tokenIn: { symbol: 'ARB', name: 'Arbitrum Token', address: '0x912CE59144191C1204E64559FE8253a0e49E6548', decimals: 18 },
        tokenOut: { symbol: 'WETH', name: 'Wrapped Ether', address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', decimals: 18 },
        poolFeeBps: 200,
        expectedOut: '18.082',
        minAmountOut: '18.060',
        priceImpactPercent: 0.14,
        warningLevel: 'warning',
        warningMessage: '4-hop execution gas sensitive'
      }
    ],
    grossProfitEth: 0.082,
    grossProfitUsd: 258.30,
    estimatedGasEth: 0.0021,
    minerBribeEth: 0.020,
    netProfitEth: 0.0599,
    netProfitUsd: 188.68,
    roiPercent: 2.75,
    confidenceScore: 88,
    status: 'detected',
    isAutopilotEligible: true
  },
  // 11. DAI Arbitrum Lending Arbitrage
  {
    id: 'strat-arb-08',
    timestamp: Date.now(),
    networkId: 'arbitrum',
    asset: { symbol: 'DAI', name: 'Dai Stablecoin', address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', decimals: 18 },
    borrowAmount: '120000000000000000000000',
    borrowAmountFormatted: '120,000.00',
    routes: [
      {
        id: 'r1',
        dex: 'Balancer V2',
        tokenIn: { symbol: 'DAI', name: 'Dai Stablecoin', address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', decimals: 18 },
        tokenOut: { symbol: 'USDC', name: 'USD Coin', address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6 },
        poolFeeBps: 100,
        expectedOut: '120,380.00',
        minAmountOut: '120,300.00',
        priceImpactPercent: 0.03,
        warningLevel: 'none'
      },
      {
        id: 'r2',
        dex: 'Uniswap V3',
        tokenIn: { symbol: 'USDC', name: 'USD Coin', address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6 },
        tokenOut: { symbol: 'DAI', name: 'Dai Stablecoin', address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', decimals: 18 },
        poolFeeBps: 100,
        expectedOut: '120,310.00',
        minAmountOut: '120,250.00',
        priceImpactPercent: 0.02,
        warningLevel: 'none'
      }
    ],
    grossProfitEth: 0.098,
    grossProfitUsd: 310.00,
    estimatedGasEth: 0.0011,
    minerBribeEth: 0.024,
    netProfitEth: 0.0729,
    netProfitUsd: 229.63,
    roiPercent: 2.14,
    confidenceScore: 96,
    status: 'detected',
    isAutopilotEligible: true
  },
  // 12. WBTC/USDC Sandwich Counter-Arb
  {
    id: 'strat-arb-09',
    timestamp: Date.now(),
    networkId: 'arbitrum',
    asset: { symbol: 'USDC', name: 'USD Coin', address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6 },
    borrowAmount: '150000000000',
    borrowAmountFormatted: '150,000.00',
    routes: [
      {
        id: 'r1',
        dex: 'Uniswap V3 (0.05%)',
        tokenIn: { symbol: 'USDC', name: 'USD Coin', address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6 },
        tokenOut: { symbol: 'WBTC', name: 'Wrapped BTC', address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f', decimals: 8 },
        poolFeeBps: 500,
        expectedOut: '2.185',
        minAmountOut: '2.178',
        priceImpactPercent: 0.22,
        warningLevel: 'none'
      },
      {
        id: 'r2',
        dex: 'Balancer V2',
        tokenIn: { symbol: 'WBTC', name: 'Wrapped BTC', address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f', decimals: 8 },
        tokenOut: { symbol: 'USDC', name: 'USD Coin', address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6 },
        poolFeeBps: 200,
        expectedOut: '150,580.00',
        minAmountOut: '150,450.00',
        priceImpactPercent: 0.18,
        warningLevel: 'none'
      }
    ],
    grossProfitEth: 0.184,
    grossProfitUsd: 580.00,
    estimatedGasEth: 0.0016,
    minerBribeEth: 0.046,
    netProfitEth: 0.1364,
    netProfitUsd: 429.66,
    roiPercent: 3.42,
    confidenceScore: 92,
    status: 'detected',
    isAutopilotEligible: true
  },
  // 13. WETH Flash Liquidity Surge
  {
    id: 'strat-arb-10',
    timestamp: Date.now(),
    networkId: 'arbitrum',
    asset: { symbol: 'WETH', name: 'Wrapped Ether', address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', decimals: 18 },
    borrowAmount: '25000000000000000000',
    borrowAmountFormatted: '25.00',
    routes: [
      {
        id: 'r1',
        dex: 'Camelot DEX',
        tokenIn: { symbol: 'WETH', name: 'Wrapped Ether', address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', decimals: 18 },
        tokenOut: { symbol: 'USDC', name: 'USD Coin', address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6 },
        poolFeeBps: 300,
        expectedOut: '78,920.00',
        minAmountOut: '78,650.00',
        priceImpactPercent: 0.15,
        warningLevel: 'none'
      },
      {
        id: 'r2',
        dex: 'Uniswap V3',
        tokenIn: { symbol: 'USDC', name: 'USD Coin', address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6 },
        tokenOut: { symbol: 'WETH', name: 'Wrapped Ether', address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', decimals: 18 },
        poolFeeBps: 500,
        expectedOut: '25.074',
        minAmountOut: '25.050',
        priceImpactPercent: 0.08,
        warningLevel: 'none'
      }
    ],
    grossProfitEth: 0.074,
    grossProfitUsd: 233.10,
    estimatedGasEth: 0.0013,
    minerBribeEth: 0.018,
    netProfitEth: 0.0547,
    netProfitUsd: 172.30,
    roiPercent: 2.19,
    confidenceScore: 95,
    status: 'detected',
    isAutopilotEligible: true
  },
  // 14. zkSync SyncSwap WETH Route
  {
    id: 'strat-zk-01',
    timestamp: Date.now(),
    networkId: 'zksync',
    asset: { symbol: 'WETH', name: 'Wrapped Ether', address: '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91', decimals: 18 },
    borrowAmount: '10000000000000000000',
    borrowAmountFormatted: '10.00',
    routes: [
      {
        id: 'r1',
        dex: 'SyncSwap Classic',
        tokenIn: { symbol: 'WETH', name: 'Wrapped Ether', address: '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91', decimals: 18 },
        tokenOut: { symbol: 'USDC', name: 'USD Coin', address: '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4', decimals: 6 },
        poolFeeBps: 300,
        expectedOut: '31,580.00',
        minAmountOut: '31,450.00',
        priceImpactPercent: 0.17,
        warningLevel: 'none'
      },
      {
        id: 'r2',
        dex: 'SyncSwap Stable',
        tokenIn: { symbol: 'USDC', name: 'USD Coin', address: '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4', decimals: 6 },
        tokenOut: { symbol: 'WETH', name: 'Wrapped Ether', address: '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91', decimals: 18 },
        poolFeeBps: 50,
        expectedOut: '10.038',
        minAmountOut: '10.024',
        priceImpactPercent: 0.12,
        warningLevel: 'none'
      }
    ],
    grossProfitEth: 0.038,
    grossProfitUsd: 119.70,
    estimatedGasEth: 0.0015,
    minerBribeEth: 0.009,
    netProfitEth: 0.0275,
    netProfitUsd: 86.62,
    roiPercent: 2.29,
    confidenceScore: 87,
    status: 'detected',
    isAutopilotEligible: true
  },
  // 15. Ethereum Balancer -> Curve Tri-Hop
  {
    id: 'strat-eth-02',
    timestamp: Date.now(),
    networkId: 'ethereum',
    asset: { symbol: 'DAI', name: 'Dai Stablecoin', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', decimals: 18 },
    borrowAmount: '200000000000000000000000',
    borrowAmountFormatted: '200,000.00',
    routes: [
      {
        id: 'r1',
        dex: 'Balancer V2',
        tokenIn: { symbol: 'DAI', name: 'Dai Stablecoin', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', decimals: 18 },
        tokenOut: { symbol: 'USDC', name: 'USD Coin', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6 },
        poolFeeBps: 100,
        expectedOut: '200,640.00',
        minAmountOut: '200,500.00',
        priceImpactPercent: 0.02,
        warningLevel: 'none'
      },
      {
        id: 'r2',
        dex: 'Curve Finance',
        tokenIn: { symbol: 'USDC', name: 'USD Coin', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6 },
        tokenOut: { symbol: 'DAI', name: 'Dai Stablecoin', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', decimals: 18 },
        poolFeeBps: 40,
        expectedOut: '200,520.00',
        minAmountOut: '200,450.00',
        priceImpactPercent: 0.01,
        warningLevel: 'none'
      }
    ],
    grossProfitEth: 0.165,
    grossProfitUsd: 520.00,
    estimatedGasEth: 0.029,
    minerBribeEth: 0.041,
    netProfitEth: 0.095,
    netProfitUsd: 299.25,
    roiPercent: 1.81,
    confidenceScore: 89,
    status: 'detected',
    isAutopilotEligible: true
  },
  // 16. Arbitrum Camelot -> Curve Ultra Low Slippage
  {
    id: 'strat-arb-11',
    timestamp: Date.now(),
    networkId: 'arbitrum',
    asset: { symbol: 'WETH', name: 'Wrapped Ether', address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', decimals: 18 },
    borrowAmount: '30000000000000000000',
    borrowAmountFormatted: '30.00',
    routes: [
      {
        id: 'r1',
        dex: 'Camelot DEX',
        tokenIn: { symbol: 'WETH', name: 'Wrapped Ether', address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', decimals: 18 },
        tokenOut: { symbol: 'USDT', name: 'Tether USD', address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', decimals: 6 },
        poolFeeBps: 300,
        expectedOut: '94,680.00',
        minAmountOut: '94,350.00',
        priceImpactPercent: 0.18,
        warningLevel: 'none'
      },
      {
        id: 'r2',
        dex: 'Uniswap V3',
        tokenIn: { symbol: 'USDT', name: 'Tether USD', address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', decimals: 6 },
        tokenOut: { symbol: 'WETH', name: 'Wrapped Ether', address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', decimals: 18 },
        poolFeeBps: 500,
        expectedOut: '30.091',
        minAmountOut: '30.070',
        priceImpactPercent: 0.09,
        warningLevel: 'none'
      }
    ],
    grossProfitEth: 0.091,
    grossProfitUsd: 286.65,
    estimatedGasEth: 0.0014,
    minerBribeEth: 0.022,
    netProfitEth: 0.0676,
    netProfitUsd: 212.94,
    roiPercent: 2.34,
    confidenceScore: 93,
    status: 'detected',
    isAutopilotEligible: true
  }
];
