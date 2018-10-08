const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");
const buildPath = path.resolve(__dirname, "..", "build");
const contractsPath = path.resolve(__dirname, "..", "contracts");
const artifactsPath = path.resolve(__dirname, "..", "client", "artifacts");
let contractObjects = [];

const compileContract = contract => {
  const compiled = solc.compile(contract, 1);
  const compiledContract = compiled.contracts;
  console.log("Compilation output", compiled);
  return compiledContract
}

const writeContractArtifact = (compiledContract, ABI, contractName) => {
  const fileName = `${contractName}.json`;
  const key = `:${contractName}`;
  const contractObject = {name: contractName, ...compiledContract[key]};
  fs.outputJsonSync(
    path.resolve(buildPath, fileName),
    contractObject
  );
  contractObjects = [...contractObjects, contractObject];
}

fs.removeSync(buildPath);
fs.ensureDirSync(buildPath);
fs.ensureDirSync(artifactsPath);

fs.readdirSync(contractsPath).forEach(async file => {
  const contractName = file.split('.').slice(0, 1)[0];
  const filePath = path.resolve(contractsPath, file);
  const contract = fs.readFileSync(filePath, 'utf8');
  const compiledContract = compileContract(contract);
  const ABI = JSON.parse(compiledContract[`:${contractName}`].interface);
  writeContractArtifact(compiledContract, ABI, contractName);
});

module.exports = contractObjects;
