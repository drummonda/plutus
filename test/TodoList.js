const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require("../build/TodoList");

let todolist, accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  todolist = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: 1000000 });
})

describe("todolist contract", () => {
  it("deploys a contract", () => {
    assert.ok(todolist.options.address);
  });

  it("can create a new todo", async () => {
    await todolist.methods.createTodo("write tests").send({ from: accounts[1] });
    const totalNum = await todolist.methods.getTotalNumTodos().call();
    assert.equal(totalNum, 1);
  });

  it("can fetch a todo", async () => {
    await todolist.methods.createTodo("write tests").send({ from: accounts[1] });
    const { task, completed } = await todolist.methods.returnTodo(0).call();
    assert.equal(task, "write tests");
    assert.equal(completed, false);
  });

  it("can complete a new todo", async () => {
    await todolist.methods.createTodo("write tests").send({ from: accounts[1] });
    await todolist.methods.completeTodo(0).send({ from: accounts[1] });
    const { task, completed } = await todolist.methods.returnTodo(0).call();
    assert.equal(task, "write tests");
    assert.equal(completed, true);
  });
})
