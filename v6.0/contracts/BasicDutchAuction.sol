//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract BasicDutchAuction {
    address public seller;
    address public winner;
    uint256 public reservePrice;
    uint256 public numBlocksAuctionOpen;
    uint256 public offerPriceDecrement;
    uint256 public initialPrice;
    uint256 public currentPrice;
    uint256 public blockStart;
    bool public stopped;

    constructor(
        uint256 _reservePrice,
        uint256 _numBlocksAuctionOpen,
        uint256 _offerPriceDecrement
    ) {
        seller = msg.sender;
        reservePrice = _reservePrice;
        numBlocksAuctionOpen = _numBlocksAuctionOpen;
        offerPriceDecrement = _offerPriceDecrement;
        initialPrice =
            reservePrice +
            numBlocksAuctionOpen *
            offerPriceDecrement;
        currentPrice = initialPrice;
        blockStart = block.number;
        stopped = false;
        winner = address(0);
        // bidderCount = 0;
    }

    function finalize(uint256 bidAmount) public {
        winner = msg.sender;
        stopped = true;
        payable(seller).transfer(bidAmount);
    }

    function getWinner() public view returns (address) {
        return winner;
    }

    function getStatus() public view returns (bool) {
        return stopped;
    }

    function bid() public payable returns (address) {
        require(msg.value >= currentPrice - (block.number - blockStart) * offerPriceDecrement, "Bid is lower than currentPrice");
        require(!stopped, "Auction has ended");
        require(msg.sender != seller, "Seller cannot bid");
        require(winner == address(0), "There is already a winner");
        finalize(msg.value);
        return address(0);
    }
}
