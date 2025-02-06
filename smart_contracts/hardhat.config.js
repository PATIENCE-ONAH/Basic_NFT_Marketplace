// require("@nomiclabs/hardhat-ethers");
// require("dotenv").config();
// require("hardhat-gas-reporter");
// require("solidity-coverage");


// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.28",
//   networks: {
//     hardhat: {
//       chainId: 31337,
//     },  
//     sepolia: {
//       url: process.env.ALCHEMY_API_URL,
//       accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
//       chainId: 11155111
//     },
//   },
//   etherscan: {
//     apiKey: process.env.ETHERSCAN_API_KEY, // Optional for verifying contracts
//   },
//   gasReporter: {
//     enabled: true,
//     currency: "USD",
//     gasPrice: 21,
//    // coinmarketcap: process.env.COINMARKETCAP_API_KEY, 
//   },
// };
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();
require("hardhat-gas-reporter");
require("solidity-coverage");
require('hardhat-deploy');


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      chainId: 31337,
    },  
    sepolia: {
      url: process.env.ALCHEMY_API_URL,
      accounts: process.env.PRIVATE_KEY ? [`0x${process.env.PRIVATE_KEY}`] : [],
      chainId: 11155111,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY, // Optional for verifying contracts
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    //gasPrice: 21,
   // coinmarketcap: process.env.COINMARKETCAP_API_KEY, 
  },
  namedAccounts: {
    deployer: {
      default: 0, // First account in Hardhat
    },
  },
};
