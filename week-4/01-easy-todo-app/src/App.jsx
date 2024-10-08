import { useEffect, useState } from 'react';
import axios from 'axios';
import TodoForm from './componets/TodoForm.jsx';
import TodoList from './componets/TodoList.jsx';
import './App.css';

function App() {
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        const fetchTodos = () => {
            axios.get('http://localhost:3000/todos')
                .then(res => setTodos(res.data.todos));
        };

        const interval = setInterval(fetchTodos, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleDeleteTodo = (id) => {
        axios.delete(`http://localhost:3000/todos/${id}`).then(() => {
            setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
        });
    };

    return (
        <>
            <TodoForm onAddTodo={() => {}} />
            <TodoList todos={todos} onDelete={handleDeleteTodo} />
        </>
    );
}

export default App;
