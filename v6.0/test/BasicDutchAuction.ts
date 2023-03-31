import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers, network } from "hardhat";

describe("BasicDutchAuction", function () {
  async function deployDutchAuctionFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const BDAToken = await ethers.getContractFactory("BasicDutchAuction");
    const Token = await BDAToken.connect(owner).deploy(
      1000, // reservePrice
      10, // numBlocksAuctionOpen
      100 // offerPriceDecrement
    );

    return { Token, owner, addr1, addr2 };
  }

  describe("Dutch Auction deployment", function () {
    it("verify the seller is owner", async function () {
      const { Token, owner, addr1 } = await loadFixture(deployDutchAuctionFixture);

      expect(await Token.seller()).to.equal(owner.address);
    });

    it("Auction is closed", async function () {
      const { Token, owner, addr1 } = await loadFixture(deployDutchAuctionFixture);

      await Token.connect(addr1).bid({ value: 2000 });

      expect(await Token.connect(owner).getWinner()).to.equal(addr1.address);
      expect(await Token.connect(owner).getStatus()).to.equal(true);
    });
  });
});
