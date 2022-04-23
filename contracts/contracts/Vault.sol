// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import {OptimisticOracleInterface} from "./interface/OptimisticOracleInterface.sol";
import {IERC4626} from "./interface/IERC4626.sol";
import {VaultValuationModule} from "./VaultValuationModule.sol";

contract Vault is VaultValuationModule, ERC20, IERC4626 {
    IERC20 public asset;
    address public owner;
    uint256 private _totalAssets;

    mapping(address => uint256) public depositRequest;
    mapping(address => uint256) public withdrawRequest;

    constructor(
        IERC20 _asset,
        address _owner,
        IERC20 _collateralAsset,
        OptimisticOracleInterface _oracle,
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) VaultValuationModule(_collateralAsset, _oracle) {
        asset = _asset;
        owner = _owner;
    }

    function totalAssets() public view override returns (uint256) {
        if (_totalAssets == 0) {
            return asset.balanceOf(address(this));
        } else {
            return _totalAssets;
        }
    }

    function requestDeposit() external {
        uint256 timestamp = requestTotalValue();
        depositRequest[msg.sender] = timestamp;
    }

    function deposit(uint256 amount, address receiver) external override returns (uint256 shares) {
        _updateTotalAssets(depositRequest[msg.sender]);
        shares = previewDeposit(amount);
        _mint(receiver, shares);
        asset.transferFrom(msg.sender, address(this), amount);
        emit Deposit(msg.sender, receiver, amount, shares);
    }

    function requestWithdraw() external {
        uint256 timestamp = requestTotalValue();
        withdrawRequest[msg.sender] = timestamp;
    }

    function withdraw(
        uint256 assets,
        address receiver,
        address _owner
    ) external override returns (uint256 shares) {
        _updateTotalAssets(withdrawRequest[msg.sender]);
        shares = previewWithdraw(assets);
        _spendAllowance(_owner, msg.sender, assets);
        _burn(receiver, shares);
        asset.transfer(receiver, assets);
        emit Withdraw(msg.sender, receiver, _owner, assets, shares);
    }

    function redeem(
        uint256 shares,
        address receiver,
        address _owner
    ) external override returns (uint256 assets) {
        _updateTotalAssets(withdrawRequest[msg.sender]);
        assets = previewRedeem(shares);
        _spendAllowance(_owner, msg.sender, assets);
        _burn(receiver, shares);
        asset.transfer(receiver, assets);
        emit Withdraw(msg.sender, receiver, _owner, assets, shares);
    }

    function mint(uint256 shares, address receiver) external override returns (uint256 assets) {
        _updateTotalAssets(depositRequest[msg.sender]);
        assets = previewMint(shares);
        _mint(receiver, shares);
        asset.transferFrom(msg.sender, address(this), assets);
        emit Deposit(msg.sender, receiver, assets, shares);
    }

    function previewDeposit(uint256 assets) public view override returns (uint256 shares) {
        shares = convertToShares(assets);
    }

    function previewMint(uint256 shares) public view override returns (uint256 assets) {
        assets = convertToAssets(shares);
    }

    function previewWithdraw(uint256 assets) public view override returns (uint256 shares) {
        shares = convertToShares(assets);
    }

    function previewRedeem(uint256 shares) public view override returns (uint256 assets) {
        assets = convertToAssets(shares);
    }

    function convertToShares(uint256 assets) public view override returns (uint256 shares) {
        if (totalSupply() == 0) {
            shares = assets;
        } else {
            shares = (assets * totalSupply()) / totalAssets();
        }
    }

    function convertToAssets(uint256 shares) public view override returns (uint256 assets) {
        if (totalSupply() == 0) {
            assets = 0;
        } else {
            assets = (shares * totalAssets()) / totalSupply();
        }
    }

    function maxMint(address) external pure returns (uint256 maxShares) {
        return type(uint256).max;
    }

    function maxRedeem(address) external pure returns (uint256 maxShares) {
        return type(uint256).max;
    }

    function maxWithdraw(address) external pure returns (uint256 maxShares) {
        return type(uint256).max;
    }

    function maxDeposit(address) external pure returns (uint256 maxShares) {
        return type(uint256).max;
    }

    function execute(address target, bytes calldata data) public {
        require(msg.sender == owner, "Only owner allowed");
        (bool success, ) = target.call(data);
        require(success);
    }

    function executeMany(address[] calldata targets, bytes[] calldata data) public {
        require(msg.sender == owner, "Only owner allowed");
        for (uint256 i = 0; i < targets.length; i++) {
            execute(targets[i], data[i]);
        }
    }

    function _updateTotalAssets(uint256 timestamp) internal {
        _totalAssets = updateTotalValueAndTimestamp(timestamp);
    }
}
