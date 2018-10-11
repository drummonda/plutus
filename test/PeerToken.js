const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require("../build/PeerToken");

let peerTokenContract;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  peerTokenContract = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: [21000000, 'PeerToken', 'PTK'] })
    .send({ from: accounts[0], gas: 1000000 });
})

describe("peerToken contract", () => {
  it("deploys a contract", () => {
    assert.ok(peerTokenContract.options.address);
  });

  it("has name, symbol and totalSupply", async () => {
    console.log(peerTokenContract.methods.name.call());
    // assert.equal(peerTokenContract.name, "PeerToken");
    // assert.equal(peerTokenContract.symbol, "PTK");
    // assert.equal(peerTokenContract.initialSupply, 21000000);
  });

})
