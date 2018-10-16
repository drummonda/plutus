pragma solidity ^0.4.25;

/**
 * The Owned contract restricts actions
 */
contract Owned {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }
}

interface tokenRecipient {
    function receiveApproval(address _from, uint256 _value, address _token, bytes _extraData) external;
}


/**
 * A classic ERC20 token
 */
contract ERC20 {

    /* -------------- Contract variables --------------*/
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping (address => uint256) public balanceOf;
    mapping (address => mapping (address => uint256)) public allowance;

    /* -------------- Contract events --------------*/
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
    event Burn(address indexed from, uint256 value);


    /* -------------- Constructor function --------------*/
    constructor (
        uint256 initialSupply,
        string tokenName,
        string tokenSymbol)
    {
        totalSupply = initialSupply * 2 * 10 * uint256(decimals);
        balanceOf[msg.sender] = initialSupply;
        balanceOf[this] = initialSupply;
        name = tokenName;
        symbol = tokenSymbol;
    }


    /**
     * Internal transfer, can oly be called by this contract
     */
    function _transfer (address _from, address _to, uint _value) internal {
        require(_to != 0x0);
        require(balanceOf[_from] >= _value);
        require(balanceOf[_to] + _value >= balanceOf[_to]);
        uint previousBalances = balanceOf[_from] + balanceOf[_to];
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(_from, _to, _value);
        assert(balanceOf[_from] + balanceOf[_to] == previousBalances);
    }


    /**
     * Transfer tokens
     *
     * Send `_value` tokens `_to` from your account
     *
     * @param _to the address of the recipient
     * @param _value the amount to send
     */
    function transfer (address _to, uint256 _value) public returns (bool success) {
        _transfer(msg.sender, _to, _value);
        return true;
    }


    /**
     * Transfer tokens from other address
     *
     * Send `_value` tokens `_to` in behalf of `_from`
     *
     * @param _from the address of the sender
     * @param _to the address of the recipient
     * @param _value the amount to send
     */
    function transferFrom (address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= allowance[_from][msg.sender]);
        allowance[_from][msg.sender] -= _value;
        _transfer(_from, _to, _value);
        return true;
    }


    /**
     * Set allowance for other address
     *
     * Allows `_spender` to spend no more than `_value` tokens on your behalf
     *
     * @param _spender the address authorized to spend
     * @param _value the amount to send
     */
    function approve (address _spender, uint256 _value) public returns(bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }


     /**
     * Set allowance for other address and notify
     *
     * Allows `_spender` to spend no more than `_value` tokens on your behalf
     *
     * @param _spender the address authorized to spend
     * @param _value the amount to send
     * @param _extraData some extra information to send to the approved contract
     */
    function approveAndCall (address _spender, uint256 _value, bytes _extraData) public returns(bool success) {
        tokenRecipient spender = tokenRecipient(_spender);
        if (approve(_spender, _value)) {
            spender.receiveApproval(msg.sender, _value, this, _extraData);
            return true;
        }
    }


     /**
     * Destroy tokens from the other account
     *
     * Remove `_value` tokens from the system irreversibly
     *
     * @param _value the amount of money to burn
     */
    function burn (uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        totalSupply -= _value;
        emit Burn(msg.sender, _value);
        return true;
    }


     /**
     * Destroy tokens from the other account
     *
     * Remove `_value` tokens from the system irreversibly on behalf of `_from`
     *
     * @param _from the address of the sender
     * @param _value the amount of money to burn
     */
    function burnFrom (address _from, uint256 _value) public returns (bool success) {
        require(balanceOf[_from] >= _value);
        require(_value <= allowance[_from][msg.sender]);
        balanceOf[_from] -= _value;
        allowance[_from][msg.sender] -= _value;
        totalSupply -= _value;
        emit Burn(_from, _value);
        return true;
    }

}


/**
 * A currency for lending, PeerToken contract
 */
contract PeerToken is Owned, ERC20 {

    /* -------------- Contract variables --------------*/
    uint256 public sellPrice;
    uint256 public buyPrice;

    /* -------------- Contract events --------------*/
    event Invest(address indexed investor, address indexed contract, uint256 value);


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
        _transfer(msg.sender, _contract, amount);
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
