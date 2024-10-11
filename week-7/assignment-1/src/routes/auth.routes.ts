import {Router} from "express";
import {Request, Response} from "express-serve-static-core";
import {jwtAuth} from "../middlewares/auth.middleware.js";
import {User} from "../db/db.js"
import jwt from "jsonwebtoken";

interface IJWPayload {
    _id: string;
}

interface IRequest extends Request {
    user_id: string;
}

const router = Router();

router.post('/signup', async (req: Request, res: Response) => {
    const {username, password} = req.body;

    const existingUser = await User.findOne({username});
    if (existingUser) {
        res.status(403).json({error: "User already exist"});
    } else {
        const newUser = new User({username, password});
        await newUser.save();
        const Secret = process.env.JWT_SECRET || "";
        const token = jwt.sign({id: newUser._id}, Secret, {expiresIn: "1h"});
        res.status(200).send({message: "User created successfully", token});
    }
});

router.post('/login', async (req: Request, res: Response) => {
    const {username, password} = req.body;
    const user = await User.findOne({username, password});
    if (!user) {
        res.status(403).json({error: "Invalid username or password"});
    } else {
        const Secret = process.env.JWT_SECRET || "";
        const payload = user as IJWPayload;
        const token: string = jwt.sign({id: payload._id}, Secret, {expiresIn: "1h"});
        res.status(200).json({message: "Logged in successfully", token});
    }
});

router.get('/me', jwtAuth, async (req: Request, res: Response) => {
    const newReq = req as IRequest;
    const user = await User.findOne({_id: newReq.user_id})
    if (user) {
        res.status(200).json({username: user.username});
    } else {
        res.status(403).json({error: "User not logged in"});
    }
})

export default router;