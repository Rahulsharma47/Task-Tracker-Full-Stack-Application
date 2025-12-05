import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
    createTask,
    getAllTasks,
    getTask,
    updateTask,
    deleteTask
} from "../controllers/task.controller.js";

const router = Router();

// Protected Routes
router.route("/").post(verifyJWT, createTask);
router.route("/").get(verifyJWT, getAllTasks);
router.route("/:id").get(verifyJWT, getTask);
router.route("/:id").put(verifyJWT, updateTask);
router.route("/:id").delete(verifyJWT, deleteTask);

export default router;
