import { SignatureLike } from "@ethersproject/bytes";
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers, network, upgrades } from "hardhat";

async function getPermitSignature(
    wallet: { address: any; getChainId: () => any; _signTypedData: (arg0: { name: any; version: string; chainId: any; verifyingContract: any; }, arg1: { Permit: { name: string; type: string; }[]; }, arg2: { owner: any; spender: any; value: any; nonce: any; deadline: any; }) => SignatureLike | PromiseLike<SignatureLike>; },
    token: any,
    spender: any,
    value: any,
    deadline: any,
) {
    const [nonce, name, version, chainId] = await Promise.all([
        token.nonces(wallet.address),
        token.name(),
        '1',
        wallet.getChainId(),
    ])

    return ethers.utils.splitSignature(
        await wallet._signTypedData(
            {
                name,
                version,
                chainId,
                verifyingContract: token.address,
            },
            {
                Permit: [
                    {
                        name: 'owner',
                        type: 'address',
                    },
                    {
                        name: 'spender',
                        type: 'address',
                    },
                    {
                        name: 'value',
                        type: 'uint256',
                    },
                    {
                        name: 'nonce',
                        type: 'uint256',
                    },
                    {
                        name: 'deadline',
                        type: 'uint256',
                    },
                ],
            },
            {
                owner: wallet.address,
                spender,
                value,
                nonce,
                deadline,
            }
        )
    )
}

describe("upgradeable test", function () {
    async function deployAuctionFixture() {
        const [auctionOwner, bidder] = await ethers.getSigners();

        const NFTToken = await ethers.getContractFactory("NFTContract");
        const NFT = await NFTToken.deploy();
        await NFT.mint(auctionOwner.address, 1);

        const MyERC20PermitToken = await ethers.getContractFactory("MyERC20Permit");
        const MyERC20Permit = await MyERC20PermitToken.connect(bidder).deploy("NFT", "MINT", 2000);


        const NFTDutchAuctionToken = await ethers.getContractFactory("NFTDutchAuction");
        const NFTDutchAuction = await upgrades.deployProxy(
            NFTDutchAuctionToken,
            [
                MyERC20Permit.address,
                NFT.address,
                1,
                1000,
                10,
                100,
            ]
        );
        await NFT.connect(auctionOwner).approve(NFTDutchAuction.address, 1);
        // const upgradedNFTDutchAuction = await upgrades.upgradeProxy(NFTDutchAuction.address, NFTDutchAuctionToken);

        return { NFT, MyERC20Permit, NFTDutchAuction, auctionOwner, bidder };
    }

    describe("NFT Dutch Auction", function () {
        it("Should initialize successfully", async function () {
            const { NFT, MyERC20Permit, NFTDutchAuction, auctionOwner, bidder } = await loadFixture(deployAuctionFixture);

            expect(await NFTDutchAuction.nftContract()).to.equal(NFT.address);
            expect(await NFTDutchAuction.myToken()).to.equal(MyERC20Permit.address);
            expect(await NFTDutchAuction.nftTokenId()).to.equal(1);
            expect(await NFTDutchAuction.initialPrice()).to.equal(2000);
            expect(await NFT.getApproved(1)).to.equal(NFTDutchAuction.address);
            expect(await MyERC20Permit.balanceOf(bidder.address)).to.equal(2000);
            expect(await NFT.balanceOf(auctionOwner.address)).to.equal(1);
        });

        it("Should allow bidding and transfer the NFT when the bid is successful", async function () {
            const { NFT, NFTDutchAuction, MyERC20Permit, auctionOwner, bidder } = await loadFixture(deployAuctionFixture);

            // Call the getHash function in your contract
            const owner = bidder.address;
            const spender = NFTDutchAuction.address;
            const value = 2000;
            const deadline = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour from now

            const { v, r, s } = await getPermitSignature(
                bidder,
                MyERC20Permit,
                spender,
                value,
                deadline
            )

            console.log(v, r, s);

            // const digest = await MyERC20Permit.getDigest(owner, spender, value, deadline);
            // console.log(digest);

            // // Sign the message hash using the bidder's private key
            // const signature = await bidder.signMessage(ethers.utils.arrayify(digest));
            // console.log(signature)

            // // Split the signature into v, r, and s components
            // const { v, r, s } = ethers.utils.splitSignature(signature);

            // console.log(v, r, s)
            for (let i = 0; i < 15; i++) {
                await network.provider.send("evm_mine");
            }

            await MyERC20Permit.permit(owner, spender, value, deadline, v, r, s);

            // Bid on the NFT
            await NFTDutchAuction.connect(bidder).bid();

            // Check if the NFT has been transferred to the bidder
            expect(await NFT.ownerOf(1)).to.equal(bidder.address);

            // Check if the auction has ended
            expect(await NFTDutchAuction.auctionEnd()).to.equal(true);
        })

        // it("should end the auction after bidding using NFTDutchAuction", async function () {
        //     const { NFT, NFTDutchAuction, MyERC20Permit, auctionOwner, bidder } = await loadFixture(deployAuctionFixture);

        //     // initial state
        //     expect(await MyERC20Permit.balanceOf(bidder.address)).to.equal(2000);
        //     expect(await NFT.getApproved(1)).to.equal(NFTDutchAuction.address);
        //     expect(await NFTDutchAuction.initialPrice()).to.equal(2000);
        //     // after 10 blocks
        //     for (let i = 0; i < 15; i++) {
        //         await network.provider.send("evm_mine");
        //     }

        //     // award some allowance to auction
        //     await MyERC20Permit.allowance(MyERC20Permit.address, NFTDutchAuction.address);
        //     await MyERC20Permit.increaseAllowance(NFTDutchAuction.address, 2000);
        //     // bid to cause an auction to end
        //     await NFTDutchAuction.connect(bidder).bid();
        //     expect(await NFT.ownerOf(1)).to.equal(bidder.address);
        //     expect(await MyERC20Permit.balanceOf(bidder.address)).to.equal(0);
        //     expect(await MyERC20Permit.balanceOf(owner.address)).to.equal(2000);
        //     expect(await NFTDutchAuction.auctionEnd()).to.equal(true);
        // })
    });
});