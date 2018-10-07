const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");
const Web3 = require("web3");

// Create a new instance of web3 with the correct provider
const web3 = new Web3("http://localhost:8545");

// Grab the todolist contract directory
const contractPath = path.resolve(__dirname, "..", "contracts", "TodoList.sol");

// Get the content of TodoList.sol
const todoList = fs.readFileSync(contractPath, "utf8");

// Compile the todolist contract code, return the contract object
const compiledContract = solc.compile(todoList, 1).contracts;

const getAccount = async () => {
  const accounts = await web3.eth.getAccounts();
  return accounts[0];
}

// Grab the contract
const getDeployedContract = async compiledContract => {
  try {
    const addr = "0xcCd9cb341EA6125E6791AeC189eeCa7602989378";
    const ABI = compiledContract[":TodoList"].interface;
    const TodoList = await new web3.eth.Contract(JSON.parse(ABI), addr);
    return TodoList;
  } catch (err) {
    console.error(err.message);
  }
}

// Send a transaction to the deployed contract
const createTodo = async task => {
  try {
    const myAccount = await getAccount();
    console.log("account", myAccount);
    const deployedContract = await getDeployedContract(compiledContract);
    const result = await deployedContract.methods.createTodo(task).send({ from: myAccount });
    console.log(result);
  } catch (err) {
    console.error(err.message);
  }
}

const completeTodo = async id => {
  try {
    const myAccount = await getAccount();
    console.log("account", myAccount);
    const deployedContract = await getDeployedContract(compiledContract);
    const result = await deployedContract.methods.completeTodo(id).send({ from: myAccount });
    console.log(result);
  } catch (err) {
    console.error(err.message);
  }
}

createTodo("deploy contract without truffle");
// completeTodo(0);
