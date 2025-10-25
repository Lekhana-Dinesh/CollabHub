import Project from "../models/Project.js";
import User from "../models/User.js";
import Task from "../models/Task.js";
import cloudinary from "../config/cloudinary.js";

// Helper functions
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

// CREATE PROJECT - Fixed to handle FormData properly
export const createProject = async (req, res) => {
  try {
    console.log(" Received request body:", req.body);
    console.log(" Received file:", req.file);
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const ownerId = req.user.id;
    const ownerDoc = await User.findById(ownerId);
    if (!ownerDoc) {
      return res.status(400).json({ message: "Owner user not found" });
    }

    // Handle cover image from multer
    let coverUrl = "";
    if (req.file) {
      // Image was uploaded via multer → already on Cloudinary
      coverUrl = req.file.path; // This is the Cloudinary URL
      console.log(" Image uploaded to Cloudinary:", coverUrl);
    } else {
      console.log("x No file uploaded");
    }

    // Parse JSON fields from FormData
    let rolesNeeded = [];
    let skillsRequired = [];
    let techStack = [];
    let tags = [];

    try {
      if (req.body.rolesNeeded) {
        rolesNeeded = JSON.parse(req.body.rolesNeeded);
        console.log(" Parsed rolesNeeded:", rolesNeeded);
      }
      if (req.body.skillsRequired) {
        skillsRequired = JSON.parse(req.body.skillsRequired);
        console.log(" Parsed skillsRequired:", skillsRequired);
      }
      if (req.body.techStack) {
        techStack = JSON.parse(req.body.techStack);
        console.log(" Parsed techStack:", techStack);
      }
      if (req.body.tags) {
        tags = JSON.parse(req.body.tags);
        console.log(" Parsed tags:", tags);
      }
    } catch (parseErr) {
      console.error("x Error parsing JSON fields:", parseErr);
      return res.status(400).json({ message: "Invalid JSON in form fields", error: parseErr.message });
    }

    // Convert string booleans to actual booleans
    const needsTeamMembers = req.body.needsTeamMembers === 'true' || req.body.needsTeamMembers === true;
    const needsContributors = req.body.needsContributors === 'true' || req.body.needsContributors === true;

    console.log(" Creating project with data:", {
      title: req.body.title,
      description: req.body.description,
      coverUrl,
      needsTeamMembers,
      needsContributors
    });

    const project = await Project.create({
      owner: ownerId,
      title: req.body.title,
      description: req.body.description,
      coverUrl: coverUrl, // Cloudinary URL
      tags: tags,
      techStack: techStack,
      status: "OPEN",
      team: [
        {
          user: ownerId,
          role: "Owner",
          joinedAt: new Date(),
        },
      ],
      rolesNeeded: rolesNeeded,
      joinRequests: [],
      teamMembersRequired: parseInt(req.body.teamMembersRequired) || 1,
      skillsRequired: skillsRequired,
      needsTeamMembers: needsTeamMembers,
      needsContributors: needsContributors,
      contributionRequirements: req.body.contributionRequirements || "",
      metrics: {
        tasksTotal: 0,
        tasksDone: 0,
      },
    });

    console.log(" Project created with ID:", project._id);
    console.log(" Project coverUrl:", project.coverUrl);

    const populated = await Project.findById(project._id)
      .populate("owner")
      .populate("team.user")
      .populate("joinRequests.user");

    res.status(201).json(formatProject(populated));
  } catch (err) {
    console.error("x createProject error:", err);
    console.error("x Error stack:", err.stack);
    res.status(500).json({ message: "Server error", error: err.message, stack: err.stack });
  }
};

// GET ALL PROJECTS
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("owner")
      .populate("team.user")
      .populate("joinRequests.user")
      .sort({ createdAt: -1 })
      .lean();

    const safeProjects = projects.filter((p) => {
      if (!p.owner) return false;
      if ((p.team || []).some((m) => !m.user)) return false;
      return true;
    });

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
      coverUrl: p.coverUrl || "",
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
          preferences: m.user.preferences || { categories: [], roles: [] },
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

// GET PROJECT BY ID
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

// REQUEST TO JOIN
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

    const alreadyPending = project.joinRequests.some(
      (r) => r.user._id.toString() === userId && r.status === "PENDING"
    );
    if (alreadyPending) {
      return res.status(400).json({ message: "Request already pending" });
    }

    project.joinRequests.push({
      user: userId,
      message: message || "",
      status: "PENDING",
      createdAt: new Date(),
    });

    await project.save();

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

// ACCEPT JOIN REQUEST
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

    if (project.owner._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const request = project.joinRequests.id(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "ACCEPTED";

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

// REJECT JOIN REQUEST
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

// DELETE PROJECT
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check permission
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Delete cover image from Cloudinary if it exists
    if (project.coverUrl) {
      try {
        const publicId = project.coverUrl
          .split('/')
          .slice(-2)
          .join('/')
          .split('.')[0];
        
        await cloudinary.uploader.destroy(publicId);
        console.log(" Deleted image from Cloudinary:", publicId);
      } catch (cloudinaryErr) {
        console.error("Failed to delete image from Cloudinary:", cloudinaryErr);
      }
    }

    // Delete all tasks
    await Task.deleteMany({ projectId: project._id });

    // Delete project
    await Project.findByIdAndDelete(project._id);

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("deleteProject error:", err);
    res.status(500).json({ message: "Server error" });
  }
};