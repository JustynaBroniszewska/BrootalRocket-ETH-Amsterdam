// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import {IERC4626} from "./interface/IERC4626.sol";

contract Vault is ERC20, IERC4626 {
    IERC20 public asset;
    address public owner;

    constructor(
        IERC20 _asset,
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) {
        asset = _asset;
        owner = msg.sender;
    }

    function totalAssets() public view override returns (uint256) {
        return asset.balanceOf(address(this));
    }

    function deposit(uint256 amount, address receiver) external override returns (uint256 shares) {
        shares = previewDeposit(amount);
        _mint(receiver, shares);
        asset.transferFrom(msg.sender, address(this), amount);
        emit Deposit(msg.sender, receiver, amount, amount);
    }

    function withdraw(uint256 assets, address receiver, address _owner) external override returns (uint256 shares) {
        shares = previewWithdraw(assets);
        emit Withdraw(msg.sender, receiver, _owner, assets, assets);
    }

    function redeem(uint256 shares, address receiver, address _owner) external override returns (uint256 assets) {
        assets = previewRedeem(shares);
        emit Withdraw(msg.sender, receiver, _owner, assets, assets);
    }

    function mint(uint256 shares, address receiver) external override returns (uint256 assets) {
        assets = previewMint(shares);
    }

    function previewDeposit(uint256 assets) public override view returns (uint256 shares) {
        shares = convertToShares(assets);
    }

    function previewMint(uint256 shares) public override view returns (uint256 assets) {
        assets = shares;
    }

    function previewWithdraw(uint256 assets) public override view returns (uint256 shares) {
        shares = assets;
    }

    function previewRedeem(uint256 shares) public override view returns (uint256 assets) {
        assets = shares;
    }

    function convertToShares(uint256 assets) public view override returns (uint256 shares) {
        if (totalSupply() == 0) {
            shares = assets;
        } else {
            shares = assets * totalSupply() / totalAssets();
        }
    }

    function convertToAssets(uint256 shares) public view override returns (uint256) {
        return shares;
    }

    function maxMint(address receiver) external view returns (uint256 maxShares) {
        return type(uint256).max;
    }

    function maxRedeem(address receiver) external view returns (uint256 maxShares) {
        return type(uint256).max;
    }

    function maxWithdraw(address receiver) external view returns (uint256 maxShares) {
        return type(uint256).max;
    }
    
    function maxDeposit(address receiver) external view returns (uint256 maxShares) {
        return type(uint256).max;
    }

    function execute(address target, bytes calldata data) public {
        require(msg.sender == owner, 'Only owner allowed');
        (bool success,) = target.call(data);
        require(success);
    }

    function executeMany(address[] calldata targets, bytes[] calldata data) public {
        require(msg.sender == owner, 'Only owner allowed');
        for(uint256 i = 0; i < targets.length; i++) {
            execute(targets[i], data[i]);
        }
    }
}
