import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // basic auth info
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // profile / public info
    avatarUrl: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      default: "",
    },

    // skills/tags the user has
    skills: {
      type: [String],
      default: [],
    },

    // social / portfolio links
    links: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      portfolio: { type: String, default: "" },
    },

    // gamification / display stuff
    xp: {
      type: Number,
      default: 0,
    },
    badges: {
      type: [String],
      default: [],
    },

    // what they're interested in (used in onboarding + suggestions)
    preferences: {
      categories: {
        type: [String],
        default: [],
      },
      roles: {
        type: [String],
        default: [],
      },
    },

    // basic role for permissions (optional but you already had it)
    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
