# Enterprise Multi-Chain Flash Loan Arbitrage Master Engine (v1.1.0 Final)

Autonomous, institutional-grade Flash Loan Arbitrage & MEV Execution Terminal targeting **Arbitrum One** (Primary), Ethereum Mainnet, Polygon PoS, Optimism, and zkSync Era. Powered by Aave V3 flash loan liquidity, polymorphic multi-hop DEX router execution (Uniswap V3, Balancer V2, Camelot, Sushiswap, Curve), dynamic miner bribes (`block.coinbase`), and Flashbots Protect private RPC relays.

---

## 1. Architectural Highlights

- **Smart Contract Core (`contracts/EnterpriseFlashLoan.sol`)**:
  - Inherits `IFlashLoanSimpleReceiver`, OpenZeppelin `Ownable`, and `ReentrancyGuard`.
  - Zero-Loss Guarantee: enforces strict runtime check `currentBalance >= totalOwed + minNetProfit`. If any swap yields less than required, the entire transaction reverts cleanly.
  - Dynamic Builder Bribes: pays `mevBribeBps` directly to `block.coinbase` for priority transaction bundling and frontrunning protection.
  - Polymorphic DEX Execution: dynamic array of arbitrary `Call { address target; address approveToken; uint256 approveAmount; bytes callData; }`.
- **Autonomous Node.js Daemon (`daemon.js`)**:
  - Multi-RPC WebSocket failover with automatic fallback.
  - Mandatory pre-flight `staticCall` simulation before broadcasting any transaction.
  - EIP-1559 dynamic base fee + priority fee estimation.
  - Private MEV relay integration (Flashbots Protect).
  - Health check HTTP server on port 8080 with Prometheus `/metrics` export.
- **Terminal UI (`src/App.tsx`)**:
  - Dual Mode: Simple 1-Click Execution & Pro MEV Multi-Hop Route Builder.
  - Real-time mempool transaction stream with threat ratings and latency benchmarks.
  - Chainlink Price Feed oracle drift detection (>2.0% auto-recalculates `minAmountOut`).
  - Slide-out Side Drawers for Network Matrix, Strategy Tuner, and Cold Storage Profit Splitter.
  - Realized cumulative profit charts via Recharts.
  - Web Audio API zero-dependency sound synthesis.

---

## 2. Canonical Mainnet Addresses (Arbitrum One)

| Protocol | Address |
| :--- | :--- |
| **Aave V3 Pool** | `0x794a61358D6845594F94dc1DB02A252b5b4814aD` |
| **Aave V3 Addresses Provider** | `0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb` |
| **WETH** | `0x82aF49447D8a07e3bd95BD0d56f35241523fBab1` |
| **USDC (Native)** | `0xaf88d065e77c8cC2239327C5EDb3A432268e5831` |
| **Uniswap V3 SwapRouter** | `0xE592427A0AEce92De3Edee1F18E0157C05861564` |
| **Balancer V2 Vault** | `0xBA12222222228d8Ba445958a75a0704d566BF2C8` |
| **Camelot DEX Router** | `0xc873fEcbd354f5A56E00E710B90EF4201db2448d` |

---

## 3. Arbitrum One Mainnet Launch Commands

### A. Deploy Smart Contract with Foundry

```bash
# 1. Export deployment credentials
export ARBITRUM_RPC_URL="https://arb1.arbitrum.io/rpc"
export PRIVATE_KEY="0xYOUR_FUNDED_PRIVATE_KEY"
export ARBISCAN_API_KEY="YOUR_ARBISCAN_API_KEY"

# 2. Run automated bash deployment script
chmod +x deploy.sh
./deploy.sh
```

Or execute via Foundry directly:

```bash
forge script script/Deploy.s.sol:DeployEnterpriseFlashLoan \
    --rpc-url $ARBITRUM_RPC_URL \
    --broadcast \
    --verify \
    --etherscan-api-key $ARBISCAN_API_KEY \
    -vvvv
```

### B. Launch Autonomous Daemon in Production

```bash
# 1. Configure environment
cp .env.example .env
nano .env # Paste your contract address and funded wallet

# 2. Start daemon with Docker Compose
docker compose up -d --build

# 3. Stream real-time logs
docker logs -f mev-flashloan-daemon

# 4. Check health endpoint
curl http://localhost:8080/health
```

### C. Run Frontend Terminal

```bash
npm install
npm run build
npm run dev
```

---

## 4. Safety & Circuit Breakers

1. **Pre-Flight Static Call**: Every opportunity is pre-simulated on-chain using `eth_call`. If the simulated balance is less than `totalOwed + minNetProfit`, execution aborts with zero gas cost.
2. **Gas Reserve Protection**: The daemon will halt immediately if the wallet native gas balance falls below `GAS_RESERVE_MIN_ETH` (default `0.005 ETH`).
3. **Emergency Circuit Breaker**: The **CIRCUIT STOP** button in the header instantly terminates all background autopilot tasks and clears the execution pipeline.
