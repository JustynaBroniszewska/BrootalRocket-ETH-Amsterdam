// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {OptimisticOracleInterface} from "./interface/OptimisticOracleInterface.sol";
import {Vault} from "./Vault.sol";

contract VaultFactory {
    OptimisticOracleInterface oracle;

    event VaultCreated(address vault, IERC20 asset, address owner);

    constructor(OptimisticOracleInterface _oracle) {
        oracle = _oracle;
    }

    function createVault(
        IERC20 asset,
        IERC20 collateralAsset, 
        string memory name,
        string memory symbol
    ) public {
        Vault vault = new Vault(asset, msg.sender, collateralAsset, oracle, name, symbol);
        emit VaultCreated(address(vault), asset, msg.sender);
    }
}
