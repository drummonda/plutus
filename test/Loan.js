const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const web3 = new Web3(ganache.provider());
const CreditHub = require("../build/CreditHub.json");
const Loan = require("../build/Loan.json");

let loanContract,
    creditContract,
    accounts,
    loanContractAddress,
    creditContractAddress;

const loanLaunchBalance = 100;
const loanInterestRate = 10;
const loanDuration = 100;
const loanGracePeriod = 5;
const loanStrikes = 3;

beforeEach(async () => {

  // Grab all accounts
  accounts = await web3.eth.getAccounts();

  // Deploy the credit hub contract and store the instance
  creditContract = await new web3.eth.Contract(JSON.parse(CreditHub.interface))
    .deploy({
      data: CreditHub.bytecode,
      arguments: [0, 800, 400]
    })
    .send({
      from: accounts[0],
      gas: 1500000
    });

  // Store the credit hub contract address
  creditContractAddress = creditContract.options.address;

  // Deploy the factory contract and store the instance
  loanContract = await new web3.eth.Contract(JSON.parse(Loan.interface))
    .deploy({
      data: Loan.bytecode,
      arguments: [
                  loanLaunchBalance,
                  loanInterestRate,
                  loanDuration,
                  loanGracePeriod,
                  loanStrikes,
                  creditContractAddress
                 ]
    })
    .send({
      from: accounts[0],
      gas: 1500000
    });

  // Store the contract address
  loanContractAddress = loanContract.options.address;

});

describe("Loan contract", () => {
  it("deploy: deploys a contract", () => {
    assert.ok(loanContract.options.address);
  });

  it("initialize: loan contract has public variables with loan details", async () => {
    const currentBalance = await loanContract.methods
      .currentBalance()
      .call();
    const launchBalance = await loanContract.methods
      .launchBalance()
      .call();
    const duration = await loanContract.methods
      .duration()
      .call();
    const interestRate = await loanContract.methods
      .interestRate()
      .call();
    const gracePeriod = await loanContract.methods
      .gracePeriod()
      .call();
    const strikes = await loanContract.methods
      .strikes()
      .call();

    assert.equal(currentBalance, 0);
    assert.equal(launchBalance, loanLaunchBalance);
    assert.equal(duration, loanDuration);
    assert.equal(interestRate, loanInterestRate);
    assert.equal(gracePeriod, loanGracePeriod);
    assert.equal(strikes, loanStrikes);
  });

  it("creditContract: loan keeps track of associated credit contract", async () => {
    const assocCreditContract = await loanContract.methods
      .creditContract()
      .call();

    assert.equal(assocCreditContract, creditContractAddress);
  });


})
