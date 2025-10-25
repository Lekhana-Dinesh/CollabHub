import Project from "../models/Project.js";
import User from "../models/User.js";

// helper to shape a user for the frontend
function safeUser(userDoc) {
  if (!userDoc) return undefined;
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

// helper to shape a project for the frontend
function safeProject(p) {
  return {
    id: p._id.toString(),
    owner: p.owner
      ? safeUser(p.owner)
      : undefined,
    title: p.title,
    description: p.description,
    coverUrl: p.coverUrl || "",
    tags: p.tags || [],
    techStack: p.techStack || [],
    status: p.status || "OPEN",
    team: p.team || [],
    rolesNeeded: p.rolesNeeded || [],
    joinRequests: p.joinRequests || [],
    teamMembersRequired: p.teamMembersRequired || 1,
    skillsRequired: p.skillsRequired || [],
    needsTeamMembers: p.needsTeamMembers ?? true,
    needsContributors: p.needsContributors ?? false,
    contributionRequirements: p.contributionRequirements || "",
    metrics: p.metrics || { tasksTotal: 0, tasksDone: 0 },
    createdAt: p.createdAt,
  };
}

// GET /api/leaderboard/projects
// return top projects ranked by tasksDone
export const getTopProjects = async (req, res) => {
  try {
    // pull projects with owner populated (so UI can show owner if needed)
    const projects = await Project.find({})
      .populate("owner") // adjust: see below, owner vs leader
      .lean();

    

    // sort by tasksDone desc
    const sorted = projects
      .map((p) => ({
        project: p,
        score: p.metrics?.tasksDone || 0,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    const result = sorted.map((entry, idx) => ({
      project: safeProject(entry.project),
      score: entry.score,
      rank: idx + 1,
    }));

    res.json(result);
  } catch (err) {
    console.error("getTopProjects error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/leaderboard/contributors
// rank users by xp
export const getTopContributors = async (req, res) => {
  try {
    const users = await User.find({}).lean();

    const ranked = users
      .map((u) => ({
        user: u,
        score: u.xp || 0,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((entry, idx) => ({
        user: safeUser(entry.user),
        score: entry.score,
        rank: idx + 1,
      }));

    res.json(ranked);
  } catch (err) {
    console.error("getTopContributors error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
