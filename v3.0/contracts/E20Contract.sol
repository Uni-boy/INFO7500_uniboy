// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract E20Contract is ERC20 {
    constructor() ERC20("myERC20", "MFT") {}
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}