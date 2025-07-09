/** @format */

// controllers/teacherController.js
import Teacher from "../models/Teacher.js";
import Class from "../models/Class.js";
import Assignment from "../models/Assignment.js";
import Quiz from "../models/Quiz.js";

export const getTeacherDashboard = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const classes = await Class.find({ teacherId });
    const assignments = await Assignment.find({ teacherId });
    const quizzes = await Quiz.find({ teacherId });

    res.json({
      message: "Dashboard data fetched",
      classes,
      assignments,
      quizzes,
    });
  } catch (err) {
    console.error("Error in getTeacherDashboard:", err);
    res.status(500).json({ message: "Server error" });
  }
};
