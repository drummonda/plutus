const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require("../build/PeerToken");

let peerTokenContract, accounts, contractAddress;
const initialSupply = 21000000;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  peerTokenContract = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: [initialSupply, 'PeerToken', 'PTK'] })
    .send({ from: accounts[0], gas: 1000000 });
  await peerTokenContract.methods.owned().send({ from: accounts[0] });
  await peerTokenContract.methods.setPrices(1, 1).send({ from: accounts[0] });
})

describe("peerToken contract", () => {
  it("deploys a contract", () => {
    assert.ok(peerTokenContract.options.address);
  });

  it("has name, symbol and totalSupply", async () => {
    const name = await peerTokenContract.methods.name().call();
    const symbol = await peerTokenContract.methods.symbol().call();
    const totalSupply = await peerTokenContract.methods.totalSupply().call();
    assert.equal(name, "PeerToken");
    assert.equal(symbol, "PTK");
    assert.equal(totalSupply, 3780000000);
  });

  it("balance of deployer is equal to initial supply", async () => {
    const balanceOfSender = await peerTokenContract.methods.balanceOf(accounts[0]).call();
    assert.equal(balanceOfSender, initialSupply);
  });

  it("the contract owner can set its token prices", async () => {
    try {
      await peerTokenContract.methods.setPrices(4, 5).send({ from: accounts[0] });
      const sellPrice = await peerTokenContract.methods.sellPrice().call();
      const buyPrice = await peerTokenContract.methods.buyPrice().call();
      assert.equal(sellPrice, 4);
      assert.equal(buyPrice, 5);
    } catch (err) {
      assert.fail(err.message);
    }
  });

  it("a non-owner cannot set token prices", async () => {
    try {
      await peerTokenContract.methods.setPrices(4, 5).send({ from: accounts[1] });
      assert.fail('The test should have thrown an erorr')
    } catch (err) {
      // This was supposed to happen
    }
  });

  it("the contract owner can mint new tokens", async () => {
    try {
      const oldTokenSupply = await peerTokenContract.methods.totalSupply().call();
      await peerTokenContract.methods.mintToken(accounts[1], 10).send({ from: accounts[0] });
      const newTokenBalance = await peerTokenContract.methods.balanceOf(accounts[1]).call();
      const newTokenSupply = await peerTokenContract.methods.totalSupply().call();
      assert.equal(oldTokenSupply < newTokenSupply, true);
      assert.equal(newTokenBalance, 10);
    } catch (err) {
      assert.fail(err.message);
    }
  });

  it("user can buy tokens from the contract", async () => {
    try {
      const amount = await peerTokenContract.methods.buy().send({ from: accounts[1], value: 10 });
      assert.equal(amount, 10);
    } catch (err) {
      assert.fail(err.message);
    }
  })

})
