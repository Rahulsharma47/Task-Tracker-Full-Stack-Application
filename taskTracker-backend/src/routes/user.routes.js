import { Router } from 'express';
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    changePassword 
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public Routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// Protected Routes (only logged-in users)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/change-password").post(verifyJWT, changePassword)

export default router;
