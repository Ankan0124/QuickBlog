import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const sanitizeUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
});

const createToken = (user) =>
  jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

const normalizeEmail = (email = "") => email.trim().toLowerCase();

export const register = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required." });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Use a password with at least 8 characters." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword });

    return res.status(201).json({
      success: true,
      token: createToken(user),
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    let user = await User.findOne({ email }).select("+password");

    // Preserves access for the existing environment-configured administrator.
    if (
      !user &&
      process.env.ADMIN_EMAIL &&
      process.env.ADMIN_PASSWORD &&
      email === normalizeEmail(process.env.ADMIN_EMAIL) &&
      password === process.env.ADMIN_PASSWORD
    ) {
      user = await User.create({
        name: "Administrator",
        email,
        password: await bcrypt.hash(password, 12),
        role: "admin",
      });
      user = await User.findById(user._id).select("+password");
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    return res.json({
      success: true,
      token: createToken(user),
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  return res.json({ success: true, user: sanitizeUser(req.user) });
};

export const updateProfile = async (req, res) => {
  try {
    const name = req.body.name?.trim();

    if (!name) {
      return res.status(400).json({ success: false, message: "A display name is required." });
    }

    req.user.name = name;
    await req.user.save();

    return res.json({ success: true, user: sanitizeUser(req.user) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
