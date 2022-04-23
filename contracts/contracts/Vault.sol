// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import {IERC4626} from "./interface/IERC4626.sol";

contract Vault is ERC20, IERC4626 {
    IERC20 public asset;

    constructor(
        IERC20 _asset,
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) {
        asset = _asset;
    }

    function totalAssets() public override view returns (uint256) {
        return asset.balanceOf(address(this));
    }

    function deposit(uint256 amount, address receiver) external override returns (uint256 shares) {
        shares = amount;
        emit Deposit(msg.sender, receiver, amount, amount);
    }

    function convertToShares(uint256 amount) public override view returns (uint256) {
        return amount;
    }
}
