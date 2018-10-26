pragma solidity ^0.4.25;

import './Owned.sol';


/**
 * The Loan contract for facilitating peer to peer lending
 */
contract Loan is Owned {

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
    duration = _duration;
    gracePeriod = _gracePeriod;
    strikes = _strikes;
    launched = false;
  }


  /* Launch the loan
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


  /* Set the recipient of the loan contract
   *
   * @param _recipient
  */
  function setRecipient(address _recipient) public onlyOwner {
    // The contract is not launched
    require(!launched);

    // There is no recipient already set
    require(recipient == 0);

    // Set the loan recipient
    recipient = _recipient;
  }


}
