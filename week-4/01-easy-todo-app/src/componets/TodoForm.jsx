import { useState } from 'react';
import axios from 'axios';

const TodoForm = ({ onAddTodo }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const addNewTodo = () => {
        axios.post('http://localhost:3000/todos',
            {
                title: title,
                description: description,
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(() => {
            setTitle('');
            setDescription('');
            onAddTodo();
        });
    };

    return (
        <div>
            <label>Title</label>
            <input
                className="title"
                type="text"
                placeholder="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            <label>Description</label>
            <input
                className="description"
                type="text"
                placeholder="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
            />
            <button onClick={addNewTodo}>Submit</button>
        </div>
    );
};

export default TodoForm;
