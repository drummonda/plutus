import web3 from "./provider"
import database from "../firebase"

export default async function getContractArtifact(name) {
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
    console.log(artifact)
    return new web3.eth.Contract(artifact.abi, artifact.address);
  } catch(err) {
    console.error(err);
  }
}

