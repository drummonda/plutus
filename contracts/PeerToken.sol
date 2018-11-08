pragma solidity ^0.4.25;

import './Owned.sol';
import './ERC20.sol';
import './Loan.sol';

/**
 * A currency for lending, PeerToken contract
 */
contract PeerToken is Owned, ERC20 {

    /* -------------- Contract variables --------------*/
    uint256 public sellPrice;
    uint256 public buyPrice;

    /* -------------- Contract events --------------*/
    event Invest(address indexed investor, address indexed owner, uint256 value);


    /* -------------- Constructor function --------------*/
    constructor (
        uint256 initialSupply,
        string tokenName,
        string tokenSymbol
    ) ERC20(initialSupply, tokenName, tokenSymbol) public {}


    /* -------------- Accept Ether --------------*/
    function() external payable { }


    /* -------------- Internal transfer --------------*/
    function _transfer(address _from, address _to, uint _value) internal {
        require(_to != 0x0);
        require(balanceOf[_from] >= _value);
        require(balanceOf[_to] + _value >= balanceOf[_to]);
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(_from, _to, _value);
    }


    /* Mint Tokens
     *
     * @notice create `mintedAmount` tokens and send to `target`
     * @param target Address to receive the tokens
     * @param mintedAmount the amount of tokens it will receive
    */
    function mintToken (address target, uint256 mintedAmount) onlyOwner public {
        balanceOf[target] += mintedAmount;
        totalSupply += mintedAmount;
        emit Transfer(0, owner, mintedAmount);
        emit Transfer(owner, target, mintedAmount);
    }


    /* Set prices for new tokens
     *
     * @notice Allow users to buy tokens for `newBuyPrice` eth and sell tokens for `newSellPrice` eth
     * @param newSellPrice Price the users can sell to the contract
     * @param newBuyPrice Price users can buy from the contract
    */
    function setPrices(uint256 newSellPrice, uint256 newBuyPrice) onlyOwner public {
        sellPrice = newSellPrice;
        buyPrice = newBuyPrice;
    }


    /* Invest tokens
     *
     * @notice send `_receiver` `_amount` tokens from `_sender`
     * @param _receiver Address to receive the tokens
     * @param amount the amount of tokens it will receive
    */
    function invest (address _contract, uint amount) onlyOwner public {
        Loan loan = Loan(_contract);
        _transfer(msg.sender, _contract, amount);
        loan.addInvestment(msg.sender, amount);
        emit Transfer(msg.sender, _contract, amount);
        emit Invest(msg.sender, _contract, amount);
    }


    /* User can buy tokens from contract
     *
     * @notice Buy tokens from contract by sending ether
    */
    function buy() public payable returns (uint amount) {
        // Amount is number of tokens they can buy
        amount = msg.value / buyPrice;
        _transfer(this, msg.sender, amount);
    }


    /* Users can sell tokens to contract
     *
     * @notice Sell `amount` tokens to contract
     * @param amount amount of tokens to be sold
    */
    function sell(uint amount) public returns (uint revenue) {
        address myAddress = this;
        require(myAddress.balance >= amount * sellPrice);
        _transfer(msg.sender, this, amount);
        msg.sender.transfer(revenue);
        emit Transfer(msg.sender, this, amount);
    }
}
