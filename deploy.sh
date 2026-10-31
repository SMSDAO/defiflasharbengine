#!/usr/bin/env bash
set -euo pipefail

echo "=================================================================="
echo "  Deploying EnterpriseFlashLoan Engine to Arbitrum One Mainnet   "
echo "=================================================================="

# Check prerequisites
if ! command -v forge &> /dev/null; then
    echo "Foundry 'forge' not found. Installing foundryup..."
    curl -L https://foundry.paradigm.xyz | bash
    export PATH="$HOME/.foundry/bin:$PATH"
    foundryup
fi

# Load environment
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

RPC_URL="${ARBITRUM_RPC_URL:-https://arb1.arbitrum.io/rpc}"

if [ -z "${PRIVATE_KEY:-}" ]; then
    echo "ERROR: PRIVATE_KEY is not defined in .env"
    exit 1
fi

echo "Target RPC: $RPC_URL"
echo "Running Foundry Deployment Script (script/Deploy.s.sol)..."

forge script script/Deploy.s.sol:DeployEnterpriseFlashLoan \
    --rpc-url "$RPC_URL" \
    --broadcast \
    --verify \
    --etherscan-api-key "${ARBISCAN_API_KEY:-}" \
    -vvvv

echo "=================================================================="
echo "Deployment Complete! Updating .env and daemon with contract address."
echo "=================================================================="
