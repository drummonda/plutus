const fs = require("fs-extra");
const path = require("path");
const solc = require("solc");
const { buildPath, contractsToCompile } = require("./utils");

/*
 *
 * Contract objects post-compile, to export
 *
*/
let contractObjects = [];


/*
 *
 * Write contracts to the build folder
 *
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
 *
 * Compile a contract given its sub-contract inputs
 *
*/
const compileContract = input => {
  const compiled = solc.compile({ sources: input }, 1);
  const compiledContract = compiled.contracts;
  console.log("Compilation output", compiled);
  return compiledContract
}


/*
 *
 * Actually execute the compile and write for each contract provided
 *
*/
contractsToCompile.forEach(contract => {
  const { name, inputs } = contract;
  const compiledContract = compileContract(inputs);
  writeContractArtifact(compiledContract, name);
})

module.exports = contractObjects;
