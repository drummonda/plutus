const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require("../build/Credit.json");

let creditContract, accounts, contractAddress;
const initialSupply = 21000000;

beforeEach(async () => {

  // Grab all accounts
  accounts = await web3.eth.getAccounts();

  // Deploy the peertoken contract and store the instance
  creditContract = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: [0, 800, 400]
    })
    .send({
      from: accounts[0],
      gas: 1500000
    });

  // Store the contract address
  contractAddress = creditContract.options.address;

});

describe("Credit contract", () => {
  it("deploy: deploys a contract", () => {
    assert.ok(creditContract.options.address);
  });

  it("initialize: token has a min score, max score and base score", async () => {
    const min = await creditContract.methods
      .min()
      .call();
    const max = await creditContract.methods
      .max()
      .call();
    const base = await creditContract.methods
      .base()
      .call();

    assert.equal(min, 0);
    assert.equal(max, 800);
    assert.equal(base, 400);
  });

  it("initialize: has an owner who is the deployer", async () => {
    const owner = await creditContract.methods
      .owner()
      .call();

    assert.equal(owner, accounts[0]);
  });

  it("initializeUser: can initialize a user with a base score", async () => {

    // Initialize the new user at Account 1
    await creditContract.methods
      .initializeUser(accounts[1])
      .send({ from: accounts[0] });

    // Does the user exist, and is the base score as expected?
    const userBaseScore = await creditContract.methods
      .scoreOf(accounts[1])
      .call();

    assert.equal(userBaseScore, 400);
  });

  it("raiseScore: owner can raise a user's score", async () => {

    // Initialize the new user at Account 1
    await creditContract.methods
      .initializeUser(accounts[1])
      .send({ from: accounts[0] });

    // Grab the user's base score
    const userInitialBaseScore = await creditContract.methods
      .scoreOf(accounts[1])
      .call();

    // Account 0 (deployer) can raise score by 10
    await creditContract.methods
      .raiseScore(accounts[1], 10)
      .send({ from: accounts[0] });

    // Grab new base score
    const userNewBaseScore = await creditContract.methods
      .scoreOf(accounts[1])
      .call();

    assert.equal(userInitialBaseScore, 400);
    assert.equal(userNewBaseScore, 410);

  });

  it("raiseScore: non-owner cannot raise a user's score", async () => {

    try {

      // Initialize the new user at Account 1
      await creditContract.methods
        .initializeUser(accounts[1])
        .send({ from: accounts[0] });

      // Account 1 cannot raise score by 10
      await creditContract.methods
        .raiseScore(accounts[1], 10)
        .send({ from: accounts[1] });

      assert.fail("This should have thrown an error");

    } catch (err) {

      // Do nothing, we expected it to fail

    }

  });

  it("lowerScore: owner can lower a user's score", async () => {

    // Initialize the new user at Account 1
    await creditContract.methods
      .initializeUser(accounts[1])
      .send({ from: accounts[0] });

    // Grab the user's base score
    const userInitialBaseScore = await creditContract.methods
      .scoreOf(accounts[1])
      .call();

    // Account 0 (deployer) can raise score by 10
    await creditContract.methods
      .lowerScore(accounts[1], 10)
      .send({ from: accounts[0] });

    // Grab new base score
    const userNewBaseScore = await creditContract.methods
      .scoreOf(accounts[1])
      .call();

    assert.equal(userInitialBaseScore, 400);
    assert.equal(userNewBaseScore, 390);

  })

})
