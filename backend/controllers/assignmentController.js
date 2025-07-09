/** @format */

import Assignment from "../models/Assignment.js";
import mongoose from "mongoose";
import Teacher from "../models/Teacher.js";

export const createAssignment = async (req, res) => {
  try {
    const { classId, title, description, dueDate } = req.body;
    const teacherId = req.user.id;

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const classObj = teacher.classes.id(classId);
    if (!classObj) return res.status(404).json({ message: "Class not found" });

    classObj.assignments.push({ title, description, dueDate });
    await teacher.save();

    res.json({
      message: "Assignment added successfully",
      assignment: classObj.assignments.at(-1),
    });
  } catch (error) {
    console.error("createAssignment error:", error);
    res.status(500).json({ message: "Server error while creating assignment" });
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
