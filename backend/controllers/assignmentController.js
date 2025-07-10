/** @format */

import Assignment from "../models/Assignment.js";
import mongoose from "mongoose";
import Teacher from "../models/Teacher.js";

export const createAssignment = async (req, res) => {
  console.log("📎 Received File:", req.file);
  try {
    const { classId, title, description, dueDate } = req.body;
    console.log("📎 Uploaded File:", req.file);
    const teacherId = req.user.id;

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const classObj = teacher.classes.id(classId);
    if (!classObj) return res.status(404).json({ message: "Class not found" });

    const fileUrl = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : null;

    classObj.assignments.push({
      title,
      description,
      dueDate,
      upload: fileUrl,
    });

    await teacher.save();
    console.log("🧾 Assignment Upload URL:", fileUrl);
    console.log("📦 Class Assignments Now:", classObj.assignments);

    res.json({
      message: "Assignment added successfully",
      assignment: classObj.assignments.at(-1),
    });
  } catch (error) {
    console.error("createAssignment error:", error);
    res.status(500).json({ message: "Server error while creating assignment" });
  }
};

export const uploadAssignmentFile = async (req, res) => {
  try {
    const { assignmentId } = req.body;
    const fileUrl = `/uploads/${req.file.filename}`; // if using multer

    // You can store fileUrl in DB or add to assignment inside teacher.classes
    res.json({ message: "File uploaded", url: fileUrl });
  } catch (err) {
    console.error("upload error:", err);
    res.status(500).json({ message: "File upload failed" });
  }
};

export const getAssignmentsForClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const teacher = await Teacher.findById(req.user.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const classObj = teacher.classes.id(classId);
    if (!classObj) return res.status(404).json({ message: "Class not found" });

    res.json(classObj.assignments || []);
  } catch (err) {
    console.error("getAssignmentsForClass error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    const { assignmentId, classId } = req.params;
    const teacher = await Teacher.findById(req.user.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const cls = teacher.classes.id(classId);
    if (!cls) return res.status(404).json({ message: "Class not found" });

    cls.assignments = cls.assignments.filter(
      (a) => a._id.toString() !== assignmentId
    );
    await teacher.save();

    res.json({ message: "Assignment deleted successfully" });
  } catch (err) {
    console.error("deleteAssignment error:", err);
    res.status(500).json({ message: "Server error while deleting assignment" });
  }
};
