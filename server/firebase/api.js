const database = require("./index");

async function addContractArtifact(contractName, artifact) {
  try {
    const contractRef = await database.ref().child('contracts').child(contractName);
    await contractRef.update({...artifact});
    return;
  } catch(err) {
    console.error(err);
  }
}

async function getContractArtifact(name) {
  try {
    let artifact = null;
    const contractRef = await database.ref().child('contracts');
    await contractRef.once("value", snapshot => {
      snapshot.forEach(child => {
        if(child.key === name) {
          artifact = child.val();
        }
      })
    });
    return artifact;
  } catch(err) {
    console.error(err);
  }
}

module.exports = { addContractArtifact, getContractArtifact }
