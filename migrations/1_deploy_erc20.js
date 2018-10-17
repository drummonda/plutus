const path = require("path");
const fs = require("fs-extra");

// Actually read the contents of the build file
const peerPath = path.resolve(__dirname, "..", "build", "PeerToken.json");
const contents = JSON.parse(fs.readFileSync(peerPath, "utf8"));

// Grab important variables from the compiled contract
const { name, interface, bytecode } = contents;

module.exports = async deploy => {
  const ABI = interface;
  const args = [21000000, "PeerToken", "PTK"];
  const data = { data: bytecode, arguments: args};
  deploy("ERC20", ABI, data);
}
