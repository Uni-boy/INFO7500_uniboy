import * as dotenv from 'dotenv';

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";

dotenv.config();

const ALCHEMY_API_KEY = "Pg4OFD8wbiph6c6AAtraR4NcN4uKEdk8";

const SEPOLIA_PRIVATE_KEY = "babe322664917e50558526a6619ce92abe809f9b77710aa25a8b52251149ea30";

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  paths: {
    artifacts: './artifacts'
  },
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY]
    }
    // hardhat: {
    //   mining: {
    //     auto: false,
    //     interval: 10000
    //   }
    // },
    // sepolia: {
    //   url: process.env.ROPSTEN_URL || '',
    //   accounts:
    //     process.env.TEST_ETH_ACCOUNT_PRIVATE_KEY !== undefined
    //       ? [process.env.TEST_ETH_ACCOUNT_PRIVATE_KEY]
    //       : []
    // }
  },
  // gasReporter: {
  //   enabled: process.env.REPORT_GAS !== undefined,
  //   currency: 'USD'
  // },
  // etherscan: {
  //   apiKey: process.env.ETHERSCAN_API_KEY
  // }
};

export default config;
