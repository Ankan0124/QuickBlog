import express from "express";
import { getCurrentUser, login, register, updateProfile } from "../controllers/authController.js";
import auth from "../middleware/auth.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", auth, getCurrentUser);
authRouter.put("/profile", auth, updateProfile);

export default authRouter;
