const {ethers} = require("hardhat");

async function main() {
  const nftMarketplace = await hre.ethers.getContract("NFTMarketplace");
  const tokenId = 1;
  const price = ethers.utils.parseEther("0.1");

  const tx = await nftMarketplace.buyNFT(tokenId, { value: price });
  await tx.wait();
  console.log(`NFT #${tokenId} bought successfully!`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
