/*
  Implement a class `Todo` having below methods
    - add(todo): adds todo to list of todos
    - remove(indexOfTodo): remove todo from list of todos
    - update(index, updatedTodo): update todo at given index
    - getAll: returns all todos
    - get(indexOfTodo): returns todo at given index
    - clear: deletes all todos

  Once you've implemented the logic, test your code by running
  - `npm run test-todo-list`
*/

class Todo {
    constructor(name, description) {
        this.todos = [];
    }

    addTodo(todo) {
        this.todos.push(todo);
    }

    removeTodo(index) {
        if (index >= 0 && index < this.todos.length) {
            this.todos.splice(index, 1);
        } else {
            throw new Error("Invalid todo index");
        }
    }

    updateTodo(index, updatedTodo) {
        if (index >= 0 && index < this.todos.length) {
            this.todos[index] = updatedTodo;
        } else {
            throw new Error("Invalid todo index");
        }
    }

    getAll() {
        return this.todos;
    }

    get(index) {
        if (index >= 0 && index < this.todos.length) {
            return this.todos[index];
        } else {
            throw new Error("Invalid todo index");
        }
    }

    clear() {
        this.todos = [];
    }
}

export { Todo };
