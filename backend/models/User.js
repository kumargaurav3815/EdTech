/** @format */

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["teacher", "student"], default: "teacher" },
});

const User = mongoose.model("User", userSchema);

export default User; // ✅ ESM-compatible export
