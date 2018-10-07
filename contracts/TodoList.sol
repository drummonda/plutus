pragma solidity ^0.4.18;

contract TodoList {

    /*-------------------- EVENT TYPES --------------------*/
    event CreateTodo (
      string task,
      bool complete
    );

    /*-------------------- DATA TYPES --------------------*/

    struct Todo {
        string task;
        bool complete;
    }

    /*--------------------- STORAGE ---------------------*/

    // stores all our todos
    Todo[] todos;

    /*--------------------- CREATION ---------------------*/

    function createTodo(string task) public {
        // create a todo and push it into the storage array
        CreateTodo("new task", false);
        uint id = todos.push(Todo(task, false)) - 1;
    }

    /*-------------------- COMPLETION --------------------*/

    function completeTodo(uint id) public {
        // access the todo in storage
        Todo storage todo = todos[id];
        // mark the todo as complete
        todo.complete = true;
    }

    /*--------------------- QUERYING ---------------------*/

    // on the front end, we can initially call this func to get the total number of todos
    // then create a for loop, loop from (i = 0 => totalToDos) and call returnToDo (seen below)
    function getTotalNumTodos() public view returns (uint){
        return todos.length;
    }

    function returnTodo(uint todoId) public view returns (string task, bool completed) {
        Todo storage todo = todos[todoId];
        task = todo.task;
        completed = todo.complete;
    }
}
