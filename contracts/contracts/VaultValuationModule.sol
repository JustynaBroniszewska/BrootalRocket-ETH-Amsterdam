// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import {OptimisticOracleInterface} from "./interface/OptimisticOracleInterface.sol";
import {OracleInterfaces} from "./interface/OracleInterfaces.sol";

contract VaultValuationModule {
    uint256 public constant REQUEST_LIVENESS = 30;
    bytes32 public constant PRICE_IDENTIFIER = 0x646567656e5f68656176656e5f74657374000000000000000000000000000000;

    OptimisticOracleInterface oracle;
    IERC20 collateralAsset;

    uint256 lastTotalValue;
    uint256 lastTotalValueTimestamp;

    event ValuationRequested(bytes32 identifier, uint256 timestamp);

    constructor(IERC20 _collateralAsset, OptimisticOracleInterface _oracle) {
        collateralAsset = _collateralAsset;
        oracle = _oracle;
    }

    function requestTotalValue(int256 proposedPrice) public returns (uint256) {
        uint256 currentTime = block.timestamp;
        _requestOraclePrice(currentTime, proposedPrice);
        emit ValuationRequested(PRICE_IDENTIFIER, currentTime);
        return currentTime;
    }

    function updateTotalValueAndTimestamp(uint256 requestTimestamp) public returns (uint256) {
        uint256 totalValue = _getOraclePrice(requestTimestamp);

        if(requestTimestamp > lastTotalValueTimestamp) {
            lastTotalValue = totalValue;
            lastTotalValueTimestamp;
        }

        return totalValue;
    }

    function getLastTotalValueAndTimestamp() public view returns (uint256, uint256) {
        return (lastTotalValue, lastTotalValueTimestamp);
    }

    //////////////////////////
    /// UMA specific stuff ///
    //////////////////////////

    function _requestOraclePrice(uint256 requestedTime, int256 proposedPrice) internal {
        oracle.requestPrice(PRICE_IDENTIFIER, requestedTime, "", collateralAsset, 0);
        oracle.setCustomLiveness(PRICE_IDENTIFIER, requestedTime, "", REQUEST_LIVENESS);
        oracle.proposePrice(address(this), PRICE_IDENTIFIER, requestedTime, "", proposedPrice);
    }

    function _getOraclePrice(uint256 requestTimestamp) internal returns (uint256) {
        require(
            hasPrice(requestTimestamp),
            "Unresolved oracle price"
        );
        int256 oraclePrice = oracle.settleAndGetPrice(PRICE_IDENTIFIER, requestTimestamp, "");

        if (oraclePrice < 0) {
            oraclePrice = 0;
        }
        return uint256(oraclePrice);
    }

    function hasPrice(uint256 requestTimestamp) public view returns (bool){
        return oracle.hasPrice(address(this), PRICE_IDENTIFIER, requestTimestamp, "");
    }

    function priceProposed(
        bytes32,
        uint256,
        bytes memory
    ) external {}
}