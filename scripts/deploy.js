// Grab the web3 module for interacting with smart contracts
const Web3 = require("web3");
const ganache = require("ganache-cli");

// Interface and bytcode object from compiled contract
const { interface, bytecode } = require('./compile');

// List of 12 words to connect account
const mnemonic = "effort exist inquiry divorce quarter earth faith simple erode lawn side congress";

// Create a new instance of web3 with the correct provider
const web3 = new Web3(ganache.provider());

// This function is used to deploy the contract
const deploy = async () => {
  try {
    // Get a list of accounts
    const accounts = await web3.eth.getAccounts();

    const ABI = interface;

    // Create a contract with the ABI, deploy with bytecode
    const contract = await new web3.eth.Contract(JSON.parse(ABI));
    const deployed = await contract.deploy({ data: bytecode });
    const sent = await deployed.send({ from: accounts[0], gas: "1000000" });

    const address = sent.options.address;
    console.log("Deployed on:", address);

  } catch (err) {
    console.error(err);
  }
}

deploy();
