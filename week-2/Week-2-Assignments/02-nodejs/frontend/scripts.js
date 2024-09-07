function fetchTodos() {
    fetch("http://localhost:3000/todos", {
        method: "GET"
    }).then(function (res) {
        res.json().then(function (data) {
            // Create HTML for all todos
            let todosHtml = "<table border='1'><tr><th>Title</th><th>Description</th><th>Actions</th></tr>";

            data.todos.forEach(function (todo) {
                todosHtml += `
                    <tr>
                        <td>${todo.title}</td>
                        <td>${todo.description}</td>
                        <td>
                            <button onclick="removeTodo('${todo.id}')">Delete</button>
                        </td>
                    </tr>
                `;
            });

            todosHtml += "</table>";

            // Display the todos in the "all-todos" div
            document.querySelector('.all-todos').innerHTML = todosHtml;
        });
    });
}

window.onload = function() {
    fetchTodos();
};

function addTodo() {
    const title = document.querySelector("#todo-title").value;
    const description = document.querySelector("#todo-description").value;

    fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title: title, description: description })
    }).then(function() {
        fetchTodos();
    });
}

function removeTodo(todoId) {
    fetch(`http://localhost:3000/todos/${todoId}`, {
        method: "DELETE"
    }).then(function() {
        fetchTodos();
    });
}

function todoByID() {
    const todoId = document.querySelector("#todo-id").value;
    fetch(`http://localhost:3000/todos/${todoId}`, {
        method: "GET"
    }).then(function(res) {
        res.json().then(function (data) {
            let todosHtml = "<table border='1'><tr><th>Title</th><th>Description</th><th>Actions</th></tr>";
            todosHtml += `
                <tr>
                    <td>${data.todo.title}</td>
                    <td>${data.todo.description}</td>
                    <td>
                        <button onclick="removeTodo('${data.todo.id}')">Delete</button>
                    </td>
                </tr></table>
            `;
            document.querySelector('.todo-by-id').innerHTML = todosHtml;
        });
    });
}

function updateTodo() {
    const todoId = document.querySelector("#update-todo-id").value;
    const todoTitle = document.querySelector("#update-todo-title").value;
    const todoDescription = document.querySelector("#update-todo-description").value;

    fetch(`http://localhost:3000/todos/${todoId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title: todoTitle, description: todoDescription })
    })
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            document.querySelector('.updated_todo').innerHTML = `
            <table border='1'>
                <tr><th>Title</th><th>Description</th><th>Actions</th></tr>
                <tr>
                    <td>${data.updatedTodo.title}</td>
                    <td>${data.updatedTodo.description}</td>
                    <td>
                        <button onclick="removeTodo('${data.updatedTodo.id}')">Delete</button>
                    </td>
                </tr>
            </table>
        `;

            fetchTodos();
        })
}
