pragma solidity ^0.4.25;

import './Owned.sol';

/**
 * The Factory contract for generating LoanPools
 */
contract Factory is Owned {

  /* -------------- Contract variables --------------*/
  mapping(uint => address) public loans;
  uint8 public numLoans;

  /* -------------- Accept Ether --------------*/
    function() external payable { }

  /** Get Contract Count
   *
   * A function that grabs the number of deployed contracts
   *
  */
  function getContractCount() public view returns(uint contractCount) {
    return numLoans;
  }

  /** Get Contract
   *
   * A function that grabs a deployed contract and returns its details
   *
  */
  function getContract(uint8 id)
    public view returns(uint8 currentBalance,
                        uint8 launchBalance,
                        uint8 interestRate,
                        uint duration,
                        uint strikes,
                        bool launched)
  {
    address loanAddress = loans[id];
    Loan loan = Loan(loanAddress);
    currentBalance = loan.currentBalance();
    launchBalance = loan.launchBalance();
    interestRate = loan.interestRate();
    duration = loan.duration();
    strikes = loan.strikes();
    launched = loan.launched();
  }


  /** Create a new pool with params
   *
   * @param _launchBalance the balance needed to launch the loanPool
   * @param _interestRate the interest rate of the loanPool
   * @param _duration the duration of the loanPool contract
   * @param _gracePeriod the period a user is allowed to miss payments
   * @param _strikes the number of times a user is allowed to miss payments
   *
  */
  function createNewLoan(
    uint8 _launchBalance,
    uint8 _interestRate,
    uint8 _duration,
    uint _gracePeriod,
    uint _strikes)
  public returns (address _address)
  {
    loans[numLoans] = new Loan(
                              _launchBalance,
                              _interestRate,
                              _duration,
                              _gracePeriod,
                              _strikes);
    numLoans ++;
    _address = loans[numLoans];
  }

}

/**
 * The Loan contract for facilitating peer to peer lending
 */
contract Loan {

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
  event LoanCreated(Loan indexed loan);


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
    interestRate = _interestRate;
    duration = _duration;
    gracePeriod = _gracePeriod;
    strikes = _strikes;
    launched = false;
  }


  /* Launch the loan
   *
   * @notice changes launch to true
  */
  function _launch () internal {
    launched = true;
  }


  /* Add an investment
   *
   * @param _investor the investor
   * @param amount the amount to be invested
   * @notice add an investor and amount to mapping
  */
  function addInvestment(address _investor, uint amount) public {

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


  /* Set the recipient of the loan contract
   *
   * @param _recipient
  */
  function setRecipient(address _recipient) public {
    // The contract is not launched
    require(!launched);

    // There is no recipient already set
    require(recipient == 0);

    // Set the loan recipient
    recipient = _recipient;
  }


}
