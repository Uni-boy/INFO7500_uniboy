//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract NFTDutchAuction {
    IERC721 public nftContract;
    uint256 public nftTokenId;
    IERC20 public myToken;

    bool public auctionEnd;
    address payable public owner;
    address public tokenAddress;
    uint256 public reservePrice;
    uint256 public numBlocksAuctionOpen;
    uint256 public offerPriceDecrement;
    uint256 public initialPrice;

    constructor(
        address erc20TokenAddress,
        address erc721TokenAddress,
        uint256 _nftTokenId,
        uint256 _reservePrice,
        uint256 _numBlocksAuctionOpen,
        uint256 _offerPriceDecrement
    ) {
        // require(nftContract.ownerOf(_nftTokenId) == msg.sender, "You are not the owner of the nft token!");
        auctionEnd = false;
        owner = payable(msg.sender);
        tokenAddress = erc721TokenAddress;
        nftTokenId = _nftTokenId;
        reservePrice = _reservePrice;
        numBlocksAuctionOpen = _numBlocksAuctionOpen;
        offerPriceDecrement = _offerPriceDecrement;
        initialPrice =
            _reservePrice +
            _numBlocksAuctionOpen *
            _offerPriceDecrement;
        nftContract = IERC721(erc721TokenAddress);
        myToken = IERC20(erc20TokenAddress);
    }

    function bid() external payable returns (address) {
        require(!auctionEnd, "The auction already ended.");
        require(
            myToken.balanceOf(msg.sender) >=
                initialPrice -
                    offerPriceDecrement *
                    (block.number - numBlocksAuctionOpen),
            "Your bid is lower than the minimum bid"
        );
        auctionEnd = true;
        myToken.transferFrom(msg.sender, nftContract.ownerOf(nftTokenId), myToken.balanceOf(msg.sender));
        nftContract.transferFrom(nftContract.ownerOf(nftTokenId), msg.sender, nftTokenId);
        return msg.sender;
    }
}
