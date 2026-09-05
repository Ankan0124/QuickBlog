import express from "express";
import {
  addBlog,
  addComment,
  deleteBlogByID,
  generateContent,
  getAllBlogs,
  getBlogByID,
  getBlogComments,
  togglePublish,
} from "../controllers/blogController.js";
import upload from "../middleware/multer.js";
import auth from "../middleware/auth.js";
import authorize from "../middleware/roles.js";

const blogRouter = express.Router();

blogRouter.post("/add", auth, authorize("author", "admin"), upload.single("image"), addBlog);
blogRouter.get("/all", getAllBlogs);
blogRouter.get("/:blogID", getBlogByID);
blogRouter.post("/delete", auth, authorize("author", "admin"), deleteBlogByID);
blogRouter.post("/toggle-publish", auth, authorize("author", "admin"), togglePublish);
blogRouter.post("/add-comment", auth, addComment);
blogRouter.post("/comment", getBlogComments);
blogRouter.post("/generate", auth, authorize("author", "admin"), generateContent);

export default blogRouter;
