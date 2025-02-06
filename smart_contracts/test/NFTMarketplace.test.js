const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarketplace", function () {
  let NFTMarketplace, nftMarketplace, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    nftMarketplace = await NFTMarketplace.deploy();
    await nftMarketplace.deployed();
  });

  it("Should mint an NFT", async function () {
    await nftMarketplace.connect(addr1).mintNFT();
    expect(await nftMarketplace.tokenCount()).to.equal(1);
    expect(await nftMarketplace.ownerOf(1)).to.equal(addr1.address);
  });

  it("Should list an NFT for sale", async function () {
    await nftMarketplace.connect(addr1).mintNFT();
    await nftMarketplace.connect(addr1).listNFT(1, ethers.utils.parseEther("1"));
    expect(await nftMarketplace.tokenPrices(1)).to.equal(ethers.utils.parseEther("1"));
  });

  it("Should allow buying of NFT", async function () {
    await nftMarketplace.connect(addr1).mintNFT();
    await nftMarketplace.connect(addr1).listNFT(1, ethers.utils.parseEther("1"));

    await nftMarketplace.connect(addr2).buyNFT(1, { value: ethers.utils.parseEther("1") });
    expect(await nftMarketplace.ownerOf(1)).to.equal(addr2.address);
    expect(await nftMarketplace.tokenPrices(1)).to.equal(0);
  });
});
