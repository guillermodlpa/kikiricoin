// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KikiriCoin is ERC20, Ownable {
    constructor() ERC20("KikiriCoin", "KIKI") {}

    function issueToken(uint256 amount) public onlyOwner{
        _mint(msg.sender, amount*10**18);
    }
}
