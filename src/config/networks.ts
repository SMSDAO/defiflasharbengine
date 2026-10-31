import { NetworkConfig, NetworkId } from '../types/arbitrage';

export const SUPPORTED_NETWORKS: Record<NetworkId, NetworkConfig> = {
  arbitrum: {
    id: 'arbitrum',
    name: 'Arbitrum One (Primary)',
    chainId: 42161,
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    fallbackRpcs: [
      'https://arbitrum.llamarpc.com',
      'https://rpc.ankr.com/arbitrum',
      'https://1rpc.io/arb'
    ],
    blockExplorer: 'https://arbiscan.io',
    aavePool: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
    aaveAddressesProvider: '0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb',
    weth: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    tokens: [
      {
        symbol: 'WETH',
        name: 'Wrapped Ether',
        address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
        decimals: 18,
      },
      {
        symbol: 'USDC',
        name: 'USD Coin (Native)',
        address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
        decimals: 6,
      },
      {
        symbol: 'USDC.e',
        name: 'Bridged USDC',
        address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
        decimals: 6,
      },
      {
        symbol: 'USDT',
        name: 'Tether USD',
        address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        decimals: 6,
      },
      {
        symbol: 'ARB',
        name: 'Arbitrum Token',
        address: '0x912CE59144191C1204E64559FE8253a0e49E6548',
        decimals: 18,
      },
      {
        symbol: 'WBTC',
        name: 'Wrapped BTC',
        address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
        decimals: 8,
      },
      {
        symbol: 'DAI',
        name: 'Dai Stablecoin',
        address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
        decimals: 18,
      }
    ],
    dexes: [
      {
        name: 'Uniswap V3',
        routerAddress: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
        type: 'uniswap_v3',
      },
      {
        name: 'Balancer V2',
        routerAddress: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
        type: 'balancer_v2',
      },
      {
        name: 'Camelot DEX',
        routerAddress: '0xc873fEcbd354f5A56E00E710B90EF4201db2448d',
        type: 'uniswap_v2',
      },
      {
        name: 'Sushiswap',
        routerAddress: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
        type: 'uniswap_v2',
      },
      {
        name: 'Curve Finance',
        routerAddress: '0x445fe580eF8d70FF569aB36e80c647af338db351',
        type: 'curve',
      }
    ]
  },
  ethereum: {
    id: 'ethereum',
    name: 'Ethereum Mainnet',
    chainId: 1,
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrl: 'https://eth.llamarpc.com',
    fallbackRpcs: ['https://rpc.ankr.com/eth', 'https://cloudflare-eth.com'],
    blockExplorer: 'https://etherscan.io',
    aavePool: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2',
    aaveAddressesProvider: '0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e',
    weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    tokens: [
      { symbol: 'WETH', name: 'Wrapped Ether', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', decimals: 18 },
      { symbol: 'USDC', name: 'USD Coin', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6 },
      { symbol: 'USDT', name: 'Tether USD', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6 },
      { symbol: 'DAI', name: 'Dai Stablecoin', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', decimals: 18 }
    ],
    dexes: [
      { name: 'Uniswap V3', routerAddress: '0xE592427A0AEce92De3Edee1F18E0157C05861564', type: 'uniswap_v3' },
      { name: 'Balancer V2', routerAddress: '0xBA12222222228d8Ba445958a75a0704d566BF2C8', type: 'balancer_v2' },
      { name: 'Curve Finance', routerAddress: '0x99a58482BD75cbab83b27EC03CA68fF489b5788f', type: 'curve' }
    ]
  },
  polygon: {
    id: 'polygon',
    name: 'Polygon PoS',
    chainId: 137,
    nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
    rpcUrl: 'https://polygon-rpc.com',
    fallbackRpcs: ['https://rpc.ankr.com/polygon', 'https://1rpc.io/matic'],
    blockExplorer: 'https://polygonscan.com',
    aavePool: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
    aaveAddressesProvider: '0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb',
    weth: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    tokens: [
      { symbol: 'WETH', name: 'Wrapped Ether', address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', decimals: 18 },
      { symbol: 'USDC', name: 'USD Coin', address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', decimals: 6 },
      { symbol: 'USDT', name: 'Tether USD', address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', decimals: 6 }
    ],
    dexes: [
      { name: 'QuickSwap', routerAddress: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff', type: 'uniswap_v2' },
      { name: 'Uniswap V3', routerAddress: '0xE592427A0AEce92De3Edee1F18E0157C05861564', type: 'uniswap_v3' }
    ]
  },
  optimism: {
    id: 'optimism',
    name: 'Optimism Mainnet',
    chainId: 10,
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrl: 'https://mainnet.optimism.io',
    fallbackRpcs: ['https://rpc.ankr.com/optimism', 'https://1rpc.io/op'],
    blockExplorer: 'https://optimistic.etherscan.io',
    aavePool: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
    aaveAddressesProvider: '0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb',
    weth: '0x4200000000000000000000000000000000000006',
    tokens: [
      { symbol: 'WETH', name: 'Wrapped Ether', address: '0x4200000000000000000000000000000000000006', decimals: 18 },
      { symbol: 'USDC', name: 'USD Coin', address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', decimals: 6 },
      { symbol: 'OP', name: 'Optimism Token', address: '0x4200000000000000000000000000000000000042', decimals: 18 }
    ],
    dexes: [
      { name: 'Velodrome V2', routerAddress: '0xa062aE8A9c5e11aaA026fc2670B0D65cCc8B2858', type: 'uniswap_v2' },
      { name: 'Uniswap V3', routerAddress: '0xE592427A0AEce92De3Edee1F18E0157C05861564', type: 'uniswap_v3' }
    ]
  },
  zksync: {
    id: 'zksync',
    name: 'zkSync Era',
    chainId: 324,
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrl: 'https://mainnet.era.zksync.io',
    fallbackRpcs: ['https://zksync.drpc.org'],
    blockExplorer: 'https://explorer.zksync.io',
    aavePool: '0x78e30497a3c7527d953c6B1E3541b021A98Ac43c',
    aaveAddressesProvider: '0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e',
    weth: '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91',
    tokens: [
      { symbol: 'WETH', name: 'Wrapped Ether', address: '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91', decimals: 18 },
      { symbol: 'USDC', name: 'USD Coin', address: '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4', decimals: 6 }
    ],
    dexes: [
      { name: 'SyncSwap', routerAddress: '0x2da10A1e27bF85cEdD8FFb1AbBe97e53391C0295', type: 'uniswap_v2' }
    ]
  }
};
