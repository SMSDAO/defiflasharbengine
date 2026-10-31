// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CircuitBreaker
 * @notice Enterprise Automated and Manual Circuit Breaker Protection System
 * @dev Halts Flash Loan Arbitrage execution upon risk threshold breach, high slippage, or manual operator override.
 */
contract CircuitBreaker {
    // Custom Errors
    error Unauthorized();
    error CircuitAlreadyTripped();
    error CircuitNotTripped();
    error InvalidAddress();

    // Events
    event CircuitBreakerTripped(address indexed triggerer, string reason, uint256 timestamp);
    event CircuitBreakerReset(address indexed resetter, uint256 timestamp);
    event EmergencyHaltToggled(bool halted, address operator);
    event AuthorizedTriggerUpdated(address indexed target, bool authorized);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    address public owner;
    bool public isTripped;
    bool public emergencyHalt;
    string public tripReason;
    uint256 public trippedAtTimestamp;
    uint256 public tripCount;

    // Authorized risk modules that can automatically trip breaker
    mapping(address => bool) public authorizedRiskEngines;

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    modifier onlyAuthorized() {
        if (msg.sender != owner && !authorizedRiskEngines[msg.sender]) revert Unauthorized();
        _;
    }

    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert InvalidAddress();
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function setAuthorizedRiskEngine(address engine, bool authorized) external onlyOwner {
        if (engine == address(0)) revert InvalidAddress();
        authorizedRiskEngines[engine] = authorized;
        emit AuthorizedTriggerUpdated(engine, authorized);
    }

    /**
     * @notice Trips circuit breaker, immediately blocking subsequent flash loans
     */
    function tripCircuitBreaker(string calldata reason) external onlyAuthorized {
        if (isTripped) revert CircuitAlreadyTripped();
        isTripped = true;
        tripReason = reason;
        trippedAtTimestamp = block.timestamp;
        tripCount += 1;
        emit CircuitBreakerTripped(msg.sender, reason, block.timestamp);
    }

    /**
     * @notice Resets circuit breaker back to operational state after operator review
     */
    function resetCircuitBreaker() external onlyOwner {
        if (!isTripped) revert CircuitNotTripped();
        isTripped = false;
        tripReason = "";
        emit CircuitBreakerReset(msg.sender, block.timestamp);
    }

    /**
     * @notice Emergency manual operator override (master switch)
     */
    function setEmergencyHalt(bool halt) external onlyOwner {
        emergencyHalt = halt;
        emit EmergencyHaltToggled(halt, msg.sender);
    }

    /**
     * @notice Read method checked by Flash Loan receiver before executing trades
     */
    function isExecutionAllowed() external view returns (bool allowed, string memory reason) {
        if (emergencyHalt) {
            return (false, "Emergency halt engaged by operator");
        }
        if (isTripped) {
            return (false, tripReason);
        }
        return (true, "OK");
    }

    function getMetrics() external view returns (
        bool _isTripped,
        bool _emergencyHalt,
        string memory _tripReason,
        uint256 _trippedAtTimestamp,
        uint256 _tripCount
    ) {
        return (isTripped, emergencyHalt, tripReason, trippedAtTimestamp, tripCount);
    }
}
