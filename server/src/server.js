import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./config/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 4000;

connectDB();
app.get("/", (req, res) => {
  res.send("CollabHub API is running...");
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
