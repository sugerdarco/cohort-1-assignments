const TodoItem = ({ todo, onDelete }) => {
    return (
        <div>
            <h3>{todo.title}</h3>
            <p>{todo.description}</p>
            <button onClick={() => onDelete(todo.id)}>Delete</button>
        </div>
    );
};

export default TodoItem;
