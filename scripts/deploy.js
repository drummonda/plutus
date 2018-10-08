const Web3 = require("web3");
const Provider = require("truffle-hdwallet-provider");
const compiledContracts = require("./compile");
const web3 = new Web3("http://localhost:8545");

const deploy = async (accounts, ABI, bytecode) => {
  try {
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

// This function loops over all compiled contracts and deploys them
const deployAllContracts = async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    compiledContracts.map(async contract => {
      const { interface, bytecode } = contract;
      const ABI = interface;
      await deploy(accounts, ABI, bytecode);
    })
  } catch (err) {
    console.error(err);
  }

}

deployAllContracts();