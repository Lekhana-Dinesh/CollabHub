import mongoose from "mongoose";

const TeamMemberSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, default: "Member" },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const RoleNeededSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    count: { type: Number, default: 1 },
  },
  { _id: false }
);

const JoinRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, default: "" },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
      default: "PENDING",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

const ProjectSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },

    coverUrl: { type: String, default: "" },

    tags: {
      type: [String],
      default: [],
    },

    techStack: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["OPEN", "ACTIVE", "COMPLETED"],
      default: "OPEN",
    },

    // who's currently on the team
    team: {
      type: [TeamMemberSchema],
      default: [],
    },

    // roles still needed
    rolesNeeded: {
      type: [RoleNeededSchema],
      default: [],
    },

    // pending requests from users who want to join or contribute
    joinRequests: {
      type: [JoinRequestSchema],
      default: [],
    },

    teamMembersRequired: {
      type: Number,
      default: 1,
    },

    skillsRequired: {
      type: [String],
      default: [],
    },

    needsTeamMembers: {
      type: Boolean,
      default: true,
    },

    needsContributors: {
      type: Boolean,
      default: false,
    },

    contributionRequirements: {
      type: String,
      default: "",
    },

    metrics: {
      tasksTotal: { type: Number, default: 0 },
      tasksDone: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// when deleting a project, also delete its tasks
ProjectSchema.pre("remove", async function (next) {
  await this.model("Task").deleteMany({ projectId: this._id });
  next();
});


const Project = mongoose.model("Project", ProjectSchema);
export default Project;
