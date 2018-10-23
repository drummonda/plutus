const path = require("path");
const fs = require("fs-extra");
const Web3 = require("web3");
const web3 = new Web3("http://localhost:8545");
const { addContractArtifact } = require("../server/firebase/api");

/*
 *
 * Migration directory containing all contracts to deploy
 *
*/
const migrationPath = path.resolve(__dirname, "..", "migrations");


/*
 *
 * Deploy contract function that gets passed into each migration file
 *
*/
const deployContract = async (name, ABI, data) => {
  try {
    // Grab all of the accounts associated with the ethereum provider
    const accounts = await web3.eth.getAccounts();
    // Create a new contract instance given the compiled contract interface
    const contract = await new web3.eth.Contract(JSON.parse(ABI));
    // Deploy the contract with any arguments it requires
    const deployedContract = await contract
      .deploy(data)
      .send({
        from: accounts[0],
        gas: 3000000,
      })
    // Grab the blockchain address where the contract lives
    const address = deployedContract.options.address;
    // Create an object containing name and contract interface
    const contractArtifact = { address, abi: JSON.parse(ABI) };
    // Push the contract artifact to firebase, for interaction with UI
    await addContractArtifact(name, contractArtifact);
    console.log("Name: ", name, "deployed on:", address);
    return;
  } catch (err) {
    console.error(err);
  }
}


/*
 *
 * Loop over all migration files and deploy their contracts
 *
*/
const deployAllContracts = () => {
  try {
    // For each file in the migration directory
    fs.readdir(migrationPath, (err, files) => {
      // If there is an error reading the files, stop
      if(err) {
        console.error("Migration directory could not be read");
        process.exit(1);
      }
      // If files were found, loop over each, find the function that
      // the module exported, and call that function, passing in the
      // deployContract function as a parameter
      files.forEach(async file => {
        const contractMigrationPath = `../migrations/${file}`;
        await require(contractMigrationPath)(deployContract);
      })
    });
  } catch (err) {
    console.error(err);
  }

}

// Call the deploy contracts function
deployAllContracts();

// Kill the node process
setTimeout(() => {
  process.exit();
}, 10000);
