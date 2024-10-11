var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from "express";
import { jwtAuth } from "../middlewares/auth.middleware.js";
import { User } from "../db/db.js";
import jwt from "jsonwebtoken";
const router = Router();
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const existingUser = yield User.findOne({ username });
    if (existingUser) {
        res.status(403).json({ error: "User already exist" });
    }
    else {
        const newUser = new User({ username, password });
        yield newUser.save();
        const Secret = process.env.JWT_SECRET || "";
        const token = jwt.sign({ id: newUser._id }, Secret, { expiresIn: "1h" });
        res.status(200).send({ message: "User created successfully", token });
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield User.findOne({ username, password });
    if (!user) {
        res.status(403).json({ error: "Invalid username or password" });
    }
    else {
        const Secret = process.env.JWT_SECRET || "";
        const payload = user;
        const token = jwt.sign({ id: payload._id }, Secret, { expiresIn: "1h" });
        res.status(200).json({ message: "Logged in successfully", token });
    }
}));
router.get('/me', jwtAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newReq = req;
    const user = yield User.findOne({ _id: newReq.user_id });
    if (user) {
        res.status(200).json({ username: user.username });
    }
    else {
        res.status(403).json({ error: "User not logged in" });
    }
}));
export default router;
