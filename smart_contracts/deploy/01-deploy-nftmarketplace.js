// const { verify } = require("../util/verify");
const { network } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const nftMarketplace = await deploy("NFTMarketplace", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: network.config.waitConfirmations || 1,
    });

    console.log(`NFTMarketplace deployed at ${nftMarketplace.address}`);

    // if (process.env.ETHERSCAN_API_KEY && network.name !== "hardhat") {
    //     console.log("Verifying contract...");
    //     await verify(nftMarketplace.address, []);
    // }
};

module.exports.tags = ["NFTMarketplace"];
