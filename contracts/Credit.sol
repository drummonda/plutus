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

/**
 * The CreditScore contract keeps track of a user's credit score
 */
contract Credit is Owned {

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
  function raiseScore(address _user, uint _value) public onlyOwner {
    uint currentScore = scoreOf[_user] + _value;
    if(currentScore > max) {
      scoreOf[_user] = max;
    } else {
      scoreOf[_user] = currentScore;
    }
  }


  /* ------------- Lower score by a certain value ---------------*/
  function lowerScore(address _user, uint _value) public onlyOwner {
    uint currentScore = scoreOf[_user] - _value;
    if(currentScore < min) {
      scoreOf[_user] = min;
    } else {
      scoreOf[_user] = currentScore;
    }
  }

}
