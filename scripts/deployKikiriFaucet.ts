// To be called using CLI
// Example: TOKEN_ADDRESS=0x... npx hardhat run ./scripts/deployKikiriFaucet.ts --network mumbai

import { ethers } from 'hardhat';

async function main() {
  const { TOKEN_ADDRESS } = process.env;
  console.log('KikiriCoin token address', TOKEN_ADDRESS);
  if (!TOKEN_ADDRESS) {
    throw new Error('TOKEN_ADDRESS not passed');
  }

  const KikiriFaucet = await ethers.getContractFactory('KikiriFaucet');
  const kikiriFaucet = await KikiriFaucet.deploy(TOKEN_ADDRESS);

  await kikiriFaucet.deployed();

  console.log('KikiriCoin Faucet deployed to:', kikiriFaucet.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
