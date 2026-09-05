import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import main from "../configs/gemini.js";

const canManageBlog = (blog, user) =>
  user.role === "admin" ||
  (blog.author && blog.author.toString() === user._id.toString());

export const addBlog = async (req, res) => {
  try {
    const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);
    const imageFile = req.file;

    if (!title || !description || !category || !imageFile) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    const response = await imagekit.files.upload({
      file: fs.createReadStream(imageFile.path),
      fileName: imageFile.originalname,
      folder: "/blogs",
    });

    fs.unlinkSync(imageFile.path);

    const image = imagekit.helper.buildSrc({
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
      src: response.filePath,
      transformation: [{ quality: "auto", format: "webp", width: "1280" }],
    });

    await Blog.create({
      title,
      subTitle,
      description,
      category,
      image,
      isPublished,
      author: req.user._id,
    });

    res.json({ success: true, message: "Blog added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true });
    res.json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBlogByID = async (req, res) => {
  try {
    const { blogID } = req.params;
    const blog = await Blog.findOne({ _id: blogID, isPublished: true });

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    res.json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBlogByID = async (req, res) => {
  try {
    const { id } = req.body;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found." });
    }

    if (!canManageBlog(blog, req.user)) {
      return res.status(403).json({ success: false, message: "You can only delete your own blogs." });
    }

    await Blog.findByIdAndDelete(id);
    await Comment.deleteMany({ blog: id });

    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const togglePublish = async (req, res) => {
  try {
    const { id } = req.body;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found." });
    }

    if (!canManageBlog(blog, req.user)) {
      return res.status(403).json({ success: false, message: "You can only change your own blogs." });
    }

    blog.isPublished = !blog.isPublished;
    await blog.save();

    res.json({ success: true, message: "Blog status updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { blog, content } = req.body;

    if (!blog || !content?.trim()) {
      return res.status(400).json({ success: false, message: "A comment is required." });
    }

    await Comment.create({
      blog,
      user: req.user._id,
      name: req.user.name,
      content: content.trim(),
    });

    res.json({ success: true, message: "Comment added for review" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.body;
    const comments = await Comment.find({ blog: blogId, isApproved: true })
      .sort({ createdAt: -1 });

    res.json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    const content = await main(`${prompt} Generate a blog content for this topic in simple text format`);

    res.json({ success: true, content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
