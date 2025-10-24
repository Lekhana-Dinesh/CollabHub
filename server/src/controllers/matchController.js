import Project from "../models/Project.js";
import User from "../models/User.js";

// --- helpers copied from projectController style ---

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
    // IMPORTANT: we do NOT include giant base64 here, just ""
    coverUrl: "",

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

// --- controller ---

export const getSuggestedProjects = async (req, res) => {
  try {
    // must be logged in
    if (!req.user || !req.user.id) {
      // frontend is okay with [] if not logged in
      return res.json([]);
    }

    // get logged-in user
    const me = await User.findById(req.user.id).lean();
    if (!me) return res.json([]);

    const mySkills = (me.skills || []).map((s) => s.toLowerCase());
    const myPrefs = me.preferences || { categories: [], roles: [] };
    const myCategories = (myPrefs.categories || []).map((c) =>
      c.toLowerCase()
    );

    // pull projects in a SAFE way:
    // - don't fetch coverUrl (so we don't stream base64 blobs)
    // - minimal populate
    const rawProjects = await Project.find()
      .select("-coverUrl") // <-- THIS IS CRUCIAL
      .populate("owner")
      .populate("team.user")
      .populate("joinRequests.user")
      .lean();

    // filter out obviously broken docs like we do in getProjects
    const cleanProjects = rawProjects.filter((p) => {
      if (!p.owner) return false;
      if ((p.team || []).some((m) => !m.user)) return false;
      return true;
    });

    // score each project against the current user
    const scored = cleanProjects
      // don't show them their own stuff
      .filter(
        (p) => p.owner && p.owner._id.toString() !== req.user.id.toString()
      )
      // focus on OPEN projects only
      .filter((p) => p.status === "OPEN")
      .map((p) => {
        let score = 0;

        // skill overlap: project.techStack vs user.skills
        const overlapSkills = (p.techStack || []).filter((tech) =>
          mySkills.some((s) =>
            s.includes(String(tech).toLowerCase())
          )
        ).length;
        score += overlapSkills * 2;

        // category overlap: project.tags vs user.preferences.categories
        const overlapCats = (p.tags || []).filter((tag) =>
          myCategories.some((c) =>
            String(tag).toLowerCase().includes(c)
          )
        ).length;
        score += overlapCats;

        // tiny bonus for being OPEN
        score += 1;

        return { p, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10) // cap so we don't drown frontend
      .map((item) => formatProject(item.p));

    return res.json(scored);
  } catch (err) {
    console.error("getSuggestedProjects error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
