pragma solidity ^0.4.25;


/**
 * The Owned contract restricts actions
 */
contract Owned {
    address public owner;
    mapping (address => bool) public approved;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    modifier onlyApproved {
        require(approved[msg.sender] == true);
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }

    function approveContract(address _contract) public onlyOwner {
        approved[_contract] = true;
    }

    function removeContractApproval(address _contract) public onlyOwner {
        approved[_contract] = false;
    }
}
