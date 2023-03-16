import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";

const config: HardhatUserConfig = {
  // networks: {
  //   hardhat: {
  //     accounts: [
  //       {
  //         privateKey: "0x0123456789012345678901234567890123456789012345678901234567890123",
  //         balance: "2000"
  //       },
  //       {
  //         privateKey: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd",
  //         balance: "5000"
  //       },
  //     ]
  //   }
  // },
  solidity: "0.8.18",
};

export default config;
