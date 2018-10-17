const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");


// General directory paths
const buildPath = path.resolve(__dirname, "..", "build");


// Contract file paths
const ownedPath = path.resolve(__dirname, "..", "contracts", "Owned.sol");
const creditHubPath = path.resolve(__dirname, "..", "contracts", "CreditHub.sol");
const erc20Path = path.resolve(__dirname, "..", "contracts", "ERC20.sol");
const peerTokenPath = path.resolve(__dirname, "..", "contracts", "PeerToken.sol");


/*
 * Our state object for module.exports, to export all the compiled contracts
 * for the deployment script
*/
let contractObjects = [];


/*
 * The compile contract function, which will compile an individual contract
*/
const compileContract = input => {
  const compiled = solc.compile({ sources: input }, 1);
  const compiledContract = compiled.contracts;
  console.log("Compilation output", compiled);
  return compiledContract
}


/*
 * The compile contract function, which will write the artifact to the
 * build folder and export the artifact for deployment
*/
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
 * Define compiler imports for all the given contracts we have
*/
const ownedInput = { 'Owned.sol': fs.readFileSync(ownedPath, "utf8") };
const erc20Input = { 'ERC20.sol': fs.readFileSync(erc20Path, "utf8") };
const peerTokenInput = { 'PeerToken.sol': fs.readFileSync(peerTokenPath, "utf8") };
const creditHubInput = { 'CreditHub.sol': fs.readFileSync(creditHubPath, "utf8") };

/*
 * Remove the current build directory
*/
fs.removeSync(buildPath);
fs.ensureDirSync(buildPath);

// Define the actual contract inputs
const erc20 = {...erc20Input};
const compiledERC20 = compileContract(erc20);
writeContractArtifact(compiledERC20, "ERC20");

// Do this for PeerToken
const peerToken = {...peerTokenInput, ...ownedInput, ...erc20Input};
const compiledPeerToken = compileContract(peerToken);
writeContractArtifact(compiledPeerToken, "PeerToken");

// Do this for CreditHub
const creditHub = {...ownedInput, ...creditHubInput};
const compiledCreditHub = compileContract(creditHub);
writeContractArtifact(compiledCreditHub, "CreditHub");

module.exports = contractObjects;
