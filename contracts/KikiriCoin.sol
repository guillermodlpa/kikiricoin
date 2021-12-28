// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title ERC20 token developed to learn smart contract development and for fun
/// @author Guillermo de la Puente
/// @notice This contract keeps balances and enables transactions of its token, KIKI
contract KikiriCoin is ERC20Capped, Ownable {
    event Mint(address indexed owner, address indexed recipient, uint256 amount);

    constructor(uint256 cap) ERC20("KikiriCoin", "KIKI") ERC20Capped(cap) {}

    /// @notice Mint new KIKI token
    /// @param recipient The address receiving the new tokens
    /// @param amount The amount of token to mint
    function mint(address recipient, uint256 amount) public onlyOwner {
        _mint(recipient, amount);
        emit Mint(msg.sender, recipient, amount);
    }
}
