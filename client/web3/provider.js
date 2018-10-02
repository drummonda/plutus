import contract from 'truffle-contract'
import Web3 from "web3"

const provider = () => {
  // If the user has MetaMask:
  if (typeof web3 !== 'undefined') {
    return web3.currentProvider
  } else {
    console.error("You need to install MetaMask for this app to work!")
  }
}

export const eth = new Web3(provider()).eth

export const getInstance = async artifact => {
  const contractObj = contract(artifact)
  contractObj.setProvider(provider());

  const deployed = await contractObj.deployed();
  console.log(deployed);
  return deployed;
}
