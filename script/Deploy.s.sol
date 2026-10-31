// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../contracts/EnterpriseFlashLoan.sol";
import "../contracts/CircuitBreaker.sol";
import "../contracts/RiskParameters.sol";
import "../contracts/MultiChainStrategyTuner.sol";

interface Vm {
    function startBroadcast() external;
    function startBroadcast(uint256 privateKey) external;
    function stopBroadcast() external;
    function envUint(string calldata name) external view returns (uint256);
    function envOr(string calldata name, uint256 defaultValue) external view returns (uint256);
    function envOr(string calldata name, string calldata defaultValue) external view returns (string memory);
}

contract Script {
    Vm internal constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));
}

/**
 * @title DeployEnterpriseSystem
 * @notice Multi-chain Foundry deployment script supporting Arbitrum One, Ethereum, Polygon, Optimism, and zkSync Era.
 * Dynamically provisions EnterpriseFlashLoan, CircuitBreaker, RiskParameters, and MultiChainStrategyTuner.
 */
contract DeployEnterpriseSystem is Script {
    struct NetworkConfig {
        address poolAddressesProvider;
        address aavePool;
        address weth;
        string name;
        string explorerUrl;
    }

    struct DeploymentResult {
        address enterpriseFlashLoan;
        address circuitBreaker;
        address riskParameters;
        address strategyTuner;
    }

    function run() external returns (DeploymentResult memory result) {
        uint256 chainId = block.chainid;
        NetworkConfig memory cfg;

        if (chainId == 42161) {
            // Arbitrum One (Primary Target)
            cfg = NetworkConfig({
                poolAddressesProvider: 0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb,
                aavePool: 0x794a61358D6845594F94dc1DB02A252b5b4814aD,
                weth: 0x82aF49447D8a07e3bd95BD0d56f35241523fBab1,
                name: "Arbitrum One",
                explorerUrl: "https://arbiscan.io"
            });
        } else if (chainId == 1) {
            // Ethereum Mainnet
            cfg = NetworkConfig({
                poolAddressesProvider: 0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e,
                aavePool: 0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2,
                weth: 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2,
                name: "Ethereum Mainnet",
                explorerUrl: "https://etherscan.io"
            });
        } else if (chainId == 137) {
            // Polygon PoS
            cfg = NetworkConfig({
                poolAddressesProvider: 0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb,
                aavePool: 0x794a61358D6845594F94dc1DB02A252b5b4814aD,
                weth: 0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619,
                name: "Polygon PoS",
                explorerUrl: "https://polygonscan.com"
            });
        } else if (chainId == 10) {
            // Optimism
            cfg = NetworkConfig({
                poolAddressesProvider: 0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb,
                aavePool: 0x794a61358D6845594F94dc1DB02A252b5b4814aD,
                weth: 0x4200000000000000000000000000000000000006,
                name: "Optimism",
                explorerUrl: "https://optimistic.etherscan.io"
            });
        } else if (chainId == 324) {
            // zkSync Era
            cfg = NetworkConfig({
                poolAddressesProvider: 0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e,
                aavePool: 0x78e30497a3c7527d953c6B1E3541b021A98Ac43c,
                weth: 0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91,
                name: "zkSync Era",
                explorerUrl: "https://explorer.zksync.io"
            });
        } else {
            // Default Arbitrum fork configuration
            cfg = NetworkConfig({
                poolAddressesProvider: 0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb,
                aavePool: 0x794a61358D6845594F94dc1DB02A252b5b4814aD,
                weth: 0x82aF49447D8a07e3bd95BD0d56f35241523fBab1,
                name: "Arbitrum Fork / Custom",
                explorerUrl: "https://arbiscan.io"
            });
        }

        uint256 deployerPrivateKey;
        try vm.envUint("EXECUTION_PRIVATE_KEY") returns (uint256 key) {
            deployerPrivateKey = key;
        } catch {
            try vm.envUint("PRIVATE_KEY") returns (uint256 key2) {
                deployerPrivateKey = key2;
            } catch {
                deployerPrivateKey = 0;
            }
        }

        if (deployerPrivateKey != 0) {
            vm.startBroadcast(deployerPrivateKey);
        } else {
            vm.startBroadcast();
        }

        // 1. Deploy Circuit Breaker
        CircuitBreaker breaker = new CircuitBreaker();
        result.circuitBreaker = address(breaker);

        // 2. Deploy Risk Parameters
        RiskParameters riskParams = new RiskParameters(
            address(breaker),
            50,               // maxSlippageBps: 0.5%
            20,               // minProfitBps: 0.2%
            150,              // maxGasPriceGwei: 150 Gwei
            150 ether,        // maxExposurePerTradeWei: 150 ETH
            2.5 ether         // maxDailyLossWei: 2.5 ETH
        );
        result.riskParameters = address(riskParams);

        // Authorize RiskParameters to trip CircuitBreaker
        breaker.setAuthorizedRiskEngine(address(riskParams), true);

        // 3. Deploy Multi-Chain Strategy Tuner
        MultiChainStrategyTuner tuner = new MultiChainStrategyTuner(msg.sender);
        result.strategyTuner = address(tuner);

        // Pre-register current chain
        tuner.registerNetwork(
            chainId,
            cfg.name,
            cfg.weth,
            cfg.aavePool,
            50,  // 0.5% max slippage
            25,  // 0.25% min profit
            120  // 120 gwei gas ceiling
        );

        // 4. Deploy EnterpriseFlashLoan Engine
        EnterpriseFlashLoan engine = new EnterpriseFlashLoan(cfg.poolAddressesProvider);
        result.enterpriseFlashLoan = address(engine);

        // Link CircuitBreaker into EnterpriseFlashLoan
        engine.setCircuitBreaker(address(breaker));

        vm.stopBroadcast();
    }
}
