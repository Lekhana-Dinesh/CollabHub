import Task from "../models/Task.js";
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

// helper to shape a task for the frontend
function formatTask(taskDoc) {
  return {
    id: taskDoc._id.toString(),
    projectId: taskDoc.projectId.toString(),
    title: taskDoc.title,
    description: taskDoc.description || "",
    status: taskDoc.status,
    assignee: safeUser(taskDoc.assignee),
    dueDate: taskDoc.dueDate || null,
    createdAt: taskDoc.createdAt,
    updatedAt: taskDoc.updatedAt,
  };
}

// recompute and persist project.metrics based on current tasks
async function recalcProjectMetrics(projectId) {
  const tasks = await Task.find({ projectId });

  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "DONE").length;

  await Project.findByIdAndUpdate(projectId, {
    $set: {
      "metrics.tasksTotal": total,
      "metrics.tasksDone": done,
    },
  });
}

// POST /api/tasks
// body: { projectId, title, description }
export const createTask = async (req, res) => {
  try {
    const { projectId, title, description } = req.body;

    // basic validation
    if (!projectId || !title) {
      return res.status(400).json({ message: "projectId and title are required" });
    }

    // create the task
    const task = await Task.create({
      projectId,
      title,
      description: description || "",
      status: "TODO",
    });

    // update project.metrics
    await recalcProjectMetrics(projectId);

    // populate assignee (if any) before returning
    const populated = await Task.findById(task._id).populate("assignee");

    res.status(201).json(formatTask(populated));
  } catch (err) {
    console.error("createTask error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/projects/:projectId/tasks
export const getTasksByProject = async (req, res) => {
  try{
    const { projectId } = req.params;

    const tasks = await Task.find({ projectId })
      .sort({ createdAt: 1 })
      .populate("assignee");

    const formatted = tasks.map(formatTask);
    res.json(formatted);
  } catch(err) {
    console.error("getTasksByProject error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/tasks/:id
// body can include { title, description, status, assignee, dueDate }
export const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    // grab current task first so we can compare status change
    const before = await Task.findById(taskId);
    if (!before) {
      return res.status(404).json({ message: "Task not found" });
    }

    // apply updates
    const allowed = {};
    if (req.body.title !== undefined) allowed.title = req.body.title;
    if (req.body.description !== undefined) allowed.description = req.body.description;
    if (req.body.status !== undefined) allowed.status = req.body.status;
    if (req.body.assignee !== undefined) allowed.assignee = req.body.assignee || null;
    if (req.body.dueDate !== undefined) allowed.dueDate = req.body.dueDate || null;

    const after = await Task.findByIdAndUpdate(taskId, allowed, {
      new: true,
    }).populate("assignee");

    // if status changed or anything that affects metrics, recalc
    if (req.body.status !== undefined && String(before.projectId)) {
      await recalcProjectMetrics(before.projectId);
    }

    res.json(formatTask(after));
  } catch (err) {
    console.error("updateTask error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// (optional, not currently used by frontend)
// DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // keep project.metrics in sync after delete
    await recalcProjectMetrics(task.projectId);

    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("deleteTask error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
