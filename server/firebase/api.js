const firebase = require("./index");

async function addContractArtifact(artifact) {
  try {
    const contractRef = await firebase.database().ref().child('contracts').child(artifact.name);
    await contractRef().update({...artifact});
  } catch(err) {
    console.error(err);
  }
}

async function getContractArtifact(name) {
  try {
    const contractRef = await firebase.database().ref().child('contracts').child(name);
    return contractRef;
  } catch(err) {
    console.error(err);
  }
}

module.exports = { addContractArtifact, getContractArtifact }
