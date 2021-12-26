// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/*
    This faucet enables the distribution of KikiriCoin tokens.
    Owner of the token can distribute tokens to the faucet, that then any user can claim.
 */
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

    function claim() external {
        require(token.balanceOf(address(this)) > 1, "FaucetError: Empty");
        require(nextRequestAt[msg.sender] < block.timestamp, "FaucetError: Try again later");

        nextRequestAt[msg.sender] = block.timestamp + RATE_LIMIT_TIME;

        uint256 amount = DRIP_AMOUNT * 10**token.decimals();
        token.transfer(msg.sender, amount);
        emit Claim(msg.sender, amount);
    }

    function withdrawToken(address _recipient, uint256 _amount) external onlyOwner {
        require(token.balanceOf(address(this)) >= _amount, "FaucetError: Insufficient funds");
        token.transfer(_recipient, _amount);
        emit Withdraw(msg.sender, _recipient, _amount);
    }
}
