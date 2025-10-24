import User from "../models/User.js";

export const getMe = async (req, res) => {
  try {
    // req.user.id comes from auth middleware
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cleaned = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl || "",
      location: user.location || "",
      gender: user.gender || "",
      skills: user.skills || [],
      links: user.links || {},
      xp: user.xp || 0,
      badges: user.badges || [],
      preferences: user.preferences || { categories: [], roles: [] },
      createdAt: user.createdAt,
    };

    res.json(cleaned);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const { name, skills, links } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { name, skills, links },
      { new: true }
    ).select("-password");

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    const cleaned = {
      id: updated._id.toString(),
      name: updated.name,
      email: updated.email,
      avatarUrl: updated.avatarUrl || "",
      location: updated.location || "",
      gender: updated.gender || "",
      skills: updated.skills || [],
      links: updated.links || {},
      xp: updated.xp || 0,
      badges: updated.badges || [],
      preferences: updated.preferences || { categories: [], roles: [] },
      createdAt: updated.createdAt,
    };

    res.json(cleaned);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // match shape expected by frontend (id not _id)
    const cleaned = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl || "",
      location: user.location || "",
      gender: user.gender || "",
      skills: user.skills || [],
      links: user.links || {},
      xp: user.xp || 0,
      badges: user.badges || [],
      preferences: user.preferences || { categories: [], roles: [] },
      createdAt: user.createdAt,
    };

    res.json(cleaned);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const listUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
