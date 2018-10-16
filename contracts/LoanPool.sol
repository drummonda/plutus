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
  function createNewPool(LoanPool _reference) {
    LoanPool loanPool = new LoanPool(_reference, this);
    return loanPool;
  }

}


contract LoanPool is Owned {

  /* -------------- Contract variables --------------*/
  uint8 currentBalance;
  uint8 launchBalance;
  uint8 interestRate;
  uint duration;
  uint gracePeriod;
  uint strikes;
  mapping (address => uint) investors;


  /* -------------- Event emitters --------------*/
  event LoanPoolCreated(LoanPool indexed loanPool);


  /* --------------  Constructor --------------*/
  constructor(LoanPool _reference, Factory _factory) {
    reference = _reference;
    factory = _factory;
  }


  /* Factory contract can create loanPool contract
   *
   * @notice Factory contract creates Loan Pool
  */
  function factoryCreateLoanPool() public onlyOwner {
    LoanPool memory newPool = factory.createNewPool(this);
    emit LoanPoolCreated(newPool);
  }


  /* Add an investment
   *
   * @notice add an investor and amount to mapping
  */
  function addInvestment(address _investor, uint amount) public onlyOwner {
    // Update the mapping

  }



}
