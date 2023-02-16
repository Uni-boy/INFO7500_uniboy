// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTContract is ERC721 {
    constructor() ERC721("myNFT", "MFT") {}
    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }
}