const solc = require("solc");

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

module.exports = {
  compileContract,
  writeContractArtifact
}
