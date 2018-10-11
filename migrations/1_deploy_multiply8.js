const { addContractArtifact } = require("../server/firebase/api");

module.exports = async (web3, accounts, ABI, bytecode) => {
  try {
    const contract = await new web3.eth.Contract(JSON.parse(ABI));
    const deployed = await contract.deploy({ data: bytecode });
    const sent = await deployed.send({
     from: accounts[0],
     gas: 3000000,
   });
    const address = sent.options.address;
    const artifact = { address, abi: JSON.parse(ABI) };
    await addContractArtifact("Multiply8", artifact);
    console.log("Deployed on:", address);
    return;
  } catch (err) {
    console.error(err);
  }
}
