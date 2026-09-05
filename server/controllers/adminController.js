import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";

const serializeUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

const getBlogFilter = (user) =>
  user.role === "admin" ? {} : { author: user._id };

export const getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find(getBlogFilter(req.user)).sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find({})
      .populate("blog")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const blogFilter = getBlogFilter(req.user);
    const [recentBlogs, blogs, drafts] = await Promise.all([
      Blog.find(blogFilter).sort({ createdAt: -1 }).limit(5),
      Blog.countDocuments(blogFilter),
      Blog.countDocuments({ ...blogFilter, isPublished: false }),
    ]);

    let comments;
    if (req.user.role === "admin") {
      comments = await Comment.countDocuments();
    } else {
      const authorBlogIds = await Blog.find(blogFilter).distinct("_id");
      comments = await Comment.countDocuments({ blog: { $in: authorBlogIds } });
    }

    res.json({
      success: true,
      dashboardData: { blogs, comments, drafts, recentBlogs },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCommentById = async (req, res) => {
  try {
    const { id } = req.body;
    await Comment.findByIdAndDelete(id);
    res.json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const approveCommentById = async (req, res) => {
  try {
    const { id } = req.body;
    await Comment.findByIdAndUpdate(id, { isApproved: true });
    res.json({ success: true, message: "Comment approved successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json({ success: true, users: users.map(serializeUser) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!["user", "author", "admin"].includes(role)) {
      return res.status(400).json({ success: false, message: "Choose a valid role." });
    }

    if (userId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "You cannot change your own role." });
    }

    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    return res.json({ success: true, user: serializeUser(user) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
