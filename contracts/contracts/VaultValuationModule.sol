// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import {FinderInterface} from "./interface/FinderInterface.sol";
import {OptimisticOracleInterface} from "./interface/OptimisticOracleInterface.sol";
import {OracleInterfaces} from "./interface/OracleInterfaces.sol";

contract VaultValuationModule {
    FinderInterface finder;
    bytes32 priceIdentifier;
    IERC20 asset;

    uint256 lastTotalValue;
    uint256 lastTotalValueTimestamp;

    constructor(address _asset, address _finder, bytes32 _priceIdentifier) {
        asset = IERC20(_asset);
        finder = FinderInterface(_finder);
        priceIdentifier = _priceIdentifier;
    }

    function requestTotalValue() public returns (uint256) {
        uint256 currentTime = block.timestamp;
        _requestOraclePrice(currentTime);
        return currentTime;
    }

    function updateTotalValueAndTimestamp(uint256 requestTimestamp) public returns (uint256, uint256) {
        uint256 totalValue = _getOraclePrice(requestTimestamp);

        if(requestTimestamp > lastTotalValueTimestamp) {
            lastTotalValue = totalValue;
            lastTotalValueTimestamp;
        }

        return (totalValue, requestTimestamp);
    }

    function getLastTotalValueAndTimestamp() public view returns (uint256, uint256) {
        return (lastTotalValue, lastTotalValueTimestamp);
    }

    //////////////////////////
    /// UMA specific stuff ///
    //////////////////////////

    function _requestOraclePrice(uint256 requestedTime) internal {
        OptimisticOracleInterface oracle = _getOptimisticOracle();
        oracle.requestPrice(priceIdentifier, requestedTime, "", asset, 0);
    }

    function _getOraclePrice(uint256 requestTimestamp) internal returns (uint256) {
        OptimisticOracleInterface oracle = _getOptimisticOracle();
        require(
            oracle.hasPrice(address(this), priceIdentifier, requestTimestamp, ""),
            "Unresolved oracle price"
        );
        int256 oraclePrice = oracle.settleAndGetPrice(priceIdentifier, requestTimestamp, "");

        if (oraclePrice < 0) {
            oraclePrice = 0;
        }
        return uint256(oraclePrice);
    }

    function _getOptimisticOracle() internal view returns (OptimisticOracleInterface) {
        return OptimisticOracleInterface(finder.getImplementationAddress(OracleInterfaces.OptimisticOracle));
    }
}