const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require("../build/Factory.json");

let factoryContract, accounts, contractAddress;
const launchBalance = 100;
const interestRate = 10;
const duration = 100;
const gracePeriod = 5;
const strikes = 3;

beforeEach(async () => {

  // Grab all accounts
  accounts = await web3.eth.getAccounts();

  // Deploy the factory contract and store the instance
  factoryContract = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode
    })
    .send({
      from: accounts[0],
      gas: 1500000
    });

  // Store the contract address
  contractAddress = factoryContract.options.address;

  // Send the contract 10 ether
  await web3.eth.sendTransaction({
    from: accounts[3],
    to: contractAddress,
    value: web3.utils.toWei("10", "ether")
  });

});

describe("Factory contract", () => {
  it("deploy: deploys a contract", () => {
    assert.ok(factoryContract.options.address);
  });

  it("initialize: factory has empty array of contract addresses", async () => {
    const numberContracts = await factoryContract.methods
      .getContractCount()
      .call();

    assert.equal(numberContracts, 0);
  });

  it("initialize: factory has a balance of 10 ether", async () => {
    // Grab the ether balance of factory contract
      const contractEthBalance = await web3.eth.getBalance(contractAddress);

    assert.equal(Number(web3.utils.fromWei(contractEthBalance)), 10);
  });

  it("getContractCount: factory returns number of contracts it has created", async () => {
    const numberContracts = await factoryContract.methods
      .getContractCount()
      .call();

    assert.equal(numberContracts, 0);
  });

  it("createNewLoan: factory contract can create a new loan", async () => {

    await factoryContract.methods
      .createNewLoan(launchBalance, interestRate, duration, gracePeriod, strikes)
      .send({ from: accounts[0] });

    const numberContracts = await factoryContract.methods
      .getContractCount()
      .call();

    assert.equal(numberContracts, 1);
  });


})
