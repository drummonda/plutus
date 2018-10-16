pragma solidity ^0.4.25;

/*
 *
 * Loan pool factory contract for producing loan pools
 *
 *
*/
contract Factory {
  function createNewPool(LoanPool _reference) {
    LoanPool loan_pool = new LoanPool(_reference, this);
    return loan_pool;
  }
}


/*
 *
 * Loan pool contract
 *
 *
*/
contract LoanPool {

  /* -------------- Contract variables --------------*/
  Factory public factory;
  LoanPool public reference;

  /* -------------- Event emitters --------------*/
  event LoanPoolCreated(LoanPool indexed loan_pool);

  /* --------------  Constructor --------------*/
  constructor(LoanPool _reference, Factory _factory) {
    reference = _reference;
    factory = _factory;
  }

  function factoryCreateLoanPool() public {
    LoanPool memory newPool = factory.createNewPool(this);
    emit LoanPoolCreated(newPool);
  }
}
