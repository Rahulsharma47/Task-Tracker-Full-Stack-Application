import mongoose from "mongoose";
import { User } from "./user.model.js";

const TaskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    duedate: {
        type: Date
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "low"
    },
    status:{
        type: String,
        enum: ["To Do", "In Progress", "Done"],
        default: "To Do"
    }
}, {timestamps: true});

export const Task = mongoose.model('Task', TaskSchema);