import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("NeuToken", function () {
  async function deployNeuTokenFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const neuTokenFactory = await ethers.getContractFactory("NeuToken");
    const neuToken = await neuTokenFactory.connect(owner).deploy();

    return { neuToken, owner, otherAccount};
  }

  describe("AuctionToken Deployment", function () {
    it("should return current total price", async function () {
      const {neuToken, owner} = await loadFixture(deployNeuTokenFixture);

      expect(await neuToken.balance(owner.address)).to.equal(5000);
    });
  });

  describe("AuctionToken Deployment", function () {
    it("should transfer the amount", async function () {
      const {neuToken, owner, otherAccount} = await loadFixture(deployNeuTokenFixture);

      await neuToken.transfer(otherAccount.address, 3000);
      expect(await neuToken.balance(owner.address)).to.equal(2000);
      expect(await neuToken.balance(otherAccount.address)).to.equal(3000);
    //   await expect(neuToken.transfer(otherAccount.address, 1000)).to.be.revertedWith("You don't have enough money");
    });
  });
});
