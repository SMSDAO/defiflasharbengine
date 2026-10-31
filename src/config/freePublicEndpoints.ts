import { NetworkId } from '../types/arbitrage';

export interface FreeRpcEndpoint {
  name: string;
  url: string;
  provider: string;
  isPrivateMev: boolean;
  rateLimit: string;
  latencyMs: number;
  features: string[];
}

export const FREE_PUBLIC_RPCS: Record<NetworkId, FreeRpcEndpoint[]> = {
  arbitrum: [
    {
      name: 'Arbitrum Nitro Official',
      url: 'https://arb1.arbitrum.io/rpc',
      provider: 'Offchain Labs',
      isPrivateMev: false,
      rateLimit: 'Unlimited / Free',
      latencyMs: 12,
      features: ['Official Sequencer', 'Sub-second Feed', 'Zero Cost']
    },
    {
      name: 'DefiLlama LlamaRPC',
      url: 'https://arbitrum.llamarpc.com',
      provider: 'DefiLlama',
      isPrivateMev: true,
      rateLimit: 'Unlimited / Free',
      latencyMs: 16,
      features: ['Privacy Shield', 'Zero Tracking', 'Zero Cost']
    },
    {
      name: 'Automata 1RPC',
      url: 'https://1rpc.io/arb',
      provider: 'Automata Network',
      isPrivateMev: true,
      rateLimit: 'Free Community',
      latencyMs: 19,
      features: ['Anti-Phishing', 'MEV Protected', 'Zero Cost']
    },
    {
      name: 'PublicNode Arbitrum',
      url: 'https://arbitrum-one-rpc.publicnode.com',
      provider: 'PublicNode',
      isPrivateMev: false,
      rateLimit: 'High Throughput',
      latencyMs: 18,
      features: ['Direct Validator Peer', 'High Concurrency']
    },
    {
      name: 'Ankr Public Gateway',
      url: 'https://rpc.ankr.com/arbitrum',
      provider: 'Ankr Network',
      isPrivateMev: false,
      rateLimit: 'Free Global',
      latencyMs: 22,
      features: ['Geo-Distributed', 'Automatic Failover']
    }
  ],
  ethereum: [
    {
      name: 'Cloudflare Ethereum Gateway',
      url: 'https://cloudflare-eth.com',
      provider: 'Cloudflare',
      isPrivateMev: false,
      rateLimit: 'Unlimited / Free',
      latencyMs: 25,
      features: ['Enterprise Anycast CDN', '99.99% Uptime']
    },
    {
      name: 'DefiLlama LlamaRPC',
      url: 'https://eth.llamarpc.com',
      provider: 'DefiLlama',
      isPrivateMev: true,
      rateLimit: 'Unlimited / Free',
      latencyMs: 28,
      features: ['No IP Logging', 'Free Frontrun Guard']
    },
    {
      name: 'Automata 1RPC',
      url: 'https://1rpc.io/eth',
      provider: 'Automata Network',
      isPrivateMev: true,
      rateLimit: 'Free Community',
      latencyMs: 31,
      features: ['Anti-Sandwich', 'Zero Cost']
    },
    {
      name: 'PublicNode Ethereum',
      url: 'https://ethereum-rpc.publicnode.com',
      provider: 'PublicNode',
      isPrivateMev: false,
      rateLimit: 'High Throughput',
      latencyMs: 29,
      features: ['Full Archive Node', 'Free']
    }
  ],
  polygon: [
    {
      name: 'Polygon Bor Official',
      url: 'https://polygon-rpc.com',
      provider: 'Polygon Labs',
      isPrivateMev: false,
      rateLimit: 'Unlimited / Free',
      latencyMs: 22,
      features: ['Official Bor Client', 'Zero Cost']
    },
    {
      name: 'DefiLlama LlamaRPC',
      url: 'https://polygon.llamarpc.com',
      provider: 'DefiLlama',
      isPrivateMev: true,
      rateLimit: 'Unlimited / Free',
      latencyMs: 24,
      features: ['Privacy Shield', 'Free']
    },
    {
      name: 'Automata 1RPC',
      url: 'https://1rpc.io/matic',
      provider: 'Automata Network',
      isPrivateMev: true,
      rateLimit: 'Free Community',
      latencyMs: 26,
      features: ['MEV Protected', 'Zero Cost']
    }
  ],
  optimism: [
    {
      name: 'Optimism OP Labs Official',
      url: 'https://mainnet.optimism.io',
      provider: 'OP Labs',
      isPrivateMev: false,
      rateLimit: 'Unlimited / Free',
      latencyMs: 18,
      features: ['Official Bedrock Sequencer', 'Zero Cost']
    },
    {
      name: 'DefiLlama LlamaRPC',
      url: 'https://optimism.llamarpc.com',
      provider: 'DefiLlama',
      isPrivateMev: true,
      rateLimit: 'Unlimited / Free',
      latencyMs: 20,
      features: ['Privacy Shield', 'Zero Cost']
    },
    {
      name: 'Automata 1RPC',
      url: 'https://1rpc.io/op',
      provider: 'Automata Network',
      isPrivateMev: true,
      rateLimit: 'Free Community',
      latencyMs: 23,
      features: ['MEV Guard', 'Zero Cost']
    }
  ],
  zksync: [
    {
      name: 'zkSync Era Official',
      url: 'https://mainnet.era.zksync.io',
      provider: 'Matter Labs',
      isPrivateMev: false,
      rateLimit: 'Unlimited / Free',
      latencyMs: 24,
      features: ['Official ZK Sequencer', 'Zero Cost']
    },
    {
      name: 'Automata 1RPC',
      url: 'https://1rpc.io/zksync2-era',
      provider: 'Automata Network',
      isPrivateMev: true,
      rateLimit: 'Free Community',
      latencyMs: 27,
      features: ['Privacy Shield', 'Zero Cost']
    }
  ]
};

export const FREE_MEV_RELAYS = [
  {
    name: 'Flashbots Protect',
    rpcUrl: 'https://rpc.flashbots.net',
    cost: '$0.00 (100% Free)',
    protection: 'Complete Frontrunning & Sandwich Defense',
    description: 'Direct dispatch to top block builders. Transactions that would revert are dropped with zero gas spent!'
  },
  {
    name: 'MEV Blocker (CoW + Agnostic)',
    rpcUrl: 'https://rpc.mevblocker.io',
    cost: '$0.00 (100% Free + Rebates)',
    protection: 'Searcher Backrun Auction',
    description: 'Pays back 90% of searcher backrun profits directly to your address, completely free.'
  },
  {
    name: 'BeaverBuild Direct Relay',
    rpcUrl: 'https://rpc.beaverbuild.org',
    cost: '$0.00 (100% Free)',
    protection: 'Direct Private Block Building',
    description: 'Leading Ethereum and Arbitrum block builder with private orderflow and zero subscription.'
  }
];

export const PRESET_PROFITABLE_DEFAULTS = {
  targetNetworkId: 'arbitrum' as NetworkId,
  minNetProfitEth: 0.012, // Net $38 USD per flash loan
  mevBribeBps: 2500, // 25% miner priority bribe
  profitSplitBps: 2000, // 20% to treasury
  gasReserveMinEth: 0.005, // 0.005 ETH native buffer
  maxSlippagePercent: 0.5, // 0.5% slippage ceiling
  flashLoanContract: '0x3F4bEbC188555239eF6e5593c6A2B3D4468fCe52',
  treasuryAddress: '0x71C836642F3a49350814A0450354F15494498595'
};
