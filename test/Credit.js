const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require("../build/CreditHub.json");

let creditContract, accounts, contractAddress;
const initialSupply = 21000000;

beforeEach(async () => {

  // grab all accounts
  accounts = await web3.eth.getAccounts();

  // deploy the peertoken contract and store the instance
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

  // approve account five to modify user credit scoress
  await creditContract.methods
    .approveContract(accounts[5])
    .send({ from: accounts[0] });

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

  it("initializeUser: owner can initialize a user with a base score", async () => {

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

  it("initializeUser: non-owner cannot initialize a user with a base score", async () => {

    try {

      // Initialize the new user at Account 1
      await creditContract.methods
        .initializeUser(accounts[1])
        .send({ from: accounts[1] });

      assert.fail("Non owner cannot initialize user");

    } catch (err) {

      // Do nothing, this was supposed to fail

    }

  });

  it("approveContract: owner can approve a user or contract to modify the credit scores", async () => {

      await creditContract.methods
        .approveContract(accounts[1])
        .send({ from: accounts[0] });

      const isApproved = await creditContract.methods
        .approved(accounts[1])
        .call();

      assert.equal(isApproved, true);

  });

  it("approveContract: non-owner cannot approve a user or contract to modify the credit scores", async () => {

    try {

      await creditContract.methods
        .approveContract(accounts[1])
        .send({ from: accounts[1] });

      assert.fail("A non-owner cannot approve a contract to modify credit scores!");

    } catch (err) {

      // Do nothing, this was supposed to fail

    }

  });

  it("raiseScore: approved entity can raise a user's score", async () => {

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
      .send({ from: accounts[5] });

    // Grab new base score
    const userNewBaseScore = await creditContract.methods
      .scoreOf(accounts[1])
      .call();

    assert.equal(userInitialBaseScore, 400);
    assert.equal(userNewBaseScore, 410);

  });

  it("raiseScore: non-approved entities cannot raise a user's score", async () => {

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

  it("lowerScore: approved entity can lower a user's score", async () => {

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
      .send({ from: accounts[5] });

    // Grab new base score
    const userNewBaseScore = await creditContract.methods
      .scoreOf(accounts[1])
      .call();

    assert.equal(userInitialBaseScore, 400);
    assert.equal(userNewBaseScore, 390);

  });

  it("lowerScore: non-approved entity cannot lower a user's score", async () => {

    try {

      // Initialize the new user at Account 1
      await creditContract.methods
        .initializeUser(accounts[1])
        .send({ from: accounts[0] });

      // Account 2 cannot lower Account 1's score by 10
      await creditContract.methods
        .lowerScore(accounts[1], 10)
        .send({ from: accounts[2] });

      assert.fail("This should have thrown an error");

    } catch (err) {

      // Do nothing, we expected it to fail

    }

  });

})
