pragma solidity ^0.4.25;

import './Owned.sol';

/**
 * The CreditScore contract keeps track of a user's credit score
 */
contract CreditHub is Owned {

  // Public Variables
  uint public min;
  uint public max;
  uint public base;
  mapping (address => uint) public scoreOf;


  /* ------------- Constructor ---------------*/
  constructor (uint minScore, uint maxScore, uint baseScore) {
    min = minScore;
    max = maxScore;
    base = baseScore;
  }


  /* ------------- Initialize a user with base score ---------------*/
  function initializeUser(address _user) public onlyOwner {
    scoreOf[_user] = base;
  }


  /* ------------- Raise score by a certain value ---------------*/
  function raiseScore(address _user, uint _value) public onlyApproved {
    uint currentScore = scoreOf[_user] + _value;
    if(currentScore > max) {
      scoreOf[_user] = max;
    } else {
      scoreOf[_user] = currentScore;
    }
  }


  /* ------------- Lower score by a certain value ---------------*/
  function lowerScore(address _user, uint _value) public onlyApproved {
    uint currentScore = scoreOf[_user] - _value;
    if(currentScore < min) {
      scoreOf[_user] = min;
    } else {
      scoreOf[_user] = currentScore;
    }
  }

}
