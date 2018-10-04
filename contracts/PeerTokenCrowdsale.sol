pragma solidity ^0.4.19;

import './PeerToken.sol'
import 'openzeppelin-solidity/contracts/crowdsale/emmision/MintedCrowdsale.sol';
import 'openzeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol';

contract PeerTokenCrowdsale is TimedCrowdsale, MintedCrowdsale {
  function constructor
  (
    uint256 _openingTime,
    uint256 _closingTime,
    uint256 _rate,
    address _wallet,
    MintableToken _token
  )
  public
  Crowdsale(_rate, _wallet, _token)
  TimedCrowdsale(_openingTime, _closingTime) {

  }

}
