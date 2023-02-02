// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.3;

contract NeuToken {
    uint256 public totalPrice;
    mapping(address => uint256) public balance;

    constructor() {
        totalPrice = 5000;
        balance[msg.sender] = totalPrice;
    }

    // function getTotalPrice() public view returns (uint256) {
    //     return totalPrice;
    // }

    function transfer(address to, uint256 amount) public {
        balance[msg.sender] -= amount;
        balance[to] += amount;
    }
}