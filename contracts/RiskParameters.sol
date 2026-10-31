// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ICircuitBreaker {
    function tripCircuitBreaker(string calldata reason) external;
    function isExecutionAllowed() external view returns (bool allowed, string memory reason);
}

/**
 * @title RiskParameters
 * @notice Enterprise Risk Policy & Automated Threshold Enforcement Engine
 * @dev Validates exposure limits, gas ceilings, maximum slippage, and auto-trips CircuitBreaker.
 */
contract RiskParameters {
    error Unauthorized();
    error InvalidAddress();
    error RiskThresholdBreached(string reason);

    event RiskThresholdsUpdated(
        uint256 maxSlippageBps,
        uint256 minProfitBps,
        uint256 maxGasPriceGwei,
        uint256 maxExposurePerTradeWei,
        uint256 maxDailyLossWei
    );
    event LossRecorded(uint256 lossWei, uint256 currentDailyLossWei, uint256 timestamp);
    event CircuitBreakerLinked(address indexed breaker);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    address public owner;
    ICircuitBreaker public circuitBreaker;

    uint256 public maxSlippageBps;           // e.g. 50 = 0.5%
    uint256 public minProfitBps;             // e.g. 20 = 0.2%
    uint256 public maxGasPriceGwei;          // e.g. 150 gwei ceiling
    uint256 public maxExposurePerTradeWei;   // e.g. 100 ether max per flash loan
    uint256 public maxDailyLossWei;          // e.g. 2 ether max cumulative loss per 24h

    // Rolling 24-hour loss tracker
    uint256 public currentDayTimestamp;
    uint256 public currentDailyLossWei;

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    constructor(
        address _circuitBreaker,
        uint256 _maxSlippageBps,
        uint256 _minProfitBps,
        uint256 _maxGasPriceGwei,
        uint256 _maxExposurePerTradeWei,
        uint256 _maxDailyLossWei
    ) {
        owner = msg.sender;
        if (_circuitBreaker != address(0)) {
            circuitBreaker = ICircuitBreaker(_circuitBreaker);
            emit CircuitBreakerLinked(_circuitBreaker);
        }
        maxSlippageBps = _maxSlippageBps;
        minProfitBps = _minProfitBps;
        maxGasPriceGwei = _maxGasPriceGwei;
        maxExposurePerTradeWei = _maxExposurePerTradeWei;
        maxDailyLossWei = _maxDailyLossWei;
        currentDayTimestamp = block.timestamp;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert InvalidAddress();
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function setCircuitBreaker(address _circuitBreaker) external onlyOwner {
        if (_circuitBreaker == address(0)) revert InvalidAddress();
        circuitBreaker = ICircuitBreaker(_circuitBreaker);
        emit CircuitBreakerLinked(_circuitBreaker);
    }

    function updateRiskThresholds(
        uint256 _maxSlippageBps,
        uint256 _minProfitBps,
        uint256 _maxGasPriceGwei,
        uint256 _maxExposurePerTradeWei,
        uint256 _maxDailyLossWei
    ) external onlyOwner {
        maxSlippageBps = _maxSlippageBps;
        minProfitBps = _minProfitBps;
        maxGasPriceGwei = _maxGasPriceGwei;
        maxExposurePerTradeWei = _maxExposurePerTradeWei;
        maxDailyLossWei = _maxDailyLossWei;

        emit RiskThresholdsUpdated(
            _maxSlippageBps,
            _minProfitBps,
            _maxGasPriceGwei,
            _maxExposurePerTradeWei,
            _maxDailyLossWei
        );
    }

    /**
     * @notice Evaluates trade parameters before execution. If safe, returns true; otherwise trips circuit breaker.
     */
    function validateTradeRisk(
        uint256 tradeAmountWei,
        uint256 gasPriceGwei,
        uint256 slippageBps
    ) external returns (bool isSafe, string memory reason) {
        // 1. Exposure limit check
        if (tradeAmountWei > maxExposurePerTradeWei) {
            _tripBreaker("Trade exposure exceeds max per-trade ceiling");
            return (false, "Trade exposure exceeds limit");
        }

        // 2. Gas price ceiling check
        if (gasPriceGwei > maxGasPriceGwei) {
            _tripBreaker("Gas price exceeds maximum ceiling threshold");
            return (false, "Gas price exceeds limit");
        }

        // 3. Slippage check
        if (slippageBps > maxSlippageBps) {
            _tripBreaker("Route slippage exceeds allowed risk tolerance");
            return (false, "Slippage exceeds limit");
        }

        // 4. Daily loss check
        _refreshDailyWindow();
        if (currentDailyLossWei >= maxDailyLossWei) {
            _tripBreaker("24h maximum cumulative drawdown breached");
            return (false, "Daily loss limit breached");
        }

        return (true, "RISK_APPROVED");
    }

    /**
     * @notice Record a trade loss to enforce 24-hour drawdown protection
     */
    function recordLoss(uint256 lossWei) external onlyOwner {
        _refreshDailyWindow();
        currentDailyLossWei += lossWei;
        emit LossRecorded(lossWei, currentDailyLossWei, block.timestamp);

        if (currentDailyLossWei >= maxDailyLossWei) {
            _tripBreaker("24h maximum loss threshold reached");
        }
    }

    function _tripBreaker(string memory reason) internal {
        if (address(circuitBreaker) != address(0)) {
            circuitBreaker.tripCircuitBreaker(reason);
        }
    }

    function _refreshDailyWindow() internal {
        if (block.timestamp >= currentDayTimestamp + 1 days) {
            currentDayTimestamp = block.timestamp;
            currentDailyLossWei = 0;
        }
    }

    function getRiskSummary() external view returns (
        uint256 _maxSlippageBps,
        uint256 _minProfitBps,
        uint256 _maxGasPriceGwei,
        uint256 _maxExposurePerTradeWei,
        uint256 _maxDailyLossWei,
        uint256 _currentDailyLossWei,
        bool _breakerOperational
    ) {
        bool breakerAllowed = true;
        if (address(circuitBreaker) != address(0)) {
            (breakerAllowed, ) = circuitBreaker.isExecutionAllowed();
        }
        return (
            maxSlippageBps,
            minProfitBps,
            maxGasPriceGwei,
            maxExposurePerTradeWei,
            maxDailyLossWei,
            currentDailyLossWei,
            breakerAllowed
        );
    }
}
