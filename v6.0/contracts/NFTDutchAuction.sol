//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Upgrade.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-IERC20Permit.sol";
import "./MyERC20Permit.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract NFTDutchAuction is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    using SafeMath for uint256;
    IERC721 public nftContract;
    uint256 public nftTokenId;
    MyERC20Permit public myToken;

    bool public auctionEnd;
    address payable public auctionOwner;
    uint256 public reservePrice;
    uint256 public numBlocksAuctionOpen;
    uint256 public offerPriceDecrement;
    uint256 public initialPrice;

    function initialize(
        address erc20TokenAddress,
        address erc721TokenAddress,
        uint256 _nftTokenId,
        uint256 _reservePrice,
        uint256 _numBlocksAuctionOpen,
        uint256 _offerPriceDecrement
    ) public initializer {
        // require(nftContract.ownerOf(_nftTokenId) == msg.sender, "You are not the owner of the nft token!");
        auctionEnd = false;
        auctionOwner = payable(msg.sender);
        nftTokenId = _nftTokenId;
        reservePrice = _reservePrice;
        numBlocksAuctionOpen = _numBlocksAuctionOpen;
        offerPriceDecrement = _offerPriceDecrement;
        initialPrice =
            _reservePrice +
            _numBlocksAuctionOpen *
            _offerPriceDecrement;
        nftContract = IERC721(erc721TokenAddress);
        myToken = MyERC20Permit(erc20TokenAddress);
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    function upgrade(address newImplementation) public onlyOwner {
        _authorizeUpgrade(newImplementation);
        _upgradeTo(newImplementation);
    }

    function bid() external returns (address) {
        require(!auctionEnd, "The auction already ended.");
        require(
            block.number > numBlocksAuctionOpen,
            "The auction hasn't started yet"
        );
        uint256 currentPrice = initialPrice -
            offerPriceDecrement *
            (block.number - numBlocksAuctionOpen);
        require(
            myToken.balanceOf(msg.sender) >= currentPrice,
            "Your bid is lower than the minimum bid"
        );

        auctionEnd = true;

        myToken.transferFrom(
            msg.sender,
            nftContract.ownerOf(nftTokenId),
            myToken.balanceOf(msg.sender)
        );

        nftContract.transferFrom(
            nftContract.ownerOf(nftTokenId),
            msg.sender,
            nftTokenId
        );
        return msg.sender;
    }
}
