import { useState, useEffect } from 'react';
import { authState } from '../store/authState.ts';
import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';

interface Todo {
    _id: string;
    title: string;
    description: string;
    done?: boolean;
}

const TodoList = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const authStateValue = useRecoilValue(authState);
    const navigate = useNavigate();

    useEffect(() => {
        const getTodos = async () => {
            try {
                const response = await fetch('http://localhost:3000/todo/todos', {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });

                const data: {todos: Todo[]} = await response.json();
                setTodos(data.todos);
            } catch (error) {
                alert('An error occurred while fetching todos. Please try again.');
            }
        };

        getTodos();
    }, [authStateValue.token]);

    const addTodo = async () => {
        try {
            const response = await fetch('http://localhost:3000/todo/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ title, description })
            });

            const data: { savedTodo: Todo } = await response.json();
            setTodos([...todos, data.savedTodo]);
        } catch (error) {
            alert('An error occurred while adding the todo. Please try again.');
        }
    };

    const markDone = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:3000/todo/todos/${id}/done`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            const updatedTodo: Todo  = await response.json();
            setTodos(todos.map((todo) => (todo._id === updatedTodo._id ? updatedTodo : todo)));
        } catch (error) {
            alert('An error occurred while updating the todo. Please try again.');
        }
    };



    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div>
            <div style={{ display: "flex" }}>
                <h2>Welcome {authStateValue.username}</h2>
                <div style={{ marginTop: 25, marginLeft: 20 }}>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </div>
            <h2>Todo List</h2>
            <input
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Title'
            />
            <input
                type='text'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Description'
            />
            <button onClick={addTodo}>Add Todo</button>
            {
                todos.map((todo) => (
                <div key={todo._id}>
                    <h3>{todo.title}</h3>
                    <p>{todo.description}</p>
                    <button onClick={() => markDone(todo._id)}>
                        {todo.done ? 'Done' : 'Mark as Done'}
                    </button>
                </div>
                ))
            }
        </div>
    );
};

export default TodoList;
