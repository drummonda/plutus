import Web3 from "web3"

let web3 = null;

if (!window.web3) {
  window.alert('Please install MetaMask first.')
} else {
  web3 = new Web3(window.web3.currentProvider)
}

export default web3
