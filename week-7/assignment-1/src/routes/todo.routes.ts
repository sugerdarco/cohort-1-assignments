import {Router} from 'express';
import {Request, Response} from "express-serve-static-core";
import {jwtAuth} from "../middlewares/auth.middleware.js";
import {Todo} from "../db/db.js";

interface IAuthUser extends Request {
    user_id: string;
}

const router = Router();

router.post('/todos', jwtAuth, (req: Request, res: Response) => {
    const {title, description} = req.body;
    const newReq = req as IAuthUser;
    const user_id = newReq.user_id;

    const newTodo = new Todo({title, description, owner: user_id});
    newTodo.save()
        .then((savedTodo) => res.status(201).json({savedTodo}))
        .catch((err) => res.status(500).json({message: "Failed to create new todo", error: err}));
});

router.get('/todos', jwtAuth, (req: Request, res: Response) => {
    const newReq = req as IAuthUser;
    const user_id = newReq.user_id;

    Todo.find({owner: user_id})
        .then((todos) => res.status(200).json({todos}))
        .catch((err) => res.status(500).json({ message: 'Failed to retrieve todos', error: err }));
});

router.patch('/todos/:todoId/done', jwtAuth, (req: Request, res: Response) => {
    const { todoId } = req.params;
    const newReq = req as IAuthUser;
    const user_id = newReq.user_id;

    Todo.findOneAndUpdate({ _id: todoId, owner: user_id }, { done: true }, { new: true })
        .then((updatedTodo) => {
            if (!updatedTodo) {
                return res.status(404).json({ error: 'Todo not found' });
            }
            res.status(200).json(updatedTodo);
        })
        .catch((err) => res.status(500).json({ message: 'Failed to update todo', error: err }));
});

export default router;