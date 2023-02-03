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
    uint256 public auctionEnd;
    bool public stopped;
    mapping(address => uint256) public refunds;
    address payable[] public bidders;
    uint256 public bidderCount;

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
        auctionEnd = block.timestamp + numBlocksAuctionOpen;
        stopped = false;
        bidderCount = 0;
    }

    function bid() external payable returns (address) {
        require(msg.value >= currentPrice, "Bid is lower than currentPrice");
        require(!stopped, "Auction has ended");
        winner = msg.sender;
        stopped = true;
        // refunds[msg.sender] = msg.value;
        // currentPrice = currentPrice - offerPriceDecrement;
        finalize();
        // bidders[bidderCount++] = payable(msg.sender);
        return address(0);
    }

    function finalize() public pure {
        return;
    }

    function refund(uint256 refundAmount) public pure {
        return;
    }
}
