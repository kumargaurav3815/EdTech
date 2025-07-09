/** @format */

import Quiz from "../models/Quiz.js";
import Teacher from "../models/Teacher.js";
import mongoose from "mongoose";

export const createQuizzes = async (req, res) => {
  try {
    const { classId, title, questions } = req.body;
    const teacherId = req.user.id;

    const newQuiz = {
      title,
      questions, // should be [{ question, options: [...], correctAnswer }]
    };

    const updated = await Teacher.findOneAndUpdate(
      { _id: teacherId, "classes._id": classId },
      { $push: { "classes.$.quizzes": newQuiz } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Class not found" });
    }

    res
      .status(201)
      .json({ message: "Quiz added", class: updated.classes.id(classId) });
  } catch (err) {
    console.error("Quiz creation error:", err);
    res.status(500).json({ message: "Quiz creation failed" });
  }
};

export const getQuizzesForClass = async (req, res) => {
  const { id: classId } = req.params;

  const teacher = await Teacher.findById(req.user.id);
  if (!teacher) return res.status(404).json({ message: "Teacher not found" });

  const classObj = teacher.classes.find(
    (cls) => cls._id.toString() === classId
  );

  if (!classObj) return res.status(404).json({ message: "Class not found" });

  res.json(classObj.quizzes || []);
};
