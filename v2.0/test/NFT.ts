import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers, network } from "hardhat";

describe("NFTContract", function () {
  async function deployNFTFixture() {
    const [owner, auctionOwner, bidder] = await ethers.getSigners();

    const NFTToken = await ethers.getContractFactory("NFTContract");
    const NFTContract = await NFTToken.connect(owner).deploy();
    await NFTContract.mint(owner.address, 1);

    return { NFTContract, owner, auctionOwner, bidder };
  }

  describe("_mint", function () {
    it("Should succeed to mint", async function () {
      const { NFTContract, owner, auctionOwner } = await loadFixture(deployNFTFixture);

      expect(await NFTContract.balanceOf(owner.address)).to.equal(1);
      expect(await NFTContract.ownerOf(1)).to.equal(owner.address);
      expect(await NFTContract.tokenURI(1)).to.equal("");
    });
  });

  describe("transfer", function () {
    it("Should succeed to transfer", async function () {
      const { NFTContract, owner, auctionOwner } = await loadFixture(deployNFTFixture);

      await NFTContract.transferFrom(owner.address, auctionOwner.address, 1);
      expect(await NFTContract.balanceOf(owner.address)).to.equal(0);
      expect(await NFTContract.balanceOf(auctionOwner.address)).to.equal(1);
      expect(await NFTContract.ownerOf(1)).to.equal(auctionOwner.address);
      expect(await NFTContract.tokenURI(1)).to.equal("");
    });
  });

  describe("NFTDutchAuction deployment", function () {
    async function deployNFTDutchAuctionFixture() {
      const { NFTContract, owner, auctionOwner, bidder } = await loadFixture(deployNFTFixture);
      const nftDutchAuctionFactory = await ethers.getContractFactory("NFTDutchAuction");
      const NFTDutchAuction = await nftDutchAuctionFactory.connect(auctionOwner).deploy(
        NFTContract.address,
        1,
        1000,
        10,
        100
      );
      await NFTContract.connect(owner).approve(NFTDutchAuction.address, 1);
      return { NFTContract, owner, auctionOwner, bidder, NFTDutchAuction };
    }

    it("should return current price", async function () {
      const { NFTDutchAuction } = await loadFixture(deployNFTDutchAuctionFixture);
      expect(await NFTDutchAuction.initialPrice()).to.equal(2000);
    });

    it("should NFTDutchAuction get the approval", async function () {
      const { NFTContract, NFTDutchAuction } = await loadFixture(deployNFTDutchAuctionFixture);
      expect(await NFTContract.getApproved(1)).to.equal(NFTDutchAuction.address);
    });

    it("the auction should end and close", async function () {
      const { NFTContract, owner, auctionOwner, bidder, NFTDutchAuction } = await loadFixture(deployNFTDutchAuctionFixture);
      for (let i = 0; i < 10; i++) {
        await network.provider.send("evm_mine");
      }
      await NFTDutchAuction.connect(bidder).bid({ value: 1500 });
      expect(await NFTDutchAuction.connect(auctionOwner).auctionEnd()).to.equal(true);
      expect(await NFTContract.balanceOf(owner.address)).to.equal(0);
      expect(await NFTContract.balanceOf(bidder.address)).to.equal(1);
      expect(await NFTContract.ownerOf(1)).to.equal(bidder.address);
    })
  })
});


