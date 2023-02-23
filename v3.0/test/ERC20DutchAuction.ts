import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers, network } from "hardhat";

describe("ERC20test", function () {
    async function deployERC20Fixture() {
        const [owner, bidder] = await ethers.getSigners();

        const NFTToken = await ethers.getContractFactory("NFTContract");
        const NFT = await NFTToken.connect(owner).deploy();
        await NFT.mint(owner.address, 1);

        const ERC20Token = await ethers.getContractFactory("E20Contract");
        const E20 = await ERC20Token.connect(bidder).deploy();
        await E20.mint(bidder.address, 2000);

        return { NFT, E20, owner, bidder };
    }

    describe("NFT mint", function () {
        it("Should succeed to mint", async function () {
            const { NFT, owner } = await loadFixture(deployERC20Fixture);

            expect(await NFT.balanceOf(owner.address)).to.equal(1);
            expect(await NFT.ownerOf(1)).to.equal(owner.address);
            expect(await NFT.tokenURI(1)).to.equal("");
        });
    });

    describe("NFT transfer", function () {
        it("Should succeed to transfer", async function () {
            const { NFT, owner, bidder } = await loadFixture(deployERC20Fixture);

            await NFT.transferFrom(owner.address, bidder.address, 1);
            expect(await NFT.balanceOf(owner.address)).to.equal(0);
            expect(await NFT.balanceOf(bidder.address)).to.equal(1);
            expect(await NFT.ownerOf(1)).to.equal(bidder.address);
            expect(await NFT.tokenURI(1)).to.equal("");
        });
    });

    describe("ERC20", function () {
        it("Should transfer token from one account to anot her", async function () {
            const { E20, owner, bidder } = await loadFixture(deployERC20Fixture);

            expect(await E20.balanceOf(bidder.address)).to.equal(2000);
            await E20.transfer(owner.address, 100);
            expect(await E20.balanceOf(bidder.address)).to.equal(1900);
            expect(await E20.balanceOf(owner.address)).to.equal(100);
            // test allowance and transferFrom
            await E20.increaseAllowance(bidder.address, 100);
            await E20.transferFrom(bidder.address, owner.address, 100);
            expect(await E20.balanceOf(bidder.address)).to.equal(1800);
            expect(await E20.balanceOf(owner.address)).to.equal(200);
        });
    });

    describe("ERC20DutchAuction", function () {
        async function deployAuction() {
            const{ NFT, E20, owner, bidder} = await loadFixture(deployERC20Fixture);

            const AuctionToken = await ethers.getContractFactory("NFTDutchAuction");
            const Auction = await AuctionToken.deploy(
                E20.address,
                NFT.address,
                1,
                1000,
                10,
                100
            );
            await NFT.connect(owner).approve(Auction.address, 1);
            
            return { NFT, Auction, E20, owner, bidder};
        }
        it("should end the auction after bidding", async function () {
            const { NFT, Auction, E20, owner, bidder } = await loadFixture(deployAuction);

            // initial state
            expect(await E20.balanceOf(bidder.address)).to.equal(2000);
            expect(await NFT.getApproved(1)).to.equal(Auction.address);
            expect(await Auction.initialPrice()).to.equal(2000);
            // after 10 blocks
            for (let i = 0; i < 15; i++) {
                await network.provider.send("evm_mine");
            }

            // award some allowance to auction
            await E20.allowance(E20.address, Auction.address);
            await E20.increaseAllowance(Auction.address, 2000);
            // bid to cause an auction to end
            await Auction.connect(bidder).bid();
            expect(await NFT.ownerOf(1)).to.equal(bidder.address);
            expect(await E20.balanceOf(bidder.address)).to.equal(0);
            expect(await E20.balanceOf(owner.address)).to.equal(2000);
            expect(await Auction.auctionEnd()).to.equal(true);
        })
    });
});