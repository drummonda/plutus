pragma solidity ^0.4.25;

import './LoanPool.sol';
import './Owned.sol';

/**
 * The Factory contract for generating LoanPools
 */
contract Factory is Owned {

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
   * @param _launchBalance the balance needed to launch the loanPool
   * @param _interestRate the interest rate of the loanPool
   * @param _duration the duration of the loanPool contract
   * @param _gracePeriod the period a user is allowed to miss payments
   * @param _strikes the number of times a user is allowed to miss payments
   *
  */
  function createNewPool(
    uint8 _launchBalance,
    uint8 _interestRate,
    uint8 _duration,
    uint _gracePeriod,
    uint _strikes)

  public onlyOwner returns (LoanPool loanPool)
  {
    loanPool = new LoanPool(
                              _launchBalance,
                              _interestRate,
                              _duration,
                              _gracePeriod,
                              _strikes);
    contracts.push(loanPool.address);
  }

}
