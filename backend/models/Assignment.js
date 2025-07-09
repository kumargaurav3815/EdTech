/** @format */

import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
  title: String,
  description: String,
  dueDate: Date,
  createdAt: { type: Date, default: Date.now },
});

const Assignment =
  mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);
export default Assignment;
