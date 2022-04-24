// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract MockUmaWarrior {
    uint256 public price;

    function requestPrice(bytes32, uint256, bytes memory, uint256) public returns(uint256){
        return 0;
    }

    function setCustomLiveness(bytes32, uint256, bytes memory, uint256) public {}

    function proposePrice(address, bytes32, uint256, bytes memory, uint256) public {}

    function settleAndGetPrice(bytes32, uint256, bytes memory) public returns(uint256){
        return price;
    }

    function setPrice(uint256 newPrice) public {
        price = newPrice;
    }
}