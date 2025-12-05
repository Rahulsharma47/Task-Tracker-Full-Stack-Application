import { Task } from "../models/task.model.js";
import APIError from "../utils/API_Error.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { APIResponse } from "../utils/API_response.js";


// Create Task
export const createTask = asyncHandler(async (req, res) => {
    const { title, description, duedate, priority, status } = req.body;

    if (!title) {
        throw new APIError(400, "Title is required");
    }

    const task = await Task.create({
        user: req.user._id,
        title,
        description,
        duedate,
        priority,
        status,
    });

    return res.status(201).json(
        new APIResponse(201, task, "Task created successfully")
    );
});


// Get all tasks for logged in user
export const getAllTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json(
        new APIResponse(200, tasks, "Tasks fetched successfully")
    );
});


// Get single task
export const getTask = asyncHandler(async (req, res) => {
    const task = await Task.findOne({
        _id: req.params.id,
        user: req.user._id,
    });

    if (!task) {
        throw new APIError(404, "Task not found");
    }

    return res.status(200).json(
        new APIResponse(200, task, "Task fetched successfully")
    );
});


// Update Task
export const updateTask = asyncHandler(async (req, res) => {
    const updates = req.body;

    const updatedTask = await Task.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        updates,
        { new: true }
    );

    if (!updatedTask) {
        throw new APIError(404, "Task not found or unauthorized");
    }

    return res.status(200).json(
        new APIResponse(200, updatedTask, "Task updated successfully")
    );
});


// Delete Task
export const deleteTask = asyncHandler(async (req, res) => {
    const deletedTask = await Task.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
    });

    if (!deletedTask) {
        throw new APIError(404, "Task not found or unauthorized");
    }

    return res.status(200).json(
        new APIResponse(200, null, "Task deleted successfully")
    );
});
