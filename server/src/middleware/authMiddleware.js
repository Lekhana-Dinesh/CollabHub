import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function auth(req, res, next) {
  try {
    const headerToken = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null;

    const token = req.cookies?.token || headerToken;
    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userDoc = await User.findById(decoded.id).select("-password");
    if (!userDoc) {
      return res.status(401).json({ message: "User not found for token" });
    }

    // attach a plain object to req.user with an id field
    req.user = {
      id: userDoc._id.toString(),
      ...userDoc.toObject(),
    };

    next();
  } catch (err) {
    console.error("auth error:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
}
