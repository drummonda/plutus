const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

// Store the build folder and the contract file
const buildPath = path.resolve(__dirname, "..", "build");
const contractPath = path.resolve(__dirname, "..", "contracts", "TodoList.sol");

// Remove the current build directory
fs.removeSync(buildPath);

// Get the content of TodoList.sol
const todoList = fs.readFileSync(contractPath, "utf8");

// Compile the todolist contract code, return the contract object
const compiled = solc.compile(todoList, 1);
const compiledContract = compiled.contracts;

// Console log for the user
console.log("Compilation output", compiled);

// Ensures that the directory build exists
fs.ensureDirSync(buildPath);

// Create a JSON file with the exhibition contract
fs.outputJsonSync(
  path.resolve(buildPath, "todolist.json"),
  compiledContract[":TodoList"]
);

module.exports = compiledContract[":TodoList"];
