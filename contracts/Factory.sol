pragma solidity ^0.4.25;

import './Owned.sol';
import './CreditHub.sol';
import './Loan.sol';

/**
 * The Factory contract for generating LoanPools
 */
contract Factory is CreditHub {

  /* -------------- Contract variables --------------*/
  mapping(uint => address) public loans;
  uint8 public loanCount;


  /* -------------- Constructor function --------------*/
  constructor(
              uint _minScore,
              uint _maxScore,
              uint _baseScore
  ) public CreditHub(_minScore, _maxScore, _baseScore) { }

  /* -------------- Accept Ether --------------*/
  function() external payable { }

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


  /** Create a new loan with params
   *
   * @param _launchBalance the balance needed to launch the loan
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
    uint _strikes,
    address _creditScores)
  public returns (address _address)
  {
    loans[loanCount] = new Loan(
                              _launchBalance,
                              _interestRate,
                              _duration,
                              _gracePeriod,
                              _strikes,
                              _creditScores);
    loanCount ++;
    _address = loans[loanCount];
    approveContract(_address);
  }

}
