// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import {IERC4626} from "./interface/IERC4626.sol";

contract ERC4626 is ERC20, IERC4626 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}
}
