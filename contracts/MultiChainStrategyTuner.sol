// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MultiChainStrategyTuner
 * @notice Enterprise Multi-Chain Arbitrage Strategy Parameter Configuration and Tuning Hub
 * @dev Manages per-chain operational parameters, router registries, pool exclusions, and dynamic performance adjustments.
 */
contract MultiChainStrategyTuner {
    // Custom Errors
    error Unauthorized();
    error NetworkAlreadyRegistered(uint256 chainId);
    error NetworkNotRegistered(uint256 chainId);
    error InvalidAddress();
    error InvalidParameters();

    // Events
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event OracleUpdated(address indexed previousOracle, address indexed newOracle);
    event NetworkRegistered(uint256 indexed chainId, string name, address weth, address aavePool);
    event StrategyUpdated(
        uint256 indexed chainId,
        bytes32 indexed strategyId,
        uint256 maxSlippageBps,
        uint256 minProfitBps,
        uint256 gasPriceCeilingGwei,
        bool active
    );
    event PoolExclusionUpdated(uint256 indexed chainId, address indexed pool, bool excluded);
    event PerformanceTuningApplied(
        uint256 indexed chainId,
        bytes32 indexed strategyId,
        uint256 newSlippageBps,
        uint256 newMinProfitBps,
        uint256 winRateBps
    );

    struct ChainStrategyParams {
        string name;
        address weth;
        address aavePool;
        uint256 maxSlippageBps; // e.g. 50 = 0.5%
        uint256 minProfitBps;   // e.g. 30 = 0.3%
        uint256 gasPriceCeilingGwei;
        bool isRegistered;
        bool active;
    }

    struct PerformanceMetrics {
        uint256 totalRuns;
        uint256 successfulRuns;
        uint256 totalProfitWei;
        uint256 lastUpdatedTimestamp;
    }

    address public owner;
    address public performanceOracle;

    // chainId => ChainStrategyParams
    mapping(uint256 => ChainStrategyParams) private _chainParams;
    uint256[] private _registeredChainIds;

    // chainId => poolAddress => isExcluded
    mapping(uint256 => mapping(address => bool)) private _excludedPools;

    // chainId => strategyId => PerformanceMetrics
    mapping(uint256 => mapping(bytes32 => PerformanceMetrics)) private _performanceData;

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    modifier onlyOwnerOrOracle() {
        if (msg.sender != owner && msg.sender != performanceOracle) revert Unauthorized();
        _;
    }

    constructor(address _initialOracle) {
        owner = msg.sender;
        performanceOracle = _initialOracle;
        emit OwnershipTransferred(address(0), msg.sender);
        if (_initialOracle != address(0)) {
            emit OracleUpdated(address(0), _initialOracle);
        }
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert InvalidAddress();
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function setPerformanceOracle(address newOracle) external onlyOwner {
        emit OracleUpdated(performanceOracle, newOracle);
        performanceOracle = newOracle;
    }

    /**
     * @notice Registers a new blockchain network with baseline parameters
     */
    function registerNetwork(
        uint256 chainId,
        string calldata name,
        address weth,
        address aavePool,
        uint256 maxSlippageBps,
        uint256 minProfitBps,
        uint256 gasPriceCeilingGwei
    ) external onlyOwner {
        if (_chainParams[chainId].isRegistered) revert NetworkAlreadyRegistered(chainId);
        if (weth == address(0) || aavePool == address(0)) revert InvalidAddress();

        _chainParams[chainId] = ChainStrategyParams({
            name: name,
            weth: weth,
            aavePool: aavePool,
            maxSlippageBps: maxSlippageBps,
            minProfitBps: minProfitBps,
            gasPriceCeilingGwei: gasPriceCeilingGwei,
            isRegistered: true,
            active: true
        });

        _registeredChainIds.push(chainId);
        emit NetworkRegistered(chainId, name, weth, aavePool);
    }

    /**
     * @notice Updates execution strategy thresholds for a given network
     */
    function updateNetworkStrategy(
        uint256 chainId,
        uint256 maxSlippageBps,
        uint256 minProfitBps,
        uint256 gasPriceCeilingGwei,
        bool active
    ) external onlyOwner {
        if (!_chainParams[chainId].isRegistered) revert NetworkNotRegistered(chainId);

        ChainStrategyParams storage params = _chainParams[chainId];
        params.maxSlippageBps = maxSlippageBps;
        params.minProfitBps = minProfitBps;
        params.gasPriceCeilingGwei = gasPriceCeilingGwei;
        params.active = active;

        bytes32 globalStrategyId = keccak256(abi.encodePacked("CHAIN_STRATEGY", chainId));
        emit StrategyUpdated(chainId, globalStrategyId, maxSlippageBps, minProfitBps, gasPriceCeilingGwei, active);
    }

    /**
     * @notice Exclude or re-include specific illiquid, toxic, or attacked liquidity pools
     */
    function setPoolExclusion(
        uint256 chainId,
        address pool,
        bool excluded
    ) external onlyOwner {
        if (pool == address(0)) revert InvalidAddress();
        _excludedPools[chainId][pool] = excluded;
        emit PoolExclusionUpdated(chainId, pool, excluded);
    }

    /**
     * @notice Dynamically tunes strategy thresholds based on ingested off-chain performance data
     */
    function recordPerformanceAndTune(
        uint256 chainId,
        bytes32 strategyId,
        bool success,
        uint256 profitWei
    ) external onlyOwnerOrOracle {
        if (!_chainParams[chainId].isRegistered) revert NetworkNotRegistered(chainId);

        PerformanceMetrics storage metrics = _performanceData[chainId][strategyId];
        metrics.totalRuns += 1;
        if (success) {
            metrics.successfulRuns += 1;
            metrics.totalProfitWei += profitWei;
        }
        metrics.lastUpdatedTimestamp = block.timestamp;

        // Auto-tune if sufficient sample size
        if (metrics.totalRuns >= 10) {
            uint256 winRateBps = (metrics.successfulRuns * 10000) / metrics.totalRuns;
            ChainStrategyParams storage params = _chainParams[chainId];

            if (winRateBps < 7000) {
                // If win rate below 70%, tighten slippage tolerance and increase min profit threshold
                params.maxSlippageBps = params.maxSlippageBps > 15 ? params.maxSlippageBps - 5 : 10;
                params.minProfitBps += 10;
            } else if (winRateBps > 9200) {
                // If win rate is exceptionally high (>92%), allow slight slippage relaxation for higher throughput
                if (params.maxSlippageBps < 100) {
                    params.maxSlippageBps += 5;
                }
            }

            emit PerformanceTuningApplied(chainId, strategyId, params.maxSlippageBps, params.minProfitBps, winRateBps);
        }
    }

    // View Functions
    function getNetworkParams(uint256 chainId) external view returns (ChainStrategyParams memory) {
        if (!_chainParams[chainId].isRegistered) revert NetworkNotRegistered(chainId);
        return _chainParams[chainId];
    }

    function isPoolExcluded(uint256 chainId, address pool) external view returns (bool) {
        return _excludedPools[chainId][pool];
    }

    function getRegisteredChains() external view returns (uint256[] memory) {
        return _registeredChainIds;
    }

    function getPerformanceMetrics(uint256 chainId, bytes32 strategyId) external view returns (PerformanceMetrics memory) {
        return _performanceData[chainId][strategyId];
    }
}
