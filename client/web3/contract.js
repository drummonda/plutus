import web3 from "./provider"

const ADDRESS = "0xC089532EC58e26Ac8ea5161635e5D5D6b576D264";
const ABI = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "todoId",
        "type": "uint256"
      }
    ],
    "name": "returnTodo",
    "outputs": [
      {
        "name": "task",
        "type": "string"
      },
      {
        "name": "completed",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "completeTodo",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getTotalNumTodos",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "task",
        "type": "string"
      }
    ],
    "name": "createTodo",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "task",
        "type": "string"
      },
      {
        "indexed": false,
        "name": "complete",
        "type": "bool"
      }
    ],
    "name": "CreateTodo",
    "type": "event"
  }
]

export default new web3.eth.Contract(ABI, ADDRESS);
