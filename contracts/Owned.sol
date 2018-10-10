pragma solidity ^0.4.25;

contract Owned {
    address public owner;

    function owned() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
    }

    function transferOwnership(address newOwner) onlyOwner {
        owner = newOwner;
    }
}
