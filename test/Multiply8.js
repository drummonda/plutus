const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require("../build/multiply8");

let multiply8;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  multiply8 = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: 1000000 });
})

describe("multiply8 contract", () => {
  it("deploys a contract", () => {
    assert.ok(multiply8.options.address);
  });

  it("can multiply a number by 8", async () => {
    const result = await multiply8.methods.multiply(5).send({ from: accounts[1] });
    console.log("totalNum", result);
    assert.equal(result, 40);
  });

})
