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
        require(!stopped, "Auction has ended");
        if (msg.value >= currentPrice) {
            winner = msg.sender;
            stopped = true;
            finalize();
        }
        refunds[msg.sender] = msg.value;
        bidders[bidderCount++] = payable(msg.sender);
        currentPrice = currentPrice - offerPriceDecrement;
        return winner;
    }

    function finalize() public {
        require(stopped, "Auction has not ended.");
        require(
            block.timestamp >= auctionEnd,
            "Auction end time has not been reached."
        );
        for (uint i = 0; i < bidders.length; i++) {
            address payable bidder = bidders[i];
            if (bidder != winner) {
                uint256 ref = refunds[bidder];
                bidder.transfer(ref);
            }
        }
    }

    function refund(uint256 refundAmount) public {
        require(
            refunds[msg.sender] >= refundAmount,
            "Refund amount exceeds the original bid amount."
        );
        address payable sender = payable(msg.sender);
        sender.transfer(refundAmount);
        refunds[msg.sender] -= refundAmount;
    }
}
