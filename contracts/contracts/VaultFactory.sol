// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Vault} from "./Vault.sol";

contract VaultFactory {
    event VaultCreated(address vault, IERC20 asset, address owner);

    function createVault(
        IERC20 asset,
        string memory name,
        string memory symbol
    ) public {
        Vault vault = new Vault(asset, msg.sender, name, symbol);
        emit VaultCreated(address(vault), asset, msg.sender);
    }
}
