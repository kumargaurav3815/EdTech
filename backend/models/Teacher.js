/** @format */

import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  createdAt: { type: Date, default: Date.now },
});

const quizSchema = new mongoose.Schema({
  title: String,
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: String,
    },
  ],
});

const classSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    videoLink: String,
    schedule: String,
    enrolledStudents: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    ],
    assignments: [assignmentSchema],
    quizzes: [quizSchema],
  },
  { _id: true, timestamps: true }
);

const teacherSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  classes: [classSchema],
});

export default mongoose.models.Teacher ||
  mongoose.model("Teacher", teacherSchema);
