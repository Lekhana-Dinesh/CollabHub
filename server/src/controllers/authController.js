import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// helper to create JWT
function createToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
}

// helper to strip password field before sending user
function safeUser(userDoc) {
  const { _id, name, email, location, gender, skills, links, xp, badges, preferences, createdAt, avatarUrl } = userDoc;
  return {
    id: _id.toString(),
    name,
    email,
    location: location || "",
    gender: gender || "",
    skills: skills || [],
    links: links || {},
    xp: xp || 0,
    badges: badges || [],
    preferences: preferences || { categories: [], roles: [] },
    createdAt,
    avatarUrl: avatarUrl || ""
  };
}

// REGISTER /api/auth/signup
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    // create user with defaults your frontend expects
    const user = await User.create({
      name,
      email,
      password: hashed,
      skills: [],
      links: {},
      xp: 0,
      badges: [],
      preferences: { categories: [], roles: [] },
    });

    const token = createToken(user._id);

    // also set cookie (optional, for future)
    res
      .cookie("token", token, { httpOnly: true })
      .status(201)
      .json({
        user: safeUser(user),
        token,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid password" });

    const token = createToken(user._id);

    res
      .cookie("token", token, { httpOnly: true })
      .json({
        user: safeUser(user),
        token,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGOUT /api/auth/logout
export const logout = (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
};
