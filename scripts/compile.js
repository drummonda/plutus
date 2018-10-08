const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

// Store the build folder and the contract file
const buildPath = path.resolve(__dirname, "..", "build");
const contractsPath = path.resolve(__dirname, "..", "contracts");
const artifactsPath = path.resolve(__dirname, "..", "client", "artifacts");
let contractObjects = [];

const compileContract = contract => {
  // Compile the contract code, return the contract object
  const compiled = solc.compile(contract, 1);
  const compiledContract = compiled.contracts;

  // Console log for the user
  console.log("Compilation output", compiled);

  // Return the ABI for use
  return compiledContract
}

const writeContractArtifact = (compiledContract, ABI, contractName) => {
  // Build the new contract fileName
  const fileName = `${contractName}.json`;
  const key = `:${contractName}`;
  // Create a JSON file with the exhibition contract
  fs.outputJsonSync(
    path.resolve(buildPath, fileName),
    compiledContract[key]
  );

  // Create a JSON file with the abi interface
  fs.outputJsonSync(
    path.resolve(artifactsPath, fileName),
    ABI
  );

  // Add to the exported object
  contractObjects = [...contractObjects, compiledContract[key]];
}

// Remove the current build directory
fs.removeSync(buildPath);

// Ensures that the directory build exists
fs.ensureDirSync(buildPath);
fs.ensureDirSync(artifactsPath);

// Read all contract files, compile them and write their artifacts
fs.readdirSync(contractsPath).forEach(file => {
  // Grab the fileName, for writing new file purposes
  const contractName = file.split('.').slice(0, 1)[0];
  // Grab the current file's filepath
  const filePath = path.resolve(contractsPath, file);
  // Read the contract contents
  const contract = fs.readFileSync(filePath, 'utf8');
  // Compile the contract
  const compiledContract = compileContract(contract);
  // Grab the compiledContract's interface
  const ABI = JSON.parse(compiledContract[`:${contractName}`].interface);
  // Write the contract artifact to file
  writeContractArtifact(compiledContract, ABI, contractName);
});

module.exports = contractObjects;
