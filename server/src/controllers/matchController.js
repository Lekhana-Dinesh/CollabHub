import Project from "../models/Project.js";
import User from "../models/User.js";

function safeUser(userDoc) {
  if (!userDoc) return null;
  return {
    id: userDoc._id.toString(),
    name: userDoc.name,
    email: userDoc.email,
    avatarUrl: userDoc.avatarUrl || "",
    location: userDoc.location || "",
    gender: userDoc.gender || "",
    skills: userDoc.skills || [],
    links: userDoc.links || {},
    xp: userDoc.xp || 0,
    badges: userDoc.badges || [],
    preferences: userDoc.preferences || { categories: [], roles: [] },
    createdAt: userDoc.createdAt,
  };
}

function formatProject(p) {
  return {
    id: p._id.toString(),
    owner: safeUser(p.owner),
    title: p.title,
    description: p.description,
    coverUrl: p.coverUrl || "", // Cloudinary URL now
    tags: p.tags || [],
    techStack: p.techStack || [],
    status: p.status,
    team: (p.team || []).map((m) => ({
      user: safeUser(m.user),
      role: m.role,
      joinedAt: m.joinedAt,
    })),
    rolesNeeded: p.rolesNeeded || [],
    joinRequests: (p.joinRequests || []).map((r) => ({
      id: r._id?.toString?.() || "",
      user: safeUser(r.user),
      message: r.message,
      createdAt: r.createdAt,
      status: r.status,
    })),
    teamMembersRequired: p.teamMembersRequired || 1,
    skillsRequired: p.skillsRequired || [],
    needsTeamMembers: p.needsTeamMembers ?? true,
    needsContributors: p.needsContributors ?? false,
    contributionRequirements: p.contributionRequirements || "",
    metrics: p.metrics || { tasksTotal: 0, tasksDone: 0 },
    createdAt: p.createdAt,
  };
}

export const getSuggestedProjects = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.json([]);
    }

    const me = await User.findById(req.user.id).lean();
    if (!me) return res.json([]);

    const mySkills = (me.skills || []).map((s) => s.toLowerCase());
    const myPrefs = me.preferences || { categories: [], roles: [] };
    const myCategories = (myPrefs.categories || []).map((c) => c.toLowerCase());

    const rawProjects = await Project.find()
      .populate("owner")
      .populate("team.user")
      .populate("joinRequests.user")
      .lean();

    const cleanProjects = rawProjects.filter((p) => {
      if (!p.owner) return false;
      if ((p.team || []).some((m) => !m.user)) return false;
      return true;
    });

    const scored = cleanProjects
      .filter((p) => p.owner && p.owner._id.toString() !== req.user.id.toString())
      .filter((p) => p.status === "OPEN")
      .map((p) => {
        let score = 0;

        const overlapSkills = (p.techStack || []).filter((tech) =>
          mySkills.some((s) => s.includes(String(tech).toLowerCase()))
        ).length;
        score += overlapSkills * 2;

        const overlapCats = (p.tags || []).filter((tag) =>
          myCategories.some((c) => String(tag).toLowerCase().includes(c))
        ).length;
        score += overlapCats;

        score += 1;

        return { p, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((item) => formatProject(item.p));

    return res.json(scored);
  } catch (err) {
    console.error("getSuggestedProjects error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};