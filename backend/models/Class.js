/** @format */

import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
    title: String,
    description: String,
    videoLink: String,
    createdAt: { type: Date, default: Date.now },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  },
  { _id: true }
);

const Class = mongoose.models.Class || mongoose.model("Class", classSchema);

export default Class;
