import Web3 from "web3"

let web3, coinbase = null

const getProvider = async () => {
  if (!window.web3) {
    window.alert('Please install MetaMask first.')
    return;
  }
  if (!web3) {
    web3 = new Web3(window.web3.currentProvider)
  }
  coinbase = await web3.eth.getCoinbase((err, coinbase) => {
    return coinbase || err
  });
};

getProvider()

export default web3
