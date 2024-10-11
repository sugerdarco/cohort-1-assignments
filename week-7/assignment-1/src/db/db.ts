import mongoose, {model, Types } from "mongoose";

interface IUser {
    username: string;
    password: string;
}

interface ITodo {
    title: string;
    description: string;
    done: boolean;
    owner: Types.ObjectId;
}

const userSchema = new mongoose.Schema<IUser>({
    username: {type: String, required: true},
    password: {type: String, required: true},
})

const todoSchema = new mongoose.Schema<ITodo>({
    title: {type: String, required: true},
    description: {type: String, required: true},
    done: {type: Boolean, default: false},
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
})

export const User = model<IUser>("User", userSchema);
export const Todo = model<ITodo>("Todo", todoSchema);