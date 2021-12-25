// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KikiriCoin is ERC20Capped, Ownable {
    event Mint(address indexed owner, address indexed recipient, uint256 amount);

    constructor(uint256 cap) ERC20("KikiriCoin", "KIKI") ERC20Capped(cap) {}

    function issueToken(address recipient, uint256 amount) public onlyOwner {
        _mint(recipient, amount);
        emit Mint(msg.sender, recipient, amount);
    }
}
