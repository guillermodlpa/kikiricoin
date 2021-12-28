import * as dotenv from 'dotenv';

import { HardhatUserConfig } from 'hardhat/config';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';

import './tasks.config';

dotenv.config();

const config: HardhatUserConfig = {
  solidity: '0.8.4',
  networks: {
    // ropsten: {
    //   url: process.env.ROPSTEN_URL || '',
    //   accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    // },
    // Mumbai is Polygon's test network
    mumbai: {
      url: process.env.POLYGON_MUMBAI_NETWORK_URL || '',
      accounts: process.env.OWNER_ACCOUNT_PRIVATE_KEY !== undefined ? [process.env.OWNER_ACCOUNT_PRIVATE_KEY] : [],
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
