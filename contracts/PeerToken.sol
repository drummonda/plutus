pragma solidity ^0.4.19;

import 'openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol';

contract PeerToken is MintableToken {
  string public name = 'PeerToken';
  string public symbol = 'PEER';
  uint public decimals = 18;
}

