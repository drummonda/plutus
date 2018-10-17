const path = require("path");
const fs = require("fs-extra");
const Web3 = require("web3");
const Provider = require("truffle-hdwallet-provider");
const web3 = new Web3("http://localhost:8545");
const { addContractArtifact } = require("../server/firebase/api");

// Migration directory containing all contracts to deploy with args
const migrationPath = path.resolve(__dirname, "..", "migrations");

// Deployment function that gets passed into each migration file
const deploy = async (name, ABI, data) => {
  try {
    const accounts = await web3.eth.getAccounts();
    const contract = await new web3.eth.Contract(JSON.parse(ABI));
    const deployed = await contract.deploy(data);
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

// This function loops over all migration files and deploys their contracts
const deployAllContracts = async () => {
  try {
    fs.readdir(migrationPath, (err, files) => {
      if(err) {
        console.error("Migration directory could not be read");
        process.exit(1);
      }
      files.forEach(async file => {
        const filePath = `../migrations/${file}`;
        await require(filePath)(deploy);
      })
    });
  } catch (err) {
    console.error(err);
  }

}

deployAllContracts();

setTimeout(() => {
  process.exit();
}, 10000);
