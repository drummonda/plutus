const Web3 = require("web3");
const Provider = require("truffle-hdwallet-provider");
const compiledContracts = require("./compile");
const web3 = new Web3("http://localhost:8545");
const { addContractArtifact } = require("../server/firebase/api");

const deploy = async (accounts, name, ABI, bytecode) => {
  try {
    const contract = await new web3.eth.Contract(JSON.parse(ABI));
    let deployed = null;
    if(name === "PeerToken") {
      deployed = await contract.deploy({ data: bytecode, arguments: [21000000, 'PeerToken', 'PTK']});
    } else {
      deployed = await contract.deploy({ data: bytecode });
    }
    const sent = await deployed.send({
     from: accounts[0],
     gas: 3000000,
   });
    const address = sent.options.address;
    const artifact = { address, abi: JSON.parse(ABI) };
    await addContractArtifact(name, artifact);
    console.log("Name: ", name, "Deployed on:", address);
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
