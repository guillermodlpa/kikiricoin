// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KikiriCoin is ERC20Capped, Ownable {
    constructor(uint256 cap) ERC20("KikiriCoin", "KIKI") ERC20Capped(cap) {}

    function issueToken(uint256 amount) public onlyOwner {
        require(amount <= 10 * 10**18, "Amount can't be higher than 10 KIKI");
        _mint(msg.sender, amount);
    }
}
