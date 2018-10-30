const path = require("path");
const fs = require("fs-extra");

/*
 *
 * Directory paths
 *
*/
const buildPath = path.resolve(__dirname, "..", "build");
const ownedPath = path.resolve(__dirname, "..", "contracts", "Owned.sol");
const creditHubPath = path.resolve(__dirname, "..", "contracts", "CreditHub.sol");
const erc20Path = path.resolve(__dirname, "..", "contracts", "ERC20.sol");
const peerTokenPath = path.resolve(__dirname, "..", "contracts", "PeerToken.sol");
const factoryPath = path.resolve(__dirname, "..", "contracts", "Factory.sol");
const loanPath = path.resolve(__dirname, "..", "contracts", "Loan.sol");


/*
 *
 * Remove the current builds directory
 *
*/
fs.removeSync(buildPath);
fs.ensureDirSync(buildPath);

/*
 *
 * Read each contract file and create various inputs
 *
*/
const ownedInput = { 'Owned.sol': fs.readFileSync(ownedPath, 'utf8') };
const erc20Input = { 'ERC20.sol': fs.readFileSync(erc20Path, 'utf8') };
const peerTokenInput = { 'PeerToken.sol': fs.readFileSync(peerTokenPath, 'utf8') };
const creditHubInput = { 'CreditHub.sol': fs.readFileSync(creditHubPath, 'utf8') };
const factoryInput = { 'Factory.sol': fs.readFileSync(factoryPath, 'utf8') };
const loanInput = { 'Loan.sol': fs.readFileSync(loanPath, 'utf8') }

// Define the actual contract inputs
const erc20 = { name: 'ERC20', inputs: {...erc20Input} };
const peerToken = { name: 'PeerToken', inputs: {...peerTokenInput, ...ownedInput, ...erc20Input} };
const creditHub = { name: 'CreditHub', inputs: {...ownedInput, ...creditHubInput} };
const factory = { name: 'Factory', inputs: {...ownedInput, ...factoryInput, ...creditHubInput, ...loanInput}};
const loan = { name: 'Loan', inputs: {...loanInput, ...ownedInput, ...creditHubInput}}

/*
 *
 * Contracts to compile
 *
*/
const contractsToCompile = [ erc20, peerToken, creditHub, factory, loan];

module.exports = {
  buildPath,
  contractsToCompile
}
