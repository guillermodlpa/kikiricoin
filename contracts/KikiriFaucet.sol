// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Faucet to distribute KIKI tokens
/// @author Guillermo de la Puente
/// @notice This faucet enables any account to receive token, as long as it's funded.
contract KikiriFaucet is Ownable {
    event Claim(address indexed to, uint256 amount);
    event Withdraw(address indexed owner, address indexed recipient, uint256 amount);

    uint16 public constant RATE_LIMIT_TIME = 5 minutes;
    uint8 public constant DRIP_AMOUNT = 10;

    IERC20Metadata public immutable token;

    // Simple rate limiting
    mapping(address => uint256) private nextRequestAt;

    constructor(address kikiriCoinAddress) {
        token = IERC20Metadata(kikiriCoinAddress);
    }

    /// @notice You can use this function to claim a fixed amount of tokens. Notice that it's rate limited
    function claim() external {
        require(token.balanceOf(address(this)) > 1, "FaucetError: Empty");
        require(nextRequestAt[msg.sender] < block.timestamp, "FaucetError: Try again later");

        nextRequestAt[msg.sender] = block.timestamp + RATE_LIMIT_TIME;

        uint256 amount = DRIP_AMOUNT * 10**token.decimals();
        token.transfer(msg.sender, amount);
        emit Claim(msg.sender, amount);
    }

    /// @notice Withdraw KIKI token deposited on the faucet. Only the smart contract owner can execute.
    /// @param recipient Address to withdraw token to.
    /// @param amount Quantity of token to withdraw
    function withdrawToken(address recipient, uint256 amount) external onlyOwner {
        require(token.balanceOf(address(this)) >= amount, "FaucetError: Insufficient funds");
        token.transfer(recipient, amount);
        emit Withdraw(msg.sender, recipient, amount);
    }
}
