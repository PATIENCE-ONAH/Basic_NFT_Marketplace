const {ethers} = require("hardhat");

async function main() {
  const nftMarketplace = await hre.ethers.getContract("NFTMarketplace");
  const tokenId = 1;
  const price = ethers.utils.parseEther("0.1");

  const tx = await nftMarketplace.listNFT(tokenId, price);
  await tx.wait();
  console.log(`NFT #${tokenId} listed for sale at ${price} ETH!`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
