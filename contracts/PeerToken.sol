pragma solidity ^0.4.25;

import './Owned.sol';

contract PeerToken is Owned {

    /* -------------- Contract events --------------*/
    event Transfer(address indexed from, address indexed to, uint256 value);


    /* -------------- Contract variables --------------*/
    mapping (address => uint256) public balanceOf;
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;


    /* -------------- Constructor function --------------*/
    function constructor(
        uint256 initialSupply,
        string tokenName,
        string tokenSymbol,
        uint8 decimalUnits,
        address centralMinter) public
    {
        if(centralMinter != 0) owner = centralMinter;
        balanceOf[msg.sender] = initialSupply;
        name = tokenName;
        symbol = tokenSymbol;
        decimals = decimalUnits;
    }


    /* -------------- Mint tokens --------------*/
    function mintToken(address target, uint256 mintedAmount) onlyOwner {
        balanceOf[target] += mintedAmount;
        totalSupply += mintedAmount;
        emit Transfer(0, owner, mintedAmount);
        emit Transfer(owner, target, mintedAmount);
    }


    /* -------------- Transfer tokens --------------*/
    function transfer(address _to, uint256 _value) public {
        require(balanceOf[msg.sender] >= _value && balanceOf[_to] + _value >= balanceOf[_to]);

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
    }


    /* -------------- Internal transfer --------------*/
    function _transfer(address _from, address _to, uint _value) internal {
        require(_to != 0x0);
        require(balanceOf[_from] >= _value);
        require(balanceOf[_to] + _value >= balanceOf[_to]);
        require(!frozenAccount[_from]);
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(_from, _to, _value);
    }


}
