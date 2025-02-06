const {ethers} = require("hardhat");

async function main() {
  const nftMarketplace = await ethers.getContract("NFTMarketplace");
  const tx = await nftMarketplace.mintNFT();
  await tx.wait();
  console.log("NFT Minted!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
