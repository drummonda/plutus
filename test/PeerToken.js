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
    .send({ from: accounts[0], gas: 1500000 });

  // Store the contract address
  contractAddress = peerTokenContract.options.address;

  // Set token prices to 1 ETH
  await peerTokenContract.methods
    .setPrices(1, 1)
    .send({ from: accounts[0] });

  // Send the contract 10 ether
  await web3.eth.sendTransaction({
    from: accounts[3],
    to: contractAddress,
    value: web3.utils.toWei("5", "ether")
  });

});

describe("peerToken contract", () => {
  it("deploy: deploys a contract", () => {
    assert.ok(peerTokenContract.options.address);
  });

  it("initialize: token has name, symbol and totalSupply", async () => {
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

  it("balanceOf: balance of deployer is equal to initial supply", async () => {
    const balanceOfSender = await peerTokenContract.methods
      .balanceOf(accounts[0])
      .call();

    assert.equal(balanceOfSender, initialSupply);
  });

  it("setPrices: the contract owner can set its token prices", async () => {
    try {

      await peerTokenContract.methods
        .setPrices(4, 5)
        .send({ from: accounts[0] });
      const sellPrice = await peerTokenContract.methods
        .sellPrice()
        .call();
      const buyPrice = await peerTokenContract.methods
        .buyPrice()
        .call();

      assert.equal(sellPrice, 4);
      assert.equal(buyPrice, 5);

    } catch (err) {

      assert.fail(err.message);

    }
  });

  it("owned: a non-owner cannot set token prices", async () => {
    try {

      await peerTokenContract.methods
        .setPrices(4, 5)
        .send({ from: accounts[1] });

      assert.fail('The test should have thrown an erorr');

    } catch (err) {

      // Let the test pass, there was supposed to be an error

    }
  });

  it("mintToken: the contract owner can mint new tokens", async () => {
    try {

      // Grab the old token supply
      const oldTokenSupply = await peerTokenContract.methods
        .totalSupply()
        .call();

      // Mint 10 new tokens
      await peerTokenContract.methods
        .mintToken(accounts[1], 10)
        .send({ from: accounts[0] });
      const newTokenBalance = await peerTokenContract.methods
        .balanceOf(accounts[1])
        .call();
      const newTokenSupply = await peerTokenContract.methods
        .totalSupply()
        .call();

      assert.equal(oldTokenSupply < newTokenSupply, true);
      assert.equal(newTokenBalance, 10);

    } catch (err) {

      assert.fail(err.message);

    }
  });

  it("buy: user can buy tokens from the contract", async () => {
    try {

      // Grab the previous contract balance
      const previousContractBalance = await peerTokenContract.methods
        .balanceOf(contractAddress)
        .call();

      // Account 1 buys 10 ether worth of PeerTokens
      await peerTokenContract.methods
        .buy()
        .send({
          from: accounts[1],
          value: 10,
        });

      // Grab the new token balance of Account 1
      const newAccountBalance = await peerTokenContract.methods
        .balanceOf(accounts[1])
        .call();

      // Grab the new token balance of this contract
      const newContractBalance = await peerTokenContract.methods
        .balanceOf(contractAddress)
        .call();

      // Grab the new ether balance of this contract
      const contractEthBalance = await web3.eth.getBalance(contractAddress);

      assert.equal(Number(newAccountBalance), 10);
      assert.equal(Number(newContractBalance), Number(previousContractBalance) - 10);
      assert.equal(Number(web3.utils.fromWei(contractEthBalance)), 5);

    } catch (err) {

      assert.fail(err.message);

    }
  })

  it("sell: user can sell tokens to the contract", async () => {
    try {

      // Account 2 buys 10 ether worth of tokens
      await peerTokenContract.methods
        .buy()
        .send({
          from: accounts[2],
          value: 10,
        });

      // Grab the previous contract balance of tokens
      const previousContractBalance = await peerTokenContract.methods
        .balanceOf(contractAddress)
        .call();

      // Account 2 sells 2 tokens to the contract
      await peerTokenContract.methods
        .sell(2)
        .send({ from: accounts[2] });

      // Grab the new PeerToken balance of Account 2
      const newAccountBalance = await peerTokenContract.methods
        .balanceOf(accounts[2])
        .call();

      // Grab the new contract balance of tokens
      const newContractBalance = await peerTokenContract.methods
        .balanceOf(contractAddress)
        .call();

      // Grab the new contract balance of ether
      const contractEthBalance = await web3.eth.getBalance(contractAddress);

      assert.equal(newAccountBalance, 8);
      assert.equal(Number(newContractBalance), Number(previousContractBalance) + 2);

    } catch (err) {

      assert.fail(err.message);

    }
  });



})
