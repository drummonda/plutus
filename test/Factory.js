const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const web3 = new Web3(ganache.provider());
const CreditHub = require("../build/CreditHub.json");
const Factory = require("../build/Factory.json");

let factoryContract,
    creditContract,
    accounts,
    factoryContractAddress,
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
  factoryContract = await new web3.eth.Contract(JSON.parse(Factory.interface))
    .deploy({
      data: Factory.bytecode,
      arguments: [creditContractAddress]
    })
    .send({
      from: accounts[0],
      gas: 1500000
    });

  // Store the contract address
  factoryContractAddress = factoryContract.options.address;

});

describe("Factory contract", () => {
  it("deploy: deploys a contract", () => {
    assert.ok(factoryContract.options.address);
  });

  it("initialize: factory has empty array of contract addresses", async () => {
    const numberContracts = await factoryContract.methods
      .loanCount()
      .call();

    assert.equal(numberContracts, 0);
  });

  it("loanCount: factory returns number of loan contracts it has created", async () => {
    const numberContracts = await factoryContract.methods
      .loanCount()
      .call();

    assert.equal(numberContracts, 0);
  });

  it("createNewLoan: factory contract can create a new loan", async () => {

    await factoryContract.methods
      .createNewLoan(
                    loanLaunchBalance,
                    loanInterestRate,
                    loanDuration,
                    loanGracePeriod,
                    loanStrikes,
                    creditContractAddress
                    )
      .send({
       from: accounts[0],
       gas: 1500000
      });

    const numberContracts = await factoryContract.methods
      .loanCount()
      .call();

    assert.equal(numberContracts, 1);
  });

  it("createNewLoan: non-owner of factory contract cannot create a new loan", async () => {

    try {

      await factoryContract.methods
        .createNewLoan(
                       loanLaunchBalance,
                       loanInterestRate,
                       loanDuration,
                       loanGracePeriod,
                       loanStrikes,
                       creditContractAddress
                       )
        .send({
         from: accounts[1],
         gas: 1500000
        });

      assert.fail("This test was supposed to throw an error");

    } catch(err) {

      // Do nothing, the test was supposed to throw an error

    }


  });

  it("loans mapping: factory contract keeps track of the loan contract addresses", async () => {

    await factoryContract.methods
      .createNewLoan(
                     loanLaunchBalance,
                     loanInterestRate,
                     loanDuration,
                     loanGracePeriod,
                     loanStrikes,
                     creditContractAddress
                     )
      .send({
       from: accounts[0],
       gas: 1500000
      });

    const loanContractAddress = await factoryContract.methods
      .loans(0)
      .call();

    assert.ok(loanContractAddress);
    assert.equal(web3.utils.isAddress(loanContractAddress), true);
  });

  it("payable: factory contract can accept ether", async () => {
    // Send the contract 10 ether
    await web3.eth.sendTransaction({
      from: accounts[3],
      to: factoryContractAddress,
      value: web3.utils.toWei("10", "ether")
    });

    const factoryContractBalance = await web3.eth.getBalance(factoryContractAddress);

    assert.equal(Number(web3.utils.fromWei(factoryContractBalance)), 10);

  });

  it("getContract: factory contract allows retrieval of contract details by contract id", async () => {
    await factoryContract.methods
      .createNewLoan(
                     loanLaunchBalance,
                     loanInterestRate,
                     loanDuration,
                     loanGracePeriod,
                     loanStrikes,
                     creditContractAddress
                     )
      .send({
       from: accounts[0],
       gas: 1500000
      });

    const loanContractAddress = await factoryContract.methods
      .loans(0)
      .call();

    const {
            currentBalance,
            launchBalance,
            interestRate,
            duration,
            strikes,
            launched
          } = await factoryContract.methods
          .getContract(0)
          .call();

    assert.equal(currentBalance, 0);
    assert.equal(launchBalance, loanLaunchBalance);
    assert.equal(interestRate, loanInterestRate);
    assert.equal(duration, loanDuration);
    assert.equal(strikes, loanStrikes);
    assert.equal(launched, false);
  })

})
