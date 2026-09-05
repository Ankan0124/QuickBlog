import express from "express";
import {
  approveCommentById,
  deleteCommentById,
  getAllBlogsAdmin,
  getAllComments,
  getDashboard,
  getUsers,
  updateUserRole,
} from "../controllers/adminController.js";
import { login } from "../controllers/authController.js";
import auth from "../middleware/auth.js";
import authorize from "../middleware/roles.js";

const adminRouter = express.Router();

// Retained for existing clients; all new screens use /api/auth/login.
adminRouter.post("/login", login);
adminRouter.get("/blogs", auth, authorize("author", "admin"), getAllBlogsAdmin);
adminRouter.get("/dashboard", auth, authorize("author", "admin"), getDashboard);
adminRouter.get("/comment", auth, authorize("admin"), getAllComments);
adminRouter.post("/delete-comment", auth, authorize("admin"), deleteCommentById);
adminRouter.post("/approve-comment", auth, authorize("admin"), approveCommentById);
adminRouter.get("/users", auth, authorize("admin"), getUsers);
adminRouter.post("/users/role", auth, authorize("admin"), updateUserRole);

export default adminRouter;
