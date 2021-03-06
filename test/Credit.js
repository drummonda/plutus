const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require("../build/Factory.json");

let creditContract, accounts, contractAddress, loanContractAddress;

// factory contract constructor arguments
const _minScore = 0;
const _maxScore = 800;
const _baseScore = 400;

// loan contract constructor arguments
const loanLaunchBalance = 100;
const loanInterestRate = 10;
const loanDuration = 100;
const loanGracePeriod = 5;
const loanStrikes = 3;

const initialSupply = 21000000;

beforeEach(async () => {

  // grab all accounts
  accounts = await web3.eth.getAccounts();

  // deploy the peertoken contract and store the instance
  creditContract = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: [_minScore, _maxScore, _baseScore]
    })
    .send({
      from: accounts[0],
      gas: 1500000
    });

  // Store the contract address
  contractAddress = creditContract.options.address;

  await creditContract.methods
      .createNewLoan(
                    loanLaunchBalance,
                    loanInterestRate,
                    loanDuration,
                    loanGracePeriod,
                    loanStrikes,
                    contractAddress
                    )
      .send({
       from: accounts[0],
       gas: 1500000
      });

  // set the loan contract address equal to the one that
  // was just created
  loanContractAddress = await creditContract.methods
    .loans(0)
    .call();

  // Send the contract 10 ether
  await web3.eth.sendTransaction({
    from: accounts[3],
    to: loanContractAddress,
    value: web3.utils.toWei("5", "ether")
  });

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

  it("approveContract: credit contract can approve a user or contract to modify the credit scores", async () => {

      const isApproved = await creditContract.methods
        .approved(loanContractAddress)
        .call();

      assert.equal(isApproved, true);

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
