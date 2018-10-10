const Web3 = require("web3");
const Provider = require("truffle-hdwallet-provider");
const compiledContracts = require("./compile");
const web3 = new Web3("http://localhost:8545");

// This function loops over all compiled contracts and deploys them
const deployAllContracts = async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    compiledContracts.map(async contract => {
      const { name, interface, bytecode } = contract;
      const ABI = interface;
      await deploy(accounts, name, ABI, bytecode);
    })
  } catch (err) {
    console.error(err);
  }

}

deployAllContracts();

setTimeout(() => {
  process.exit();
}, 10000);
