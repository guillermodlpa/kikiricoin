import * as dotenv from 'dotenv';

import { HardhatUserConfig, task } from 'hardhat/config';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';

dotenv.config();

task('total-supply', 'Prints the total supply of KikiriCoin')
  .addParam('contract', "The contract's address")
  .setAction(async (taskArgs, { ethers }) => {
    const KikiriCoin = await ethers.getContractFactory('KikiriCoin');
    const kikiriCoin = await KikiriCoin.attach(taskArgs.contract);
    const totalSupply = await kikiriCoin.totalSupply();
    console.log(totalSupply.toString(), 'KIKI wei');
  });

task('balance-of', 'Prints the KIKI wei balance of the given address')
  .addParam('contract', "The contract's address")
  .addParam('account', "The account's address")
  .setAction(async (taskArgs, { ethers }) => {
    const KikiriCoin = await ethers.getContractFactory('KikiriCoin');
    const kikiriCoin = await KikiriCoin.attach(taskArgs.contract);
    const balance = await kikiriCoin.balanceOf(taskArgs.account);
    console.log(balance.toString(), 'KIKI wei');
  });

task('mint', 'Issues KIKI token to the owner of the smart contract')
  .addParam('contract', "The contract's address")
  .addParam('amount', 'The amount of KIKI wei to issue')
  .setAction(async (taskArgs, { ethers }) => {
    const [owner] = await ethers.getSigners();

    const KikiriCoin = await ethers.getContractFactory('KikiriCoin');
    const kikiriCoin = await KikiriCoin.attach(taskArgs.contract);
    await kikiriCoin.mint(owner.address, taskArgs.amount);
    console.log(`Done. Issued ${taskArgs.amount} wei to ${owner.address}`);
  });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: '0.8.4',
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL || '',
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    mumbai: {
      url: '',
    },
    // localhost network spinned up with npx hardhat node.
    // Using the URL and one of the private keys given by that command
    localhost: {
      url: process.env.LOCALHOST_NETWORK_URL || '',
      accounts: process.env.LOCALHOST_PRIVATE_KEY !== undefined ? [process.env.LOCALHOST_PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
