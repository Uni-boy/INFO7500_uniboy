import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers, network, upgrades } from "hardhat";

describe("upgradeable test", function () {
    async function deployAuctionFixture() {
        const [owner, bidder] = await ethers.getSigners();

        const NFTToken = await ethers.getContractFactory("NFTContract");
        const NFT = await NFTToken.connect(owner).deploy();
        await NFT.mint(owner.address, 1);

        const ERC20Token = await ethers.getContractFactory("E20Contract");
        const E20 = await ERC20Token.connect(bidder).deploy();
        await E20.mint(bidder.address, 2000);

        const NFTDutchAuctionToken = await ethers.getContractFactory("NFTDutchAuction");
        const NFTDutchAuction = await upgrades.deployProxy(
            NFTDutchAuctionToken,
            [
                E20.address,
                NFT.address,
                1,
                1000,
                10,
                100,
            ]
        );
        await NFT.connect(owner).approve(NFTDutchAuction.address, 1);
        // const upgradedNFTDutchAuction = await upgrades.upgradeProxy(NFTDutchAuction.address, NFTDutchAuctionToken);

        return { NFT, E20, NFTDutchAuctionToken, NFTDutchAuction, owner, bidder };
    }

    describe("NFT Dutch Auction", function () {
        it("Should initialize successfully", async function () {
            const { NFT, E20, NFTDutchAuction } = await loadFixture(deployAuctionFixture);

            expect(await NFTDutchAuction.nftContract()).to.equal(NFT.address);
            expect(await NFTDutchAuction.myToken()).to.equal(E20.address);
            // expect(await NFTDutchAuction.owner()).to.equal(NFTDutchAuction.address);
        });

        it("Should upgrade successfully", async function () {
            const { NFTDutchAuction } = await loadFixture(deployAuctionFixture);
            const upgradedNFTDutchAuctionToken = await ethers.getContractFactory("NFTDutchAuctionV2");

            const upgradedNFTDutchAuction = await upgrades.upgradeProxy(NFTDutchAuction.address, upgradedNFTDutchAuctionToken);
            
            expect(await upgradedNFTDutchAuction.isVersion2()).to.equal(2);
        })

        it("should end the auction after bidding using NFTDutchAuction", async function () {
            const { NFT, NFTDutchAuction, E20, owner, bidder } = await loadFixture(deployAuctionFixture);

            // initial state
            expect(await E20.balanceOf(bidder.address)).to.equal(2000);
            expect(await NFT.getApproved(1)).to.equal(NFTDutchAuction.address);
            expect(await NFTDutchAuction.initialPrice()).to.equal(2000);
            // after 10 blocks
            for (let i = 0; i < 15; i++) {
                await network.provider.send("evm_mine");
            }

            // award some allowance to auction
            await E20.allowance(E20.address, NFTDutchAuction.address);
            await E20.increaseAllowance(NFTDutchAuction.address, 2000);
            // bid to cause an auction to end
            await NFTDutchAuction.connect(bidder).bid();
            expect(await NFT.ownerOf(1)).to.equal(bidder.address);
            expect(await E20.balanceOf(bidder.address)).to.equal(0);
            expect(await E20.balanceOf(owner.address)).to.equal(2000);
            expect(await NFTDutchAuction.auctionEnd()).to.equal(true);
        })

        it("should end the auction after bidding using NFTDutchAuctionV2", async function () {
            const { NFT, NFTDutchAuction, E20, owner, bidder } = await loadFixture(deployAuctionFixture);
            const upgradedNFTDutchAuctionToken = await ethers.getContractFactory("NFTDutchAuctionV2");

            const upgradedNFTDutchAuction = await upgrades.upgradeProxy(NFTDutchAuction.address, upgradedNFTDutchAuctionToken);
            await NFT.connect(owner).approve(upgradedNFTDutchAuction.address, 1);

            // initial state
            expect(await E20.balanceOf(bidder.address)).to.equal(2000);
            expect(await NFT.getApproved(1)).to.equal(upgradedNFTDutchAuction.address);
            expect(await upgradedNFTDutchAuction.initialPrice()).to.equal(2000);
            expect(await upgradedNFTDutchAuction.isVersion2()).to.equal(2);
            // after 10 blocks
            for (let i = 0; i < 15; i++) {
                await network.provider.send("evm_mine");
            }

            // award some allowance to auction
            await E20.allowance(E20.address, upgradedNFTDutchAuction.address);
            await E20.increaseAllowance(upgradedNFTDutchAuction.address, 2000);
            // bid to cause an auction to end
            await upgradedNFTDutchAuction.connect(bidder).bid();
            expect(await NFT.ownerOf(1)).to.equal(bidder.address);
            expect(await E20.balanceOf(bidder.address)).to.equal(0);
            expect(await E20.balanceOf(owner.address)).to.equal(2000);
            expect(await upgradedNFTDutchAuction.auctionEnd()).to.equal(true);
        })
    });
});