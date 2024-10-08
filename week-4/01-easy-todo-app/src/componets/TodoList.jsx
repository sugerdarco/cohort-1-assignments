import TodoItem from './TodoItem.jsx';

const TodoList = ({ todos, onDelete }) => {
    return (
        <>
            {todos.map(todo => (
                <TodoItem key={todo.id} todo={todo} onDelete={onDelete} />
            ))}
        </>
    );
};

export default TodoList;
