const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

/*
 *
 * Directory paths
 *
*/

// General directory paths
const buildPath = path.resolve(__dirname, "..", "build");

// Contract file paths
const ownedPath = path.resolve(__dirname, "..", "contracts", "Owned.sol");
const creditHubPath = path.resolve(__dirname, "..", "contracts", "CreditHub.sol");
const erc20Path = path.resolve(__dirname, "..", "contracts", "ERC20.sol");
const peerTokenPath = path.resolve(__dirname, "..", "contracts", "PeerToken.sol");


/*
 *
 * Contract objects post-compile
 *
*/
let contractObjects = [];


/*
 *
 * Helper functions
 *
*/

// Compile each contract
const compileContract = input => {
  const compiled = solc.compile({ sources: input }, 1);
  const compiledContract = compiled.contracts;
  console.log("Compilation output", compiled);
  return compiledContract
}

// Write the contract to the builds folder
const writeContractArtifact = (compiledContract, contractName) => {
  const fileName = `${contractName}.json`;
  const solidityFile = `${contractName}.sol`
  const key = `${solidityFile}:${contractName}`;
  const contractObject = {name: contractName, ...compiledContract[key]};
  fs.outputJsonSync(
    path.resolve(buildPath, fileName),
    contractObject
  );
  contractObjects = [...contractObjects, contractObject];
}


/*
 *
 * Read each contract file and create various inputs
 *
*/

// Read each contract file
const ownedInput = { 'Owned.sol': fs.readFileSync(ownedPath, "utf8") };
const erc20Input = { 'ERC20.sol': fs.readFileSync(erc20Path, "utf8") };
const peerTokenInput = { 'PeerToken.sol': fs.readFileSync(peerTokenPath, "utf8") };
const creditHubInput = { 'CreditHub.sol': fs.readFileSync(creditHubPath, "utf8") };

// Define the actual contract inputs
const erc20 = { name: "ERC20", inputs: {...erc20Input} };
const peerToken = { name: "PeerToken", inputs: {...peerTokenInput, ...ownedInput, ...erc20Input} };
const creditHub = { name: "CreditHub", inputs: {...ownedInput, ...creditHubInput} };
const contractsToCompile = [ erc20, peerToken, creditHub];


/*
 *
 * Remove the current builds directory
 *
*/

fs.removeSync(buildPath);
fs.ensureDirSync(buildPath);


/*
 *
 * Actually execute the compile and write
 *
*/
contractsToCompile.forEach(contract => {
  const compiled = compileContract(contract);
  writeContractArtifact(compiled)
})


const compiledERC20 = compileContract(erc20);
writeContractArtifact(compiledERC20, "ERC20");

// Do this for PeerToken
const compiledPeerToken = compileContract(peerToken);
writeContractArtifact(compiledPeerToken, "PeerToken");

// Do this for CreditHub
const compiledCreditHub = compileContract(creditHub);
writeContractArtifact(compiledCreditHub, "CreditHub");

module.exports = contractObjects;
