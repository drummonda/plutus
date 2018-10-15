pragma solidity ^0.4.25;

/**
 * The CreditScore contract keeps track of a user's credit score
 */
contract Credit {

  // Public Variables
  uint public min;
  uint public max;
  mapping (address => uint) public scoreOf;


  /* ------------- Constructor ---------------*/
  constructor (uint minScore, uint maxScore) {
    min = minScore;
    max = maxScore;
  }


  /* ------------- Constructor ---------------*/
  function initializeUser(address user) public {

  }
}
