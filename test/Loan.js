const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const web3 = new Web3(ganache.provider());
const Loan = require("../build/Loan.json");
const PeerToken = require("../build/PeerToken");
const Factory = require("../build/Factory.json");

let loanContract,
    peerTokenContract,
    factoryContract,
    accounts,
    loanContractAddress,
    peerTokenContractAddress,
    factoryContractAddress,
    creditContractAddress;

const initialSupply = 21000000;
const loanLaunchBalance = 100;
const loanInterestRate = 10;
const loanDuration = 100;
const loanGracePeriod = 5;
const loanStrikes = 3;

const _minScore = 0;
const _maxScore = 800;
const _baseScore = 400;

beforeEach(async () => {

  // Grab all accounts
  accounts = await web3.eth.getAccounts();

  // Deploy the PeerToken contract and store the instance
  peerTokenContract = await new web3.eth.Contract(JSON.parse(PeerToken.interface))
    .deploy({
      data: PeerToken.bytecode,
      arguments: [initialSupply, 'PeerToken', 'PTK']
    })
    .send({ from: accounts[0], gas: 1500000 });

  peerTokenContractAddress = peerTokenContract.options.address;

  // Deploy the factory contract and store the instance
  factoryContract = await new web3.eth.Contract(JSON.parse(Factory.interface))
    .deploy({
      data: Factory.bytecode,
      arguments: [_minScore, _maxScore, _baseScore]
    })
    .send({
      from: accounts[0],
      gas: 1500000
    });

  // Store the contract address
  factoryContractAddress = factoryContract.options.address;

  // Create a new loan from the factory contract
  // We have to do it this way, since the loan is only approved
  // to modify the credit contract via the factory contract
  // which inherits the approve contract method from the credit hub
  await factoryContract.methods
      .createNewLoan(
                    loanLaunchBalance,
                    loanInterestRate,
                    loanDuration,
                    loanGracePeriod,
                    loanStrikes,
                    factoryContractAddress
                    )
      .send({
       from: accounts[0],
       gas: 1500000
      });

  loanContractAddress = await factoryContract.methods
      .loans(0)
      .call();

  // Instantiate a new loan contract that we can call methods
  // on via web3, which is what the user will be able to do
  // from our front end
  loanContract = new web3.eth.Contract(JSON.parse(Loan.interface), loanContractAddress, {
    from: accounts[0]
  });

  // Send Account 2 100 PTK from the main contract
  await peerTokenContract.methods
        .transfer(accounts[2], 100)
        .send({ from: accounts[0] });

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

    assert.equal(assocCreditContract, factoryContractAddress);
  });

  it("addInvestment: when an account transfers PTK to loan it keeps track of balance invested", async () => {

    // Account 2 will send 10 PTK to the loan contract via the
    // invest function on PeerToken
    await peerTokenContract.methods
      .invest(loanContractAddress, 10)
      .send({ from: accounts[2] });

    // The loanContractAddress will now have 10 PTK associated with it
    const balanceOfLoanContract = await peerTokenContract.methods
      .balanceOf(loanContractAddress)
      .call();

    // The loan contract now stores an investment made by that account
    const amountInvestedByAccount = await loanContract.methods
      .investors(accounts[2])
      .call();

    assert.equal(balanceOfLoanContract, 10);
    assert.equal(amountInvestedByAccount, 10);
    assert.equal(balanceOfLoanContract, amountInvestedByAccount);
  })


})
