pragma solidity ^0.4.25;


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


contract Factory {

  /* -------------- Contract variables --------------*/
  address[] public contracts;


  /** Get Contract Count
   *
   * A function that grabs the number of deployed contracts
   *
  */
  function getContractCount() public view returns(uint contractCount) {
    return contracts.length;
  }


  /** Create a new pool with params
   *
   * @param _reference the reference to the original loanPool
  */
  function createNewPool(
    uint8 _launchBalance,
    uint8 _interestRate,
    uint8 _duration,
    uint _gracePeriod,
    uint _strikes)
  {
    LoanPool loanPool = new LoanPool(
                              _launchBalance,
                              _interestRate,
                              _duration,
                              _gracePeriod,
                              _strikes);
    return loanPool;
  }

}


contract LoanPool is Owned {

  /* -------------- Contract variables --------------*/
  uint8 public currentBalance;
  uint8 public launchBalance;
  uint8 public interestRate;
  uint public duration;
  uint public gracePeriod;
  uint public strikes;
  bool public launched;
  mapping (address => uint) public investors;
  address public recipient;


  /* -------------- Event emitters --------------*/
  event LoanPoolCreated(LoanPool indexed loanPool);


  /* --------------  Constructor --------------*/
  constructor(
    uint8 _launchBalance,
    uint8 _interestRate,
    uint8 _duration,
    uint _gracePeriod,
    uint _strikes)
  {
    currentBalance = 0;
    launchBalance = _launchBalance;
    duration = _duration;
    gracePeriod = _gracePeriod;
    strikes = _strikes;
    launched = false;
  }


  /* Launch the loanPool
   *
   * @notice changes launch to true
  */
  function _launch () internal onlyOwner {
    launched = true;
  }


  /* Add an investment
   *
   * @param _investor the investor
   * @param amount the amount to be invested
   * @notice add an investor and amount to mapping
  */
  function addInvestment(address _investor, uint amount) public onlyOwner {

    // Require that the contract has not been launched
    require(!launched);

    // Require that newBalance not greater than launchBalance
    require(newBalance  <= launchBalance);

    // Update the mapping
    investors[_investor] = amount;

    // Add amount to current amount
    uint newBalance = currentBalance + amount;

    // If equal to launch balance then launch the contract
    if(newBalance == launchBalance) {
      _launch();
    }

  }


  /* Add an investment
   *
   * @param _investor the investor
   * @param amount the amount to be invested
   * @notice add an investor and amount to mapping
  */



}
