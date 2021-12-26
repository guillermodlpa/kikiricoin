import { ethers } from 'hardhat';

/**
 * Increases the block time and mines. This advances time
 * @see {@link https://ethereum.stackexchange.com/a/92906}
 */
export const increaseTimeAndMine = async (amount: number) => {
  await ethers.provider.send('evm_increaseTime', [amount]);
  await ethers.provider.send('evm_mine', []);
};
