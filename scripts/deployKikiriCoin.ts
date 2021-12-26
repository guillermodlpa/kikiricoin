import { ethers } from 'hardhat';

async function main() {
  const TOKEN_CAP = `${'1000000'}${'000000000000000000'}`; // 1 million + 18 decimals

  const KikiriCoin = await ethers.getContractFactory('KikiriCoin');
  const kikiriCoin = await KikiriCoin.deploy(TOKEN_CAP);

  await kikiriCoin.deployed();

  console.log('KikiriCoin deployed to:', kikiriCoin.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
