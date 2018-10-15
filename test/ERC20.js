const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require("../build/PeerToken");

let peerTokenContract, accounts, contractAddress;
const initialSupply = 21000000;

beforeEach(async () => {

  // Grab all accounts
  accounts = await web3.eth.getAccounts();

  // Deploy the peertoken contract and store the instance
  peerTokenContract = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: [initialSupply, 'PeerToken', 'PTK']
    })
    .send({
      from: accounts[0],
      gas: 1500000
    });

  // Store the contract address
  contractAddress = peerTokenContract.options.address;

  // Set the contract owner to accounts[0]
  await peerTokenContract.methods
    .owned()
    .send({ from: accounts[0] });

  // Set token prices to 1 ETH
  await peerTokenContract.methods
    .setPrices(1, 1)
    .send({ from: accounts[0] });

});

describe("ERC20 contract", () => {
  it("deploy: deploys a contract", () => {
    assert.ok(peerTokenContract.options.address);
  });

  it("initialize: token has a name, symbol, tokenSupply", async () => {
    const name = await peerTokenContract.methods
      .name()
      .call();
    const symbol = await peerTokenContract.methods
      .symbol()
      .call();
    const totalSupply = await peerTokenContract.methods
      .totalSupply()
      .call();

    assert.equal(name, "PeerToken");
    assert.equal(symbol, "PTK");
    assert.equal(totalSupply, 7560000000);
  });

  it("transfer: a user can transfer their tokens to someone else", async () => {
    try {
      const success = await peerTokenContract.methods
        .transfer(accounts[1], 12)
        .send({ from: accounts[0] });
      const newAccountBalance = await peerTokenContract.methods
        .balanceOf(accounts[1])
        .call();

      // assert.equal(success, true);
      assert.equal(newAccountBalance, 12);

    } catch (err) {

      assert.fail(err);

    }
  });


  it("approve: a user can authorize someone else to transfer their tokens", async () => {
    try {

      // Send Account 1 100 PeerTokens
      await peerTokenContract.methods
        .transfer(accounts[1], 100)
        .send({ from: accounts[0] });

      // Account 1 authorizes Account 2 to spend up to 12 tokens
      await peerTokenContract.methods
        .approve(accounts[2], 12)
        .send({ from: accounts[1] });

      // Account 2 authorized to transfer tokens on behalf of Account 1 to Account 3
      const numTokensApproved = await peerTokenContract.methods
        .allowance(accounts[1], accounts[2])
        .call();

      assert.equal(numTokensApproved, 12);

    } catch (err) {

      assert.fail(err);

    }
  });

  it("transferFrom: an authorized user can transfer another account's tokens", async () => {
    try {

      // Send Account 1 100 PeerTokens
      await peerTokenContract.methods
        .transfer(accounts[1], 100)
        .send({ from: accounts[0] });

      // Account 1 authorizes Account 2 to spend up to 12 tokens
      await peerTokenContract.methods
        .approve(accounts[2], 12)
        .send({ from: accounts[1] });

      // Is account 2 authorized to spend any tokens on behalf of Account 1
      const numTokensApproved = await peerTokenContract.methods
        .allowance(accounts[1], accounts[2])
        .call();

      // Account 2 can transfer tokens to Account 3 on behalf of Account 1
      await peerTokenContract.methods
        .transferFrom(accounts[1], accounts[3], 11)
        .send({ from: accounts[2] });

      // Balance of Account 3
      const balanceAccount3 = await peerTokenContract.methods
        .balanceOf(accounts[3])
        .call();

      // Balance of Account 1
      const balanceAccount1 = await peerTokenContract.methods
        .balanceOf(accounts[1])
        .call();

      assert.equal(Number(balanceAccount3), 11);
      assert.equal(Number(balanceAccount1), 89);


    } catch (err) {

      assert.fail(err);

    }
  });

  it("burn: a user can burn their tokens", async () => {

    // Send Account 1 100 PeerTokens
    await peerTokenContract.methods
      .transfer(accounts[1], 100)
      .send({ from: accounts[0] });

    // Get total token supply pre burn
    const totalSupplyPreBurn = await peerTokenContract.methods
      .totalSupply()
      .call();

    // Get Account 1 balance pre burn
    const accountBalancePreBurn = await peerTokenContract.methods
      .balanceOf(accounts[1])
      .call();

    // Account 1 does not like this! They burn their tokens
    await peerTokenContract.methods
      .burn(100)
      .send({ from: accounts[1] });

    // Get Account 1 balance post burn
    const accountBalancePostBurn = await peerTokenContract.methods
      .balanceOf(accounts[1])
      .call();

    // Get total token supply post burn
    const totalSupplyPostBurn = await peerTokenContract.methods
      .totalSupply()
      .call();

    assert.equal(Number(accountBalancePreBurn), 100);
    assert.equal(Number(accountBalancePostBurn), 0);
    assert.equal(Number(totalSupplyPreBurn), Number(totalSupplyPostBurn) + 100);
  })

  it("burnFrom: an authorized user can burn another user's tokens", async () => {
    try {

      // Send Account 1 100 PeerTokens
    await peerTokenContract.methods
      .transfer(accounts[1], 100)
      .send({ from: accounts[0] });

    // Get total token supply pre burn
    const totalSupplyPreBurn = await peerTokenContract.methods
      .totalSupply()
      .call();

    // Get Account 1 balance pre burn
    const accountBalancePreBurn = await peerTokenContract.methods
      .balanceOf(accounts[1])
      .call();

    // Account 1 authorizes Account 3 to burn their tokens
    await peerTokenContract.methods
      .approve(accounts[3], 100)
      .send({ from: accounts[1] });

    // Mwahaha Account 3 burns Account 1's tokens
    await peerTokenContract.methods
      .burnFrom(accounts[1], 100)
      .send({ from: accounts[3] });

    // Get Account 1 balance post burn, sad :(
    const accountBalancePostBurn = await peerTokenContract.methods
      .balanceOf(accounts[1])
      .call();

    // Get total token supply post burn
    const totalSupplyPostBurn = await peerTokenContract.methods
      .totalSupply()
      .call();

    assert.equal(Number(accountBalancePreBurn), 100);
    assert.equal(Number(accountBalancePostBurn), 0);
    assert.equal(Number(totalSupplyPreBurn), Number(totalSupplyPostBurn) + 100);

    } catch (err) {
      assert.fail(err.message);
    }
  })

})
