// Grab the web3 module for interacting with smart contracts
const Web3 = require("web3");
const Provider = require("truffle-hdwallet-provider");

// Grab array of compiled contracts
const compiledContracts = require("./compile");
console.log("compiled contracts", compiledContracts.length);

// Create a new instance of web3 with the correct provider
const web3 = new Web3("http://localhost:8545");

// This function is used to deploy the contract
const deploy = async (accounts, ABI, bytecode) => {
  try {
    // Create a contract with the ABI, deploy with bytecode
    const contract = await new web3.eth.Contract(JSON.parse(ABI));
    const deployed = await contract.deploy({ data: bytecode });
    const sent = await deployed.send({
     from: accounts[0],
     gas: 3000000,
   });

    const address = sent.options.address;
    console.log("Deployed on:", address);
    return;

  } catch (err) {
    console.error(err);
  }
}

const deployAllContracts = async () => {
  try {
    // Get a list of accounts
    const accounts = await web3.eth.getAccounts();

    // Go through each contract in array and deploy
    compiledContracts.map(async contract => {
      // Interface and bytcode object from compiled contract
      const { interface, bytecode } = contract;
      const ABI = interface;

      // Deploy the contract
      await deploy(accounts, ABI, bytecode);
    })
  } catch (err) {
    console.error(err);
  }

}

deployAllContracts();
