import Project from "../models/Project.js";
import User from "../models/User.js";
import Task from "../models/Task.js";
import cloudinary from "../config/cloudinary.js";

// Helper functions (keep your existing ones)
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
    coverUrl: p.coverUrl || "", // Now it's a Cloudinary URL
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

// CREATE PROJECT - Now with Cloudinary
export const createProject = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const ownerId = req.user.id;
    const ownerDoc = await User.findById(ownerId);
    if (!ownerDoc) {
      return res.status(400).json({ message: "Owner user not found" });
    }

    // Handle cover image
    let coverUrl = "";
    if (req.file) {
      // Image was uploaded via multer → already on Cloudinary
      coverUrl = req.file.path; // Cloudinary URL
    } else if (req.body.coverUrl) {
      // Base64 string sent from frontend
      try {
        const uploadResult = await cloudinary.uploader.upload(req.body.coverUrl, {
          folder: 'collabhub/projects',
          transformation: [{ width: 1200, height: 630, crop: 'limit' }],
        });
        coverUrl = uploadResult.secure_url;
      } catch (uploadErr) {
        console.error("Cloudinary upload error:", uploadErr);
        // Continue without image rather than failing
      }
    }

    const project = await Project.create({
      owner: ownerId,
      title: req.body.title,
      description: req.body.description,
      coverUrl: coverUrl, // Cloudinary URL
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

// GET ALL PROJECTS - Fixed (no more base64 bloat)
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("owner")
      .populate("team.user")
      .populate("joinRequests.user")
      .sort({ createdAt: -1 }) // Newest first
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
      coverUrl: p.coverUrl || "", // Cloudinary URL (fast!)
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

// DELETE PROJECT - Fixed to work properly
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
        // Extract public_id from Cloudinary URL
        const publicId = project.coverUrl
          .split('/')
          .slice(-2)
          .join('/')
          .split('.')[0];
        
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryErr) {
        console.error("Failed to delete image from Cloudinary:", cloudinaryErr);
        // Continue with project deletion even if image deletion fails
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