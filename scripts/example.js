const { getContractArtifact } = require("../server/firebase/api");

const getArtifact = async (name) => {
  const artifact = await getContractArtifact(name);
  console.log(artifact);
}

getArtifact('TodoList');
process.exit();
