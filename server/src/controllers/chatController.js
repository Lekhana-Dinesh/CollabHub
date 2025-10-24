import Message from "../models/Message.js";
import User from "../models/User.js";

// shape user same way frontend expects
function safeUser(u) {
  if (!u) return null;
  return {
    id: u._id.toString(),
    name: u.name,
    email: u.email,
    avatarUrl: u.avatarUrl || "",
    location: u.location || "",
    gender: u.gender || "",
    skills: u.skills || [],
    links: u.links || {},
    xp: u.xp || 0,
    badges: u.badges || [],
    preferences: u.preferences || { categories: [], roles: [] },
    createdAt: u.createdAt,
  };
}

// GET /api/projects/:projectId/chat
export const getChatMessages = async (req, res) => {
  try {
    const { projectId } = req.params;

    const msgs = await Message.find({ projectId })
      .sort({ createdAt: 1 })
      .populate("user");

    const formatted = msgs.map((m) => ({
      id: m._id.toString(),
      projectId: m.projectId.toString(),
      user: safeUser(m.user),
      text: m.text,
      createdAt: m.createdAt,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("getChatMessages error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/projects/:projectId/chat
// body: { text }
export const sendChatMessage = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message text required" });
    }

    const msg = await Message.create({
      projectId,
      user: req.user.id, // from auth middleware
      text,
    });

    const populated = await Message.findById(msg._id).populate("user");

    res.status(201).json({
      id: populated._id.toString(),
      projectId: populated.projectId.toString(),
      user: safeUser(populated.user),
      text: populated.text,
      createdAt: populated.createdAt,
    });
  } catch (err) {
    console.error("sendChatMessage error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
