import Project from "../models/Project.js";
import User from "../models/User.js";
import Task from "../models/Task.js"; 

// helper: shape user the same way frontend expects
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

// helper: shape project for frontend
function formatProject(projectDoc) {
  const p = projectDoc;
  return {
    id: p._id.toString(),
    owner: safeUser(p.owner),
    title: p.title,
    description: p.description,
    coverUrl: p.coverUrl || "",
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
      id: r._id.toString(),
      user: safeUser(r.user),
      message: r.message,
      createdAt: r.createdAt,
      status: r.status,
    })),
    teamMembersRequired: p.teamMembersRequired,
    skillsRequired: p.skillsRequired || [],
    needsTeamMembers: p.needsTeamMembers,
    needsContributors: p.needsContributors,
    contributionRequirements: p.contributionRequirements || "",
    metrics: p.metrics || { tasksTotal: 0, tasksDone: 0 },
    createdAt: p.createdAt,
  };
}

// POST /api/projects


export const createProject = async (req, res) => {
  try {
    // hard auth guard
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const ownerId = req.user.id;

    // make sure that owner actually exists in DB
    const ownerDoc = await User.findById(ownerId);
    if (!ownerDoc) {
      return res.status(400).json({ message: "Owner user not found" });
    }

    const project = await Project.create({
      owner: ownerId,
      title: req.body.title,
      description: req.body.description,
      coverUrl: req.body.coverUrl || "",
      tags: req.body.tags || [],
      techStack: req.body.techStack || [],
      status: "OPEN",

      team: [
        {
          user: ownerId,
          role: "Owner",
          joinedAt: new Date(),
        },
      ],

      rolesNeeded: req.body.rolesNeeded || [],
      joinRequests: [],

      teamMembersRequired: req.body.teamMembersRequired || 1,
      skillsRequired: req.body.skillsRequired || [],
      needsTeamMembers:
        typeof req.body.needsTeamMembers === "boolean"
          ? req.body.needsTeamMembers
          : true,
      needsContributors:
        typeof req.body.needsContributors === "boolean"
          ? req.body.needsContributors
          : false,
      contributionRequirements: req.body.contributionRequirements || "",

      metrics: {
        tasksTotal: 0,
        tasksDone: 0,
      },
    });

    const populated = await Project.findById(project._id)
      .populate("owner")
      .populate("team.user")
      .populate("joinRequests.user");

    res.status(201).json(formatProject(populated));
  } catch (err) {
    console.error("createProject error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// GET /api/projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .select("-coverUrl") // <-- keep this
      .populate("owner")
      .populate("team.user")
      .populate("joinRequests.user")
      .lean();

    const safeProjects = projects.filter((p) => {
      if (!p.owner) return false;
      if ((p.team || []).some((m) => !m.user)) return false;
      return true;
    });

    // sort newest first, but do it in JS (cheap)
    safeProjects.sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return db - da;
    });

    // now map using the *same* formatProject helper
    const out = safeProjects.map((p) => ({
      id: p._id.toString(),
      owner: {
        id: p.owner._id.toString(),
        name: p.owner.name,
        email: p.owner.email,
        avatarUrl: p.owner.avatarUrl || "",
        location: p.owner.location || "",
        gender: p.owner.gender || "",
        skills: p.owner.skills || [],
        links: p.owner.links || {},
        xp: p.owner.xp || 0,
        badges: p.owner.badges || [],
        preferences: p.owner.preferences || { categories: [], roles: [] },
        createdAt: p.owner.createdAt,
      },
      title: p.title,
      description: p.description,
      coverUrl: "", // intentionally blanked in list view
      tags: p.tags || [],
      techStack: p.techStack || [],
      status: p.status,
      team: (p.team || []).map((m) => ({
        user: {
          id: m.user._id.toString(),
          name: m.user.name,
          email: m.user.email,
          avatarUrl: m.user.avatarUrl || "",
          location: m.user.location || "",
          gender: m.user.gender || "",
          skills: m.user.skills || [],
          links: m.user.links || {},
          xp: m.user.xp || 0,
          badges: m.user.badges || [],
          preferences:
            m.user.preferences || { categories: [], roles: [] },
          createdAt: m.user.createdAt,
        },
        role: m.role,
        joinedAt: m.joinedAt,
      })),
      rolesNeeded: p.rolesNeeded || [],
      joinRequests: (p.joinRequests || []).map((r) => ({
        id: r._id?.toString?.() || "",
        user: r.user
          ? {
              id: r.user._id.toString(),
              name: r.user.name,
              email: r.user.email,
              avatarUrl: r.user.avatarUrl || "",
            }
          : null,
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
    }));

    res.json(out);
  } catch (err) {
    console.error("getProjects error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



// GET /api/projects/:id
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)

      .populate("owner")
      .populate("team.user")
      .populate("joinRequests.user")
      .lean();

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!project.owner) {
      return res.status(404).json({ message: "Project not available" });
    }
    if ((project.team || []).some((m) => !m.user)) {
      return res.status(404).json({ message: "Project not available" });
    }

    res.json(formatProject(project));
  } catch (err) {
    console.error("getProjectById error:", err);
    res.status(500).json({ message: "Server error" });
  }
};




// POST /api/projects/:id/request
// user asks to join or contribute
export const requestJoin = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;
    const { id: projectId } = req.params;

    const project = await Project.findById(projectId)
      .populate("owner")
      .populate("team.user")
      .populate("joinRequests.user");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // don't allow duplicate pending request from same user
    const alreadyPending = project.joinRequests.some(
      (r) => r.user._id.toString() === userId && r.status === "PENDING"
    );
    if (alreadyPending) {
      return res
        .status(400)
        .json({ message: "Request already pending" });
    }

    project.joinRequests.push({
      user: userId,
      message: message || "",
      status: "PENDING",
      createdAt: new Date(),
    });

    await project.save();

    // re-populate so new request's user is populated
    const refreshed = await Project.findById(projectId)
      .populate("owner")
      .populate("team.user")
      .populate("joinRequests.user");

    res.status(201).json(formatProject(refreshed));
  } catch (err) {
    console.error("requestJoin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/projects/:projectId/requests/:requestId/accept
export const acceptJoinRequest = async (req, res) => {
  try {
    const { projectId, requestId } = req.params;

    const project = await Project.findById(projectId)
      .populate("owner")
      .populate("team.user")
      .populate("joinRequests.user");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // only project owner can accept
    if (project.owner._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const request = project.joinRequests.id(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // mark accepted
    request.status = "ACCEPTED";

    // add to team if not already there
    const existsOnTeam = project.team.some(
      (m) => m.user._id.toString() === request.user._id.toString()
    );

    if (!existsOnTeam) {
      project.team.push({
        user: request.user._id,
        role: "Member",
        joinedAt: new Date(),
      });
    }

    await project.save();

    const refreshed = await Project.findById(projectId)
      .populate("owner")
      .populate("team.user")
      .populate("joinRequests.user");

    res.json(formatProject(refreshed));
  } catch (err) {
    console.error("acceptJoinRequest error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/projects/:projectId/requests/:requestId/reject
export const rejectJoinRequest = async (req, res) => {
  try {
    const { projectId, requestId } = req.params;

    const project = await Project.findById(projectId)
      .populate("owner")
      .populate("team.user")
      .populate("joinRequests.user");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.owner._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const request = project.joinRequests.id(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "REJECTED";

    await project.save();

    const refreshed = await Project.findById(projectId)
      .populate("owner")
      .populate("team.user")
      .populate("joinRequests.user");

    res.json(formatProject(refreshed));
  } catch (err) {
    console.error("rejectJoinRequest error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// (optional, not currently used by frontend)


export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. find the project
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 2. check permission: only owner can delete
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 3. delete all tasks for this project
    await Task.deleteMany({ projectId: project._id });

    // 4. delete the project itself
    await Project.findByIdAndDelete(project._id);

    return res.json({ message: "Project deleted" });
  } catch (err) {
    console.error("deleteProject error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


