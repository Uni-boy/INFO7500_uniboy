import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("BasicDutchAuction", function () {
  async function deployDutchAuctionFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const BDAToken = await ethers.getContractFactory("BasicDutchAuction");
    const Token = await BDAToken.connect(owner).deploy(
      0, // reservePrice
      10, // numBlocksAuctionOpen
      1 // offerPriceDecrement
    );

    return { Token, owner, addr1, addr2};
  }

  describe("bid", function () {
    it("reject a low bid", async function () {
      const {Token, owner, addr1} = await loadFixture(deployDutchAuctionFixture);
      
      // block 1
      // expect(await Token.bid({value: 9})).to.be.revertedWith("Bid is lower than currentPrice");
      // expect(await Token.bid(10)).to.be.revertedWith("Bid is lower than currentPrice"); 
      await Token.bid({value: 10});
      expect(await Token.stopped()).to.equal(true);
    });
  });

  // describe("AuctionToken Deployment", function () {
  //   it("should transfer the amount", async function () {
  //     const {Token, owner, addr1, addr2} = await loadFixture(deployNeuTokenFixture);


  //   });
  // });
});
